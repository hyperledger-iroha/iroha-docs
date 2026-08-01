---
translation_locale: zh-hans
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 查询 {#queries}

Iroha 查询可以读取账本状态而不对其进行更改。当前数据模型公开两种主要查询形式：

- **单项查询**：返回一个对象或一个值
- **可迭代查询**：返回数据流或集合；如果查询类型支持，还可以结合筛选、排序、投影和分页

请使用 SDK 的强类型构建器或 CLI，不要手动构造查询信封。以下名称是 `iroha_data_model::query` 当前公开的查询类型。

## 运行时与配置 {#runtime-and-configuration}

| 查询 | 用途 |
| --- | --- |
| `FindAbiVersion` | 返回执行器 ABI 版本。 |
| `FindExecutorDataModel` | 返回执行器的数据模型描述。 |
| `FindParameters` | 返回链上执行器配置参数。 |

## 账户与权限 {#accounts-and-permissions}

| 查询 | 用途 |
| --- | --- |
| `FindAccountById` | 按规范且不含域的账户 ID 查找一个账户。 |
| `FindAccountByAlias` | 将账户别名解析为账户。 |
| `FindAccounts` | 列出已注册账户。 |
| `FindAccountIds` | 列出已注册账户 IDs。 |
| `FindAccountsWithAsset` | 列出持有指定资产定义的账户。 |
| `FindAliasesByAccountId` | 列出绑定到某账户的别名。 |
| `FindAccountRecoveryPolicyByAlias` | 查找某个别名的恢复策略。 |
| `FindAccountRecoveryRequestByAlias` | 查找某个别名的恢复请求。 |
| `FindRoles` | 列出角色。 |
| `FindRoleIds` | 列出角色 IDs。 |
| `FindRolesByAccountId` | 列出授予某账户的角色。 |
| `FindPermissionsByAccountId` | 列出授予某账户的权限。 |

## 域与对等节点 {#domains-and-peers}

| 查询 | 用途 |
| --- | --- |
| `FindDomainById` | 按 `DomainId` 查找一个域。 |
| `FindDomains` | 列出已注册域。 |
| `FindDomainsByAccountId` | 列出某账户拥有的域。 |
| `FindDomainEndorsements` | 列出域背书记录。 |
| `FindDomainEndorsementPolicy` | 返回域背书策略。 |
| `FindDomainCommittee` | 返回域委员会。 |
| `FindPeers` | 列出账本已知的可信对等节点。 |

## 资产、NFTs 与 RWAs {#assets-nfts-and-rwas}

| 查询 | 用途 |
| --- | --- |
| `FindAssets` | 列出资产余额。 |
| `FindAssetsDefinitions` | 列出资产定义。 |
| `FindAssetsByAccountId` | 列出某账户持有的资产。 |
| `FindAssetById` | 按 `AssetId` 查找一个资产余额。 |
| `FindAssetDefinitionById` | 按 ID 查找一个资产定义。 |
| `FindNfts` | 列出 NFTs。 |
| `FindNftsByAccountId` | 列出某账户拥有的 NFTs。 |
| `FindRwas` | 列出已注册的现实世界资产批次。 |

## 托管与证明记录 {#escrow-and-proof-records}

托管查询用于检查[原生资产托管 ISIs](/zh-hans/blockchain/escrow.md)创建的记录，包括市场托管、通用资产锁定和匿名托管记录。

| 查询 | 用途 |
| --- | --- |
| `FindAssetEscrows` | 列出资产托管记录。 |
| `FindAssetEscrowById` | 按 ID 查找一个资产托管记录。 |
| `FindAssetEscrowsBySeller` | 按卖方列出资产托管记录。 |
| `FindAssetEscrowsByBuyer` | 按买方列出资产托管记录。 |
| `FindAssetEscrowsByStatus` | 按状态列出资产托管记录。 |
| `FindAnonymousAssetEscrows` | 列出匿名资产托管记录。 |
| `FindAnonymousAssetEscrowById` | 按 ID 查找一个匿名资产托管记录。 |
| `FindAnonymousAssetEscrowsBySeller` | 按卖方列出匿名托管记录。 |
| `FindAnonymousAssetEscrowsByBuyer` | 按买方列出匿名托管记录。 |
| `FindAnonymousAssetEscrowsByStatus` | 按状态列出匿名托管记录。 |
| `FindProofRecordById` | 按 ID 查找一个证明记录。 |
| `FindProofRecords` | 列出证明记录。 |
| `FindProofRecordsByBackend` | 列出某证明后端的证明记录。 |
| `FindProofRecordsByStatus` | 按状态列出证明记录。 |

## Nexus、数据可用性与包 {#nexus-data-availability-and-packages}

| 查询 | 用途 |
| --- | --- |
| `FindRepoAgreements` | 列出存储在链上的仓库协议。 |
| `FindTwitterBindingByHash` | 按哈希解析 Twitter 绑定。 |
| `FindDaPinIntentByTicket` | 按票据查找数据可用性固定意图。 |
| `FindDaPinIntentByManifest` | 按清单引用查找固定意图。 |
| `FindDaPinIntentByAlias` | 按别名查找固定意图。 |
| `FindDaPinIntentByLaneEpochSequence` | 按通道、纪元和序号查找固定意图。 |
| `FindLaneRelayEnvelopeByRef` | 查找经过验证的通道中继信封。 |
| `FindSorafsProviderOwner` | 解析 SoraFS 提供商的所有者。 |
| `FindDataspaceNameOwnerById` | 解析数据空间名称的所有者。 |
| `FindMusubiReleaseByRef` | 按引用查找 Musubi 发行版。 |
| `FindMusubiPackageVersions` | 列出 Musubi 包的版本。 |
| `FindMusubiPackageReleases` | 列出 Musubi 包的发行版。 |
| `FindMusubiShortAliasByName` | 解析 Musubi 短别名。 |

## 触发器、合约、交易与区块 {#triggers-contracts-transactions-and-blocks}

| 查询 | 用途 |
| --- | --- |
| `FindActiveTriggerIds` | 列出活动触发器 IDs。 |
| `FindTriggers` | 列出触发器。 |
| `FindTriggerById` | 按 ID 查找一个触发器。 |
| `FindContractManifestByCodeHash` | 按代码哈希查找智能合约清单。 |
| `FindTransactions` | 列出已完成共识提交的交易。 |
| `FindBlocks` | 列出区块。 |
| `FindBlockHeaders` | 列出区块头。 |

## 筛选与分页 {#filtering-and-pagination}

可迭代查询可以提供谓词和选择器支持。请使用 SDK 中针对具体查询的强类型筛选器，确保筛选输入与查询输出类型匹配。对于大型结果集，请使用游标和限制等查询参数，而不要一次提取所有数据行。
