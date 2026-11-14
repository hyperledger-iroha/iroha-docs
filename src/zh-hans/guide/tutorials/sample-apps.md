---
translation_locale: zh-hans
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 50fac5ad01faf8d09441cba90f29472da04630dbeb3c80111a19f3fb50bb1224
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# 样本和操作指南 {#samples-and-recipes}

Iroha 源存储库包含 SDK 操作指南和测试套件,跟踪与节点相同的修订.

## JavaScript 操作指南 {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) 包含确定性交易批处理、SORA Nexus 应用转账、NFT 和账户迭代、ISO 网桥流程以及 Torii 流式传输的针对性示例。每个示例都会说明它是离线运行，还是需要实时 Torii 端点。

## Swift 和iOS {#swift-and-ios}

使用 `IrohaSwift/Tests/IrohaSwiftTests` 对于与电流相比验证的例子 Swift SDK. 查看 [Swift 和iOS](/zh-hans/guide/tutorials/swift.md) 用于包装和桥梁安装.

## Android {#android}

对于新的 Android 工作,使用 Kotlin-first `core-jvm`, `client-android`和 `kagemusha-wallet-android`模块,描述在 [Kotlin, Android 和Java](/zh-hans/guide/tutorials/kotlin-java.md). Kotlin SDK 是 Android 消费者的规范起点.
