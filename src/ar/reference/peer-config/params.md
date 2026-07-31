---
translation_locale: ar
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# معايير الإعداد {#configuration-parameters}

[توك]

## مستوى الجذر {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

السلسلة ID يجب أن يتم إدراجها في كل معاملة تستخدم لمنع هجمات التكرار

هجوم التكرار هو محاولة لتقديم معاملة صالحة إلى شخص آخر
الشبكة أكثر مما كانت مصممة لها. `chain` هو جزء من
الحمل المفيد للمعاملة التي تم توقيعها، يتم رفض المعاملة التي وقعت لسلسلة واحدة
بواسطة أقرانهم الذين يستخدمون سلسلة أخرى ID.

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

المفتاح العام للقران. يجب أن يستخدم مؤكد التوافق BLS-المفاتيح العادية

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

المفتاح الخاص لقرانه يجب أن يتطابق `public_key`; أقرانهم المؤكدين للاتفاق
يجب أن تستخدم BLS-المفاتيح العادية

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

قائمة من الأقران الموثوقين

يجب أن يستخدم مؤكدون الإجماع BLS-المفاتيح العادية للقرابة لكل مؤكدة
تزويد بتطابق [`trusted_peers_pop`](#param-trusted-peers-pop) دخول.

<param-table env="TRUSTED_PEERS">
<template #type>

مجموعة من السلاسل المتساوية. `PUBLIC_KEY@ADDRESS` عندما P2P العنوان معروف
عاري `PUBLIC_KEY` يُقبل أيضاً ويتم اكتشاف عنوان الأقران من
الشائعات.

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

BLS إدخالات دليل على امتلاك المؤكد للزملاء الموثوق بهم.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

صف من الأشياء مع `public_key` و `pop_hex` الحقول

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

## التكوين {#genesis}

### `genesis.file` {#param-genesis-file}

مسار الملف إلى حمولة كتلة التكوين الموقعة التي تم إنشاؤها من `kagami genesis sign`.
الملفات الشخصية التي تم إنشاؤها عادة ما تكتب هذا Norito `.nrt` الملف.

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

مفتاح عام لزوج مفتاح جينيس

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

## الشبكة {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

عنوان الاتصالات p2p للتوافق (sumeragi) وتزامن الكتل (الكتل_المزامنة) الغايات.

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

عنوان من ذوي الصلة إلى ذوي الالصلة (خارجي، كما يراه أقرانهم الآخرون).

سيتم الإشاعات إلى أقرانهم المتواصلين حتى يتمكنوا من إشاعاتها لأقاربهم الآخرين.

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

الفاصل الزمني بين طلبات إلى الأقران على أحدث كتلة.

الإشاعات المتكررة تقلل من وقت المزامنة، ولكن يمكن أن تزيد من عبء الشبكة.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

أقصى عدد من المعاملات في الرسالة الشائعة.

الحجم الأصغر يؤدي إلى وقت أطول للتزامن، ولكنه مفيد إذا كان لديك فقدان كبير.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

فترة الشائعات في انتظار المعاملة بين الأقران

الإشاعات المتكررة تقلل من وقت المزامنة، ولكن يمكن أن تزيد من عبء الشبكة.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

مدة الوقت التي يتم فيها إنهاء الاتصال مع الزملاء إذا كان الزملاء غير مشغولين.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

العنوان Torii يجب أن يستمع الخادم والذي يقوم العميل بطلباته.

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

الحد الأقصى من البايتات في جسم الطلب الخام المقبول من قبل
[Torii النقاط النهائية](/ar/reference/torii-endpoints.md).

يستخدم هذا الحد لمنع DOS الهجمات

<param-table>
<template #type>

عدد البايتات

</template>
<template #default-value>

`64_000_000` (64 مليون بايت)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

الوقت الذي يمكن أن يبقى فيه السؤال في المتجر إذا لم يتم الوصول إليه.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

الحد الأعلى لعدد الاستفسارات المباشرة

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

الحد الأعلى لعدد الاستفسارات المباشرة للمستخدم الواحد.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## الخشب {#logger}

### `logger.level` {#param-logger-level}

_جنرال_ إدراج الكلمات (انظر [`logger.filter`](#param-logger-filter) للتكوين المعقّد).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

السلاسل، القيم الممكنة:

- `TRACE`: جميع الأحداث، بما في ذلك العمليات منخفضة المستوى.
- `DEBUG`: رسائل مستوى التحليل، مفيدة للتشخيص.
- `INFO`: رسائل إعلامية عامة
- `WARN`: تحذيرات تشير إلى مشاكل محتملة
- `ERROR`: الأخطاء التي تعيق الوظيفة الطبيعية ولكنها تسمح باستمرار العمل.

اختر المستوى الذي يناسبك بشكل أفضل في حالة الاستخدام
[التدفقات الزائدة](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) لـ إضافية
تفاصيل حول كيفية استخدام مستويات السجل المختلفة.

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

::: tip تحديث وقت التشغيل

هذا المعلم يخضع لتحديث تشكيل وقت التشغيل من خلال Torii نقاط النهاية للمشغل

:::

### `logger.filter` {#param-logger-filter}

مرشحات السجل المكررة بالإضافة إلى [`logger.level`](#param-logger-level). يسمح بتخصيص الكلمات المستخدمة في التسجيل
في ..._الهدف_.

<param-table type=string env=LOG_FILTER>
<template #type>

السلسلة، تتكون من إحدى أو أكثر التوجيهات المنفصلة عن بعضها البعض.
_مستوى_ والتي تمكن (مثل _تحديدات_) المدة والحوادث المتطابقة. Iroha يعتبر مستويات أقل حصرية (مثل
`trace` أو `info`أن تكون أكثر حرفية من المستويات الأكثر حصرية (مثل `error` أو `warn`).

على مستوى مرتفع، يتكون النصوصية للموجبات من عدة أجزاء:

```
target[span{field=value}]=level
```

لمزيد من التفاصيل، انظر
[`tracing-subscriber` الوثائق](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info التوافق مع [`logger.level`](#param-logger-level)

`logger.filter` الأعمال _معاً_ مع [`logger.level`](#param-logger-level) ولا يكتبون على الآخرين

على سبيل المثال، إذا `logger.level` يتم تعيينها `INFO` و `logger.filter` يتم تعيينها `iroha_core=debug`, المرشح الناتج
المجموعة ستكون `info,iroha_core=debug` (أي `info` لجميع الوحدات، `debug` لـ `iroha_core`).

:::

::: tip تحديث وقت التشغيل

هذا المعلم يخضع لتحديث تشكيل وقت التشغيل من خلال Torii نقاط النهاية للمشغل

:::

### `logger.format` {#param-logger-format}

شكل السجلات.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

السلاسل، القيم الممكنة:

- `full`: المنسق الافتراضي. هذا ينبعث من القراءة البشرية، سجلات خط واحد لكل حدث يحدث، مع
  السياق الحالي الذي يتم عرضه قبل التعبير المنسق عن الحدث.
- `compact`: إصدار متغير من المنسق الافتراضي ، المحسنة لمدى خطوط قصيرة. الحقول من سياق المدة الحالية
  يتم إرفاقها إلى حقل الحدث المنسق ، ولا يتم عرض أسماء الفترة ؛ يتم اختصار مستوى الكلام إلى
  شخصية واحدة
- `pretty`: إصدار سجلات جميلة للغاية، متعددة الخطوط، محسنة للقراءة البشرية.
  تستخدم في التطوير المحلي وإعداد التحليلات أو لتطبيقات خط الأوامر، حيث يتم تحليلها الآلي وتحقيقها بشكل مشترك.
  تخزين السجلات أقل أهمية من القراءة والجاذبية البصرية.
- `json`: النتائج الجديدة المحدودة JSON السجلات. هذا مصممة لاستخدام الإنتاج مع الأنظمة التي يتم فيها استخدام السجلات المهيكلة
  يتم استهلاكها ك JSON من خلال أدوات التحليل والمشاهدة JSON المخرجات غير محسنة للقراءة البشرية.

للحصول على مزيد من التفاصيل ومخرجات العينة، انظر
[`tracing-subscriber` الوثائق](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_كورا_ هو محرك التخزين المستمر Iroha (باليابانية _مستودع_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

في أقصى حد سيتم تخزين N الكتل الأخيرة في الذاكرة.

سيتم إسقاط الكتل القديمة من الذاكرة وتحملها من القرص إذا لزم الأمر.

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

Kura وضع البدء

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

السلاسل، القيم الممكنة:

- `strict`: التحقق الصارم من جميع الكتل
- `fast`: البدء السريع مع عمليات التحقق الأساسية فقط

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

يحدد المجلد [^paths] حيث يتم تخزين الكتل.

انظر أيضاً: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

العلامة لتمكين طباعة كتلة جديدة على الكونسول.

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

## الصف {#queue}

### `queue.capacity` {#param-queue-capacity}

الحد الأعلى لعدد المعاملات التي تنتظر في الصف.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

الحد العلوي لعدد المعاملات التي تنتظر في الصف لمستخدم واحد.

استخدم هذه الخيارة لتطبيق الاختناق.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

سيتم إلغاء المعاملة بعد هذا الوقت إذا كانت لا تزال في الصف.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

مفتاح التحكم فقط للتمرين Sumeragi مسارات التعامل مع الشوكة الناعمة.
تعطيل خارج الاختبارات المراقبة؛ تغييرها على شبكة إنتاج جارية
يمكن أن تجعل الأقران يختلفون حول سلوك التوافق.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## صورة سريعة {#snapshot}

هذه الوحدة هي المسؤولة عن قراءة وتسجيل اللقطات
[وجهة نظر العالم](/ar/blockchain/world#world-state-view-wsv).

الصور السريعة تخزين نقطة تفتيش متسلسلة لمشاهدة الدولة العالمية بحيث يمكن للزملاء
إعادة تشغيل دون إعادة تعزيف كل كتلة من Kura. Kura يبقى الكتلة الدائمة
التاريخ ومصدر الحقيقة للتشغيل؛ اللقطات هي مسار تسريع.
عند البدء Iroha يتحقق من البيانات المعدنية لقطة الفورية ضد السلسلة التي تم تشكيلها
الكتل المخزنة قبل أن تقرر ما إذا كان يجب تحميل اللقطة أو العودة إلى التشغيل.

::: tip مسح اللقطات الفورية

في حالة إذا كان هناك شيء خاطئ مع نظام اللقطات الفورية، وتريد أن تبدأ من صفحة فارغة (من حيث
اللقطات الفورية) ، يمكنك إزالة السجل المحدد من قبل [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

الوضع الذي يعمل فيه نظام الصور السريعة.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

السلاسل، القيم الممكنة:

- `read_write`: Iroha يخلق اللقطات الفورية مع فترة محددة من:
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). عند البدء Iroha يقرأ صورة مفاجئة موجودة (إذا وجدت)
  وتحقق من تحديثها مع تخزين الكتل.
- `readonly`: مماثلة `read_write` لكن Iroha لا يخلق أي صور.
- `disabled`: Iroha لا تخلق صور جديدة ولا تقرأ واحدة قائمة عند البدء.

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

تكرار الصور الفورية

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

دليل حيث تخزين اللقطات

انظر أيضاً: [`kura.store_dir`](#param-kura-store-dir)

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

## التليومترية {#telemetry}

التلفزيون تصدير تشخيصات الأقران إلى جمع متري خارجي.
كلاهما `telemetry.name` و `telemetry.url` عندما يتعين على زميل الإبلاغ
المجموعة؛ إغفال القسم عندما لا تستخدم التلفاز.

`name` و `url` يجب أن تكون مزدوجة.

جميعهم `telemetry` القسم اختياري

### `telemetry.name` {#param-telemetry-name}

اسم العقد يجب أن يعرض على جهاز التلفاز.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

(الـ) WebSocket URL من مجموعة التلفونيات

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

الحد الأدنى لفترة الانتظار قبل إعادة الاتصال.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

الحد الأقصى من 2 الذي يستخدم لزيادة التأخير بين إعادة الاتصال.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

طريق الملف للكتابة التلفزيونية إلى

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
