---
translation_locale: zh-hant
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可證代碼 {#permission-tokens}

本頁面列出了當前曝光的默認權限符號類型 Iroha 對於角色和權限的概念指南,請見 [許可證](/zh-hant/blockchain/permissions.md).

通過活躍的運行時間驗證器執行許可證檢查.下面的代碼類型名稱描述了標準政策表面,但 網絡可以通過升級執行器來定製運行時間驗證.

## 默認的代幣 {#default-tokens}

|許可證符號|類別|行動|
| --- | --- | --- |
|`CanManagePeers`|同齡人|登記,撤銷或以其他方式管理同齡人.|
|`CanManageLaneRelayEmergency`|同齡人|管理緊急車道連接控制.|
|`CanRegisterDomain`|域名|登記一個域名.|
|`CanUnregisterDomain`|域名|取消註冊域名.|
|`CanModifyDomainMetadata`|域名|修改域名的元數據.|
|`CanRegisterAccount`|賬戶|登記一個賬戶.|
|`CanUnregisterAccount`|賬戶|取消賬戶註冊.|
|`CanModifyAccountMetadata`|賬戶|修改帳戶的元數據.|
|`CanUnregisterAssetDefinition`|資產定義|取消資產定義的註冊.|
|`CanModifyAssetDefinitionMetadata`|資產定義|修改資產定義的元數據.|
|`CanMintAssetWithDefinition`|資產|硬幣資產的具體定義. |
|`CanBurnAssetWithDefinition`|資產|爲了一個特定的定義,燃燒資產.|
|`CanTransferAssetWithDefinition`|資產|轉移資產以特定的定義.|
|`CanMintAsset`|資產|一個特定的資產餘額. |
|`CanBurnAsset`|資產|燃燒一個特定的資產餘額.|
|`CanTransferAsset`|資產|轉移特定的資產餘額.|
|`CanRegisterNft`|NFT|登記一個 NFT.|
|`CanUnregisterNft`|NFT|取消 NFT 的登記.|
|`CanTransferNft`|NFT|轉移一個 NFT.|
|`CanModifyNftMetadata`|NFT|修改 NFT 元數據. |
|`CanSetParameters`|參數|在鏈上設置配置參數. |
|`CanManageRoles`|角色|報名,取消註冊,授予或撤銷角色.|
|`CanRegisterTrigger`|觸發器|登錄一個觸發器.|
|`CanExecuteTrigger`|觸發器|執行一個子.|
|`CanUnregisterTrigger`|觸發器|解除觸發器的記錄.|
|`CanModifyTrigger`|觸發器|修改觸發器配置.|
|`CanModifyTriggerMetadata`|觸發器|修改觸發器元數據.|
|`CanUpgradeExecutor`|執行者|升級運行時間執行器.|
|`CanRegisterSmartContractCode`|智能合同|登記智能合同代碼.|
|`CanUseFeeSponsor`|Nexus|徵收 Nexus 費用到指定贊助商賬戶. |

## 擁有權 {#ownership}

對於所有者敏感的權限令牌必須引用當前數據模型所使用的正規對象 IDs.例如,帳戶權限指的是正規的無域名賬戶 IDs,域名權限指的是 `domain.dataspace`域名 IDs,資產權限指是正規的資產定義或資產 IDs.

當一個交易失敗時,請驗證雙方:

- 簽署交易的賬戶是預期的法典帳戶
- 在指令中使用的確切對象 ID 上,授權符號或角色已被授予
