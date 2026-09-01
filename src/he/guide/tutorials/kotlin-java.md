---
translation_locale: he
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, וJava {#kotlin-android-and-java}

Kotlin SDK הוא סטק הלקוח המקובל עבור יישומים של JVM ו Android. הוא חי תחת `kotlin/` במחסן של Iroha והוא מחולק על ידי פלטפורמה, כך שקוד נייד לא מקבל תלויות ב Android.

## מודולים {#modules}

|ארטיפקט|סוג |השתמש|
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |טהור Kotlin/JVM Norito, מודל נתונים, קריפטו, עסקאות, Torii וקוד פרוטוקול |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android אחסון מפתח, טלמטריה של מכשיר ואינטגרציות לקוחות תומכות ב- JNI |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android הניתוחים והאינטגרציה של ארנקים מקוונים המבוססים על `client-android` |

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
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` לא מכיל Android תלויות. Android קוד הלקוח ומחסור המפתח `client-android`, ושימוש `offline-wallet-android` עבור Android-רק ארנק מקוון ו JNI זורמים.

## תאימות Kotlin ו-Java {#kotlin-and-java-compatibility}

הקהל API הוא Kotlin-ראשון ומספק אינטרופ ג'אבה כאשר מתקשרים JVM זקוקים לו. שינויים מקבילים משתקפים בהתאם `java/` יישום. האינטגרציות חדשות Android צריכות להתחיל עם האריפקטים של Kotlin למעלה .

כולם. Kotlin מודולים אימונים JDK 8 API תאימות בזמן הקבלה עם `-Xjdk-release=8`, למרות שרשרת הכלים של הבנייה עצמה משתמשת JDK 21. לא להשתמש JDK 9+ APIs ב SDK קוד.

## בנייה וניסוי {#build-and-test}

להפעיל את בדיקות JVM ניידות:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

תבנה את האריפקטים Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## הכיסוי הנוכחי {#current-coverage}

ה- Kotlin SDK כולל:

- Norito קוד ודיקודינג
- ניהול חשבונות קנוניים וכתובת נכסים
- בניית עסקאות, חתימה ומעטפות לא מקוונות
- לקוחות Torii HTTP, WebSocket, ו SSE
- דוגמאות של חתימה מרובה, מחתום, SoraFS, Nexus ו- Connect
- Android אינטגרציות טלמטריה של מחסן מפתח ומכשיר
- Android תחבורה מקוונת QR, קרובה NFC

לעיון ב־APIs ייחודיים למודולים ובפקודות הבנייה המדויקות, ראו את [קובץ README של Kotlin SDK](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md).
