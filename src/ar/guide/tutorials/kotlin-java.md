---
translation_locale: ar
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin، Android، وجافا {#kotlin-android-and-java}

Kotlin SDK هو الكومة الافتراضية للعميل لتطبيقات JVM و Android. يقع تحت `kotlin/` في مستودع Iroha ويتم تقسيمه حسب النظام الأساسي بحيث لا يكتسب الكود القابل للنقل تبعيات Android.

## الوحدات {#modules}

|تحفة أثرية|اكتب|استخدم|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |النقي Kotlin/JVM Norito، نموذج البيانات، التشفير، المعاملة، Torii، وكود البروتوكول|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android مخزن المفاتيح، قياس بيانات الجهاز، ودمج العملاء المدعوم بـ JNI|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android محفظة غير متصلة بالنقل والتكامل مبنية على `client-android` |

لم يتم نشر القطع الأثرية بعد على Maven Central. قم ببنائها ونشرها محليًا من نسخة المصدر المثبتة Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

ثم اختر الأداة التي يحتاجها تطبيقك فقط:

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

`core-jvm` لا يحتوي على أي تبعيات لـ Android. احتفظ برمز العميل ومخزن المفاتيح Android في `client-android`، واستخدم `offline-wallet-android` لتدفقات المحفظة غير المتصلة والعمليات الخاصة بـ Android-only و JNI.

## Kotlin والتوافق مع جافا {#kotlin-and-java-compatibility}

العامة API هي Kotlin-أول وتوفر التوافق مع جافا حيث يحتاج المتصلون بـ JVM إليه. يتم عكس التغييرات المكافئة في تنفيذ `java/` المقابل. يجب أن تبدأ التكاملات الجديدة لـ Android بالأدوات Kotlin أعلاه.

جميع وحدات Kotlin تفرض توافق JDK 8 API في وقت التجميع مع `-Xjdk-release=8`، على الرغم من أن سلسلة أدوات البناء نفسها تستخدم JDK 21. لا تستخدم JDK 9+ APIs في كود SDK.

## بناء واختبار {#build-and-test}

قم بتشغيل اختبارات JVM المحمولة:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

قم ببناء القطع الأثرية Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## التغطية الحالية {#current-coverage}

يشمل Kotlin SDK:

- Norito الترميز وفك الترميز
- المعالجة القياسية للحساب والعناوين الأصلية للأصول
- بناء المعاملة، التوقيع، وحاويات البيانات غير المتصلة بالإنترنت
- عملاء Torii HTTP، WebSocket، و SSE
- نماذج التوقيع المتعدد، الاشتراك، SoraFS، Nexus، وConnect
- Android تكاملات مخزن المفاتيح وتليمتري الجهاز
- Android غير متصل QR، بالقرب من، و NFC وسائل النقل

انظر إلى [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) للحصول على APIs الخاص بالوحدة وأوامر البناء الدقيقة.
