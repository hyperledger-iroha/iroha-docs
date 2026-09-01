---
translation_locale: he
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK הדרכים {#sdk-tutorials}

דפים אלה מתארים את נקודות הכניסה של הלקוח Iroha 3 שנשלחו ממרחב העבודה הראשי, כולל שמות חבילות קנוניים, דרכים התקנת ומנקודות התחלה מינימליות.

## סדר מומלץ {#recommended-order}

1. [להתקין Iroha 3](/he/get-started/install-iroha.md)
2. [שיגור Iroha 3](/he/get-started/launch-iroha.md)
3. בחרו SDK:
   - [Rust](/he/guide/tutorials/rust.md)
   - [Python](/he/guide/tutorials/python.md)
   - [JavaScript / TypeScript ](/he/guide/tutorials/javascript.md)
   - [Kotlin, Android, ו- Java](/he/guide/tutorials/kotlin-java.md)
   - [Swift ו-iOS](/he/guide/tutorials/swift.md)
4. בדוק את אפליקציות הדוגמא [](/he/guide/tutorials/sample-apps.md) כאשר אתה רוצה תיקון שלם של יישום קלינט.
5. השתמש [הטמעת Kaigi](/he/guide/tutorials/kaigi.md) כאשר אתה רוצה להוסיף פגישות אוודיו / וידאו תומכות בארנק שלך אפליקציה משלך.
6. השתמשו בקבוצות [Musubi ](/he/guide/tutorials/musubi.md) כאשר אתם צריכים ספריות מקורות Kotodama שניתן להשתמש בהן שוב עם תלונות רישום על שרשרת.

## דגימות {#samples}

מרחב העבודה העליון מכיל מתכונים JavaScript ופרויקטים דגימאיים של Swift/iOS. עבור Android, התחל עם מודולים Kotlin SDK והניסויים שלהם.

- [תמונה של דוגמאות אפליקציות ](/he/guide/tutorials/sample-apps.md)
- [כרוך Kaigi באפליקציה JavaScript ](/he/guide/tutorials/kaigi.md)

## מקור האמת {#source-of-truth}

כל הדפים SDK כאן נגזרו ממרחב העבודה העליון הנוכחי:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (מראה ג'אווה של פני השטח Kotlin-ראשון Android)
- `IrohaSwift`
- `crates/musubi`

כאשר יש ספק, העדיפים את README ואת הנתונים המטאטאוניים של החבילה במדרגות אלה; הם מתארים את התיקון המקור שאתה בונה.
