---
translation_locale: ur
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: b6e3bd79c50ea326930ac978350ea4beac8294b6f045ac0084aada257754ffa1
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review+reviewed-delta
---
# کرپٹوگرافک چابیاں پیدا کرنا {#generating-cryptographic-keys}

Iroha 3 کے لئے کلائنٹ، نیٹ ورک نوڈ اور توثیق کنندہ کلیدی مواد پیدا کرنے کے لئے `kagami keys` کا استعمال کریں۔

## بنیادی استعمال {#basic-usage}

Iroha ماخذ checkout سے:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

بنیادی ڈائریکٹری پہلے سے موجود ہونی چاہیے۔ ہدف موجود نہیں ہونا چاہیے: Kagami پہلے سے موجود خالی ڈائریکٹری بھی مسترد کرتا ہے۔ وہ مالک تک محدود فائل سسٹم کی جانچ کے تحت ہدف کو `0700` موڈ میں بناتا ہے اور علامتی لنکس مسترد کرتا ہے۔ `kagami`، `public.key` اور `private.key` کو `0600` موڈ میں لکھتا ہے اور کلیدی مواد پرنٹ نہیں کرتا۔ `--pop` کے ساتھ وہ `pop.hex` بھی لکھتا ہے۔

جن پلیٹ فارموں پر Kagami صرف مالک کے لیے مخصوص فائل سسٹم کے ان قواعد کو نافذ نہیں کر سکتا، وہاں `--out-dir` محفوظ طور پر ناکام ہو کر کچھ نہیں لکھتا۔ نجی کلید کی فائل ایک غیر مرموز برآمد ہے، ہارڈ ویئر یا ناقابلِ برآمد پیداواری دستخط کنندہ نہیں۔ اسے منظور شدہ تحویلی حد میں درآمد کریں اور تعیناتی کے طریقۂ کار کے مطابق برآمد شدہ نقل ہٹا دیں۔

## الگورتھم {#algorithms}

عام الگورتھم یہ ہیں:

- کلائنٹ اکاؤنٹس اور streaming شناختوں کے لیے `ed25519`۔
- جب کلائنٹ اکاؤنٹ کو secp256k1 شناخت درکار ہو تو `secp256k1`۔
- ہر نوڈ یا ہم مرتبہ نوڈ کی اتفاقِ رائے کی شناخت کے لیے `bls_normal`۔

اپنی تعمیر کے تعاون یافتہ عین algorithms اس طرح دیکھیں:

```bash
cargo run --bin kagami -- keys --help
```

## متعین ترقیاتی چابیاں {#deterministic-development-keys}

قابلِ تکرار آزمائشی ڈیٹا کے لیے 32-byte seed دیں جسے 64 hexadecimal حروف میں encode کیا گیا ہو۔ اختیاری `0x` سابقہ قبول کیا جاتا ہے:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

seed نجی کلید کا مواد ہے۔ deterministic seeds صرف مقامی development اور tests کے لیے استعمال کریں۔ operating-system randomness سے پیداواری کلید بنانے کے لیے `--seed-hex` شامل نہ کریں۔

## BLS اتفاق رائے کی چابیاں اور مالکیت کے ثبوت۔ {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 میں نوڈ اور ہم مرتبہ نوڈ کی اتفاقِ رائے کی شناختیں BLS-normal کلیدیں استعمال کرتی ہیں۔ BLS-normal کلید اور ملکیت کا ثبوت (PoP) اس طرح بنائیں:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` صرف `bls_normal` کے ساتھ درست ہے اور تحویلی ڈائریکٹری میں `pop.hex` شامل کرتا ہے۔ دستخط شدہ ابتدائی بلاک میں ووٹ دینے والے ہر نوڈ کے لیے متعلقہ PoP ضروری ہے۔ ساتھی نوڈ کی ترتیب میں اگر `trusted_peers_pop` نقشہ خالی نہیں تو وہی طے کرتا ہے کہ کون سے نوڈ توثیق کریں گے؛ اس میں شامل نہ ہونے والے قابلِ اعتماد نوڈ مبصر ہیں۔ اگر نقشہ خالی ہے تو BLS کی نارمل قسم استعمال کرنے والے تمام قابلِ اعتماد نوڈ ابتدائی امیدواروں میں شامل ہوتے ہیں۔ ووٹروں کے PoPs پھر بھی دستخط شدہ ابتدائی بلاک سے آتے ہیں۔

## تحویلی آؤٹ پٹ {#custody-output}

`kagami keys` کے لیے `--out-dir` لازمی ہے اور یہ نجی کلید کا مواد کبھی standard output پر نہیں لکھتا۔ بنائی گئی ڈائریکٹری سے `public.key`، `private.key` اور اختیاری `pop.hex` پڑھیں۔ ہر فائل میں ایک canonical قدر اور اس کے بعد newline ہوتا ہے، جس سے واضح file-based automation آسان ہو جاتی ہے:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

مکمل تیار شدہ Kagami مدد کے لیے:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
