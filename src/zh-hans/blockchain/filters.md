---
translation_locale: zh-hans
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 过滤器 {#filters}

过滤器可缩小事件流和触发条件的范围。当前的顶层事件过滤器是 `EventFilterBox`，可匹配下列事件系列：

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

使用与工作流程相匹配的最窄的过滤器. `DataEventFilter::Any`等宽过滤器对于诊断有用,但它们使每个事件都支付了触发或订阅者匹配的成本.

## 数据事件过滤器 {#data-event-filters}

`DataEventFilter`与账本数据事件相匹配.其当前的变体包括:

|变量|事件家族|
| --- | --- |
|`Any`|任何数据事件|
|`Peer`|对等节点生命周期事件|
|`Domain`|域的生命周期和元数据事件|
|`Account`|账户生命周期,元数据,号和身份事件|
|`Asset`|资产余额和元数据事件 |
|`AssetDefinition`|资产定义生命周期,政策和元数据事件|
|`Nft`|NFT 生命周期和元数据事件 |
|`Rwa`|现实世界资产生命周期事件|
|`Trigger`|触发生命周期和元数据事件|
|`Role`|角色生命周期事件|
|`Configuration`|链上配置事件|
|`Executor`|运行时执行器事件|
|`Proof`|证明验证生命周期事件|
|`Confidential`|机密资产事件|
|`VerifyingKey`|验证密钥登记事件|
|`RuntimeUpgrade`|运行时升级事件|
|`Soradns`|解决目录管理事件|
|`Sorafs`|SoraFS 门户合规事件|
|`SpaceDirectory`|空间目录表现生命周期事件|
|`Escrow`|透明的本地资产托管生命周期事件 |
|`Offline`|线下结算活动|
|`Oracle`|Oracle的源事件|
|`Social`|病毒激励活动|
|`Bridge`|桥梁活动|
|`Governance`|管理功能启用时的治理事件 |

大多数具体过滤器还允许可选的 ID 匹配器和事件设置面具.例如,资产过滤器可以匹配一个资产或一类资产事件,而触发器过滤器则可以匹配触发器 ID 和触发事件集.

## 管道过滤器 {#pipeline-filters}

管道过滤器与区块,交易,合并和见证事件等处理事件相匹配.使用它们用于运营订阅,区块处理仪表板以及反应于管道状态而不是账本数据对象的触发器.

## 触发器过滤器 {#trigger-filters}

触发器存储其状态为 `EventFilterBox`.触发器操作还存储:

- 一个可执行的
- 一项重复政策
- 一个授权主体账户
- 可选的时间触发器重试政策
- 超级数据

发动机必须具备可执行器所需的权限. 优先考虑专用技术账户,而不是长期发动机.

## 查询过滤器 {#query-filters}

查询过滤器与事件过滤器分开.可迭代查询可以提供谓词和选择器支持.使用来自 SDK 的查询特定类型的过滤器,以便过滤器输入匹配查询输出类型.

此外,请参见:

- [事件](/zh-hans/blockchain/events.md)
- [产业资产保证](/zh-hans/blockchain/escrow.md#queries-and-events)
- [触发器](/zh-hans/blockchain/triggers.md)
- [查询](/zh-hans/blockchain/queries.md)
- [查询参考](/zh-hans/reference/queries.md)
