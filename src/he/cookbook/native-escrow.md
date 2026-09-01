---
translation_locale: he
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נאמנות מובנית לנכסים {#native-asset-escrow}

## התוצאה {#outcome}

בחרו בין נאמנות שוק לבין נעילת נכס הקשורה ליעד, הפעילו את מחזור החיים הנוכחי בעל הטיפוסים המוגדרים באמצעות Rust או Python, קשרו כל ניסיון חוזר של נעילה לסכום שנותר ושנצפה בפועל, והדרו את ממשק הנאמנות המובנה של Kotodama מ־JavaScript.

## תנאים מוקדמים {#prerequisites}

- הגדרת נכס מספרית ופותח/מוכר שבבעלותו כמות מספקת.
- לקוחות I105 ממומנים בעלי מפתח יחיד עבור כל צד ששולח שלב. השתמשו בכוונת `fee_payment` עדכנית שבה הסמכות משלמת, ושנכס העמלה שלה תואם לתגובה הנוכחית של פוסיט Taira; אל תטמיעו asset ID מתוך התיעוד.
- גרסת ה־SDK הנוכחית ל־Rust או ל־Python מתוך commit ‏Iroha ‏`0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- לדוגמת המהדר ב־JavaScript נדרשים Node.js 24, החבילה `@iroha/iroha-js` שנבנתה מקומית והמארח המובנה שלה `iroha_js_host`; פעלו לפי [הגדרת בנייה מקוד המקור של SDK ל־JavaScript](/he/guide/tutorials/javascript.md#build-from-source). גרסאות לדפדפן חייבות לספק `compilerUrl` במקום לטעון את המארח המובנה.
- על Taira לקבל את הוראות העברת הנכס והנאמנות. בעלי נכסים יכולים להשתמש במחזור החיים הרגיל כאשר מדיניות הנכס שלהם מאפשרת זאת; פתרון מחלוקת דורש את ההרשאה הגלובלית `CanResolveEscrowDispute`. השתמשו ברשת מקומית שנוצרה אם הסמכות הדרושה אינה זמינה ברשת הציבורית.

נאמנות בזירת מסחר מייצגת מוכר, קונה, תשלום מחוץ לשרשרת ושחרור. נעילה כללית מציינת יעד, ואפשר גם סמכות שחרור נפרדת; היא תומכת במשיכה חלקית, ביטול ותפוגה.

## צעדים {#steps}

### 1. השלמת נאמנות בזירת מסחר באמצעות Rust {#_1-complete-a-marketplace-escrow-with-rust}

פונקציה זו מקבלת IDs ולקוחות בעלי טיפוס ממשי. היא פותחת 40 יחידות, מאפשרת לקונה לקבל את ההצעה ולסמן שהתשלום מחוץ לשרשרת נשלח, ואז מאפשרת למוכר לשחרר את המשמורת. כל שליחה מציינת באמצעות `FeePaymentIntent` את הסמכות המשלמת את העמלה.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

חשבון המשמורת מנוהל בידי ספר החשבונות. הענקת אסימון רגיל להעברת נכס אינה מאפשרת לרוקן משמורת פעילה מחוץ למחזור החיים של הנאמנות.

### 2. פתיחה ומשיכה חלקית של נעילה כללית באמצעות Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

סמכות השחרור מבצעת שאילתה על הרשומה המובנית החתומה לפני המשיכה. העברת הערך המדויק של `remaining_amount` מספקת בקרת מקביליות אופטימית: בקשה מקבילה מיושנת נדחית במקום לחייב את המשמורת פעמיים.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

ה־Python SDK יכול לבצע את השאילתה אוטומטית כאשר `expected_remaining_amount` מושמט, אך העברת הערך שנצפה מציגה במפורש בקוד היישום את התנאי הכלכלי המוקדם שעליו חותמים.

בתהליכי נעילה ב־Rust, הבונים הנוכחיים דורשים גם את הסכום שנצפה:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` מקבל שלושה ערכים; `CancelAssetLock::new` מקבל שניים. השמטת הסכום הנותר הצפוי היא צורת קריאה ישנה ולא בטוחה.

### 3. הידור ממשק הנאמנות של Kotodama מתוך JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript אינו צריך להמציא הוראות מובנות ללא טיפוס. המהדר הנוכחי חושף ל־Kotodama את פעולות הנאמנות המובנות של ספר החשבונות; הפריסה והקריאות מתבצעות לאחר מכן לפי [בנייה ופריסה של חוזה חכם](./smart-contracts.md).

שמרו זאת בשם `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

שמרו את הקוד הבא בשם `compile-native-escrow.mjs` והשתמשו בו כדי להדר את קוד המקור המדויק הזה מתוך Node.js:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

הריצו אותו מסביבת החבילה שנבנתה מקוד המקור ומתוארת בתנאים המוקדמים:

```bash
node ./compile-native-escrow.mjs
```

## אימות {#verify}

בנאמנות של זירת מסחר, בצעו שאילתה באמצעות `FindAssetEscrowById` ובדקו את החזקות הנכס של שני הצדדים לאחר השחרור. הרשומה חייבת להיות במצב `Released`, לציין את הקונה שקיבל את ההצעה ולא להציג סכום שנותר במשמורת. עבור נעילת Python לעיל, שמרו את ה־ID שהוחזר וחזרו על השאילתה החתומה:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

בצעו שאילתה גם על החזקת הנכס של היעד ואשרו שהיא גדלה בארבע יחידות. קבלת עסקה ללא רשומת הנאמנות והמצב שלאחר העסקה של היעד היא אימות חלקי בלבד.

## פתרון בעיות {#troubleshooting}

- `Not permitted` בעת הפתיחה משמעו בדרך כלל שהסמכות אינה יכולה להעביר את הנכס שנבחר אל המשמורת. לפתרון מחלוקת יש שער גלובלי נפרד, `CanResolveEscrowDispute`.
- דחייה מסוג `expected remaining amount` היא התנגשות של מקביליות אופטימית. בצעו שוב שאילתה על הרשומה, החליטו אם המשיכה או הביטול האחרים היו מכוונים, וחתמו על הוראה חדשה רק אם המצב החדש מקובל.
- רק סמכות השחרור שהוגדרה יכולה למשוך מנעילה מהימנה. היעד אינו יכול לשחרר אותה רק משום שהוא עתיד לקבל את הכספים.
- שחרור בזירת מסחר תקף רק לאחר מצב של קבלה ושליחת תשלום; ביטול מוגבל למצבים מוקדמים יותר במחזור החיים.
- תפוגה משתמשת בזמן הסמכותי של ספר החשבונות. אל תתייחסו לפקיעת timeout מקומי לפי שעון המערכת כהוכחה ש־`ExpireAssetLock` יתקבל.
- כשל עמלה מיוחס לצד ששולח את השלב במחזור החיים. מַמנו בנפרד את הקונה, המוכר/הפותח וסמכות השחרור ב־Taira.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [מודל הוראות הנאמנות המובנית ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [בדיקות שילוב של נאמנות מובנית ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [שיטות לקוח Python לנאמנות ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [דוגמת נאמנות מובנית ב־Kotodama ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [נאמנות מובנית לנכסים](/he/blockchain/escrow.md)
- [נכסים בני־חליפין](./fungible-assets.md)
- [הרשאות ותפקידים](./permissions-and-roles.md)
