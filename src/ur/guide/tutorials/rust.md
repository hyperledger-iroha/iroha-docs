---
translation_locale: ur
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Rust {#rust}

Rust لاگو کرنا بنیادی کام کی جگہ میں رہتا ہے اور Iroha 3 کوڈ بیس کے ساتھ کام کرنے کا سب سے زیادہ براہ راست طریقہ ہے۔

## آپ کو کیا ملتا ہے {#what-you-get}

اس وقت اپ اسٹریم ریپوزٹری میں درج ذیل معلومات ہیں:

- `iroha` Rust کلائنٹ خانہ
- `iroha` CLI سب سے زیادہ مکمل ریفرنس کلائنٹ کے طور پر
- مشترکہ ڈیٹا ماڈل، کریپٹو اور Norito خانے جو SDK پرت کے ذریعہ استعمال ہوتے ہیں

## تجویز کردہ نقطہ آغاز {#recommended-starting-point}

منصوبے کی موجودہ حالت کے لئے، حوالہ CLI اور کام کی جگہ خود سے شروع کریں:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

رجسٹرڈ ڈیفالٹ کلائنٹ کی ترتیب کے ساتھ ریفرنس کلائنٹ چلائیں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## کوشش کریں Taira صرف پڑھنا {#try-taira-read-only}

اسی کام کی جگہ چیک آؤٹ سے، عوامی تشخیص کے معاون Taira کو آزمائیں:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

راستے کی سطح پر چیک کے لئے، براہ راست Torii کا استعمال کریں JSON API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` بنانے کے بعد وہی بائنری `iroha taira account` کے ذریعے اکاؤنٹ کو شامل اور فنڈ کر سکتی ہے اور Taira پر عام دستخط شدہ لیجر کمانڈز جمع کرا سکتی ہے۔ انہیں عام یونٹ ٹیسٹوں سے الگ رکھیں کیونکہ ان کے لیے فوسیٹ سے فنڈ شدہ اکاؤنٹ اور براہِ راست ٹیسٹ نیٹ کی دستیابی درکار ہوتی ہے۔

## Rust کلائنٹ کریٹ کا استعمال کرتے ہوئے {#using-the-rust-client-crate}

آپ کے نیٹ ورک کی طرف سے استعمال کیا جاتا Iroha Git نظر ثانی پن:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

اگر آپ کو عملی طور پر Rust سطحوں کے استعمال کے سب سے مکمل مثالوں کی ضرورت ہو تو ، چیک کریں:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

لیجر کے زیرِ انتظام ایسکرو ورک فلوز کے لیے [مقامی اثاثہ ایسکرو](/ur/blockchain/escrow.md#rust-sdk) ملاحظہ کریں۔ Rust ڈیٹا ماڈل اس وقت مارکیٹ پلیس ایسکرو، عمومی اثاثہ تالوں، مشروط ایسکرو، استفسارات اور واقعات کے لیے سب سے مکمل ٹائپ شدہ کوریج فراہم کرتا ہے۔

آپ کو ایک مقامی CLI مدد سنیپ شاٹ کی تجدید کر سکتے ہیں:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## نوٹ {#notes}

- CLI فی الحال خود مختار خانے دستاویزات کے مقابلے میں بہتر کوریج فراہم کرتا ہے۔
- آپریٹر سٹائل کے بہاؤ کے لئے، CLI دستاویزات سب سے زیادہ موجودہ ذریعہ ہے.
