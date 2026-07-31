---
translation_locale: zh-hant
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 引發器 {#triggers}

引發器將事件過濾器連接到可執行的行動.
子的濾鏡, Iroha 評估開關動作,
執行死刑.

## 結構 {#structure}

已註冊的 `Trigger` 含有:

- `id`: 其他 `TriggerId` 包裝一個 `Name`
- `action`: 執行性,權威,過,重複政策,再試政策,
  和元數據

這項行動包括:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, 或是 `IvmProved`
- `repeats`: `Indefinitely` 或是 `Exactly(n)`
- `authority`: 呼籲執行程式的帳號
- `filter`: 其他國家 `EventFilterBox`
- `retry_policy`: 選擇性重複試驗行為,
- `metadata`: 隨意引發的數據

## 事件過濾器 {#event-filters}

引發条件使用相同的事件濾網模式,
最高層次的事件濾鏡可以匹配:

- 管道事件
- 數據事件
- 時間事件
- 引發執行事件
- 導致完成事件

選擇適合工作流程的最窄濾鏡.
但他們在區塊執行時增加工作.

請看 [濾網](/zh-hant/blockchain/filters.md) 對於目前的濾網家族.

## 時間是引發因素 {#time-triggers}

當世界狀態視覺達到一個
匹配時間條件, Iroha 在開關下執行啟動動作
引發時間是可以使用重試政策的引發器.
在下面描述.

## 復習 {#repetition}

`Repeats::Indefinitely` 在未註冊之前,保持開關活動.

`Repeats::Exactly(n)` 能讓開關發射固定數次.
如果需要相同的行為,
這次又一次.

## 授權及許可證 {#authority-and-permissions}

引發權限是使用執行程式的帳號.
專用於長壽引發器的技術帳號,
是明顯的和從運營商個人帳戶中隔離的.

該機構需要執行指令所要求的許可,
該帳戶登記引擎, 也需要許可
在主動運行時間驗證器下註冊啟動器.

## 檢查時間 {#retry-policy}

在此時,可選擇重新嘗試的政策.

- `max_retries`: 在初步失敗後,可以多次重試
  射擊
- `retry_after_ms`: 在何時內 Iroha 在重新嘗試之前等待,

預算是沒有登記的.

## 詢問問題 {#queries}

使用當前的啟動查詢檢查啟動狀態:

- [`FindTriggers`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hant/reference/queries.md#triggers-contracts-transactions-and-blocks)

查看以下內容:

- [事件啟動示例](/zh-hant/blockchain/trigger-examples.md)
- [事件](/zh-hant/blockchain/events.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證](/zh-hant/blockchain/permissions.md)
