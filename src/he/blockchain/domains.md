---
translation_locale: he
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
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

המטען הפועל של התחזית המשמש כדי לייצר דומיין הוא `NewDomain`. הוא נושא את `id`, אופציונלי `logo`, ומקורתי `metadata`. זמן ההפעלה ממלאים `owned_by` מהשלטון. לקוחות רגילים לא מספקים מטען זה ישירות.

## רישום {#registration}

יצירת תחום רגיל משתמשת בזרם ההתקנה של דקלרטיביות. SNS השכרה, יכולות הבעלים, אבטחת ציטוט, ושורה של תחום באטום אחד `EnsureAlias` עסקה. `Register::Domain` היא נשארת שטח גנז / קישור, ואת `ledger domain` פקודה לא `register` תת-הפיקוד.

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

התכוונה מזהה `payments.universal`, את חלקי הנתונים המספריים שלה, בעל הקנוניקה I105, תקופת רכישת השכרה, ומגן על הערכת המדיניות/שלם הנוכחית. נקודת הסיום של המתכנן היא `POST /v1/aliases/setup/plan`; תוכניתו החזרת קשורה, סמכות, מדינה ותקופה מאוחדת. הסרת תחום עדיין משתמשת [`Unregister` ](/he/blockchain/instructions.md#un-register).

יצירת או הסרת תחום דורשת רשות ניהול תחום מתאימה תחת מעודד זמן ההפעלה הפעיל. מטא נתוני תחום ניתן לעדכן עם [`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) כאשר לרשות יש רשות לשנות את התחום הזה.

## נסה את זה על Taira {#try-it-on-taira}

רשימה של תחומים הנראים כיום ברשת המבחן הציבורית Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

תאר את קטלוג המסלול הציבורי בחזרה לכינויים של חלקי נתונים:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

השתמש בפקודה הראשונה כאשר אפליקציה צריכה לבדוק אם תחום קיים. השתמש בקאטלוג המסלול כאשר אתה צריך לאשר אם חלל נתונים הוא ציבורי, מוגבל או מאחור במסלול המרכזי.

הגדרת דומיין היא כתיבה בתשלום. לפני שניסיים את זה על Taira, שמור את עוזר המזרקה מ- [Get Testnet XOR on Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, תממן את החותם דרך המזרקה הציבורית, ותקליף נתונים מטאטאלוגיות:

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

לבנות את כוונה עבור שם דומיין ייחודי על פעולות רשתת מבחן חוזרות ונשנות, ושימו את המדיניות הנוכחית של Taira ומבטחת הציטוט של נכס תשלום. אל תחזרו להשתמש בתוכנית שנוצרה עבור localnet או Minamoto.

## היחסים עם יחידות אחרות {#relationship-to-other-entities}

קבוצת דומנים מחלקת אובייקטים ומספקת חלל שמות עבור נתונים בעלי גודל דומיין. הגדרות נכסים משתמשות במזהרים בעלי גבול דומיין, ושאלות יכולות לרשום דומנים או למצוא אובייקטות עם גודל לדומיין. החשבונות עצמם הם ללא דומנים במודל הנתונים הנוכחי, אבל חשבונות יכולים להיות בעלים של דומנים ולחזיק נכסים שההגדרות שלהם חיים תחת שדות.

ראו גם:

- [העולם](/he/blockchain/world.md)
- [נכסים](/he/blockchain/assets.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [חוקי הכינוי](/he/reference/naming.md)
