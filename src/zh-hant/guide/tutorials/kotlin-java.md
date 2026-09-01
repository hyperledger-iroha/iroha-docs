---
translation_locale: zh-hant
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin,Android 和Java {#kotlin-android-and-java}

Kotlin SDK 是 JVM 和 Android 應用程式的預設客戶端堆.它在 Iroha 儲存庫中存在於 `kotlin/` 下,並按平臺分開,因此便攜程式碼不會獲得 Android 依賴性.

## 模組 {#modules}

|藝術品|型別|使用|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm`|JAR|純 Kotlin/JVM Norito,資料模型,加密貨幣,交易, Torii 和協議程式碼 |
|`org.hyperledger.iroha.sdk:client-android`|AAR|Android 關鍵儲存,裝置遠端測量和 JNI 支援的客戶端整合|
|`org.hyperledger.iroha.sdk:offline-wallet-android`|AAR|Android 基於`client-android`的離線錢包運輸和整合|

這些構件還沒有在Maven Central上釋出. 從注入的 Iroha 來源修改中構建並本地釋出:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

然後只選擇應用程式所需的成品：

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

`core-jvm`不包含 Android 的依賴性.在 `client-android`中儲存 Android 客戶端和金鑰儲存程式碼,並且僅使用`offline-wallet-android`用於 Android 的離線錢包和 JNI 流.

## Kotlin 和Java相容性 {#kotlin-and-java-compatibility}

公共 API 是 Kotlin 的首個,在 JVM 呼叫者需要時提供Java間接.相等變化反映在相應的 `java/`實現中.新的 Android 整合應該從上述 Kotlin 構件開始.

所有的 Kotlin 模組執行 JDK 8 API 編譯時與 `-Xjdk-release=8`, 儘管構建工具鏈本身使用 JDK 21. 不要使用 JDK 9+ APIs 在 SDK 這個程式碼.

## 建立和測試 {#build-and-test}

執行行動式 JVM 測試:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

建造 Android 的構件:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 目前覆蓋範圍 {#current-coverage}

在 Kotlin SDK 中包括:

- Norito 編碼和解碼
- 規範帳戶和資產地址處理
- 交易構建,簽署和離線封裝
- Torii HTTP,WebSocket 和 SSE 的客戶
- 多簽名,訂閱, SoraFS, Nexus 和連線型號
- Android 鍵儲存和裝置遠端測量整合
- Android 離線運輸 QR,附近運輸和 NFC

檢視[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)對模組特定的 APIs 和精確的構建命令.
