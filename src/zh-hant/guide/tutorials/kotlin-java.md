---
translation_locale: zh-hant
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin,Android 和Java {#kotlin-android-and-java}

Kotlin SDK 是 JVM 和 Android 應用程序的默認客戶端堆.它在 Iroha 存儲庫中存在於 `kotlin/` 下,並按平臺分開,因此便攜代碼不會獲得 Android 依賴性.

## 模塊 {#modules}

|藝術品|類型|使用|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm`|JAR|純 Kotlin/JVM Norito,數據模型,加密貨幣,交易, Torii 和協議代碼 |
|`org.hyperledger.iroha.sdk:client-android`|AAR|Android 關鍵存儲,設備遠程測量和 JNI 支持的客戶端集成|
|`org.hyperledger.iroha.sdk:offline-wallet-android`|AAR|Android 基於`client-android`的離線錢包運輸和集成|

這些文物還沒有在Maven Central上發佈. 從注入的 Iroha 來源修改中構建並本地發佈:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

然後選擇您的應用程序需要的文物:

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

`core-jvm`不包含 Android 的依賴性.在 `client-android`中保存 Android 客戶端和密鑰存儲代碼,並且僅使用`offline-wallet-android`用於 Android 的離線錢包和 JNI 流.

## Kotlin 和Java兼容性 {#kotlin-and-java-compatibility}

公共 API 是 Kotlin 的首個,在 JVM 調用者需要時提供Java間接.相等變化反映在相應的 `java/`實現中.新的 Android 集成應該從上述 Kotlin 文物開始.

所有的 Kotlin 模塊執行 JDK 8 API 編譯時與 `-Xjdk-release=8`, 儘管構建工具鏈本身使用 JDK 21. 不要使用 JDK 9+ APIs 在 SDK 這個代碼.

## 建立和測試 {#build-and-test}

運行便攜式 JVM 測試:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

建造 Android 的文物:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 目前覆蓋範圍 {#current-coverage}

在 Kotlin SDK 中包括:

- Norito 編碼和解碼
- 規範賬戶和資產地址處理
- 交易構建,簽署和離線包裹
- Torii HTTP,WebSocket 和 SSE 的客戶
- 多簽名,訂閱, SoraFS, Nexus 和連接型號
- Android 鍵存儲和設備遠程測量集成
- Android 離線運輸 QR,附近運輸和 NFC

查看[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)對模塊特定的 APIs 和精確的構建命令.
