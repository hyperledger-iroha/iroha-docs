---
translation_locale: zh-hans
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 许可证代码 {#permission-tokens}

本页面列出了当前曝光的默认权限符号类型 Iroha 对于角色和权限的概念指南,请见 [许可证](/zh-hans/blockchain/permissions.md).

通过活跃的运行时验证器执行许可证检查.下面的代码类型名称描述了标准政策表面,但 网络可以通过升级执行器来定制运行时验证.

## 默认的代币 {#default-tokens}

|许可证符号|类别|行动|
| --- | --- | --- |
|`CanManagePeers`|对等节点|登记,撤销或以其他方式管理对等节点.|
|`CanManageLaneRelayEmergency`|对等节点|管理紧急通道连接控制.|
|`CanRegisterDomain`|域名|登记一个域名.|
|`CanUnregisterDomain`|域名|取消注册域名.|
|`CanModifyDomainMetadata`|域名|修改域名的元数据.|
|`CanRegisterAccount`|账户|登记一个账户.|
|`CanUnregisterAccount`|账户|取消账户注册.|
|`CanModifyAccountMetadata`|账户|修改帐户的元数据.|
|`CanUnregisterAssetDefinition`|资产定义|取消资产定义的注册.|
|`CanModifyAssetDefinitionMetadata`|资产定义|修改资产定义的元数据.|
|`CanMintAssetWithDefinition`|资产|铸造特定定义的资产. |
|`CanBurnAssetWithDefinition`|资产|为了一个特定的定义,销毁资产.|
|`CanTransferAssetWithDefinition`|资产|转移资产以特定的定义.|
|`CanMintAsset`|资产|一个特定的资产余额. |
|`CanBurnAsset`|资产|销毁一个特定的资产余额.|
|`CanTransferAsset`|资产|转移特定的资产余额.|
|`CanRegisterNft`|NFT|登记一个 NFT.|
|`CanUnregisterNft`|NFT|取消 NFT 的登记.|
|`CanTransferNft`|NFT|转移一个 NFT.|
|`CanModifyNftMetadata`|NFT|修改 NFT 元数据. |
|`CanSetParameters`|参数|在链上设置配置参数. |
|`CanManageRoles`|角色|报名,取消注册,授予或撤销角色.|
|`CanRegisterTrigger`|触发器|登录一个触发器.|
|`CanExecuteTrigger`|触发器|执行一个子.|
|`CanUnregisterTrigger`|触发器|解除触发器的记录.|
|`CanModifyTrigger`|触发器|修改触发器配置.|
|`CanModifyTriggerMetadata`|触发器|修改触发器元数据.|
|`CanUpgradeExecutor`|执行者|升级运行时执行器.|
|`CanRegisterSmartContractCode`|智能合同|登记智能合同代码.|
|`CanUseFeeSponsor`|Nexus|征收 Nexus 费用到指定赞助商账户. |

## 拥有权 {#ownership}

对于所有者敏感的权限令牌必须引用当前数据模型所使用的规范对象 IDs.例如,帐户权限指的是规范的无域名账户 IDs,域名权限指的是 `domain.dataspace`域名 IDs,资产权限指是规范的资产定义或资产 IDs.

当交易因授权错误而失败时，请检查双方：

- 签署交易的账户是预期的规范帐户
- 在指令中使用的确切对象 ID 上,授权符号或角色已被授予
