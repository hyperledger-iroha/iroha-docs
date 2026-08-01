---
translation_locale: he
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
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
- `balance_scope_policy`: האם הסלונות הם גלובליים או מוגבלים למרחב נתונים.
- `owned_by`: החשבון שהרשם או בעל ההגדרה
- `total_quantity`: כמות המונית הכוללת
- `confidential_policy`: מדיניות על פעולות נכסים מוגנים

הגדרה של נכסים IDs הם כתובות קנוניות לא ברורות. כאשר הגדרת נבנה ממגזר ושם, Iroha יכול לשמור את תחזית הדומיין/שם עבור UX ושאלות, אך צורת הטקסט הקנוני היא הכתובת המורכבת.

## סכום נכסים {#asset-balance}

`Asset` מכיל:

- `id`: `AssetId`, אשר משלב את ההגדרה של הנכסים, חשבון הבעלים ואת טווח הסלון בחירה
- `value`: איזון של `Numeric`

חשבון הבעלים הוא קנוני ובלתי דומיין. הגדרת הנכסים עשויה להיות מתוכננת תחת דומיין מוסמך למרחב נתונים, למשל `payments.universal`.

## יכולת סיבוב {#mintability}

ההגדרות של נכסים תומכות במונדי מינוטיביות אלה:

|מצב |משמעות |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |אספקת גמישה, הנכס יכול להידפד ולשרוף שוב ושוב.|
|`Once` |סימן אספקה קבועה, ניתן להכין אותו פעם אחת ולאחר מכן לשרוף אותו.|
|`Not` |סימן של אספקה קבועה שאפשר לשרוף אבל לא לחתוך שוב.|
|`Limited(n)` |המדיניות מאפשרת להוציא את יחידות נכסים חדשים במספר מוגבל של פעולות נוספות. |

השתמש `Infinitely` עבור נכסים רגילים גמישים ו `Once` או `Limited(n)` עבור נכסים עם אספקת קבועה או אספקת מוגבלת. אל השתמשו `Not` כמדיניות ראשונית אלא אם אספקת הנכסים כבר נקבעה.

## טווח ההשקעה {#balance-scope}

`balance_scope_policy` פיקוח איך משווקים מופעלים:

- `Global`: קופסת סולן אחת לכל חשבון והגדרה של נכס
- `DataspaceRestricted`: היתרות מחולקות לפי קונקסט של חלל נתונים

סכומים מוגבלים למרחב נתונים הם שימושיים כאשר את אותה ההגדרה של נכסים משמשת במספר מערכות נתונים Nexus, אך סכומים חייבים להישאר מבודדים.

## נסה את זה על Taira {#try-it-on-taira}

שיחות קריאה בלבד אלה מציגות הגדרות נכסים אמיתיות ברשת הבדיקת ציבורית Taira:

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

חפשו הגדרות שיש בה נתונים מטאטא:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

כל שלושת הדוגמאות הן קריאות. כדי להדפיס, לשרוף או להעביר נכסים על Taira, השתמשו בחשבון המומלץ בנקודת המשאב והזרם המאובטח ב [תחבר לתאונות נתונים SORA Nexus ](/he/get-started/sora-nexus-dataspaces.md).

לדוגמה של נכס Taira ששילם תשלום, שמור את עוזר המנקה מ [Get Testnet XOR ב Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כ- `taira_faucet_claim.py`, ואז תדרוש קודם את נכס המנקה ותשתמש בו כמכשיר הגז העסקי:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

לאחר מכן רשום `--metadata ./taira.tx-metadata.json` ב`ledger asset mint`, `ledger asset burn` ו `ledger asset transfer` פקודות.

## הוראות {#instructions}

נכסים יכולים להירשם, להתפרק, לשרוף ולהעביר עם הוראות מיוחדות Iroha:

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
