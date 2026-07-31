---
translation_locale: zh-hans
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 智能合同 {#smart-contracts}

Iroha 执行交易 `Executable` 目前的数据模型
支持:

- `Executable::Instructions`: 一个顺序的集合 Iroha 特别指示
- `Executable::ContractCall`: 对部署的合同的附属参考调用
  实例
- `Executable::Ivm`: Iroha VM 字节码
- `Executable::IvmProved`: Iroha VM 有预先计算的指令的字节码
  覆盖和证明承诺

Kotodama 是 Iroha 一个高层智能合同语言. `.ko` 源文件
编译到确定性 IVM 常规存储为 `.to`
用于部署的文物. Kotodama 目标 IVM; 它不是一个独立的 RISC-V
或 WebAssembly 目标.

第一个版本只支持 ABI 系统调用和指针 ABI
通过接受和执行合同无条件地执行该政策;
没有运行时间兼容性转换.

## 什么时候使用智能合同 {#when-to-use-smart-contracts}

使用正常指令,当交易可以直接表达时:

- 登记或撤销的物体
- 货币,燃烧或转移资产
- 更新元数据
- 授予或撤销许可
- 执行触发器
- 在链上设置的参数

使用智能合同,当交易需要包装逻辑时
难以用静态指令序列表达,或者在部署
应通过参考调用合同案例.

## IVM 执行式 {#ivm-executables}

`Executable::Ivm` 携带原料 IVM 节点将该节码执行在内
设置链的运行时间限制.
确定性;合同是交易执行的一部分,因此影响
总共识.

`Executable::IvmProved` 适用于防流,载有:

- IVM 字节码
- 确定性指令覆盖
- 执行事件承诺
- 气体政策承诺

证据将覆盖链绑定到执行的字节码.
验证者可以验证证明和重播执行作为额外的
安全检查.

## 部署的合同调用 {#deployed-contract-calls}

`Executable::ContractCall` 通过地址调用部署的合同实例.
使用此时,合同代码是单独注册的,
在每次运载字节代码的同时,

## 运营指导 {#operational-guidance}

- 合同行为不应依赖于本地
  壁表时间,主机文件系统状态,网络调用或其他同行本地
  输入.
- 保持有效载荷紧.大字节代码增加交易规模和区块
  传播成本.
- 对于简单的账本更改,更喜欢输入指令.
  审计和执行更便宜.
- 对合同升级和注册许可证视为高风险
  操作控制.

查看以下内容:

- [指示](/zh-hans/blockchain/instructions.md)
- [触发器](/zh-hans/blockchain/triggers.md)
- [许可证](/zh-hans/blockchain/permissions.md)
- [数据模型方案](/zh-hans/reference/data-model-schema.md)
