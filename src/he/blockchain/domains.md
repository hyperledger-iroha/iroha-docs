---
translation_locale: he
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תחומים {#domains}

תחומים נקראים חללי שמות רשומים ב `World`. במודל הנתונים הנוכחי Iroha 3 תחום מוסמך על ידי החלל הנתונים המקור שלו, כך שהזהים הקנוני הוא:

```text
domain.dataspace
```

לדוגמה, `payments.universal` שם את תחום ה- `payments` בתוך חלל הנתונים `universal`.

## מבנה {#structure}

`Domain` רשום מכיל:

- `id`: מסלול הנתונים מוסמך `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ה־intent מזהה את `payments.universal`, את מרחב הנתונים המספרי שלו, את הבעלים הקנוני לפי I105, את תקופת רכישת החכירה ואת כוונת המדיניות/התשלום הנוכחית. נקודת הקצה של המתכנן היא `POST /v1/aliases/setup/plan`; התוכנית המתקבלת קשורה לשרשרת, לסמכות, למצב ול־epoch. הסרת domain עדיין משתמשת ב־[`Unregister`](/he/blockchain/instructions.md#un-register).

יצירת או הסרת תחום דורשת רשות ניהול תחום מתאימה תחת מעודד זמן ההפעלה הפעיל. מטא נתוני תחום ניתן לעדכן עם [`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) כאשר לרשות יש רשות לשנות את התחום הזה.

## נסה את זה על Taira {#try-it-on-taira}

רשימה של תחומים הנראים כיום ברשת המבחן הציבורית Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

תאר את קטלוג המסלול הציבורי בחזרה לכינויים של חלקי נתונים:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

השתמש בפקודה הראשונה כאשר אפליקציה צריכה לבדוק אם תחום קיים. השתמש בקאטלוג המסלול כאשר אתה צריך לאשר אם חלל נתונים הוא ציבורי, מוגבל או מאחור במסלול המרכזי.

הגדרת דומיין היא כתיבה בתשלום. לפני שניסיים את זה על Taira, שמור את עוזר faucet מ- [קבלת XOR של רשת הבדיקה ב-Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, תממן את החותם דרך faucet הציבורית, ותקליף מטא-נתוניםלוגיות:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
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
