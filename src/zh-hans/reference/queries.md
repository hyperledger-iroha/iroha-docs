---
translation_locale: zh-hans
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 问题 {#queries}

Iroha 目前的数据模型
揭示了两个广泛的查询形式:

- **单独的查询**, 返回一个对象或一个值
- **可循环查询**, 它们可以回归流或收藏,并且可结合
  通过过,分类,投影和页面化进行查询
  支持它

使用 SDK 打字建筑师或 CLI 而不是构建查询包裹
下面的名称是当前查询类型
`iroha_data_model::query`.

## 运行时间和配置 {#runtime-and-configuration}

| 查询 | 目的 |
| --- | --- |
| `FindAbiVersion` | 返回执行者 ABI 版本. |
| `FindExecutorDataModel` | 返回执行器数据模型描述. |
| `FindParameters` | 返回连锁执行器配置参数. |

## 账户和许可证 {#accounts-and-permissions}

| 查询 | 目的 |
| --- | --- |
| `FindAccountById` | 根据法典记录找到一个帐户 ID. |
| `FindAccountByAlias` | 解决一个账户的代号. |
| `FindAccounts` | 列出注册账户. |
| `FindAccountIds` | 清单注册账户 IDs. |
| `FindAccountsWithAsset` | 列出包含特定资产定义的账户. |
| `FindAliasesByAccountId` | 列出与帐户相关的名. |
| `FindAccountRecoveryPolicyByAlias` | 找一个名的恢复政策. |
| `FindAccountRecoveryRequestByAlias` | 找一个名的恢复请求. |
| `FindRoles` | 列出角色. |
| `FindRoleIds` | 列表角色 IDs. |
| `FindRolesByAccountId` | 列出一个账户所赋予的角色. |
| `FindPermissionsByAccountId` | 列出一个帐户获得的权限. |

## 域名和同龄人 {#domains-and-peers}

| 查询 | 目的 |
| --- | --- |
| `FindDomainById` | 通过找到一个域 `DomainId`. |
| `FindDomains` | 列出已注册的域名. |
| `FindDomainsByAccountId` | 列出一个帐户拥有的域名. |
| `FindDomainEndorsements` | 列出域名认证记录. |
| `FindDomainEndorsementPolicy` | 返回域名认可政策. |
| `FindDomainCommittee` | 返回域名委员会. |
| `FindPeers` | 在本书中列出已知可信的同龄人. |

## 资产 NFTs, 并且 RWAs {#assets-nfts-and-rwas}

| 查询 | 目的 |
| --- | --- |
| `FindAssets` | 列出资产余额. |
| `FindAssetsDefinitions` | 列出资产定义. |
| `FindAssetsByAccountId` | 列出一个账户持有的资产. |
| `FindAssetById` | 找一个资产余额 `AssetId`. |
| `FindAssetDefinitionById` | 找一个资产定义 ID. |
| `FindNfts` | 列表 NFTs. |
| `FindNftsByAccountId` | 列表 NFTs 在一个账户上. |
| `FindRwas` | 列出了现实资产. |

## 抵押金和证据记录 {#escrow-and-proof-records}

监管查询检查由
[产业资产保证金 ISIs](/zh-hans/blockchain/escrow.md), 包括市场
监管,通用资产锁定和匿名的监管记录.

| 查询 | 目的 |
| --- | --- |
| `FindAssetEscrows` | 列出资产保证记录. |
| `FindAssetEscrowById` | 找一个资产保证 ID. |
| `FindAssetEscrowsBySeller` | 根据卖方的资产清单. |
| `FindAssetEscrowsByBuyer` | 按买方的资产清单. |
| `FindAssetEscrowsByStatus` | 按状态列出资产保证金. |
| `FindAnonymousAssetEscrows` | 列出匿名的资产保证记录. |
| `FindAnonymousAssetEscrowById` | 找一个匿名的资产保证人 ID. |
| `FindAnonymousAssetEscrowsBySeller` | 按卖家列出匿名的保证金. |
| `FindAnonymousAssetEscrowsByBuyer` | 按买家列出匿名的保证金. |
| `FindAnonymousAssetEscrowsByStatus` | 按状态列出匿名保险人. |
| `FindProofRecordById` | 找一个证明记录 ID. |
| `FindProofRecords` | 列出证据记录. |
| `FindProofRecordsByBackend` | 列出证据记录,以获得证据后端. |
| `FindProofRecordsByStatus` | 按状态列出证据记录. |

## Nexus, 数据可用性和包装 {#nexus-data-availability-and-packages}

| 查询 | 目的 |
| --- | --- |
| `FindRepoAgreements` | 在链上存储的仓库协议列表. |
| `FindTwitterBindingByHash` | 通过哈希来解决Twitter绑定. |
| `FindDaPinIntentByTicket` | 通过门票查找数据可用性针意图. |
| `FindDaPinIntentByManifest` | 通过明示引用找到一个针的意图. |
| `FindDaPinIntentByAlias` | 找一个笔的意图,以别名. |
| `FindDaPinIntentByLaneEpochSequence` | 根据车道,时代和序列找到针的意图. |
| `FindLaneRelayEnvelopeByRef` | 找一个验证的车道连接包裹. |
| `FindSorafsProviderOwner` | 解决一个 SoraFS 提供商. |
| `FindDataspaceNameOwnerById` | 解决一个数据空间名称所有者. |
| `FindMusubiReleaseByRef` | 找一个 Musubi 通过参考释放. |
| `FindMusubiPackageVersions` | 列出一个版本 Musubi 包装. |
| `FindMusubiPackageReleases` | 列表发布 Musubi 包装. |
| `FindMusubiShortAliasByName` | 解决一个问题 Musubi 简短的名. |

## 触发器,合同,交易和阻塞 {#triggers-contracts-transactions-and-blocks}

| 查询 | 目的 |
| --- | --- |
| `FindActiveTriggerIds` | 列出活动触发器 IDs. |
| `FindTriggers` | 列出触发器. |
| `FindTriggerById` | 找到一个触发器 ID. |
| `FindContractManifestByCodeHash` | 通过代码哈希找到一个智能合同宣言. |
| `FindTransactions` | 承诺交易列表. |
| `FindBlocks` | 列表区块. |
| `FindBlockHeaders` | 列出区块标题. |

## 过和页面化 {#filtering-and-pagination}

可反复查询可以暴露预示和选择器支持. 使用特定查询
选器的类型 SDK 所以过器输入与查询输出类型相匹配.
对于大型结果集合,使用查询参数如线索和限制
在每一行中,
