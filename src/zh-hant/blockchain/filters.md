---
translation_locale: zh-hant
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 過器 {#filters}

目前的最高級別事件過器是 `EventFilterBox`,可以匹配這些事件家族:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

使用與工作流程相匹配的最窄的過器. `DataEventFilter::Any`等寬過器對於診斷有用,但它們使每個事件都支付了觸發或訂閱者匹配的成本.

## 數據事件過器 {#data-event-filters}

`DataEventFilter`與本書數據事件相匹配.其當前的變體包括:

|變量|事件家族|
| --- | --- |
|`Any`|任何數據事件|
|`Peer`|同行生命週期事件|
|`Domain`|域的生命週期和元數據事件|
|`Account`|賬戶生命週期,元數據,號和身份事件|
|`Asset`|資產平衡和元數據事件 |
|`AssetDefinition`|資產定義生命週期,政策和元數據事件|
|`Nft`|NFT 生命週期和元數據事件 |
|`Rwa`|現實世界資產生命週期事件|
|`Trigger`|觸發生命週期和元數據事件|
|`Role`|角色生命週期事件|
|`Configuration`|鏈上配置事件|
|`Executor`|運行時間執行器事件|
|`Proof`|證據驗證生命週期事件|
|`Confidential`|機密資產事件|
|`VerifyingKey`|驗證密鑰登記事件|
|`RuntimeUpgrade`|運行時間升級事件|
|`Soradns`|解決目錄管理事件|
|`Sorafs`|SoraFS 門戶合規事件|
|`SpaceDirectory`|空間目錄表現生命週期事件|
|`Escrow`|透明的本地資產託管生命週期事件 |
|`Offline`|線下結算活動|
|`Oracle`|Oracle的源事件|
|`Social`|病毒激勵活動|
|`Bridge`|橋樑活動|
|`Governance`|管理功能啓用時的治理事件 |

大多數混凝土過器還允許可選的 ID 匹配器和事件設置面具.例如,資產過器可以匹配一個資產或一類資產事件,而觸發器過器則可以匹配觸發器 ID 和觸發事件集.

## 管道過器 {#pipeline-filters}

管道過器與區塊,交易,合併和見證事件等處理事件相匹配.使用它們用於運營訂閱,區塊處理儀表板以及反應於管道狀態而不是本書數據對象的觸發器.

## 觸發器過器 {#trigger-filters}

觸發器存儲其狀態爲 `EventFilterBox`.觸發器操作還存儲:

- 一個可執行的
- 一項重複政策
- 一個權威賬戶
- 可選的時間觸發器重試政策
- 超級數據

發動機必須具備可執行器所需的權限. 優先考慮專用技術賬戶,而不是長期發動機.

## 查詢過器 {#query-filters}

查詢過器與事件過器分開.可回覆的查詢可以暴露預示和選擇器支持.使用來自 SDK 的查詢特定類型的過器,以便過器輸入匹配查詢輸出類型.

此外,請參見:

- [事件](/zh-hant/blockchain/events.md)
- [產業資產保證](/zh-hant/blockchain/escrow.md#queries-and-events)
- [觸發器](/zh-hant/blockchain/triggers.md)
- [查詢](/zh-hant/blockchain/queries.md)
- [查詢參考](/zh-hant/reference/queries.md)
