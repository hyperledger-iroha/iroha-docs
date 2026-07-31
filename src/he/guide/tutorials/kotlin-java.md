---
translation_locale: he
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
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

## Kotlin ו- Java Compatibility {#kotlin-and-java-compatibility}

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

תראו את [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) עבור מודל ספציפי APIs והוראות של בנייה מדויקות.
