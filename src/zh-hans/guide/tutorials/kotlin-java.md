---
translation_locale: zh-hans
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, 和Java {#kotlin-android-and-java}

其他 Kotlin SDK 是默认客户端堆 JVM 并且 Android 申请.
它生活在 `kotlin/` 在 Iroha 存储库和平台分为
可移植代码不获得 Android 它们的依赖性.

## 模块 {#modules}

| 艺术品 | 类型 | 使用 |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | 纯净 Kotlin/JVM Norito, 数据模型,加密,交易, Torii, 和协议代码 |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android 密钥存储,设备遥测,以及 JNI- 支持客户端集成 |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android 在线钱包运输和集成 `client-android` |

这些文物还没有出现在Maven中央.
在本地上,从的 Iroha 来源修改:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

然后只选择您的应用程序需要的文物:

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

`core-jvm` 含有没有 Android 保持依赖性 Android 客户端和关键存储
代码 `client-android`, 和使用 `offline-wallet-android` 对于 Android- 只有
无线钱包和 JNI 流动.

## Kotlin 和Java兼容性 {#kotlin-and-java-compatibility}

公众 API 是 Kotlin- 首先提供Java中接, JVM 呼叫者需要
同等变化反映在相应的 `java/`
实施. 新 Android 整合应从 Kotlin
在上面的文物.

所有的 Kotlin 模块执行 JDK 8 API 在编译时与
`-Xjdk-release=8`, 尽管构建工具链本身使用 JDK 21. 不要
使用 JDK 9+ APIs 在 SDK 它们的代码.

## 建立和测试 {#build-and-test}

运行手机 JVM 测试:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

建立一个 Android 艺术品:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 目前的覆盖范围 {#current-coverage}

其他 Kotlin SDK 包括:

- Norito 编码和解码
- 常规账户和资产地址处理
- 交易构建,签署和离线封装
- Torii HTTP, WebSocket, 并且 SSE 客户
- 多签名,订阅 SoraFS, Nexus, 和连接模型
- Android 密钥存储和设备远程测量集成
- Android 离线 QR, 在附近, NFC 运输

看看 [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
对于特定模块 APIs 和准确的构建命令.
