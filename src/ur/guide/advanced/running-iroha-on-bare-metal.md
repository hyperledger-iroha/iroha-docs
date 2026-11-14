---
translation_locale: ur
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

آؤٹ پٹ ڈائرکٹری میں تیار کردہ `genesis.json`، `genesis.signed.nrt`، `genesis.expected_hash`، ہر ویلیڈیٹر کے لیے ایک `peerN.toml`، `client.toml`، `start.sh` اور `stop.sh` اسکرپٹس، اور ایک تیار کردہ `README.md` شامل ہیں جس میں اس بنڈل کے لیے عین کمانڈز درج ہیں۔

## 3۔ نیٹ ورک نوڈز کا آغاز کریں {#_3-start-peers}

جنریٹڈ ڈسپوزایبل لوکل نیٹ ورک کے لئے، پیدا کردہ اسکرپٹ استعمال کریں:

```bash
./localnet/start.sh
```

اگر آپ کو ہر پیئر کو systemd جیسے پراسیس مینیجر سے جوڑنا ہو تو `./localnet/start.sh` میں ہر پیئر کی کمانڈ پر عمل کریں: `<bundle>/state/peerN` سے `iroha3d --config <bundle>/peerN.toml` چلائیں، اور `--sumeragi-assert-fresh-key` صرف اس پیئر کے پہلے آغاز پر دیں۔ ہر پیئر کی `peerN.toml`، نجی کلید، اسٹوریج ڈائرکٹری اور پورٹس الگ رکھیں۔

## 4۔ نیٹ ورک کو چلانے کے لیے {#_4-operate-the-network}

تخلیق کردہ کلائنٹ ترتیب کا استعمال کریں:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
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
