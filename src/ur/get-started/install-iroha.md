---
translation_locale: ur
translation_source: /get-started/install-iroha.md
translation_source_hash: f7f68228d219cc1c0ea5af128ba5dc956640df8a3d264ed3a4862447b3348a7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 انسٹال کریں {#install-iroha-3}

اس صفحے میں Iroha 3 ٹول چین اور بائنری کے لئے موجودہ تنصیب ورک فلو کا احاطہ کیا گیا ہے جو `hyperledger-iroha/iroha` اپ اسٹریم ورک اسپیس کا استعمال کرتے ہوئے ہے۔

میزبان پر براہ راست تنصیب کے لیے نیچے دی گئی Rust کی ہدایات پر عمل کریں۔ Docker کے ذریعے چار توثیقی نوڈ چلانے کے لیے [Iroha 3 چلانے کی ہدایات](/ur/get-started/launch-iroha.md) سے شروع کریں۔

## 1۔ ضروریات {#_1-prerequisites}

پہلے ان کو انسٹال کریں:

- [rustup](https://www.rust-lang.org/tools/install)، تاکہ بند `rust-toolchain.toml` ٹولچین (`1.93.1`) خود بخود نصب کیا جائے۔
- `git`
- اختیاری طور پر، Docker اور Docker Compose کے لئے مقامی کثیر نیٹ ورک نوڈ تیز رفتار شروع

## 2۔ ورک اسپیس کو کلون کریں {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3۔ کام کی جگہ بنانا {#_3-build-the-workspace}

سب کچھ تعمیر کریں:

```bash
cargo build --workspace
```

ایک چھوٹے سے آپریٹر پر توجہ مرکوز بلڈ کے لئے، صرف اہم بائنری مرتب کریں:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

نتیجے میں بائنریوں کو `target/debug/` یا `target/release/` پر لکھا جاتا ہے.

## تنصیب شدہ ٹولز کی تصدیق کریں {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

چار بائنری آپ عام طور پر استعمال کریں گے ہیں:

- `iroha3d` ایک معیاری نیٹ ورک نوڈ ڈیمون کے لئے
- `iroha3d_taira` کے لئے canonical Taira تصدیق کنندہ لانچر
- `iroha` CLI تک رسائی کے لئے Torii اور آپریٹر کے اختتامی پوائنٹس
- `kagami` چابیاں، پیدائش کے دستاویزات اور مقامی نیٹ پروفائلز کے لئے

## 5۔ اختیاری لوکل نیٹ اور Docker راستہ {#_5-optional-localnet-and-docker-path}

موجودہ ماخذ کی حمایت یافتہ لوکل نیٹ فلو Kagami کے ذریعہ تیار کیا جاتا ہے۔ اس میں نیٹ ورک نوڈ ترتیب ، جینیس آرٹیفیکٹس ، کلائنٹ ترتیب ، مددگار اسکرپٹ اور ایک اختیاری کمپوز فائل لکھی جاتی ہے جو چیک آؤٹ کوڈ سے ملتی ہے:

- `kagami localnet` مقامی نیٹ ورک نوڈ اسکرپٹ کے لئے
- `kagami docker` کے لئے Docker Compose مقامی نیٹ ورک کی ڈائرکٹری سے پیدا

[لانچنگ Iroha 3](/ur/get-started/launch-iroha.md) کے ساتھ جاری رکھیں.
