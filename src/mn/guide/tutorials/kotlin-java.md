---
translation_locale: mn
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android, ба Java {#kotlin-android-and-java}

Kotlin SDK нь JVM ба Android програмуудын анхдагч клиентийн стек юм. Энэ нь Iroha хадгалах сангийн `kotlin/` дор байрладаг ба платформоор хуваагддаг тул зөөвөрлөх боломжтой код нь Android хамаарлыг авахгүй.

## Модулууд {#modules}

|Эрдэнэс|Төрөл| Ашиглах |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Цэвэр Kotlin/JVM Norito, өгөгдлийн загвар, крипто, гүйлгээ, Torii, ба протоколын код|
| `org.hyperledger.iroha.sdk:client-android` | AAR |Android түлхүүр хадгалах сан, төхөөрөмжийн алсын мэдээлэл, болон JNI-н дэмжлэгтэй клиент интеграцчилал|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android офлайн-вэлэт тээвэрлэлтийн систем ба `client-android` дээр суурилсан интеграц|

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
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` нь Android хамааралгүй. Android клиент болон түлхүүрийн кодыг `client-android`-д хадгалаад, зөвхөн Android-ийн офлайн түрийвч болон JNI урсгалд `offline-wallet-android`-ыг ашигла.

## Kotlin ба Java нийцтэй байдал {#kotlin-and-java-compatibility}

Олон нийтийн API нь Kotlin-т эхний ээлжинд бөгөөд JVM хүсэлт гаргаж буй клиентүүд шаардлагатай үед Java нийцүүлэлтийг хангаж өгдөг. Тохирох `java/` хэрэгжилтэд тэнцэх өөрчлөлтүүд нь тусгагдсан байдаг. Шинэ Android интеграцчлалууд дээр дурдсан Kotlin объектуудаар эхлэх ёстой.

Бүх Kotlin модулууд JDK 8 API нийцтэй байдлыг `-Xjdk-release=8` дээр компайл хийх үеэр шаардана, хэдийгээр барилгын хэрэгслийн бүрэлдэхүүн өөрөө JDK 21-г ашигладаг. SDK кодод JDK 9+ APIs ашиглаж болохгүй.

## Бариж, Туршиж үзэх {#build-and-test}

Зөөврийн JVM туршилтуудыг ажиллуулна уу:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android үйлдвэрлэлийг бүтээгээрэй:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Одоогийн хамрах хүрээ {#current-coverage}

Kotlin SDK нь дараах зүйлийг агуулна:

- Norito кодчилол ба код тайлалт
- нэг протокол-стандарт данс болон хөрөнгийн хаягийн удирдлага
- үйлдлийн барилга, гарын үсэг зурах, оффлайн өгөгдлийн савнууд
- Torii HTTP, WebSocket, болон SSE үйлчлүүлэгчид
- олон гарын үсэг, захиалга, SoraFS, Nexus, болон Холбоос загварууд
- Android түлхүүр хадгалах сан ба төхөөрөмжийн телеметри интеграцчлалууд
- Android офлайн QR, ойрхон, ба NFC тээвэрлэлт

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md)-г харж, модульд онцлогтой APIs болон яг барилгын командуудыг үзнэ үү.
