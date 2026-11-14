---
translation_locale: ur
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# پیدائش {#genesis}

پیدائش ابتدائی سلسلہ حالت کی وضاحت کرتی ہے۔قابل تدوین ذریعہ ہے a JSON ظاہر، اور ایک Iroha 3 نوڈ ایک دستخط شدہ استعمال کرتا ہے۔ Norito ٹرانزیکشن فائل.

::: details ڈیفالٹ جینیسس مینی فیسٹ

<<< @/snippets/genesis.json

:::

## فائلیں {#files}

اصل ریپوزٹری `defaults/genesis.template.json` پر بنیادی ماخذ ٹیمپلیٹ فراہم کرتی ہے۔ ٹیمپلیٹ نامکمل ہوتا ہے اور جب تک `kagami genesis materialize` اسے مانیفیسٹ میں نہ بدلے، اسے جانچا، دستخط کیا یا نوڈ میں استعمال نہیں کیا جا سکتا۔ Kagami کے تیار کردہ نیٹ ورکس اپنا مانیفیسٹ اور دستخط شدہ لین دین آؤٹ پٹ ڈائریکٹری میں لکھتے ہیں:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

پیدا کردہ `README.md` اس ڈائرکٹری میں درست فائلوں اور لانچ کو ریکارڈ کیا جاتا ہے۔ منتخب پروفائل کے لیے کمانڈز۔

## پیئر کنفیگریشن {#peer-configuration}

پیئرز `config.toml` کے `[genesis]` حصے میں دستخط شدہ جینیسس لین دین کا حوالہ دیتے ہیں اور اس کا متوقع ہیش الگ فائل میں مقرر کرتے ہیں:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

نیٹ ورک کے تمام پیئرز کو دستخط شدہ جینیسس لین دین اور جینیسس کی عوامی کلید پر متفق ہونا چاہیے۔ متوقع ہیش کی فائل پہلے آغاز اور دوبارہ آغاز دونوں پر لازم ہے؛ `kagami genesis sign --expected-hash-out` اسے لکھتا ہے۔

## پیدائش پر دستخط کرنا {#signing-genesis}

اگر آپ کسی مینی فیسٹ میں دستی طور پر ترمیم کرتے ہیں تو نیٹ ورک نوڈ شروع کرنے سے پہلے اس کی توثیق کریں اور اس پر دستخط کریں:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` مالک کے زیر انتظام موڈ ہونا چاہیے-`0600`, سنگل لنک باقاعدہ فائل جس میں ایک کیننیکل پرائیویٹ کلید ملٹی ہیش اور ایک فائنل شامل ہے۔ نئی لائن Kagami علامتی روابط کو مسترد کرتا ہے اور کبھی بھی خام جینیس نجی کو قبول نہیں کرتا ہے۔ کمانڈ لائن پر کلید.

NPoS یا SORA Nexus پروفائلز کے لیے تیار کردہ پروفائل کی مطلوبہ ٹوپولوجی اور BLS ملکیت کے ثبوت شامل کریں۔ Kagami کی `localnet generate`، `wizard` اور `sora-network generate` کمانڈز یہ تفصیلات خود سنبھالتی ہیں۔

## دوبارہ پیدا کرنا {#recommitting-genesis}

نیا نیٹ ورک اپنے دستخط شدہ جینیسس سے شروع ہوتا ہے۔ عارضی مقامی نیٹ ورک میں دوسرا جینیسس آزمانے کے لیے پیئرز روکیں، ان کی تیار کردہ حالت کی ڈائریکٹری حذف کریں، اور نئے دستخط شدہ جینیسس سے آغاز کریں۔ چلتے ہوئے نیٹ ورک میں اپ گریڈ کے طریقے کے طور پر کبھی جینیسس تبدیل نہیں کرنا چاہیے۔ پروٹوکول کی تعریفوں میں تبدیلی کے لیے حکمرانی کے تحت انتخابی انتقال اور منتخب تعریفوں اور ذمہ داریوں کی اہلیت کی جانچ ضروری ہے۔
