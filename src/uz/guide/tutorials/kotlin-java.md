---
translation_locale: uz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android, va Java {#kotlin-android-and-java}

Kotlin SDK JVM va Android ilovalari uchun standart mijoz steki hisoblanadi. U Iroha repozitoriyasidagi `kotlin/` ostida joylashgan va platforma bo‘yicha ajratilgan, shuning uchun ko‘chma kod Android bog‘liqliklarini olmaydi.

## Modullar {#modules}

|Artefakt|Tur|Foydalanish|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Pure Kotlin/JVM Norito, ma'lumot modeli, kripto, tranzaksiya, Torii, va protokol kodi|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android kalitlar ombori, qurilma telemetriyasi va JNI-qo‘llab-quvvatlangan mijoz integratsiyalari|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android offline hamyon tashish va `client-android` asosida qurilgan integratsiya|

Artefaktlar hali Maven Central-ga e'lon qilinmagan. Ularni mahalliy ravishda pinned Iroha manba revizionidan tuzing va e'lon qiling:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

So‘ngra faqat ilovangizga kerak bo‘lgan artefaktni tanlang:

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

`core-jvm` hech qanday Android bog‘liqliklarini o‘z ichiga olmaydi. Android mijoz va kalit saqlash kodini `client-android`da saqlang, va `offline-wallet-android`ni faqat Android-offline hamyon va JNI oqimlari uchun ishlating.

## Kotlin va Java mosligi {#kotlin-and-java-compatibility}

Jamoat API birinchi Kotlin bo‘lib, JVM so‘rayotgan mijozlar kerak bo‘lganda Java bilan o‘zaro ishlashni ta’minlaydi. Tenglashtirilgan o‘zgarishlar mos keladigan `java/` amalga oshirilmasida aks ettiriladi. Yangi Android integratsiyalar yuqoridagi Kotlin artefaktlaridan boshlanishi kerak.

Barcha Kotlin modullar kompilyatsiya vaqtida `-Xjdk-release=8` bilan JDK 8 API mosligini ta’minlaydi, garchi qurilish vositalari o‘zi JDK 21 ni ishlatsa ham. SDK kodida JDK 9+ APIs dan foydalanmang.

## Qurish va Sinash {#build-and-test}

Portativ JVM testlarini ishga tushiring:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android artifaktlarni yarating:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Joriy qamrov {#current-coverage}

Kotlin SDK quyidagilarni o'z ichiga oladi:

- Norito kodlash va dekodlash
- kanonik hisob va aktiv manzilini boshqarish
- operatsiya qurilishi, imzolash va oflayn ma’lumot konteynerlari
- Torii HTTP, WebSocket, va SSE mijozlar
- ko‘p imzo, obuna, SoraFS, Nexus, va Connect modellari
- Android keystore va qurilma telemetriya integratsiyalari
- Android oflayn QR, Yaqinida, va NFC transportlar

Modulga xos APIs va aniq qurilish buyruqlari uchun [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)ni ko'ring.
