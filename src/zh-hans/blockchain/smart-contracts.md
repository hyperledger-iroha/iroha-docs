---
translation_locale: zh-hans
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 7c35c609442df65328fa619b6673be76f801cfc2abc28afd853d7fe61e439e9c
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
