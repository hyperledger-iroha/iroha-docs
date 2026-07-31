---
translation_locale: zh-hans
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 许可令牌 {#permission-tokens}

本页面列出了当前曝光的默认权限标志类型
Iroha 执行器数据模型.对于角色和权限的概念指南,
查看 [许可证](/zh-hans/blockchain/permissions.md).

通过活跃的运行时间验证器执行权限检查.
下面的名称描述了标准政策表面,但网络可以定制
通过升级执行器进行运行时间验证.

## 默认代码 {#default-tokens}

| 许可证 | 类别 | 行动 |
| --- | --- | --- |
| `CanManagePeers` | 同龄人 | 报名,退出注册或以其他方式管理同龄人. |
| `CanManageLaneRelayEmergency` | 同龄人 | 管理紧急车道接线控制. |
| `CanRegisterDomain` | 域名 | 登记一个域名. |
| `CanUnregisterDomain` | 域名 | 取消域名注册. |
| `CanModifyDomainMetadata` | 域名 | 修改域名元数据. |
| `CanRegisterAccount` | 账户 | 登记一个账户. |
| `CanUnregisterAccount` | 账户 | 取消账户登记. |
| `CanModifyAccountMetadata` | 账户 | 修改帐户的元数据. |
| `CanUnregisterAssetDefinition` | 资产定义 | 取消资产定义的注册. |
| `CanModifyAssetDefinitionMetadata` | 资产定义 | 修改资产定义元数据. |
| `CanMintAssetWithDefinition` | 资产 | 货币资产的具体定义. |
| `CanBurnAssetWithDefinition` | 资产 | 燃烧资产以确定定义. |
| `CanTransferAssetWithDefinition` | 资产 | 转移资产以特定的定义. |
| `CanMintAsset` | 资产 | 发明一个特定的资产余额. |
| `CanBurnAsset` | 资产 | 燃烧一个特定的资产余额. |
| `CanTransferAsset` | 资产 | 转移特定的资产余额. |
| `CanRegisterNft` | NFT | 登记一个 NFT. |
| `CanUnregisterNft` | NFT | 取消注册 NFT. |
| `CanTransferNft` | NFT | 转移一个 NFT. |
| `CanModifyNftMetadata` | NFT | 修改 NFT 其他数据. |
| `CanSetParameters` | 参数 | 设置链上配置参数. |
| `CanManageRoles` | 角色 | 登记,取消注册,授予或撤销角色. |
| `CanRegisterTrigger` | 触发器 | 登记一个子. |
| `CanExecuteTrigger` | 触发器 | 执行一个触发器. |
| `CanUnregisterTrigger` | 触发器 | 取消触发器. |
| `CanModifyTrigger` | 触发器 | 修改触发器配置. |
| `CanModifyTriggerMetadata` | 触发器 | 修改触发器的元数据. |
| `CanUpgradeExecutor` | 执行者 | 升级运行时间执行器. |
| `CanRegisterSmartContractCode` | 智能合同 | 登记智能合同代码. |
| `CanUseFeeSponsor` | Nexus | 收费 Nexus 支付给指定赞助商账户的费用. |

## 拥有权 {#ownership}

对于所有者敏感的权限令牌必须引用可行对象 IDs 使用
例如,帐户权限指的是可信的数据.
无域名帐户 IDs, 域名权限指 `domain.dataspace` 域名
IDs, 资产权限指法规资产定义或资产 IDs.

当一个交易失败时,请验证双方:

- 签署交易的账户是预期的法典帐户
- 许可证符号或角色已被授予具体对象 ID 在
  指示
