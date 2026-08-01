---
translation_locale: zh-hans
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 语法,条件,逻辑 {#expressions-conditionals-logic}

所有 [Iroha 特殊指令](./instructions.md)都运行于表达式.每个表达式都有一个 `EvaluatesTo`,用于执行指令.虽然您可以直接指定帐户名称,但也可以通过某种数学或字符串操作来指定账户 ID.

使用实现 `EvaluatesTo<bool>`的表达式,您可以设置条件逻辑并在链上执行更复杂的操作.例如,只需注册特定帐户才能提交一个 `Mint` 指令.

记住,你可以将这结合到询问.因此,可以编程区块链来做一些惊人的东西.这就是我们所谓的智能合同, 区块链技术的先进使用的定义特征.
