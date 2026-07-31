---
translation_locale: he
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נכסים {#assets}

א Iroha נכס הוא ברירה מספרית שנחזקת על ידי חשבון.
השוויון מצביע על `AssetDefinition`, וההגדרה מתארת איך
נכס זה יכול להיות נקרא, מופרע, מוצג ומחלק.

## הגדרה של נכסים {#asset-definition}

א `AssetDefinition` מכיל:

- `id`: כתובת הגדרת הנכס הקנוני
- `name`: שם תצוגה שניתן לקרוא על ידי אדם
- `description`: תיאור בחופשי שניתן לקרוא באדם
- `alias`: שם כינוי בחופשי `<name>#<domain>.<dataspace>` או
  `<name>#<dataspace>` טופס
- `spec`: מדויקויות מספריות ומגבלות עבור סכומים
- `mintable`: מדיניות המניטציה
- `logo`: בחופשי `SoraFS` URI
- `metadata`: נתונים מטאטא של ערך מפתח
- `balance_scope_policy`: האם הירידות הן גלובליות או
  מקומות נתונים מוגבלים
- `owned_by`: החשבון שהרשם או שייך את ההגדרה
- `total_quantity`: כמות המוענקת הכוללת
- `confidential_policy`: מדיניות לפעולות על נכסים מוגנים

הגדרה של נכסים IDs הם כתובות קנוניות לא ברורות.
מבוסס על תחום ושם, Iroha יכול לשמור את שם הדומיין/השם
תחזית עבור UX וראיות, אבל הצורה הטקסט הקנוני היא
כתובת.

## משקל הנכסים {#asset-balance}

א `Asset` מכיל:

- `id`: דה `AssetId`, אשר משלב את הגדרת הנכסים, חשבון הבעלים,
  וספציפית
- `value`: א `Numeric` משקל

החשבון של בעלי האוצר הוא קנוני ובלתי דומיין.
מתוכננים תחת תחום מוסמך למרחב נתונים, למשל
`payments.universal`.

## יכולת סיבוב {#mintability}

הגדרות נכסים תומכות במונדי מינוטיביות אלה:

| מצב         | המשמעות                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | אספקת גמישה. הנכס יכול להיות מופרע ונשרף שוב ושוב.    |
| `Once`       | סימן אספקה קבועה, ניתן להכין אותו פעם אחת ולאחר מכן לשרוף.        |
| `Not`        | סימן אספקת קבועה שניתן לשרוף אבל לא להכין שוב.       |
| `Limited(n)` | פיתוח מנות מורשה למספר מוגבל של פעולות נוספות. |

שימוש `Infinitely` עבור נכסים אלסטיים רגילים, `Once` או `Limited(n)` עבור
נכסים עם אספקת קבועה או מוגבלת. `Not` כראשון
מדיניות אלא אם כן אספקת הנכסים כבר נקבעה.

## טווח ההשקעה {#balance-scope}

ה- `balance_scope_policy` פיקוח כיצד נפתחים הסכומים:

- `Global`: קופסא אחת למשקל על חשבון ותגדרה של נכס
- `DataspaceRestricted`: השוויון מחולק על פי קונגרס חלל נתונים

סכומים מוגבלים למרחב נתונים הם שימושיים כאשר ההגדרה של נכס זהה היא
בשימוש במספרים Nexus חלקי נתונים אבל השוויון חייב להישאר מבודד.

## נסה את זה. Taira {#try-it-on-taira}

שיחות קריאה בלבד אלה מראות הגדרות נכסים אמיתיות על הציבור Taira רשת מבחן:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

מצא את הזרם Taira XOR הגדרה של נכס תשלום:

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

כל שלושת הדוגמאות נלקחות. Taira, השתמש ב
החשבון המומלץ בנקניקייה והזרם המשמר
[להתחבר SORA Nexus מספרי נתונים](/he/get-started/sora-nexus-dataspaces.md).

על תשלום עמלה Taira דוגמה נכס, לשמור את עוזר המבר
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, אז תבינו קודם את נכס המנקה ותשתמשו בו
נכס גז העסקות:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

אז לכלול `--metadata ./taira.tx-metadata.json` על `ledger asset mint`,
`ledger asset burn`, ו `ledger asset transfer` פקודות.

## הוראות {#instructions}

נכסים יכולים להירשם, להתפרק, לשרוף ולהעביר Iroha
הוראות מיוחדות:

- [`Register` ו `Unregister`](/he/blockchain/instructions.md#un-register)
- [`Mint` ו `Burn`](/he/blockchain/instructions.md#mint-burn)
- [`Transfer`](/he/blockchain/instructions.md#transfer)
- [`SetKeyValue` ו `RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue)

ראו גם:

- [CLI מדריך](/he/get-started/operate-iroha-via-cli.md)
- [Rust הוראות](/he/guide/tutorials/rust.md)
- [Python הוראות](/he/guide/tutorials/python.md)
- [JavaScript/TypeScript הוראות](/he/guide/tutorials/javascript.md)
- [מודל נתונים](/he/blockchain/data-model.md)
- [NFTs](/he/blockchain/nfts.md)
