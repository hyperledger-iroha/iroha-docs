---
translation_locale: zh-hant
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智慧合約 {#smart-contracts}

Iroha 交易會執行 `Executable` 酬載。目前的資料模型支援：

- `Executable::Instructions`：一組依序執行的 Iroha 特殊指令
- `Executable::ContractCall`：以參照方式呼叫已部署的合約執行個體
- `Executable::Ivm`：Iroha VM 位元組碼
- `Executable::IvmProved`：包含預先計算之指令覆蓋層與證明承諾的 Iroha VM 位元組碼

Kotodama 是 Iroha 的高階智慧合約語言。`.ko` 原始檔會編譯成確定性的 IVM 位元組碼，並依慣例儲存為 `.to` 成品以供部署。Kotodama 只以 IVM 為目標，絕不以 RISC-V 或 WebAssembly 為目標。

首次發行版僅支援 ABI 第 1 版。合約准入與執行會無條件強制套用系統呼叫及指標 ABI 政策；不存在執行階段相容性切換開關。

## 何時使用智慧合約 {#when-to-use-smart-contracts}

若交易可直接表達，請使用一般指令：

- 註冊或取消註冊物件
- 鑄造、銷毀或轉移資產
- 更新中繼資料
- 授予或撤銷權限
- 執行觸發器
- 設定鏈上參數

若交易需要封裝成難以用靜態指令序列表示的邏輯，或需要以參照方式呼叫已部署的合約執行個體，請使用智慧合約。

## IVM 可執行酬載 {#ivm-executables}

`Executable::Ivm` 攜帶原始 IVM 位元組碼。節點會在鏈上設定的執行階段限制內執行該位元組碼。位元組碼應保持精簡且具確定性；合約屬於交易執行的一部分，因此會影響共識。

`Executable::IvmProved` 用於攜帶證明的流程。它包含：

- IVM 位元組碼
- 確定性的指令覆蓋層
- 執行事件承諾
- Gas 政策承諾

該證明會將覆蓋層與實際執行的位元組碼繫結。依照管線政策，驗證者可以驗證證明並重播執行，作為額外的安全檢查。

## 呼叫已部署的合約 {#deployed-contract-calls}

`Executable::ContractCall` 會依位址呼叫已部署的合約執行個體。當合約程式碼已另行註冊，且交易應以參照方式呼叫而非每次都攜帶位元組碼時，請使用此形式。

## 合同使用週期和所有權 {#contract-lifecycle-and-ownership}

每個部署的地址都保留`ContractLifecycleControlV1`記錄,包括合同不活躍期間.該記錄包含不可變的首次部署來源,當前和即將到期的所有者,可撤銷的議會代表團,活躍代碼哈希,非零比較和交換修訂;一個直接部署將提交賬戶分配爲所有者,並記錄它作爲部署的來源. 一個議會部署將議會分配爲所有人,並記錄其提出者,提案內容 ID,和成功的治理嘗試 ID 僅作爲來源.

設置的保護名字空間爲議會部署保留. `CanRegisterSmartContractCode` 允許對文物進行註冊,但不允許直接部署或原始激活到受保護的名稱空間中;首先必須通過歐洲議會認證的部署路徑創建生命週期記錄.

賬戶所有權變更使用 `OfferContractOwnership` 隨後是懸而未決的所有者的 `AcceptContractOwnership`;現有所有者可以撤銷一個 在 `CancelContractOwnershipOffer`中未接受的報價. 通過該報價,可批准議會任何代表團.在賬戶持有合同或正在懸而未決的報價時,將拒絕取消帳戶.

賬戶所有者可以允許議會升級,激活或禁用合同,然後撤銷該授權. 代表團永遠不會允許議會轉讓所有權或更改代表團本身.通過經過認證的治理效應,由議會實施的變化和議會接受.

`ActivateContractInstance`和`DeactivateContractInstance`原始指令僅可供經常賬戶所有者使用.它們必須包含記錄的確切 `expected_revision`;過時或零修訂無法關閉.原始激活不能創建生命週期記錄,它在改變 `active_code_hash`之前驗證已註冊的文物,表格和 ABI.每次成功的生命週期過渡都會推進修改,併發出完整的後狀態.

緊急級別議會提案只能通過整個議會管道,至少有三分之二的政策陪審團席位獲得"對"對"的選票".該選項綁定了當前的修訂,代碼哈希和非零事件消化,並持續最多3600塊.它只能暫停調用和觸發執行:它不能延長或更改代碼,所有權或委託. 調用和匹配的觸發執行被阻止從施加高度到,但不包括,過期高度.過期自動恢復執行,但不會刪除保留.一個認證的 `CompleteEmergencyHoldRetrospective` 行動必須在記錄清除之前綁定確切保留 IDs 和消化加上非零的發現根;直到追溯完成之前,不能強加另一次保留.

當應用程序 API 啓動時,請用 `GET /v1/gov/contracts/{contract_address}`讀取保留狀態.其 `found` 字段意味着存在生命週期記錄,而不是地址目前具有活躍代碼.

## 維運指南 {#operational-guidance}

- 合約必須保持確定性。合約行為不得依賴本機時鐘時間、主機檔案系統狀態、網路呼叫或其他僅限單一對等節點的輸入。
- 酬載應保持精簡。大型位元組碼會增加交易大小與區塊傳播成本。
- 簡單的帳本變更應優先使用具型別的指令；它們較容易稽核，執行成本也較低。
- 將合約升級與註冊權限視為高風險的維運控制項。

另請參閱：

- [指令](/zh-hant/blockchain/instructions.md)
- [觸發器](/zh-hant/blockchain/triggers.md)
- [權限](/zh-hant/blockchain/permissions.md)
- [資料模型結構描述](/zh-hant/reference/data-model-schema.md)
