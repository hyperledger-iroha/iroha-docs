---
translation_locale: he
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נכסים בעולם האמיתי {#real-world-assets}

נכסים בעולם האמיתי (RWAs) מודל של נכסים מחוץ למשרשרת אשר בעלות או שליטה נעקשת על שרשרת. ב Iroha, RWA הוא רכיב ספרים רשום עם מזהה שנוצר, חשבון הבעלים, כמות, מטא נתונים עסקיים, מקור, ובקרה אופציונלית של מחזור החיים .

RWAs הם שונים משארית נכסים מספרית:

- נכס מספרי הוא סולן פוגביב שנחזק על ידי חשבון
- NFT הוא רשום ייחודי על שרשרת עם בעל אחד
- RWA הוא הרבה שיכול להכיל מטא נתונים עסקיים, כמות, מחזיקה, קפואות, מצב פיצוי, מקור, ומדיניות המפקד

השתמש RWAs כאשר הספר הגדול צריך לייצג הרבה ספציפי מחוץ לרשת במקום רק איזון פוגבילי.

## RWA הרבה {#rwa-lot}

סוגי RWA מכילים:

- `id`: זיהוי קנוני RWA שנוצר, מוצג כ- `<hash>$<domain>`
- `owned_by`: החשבון שכיום הוא הבעלים של המגרש
- `quantity`: הסכום החופשי המייצג על ידי הקבוצה
- `spec`: ספציפית כמות, כגון גודל דצימלי
- `primary_reference`: הקבלה הראשית, האישור, החשבון או תיקון רישום מחוץ לרשת.
- `status`: טקסט מצב העסקים בחופשי
- `metadata`: שדות קומפקטים JSON המשמשים בהקשר העסקי והאינדקציה
- `parents`: סוגי המקורים המשמשו למוצא הסוגיה הזו
- `controls`: חשבונות המפקדים, תפקידי המפקדים ופעולות המאפשרות למפקדים.
- `is_frozen` ו `held_quantity`: מצב מחזור החיים המופעל על ידי זמן הפעלה.

שמור את המטען הפועל על שרשרת קומפקטי. שמור מסמכים משפטיים גדולים, דו"חות ביקורת וקבוצות בדיקה מחוץ ל- WSV, ולאחר מכן שים דיגסט, דרך URI, SoraFS, או תיקון מפורסם ב- RWA מטא נתונים.

## זיהוי {#identifiers}

`RegisterRwa` לא מקבלת שדה `id` שנבחר על ידי המתקשר, והוא לא מקבל את שדה `owner`. סמכות העסקה הופכת לחשבון `owned_by` הראשוני, וזמן ההפעלה מייצר את `RwaId` בתחום היעד.

הטקסט של RWA ID הוא:

```text
<generated-hash>$<domain>
```

לדוגמה:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

בקשות צריכות לאחסן את תעודת זהות העסק שלהם ב `primary_reference` או `metadata`, ולאחר מכן לגלות את `RwaId` שנוצרו מ `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, או את מסלול המוקדש הנקבע לאחר ההתחייבויות של העסקה .

## מחזור החיים {#lifecycle}

זרימות עבודה RWA נפוצות כוללות:

|מבצע |התנהגות מתבצעת |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ליצור הרבה של ID שנוצר בדומיין; סמכות העסקה הופכת ל- `owned_by`. |
|`TransferRwa` |להעביר כמות לחשבון אחר. העברת מלאה יכולה לשנות `owned_by`; העברה חלקית יוצרת הרבה ילדים שנוצרו. |
|`HoldRwa` |כמות אחסון: דורש שליטה מוגדרת ו `hold_enabled`. |
|`ReleaseRwa` |להסיר כמות מוחזקת. דורש שליטה מוגדרת ו `hold_enabled`. |
|`FreezeRwa` |לחסום פעולות הבעלים הרגילים. דורש שליטה מותאמת ו `freeze_enabled`. |
|`UnfreezeRwa` |להפעיל מחדש את פעולות הבעלים הרגילות. דורש שליטה מוגדרת ו `freeze_enabled`. |
|`RedeemRwa` |סכום פרישה. דורש את הבעלים או מפקח ו `redeem_enabled`. |
|`MergeRwas` |שילוב כמויות ממגרש הורים עם אותו תחום ופרטים לתוך המגרש של ילדים. |
|`ForceTransferRwa` |להעביר כמות דרך זרימת שליטה. דורש שליט מוגדר ו `force_transfer_enabled`. |
|`SetRwaControls` |תחליף את מדיניות הבקרה של המגרש, דורשת בעלה או מנהל.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |לעדכן מטא-מידע של הקבוצה. דורש את הבעלים או שליט; קבוצות מקררות דורשות שליט. |

אין הוראה `UnregisterRwa` בקוד הנוכחי. להוציא את המגרש מחוץ למשרשרת עם `RedeemRwa` כאשר הכמות המוצגת נשלחה, נוצרה, נקבלה או מוציא אחרת מהזרקה.

## נתונים מטאטא ופיקוחים {#metadata-and-controls}

השתמשו בנתונים מטא עבור עובדות קומפקטיות שיעזרו לתרשומים לזהות ולמתקן את הקבוצה:

- קלאס נכסים, עורך דין, אחראי או תיק רישום
- סימנים של מחסן, כספת, ISIN, פיקוח או תעודת זהות
- תוכן האשיס של תעודות ומסמכים משפטיים
- SoraFS מסלולים או תקציבים מפורטים עבור קבוצות ראיות גדולות יותר
- סימני תוחלת, סמכות שיפוט או אימות המשמשים על ידי שירותים מחוץ למגוון

לתקן `RwaControlPolicy` יש את השדות הבאים:

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

חשבונות ומפקידים של שליטנים מורשים לבצע רק את פעולות השליטה המאפשרות על ידי הדגל הבולאני המתאים. עומס הפיקוח הנוכחי אינו מדיניות העברת רשימת הרשות ואינו מכיל חוקים `transfers` מונחים.

## שאלות, אירועים ו- APIs {#queries-events-and-apis}

שימוש [`FindRwas`](/he/reference/queries.md#assets-nfts-and-rwas) לרשימה רשומה RWA הרבה. יישומים שצריכים עדכונים חי יכולים להצטרף [`Rwa` אירועי נתונים](/he/blockchain/filters.md#data-event-filters) עבור יצירת, שינוי הבעלים, פיצוץ, מיזוג, חידוש, קפוא, פסק הקפוא, אחסון, שחרור, העברת בכוח, שינוי בקרנות, אירועים של מטא נתונים.

Torii חושף דרכים של מצב שרשרת כגון `/v1/rwas` ו `/v1/rwas/query`, בנוסף לדרכים של חוקרים כמו `/v1/explorer/rwas` ו `/v1/explorer/rwas/{rwa_id}` כאשר משפחת המסלול הזו מופעלת. לקוחות שנוצרים צריכים להעדיף את המסמך חי [ `/openapi` ](/he/reference/torii-endpoints.md#common-endpoints) עבור הצורה המדויקת של התגובה המחשבת על ידי קשר.

### נסה את זה על Taira {#try-it-on-taira}

בדוק אם ציבורי Taira רשום כיום סוגי RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

רשימה של מסלולים RWA שנחשפו במסמך Taira OpenAPI חי:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

יצירה ריקה `items` צפויה כאשר עדיין לא נרשמו הרבה ציבוריים. רישום, העברה, אחסון, קפוא וחיסוי הם עסקאות חתומים.

## תנסו. {#try-it}

הדוגמאות הבאות משתמשות בשטח Python SDK מ- [Shared Setup](/he/guide/tutorials/python.md#shared-setup). להחליף את החשבון IDs, המפתחות הפרטיות ואת הרכיב שנוצר IDs עם ערכים מהרשת שלך לפני שישלוח עסקאות. .

### גלה RWA API דרכים {#discover-rwa-api-routes}

דוגמה זו רק קריאה מבקשת מנקודת Torii פועלת אשר app-facing RWA דרכים הם פעילים:

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

אם הרשימה היא ריקה, הערך עשוי עדיין לתמוך בהוראות RWA ושאלות דרך Torii APIs אחרים, אך הוא לא חושף את משפחת הנתיב הבלתי אפשרית JSON.

### רשום קבלה במחסן {#register-a-warehouse-receipt}

השתמשו בקובץ כאשר פעולה עסקית אחת צריכה להפוך לעסקה אחת חתומה. מספר הקבלה העסקית נכנס ל `primary_reference`; הספר הגדול ID נוצר לאחר שהעסקה מתחייבות.

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

לאחר ההתחייבויות של העסקה, רשימה נוצרת RWA IDs. נתיבי מצב שרשרת חושפים את הקנוניקלי IDs; השתמשו באירועים או במסלולים מדויקים של חוקרים כאשר אתה צריך להתאים ID בחזרה ל `primary_reference` או נתונים מטאטא:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

הערכים המאפשרים ב-Explorer יכולים גם להחזיר תחזיות עשירות יותר:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### העברה עם מעצר זמני {#transfer-with-a-temporary-hold}

השתמשו ב- RWA ID המוצא על ידי שרשרת. דוגמה זו מניחה כי `alice` הוא הבעלים, והוא גם מותאם כקרור עם `hold_enabled`.

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

לשחרר את החזקת כאשר התהליך מחוץ לרצועה יושלם:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### הוספת נתונים מטאטא של פיקוח ואודט {#add-controls-and-audit-metadata}

פיקוחים ומטא נתונים הם נפרדים. השתמשו בפיקוחים למדיניות המובטלים, ובמטא נתון לעובדות שיישומים או אודיטורים צריכים להציג:

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

### כמות הגאולה או הפנסיה {#redeem-or-retire-quantity}

כמות הגאולה כאשר נכס מחוץ למשרשרת המייצג נמסר, נצרך, נסוג, או מוציאו ממופע באופן אחר. `redeem_enabled`, והחתום חייב להיות הבעלים או המפקח.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### להקפיא במהלך ביקורת התכנות {#freeze-during-compliance-review}

להקפיא הרבה כאשר ביקורת מחוץ לשרשרת חייבת לחסום פעולות בעלות רגילות. המחתם חייב להיות שליח והצורה צריכה להיות `freeze_enabled`.

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

פותח אותו כאשר הביקורת עוברת:

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

להציג פיקוח כצורה RWA על ידי שמירת מספר הפיקוח ב- `primary_reference` ונתונים מטאטא. לאחר הרישום, השתמשו ב- ID שנוצר עבור העברה והחיסכון.

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

לפתור את הסכום המוצג לאחר הסדר מחוץ למשרשרת:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### משכנתא פחמן {#carbon-credit-retirement}

השתמשו בכופר כדי לפרוש קרדיטים לאחר שהם נקראים.

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

### שילבו את שני המון {#merge-two-lots}

שילוב של גורמים כאשר שני עמדות מחוץ לרשת משולבות. ההורים חייבים להיות באותו תחום ולהשתמש באותה ספציפית כמות. זמן הדריסה מייצר את גורם הילד ID.

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

לדוגמה מלאה של העסקה Python, ראה [יצרנים בעולם האמיתי ](/he/guide/tutorials/python.md#real-world-assets).

## מסמכים קשורים {#related-docs}

- [נכסים](/he/blockchain/assets.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [Iroha הוראות מיוחדות](/he/blockchain/instructions.md)
- [שאלות](/he/reference/queries.md#assets-nfts-and-rwas)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md#app-and-sora-route-families)
