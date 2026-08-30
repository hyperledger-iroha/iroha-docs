---
translation_locale: ba
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android һәм Java {#kotlin-android-and-java}

Kotlin SDK - JVM һәм Android программалары өсөн алдан билдәләнгән клиент стегы. Ул Iroha һаҡлағысында `kotlin/` аҫтында йәшәй һәм платформаға бүленгән, шуға күрә портатив код Android бәйлелектәре ала алмай.

## Модулдар {#modules}

|Артефакт |Тип |Ҡулланыу |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Таҙа Kotlin/JVM Norito, мәғлүмәт моделе, крипто, транзакция, Torii һәм протокол коды |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android клавиатура һаҡлау, ҡоролмалар телеметрияһы һәм JNI ярҙамында клиент интеграциялары |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android `client-android` нигеҙендә төҙөлгән офлайн-бумаҡса транспорты һәм интеграцияһы |

Артефакттар әлегә Maven Central-ҡа баҫтырылмаған. уларҙы урындарҙа ҡуйылған Iroha сығанаҡ үҙгәртеп ҡороуҙан төҙөп баҫтырығыҙ:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Унан һуң ҡулланма өсөн кәрәкле артефактты ғына һайлағыҙ:

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

`core-jvm` бер ниндәй ҙә Android бәйләнештәрен үҙ эсенә алмай. Android клиент һәм клавиатура кодын `client-android` эсендә һаҡлағыҙ, һәм Android-ҡа ғына офлайн-бумаҡса һәм JNI ағымдары өсөн `offline-wallet-android` ҡулланығыҙ.

## Kotlin һәм Java буйынса яраҡлаштырыу {#kotlin-and-java-compatibility}

Йәмәғәтселек API булып тора Kotlin- беренсе һәм Java интероп бирә, унда JVM саҡырыусыларға кәрәк. тигеҙ үҙгәрештәр тейешле `java/` ғәмәлгә ашырыу. Android интеграциялар менән башланырға тейеш Kotlin Юғарылағы артефакттар.

Бөтәһе лә Kotlin модулдәр үтәү JDK 8 API компиляция ваҡытында совместимость `-Xjdk-release=8`, төҙөлөш ҡорамалдар селтәренең үҙендә ҡуллана JDK 21. ҡулланырға ярамай JDK 9+ APIs үҙ эсенә SDK код.

## Төҙөү һәм һынау {#build-and-test}

JVM һынауҙарын үтәү:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android артефакттарҙы төҙөү:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Хәҙерге яҡтыртыу {#current-coverage}

Kotlin SDK үҙ эсенә:

- Norito кодлау һәм декодлау
- Канон иҫәбенә һәм актив адрестары менән идара итеү
- транзакция төҙөү, ҡул ҡуйыу һәм офлайн конверттар
- Torii HTTP, WebSocket һәм SSE клиенттары
- Күп ҡултамғалар, яҙылыу, SoraFS, Nexus һәм Connect моделе
- Android клавиатура һәм ҡоролмалар телеметрияһы интеграциялары
- Android офлайн QR, Яҡын һәм NFC транспорты

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) өсөн модуль-специфик APIs һәм аныҡ төҙөү командалары ҡарағыҙ.
