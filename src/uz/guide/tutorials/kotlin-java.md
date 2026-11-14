---
translation_locale: uz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android, va Java {#kotlin-android-and-java}

Kotlin SDK JVM va Android ilovalari uchun standart mijoz steki hisoblanadi. U Iroha repozitoriyasidagi `kotlin/` ostida joylashgan va platforma bo‘yicha ajratilgan, shuning uchun ko‘chma kod Android bog‘liqliklarini olmaydi.

## Modullar {#modules}

|Artefakt|Tur|Foydalanish|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Pure Kotlin/JVM Norito, ma'lumot modeli, kripto, tranzaksiya, Torii, va protokol kodi|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android kalitlar ombori, qurilma telemetriyasi va JNI-qo‘llab-quvvatlangan mijoz integratsiyalari|
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android offline hamyon tashish va `client-android` asosida qurilgan integratsiya|

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` hech qanday Android bog‘liqliklarini o‘z ichiga olmaydi. Android mijoz va kalit saqlash kodini `client-android`da saqlang, va `kagemusha-wallet-android`ni faqat Android-offline hamyon va JNI oqimlari uchun ishlating.

## Kotlin va Java mosligi {#kotlin-and-java-compatibility}

Ochiq API avvalo Kotlin uchun mo‘ljallangan va Java chaqiruvchilari uchun kanonik amalga oshirish hisoblanadi; `core-jvm` dagi Java manba kodli iste’molchi testlari uni bevosita tekshiradi. `java/` daraxtida Kotlin modullariga ko‘chirilib, iste’moldan chiqarilayotgan takroriy amalga oshirishlar joylashgan. Yangi Android integratsiyalari yuqoridagi Kotlin artefaktlaridan boshlanishi kerak.

Barcha Kotlin modullar kompilyatsiya vaqtida `-Xjdk-release=8` bilan JDK 8 API mosligini ta’minlaydi, garchi qurilish vositalari o‘zi JDK 21 ni ishlatsa ham. SDK kodida JDK 9+ APIs dan foydalanmang.

## Qurish va Sinash {#build-and-test}

JVM testlarini Kotlin SDK README da tavsiflanganidek, `IROHA_NATIVE_LIBRARY_PATH` da shu manbadan yig‘ilgan `connect_norito_bridge` kutubxonasi va `IROHA_KOTLIN_FIXTURE_GEN_BIN` da `kotlin-fixture-gen` bilan ishga tushiring; ularsiz nativ kodga bog‘liq testlar muvaffaqiyatsiz tugaydi:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android artifaktlarni yarating:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Joriy qamrov {#current-coverage}

Kotlin SDK quyidagilarni o'z ichiga oladi:

- Norito kodlash va dekodlash
- kanonik hisob va aktiv manzilini boshqarish
- operatsiya qurilishi, imzolash va oflayn ma’lumot konteynerlari
- Torii HTTP, WebSocket, va SSE mijozlar
- ko‘p imzo, obuna, SoraFS, SORA Nexus, va Connect modellari
- Android keystore va qurilma telemetriya integratsiyalari
- Android oflayn QR, Yaqinida, va NFC transportlar

Modulga xos APIs va aniq qurilish buyruqlari uchun [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md)ni ko'ring.
