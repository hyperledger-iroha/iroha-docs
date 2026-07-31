---
translation_locale: mn
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, болон Java {#kotlin-android-and-java}

Хөдөлмөрийн Kotlin SDK - энэ нь default client stack JVM болон Android өргөдөл.
Энэ нь доор амьдардаг `kotlin/` Хөдөлмөрийн Iroha хадгаламж болон платформын дагуу хуваагддаг
нэвтрүүлэгний код олж чадахгүй Android хамааралтай.

## Модул {#modules}

| Артифакт | Үргэлт | Хэрэглээ |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Цэвэр Kotlin/JVM Norito, Мэдээллийн загвар, крипто, гүйлгээ, Torii, протоколын код |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android тоног төхөөрөмжийн түлхүүгийн дэлгүүр, телеметри, JNI Хэрэглэгчийн хамтарсан интеграц |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android Газар буцалтгүй гаалийн тээврийн хэрэгсэл болон интеграцийг `client-android` |

Мавэн Центрэд хэвлэгдэж байгаагүй эд зүйлсийг бариад хэвлүүлээрэй.
орон нутгийн хэмжээнд Iroha эх үүсвэрийн шинэчлэл:

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

`core-jvm` ямар ч агууламжтай Android Үндсэн хуульд заасна. Android үйлчлүүлэгч болон түлхүүр дэлгүүр
код `client-android`, болон ашиглах `offline-wallet-android` . Android- зөвхөн
гарын үсэггүй мөнгөний цалин, JNI урсгал.

## Kotlin Java-тай нийцүүлэл {#kotlin-and-java-compatibility}

Олон нийт API бол Kotlin- нэгдүгээрт, Java-ын интероп JVM дуудлага авах
Үүнтэй тэнцэх өөрчлөлтийг `java/`
хэрэгжилт. Шинэ Android интеграцын үйл ажиллагаа нь Kotlin
Дээрх артефактууд.

Бүгд Kotlin модуль нь хүчин зүйл JDK 8 API төслийн цаг үеийн нийцүүлэл
`-Xjdk-release=8`, барилгын хэрэгслийн сүлжээ өөрөө ашигладаг ч JDK 21.
хэрэглээ JDK 9+ APIs .д SDK Код.

## Хөгжүүлэн туршиж үзээрэй {#build-and-test}

Хөдөлмөрийн хэрэгслийг ажиллуул JVM туршилт:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Хөдөлмөр байгуулах Android артефакт:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Одоогийн хамрааллалт {#current-coverage}

Хөдөлмөрийн Kotlin SDK дараахь зүйлсийг багтаасан:

- Norito Кодируулж, коджуулах
- санхүүгийн бүртгэл, активын хаягийг зохицуулах
- гүйлгээний бүтээн байгуулалт, гарын үсэг зурах, офлайн хуудас
- Torii HTTP, WebSocket, болон SSE үйлчлүүлэгчид
- олон гарын үсэг, бүртгэл, SoraFS, Nexus, болон Connect загварууд
- Android түлхүүр хадгаламж, төхөөрөмжийн телеметрийн интеграц
- Android гараагүй QR, Дээрх газар, NFC тээврийн хэрэгсэл

Хэлэлцүүлэг [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
модулийн хувьд APIs Нөхөрлөгийн тод командууд.
