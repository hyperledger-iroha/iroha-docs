---
translation_locale: dz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android དེ་ལས་ Java {#kotlin-android-and-java}

Kotlin SDK འདི་ default client stack འདི་ JVM དང་ Android གི་ལག་ལེན་ཚུ་གི་དོན་ལུ་ཨིན། འདི་གིས་ Iroha སྒྲིག་མཛོད་ནང་ལུ་ `kotlin/` ཀྱི་འོག་ལུ་སྡོད་དོ་ཡོདཔ་དང་ དེ་ནང་ platformགིས་བགོ་བཤའ་རྐྱབ་ཡོདཔ་ལས་ portable code གིས་ Android dependencies མ་ཐོབ་པར་ཡོདཔ་ཨིན།

## ཚད་གཞི་ཚུ་ {#modules}

|རིག་རྩལ་ |ཐིག་ཁྲམ་ |ལག་ལེན་འཐབ་ནི་|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, data model, crypto, transaction, Torii, and protocol code ཌའི་ཊ་གི་བཟོ་རྣམ་དང་རྩིས་ཁྲམ་ཚུ་|
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android keystore, device telemetry, དང་ JNI གིས་རྒྱབ་སྐྱོར་འབད་མི་ client integrates |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android Offline Wallet གྱི་སྐྱེལ་འདྲེན་དང་འབྲེལ་བའི་མཐུན་རྐྱེན་ཚུ་ `client-android` ལུ་ གཞི་བཙུགས་འབདཝ་ཨིན།|

དངོས་པོ་ཚུ་ Maven Central ལུ་ གསལ་བསྒྲགས་མ་འབད་བར་ཡོདཔ་ཨིན། འདི་ཚུ་ཡང་ Iroha གཞི་རྟེན་བསྐྱར་བཅོས་ནང་ལས་བཟོ་སྟེ་ ས་གནས་ནང་ལུ་གསལ་སྒྲགས་འབད་:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

དེ་ལས་ཁྱོད་ཀྱིས་ལག་ལེན་གྱི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་ ལག་ཆས་འདི་ གདམ་ཁ་རྐྱབས་:

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

`core-jvm` ནང་འཁོད་ལུ་མེད་ Android འབྲེལ་བ་འཐབ་ནི་ཚུ་བཞག་ནི། Android client དང་ keystore code འདི་ནང་ལུ་ `client-android`, ལག་ལེན་འཐབ་ནི་ `offline-wallet-android` དོན་ལུ་ Android-རྐྱངམ་ཅིག་ Offline-wallet དང་ JNI འཁྱིད་འགྱོ་དོ་ཡོདཔ་ཨིན།

## Kotlin དང་ Java གི་མཐུན་རྐྱེན་ {#kotlin-and-java-compatibility}

མི་མང་གི་ API གིས་ Kotlin དང་པ་འབདཝ་ཨིན་ དེ་ལས་ Java Interop འདི་ JVM འབོ་མི་ཚུ་གིས་ དགོས་མཁོ་བསྐྱེད་སའི་ས་གནས་ལུ་ བཏོན་དོ་ཡོདཔ་ཨིན། དེ་དང་འདྲན་འདྲ་འགྱུར་བཅོས་ཚུ་ `java/` ལག་ལེན་ནང་ལུ་ གསལ་སྟོན་འབད་ཡོདཔ་ཨིན། གསར་འགྱུར་གྱི་ Android འབྲེལ་མཐུད་འདི་ Kotlin གི་ལག་ཆས་ཚུ་ལས་འགོ་འདྲེན་འཐབ་དགོ།

ག་ར་ Kotlin modules enforce JDK 8 API བསྡུ་སྒྲིག་འབད་བའི་སྐབས་ གྲ་སྒྲིག་འབད་ནི་དང་ `-Xjdk-release=8`, མ་གཞི་བཟོ་སྐྲུན་གྱི་ལག་ཆས་ཐོ་བཀོད་འདི་གིས་རང་ ལག་ལེན་འཐབ་ཨིན། JDK 21. ལག་ལེན་འཐབ་ནི་མི་འོང་། JDK 9+ APIs ནང་ SDK ཀོ་ཌིཀ་

## བཟོ་སྐྲུན་དང་ བརྟག་དཔྱད་ {#build-and-test}

བརྟག་དཔྱད་འབད་ JVM འབག་འགྱོ་ཚུགསཔ་:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android བཟོ་ཆས་ཚུ་བཟོ་ནི།

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## ད་ལྟོའི་ཁེ་ཕན་ {#current-coverage}

Kotlin SDK འདི་ནང་ལུ་:

- Norito ཨེབ་གཏང་དང་ཨེབ་གཏང་འབད་ཐབས།
- རྩིས་ཁྲ་དང་ རྒྱུ་དངོས་ཀྱི་ཁ་བྱང་ལག་ལེན་
- ཚོང་འབྲེལ་བཟོ་སྐྲུན་དང་ མཚམས་འཇོག་འབད་ནི་ དེ་ལས་ ཕྱིར་ཚོང་འཐབ་མི་ ཡིག་ཚང་ཚུ་
- Torii HTTP, WebSocket དང་ SSE གྱི་མགྲོན་པ་ཚུ་
- མང་སྡེ་མཚན་རྟགས་དང་ ཐོ་བཀོད་ SoraFS, Nexus དེ་ལས་ Connect བཟོ་རྣམ་ཚུ་ཨིན།
- Android ཀི་ཝིན་ཌོ་ར་དང་ སེལ་འཐུ་འབད་ཡོད་པའི་ གློག་ཐག་ར་བ་ཚུ་ གཅིག་སྒྲིལ་འབདཝ་ཨིན།
- Android ཕྱི་ཁ་ལུ་སྐྱེལ་འདྲེན་འབད་ QR, ཉེ་འདབས་ལུ་སྐྱེལ་འདྲེན་འབད་ནི་དང་ NFC

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)གི་དོན་ལུ་ ཚད་གཞིའི་དམིགས་བསལ་གྱི་ APIs དང་ བཟོ་སྐྲུན་གྱི་བཀའ་རྒྱ་ཚུ་བལྟ་ནི།
