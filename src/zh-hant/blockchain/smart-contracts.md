---
translation_locale: zh-hant
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智慧合同 {#smart-contracts}


Iroha 交易執行`Executable`的有效載荷.目前的資料模型支援:

- `Executable::Instructions`:一個順序的 Iroha 特殊指令集
- `Executable::ContractCall`:向部署的合同例項進行附屬參考呼叫
- `Executable::Ivm`:Iroha VM 位元組碼
- `Executable::IvmProved`:Iroha VM 位元組碼,具有預先計算的指令覆蓋和證明承諾.

Kotodama 是 Iroha 一個高層級的智慧合同語言 `.ko` 原始檔編譯到確定性 IVM 通常儲存的位元組碼 `.to` 用於部署的構件. Kotodama 目標 IVM 沒有針對性 RISC-V 或 WebAssembly.

第一個版本僅支援 ABI 版本 1. 系統呼叫和指標-ABI 政策是透過錄取和執行執行的無條件 V1 合同;沒有替代執行模式.

## 什麼時候使用智慧合同 {#when-to-use-smart-contracts}

在交易可以直接表達時,使用正常指令:

- 登記或撤銷物件
- 鑄造、銷毀或轉移資產
- 更新的後設資料
- 授予或撤銷許可證
- 執行觸發器
- 設定鏈上引數

使用智慧合同,當交易需要包裝邏輯時難以將其表達為靜態指令序列,或者如果部署的合約例項應該透過參考呼叫.

## IVM 執行式 {#ivm-executables}

`Executable::Ivm`載有原始的 IVM 位元組碼.節點執行該位元組碼在連鎖配置的執行階段限制內.保持位元組碼小和確定性;合同是交易執行的一部分,因此影響共識.

`Executable::IvmProved` 適用於檢測載體流,它載有:

- IVM 位元組碼
- 一個確定性指令覆蓋
- 執行事件承諾
- gas政策承諾

證明將重疊連結到執行的位元組碼. 根據管道政策,驗證人員可以作為額外的安全檢查來驗證證明和重播執行.

## 部署的合同呼叫 {#deployed-contract-calls}

`Executable::ContractCall`透過地址呼叫部署的合同例項. 在合同程式碼被單獨註冊時,使用此指令,並且交易應以引用方式呼叫它,而不是每次攜帶位元組程式碼.

## 合同使用週期和所有權 {#contract-lifecycle-and-ownership}

每個已部署地址都會保留一筆 `ContractLifecycleControlV1` 記錄，即使合約處於非作用中狀態也是如此。該記錄包含不可變的首次部署來源、目前和待定擁有者、任何可撤銷的 Parliament 委派、作用中程式碼雜湊、非零比較交換修訂版，以及任何保留的緊急暫停。直接部署會記錄部署帳戶。Parliament 部署會記錄其提議者、提案內容 ID 和成功的治理嘗試 ID。

生命週期擁有者可以是一個帳戶或 Parliament。帳戶擁有權變更使用彼此獨立的要約和接受操作；接受要約會清除任何 Parliament 委派。帳戶擁有者可以允許 Parliament 啟用或停用合約，之後也可以撤銷該委派，但委派絕不允許 Parliament 轉移擁有權。由 Parliament 擁有的變更和 Parliament 接受操作會透過經認證的治理效果實施。

原始 `ActivateContractInstance` 和 `DeactivateContractInstance` 指令僅供目前帳戶擁有者使用。它們必須攜帶記錄中完全相符的 `expected_revision`；過時或為零的修訂版會以失敗關閉方式失敗。原始啟用無法建立生命週期記錄，並且會在變更 `active_code_hash` 前驗證已註冊的成品、資訊清單和 ABI。停用會清除作用中程式碼雜湊，但保留擁有權和來源。每次成功的生命週期轉換都會推進修訂版並發出完整的轉換後狀態。

啟用也可以在一個清單宣告的生命週期子中進行. `EntryPointKind::Hajimari` 進入點 (`hajimari`/`始まり`) 階段 `Hajimari`. 重新將一個活躍地址轉換為其表包含一個 `EntryPointKind::Kaizen` 進入點 (`kaizen`/`改善`) 階段 `Kaizen`. 約束力立即變化,但合同還沒有完成: `Kotoage` 和 `View` 呼叫被拒絕直到確切的階段式子成功.另一個啟用也被拒絕,而子還在等待.

在同一合約位址和新程式碼雜湊上，透過 `Executable::ContractCall` 呼叫分階段的鉤子，使用確切的 `hajimari` 或 `kaizen` 進入點以及資訊清單宣告的引數。執行階段提供位址和選擇器範圍的 `CanInvokeContractEntrypoint` 許可權；呼叫者不得建立或授予該許可權。待處理標記包含由執行階段產生的確定性 `transition_id` 和新的 `code_hash`；`Kaizen` 標記還包含 `previous_code_hash`。使用者端不得計算或提交 `transition_id`。鉤子成功時以原子方式消耗該標記；失敗時則保持待處理狀態，以便稍後重試。

緊急級別議會的提案可以限制最多3600個區塊,如果它繫結了當前的修訂,程式碼雜湊和非零事件摘要.從施加高度到,但不包括,過期高度.過期恢復執行,但不會刪除保留.一個認證的 `CompleteEmergencyHoldRetrospective` 動作必須在記錄清除之前繫結確切保留 IDs 和摘要加上非零發現根;另一個保留不能被強加,而後期仍未完成.

當應用程式 API 啟動時,請用 `GET /v1/gov/contracts/{contract_address}`讀取保留狀態.其 `found` 欄位意味著存在生命週期記錄,而不是地址目前具有活躍程式碼.

## 運營指導 {#operational-guidance}

- 保持合約的確定性.合對等節點為不應取決於本地牆鍾時間,主機檔案系統狀態,網路呼叫或其他對等節點本地輸入.
- 請保持 payload 精簡。大型 bytecode 會增加交易大小和區塊傳播成本。
- 對於簡單的賬本更改,最喜歡輸入說明.它們的審計更容易,執行也更便宜.
- 將合同升級和註冊許可作為高風險的操作控制.

此外,請參見:

- [指示](/zh-hant/blockchain/instructions.md)
- [觸發器](/zh-hant/blockchain/triggers.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [資料模型方案](/zh-hant/reference/data-model-schema.md)
