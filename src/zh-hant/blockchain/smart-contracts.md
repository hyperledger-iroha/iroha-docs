---
translation_locale: zh-hant
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智能合同 {#smart-contracts}

Iroha 執行交易 `Executable` 目前的數據模型
支持:

- `Executable::Instructions`: 排列的集合 Iroha 特別指示
- `Executable::ContractCall`: 對部署的合同進行附加參考呼叫
  舉例
- `Executable::Ivm`: Iroha VM 字體代碼
- `Executable::IvmProved`: Iroha VM 有預算指示的字體代碼
  覆蓋和證明的承諾

Kotodama 是的 Iroha 這是一種高層級的智能合同語言. `.ko` 源文件
數據的數值 IVM 常見的存儲方式是 `.to`
該產品的裝置. Kotodama 目標 IVM; 它並不是獨立的 RISC-V
或是 WebAssembly 目標是我們的目標

首次發行只支持 ABI 該系統和指標的使用方式 ABI
這項政策是通過承諾和執行無條件實施的;
沒有執行時間兼容性切換.

## 如何使用智能合同 {#when-to-use-smart-contracts}

使用正常指令,當交易可以直接表達時:

- 註冊或不注冊的物件
- 金,燃燒或轉移資產
- 更新元數據
- 授予或撤銷許可證
- 執行開關
- 在連鎖上設定的參數

使用智能合同, 當交易需要包裝的逻辑
或在部署的情況下
請通過參考召喚合同案例.

## IVM 執行工具 {#ivm-executables}

`Executable::Ivm` 帶著原料 IVM 這種字體代碼在內部執行
鎖定的運行時間限制.
決定性;合同是交易執行的一部分,因此影響
沒有人會同意.

`Executable::IvmProved` 該裝置是為證實運輸流程而設的.

- IVM 字體代碼
- 決定性指令覆蓋
- 執行事件的承諾
- 氣體政策的承諾

證明將覆蓋結合到執行的字體代碼.
證明和重播執行作為額外的證據
檢查安全性.

## 部署的合同通話 {#deployed-contract-calls}

`Executable::ContractCall` 透過地址使用已部署的合同例.
請使用此符號,
而不是每次使用字體代碼.

## 經營指南 {#operational-guidance}

- 請保持合同的決定性.
  壁表時間,主機檔案系統狀態,網絡通話或其他同行本地
  輸入方式.
- 大字符碼增加交易尺寸和區塊
  傳播成本.
- 選擇簡單的帳號變更.
  審核和實施更便宜.
- 請將合同升級和註冊許可處理為高風險
  操作控制.

查看以下內容:

- [指示](/zh-hant/blockchain/instructions.md)
- [引發器](/zh-hant/blockchain/triggers.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [數據模型方案](/zh-hant/reference/data-model-schema.md)
