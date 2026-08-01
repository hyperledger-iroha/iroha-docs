---
translation_locale: ur
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha بائنریوں کے ساتھ کام کرنا {#working-with-iroha-binaries}

Iroha 3 آپریٹر ورک فلو تین بنیادی بائنریوں کے گرد گھومتا ہے:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) ایک ہم مرتبہ ڈیمون چلانے کے لئے
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) چابیاں، پیدائش، لوکل نیٹ ورک اور پروفائلز کے لئے

## ماخذ سے تعمیر کریں {#build-from-source}

اوپر بہاؤ کے کام کی جگہ جڑ سے:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

اس کے بعد ریلیز بائنری `target/release/` میں دستیاب ہیں.

کمانڈ کی سطح کا معائنہ کرنے کے لئے:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## ذخیرہ سے براہ راست چلائیں {#run-directly-from-the-repository}

اگر آپ کسی بھی چیز کو عالمی سطح پر انسٹال نہیں کرنا چاہتے ہیں تو `cargo run` کا استعمال کریں۔

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker تصویر {#docker-image}

اپ اسٹریم کام کی جگہ استعمال کرتا ہے `kagami localnet` اور `kagami docker` پیدا کرنے کے لئے Docker Compose فائلیں جو چیک آؤٹ کوڈ سے ملتی ہیں. `hyperledger/iroha:dev` ان فائلوں کے ساتھ تصویر کا استعمال کیا جا سکتا ہے.

CLI کو ایک کنٹینر میں چلائیں:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

ایک کنٹینر میں Kagami چلائیں:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

پیئر اسٹارٹ اپ کے لئے، ایک مقامی نیٹ ورک پیدا کریں اور سب سے پہلے فائل کو مرتب کریں:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## مجھے کون سا بائنری استعمال کرنا چاہئے؟ {#which-binary-should-i-use}

- `irohad` کا استعمال کریں جب آپ اپنے ہم عمروں کو شروع یا آپریٹنگ کر رہے ہوں۔
- `iroha` کا استعمال کریں جب آپ کو لیجر سے استفسار کرنے، لین دین جمع کروانے یا آپریٹر کے اختتام پوائنٹس کی جانچ پڑتال کرنے کی ضرورت ہو.
- `kagami` کا استعمال کریں جب آپ کو چابیاں، پیدائش کے دستاویزات، پروفائل بنڈل، یا مقامی نیٹ اثاثوں کی ضرورت ہو.
