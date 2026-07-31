---
translation_locale: az
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android və Java {#kotlin-android-and-java}

Kotlin SDK JVM və Android tətbiqləri üçün standart müştəri yığmasıdır. Iroha anbarında `kotlin/` altında yaşayır və platformalara görə bölünür, belə ki daşınma kodu Android asılılıqlarını əldə etmir.

## Modullar {#modules}

|Əsər |Tip |istifadə |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Təmiz Kotlin/JVM Norito, məlumat modeli, kriptovalyuta, əməliyyat, Torii və protokol kodu |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android kiystore, cihaz telemetriyası və JNI dəstəkləyən müştərilərin inteqrasiyası |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android off-line cüzdan nəqliyyatı və inteqrasiya `client-android` üzərində qurulmuşdur. |

Əsərlər hələ Maven Central-da nəşr olunmamışdır. Onları sabitləşdirilmiş Iroha mənbə dəyişikliyi ilə yerli şəkildə inşa edin və nəşr edin:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Sonra yalnız tətbiqinizin tələb etdiyi əşyaları seçin:

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

`core-jvm` tərkibində yoxdur Android Əmanətləri saxlayın. Android müştəri və açar saxlama kodu `client-android`, və istifadə `offline-wallet-android` üçün Android- Yalnız offline cüzdan və JNI axışlar.

## Kotlin və Java uyğunluğu {#kotlin-and-java-compatibility}

İctimaiyyət API ilk növbədə Kotlin-dir və JVM zəng edənlərin ehtiyac duyduğu yerdə Java interopunu təmin edir. Müvafiq `java/` həyata keçirilməsində müvafiq dəyişikliklər əks olunur. Yeni Android inteqrasiyaları yuxarıda göstərilən Kotlin əşyalarla başlamaq lazımdır.

Hamısı Kotlin modulları tətbiq etmək JDK 8 API tərtib zamanı uyğunluğu `-Xjdk-release=8`, baxmayaraq ki, qurma vasitə zəncirinin özü istifadə edir JDK 21. istifadə etməyin JDK 9+ APIs ilə SDK kod.

## İnşaat və sınaq {#build-and-test}

Qeydiyyatlı JVM sınaqları icra edin:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android əşyaları qurun:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Hal-hazırda mövcud olan əhatə {#current-coverage}

Kotlin SDK aşağıdakıları ehtiva edir:

- Norito kodlaşdırma və dekodlaşdırma
- Kanonik hesab və aktivlərin ünvanlarının idarə edilməsi
- Transaction building, signing və offline envelopes
- Torii HTTP, WebSocket və SSE müştərilərinin
- Mülti imza, abunə SoraFS, Nexus və Connect modelləri
- Android açar saxlama və cihaz telemetri inteqrasiyaları
- Android offline QR, yaxınlıq və NFC nəqliyyatı

APIs və dəqiq quraşdırma əmrləri üçün [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) baxın.
