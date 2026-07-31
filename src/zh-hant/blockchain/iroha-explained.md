---
translation_locale: zh-hant
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 已解釋 {#iroha-explained}

Iroha 3 是首次發行的 Hyperledger Iroha 該平台是相同的核心.
支持自主托管的網路, SORA Nexus 對數據的執行模式
空間和多行徑路由.

## 核心建築物 {#core-building-blocks}

- **`irohad`** 經營同行
- **Torii** 是客戶端和運營者門口
- **Sumeragi** 處理共識
- **Norito** 這是 [常識二元格式](/zh-hant/reference/norito.md)
- **IVM** 執行可隨身智能合約和字體代碼
- **Kotodama** 編輯高級 `.ko` 請問有沒有 IVM `.to` 字體代碼
- **Kagami** 準備關鍵,基因,配置文件和局域網
- **SORA Nexus 服務飛機** 加入 Soracloud, 在內魯, SoraNet, SoraFS, 及其他
  SoraDNS 對應用程式托管,隱私運輸,儲存和命名

## 執行模式 {#execution-model}

改變世界狀況仍是透過交易.
交易包含指令或 IVM 字體碼,以及 Torii 這是主要的方法.
客戶提交或觀察其影響.

- Nexus- 認識的配置可以定義多條車道
- 數據空間將工作負荷隔離,同時仍是同一帳號模型的一部分
- 路由策略決定哪個行徑和數據空間處理一類工作

## 多數資料空間架構 {#multi-dataspace-architecture}

數據空間是路由與名稱空間的界限,
運行時間仍有一個 `World`, 一種交易模式和一項共識
這裡是道. Nexus 加入列表,告訴節點如何進行分區工作
如何命名這些行徑服務的數據區域.

在運行時,一個數據空間由數字表示 `DataSpaceId` 及其他
數據表格. `DataSpaceId::UNIVERSAL` 保留為 `0`; 預設情況
這份目錄包含 `universal` 每個配置的數據區域都有:

- 獨特的數字 ID
- 獨特的名稱,例如 `universal`, `governance`, 或是 `zk`
- 操作者表面的可選描述
- 沒有零 `fault_tolerance` 使用以測量接線委員會的價值

列線是與這些數據庫的執行和儲存路徑.
路線入口帶著A `LaneId`, 這項政策 `DataSpaceId` 這是一種假名,
顯示性 (`public` 或是 `restricted`),存儲配置 (`full_replica`,
`commitment_only`, 或是 `split_replica`),證明方案,以及可選
執行時間取出於
這項目錄中每條車道存儲幾何學,包括 Kura 區域名稱
沒有任何決定性關鍵字.

路由之道是:

1. 配置建立了已核實的 `DataSpaceCatalog`, `LaneCatalog`, 及其他
   `LaneRoutingPolicy`. 多條路線,多個數據區域或非預設
   路由要求 `nexus.enabled = true`.
2. 交易排隊要求主線路由器提供
   `RoutingDecision` 包含一條車道 ID 以及數據空間 ID.
3. 明確的路由規則可以按權力/帳戶或指示匹配
   如果沒有相匹配的規則,
   域名 IDs, 預測資產定義,數據空間範圍的許可,
   或是該機構的帳戶範圍.
4. 該路線的檢查與兩份目錄相對.
   不知名的數據區域和行徑/數據空間不一致是決定性的
   如果交易寫到兩個不同的數據空間,
   目標,它被拒絕為矛盾的路線; DVP/PVP
   解決方式是通用协调者路線.
5. Sumeragi 且遠隔測量使該任務可視於行徑和資料空間
   活動,後續集和承諾的快照.

這就是為什麼對象識別子很重要.
在他們的 ID, 例如: `payments.universal`, 這樣域範圍的寫作可以
帳戶仍然是法規的,沒有域名,
沒有改變其應用範圍,
`AccountId`. 資產定義可以包含域/數據空間投影,
這讓資產運作繼承正確的數據空間路線.

沒有 Nexus 接下來,這個節點使用單條車道, `universal`
數據空間. SORA 這樣的形象將會被三條車道所取代.
資料庫: `core` 對於通用公共車道, `governance` 治理
交通,以及 `zk` 對零知識的附加和合同部署
沒有交通工具.

這些三個默認存在於分別工作負荷類:

| 數據空間    | 這裡有許多人         | 為什麼它存在                                                                                                                                       |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       | 預設的數據空間 (`DataSpaceId::UNIVERSAL == 0`) 對於普通公共帳簿流量和回路運行.                                 |
| `governance` | `governance` | 沒有任何限制的路徑,                      |
| `zk`         | `zk`         | 限制對零知識證據,附件和合同部署路由的行徑, 以保持證據重的工作流程與正常寫作分離. |

只有 `universal` 是預留的基線. `governance` 及其他 `zk` 是 SORA
在捆綁的目錄和路由政策中編碼的配置文件選擇;
當他們需要不同的數據空間時,
沒有任何限制.

Sumeragi 這些路徑是使用數據可用性和可靠的廣播.
該部分 Iroha 3 並不能被部署禁用
這樣的情況

執行時間行為源自配置檔案和連鎖參數.
環境變量不是產品特點門.

## 接下來閱讀 {#read-next}

- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [發射 Iroha 3](/zh-hant/get-started/launch-iroha.md)
- [這樣的世界, WSV, 及其他 Kura 儲存](/zh-hant/blockchain/world.md)
- [創世記的參考](/zh-hant/reference/genesis.md)
- [Torii 目的地](/zh-hant/reference/torii-endpoints.md)
