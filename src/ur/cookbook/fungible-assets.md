---
translation_locale: ur
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# فنگبل اثاثے {#fungible-assets}

## نتیجہ {#outcome}

براہ راست Taira اثاثہ تعریفوں کی جانچ پڑتال کریں اور ایک مقامی نیٹ ورک پر پیدا کردہ رجسٹر، منٹ، منتقلی، جلنے، اور توازن کی تصدیق کے بہاؤ کو مکمل کریں. نسخہ استعمال کرتا ہے canonical unprefixed Base58 asset-definition IDs، ڈومین کے لئے اہل ناموں، ڈومينلیس I105 اکاؤنٹ IDs، اور صریح فیس کی ادائیگی.

## لازمی شرائط {#prerequisites}

- `curl` ، `jq`، Python 3.11 یا بعد میں، Node.js 24 اور موجودہ `iroha` CLI.
- Taira تک رسائی صرف پڑھنے کے لئے۔
- لکھنے کے ذریعے چلنے کے لئے، ایک پیدا مقامی نیٹ ورک سے [لانچ Iroha](/ur/get-started/launch-iroha.md), کے ساتھ `./localnet/client.toml` اور Torii پر `http://127.0.0.1:8080`.

## قدم {#steps}

### بغیر دستخط کیے Taira کی تعریفوں کا معائنہ کریں۔ {#_1-inspect-taira-definitions-without-a-signer}

اثاثہ تعریفیں ایک غیر شفاف Base58 ID ، ڈسپلے کا نام، منتاbility پالیسی، عددی پیمانے، اختیاری عرفات، مالک، اور مجموعی مقدار. کنکریٹ بیلنس میں اس کے ہولڈر اکاؤنٹ اور اختیاری ڈیٹا اسپیس کی گنجائش بھی شامل ہے۔

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript فارم کو `node taira-assets.mjs` کے ساتھ چلائیں۔ عوامی اثاثہ IDs خالی بیس 58 اقدار ہیں؛ ایک قابل پڑھنے والی قدر جیسے `cookbook_credit#wonderland.universal` ایک عرفی ہے جو ان میں سے کسی ایک پر حل ہوتا ہے IDs.

### مقامی حکام اور منزل کی تیاری کریں {#_2-prepare-the-local-authority-and-destination}

تخلیق کردہ ترتیب میں عوامی کلید سے مقامی حکام کو نکالیں اور وصول کنندہ کے طور پر ایک اور رجسٹرڈ اکاؤنٹ منتخب کریں۔ کوئی نجی کلید طباعت نہیں کی جاتی ہے۔

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3 ۔ عددی تعبیر درج کریں۔ {#_3-register-a-numeric-definition}

یہ صرف مقامی ID ایک درست غیر مقررہ Base58 اثاثہ تعریف ایڈریس ہے. عرفی انسانی پڑھنے کے قابل `domain.dataspace` پروجیکشن فراہم کرتا ہے۔ پیمانے `2` دو کٹوتی ہندسوں کی اجازت دیتا ہے؛ `--mint-once` کو چھوڑنے سے پہلے سے طے شدہ `Infinitely` پالیسی برقرار رہتی ہے۔

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

ID کو Taira پر دوبارہ استعمال نہ کریں۔ پبلک نیٹ ورک میں رجسٹریشن کے لئے ایک نیا کینونیکل ID ، آپ کی درخواست کے لئے مختص ڈومین / عرفی نام، فیس فنڈنگ اور رن ٹائم کے اثاثہ رجسٹریشن اجازت کی ضرورت ہوتی ہے۔

### 4۔ مینٹ، ٹرانسفر اور جلنا {#_4-mint-transfer-and-burn}

تمام لکھنے کے احکامات صریح طور پر فیس ادا کرنے والے حکام کو منتخب کرتے ہیں۔ CLI دستخط سے پہلے عین مطابق لین دین کا حوالہ دیتا ہے اور ڈیفالٹ کی حیثیت سے انتظار کرتا ہے۔

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

جلنے کے بعد، ذرائع توازن کی توقع کریں `64.50`, منزل کی توازن `25.50`, اور مجموعی مقدار `90.00`.

::: warning اجازت کی حد

Taira پر ، نل سے ماخوذ `taira.tx-metadata.json` منسلک کریں اور ہر تحریر کے لئے `--fee-payer authority` کا استعمال کریں۔ رجسٹریشن اور مائننگ میں فعال تصدیق کنندہ کی اجازت درکار ہوتی ہے۔ منتقلی اور جلنے میں ماخذ بیلنس پر اختیار کی ضرورت ہوتی ہے۔ نل سے مالی اعانت حاصل کرنے والا اکاؤنٹ خود بخود جاری کرنے والا نہیں ہوتا ہے۔

:::

## تصدیق کریں {#verify}

دونوں ٹھوس توازن اور پھر تعریف پڑھیں۔ یہ پوسٹ اسٹیٹ سوالات کامیابی کے معیار ہیں؛ ایک جمع کرانے کی رسید خود ہی نہیں ہے.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

درخواست کے بیانات میں عددی اقدار کو فکسڈ پوائنٹ اعشاریہ کے طور پر موازنہ کرنا چاہئے، نہ کہ بائنری فلوٹنگ پوائنٹ اقدار، اور تعریف ID کے ساتھ ساتھ اکاؤنٹ کی تصدیق کرنی چاہئے.

## خرابی کا سراغ لگانا {#troubleshooting}

- ایک ID جس میں `#` ایک مستعار یا کنکریٹ بیلنس لفظی ہے، ایک کینونیکل اثاثہ تعریف نہیں ID. صرف Base58 کے ساتھ استعمال کریں `--definition`, یا ایک منسلک عرفی نام سے گزرنا `--definition-alias`.
- `Scale` غلطیاں کا مطلب ہے کہ ایک مقدار میں تعریف کی اجازت سے زیادہ فریکشنل ہندسے ہوتے ہیں۔
- `Mintability` مسترد کرنے کا مطلب ہے کہ `Once` ، `Not`، یا `Limited(n)` پالیسی نے مائننگ ختم کر دی ہے یا اس کی اجازت نہیں دی ہے۔ تاریخ کو دوبارہ نہ لکھیں؛ تعریف کے استفسار میں واپس آنے والی پالیسی استعمال کریں۔
- مرحلہ 2 جان بوجھ کر ایک رجسٹرڈ منزل اکاؤنٹ کا انتخاب کرتا ہے. اگر اثاثہ داخل `ExplicitOnly` ہے تو، ایک مجاز کے ذریعے منزل کی توازن فراہم کریں منتقلی سے پہلے بہاؤ۔ اسی طرح کا نام CLI گارڈ اکاؤنٹ یا بیلنس کو رجسٹر نہیں کرتا ہے؛ یہ ایک اور ہدایات شامل کرنے کے بجائے اس کی اجازت دیتا ہے۔
- عام ہدایات کی کامیابی سے پہلے فیس کو مسترد کیا جاتا ہے۔ ادائیگی کنندہ کا انتخاب کریں، نیٹ ورک کے فیس اثاثے کے میٹا ڈیٹا کا استعمال کریں اور اس کے بیلنس کی تصدیق کریں۔
- اگر فکسڈ لوکل ڈیفینیشن پہلے سے ہی ایک سابقہ رن سے موجود ہے تو ، تازہ پیدا شدہ لوکل نیٹ ورک شروع کریں یا اس کی موجودہ حالت کو جاری رکھیں۔ کبھی بھی بیس 58 ID کے لئے غلط شکل والے بے ترتیب سٹرنگ کی جگہ نہ لیں.

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [مقررہ کمیٹ پر اثاثوں کی زندگی سائیکل انضمام ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust مقررہ ذمہ داری پر اثاثوں کی تعمیر کے مثالیں](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [اثاثہ جات](/ur/blockchain/assets.md)
- [ہدایات](/ur/blockchain/instructions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
- [JavaScript اور TypeScript](/ur/guide/tutorials/javascript.md)
