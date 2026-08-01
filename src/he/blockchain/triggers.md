---
translation_locale: he
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תפעילים {#triggers}

תפעילים מחברים פילטר אירוע לפעולה שניתן לבצע. כאשר אירוע מתאים לתעילה של התפעיל, Iroha מעריך את פעולת התפעול כחלק מבצעת בלוק.

## מבנה {#structure}

`Trigger` רשום מכיל:

- `id`: א `TriggerId` עטוף a `Name`
- `action`: המפעיל, סמכות, פילטר, מדיניות החזרה, מדיניות הניסיון חוזר ומטאדאַטן

הפעולה כוללת:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, או `IvmProved`
- `repeats`: `Indefinitely` או `Exactly(n)`
- `authority`: החשבון שמזכיר את המופעל
- `filter`: רכיב של `EventFilterBox`
- `retry_policy`: התנהגות ניסיון חוזרת אופציונלית עבור מפעילים זמן מתוכנן.
- `metadata`: נתונים מטאטא של גורמים שרירותיים.

## פילטר אירועים {#event-filters}

תנאי ההפעלה משתמשים באותו מודל של פילטר אירועים כמו חיבורים. פילטר האירועים ברמה הגבוהה ביותר יכול להתאים:

- אירועי צינור
- אירועי נתונים
- אירועים בזמן
- תפעיל אירועים ביצועים
- תפעיל אירועים של סיום

מעדיפים את המסנן הנמוכה ביותר שמתאים לזרם העבודה. מסנן רחבים הם שימושיים עבור אבחון, אבל הם מגבירים את העבודה במהלך ביצוע בלוק.

ראו [פילטרים](/he/blockchain/filters.md) למשפחות הפילטרים הנוכחי.

## תפעול זמן {#time-triggers}

מפעילים זמן משתמשים במחסום אירוע זמן. כאשר תצוגת מצב העולם מגיעה לתנאי זמן מתאים, Iroha מבצע את פעולה ההפעלה תחת סמכות ההפעלה. פעילי זמן הם סוג ההפעלה שיכול להשתמש בפוליטיקה של ניסיון חוזר המתוארת למטה .

## חזור {#repetition}

`Repeats::Indefinitely` משמרת את ההדק פעיל עד שהוא לא רשום.

`Repeats::Exactly(n)` מאפשר לטרגר לירות מספר קבוע של פעמים. כאשר ההספקה נגמרה, רשום טרגר חדש אם נדרש את אותה התנהגות שוב.

## הסמכות והרשיונות {#authority-and-permissions}

סמכות ההפעלה היא החשבון המשמש כדי להזכיר את המופעל. השתמשו בחשבון טכני ייחודי עבור פעילי חיים ארוכים כך שהרשיונות הנדרשים יהיו ברורים ובודדים מהחשבון האישי של מפעיל.

הסמכות זקוקה לרשיונות הנדרשים בהוראות ביצועיות או בקריאה חוזית. החשבון אשר רשום את ההצלה זקוק גם לאישור כדי להירשם את ההצליחים תחת מבדיקת זמן הפעלה הפעילה.

## מדיניות ניסיון חוזר {#retry-policy}

מפעילים זמן יכולים לבחור במדיניות ניסיון חוזר. מדיניות נסיון חוזר מתארת:

- `max_retries`: כמה ניסיונות נסיון חוזרים מותרים לאחר הירי הראשוני נכשל,
- `retry_after_ms`: כמה זמן מחכה Iroha לפני שתהיה ראויה לניסיון נוסף

כאשר התקציב של ניסיון חוזר נגמר, המפעיל אינו רשום.

## שאלות {#queries}

השתמש בשאלות ההצלה הנוכחית כדי לבדוק את מצב ההצלה:

- [`FindTriggers`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)

ראו גם:

- [דוגמה להפעיל אירוע](/he/blockchain/trigger-examples.md)
- [אירועים](/he/blockchain/events.md)
- [הוראות](/he/blockchain/instructions.md)
- [רשיונות](/he/blockchain/permissions.md)
