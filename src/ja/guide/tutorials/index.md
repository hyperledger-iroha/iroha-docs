---
translation_locale: ja
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK チュートリアル {#sdk-tutorials}

これらのページは,主要な作業空間から送信された Iroha 3 クライアントエントリーポイントを概要する. 標準的なパッケージ名,インストール経路,最小の出発点を含む.

## 推奨命令 {#recommended-order}

1. [Iroha 3](/ja/get-started/install-iroha.md)をインストールする
2. [打ち上げ Iroha 3](/ja/get-started/launch-iroha.md)
3. SDK を選択する.
   - [Rust](/ja/guide/tutorials/rust.md)
   - [Python](/ja/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ja/guide/tutorials/javascript.md)
   - [Kotlin,Android,およびJava](/ja/guide/tutorials/kotlin-java.md)
   - [Swift およびiOS](/ja/guide/tutorials/swift.md)
4. [サンプルアプリ](/ja/guide/tutorials/sample-apps.md) を,完全なクライアントアプリケーション参照を希望するときにレビューします.
5. [Embed Kaigi](/ja/guide/tutorials/kaigi.md) を使って,自分のアプリにウォレットサポートされたオーディオ/ビデオ会議を追加したいとき.
6. [Musubi パッケージ](/ja/guide/tutorials/musubi.md) を使って,再利用可能な Kotodama ソースライブラリを鎖内登録依存関係に固定するときに使用します.

## サンプル {#samples}

上流作業空間には JavaScript レシピと Swift/iOSサンプルプロジェクトが含まれます. Android については,Kotlin SDK モジュールとその試験から始めましょう.

- [アプリのサンプル概要](/ja/guide/tutorials/sample-apps.md)
- [埋め込み Kaigi a で JavaScript アプリ](/ja/guide/tutorials/kaigi.md)

## 真理 の 源泉 {#source-of-truth}

SDK のすべてのページは,現在の上流作業空間から派生されている.

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java鏡は Kotlin-第1回 Android 表面である)
- `IrohaSwift`
- `crates/musubi`

README とパッケージメタデータを優先してください. これらのディレクトリでは,作成中のソース修正を記述します.
