---
translation_locale: ar
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin ، Android، وجافا {#kotlin-android-and-java}

Kotlin SDK هي كومة العملاء الافتراضية لتطبيقات JVM و Android. إنها تعيش تحت `kotlin/` في مخزن Iroha وتقسم على أساس المنصة بحيث لا يتحصل الرمز المحمول على اعتمادات Android.

## الوحدات {#modules}

|القطع الأثرية|النوع|استخدام |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |طاهرة Kotlin/JVM Norito، نموذج البيانات، العملة الرقمية، المعاملة، Torii، ورمز البروتوكول |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android مخزن المفاتيح ، وسائل قياس الهواتف ، و JNI المدعومة تكاملات العملاء |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android النقل والتكامل في محفظة خارج الاتصال مبنية على `client-android` |

لم يتم نشر الأثار بعد في Maven Central. قم بإنشائها ونشرها محلياً من إصدار المصدر Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

ثم اختر فقط القطع الأثرية التي تحتاج إليها الطلب:

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

`core-jvm` لا تحتوي على أي Android الإعتمادات Android رمز العميل ومخزن المفاتيح في `client-android`, واستخدامها `offline-wallet-android` لـ Android-فقط محفظة خارج الاتصال JNI تدفق.

## Kotlin وتوافق Java {#kotlin-and-java-compatibility}

الجمهور API هو Kotlin-أول وتوفير Java interop حيث يحتاجه المتصلون JVM. تظهر التغييرات المكافئة في تنفيذ `java/` المقابلة. يجب أن تبدأ الاندماج الجديدة Android مع الأثاث Kotlin أعلاه.

جميع وحدات Kotlin تطبق JDK 8 API التوافق في وقت تجميع مع `-Xjdk-release=8` ، على الرغم من أن سلسلة أدوات البناء نفسها تستخدم JDK 21. لا تستخدم JDK 9+ APIs في SDK رمز.

## بناء واختبار {#build-and-test}

إجراء الاختبارات المحمولة JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

بناء القطع الأثرية Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## التغطية الحالية {#current-coverage}

Kotlin SDK يتضمن:

- Norito تشفير وتفكير الشفرة
- التعامل مع الحسابات القياسية وعناوين الأصول
- بناء المعاملات والتوقيع والغلافات الخارجة عن الإنترنت
- العملاء Torii HTTP، WebSocket، و SSE
- النماذج متعددة التوقيعات، الاشتراك، SoraFS، Nexus، و Connect.
- Android تكاملات متجر المفاتيح والجهاز التلفزيوني
- Android غير متصلة QR، قريبة، و NFC النقل

انظروا [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) لتحديد وحدات APIs وأوامر بناء دقيقة.
