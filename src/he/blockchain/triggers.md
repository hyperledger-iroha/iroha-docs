---
translation_locale: he
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# טריגרים {#triggers}

טריגרים קושרים מסנן אירועים לפעולה הניתנת לביצוע. כאשר אירוע תואם למסנן של הטריגר, Iroha מעריך את פעולת הטריגר כחלק מביצוע הבלוק.

## מבנה {#structure}

`Trigger` רשום מכיל:

- `id`: ‏`TriggerId` שעוטף ערך `Name`
- `action`: רכיב הביצוע, הסמכות, המסנן, מדיניות החזרות, מדיניות הניסיון החוזר ומטא־נתונים

הפעולה כוללת:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, או `IvmProved`
- `repeats`: `Indefinitely` או `Exactly(n)`
- `authority`: החשבון שמפעיל את רכיב הביצוע
- `filter`: רכיב מסוג `EventFilterBox`
- `retry_policy`: התנהגות אופציונלית לניסיון חוזר עבור טריגרים מתוזמנים לפי זמן
- `metadata`: מטא־נתונים שרירותיים של הטריגר

## פילטר אירועים {#event-filters}

תנאי הטריגר משתמשים באותו מודל מסנני אירועים המשמש מנויים. מסנן האירועים ברמה העליונה יכול להתאים ל:

- אירועי pipeline
- אירועי נתונים
- אירועים בזמן
- אירועי ביצוע טריגר
- אירועי השלמת טריגר

העדיפו את המסנן הצר ביותר המתאים לתהליך העבודה. מסננים רחבים שימושיים לאבחון, אך מגדילים את העבודה במהלך ביצוע בלוק.

למשפחות המסננים הנוכחיות ראו [מסננים](/he/blockchain/filters.md).

## טריגרים מבוססי זמן {#time-triggers}

טריגרים מבוססי זמן משתמשים במסנן אירוע זמן. כאשר תצוגת מצב העולם מגיעה לתנאי זמן מתאים, Iroha מבצע את פעולת הטריגר תחת סמכות הטריגר. זהו סוג הטריגר שיכול להשתמש במדיניות הניסיון החוזר המתוארת להלן.

## חזרות {#repetition}

`Repeats::Indefinitely` משאיר טריגר פעיל עד להסרתו מהרישום.

`Repeats::Exactly(n)` מאפשר לטריגר לפעול מספר קבוע של פעמים. לאחר שמספר החזרות מוצה, רשמו טריגר חדש אם אותה התנהגות נדרשת שוב.

## סמכות והרשאות {#authority-and-permissions}

סמכות הטריגר היא החשבון המשמש להפעלת רכיב הביצוע. השתמשו בחשבון טכני ייעודי עבור טריגרים ארוכי־חיים, כדי שההרשאות הנדרשות יהיו מפורשות ומבודדות מהחשבון האישי של המפעיל.

הסמכות זקוקה להרשאות הנדרשות בידי הוראות הביצוע או קריאת החוזה. החשבון הרושם את הטריגר זקוק גם להרשאה לרשום טריגרים תחת ה־validator הפעיל של סביבת הריצה.

## מדיניות ניסיון חוזר {#retry-policy}

טריגרים מבוססי זמן יכולים לבחור במדיניות ניסיון חוזר. מדיניות כזו מגדירה:

- `max_retries`: כמה ניסיונות חוזרים מותרים לאחר שההפעלה הראשונית נכשלה
- `retry_after_ms`: כמה זמן Iroha ממתין לפני שניסיון חוזר נעשה כשיר

כאשר תקציב הניסיונות החוזרים מוצה, הטריגר מוסר מהרישום.

## שאילתות {#queries}

השתמשו בשאילתות הטריגר הנוכחיות כדי לבדוק את מצב הטריגר:

- [`FindTriggers`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/he/reference/queries.md#triggers-contracts-transactions-and-blocks)

ראו גם:

- [דוגמה לטריגר אירועים](/he/blockchain/trigger-examples.md)
- [אירועים](/he/blockchain/events.md)
- [הוראות](/he/blockchain/instructions.md)
- [הרשאות](/he/blockchain/permissions.md)
