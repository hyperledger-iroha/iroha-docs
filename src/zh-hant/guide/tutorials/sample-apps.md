---
translation_locale: zh-hant
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 樣本和操作指南 {#samples-and-recipes}

Iroha 源儲存庫包含 SDK 操作指南和測試套件,跟蹤與節點相同的修訂.

## JavaScript 操作指南 {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) 包含確定性交易批次處理、Nexus 應用程式轉帳、NFT 和帳戶反覆運算、ISO 橋接流程，以及 Torii 串流的針對性範例。每個範例都會說明它是離線執行，還是需要即時 Torii 端點。

## Swift 和iOS {#swift-and-ios}

使用 `IrohaSwift/Tests/IrohaSwiftTests` 對於與電流相比驗證的例子 Swift SDK. 檢視 [Swift 和iOS](/zh-hant/guide/tutorials/swift.md) 用於包裝和橋樑安裝.

## Android {#android}

對於新的 Android 工作,使用 Kotlin-first `core-jvm`, `client-android`和 `offline-wallet-android`模組,描述在 [Kotlin, Android 和Java](/zh-hant/guide/tutorials/kotlin-java.md). Kotlin SDK 是 Android 消費者的規範起點.
