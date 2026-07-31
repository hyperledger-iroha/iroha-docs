---
translation_locale: zh-hans
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 过器 {#filters}

过缩事件流和触发条件.
事件过器是 `EventFilterBox`, 可以匹配这些事件家庭:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

使用最窄的过器来匹配工作流程.
`DataEventFilter::Any` 对于诊断来说,它们是有用的.
支付触发器或订阅者匹配成本.

## 数据事件过器 {#data-event-filters}

`DataEventFilter` 与本书数据事件相匹配.目前的变体包括:

| 变量 | 事件家族 |
| --- | --- |
| `Any` | 任何数据事件 |
| `Peer` | 同龄人生命周期事件 |
| `Domain` | 域生命周期和元数据事件 |
| `Account` | 账户生命周期,元数据,号和身份事件 |
| `Asset` | 资产平衡和元数据事件 |
| `AssetDefinition` | 资产定义生命周期,政策和元数据事件 |
| `Nft` | NFT 生命周期和元数据事件 |
| `Rwa` | 现实资产生命周期事件 |
| `Trigger` | 触发器生命周期和元数据事件 |
| `Role` | 角色生命周期事件 |
| `Configuration` | 连锁配置事件 |
| `Executor` | 运行时间执行器事件 |
| `Proof` | 证据验证生命周期事件 |
| `Confidential` | 机密资产事件 |
| `VerifyingKey` | 验证密钥登记事件 |
| `RuntimeUpgrade` | 运行时间升级事件 |
| `Soradns` | 解决目录管理事件 |
| `Sorafs` | SoraFS 网关合规事件 |
| `SpaceDirectory` | 空间目录表生命周期事件 |
| `Escrow` | 透明的本地资产托管生命周期事件 |
| `Offline` | 离线结算活动 |
| `Oracle` | Oracle 输送事件 |
| `Social` | 病毒激励事件 |
| `Bridge` | 桥梁活动 |
| `Governance` | 启用管理功能时的治理活动 |

大多数混凝土过器也允许可选 ID 一个相匹配的面具和一个事件设置面具.
例如,资产过器可以匹配一个资产或一类资产事件.
而触发器过器可以匹配触发器 ID 一个触发事件.

## 管道过器 {#pipeline-filters}

管道过器与处理事件相匹配,如区块,交易,合并,
用它们进行运营订阅,
仪表板和触发器,它们反应于管道状态而不是账本数据
这些物体.

## 触发器过器 {#trigger-filters}

触发器将其状态存储为 `EventFilterBox`. 一个触发作用也
商店:

- 一个可执行的
- 一项重复政策
- 一个权威账户
- 选择性时间触发器重试政策
- 大数据

引发权威必须具备可执行器所要求的许可.
对于长寿命的触发器,更喜欢专用技术账户.

## 查询过器 {#query-filters}

查询过器与事件过器分开.可反复的查询可以暴露
使用查询特定类型的过器 SDK
所以过器输入与查询输出类型相匹配.

查看以下内容:

- [事件](/zh-hans/blockchain/events.md)
- [产业资产抵押](/zh-hans/blockchain/escrow.md#queries-and-events)
- [触发器](/zh-hans/blockchain/triggers.md)
- [问题](/zh-hans/blockchain/queries.md)
- [查询参考](/zh-hans/reference/queries.md)
