---
translation_locale: he
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תחומים {#domains}

תחומים הם שמות מקומות שמות רשומים ב `World`. במקביל Iroha
3 מודל נתונים תחום הוא מוסמך על ידי מרחב הנתונים המקור שלו, כך
זהות היא:

```text
domain.dataspace
```

לדוגמה, `payments.universal` שמות `payments` תחום בתוך
`universal` חלל נתונים.

## מבנה {#structure}

רישום `Domain` מכיל:

- `id`: מיומנות במרחב נתונים `DomainId`
- `logo`: בחופש `SoraFS` URI עבור הלוגו של תחום
- `metadata`: נתונים מטאטא של ערך מפתח
- `owned_by`: החשבון בעל הדומיין, בדרך כלל החשבון ש
  רשמו אותו

המשאב המשמש ל-bootstrap כדי לייצר תחום הוא `NewDomain`. הוא נושא
ה- `id`, בחופשי `logo`, וראשון `metadata`. זמן הדריסה מלא
`owned_by` לקוחות רגילים לא מספקים את המטען הזה
ישירות.

## רישום {#registration}

יצירת תחום רגיל משתמשת בזרם ההקנה של התכונות המפורסמות.
SNS שכר, יכולות הבעלים, אבטחת ציטוט, ושורה של תחום באטום אחד
`EnsureAlias` העסקה. `Register::Domain` נשארת גנזה/חבילת התחלה
על פני השטח, ואת `ledger domain` פקודה לא `register` סב-מפקד.

ליצור סוד חופשי `AliasSetupPlanRequestV1` כוונה עם SDK או סיבוב
שירות, אז יש את CLI תכנן את זה נגד מצב חי ולהגיש את זה בדיוק
תוכנית:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

כוונה מזהה `payments.universal`, חלל הנתונים המספרי שלו, קאנוני
I105 הבעלים, תקופת רכישת השכרה, ומחזיקה במדיניות/המחיר הנוכחית.
נקודת הסיום של המתכנן היא `POST /v1/aliases/setup/plan`; התוכנית שלו חזרה היא
רשת, סמכות, מדינה, ותקופה קשורה.
[`Unregister`](/he/blockchain/instructions.md#un-register).

יצירת או הסרת תחום דורשת ניהול תחום מתאים
אישור תחת מעודד זמן ההפעלה הפעיל.
[`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue)
כאשר לרשות יש רשות לשנות את תחום זה.

## נסה את זה. Taira {#try-it-on-taira}

רשימה של תחומים הנראים כיום על ידי הציבור Taira רשת מבחן:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

תאר את קטלוג המסלול הציבורי בחזרה לכינויים של חלל נתונים:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

השתמשו באמירה הראשונה כאשר אפליקציה צריכה לבדוק אם תחום קיים.
קטלוג המסלול כאשר אתה צריך לאשר אם חלל נתונים הוא ציבורי,
מוגבל, או מאוחרים מאחורי המסלול המרכזי.

הגדרת דומיין היא כתיבה בתשלום. Taira, הציל את
עוזר המנקה
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, מימון המחתם באמצעות מכונת הברזל הציבורית, ו
נתונים מטאטא של דמי העלות:

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

לבנות את כוונה עבור שם דומיין ייחודי על ריצויים רשתות בדיקת חוזרים, ולהשתמש
Taira המדיניות הנוכחית וההצילום של הנכסים.
עבור רשת מקומית או Minamoto.

## יחסים עם יחידות אחרות {#relationship-to-other-entities}

תחומים קבוצת ספריה אובייקטים ומספק חלל שמות עבור נתונים של גודל השטח.
הגדרות נכסים משתמשות במזהרים מוסמכים לתחום, ובשאלות ניתן לרשום
דומנים או למצוא אובייקטים שמטופלים לדומיין.
אין דומיין במודל הנתונים הנוכחי, אבל חשבונות יכולים להיות בעלי
נכסים שהגדרות שלהם נמצאות תחת תחומים.

ראו גם:

- [העולם](/he/blockchain/world.md)
- [נכסים](/he/blockchain/assets.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [כללי הכינוי](/he/reference/naming.md)
