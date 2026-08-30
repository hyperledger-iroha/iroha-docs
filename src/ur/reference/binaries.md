---
translation_locale: ur
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha بائنریوں کے ساتھ کام کرنا {#working-with-iroha-binaries}

Iroha 3 آپریٹر ورک فلو چار بنیادی بائنریوں کے گرد گھومتا ہے:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) ایک ہم مرتبہ ڈیمون چلانے کے لئے
- `iroha3d_taira` کے لئے canonical Taira تصدیق کنندہ لانچر
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) چابیاں، پیدائش، لوکل نیٹ ورک اور پروفائلز کے لئے

## ماخذ سے تعمیر کریں {#build-from-source}

اوپر بہاؤ کے کام کی جگہ جڑ سے:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

اس کے بعد ریلیز بائنری `target/release/` میں دستیاب ہیں.

کمانڈ کی سطح کا معائنہ کرنے کے لئے:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## ذخیرہ سے براہ راست چلائیں {#run-directly-from-the-repository}

اگر آپ کسی بھی چیز کو عالمی سطح پر انسٹال نہیں کرنا چاہتے ہیں تو `cargo run` کا استعمال کریں۔

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## مجھے کون سا بائنری استعمال کرنا چاہئے؟ {#which-binary-should-i-use}

- `iroha3d` کا استعمال کریں جب آپ پبلک Taira تصدیق کنندہ ریلیز کے باہر ہم مرتبہ شروع یا کام کر رہے ہو۔
- Taira تصدیق کنندہ کی تعیناتی کے لئے صرف `iroha3d_taira --sora` کا استعمال کریں؛ یہ Taira کے سلسلے، اسٹوریج اور رن ٹائم سگنل پروفائل کو نافذ کرتا ہے.
- `iroha` کا استعمال کریں جب آپ کو لیجر سے استفسار کرنے، لین دین جمع کروانے یا آپریٹر کے اختتام پوائنٹس کی جانچ پڑتال کرنے کی ضرورت ہو.
- `kagami` کا استعمال کریں جب آپ کو چابیاں، پیدائش کے دستاویزات، پروفائل بنڈل، یا مقامی نیٹ اثاثوں کی ضرورت ہو.
