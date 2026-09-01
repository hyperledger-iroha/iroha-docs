---
translation_locale: ur
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# استفسار شدہ لیجر حالت {#query-ledger-state}

## نتیجہ {#outcome}

Taira کے JSON وسائل پڑھیں اور مطلوبہ فیلڈز منتخب کریں، پھر filters، منطقی pagination، sorting، fetch sizes اور صرف آگے بڑھنے والے cursor continuation کے ساتھ typed Iroha استفسارات استعمال کریں۔ server کے بھیجے گئے `--select` tuple کو جانچنے سے پہلے selector projection پر انحصار نہ کریں۔

## لازمی شرائط {#prerequisites}

- `curl` ، `jq`، Node.js 24، اور موجودہ `iroha` CLI.
- Taira تک رسائی صرف پڑھنے کے لئے۔
- دستخط شدہ ٹائپڈ استفسارات کی مثالوں کے لئے، Taira کے لئے کلائنٹ ترتیب یا ایک مقامی نیٹ ورک پیدا کیا.
- Rust مثال کے لئے، ہدف نیٹ ورک کے طور پر ایک ہی Iroha ماخذ کی نظر ثانی پر منسلک ایک منصوبہ.

## قدم {#steps}

### Taira عوامی وسائل کے ذریعے صفحہ {#_1-page-through-a-public-taira-resource}

وسائل کے راستے ڈیش بورڈ اور دھواں کی جانچ پڑتال کے لئے مفید ہیں۔ JSON کے لئے پوچھیں ، ہر صفحے کو منسلک کریں ، اور جواب چیک کرنے کے بعد صرف ان شعبوں کو پروجیکٹ کریں جن کی درخواست کی ضرورت ہے۔

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

یہ HTTP سطح `limit` اور `offset` کا استعمال کرتی ہے۔ جب راستہ سستا گنتی موڈ کا استعمال کرتا ہے تو ایک متروک یا حد بندی شدہ `total` کو معمول کے مطابق علاج کریں۔

### ایک ٹائپڈ CLI استفسار کو فلٹر کریں اور بیچ کریں۔ {#_2-filter-and-batch-a-typed-cli-query}

CLI ایک ٹائپ شدہ تکرار پذیر استفسار کو سیریل بناتا ہے اور سرور کے تسلسل کرسرز کو اندرونی طور پر پیروی کرتا ہے۔ یہاں منطقی نتیجہ ایک سطر تک محدود ہوتا ہے ، جبکہ `--fetch-size 1` ہر دورہ واپسی میں حاصل کردہ زیادہ سے زیادہ بیچ کو کنٹرول کرتا ہے۔

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

صفحہ بندی سے پہلے فلٹرنگ ہوتی ہے۔ استفسار کے مخصوص ٹائپ کردہ پیشگوئیاں استعمال کریں۔ کسی اکاؤنٹ یا اثاثے کے لئے پیشگوئی کو محفوظ طریقے سے ڈومین کے لئے دوبارہ استعمال نہیں کیا جاسکتا ہے۔

### ایک مستحکم میٹا ڈیٹا کلید کے مطابق ترتیب دیں۔ {#_3-sort-by-a-stable-metadata-key}

ٹائپڈ استفسار کی ترتیب ایک میٹا ڈیٹا کلید پر لسانیاتی ہے۔ اس کلید کے بغیر آئٹمز رن ٹائم کی وضاحت شدہ ترتیب پر عمل کرتے ہیں ، لہذا مجموعہ میں مستقل طور پر آباد کردہ کلید کا استعمال کریں۔

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

داخل ہونے والے CLI پارس `--select` JSON اور منتخب کرنے والے tuple آگے بڑھاتا ہے، لیکن موجودہ ہلکے وزن کے استفسار DSL سرور پر اس سلیکٹر کا جائزہ نہیں لیتا ہے. ابھی تک اس کے ارد گرد پروجیکشن معاہدہ کی تعمیر نہیں کرتے ہیں. ایک ٹائپڈ SDK پروجیکشن صرف اس کے بعد ہدف رن ٹائم اس کی حمایت کرتا ہے، یا تصدیق شدہ نتیجہ کلائنٹ کی طرف سے `jq` یا JavaScript جیسا کہ اوپر بیان کیا گیا ہے۔

### Rust تکرار کرنے والے کو غیر شفاف کرسرز پر عمل کرنے دیں۔ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` منطقی نتیجہ سیٹ کو محدود کرتا ہے۔ `FetchSize` ہر سرور بیچ کو کنٹرول کرتا ہے۔ واپس آنے والا تکرار کنندہ شفاف طور پر سرور کے ذریعہ تیار کردہ کرسر کا استعمال کرتے ہوئے تسلسل کی درخواستیں بھیجتا ہے۔

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` اختیار سے منسلک ، عمل کے مقامی اور صرف فارورڈ ہے۔ اسے کبھی بھی تجزیہ نہ کریں ، اس کا ترکیب نہ کریں ، اسے مجاز اکاؤنٹس کے مابین بانٹیں ، یا اسے Torii کی مثالوں میں پورٹیبل ریزیومے ٹوکن کے طور پر برقرار رکھیں۔ اگر اس کی میعاد ختم ہوجاتی ہے تو ، ایپلیکیشن لیول چیک پوائنٹ کے ساتھ اصل استفسار کو دوبارہ شروع کریں۔

## تصدیق کریں {#verify}

عین مطابق ڈومین فلٹر کو صرف `wonderland.universal` واپس کرنا چاہئے۔ نتیجہ کی تصدیق کریں اس کے بجائے صرف کامیاب CLI آؤٹ پٹ گننے کے بجائے:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

پیجائزڈ ایپلی کیشن استفسارات کے لئے، یہ بھی ٹیسٹ کریں کہ IDs صفحات پر بار بار نہیں ہوتا ہے، مطلوبہ منطقی حد کبھی بھی تجاوز نہیں کی جاتی ہے، اور ختم ہونے والے کرسر کے بعد دوبارہ کوشش کرنا ایک دستاویزی چیک پوائنٹ سے دوبارہ شروع ہوتا ہے.

## خرابی کا سراغ لگانا {#troubleshooting}

- ایک واحد استفسار متكرر فلٹر ، ترتیب ، صفحہ بندی ، یا حصول پیرامیٹرز کو قبول نہیں کرتا ہے۔ جب ان کنٹرولز کی ضرورت ہو تو اس سے متعلق فہرست استفسار کا استعمال کریں۔
- `fetch_size` ایک غیر صفر بیچ اشارہ ہے، مجموعی نتائج کی حد نہیں. موجودہ ڈیفالٹ `100` ہے، اور رن ٹائم اس کی زیادہ سے زیادہ اقدار کو مسترد کرتا ہے.
- نامعلوم، ختم ہونے والا یا غیر ملکی کرسر جان بوجھ کر دوبارہ استعمال نہیں کیا جاسکتا ہے۔ استفسار کو دوبارہ شروع کریں؛ opaque قدر کی مرمت کرنے کی کوشش نہ کریں۔
- میٹا ڈیٹا ترتیب عام فیلڈ ترتیب نہیں ہے۔ اگر ہر شے میں منتخب کردہ کلید شامل نہیں ہے تو ، لاپتہ کلیدی آرڈر کی دستاویز کریں یا ایک اور حکمت عملی منتخب کریں۔
- CLI تجزیہ کرتا ہے اور آگے بڑھاتا ہے `--select` ، لیکن موجودہ سرور ہلکے وزن والے سلیکٹر ٹپل کا جائزہ نہیں لیتا ہے۔ کلائنٹ سائڈ پروجیکشن لاگو کریں جب تک کہ سرور سائڈ سلیکٹر سپورٹ کی تعیناتی شدہ رن ٹائم کے لئے تصدیق نہ کی جائے۔
- وسیع لامحدود استفسارات نیٹ ورک نوڈ کے کام، کلائنٹ میموری اور کرسر کی زندگی کا خطرہ بڑھاتے ہیں۔ ایک منطقی حد مقرر کریں اور صارف کے لئے مناسب سائز حاصل کریں۔
- عوامی JSON وسائل کے پیرامیٹرز اور دستخط شدہ typed query parameters باہم متعلق ہیں، لیکن یہ ایک دوسرے کے بدلے استعمال ہونے والے serialization formats نہیں ہیں۔ typed query envelopes کے لیے SDK یا CLI کو ترجیح دیں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [pinned commit پر cursor-backed pagination انضمام ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs) پر query builder اور selector کا رویہ۔
- [پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs) میں استفسار پیرامیٹرز اور کرسر ماڈل۔
- [استفسارات](/ur/blockchain/queries.md)
- [استفسار کا حوالہ](/ur/reference/queries.md)
- [JavaScript اور TypeScript](/ur/guide/tutorials/javascript.md)
