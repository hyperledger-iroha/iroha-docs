---
translation_locale: zh-hans
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触发器 {#triggers}

触发器将事件过器绑定到可执行的操作. 当事件与触发器的过器匹配时, Iroha 将触发器操作作为区块执行的一部分进行评估.

## 结构 {#structure}

已注册的 `Trigger` 包含:

- `id`:一个`TriggerId`包装一个 `Name`
- `action`:可执行,权威,过器,重复政策,重新尝试政策和元数据

该行动包括:

- `executable`: `Instructions`,`ContractCall`, `Ivm`或 `IvmProved`
- `repeats`: `Indefinitely`或`Exactly(n)`
- `authority`:指引可执行的账户
- `filter`:一个 `EventFilterBox`
- `retry_policy`:规定的时间触发器的可选重新试验行为
- `metadata`:任意的触发器元数据

## 事件过器 {#event-filters}

触发器条件使用与订阅相同的事件过模型.最高级事件过器可以匹配:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件
- 触发完成事件

最适合工作流程的最小过器. 宽过器对于诊断有用,但它们在区块执行过程中增加工作.

目前的过器家庭见 [过器](/zh-hans/blockchain/filters.md).

## 时间触发器 {#time-triggers}

时间触发器使用时间事件过器.当世界状态视图达到匹配的时间条件时, Iroha 会在触发器权限下执行触发器操作.时间触发程序是可以使用下面描述的重试政策的触发器类型.

## 重复 {#repetition}

`Repeats::Indefinitely`将触发器保持活跃,直到它没有注册.

`Repeats::Exactly(n)` 让触发器射出一定数次. 当数量是如果再次需要同样的行为,请注册一个新的触发.

## 权威和许可证 {#authority-and-permissions}

引发权力是用来调用可执行的帐户.用专用的技术帐户来实现长寿命的触发器,许可证是明确的,并从运营商个人帐户中隔离.

当局需要执行指令或合同调用所要求的权限. 注册触发器的帐户还需要在活跃运行时间验证器下注册触发符的许可.

## 复试政策 {#retry-policy}

时间触发器可以选择重试政策. 重试政策设置:

- `max_retries`:在初次失败发射后,允许多次重试.
- `retry_after_ms`:Iroha 在重新试验获得资格之前等待多长时间

当重新尝试的预算耗尽时,触发器不注册.

## 问题 {#queries}

使用当前的触发器查询检查触发状态:

- [`FindTriggers`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)

此外,请参见:

- [事件触发器示例](/zh-hans/blockchain/trigger-examples.md)
- [事件](/zh-hans/blockchain/events.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证](/zh-hans/blockchain/permissions.md)
