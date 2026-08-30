---
translation_locale: ur
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# نیٹ ورک کے تعیناتی کی چابیاں {#keys-for-network-deployment}

ہر نیٹ ورک کو کلائنٹس، ہم مرتبہ، جینس دستخط اور NPoS یا Nexus پروفائلز کے لئے BLS تصدیق کنندہ کی شناختوں کے لئے الگ الگ کلیدی مواد کی ضرورت ہوتی ہے.

## جہاں چابیاں استعمال کی جاتی ہیں {#where-keys-are-used}

- کلائنٹ کے دستخط کی چابیاں `client.toml` میں محفوظ ہیں `[account]`.
- ہم مرتبہ شناخت کی چابیاں ہر ہم مرتبہ `config.toml` میں `public_key` اور `private_key` کے طور پر ذخیرہ کی جاتی ہیں۔
- ہم مرتبہ دریافت `trusted_peers` میں ہر ہم مرتبہ کی عوامی کلید کا استعمال کرتا ہے.
- BLS توثیق کنندہ این پی او ایس پروفائلز کے لئے مالکیت کا ثبوت `trusted_peers_pop` میں محفوظ کیا جاتا ہے۔
- پیدائش کے دستخط پر دستخط کرتے وقت پیئر ترتیب میں `[genesis].public_key` اور اسی طرح کی نجی کلید کا استعمال کیا جاتا ہے.

مقامی یا ٹیسٹ کی تعیناتی کے لئے، Kagami کو ان تمام فائلوں کو ایک ساتھ پیدا کرنے دیں:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ایک موجودہ نیٹ ورک یا پروفائل کے لئے، ہدایت شدہ بہاؤ کا استعمال کریں:

```bash
cargo run --bin kagami -- wizard
```

## انفرادی کلیدی جوڑے پیدا کریں {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## ہم مرتبہ مطابقت {#peer-consistency}

تمام توثیق کنندگان کو ایک ہی جینس ٹرانزیکشن ، ٹاپولوجی ، قابل اعتماد ہم مرتبہ عوامی چابیاں اور توثیق کنندہ PoPs پر اتفاق کرنا چاہئے۔ ایک واحد لاپتہ یا متضاد ہم مرتبہ کلید نیٹ ورک کے آغاز یا اتفاق رائے تک پہنچنے سے روک سکتی ہے۔

کم از کم بازنطینی غلطی برداشت کرنے والی تعیناتی کے ل at ، کم از کم چار ہم مرتبہ استعمال کریں۔ ہر ہم مرتبہ کی اپنی نجی کلید ہونی چاہئے ، لیکن ہر ہم مرتبہ ترتیب کو ایک ہی قابل اعتماد ہم مرتبہ سیٹ کی ضرورت ہے۔

## کلائنٹ اکاؤنٹس {#client-accounts}

`client.toml` میں کلائنٹ اکاؤنٹ پہلے سے ہی آن لائن ہونا ضروری ہے۔ یہ جینس مینفیس یا بعد کی ٹرانزیکشن کے ذریعہ رجسٹرڈ کیا جاسکتا ہے۔ طویل مدتی درخواست اکاؤنٹ کے طور پر جینس دستخط کرنے والی شناخت کا استعمال نہ کریں۔ پیدائش کے حقوق صرف پیدائش کے دوران لاگو ہوتے ہیں، اور پروڈکشن کلائنٹس کو اپنے اکاؤنٹس اور کردار کا استعمال کرنا چاہئے.
