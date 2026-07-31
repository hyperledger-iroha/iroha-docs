---
translation_locale: uz
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, va Java {#kotlin-android-and-java}

O ' zbekiston Respublikasi Kotlin SDK uchun andoza mijoz toʻplami JVM va Android talabnomalar.
U ostida yashaydi `kotlin/` bilan Iroha ombor va platformasi bo ' lib shunday
portativ kodni olmaydi Android bog'liqlik.

## Modullar {#modules}

| San'at | Tur | Foydalanish |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Sof Kotlin/JVM Norito, ma'lumotlar modeli, kripto, muomala, Torii, va protokol kodi |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android kalitlar do'koni, qurilma telemetriyasi va JNI-tashkil etilgan mijoz integratsiyalari |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android O'rnatilgan offline-wallet transport va integratsiya `client-android` |

Bu asarlar hali Maven Centralda nashr etilmagan.
mahalliy ravishda o'rnatilgan Iroha manbalarni qayta ko'rib chiqish:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Soʻngra ilova uchun kerak boʻlgan artefaktni tanlang:

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

`core-jvm` tarkibida yo'q Android bog'liqliklarni saqlab qoling. Android mijoz va kalit do'kon
kodda `client-android`, va foydalanish `offline-wallet-android` uchun Android- faqat
offline-wallet va JNI oqib ketadi.

## Kotlin va Java moslashuvi {#kotlin-and-java-compatibility}

Jamoat API bo ' lmoqda Kotlin- birinchi va Java interop beradi JVM qo'ng'iroq qiluvchilar
teng o'zgarishlar tegishli `java/`
Amalga oshirish. Android integratsiyalari bilan boshlanishi kerak Kotlin
Yuqoridagi artefaklar.

Hammasi Kotlin modullar qo'llash JDK 8 API tahrirga qarang .
`-Xjdk-release=8`, Garchi qurilmalar zanjirining oʻzi JDK 21. Yo'q
foydalanish JDK 9+ APIs yo'nalishi SDK kod.

## Qurish va sinov {#build-and-test}

Mobil telefonni ishga tushiring JVM Sinovlar:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Qurilishni Android artefaktlar:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Joriy qamrov {#current-coverage}

O ' zbekiston Respublikasi Kotlin SDK quyidagilarni o'z ichiga oladi:

- Norito kodlash va dekodlash
- kanonik hisob va aktivlar manzilini boshqarish
- Transaksiyalarni tuzish, imzolash va offline konvertlar
- Torii HTTP, WebSocket, va SSE mijozlar
- ko'p imzo, obuna, SoraFS, Nexus, va Connect modellari
- Android Keystore va qurilma telemetriya integratsiyalari
- Android offline QR, Yaqinda, va NFC tashish

Koʻring [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
modulga oid APIs va aniq qurilish buyruqlari.
