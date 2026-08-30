---
translation_locale: ur
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# پیدائش کا حوالہ {#genesis-reference}

موجودہ میں Iroha 3 ورک فلو، a `genesis.json` مینی فیسٹ پہلے کی وضاحت کرتا ہے۔
لین دین اور پیرامیٹرز جو نیٹ ورک شروع ہونے پر لاگو ہوں گے۔

ساتھیوں میں تقسیم کردہ دستخط شدہ نمونے a ہے۔ Norito-انکوڈ شدہ `.nrt` فائل
کی طرف سے تیار `kagami genesis sign`.

## مین فیلڈز {#main-fields}

ایک جینیسس مینی فیسٹ وضاحت کر سکتا ہے:

- `chain` سلسلہ شناخت کنندہ کے لیے
- `executor` ایک اختیاری ایگزیکیوٹر اپ گریڈ بائٹ کوڈ پاتھ کے لیے
- `ivm_dir` کے لیے IVM محرکات اور اپ گریڈ کے ذریعہ استعمال ہونے والی لائبریریاں
- `consensus_mode` مینی فیسٹ کے ذریعہ مشتہر کردہ ابتدائی وضع کے لیے
- `transactions` آرڈر شدہ پیرامیٹر اپ ڈیٹس، ہدایات، محرکات اور ٹوپولوجی کے لیے
- `crypto` ابتدائی کرپٹو سنیپ شاٹ کے لیے

کے اندر `transactions`, ٹوپولوجی اندراجات جوڑے ہم مرتبہ کی شناخت اور PoPs ایک ساتھ:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ایک مینی فیسٹ بنائیں {#generate-a-manifest}

استعمال کریں۔ Kagami ٹیمپلیٹ بنانے کے لیے:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

عوام کے لیے SORA Nexus ڈیٹا اسپیس، `npos` متوقع اتفاق رائے کا موڈ ہے۔
دیگر Iroha 3 تعیناتیاں ہدف کے لحاظ سے اجازت یافتہ یا NPoS استعمال کر سکتی ہیں۔
پروفائل

## مینی فیسٹ پر دستخط کریں۔ {#sign-the-manifest}

ترمیم اور توثیق کے بعد JSON, اسے قابل تعیناتی میں سائن کریں۔ `.nrt` بلاک:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` مینی فیسٹ سے جینیسس پبلک کلید پڑھتا ہے اور استعمال کرتا ہے۔
پیدا کرنے کے لیے مالک کے قبضے میں، سنگل لنک ریگولر فائل کی نجی کلید
قابل تعیناتی دستخط شدہ بلاک۔فائل میں ایک کینونیکل نجی کلید ہونی چاہیے۔
ملٹی ہیش کے بعد ایک نئی لائن۔ Kagami علامتی روابط اور دیگر طریقوں کو مسترد کرتا ہے۔
سے `0600`. خام نجی چابیاں کمانڈ لائن پر قبول نہیں کی جاتی ہیں۔نتیجہ
وہ فائل ہے جس کا ساتھیوں کو اپنی تشکیل سے حوالہ دینا چاہئے۔

## ترتیب دیں۔ `iroha3d` {#configure-iroha3d}

ڈیمون کو دستخط شدہ جینیسس بلاک کی طرف اشارہ کریں:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## متعلقہ ٹولز {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

جنریٹر کے نفاذ اور کمانڈ کی تفصیلات کے لیے، دیکھیں
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
