---
translation_locale: ur
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# پیدائش {#genesis}

پیدائش ابتدائی سلسلہ حالت کی وضاحت کرتی ہے۔قابل تدوین ذریعہ ہے a JSON ظاہر، اور ایک Iroha 3 نوڈ ایک دستخط شدہ استعمال کرتا ہے۔ Norito ٹرانزیکشن فائل.

::: details ڈیفالٹ جینیسس مینی فیسٹ

<<< @/snippets/genesis.json

:::

## فائلیں {#files}

اپ اسٹریم ریپوزٹری ڈیفالٹ مینی فیسٹ پر بھیجتی ہے۔ `defaults/genesis.json`. Kagami-جنریٹڈ نیٹ ورک اپنا مینی فیسٹ اور دستخط شدہ لین دین لکھتے ہیں۔ آؤٹ پٹ ڈائرکٹری:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

پیدا کردہ `README.md` اس ڈائرکٹری میں درست فائلوں اور لانچ کو ریکارڈ کیا جاتا ہے۔ منتخب پروفائل کے لیے کمانڈز۔

## پیئر کنفیگریشن {#peer-configuration}

نیٹ ورک نوڈز نے دستخط شدہ جینیسس لین دین کی طرف اشارہ کیا۔ `[genesis]` کا سیکشن `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

نیٹ ورک کے تمام نیٹ ورک نوڈ نوڈز کو دستخط شدہ جینیسس ٹرانزیکشن اور جینیسس پبلک کلید دونوں پر متفق ہونا ضروری ہے۔

## پیدائش پر دستخط کرنا {#signing-genesis}

اگر آپ کسی مینی فیسٹ میں دستی طور پر ترمیم کرتے ہیں تو نیٹ ورک نوڈ شروع کرنے سے پہلے اس کی توثیق کریں اور اس پر دستخط کریں:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` مالک کے زیر انتظام موڈ ہونا چاہیے-`0600`, سنگل لنک باقاعدہ فائل جس میں ایک کیننیکل پرائیویٹ کلید ملٹی ہیش اور ایک فائنل شامل ہے۔ نئی لائن Kagami علامتی روابط کو مسترد کرتا ہے اور کبھی بھی خام جینیس نجی کو قبول نہیں کرتا ہے۔ کمانڈ لائن پر کلید.

NPoS یا کے لیے Nexus پروفائلز، ٹوپولوجی اور شامل ہیں۔ BLS قبضے کے ثبوت تیار کردہ پروفائل کے ذریعہ درکار ہے۔ Kagami `localnet`, `wizard`, اور پروفائل جنریشن کمانڈز ان تفصیلات کو خود بخود ہینڈل کرتی ہیں۔

## دوبارہ پیدا کرنا {#recommitting-genesis}

ایک نیٹ ورک نوڈ صرف اس وقت پیدائش کا ارتکاب کرتا ہے جب اس کا ذخیرہ خالی ہو۔میں ایک نئی پیدائش کی جانچ کرنے کے لیے ایک ڈسپوزایبل لوکل نیٹ، نیٹ ورک نوڈز کو روکیں، ان کی تیار کردہ اسٹیٹ ڈائرکٹری کو ہٹا دیں، اور نئے دستخط شدہ ابتداء سے شروع کریں۔رننگ پر جینیسس کو تبدیل نہ کریں۔ نیٹ ورک جب تک کہ ہر تصدیق کنندہ ایک ہی منتقلی کو مربوط نہ کر رہا ہو۔
