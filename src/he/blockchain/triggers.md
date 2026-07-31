---
translation_locale: he
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תפעילים {#triggers}

תפעילים קושרים פילטר אירוע לפעולה ניתן לבצע. כאשר אירוע מתאים
מסנן ההדק, Iroha מעריך את פעולת ההדק כחלק מהבלוק
הוצאה להורג.

## מבנה {#structure}

רישום `Trigger` מכיל:

- `id`: א `TriggerId` סיבוב a `Name`
- `action`: המוצג, סמכות, פילטר, מדיניות החזרה, מדיניות ניסיון חוזר,
  ונתונים מטא

הפעולה כוללת:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, או `IvmProved`
- `repeats`: `Indefinitely` או `Exactly(n)`
- `authority`: החשבון שקורא למערכת ההפעלה
- `filter`: דה `EventFilterBox`
- `retry_policy`: התנהגות ניסיון חוזר בחופשי עבור גורמי זמן מתוכננים
- `metadata`: נתונים מטאטא של גורמים שרירותיים

## פילטר אירועים {#event-filters}

תנאי ההצלה משתמשים באותו מודל של פילטר אירועים כמו
פילטר אירועים ברמה הגבוהה ביותר יכול להתאים:

- אירועי צינור
- אירועים נתונים
- אירועים בזמן
- תפעיל אירועים ביצוע
- תפעיל אירועים של סיום

מעדיפים את המסנן הנמוכה ביותר שמתאים לזרם העבודה. מסנן רחבים הם שימושיים
אבל הם מגדילים את העבודה במהלך ביצוע הבלוק.

תראו. [פילטרים](/he/blockchain/filters.md) עבור משפחות המסנן הנוכחי.

## תפעול זמן {#time-triggers}

תפעילים זמן משתמשים במחסום אירוע בזמן. כאשר התצוגה של מצב העולם
תנאי זמן מתאים, Iroha מפעיל את פעולת ההדק תחת ההדק
פוצצים זמן הם סוג הפוצץ שיכול להשתמש במדיניות ניסיון מחדש
מתוארת בהמשך.

## חזרה {#repetition}

`Repeats::Indefinitely` שומרת על ההדק פעיל עד שהוא לא רשום.

`Repeats::Exactly(n)` מאפשר לטרגור לירות מספר קבוע של פעמים.
הספירה נגמרה, רשום תגרור חדש אם נדרש את אותה התנהגות.
שוב.

## הסמכות והרשיונות {#authority-and-permissions}

סמכות ההפעלה היא החשבון המשמש כדי להזכיר את המופעל.
חשבון טכני ייחודי עבור תפעילים בעלי חיים ארוכים, כך שהרשיונות הנדרשים
הם מפורשים ובודדים מהחשבון האישי של מפעיל.

הרשות זקוקה לרשיונות הנדרשים בהוראות המבצעות או
התקשרות של החוזה. החשבון המיישם את ההדק גם צריך רשות
רשום תפעילים תחת מדריך ההכנת הפעיל.

## מדיניות ניסיון חוזר {#retry-policy}

תפעילים זמן יכולים לבחור מדיניות ניסיון חוזר. מדיניות נסיון חוזר קובץ:

- `max_retries`: כמה ניסיונות חוזרים מותרים לאחר כשלון ראשוני
  ירי
- `retry_after_ms`: כמה זמן? Iroha מחכה לפני שתהיה ראויה לניסיון נוסף

כאשר התקציב לניסיון חוזר נגמר, המפעיל אינו רשום.

## שאלות {#queries}

השתמש בשאלות ההדק הנוכחית כדי לבדוק את מצב ההדק:

- [`FindTriggers`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)

ראו גם:

- [דוגמא למניע אירוע](/he/blockchain/trigger-examples.md)
- [אירועים](/he/blockchain/events.md)
- [הוראות](/he/blockchain/instructions.md)
- [רשיונות](/he/blockchain/permissions.md)
