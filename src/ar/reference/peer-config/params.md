---
translation_locale: ar
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# معلمات التكوين {#configuration-parameters}

[[فهرس]]

## على مستوى الجذر {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

معرف السلسلة الذي يجب تضمينه في كل معاملة. يُستخدم لمنع هجمات الإعادة.

هجوم الإعادة هو محاولة لتقديم معاملة صالحة إلى شبكة مختلفة عن الشبكة التي كانت مخصصة لها. نظرًا لأن `chain` جزء من حمولة المعاملة الموقعة، يتم رفض المعاملة الموقعة لسلسلة واحدة من قبل أقران الشبكة الذين يستخدمون معرف سلسلة مختلف.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

المفتاح العام لنظير الشبكة. يجب أن يستخدم نظراء شبكة مصادقة الإجماع مفاتيح BLS-Normal.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

المفتاح الخاص بنظير الشبكة. يجب أن يطابق `public_key`؛ يجب على أقران شبكة مدقق الإجماع استخدام مفاتيح BLS-عادية.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

قائمة بالأقران الموثوقين في الشبكة المحددة مسبقًا.

يجب على المصادقين بالإجماع استخدام BLS-مفاتيح النظراء في الشبكة العادية. لكل محقق، قدم أيضًا مفتاحًا مطابقًا [`trusted_peers_pop`](#param-trusted-peers-pop) إدخال.

<param-table env="TRUSTED_PEERS">
<template #type>

مصوفة من سلاسل نظراء الشبكة. استخدم `PUBLIC_KEY@ADDRESS` عندما يكون عنوان P2P معروفًا؛ كما يتم قبول `PUBLIC_KEY` بمفرده ويسمح باكتشاف عنوان نظير الشبكة من النميمة.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS إدخالات إثبات الحيازة لأقران شبكة المدقق الموثوق بها.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

مصفوفة من الكائنات تحتوي على حقول `public_key` و `pop_hex`

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## الكتلة الأولى في سلسلة الكتل {#genesis}

### `genesis.file` {#param-genesis-file}

مسار الملف للحمل المبدئي لبلوكشين الموقع الذي تم إنشاؤه بواسطة `kagami genesis sign`. عادةً ما يقوم الملفات الشخصية المُنشأة بكتابته كملف Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

المفتاح العام لزوج مفاتيح الجينيسيس في البلوك تشين.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## شبكة {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

عنوان للاتصال من نظير إلى نظير لغرض التوافق (سوميراجي) ومزامنة الكتل (مزامنة الكتلة_).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

عنوان الند للند (خارجي، كما يراه نظراء الشبكة الآخرون).

سيتم تداوله بين نظراء الشبكة المتصلين حتى يتمكنوا من تداوله مع نظراء الشبكة الآخرين.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

كمية الكتل التي يمكن إرسالها في رسالة مزامنة واحدة.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

الفاصل الزمني بين الطلبات الموجهة إلى الأقران في الشبكة للحصول على أحدث كتلة.

الثرثرة بشكل أكثر تكرارًا تقصر الوقت للتزامن، لكنها قد تُثقل الشبكة.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

الحد الأقصى لعدد المعاملات في رسالة دفعة الشائعات.

الحجم الأصغر يؤدي إلى وقت أطول للمزامنة، ولكنه مفيد إذا كان لديك فقدان حزم مرتفع.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

فترة النميمة حول المعاملة المعلقة بين نظائر الشبكة.

الثرثرة بشكل أكثر تكرارًا تقصر الوقت للتزامن، لكنها قد تُثقل الشبكة.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

مدة الوقت التي بعدها يتم قطع الاتصال مع نظير الشبكة إذا كان نظير الشبكة خاملاً.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

العنوان الذي يجب أن يستمع إليه خادم Torii والذي يقوم العميل أو العملاء بإرسال طلباتهم إليه.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

أقصى عدد من البايتات في جسم الطلب الخام المقبول من قبل [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md).

يُستخدم هذا الحد لمنع الهجمات DOS.

<param-table>
<template #type>

الرقم (بالبايتات)

</template>
<template #default-value>

`64_000_000` (64 ميغابايت)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

الوقت الذي يمكن أن تظل فيه الاستعلامات في المخزن إذا لم يتم الوصول إليها.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

الحد الأعلى لعدد الاستعلامات النشطة.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

الحد الأعلى لعدد الاستعلامات النشطة لمستخدم واحد.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## مسجل {#logger}

### `logger.level` {#param-logger-level}

مستوى تفصيل السجلات العام (انظر [`logger.filter`](#param-logger-filter) للتكوين المصقول).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

سلسلة، القيم المحتملة:

- `TRACE`: جميع الأحداث، بما في ذلك العمليات منخفضة المستوى.
- `DEBUG`: رسائل بمستوى التصحيح، مفيدة للتشخيص.
- `INFO`: رسائل معلوماتية عامة.
- `WARN`: تحذيرات تشير إلى مشكلات محتملة.
- `ERROR`: أخطاء تعطل الوظيفة الطبيعية ولكنها تسمح بالاستمرار في التشغيل.

اختر المستوى الذي يناسب حالتك الاستخدامية بشكل أفضل. راجع [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) للحصول على تفاصيل إضافية حول كيفية استخدام مستويات السجل المختلفة.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip تحديث بيئة تنفيذ البرمجيات

هذا المعامل خاضع لتحديث تكوين بيئة تنفيذ البرمجيات من خلال نقاط نهاية المشغل API Torii.

:::

### `logger.filter` {#param-logger-filter}

مرشحات السجلات المحسنة بالإضافة إلى [`logger.level`](#param-logger-level). يسمح بتخصيص درجة التفصيل في السجلات لكل هدف.

<param-table type=string env=LOG_FILTER>
<template #type>

سلسلة، تتكون من توجيه واحد أو أكثر مفصولة بفواصل. قد يكون لكل توجيه مستوى أقصى من التفصيل يُمكّن (مثل: يحدد) الفواصل والأحداث التي تتطابق. Iroha يعتبر المستويات الأقل حصرية (مثل `trace` أو `info`) أكثر تفصيلاً من المستويات الأكثر حصرية (مثل `error` أو `warn`).

على مستوى عالٍ، تتكون البنية النحوية للتوجيهات من عدة أجزاء:

```
target[span{field=value}]=level
```

لمزيد من التفاصيل، انظر [`tracing-subscriber` توثيق](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info تركيب مع [`logger.level`](#param-logger-level)

`logger.filter` يعمل بالتعاون مع [`logger.level`](#param-logger-level) ولا أيٌّ منهما يكتب فوق الآخر.

على سبيل المثال، إذا تم تعيين `logger.level` إلى `INFO` وتم تعيين `logger.filter` إلى `iroha_core=debug`، فإن مجموعة الفلاتر الناتجة ستكون `info,iroha_core=debug` (أي `info` لجميع الوحدات، `debug` لـ `iroha_core`).

:::

::: tip تحديث بيئة تنفيذ البرمجيات

هذا المعامل خاضع لتحديث تكوين بيئة تنفيذ البرمجيات من خلال نقاط نهاية المشغل API Torii.

:::

### `logger.format` {#param-logger-format}

تنسيق السجلات.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

سلسلة، القيم المحتملة:

- `full`: المهيأ الافتراضي. يقوم هذا بإصدار سجلات قابلة للقراءة من قبل البشر، على شكل سطر واحد لكل حدث يحدث، مع عرض سياق النطاق الحالي قبل التمثيل المنسق للحدث.
- `compact`: نسخة من المنسق الافتراضي، مُحسّنة لأطوال الأسطر القصيرة. يتم إلحاق الحقول من سياق النطاق الحالي إلى حقول الحدث المنسق، ولا يتم عرض أسماء النطاقات؛ يتم اختصار مستوى التفصيل إلى حرف واحد.
- `pretty`: يصدر سجلات متعددة الأسطر وجميلة بشكل مفرط، محسّنة لسهولة قراءتها من قبل البشر. هذا مخصص بشكل أساسي للاستخدام في التطوير المحلي و تصحيح الأخطاء، أو لتطبيقات سطر الأوامر، حيث يكون التحليل الآلي والتخزين المدمج للسجلات أقل أهمية من القابلية للقراءة والجاذبية البصرية.
- `json`: يُخرج سجلات JSON مفصولة بأسطر جديدة. هذا مخصص للاستخدام في الإنتاج مع الأنظمة التي يتم فيها استهلاك السجلات المنظمة كـ JSON بواسطة أدوات التحليل والعرض. مخرجات JSON غير محسّنة لسهولة القراءة البشرية.

لمزيد من التفاصيل وعينات المخرجات، انظر [`tracing-subscriber` توثيق](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura هو محرك التخزين الدائم لـ Iroha (باليابانية تعني مستودع).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

سيتم تخزين آخر N كتل على الأكثر في الذاكرة.

سيتم إزالة الكتل القديمة من الذاكرة وتحميلها من القرص إذا كانت هناك حاجة إليها.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura وضع التهيئة. `strict` هو الوضع العادي والافتراضي: يقوم بالتحقق من سجل البروتوكول الفردي القياسي، والمستندات المستعادة، والفهارس المساعدة، ومحاسبة التخزين قبل أن يصبح العقدة نشطة.

`fast` هو وضع خدمة متدهورة للطوارئ لاستعادة الرؤية التشغيلية عندما يشكل التدقيق الكامل عند بدء التشغيل خطر حدوث انقطاع. يتطلب تخزينًا تم تهيئته مسبقًا بواسطة `strict` وتوليد عرض بيانات لنقطة زمنية حالية يحتوي على خمسة عناصر بالضبط: `snapshot.data`، `snapshot.sha256`، `snapshot.sig`، `snapshot.fast.norito`، و `snapshot.merkle.json`. يربط توقيع المشغل المفصول بالنطاق قيمة ملخص التشفير للحمل المعلن والبيان الفني المحدود؛ البيان الفني يربط طول الحمولة، وهوية السلسلة/الشبكة، ارتفاع/هاش الجهاز الطرفي، هاش تشفير السياسات SCCP، ووجود خط النشأة. يرفض Fast سلالة التمهيد ويتطلب نفس العلامة/العدد/حدود الطرف بالضبط من durable Kura. تقبل العقد في الإصدار الأول تلك القطع الفنية الخمسة بالضبط وترفض أي مجموعة عدد أو أسماء ملفات للقطع الفنية أخرى.

يستعرض بسرعة تلك الأسماء الخمسة ويربط البيانات الوصفية بالحزمة وملفات ميركل، لكنه لا يقرأ أو يجزّئ التوقيع التشفيري أو يحلل أو يفك تشفير محتوياتها. يقوم ببناء عالم/‎Nexus‎ الحد الأدنى من البيان الفني الموقع، ويربط بادئة التجزئة التشفيرية ‎Kura‎ الدقيقة للقراءة فقط، ويترك عرض بيانات النقطة الزمنية للعالم، ومصفوفة تجزئة الكتلة، وتاريخ المعاملات، والفهارس المشتقة، ويوميات الاسترداد الدائمة مغلقة. ميركل، تدقيقات عرض البيانات اللحظية المعيارية لبروتوكول واحد، تسوية الكتلة التاريخية/النهائية/SCCP، استعادة الارتفاع النشط Sumeragi، دمج واستعلام المجلات، قائمة مسار التنفيذ/مصادر الامتثال، أرشيفات مدعومة بـ Kura-SoraFS، تظل محاسبة التخزين التكرارية والمصالحات الخدمية الاختيارية مؤجلة. تظل إدخالات المعاملات المحلية، والمقترحات، والتصويت، وكتابات البروتوكول الواحد المعيارية، والمنتجون المساعدون معطلة. Kura نفسه يرفض بدء تشغيل الكاتب والطفرات الدائمة؛ سير عمل معالجة البرمجيات و FASTPQ قوائم انتظار الثبات ترفض العمل فورًا بدلاً من الاحتفاظ به أو ترميزه. Kura اقرأ APIs أيضًا قم بتعطيل سلوك الإصلاح ومزامنة المتانة: لا يتم ترقية السجلات المؤقتة المساعدة، ولا يتم نشر قطع الآثار المفقودة في مسار التنفيذ، ولا يتم مزامنة حواجز التقدم باستخدام fsync. Sumeragi ولا يتم إطلاق نشر المعاملات. Torii يكشف فقط عن عمليات الصحة، والنشاط، والاستعداد، وزملاء الشبكة، والتكوين؛ بينما تظل API-الإصدار، والحالة، والقياسات، وجميع مسارات الحالة/التاريخ العادية غير متاحة. يظل الاستعداد غير متاح حتى إعادة التشغيل الصارمة.

استخدم `fast` فقط للحادث. بمجرد أن تكون الخدمة مستقرة، أوقف العقدة، واستعد `strict`، وأعد التشغيل حتى يتم تشغيل كل فحص مؤجل وإعادة بناء الفهرس قبل استئناف الإنتاج. الوضع السريع لا يتطلب سجل الدمج المؤجل ولا يقوم بإنشاء أو إصلاح أو تقليص أو استيراد تخزين بمعيار البروتوكول الواحد؛ يتم تجاهل اللواحق غير المنشورة ومراحل الاسترداد المساعدة المعلقة دون قراءتها أو تعديلها، ثم تترك للاسترداد الصارم. لا يزال تسلسل عرض البيانات لحظة-بلحظة المستوردة المعتمدة على التجزئة غير متاح. فشل عرض البيانات الحالي للحظة-بلحظة المفقود أو غير الصالح على الفور؛ لا يعود Fast أبدًا إلى إعادة إنشاء العالم الفارغ أو إعادة التشغيل التاريخية.

<param-table default-value=strict>
<template #type>

سلسلة، القيم المحتملة:

- `strict`: التحقق الكامل والإنتاج الطبيعي
- `fast`: بدء تشغيل طارئ محدود مع احتجاز الإنتاج حتى إعادة التشغيل الصارمة

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

يحدد الدليل[^paths] حيث تُخزن الكتل.

انظر أيضًا: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

علامة لتمكين طباعة الكتل الجديدة على وحدة التحكم.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## صف {#queue}

### `queue.capacity` {#param-queue-capacity}

الحد الأقصى لعدد المعاملات المنتظر في الطابور.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

الحد الأعلى لعدد المعاملات المنتظرة في الطابور لمستخدم واحد.

استخدم هذا الخيار لتطبيق التقييد.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

سيتم إسقاط المعاملة بعد هذا الوقت إذا كانت لا تزال في القائمة.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

مفتاح للتصحيح فقط لتجربة مسارات معالجة الفوكات الناعمة Sumeragi. اتركه معطلًا خارج الاختبارات المراقبة؛ تغييره على شبكة إنتاج تعمل يمكن أن يجعل الأقران في الشبكة يختلفون حول سلوك التوافق.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus تسوية المعاملة المالية الخاصة الذرية {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` يتحكم في مسار `AtomicPrivateSettlementV1` المنفصل. يتم تعطيله افتراضيًا. تتطلب إعداد `enabled = true` أيضًا `activation_height`؛ ومع ذلك، لا تزال عملية القبول تفشل مغلقة ما لم تكن القدرة على السلسلة، وفترة الإشعار، وملف الإثبات الثابت، وحوكمة التجمع/التدقيق نشطة.

الحدود الرئيسية هي `max_participants`، `max_expiry_blocks`، `audit_timeout_blocks`، `prepare_timeout_blocks`، `commit_timeout_blocks`، `max_proof_bytes`، `max_capsule_bytes`، `max_carrier_bytes`، `sidecar_retention_blocks`، `sidecar_max_records`، و`sidecar_max_total_bytes`. يجب أن يكون `capsule_padding_classes_bytes` مجموعة فرعية متزايدة بصرامة من فئات الحشو V1. يقبل `permitted_policy_versions` فقط V1.

`max_capsule_bytes` يقيس بروتوكولًا واحدًا بالمعيار Norito لبايتات `PrivateSettlementAuditCapsuleV1` الكاملة، بما في ذلك AAD، قيمة التشفير العشوائي، النص المشفر، تأطير المتجه، وكل صف DEK ملفوف بواسطة المدقق؛ إنه ليس حدًا يعتمد فقط على النص المشفر. يجب أن تتناسب كل فئة حشو ممكنة مع حاوية البيانات الكاملة المحافظة على الأقل مع `default_min_auditor_approvals` من المدققين. هذا الإعداد للموافقة هو أيضًا حد أدنى مُنظَّم: Torii يرفض بوليصة تم قبولها حديثًا بقيمة `min_approvals` أقل ويرفض أي كبسولة فعلية تتجاوز حد البايت الواحد وفق معيار البروتوكول.

لا تحتوي هذه الإعدادات على تجاوز تنشيط متغير البيئة للإنتاج. انظر [تشغيل تسوية المعاملات المالية الخاصة الذرية عبر فضاءات البيانات](/ar/get-started/atomic-private-settlement) للحصول على مثال التكوين الكامل ومتطلبات التشغيل. المسار غير مؤهل للإنتاج حتى تمر بوابات الإصدار الخارجية الموثقة.

## عرض بيانات لحظة زمنية معينة {#snapshot}

هذه الوحدة مسؤولة عن قراءة وكتابة عروض البيانات اللحظية لـ [عرض حالة العالم](/ar/blockchain/world#world-state-view-wsv).

تخزن عروض البيانات اللحظية نقطة تحقق متسلسلة لعرض حالة العالم بحيث يمكن لند لشبكة إعادة التشغيل دون إعادة تشغيل كل كتلة من Kura. يظل Kura سجل الكتل الدائم ومصدر الحقيقة لإعادة التشغيل؛ عروض البيانات اللحظية هي مسار تسريع. عند بدء التشغيل، يقوم Iroha بفحص بيانات وصفة عرض البيانات في نقطة زمنية معينة مقابل السلسلة المُكوَّنة والكتل المخزنة قبل أن يقرر ما إذا كان سيقوم بتحميل عرض بيانات في نقطة زمنية معينة أو الرجوع إلى إعادة التشغيل.

::: tip مسح عروض بيانات النقطة الزمنية

في حالة وجود مشكلة في نظام عرض البيانات في لحظة معينة، وإذا كنت تريد البدء من صفحة فارغة (من حيث عروض البيانات في نقطة زمنية معينة)، يمكنك إزالة الدليل المحدد بواسطة [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

الوضع الذي يعمل فيه نظام عرض البيانات في نقطة زمنية معينة.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

سلسلة، القيم المحتملة:

- `read_write`: Iroha ينشئ عروض بيانات في نقطة زمنية مع فترة محددة بواسطة [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). عند بدء التشغيل, Iroha يقرأ عرض بيانات لنقطة زمنية موجودة (إن وجدت) ويتحقق من أنها محدثة مع تخزين الكتل.
- `readonly`: مشابه لـ `read_write` لكن Iroha لا ينشئ أي لقطات.
- `disabled`: Iroha لا ينشئ أي عروض بيانات جديدة لحظة بلحظة ولا يقرأ عرضًا موجودًا عند بدء التشغيل.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

تكرار اللقطات.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

الدليل لتخزين اللقطات.

انظر أيضًا: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## التحكم عن بُعد {#telemetry}

تقوم القياس عن بعد بتصدير تشخيص نظير الشبكة إلى مجمّع قياس عن بعد خارجي. قم بتكوين كل من `telemetry.name` و `telemetry.url` عندما يجب أن يبلغ نظير الشبكة المجمّع؛ اغفل القسم عندما لا يتم استخدام القياس عن بعد.

`name` و `url` يجب أن يتم اقترانهما.

كل قسم `telemetry` اختياري.

### `telemetry.name` {#param-telemetry-name}

اسم العقدة ليتم عرضه على أجهزة القياس عن بُعد.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

الـ WebSocket URL لجامع القياس عن بُعد.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

الحد الأدنى للفترة الزمنية التي يجب انتظارها قبل إعادة الاتصال.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

الأس الأقصى للقوة 2 المستخدم لزيادة التأخير بين إعادة الاتصال.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

مسار الملف لكتابة تتبع التطوير

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
