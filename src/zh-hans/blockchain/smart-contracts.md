---
translation_locale: zh-hans
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智能合同 {#smart-contracts}


Iroha 交易执行`Executable`的有效载荷.目前的数据模型支持:

- `Executable::Instructions`:一个顺序的 Iroha 特殊指令集
- `Executable::ContractCall`:向部署的合同实例进行附属参考调用
- `Executable::Ivm`:Iroha VM 字节码
- `Executable::IvmProved`:Iroha VM 字节码,具有预先计算的指令覆盖和证明承诺.

Kotodama 是 Iroha 一个高层级的智能合同语言 `.ko` 源文件编译到确定性 IVM 通常存储的字节码 `.to` 用于部署的构件. Kotodama 目标 IVM 没有针对性 RISC-V 或 WebAssembly.

第一个版本仅支持 ABI 版本 1. 系统调用和指针-ABI 政策是通过录取和执行执行的无条件 V1 合同;没有替代运行模式.

## 什么时候使用智能合同 {#when-to-use-smart-contracts}

在交易可以直接表达时,使用正常指令:

- 登记或撤销物件
- 铸造、销毁或转移资产
- 更新的元数据
- 授予或撤销许可证
- 执行触发器
- 设置链上参数

使用智能合同,当交易需要包装逻辑时难以将其表达为静态指令序列,或者如果部署的合约实例应该通过参考调用.

## IVM 执行式 {#ivm-executables}

`Executable::Ivm`载有原始的 IVM 字节码.节点执行该字节码在连锁配置的运行时限制内.保持字节码小和确定性;合同是交易执行的一部分,因此影响共识.

`Executable::IvmProved` 适用于检测载体流,它载有:

- IVM 字节码
- 一个确定性指令覆盖
- 执行事件承诺
- gas政策承诺

证明将重叠链接到执行的字节码. 根据管道政策,验证人员可以作为额外的安全检查来验证证明和重播执行.

## 部署的合同调用 {#deployed-contract-calls}

`Executable::ContractCall`通过地址调用部署的合同实例. 在合同代码被单独注册时,使用此指令,并且交易应以引用方式调用它,而不是每次携带字节代码.

## 合同使用周期和所有权 {#contract-lifecycle-and-ownership}

每个已部署地址都会保留一条 `ContractLifecycleControlV1` 记录，即使合约处于非活动状态也是如此。该记录包含不可变的首次部署来源、当前和待定所有者、任何可撤销的 Parliament 委托、活动代码哈希、非零比较交换修订版，以及任何保留的紧急暂停。直接部署会记录部署账户。Parliament 部署会记录其提议者、提案内容 ID 和成功的治理尝试 ID。

生命周期所有者可以是一个账户或 Parliament。账户所有权变更使用相互独立的要约和接受操作；接受要约会清除任何 Parliament 委托。账户所有者可以允许 Parliament 激活或停用合约，之后也可以撤销该委托，但委托绝不允许 Parliament 转移所有权。由 Parliament 拥有的变更和 Parliament 接受操作通过经过认证的治理效果实施。

原始 `ActivateContractInstance` 和 `DeactivateContractInstance` 指令仅供当前账户所有者使用。它们必须携带记录中完全匹配的 `expected_revision`；过时或为零的修订版会以失败关闭方式失败。原始激活无法创建生命周期记录，并且会在更改 `active_code_hash` 前验证已注册的工件、清单和 ABI。停用会清除活动代码哈希，但保留所有权和来源。每次成功的生命周期转换都会推进修订版并发出完整的转换后状态。

激活也可以在一个清单声明的生命周期子中进行. `EntryPointKind::Hajimari` 进入点 (`hajimari`/`始まり`) 阶段 `Hajimari`. 重新将一个活跃地址转换为其表包含一个 `EntryPointKind::Kaizen` 进入点 (`kaizen`/`改善`) 阶段 `Kaizen`. 约束力立即变化,但合同还没有完成: `Kotoage` 和 `View` 调用被拒绝直到确切的阶段式子成功.另一个激活也被拒绝,而子还在等待.

在同一合约地址和新代码哈希上，通过 `Executable::ContractCall` 调用分阶段的钩子，使用准确的 `hajimari` 或 `kaizen` 入口点以及清单声明的参数。运行时提供地址和选择器作用域的 `CanInvokeContractEntrypoint` 权限；调用者不得创建或授予该权限。待处理标记包含由运行时生成的确定性 `transition_id` 和新的 `code_hash`；`Kaizen` 标记还包含 `previous_code_hash`。客户端不得计算或提交 `transition_id`。钩子成功时以原子方式消耗该标记；失败时则保持待处理状态，以便稍后重试。

紧急级别议会的提案可以限制最多3600个区块,如果它绑定了当前的修订,代码哈希和非零事件摘要.从施加高度到,但不包括,过期高度.过期恢复执行,但不会删除保留.一个认证的 `CompleteEmergencyHoldRetrospective` 动作必须在记录清除之前绑定确切保留 IDs 和摘要加上非零发现根;另一个保留不能被强加,而后期仍未完成.

当应用程序 API 启动时,请用 `GET /v1/gov/contracts/{contract_address}`读取保留状态.其 `found` 字段意味着存在生命周期记录,而不是地址目前具有活跃代码.

## 运营指导 {#operational-guidance}

- 保持合约的确定性.合对等节点为不应取决于本地墙钟时间,主机文件系统状态,网络调用或其他对等节点本地输入.
- 请保持 payload 精简。大型 bytecode 会增加交易大小和区块传播成本。
- 对于简单的账本更改,最喜欢输入说明.它们的审计更容易,执行也更便宜.
- 将合同升级和注册许可作为高风险的操作控制.

此外,请参见:

- [指示](/zh-hans/blockchain/instructions.md)
- [触发器](/zh-hans/blockchain/triggers.md)
- [许可证](/zh-hans/blockchain/permissions.md)
- [数据模型方案](/zh-hans/reference/data-model-schema.md)
