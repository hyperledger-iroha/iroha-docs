---
translation_locale: zh-hant
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可令牌 {#permission-tokens}

這個頁面列出了當前的默認許可符號類型
Iroha 執行者數據模型.
查看 [許可證](/zh-hant/blockchain/permissions.md).

通過有效執行時間驗證器,
以下名稱描述了標準政策表面,
通過升級執行器進行運行時間驗證.

## 預設代碼 {#default-tokens}

| 授權令牌 | 類別 | 活動 |
| --- | --- | --- |
| `CanManagePeers` | 同級人 | 註冊,取消注冊或以其他方式管理同學. |
| `CanManageLaneRelayEmergency` | 同級人 | 管理緊急車道連接控制. |
| `CanRegisterDomain` | 域名 | 註冊一個域名. |
| `CanUnregisterDomain` | 域名 | 取消域名登記. |
| `CanModifyDomainMetadata` | 域名 | 修改域名元數據. |
| `CanRegisterAccount` | 帳戶 | 註冊帳戶. |
| `CanUnregisterAccount` | 帳戶 | 取消帳戶登記. |
| `CanModifyAccountMetadata` | 帳戶 | 修改帳戶元數據. |
| `CanUnregisterAssetDefinition` | 資產的定義 | 取消資產定義的註冊. |
| `CanModifyAssetDefinitionMetadata` | 資產的定義 | 修改資產定義元數據. |
| `CanMintAssetWithDefinition` | 資產 | 具體定義的硬幣資產. |
| `CanBurnAssetWithDefinition` | 資產 | 燃燒資產, 以特定的定義. |
| `CanTransferAssetWithDefinition` | 資產 | 為特定的定義轉移資產. |
| `CanMintAsset` | 資產 | 明特定的資產平衡. |
| `CanBurnAsset` | 資產 | 燃燒特定的資產平衡. |
| `CanTransferAsset` | 資產 | 轉移特定的資產余額. |
| `CanRegisterNft` | NFT | 註冊一個 NFT. |
| `CanUnregisterNft` | NFT | 沒有註冊 NFT. |
| `CanTransferNft` | NFT | 轉移一個 NFT. |
| `CanModifyNftMetadata` | NFT | 修改 NFT 沒有任何相關資料. |
| `CanSetParameters` | 參數 | 在連鎖上設定配置參數. |
| `CanManageRoles` | 角色 | 註冊,取消注冊,授予或撤銷角色. |
| `CanRegisterTrigger` | 引發器 | 這樣就能讓你發出警訊. |
| `CanExecuteTrigger` | 引發器 | 執行一個子. |
| `CanUnregisterTrigger` | 引發器 | 取消開關的情況. |
| `CanModifyTrigger` | 引發器 | 請修改開關配置. |
| `CanModifyTriggerMetadata` | 引發器 | 改變引發元數據. |
| `CanUpgradeExecutor` | 執行人 | 升級執行時間執行器. |
| `CanRegisterSmartContractCode` | 智能合同 | 註冊智能合同代碼. |
| `CanUseFeeSponsor` | Nexus | 收費 Nexus 在指定贊助商帳戶的費用. |

## 擁有權 {#ownership}

所有者敏感的許可令牌必須參考法規對象 IDs 使用
例如,帳戶權限是指法典的數據.
沒有域名的帳戶 IDs, 域名權限是指 `domain.dataspace` 域名
IDs, 及資產許可指法規的資產定義或資產 IDs.

如果交易失败於授權錯誤,

- 簽署交易的帳戶是預期的聖經帳戶
- 授權符號或角色已授予對象 ID 在
  指示
