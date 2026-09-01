---
translation_locale: az
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android və Java {#kotlin-android-and-java}

Kotlin SDK JVM və Android tətbiqləri üçün standart müştəri yığınıdır. O, Iroha deposunda `kotlin/` altında yerləşir və platformaya görə ayrılıb, beləliklə daşıya bilən kod Android asılılıqlarını əldə etmir.

## Modullar {#modules}

|Əşya|Növ|İstifadə et|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Təmiz Kotlin/JVM Norito, məlumat modeli, kripto, əməliyyat, Torii, və protokol kodu|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android açar deposu, cihaz telemetrikası və JNI-dəstəklənən müştəri inteqrasiyaları |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android oflayn-ödəmə üsulu daşınması və `client-android` əsasında inteqrasiya|

Artefaktlar hələ Maven Central-a yayımlanmamışdır. Onları yerli olaraq pin edilmiş Iroha mənbə reviziyasından yaradıb yayımlayın:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Sonra yalnız tətbiqinizin ehtiyacı olan əsəri seçin:

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

`core-jvm` heç bir Android asılılıq ehtiva etmir. Android müştəri və keystore kodunu `client-android`-də saxlayın və Android-yalnız offline-çəkmə və JNI axınları üçün `offline-wallet-android`-dən istifadə edin.

## Kotlin və Java Uyğunluğu {#kotlin-and-java-compatibility}

İctimai API Kotlin-birinci sıradadır və JVM tələb edən müştərilərə Java interop təmin edir. Müvafiq dəyişikliklər uyğun `java/` həyata keçirməsində əks olunmuşdur. Yeni Android inteqrasiyalara yuxarıdakı Kotlin artefaktlarla başlamaq lazımdır.

Bütün Kotlin modulları tərtib zamanı `-Xjdk-release=8` ilə JDK 8 API uyğunluğunu təmin edir, baxmayaraq ki, quruluş alət zənciri özü JDK 21-dən istifadə edir. SDK kodunda JDK 9+ APIs-dan istifadə etməyin.

## Yarat və Test et {#build-and-test}

Daşınan JVM testlərini işə salın:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android artefaktlarını qurun:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Cari Əhatə {#current-coverage}

Kotlin SDK daxil edir:

- Norito kodlaşdırma və dekodlaşdırma
- tək protokol-standart hesab və aktiv ünvanlarının idarə olunması
- əməliyyatın yaradılması, imzalanması və oflayn məlumat konteynerləri
- Torii HTTP, WebSocket və SSE müştərilər
- çox imzalı, abunəlik, SoraFS, Nexus və Connect modelləri
- Android keystore və cihaz telemetriya inteqrasiyaları
- Android oflayn QR, Yaxınlıqda və NFC daşımalar

Modul-əlaqəli APIs və dəqiq qurulum əmrləri üçün [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)-a baxın.
