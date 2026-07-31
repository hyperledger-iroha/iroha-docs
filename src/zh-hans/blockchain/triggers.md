---
translation_locale: zh-hans
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触发器 {#triggers}

触发器将事件过器绑定到可执行的操作.当事件匹配时
触发器的过器, Iroha 作为区块的一部分,评估触发作用
执行.

## 结构 {#structure}

已注册的 `Trigger` 含有:

- `id`: 一个 `TriggerId` 包装一个 `Name`
- `action`: 执行性,权威性,过性,重复政策,重试政策
  和元数据

该行动包括:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, 或 `IvmProved`
- `repeats`: `Indefinitely` 或 `Exactly(n)`
- `authority`: 调用可执行的帐户
- `filter`: 一个 `EventFilterBox`
- `retry_policy`: 预定时间触发器的可选重试行为
- `metadata`: 任意触发器元数据

## 事件过器 {#event-filters}

触发条件使用与订阅相同的事件过模型.
顶级事件过器可以匹配:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件
- 触发完成事件

选择最窄的过器,适合工作流程.
在区块执行过程中增加工作.

看看 [过器](/zh-hans/blockchain/filters.md) 对于当前的过器家族.

## 时间触发 {#time-triggers}

时机触发器使用时间事件过器.
匹配时间条件, Iroha 在触发器下执行触发器操作
时间触发器是可以使用重试政策的触发器类型
下面所述.

## 重复 {#repetition}

`Repeats::Indefinitely` 保持触发器活跃,直到它未被注册.

`Repeats::Exactly(n)` 让触发器射出固定数次.
如果需要同样的行为,请注册新的触发器.
再一次.

## 授权和许可 {#authority-and-permissions}

引发权限是使用的帐户来调用可执行.
为长寿命触发器提供专用技术帐户,以便获得所需许可
经营者个人账户的数据是明确的,并与其隔离.

该机构需要执行指令所要求的许可证或
登记触发器的帐户也需要许可
在主动运行时间验证器下注册触发器.

## 复试政策 {#retry-policy}

时间触发器可以选择重试政策.

- `max_retries`: 在初步失败后,允许重新尝试的数量
  射击
- `retry_after_ms`: 时间 Iroha 在重新试验成为符合条件之前等待

如果重新尝试的预算已经耗尽,

## 问题 {#queries}

使用当前触发查询检查触发状态:

- [`FindTriggers`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)

查看以下内容:

- [事件触发器例](/zh-hans/blockchain/trigger-examples.md)
- [事件](/zh-hans/blockchain/events.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证](/zh-hans/blockchain/permissions.md)
