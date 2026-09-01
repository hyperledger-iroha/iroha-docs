---
translation_locale: zh-hant
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 過濾器 {#filters}

過濾器可縮小事件串流和觸發條件的範圍。目前的頂層事件過濾器是 `EventFilterBox`，可比對下列事件系列：

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

使用與工作流程相匹配的最窄的過濾器. `DataEventFilter::Any`等寬過濾器對於診斷有用,但它們使每個事件都支付了觸發或訂閱者匹配的成本.

## 資料事件過濾器 {#data-event-filters}

`DataEventFilter`與帳本資料事件相匹配.其當前的變體包括:

|變數|事件家族|
| --- | --- |
|`Any`|任何資料事件|
|`Peer`|對等節點生命週期事件|
|`Domain`|域的生命週期和後設資料事件|
|`Account`|帳戶生命週期,後設資料,號和身份事件|
|`Asset`|資產餘額和後設資料事件 |
|`AssetDefinition`|資產定義生命週期,政策和後設資料事件|
|`Nft`|NFT 生命週期和後設資料事件 |
|`Rwa`|現實世界資產生命週期事件|
|`Trigger`|觸發生命週期和後設資料事件|
|`Role`|角色生命週期事件|
|`Configuration`|鏈上配置事件|
|`Executor`|執行階段執行器事件|
|`Proof`|證明驗證生命週期事件|
|`Confidential`|機密資產事件|
|`VerifyingKey`|驗證金鑰登記事件|
|`RuntimeUpgrade`|執行階段升級事件|
|`Soradns`|解決目錄管理事件|
|`Sorafs`|SoraFS 門戶合規事件|
|`SpaceDirectory`|空間目錄表現生命週期事件|
|`Escrow`|透明的本地資產託管生命週期事件 |
|`Offline`|線下結算活動|
|`Oracle`|Oracle的源事件|
|`Social`|病毒激勵活動|
|`Bridge`|橋樑活動|
|`Governance`|管理功能啟用時的治理事件 |

大多數具體篩選器還允許可選的 ID 匹配器和事件設定面具.例如,資產過濾器可以匹配一個資產或一類資產事件,而觸發器過濾器則可以匹配觸發器 ID 和觸發事件集.

## 管道過濾器 {#pipeline-filters}

管道過濾器與區塊,交易,合併和見證事件等處理事件相匹配.使用它們用於運營訂閱,區塊處理儀錶板以及反應於管道狀態而不是帳本資料物件的觸發器.

## 觸發器過濾器 {#trigger-filters}

觸發器儲存其狀態為 `EventFilterBox`.觸發器操作還儲存:

- 一個可執行的
- 一項重複政策
- 一個授權主體帳戶
- 可選的時間觸發器重試政策
- 超級資料

發動機必須具備可執行器所需的許可權. 優先考慮專用技術帳戶,而不是長期發動機.

## 查詢過濾器 {#query-filters}

查詢過濾器與事件過濾器分開.可迭代查詢可以提供述詞和選擇器支援.使用來自 SDK 的查詢特定型別的過濾器,以便過濾器輸入匹配查詢輸出型別.

此外,請參見:

- [事件](/zh-hant/blockchain/events.md)
- [產業資產保證](/zh-hant/blockchain/escrow.md#queries-and-events)
- [觸發器](/zh-hant/blockchain/triggers.md)
- [查詢](/zh-hant/blockchain/queries.md)
- [查詢參考](/zh-hant/reference/queries.md)
