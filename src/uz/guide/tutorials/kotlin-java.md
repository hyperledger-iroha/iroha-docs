---
translation_locale: uz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android va Java {#kotlin-android-and-java}

Kotlin SDK JVM va Android dasturlari uchun andoza mijoz to'plami hisoblanadi. U Iroha omborida `kotlin/` ostida yashaydi va platforma bo'yicha bo'linadi, shuning uchun portativ kod Android bog'liqliklarini egallashmaydi.

## Modullar {#modules}

|Artefakt |Tip |Foydalanish |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, ma'lumotlar modeli, kripto, muomala, Torii va protokol kodi |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android kalit do'kon, qurilma telemetriyasi va JNI tomonidan qo'llab-quvvatlanadigan mijoz integratsiyalari |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android `client-android` asosida offline-wallet transport va integratsiyalari|

Artefaktlar hali Maven Centralda e'lon qilinmagan. ularni o'rnatilgan Iroha manbai tahlilidan lokal ravishda yaratish va nashr etish:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Keyin ilova uchun kerak boʻlgan artefaktni tanlang:

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

`core-jvm` hech qanday Android bog'liqliklarni o'z ichiga olmaydi. Android mijozi va kalit saqlash kodini `client-android` da saqlang va Android faqat oflayn-wallet va JNI oqimlari uchun `offline-wallet-android`dan foydalaning.

## Kotlin va Java moslashuvi {#kotlin-and-java-compatibility}

Umumiy API birinchi bo'lib Kotlin hisoblanadi va Java interopini JVM chaqiruvchilarga kerak bo'lgan joyda taqdim etadi. Tegishli `java/` implementatsiyasida teng o'zgarishlar aks ettiriladi. Yangi Android integratsiyalari yuqoridagi Kotlin artefaktlar bilan boshlanishi kerak.

Hammasi Kotlin modullar qo'llash JDK 8 API tuzilgan vaqtda moslashuvchanlik `-Xjdk-release=8`, Garchi qurilmalar zanjirining oʻzi foydalansa ham JDK 21. Foydalanmang JDK 9+ APIs yo'nalishi SDK kod.

## Qurish va sinovdan o'tkazish {#build-and-test}

O'tkazilishi mumkin bo'lgan JVM sinovlarini bajaring:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android asbob-uskunalarini yaratish:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Joriy qamrov {#current-coverage}

Kotlin SDK ga quyidagilar kiradi:

- Norito kodlash va dekodlash
- Kanonik hisobvaraq va aktivlar manzilini boshqarish
- Transaksiyalarni tuzish, imzolash va offline konvertlar
- Torii HTTP, WebSocket va SSE mijozlari
- ko'p imzo, obunalik, SoraFS, Nexus va Connect modellari
- Android tugmaxona va qurilma telemetriyasi integratsiyalari
- Android offline QR, yaqin va NFC transportlari

Modulga mos APIs va aniq qurilish buyruqlari uchun [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)-ni ko'ring.
