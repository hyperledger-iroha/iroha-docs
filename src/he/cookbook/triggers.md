---
translation_locale: he
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תפעילים {#triggers}

## התוצאה {#outcome}

רשום תפעול שיחה קצרה על Taira, פעל אותו פעם אחת, חכה לסיום יישום, ותוכיח את השלמתו בהצלחה מתוך היסטוריה של בלוק מחויבים.

## תנאים מוקדמים {#prerequisites}

- חותם מיומן, `taira.client.toml`, `taira.tx-metadata.json`, ו `TAIRA_ACCOUNT_ID` מ [להתחבר Taira](./connect-to-taira.md).
- Taira אישור לרשום תפעול ל- `TAIRA_ACCOUNT_ID` ולפעול את התפעול המוצא. הסימנים הרלוונטיים הם `CanRegisterTrigger` עם טווח של `authority` ו `CanExecuteTrigger` עם טווח על ידי `trigger`.
- אם הכספים האלה אינם זמינים, השתמשו ברשת מקומית שנוצרה ולקלינט מנהל שלה. סמכות ההפעיל גם זקוקה לכל הרשאות הנדרשות על ידי ההוראות שההפעיל יעשה.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## צעדים {#steps}

### 1. רשום תפעיל עם הוראות {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` מקבל מערך של הוראות JSON. ההוראה `Log` שומרת את הדוגמה הזאת ממוקדת על אישור ההפעלה ולא על הרשויות של אובייקט ספריה שנייה.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

המפעיל יכול לפעול עד שלוש פעמים. הסמכות המוצהרת שלו, לא המתקשר שמוצא אותו, מאשרת את ההוראות בתוך הפעולה.

### 2. לבדוק את ההצהרה לפני ביצועה. {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

אישר את הסמכות I105, את מסנן ההפעלה, את החוזרות הנותרות והנחיות האחדות `Log` לפני שתוציא דמי נוסף.

### 3. לבצע ולחכות לשני שכבות. {#_3-execute-and-wait-for-both-layers}

למבצע ההוצאה והפעולה המניע יש ראיות נפרדות. `--wait` מחכה לסיום העסקה המשמשת; `--trace` מדווח גם על דיאגנוסטיקה של השלמת זמן הפעלה.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

לקוחות Rust בונים את שתי ההוראות הדפוסים. כאן `authority` הוא סימנים `AccountId` ו `client` כמו חשבון זה:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## לאמת {#verify}

סורק את ההיסטוריה של בלוקים מחויבים כדי להשלים ולבדוק את מספר ההפגנות המופחת:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

לפחות סיום אחד חייב לדווח על הצלחה. המפעיל חייב להישאר פעיל עם שנותרו שתי ביצועים. הצעת מוצלחת ללא סיום מוצלחת של המפעיל לא מספיקה לאמת.

## פתרון בעיות {#troubleshooting}

- רישום נדחה כלא מורשה פירושו שהחתם חסר `CanRegisterTrigger` לרשות המוצהרת. ביצוע זה דורש את הסימן `CanExecuteTrigger` בעל טווח נפרד.
- העסקה יכולה להגיע Applied בעוד הפעולה המפעילה מדווחת כישלון. קרא את תוצאות השלמת הטעות; לאחר מכן בדוק את הרשאות של הרשות המפעילה עבור כל הוראה מותקנת.
- `trigger not found` יכול להביע כי עסקאות הרישום נדחו או שימשו להגדרת שרשרת אחרת של Torii/שרשרת.
- כאשר חוזרים מגיעים לאפס, כותבת עוד חוזרים היא פריוויליזציה נוספת. אל תשנה בשקט את המתכון הזה למניע ללא הגדרה.
- לצורך ניקוי, `ledger trigger unregister --id "$TRIGGER_ID"` דורש `CanUnregisterTrigger` עבור המפעיל הזה ועוד בחירת עמלה מפורשת.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של תפעול ידי-קריאה בקביעת קישור ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [בדיקות אינטגרציה של אירועים וניצולים ב- commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [ביצוע ההוראות של התניע ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [תפעילים](/he/blockchain/triggers.md)
- [דוגמאות להפעיל ](/he/blockchain/trigger-examples.md)
- [אירועים](./stream-events.md)
