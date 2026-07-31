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

# معايير التشغيل {#configuration-parameters}

[toc]

## مستوى الجذر {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

السلسلة ID التي يجب أن يتم تضمينها في كل معاملة. تستخدم لمنع هجمات إعادة التداول.

الهجوم المتكرر هو محاولة لإرسال معاملة صالحة إلى شبكة مختلفة عن تلك التي كانت موجهة لها. لأن `chain` هو جزء من الحمل المفيد للمعاملات الموقعة، يتم رفض المعاملة الموقعة لسلسلة واحدة من قبل النظراء الذين يستخدمون سلسلة أخرى ID.

<param-table type=string env=CHAIN />

::: مجموعة رموز

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

المفاتيح العامة للقرابة. يجب أن تستخدم أقرابة مؤكدات الإجماع BLS - المفاتيح الطبيعية.

<param-table type="public-key" env="PUBLIC_KEY" />

::: مجموعة رموز

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

المفتاح الخاص للقرابة: يجب أن يطابق `public_key`؛ يجب أن تستخدم الأقران المؤكدة بالإجماع BLS-المفاتيح الطبيعية.

<param-table type="private-key" env="PRIVATE_KEY" />

::: مجموعة رموز

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

قائمة من أقرانهم الموثوقين

يجب أن يستخدم مؤكدون الإجماع مفاتيح BLS-القرابة العادية. لكل مؤكد، قم بتوفير إدخال متطابق [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

صف من سلسلة الأقران. استخدم `PUBLIC_KEY@ADDRESS` عندما يكون عنوان P2P معروفًا ؛ يتم قبول `PUBLIC_KEY` العارض أيضًا ويسمح للعثور على عنوان الأقران من الضجة.

</template>
</param-table>

::: مجموعة رموز

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

BLS إدخالات دليل على امتلاك المؤكّد الأقارب الموثوق بهم.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

صف من الأشياء مع حقل `public_key` و `pop_hex`

</template>
</param-table>

::: مجموعة رموز

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

مسار الملف إلى الحمل المفيد الذي تم إنشاؤه بواسطة `kagami genesis sign`. عادة ما تكتب ملفات الشخصية التي يتم إنشاؤها هذا باعتباره ملف Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: مجموعة رموز

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

مفتاح عام من زوج مفتاح جينيس

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: مجموعة رموز

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

عنوان الاتصالات p2p لأغراض التوافق (sumeragi) وتزامن الكتلة (block_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: مجموعة رموز

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

العنوان بين الأقران (الخارجي، كما يرى أقرانهم الآخرون).

سيتم الإشاعات إلى أقرانهم المرتبطين حتى يتمكنوا من إشاعاتها لأقرانهم الآخرين.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: مجموعة رموز

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

::: مجموعة رموز

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

الفاصل الزمني بين الطلبات من الأقران على أحدث كتلة.

الإشاعات المتكررة تقلل من وقت المزامنة، ولكن يمكن أن تزيد من عبء الشبكة.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: مجموعة رموز

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

أقصى عدد من المعاملات في الرسالة الشائعة.

الحجم الأصغر يؤدي إلى وقت أطول للتزامن، ولكنه مفيد إذا كان لديك خسارة كبيرة من الحزم.

<param-table type=number default-value=500 />

::: مجموعة رموز

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

فترة الشائعات في انتظار المعاملة بين الأقران.

الإشاعات المتكررة تقلل من وقت المزامنة، ولكن يمكن أن تزيد من عبء الشبكة.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: مجموعة رموز

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

مدة الوقت التي تنتهي فيها الاتصال مع الزملاء إذا كان الزملاء غير مشغولين.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: مجموعة رموز

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

العنوان الذي يجب أن يستمع إليه الخادم Torii والذي يقوم العميل بقدمه طلباته.

<param-table type=socket-addr env=API_ADDRESS />

::: مجموعة رموز

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

الحد الأقصى من البايتات في جسم الطلب الخام المقبول بواسطة نقاط نهاية [Torii ](/ar/reference/torii-endpoints.md).

يستخدم هذا الحد لمنع الهجمات DOS.

<param-table>
<template #type>

عدد (بالبايت)

</template>
<template #default-value>

`64_000_000` (64 مليون بايت)

</template>
</param-table>

::: مجموعة رموز

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

الوقت الذي يمكن أن يبقى فيه البحث في المتجر إذا لم يتم الوصول إليه.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: مجموعة رموز

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

الحد الأعلى لعدد الاستفسارات المباشرة.

<param-table type=number default-value=128 />

::: مجموعة رموز

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

الحد الأعلى لعدد الاستفسارات المباشرة لمستخدم واحد.

<param-table type=number default-value=128 />

::: مجموعة رموز

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## الخشبية {#logger}

### `logger.level` {#param-logger-level}

الكلمات العامة في التسجيل (انظر [ `logger.filter`](#param-logger-filter) للتكوين المعقّد).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

السلاسل، القيم المحتملة:

- `TRACE`: جميع الأحداث، بما في ذلك العمليات منخفضة المستوى.
- `DEBUG`: رسائل على مستوى التحليل، مفيدة للتشخيص.
- `INFO`: رسائل معلومات عامة.
- `WARN`: تحذيرات تشير إلى مشكلات محتملة.
- `ERROR`: الأخطاء التي تعيق الوظيفة الطبيعية ولكنها تسمح باستمرار العمل.

اختر المستوى الذي يناسب حالة الاستخدام الخاصة بك. راجع [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) للحصول على تفاصيل إضافية حول كيفية استخدام مستويات السجل المختلفة.

</template>
</param-table>

::: مجموعة رموز

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip تحديث وقت التشغيل

هذه المعلمة تخضع لتحديث تشكيل وقت التشغيل من خلال نقاط نهاية عامل Torii.

:::

### `logger.filter` {#param-logger-filter}

مرشحات السجل المكررة بالإضافة إلى [`logger.level`](#param-logger-level). يسمح بتخصيص صيغة التسجيل لكل هدف.

<param-table type=string env=LOG_FILTER>
<template #type>

السلسلة، تتكون من إحدى أو أكثر من المبادئ التوجيهية المنفصلة عن بعضها البعض بواسطة العنصرات. يمكن لكل إرشادة أن يكون لها مستوى أقصى للفصائل المقابلة الذي يسمح (على سبيل المثال، يختار) بالفترات والحداثات المتطابقة. تعتبر Iroha مستويات أقل حصراً (مثل `trace` أو `info`) أكثر صلابة من المستويات الأكثر حصراً [مثل `error` أو `warn`).

على مستوى مرتفع، يتكون النصوصية للاتجاهات من عدة أجزاء:

```
target[span{field=value}]=level
```

للحصول على مزيد من التفاصيل، انظر [`tracing-subscriber` وثائق](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: مجموعة رموز

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info الموافقة مع [`logger.level`](#param-logger-level)

يعمل `logger.filter` مع [`logger.level`](#param-logger-level) ولا أحد يغطى الآخر.

على سبيل المثال، إذا `logger.level` يتم تعيينها `INFO` و `logger.filter` يتم تعيينها `iroha_core=debug`, ستكون مجموعة الصفحات الناتجة `info,iroha_core=debug` (أي `info` لجميع الوحدات، `debug` لـ `iroha_core`).

:::

::: tip تحديث وقت التشغيل

هذه المعلمة تخضع لتحديث تشكيل وقت التشغيل من خلال نقاط نهاية عامل Torii.

:::

### `logger.format` {#param-logger-format}

شكل السجلات.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

السلاسل، القيم المحتملة:

- `full`: المنسق الافتراضي. يقوم هذا بإصدار سجلات قابلة للقراءة من قبل الإنسان، ذات خط واحد لكل حدث يحدث، مع عرض السياق الزمني الحالي قبل التعبير عن الحدث بشكل مُصمم.
- `compact`: خيار من المنسق الافتراضي ، المحسّن لمدى الخط القصير. يتم إرفاق الحقول من سياق الإطار الحالي إلى حقل الأحداث المصممة ، ولا يتم عرض أسماء الإطار ؛ يتم اختصار مستوى الكلمات إلى حرف واحد.
- `pretty`: إصدار سجلات جميلة للغاية، متعددة الخطوط، محسنة للقراءة البشرية. هذا هو المقصود أساسا لاستخدامها في التطوير المحلي وإزالة الأخطاء، أو لتطبيقات خط الأوامر, حيث أن التحليل الآلي وتخزين الكمباك للمسجلات أقل أهمية من القراءة والجاذبية البصرية.
- `json`: إنتاج سجلات جديدة محددة الخطوط JSON. هذا مصممة لاستخدام الإنتاج مع الأنظمة التي يتم استهلاك السجلات المهيكلة مثل JSON من خلال أدوات التحليل والمشاهدة. لم يتم تحسين إنتاج JSON لقراءة البشر.

للحصول على مزيد من التفاصيل ومخرجات العينات، انظر [`tracing-subscriber` الوثيقة ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: مجموعة رموز

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura هو محرك التخزين المستمر لـ Iroha (اليابانية للتخزين).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

في أقصى حد سيتم تخزين N الكتل الأخيرة في الذاكرة.

سيتم إسقاط الكتل القديمة من الذاكرة و تحميلها من القرص إذا لزم الأمر

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: مجموعة رموز

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

السلاسل، القيم المحتملة:

- `strict`: اعتماد صارم لجميع الكتل
- `fast`: البداية السريعة مع عمليات التفتيش الأساسية فقط

</template>
</param-table>

::: مجموعة رموز

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

::: مجموعة رموز

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

العلامة تمكن من طباعة كتلة جديدة على الكونسول.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: مجموعة رموز

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

::: مجموعة رموز

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

الحد الأعلى لعدد المعاملات التي تنتظر في الصف لمستخدم واحد.

استخدم هذه الخيارة لتطبيق التدفق.

<param-table type=number default-value=65_536 />

::: مجموعة رموز

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

سيتم إلغاء المعاملة بعد هذا الوقت إذا كانت مازالت في الصف.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: مجموعة رموز

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

مفتاح إزالة الأخطاء فقط لممارسة مسارات معالجة الشوكة الناعمة Sumeragi. اترك هذا المحذوف خارج الاختبارات السيطرة؛ تغييره على شبكة إنتاج جارية يمكن أن يجعل الأقران غير متفقين حول سلوك التوافق.

<param-table type=bool default-value=false />

::: مجموعة رموز

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## صورة سريعة {#snapshot}

هذه الوحدة هي المسؤولة عن قراءة وصياغة اللقطات الفورية لـ [World State View](/ar/blockchain/world#world-state-view-wsv).

تخزن اللقطات الفورية نقطة تفتيش متسلسلة لمشاهدة الدولة العالمية بحيث يمكن للقرابة إعادة تشغيلها دون إعادة تشغل كل كتلة من Kura. Kura يبقى تاريخ الكتل الدائم ومصدر الحقيقة لإعادة تشغيله. عند البدء ، يقوم Iroha بتحقق من بيانات اللقطة الفورية ضد السلسلة التي تم تشكيلها والبلوكز المخزنة قبل اتخاذ قرار ما إذا كان يجب تحميل اللقطة أو العودة إلى التشغيل.

::: tip مسح اللقطات الفورية

في حال كان هناك خطأ ما مع نظام اللقطات الفورية، وترغب في البدء من صفحة فارغة (من حيث اللقطات فوريًا) ، يمكنك إزالة المجلد المحدد عن طريق [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

الوضع الذي يعمل فيه نظام Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

السلاسل، القيم المحتملة:

- `read_write`: يخلق Iroha لقطات سريعة مع فترة محددة في [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). عند البدء ، يقرأ Iroha لقطة سريعة قائمة (إذا كانت موجودة) ويتحقق من أنها حديثة مع مخزن الكتل.
- `readonly`: مشابهة ل `read_write` ولكن Iroha لا تخلق أي اللقطات الفورية.
- `disabled`: Iroha لا تخلق لقطات سريعة جديدة ولا تقرأ واحدة قائمة عند بدء العمل.

</template>
</param-table>

::: مجموعة رموز

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

تردد اللقطات.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: مجموعة رموز

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

دليل حيث تخزين اللقطات.

انظر أيضاً: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: مجموعة رموز

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## الهوائية {#telemetry}

تقوم "التليميتريا" بتصدير تشخيص الأقران إلى مجمع التليميترية الخارجي. قم بتشغيل `telemetry.name` و `telemetry.url` عندما يتعين على النسيق أن يقدم تقريرًا إلى الجمع؛ فلتفوت القسم عندما لا تستخدم التليميتري .

`name` و `url` يجب أن تكون مزدوجة.

جميع القسم `telemetry` اختياري.

### `telemetry.name` {#param-telemetry-name}

اسم العقدة ليتم عرضها على جهاز التلفاز.

<param-table type=string />

::: مجموعة رموز

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL من جهاز جمع التلفاز.

<param-table type=string />

::: مجموعة رموز

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

الحد الأدنى لفترة الانتظار قبل إعادة الاتصال.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: مجموعة رموز

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

الحد الأقصى من 2 الذي يستخدم لزيادة التأخير بين الاتصالات.

<param-table type=number default-value=4 />

::: مجموعة رموز

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

طريق الملف للكتابة التلفزيونية إلى

<param-table type=file-path />

::: مجموعة رموز

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
