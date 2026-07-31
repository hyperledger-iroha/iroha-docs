---
translation_locale: zh-hans
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 术语,条件,逻辑 {#expressions-conditionals-logic}

所有的 [Iroha 特别指示](./instructions.md) 在表达式上运行.
每个表达式都有一个 `EvaluatesTo`, 在教学中使用
虽然您可以直接指定帐户名称,
也指定账户 ID 通过一些数学或弦运算.
可以检查一个账户是否注册在区块链上.

使用实现的表达式 `EvaluatesTo<bool>`, 你可以设置
在链上执行更复杂的操作.
例如,您可以提交一个 `Mint` 只有在特定账户中进行指令
已注册.

请记住,你可以将此与查询结合起来,
区块链可以做一些惊人的东西. _聪明
合同_, 区块链的先进使用的定义特征
技术.
