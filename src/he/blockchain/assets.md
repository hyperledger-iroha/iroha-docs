---
translation_locale: he
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# נכסים {#assets}

נכס Iroha הוא ברירה מספרית שנחזקת על ידי חשבון. כל ברירה ספציפית מצביעה ל- `AssetDefinition`, וההגדרה מתארת כיצד ניתן להעלות את השם של נכס זה, לצייר אותו, להציג אותו ולחלוק אותו.

## הגדרה של נכסים {#asset-definition}

`AssetDefinition` מכיל:

- `id`: כתובת הגדרת הנכסים הקנונית
- `name`: שם תצוגה שניתן לקרוא על ידי אדם
- `description`: תיאור בחופשי שניתן לקרוא על ידי אדם
- `alias`: שם כינוי בחופשי בצורת `<name>#<domain>.<dataspace>` או `<name>#<dataspace>`
- `spec`: מדויקויות מספריות ומגבלות למשוויות.
- `mintable`: מדיניות מינויה
- `logo`: בחופש `SoraFS` URI
- `metadata`: מטא נתונים של ערך מפתח שרירותי.
- `balance_scope_policy`: האם היתרות גלובליות או מוגבלות למרחב נתונים
- `owned_by`: החשבון שהרשם או בעל ההגדרה
- `total_quantity`: כמות המונית הכוללת
- `confidential_policy`: מדיניות על פעולות נכסים מוגנים

הגדרה של נכסים IDs הם כתובות קנוניות לא ברורות. כאשר הגדרת נבנה ממגזר ושם, Iroha יכול לשמור את תחזית הדומיין/שם עבור UX ושאילתות, אך צורת הטקסט הקנוני היא הכתובת המורכבת.

## סכום נכסים {#asset-balance}

`Asset` מכיל:

- `id`: `AssetId`, אשר משלב את ההגדרה של הנכסים, חשבון הבעלים ואת טווח הסלון בחירה
- `value`: יתרה של `Numeric`

חשבון המחזיק הוא קנוני ונטול דומיין. ניתן להציג את הגדרת הנכס תחת דומיין שמצוין בו מרחב הנתונים, למשל `payments.universal`.

## יכולת סיבוב {#mintability}

ההגדרות של נכסים תומכות במונדי מינוטיביות אלה:

|מצב |משמעות |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |אספקה גמישה; אפשר להנפיק ולשרוף את הנכס שוב ושוב.|
|`Once` |אספקה קבועה; אפשר להנפיק את הנכס פעם אחת ולאחר מכן לשרוף אותו.|
|`Not` |אספקה קבועה שאפשר לשרוף אך לא להנפיק שוב.|
|`Limited(n)` |המדיניות מאפשרת להוציא את יחידות נכסים חדשים במספר מוגבל של פעולות נוספות. |

השתמש `Infinitely` עבור נכסים רגילים גמישים ו `Once` או `Limited(n)` עבור נכסים עם אספקת קבועה או אספקת מוגבלת. אל השתמשו `Not` כמדיניות ראשונית אלא אם אספקת הנכסים כבר נקבעה.

## טווח ההשקעה {#balance-scope}

`balance_scope_policy` פיקוח איך משווקים מופעלים:

- `Global`: קופסת סולן אחת לכל חשבון והגדרה של נכס
- `DataspaceRestricted`: היתרות מופרדות לפי ההקשר של מרחב הנתונים

יתרות המוגבלות למרחב נתונים מועילות כאשר אותה הגדרת נכס משמשת בכמה מרחבי נתונים של SORA Nexus, אך יש לשמור על הפרדה בין היתרות.

## נסה את זה על Taira {#try-it-on-taira}

קריאות קריאה בלבד אלה מציגות הגדרות נכסים אמיתיות ברשת הבדיקת ציבורית Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

למצוא את הגדרה הנוכחית של נכס תשלום Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

חפשו הגדרות שיש בה מטא-נתונים:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

כל שלוש הדוגמאות הן פעולות קריאה. כדי להנפיק, לשרוף או להעביר נכסים ב־Taira, השתמשו בחשבון שמומן משירות חלוקת כספי הניסוי ובתהליך הכולל בדיקות הגנה המתואר ב־[התחברות למרחבי הנתונים של SORA Nexus](/he/get-started/sora-nexus-dataspaces.md).

בדוגמת נכסים של Taira שמשלמת עמלה, תחילה מַמנו את החותם באמצעות התהליך המוכן של שירות חלוקת כספי הניסוי שב־[קבלת XOR לניסוי ב־Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira). לאחר מכן הוסיפו `--fee-payer authority` לפקודות `ledger asset mint`, ‏`ledger asset burn` ו־`ledger asset transfer`; ה־CLI מציג את העמלה המדויקת, בנכס העמלות של Taira, לפני החתימה:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## הוראות {#instructions}

אפשר לרשום, להנפיק, לשרוף ולהעביר נכסים באמצעות ההוראות המיוחדות של Iroha:

- [`Register` ו `Unregister`](/he/blockchain/instructions.md#un-register)
- [`Mint` ו `Burn`](/he/blockchain/instructions.md#mint-burn)
- [`Transfer`](/he/blockchain/instructions.md#transfer)
- [`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue)

ראו גם:

- [מדריך CLI](/he/get-started/operate-iroha-via-cli.md)
- [Rust הדרכה](/he/guide/tutorials/rust.md)
- [Python הדרכה](/he/guide/tutorials/python.md)
- [JavaScript/TypeScript הדרכה ](/he/guide/tutorials/javascript.md)
- [מודל נתונים](/he/blockchain/data-model.md)
- [NFTs](/he/blockchain/nfts.md)
