---
translation_locale: he
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# אבטחה של נכסים מקומיים {#native-asset-escrow}

## התוצאה {#outcome}

בחר בין מאבטחה בשוק לבין מנעול נכס קשור ליעד, תפעיל את מחזור החיים המטופל הנוכחי עם Rust או Python, תקשר כל ניסיון חוזר של מנעול לכמות השאר שקיבלת בפועל, ותחבר את שטח מאבטחת מקורי Kotodama מ- JavaScript.

## תנאים מוקדמים {#prerequisites}

- הגדרה מספרית של נכס ופתוח/מכר שיש לו כמות מספקת.
- לקוחות I105 בעלים מפתח אחד עבור כל צד המגיש צעד. השתמשו בכוונה `fee_payment` בתשלום ישיר של הסמכות אשר נכסי העלות שלה מתאימים לתגובה הטנק הנוכחית Taira; אל תשתלבו נכס ID מתוך המסמך.
- ההתחייבויות המתמשכות Rust או Python SDK מ Iroha `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- עבור JavaScript דוגמה של קומפיילר, Node.js 24 ועוד אחד שנבנה מקומית. `@iroha/iroha-js` חבילה ומוצאתו `iroha_js_host`; לעקוב אחרי [JavaScript SDK הגדרת מבנה מקור](/he/guide/tutorials/javascript.md#build-from-source). בניית הדפדפן חייבת לספק `compilerUrl` במקום לטעין את המארח המקומי.
- Taira חייב להודות בהוראות העברת נכסים ולקחת כספים. בעלי נכסים יכולים להשתמש במחזור החיים הרגיל כאשר מדיניות הנכסים שלהם מאפשרת זאת; פתרון מחלוקת דורש רשות גלובלית `CanResolveEscrowDispute`.

דוגמאות שכר, קונה, תשלום מחוץ שרשרת ושחרור. מנעולים גנריים מכנים יעד ואופשונלי סמכות השחרור נפרדת; הם תומכים בסכום חלקי, ביטול וסיפוק.

## צעדים {#steps}

### 1. למלא מאובטח בשוק עם Rust {#_1-complete-a-marketplace-escrow-with-rust}

פונקציה זו מקבלת טופס אמיתי IDs ולקוחות. היא פותחת 40 יחידות, מאפשרת לקונה לקבל ולצביע על תשלום מחוץ למשרשרת, ולאחר מכן מאפשרת למכיר לשחרר את השמורת. כל הצעה מזמינה את משלמת עמלות הסמכות דרך `FeePaymentIntent`.

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

חשבון השמורת ניהל על ידי ספרים גדולים. היתר של טוקן נורמלי להעברה נכסים לא הופך את השמורת הפעילה לבלתי אפשרית מחוץ למעגל החיים של הבטחון.

### 2. לפתוח ולמשוך חלקית מנעול כללי עם Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

רשות השחרור מבקשת את הרשומות המקוריות החותמות לפני הסכום. העברת `remaining_amount` המדויקת מספקת שוויון אופטימי: בקשה מקביל קדומה נדחתה במקום חיוב אחזקה פעמיים.

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

Python SDK יכול לבקש באופן אוטומטי כאשר `expected_remaining_amount` נמחק, אך העברת הערך המופלא הופכת את התנאי הכלכלי החותם להיראות בקוד היישום.

עבור זלילים של Rust, הבניינים הנוכחיים דורשים גם את הסכום הנצפה:

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

`DrawdownAssetLock::new` לוקח שלושה ערכים; `CancelAssetLock::new` לוקח שניים. החליפה של הסכום הנותר צפוי מתארת צורת שיחה ישנה ולא בטוחה.

### 3. לעבר את פני השטח של Kotodama מ- JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript לא צריך להמציא הוראות ילידיות ללא סוג. הקאמפיילר הנוכחי חושף את ה-Ledger escrow המובנים ל- Kotodama; הפעלת וקריאות עוקבות אחר כך [בניית ומפיצת חוזה חכם ](./smart-contracts.md).

שמור את זה כ- `native_escrow.ko`:

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

שמור את הדברים הבאים כ- `compile-native-escrow.mjs` ושימשו אותו כדי לערוך את המקור המדויק הזה מ- Node.js:

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

תפעילו אותו מהסביבה של החבילה המוצרת במקור המתוארת בתנאים הראשונים:

```bash
node ./compile-native-escrow.mjs
```

## לאמת {#verify}

עבור אבטחה בשוק, תשאלו `FindAssetEscrowById` ואת אחזקות נכסים של שני הצדדים לאחר שחרור. הרישוי חייב להיות `Released`, שם הקונה המקבל, ולא להראות שום אחזקה נותרת. עבור המנעול Python למעלה, לשמור את החזרת ID וחזור על השאלת חתומה:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

גם לשאול את אחזקות הנכסים של היעד ולבטיח כי הוא עלה ב-4 יחידות. קבלה עסקה ללא תיעוד הבטחון והמדינה לאחר היעד היא אימות לא מלא.

## פתרון בעיות {#troubleshooting}

- `Not permitted` בזמן פתיחה בדרך כלל אומר שהרשות לא יכולה להעביר את הנכס שנבחר לפיקוח. לפתרון הסכסוכים יש שער עולמי נפרד `CanResolveEscrowDispute`.
- דחייה `expected remaining amount` היא סכסוך אופטימי-דיווידני. לבקש מחדש את התיק, להחליט אם התכוונתי למשוך אחר/ביטול, ולחתום על הוראה חדשה רק אם המצב החדש הוא מקובל.
- רק סמכות השחרור המוגדרת יכולה לצייר נעילה אמינה. היעד לא יכול לשחרר אותו רק כי הוא יקבל את הכספים.
- השחרור בשוק הוא תקף רק לאחר קבלת התשלום והשלוח; ביטול מוגבל למדינות של מחזור החיים הקודמים.
- תקופת הספירה משתמשת בזמנים רשמיים. אל תתייחסו לתקופה מקומית של שעון הקיר כהוכחה כי `ExpireAssetLock` יעבור.
- חוסר תשלום שייך לצד המגיש את צעד מחזור החיים הזה. קונה קרן, מכר/פתוח, ושלטון השחרור באופן עצמאי ב Taira.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [מודל ההוראות של הבטחון המקומי בביצוע הקבלה ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [בדיקות אינטגרציה של הבטוחים המקומיים בהתחייבויות קשורות ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python שיטות לקוחות מאובטחים בביצוע ההתחייבויות הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama דגימה של אבטחה ילידית בביצוע הקבילת ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [סכום הנכס המקומי ](/he/blockchain/escrow.md)
- [נכסים פונגביים](./fungible-assets.md)
- [רשיונות ותפקידים ](./permissions-and-roles.md)
