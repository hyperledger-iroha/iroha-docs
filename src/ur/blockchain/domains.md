---
translation_locale: ur
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ڈومینز {#domains}

ڈومینز کو `World` میں رجسٹرڈ ناموں کی جگہ کا نام دیا جاتا ہے۔ موجودہ Iroha 3 ڈیٹا ماڈل میں ایک ڈومین کو اس کے والدین ڈیٹا اسپیس کے ذریعہ اہل بنایا گیا ہے ، لہذا کینونیکل شناخت کنندہ یہ ہے:

```text
domain.dataspace
```

مثال کے طور پر، `payments.universal` `universal` ڈیٹا اسپیس کے اندر `payments` ڈومین کا نام دیتا ہے۔

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Domain` میں شامل ہیں:

- `id`: ڈیٹا اسپیس کے لئے اہل `DomainId`
- `logo`: ایک ڈومین لوگو کے لئے اختیاری `SoraFS` URI
- `metadata`: تعمیری کلیدی قدر میٹا ڈیٹا۔
- `owned_by`: اکاؤنٹ جو ڈومین کا مالک ہے، عام طور پر اس اکاؤنٹ جس نے اسے رجسٹر کیا

ایک ڈومین کی حقیقت بنانے کے لئے استعمال کیا بوٹسٹریپ payload ہے `NewDomain`. یہ لے جاتا ہے `id`, اختیاری `logo`, اور ابتدائی `metadata`. رن ٹائم بھرتا ہے `owned_by` مجاز اکاؤنٹس کی طرف سے. عام گاہکوں کو براہ راست اس پے لوڈ پیش نہیں کرتے ہیں.

## رجسٹریشن {#registration}

عام ڈومین تخلیق اعلاناتی عرف سیٹ اپ فلو کا استعمال کرتی ہے۔ اس سے SNS لیز ، مالک کی صلاحیتوں ، کوٹ گارڈ ، اور ایک ایٹمی `EnsureAlias` ٹرانزیکشن میں ڈومین قطار برقرار رہتی ہے۔ `Register::Domain` ابتداء / بوٹسٹریپ سطح رہتا ہے ، اور `ledger domain` کمانڈ میں کوئی `register` ذیلی کمانڈ نہیں ہوتا ہے۔

SDK یا آن بورڈنگ سروس کے ساتھ ایک خفیہ مفت `AliasSetupPlanRequestV1` نیت بنائیں، پھر CLI کو زندہ حالت کے مقابلے میں اس کی منصوبہ بندی کرنے دیں اور یہ عین مطابق منصوبہ پیش کریں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ارادے `payments.universal` کی نشاندہی کرتا ہے، اس کے عددی ڈیٹا اسپیس، کینونیکل I105 مالک، لیز حاصل کرنے کی مدت، اور موجودہ پالیسی / ادائیگی کوٹ گارڈ. منصوبہ ساز کے اختتامی نقطہ `POST /v1/aliases/setup/plan` ہے۔ اس کا واپس آنے والا منصوبہ سلسلہ ، اتھارٹی ، ریاست اور آخری تاریخ پر پابند ہے۔ ڈومین ہٹانا اب بھی استعمال کرتا ہے [`Unregister`](/ur/blockchain/instructions.md#un-register).

ڈومین بنانے یا ہٹانے کے لئے فعال رن ٹائم ویلیڈیٹر کے تحت مناسب ڈومین مینجمنٹ اجازت کی ضرورت ہوتی ہے۔ ڈومین میٹا ڈیٹا کو [`SetKeyValue` اور `RemoveKeyValue`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) کے ساتھ اپ ڈیٹ کیا جاسکتا ہے جب اتھارٹی کو اس ڈومین میں ترمیم کرنے کا اختیار حاصل ہو۔

## Taira پر آزمائیں {#try-it-on-taira}

عوامی Taira ٹیسٹ نیٹ ورک پر فی الحال نظر آنے والے ڈومینز کی فہرست دیں:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

پبلک لین کیٹلاگ کا نقشہ واپس ڈیٹا اسپیس کے ناموں میں:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

پہلا کمانڈ استعمال کریں جب کسی ایپ کو یہ چیک کرنے کی ضرورت ہو کہ آیا ڈومین موجود ہے یا نہیں۔ لین کیٹلاگ کا استعمال کریں جب آپ کو اس بات کی تصدیق کرنے کی ضرورت ہو۔ ڈیٹا اسپیس پبلک ، محدود یا بنیادی لین کے پیچھے پیچھے ہے۔

Domain setup فیس ادا کرنے والی write ہے۔ اسے Taira پر آزمانے سے پہلے [Taira پر Testnet XOR حاصل کریں](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) سے faucet helper کو `taira_faucet_claim.py` کے نام سے محفوظ کریں، public faucet کے ذریعے signer کو فنڈ دیں، اور fee metadata منسلک کریں:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

بار بار ٹیسٹ نیٹ ورک چلانے پر ایک منفرد ڈومین نام کے لئے ارادے کی تعمیر کریں ، اور Taira کی موجودہ پالیسی اور فیس اثاثہ کوٹیشن گارڈ کا استعمال کریں۔ لوکل نیٹ یا Minamoto کے لئے تیار کردہ منصوبہ دوبارہ استعمال نہ کریں۔

## دیگر اداروں کے ساتھ تعلقات {#relationship-to-other-entities}

domains، ledger objects کو گروپ کرتے اور domain-scoped data کے لیے namespace فراہم کرتے ہیں۔ asset definitions، domain-qualified identifiers استعمال کرتی ہیں، اور استفسارات domains کی فہرست دے سکتے یا کسی domain تک محدود objects تلاش کر سکتے ہیں۔ موجودہ data model میں accounts خود domainless ہیں، لیکن accounts domains کے مالک اور ایسے assets رکھ سکتے ہیں جن کی definitions domains کے تحت موجود ہوں۔

یہ بھی ملاحظہ کریں:

- [دنیا](/ur/blockchain/world.md)
- [اثاثہ جات](/ur/blockchain/assets.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [نامزدگی کے قواعد](/ur/reference/naming.md)
