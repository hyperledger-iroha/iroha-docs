---
translation_locale: mn
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android, ба Java {#kotlin-android-and-java}

Kotlin SDK нь JVM ба Android програмуудын анхдагч клиентийн стек юм. Энэ нь Iroha хадгалах сангийн `kotlin/` дор байрладаг ба платформоор хуваагддаг тул зөөвөрлөх боломжтой код нь Android хамаарлыг авахгүй.

## Модулууд {#modules}

|Эрдэнэс|Төрөл| Ашиглах |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Цэвэр Kotlin/JVM Norito, өгөгдлийн загвар, крипто, гүйлгээ, Torii, ба протоколын код|
| `org.hyperledger.iroha.sdk:client-android` | AAR |Android түлхүүр хадгалах сан, төхөөрөмжийн алсын мэдээлэл, болон JNI-н дэмжлэгтэй клиент интеграцчилал|
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android офлайн-вэлэт тээвэрлэлтийн систем ба `client-android` дээр суурилсан интеграц|

Эдгээр бүтээлүүдийг одоогоор Maven Central-д нийтлээгүй байна. Тэдгээрийг локальноо барьж, Pinned Iroha эх хувилбараас нийтлэнэ үү:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Дараа нь таны програмд хэрэгтэй ганц л бүтээлээс сонгоно уу:

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

`core-jvm` нь Android хамааралгүй. Android клиент болон түлхүүрийн кодыг `client-android`-д хадгалаад, зөвхөн Android-ийн офлайн түрийвч болон JNI урсгалд `kagemusha-wallet-android`-ыг ашигла.

## Kotlin ба Java нийцтэй байдал {#kotlin-and-java-compatibility}

Нийтийн API нь Kotlin-ийг тэргүүлэх бөгөөд Java-аас дуудагчдад зориулсан каноник хэрэгжилт юм; `core-jvm` доторх Java эх кодтой хэрэглэгчийн тестүүд үүнийг шууд шалгадаг. `java/` мод нь Kotlin модулиуд руу шилжүүлэн хасагдаж буй давхардсан хэрэгжилтүүдийг агуулна. Шинэ Android интеграцууд дээрх Kotlin артефактуудаас эхлэх ёстой.

Бүх Kotlin модулууд JDK 8 API нийцтэй байдлыг `-Xjdk-release=8` дээр компайл хийх үеэр шаардана, хэдийгээр барилгын хэрэгслийн бүрэлдэхүүн өөрөө JDK 21-г ашигладаг. SDK кодод JDK 9+ APIs ашиглаж болохгүй.

## Бариж, Туршиж үзэх {#build-and-test}

Kotlin SDK README-д тайлбарласны дагуу `IROHA_NATIVE_LIBRARY_PATH`-д ижил эх кодоос бүтээсэн `connect_norito_bridge` сан, `IROHA_KOTLIN_FIXTURE_GEN_BIN`-д `kotlin-fixture-gen`-ийг зааж JVM тестүүдийг ажиллуулна уу; тэдгээргүйгээр native-аас хамааралтай тестүүд бүтэлгүйтнэ:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android үйлдвэрлэлийг бүтээгээрэй:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Одоогийн хамрах хүрээ {#current-coverage}

Kotlin SDK нь дараах зүйлийг агуулна:

- Norito кодчилол ба код тайлалт
- нэг протокол-стандарт данс болон хөрөнгийн хаягийн удирдлага
- үйлдлийн барилга, гарын үсэг зурах, оффлайн өгөгдлийн савнууд
- Torii HTTP, WebSocket, болон SSE үйлчлүүлэгчид
- олон гарын үсэг, захиалга, SoraFS, SORA Nexus, болон Холбоос загварууд
- Android түлхүүр хадгалах сан ба төхөөрөмжийн телеметри интеграцчлалууд
- Android офлайн QR, ойрхон, ба NFC тээвэрлэлт

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md)-г харж, модульд онцлогтой APIs болон яг барилгын командуудыг үзнэ үү.
