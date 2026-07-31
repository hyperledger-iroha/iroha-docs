---
translation_locale: he
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# דוגמא לעורר אירוע {#event-trigger-example}

דוגמה זו משתמשת בחשבון קאנוני ללא תחום IDs וכספקה מתכננת
הגדרות ב Iroha 3 מודל נתונים.

נניח שרשת יש:

- חשבון קנוני שנשלט על ידי המפתח של אליס
- תיק קנוני שנשלט על ידי המפתח של כובע המטורף
- הגדרה של נכס צפויה כ `tea` תחת `wonderland.universal`
- סולדו של נכס זה שנחזק על ידי כל חשבון

המטרה היא לרשום תפעול שמצפה באיזון תה של אליס
יש להגיש העברה מהחשבון של Mad Hatter כאשר אירוע הנתונים המתאימים
שוחרר.

## 1. להכין חשבונות ואספקים {#_1-prepare-accounts-and-assets}

רשום קודם כל את חשבונות המשתתפים וההגדרה של הנכסים.
זמני Iroha, חשבון IDs מגיעים ממבקרים חשבונות, בעוד מתוכנן
שימוש בתחומים `domain.dataspace` טופס:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

הגדרה של נכס עדיין יש כתובת קנוניקה לא ברורה.
כתובת לאחר הרישום ולהשתמש בה בפעולה המפעילה.

## 2. בחר את סמכות ההדק {#_2-choose-the-trigger-authority}

להגדיר את החשבון הטכני של המפעיל לחשבון מיוחד ככל האפשר.
חשבון מיועד מבהיר אילו רשיונות נדרשים ל-trigger
ביצוע וממנע מקשר ההדק לחתימה האישית של מפעיל
מפתח.

החשבון הטכני חייב כבר להתקיים ויש לו רשות להגיש את
ההוראות במפעיל ההדק.

## 3. להגדיר את המופעל {#_3-define-the-executable}

ניתן לבצע הוא רצף ההוראות שהצולל מספק כאשר האירוע
מתאימים עם פילטר. לדוגמה זו, הוא מכיל העברה אחת:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

השתמש ב SDK הבניינים המתבצעים הנוכחיים של המטען הפועל של העסקה האחרונה.
קובץ קשה טקסטול ישן IDs בקוד ההצלה; ניתוח או חיפוש קאנוני IDs
לפני שבנה את המוצא.

## הגדירו את מסנן האירועים {#_4-define-the-event-filter}

השתמשו בפילטר של אירועי נתונים שמצמצם את האירועים לאובייקט שאכפת לכם:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

שמרו על פילטרים ספציפיים ככל שהם יעילים. `AcceptAll` מסנן הוא שימושי עבור
תיקון, אבל זה גורם לכל אירוע תואם לשלם את העלות של ההדק
הערכה.

## 5. רשום את ההדק {#_5-register-the-trigger}

רשום את ההדק עם:

- סדנה `TriggerId`
- רצף ההוראות המבצעים
- `Repeats::Indefinitely` או `Repeats::Exactly(n)`
- החשבון הטכני
- מסנן האירועים
- נתונים מטאטא אופציונליים

רישום התניע עצמו הוא עסקאות נורמליות, אז
החשבון זקוק לאישור כדי לרשום את ההצליחות.
הזכויות הנדרשות על ידי ההפעול של הפעלת.

## פקודה להוציא להורג {#execution-order}

כאשר בלוק מתבצע:

1. הוראות עסקאות רגילות פועלות קודם.
2. נתונים על אירועים שנוצרו בהוראות אלה נאספים.
3. תפעילים שהפילטר שלהם מתאים לאירועים האלה הם מתוכננים.
4. תופעות המוצרות על ידי התניע מתמודדות בצינור ביצוע בלוק ללא
   מאפשרת ביצוע תפעול ריקורסיבי בלתי מוגבל.

אם תפעיל מפעיל `Repeats::Exactly(n)`, רשום תפעול חדש כאשר המספר
הוא נמאס וההתנהגות הזאת נדרשת שוב.
