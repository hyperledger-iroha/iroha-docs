---
translation_locale: ur
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin،Android، اور جاوا {#kotlin-android-and-java}

Kotlin SDK JVM اور Android ایپلی کیشنز کے لئے ڈیفالٹ کلائنٹ اسٹیک ہے۔ یہ Iroha ریپوزٹری میں `kotlin/` کے تحت رہتا ہے اور پلیٹ فارم کے ذریعہ تقسیم کیا جاتا ہے تاکہ پورٹیبل کوڈ Android انحصار حاصل نہیں کرتا ہے۔

## ماڈیولز {#modules}

|آرٹی فیکٹ |قسم |استعمال کریں|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |خالص Kotlin/JVM Norito، ڈیٹا ماڈل، کرپٹو، لین دین، Torii، اور پروٹوکول کوڈ |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android کیسٹ اسٹور، ڈیوائس ٹیلی میٹری اور JNI کے ساتھ حمایت یافتہ کلائنٹ انضمام |
|`org.hyperledger.iroha.sdk:kagemusha-wallet-android` |AAR |Android آف لائن بٹوے ٹرانسپورٹ اور انضمام `client-android` پر بنایا گیا |

آرٹیفیکٹس ابھی تک میون سنٹرل میں شائع نہیں ہوئے ہیں۔ ان کو پنڈ Iroha ماخذ کی نظر ثانی سے مقامی طور پر بنائیں اور شائع کریں:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

پھر صرف اس آرٹیفیکٹ کو منتخب کریں جس کی آپ کی درخواست کی ضرورت ہے:

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

`core-jvm` میں کوئی Android انحصار نہیں ہے۔ Android کلائنٹ اور کلیدی اسٹور کوڈ کو `client-android` میں رکھیں ، اور صرف Android آف لائن پرس اور JNI بہاؤ کے لئے `kagemusha-wallet-android` کا استعمال کریں۔

## Kotlin اور جاوا مطابقت {#kotlin-and-java-compatibility}

عوامی API میں Kotlin کو اولیت حاصل ہے اور یہی Java کال کنندگان کے لیے کینونیکل نفاذ ہے؛ `core-jvm` میں Java ماخذ والے صارف ٹیسٹ اسے براہِ راست آزماتے ہیں۔ `java/` درخت میں نقلی نفاذ موجود ہیں جنہیں Kotlin ماڈیولز میں ضم کر کے ختم کیا جا رہا ہے۔ نئے Android انضمام کو اوپر دیے گئے Kotlin آرٹیفیکٹس سے شروع کرنا چاہیے۔

سب Kotlin ماڈیولز نافذ کریں JDK 8 API مرتب کرنے کے وقت ہم آہنگی `-Xjdk-release=8`, اگرچہ تعمیر کے ٹولچین خود استعمال کرتا ہے JDK 21۔ استعمال نہ کریں JDK 9+ APIs میں SDK کوڈ.

## تعمیر اور جانچ {#build-and-test}

JVM ٹیسٹ ایک ہی ماخذ سے بنی `connect_norito_bridge` لائبریری کو `IROHA_NATIVE_LIBRARY_PATH` میں اور `kotlin-fixture-gen` کو `IROHA_KOTLIN_FIXTURE_GEN_BIN` میں رکھ کر چلائیں، جیسا کہ Kotlin SDK کی README میں بیان ہے؛ ان کے بغیر مقامی اجزا پر منحصر ٹیسٹ ناکام ہو جاتے ہیں:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android فن تعمیر:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## موجودہ کوریج {#current-coverage}

Kotlin SDK میں شامل ہیں:

- Norito کوڈنگ اور ڈیکوڈنگ
- کینونیکل اکاؤنٹ اور اثاثہ ایڈریس ہینڈلنگ
- ٹرانزیکشن کی تعمیر، دستخط اور آف لائن لفافے
- Torii HTTP،WebSocket، اور SSE کلائنٹس
- ملٹی دستخط، سبسکرپشن، SoraFS، SORA Nexus، اور کنیکٹ ماڈل
- Android کیسٹ اسٹور اور ڈیوائس ٹیلی میٹری انضمام۔
- Android آف لائن QR، قریب اور NFC ٹرانسپورٹ

ماڈیول سے مخصوص APIs اور عین بلڈ احکامات کے لیے [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) دیکھیں۔
