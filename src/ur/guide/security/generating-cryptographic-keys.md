---
translation_locale: ur
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# کرپٹوگرافک چابیاں پیدا کرنا {#generating-cryptographic-keys}

Iroha 3 کے لئے کلائنٹ، ہم مرتبہ اور توثیق کنندہ کلیدی مواد پیدا کرنے کے لئے `kagami keys` کا استعمال کریں۔

## بنیادی استعمال {#basic-usage}

Iroha ذریعہ چیک آؤٹ سے:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON آؤٹ پٹ کو TOML یا آٹومیشن میں کاپی کرنا عام طور پر سب سے آسان ہے:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

کمانڈ ایک عوامی کلید اور ایک بے نقاب نجی کلید پرنٹ کرتا ہے۔ نجی کلید کو خفیہ مواد کے طور پر سنبھالیں؛ پیدا کردہ پیداوار کی چابیاں نہ کریں.

## الگورتھم {#algorithms}

عام الگورتھم یہ ہیں:

- `ed25519` کلائنٹ اکاؤنٹس، سٹریمنگ کی شناختوں اور زیادہ تر ترقیاتی نیٹ ورکس کے لئے.
- `secp256k1` جب آپ کو ایک secp256k1 اکاؤنٹ کی شناخت کی ضرورت ہے.
- `bls_normal` کے لئے توثیق کنندہ اتفاق رائے کی چابیاں جب تعمیر BLS کی حمایت کو قابل بناتا ہے.

آپ کی تعمیر کی طرف سے حمایت کی عین مطابق الگورتھم چیک کریں:

```bash
cargo run --bin kagami -- keys --help
```

## تعیناتی ترقی کی چابیاں {#deterministic-development-keys}

reproducible fixtures کے لئے، ایک بیج پاس کریں:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

بیج نجی کلید کا مواد ہے۔ انہیں صرف مقامی ترقی اور ٹیسٹ کے لیے استعمال کریں۔

## BLS ملکیت کا ثبوت {#bls-proofs-of-possession}

NPoS اور Nexus تصدیق کنندہ پروفائلز کے لئے ضروری ہے کہ BLS تصدیق کنندہ چابیاں اور PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON میں `pop_hex` شامل ہوتا ہے جب `--pop` استعمال کیا جاتا ہے۔ اس قدر کو پیدا کردہ ٹاپولوجی یا پروفائل کے ذریعہ مطلوبہ `trusted_peers_pop` اندراجات کے ساتھ استعمال کریں۔

## آؤٹ پٹ فارمیٹس {#output-formats}

ٹرمینل معائنہ کے لیے ڈیفالٹ آؤٹ پٹ، آٹومیشن کے لیے `--json` اور `--compact` استعمال کریں جب کسی دوسرے اسکرپٹ کو سادہ لائن پر مبنی اقدار کی ضرورت ہو:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

مکمل طور پر پیدا ہونے والی Kagami امداد کے لئے:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
