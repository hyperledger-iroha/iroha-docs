---
translation_locale: ur
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اکاؤنٹس اور عرفی نام {#accounts-and-aliases}

## نتیجہ {#outcome}

ڈومینلیس کینونیکل کے ساتھ محفوظ کام کریں I105 اکاؤنٹ IDs اور الگ سے منسلک انسان پڑھنے کے قابل ناموں جیسے: `treasury@payments.universal`. آپ معائنہ کریں گے Taira اکاؤنٹس، آپ کی اپنی کینونیکل حاصل ID, اور روٹنگ سیاق و سباق کو شناخت کے ساتھ الجھائے بغیر مستعار حل کریں.

## لازمی شرائط {#prerequisites}

- `curl`, `jq`, Python 3.11 یا اس سے زیادہ، اور موجودہ `iroha` CLI.
- ایک `taira.client.toml` سے [اپنے اکاؤنٹ کا معائنہ کرتے وقت Taira](./connect-to-taira.md) سے رابطہ کریں.
- ایک اکاؤنٹ جو Taira فوسیٹ یا نیٹ ورک کے زیر انتظام آن بورڈنگ پاتھ کے ذریعے محفوظ کیا گیا ہے اس سے پہلے کہ کسی اکاؤنٹ کی مخصوص پڑھنے کو کامیاب ہونے کا امکان ہو۔

## قدم {#steps}

### Taira پر کینونیکل اکاؤنٹس کا معائنہ کریں {#_1-inspect-canonical-accounts-on-taira}

پبلک اکاؤنٹس کی فہرست میں ہمیشہ کینونیکل I105 IDs لوٹایا جاتا ہے۔ ایک بنیادی عرف اختیاری ہے اور علیحدہ علیحدہ اطلاع دی جاتی ہے۔

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` سے حاصل ہونے والا ID سخت اکاؤنٹ فیلڈز کے لیے درست ہے۔ اس کے ساتھ ڈومین منسلک نہ کریں۔ `.primary_alias` سے حاصل ہونے والا alias صارف کے لیے lookup key ہے، کوئی دوسری کینونیکل شناخت نہیں۔

### اپنے Taira I105 ID کو حاصل کریں اور اسے معمول پر لائیں۔ {#_2-derive-and-normalize-your-taira-i105-id}

صرف عوامی کلید کو مقامی ترتیب سے پڑھیں۔ ایک ہی عوامی کلید مختلف عوامی نیٹ ورک پروفائلز کے لئے مختلف طریقے سے کوڈ کی جاتی ہے ، لہذا صریح طور پر `taira` کا انتخاب کریں۔

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

معیاری قدر `TAIRA_ACCOUNT_ID` کے ساتھ یکساں ہونی چاہئے۔ TOML فائل میں `[account].domain` کی ترتیب `wonderland.universal` ہوسکتی ہے ، لیکن یہ قیمت صرف روٹنگ اور عرفی سیاق و سباق پر اثر انداز ہوتی ہے۔

### 3۔ اکاؤنٹ اور اس کے اثاثوں کو پڑھیں۔ {#_3-read-the-account-and-its-assets}

اکاؤنٹ کو ذخیرہ کرنے کے بعد ، براہ راست اس سے استفسار کریں اور حد بندی شدہ اثاثہ صفحے کی فہرست دیں۔ URL - اسے راستے میں استعمال کرنے سے پہلے I105 قدر کو کوڈ کریں۔

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4۔ اکاؤنٹ سے منسلک عرفی نام تلاش کریں {#_4-look-up-aliases-bound-to-the-account}

ریورس ریزولور ایک عین مطابق کینونیکل اکاؤنٹ ID کو قبول کرتا ہے۔ عوامی ڈیٹا بیس صفوں کو درخواست دستخط ہیڈر کے بغیر پڑھا جاسکتا ہے۔ محدود ڈیٹا بیسوں میں مجاز دستخط شدہ درخواست کی ضرورت ہوتی ہے۔

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` درست ہے: ایک اکاؤنٹ کو کوئی عرفی نام کی ضرورت نہیں ہے۔ جب پابندیت موجود ہو تو ، اس کے عین مطابق مکمل طور پر اہل عرفی نام کو حل کریں اور واپس آنے والے اکاؤنٹ ID کا موازنہ کریں:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning اجازت کی حد

Taira فوسیٹ اپنے درخواست دہندگان کے اکاؤنٹ کو فراہم کرسکتا ہے، لیکن یہ عام اکاؤنٹ رجسٹریشن یا عرفی انتظام کی اجازت نہیں دیتا۔ کسی دوسرے اکاؤنٹ کو رجسٹر کرنے کے لئے فعال تصدیق کنندہ کے تحت `CanRegisterAccount` کی ضرورت ہوتی ہے۔ اکاؤنٹ کے عرفی ناموں میں عام طور پر ایک فعال SNS لیزنگ معاہدہ اور مناسب عرفی اجازت کی بھی ضرورت ہوتی ہے۔ کنٹرول شدہ آن بورڈنگ / عرفی منصوبہ ساز کا استعمال کریں ، یا تیار کردہ مقامی نیٹ ورک کے ساتھ رجسٹریشن کا تجربہ کریں۔

:::

ایک مقامی نیٹ ورک پر، ایک بار جب محفوظ دستخط فراہم کرنے والے مرحلے نے ایک نیا کینونیکل `NEW_ACCOUNT_ID` برآمد کیا ہے تو، رجسٹریشن کی سطح:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

متعلقہ نجی کلید کو دستاویزات یا ایپلی کیشنز کے ذخیرے سے باہر تخلیق اور اسٹور کریں۔ ID رجسٹر کرنا جس کا کنٹرولر کلید پھینک دیا گیا تھا ایک غیر استعمال شدہ اکاؤنٹ بناتا ہے۔

## تصدیق کریں {#verify}

ثابت کریں کہ config عوامی کلید، I105 کوڈنگ، اور بائنڈنگ عرفات سبھی ایک ہی کینونیکل اکاؤنٹ ID پر ملتے ہیں:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

کینونیکل اکاؤنٹ IDs ذخیرہ کریں۔ دستخط ، اجازتوں اور ٹرانزیکشن ہدایات کے لئے کینونیکل IDs کا استعمال کریں۔ ایپلی کیشن کی حد پر ایک عرفی حل کریں۔ آپریشن کے لئے استعمال ہونے والے کینونیکل اکاؤنٹس ID کو برقرار رکھیں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- تجزیہ یا پیش وضاحتی غلطی کا مطلب عام طور پر ایک مختلف نیٹ ورک پروفائل کے لئے ایڈریس کوڈ کیا گیا تھا. `--profile taira` کے ساتھ معمول بنائیں اور عدم مطابقت کو مسترد کریں۔
- ایک اکاؤنٹ `404` ایک فوسیٹ `202` کے بعد پھیلاؤ میں تاخیر ہوسکتی ہے. لکھنے بھیجنے سے پہلے اکاؤنٹ یا فنڈ شدہ اثاثہ کا سروے کریں.
- `total: 0` سے ریورس ریزولر کا مطلب یہ ہے کہ کوئی مشاہدہ نام نہیں ہے؛ یہ اکاؤنٹ کی تلاش میں خرابی نہیں ہے۔
- `401` یا `403` ایک عرفی راستہ سے محدود ڈیٹا اسپیس یا ناکافی درست حل کی اجازت کا اشارہ کرتا ہے۔ واپسی کے طور پر وسیع سابقہ تلاش کا استعمال نہ کریں۔
- پڑھنے کے قابل `name@domain.dataspace` قدر ہر جگہ قبول نہیں کی جاتی ہے جہاں کینیکل I105 ID کی ضرورت ہوتی ہے۔ اسے پہلے حل کریں۔
- اگر مقامی اکاؤنٹ کی رجسٹریشن کامیاب ہوتی ہے لیکن Taira اسے مسترد کرتا ہے تو ، فرق اجازت ہے۔ `CanRegisterAccount` حاصل کریں؛ تصدیق سے بچنے کے لئے اکاؤنٹ ID کو تبدیل نہ کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈل کمیٹ پر کینونیکل اکاؤنٹ ایڈریس لاگو کرنا ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [پِنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs) میں اکاؤنٹ اور عرفی Torii ٹیسٹ
- [اکاؤنٹس](/ur/blockchain/accounts.md)
- [ڈیٹا ماڈل عرفی نام ](/ur/blockchain/data-model.md#aliases)
- [ناموں کے کنونشنز](/ur/reference/naming.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
