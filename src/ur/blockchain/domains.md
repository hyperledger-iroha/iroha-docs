---
translation_locale: ur
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ڈومینز {#domains}

ڈومینز کو `World` میں رجسٹرڈ ناموں کی جگہ کا نام دیا جاتا ہے۔ موجودہ Iroha 3 ڈیٹا ماڈل میں ایک ڈومین کو اس کے والدین ڈیٹا اسپیس کے ذریعہ اہل بنایا گیا ہے ، لہذا کینونیکل شناخت کنندہ یہ ہے:

```text
domain.dataspace
```

مثال کے طور پر، `payments.universal` `payments` ڈومین کا نام `universal` ڈیٹا اسپیس کے اندر.

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Domain` میں شامل ہیں:

- `id`: ڈیٹا اسپیس کے لئے اہل `DomainId`
- `logo`: ایک ڈومین لوگو کے لئے اختیاری `SoraFS` URI
- `metadata`: تعصبی کلیدی قدر میٹا ڈیٹا۔
- `owned_by`: اکاؤنٹ جو ڈومین کا مالک ہے، عام طور پر اس اکاؤنٹ جس نے اسے رجسٹر کیا

ایک ڈومین کی حقیقت بنانے کے لئے استعمال کیا بوٹسٹریپ payload ہے `NewDomain`. یہ لے جاتا ہے `id`, اختیاری `logo`, اور ابتدائی `metadata`. رن ٹائم بھرتا ہے `owned_by` حکام کی طرف سے. عام گاہکوں کو براہ راست اس مفید بوجھ پیش نہیں کرتے ہیں.

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

ارادے میں `payments.universal` ، اس کی عددی ڈیٹا اسپیس ، کینونیکل I105 مالک ، لیز کے حصول کی مدت ، اور موجودہ پالیسی / ادائیگی کوٹ گارڈ کی نشاندہی کی گئی ہے۔ منصوبہ ساز کا اختتامی نقطہ `POST /v1/aliases/setup/plan` ہے؛ اس کا واپسی والا منصوبہ سلسلہ ، اتھارٹی ، ریاست اور آخری تاریخ پر پابند ہے۔ ڈومین ہٹانا اب بھی استعمال کرتا ہے [`Unregister`](/ur/blockchain/instructions.md#un-register).

ڈومین بنانے یا ہٹانے کے لئے فعال رن ٹائم ویلیڈیٹر کے تحت مناسب ڈومین مینجمنٹ اجازت کی ضرورت ہوتی ہے۔ ڈومین میٹا ڈیٹا کو [`SetKeyValue` اور `RemoveKeyValue`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) کے ساتھ اپ ڈیٹ کیا جاسکتا ہے جب اتھارٹی کو اس ڈومین میں ترمیم کرنے کا اختیار حاصل ہو۔

## Taira پر آزمائیں {#try-it-on-taira}

عوامی Taira ٹیسٹ نیٹ ورک پر فی الحال نظر آنے والے ڈومینز کی فہرست دیں:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

پبلک لین کیٹلاگ کا نقشہ واپس ڈیٹا اسپیس کے ناموں میں:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

پہلا کمانڈ استعمال کریں جب کسی ایپ کو یہ چیک کرنے کی ضرورت ہو کہ آیا ڈومین موجود ہے یا نہیں۔ لین کیٹلاگ کا استعمال کریں جب آپ کو اس بات کی تصدیق کرنے کی ضرورت ہو۔ ڈیٹا اسپیس پبلک ، محدود یا بنیادی لین کے پیچھے پیچھے ہے۔

ڈومین سیٹ اپ ایک فیس ادا کرنے کی تحریر ہے. Taira, سے نل کے مددگار کو بچانے [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, دستخط کنندہ کو عوامی نل کے ذریعے فنڈ دیں ، اور فیس میٹا ڈیٹا شامل کریں:

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

ڈومینز کو گروپ لجر اشیاء اور ڈومین سکپڈ ڈیٹا کے لئے ایک نام کی جگہ فراہم کرتے ہیں۔ اثاثہ تعریفیں ڈومین کے اہل شناختی کاروں کا استعمال کرتی ہیں ، اور استفسارات ڈومینوں کی فہرست یا کسی ڈومین پر سکپڈ اشیاء تلاش کرسکتی ہیں۔ اکاؤنٹ خود موجودہ ڈیٹا ماڈل میں ڈومینلیس ہیں، لیکن اکاؤنٹس ڈومینز کے مالک ہوسکتے ہیں اور ایسے اثاثے رکھ سکتے ہیں جن کی تعریفیں ڈومینس کے تحت رہتی ہیں۔

یہ بھی ملاحظہ کریں:

- [دنیا](/ur/blockchain/world.md)
- [اثاثہ جات](/ur/blockchain/assets.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [نامزدگی کے قواعد](/ur/reference/naming.md)
