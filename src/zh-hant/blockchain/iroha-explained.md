---
translation_locale: zh-hant
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 426adbea88da36cd92da17d8665c956a57b9d4cebfa0d2f35bc75469cccf84ee
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 解釋 {#iroha-explained}

Iroha 3 是首次釋出的 Hyperledger Iroha 平臺.同一個核心支援自主託管網路和 SORA Nexus 資料空間和多行道路由執行模型.

## 核心建築物 {#core-building-blocks}

- `iroha3d` 運營對等節點
- Torii 是客戶端和運營商門口
- Sumeragi 處理共識
- **Norito** 是[規範二進位格式](/zh-hant/reference/norito.md)
- IVM 執行行動式智慧合同和位元組碼
- Kotodama 將高層 `.ko`合同編譯成 IVM `.to`位元組碼.
- Kagami 準備鑰匙,創世,個人資料和區域網
- **SORA Nexus 服務層**加入 Soracloud、Inrou、SoraNet、SoraFS 和 SoraDNS，用於應用程式託管、隱私傳輸、儲存和命名。

## 執行模式 {#execution-model}

每個世界狀態的變化都是透過交易發生的.交易包含指令或 IVM 位元組碼,並且 Torii 是客戶提交或觀察它們的主要方式.的效果.

- 資料空間為機構資料、權限、政策與應用程式提供環境
- 通道在這些環境中提供路由與認證容量
- 獨立簽署的資料空間根擁有自己的狀態與本地最終性

## 資料空間與執行根 {#multi-dataspace-architecture}

資料空間目錄項目定義環境及其身分，單靠目錄項目並不會建立獨立的執行根。公開通道認證交易批次，供全域鏈執行；獨立簽署的資料空間根則擁有自己的狀態、委員會與本地最終性。

`DataSpaceCatalog` 定義資料空間，`LaneCatalog` 則定義通道。每個通道透過 `dataspace_id` 恰好參照一個資料空間；一個資料空間可包含多個通道。`DataSpaceId` 與 `LaneId` 是不同的身分，而通道別名不會建立另一個資料空間。

在執行時，資料空間以數值 `DataSpaceId` 和目錄中繼資料表示。`DataSpaceId::UNIVERSAL` 保留為 `0`；預設目錄包含 `universal` 資料空間。每個已設定的資料空間都有：

- 一個單獨的數字 ID
- 唯一別名，例如 `universal` 或明確登記的機構名稱
- 操作者表面的可選描述
- 用於測量繼電委員會的非零值 `fault_tolerance`

通道是綁定到這些資料空間的路由與認證資源。通道項目包含 `LaneId`、所服務的 `DataSpaceId`、別名、可見性（`public` 或 `restricted`）、儲存設定檔（`full_replica`、`commitment_only` 或 `split_replica`）、證明機制，以及選用的治理、結算與排程器中繼資料。執行環境依據此目錄衍生各通道的儲存配置，包括 Kura 區段名稱與確定性金鑰前綴。

路由路徑是:

1. 設定程序建立經驗證的 `DataSpaceCatalog`、`LaneCatalog` 與 `LaneRoutingPolicy`。SORA Nexus 路由是必要機制。多個資料空間、多個通道或非預設路由會使用 SORA Nexus 設定檔（`--sora`）與 NPoS。
2. 交易佇列根據交易與已提交狀態解析出 `RoutingPlan`。每個協調者或參與者路由都包含通道 ID 與資料空間 ID；Native AMX 計畫會保留完整的參與者集合。
3. 在全域執行中，完整控制平面批次及跨資料空間協調者使用通道 `0`。具體的非通用指令目標或合約位址目標，會先選取已准入且資料空間與委員會相符的固定通道，再考慮帳戶或指令標籤規則。其他工作遵循已提交的明確規則及預設分片方式；具體的通用目標仍留在通用通道上。
4. 每條路由都會對照目錄與活動通道狀態進行檢查。未知 ID、通道與資料空間不符的情況都會遭到拒絕；無法使用的私有目標不能改以通用執行處理。多個資料空間目標可能產生 Native AMX 計畫。若交易中繼資料 `amx_policy` 設為 `reject_cross_dataspace`，跨資料空間計畫就會被拒絕。僅有路由計畫，並不足以授權或完成跨獨立根的結算。
5. Sumeragi 與遙測會以通道及資料空間的活動、待處理工作量與承諾快照，持續呈現這些指派。

這正是物件識別碼重要的原因。網域 ID 包含資料空間別名，例如 `payments.universal`，讓網域範圍內的寫入操作可以路由。帳戶仍採用不含網域的標準身分，因此同一帳戶可以綁定到不同應用程式範圍，而不必更改 `AccountId`。資產定義可攜帶網域與資料空間投影，使資產操作沿用正確的資料空間路由。

若沒有 SORA Nexus 覆寫設定，節點會使用單一通道與 `universal` 資料空間。隨附的 SORA Nexus 設定檔會改用三通道目錄：`core` 是通用公開通道，`governance` 用於治理流量，`zk` 用於零知識附件與合約部署流量。

這三個隨附通道都是公開通道，並參照同一個 `universal` 資料空間。它們用來區分工作負載類別：

| 資料空間 | 通道 | 用途 |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | 一般公開帳本流量與預設路由。 |
| `universal` | `governance` | 公開治理與 SORA 議會流量。 |
| `universal` | `zk` | 處理公開零知識附件及合約部署所產生的流量。 |

`DataSpaceId::UNIVERSAL == 0` 是保留的基準值。上述 `governance` 與 `zk` 名稱識別的是通道，而不是獨立資料空間。不同機構邊界需要明確的資料空間項目；獨立執行還需要經過獨立驗證的根。

這些關係由固定版本的[設定檔建構器](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs)、[通道實作](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs)及[獨立根規範](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md)所確定。

Sumeragi 始終使用資料可用性和可靠的廣播.這些路徑是 Iroha 3 共識協議的一部分,不能被部署配置檔案禁用.

執行階段行為由設定檔和鏈上參數決定。環境變數不能用作正式環境中的功能開關。

## 下一篇閱讀 {#read-next}

- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md)
- [世界, WSV 和 Kura 儲存](/zh-hant/blockchain/world.md)
- [創世記引用](/zh-hant/reference/genesis.md)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
