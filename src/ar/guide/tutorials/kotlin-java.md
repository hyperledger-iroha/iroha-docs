---
translation_locale: ar
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, والجافا {#kotlin-android-and-java}

(الـ) Kotlin SDK هو كومة العملاء الافتراضية ل JVM و Android الطلبات
إنه يعيش تحت `kotlin/` في Iroha مخزن ويتم تقسيمها من خلال المنصة
رمز محمول لا يحصل Android الإعتمادات

## الوحدات {#modules}

| القطع الأثرية | النوع | الاستخدام |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | النقية Kotlin/JVM Norito, نموذج البيانات، العملات الرقمية، المعاملة، Torii, و رمز البروتوكول |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android مخزن المفاتيح، وسائل قياس الهواتف عن بعد، و JNI-تكاملات العملاء المدعومة |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android النقل والتكامل عبر المحفظة الخارجي `client-android` |

هذه الأثرية لم يتم نشرها بعد في مركز (مايفن) ، قم ببناءها ونشرها
محلياً من الحصن Iroha مراجعة المصدر:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

ثم اختر فقط القطع الأثرية التي تحتاجها الطلب:

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

`core-jvm` لا يحتوي على Android الإعتمادات Android العميل ومخزن المفاتيح
الرمز في `client-android`, واستخدامها `offline-wallet-android` لـ Android- فقط
محفظة خارج الاتصال JNI تدفق.

## Kotlin و التوافق مع جاوا {#kotlin-and-java-compatibility}

الجمهور API هو Kotlin- أولاً و يوفر إطار Java حيث JVM المتصلين يحتاجون
تظهر التغييرات المُساوية في `java/`
التنفيذ Android يجب أن تبدأ التكاملات Kotlin
الآثار فوق.

جميعهم Kotlin وحدات التنفيذ JDK 8 API التوافق في وقت تجميع مع
`-Xjdk-release=8`, على الرغم من أن سلسلة أدوات البناء نفسها تستخدم JDK 21. لا
استخدام JDK 9+ APIs في SDK الرمز.

## بناء واختبار {#build-and-test}

إشغيل الهاتف المحمول JVM الاختبارات:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

بناء Android الآثار:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## التغطية الحالية {#current-coverage}

(الـ) Kotlin SDK يتضمن:

- Norito التشفير والتشفير
- التعامل مع الحسابات القنونية وعناوين الأصول
- إقامة المعاملات والتوقيع والغلافات الخارجة عن الإنترنت
- Torii HTTP, WebSocket, و SSE العملاء
- التوقيع المتعدد، الاشتراك، SoraFS, Nexus, ونماذج Connect
- Android تكاملات المفاتيح والمعدات التليميترية
- Android خارج الاتصال QR, بالقرب، و NFC النقل

انظروا [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
لحدد وحدات APIs وأوامر بناء دقيقة.
