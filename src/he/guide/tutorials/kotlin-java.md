---
translation_locale: he
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android, וJava {#kotlin-android-and-java}

Kotlin SDK הוא סטק הלקוח המקובל עבור יישומים של JVM ו Android. הוא חי תחת `kotlin/` במחסן של Iroha והוא מחולק על ידי פלטפורמה, כך שקוד נייד לא מקבל תלויות ב Android.

## מודולים {#modules}

|ארטיפקט|סוג |השתמש|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |טהור Kotlin/JVM Norito, מודל נתונים, קריפטו, עסקאות, Torii וקוד פרוטוקול |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android אחסון מפתח, טלמטריה של מכשיר ואינטגרציות לקוחות תומכות ב- JNI |
|`org.hyperledger.iroha.sdk:kagemusha-wallet-android` |AAR |Android הניתוחים והאינטגרציה של ארנקים מקוונים המבוססים על `client-android` |

הארטפקטים עדיין לא פורסמו למאוון סנטרל. לבנות ולפרסם אותם מקומו מתוך העדכון המקור Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

אז בחר רק את הארטפקט שאתה צריך בקשתך:

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

`core-jvm` לא מכיל Android תלויות. Android קוד הלקוח ומחסור המפתח `client-android`, ושימוש `kagemusha-wallet-android` עבור Android-רק ארנק מקוון ו JNI זורמים.

## תאימות Kotlin ו-Java {#kotlin-and-java-compatibility}

ה־API הציבורי מיועד בראש ובראשונה ל־Kotlin, והוא המימוש הקנוני עבור מתקשרים מ־Java; בדיקות צרכנים בקוד מקור Java בתוך `core-jvm` מפעילות אותו ישירות. העץ `java/` מכיל מימושים כפולים שנמצאים בתהליך הוצאה משימוש ושילוב במודולי Kotlin. אינטגרציות Android חדשות צריכות להתחיל בתוצרי Kotlin שלמעלה.

כולם. Kotlin מודולים אימונים JDK 8 API תאימות בזמן הקבלה עם `-Xjdk-release=8`, למרות שרשרת הכלים של הבנייה עצמה משתמשת JDK 21. לא להשתמש JDK 9+ APIs ב SDK קוד.

## בנייה וניסוי {#build-and-test}

הריצו את בדיקות ה־JVM עם הספרייה `connect_norito_bridge` שנבנתה מאותו מקור ב־`IROHA_NATIVE_LIBRARY_PATH` ועם `kotlin-fixture-gen` ב־`IROHA_KOTLIN_FIXTURE_GEN_BIN`, כמתואר ב־README של Kotlin SDK; בלעדיהם הבדיקות התלויות ברכיבים מקוריים נכשלות:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

תבנה את האריפקטים Android:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## הכיסוי הנוכחי {#current-coverage}

ה- Kotlin SDK כולל:

- Norito קוד ודיקודינג
- ניהול חשבונות קנוניים וכתובת נכסים
- בניית עסקאות, חתימה ומעטפות לא מקוונות
- לקוחות Torii HTTP, WebSocket, ו SSE
- דוגמאות של חתימה מרובה, מחתום, SoraFS, SORA Nexus ו- Connect
- Android אינטגרציות טלמטריה של מחסן מפתח ומכשיר
- Android תחבורה מקוונת QR, קרובה NFC

לפרטים על APIs ייעודיים לכל מודול ועל פקודות הבנייה המדויקות, ראו [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md).
