---
translation_locale: zh-hant
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, 和Java {#kotlin-android-and-java}

其他國家 Kotlin SDK 是默认的客戶端堆 JVM 及其他 Android 應用程序.
這種生物在 `kotlin/` 在這個國家 Iroha 存儲庫,並按平台分為
可移動代碼無法獲得 Android 沒有任何問題.

## 模組 {#modules}

| 藝術品 | 類型 | 使用 |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | 純粹的 Kotlin/JVM Norito, 數據模型,加密碼,交易, Torii, 和協議碼 |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android 關鍵儲存,裝置遠隔測量, JNI 支持客戶集成 |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android 在網路上運輸和集成 `client-android` |

該組織要建立並發表這些文物.
在本地上, Iroha 來源修改:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

請選取您的應用程式所需的文物:

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

`core-jvm` 含有沒有 Android 保持這些依賴性 Android 客戶端和關鍵儲存
在中 `client-android`, 及使用 `offline-wallet-android` 關於 Android- 只有
沒有線上錢包和 JNI 沒有任何問題.

## Kotlin 和Java兼容性 {#kotlin-and-java-compatibility}

公眾 API 是的 Kotlin- 首先提供Java插件, JVM 呼叫者需要
其他國家的情況也會變化. `java/`
實施新型 Android 該組織必須從 Kotlin
在上方的文物.

所有的 Kotlin 模組執行 JDK 8 API 在編輯時與
`-Xjdk-release=8`, 雖然建構工具連鎖本身使用 JDK 21. 不要
使用 JDK 9+ APIs 在 SDK 這就是我的代碼.

## 建立和測試 {#build-and-test}

運行移動機 JVM 檢測:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

建立一個 Android 藝術品:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 目前的覆蓋 {#current-coverage}

其他國家 Kotlin SDK 包括:

- Norito 編碼和解碼
- 經典帳戶和資產地址處理
- 交易建立,簽署和離線封筒
- Torii HTTP, WebSocket, 及其他 SSE 客戶
- 多簽名,訂閱, SoraFS, Nexus, 和連接模型
- Android 密钥庫和裝置遠隔測量集成
- Android 在線 QR, 在附近, NFC 運輸

看到這些 [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
專屬於模組 APIs 並提供精確的建構命令.
