---
translation_locale: zh-hant
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 觸發器 {#triggers}

觸發器將事件過濾器繫結到可執行的操作. 當事件與觸發器的過濾器匹配時, Iroha 將觸發器操作作為區塊執行的一部分進行評估.

## 結構 {#structure}

已註冊的 `Trigger` 包含:

- `id`：封裝 `Name` 的 `TriggerId`
- `action`:可執行,授權主體,過濾器,重複政策,重新嘗試政策和後設資料

該行動包括:

- `executable`: `Instructions`,`ContractCall`, `Ivm`或 `IvmProved`
- `repeats`: `Indefinitely`或`Exactly(n)`
- `authority`:指引可執行的帳戶
- `filter`:一個 `EventFilterBox`
- `retry_policy`:規定的時間觸發器的可選重新試驗行為
- `metadata`:任意的觸發器後設資料

## 事件過濾器 {#event-filters}

觸發器條件使用與訂閱相同的事件過濾模型.最高階事件過濾器可以匹配:

- 管道事件
- 資料事件
- 時間事件
- 觸發執行事件
- 觸發完成事件

最適合工作流程的最小過濾器. 寬過濾器對於診斷有用,但它們在區塊執行過程中增加工作.

目前的過濾器家庭見 [過濾器](/zh-hant/blockchain/filters.md).

## 時間觸發器 {#time-triggers}

時間觸發器使用時間事件過濾器.當世界狀態檢視達到匹配的時間條件時, Iroha 會在觸發器許可權下執行觸發器操作.時間觸發程式是可以使用下面描述的重試政策的觸發器型別.

## 重複 {#repetition}

`Repeats::Indefinitely`將觸發器保持活躍,直到它沒有註冊.

`Repeats::Exactly(n)` 允許 trigger 觸發固定次數。次數用盡後，如果仍需要相同行為，請註冊新的 trigger。

## 授權主體和許可證 {#authority-and-permissions}

觸發器 authority 是呼叫 executable 時使用的帳戶。對於長期執行的觸發器，請使用專用技術帳戶，使所需許可權明確，並與維運人員的個人帳戶隔離。

權限主體需要執行指令或合同呼叫所要求的許可權. 註冊觸發器的帳戶還需要在活躍執行階段驗證器下注冊觸發符的許可.

## 重試原則 {#retry-policy}

時間觸發器可以選擇啟用重試原則。重試原則包含：

- `max_retries`：首次觸發失敗後允許的重試次數
- `retry_after_ms`：Iroha 在下一次重試符合執行條件前等待的時間

重試次數耗盡後，系統會取消註冊該觸發器。

## 查詢 {#queries}

使用當前的觸發器查詢檢查觸發狀態:

- [`FindTriggers`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)

此外,請參見:

- [事件觸發器示例](/zh-hant/blockchain/trigger-examples.md)
- [事件](/zh-hant/blockchain/events.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證](/zh-hant/blockchain/permissions.md)
