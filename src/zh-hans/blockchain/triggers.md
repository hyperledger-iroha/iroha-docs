---
translation_locale: zh-hans
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触发器 {#triggers}

触发器将事件过滤器绑定到可执行的操作. 当事件与触发器的过滤器匹配时, Iroha 将触发器操作作为区块执行的一部分进行评估.

## 结构 {#structure}

已注册的 `Trigger` 包含:

- `id`：封装 `Name` 的 `TriggerId`
- `action`:可执行,授权主体,过滤器,重复政策,重新尝试政策和元数据

该行动包括:

- `executable`: `Instructions`,`ContractCall`, `Ivm`或 `IvmProved`
- `repeats`: `Indefinitely`或`Exactly(n)`
- `authority`:指引可执行的账户
- `filter`:一个 `EventFilterBox`
- `retry_policy`:规定的时间触发器的可选重新试验行为
- `metadata`:任意的触发器元数据

## 事件过滤器 {#event-filters}

触发器条件使用与订阅相同的事件过滤模型.最高级事件过滤器可以匹配:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件
- 触发完成事件

最适合工作流程的最小过滤器. 宽过滤器对于诊断有用,但它们在区块执行过程中增加工作.

目前的过滤器家庭见 [过滤器](/zh-hans/blockchain/filters.md).

## 时间触发器 {#time-triggers}

时间触发器使用时间事件过滤器.当世界状态视图达到匹配的时间条件时, Iroha 会在触发器权限下执行触发器操作.时间触发程序是可以使用下面描述的重试政策的触发器类型.

## 重复 {#repetition}

`Repeats::Indefinitely`将触发器保持活跃,直到它没有注册.

`Repeats::Exactly(n)` 允许 trigger 触发固定次数。次数用尽后，如果仍需要相同行为，请注册新的 trigger。

## 授权主体和许可证 {#authority-and-permissions}

触发器 authority 是调用 executable 时使用的账户。对于长期运行的触发器，请使用专用技术账户，使所需权限明确，并与运营人员的个人账户隔离。

权限主体需要执行指令或合同调用所要求的权限. 注册触发器的帐户还需要在活跃运行时验证器下注册触发符的许可.

## 重试策略 {#retry-policy}

时间触发器可以选择启用重试策略。重试策略包含：

- `max_retries`：首次触发失败后允许的重试次数
- `retry_after_ms`：Iroha 在下一次重试符合执行条件前等待的时间

重试次数耗尽后，系统会注销该触发器。

## 查询 {#queries}

使用当前的触发器查询检查触发状态:

- [`FindTriggers`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/zh-hans/reference/queries.md#triggers-contracts-transactions-and-blocks)

此外,请参见:

- [事件触发器示例](/zh-hans/blockchain/trigger-examples.md)
- [事件](/zh-hans/blockchain/events.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证](/zh-hans/blockchain/permissions.md)
