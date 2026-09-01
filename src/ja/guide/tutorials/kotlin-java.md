---
translation_locale: ja
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin、Android、そしてJava {#kotlin-android-and-java}

Kotlin SDK は、JVM および Android アプリケーションのデフォルトのクライアントスタックです。これは Iroha リポジトリの`kotlin/`の下にあり、プラットフォームごとに分割されているため、ポータブルコードは Android 依存関係を取得しません。

## モジュール {#modules}

|人工遺物|タイプ|使用する|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |ピュア Kotlin/JVM Norito、データモデル、暗号、トランザクション、Torii、およびプロトコルコード|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android キーストア、デバイステレメトリ、および JNI 支持のクライアント統合|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android オフラインウォレットの輸送および統合は `client-android` 上に構築されています|

これらのアーティファクトはまだ Maven Central に公開されていません。固定された Iroha ソースリビジョンからローカルでビルドして公開してください:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

次に、アプリケーションに必要なアーティファクトだけを選択します:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` は Android の依存関係を含みません。Android クライアントとキーストアのコードは `client-android` に保持し、`offline-wallet-android` を Android 専用のオフラインウォレットおよび JNI フローに使用してください。

## Kotlin と Java の互換性 {#kotlin-and-java-compatibility}

公開されている API は Kotlin-優先で、JVM の要求するクライアントが必要とする場所でJavaの相互運用性を提供します。対応する`java/`の実装にも同等の変更が反映されています。新しい Android の統合は、上記の Kotlin アーティファクトから始めるべきです。

すべての Kotlin モジュールは、ビルドツールチェーン自体が JDK 21 を使用しているにもかかわらず、コンパイル時に `-Xjdk-release=8` との JDK 8 API 互換性を強制します。SDK コードでは JDK 9+ APIs を使用しないでください。

## 構築とテスト {#build-and-test}

ポータブル JVM テストを実行する：

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android アーティファクトを構築する:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 現在のカバレッジ {#current-coverage}

Kotlin SDK には以下が含まれます：

- Norito エンコードとデコード
- 標準的なアカウントおよび資産アドレスの処理
- トランザクションの作成、署名、オフラインデータコンテナ
- Torii、HTTP、WebSocket、および SSE のクライアント
- マルチシグネチャ、サブスクリプション、SoraFS、Nexus、およびConnectモデル
- Android キーストアおよびデバイステレメトリ統合
- Android オフライン QR、近く、および NFC 輸送

モジュール固有の APIs や正確なビルドコマンドについては、[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)を参照してください。
