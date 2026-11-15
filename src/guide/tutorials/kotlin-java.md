# Kotlin, Android, and Java

The Kotlin SDK is the default client stack for JVM and Android applications. It lives under `kotlin/` in the Iroha repository and is split by platform so portable code does not acquire Android dependencies.

## Modules

| Artifact | Type | Use |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Pure Kotlin/JVM Norito, data model, crypto, transaction, Torii, and protocol code |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android keystore, device telemetry, and JNI-backed client integrations |
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android offline-wallet transports and integration built on `client-android` |

The artifacts are not yet published to Maven Central. Build and publish them locally from the pinned Iroha source revision:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Then select only the artifact your application needs:

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

`core-jvm` contains no Android dependencies. Keep Android client and keystore code in `client-android`, and use `kagemusha-wallet-android` for Android-only offline-wallet and JNI flows.

## Kotlin and Java Compatibility

The public API is Kotlin-first and is the canonical implementation for Java callers; Java-source consumer tests in `core-jvm` exercise it directly. The `java/` tree holds duplicate implementations that are being retired into the Kotlin modules. New Android integrations should start with the Kotlin artifacts above.

All Kotlin modules enforce JDK 8 API compatibility at compile time with `-Xjdk-release=8`, even though the build toolchain itself uses JDK 21. Do not use JDK 9+ APIs in SDK code.

## Build and Test

Run the JVM tests with the same-source `connect_norito_bridge` library in
`IROHA_NATIVE_LIBRARY_PATH` and `kotlin-fixture-gen` in
`IROHA_KOTLIN_FIXTURE_GEN_BIN`, as described in the Kotlin SDK README; without
them the native-dependent tests fail:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Build the Android artifacts:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Current Coverage

The Kotlin SDK includes:

- Norito encoding and decoding
- canonical account and asset address handling
- transaction building, signing, and offline envelopes
- Torii HTTP, WebSocket, and SSE clients
- multisignature, subscription, SoraFS, SORA Nexus, and Connect models
- Android keystore and device telemetry integrations
- Android offline QR, Nearby, and NFC transports

See the [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) for module-specific APIs and exact build commands.
