---
translation_locale: zh-hant
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智能合同 {#smart-contracts}


Iroha 交易執行`Executable`的有效載荷.目前的數據模型支持:

- `Executable::Instructions`:一個順序的 Iroha 特殊指令集
- `Executable::ContractCall`:向部署的合同實例進行附屬參考調用
- `Executable::Ivm`:Iroha VM 字節碼
- `Executable::IvmProved`:Iroha VM 字節碼,具有預先計算的指令覆蓋和證明承諾.

Kotodama 是 Iroha 一個高層級的智能合同語言 `.ko` 源文件編譯到確定性 IVM 常規存儲的字節碼 `.to` 用於部署的文物. Kotodama 目標 IVM 沒有針對性 RISC-V 或 WebAssembly.

第一個版本僅支持 ABI 版本 1. 系統調用和指針-ABI 政策是通過錄取和執行執行的無條件 V1 合同;沒有替代運行模式.

## 什麼時候使用智能合同 {#when-to-use-smart-contracts}

在交易可以直接表達時,使用正常指令:

- 登記或撤銷物件
- 貨幣,燃燒或轉移資產
- 更新的元數據
- 授予或撤銷許可證
- 執行觸發器
- 設置鏈上參數

使用智能合同,當交易需要包裝邏輯時難以將其表達爲靜態指令序列,或者如果部署的合約實例應該通過參考調用.

## IVM 執行式 {#ivm-executables}

`Executable::Ivm`載有原始的 IVM 字節碼.節點執行該字節碼在連鎖配置的運行時間限制內.保持字節碼小和確定性;合同是交易執行的一部分,因此影響共識.

`Executable::IvmProved` 適用於檢測載體流,它載有:

- IVM 字節碼
- 一個確定性指令覆蓋
- 執行事件承諾
- 氣體政策承諾

證明將重疊鏈接到執行的字節碼. 根據管道政策,驗證人員可以作爲額外的安全檢查來驗證證明和重播執行.

## 部署的合同調用 {#deployed-contract-calls}

`Executable::ContractCall`通過地址調用部署的合同實例. 在合同代碼被單獨註冊時,使用此指令,並且交易應以引用方式調用它,而不是每次攜帶字節代碼.

## 合同使用週期和所有權 {#contract-lifecycle-and-ownership}

每個部署的地址都保留`ContractLifecycleControlV1`記錄,包括合同不活躍期間.該記錄包含不可變的首次部署來源,當前和即將到期的所有者,可撤銷的議會代表團,活躍代碼哈希,非零比較和交換修訂,直接部署記錄部署賬戶.議會部署記錄其提議者,提案內容 ID 和成功的治理嘗試 ID.

生命週期所有者是單個帳戶或議會.賬戶的所有權的變化採用了單獨的報價和接受;接受一項報價可以清除任何議會代表.一個賬戶所有者可以允許議會激活或禁用合同,然後撤銷該授權,但授權從來沒有允許議會轉讓所有權.

`ActivateContractInstance`和`DeactivateContractInstance`原始指令僅可供經常賬戶所有者使用.它們必須包含記錄的確切 `expected_revision`;運行時間拒絕過時或零修改.原始激活不能創建生命週期記錄,它在改變 `active_code_hash`之前驗證已註冊的文物,表格和 ABI.每次成功的生命週期過渡都會推進修改,併發出完整的後狀態.

激活也可以在一個宣言聲明的生命週期子中進行. `EntryPointKind::Hajimari` 進入點 (`hajimari`/`始まり`) 階段 `Hajimari`. 重新將一個活躍地址轉換爲其表包含一個 `EntryPointKind::Kaizen` 進入點 (`kaizen`/`改善`) 階段 `Kaizen`. 約束力立即變化,但合同還沒有完成: `Kotoage` 和 `View` 電話被拒絕直到確切的階段式子成功.另一個激活也被拒絕,而子還在等待.

調用 `Executable::ContractCall` 在同一個合同地址和新的代碼哈希,使用確切的 `hajimari`或 `kaizen`入口點以及其明示中聲明的參數.運行時間提供了地址和選擇器擴展的 `CanInvokeContractEntrypoint`權限;呼叫者不得創建或授予該權限.懸而未決的標記包含了運行時間生成的確定性標誌 `transition_id` 和新的 `code_hash`;一個 `Kaizen`標誌也包含`previous_code_hash`.客戶不會計算或提交 `transition_id`.一個成功的子會以原子方式消耗標記,而一個失敗的子則將其留在等待後續再次試驗.

緊急級別議會的提案可以限制最多3600個區塊,如果它綁定了當前的修訂,代碼哈希和非零事件消化.從施加高度到,但不包括,過期高度.過期恢復執行,但不會刪除保留.一個認證的 `CompleteEmergencyHoldRetrospective` 動作必須在記錄清除之前綁定確切保留 IDs 和消化加上非零發現根;另一個保留不能被強加,而後期仍未完成.

當應用程序 API 啓動時,請用 `GET /v1/gov/contracts/{contract_address}`讀取保留狀態.其 `found` 字段意味着存在生命週期記錄,而不是地址目前具有活躍代碼.

## 運營指導 {#operational-guidance}

- 保持合約的確定性.合同行爲不應取決於本地牆鍾時間,主機文件系統狀態,網絡調用或其他同行本地輸入.
- 大字代碼增加了交易規模和區塊傳播成本.
- 對於簡單的賬本更改,最喜歡輸入說明.它們的審計更容易,執行也更便宜.
- 將合同升級和註冊許可作爲高風險的操作控制.

此外,請參見:

- [指示](/zh-hant/blockchain/instructions.md)
- [觸發器](/zh-hant/blockchain/triggers.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [數據模型方案](/zh-hant/reference/data-model-schema.md)
