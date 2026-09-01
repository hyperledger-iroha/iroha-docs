---
translation_locale: ar
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استعلام حالة دفتر الحسابات في البلوكشين {#query-ledger-state}

## نتيجة {#outcome}

اقرأ وعرض موارد Taira JSON، ثم استخدم استعلامات Iroha مكتوبة مع الفلاتر، الترقيم المنطقي للصفحات، الفرز، أحجام الجلب، واستمرار المؤشر أحادي الاتجاه. ستتجنب أيضًا الاعتماد على إسقاط المحدد قبل أن يقوم الخادم بتقييم الزوج المرسل `--select`.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Node.js 24، و`iroha` الحالي CLI.
- وصول للقراءة فقط Taira.
- لأمثلة استعلام مكتوب موقع، تكوين العميل لـ Taira أو شبكة محلية تم إنشاؤها.
- بالنسبة لمثال Rust، مشروع مثبت على نفس مراجعة المصدر Iroha مثل الشبكة الهدف.

## خطوات {#steps}

### 1. تصفح من خلال مورد عام Taira {#_1-page-through-a-public-taira-resource}

مسارات الموارد مفيدة للوحة التحكم وفحوصات الدخان. اطلب JSON، واربط كل صفحة، واعرض فقط الحقول التي يحتاجها التطبيق بعد التحقق من الاستجابة.

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

تستخدم هذه السطح HTTP و `limit` و `offset`. اعتبر `total` المحذوف أو المحدود طبيعيًا عندما يستخدم المسار وضع العد الأرخص.

### ٢. تصفية وتجميع استعلام مكتوب CLI {#_2-filter-and-batch-a-typed-cli-query}

يقوم CLI بتسلسل استعلام قابل للتكرار من نوع معين ويتبع مؤشرات الاستمرار الخاصة بالخادم داخليًا. هنا، يتم تقييد النتيجة المنطقية بصف واحد، بينما يتحكم `--fetch-size 1` في الحد الأقصى للدفعة التي يتم جلبها لكل رحلة ذهاب وإياب.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

يحدث التصفية قبل التجزئة. استخدم الموجِّهات المحددة للاستعلام؛ لا يمكن استخدام موجِّه لحساب أو أصل بأمان لإعادة الاستخدام لنطاق.

### 3. الفرز حسب مفتاح بيانات وصفية ثابت {#_3-sort-by-a-stable-metadata-key}

ترتيب الاستعلام المطبوع يكون ترتيبًا معجميًا بناءً على مفتاح بيانات وصفية واحد. العناصر التي لا تحتوي على هذا المفتاح تتبع ترتيب البيئة البرمجية المحدد، لذا استخدم مفتاحًا يتم تعبئته باستمرار عبر المجموعة.

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

النص CLI الذي تم تسجيل الوصول له يُحلل `--select` JSON ويحوّل زوج المحدد، لكن الاستعلام الخفيف الحالي DSL لا يقيم ذلك المحدد على الخادم. لا تقم بإنشاء عقد الإسقاط حوله بعد. استخدم إسقاطًا مكتوبًا SDK فقط بعد أن يدعم بيئة تنفيذ البرنامج الهدف ذلك، أو قم بإسقاط النتيجة المُحقَّقة على جانب العميل باستخدام `jq` أو JavaScript كما هو مذكور أعلاه.

### 4. دع المُكرّر Rust يتبع المؤشرات غير الشفافة {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` يحدد مجموعة النتائج المنطقية. `FetchSize` يتحكم في كل دفعة خادم. المؤشر المعاد يرسل طلبات الاستمرار بشكل شفاف باستخدام المؤشر الذي تم إنشاؤه بواسطة الخادم.

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

يكون `ForwardCursor` مرتبطًا بالسلطة، محليًا للمعالجة، واتجاهه للأمام فقط. لا تقوم أبدًا بتحليله، أو توليفه، أو مشاركته بين الجهات المخوّلة، أو الاحتفاظ به كرمز سيرة ذاتية قابل للنقل عبر مثيلات Torii. إذا انتهت صلاحيته، أعد تشغيل الاستعلام الأصلي باستخدام نقطة تحقق مقصودة على مستوى التطبيق.

## تحقق {#verify}

يجب أن يُرجع مرشح النطاق الدقيق فقط `wonderland.universal`. تحقق من النتيجة بدلاً من عد خروج CLI الناجح وحده:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

بالنسبة لاستعلامات التطبيقات المرقمة، اختبر أيضًا أن المعرفات لا تتكرر عبر الصفحات، وأن الحد المنطقي المطلوب لا يتم تجاوزه أبدًا، وأن إعادة المحاولة بعد انتهاء صلاحية مؤشر المؤشر تبدأ من نقطة تحقق موثقة.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- لا يقبل الاستعلام الفردي عوامل تصفية أو ترتيب أو ترقيم الصفحات أو جلب قابلة للتكرار. استخدم استعلام القائمة المقابل عندما تكون هذه الضوابط مطلوبة.
- `fetch_size` هو تلميح دفعة غير صفري، وليس الحد الإجمالي للنتائج. الإعداد الافتراضي الحالي هو `100`، وبيئة تنفيذ البرنامج ترفض القيم التي تتجاوز الحد الأقصى لها.
- المؤشر المجهول أو المنتهي أو الأجنبي غير قابل لإعادة الاستخدام عن قصد. أعد تشغيل الاستعلام؛ لا تحاول إصلاح القيمة الغامضة.
- ترتيب البيانات الوصفية ليس ترتيبًا عامًا للحقول. إذا لم يكن كل عنصر يحمل المفتاح المحدد، فوثّق ترتيب العناصر التي تفتقد المفتاح أو اختر استراتيجية أخرى.
- CLI يحلل ويعيد توجيه `--select`، لكن الخادم الحالي لا يقيم زوج المحدد الخفيف. طبق الإسقاط من جانب العميل ما لم يتم التحقق من دعم المحدد من جانب الخادم لبيئة تنفيذ البرنامج المنشور.
- الاستفسارات الواسعة وغير المحدودة تزيد من عمل نظائر الشبكة وذاكرة العميل ومخاطر مدة حياة المؤشر. اضبط حدًا منطقيًا وحجم جلب مناسبًا للمستهلك.
- معلمات الموارد العامة JSON ومعلمات الاستعلام الموقعة والمكتوبة مرتبطة ببعضها البعض لكنها ليست صيغ تسلسل قابلة للتبادل. يُفضل استخدام SDK أو CLI لحاويات بيانات الاستعلام المكتوبة.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل الترقيم المدعوم بالمؤشر عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [سلوك منشئ الاستعلام والمحدد في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [معلمات الاستعلام ونموذج المؤشر عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [استفسارات](/ar/blockchain/queries.md)
- [مرجع الاستعلام](/ar/reference/queries.md)
- [JavaScript و TypeScript](/ar/guide/tutorials/javascript.md)
