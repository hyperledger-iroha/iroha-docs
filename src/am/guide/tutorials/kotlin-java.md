---
translation_locale: am
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, እና ጃቫ {#kotlin-android-and-java}

የ Kotlin SDK ለ ደንበኛው ነባሪ ክምችት JVM እና Android ማመልከቻዎች።
ይህ ስር ይኖራል `kotlin/` በ Iroha መደርደሪያ እና በመድረክ የተከፋፈለ ነው ስለዚህ
ተንቀሳቃሽ ኮድ አያገኝም Android ጥገኛነት።

## ሞጁሎች {#modules}

| የሥነ ጥበብ ዕቃ | አይነት | አጠቃቀም |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | ንጹሕ Kotlin/JVM Norito, የመረጃ ሞዴል፣ ምስጠራ፣ ግብይት፣ Torii, እና የፕሮቶኮል ኮድ |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android ቁልፍ ማከማቻ ፣ የመሣሪያ ቴሌሜትሪ እና JNI-የተደገፈ የደንበኛ ውህደት |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android ከመስመር ውጭ የኪስ ቦርሳ ትራንስፖርት እና ውህደት `client-android` |

የእነሱን ዕቃዎች ማቨን ሴንትራል ገና አልተለጠፉም።
በአካባቢው ከታሰረ Iroha ምንጭ ማሻሻያ:

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

`core-jvm` አያካትትም Android ጥገኛነት። Android ደንበኛ እና ቁልፍ ማከማቻ
ኮድ ውስጥ `client-android`, እና አጠቃቀም `offline-wallet-android` ለ Android- ብቻ
ከመስመር ውጭ የኪስ ቦርሳ እና JNI ፍሰቶች።

## Kotlin እና የጃቫ ተኳሃኝነት {#kotlin-and-java-compatibility}

የሕዝብ API ነው Kotlin-በመጀመሪያ እና የጃቫ interop ያቀርባል JVM ደራሲዎች ያስፈልጋቸዋል
ተመጣጣኝ ለውጦች በተዛማጅ `java/`
አተገባበር Android ውህደቶች በ Kotlin
ከላይ ያሉት ቅርሶች።

ሁሉም Kotlin ሞጁሎች ማስከበር JDK 8 API በቅጅ ጊዜ ከ
`-Xjdk-release=8`, ምንም እንኳን የግንባታ መሳሪያ ሰንሰለት ራሱ ቢጠቀምም JDK 21. አታድርግ
አጠቃቀም JDK 9+ APIs ውስጥ SDK ኮድ.

## መገንባትና መሞከር {#build-and-test}

ተንቀሳቃሽ አሂድ JVM ሙከራዎች:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

ይገንቡ Android ጥንታዊ ነገሮች፦

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## ወቅታዊ ሽፋን {#current-coverage}

የ Kotlin SDK የሚከተሉትን ያካትታል:

- Norito ኮዲንግ እና ዲኮዲንግ
- የካኖኒክ ሂሳብ እና የንብረት አድራሻ አያያዝ
- የግብይት ግንባታ፣ ፊርማ እና ከመስመር ውጪ ያሉ ፖስታዎች
- Torii HTTP, WebSocket, እና SSE ደንበኞች
- ባለብዙ ፊርማ፣ ምዝገባ፣ SoraFS, Nexus, እና Connect ሞዴሎች
- Android የቁልፍ ማከማቻ እና የመሣሪያ ቴሌሜትሪ ውህደቶች
- Android ከመስመር ውጭ QR, በአቅራቢያ እና NFC መጓጓዣ

ተመልከት [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
ለሞጁል የተወሰነ APIs እና ትክክለኛ የግንባታ ትዕዛዞች.
