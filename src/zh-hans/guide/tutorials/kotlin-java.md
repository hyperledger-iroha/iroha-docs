---
translation_locale: zh-hans
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin,Android 和Java {#kotlin-android-and-java}

Kotlin SDK 是 JVM 和 Android 应用程序的默认客户端堆.它在 Iroha 存储库中存在于 `kotlin/` 下,并按平台分开,因此便携代码不会获得 Android 依赖性.

## 模块 {#modules}

|艺术品|类型|使用|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm`|JAR|纯 Kotlin/JVM Norito,数据模型,加密货币,交易, Torii 和协议代码 |
|`org.hyperledger.iroha.sdk:client-android`|AAR|Android 关键存储,设备远程测量和 JNI 支持的客户端集成|
|`org.hyperledger.iroha.sdk:offline-wallet-android`|AAR|Android 基于`client-android`的离线钱包运输和集成|

这些文物还没有在Maven Central上发布. 从注入的 Iroha 来源修改中构建并本地发布:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

然后选择您的应用程序需要的文物:

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

`core-jvm`不包含 Android 的依赖性.在 `client-android`中保存 Android 客户端和密钥存储代码,并且仅使用`offline-wallet-android`用于 Android 的离线钱包和 JNI 流.

## Kotlin 和Java兼容性 {#kotlin-and-java-compatibility}

公共 API 是 Kotlin 的首个,在 JVM 调用者需要时提供Java间接.相等变化反映在相应的 `java/`实现中.新的 Android 集成应该从上述 Kotlin 文物开始.

所有的 Kotlin 模块执行 JDK 8 API 编译时与 `-Xjdk-release=8`, 尽管构建工具链本身使用 JDK 21. 不要使用 JDK 9+ APIs 在 SDK 这个代码.

## 建立和测试 {#build-and-test}

运行便携式 JVM 测试:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

建造 Android 的文物:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## 目前覆盖范围 {#current-coverage}

在 Kotlin SDK 中包括:

- Norito 编码和解码
- 规范账户和资产地址处理
- 交易构建,签署和离线包裹
- Torii HTTP,WebSocket 和 SSE 的客户
- 多签名,订阅, SoraFS, Nexus 和连接型号
- Android 键存储和设备远程测量集成
- Android 离线运输 QR,附近运输和 NFC

查看[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)对模块特定的 APIs 和精确的构建命令.
