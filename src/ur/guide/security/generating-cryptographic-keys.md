---
translation_locale: ur
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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

کمانڈ ایک عوامی کلید اور ایک ظاہر شدہ نجی کلید پرنٹ کرتی ہے۔ نجی کلید کو خفیہ مواد سمجھیں؛ تیار کردہ پروڈکشن چابیاں repository میں commit نہ کریں۔

کسی معاون Unix پلیٹ فارم پر محفوظ مقامی برآمد یا تحویل کی منتقلی کے لیے، نجی کلید پرنٹ کرنے کے بجائے نیا کلیدی جوڑا صرف مالک کی رسائی والی خالی ڈائرکٹری میں لکھیں:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

اصل ڈائرکٹری پہلے سے موجود ہونی چاہیے۔ ہدف نئی ڈائرکٹری ہو یا پہلے سے موجودہ صارف کی ملکیت ہو، اس کا موڈ `0700` ہو، اس میں علامتی روابط نہ ہوں اور وہ خالی ہو۔ `kagami`، `public.key` اور `private.key` کو موڈ `0600` کے ساتھ لکھتا ہے اور نجی کلید پرنٹ نہیں کرتا۔ `--pop` کے ساتھ یہ `pop.hex` بھی لکھتا ہے۔

جہاں Kagami صرف مالک تک محدود فائل سسٹم کے قواعد نافذ نہ کر سکے وہاں `--out-dir` محفوظ انداز میں ناکام ہو جاتا ہے۔ نجی کلید کی فائل ایک غیر خفیہ شدہ برآمد ہے، ہارڈویئر سے محفوظ یا ناقابلِ برآمد پروڈکشن دستخط کنندہ نہیں۔ اسے منظور شدہ تحویلی حد میں درآمد کریں اور تعیناتی کے طریقۂ کار کے مطابق برآمد شدہ فائل ہٹا دیں۔

## الگورتھم {#algorithms}

عام الگورتھم یہ ہیں:

- `ed25519` کلائنٹ اکاؤنٹس اور سٹریمنگ کی شناخت کے لئے.
- `secp256k1` جب کسی کلائنٹ اکاؤنٹ کے لیے secp256k1 شناخت درکار ہو۔
- `bls_normal` ہر نوڈ یا ہم مرتبہ اتفاق رائے کی شناخت کے لئے جب تعمیر BLS کی حمایت کو قابل بناتا ہے.

اپنی build میں معاون عین الگورتھم یہ کمانڈ چلا کر دیکھیں:

```bash
cargo run --bin kagami -- keys --help
```

## متعین ترقیاتی چابیاں {#deterministic-development-keys}

reproducible fixtures کے لئے، 64 hexadecimal حروف کے طور پر کوڈ 32 بائٹ بیج منتقل کریں. ایک اختیاری `0x` prefix قبول کیا جاتا:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

بیج نجی کلید کا مواد ہے۔ متعین بیج صرف مقامی ترقی اور ٹیسٹ کے لیے استعمال کریں۔ آپریٹنگ سسٹم کی بے ترتیبی سے پروڈکشن کلید بنانے کے لیے `--seed-hex` حذف کریں۔

## BLS اتفاق رائے کی چابیاں اور مالکیت کے ثبوت۔ {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node اور peer consensus identities use BLS-normal keys. ایک BLS-normal key and proof of possession (PoP) کے ساتھ پیدا کریں:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` صرف `bls_normal` کے ساتھ درست ہے۔ JSON آؤٹ پٹ میں `pop_hex` شامل ہوتا ہے۔ دستخط شدہ genesis کو ہر ووٹ دینے والے validator کے لیے مماثل PoP درکار ہے۔ peer ترتیب میں غیر خالی `trusted_peers_pop` نقشہ validator ذیلی مجموعہ منتخب کرتا ہے؛ اس غیر خالی نقشے میں شامل نہ کیے گئے قابلِ اعتماد peers مبصر ہوتے ہیں۔ اگر نقشہ خالی ہو تو BLS-normal چابیوں والے تمام قابلِ اعتماد peers ابتدائی امیدوار مجموعے میں داخل ہوتے ہیں، جبکہ ووٹ دینے والے validators کی PoPs پھر بھی دستخط شدہ genesis فراہم کرتی ہے۔

## آؤٹ پٹ فارمیٹس {#output-formats}

ٹرمینل معائنہ کے لیے ڈیفالٹ آؤٹ پٹ، آٹومیشن کے لیے `--json` اور `--compact` استعمال کریں جب کسی دوسرے اسکرپٹ کو سادہ لائن پر مبنی اقدار کی ضرورت ہو:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

مکمل طور پر پیدا ہونے والی Kagami امداد کے لئے:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
