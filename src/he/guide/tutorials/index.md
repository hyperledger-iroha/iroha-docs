---
translation_locale: he
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK מאורכים {#sdk-tutorials}

דפים אלה מסכמים את Iroha 3 נקודות כניסה של לקוחות שנשלחו מהחנות הראשית
חלל עבודה, כולל שמות חבילות קנוניים, דרכי התקנת ומרחיב מינימלי
נקודות התחלה.

## הסדר המומלץ {#recommended-order}

1. [תקין Iroha 3](/he/get-started/install-iroha.md)
2. [שיגור Iroha 3](/he/get-started/launch-iroha.md)
3. תבחר אחד. SDK:
   - [Rust](/he/guide/tutorials/rust.md)
   - [Python](/he/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/he/guide/tutorials/javascript.md)
   - [Kotlin, Android, ו- Java](/he/guide/tutorials/kotlin-java.md)
   - [Swift ו-iOS](/he/guide/tutorials/swift.md)
4. בוחן את [דוגמאות של אפליקציות](/he/guide/tutorials/sample-apps.md) כאשר אתה רוצה
   התייחסות מלאה לבקשה ללקוח.
5. שימוש [מוטבע Kaigi](/he/guide/tutorials/kaigi.md) כאשר אתה רוצה להוסיף
   פגישות אוודיו/וידאו בעלות תמיכה בכספת, באפליקציה שלך.
6. שימוש [Musubi חבילות](/he/guide/tutorials/musubi.md) כאשר אתה זקוק לשימוש חוזר
   Kotodama ספריות מקור עם תלונות רישום על שרשרת.

## דגימות {#samples}

מרחב העבודה העליון מכיל JavaScript מתכונים ו Swift דגימה של iOS
לפרויקטים. Android, להתחיל עם Kotlin SDK מודולים וניסויים שלהם.

- [תצוגה של יישומים](/he/guide/tutorials/sample-apps.md)
- [מוטבע Kaigi ב- JavaScript אפליקציה](/he/guide/tutorials/kaigi.md)

## מקור האמת {#source-of-truth}

כולם. SDK דפים כאן נגזרו ממרחב העבודה הנוכחי:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (מראה ג'אבה של Kotlin-הראשון Android פני השטח)
- `IrohaSwift`
- `crates/musubi`

כאשר בספק, מעדיפים את README ונתונים מטאטא של ארגזים במדרגות אלה;
הם מתארים את התיקון המקור שאתה בונה.
