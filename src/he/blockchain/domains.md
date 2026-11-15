---
translation_locale: he
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# תחומים {#domains}

דומיינים הם מרחבי שמות בעלי שם הרשומים ב־`World`. במודל הנתונים הנוכחי של Iroha 3, דומיין מזוהה יחד עם מרחב הנתונים האב שלו, ולכן המזהה הקנוני הוא:

```text
domain.dataspace
```

לדוגמה, `payments.universal` מציין את הדומיין `payments` בתוך מרחב הנתונים `universal`.

## מבנה {#structure}

`Domain` רשום מכיל:

- `id`: מזהה `DomainId` הכולל את מרחב הנתונים
- `logo`: אופציונלי `SoraFS` URI עבור הלוגו של תחום.
- `metadata`: מטא נתונים של ערך מפתח שרירותי.
- `owned_by`: חשבון הבעלים של הדומיין, בדרך כלל החשבון שהרשם אותו

מטען הנתונים של התחזית המשמש כדי לייצר דומיין הוא `NewDomain`. הוא נושא את `id`, אופציונלי `logo`, ומקורתי `metadata`. זמן ההפעלה ממלאים `owned_by` מהשלטון. לקוחות רגילים לא מספקים מטען זה ישירות.

## רישום {#registration}

יצירת תחום רגיל משתמשת בזרם ההתקנה של דקלרטיביות. SNS השכרה, יכולות הבעלים, אבטחת תמחור, ושורה של תחום באטום אחד `EnsureAlias` עסקה. `Register::Domain` היא נשארת שטח גנז / קישור, ואת `ledger domain` פקודה לא `register` תת-הפיקוד.

ליצור כוונה `AliasSetupPlanRequestV1` ללא סוד עם שירות SDK או חיבור, ואז לגרום ל- CLI לתכנן את זה נגד מצב חיה ולגיש את התוכנית המדויקת:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

הכוונה מזהה את `payments.universal`, את המזהה המספרי של מרחב הנתונים שלו, את הבעלים הקנוני ב־I105, את תקופת רכישת החכירה ואת תנאי ההגנה של הצעת המדיניות והתשלום הנוכחית. נקודת הקצה של המתכנן היא `POST /v1/aliases/setup/plan`; התוכנית המוחזרת קשורה לשרשרת, לסמכות, למצב ולמועד האחרון. להסרת דומיין עדיין משתמשים ב־[`Unregister`](/he/blockchain/instructions.md#un-register).

יצירת או הסרת תחום דורשת רשות ניהול תחום מתאימה תחת מעודד זמן ההפעלה הפעיל. מטא נתוני תחום ניתן לעדכן עם [`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) כאשר לרשות יש רשות לשנות את התחום הזה.

## נסה את זה על Taira {#try-it-on-taira}

רשימה של תחומים הנראים כיום ברשת המבחן הציבורית Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

מפו את קטלוג הנתיבים הציבורי בחזרה לכינויים של מרחבי הנתונים:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

השתמשו בפקודה הראשונה כאשר יישום צריך לבדוק אם דומיין קיים. השתמשו בקטלוג הנתיבים כדי לבדוק אילו נתיבים קשורים למרחב נתונים, כולל הנראות הציבורית או המוגבלת של כל נתיב ומצב הסנכרון שלו ביחס לנתיב הליבה.

הגדרת דומיין היא פעולת כתיבה הכרוכה בעמלה. לפני שמנסים אותה ב־Taira, מַמנו את החותם באמצעות התהליך המוכן של שירות חלוקת כספי הניסוי שב־[קבלת XOR לניסוי ב־Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), ולאחר מכן החילו את התוכנית עם משלם עמלות מפורש. ה־CLI מציג את העמלה המדויקת לפני החתימה:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

בנו את הכוונה עם שם דומיין ייחודי בכל הרצה חוזרת ברשת הבדיקה, והשתמשו במדיניות העדכנית של Taira ובמנגנון ההגנה על הצעת המחיר של נכס העמלה. אל תשתמשו מחדש בתוכנית שנוצרה עבור localnet או Minamoto.

## היחסים עם יחידות אחרות {#relationship-to-other-entities}

Domains מקבצים אובייקטים של ספר החשבונות ומספקים namespace לנתונים בהיקף domain. הגדרות נכס משתמשות במזהים שמוסמכים ב־domain, ושאילתות יכולות לרשום domains או למצוא אובייקטים בהיקף domain. לחשבונות עצמם אין domain במודל הנתונים הנוכחי, אך הם יכולים להיות בעלי domains ולהחזיק נכסים שהגדרותיהם נמצאות תחת domains של dataspace.

ראו גם:

- [העולם](/he/blockchain/world.md)
- [נכסים](/he/blockchain/assets.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [חוקי הכינוי](/he/reference/naming.md)
