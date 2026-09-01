---
translation_locale: ur
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha کو براہ راست فزیکل سرور پر چلانا {#running-iroha-on-bare-metal}

جب آپ Docker Compose کے بجائے میزبانوں پر براہ راست نیٹ ورک نوڈ چلانے کا ارادہ رکھتے ہیں تو اس ورک فلو کا استعمال کریں۔ موجودہ ماخذ درخت Kagami جنریٹرز فراہم کرتا ہے جو مماثلت جینیس ، نیٹ ورک نوڈ ترتیب ، کلائنٹ ترتیب اور شروع / اسٹاپ اسکرپٹ لکھتے ہیں۔

## 1۔ بائنری بنائیں {#_1-build-the-binaries}

بہاؤ سے اوپر Iroha کام کی جگہ سے:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

اس کے نتیجے میں:

- `target/release/iroha3d` پیئر ڈیمون کے لئے
- `target/release/iroha` کے لئے CLI
- `target/release/kagami` کلیدی، پیداوار اور لوکل نیٹ کی نسل کے لئے

## 2۔ لوکل نیٹ ورک بنانا {#_2-generate-a-local-network}

چار پیئر Iroha 3 لوکل نیٹ پیدا کریں:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

آؤٹ پٹ ڈائرکٹری میں پیدا کردہ `genesis.json` ، `genesis.signed.nrt`، نیٹ ورک نوڈ `config.toml` فائلیں، `client.toml`، مددگار اسکرپٹس اور ایک جنریٹڈ `README.md` شامل ہیں جس میں اس بنڈل کے لئے عین مطابق کمانڈز ہیں۔

## 3۔ نیٹ ورک نوڈز کا آغاز کریں {#_3-start-peers}

جنریٹڈ ڈسپوزایبل لوکل نیٹ ورک کے لئے، پیدا کردہ اسکرپٹ استعمال کریں:

```bash
./localnet/start.sh
```

اگر آپ کو systemd جیسے عمل مینیجر میں ہر نیٹ ورک نوڈ کو وائرنگ کرنے کی ضرورت ہو تو ، ہر نیٹ ورک نوڈ کے لئے `./localnet/README.md` میں ریکارڈ کردہ لانچ کمانڈ کا استعمال کریں۔ ہر نیٹ ورک نوڈ کی `config.toml` ، نجی کلید ، اسٹوریج ڈائرکٹری اور بندرگاہوں کو علیحدہ رکھیں.

## 4۔ نیٹ ورک کو چلانے کے لیے {#_4-operate-the-network}

تخلیق کردہ کلائنٹ ترتیب کا استعمال کریں:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

پیدا کردہ لوکل نیٹ کو بند کردیں:

```bash
./localnet/stop.sh
```

## پیداوار کے نوٹ {#_5-production-notes}

- پیداوار کے لئے تازہ نجی چابیاں تیار کریں اور انہیں ذخیرہ خانے سے باہر رکھیں.
- ہر نیٹ ورک نوڈ کو ایک ہی دستخط شدہ جینیس ٹرانزیکشن، ٹاپولوجی، قابل اعتماد نیٹ ورک نوڈ، اور تصدیق کنندہ PoPs پر اتفاق کرنے دیں۔
- صرف میزبان مقامی انٹرفیس پر سننے والے کو پابند کریں جب دوسرے مشینوں سے نیٹ ورک نوڈ تک رسائی حاصل نہیں ہونی چاہئے.
- Torii نمائش، بنیادی auth، TLS، اور شرح کی حد کے لئے ایک ریورس پراکسی یا فائر وال کا استعمال کریں.
- پیدائش یا اتفاق رائے ٹاپولوجی میں ہونے والی تبدیلیوں کو مربوط ہجرت کے طور پر علاج کریں، نہ کہ سنگل پیئر فائل کی ترمیم.

کنٹینر مقامی ترقی کے لئے، [ لانچ Iroha 3](../../get-started/launch-iroha.md) Docker Compose ورک فلو کا استعمال کریں.
