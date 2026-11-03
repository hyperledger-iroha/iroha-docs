---
translation_locale: ur
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# فنگبل اثاثے {#fungible-assets}

## نتیجہ {#outcome}

براہ راست Taira اثاثہ تعریفوں کی جانچ پڑتال کریں اور ایک پیدا کردہ مقامی نیٹ ورک پر منٹ، منتقلی، جلانے اور بیلنس کی تصدیق کے بہاؤ کو مکمل کریں۔ نسخہ کینونیکل، بغیر سابقے والے Base58 اثاثہ تعریف IDs، بغیر ڈومین والے I105 اکاؤنٹ IDs اور صریح فیس کی ادائیگی کا استعمال کرتا ہے۔

## لازمی شرائط {#prerequisites}

- `curl`، `jq`، Python 3.11 یا بعد میں، Node.js 24 اور موجودہ `iroha` اور `kagami` CLIs۔
- Taira تک رسائی صرف پڑھنے کے لئے۔
- لکھنے کی کارروائیوں والے مرحلہ وار عمل کے لیے، [Iroha لانچ کریں](/ur/get-started/launch-iroha.md) کی طرح `kagami localnet generate --peers 4 --out-dir ./localnet` سے بنایا گیا مقامی نیٹ ورک، جس میں `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` شامل کیا گیا ہو۔ یہ `./localnet/client.toml` اور `http://127.0.0.1:8080` پر Torii فراہم کرتا ہے۔

## قدم {#steps}

### بغیر دستخط کیے Taira کی تعریفوں کا معائنہ کریں۔ {#_1-inspect-taira-definitions-without-a-signer}

اثاثہ تعریفوں میں ایک غیر شفاف Base58 ID، ڈسپلے نام، منٹ کی اہلیت کی پالیسی، عددی پیمانہ، اختیاری عرفی نام، مالک، اختیاری مالک ڈومین یا ڈیٹا اسپیس، بیلنس پالیسی اور مجموعی مقدار شامل ہوتی ہے۔ کنکریٹ بیلنس میں اس کا ہولڈر اکاؤنٹ اور اختیاری ڈیٹا اسپیس کا دائرہ کار بھی شامل ہوتا ہے۔

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

### مقامی مجاز اکاؤنٹس اور منزل کی تیاری کریں {#_2-prepare-the-local-authority-and-destination}

تخلیق کردہ ترتیب میں عوامی کلید سے مقامی مجاز اکاؤنٹس کو نکالیں، پھر ایک نئے وصول کنندہ اکاؤنٹ کے لیے کلیدی جوڑا بنائیں اور اسے رجسٹر کریں۔ کوئی نجی کلید طباعت نہیں کی جاتی ہے۔

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3۔ کلائنٹ کی ملکیت والی عددی تعریف استعمال کریں {#_3-use-a-client-owned-numeric-definition}

جینیسس کے باہر، تعریف ایسے مالک `--domain` کے تحت رجسٹر کی جاتی ہے جس کا مالک دستخط کنندہ ہو، اور پیدا کردہ لوکل نیٹ کا کلائنٹ کسی ڈومین کا مالک نہیں ہوتا۔ `--asset-definition-id` کے ساتھ پیدا کردہ لوکل نیٹ میں یہ تعریف پہلے سے موجود ہے: جینیسس نے اسے غیر محدود پیمانے کے ساتھ رجسٹر کیا، کلائنٹ کو اس کا مالک بنایا، اور کلائنٹ کے لیے 1,000,000,000 یونٹس منٹ کیے۔

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

اس ID کو Taira پر دوبارہ استعمال نہ کریں۔ پبلک نیٹ ورک میں رجسٹریشن کے لئے ایک نیا کینونیکل ID، ایک ایسا مالک ڈومین جس کا مالک آپ کا اکاؤنٹ ہو (جو `ledger asset definition register` کو `--domain` کے طور پر دیا جاتا ہے)، کسی بھی عرفی نام کے لیے `CanManageAssetDefinitionAlias` کی عطا کردہ اجازت، اور فیس فنڈنگ کی ضرورت ہوتی ہے۔

### 4۔ مینٹ، ٹرانسفر اور جلنا {#_4-mint-transfer-and-burn}

تمام لکھنے کے امجاز اکاؤنٹسات صریح طور پر فیس ادا کرنے والے مجاز اکاؤنٹس کو منتخب کرتے ہیں۔ CLI دستخط سے پہلے عین مطابق لین دین کا حوالہ دیتا ہے اور ڈیفالٹ کی حیثیت سے انتظار کرتا ہے۔

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

جلنے کے بعد، ذرائع بیلنس کی توقع کریں `1000000064.50`, منزل کی بیلنس `25.50`, اور مجموعی مقدار `1000000090.00`.

::: warning اجازت کی حد

Taira پر ہر تحریر کے لئے `--fee-payer authority` کا استعمال کریں؛ CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔ رجسٹریشن کے لیے تعریف کے `--domain` کی ملکیت درکار ہے، اور عرفی نام کے لیے `CanManageAssetDefinitionAlias` بھی چاہیے۔ منٹ کرنے کے لیے تعریف کی ملکیت، یا `CanMintAssetWithDefinition` یا `CanMintAssetToAccount` رکھنا ضروری ہے؛ منتقلی اور جلنے میں ماخذ بیلنس پر اختیار کی ضرورت ہوتی ہے۔ فوسیٹ سے مالی اعانت حاصل کرنے والا اکاؤنٹ خود بخود جاری کرنے والا نہیں ہوتا ہے۔

:::

## تصدیق کریں {#verify}

دونوں ٹھوس بیلنس اور پھر تعریف پڑھیں۔ یہ پوسٹ اسٹیٹ استفسارات کامیابی کے معیار ہیں؛ ایک جمع کرانے کی رسید خود ہی نہیں ہے.

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
- مرحلہ 2 منزل اکاؤنٹ کو صریح طور پر رجسٹر کرتا ہے، اس لیے منتقلی اس وقت بھی کام کرتی ہے جب اکاؤنٹ کا داخلہ `ExplicitOnly` ہو۔ اسی طرح کے نام والا CLI گارڈ کوئی اکاؤنٹ یا بیلنس رجسٹر نہیں کرتا؛ یہ ایک اور ہدایت شامل کرنے کے بجائے عمل روک دیتا ہے۔
- عام ہدایات کی کامیابی سے پہلے فیس کو مسترد کیا جاتا ہے۔ ادائیگی کنندہ کا انتخاب کریں، CLI کی فیس کوٹیشن میں فیس اثاثہ اور زیادہ سے زیادہ حد چیک کریں، اور اس بیلنس کی تصدیق کریں۔
- اسی لوکل نیٹ پر دوبارہ چلانا پچھلے بیلنسز سے شروع ہوتا ہے، اور `kagami keys` موجودہ `./cookbook-recipient` کو قبول کرنے سے انکار کرتا ہے۔ ایک تازہ پیدا شدہ لوکل نیٹ شروع کریں اور وہ ڈائریکٹری ہٹا دیں، یا مطلق قدروں کے بجائے بیلنس کی تبدیلیوں کا موازنہ کریں۔ Base58 ID کی جگہ کبھی بھی غلط شکل والی بے ترتیب سٹرنگ استعمال نہ کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [مقررہ کمیٹ پر اثاثوں کی زندگی سائیکل انضمام ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust مقررہ commit داری پر اثاثوں کی تعمیر کے مثالیں](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [اثاثہ جات](/ur/blockchain/assets.md)
- [ہدایات](/ur/blockchain/instructions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
- [JavaScript اور TypeScript](/ur/guide/tutorials/javascript.md)
