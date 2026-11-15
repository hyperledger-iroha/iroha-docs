---
translation_locale: ja
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 50fac5ad01faf8d09441cba90f29472da04630dbeb3c80111a19f3fb50bb1224
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# サンプルとレシピ {#samples-and-recipes}

Iroha ソースリポジトリには、ノードと同じリビジョンを追跡する SDK のレシピとテストスイートが含まれています。

## JavaScript レシピ {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) 決定論的なトランザクションバッチ処理のための具体的な例を含んでいます、 SORA Nexus アプリの転送 NFT およびアカウントの反復、 ISO 橋が流れ、そして Torii ストリーミング。各レシピは、オフラインで実行できるか、ライブが必要かを記録します Torii API エンドポイント。

## Swift と iOS {#swift-and-ios}

現在の Swift SDK に対して確認された例には `IrohaSwift/Tests/IrohaSwiftTests` を使用してください。パッケージおよびブリッジの設定については [Swift と iOS](/ja/guide/tutorials/swift.md) を参照してください。

## Android {#android}

新しい Android 作業には、[Kotlin、Android、そしてJava](/ja/guide/tutorials/kotlin-java.md)で説明されている Kotlin-最初の`core-jvm`、`client-android`、および`kagemusha-wallet-android`モジュールを使用してください。Kotlin SDK は、Android の消費者にとって標準的な出発点です。
