---
translation_locale: ur
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# میٹا ڈیٹا {#metadata}

## نتیجہ {#outcome}

Taira پر میٹا ڈیٹا پڑھیں، ایک اکاؤنٹ کے میٹا ڈیٹا کی قیمت کو واضح طور پر فیس ادا کرنے والی ٹرانزیکشن کے ساتھ ترتیب دیں اور اس کی تصدیق کریں، پھر دوبارہ قدر کو ہٹائیں۔ آپ لیجر آبجیکٹ میٹا ڈیٹا کو ٹرانزیکtion فیس میٹا ڈیٹا سے الگ رکھیں گے۔

## لازمی شرائط {#prerequisites}

- `curl`, `jq`, Python 3.11 یا اس سے زیادہ، اور موجودہ `iroha` CLI.
- [سے Taira](./connect-to-taira.md) سے منسلک فنڈ شدہ `taira.client.toml` اور `taira.tx-metadata.json`۔
- ہدف اکاؤنٹ کے میٹا ڈیٹا پر اتھارٹی۔ مثال خود تشکیل شدہ اتھارٹی کو نشانہ بناتی ہے۔ ایک اور اکاؤنٹ کو عین اجازت کی ضرورت ہوتی ہے۔

## قدم {#steps}

### 1۔ بغیر دستخط کیے میٹا ڈیٹا پڑھیں {#_1-read-metadata-without-a-signer}

میٹا ڈیٹا `Name` سے JSON نقشہ تک چیک کیا جاتا ہے۔ خالی نقشے اور خالی فلٹرڈ آؤٹ پٹ درست نتائج ہیں.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

چھوٹے وضاحتی یا انڈیکسنگ فیلڈز کے لئے میٹا ڈیٹا کا استعمال کریں۔ بڑے مفید بوجھ کو لیجر سے باہر رکھیں اور اس کی بجائے ایک ڈائجسٹ ، URI ، یا SoraFS حوالہ محفوظ کریں۔

### 2۔ ہدف کے حساب سے اخذ کریں {#_2-derive-the-target-account}

Taira ترتیب سے صرف عوامی کلید کو پڑھیں اور اسے کینونیکل ڈومینلیس I105 فارم میں تبدیل کریں۔

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### ایک JSON قدر مقرر کریں {#_3-set-one-json-value}

معیاری ان پٹ سے پڑھا جانے والا JSON اکاؤنٹ کی `cookbook_profile` قیمت بن جاتا ہے۔ اس کے برعکس ، `--metadata ./taira.tx-metadata.json` ٹرانزیکشن لفافے میں فیس فیلڈز منسلک کرتا ہے۔ دونوں نقشوں کے مختلف اہداف اور مقاصد ہیں۔

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI ڈیفالٹ کے طور پر فیس کا حوالہ دیتا ہے ، دستخط کرتا ہے ، جمع کراتا ہے اور انتظار کرتا ہے۔ جب اگلی کارروائی اس قدر پر منحصر ہوتی ہے تو `--no-wait` شامل نہ کریں۔

::: warning اجازت کی حد

فعال تصدیق کنندہ فیصلہ کرتا ہے کہ کون ہر اعتراض کو تبدیل کرسکتا ہے۔ ایک اور اکاؤنٹ کی تازہ کاری کے لئے عام طور پر ضرورت ہوتی ہے `CanModifyAccountMetadata`; ڈومینز، اثاثوں کی تعریفیں، NFTs, اور ٹرگرز کے پاس اپنے ہدف مخصوص میٹا ڈیٹا کی اجازت ہے. Taira مطلوبہ اختیار فراہم نہیں کیا ہے، اسی اکاؤنٹ کے ساتھ کمانڈ چلاتا ہے `./localnet/client.toml`, پیدا کردہ لوکل نیٹ اتھارٹی کی کینونیکل کو تبدیل کریں I105 ID, اور خارج کریں Taira فیس میٹا ڈیٹا فائل. واضح مقامی فیس ادا کرنے والے کا انتخاب رکھیں.

:::

### 4۔ چابی نکالیں۔ {#_4-remove-the-key}

پہلے مقررہ قدر پڑھیں، پھر علیحدہ ہٹانے کی ٹرانزیکشن جمع کروائیں۔

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python ایپلی کیشنز کے لئے ، مماثل ٹائپڈ بلڈرز ہیں `Instruction.set_account_key_value` اور `Instruction.remove_account_key_value`؛ انہیں ٹرانزیکشن میٹا ڈیٹا اور انتظار کرنے والا مددگار کے ساتھ جمع کروائیں۔ [Python ٹیوٹوریل ](/ur/guide/tutorials/python.md#shared-setup).

## تصدیق کریں {#verify}

مقرر ٹرانزیکشن کے بعد، `meta get` کو `version: 1` کے ساتھ اعتراض واپس کرنا ہوگا. ہٹانے کے بعد، براہ راست تلاش کسی بھی قدر کو واپس نہیں کرنا چاہئے:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

علیحدہ اکاؤنٹ پڑھنے سے ایک لاپتہ میٹا ڈیٹا کلید کو نیٹ ورک یا اکاؤنٹ کی خرابی سے ممتاز کیا جاتا ہے۔ پیداوار کا کوڈ اس کی ترتیب کے بعد پوری JSON قدر کی تصدیق بھی کرنا چاہئے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- معیاری ان پٹ میں ایک درست JSON قدر شامل ہونی چاہئے۔ سٹرنگز کو JSON قیمتوں کا تعین کرنے کی ضرورت ہے۔ اشیاء اور صفیں اچھی طرح سے تشکیل شدہ ہونی چاہئیں۔
- میٹا ڈیٹا چابیاں `Name` اقدار ہیں اور تجزیہ کرنے کے بعد کیس حساس ہیں۔ ہر شیما کی تبدیلی کے لئے ورژن شدہ چابیاں بنانے کے بجائے ایک مستحکم کلیدی الفاظ کو برقرار رکھیں.
- `--metadata` ٹرانزیکشن میٹا ڈیٹا ہے؛ یہ لیجر آبجیکٹ میٹا ڈیٹا مقرر نہیں کرتا ہے۔ اس کے لئے ادارے کی `meta set` ذیلی کمانڈ کا استعمال کریں۔
- ایک کامیاب جمع کرانے کے بعد ایک پرانی پڑھنے پھیلاؤ میں تاخیر کا سبب بن سکتی ہے۔ لاگو حتمی ہونے کا انتظار کریں اور دوبارہ جمع کرنے سے پہلے استفسار کو دوبارہ کوشش کریں۔
- اجازت سے انکار ہدف کے اعتراض اور اختیار کی حد کی نشاندہی کرتا ہے۔ مقامی طور پر دوبارہ مشق کریں یا عین مطابق ٹوکن کی درخواست کریں۔ رسائی کنٹرول سے بچنے کے لئے نجی ایپلیکیشن ڈیٹا کو عوامی میٹا ڈیٹا فیلڈ میں منتقل نہ کریں.
- کبھی بھی میٹا ڈیٹا میں نجی چابیاں، خام ذاتی شناخت کنندہ، رسائی ٹوکن یا بڑے دستاویزات کو ذخیرہ نہ کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs) پر میٹا ڈیٹا query انٹیگریشن ٹیسٹ۔
- [Python SDK ٹرانزیکشن بلڈرز پر مقررہ کمیٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)۔
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [میٹا ڈیٹا اور لیجر اسٹوریج کے اختیارات ](/ur/guide/configure/metadata-and-store-assets.md)
- [ہدایات کا حوالہ](/ur/reference/instructions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
