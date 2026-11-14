---
translation_locale: ur
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# پیدائش کا حوالہ {#genesis-reference}

موجودہ میں Iroha 3 ورک فلو، a `genesis.json` مینی فیسٹ پہلے کی وضاحت کرتا ہے۔ لین دین اور پیرامیٹرز جو نیٹ ورک شروع ہونے پر لاگو ہوں گے۔

نیٹ ورک نوڈز میں تقسیم کردہ دستخط شدہ نمونے a ہے۔ Norito-انکوڈ شدہ `.nrt` فائل کی طرف سے تیار `kagami genesis sign`.

## مین فیلڈز {#main-fields}

ایک جینیسس مینی فیسٹ وضاحت کر سکتا ہے:

- `chain` سلسلہ شناخت کنندہ کے لیے
- `chain_discriminant`، مانیفیسٹ میں اکاؤنٹ کے لفظی شناخت کنندگان انکوڈ کرنے والے I105 نیٹ ورک سابقے کے لیے
- `executor` ایک اختیاری ایگزیکیوٹر اپ گریڈ بائٹ کوڈ پاتھ کے لیے
- `ivm_dir` کے لیے IVM محرکات اور اپ گریڈ کے ذریعہ استعمال ہونے والی لائبریریاں
- `consensus_mode` مینی فیسٹ کے ذریعہ مشتہر کردہ ابتدائی وضع کے لیے
- `transactions` آرڈر شدہ پیرامیٹر اپ ڈیٹس، ہدایات، محرکات اور ٹوپولوجی کے لیے
- `sumeragi_context`، دستخط شدہ Sumeragi اونچائی سیاق کے پیرامیٹرز کے لیے
- `crypto_admission_policy`، چین کے عین منظور شدہ دستخطی اور کنٹرولر الگورتھمز کے لیے، جن کی فہرست `allowed_algorithms` میں ہوتی ہے

کے اندر `transactions`, ٹوپولوجی اندراجات جوڑے نیٹ ورک نوڈ کی شناخت اور PoPs ایک ساتھ:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ایک مینی فیسٹ بنائیں {#generate-a-manifest}

ٹیمپلیٹ بنانے کے لیے Kagami استعمال کریں۔ ہر منظور شدہ الگورتھم کے لیے بڑھتی ہوئی کینونیکل ترتیب میں `--allowed-signing` دہرائیں؛ Kagami چھوڑے گئے الگورتھمز خود شامل نہیں کرتا:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

عوامی SORA Nexus ڈیٹا اسپیس کے لیے متوقع اتفاقِ رائے موڈ `npos` ہے۔ دیگر Iroha 3 تنصیبات ہدف پروفائل کے مطابق اجازت یافتہ موڈ یا NPoS استعمال کر سکتی ہیں۔

## مینی فیسٹ پر دستخط کریں۔ {#sign-the-manifest}

ترمیم اور توثیق کے بعد JSON, اسے قابل تعیناتی میں سائن کریں۔ `.nrt` بلاک:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` مینی فیسٹ سے جینیسس پبلک کلید پڑھتا ہے اور استعمال کرتا ہے۔ پیدا کرنے کے لیے مالک کے قبضے میں، سنگل لنک ریگولر فائل کی نجی کلید قابل تعیناتی دستخط شدہ بلاک۔فائل میں ایک کینونیکل نجی کلید ہونی چاہیے۔ ملٹی ہیش کے بعد ایک نئی لائن۔ Kagami علامتی روابط اور دیگر طریقوں کو مسترد کرتا ہے۔ سے `0600`. خام نجی چابیاں کمانڈ لائن پر قبول نہیں کی جاتی ہیں۔نتیجہ وہ فائل ہے جس کا نیٹ ورک نوڈز کو اپنی تشکیل سے حوالہ دینا چاہئے۔

## ترتیب دیں۔ `iroha3d` {#configure-iroha3d}

ڈیمَن کو دستخط شدہ جینیسس بلاک اور اس کے متوقع ہیش کو مقرر کرنے والی فائل کا راستہ دیں۔ `kagami genesis sign --expected-hash-out` یہ فائل لکھتا ہے، اور نوڈ کو پہلے آغاز اور دوبارہ آغاز دونوں پر اس کی ضرورت ہوتی ہے:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## متعلقہ ٹولز {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

جنریٹر کے نفاذ اور احکامات کی تفصیلات کے لیے [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) دیکھیں۔
