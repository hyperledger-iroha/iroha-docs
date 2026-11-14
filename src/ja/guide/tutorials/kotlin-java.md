---
translation_locale: ja
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin、Android、そしてJava {#kotlin-android-and-java}

Kotlin SDK は、JVM および Android アプリケーションのデフォルトのクライアントスタックです。これは Iroha リポジトリの`kotlin/`の下にあり、プラットフォームごとに分割されているため、ポータブルコードは Android 依存関係を取得しません。

## モジュール {#modules}

|人工遺物|タイプ|使用する|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |ピュア Kotlin/JVM Norito、データモデル、暗号、トランザクション、Torii、およびプロトコルコード|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android キーストア、デバイステレメトリ、および JNI 支持のクライアント統合|
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android オフラインウォレットの輸送および統合は `client-android` 上に構築されています|

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` は Android の依存関係を含みません。Android クライアントとキーストアのコードは `client-android` に保持し、`kagemusha-wallet-android` を Android 専用のオフラインウォレットおよび JNI フローに使用してください。

## Kotlin と Java の互換性 {#kotlin-and-java-compatibility}

公開 API は Kotlin を第一とし、Java の呼び出し元に対する正規の実装です。`core-jvm` 内の Java ソースのコンシューマーテストがこれを直接検証します。`java/` ツリーには、Kotlin モジュールへの統合によって廃止が進められている重複実装が含まれています。新しい Android の統合は、上記の Kotlin アーティファクトから始めるべきです。

すべての Kotlin モジュールは、ビルドツールチェーン自体が JDK 21 を使用しているにもかかわらず、コンパイル時に `-Xjdk-release=8` との JDK 8 API 互換性を強制します。SDK コードでは JDK 9+ APIs を使用しないでください。

## 構築とテスト {#build-and-test}

Kotlin SDK の README に記載されているとおり、同一ソースからビルドした `connect_norito_bridge` ライブラリを `IROHA_NATIVE_LIBRARY_PATH` に、`kotlin-fixture-gen` を `IROHA_KOTLIN_FIXTURE_GEN_BIN` に指定して JVM テストを実行します。これらがないと、ネイティブに依存するテストは失敗します：

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android アーティファクトを構築する:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## 現在のカバレッジ {#current-coverage}

Kotlin SDK には以下が含まれます：

- Norito エンコードとデコード
- 標準的なアカウントおよび資産アドレスの処理
- トランザクションの作成、署名、オフラインデータコンテナ
- Torii、HTTP、WebSocket、および SSE のクライアント
- マルチシグネチャ、サブスクリプション、SoraFS、SORA Nexus、およびConnectモデル
- Android キーストアおよびデバイステレメトリ統合
- Android オフライン QR、近く、および NFC 輸送

モジュール固有の APIs や正確なビルドコマンドについては、[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md)を参照してください。
