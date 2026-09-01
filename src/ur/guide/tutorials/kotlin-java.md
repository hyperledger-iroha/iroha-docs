---
translation_locale: ur
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin،Android، اور جاوا {#kotlin-android-and-java}

Kotlin SDK JVM اور Android ایپلی کیشنز کے لئے ڈیفالٹ کلائنٹ اسٹیک ہے۔ یہ Iroha ریپوزٹری میں `kotlin/` کے تحت رہتا ہے اور پلیٹ فارم کے ذریعہ تقسیم کیا جاتا ہے تاکہ پورٹیبل کوڈ Android انحصار حاصل نہیں کرتا ہے۔

## ماڈیولز {#modules}

|آرٹی فیکٹ |قسم |استعمال کریں|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |خالص Kotlin/JVM Norito، ڈیٹا ماڈل، کرپٹو، لین دین، Torii، اور پروٹوکول کوڈ |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android کیسٹ اسٹور، ڈیوائس ٹیلی میٹری اور JNI کے ساتھ حمایت یافتہ کلائنٹ انضمام |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android آف لائن بٹوے ٹرانسپورٹ اور انضمام `client-android` پر بنایا گیا |

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
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` میں کوئی Android انحصار نہیں ہے۔ Android کلائنٹ اور کلیدی اسٹور کوڈ کو `client-android` میں رکھیں ، اور صرف Android آف لائن پرس اور JNI بہاؤ کے لئے `offline-wallet-android` کا استعمال کریں۔

## Kotlin اور جاوا مطابقت {#kotlin-and-java-compatibility}

عوام API ہے Kotlin- سب سے پہلے اور جاوا انٹروپ فراہم کرتا ہے جہاں JVM کال کرنے والوں کو اس کی ضرورت ہے۔ مساوی تبدیلیاں `java/` لاگو کرنا۔ نیا Android انضمام کے ساتھ شروع کرنا چاہئے Kotlin مندرجہ بالا آرٹی فیکٹس.

سب Kotlin ماڈیولز نافذ کریں JDK 8 API مرتب کرنے کے وقت ہم آہنگی `-Xjdk-release=8`, اگرچہ تعمیر کے ٹولچین خود استعمال کرتا ہے JDK 21۔ استعمال نہ کریں JDK 9+ APIs میں SDK کوڈ.

## تعمیر اور جانچ {#build-and-test}

پورٹ ایبل JVM ٹیسٹ انجام دیں:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android فن تعمیر:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## موجودہ کوریج {#current-coverage}

Kotlin SDK میں شامل ہیں:

- Norito کوڈنگ اور ڈیکوڈنگ
- کینونیکل اکاؤنٹ اور اثاثہ ایڈریس ہینڈلنگ
- ٹرانزیکشن کی تعمیر، دستخط اور آف لائن لفافے
- Torii HTTP،WebSocket، اور SSE کلائنٹس
- ملٹی دستخط، سبسکرپشن، SoraFS، Nexus، اور کنیکٹ ماڈل
- Android کیسٹ اسٹور اور ڈیوائس ٹیلی میٹری انضمام۔
- Android آف لائن QR، قریب اور NFC ٹرانسپورٹ

ماڈیول سے مخصوص APIs اور عین بلڈ کمانڈز کے لیے [Kotlin SDK کی README فائل](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) دیکھیں۔
