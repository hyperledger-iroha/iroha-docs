---
translation_locale: zh-hans
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 样本和操作指南 {#samples-and-recipes}

Iroha 源存储库包含 SDK 操作指南和测试套件,跟踪与节点相同的修订.

## JavaScript 操作指南 {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) 包含确定性交易批处理、Nexus 应用转账、NFT 和账户迭代、ISO 网桥流程以及 Torii 流式传输的针对性示例。每个示例都会说明它是离线运行，还是需要实时 Torii 端点。

## Swift 和iOS {#swift-and-ios}

使用 `IrohaSwift/Tests/IrohaSwiftTests` 对于与电流相比验证的例子 Swift SDK. 查看 [Swift 和iOS](/zh-hans/guide/tutorials/swift.md) 用于包装和桥梁安装.

## Android {#android}

对于新的 Android 工作,使用 Kotlin-first `core-jvm`, `client-android`和 `offline-wallet-android`模块,描述在 [Kotlin, Android 和Java](/zh-hans/guide/tutorials/kotlin-java.md). Kotlin SDK 是 Android 消费者的规范起点.
