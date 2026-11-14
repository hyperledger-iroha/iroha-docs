---
translation_locale: he
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---
# טריגרים {#triggers}

## תוצאה {#outcome}

רשמו ב־Taira טריגר המופעל בקריאה עם מספר הפעלות מוגבל, הפעילו אותו פעם אחת, המתינו לסופיות במצב Applied ואמתו את השלמתו המוצלחת מתוך היסטוריית הבלוקים שקובעו.

## תנאים מוקדמים {#prerequisites}

- חותם ממומן, `taira.client.toml` ו־`TAIRA_ACCOUNT_ID` מתוך [חיבור ל־Taira](./connect-to-taira.md). פעולות כתיבה משתמשות ב־`--fee-payer authority`; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.
- הרשאה ב־Taira לרשום טריגר עבור `TAIRA_ACCOUNT_ID` ולהפעיל את הטריגר שנוצר. האסימונים הרלוונטיים הם `CanRegisterTrigger` המוגבל לפי `authority`, ו־`CanExecuteTrigger` המוגבל לפי `trigger`.
- אם הרשאות אלה אינן זמינות, השתמשו ברשת מקומית שנוצרה ובלקוח המנהל שלה. חשבון הסמכות של הטריגר זקוק גם לכל הרשאה הנדרשת להוראות שהטריגר יבצע.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## שלבים {#steps}

### 1. רשמו טריגר המבוסס על הוראות {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` מקבל את מערך הוראות ה־JSON ש־`--emit-instructions` מדפיס. הפקודה `tx ping` מפיקה הוראת `Log` אחת, שמשאירה את הדוגמה ממוקדת בהרשאת trigger במקום בהרשאות של אובייקט שני בספר החשבונות.

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

הטריגר יכול לפעול שלוש פעמים לכל היותר. חשבון הסמכות המוצהר שלו, ולא החשבון שקורא להפעלתו, הוא שמעניק את ההרשאה להוראות שבתוך הפעולה.

### 2. בדקו את ההצהרה לפני ההפעלה {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

ודאו את סמכות ה־I105, את מסנן ההפעלה, את מספר החזרות שנותרו ואת ההוראה המקודדת היחידה שב־`executable` לפני שתוציאו עמלה נוספת.

### 3. הפעילו והמתינו לשתי השכבות {#_3-execute-and-wait-for-both-layers}

לעסקת ההפעלה ולפעולת הטריגר יש ראיות נפרדות. `--wait` ממתין לסופיות העסקה במצב Applied; `--trace` מדווח גם על אבחון השלמת הביצוע בסביבת הריצה.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

לקוחות Rust בונים את אותן שתי הוראות בעלות טיפוס. כאן `authority` הוא `AccountId`, ו־`client` הוא `iroha::blocking::Client` שחותם בתור החשבון הזה; `submit` ממתין לסופיות Applied:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## אימות {#verify}

סרקו את היסטוריית הבלוקים שקובעו כדי למצוא את ההשלמה, ובדקו שמספר החזרות שנותרו קטן:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

לפחות תוצאת השלמה אחת חייבת לדווח על הצלחה. הטריגר חייב להישאר פעיל עם שתי הפעלות שנותרו. שליחה מוצלחת ללא השלמה מוצלחת של הטריגר אינה אימות מספק.

## פתרון בעיות {#troubleshooting}

- דחיית הרישום עקב חוסר הרשאה פירושה שלחותם חסר `CanRegisterTrigger` עבור חשבון הסמכות המוצהר. ההפעלה דורשת את אסימון `CanExecuteTrigger`, שהיקפו מוגדר בנפרד.
- עסקה יכולה להגיע למצב Applied בזמן שפעולת הטריגר מדווחת על כישלון. קראו את תוצאת ההשלמה ואת השגיאה, ואז בדקו את הרשאות חשבון הסמכות של הטריגר עבור כל הוראה כלולה.
- `Trigger with id … not found` עשוי להעיד שעסקת הרישום נדחתה, או שבהפעלה נעשה שימוש בתצורת Torii או שרשרת אחרת.
- כאשר מספר החזרות מגיע לאפס, הנפקת חזרות נוספות היא פעולת כתיבה נוספת הדורשת הרשאה. אל תשנו בשקט את המתכון לטריגר שמספר הפעלותיו אינו מוגבל.
- לצורך ניקוי, `trigger unregister --id "$TRIGGER_ID"` דורש `CanUnregisterTrigger` עבור אותו טריגר, וכן בחירה מפורשת של משלם העמלה.

## מקור ותיעוד קשור {#source-and-related-docs}

- [בדיקות אינטגרציה של טריגר המופעל בקריאה בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [בדיקות אינטגרציה של אירועים וטריגרים בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [ביצוע הוראות טריגר בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [טריגרים](/he/blockchain/triggers.md)
- [דוגמאות לטריגרים](/he/blockchain/trigger-examples.md)
- [אירועים](./stream-events.md)
