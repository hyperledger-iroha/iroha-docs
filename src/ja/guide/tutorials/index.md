---
translation_locale: ja
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK チュートリアル {#sdk-tutorials}

これらのページは、主要なワークスペースから出荷された Iroha 3 クライアントのエントリーポイントを要約しており、標準的なパッケージ名、インストールパス、最小の開始ポイントを含みます。

## 推奨順 {#recommended-order}

1. [Iroha 3 をインストールする](/ja/get-started/install-iroha.md)
2. [Iroha 3 を起動](/ja/get-started/launch-iroha.md)
3. SDK を選んでください：
   - [Rust](/ja/guide/tutorials/rust.md)
   - [Python](/ja/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ja/guide/tutorials/javascript.md)
   - [Kotlin、Android、そしてJava](/ja/guide/tutorials/kotlin-java.md)
   - [Swift と iOS](/ja/guide/tutorials/swift.md)
4. 完全なクライアントアプリケーションのリファレンスが必要なときは、[サンプルアプリ](/ja/guide/tutorials/sample-apps.md) を確認してください。
5. 自分のアプリにウォレット対応のオーディオ/ビデオ会議を追加したい場合は、[Kaigi を埋め込む](/ja/guide/tutorials/kaigi.md) を使用してください。
6. 再利用可能な Kotodama ソースライブラリが必要で、オンチェーンのレジストリ依存関係が固定されている場合は、[Musubi パッケージ](/ja/guide/tutorials/musubi.md) を使用してください。

## サンプル {#samples}

上流のワークスペースには JavaScript のレシピと Swift/iOSのサンプルプロジェクトが含まれています。Android については、Kotlin の SDK モジュールとそのテストから始めてください。

- [サンプルアプリの概要](/ja/guide/tutorials/sample-apps.md)
- [JavaScript アプリに Kaigi を埋め込む](/ja/guide/tutorials/kaigi.md)

## 真実の源 {#source-of-truth}

ここにあるすべての SDK ページは、現在のアップストリームワークスペースから派生しています：

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android`（Kotlin-最初の Android 表面のJavaミラー）
- `IrohaSwift`
- `crates/musubi`

迷ったときは、これらのディレクトリ内の README とパッケージメタデータを優先してください。それらは、あなたがビルドしているソースのリビジョンを記述しています。
