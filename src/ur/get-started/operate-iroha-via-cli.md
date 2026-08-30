---
translation_locale: ur
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 0a0a0735015dee015da76d5a9f5d174f8ae8b2ad67ff8924d9596850a33fc1c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 کے ذریعے CLI پر کام کریں {#operate-iroha-3-via-cli}

`iroha` بائنری Iroha 3 کے لئے کمانڈ لائن کلائنٹ ہے۔ اس کا استعمال لیجر کی حیثیت سے استفسار کرنے ، لین دین جمع کروانے اور آپریٹر اختتامی پوائنٹس کی جانچ پڑتال کرنے کے لئے کریں۔

## 1۔ ضروریات {#_1-prerequisites}

سب سے پہلے مقامی نیٹ ورک شروع کریں:

- [لانچنگ Iroha 3](./launch-iroha.md)

مندرجہ ذیل مثالیں [ لانچ Iroha 3](./launch-iroha.md) میں تخلیق کردہ لوکل نیٹ ورک سے پیدا کردہ کلائنٹ ترتیب پر فرض کرتی ہیں:

```bash
./localnet/client.toml
```

## بنیادی CLI سیٹ اپ۔ {#_2-basic-cli-setup}

سب سے اوپر سطح کی مدد دکھائیں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI مندرجہ ذیل اعلیٰ سطح کے کمانڈ گروپوں میں منظم ہے:

- `account` اکاؤنٹس پر مبنی شارٹ کٹ کے لئے
- `tx` لین دین کی سطح پر معاونین کے لئے
- `ledger` لیجر پر پڑھنے اور لکھنے کے لئے
- `ops` آپریٹرز کی تشخیص کے لئے
- `app` اپلی کیشن API کے معاونین کے لئے
- `contract` معاہدے کی تعیناتی اور کالز کے لئے
- `tools` تشخیصی اور ڈویلپر افادیتوں کے لئے
- `taira` کے لئے Taira اور Nexus پر مبنی ورک فلوز

`ledger` گروپ میں ڈومین مخصوص ٹرانزیکشن ہیلپرز بھی شامل ہیں جیسے کہ `ledger transaction`.

`--output-format text` کو انسانی پڑھنے کے قابل آپریٹر کی پیداوار اور `--machine` کو سخت آٹومیشن موڈ کے لئے استعمال کریں۔

## 3۔ پبلک Taira ٹیسٹ نیٹ کی کوشش کریں۔ {#_3-try-the-public-taira-testnet}

آپ مقامی ہم منصب کو چلانے یا دستخط کرنے سے پہلے صرف پڑھنے کے لئے Taira چیک کی کوشش کرسکتے ہیں۔ یہ کمانڈ عوامی Torii JSON راستوں کا استعمال کرتے ہیں اور ٹیسٹ نیٹ XOR خرچ نہیں کرتے۔

چیک کریں Taira کی حیثیت:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` ڈیٹا اسپیس میں عوامی ڈومینز درج کریں:

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

تخلیق کریں `taira.client.toml` صرف اس وقت جب آپ دستخط شدہ احکامات کی جانچ کرنے کے لئے تیار ہیں. [سے رابطہ کریں SORA Nexus ڈیٹا بیس](/ur/get-started/sora-nexus-dataspaces.md) config کے لئے، نل، اور کینری بہاؤ. Taira جب تک کہ اکاؤنٹ کو نل فیس اثاثہ سے فنڈ نہیں کیا جاتا۔

کسی بھی فیس کی ادائیگی کے لئے Taira CLI مثال کے طور پر، نل کی مدد سے بچانے [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, پھر دعویٰ ٹیسٹ نیٹ XOR پہلا:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

اگر نل پزل یا دعوے کا راستہ `502` لوٹتا ہے تو ، انتظار کریں اور دوبارہ کوشش کریں۔ یہ عوامی ٹیسٹ نیٹ کی دستیابی کا مسئلہ ہے ، اکاؤنٹ کی چابیاں بحال کرنے کے لئے ایک اشارہ نہیں ہے۔

بیلنس دیکھنے کے بعد، فیس اثاثہ میٹا ڈیٹا لکھنے کے لئے منسلک کریں:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4۔ بنیادی لیجر کمانڈز {#_4-basic-ledger-commands}

تمام ڈومینز درج کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

عام ڈومین کی تخلیق میں اعلاناتی عرفی منصوبہ ساز کا استعمال ہوتا ہے۔ `ledger domain` کمانڈ میں کوئی `register` ذیلی کمانڈ نہیں ہے۔ اپنی SDK یا آن بورڈنگ سروس کے ساتھ `docs.universal` کے لئے خفیہ فری `AliasSetupPlanRequestV1` نیت تیار کریں ، پھر اس کی منصوبہ بندی اور لاگو کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

انٹینٹ پینز ڈیٹا اسپیس ID ، کینونیکل مالک اکاؤنٹ ، لیز ٹرم ، اور موجودہ کوٹیشن گارڈ۔ منصوبہ ساز زندہ حالت کی تصدیق کرتا ہے اور جمع کرنے کے لئے عین مطابق ایٹمی `EnsureAlias` منصوبہ واپس کرتا ہے۔ کسی دوسرے نیٹ ورک سے گارڈ ویلیوز کی دستی کاپی نہ کریں.

ایک سادہ پینگ لین دین بھیجیں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

کسی حالیہ بلاک کو پڑھیں یا بلاک ایونٹس پر سبسکرائب کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5۔ آپریٹر کمانڈز {#_5-operator-commands}

اتفاق رائے کی حیثیت:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

فی مرحلہ تاخیر فوری شاٹ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

دستیابی، جمع کرنے والا، RBC بیکلاگ، اور VRF سنیپ شاٹ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

چین پر اتفاق رائے کے پیرامیٹرز:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6۔ آگے کہاں جانا ہے؟ {#_6-where-to-go-next}

- [SDK ٹیوٹوریلز](/ur/guide/tutorials/)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
- [Iroha بائنریوں کے ساتھ کام کرنا](/ur/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

ماخذ چیک آؤٹ سے مکمل مارک ڈاؤن امدادی سنیپ شاٹ کو بازیافت کرنے کے لئے، چلائیں:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
