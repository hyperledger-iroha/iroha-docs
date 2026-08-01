---
translation_locale: ur
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# پیدائش کا حوالہ {#genesis-reference}

موجودہ Iroha 3 ورک فلو میں، ایک `genesis.json` مینفیس پہلی لین دین اور پیرامیٹرز کی وضاحت کرتا ہے جو نیٹ ورک شروع ہونے پر لاگو کیا جائے گا.

ساتھیوں کو تقسیم کردہ دستخط شدہ آرٹیفیکٹ ایک Norito-کوڈڈڈ `.nrt` فائل ہے جو `kagami genesis sign` کے ذریعہ تیار کی گئی ہے۔

## اہم شعبے {#main-fields}

ایک پیدائش کا مظاہرہ بیان کر سکتا ہے:

- `chain` زنجیروں کی شناخت کے لئے
- `executor` ایک اختیاری انجام دینے والے اپ گریڈ بائٹ کوڈ راستے کے لئے
- `ivm_dir` کے لیے IVM لائبریریوں کو ٹرگرز اور اپ گریڈ کے ذریعے استعمال کیا جاتا ہے۔
- `consensus_mode` دستاویز میں اعلان کردہ ابتدائی موڈ کے لئے
- `transactions` ترتیب شدہ پیرامیٹر اپ ڈیٹس، ہدایات، ٹرگرز اور ٹاپولوجی کے لئے
- `crypto` ابتدائی کریپٹو اسنیپ شاٹ کے لئے

`transactions` کے اندر، ٹاپولوجی اندراجات جوڑے پیئر آئی ڈی اور PoPs ایک ساتھ مل کر:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ایک مظاہرہ پیدا کریں {#generate-a-manifest}

ایک ٹیمپلیٹ پیدا کرنے کے لیے Kagami کا استعمال کریں:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

عوامی SORA Nexus ڈیٹا اسپیس کے لئے ، `npos` متوقع اتفاق رائے موڈ ہے۔ دیگر Iroha 3 تعیناتی ہدف پروفائل پر منحصر ہے اجازت یا NPoS استعمال کرسکتے ہیں۔.

## دستخط پر دستخط کریں {#sign-the-manifest}

JSON کو ترمیم اور توثیق کرنے کے بعد، اسے ایک تعیناتی قابل `.nrt` بلاک میں دستخط کریں:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` مینیفیس سے جینس پبلک کلید پڑھتا ہے اور فراہم کردہ نجی کلید ، بیج اور الگورتھم کا استعمال ڈسپلے ایبل دستخط شدہ بلاک تیار کرنے کے لئے کرتا ہے۔ نتیجہ فائل ہے جو ساتھیوں کو اپنی تشکیل سے حوالہ دینا چاہئے۔

## ترتیب `irohad` {#configure-irohad}

دستخط شدہ جینیس بلاک پر ڈیمون کی طرف اشارہ کریں:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## متعلقہ آلات {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

جنریٹر لاگو کرنے اور کمانڈ کی تفصیلات کے لئے، [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) دیکھیں.
