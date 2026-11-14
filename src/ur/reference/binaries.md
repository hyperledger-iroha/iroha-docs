---
translation_locale: ur
translation_source: /reference/binaries.md
translation_source_hash: 887291d6ef0d9a919b076e4b632ee1cec7a2c289b284b40346ed4b2a0f4a41b3
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha بائنریوں کے ساتھ کام کرنا {#working-with-iroha-binaries}

Iroha 3 آپریٹر ورک فلو چار بنیادی بائنریوں کے گرد گھومتا ہے:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad) ایک نیٹ ورک نوڈ ڈیمون چلانے کے لئے
- `iroha3d_taira` کے لئے canonical Taira تصدیق کنندہ لانچر
- CLI اور operator commands کے لیے [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli)
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) چابیاں، پیدائش، لوکل نیٹ ورک اور پروفائلز کے لئے

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

ایک ہی نظرثانی سے بنی بائنری فائلوں کے ساتھ Docker میں چار توثیقی نوڈ بنانے اور چلانے کے لیے [لانچ Iroha 3](/ur/get-started/launch-iroha.md) کی ہدایات پر عمل کریں۔

## مجھے کون سا بائنری استعمال کرنا چاہئے؟ {#which-binary-should-i-use}

- `iroha3d` کا استعمال کریں جب آپ پبلک Taira تصدیق کنندہ ریلیز کے باہر نیٹ ورک نوڈ شروع یا کام کر رہے ہو۔
- Taira تصدیق کنندہ کی تعیناتی کے لئے صرف `iroha3d_taira --sora` کا استعمال کریں؛ یہ Taira کے سلسلے، اسٹوریج اور رن ٹائم سگنل پروفائل کو نافذ کرتا ہے.
- `iroha` کا استعمال کریں جب آپ کو لیجر سے استفسار کرنے، لین دین جمع کروانے یا آپریٹر کے اختتام پوائنٹس کی جانچ پڑتال کرنے کی ضرورت ہو.
- `kagami` کا استعمال کریں جب آپ کو چابیاں، پیدائش کے دستاویزات، پروفائل بنڈل، یا مقامی نیٹ اثاثوں کی ضرورت ہو.
