---
translation_locale: zh-hant
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 7c35c609442df65328fa619b6673be76f801cfc2abc28afd853d7fe61e439e9c
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
