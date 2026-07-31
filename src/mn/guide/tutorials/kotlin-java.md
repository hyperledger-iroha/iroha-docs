---
translation_locale: mn
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, Java {#kotlin-android-and-java}

Үндсэн хуулийн Kotlin SDK Энэ нь түгээмэл үйлчлүүлэгч барилгын JVM болон Android Хэрэглээний тухай. `kotlin/` УИХ-ын Iroha хадгаламж болон платформын дагуу хуваагдаж байгаа тул нэвтрүүлэгтэй код нь олж чадахгүй Android хамааралтай.

## Модулууд {#modules}

|Артифакт |Үргэлт|Хэрэглээ|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Цэвэр Kotlin/JVM Norito, мэдээллийн загвар, крипто, гүйлгээ, Torii, протоколын код |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android түлхүүр дэлгүүр, төхөөрөмжийн телеметрийн болон JNI-ийн дэмжлэгтэй үйлчлүүлэгчдийн нэгтгэл |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android `client-android` дээр суурилсан гарын үсэггүй хөрөнгийн тээвэрлэлт, интеграцлал |

Энэхүү артефактууд нь Maven Central-д хэвлэгдсэнгүй. Тэднийг Iroha эх үүсвэрийн шинэчилсэн найруулгаас орон нутгийн хувьд бүтээж хэвлүүлээрэй:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Дараа нь зөвхөн таны хүсэлтэд шаардлагатай артефактыг сонгох:

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

`core-jvm` нөөцтэй Android Үндсэн хуулийн дагуу Android хэрэглэгчийн болон түлхүүр хадгаламжийн код `client-android`, болон ашиглах `offline-wallet-android` . Android- зөвхөн гарын үсэггүй мөнгөн тэмдэгт JNI урсгал.

## Kotlin болон Java-ийн нийцүүлэл {#kotlin-and-java-compatibility}

Олон нийтийн API нь хамгийн түрүүнд Kotlin-д байдаг бөгөөд JVM дуудлага авагчдад шаардлагатай үед Java interopг хангадаг. тэнцүү өөрчлөлтийг холбогдох `java/` хэрэгжилтэд харуулж байна. Шинэ Android интеграцын эхлэл нь дээрх Kotlin артефакттай эхэлнэ.

Бүгд Kotlin модуль нь хүчин төгөлдөр JDK 8 API нийцүүлэлт хийх үед `-Xjdk-release=8`, барилгын хэрэгслийн сүлжээ өөрөө ашигладаг ч JDK 21. хэрэглэхгүй JDK 9+ APIs цаашид SDK Код.

## Хөгжүүлэн туршиж үзээрэй {#build-and-test}

Хөдөлмөрийн хэрэгслийн JVM шинжилгээг гүйцэтгэх:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android артефактын бүтэц:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Одоогоор хамааралтай {#current-coverage}

Kotlin SDK нь:

- Norito кодлох, унтраах
- санхүүгийн бүртгэл, активын хаягийг зохицуулах
- гүйлгээний бүтээн байгуулалт, гарын үсэг зурах, офлайн хуудас
- Torii HTTP, WebSocket болон SSE үйлчлүүлэгчдэд
- олон гарын үсэг, захиалга, SoraFS, Nexus болон Connect загвар
- Android тоног төхөөрөмжийн түлхүүгийн дэлгүүр болон телеметрийн интеграц
- Android галтгүй QR, ойрхон, NFC тээврийн

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) нь модулийн тусгай APIs болон тод бүтээн байгуулалтын тушаалуудыг үзнэ үү.
