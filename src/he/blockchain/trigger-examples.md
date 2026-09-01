---
translation_locale: he
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# דוגמא לעורר אירוע {#event-trigger-example}

דוגמא זו משתמשת בחשבון קנוני ללא תחום IDs ובגדרות נכסים מתוכנן במודל הנתונים Iroha 3.

נניח שרשת יש:

- חשבון קנוני שנשלח על ידי המפתח של Alice.
- חשבון קנוני שנשלט על ידי המפתח של Mad Hatter
- הגדרה של נכס צפויה להיות `tea` תחת `wonderland.universal`
- סולן של נכס זה שנמצא על ידי כל חשבון

המטרה היא לרשום מפעיל שמבחין בסלון תה של Alice ומגיש העברה מהחשבון של Mad Hatter כאשר אירוע הנתונים המתאימים מוציא.

## 1. להכין חשבונות ונכסים {#_1-prepare-accounts-and-assets}

רשום תחילה את החשבונות המשתתפים וההגדרה של הנכסים. במערכת הנוכחית Iroha, החשבון IDs מגיע מאובטלי חשבונות, בעוד שזרים מתוכננים משתמשים בצורת `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

להגדרת הנכס עדיין יש כתובת קנונית אטומה. שמרו את הכתובת או בצעו עליה שאילתה לאחר הרישום, והשתמשו בה בפעולת ה-trigger.

## 2. בחר את סמכות ההפעלה {#_2-choose-the-trigger-authority}

להגדיר את החשבון הטכני של המפעיל לחשבון ייחודי כאשר זה אפשרי. חשבון ייחודי מבהיר אילו אישורים נדרשים לביצוע המפעיל וממנע מקושרת המפעיל למפתח החתימה האישי של מפעיל.

החשבון הטכני חייב כבר להתקיים ויש לו רשות להגיש את ההוראות במפעיל הפעלת.

## 3. להגדיר את המופעל {#_3-define-the-executable}

ניתן לבצע את רצף ההוראות שהצולל שולח כאשר מסנן האירועים מתאים. לדוגמה זו, הוא מכיל העברה אחת:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

השתמש בפתוחים הטייפנים הנוכחיים של SDK עבור מטען הנתונים של העסקה הסופית. הימנע מהקוד הקשיח טקסטלי ישן IDs בקוד הטריגר; חישוב או חיפוש קאנוני IDs לפני בניית המוצא.

## להגדיר את מסנן האירועים {#_4-define-the-event-filter}

השתמשו בפילטר של אירועי נתונים שמצמצם את האירועים לאובייקט שאכפת לכם:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

שמרו על פילטרים ספציפיים ככל שהם מעשיים. פילטר `AcceptAll` הוא שימושי לתיקון, אבל זה גורם לכל אירוע מתאים לשלם את העלות של הערכת ההפעלה.

## 5. רשום את הטריגר {#_5-register-the-trigger}

רשום את הטריגר עם:

- יציבה `TriggerId`
- סדרת ההוראות המוצלחת
- `Repeats::Indefinitely` או `Repeats::Exactly(n)`
- החשבון הטכני
- מסנן האירועים
- מטא-נתונים אופציונליים

רישום הטריגר עצמו הוא עסקאות נורמליות, כך שחשבון ההרשמה זקוק לאישור כדי לרשום תניעים. החשבון הטכני זקוק לאזורים הנדרשים על ידי המפעיל התניעה.

## פקודה להוציא להורג {#execution-order}

כאשר בלוק מתבצע:

1. הוראות עסקאות נורמליות פועלות קודם.
2. נאסוף נתונים על אירועים שנוצרו בהוראות אלה.
3. טריגרים שהפילטר שלהם מתאימים לאירועים האלה מיועדים.
4. ההשפעות שיוצר ה־trigger מטופלות בשרשרת העיבוד ביצוע הבלוק, בלי לאפשר ביצוע רקורסיבי בלתי מוגבל של ה־trigger.

אם טריגר משתמש ב־`Repeats::Exactly(n)`, רשמו טריגר חדש לאחר שמספר החזרות מוצה וכאשר אותה התנהגות נדרשת שוב.
