---
translation_locale: dz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: human-reviewed+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android དེ་ལས་ Java {#kotlin-android-and-java}

Kotlin SDK འདི་ སྔོན་སྒྲིག ཞབས་ཏོག་ལེན་མི བང་བསྒྲིག འདི་ JVM དང་ Android གི་ལག་ལེན་ཚུ་གི་དོན་ལུ་ཨིན། འདི་གིས་ Iroha སྒྲིག་མཛོད་ནང་ལུ་ `kotlin/` ཀྱི་འོག་ལུ་སྡོད་དོ་ཡོདཔ་དང་ དེ་ནང་ སྟེགས་བུགིས་བགོ་བཤའ་རྐྱབ་ཡོདཔ་ལས་ འབག་བཏུབ ལས་རིམ་ཨང་རྟགས གིས་ Android བརྟེན་ས མ་ཐོབ་པར་ཡོདཔ་ཨིན།

## ཚད་གཞི་ཚུ་ {#modules}

| དངོས་རྫས་ | དབྱེ་བ་ | ལག་ལེན་ |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | གཙང༌མ༌ Kotlin/JVM Norito, གནད་སྡུད་དཔེ་ཚད་, ཀིརིཔ་ཊོ་, ཚོང་འབྲེལ་, Torii, དང་མཐུན་སྒྲིག་ཨང་རྟགས་ |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android ལྡེ་མིག་མཛོད་ཁང་དང་ ཐབས་འཕྲུལ་གྱི་ བརྡ་འཕྲིན་ཚད་འཇལ་ དེ་ལས་ JNI རྒྱབ་སྐྱོར་འབད་མི་ མཁོ་སྤྲོད་འབད་མི་ མཉམ་བསྡོམས་ཚུ་ |
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | `client-android` གུ་བཟོ་བསྐྲུན་འབད་མི་ Android ཨོཕ་ལའིན་-དངུལ་ཁུག་སྐྱེལ་འདྲེན་དང་ མཉམ་བསྡོམས་འབད་ཡོདཔ། |

དངོས་པོ་དེ་དག་ད་དུང་ Maven དབུས་སུ་པར་སྐྲུན་བྱས་མེད། བཙུགས་ཡོད་པའི་ Iroha འབྱུང་ཁུངས་བསྐྱར་ཞིབ་ལས་ ས་གནས་ནང་ བཟོ་བསྐྲུན་འབད་དེ་ དཔར་བསྐྲུན་འབད།

```bash
cd kotlin
./gradlew publishToMavenLocal
```

དེ་ལས་ ཁྱོད་རའི་གློག་རིམ་ལུ་དགོ་པའི་ བརྡ་མཚོན་རྐྱངམ་ཅིག་སེལ་འཐུ་འབད།

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

`core-jvm` ནང་ Android བརྟེན་པ་མེད། Android མཁོ་སྤྲོད་འབད་མི་དང་ལྡེ་མིག་མཛོད་ཁང་གི་ཨང་རྟགས་འདི་ `client-android` ནང་ལུ་བཞག་ཞིནམ་ལས་ Android-རྐྱངམ་ཅིག་ ཨོཕ་ལའིན་-དངུལ་ཁུག་དང་ JNI རྒྱུན་འགྲུལ་གྱི་དོན་ལུ་ `kagemusha-wallet-android` ལག་ལེན་འཐབ།

## Kotlin དང་ Java གི་མཐུན་རྐྱེན་ {#kotlin-and-java-compatibility}

མི་མང་ API འདི་ Kotlin-དང་པ་ཨིནམ་དང་ Java འབོད་མི་ཚུའི་དོན་ལུ་ ཚད་ལྡན་ལག་ལེན་ཨིན། `core-jvm` ནང་གི་ Java-འབྱུང་ཁུངས་ལག་ལེན་པའི་བརྟག་དཔྱད་ཚུ་གིས་ དེ་ཐད་ཀར་དུ་ བརྟག་དཔྱད་འབདཝ་ཨིན། `java/` ཤིང་ནང་ Kotlin ཚད་གཞི་ཆ་ཤས་ཚུ་ནང་ མཉམ་བསྡོམས་འབད་དེ་ ལག་ལེན་ལས་བཏོན་བཞིན་ཡོད་པའི་ ལག་ལེན་འདྲ་བཤུས་ཚུ་ཡོདཔ་ཨིན། Android མཉམ་བསྡོམས་གསརཔ་ཚུ་ གོང་འཁོད་ཀྱི་ Kotlin ཐོན་དངོས་ཚུ་ལས་འགོ་བཙུགས་དགོ།

Kotlin ཚད་གཞི་ཆ་མཉམ་གྱིས་ བཟོ་སྐྲུན་ལག་ཆས་ཀྱིས་ JDK 21 ལག་ལེན་འཐབ་རུང་ བསྡུ་སྒྲིག་སྐབས་ `-Xjdk-release=8` གི་ཐོག་ལས་ JDK 8 API མཐུན་འབྲེལ་བཙན་ཐབས་འབདཝ་ཨིན། SDK ཀོཌ་ནང་ JDK 9+ APIs ཚུ་ལག་ལེན་མ་འཐབ།

## བཟོ་སྐྲུན་དང་ བརྟག་དཔྱད་ {#build-and-test}

Kotlin SDK README ནང་བཤད་དོ་བཟུམ་སྦེ་ འབྱུང་ཁུངས་གཅིག་ལས་བཟོ་མི་ `connect_norito_bridge` དཔེ་མཛོད་འདི་ `IROHA_NATIVE_LIBRARY_PATH` ནང་དང་ `kotlin-fixture-gen` འདི་ `IROHA_KOTLIN_FIXTURE_GEN_BIN` ནང་བཞག་སྟེ་ JVM བརྟག་དཔྱད་ཚུ་ གཡོག་བཀོལ། དེ་ཚུ་མེད་པ་ཅིན་ ནང་སྐྱེས་ལུ་བརྟེན་པའི་བརྟག་དཔྱད་ཚུ་ འཐུས་ཤོར་འགྱོཝ་ཨིན་:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android བཟོ་ཆས་ཚུ་བཟོ་ནི།

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## ད་ལྟོའི་ཁྱབ་ཚད་ {#current-coverage}

Kotlin SDK འདི་ནང་ལུ་:

- Norito ཨེབ་གཏང་དང་ཨེབ་གཏང་འབད་ཐབས།
- རྩིས་ཐོ་དང་ རྒྱུ་དངོས་ཀྱི་ཁ་བྱང་ལག་ལེན་
- ཚོང་འབྲེལ་སྒྲིང་ཁྱིམ་དང་མིང་རྟགས་ དེ་ལས་ ཡོངས་འབྲེལ་མེད་པའི་ཡིག་ཤུབས་ཚུ།
- Torii HTTP, WebSocket དང་ SSE གྱི་མགྲོན་པ་ཚུ་
- མང་སྡེ་མཚན་རྟགས་དང་ ཐོ་བཀོད་ SoraFS, SORA Nexus དེ་ལས་ མཐུད་སྦྲེལ བཟོ་རྣམ་ཚུ་ཨིན།
- Android ཀི་ཝིན་ཌོ་ར་དང་ སེལ་འཐུ་འབད་ཡོད་པའི་ གློག་ཐག་ར་བ་ཚུ་ གཅིག་སྒྲིལ་འབདཝ་ཨིན།
- Android ཕྱི་ཁ་ལུ་སྐྱེལ་འདྲེན་འབད་ QR, ཉེ་འདབས་ལུ་སྐྱེལ་འདྲེན་འབད་ནི་དང་ NFC

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md)གི་དོན་ལུ་ ཚད་གཞིའི་དམིགས་བསལ་གྱི་ APIs དང་ བཟོ་སྐྲུན་གྱི་བཀའ་རྒྱ་ཚུ་བལྟ་ནི།
