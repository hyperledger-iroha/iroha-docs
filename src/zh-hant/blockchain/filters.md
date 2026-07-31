---
translation_locale: zh-hant
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 濾網 {#filters}

導事件流程和引發條件.
事件過濾器是 `EventFilterBox`, 能與這些事件家族相匹配:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

使用最窄的濾鏡, 匹配工作流程.
`DataEventFilter::Any` 但它們也使得每個事件都變得更重要.
支付開關或訂閱者匹配費用.

## 數據事件過濾器 {#data-event-filters}

`DataEventFilter` 匹配本帳數據事件.目前的變體包括:

| 變量 | 事件家族 |
| --- | --- |
| `Any` | 任何數據事件 |
| `Peer` | 同行生命周期事件 |
| `Domain` | 域名生命周期和元數據事件 |
| `Account` | 帳戶生命周期,元數據,密碼和身份事件 |
| `Asset` | 資產平衡與元數據事件 |
| `AssetDefinition` | 資產定義生命周期,政策和元數據事件 |
| `Nft` | NFT 生命周期和元數據事件 |
| `Rwa` | 實際的資產生命周期事件 |
| `Trigger` | 引發生命周期和元數據事件 |
| `Role` | 角色生命周期事件 |
| `Configuration` | 在連鎖上發生的配置事件 |
| `Executor` | 執行時間執行器事件 |
| `Proof` | 證據驗證生命周期事件 |
| `Confidential` | 秘密資產事件 |
| `VerifyingKey` | 檢查密钥登記事件 |
| `RuntimeUpgrade` | 執行時間升級事件 |
| `Soradns` | 解決目錄管理事件 |
| `Sorafs` | SoraFS 關鍵碼的遵守事件 |
| `SpaceDirectory` | 空間目錄顯示生命周期事件 |
| `Escrow` | 透明的本地資產托管生命周期事件 |
| `Offline` | 在線決済活動 |
| `Oracle` | 奧拉克爾的營養事件 |
| `Social` | 病毒激勵事件 |
| `Bridge` | 橋活動 |
| `Governance` | 當管理功能啟用時, |

大部分混凝土濾器也允許可選的 ID 這樣的情況也會發生.
例如,一個資產過濾器可以匹配一項資產或一類資產事件,
而子濾鏡可以與子相匹配 ID 還有一個引發事件組.

## 管道過濾器 {#pipeline-filters}

管道過濾器與區塊,交易,合并等處理事件相匹配
請使用它們在運作訂閱,
而不是帳號數據,
其他物體.

## 引發器濾鏡 {#trigger-filters}

引發器存儲其狀態為 `EventFilterBox`. 起的行動也是
店家:

- 一種可執行
- 一項重複政策
- 管理局的帳戶
- 選擇性時間啟動重新試驗政策
- 數據

引發器必須具備執行機所要求的許可.
選擇專屬的技術帳戶,

## 查詢過濾器 {#query-filters}

查詢過濾器與事件過濾器是分離的.
使用查詢特定的打字過濾器, SDK
因此,濾網輸入與查詢輸出類型相匹配.

查看以下內容:

- [事件](/zh-hant/blockchain/events.md)
- [預借本地資產](/zh-hant/blockchain/escrow.md#queries-and-events)
- [引發器](/zh-hant/blockchain/triggers.md)
- [詢問問題](/zh-hant/blockchain/queries.md)
- [查詢參考資料](/zh-hant/reference/queries.md)
