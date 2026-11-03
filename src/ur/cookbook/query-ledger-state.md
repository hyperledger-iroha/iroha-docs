---
translation_locale: ur
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# استفسار شدہ لیجر حالت {#query-ledger-state}

## نتیجہ {#outcome}

Taira کے JSON وسائل پڑھیں اور ان کے مطلوبہ فیلڈز منتخب کریں، پھر CLI اور Rust SDK سے Torii مجموعہ استفسارات کو فلٹرز، ترتیب، سرور سائیڈ پروجیکشن، صفحے کی حدود اور غیر شفاف `next_cursor` تسلسل کے ساتھ استعمال کریں۔ آپ فہرستوں کو دستخط شدہ مخصوص قسم والے استفسارات سے بھی دور رکھیں گے، جو انہیں نہ فلٹر کرتے ہیں، نہ ترتیب دیتے ہیں اور نہ پروجیکٹ کرتے ہیں۔

## لازمی شرائط {#prerequisites}

- `curl` ، `jq`، Node.js 24، اور موجودہ `iroha` CLI.
- Taira تک رسائی صرف پڑھنے کے لئے۔
- CLI مثالوں کے لئے، Taira یا کسی پیدا کردہ مقامی نیٹ ورک کے لئے کلائنٹ ترتیب۔
- Rust مثال کے لئے، ہدف نیٹ ورک کے طور پر ایک ہی Iroha ماخذ کی نظر ثانی پر منسلک ایک منصوبہ.

## قدم {#steps}

### Taira عوامی وسائل کے ذریعے صفحہ {#_1-page-through-a-public-taira-resource}

وسائل کے راستے ڈیش بورڈ اور دھواں کی جانچ پڑتال کے لئے مفید ہیں۔ JSON کے لئے پوچھیں ، ہر صفحے کو منسلک کریں ، اور جواب چیک کرنے کے بعد صرف ان شعبوں کو پروجیکٹ کریں جن کی درخواست کی ضرورت ہے۔

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

یہ HTTP سطح `limit` اور ایک غیر شفاف `next_cursor` کے ذریعے صفحہ بندی کرتی ہے؛ اسے بغیر تبدیلی کے `cursor` کے طور پر واپس بھیجیں جب تک کہ یہ `null` نہ ہو جائے۔ `total` صرف اس وقت ظاہر ہوتا ہے جب آپ `include_total=true` کی درخواست کریں، جس کے لیے پورا اسکین کرنا پڑتا ہے۔

### CLI کے ساتھ ایک مجموعہ فلٹر کریں {#_2-filter-a-collection-with-the-cli}

CLI فلٹر، پروجیکشن اور صفحے کا سائز مجموعہ کے اینڈ پوائنٹ کو بھیجتا ہے اور ایک صفحہ، `{items, next_cursor}`، پرنٹ کرتا ہے۔ `next_cursor` کے `null` ہونے تک اس کی پیروی کرنے کے لیے `--all` شامل کریں۔

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

صفحہ بندی سے پہلے فلٹرنگ ہوتی ہے۔ ہر مجموعہ صرف اپنے فیلڈز قبول کرتا ہے؛ نامعلوم فیلڈ کچھ بھی میچ نہ کرنے کے بجائے `invalid_filter` واپس کرتا ہے۔

### ایک مستحکم میٹا ڈیٹا کلید کے مطابق ترتیب دیں۔ {#_3-sort-by-a-stable-metadata-key}

مجموعہ کی ترتیب کی کلیدیں اعلان شدہ فیلڈز اور `metadata.<key>` قبول کرتی ہیں؛ نزولی ترتیب کے لیے کلید سے پہلے `-` لگائیں۔ صعودی ترتیب میں کلید کے بغیر قطاریں پہلے آتی ہیں اور برابری کی صورت میں قطار کی شناخت کے مطابق ترتیب ہوتی ہے، لہذا مجموعہ میں مستقل طور پر آباد کردہ کلید کا استعمال کریں۔

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` ایک سرور سائیڈ پروجیکشن ہے: `--select id,metadata` صرف وہی فیلڈز واپس کرتا ہے، اور نامعلوم فیلڈ `invalid_select` واپس کرتا ہے۔ دستخط شدہ مخصوص قسم والے استفسارات ہمیشہ مکمل آئٹمز واپس کرتے ہیں، اس لیے ان کے نتائج کو اوپر کی طرح `jq` یا JavaScript کے ذریعے کلائنٹ سائیڈ پر پروجیکٹ کریں۔

### Rust تکرار کرنے والے کو غیر شفاف کرسرز پر عمل کرنے دیں۔ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` صفحے کا سائز مقرر کرتا ہے۔ `list` سے واپس آنے والا تکرار کنندہ موجودہ صفحہ استعمال ہو جانے کے بعد ہی سرور کے `next_cursor` کے ساتھ اگلے صفحے کی درخواست کرتا ہے، اور `take` منطقی نتیجے کو محدود کرتا ہے۔ یہاں `client` ایک `iroha::blocking::Client` ہے۔

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` ایک غیر شفاف کی سیٹ پوزیشن ہے جو اپنے مجموعہ، راستے، فلٹر اور ترتیب سے بندھی ہوتی ہے۔ اسے کبھی پارس یا خود تیار نہ کریں، اور اسے مختلف فلٹر یا ترتیب کے ساتھ دوبارہ استعمال نہ کریں؛ Torii اسے `invalid_cursor` کے ساتھ مسترد کرتا ہے۔ صفحات کے درمیان داخل یا ہٹائی گئی قطاریں کبھی کسی بعد کے صفحے کو غیر متعلقہ قطاریں دہرانے یا چھوڑنے پر مجبور نہیں کرتیں۔

## تصدیق کریں {#verify}

عین مطابق ڈومین فلٹر کو صرف `universal.universal` واپس کرنا چاہئے۔ نتیجہ کی تصدیق کریں اس کے بجائے صرف کامیاب CLI آؤٹ پٹ گننے کے بجائے:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

صفحہ بند ایپلی کیشن استفسارات کے لئے یہ بھی ٹیسٹ کریں کہ IDs صفحات میں دہرائے نہیں جاتے، مطلوبہ منطقی حد کبھی تجاوز نہیں کی جاتی، اور مسترد شدہ کرسر ایک دستاویزی چیک پوائنٹ سے دوبارہ شروع ہوتا ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- ایک واحد استفسار متكرر فلٹر ، ترتیب ، صفحہ بندی ، یا حصول پیرامیٹرز کو قبول نہیں کرتا ہے۔ جب ان کنٹرولز کی ضرورت ہو تو اس سے متعلق فہرست استفسار کا استعمال کریں۔
- `limit` صفحے کا سائز ہے، کل نتیجہ نہیں: کم از کم 1 اور زیادہ سے زیادہ نوڈ کا `torii.app_api_max_list_limit` (ڈیفالٹ 500)؛ Torii کا ڈیفالٹ 100 ہے۔ مزید پڑھنے کے لیے `next_cursor`، `--all` یا SDK تکرار کنندہ کی پیروی کریں۔
- `invalid_cursor` کا مطلب ہے کہ کرسر غلط شکل کا ہے یا کسی مختلف مجموعہ، راستے، فلٹر یا ترتیب سے تعلق رکھتا ہے۔ استفسار کو دوبارہ شروع کریں؛ غیر شفاف قدر کی مرمت کرنے کی کوشش نہ کریں۔
- ایک انتخابی فلٹر ایسا مختصر یا خالی صفحہ واپس کر سکتا ہے جس کا `next_cursor` `null` نہ ہو۔ جب تک یہ `null` نہ ہو جائے، اس کی پیروی جاری رکھیں۔
- `--filter` اور HTTP `filter` پیرامیٹر Torii کی متنی گرامر لیتے ہیں، جیسے `id = "universal.universal"` یا `exists(metadata.tier)`۔ JSON پریڈیکیٹ آبجیکٹ فلٹر متن نہیں ہے اور غلط `filter` کے طور پر ناکام ہو جاتا ہے۔
- وسیع لامحدود استفسارات نیٹ ورک نوڈ کے کام اور کلائنٹ میموری کو بڑھاتے ہیں۔ صارف کے لئے مناسب منطقی حد اور صفحے کا سائز مقرر کریں۔
- دستخط شدہ `/v1/query` فہرست سازی کا API نہیں ہے۔ یہ واحد استفسارات اور چند غیر فلٹر شدہ تکرار پذیر آغاز قبول کرتا ہے، اور دوسروں، جیسے `FindDomains` یا `FindAssetDefinitions`، کو `signed_query_shape_not_admitted` کے ساتھ مسترد کرتا ہے۔ مجموعہ اینڈ پوائنٹس، CLI `list` کمانڈز اور SDK مجموعہ ریڈرز ایک ہی فلٹر، ترتیب اور کرسر گرامر استعمال کرتے ہیں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [مقررہ commit پر Torii مجموعہ استفسار معاہدہ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [مقررہ commit پر Rust مجموعہ پڑھائی اور کرسر تکرار کنندہ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [مقررہ commit پر دستخط شدہ استفسار کا داخلہ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [استفسارات](/ur/blockchain/queries.md)
- [استفسار کا حوالہ](/ur/reference/queries.md)
- [JavaScript اور TypeScript](/ur/guide/tutorials/javascript.md)
