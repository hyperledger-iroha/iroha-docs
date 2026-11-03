---
translation_locale: ur
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# مقامی اثاثہ جات کا حصول {#native-asset-escrow}

## نتیجہ {#outcome}

ایک مارکیٹ پلیس ایسرو اور ایک منزل مقصود سے منسلک اثاثہ لاک کے درمیان انتخاب کریں، Rust یا Python کے ساتھ موجودہ ٹائپ کردہ زندگی کی مدت کو انجام دیں، ہر لاک دوبارہ کوشش کو باقی رقم پر پابند کریں جو آپ نے اصل میں مشاہدہ کیا ہے، اور مقامی Kotodama ایسکرو سطح کو JavaScript سے مرتب کریں۔

## لازمی شرائط {#prerequisites}

- ایک عددی اثاثہ کی تعریف اور ایک کھولنے والا / بیچنے والا جو کافی مقدار کا مالک ہے.
- ہر اس پارٹی کے لئے مالی اعانت یافتہ، واحد کلید I105 کلائنٹ جو ایک قدم پیش کرتی ہے۔ براہ راست، اتھارٹی کی ادا کردہ `fee_payment` ارادے کا استعمال کریں جس کا فیس اثاثہ اس اثاثے سے ملتا ہو جو موجودہ Taira فوسیٹ پالیسی شائع کرتی ہے؛ دستاویزات سے لیا گیا اثاثہ ID شامل نہ کریں۔
- موجودہ Rust یا Python SDK سے Iroha کی commit داری `c8c872461e92f04325c350cdd952f4276e96f9dc`.
- کے لئے JavaScript کمپائلر کی مثال، Node.js 24 پلس ایک مقامی طور پر تعمیر `@iroha/iroha-js` پیکج اور اس کی اصل `iroha_js_host`; مندرجہ ذیل [JavaScript SDK ماخذ کی تعمیر کا ترتیب](/ur/guide/tutorials/javascript.md#build-from-source). براؤزر کی تعمیرات فراہم کرنا ضروری ہے `compilerUrl` مقامی میزبان کو لوڈ کرنے کے بجائے.
- Taira کو اثاثہ جات کی منتقلی اور ایسکرو ہدایات کا اعتراف کرنا ہوگا۔ اثاثوں کے مالکان عام زندگی سائیکل کا استعمال کرسکتے ہیں جب ان کی اثاثہ پالیسی اس کی اجازت دیتی ہے۔ تنازعہ حل کرنے کے لئے عالمی `CanResolveEscrowDispute` اجازت کی ضرورت ہوتی ہے۔ جب ضروری عوامی نیٹ ورک اتھارٹی غائب ہو تو ایک مقامی نیٹ ورک کا استعمال کریں.

مارکیٹ پلیس ایسرو ماڈل بیچنے والے ، خریدار ، آف چین ادائیگی اور ریلیز۔ عام تالے ایک منزل کا نام دیتے ہیں اور اختیاری طور پر ایک علیحدہ ریلیز اتھارٹی؛ وہ جزوی واپسی ، منسوخی اور ختم ہونے کی حمایت کرتے ہیں۔

## قدم {#steps}

### Rust کے ساتھ مارکیٹ پلیس ایسرو کو مکمل کریں۔ {#_1-complete-a-marketplace-escrow-with-rust}

یہ فنکشن اصلی ٹائپڈ IDs اور کلائنٹ وصول کرتا ہے۔ یہ 40 یونٹس کھولتا ہے ، خریدار کو غیر سلسلہ کی ادائیگی قبول کرنے اور نشان زد کرنے دیتا ہے ، پھر بیچنے والے کو تحویل جاری کرنے دیتا ہے۔ ہر جمع کرانے میں `FeePaymentIntent` کے ذریعے اتھارٹی فیس ادا کرنے والے کا نام شامل کیا جاتا ہے۔

```rust
use eyre::{Result, ensure};
use iroha::{
    blocking::Client,
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

    seller.submit(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller
        .client()
        .query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

ہولڈری اکاؤنٹ لیجر کے ذریعہ منظم کیا جاتا ہے۔ ایک عام اثاثہ ٹرانسفر ٹوکن دینے سے فعال ہولڈرے کو ایسکرو لائف سائیکل سے باہر ختم نہیں ہوتا ہے.

### Python کے ساتھ ایک عام لاک کھولیں اور جزوی طور پر کھینچیں۔ {#_2-open-and-partially-draw-a-generic-lock-with-python}

ریلیز اتھارٹی رقم نکالنے سے پہلے دستخط شدہ مقامی ریکارڈ کا استفسار کرتی ہے۔ عین وہی `remaining_amount` دینا پر امید ہم وقتی (optimistic concurrency) فراہم کرتا ہے: ایک پرانی متوازی درخواست تحویل سے دو بار رقم منہا کرنے کے بجائے مسترد کر دی جاتی ہے۔ `client` ایک `ToriiClient` ہے جو `local_signing_context=LocalSigningContext(network_id)` اور نیٹ ورک کے `chain_discriminant` کے ساتھ بنایا گیا ہے؛ ٹرانزیکشن مددگار نیٹ ورک کی شناخت اسی سیاق سے لیتے ہیں، اور دستخط شدہ استفسارات اسے `network_id` کے طور پر لیتے ہیں۔

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
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"
    network_id = client.local_signing_context.network_id

    client.open_asset_lock_and_wait(
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
        network_id=network_id,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
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
        network_id=network_id,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

Python SDK خود بخود استفسار کر سکتا ہے جب `expected_remaining_amount` چھوڑ دیا جاتا ہے، لیکن مشاہدہ کردہ قدر کو منتقل کرنے سے درخواست کے کوڈ میں دستخط شدہ معاشی پیشگی حالت نظر آتی ہے.

Rust lock flows کے لیے موجودہ constructors کو مشاہدہ شدہ مقدار بھی درکار ہوتی ہے:

```rust
let before = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` لاک، رقم اور مشاہدہ شدہ باقی رقم لیتا ہے؛ `CancelAssetLock::new` لاک اور مشاہدہ شدہ باقی رقم لیتا ہے۔ اگر باقی رقم پہلے بدل چکی ہو تو لیجر دونوں میں سے کوئی بھی ہدایت مسترد کر دیتا ہے۔

### JavaScript سے Kotodama ایسکرو سطح مرتب کریں۔ {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript کو غیر ٹائپ شدہ مقامی ہدایات ایجاد کرنے کی ضرورت نہیں ہے۔ موجودہ مرتب کنندہ لیجر ایسکرو بلٹ ان کو Kotodama کے سامنے رکھتا ہے؛ اس کے بعد تعیناتی [ایک سمارٹ معاہدہ بنائیں اور تعینات کریں](./smart-contracts.md) کے مطابق ہوتی ہے۔ `open_offer` انٹری پوائنٹ `authorize(Admin)` ہے، اس لیے عملدرآمد کنندہ تقاضا کرتا ہے کہ اس کے کالر کے پاس تعینات شدہ ایڈریس اور `permission: "Admin"` کے لیے `CanUseContractPermission` ہو۔

اس کو `native_escrow.ko` کے طور پر محفوظ کریں:

```kotodama
seiyaku NativeEscrowAitai {
    permission Admin;
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize(Admin) {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

مندرجہ ذیل کو `compile-native-escrow.mjs` کے طور پر محفوظ کریں اور اس کا استعمال Node.js سے صحیح ذریعہ مرتب کرنے کے لئے کریں۔

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

اسے ماخذ پر تعمیر کردہ پیکج ماحول سے چلائیں جو پیش وضاحتی شرائط میں بیان کیا گیا ہے:

```bash
node ./compile-native-escrow.mjs
```

## تصدیق کریں {#verify}

مارکیٹ پلیس ایسرو کے لئے ، ریلیز کے بعد استفسار کریں `FindAssetEscrowById` اور دونوں فریقوں کی اثاثوں کی ملکیت۔ ریکارڈ میں `Released` ہونا ضروری ہے ، قبول کرنے والے خریدار کا نام دیں ، اور کوئی باقی حراست ظاہر نہ کریں۔ اوپر Python لاک کے ل returned ، واپس آنے والی ID کو برقرار رکھیں اور دستخط شدہ استفسار کو دہرائیں۔

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    network_id=client.local_signing_context.network_id,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

اس کے علاوہ منزل کی اثاثہ ہولڈنگ سے پوچھیں اور تصدیق کریں کہ اس میں چار یونٹس کا اضافہ ہوا ہے۔ ایسرو ریکارڈ اور منزل کے بعد ریاست کے بغیر ٹرانزیکشن رسید نامکمل تصدیق ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `Not permitted` کھولنے کے دوران عام طور پر اس کا مطلب یہ ہے کہ اختیار منتخب اثاثے کو تحویل میں منتقل نہیں کرسکتا ہے۔ تنازعہ حل کے لئے علیحدہ عالمی گیٹ `CanResolveEscrowDispute` موجود ہے۔
- `asset lock remaining amount changed since the drawdown was prepared` (یا `...since the cancellation was prepared`) پر امید ہم وقتی کا تنازعہ ہے۔ ریکارڈ کا دوبارہ استفسار کریں، فیصلہ کریں کہ آیا دوسری واپسی / منسوخی کا ارادہ کیا گیا تھا، اور صرف اس صورت میں نئی ہدایت پر دستخط کریں جب نئی حالت قابل قبول ہو۔
- صرف ترتیب شدہ ریلیز اتھارٹی ہی قابل اعتماد تالا کھینچ سکتی ہے۔ منزل اسے محض اس وجہ سے جاری نہیں کرسکتی ہے کہ وہ فنڈز وصول کرے گی۔
- مارکیٹ پلیس ریلیز صرف قبولیت اور ادائیگی بھیجنے کی حالت کے بعد ہی درست ہے۔ منسوخی ابتدائی زندگی سائیکل ریاستوں تک محدود ہے.
- ختم ہونے کا وقت مستند لیجر ٹائم کا استعمال کرتا ہے۔ مقامی دیوار کی گھڑی کے ٹائم آؤٹ کو اس بات کا ثبوت نہ سمجھیں کہ `ExpireAssetLock` گزر جائے گا۔
- فیس کی ناکامی اس پارٹی سے تعلق رکھتی ہے جو زندگی کے دوران اس مرحلے کو جمع کراتی ہے۔ فنڈ خریدار ، بیچنے والا / کھولنے والا اور آزاد کرنے کا اختیار خود مختار طور پر Taira پر۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈٹ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs) پر native escrow instruction model
- [مقررہ کمیٹ پر مقامی ایایسکرو انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python مقررہ commit داری پر ایسکرو کلائنٹ کے طریقے](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama پنڈ commit پر native escrow sample](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko)
- [مقامی اثاثہ جات کا حامی ](/ur/blockchain/escrow.md)
- [فنگبل اثاثے](./fungible-assets.md)
- [اجازت اور کردار](./permissions-and-roles.md)
