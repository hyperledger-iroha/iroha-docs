---
translation_locale: zh-hant
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 解釋 {#iroha-explained}

Iroha 3 是首次發佈的 Hyperledger Iroha 平臺.同一個核心支持自主託管網絡和 SORA Nexus 數據空間和多行道路由執行模型.

## 核心建築物 {#core-building-blocks}

- `irohad` 運營同行
- Torii 是客戶端和運營商門口
- Sumeragi 處理共識
- Norito 是[法定二進制格式](/zh-hant/reference/norito.md)
- IVM 運行便攜式智能合同和字節碼
- Kotodama 將高層 `.ko`合同編譯成 IVM `.to`字節碼.
- Kagami 準備鑰匙,基因,個人資料和局域網
- SORA Nexus 服務飛機添加 Soracloud,Inrou, SoraNet, SoraFS 和 SoraDNS 用於應用程序託管,隱私運輸,存儲和命名.

## 執行模式 {#execution-model}

每個世界狀態的變化都是通過交易發生的.交易包含指令或 IVM 字節碼,並且 Torii 是客戶提交或觀察它們的主要方式.的效果.

- Nexus - 意識配置可以定義多條車道
- 數據空間將工作負載隔離,同時仍然是同一本書模型的一部分
- 路由政策決定哪個行徑和數據空間處理一個類型的工作

## 多數據空間架構 {#multi-dataspace-architecture}

數據空間是一個路由和命名空間的邊界,而不是一個單獨的區塊鏈.運行時間仍然有一個 `World`,一個交易模型和一個共識管道. Nexus 添加了目錄,告訴節點如何在線條之間進行分區工作以及如何命名這些線條服務的數據區域.

在運行時,一個數據空間由數值 `DataSpaceId` 和目錄元數據表示. `DataSpaceId::UNIVERSAL`被保留爲`0`;默認目錄包含`universal`的數據空間.每個配置的數據空間有:

- 一個單獨的數字 ID
- 一個獨特的姓氏,例如 `universal`, `governance`或 `zk`
- 操作者表面的可選描述
- 用於測量繼電委員會的非零值 `fault_tolerance`

路線是與這些數據庫的執行和存儲路線. `LaneId`, 其他 `DataSpaceId` 它提供了一個別名,可見性 (`public` 或 `restricted`),存儲資料 (`full_replica`, `commitment_only`, 或 `split_replica`),證明方案,以及可選的治理,結算和規劃者元數據.運行時間從本目錄中得出每條車道存儲幾何,包括 Kura 細分名稱和確定性關鍵前置.

路由路徑是:

1. 配置構建驗證的 `DataSpaceCatalog`,`LaneCatalog`和 `LaneRoutingPolicy`.多條路徑,多個數據空間或非默認路由需要 `nexus.enabled = true`.
2. 交易隊列要求主軌路由器查詢一個 `RoutingDecision` 包含一條 ID 的車道和數據空間 ID.
3. 顯而易見的路由規則可以根據權威/帳戶或指令標籤匹配.沒有匹配規則,路由器可以從域名 IDs,資產定義預測,數據空間範圍許可證,結算腳本或權威的綁定賬戶範圍中導出數據空間.
4. 已解決的路線與兩個目錄進行檢查.未知路徑,未知的數據區和路徑/數據區不匹配是確定性路線錯誤.如果一個交易向兩個不同的數據空間目標寫信,則將被拒絕爲相互矛盾的路線;跨數據空間 DVP/PVP 結算通過通用協調者軌道進行.
5. Sumeragi 和遠程測量將任務視爲軌道和數據空間活動,後期記錄和承諾快照.

這就是爲什麼對象識別器很重要.域名包括數據空間的號在他們的 ID 中,例如 `payments.universal`,因此可以將域名擴展的寫字導向.賬戶仍然是規範性和無域名的,因此同一個帳戶可以在不改變其 `AccountId`應用範圍的情況下被綁定到不同的應用範圍.資產定義可以攜帶一個域/數據空間投影,這使得資產操作繼承正確的數據空間路線.

沒有 Nexus 過關,節點使用單條車道和 `universal` 數據空間.捆綁的 SORA 配置文件取代了三條車道目錄:`core`用於通用公共車道,`governance`用於治理交通,和`zk`用於零知識附加和合同部署交通.

這些三個默認設置存在於分離工作負載類:

|數據空間|萊恩|爲什麼它存在?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal`|`core`|爲普通公開賬本流量和倒車路由而保留的默認數據空間 (`DataSpaceId::UNIVERSAL == 0`) |
|`governance`|`governance`|限制管理和議會流量,因此控制平面活動不與一般應用書籍混合.|
|`zk`|`zk`|限制對零知識證明,附件和合同部署路由的行徑,保持檢測重的工作流程與正常寫作分開. |

只有 `universal` 是保留的基線. `governance` 和 `zk` 在捆綁目錄和路由政策中編碼 SORA 配置文件選項;運營商在需要不同的數據空間界限時可以定義不同的目錄.

Sumeragi 始終使用數據可用性和可靠的廣播.這些路徑是 Iroha 3 共識協議的一部分,不能被部署配置文件禁用.

運行時間行爲來源於配置文件和鏈上參數.環境變量不是生產特徵門.

## 下一篇閱讀 {#read-next}

- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [發射 Iroha 3](/zh-hant/get-started/launch-iroha.md)
- [世界, WSV 和 Kura 存儲](/zh-hant/blockchain/world.md)
- [創世記引用](/zh-hant/reference/genesis.md)
- [Torii 終端點](/zh-hant/reference/torii-endpoints.md)
