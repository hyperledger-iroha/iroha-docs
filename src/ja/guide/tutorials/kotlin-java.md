---
translation_locale: ja
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin,Android,およびJava {#kotlin-android-and-java}

労働組合 Kotlin SDK のデフォルトクライアントスタックです. JVM そして Android 適用される. `kotlin/` について Iroha リポジトリとプラットフォームによって分割されているので,ポータブルコードは取得しない Android 依存性について

## モジュール {#modules}

|芸術品|タイプ|使用する|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm`|JAR|純粋 Kotlin/JVM Norito,データモデル,暗号化,取引, Torii,およびプロトコルコード |
|`org.hyperledger.iroha.sdk:client-android`|AAR|Android キーストア,デバイステレメトリ,および JNI サポートされたクライアント統合 |
|`org.hyperledger.iroha.sdk:offline-wallet-android`|AAR|Android `client-android` に基づいたオフライン財布輸送と統合|

文物はまだマヴェン・セントラルに公開されていません. 固定された Iroha ソース修正から本地で構築して公開してください:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

その後,アプリケーションが必要とするアーテファクトのみを選択します:

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

`core-jvm` には Android 依存関係がない. Android クライアントおよびキーストアコードを `client-android` に保存し, Android オフラインウォレットと JNI ストリームにのみ `offline-wallet-android` を使用する.

## Kotlin とJavaの互換性 {#kotlin-and-java-compatibility}

公衆 API は Kotlin- はじめにJavaのインターオップを提供します JVM 連絡先は必要だ 同等の変更は,対応する `java/` の実施で反映されます. Android の新しい統合は,上記の Kotlin アーテファクトから開始されるべきである.

全員 Kotlin モジュールは執行する JDK 8 API 作成時に互換性 `-Xjdk-release=8`, 組み立てツールチェーン自体は使用する JDK 21. 使用しないでください JDK 9+ APIs 中 SDK コードだ

## 建設 し,試す {#build-and-test}

携帯型 JVM テストを実行する.

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android 文具を造る:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 現在 の 対象 {#current-coverage}

Kotlin SDK は以下のものを含む.

- Norito 暗号化および解読
- カノニカル・アカウントと資産アドレスの管理
- 取引構築,署名,オフライン封筒
- Torii HTTP, WebSocket,および SSE の顧客
- マルチサイン,サブスクリプション, SoraFS, Nexus,そしてConnectモデル
- Android キーストアとデバイスのテレメトリ統合
- Android オフライン QR,近辺,および NFC 輸送

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)は,モジュール特有の APIs と正確なビルドコマンドを参照してください.
