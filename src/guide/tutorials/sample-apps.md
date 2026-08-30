# Samples and Recipes

The Iroha source repository contains SDK recipes and test suites that track the
same revision as the node.

## JavaScript Recipes

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes)
contains focused examples for deterministic transaction batching, Nexus app
transfers, NFT and account iteration, ISO bridge flows, and Torii streaming.
Each recipe documents whether it runs offline or needs a live Torii endpoint.

## Swift and iOS

Use `IrohaSwift/Tests/IrohaSwiftTests` for examples verified against the current
Swift SDK. See [Swift and iOS](/guide/tutorials/swift.md) for package and bridge
setup.

## Android

For new Android work, use the Kotlin-first `core-jvm`, `client-android`, and
`offline-wallet-android` modules described in
[Kotlin, Android, and Java](/guide/tutorials/kotlin-java.md). The Kotlin SDK is
the canonical starting point for Android consumers.
