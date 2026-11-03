---
translation_locale: ar
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# استعلام حالة دفتر الحسابات في البلوكشين {#query-ledger-state}

## نتيجة {#outcome}

اقرأ موارد JSON في Taira وطبّق الإسقاط عليها، ثم استخدم استعلامات مجموعات Torii من CLI ومن Rust SDK مع الفلاتر، والفرز، والإسقاط من جانب الخادم، وحدود الصفحات، والاستمرار عبر المؤشر الغامض `next_cursor`. ستُبقي أيضًا عمليات عرض القوائم بعيدًا عن الاستعلامات الموقعة محددة النوع، التي لا تقوم بتصفيتها أو فرزها أو إسقاطها.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Node.js 24، و`iroha` الحالي CLI.
- وصول للقراءة فقط Taira.
- لأمثلة CLI، تكوين العميل لـ Taira أو شبكة محلية تم إنشاؤها.
- بالنسبة لمثال Rust، مشروع مثبت على نفس مراجعة المصدر Iroha مثل الشبكة الهدف.

## خطوات {#steps}

### 1. تصفح من خلال مورد عام Taira {#_1-page-through-a-public-taira-resource}

مسارات الموارد مفيدة للوحة التحكم وفحوصات الدخان. اطلب JSON، واربط كل صفحة، واعرض فقط الحقول التي يحتاجها التطبيق بعد التحقق من الاستجابة.

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

يقسّم سطح HTTP هذا النتائج إلى صفحات باستخدام `limit` ومؤشر غامض `next_cursor`؛ أعده دون تغيير بصفته `cursor` حتى يصبح `null`. لا يظهر `total` إلا عندما تطلب `include_total=true`، وهو ما يكلّف مسحًا كاملًا.

### ٢. تصفية مجموعة باستخدام CLI {#_2-filter-a-collection-with-the-cli}

يرسل CLI الفلتر والإسقاط وحجم الصفحة إلى نقطة نهاية المجموعة ويطبع صفحة واحدة، `{items, next_cursor}`. أضف `--all` لتتبع `next_cursor` حتى يصبح `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

تحدث التصفية قبل التقسيم إلى صفحات. تقبل كل مجموعة حقولها الخاصة فقط؛ ويُعيد الحقل غير المعروف `invalid_filter` بدلاً من عدم مطابقة أي شيء.

### 3. الفرز حسب مفتاح بيانات وصفية ثابت {#_3-sort-by-a-stable-metadata-key}

تقبل مفاتيح الفرز للمجموعات الحقول المُعلنة و`metadata.<key>`؛ أضف البادئة `-` إلى المفتاح للترتيب التنازلي. تأتي الصفوف التي لا تحتوي على المفتاح أولًا في الترتيب التصاعدي، ويُحسم التعادل بحسب هوية الصف، لذا استخدم مفتاحًا يتم تعبئته باستمرار عبر المجموعة.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` هو إسقاط من جانب الخادم: يُعيد `--select id,metadata` تلك الحقول فقط، ويُعيد الحقل غير المعروف `invalid_select`. تُعيد الاستعلامات الموقعة محددة النوع العناصر كاملة دائمًا، لذا قم بإسقاط نتائجها على جانب العميل باستخدام `jq` أو JavaScript كما هو مذكور أعلاه.

### 4. دع المُكرّر Rust يتبع المؤشرات غير الشفافة {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` يحدد حجم الصفحة. لا يطلب المُكرِّر الذي يُعيده `list` الصفحة التالية باستخدام `next_cursor` الخاص بالخادم إلا بعد استهلاك الصفحة الحالية، ويحدّ `take` النتيجة المنطقية. هنا `client` هو `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` هو موضع غامض ضمن مجموعة المفاتيح مرتبط بمجموعته ومساره وفلتره وترتيبه. لا تقم أبدًا بتحليله أو توليفه، ولا تُعِد استخدامه مع فلتر أو ترتيب مختلف؛ إذ يرفض Torii ذلك بالخطأ `invalid_cursor`. الصفوف التي تُدرج أو تُزال بين الصفحات لا تجعل أبدًا صفحة لاحقة تكرر صفوفًا غير ذات صلة أو تتخطاها.

## تحقق {#verify}

يجب أن يُرجع مرشح النطاق الدقيق فقط `universal.universal`. تحقق من النتيجة بدلاً من عد خروج CLI الناجح وحده:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

بالنسبة لاستعلامات التطبيقات المرقمة، اختبر أيضًا أن المعرفات لا تتكرر عبر الصفحات، وأن الحد المنطقي المطلوب لا يتم تجاوزه أبدًا، وأن المؤشر المرفوض يؤدي إلى إعادة البدء من نقطة تحقق موثقة.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- لا يقبل الاستعلام الفردي عوامل تصفية أو ترتيب أو ترقيم الصفحات أو جلب قابلة للتكرار. استخدم استعلام القائمة المقابل عندما تكون هذه الضوابط مطلوبة.
- `limit` هو حجم الصفحة، وليس إجمالي النتيجة: 1 على الأقل وبحد أقصى `torii.app_api_max_list_limit` الخاص بالعقدة (الافتراضي 500)؛ والقيمة الافتراضية في Torii هي 100. اتبع `next_cursor` أو `--all` أو مُكرِّر SDK لقراءة المزيد.
- `invalid_cursor` يعني أن المؤشر مشوّه أو ينتمي إلى مجموعة أو مسار أو فلتر أو ترتيب مختلف. أعد تشغيل الاستعلام؛ لا تحاول إصلاح القيمة الغامضة.
- يمكن للفلتر الانتقائي أن يُعيد صفحة قصيرة أو فارغة مع `next_cursor` لا تساوي قيمته `null`. استمر في تتبعه حتى يصبح `null`.
- يأخذ `--filter` ومعلمة HTTP `filter` قواعد الصياغة النصية في Torii، مثل `id = "universal.universal"` أو `exists(metadata.tier)`. كائن شرط JSON ليس نص فلتر ويفشل بوصفه `filter` غير صالح.
- الاستفسارات الواسعة وغير المحدودة تزيد من عمل نظائر الشبكة وذاكرة العميل. اضبط حدًا منطقيًا وحجم صفحة مناسبًا للمستهلك.
- `/v1/query` الموقّع ليس واجهة API لعرض القوائم. فهو يقبل الاستعلامات الفردية وعددًا قليلًا من بدايات الاستعلامات القابلة للتكرار غير المُصفّاة، ويرفض غيرها، مثل `FindDomains` أو `FindAssetDefinitions`، بالخطأ `signed_query_shape_not_admitted`. تتشارك نقاط نهاية المجموعات وأوامر `list` في CLI وقارئات المجموعات في SDK قواعد صياغة واحدة للفلتر والترتيب والمؤشر.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [عقد واجهة استعلامات مجموعات Torii عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [قراءات المجموعات ومُكرِّر المؤشر في Rust في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [قبول الاستعلامات الموقعة عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [استفسارات](/ar/blockchain/queries.md)
- [مرجع الاستعلام](/ar/reference/queries.md)
- [JavaScript و TypeScript](/ar/guide/tutorials/javascript.md)
