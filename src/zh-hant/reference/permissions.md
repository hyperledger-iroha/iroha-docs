---
translation_locale: zh-hant
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可證程式碼 {#permission-tokens}

本頁面列出了當前曝光的預設許可權符號型別 Iroha 對於角色和許可權的概念指南,請見 [許可證](/zh-hant/blockchain/permissions.md).

透過活躍的執行階段驗證器執行許可證檢查.下面的程式碼型別名稱描述了標準政策表面,但 網路可以透過升級執行器來定製執行階段驗證.

## 預設的代幣 {#default-tokens}

|許可證符號|類別|行動|
| --- | --- | --- |
|`CanManagePeers`|對等節點|登記,撤銷或以其他方式管理對等節點.|
|`CanManageLaneRelayEmergency`|對等節點|管理緊急通道連線控制.|
|`CanRegisterDomain`|域名|登記一個域名.|
|`CanUnregisterDomain`|域名|取消註冊域名.|
|`CanModifyDomainMetadata`|域名|修改域名的後設資料.|
|`CanRegisterAccount`|帳戶|登記一個帳戶.|
|`CanUnregisterAccount`|帳戶|取消帳戶註冊.|
|`CanModifyAccountMetadata`|帳戶|修改帳戶的後設資料.|
|`CanUnregisterAssetDefinition`|資產定義|取消資產定義的註冊.|
|`CanModifyAssetDefinitionMetadata`|資產定義|修改資產定義的後設資料.|
|`CanMintAssetWithDefinition`|資產|鑄造特定定義的資產. |
|`CanBurnAssetWithDefinition`|資產|為了一個特定的定義,銷毀資產.|
|`CanTransferAssetWithDefinition`|資產|轉移資產以特定的定義.|
|`CanMintAsset`|資產|一個特定的資產餘額. |
|`CanBurnAsset`|資產|銷毀一個特定的資產餘額.|
|`CanTransferAsset`|資產|轉移特定的資產餘額.|
|`CanRegisterNft`|NFT|登記一個 NFT.|
|`CanUnregisterNft`|NFT|取消 NFT 的登記.|
|`CanTransferNft`|NFT|轉移一個 NFT.|
|`CanModifyNftMetadata`|NFT|修改 NFT 後設資料. |
|`CanSetParameters`|引數|在鏈上設定配置引數. |
|`CanManageRoles`|角色|報名,取消註冊,授予或撤銷角色.|
|`CanRegisterTrigger`|觸發器|登入一個觸發器.|
|`CanExecuteTrigger`|觸發器|執行一個子.|
|`CanUnregisterTrigger`|觸發器|解除觸發器的記錄.|
|`CanModifyTrigger`|觸發器|修改觸發器配置.|
|`CanModifyTriggerMetadata`|觸發器|修改觸發器後設資料.|
|`CanUpgradeExecutor`|執行者|升級執行階段執行器.|
|`CanRegisterSmartContractCode`|智慧合同|登記智慧合同程式碼.|
|`CanUseFeeSponsor`|Nexus|徵收 Nexus 費用到指定贊助商帳戶. |

## 擁有權 {#ownership}

對於所有者敏感的許可權令牌必須引用當前資料模型所使用的規範物件 IDs.例如,帳戶許可權指的是規範的無域名帳戶 IDs,域名許可權指的是 `domain.dataspace`域名 IDs,資產許可權指是規範的資產定義或資產 IDs.

當交易因授權錯誤而失敗時，請檢查雙方：

- 簽署交易的帳戶是預期的規範帳戶
- 在指令中使用的確切物件 ID 上,授權符號或角色已被授予
