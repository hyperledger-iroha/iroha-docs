---
translation_locale: zh-hant
translation_source: /blockchain/triggers.md
translation_source_hash: 726e2998ec1439138ef94d3a702049731ce2432f5c52a723ed0c92593de41c1e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 觸發器 {#triggers}

觸發器將事件過器綁定到可執行的操作. 當事件與觸發器的過器匹配時, Iroha 將觸發器操作作爲區塊執行的一部分進行評估.

## 結構 {#structure}

已註冊的 `Trigger` 包含:

- `id`:一個`TriggerId`包裝一個 `Name`
- `action`:可執行,權威,過器,重複政策,重新嘗試政策和元數據

該行動包括:

- `executable`: `Instructions`,`ContractCall`, `Ivm`或 `IvmProved`
- `repeats`: `Indefinitely`或`Exactly(n)`
- `authority`:指引可執行的賬戶
- `filter`:一個 `EventFilterBox`
- `retry_policy`:規定的時間觸發器的可選重新試驗行爲
- `metadata`:任意的觸發器元數據

## 事件過器 {#event-filters}

觸發器條件使用與訂閱相同的事件過模型.最高級事件過器可以匹配:

- 管道事件
- 數據事件
- 時間事件
- 觸發執行事件
- 觸發完成事件

最適合工作流程的最小過器. 寬過器對於診斷有用,但它們在區塊執行過程中增加工作.

目前的過器家庭見 [過器](/zh-hant/blockchain/filters.md).

## 時間觸發器 {#time-triggers}

時間觸發器使用時間事件過器.當世界狀態視圖達到匹配的時間條件時, Iroha 會在觸發器權限下執行觸發器操作.時間觸發程序是可以使用下面描述的重試政策的觸發器類型.

## 重複 {#repetition}

`Repeats::Indefinitely`將觸發器保持活躍,直到它沒有註冊.

`Repeats::Exactly(n)` 讓觸發器射出一定數次. 當數量是如果再次需要同樣的行爲,請註冊一個新的觸發.

## 權威和許可證 {#authority-and-permissions}

引發權力是用來調用可執行的帳戶.用專用的技術帳戶來實現長壽命的觸發器,許可證是明確的,並從運營商個人帳戶中隔離.

當局需要執行指令或合同調用所要求的權限. 註冊觸發器的帳戶還需要在活躍運行時間驗證器下注冊觸發符的許可.

### 數據觸發器的範圍和容量 {#data-trigger-scope-and-capacity}

一個普通的數據觸發器必須將其過器綁定到其觸發權所有的一個確切主體. 賬戶過器必須命名該確切帳戶.資產,資產定義,域名, NFT, RWA,並且觸發過器也必須指定該機構擁有的確切實體. `Any`,一個無關匹配者,外國主體以及系統或治理事件家族不是普通的賬戶掃描觸發器.

只有議會才能授予 `CanRegisterGlobalDataTrigger`.該補貼直接存儲在一個準確的賬戶上,名稱與同樣的準確的觸發權限,並且可以通過同樣的議會生命週期.它不會通過角色繼承,並且不放棄 `CanRegisterTrigger` 當一個賬戶註冊另一個機構的觸發器時.

共識允許一個機構最多有64個數據觸發器和全球4,096個數據觸動器.精確的主題和事件家庭索引以正宗標識器順序選擇候選人.一個產生的交易可能會導致最多256次數據觸發器發射,包括.每個索引過器檢查,發射,本土指令和 VM 指令都消耗相同的塊氣體預算.

觸發器執行與發射相匹配事件的交易是原子性的.如果已授權的觸發器故障,超過其射擊或執行深度限制,或者排氣,Iroha 將觸發效應和原始交易都推翻.

## 複試政策 {#retry-policy}

時間觸發器可以選擇重試政策. 重試政策設置:

- `max_retries`:在初次失敗發射後,允許多次重試.
- `retry_after_ms`:Iroha 在重新試驗獲得資格之前等待多長時間

當重新嘗試的預算耗盡時,觸發器不註冊.

## 問題 {#queries}

使用當前的觸發器查詢檢查觸發狀態:

- [`FindTriggers`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)

此外,請參見:

- [事件觸發器示例](/zh-hant/blockchain/trigger-examples.md)
- [事件](/zh-hant/blockchain/events.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證](/zh-hant/blockchain/permissions.md)
