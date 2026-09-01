---
translation_locale: ur
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# گمنام لین دین {#anonymous-transactions}

Iroha میں گمنام لین دین خفیہ اثاثوں کے آپریشنز سے بنائے جاتے ہیں۔ عوامی رقم کے ساتھ پبلک اکاؤنٹ ٹو اکاؤنٹ ٹرانسفر لکھنے کی بجائے ، ایک بٹوے نے قیمت کو محفوظ شدہ لیجر میں منتقل کیا اور پھر صفر علم کے ثبوتوں کے ساتھ غیر شفاف نوٹ خرچ کیے۔

پبلک لیجر اب بھی ریکارڈ کرتا ہے کہ ایک خفیہ کارروائی ہوئی۔ یہ عہدوں ، منسوخ کرنے والوں ، ثبوت ہیشز اور واقعات کو ریکارڈ کرتا ہے۔ لیکن اس میں نوٹ کے مالک ، وصول کنندہ یا شیلڈ ٹو شیلڈ نقل و حرکت کی رقم کا ریکارڈ نہیں ہوتا ہے۔ عام ٹرانزیکشن لفافے میں اب بھی جمع کرنے والے اکاؤنٹ کا پتہ چل سکتا ہے، لہذا یہاں "گمنام" کا مطلب ہے گمنام اثاثوں کی نقل و حرکت، نیٹ ورک کی سطح یا اکاؤنٹ کی سطح پر خودکار گمنام نہیں.

## بلڈنگ بلاکس {#building-blocks}

|تصور |لیجر کی نمائندگی |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|محفوظ نوٹ |ایک نجی بٹوے ریکارڈ جس میں ایک اثاثہ، رقم، مالک کے اعداد و شمار، اور تصادفی ہے. |
|عزم |ایک 32 بائٹ عوامی قدر جو اس کے شعبوں کو ظاہر کیے بغیر نوٹ پر پابند ہے۔ |
|باطل کرنے والا |ایک 32 بائٹ عوامی قدر جب ایک نوٹ خرچ کیا جاتا ہے حاصل. Iroha دوہری اخراجات کو روکنے کے لئے بار بار منسوخ کرنے والوں کو مسترد کرتا ہے۔ |
|مرکل جڑ |ایک حالیہ جڑ کے اثاثے کی مصروفیت درخت. ثبوت اس کو ظاہر کرنے کے لئے استعمال کرتے ہیں کہ خرچ نوٹ موجود ہے. |
|ثبوت منسلک |ایک `ProofAttachment` جس میں ثبوت بائٹس پلس ایک تصدیق کلید حوالہ یا ان لائن کی تصدیق کلید شامل ہے۔ |
|خفیہ تقریب |لیجر ایونٹ جیسے `ConfidentialEvent::Shielded` ، `Transferred`، یا `Unshielded`. |

اہم ہدایات یہ ہیں:

- `RegisterZkAsset`: ایک اثاثہ کو ZK کے قابل کے طور پر رجسٹر کرتا ہے اور ٹرانسفر، شیلڈ، اور غیر شیلڈ تصدیق کی چابیاں باندھتا ہے۔
- `Shield`: ایک عوامی بیلنس ڈیبٹ کرتا ہے اور ایک محفوظ نوٹ کا پابند ہونا شامل کرتا ہے۔
- `ZkTransfer`: محفوظ شدہ نوٹوں کو نئے محفوظ شدہ نوٹ کے عہدوں میں خرچ کرتا ہے۔
- `Unshield`: حفاظتی نوٹوں کا خرچ کرتا ہے اور عوامی اکاؤنٹ بیلنس کریڈٹ کرتا ہے۔
- `ScheduleConfidentialPolicyTransition` اور `CancelConfidentialPolicyTransition`: گورننس کے ذریعے ایک اثاثہ کی رازداری کی پالیسی میں تبدیلی.

ایک اثاثہ کی تعریف میں [`AssetConfidentialPolicy`](/ur/reference/data-model-schema.md) بھی شامل ہے. پالیسی موڈ کنٹرولز جو بہاؤ درست ہیں:

|موڈ|معنی |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |صرف عام عوامی بیلنس اور ٹرانسفر قبول کیے جاتے ہیں۔ |
|`Convertible` |صارفین عوامی بیلنس اور شیلڈ نوٹ کے درمیان قدر منتقل کر سکتے ہیں. |
|`ShieldedOnly` |اثاثہ جات کی نشریات اور منتقلی کو محفوظ شدہ لیجر میں رہنا چاہئے۔ |

## ان کا استعمال کیسے کریں {#how-to-use-them}

1. توثیق کنندہ نوڈس پر خفیہ حمایت کو فعال کریں۔ توثیقی کاروں کو تصدیق کنندہ بیک اینڈ ، فعال تصدیق کرنے والی چابیاں ، پوزیڈن / پیڈرسن پیرامیٹر IDs ، اور رازداری کے قواعد ورژن پر اتفاق کرنا ہوگا۔ نوڈس غیر مماثل رازداری کی خصوصیت ڈائجسٹ کے ساتھ نیٹ ورک نوڈ یا بلاکس کو مسترد کرتے ہیں۔
2. سرکٹس کے ذریعہ استعمال ہونے والی تصدیق کی چابیاں اور پیرامیٹر سیٹ شائع کریں یا رجسٹر کریں۔ والٹس اور آپریٹرز کو `VerifyingKeyId` میں چابیاں کا حوالہ دینا چاہئے، مثال کے طور پر `halo2/ipa:vk_transfer`.
3. اثاثہ ZK کے طور پر `RegisterZkAsset` کے ساتھ رجسٹر کریں، یا پالیسی کی منتقلی کو `TransparentOnly` سے `Convertible` یا `ShieldedOnly` میں لے جائیں.
4. `Shield` کے ساتھ عوامی فنڈز کی حفاظت کریں۔ بٹوے نے ٹرانزیکشن جمع کروانے سے پہلے وصول کنندہ کے لئے نوٹ کا پابند اور خفیہ شدہ بیعانہ پیدا کیا ہے۔
5. `ZkTransfer` کے ساتھ نجی طور پر منتقل کریں۔ بٹوے اس بات کا ثبوت بناتا ہے کہ اس کے پاس ان پٹ نوٹس ہیں ، کہ ان پٹ اور آؤٹ پٹ کی اقدار توازن میں ہیں ، اور کہ ہر خرچ شدہ نوٹ کو حالیہ مصروفیت کے درخت میں جڑ دیا گیا ہے۔
6. صرف اسی وقت unshield کریں جب اثاثے کی پالیسی اس کی اجازت دے۔ `Unshield` عوامی رقم اور وصول کنندہ اکاؤنٹ ظاہر کرتا ہے، نجی نوٹ کا nullifier خرچ کرتا ہے، اور نجی change outputs بنا سکتا ہے۔
7. typed استفسارات اور Torii endpoints کے ذریعے confidential events، proof records، nullifier status اور anonymous escrow records پڑھ کر audit کریں۔

## CLI مثالیں {#cli-examples}

ZK CLI کمانڈ آپریٹر اور ٹیسٹنگ فلو کے لئے ہیں۔ پیداوار والیٹس کو حاصل کردہ ہدایات جمع کرنے سے پہلے بٹوے / پروف لائبریری کے ساتھ مصروفیت، خفیہ شدہ پے لوڈ اور ثبوت پیدا کرنا چاہئے.

ہائبرڈ ZK کے قابل اثاثہ رجسٹر کریں:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

محفوظ نوٹ کے لئے ایک ورژن خفیہ شدہ پے لوڈ لفافہ بنائیں:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI اثاثہ پالیسی، تصدیق کی کلید حوالہ جات، اور خفیہ نوٹ لفافے تیار کرتا ہے. یہ `shield` یا `unshield` ٹرانزیکشن ذیلی احکامات کو بے نقاب نہیں کرتا ہے۔ ان ہدایات کو ایک SDK کے ساتھ بنائیں اور انہیں باقاعدگی سے قیمت درج ، دستخط شدہ لین دین کے طور پر جمع کروائیں.

ایک غیر حفاظتی پروف منسلک اس شکل ہے:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON
```

## SDK مثال {#sdk-example}

درست ثبوت بائٹس ترتیب شدہ ثبوت بیک اینڈ سے آتے ہیں۔ ٹرانزیکشن کا استعمال صرف عوامی ان پٹ اور ثبوت منسلک کی ضرورت ہے:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## گمنام اثاثوں کا حصول {#anonymous-asset-escrow}

گمنام اثاثہ ایایسکرو اسی محفوظ منتقلی کے طریقۂ کار سے ایایسکرو کی قدر حاصل کرتا ہے۔ فریقین اور ایایسکرو کی حیثیت بدستور ایایسکرو ریکارڈ میں درج ہوتے ہیں، لیکن فنڈنگ، اجرا، منسوخی اور حل کے حصے محفوظ nullifiers اور آؤٹ پٹ commitments استعمال کرتے ہیں۔

ISI کے عین رویے اور مثالوں کے لیے [مقامی اثاثہ ایایسکرو](/ur/blockchain/escrow.md#anonymous-escrow) دیکھیں۔

زندگی کا دورانیہ:

1. `OpenAnonymousAssetEscrow` حفاظتی فنڈنگ نوٹ خرچ کرتا ہے اور ایک کریڈٹ ذمہ داری پیدا کرتا ہے.
2. `AcceptAnonymousAssetEscrow` خریدار کا ریکارڈ.
3. `MarkAnonymousEscrowPaymentSent` ریکارڈ کرتا ہے کہ خریدار نے ادائیگی آف چین بھیجا.
4. `ReleaseAnonymousAssetEscrow` خریدار کی پیداوار کے ذمہ داریوں پر ایسکرو عہد کو خرچ کرتا ہے۔
5. `CancelAnonymousAssetEscrow` جب ادائیگی کا نشان نہ دیا گیا ہو تو بیچنے والے کی پیداوار کے وعدوں پر ایسکرو عہد کو واپس خرچ کرتا ہے۔
6. `OpenAnonymousEscrowDispute` اور `ResolveAnonymousEscrowDispute` شواہد ہاشس کے ساتھ متنازعہ ایسکروئرز کو سنبھالتے ہیں اور حل کرنے والے کنٹرول میں تقسیم کرتے ہیں۔

[استفسارات](/ur/reference/queries.md#escrow-and-proof-records) میں درج anonymous escrow استفسارات سے escrow records اور statuses کا معائنہ کریں۔

## ریاضی {#math}

مندرجہ ذیل نوٹیشن خفیہ اثاثے کے بہاؤ کی وضاحت کرتا ہے۔ عمل درآمد اثاثوں کی پالیسی اور تصدیق کنندہ رجسٹری سے فعال سرکٹ اور پیرامیٹر IDs کا استعمال کرتے ہیں ، لہذا مؤکلوں کو ذمہ داریوں ، باطل کرنے والوں اور ثبوت بائٹس کو بٹوے / پروفیسر کے غیر شفاف آؤٹ پٹ کے طور پر علاج کرنا چاہئے۔

ایک شیلڈ نوٹ کو اس طرح بیان کیا جاسکتا ہے:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

جہاں `owner` وصول کنندہ کے دیکھنے یا خرچ کرنے والے مواد سے اخذ کیا گیا ہے اور `rho` نوٹ تصادفی ہے۔

نوٹ عہد ایک خفیہ عہد ہے:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

موجودہ خفیہ ٹرانسفر سرکٹس کے لئے ، عوامی ان پٹ میں نوٹ کے وعدے ، باطل کرنے والے ، ایک مرکل جڑ ، ایک اثاثہ ٹیگ ، اور ایک سلسلہ ٹیگ شامل ہیں۔ سرکٹ اس شکل کا وابستگی کا رشتہ نافذ کرتا ہے:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

جب ایک نوٹ خرچ کیا جاتا ہے، تو بٹوے کو ایک باطل کرنے والا حاصل ہوتا ہے:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` عوامی ہے۔ یہ نوٹ کو ظاہر نہیں کرتا ہے ، لیکن یہ اس نوٹ اور سلسلہ کے لئے مستحکم ہے ، لہذا Iroha ایک ہی باطل کرنے والے کے ساتھ دوسرا اخراج رد کرسکتا ہے۔

مصروفیت کا درخت نوٹ کی موجودگی کو ثابت کرتا ہے۔ اگر کسی بٹوے میں مصروفیت `C_i` خرچ ہوتی ہے تو ، ثبوت میں `C_i` سے حالیہ عوامی جڑ تک ایک نجی میرکل راستہ شامل ہوتا ہے:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

ایک شیلڈ ٹرانسفر کے لئے، ثبوت بھی قدر تحفظ کو مجبور کرتا ہے:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

غیر محفوظ شدہ رقم کے لئے، عوامی رقم شامل ہے:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

پیش کردہ ثبوت کا خلاصہ اس طرح کیا جا سکتا ہے:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

جہاں `public_inputs` ذمہ داریاں ، باطل کرنے والے ، جڑ ، اثاثہ ٹیگ ، چین ٹیگ ، اور کسی بھی عوامی غیر محفوظ رقم ہیں۔ گواہ میں نوٹ کی مقدار ، تصادفی ، اخراجات کا مواد ، اور میرکل راستے شامل ہیں۔ توثیق کنندہ ثبوت کی تصدیق کرتے ہیں اور پھر آؤٹ پٹ کے وعدوں کو شامل کرکے اور ان پٹ منسوخ کرنے والے کو خرچ کیے جانے کے طور پر نشان زد کرکے لیجر کی حالت تبدیل کرتے ہیں۔

## کیا عوامی ہے؟ {#what-is-public}

گمنام ٹرانزیکشنز ہر مشاہدہ ہونے والے حقائق کو نجی نہیں بناتی ہیں۔ مندرجہ ذیل ڈیٹا اب بھی عوامی ہوسکتے ہیں:

- ٹرانزیکشن ہیش، بلاک کی اونچائی اور آرڈرنگ
- پیش کرنے والی ٹرانزیکشن اتھارٹی جب تک کہ درخواست میں نجی انٹری پوائنٹ یا ریلیئر پیٹرن کا استعمال نہ کیا جائے۔
- استعمال کی جانے والی اثاثہ تعریف
- منسوخ کرنے والے اور آؤٹ پٹ کے وعدے
- ثبوت ہیشز، تصدیق کلیدی حوالہ جات، اور اختیاری لفافے ہیشز
- `Unshield` کے لئے عوامی رقم اور وصول کنندہ اکاؤنٹ
- گمنام ضامن بیچنے والا، خریدار، حیثیت، ٹائم اسٹیمپ اور ثبوت ہیش

ایپلی کیشنز کو ڈیزائن کریں تاکہ یہ عوامی میٹا ڈیٹا آپ جس کاروباری تعلقات کی حفاظت کرنے کی کوشش کر رہے ہیں وہ ظاہر نہ کرے۔

## متعلقہ حوالہ جات {#related-reference}

- [`AssetConfidentialPolicy`](/ur/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ur/reference/data-model-schema.md)
- [`ProofAttachment`](/ur/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ur/reference/data-model-schema.md)
- [کریڈٹ اور ثبوت کی پوچھ گچھ ](/ur/reference/queries.md#escrow-and-proof-records)
