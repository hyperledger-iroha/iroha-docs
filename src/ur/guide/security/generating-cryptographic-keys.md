---
translation_locale: ur
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# کرپٹوگرافک چابیاں پیدا کرنا {#generating-cryptographic-keys}

Iroha 3 کے لئے کلائنٹ، نیٹ ورک نوڈ اور توثیق کنندہ کلیدی مواد پیدا کرنے کے لئے `kagami keys` کا استعمال کریں۔

## بنیادی استعمال {#basic-usage}

Iroha ماخذ checkout سے:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

اصل ڈائریکٹری پہلے سے موجود ہونی چاہیے۔ ہدف نئی ہو یا پہلے ہی موجودہ صارف کی ملکیت ہو، اس کا mode `0700` ہو، اس میں symbolic link نہ ہوں، اور وہ خالی ہو۔ `kagami`، `public.key` اور `private.key` کو mode `0600` کے ساتھ لکھتا ہے اور کلیدی مواد پرنٹ نہیں کرتا۔ `--pop` کے ساتھ یہ `pop.hex` بھی لکھتا ہے۔

جن پلیٹ فارموں پر Kagami صرف مالک کے لیے مخصوص فائل سسٹم کے ان قواعد کو نافذ نہیں کر سکتا، وہاں `--out-dir` محفوظ طور پر ناکام ہو کر کچھ نہیں لکھتا۔ نجی کلید کی فائل ایک غیر مرموز برآمد ہے، ہارڈ ویئر یا ناقابلِ برآمد پیداواری دستخط کنندہ نہیں۔ اسے منظور شدہ تحویلی حد میں درآمد کریں اور تعیناتی کے طریقۂ کار کے مطابق برآمد شدہ نقل ہٹا دیں۔

## الگورتھم {#algorithms}

عام الگورتھم یہ ہیں:

- کلائنٹ اکاؤنٹس اور streaming شناختوں کے لیے `ed25519`۔
- جب کلائنٹ اکاؤنٹ کو secp256k1 شناخت درکار ہو تو `secp256k1`۔
- ہر node یا peer اتفاقِ رائے کی شناخت کے لیے `bls_normal`۔

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

Iroha 3 کے node اور peer اتفاقِ رائے کی شناختیں BLS-normal کلیدیں استعمال کرتی ہیں۔ BLS-normal کلید اور proof-of-possession (PoP) اس طرح بنائیں:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` صرف `bls_normal` کے ساتھ درست ہے؛ یہ تحویلی ڈائریکٹری میں `pop.hex` شامل کرتا ہے۔ دستخط شدہ genesis کو ہر ووٹ دینے والے validator کے لیے مماثل PoP درکار ہے۔ peer configuration میں غیر خالی `trusted_peers_pop` map validator کی ذیلی مجموعہ منتخب کرتا ہے؛ اس غیر خالی map میں شامل نہ کیے گئے trusted peers مبصر ہوتے ہیں۔ اگر map خالی ہو تو تمام BLS-normal trusted peers bootstrap candidate set میں داخل ہوتے ہیں، جبکہ ووٹر PoPs بدستور دستخط شدہ genesis فراہم کرتا ہے۔

## تحویلی آؤٹ پٹ {#custody-output}

`kagami keys` کے لیے `--out-dir` لازمی ہے اور یہ نجی کلید کا مواد کبھی standard output پر نہیں لکھتا۔ بنائی گئی ڈائریکٹری سے `public.key`، `private.key` اور اختیاری `pop.hex` پڑھیں۔ ہر فائل میں ایک canonical قدر اور اس کے بعد newline ہوتا ہے، جس سے واضح file-based automation آسان ہو جاتی ہے:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

مکمل تیار شدہ Kagami مدد کے لیے:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
