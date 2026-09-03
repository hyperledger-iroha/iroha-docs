---
translation_locale: zh-hans
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智能合约 {#smart-contracts}

Iroha 交易执行 `Executable` 载荷。当前数据模型支持：

- `Executable::Instructions`：一组有序的 Iroha 特殊指令
- `Executable::ContractCall`：按引用调用已部署的合约实例
- `Executable::Ivm`：Iroha VM 字节码
- `Executable::IvmProved`：带有预计算指令叠加层和证明承诺的 Iroha VM 字节码

Kotodama 是 Iroha 的高级智能合约语言。`.ko` 源文件会编译为确定性的 IVM 字节码，部署时通常保存为 `.to` 制品。Kotodama 只以 IVM 为目标；它不以 RISC-V 或 WebAssembly 为目标。

首个版本仅支持 ABI 版本 1。合约准入和执行会无条件强制实施系统调用与指针 ABI 策略；不存在运行时兼容性开关。

## 何时使用智能合约 {#when-to-use-smart-contracts}

当交易可以直接表达时，请使用普通指令：

- 注册或注销对象
- 铸造、销毁或转移资产
- 更新元数据
- 授予或撤销权限
- 执行触发器
- 设置链上参数

当交易需要封装的逻辑、难以表达为静态指令序列，或者需要按引用调用已部署的合约实例时，请使用智能合约。

## IVM 可执行载荷 {#ivm-executables}

`Executable::Ivm` 携带原始 IVM 字节码。节点会在为链配置的运行时限制内执行这些字节码。请保持字节码精简且确定；合约属于交易执行的一部分，因此会影响共识。

`Executable::IvmProved` 用于携带证明的流程。它包含：

- IVM 字节码
- 确定性的指令叠加层
- 执行事件承诺
- gas 策略承诺

该证明将叠加层绑定到实际执行的字节码。根据流水线策略，验证者可以验证证明并重放执行，将其作为额外的安全检查。

## 已部署合约调用 {#deployed-contract-calls}

`Executable::ContractCall` 按地址调用已部署的合约实例。当合约代码已单独注册，且交易应按引用调用它而不是每次都携带字节码时，请使用此载荷。

## 合同使用周期和所有权 {#contract-lifecycle-and-ownership}

每个部署的地址都保留`ContractLifecycleControlV1`记录,包括合同不活跃期间.该记录包含不可变的首次部署来源,当前和即将到期的所有者,可撤销的议会代表团,活跃代码哈希,非零比较和交换修订;一个直接部署将提交账户分配为所有者,并记录它作为部署的来源. 一个议会部署将议会分配为所有人,并记录其提出者,提案内容 ID,和成功的治理尝试 ID 仅作为来源.

设置的保护名字空间为议会部署保留. `CanRegisterSmartContractCode` 允许对文物进行注册,但不允许直接部署或原始激活到受保护的名称空间中;首先必须通过欧洲议会认证的部署路径创建生命周期记录.

账户所有权变更使用 `OfferContractOwnership` 随后是悬而未决的所有者的 `AcceptContractOwnership`;现有所有者可以撤销一个 在 `CancelContractOwnershipOffer`中未接受的报价. 通过该报价,可批准议会任何代表团.在账户持有合同或正在悬而未决的报价时,将拒绝取消帐户.

账户所有者可以允许议会升级,激活或禁用合同,然后撤销该授权. 代表团永远不会允许议会转让所有权或更改代表团本身.通过经过认证的治理效应,由议会实施的变化和议会接受.

`ActivateContractInstance`和`DeactivateContractInstance`原始指令仅可供经常账户所有者使用.它们必须包含记录的确切 `expected_revision`;过时或零修订无法关闭.原始激活不能创建生命周期记录,它在改变 `active_code_hash`之前验证已注册的文物,表格和 ABI.每次成功的生命周期过渡都会推进修改,并发出完整的后状态.

紧急级别议会提案只能通过整个议会管道,至少有三分之二的政策陪审团席位获得"对"对"的选票".该选项绑定了当前的修订,代码哈希和非零事件消化,并持续最多3600块.它只能暂停调用和触发执行:它不能延长或更改代码,所有权或委托. 调用和匹配的触发执行被阻止从施加高度到,但不包括,过期高度.过期自动恢复执行,但不会删除保留.一个认证的 `CompleteEmergencyHoldRetrospective` 行动必须在记录清除之前绑定确切保留 IDs 和消化加上非零的发现根;直到追溯完成之前,不能强加另一次保留.

当应用程序 API 启动时,请用 `GET /v1/gov/contracts/{contract_address}`读取保留状态.其 `found` 字段意味着存在生命周期记录,而不是地址目前具有活跃代码.

## 运营指导 {#operational-guidance}

- 保持合约的确定性。合约行为不得依赖本地挂钟时间、主机文件系统状态、网络调用或其他仅存在于本地节点的输入。
- 保持载荷精简。大型字节码会增加交易大小和区块传播成本。
- 对于简单的账本更改，优先使用类型化指令。它们更易审计，执行成本也更低。
- 将合约升级与注册权限视为高风险的运维控制项。

此外,请参见:

- [指令](/zh-hans/blockchain/instructions.md)
- [触发器](/zh-hans/blockchain/triggers.md)
- [权限](/zh-hans/blockchain/permissions.md)
- [数据模型架构](/zh-hans/reference/data-model-schema.md)
