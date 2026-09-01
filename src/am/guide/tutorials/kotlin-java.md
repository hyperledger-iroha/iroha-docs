---
translation_locale: am
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin፣ Android እና ጃቫ {#kotlin-android-and-java}

የ Kotlin SDK ለ JVM እና Android መተግበሪያዎች ነባሪ የደንበኛ ቁልል ነው። በ`kotlin/` በ Iroha ማከማቻ ውስጥ ይኖራል እና ተንቀሳቃሽ ኮድ Android ጥገኞችን እንዳያገኝ በመድረክ የተከፈለ ነው።

## ሞጁሎች {#modules}

|አርቲፊኬሽን|ዓይነት|ጥቅም|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm`|JAR|ንፁህ Kotlin/JVM Norito፣ የውሂብ ሞዴል፣ crypto፣ ግብይት፣ Torii እና የፕሮቶኮል ኮድ|
|`org.hyperledger.iroha.sdk:client-android`|AAR|Android የቁልፍ ማከማቻ፣ የመሣሪያ ቴሌሜትሪ እና JNI የሚደገፉ የደንበኛ ውህደቶች|
|`org.hyperledger.iroha.sdk:offline-wallet-android`|AAR|Android ከመስመር ውጭ የኪስ ቦርሳ መጓጓዣዎች እና ውህደት በ `client-android` ላይ የተገነባ|

አርቲፋክቶቹ ገና ወደ Maven Central አልታተሙም። ከተሰካው Iroha ምንጭ ክለሳ በአገር ውስጥ ይገንቡ እና ያትሙ -

```bash
cd kotlin
./gradlew publishToMavenLocal
```

ከዚያ መተግበሪያዎ የሚፈልገውን አርቲፋክት ብቻ ይምረጡ -

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

`core-jvm` ምንም Android ጥገኞች አልያዘም። የ Android ደንበኛ እና የቁልፍ ማከማቻ ኮድ በ`client-android` ውስጥ ያስቀምጡ እና `offline-wallet-android`ን ለ Android ብቻ ከመስመር ውጭ የኪስ ቦርሳ እና JNI ፍሰቶች ይጠቀሙ።

## Kotlin እና የጃቫ ተኳኋኝነት {#kotlin-and-java-compatibility}

ህዝቡ API Kotlin-መጀመሪያ ነው እና JVM ደንበኞችን የሚጠይቁበት የጃቫ መስተጋብር ያቀርባል። ተመጣጣኝ ለውጦች በተዛማጅ `java/` አተገባበር ውስጥ ይንጸባረቃሉ። አዲስ Android ውህደቶች ከላይ ባሉት Kotlin አርቲፋክቶች መጀመር አለባቸው።

ሁሉም የ Kotlin ሞጁሎች JDK 8 API ተኳሃኝነትን ከ `-Xjdk-release=8` ጋር በማጠናቀር ጊዜ ያስፈጽማሉ፣ ምንም እንኳን የግንባታ መሳሪያው ራሱ JDK 21 ቢጠቀምም። በ SDK ኮድ ውስጥ JDK 9+ APIs አይጠቀሙ።

## ይገንቡ እና ይፈትሹ {#build-and-test}

ተንቀሳቃሽ የ JVM ሙከራዎችን ያሂዱ

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

የ Android አርቲፋክቶችን ይገንቡ -

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## የአሁኑ ሽፋን {#current-coverage}

Kotlin SDK የሚከተሉትን ያጠቃልላል

- Norito ኢንኮዲንግ እና ዲኮዲንግ
- ነጠላ ፕሮቶኮል-መደበኛ መለያ እና የንብረት አድራሻ አያያዝ
- የግብይት ግንባታ፣ መፈረም እና ከመስመር ውጭ የውሂብ መያዣዎች
- Torii HTTP፣ WebSocket እና SSE ደንበኞች
- ባለብዙ ፊርማ፣ የደንበኝነት ምዝገባ፣ SoraFS፣ Nexus እና ሞዴሎችን ያገናኙ
- Android የቁልፍ መደብር እና የመሣሪያ ቴሌሜትሪ ውህደቶች
- Android ከመስመር ውጭ QR፣ በአቅራቢያ እና NFC ማጓጓዣዎች

ለሞጁል-ተኮር APIs እና ትክክለኛ የግንባታ ትዕዛዞችን [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) ይመልከቱ።
