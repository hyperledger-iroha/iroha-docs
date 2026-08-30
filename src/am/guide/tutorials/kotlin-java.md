---
translation_locale: am
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin ፣ Android እና ጃቫ {#kotlin-android-and-java}

Kotlin SDK ለ JVM እና Android መተግበሪያዎች ነባሪ የደንበኛ ክምችት ነው ። በ Iroha መዝገብ ውስጥ ከ `kotlin/` በታች የሚኖር ሲሆን በመድረክ የተከፋፈለ ስለሆነ ተንቀሳቃሽ ኮድ የ Android ጥገኛነት አያገኝም።

## ሞጁሎች {#modules}

|አርቲፊኬት |አይነት |አጠቃቀም|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |ንጹህ Kotlin/JVM Norito፣ የውሂብ ሞዴል፣ ምስጠራ፣ ግብይት፣ Torii፣ እና ፕሮቶኮል ኮድ |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android የቁልፍ ማከማቻ ፣ የመሣሪያ ቴሌሜትሪ እና JNI የተደገፉ የደንበኛ ውህደቶች |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android በ `client-android` ላይ የተገነባው ከመስመር ውጭ የኪስ ቦርሳ መጓጓዣ እና ውህደት |

እቃዎቹ ገና በማቨን ሴንትራል አልተለጠፉም ። ከታሸገ Iroha ምንጭ ማሻሻያ አካባቢያዊ በሆነ መንገድ ይገንቡ እና ያትሟቸው:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

ከዚያም ማመልከቻዎ የሚፈልገውን መሣሪያ ብቻ ይምረጡ:

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

`core-jvm` ምንም የ Android ጥገኛነት የለውም. Android ደንበኛ እና ቁልፍ ማከማቻ ኮድ በ `client-android` ውስጥ ይያዙ, እና ለ Android ብቻ ከመስመር ውጭ ቦርሳ እና ለ JNI ዥረቶች `offline-wallet-android` ይጠቀሙ.

## Kotlin እና የጃቫ ተኳሃኝነት {#kotlin-and-java-compatibility}

ህዝቡ API ነው Kotlin-በመጀመሪያ እና የጃቫ interop ያቀርባል JVM ተመጣጣኝ ለውጦች የሚመለከቱት በተዛማጅ `java/` አዲሱ Android ውህደቶች በ Kotlin ከላይ ያሉት ቅርሶች።

ሁሉም Kotlin ሞጁሎች ማስከበር JDK 8 API በኮምፒዩተር ጊዜ ከ `-Xjdk-release=8`, ምንም እንኳን የግንባታ መሳሪያ ሰንሰለት ራሱ የሚጠቀም ቢሆንም JDK 21. አይጠቀሙ JDK 9+ APIs ውስጥ SDK ኮድ.

## መገንባትና መሞከር {#build-and-test}

ተንቀሳቃሽ JVM ሙከራዎችን ያካሂዱ:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

የ Android ዕቃዎች መገንባት

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## ወቅታዊ ሽፋን {#current-coverage}

Kotlin SDK የሚከተሉትን ያካትታል:

- Norito ኢንኮዲንግ እና ዲኮዲንግ
- የካኖኒክ ሂሳብ እና የንብረቶች አድራሻ አያያዝ
- የግብይት ግንባታ, ፊርማ እና ከመስመር ውጪ ያሉ ፖስታዎች
- Torii HTTP፣ WebSocket እና SSE ደንበኞች
- ባለብዙ ፊርማ ፣ የደንበኝነት ምዝገባ፣ SoraFS ፣ Nexus እና Connect ሞዴሎች
- Android የቁልፍ ማከማቻ እና የመሣሪያ ቴሌሜትሪ ውህዶች
- Android ከመስመር ውጭ QR ፣ በአቅራቢያ እና NFC መጓጓዣ

ለሞጁል-ተኮር APIs እና ትክክለኛ የግንባታ ትዕዛዞች በ [Kotlin SDK README ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) ውስጥ ይመልከቱ።
