---
translation_locale: he
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, ו- Java {#kotlin-android-and-java}

ה- Kotlin SDK הוא סטק הלקוח המקובל עבור JVM ו Android בקשות.
הוא חי תחת `kotlin/` ב- Iroha מאגר ומחולק לפי פלטפורמה כך
קוד נייד לא מקבל Android תלות.

## מודולים {#modules}

| חפץ | סוג | שימוש |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | טהור Kotlin/JVM Norito, מודל נתונים, קריפטו, עסקאות, Torii, קוד פרוטוקול |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android מחסן מפתחות, טלמטריה של המכשיר, JNI- אינטגרציות לקוחות מבוססות |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android תחבורה של ארנקים מקוונים והאינטגרציה המבוססת על `client-android` |

האריפקטים עדיין לא פורסמו למאוון סנטרל.
באופן מקומי מ- pinned Iroha תיקון מקור:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

לאחר מכן בחר רק את הארטפקט שאתה צריך בקשה:

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

`core-jvm` לא מכיל Android תלויות. Android לקוח ומחסן מפתח
קוד ב `client-android`, ושימוש `offline-wallet-android` עבור Android-רק
ארנק מקוון ו JNI זורמים.

## Kotlin ו- Java Compatibility {#kotlin-and-java-compatibility}

הציבור API הוא Kotlin-ראשון ומספק אינטרופ ג'אווה JVM המתקשרים צריכים
השינויים המקבילים משקפים ב- `java/`
יישום. Android האינטגרציה צריכה להתחיל עם Kotlin
חפצים למעלה.

כולם. Kotlin מודולים איכפת JDK 8 API תאימות בזמן הקבלה עם
`-Xjdk-release=8`, למרות שרשרת כלי הבנייה עצמה משתמשת JDK 21. לא
שימוש JDK 9+ APIs ב SDK קוד.

## לבנות ולנסות {#build-and-test}

תפעיל את הנייד JVM בדיקות:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

לבנות את Android חפצים:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## כיסוי הנוכחי {#current-coverage}

ה- Kotlin SDK כולל:

- Norito קוד ודיקוד
- ניהול חשבונות קנוניים וכתובת נכסים
- בניית עסקאות, חתימה ומעטפות מקוונת
- Torii HTTP, WebSocket, ו SSE לקוחות
- חתימה מרובה, מחתום SoraFS, Nexus, ומודלים Connect
- Android אינטגרציות טלמטריה של מחסן מפתח ומכשיר
- Android לא מקוונת QR, בקרבת מקום, NFC תחבורה

תראו את [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
עבור מודל ספציפי APIs והוראות הבנייה המדויקות.
