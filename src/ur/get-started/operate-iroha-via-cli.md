---
translation_locale: ur
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 3 کے ذریعے CLI پر کام کریں {#operate-iroha-3-via-cli}

`iroha` بائنری Iroha 3 کے لئے کمانڈ لائن کلائنٹ ہے۔ اس کا استعمال لیجر کی حیثیت سے استفسار کرنے ، لین دین جمع کروانے اور آپریٹر اختتامی پوائنٹس کی جانچ پڑتال کرنے کے لئے کریں۔

## 1۔ ضروریات {#_1-prerequisites}

دستاویز میں درج ماخذ ورژن پر Iroha کی چیک آؤٹ شدہ کاپی سے، چار پیئرز والا مقامی نیٹ ورک بنائیں اور شروع کریں:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

نیچے دی گئی مثالیں اس کی تیار کردہ کلائنٹ ترتیب، `./localnet/client.toml`، استعمال کرتی ہیں۔

## بنیادی CLI سیٹ اپ۔ {#_2-basic-cli-setup}

سب سے اوپر سطح کی مدد دکھائیں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI مندرجہ ذیل اعلیٰ سطح کے کمانڈ گروپوں میں منظم ہے:

- `account`، اکاؤنٹ پڑھنے اور تبدیل کرنے کے لیے
- `explorer`، مشترک فلٹرز اور صفحہ بندی والی ایکسپلورر فیڈز کے لیے
- `tx`، لین دین کی حیثیت اور متعلقہ معاون کاموں کے لیے
- `ledger` لیجر پر پڑھنے اور لکھنے کے لئے
- `trigger`، ٹرگر پڑھنے، لکھنے اور چلانے کے لیے
- `ops` آپریٹرز کی تشخیص کے لئے
- `app` اپلی کیشن API کے معاونین کے لئے
- `contract`، معاہدے کی کالز، ویوز اور مقامی ڈیبگنگ کے لیے؛ تنصیب `kagami contract deploy` یا `musubi deploy` سے کریں
- `tools` تشخیصی اور ڈویلپر افادیتوں کے لئے
- `dataspace`، ڈیٹا اسپیس کی تعریف کا منصوبہ بنانے، اسے لاگو کرنے اور جانچنے کے لیے
- `taira`، Taira کی تشخیص اور اکاؤنٹ متعارف کرانے کے لیے
- `offline`، آف لائن انکوڈرز، رپورٹس اور تشخیص کے لیے
- `soracloud`، Soracloud ایپ پلیٹ فارم کے معاون کاموں کے لیے
- `sccp`، SORA Cross-Chain Protocol میں پڑھنے، منتقلی اور ثبوتوں کے لیے

لین دین بھیجنے والی ہر کمانڈ کو واضح فیس ادا کنندہ، مثلاً `--fee-payer authority`، درکار ہوتا ہے؛ CLI دستخط سے پہلے درست فیس معلوم کرتا ہے۔

`--output-format text` کو انسانی پڑھنے کے قابل آپریٹر کی پیداوار اور `--machine` کو سخت آٹومیشن موڈ کے لئے استعمال کریں۔

## 3۔ پبلک Taira ٹیسٹ نیٹ کی کوشش کریں۔ {#_3-try-the-public-taira-testnet}

آپ مقامی ہم منصب کو چلانے یا دستخط کرنے سے پہلے صرف پڑھنے کے لئے Taira چیک کی کوشش کرسکتے ہیں۔ یہ کمانڈ عوامی Torii JSON راستوں کا استعمال کرتے ہیں اور ٹیسٹ نیٹ XOR خرچ نہیں کرتے۔

چیک کریں Taira کی حیثیت:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

ان ڈومینز کی فہرست دیکھیں جو غیر مصدقہ قاری کو نظر آتے ہیں:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

چند اثاثوں کی تعریفیں اور ان کی موجودہ فراہمی درج کریں:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

اگر آپ کے پاس موجودہ `iroha` بائنری ہے، تو Taira تشخیصی مددگار چلائیں:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml` صرف تب بنائیں جب آپ دستخط شدہ کمانڈز آزمانے کے لیے تیار ہوں۔ ترتیب، فوسیٹ اور بنیادی جانچ کے عمل کے لیے [SORA Nexus ڈیٹا اسپیسز سے اتصال](/ur/get-started/sora-nexus-dataspaces.md) دیکھیں۔ جب تک اکاؤنٹ فوسیٹ کے فیس والے اثاثے سے فنڈ نہ ہو، Taira میں لکھنے کی کمانڈز نہ چلائیں۔

Taira CLI کی فیس ادا کرنے والی ہر مثال کے لیے [Taira پر ٹیسٹ نیٹ XOR حاصل کریں](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) میں پیشگی تیاری والے فوسیٹ عمل سے دستخط کنندہ کو فنڈ کریں، پھر بیلنس جانچیں:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

اگر فوسیٹ کا راستہ `502` لوٹائے تو انتظار کریں اور دوبارہ کوشش کریں۔ یہ عوامی ٹیسٹ نیٹ کی دستیابی کا مسئلہ ہے، اکاؤنٹ کی کلیدیں دوبارہ بنانے کا اشارہ نہیں۔

بیلنس نظر آنے کے بعد `--fee-payer authority` کے ساتھ تحریری کارروائیاں بھیجیں۔ CLI دستخط سے پہلے Taira کے فیس والے اثاثے میں درست فیس معلوم کرتا ہے:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4۔ بنیادی لیجر کمانڈز {#_4-basic-ledger-commands}

تمام ڈومینز درج کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

عام ڈومین کی تخلیق میں اعلاناتی عرفی منصوبہ ساز کا استعمال ہوتا ہے۔ `ledger domain` کمانڈ میں کوئی `register` ذیلی کمانڈ نہیں ہے۔ اپنی SDK یا آن بورڈنگ سروس کے ساتھ `docs.universal` کے لئے خفیہ فری `AliasSetupPlanRequestV1` نیت تیار کریں ، پھر اس کی منصوبہ بندی اور لاگو کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ارادہ ڈیٹا اسپیس ID، کینونیکل مالک اکاؤنٹ، لیز کی مدت اور موجودہ تخمینے کی حفاظتی شرط مقرر کرتا ہے۔ منصوبہ ساز موجودہ حالت کی تصدیق کرتا ہے اور بھیجنے کے لیے عین ایٹمی `EnsureAlias` منصوبہ واپس کرتا ہے۔ دوسرے نیٹ ورک سے حفاظتی قدریں دستی طور پر نقل نہ کریں۔

ایک سادہ پینگ لین دین بھیجیں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

کسی حالیہ بلاک کو پڑھیں یا بلاک ایونٹس پر سبسکرائب کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5۔ آپریٹر کمانڈز {#_5-operator-commands}

اتفاقِ رائے کے آپریٹر کی کمانڈز کے لیے اجازت کی فہرست میں موجود رن ٹائم کلید لازم ہے۔ اسے `client.toml` سے باہر رکھیں اور صرف مالک کی رسائی والی فائل کا مطلق راستہ دیں:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

غیر مجاز قطار، پائپ لائن، انتخابی اور لین تشخیص:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

کمیٹ شدہ اتفاقِ رائے کی لینز اور اس نوڈ کی مثالوں کی حیثیت:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

چین پر اتفاق رائے کے پیرامیٹرز:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6۔ آگے کہاں جانا ہے؟ {#_6-where-to-go-next}

- [SDK ٹیوٹوریلز](/ur/guide/tutorials/)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
- [Iroha بائنریوں کے ساتھ کام کرنا](/ur/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

ماخذ کی ورکنگ کاپی سے مدد کا مکمل Markdown اسنیپ شاٹ پرنٹ کرنے کے لیے چلائیں:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
