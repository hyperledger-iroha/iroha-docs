---
translation_locale: ar
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# استفسارات الدولة {#query-ledger-state}

## النتيجة {#outcome}

قراءة ومشاركة مصادر Taira JSON ، ثم استخدام استفسارات Iroha المميزة مع المرشحات والصفف المنطقي، والتقسيم، وحجم التقاط، واستمرار السيطرة إلى الأمام فقط. سوف تتجنب أيضًا الاعتماد على مشروع الاختيار قبل أن يقوم الخادم بتقييم النسخة `--select` التي يتم إعادةها.

## الشروط المسبقة {#prerequisites}

- `curl`, `jq`, Node.js 24، والتيار `iroha` CLI.
- إمكانية الوصول إلى Taira فقط.
- على سبيل المثال، إعداد العميل لـ Taira أو شبكة محلية تم إنشاؤها.
- على سبيل المثال Rust ، مشروع متصل بنفس مراجعة المصدر Iroha مثل الشبكة المستهدف.

## الخطوات {#steps}

### الصفحة من خلال مصادر عامة Taira {#_1-page-through-a-public-taira-resource}

طرق الموارد مفيدة لمؤشرات التحكم والتحقق من الدخان. اطلب JSON ، وربط كل صفحة، ونشر فقط المجالات التي يحتاجها التطبيق بعد التحقق من الاستجابة.

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

هذه السطح HTTP تستخدم `limit` و `offset`. معالجة المفقودة أو الحد `total` كالمعتاد عندما يستخدم الطريق وضع العد أرخص.

### 2 - تصفية وتعبئة استفسار CLI {#_2-filter-and-batch-a-typed-cli-query}

يقوم CLI بتسلسل استفسار قابل للتكرار وتتبع مؤشرات استمرار الخادم داخلياً. هنا يقتصر النتيجة المنطقية على سطر واحد ، في حين يتحكم `--fetch-size 1` في الحد الأقصى من المجموعة التي يتم إحضارها في كل رحلة ذهاب وإياب .

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

يحدث التصفية قبل تصفية الصفحات. استخدم مبادئ تعبيرية محددة للمسألة؛ لا يمكن إعادة استخدام مبادئ للحساب أو الأصول بأمان لسيطرة.

### 3- التنظيم حسب مفتاح البيانات المتعددة المستقرة {#_3-sort-by-a-stable-metadata-key}

تصنيف الاستفسار النوعي هو لغوي على مفتاح البيانات المعدنية واحد. العناصر دون ذلك المفتاح تتبع الترتيب المحدد في وقت التشغيل ، لذلك استخدم مفتاحًا مكتظًا باستمرار عبر مجموعة البيانات.

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

يقوم CLI المحقق بتحليل `--select` JSON وإعادة توبيل الاختيار، ولكن السؤال الخفيف الحالي DSL لا يقيّم هذا الاختيار على الخادم. لا بناء عقد التنبؤ حوله بعد. استخدم التنبؤ SDK المطبوع فقط بعد أن يدعم وقت تشغيله المستهدف، أو عرض الجانب العميل للنتيجة المعتمدة مع `jq` أو JavaScript كما هو أعلاه.

### 4. دع Rust المتكرر يتبع المؤشرات غير الشفافة. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` يحد من مجموعة النتائج المنطقية. `FetchSize` يتحكم في كل حزمة خادم. يقوم المتكرر المرجع بإرسال طلبات الاستمرار بشكل شفاف باستخدام السيطرة التي يتم إنشاؤها من الخادم.

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

`ForwardCursor` ملزمة بالسلطة ، محلية للعمليات ، ومتقدمة فقط. لا تجزيها أبدًا ، أو تجميعها ، أو مشاركتها بين السلطات ، أو استمر بها كرمز استئناف محمول عبر حالات Torii. إذا انتهت صلاحيتها ، قم بإعادة تشغيل الاستفسار الأصلي مع نقطة تفتيش متعمدة على مستوى التطبيق .

## التحقق {#verify}

يجب أن يعود المرشح الدقيق للمجال فقط `wonderland.universal`. التحقق من النتيجة بدلاً من احتساب خروج ناجح CLI وحده:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

في استفسارات التطبيقات المصفحة، اختبر أيضًا أن IDs لا تتكرر عبر الصفحات، ولا يتم تجاوز الحد المنطقي المطلوب أبدًا، وإعادة المحاولة بعد انتهاء صلاحية المؤشر من نقطة تفتيش وثائقية. .

## حل المشاكل {#troubleshooting}

- لا يقبل استفسار فردي مرشحات قابلة للتكرار أو الترتيب أو تصفية الصفحات ، أو عدة معايير. استخدم استفسار القائمة المقابلة عندما تكون هناك حاجة إلى هذه التحكمات .
- `fetch_size` هو إشارة لحزمة غير صفر ، وليس الحد الإجمالي للنتيجة. الاختيار الافتراضي الحالي هو `100` ، ويمنع وقت التشغيل قيم فوق أقصى حد.
- لا يمكن إعادة استخدام السيطرة غير المعروفة أو المنتهية من الصلاحية أو الأجنبية بشكل متعمد. قم بإعادة تشغيل البحث؛ لا تحاول إصلاح القيمة الغامضة الشفافية.
- تصنيف البيانات المعدنية ليس تصنيف الحقول العامة. إذا لم يكن كل عنصر يحمل مفتاحًا محددًا، قم بتوثيق ترتيب المفتاح المفقود أو اختر استراتيجية أخرى.
- يقوم CLI بتحليل وإرسال `--select` ، ولكن الخادم الحالي لا يقيّم قطعة الاختيار خفيفة الوزن. تطبق التنبؤ الجانبي للعميل ما لم يتم التحقق من دعم الاختيار الجانبي لخادم لفترة تشغيل المنشأة.
- الأسئلة العريضة غير المحدودة تزيد من عمل الأقران، ذاكرة العميل، ومخاطر حياة المؤشر. حدد الحد المنطقي وحجم الاستحواذ المناسب للمستهلك.
- تعتبر معايير الموارد العامة JSON ومعايير الاستفسار المخطط لها ذات صلة ولكنها ليست تنسيقات سلكية قابلة للتبادل. تفضل SDK أو CLI في غلافات الاستفسارات المميزة.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل صفحة المدعومة بواسطة cursor في commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [سلوك البنّاء والاختيار في المشاركة المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [معايير الاستفسار ونموذج السيطرة في الإتفاق المثبت ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [الأسئلة ](/ar/blockchain/queries.md)
- [إشارة الاستفسار](/ar/reference/queries.md)
- [JavaScript و TypeScript ](/ar/guide/tutorials/javascript.md)
