---
translation_locale: ar
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin، Android، وجافا {#kotlin-android-and-java}

Kotlin SDK هو الكومة الافتراضية للعميل لتطبيقات JVM و Android. يقع تحت `kotlin/` في مستودع Iroha ويتم تقسيمه حسب النظام الأساسي بحيث لا يكتسب الكود القابل للنقل تبعيات Android.

## الوحدات {#modules}

|تحفة أثرية|اكتب|استخدم|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |النقي Kotlin/JVM Norito، نموذج البيانات، التشفير، المعاملة، Torii، وكود البروتوكول|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android مخزن المفاتيح، قياس بيانات الجهاز، ودمج العملاء المدعوم بـ JNI|
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android محفظة غير متصلة بالنقل والتكامل مبنية على `client-android` |

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` لا يحتوي على أي تبعيات لـ Android. احتفظ برمز العميل ومخزن المفاتيح Android في `client-android`، واستخدم `kagemusha-wallet-android` لتدفقات المحفظة غير المتصلة والعمليات الخاصة بـ Android-only و JNI.

## Kotlin والتوافق مع جافا {#kotlin-and-java-compatibility}

واجهة API العامة تضع Kotlin أولًا، وهي التنفيذ القياسي للمستدعين من Java؛ وتختبرها مباشرةً اختباراتُ المستهلكين المكتوبة بمصدر Java في `core-jvm`. وتحتوي شجرة `java/` على تنفيذات مكررة يجري سحبها لصالح وحدات Kotlin. يجب أن تبدأ التكاملات الجديدة لـ Android بعناصر Kotlin المذكورة أعلاه.

جميع وحدات Kotlin تفرض توافق JDK 8 API في وقت التجميع مع `-Xjdk-release=8`، على الرغم من أن سلسلة أدوات البناء نفسها تستخدم JDK 21. لا تستخدم JDK 9+ APIs في كود SDK.

## بناء واختبار {#build-and-test}

شغّل اختبارات JVM باستخدام مكتبة `connect_norito_bridge` المبنية من المصدر نفسه في `IROHA_NATIVE_LIBRARY_PATH` و`kotlin-fixture-gen` في `IROHA_KOTLIN_FIXTURE_GEN_BIN`، كما هو موضح في README الخاص بـ Kotlin SDK؛ فبدونهما تفشل الاختبارات المعتمدة على المكونات الأصلية:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

قم ببناء القطع الأثرية Android:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## التغطية الحالية {#current-coverage}

يشمل Kotlin SDK:

- Norito الترميز وفك الترميز
- المعالجة القياسية للحساب والعناوين الأصلية للأصول
- بناء المعاملة، التوقيع، وحاويات البيانات غير المتصلة بالإنترنت
- عملاء Torii HTTP، WebSocket، و SSE
- نماذج التوقيع المتعدد، الاشتراك، SoraFS، SORA Nexus، وConnect
- Android تكاملات مخزن المفاتيح وتليمتري الجهاز
- Android غير متصل QR، بالقرب من، و NFC وسائل النقل

انظر إلى [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) للحصول على APIs الخاص بالوحدة وأوامر البناء الدقيقة.
