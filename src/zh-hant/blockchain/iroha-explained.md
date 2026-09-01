---
translation_locale: zh-hant
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

- Nexus - 意識配置可以定義多條通道
- 資料空間將工作負載隔離,同時仍然是同一帳本模型的一部分
- 路由政策決定哪個通道和資料空間處理一個型別的工作

## 多資料空間架構 {#multi-dataspace-architecture}

資料空間是一個路由和名稱空間的邊界,而不是一個單獨的區塊鏈.執行階段仍然有一個 `World`,一個交易模型和一個共識管道. Nexus 新增了目錄,告訴節點如何線上條之間進行分割槽工作以及如何命名這些線條服務的資料區域.

在執行時,一個資料空間由數值 `DataSpaceId` 和目錄後設資料表示. `DataSpaceId::UNIVERSAL`被保留為`0`;預設目錄包含`universal`的資料空間.每個配置的資料空間有:

- 一個單獨的數字 ID
- 一個獨特的別名,例如 `universal`, `governance`或 `zk`
- 操作者表面的可選描述
- 用於測量繼電委員會的非零值 `fault_tolerance`

路線是與這些資料空間的執行和儲存路線. `LaneId`, 其他 `DataSpaceId` 它提供了一個別名,可見性 (`public` 或 `restricted`),儲存資料 (`full_replica`, `commitment_only`, 或 `split_replica`),證明方案,以及可選的治理,結算和規劃者後設資料.執行階段從本目錄中得出每條通道儲存幾何,包括 Kura 細分名稱和確定性關鍵前置.

路由路徑是:

1. 配置構建驗證的 `DataSpaceCatalog`,`LaneCatalog`和 `LaneRoutingPolicy`.多條路徑,多個資料空間或非預設路由需要 `nexus.enabled = true`.
2. 交易佇列要求主軌路由器查詢一個 `RoutingDecision` 包含一條 ID 的通道和資料空間 ID.
3. 顯而易見的路由規則可以根據授權主體/帳戶或指令標籤匹配.沒有匹配規則,路由器可以從域名 IDs,資產定義投影,資料空間範圍許可證,結算段或授權主體的繫結帳戶範圍中匯出資料空間.
4. 已解決的路線與兩個目錄進行檢查.未知路徑,未知的資料區和路徑/資料區不匹配是確定性路線錯誤.如果一個交易寫入兩個不同的資料空間目標,則將被拒絕為相互矛盾的路線;跨資料空間 DVP/PVP 結算透過通用協調者通道進行.
5. Sumeragi 和遠端測量將任務視為通道和資料空間活動,後期記錄和承諾快照.

這就是為什麼物件識別器很重要.域名包括資料空間的號在他們的 ID 中,例如 `payments.universal`,因此可以將網域範圍寫入導向.帳戶仍然是規範性和無域名的,因此同一個帳戶可以在不改變其 `AccountId`應用範圍的情況下被繫結到不同的應用範圍.資產定義可以攜帶一個域/資料空間投影,這使得資產操作繼承正確的資料空間路線.

沒有 Nexus 過關,節點使用單條通道和 `universal` 資料空間.捆綁的 SORA 配置檔案取代了三條通道目錄:`core`用於通用公共通道,`governance`用於治理交通,和`zk`用於零知識附加和合同部署交通.

這些三個預設設定存在於分離工作負載類:

|資料空間|萊恩|為什麼它存在?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal`|`core`|為普通公開賬本流量和倒車路由而保留的預設資料空間 (`DataSpaceId::UNIVERSAL == 0`) |
|`governance`|`governance`|用於治理和議會流量的受限通道，使控制層活動不會與一般應用寫入混在一起。|
|`zk`|`zk`|限制對零知識證明,附件和合同部署路由的通道,保持檢測重的工作流程與一般寫入分開. |

只有 `universal` 是保留的基線. `governance` 和 `zk` 在捆綁目錄和路由政策中編碼 SORA 配置檔案選項;運營商在需要不同的資料空間界限時可以定義不同的目錄.

Sumeragi 始終使用資料可用性和可靠的廣播.這些路徑是 Iroha 3 共識協議的一部分,不能被部署配置檔案禁用.

執行階段行為由設定檔和鏈上參數決定。環境變數不能用作正式環境中的功能開關。

## 下一篇閱讀 {#read-next}

- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md)
- [世界, WSV 和 Kura 儲存](/zh-hant/blockchain/world.md)
- [創世記引用](/zh-hant/reference/genesis.md)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
