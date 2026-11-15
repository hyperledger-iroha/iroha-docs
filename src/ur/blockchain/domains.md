---
translation_locale: ur
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ڈومینز {#domains}

ڈومینز نام والے نیم اسپیسز ہیں جو `World` میں رجسٹر ہوتے ہیں۔ موجودہ Iroha 3 ڈیٹا ماڈل میں ڈومین کی شناخت اس کی بنیادی ڈیٹا اسپیس کے ساتھ متعین ہوتی ہے، اس لیے کینونیکل شناخت کنندہ یہ ہے:

```text
domain.dataspace
```

مثلاً `payments.universal`، `universal` ڈیٹا اسپیس کے اندر `payments` ڈومین کا نام ہے۔

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Domain` میں شامل ہیں:

- `id`: ڈیٹا اسپیس سے مکمل طور پر متعین `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

ارادہ `payments.universal`، اس کی عددی ڈیٹا اسپیس، کینونیکل I105 مالک، لیز حاصل کرنے کی مدت، اور موجودہ پالیسی/ادائیگی کے تخمینے کی حفاظتی شرط متعین کرتا ہے۔ منصوبہ ساز اینڈ پوائنٹ `POST /v1/aliases/setup/plan` ہے؛ اس کا واپس کردہ منصوبہ چین، اختیار، حالت اور آخری وقت سے بندھا ہوتا ہے۔ ڈومین ہٹانے کے لیے اب بھی [`Unregister`](/ur/blockchain/instructions.md#un-register) استعمال ہوتا ہے۔

ڈومین بنانے یا ہٹانے کے لئے فعال رن ٹائم ویلیڈیٹر کے تحت مناسب ڈومین مینجمنٹ اجازت کی ضرورت ہوتی ہے۔ ڈومین میٹا ڈیٹا کو [`SetKeyValue` اور `RemoveKeyValue`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) کے ساتھ اپ ڈیٹ کیا جاسکتا ہے جب اتھارٹی کو اس ڈومین میں ترمیم کرنے کا اختیار حاصل ہو۔

## Taira پر آزمائیں {#try-it-on-taira}

عوامی Taira ٹیسٹ نیٹ ورک پر فی الحال نظر آنے والے ڈومینز کی فہرست دیں:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

عوامی لین کیٹلاگ کو ڈیٹا اسپیس کے عرفی ناموں سے ملائیں:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

جب ایپ کو جانچنا ہو کہ ڈومین موجود ہے یا نہیں تو پہلی کمانڈ استعمال کریں۔ کسی ڈیٹا اسپیس سے منسلک لینز، ہر لین کی عوامی یا محدود مرئیت، اور بنیادی لین کے مقابل اس کی ہم وقت سازی کی حیثیت دیکھنے کے لیے لین کیٹلاگ استعمال کریں۔

ڈومین کی ترتیب فیس ادا کرنے والی تحریری کارروائی ہے۔ Taira پر اسے آزمانے سے پہلے [Taira پر ٹیسٹ نیٹ XOR حاصل کریں](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) میں پیشگی تیاری والے فوسیٹ عمل سے دستخط کنندہ کو فنڈ کریں، پھر واضح فیس ادا کنندہ کے ساتھ منصوبہ لاگو کریں۔ CLI دستخط سے پہلے درست فیس معلوم کرتا ہے:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
