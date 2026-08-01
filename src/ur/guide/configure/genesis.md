---
translation_locale: ur
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# پیدائش {#genesis}

پیدائش ابتدائی سلسلہ کی حالت کو بیان کرتی ہے۔ ایڈیٹیبل ماخذ ایک JSON منشور ہے ، اور ایک Iroha 3 نوڈ ایک دستخط شدہ Norito ٹرانزیکشن فائل کا استعمال کرتا ہے۔

::: details پہلے سے طے شدہ پیدائش کا بیان

<<< @/snippets/genesis.json

:::

## فائلیں {#files}

`defaults/genesis.json` پر ڈیفالٹ مانیٹری بھیجتا ہے۔ Kagami کے ذریعہ تیار کردہ نیٹ ورکس آؤٹ پٹ ڈائرکٹری میں اپنا مانیٹری اور دستخط شدہ لین دین لکھتے ہیں:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

اس ڈائرکٹری میں پیدا ہونے والی `README.md` منتخب کردہ پروفائل کے لئے عین مطابق فائلوں اور لانچ کمانڈز کو ریکارڈ کرتی ہے۔

## ہم عمروں کی ترتیب {#peer-configuration}

`config.toml` کے `[genesis]` سیکشن میں دستخط شدہ جنیسس ٹرانزیکشن پر ہم مرتبہ اشارہ:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

نیٹ ورک میں تمام ہم منصبوں کو دستخط شدہ جینیس ٹرانزیکشن اور جنیس پبلک کلید پر اتفاق کرنا ہوگا۔

## پیدائش پر دستخط {#signing-genesis}

اگر آپ دستی طور پر ایک منشور میں ترمیم کرتے ہیں تو، ساتھیوں کو شروع کرنے سے پہلے اس کی تصدیق اور دستخط کریں:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS یا Nexus پروفائلز کے لئے، ٹاپولوجی اور BLS پروفیل کی طرف سے پیدا ہونے والے پروفائل کی طرف سے مطلوب ملکیت کا ثبوت شامل کریں. Kagami `localnet` ، `wizard`، اور پروفائل جنریشن کمانڈ خود بخود ان تفصیلات کو سنبھالتے ہیں.

## پیدائش کا دوبارہ آغاز {#recommitting-genesis}

ایک ہم مرتبہ صرف اس وقت جینس کرتا ہے جب اس کا اسٹوریج خالی ہو۔ ایک disposable localnet میں نئی جینس کی جانچ کرنے کے لئے ، ہم مرتبہ کو روکیں ، ان کی تخلیق کردہ ریاستی ڈائرکٹری کو ہٹا دیں ، اور نئے دستخط شدہ جینس سے شروع کریں۔ چلنے والے نیٹ ورک پر جینس کی جگہ نہ لیں جب تک کہ ہر توثیق کنندہ اسی منتقلی کو مربوط نہیں کر رہا ہے۔
