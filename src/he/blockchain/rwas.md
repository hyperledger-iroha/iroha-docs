---
translation_locale: he
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נכסים בעולם האמיתי {#real-world-assets}

נכסים בעולם האמיתי (RWAs) מודל של נכסים מחוץ למשרשרת ששיהיה להם הבעלות או השליטה
הוא מעקב על שרשרת. Iroha, דה RWA הוא רכיב רשום של ספריה עם
זיהוי הנגרם, חשבון הבעלים, כמות, מטא נתונים עסקיים,
מיוצא, ובקרה אופציונלית של מחזור החיים.

RWAs הם שונים משארית נכסים מספרית:

- נכס מספרי הוא סולן פוגביב שנחזק על ידי חשבון
- דה NFT הוא רשום ייחודי על שרשרת עם בעל אחד
- דה RWA הוא הרבה שיכול לשאת מטא-מדע עסקי, כמות, מחזיקים,
  קפואות, מצב הגאולה, מקור ומדיניות המפקד

שימוש RWAs כאשר הספר הגדול צריך לייצג הרבה ספציפי מחוץ לשאשרת
במקום רק איזון פוגביבל.

## RWA לוט {#rwa-lot}

א RWA המגרש מכיל:

- `id`: הקאנוניקה המוצא RWA מזהה, מוצג כ
  `<hash>$<domain>`
- `owned_by`: החשבון שכרגע הוא הבעלים של המגרש
- `quantity`: הכמות המוצלחת המייצגת על ידי הקבוצה
- `spec`: ספציפית כמות, כגון גודל מעשר
- `primary_reference`: קבלה, תעודה, פיקוח מרכזי מחוץ למשרשרת, או
  דף רישום
- `status`: טקסט מצב העסק בחירה
- `metadata`: קומפקטיבי JSON תחומים המשמשים בהקשר העסקי והעידסה
- `parents`: סוגי המקורים המשמשו כדי להוציא את הסוגיה הזו
- `controls`: חשבונות המפקח, תפקידי המפקח והמופקד המאפשר
  פעולות
- `is_frozen` ו `held_quantity`: מצב מחזור החיים המושטף על ידי זמן ההפעלה

שמרו על המשאב הפועל על שרשרת קומפקטי.
דיווחים, וקבוצות בדיקה מחוץ WSV, ואז תשים מאכל, URI, SoraFS
דרך, או התייחסות מובהקת RWA מטא-מנתונים.

## זיהוי {#identifiers}

`RegisterRwa` לא מקבלת מתקשר נבחר `id`, והיא לא מקבלת
דה `owner` השלטון של העסקה הופך למקור `owned_by`
החשבון, והזמן של הפעלה מייצר את `RwaId` בשטח היעד.

הצורה הטקסטלית של RWA ID הוא:

```text
<generated-hash>$<domain>
```

לדוגמה:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

היישומים צריכים לאחסן את תעודת זהות העסק שלהם `primary_reference`
או `metadata`, ואז לגלות את המוצר `RwaId` מ
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, או את מסלול המחקרים
לאחר העסקה מתחייבת.

## מחזור החיים {#lifecycle}

נפוץ RWA זרימות עבודה כוללות:

| מבצע                                  | התנהגות המופעלת                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | יצרו...ID רכישה בתחום; סמכות העסקה הופכת `owned_by`.                                       |
| `TransferRwa`                              | להעביר כמות לחשבון אחר. העברת מלאה יכולה להשתנות `owned_by`; העברה חלקית יוצרת הרבה ילדים. |
| `HoldRwa`                                  | כמות אחסון. `hold_enabled`.                                                     |
| `ReleaseRwa`                               | להסיר כמות מוחזקת. `hold_enabled`.                                                 |
| `FreezeRwa`                                | מנע את פעולות הבעלים הרגילים. `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | להפעיל מחדש את פעולות הבעלים הרגילות. `freeze_enabled`.                                |
| `RedeemRwa`                                | כמות פרישה. דורש את הבעלים או מנהל ו `redeem_enabled`.                                                  |
| `MergeRwas`                                | שילוב כמויות ממגרש הורים עם אותו תחום ופרטים לתוך גורם ילדי שנוצר.                              |
| `ForceTransferRwa`                         | להעביר כמות דרך זרימת שליטה. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | תחליף את מדיניות הבקרה של המגרש.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | עדכון נתונים מטאטא של המפלגה. דורש הבעלים או מנהל; מפלגות קפואות דורשות מנהל.                                 |

אין. `UnregisterRwa` הוראות בקוד הנוכחי.
סחורה מחוץ לשאשרת עם `RedeemRwa` כאשר המספר הנצג נשלח,
נצרכים, מתיישבים או מוציאים בצורה אחרת מהמוחזור.

## מטאדאטה ופיקוח {#metadata-and-controls}

שימוש בתנתונים מטאטא עבור עובדות קומפקטיות שיעזרו לתרשומים לזהות ולמתקן
המגרש:

- קלאס נכסים, תיעוד של עורך דין או רישום
- מחסן, כספת, ISIN, זיהוי פיקוח או תעודת זהות
- חישובים תוכן של תעודות ומסמכים משפטיים
- SoraFS מסלולים או תיקונים מפורטים עבור קבוצות ראיות גדולות יותר
- סימני תוחלת, שיפוט או אימות המשמשים על ידי שירותים מחוץ למשרשרת

ההצעה `RwaControlPolicy` יש את השדות הבאים:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

חשבונות ומפקידים של מנהל נתונים מורשים לבצע רק על ידי מנהל
פעולות המאפשרות על ידי הדגל הבולני המתאים.
עומס מועיל אינו מדיניות העברת רשימת הרשות ולא מכיל מעמד
`transfers` כללים.

## שאלות, אירועים APIs {#queries-events-and-apis}

שימוש [`FindRwas`](/he/reference/queries.md#assets-nfts-and-rwas) לרשום
רשום RWA תוכנות שזקוקות לעדכון חי יכולות לחתום
[`Rwa` אירועים נתונים](/he/blockchain/filters.md#data-event-filters) עבור היצורים,
משנות בעלות, מחלקות, מיזוגות, מוצלחות, קפואות, לא קפואיות, מוחזקות, משוחררות,
מעברת כוח, שינוי בקרונות, אירועים של מטא נתונים.

Torii מגלה את מסלולים של מצב שרשרת כגון: `/v1/rwas` ו `/v1/rwas/query`,
בנוסף למסלולים של חוקרים כגון `/v1/explorer/rwas` ו
`/v1/explorer/rwas/{rwa_id}` כאשר משפחת המסלול הזאת מופעלת.
הלקוחות צריכים לבחור את
[`/openapi`](/he/reference/torii-endpoints.md#common-endpoints) מסמך עבור
צורת התגובה המדויקת המחשבת על ידי קשר.

### נסה את זה. Taira {#try-it-on-taira}

בדוק אם זה ציבורי Taira רשום כרגע RWA הרבה:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

רשום את RWA מסלולים שנחשפו על ידי חי Taira OpenAPI מסמך:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ריק `items` תוצרת צפויה כאשר עדיין לא נרשמו הרבה ציבוריים.
רישום, העברה, אחסון, קפאה וחיסוי הם עסקאות חתומות.

## נסה. {#try-it}

הדוגמאות הבאות משתמשות Python SDK שטחים מ
[התקנה משותפת](/he/guide/tutorials/python.md#shared-setup). להחליף את
חשבון IDs, מפתחות פרטיות, וגרם IDs עם ערכים משלך
רשת לפני שישלחו עסקאות.

### תגלה RWA API מסלולים {#discover-rwa-api-routes}

דוגמה זו רק קריאה מבקשת רץ Torii קו שבו האפליקציה פונה RWA
מסלולים:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

אם הרשימה היא ריקה, הערך עדיין יכול לתמוך RWA הוראות ו
שאלות דרך אחרים Torii APIs, אבל זה לא חושף את האפשרות JSON
משפחת השביל.

### רשום קבלה מחסן {#register-a-warehouse-receipt}

השתמשו בסרט כאשר פעולה עסקית אחת צריכה להפוך למסחר חתום אחד.
מספר הקבלה העסקית נכנס `primary_reference`; הספר הגדול ID הוא
יצרו לאחר ההתחייבויות של העסקה.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

לאחר ההתחייבויות של העסקה, רשימה נולדה RWA IDs. מסלולים של מדינת שרשרת
לחשוף את הקנוניקה IDs; השתמשו באירועים או במסלולים של חוקר פרטים כאשר
צריך להתאים ID חזרה ל `primary_reference` או מטא-מנתונים:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

הערכים המאפשרים ל-Explorer יכולים גם להחזיר תחזיות עשירות יותר:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### העברה עם מעצר זמני {#transfer-with-a-temporary-hold}

השתמשו במוצר RWA ID המקרה הזה מניח
`alice` הוא הבעלים והוא גם מוגדר כמפקח עם
`hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

לשחרר את החזקת כאשר התהליך מחוץ למגשר מושלם:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### הוספת נתונים מטאטא של בקרות ודיון {#add-controls-and-audit-metadata}

שליטה ומטא נתונים נפרדים.
נתונים מטאטא לגבי עובדות שזמינות או אודיטורים צריכים להציג:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### סכום הגאולה או הפנסיה {#redeem-or-retire-quantity}

סכום הגאולה כאשר נכס מחוץ למשרשרת המייצג נשלח,
הוצא מהמוחזור.
`redeem_enabled`, והחתום חייב להיות הבעלים או מנהל.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### להקפיא במהלך ביקורת התכנות {#freeze-during-compliance-review}

להקפיא הרבה כאשר ביקורת מחוץ למשרשרת צריכה לחסום פעילות בעלות רגילה.
המחתם חייב להיות שליט, והצורה חייבת להיות `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

לפתוח אותו כאשר הביקורת עוברת:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### פיקוח החשבון {#invoice-receivable}

להציג פיקוח כ RWA סבב על ידי שמירת מספר החשבון
`primary_reference` לאחר הרישום, השתמשו ID
עבור העברה והחיסכון.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

כאשר הנדרש מיומן או משולם, השתמשו בחלק החשבון המוצר ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

לשחרר את הסכום המוצג לאחר הסדר מחוץ למשרשרת:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### משכנתא פחמן {#carbon-credit-retirement}

השתמשו בכופר כדי לפנסיה אשראי לאחר שהם נדרשו.
מצביעים על תעודת רישום מחוץ למשרשרת או הוכחת רישום:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### שילוב שני סוגי {#merge-two-lots}

להילחם הרבה כאשר שתי עמדות מחוץ לשולשנות משולבות. ההורים חייבים
להיות באותו תחום ולהשתמש באותה ספציפית כמות.
המגרש לילדים ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

למלא. Python דוגמה של עסקאות, ראה
[נכסים בעולם האמיתי](/he/guide/tutorials/python.md#real-world-assets).

## מסמכים קשורים {#related-docs}

- [נכסים](/he/blockchain/assets.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [Iroha הוראות מיוחדות](/he/blockchain/instructions.md)
- [שאלות](/he/reference/queries.md#assets-nfts-and-rwas)
- [Torii נקודות סוף](/he/reference/torii-endpoints.md#app-and-sora-route-families)
