---
translation_locale: ja
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# サンプルとレシピ {#samples-and-recipes}

Iroha ソースリポジトリには、ノードと同じリビジョンを追跡する SDK のレシピとテストスイートが含まれています。

## JavaScript レシピ {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) 決定論的なトランザクションバッチ処理のための具体的な例を含んでいます、 Nexus アプリの転送 NFT およびアカウントの反復、 ISO 橋が流れ、そして Torii ストリーミング。各レシピは、オフラインで実行できるか、ライブが必要かを記録します Torii API エンドポイント。

## Swift と iOS {#swift-and-ios}

現在の Swift SDK に対して確認された例には `IrohaSwift/Tests/IrohaSwiftTests` を使用してください。パッケージおよびブリッジの設定については [Swift と iOS](/ja/guide/tutorials/swift.md) を参照してください。

## Android {#android}

新しい Android 作業には、[Kotlin、Android、そしてJava](/ja/guide/tutorials/kotlin-java.md)で説明されている Kotlin-最初の`core-jvm`、`client-android`、および`offline-wallet-android`モジュールを使用してください。Kotlin SDK は、Android の消費者にとって標準的な出発点です。
