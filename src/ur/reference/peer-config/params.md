---
translation_locale: ur
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# ترتیب کے پیرامیٹرز {#configuration-parameters}

[toc]

## جڑ سطح {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

چین ID جو ہر ٹرانزیکشن میں شامل ہونا ضروری ہے۔ دوبارہ کھیلنے کے حملوں کو روکنے کے لئے استعمال کیا جاتا ہے۔

ری پلے حملے ایک درست ٹرانزیکشن کو اس سے مختلف نیٹ ورک میں جمع کرنے کی کوشش ہے جس کے لئے یہ ارادہ کیا گیا تھا۔ چونکہ `chain` دستخط شدہ لین دین کے مفید بوجھ کا حصہ ہے ، لہذا ایک سلسلہ کے لئے دستخط کردہ لین دین کو دوسرے چین ID کا استعمال کرنے والے ہم مرتبہ رد کرتے ہیں۔

<param-table type=string env=CHAIN />

::: کوڈ گروپ

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

ہم منصب کی عوامی کلید۔ اتفاق رائے کے تصدیق کنندہ ہم منصبوں کو BLS-معمولی چابیاں استعمال کرنا ضروری ہے۔

<param-table type="public-key" env="PUBLIC_KEY" />

::: کوڈ گروپ

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

پیئر کی نجی کلید۔ اسے `public_key` سے ملنا چاہئے؛ اتفاق رائے کے تصدیق کنندہ پیئرز کو BLS-معمولی چابیاں استعمال کرنا چاہئیں۔

<param-table type="private-key" env="PRIVATE_KEY" />

::: کوڈ گروپ

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

قابل اعتماد ہم عمر افراد کی فہرست

اتفاق رائے کی توثیق کرنے والوں کو BLS-معمولی ہم مرتبہ چابیاں استعمال کرنا چاہئیں۔ ہر توثیق کنندہ کے لئے ، ایک مماثل [`trusted_peers_pop`](#param-trusted-peers-pop) اندراج بھی فراہم کریں۔

<param-table env="TRUSTED_PEERS">
<template #type>

پیئر سٹرنگز کی صف۔ `PUBLIC_KEY@ADDRESS` کا استعمال کریں جب P2P ایڈریس معلوم ہو؛ خالی `PUBLIC_KEY` بھی قبول کیا جاتا ہے اور اس سے پیئر ایڈریس کو گپ شپ سے دریافت کیا جاسکتا ہے۔

</template>
</param-table>

::: کوڈ گروپ

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

BLS تصدیق کنندہ کے قابل اعتماد ہم مرتبہ کے لئے ثبوت کے اندراجات.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` اور `pop_hex` فیلڈ کے ساتھ اشیاء کی صف

</template>
</param-table>

::: کوڈ گروپ

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

## پیدائش {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` کی طرف سے پیدا کردہ دستخط شدہ جینس بلاک کے مفید بوجھ تک فائل کا راستہ۔ جنریٹڈ پروفائلز عام طور پر اسے Norito `.nrt` فائل کے طور پر لکھتے ہیں۔

<param-table type="file-path" env="GENESIS" />

::: کوڈ گروپ

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

جینیس کی چابی کا عوامی کلید۔

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: کوڈ گروپ

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## نیٹ ورک {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

اتفاق رائے (sumeragi) اور بلاک مطابقت پذیری (block_sync) کے مقاصد کے لئے p2p مواصلات کا پتہ۔

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: کوڈ گروپ

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

ہم مرتبہ سے ہم مرتبہ ایڈریس (بیرونی، جیسا کہ دوسرے ہم مرتبہ دیکھتے ہیں) ۔

وہ اپنے ہم عمر ساتھیوں کے ساتھ گپ شپ کریں گے تاکہ وہ دوسرے ہم عمر افراد کو بھی گپ شپ کر سکیں۔

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: کوڈ گروپ

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

بلاک کی تعداد جو ایک ہی ہم وقت سازی کے پیغام میں بھیجا جا سکتا ہے.

<param-table type=number default-value=4 />

::: کوڈ گروپ

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

تازہ ترین بلاک کے لئے ہم مرتبہ کی درخواستوں کے درمیان وقت کا وقفہ۔

زیادہ کثرت سے گپ شپ کرنے سے ہم آہنگی کا وقت کم ہوجاتا ہے، لیکن یہ نیٹ ورک پر بوجھ ڈال سکتا ہے۔

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: کوڈ گروپ

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

گپ شپ بیچ میسج میں زیادہ سے زیادہ لین دین کی تعداد۔

چھوٹے سائز کے نتیجے میں مطابقت پذیر ہونے کا وقت زیادہ ہوتا ہے، لیکن اگر آپ کے پاس اعلی پیکیج نقصان ہے تو مفید ہے.

<param-table type=number default-value=500 />

::: کوڈ گروپ

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

ہم عمر افراد کے درمیان ٹرانزیکشن کے منتظر گپ شپنگ کی مدت۔

زیادہ کثرت سے گپ شپ کرنے سے ہم آہنگی کا وقت کم ہوجاتا ہے، لیکن یہ نیٹ ورک پر بوجھ ڈال سکتا ہے۔

<param-table type=millis default-value=1_000 default-note="1 second" />

::: کوڈ گروپ

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

وقت کی مدت جس کے بعد ہم مرتبہ کے ساتھ رابطہ ختم ہو جاتا ہے اگر ہم مرتبہ بیکار ہے۔

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: کوڈ گروپ

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

وہ ایڈریس جس پر Torii سرور کو سننے کی ضرورت ہے اور جس پر کلائنٹ اپنی درخواستیں پیش کرتے ہیں۔

<param-table type=socket-addr env=API_ADDRESS />

::: کوڈ گروپ

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

خام درخواست کے جسم میں بائٹس کی زیادہ سے زیادہ تعداد [Torii اختتامی پوائنٹس ](/ur/reference/torii-endpoints.md) کے ذریعہ قبول شدہ۔

اس حد کا استعمال DOS حملوں کو روکنے کے لئے کیا جاتا ہے۔

<param-table>
<template #type>

تعداد (بائیٹس)

</template>
<template #default-value>

`64_000_000` (64 ملین بائٹس)

</template>
</param-table>

::: کوڈ گروپ

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

اس وقت جب اسٹور میں کوئی استفسار باقی رہ سکتا ہے اگر تک رسائی حاصل نہیں کی گئی ہو۔

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: کوڈ گروپ

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

براہ راست سوالات کی تعداد کی اوپری حد۔

<param-table type=number default-value=128 />

::: کوڈ گروپ

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ایک ہی صارف کے لیے براہ راست سوالات کی تعداد کی اوپری حد۔

<param-table type=number default-value=128 />

::: کوڈ گروپ

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## کارخانہ دار {#logger}

### `logger.level` {#param-logger-level}

عام لاگنگ وربوسیٹی (دیکھیں [ `logger.filter`](#param-logger-filter) بہتر ترتیب کے لئے).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

سٹرنگ، ممکنہ اقدار:

- `TRACE`: تمام واقعات، کم سطح کی کارروائیوں سمیت۔
- `DEBUG`: ڈیبگ سطح کے پیغامات، تشخیص کے لئے مفید.
- `INFO`: عام معلوماتی پیغامات۔
- `WARN`: انتباہات جو ممکنہ مسائل کی نشاندہی کرتی ہیں۔
- `ERROR`: ایسی غلطیاں جو معمول کے کام میں خلل ڈالتی ہیں لیکن کام جاری رکھنے کی اجازت دیتی ہیں۔

اس سطح کا انتخاب کریں جو آپ کے استعمال کے معاملے میں سب سے زیادہ مناسب ہو۔ [اسٹیک اوور فلو](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) لاگ کی مختلف سطحوں کا استعمال کرنے کے بارے میں مزید تفصیلات حاصل کریں۔

</template>
</param-table>

::: کوڈ گروپ

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip رن ٹائم اپ ڈیٹ

اس پیرامیٹر کو Torii آپریٹر کے اختتام پوائنٹس کے ذریعے رن ٹائم ترتیب کی تازہ کاری کے تابع ہے.

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level) کے علاوہ بہتر لاگ فلٹرز۔ ہر ہدف پر لاگنگ وربوسیٹی کو اپنی مرضی کے مطابق بنانے کی اجازت دیتا ہے۔

<param-table type=string env=LOG_FILTER>
<template #type>

سٹرنگ، ایک یا زیادہ کوما سے الگ کردہ ہدایات پر مشتمل ہے۔ ہر ہدایت میں متعلقہ زیادہ سے زیادہ لفظی سطح ہوسکتی ہے جو (مثال کے طور پر ، منتخب کرتا ہے) اس سے ملنے والے دوروں اور واقعات کی اجازت دیتی ہے۔ Iroha کم خصوصی سطحوں (جیسے `trace` یا `info`) کو زیادہ خصوصی سطحوں کی نسبت زیادہ لفظی سمجھتا ہے (جیسا کہ `error` یا `warn`).

ایک اعلی سطح پر، ہدایات کے لئے نحو کئی حصوں پر مشتمل ہے:

```
target[span{field=value}]=level
```

مزید تفصیلات کے لئے، [`tracing-subscriber` دستاویزات ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) دیکھیں.

</template>

</param-table>

::: کوڈ گروپ

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) کے ساتھ مطابقت.

`logger.filter` [`logger.level`](#param-logger-level) کے ساتھ مل کر کام کرتا ہے اور کوئی بھی دوسرے کو اوور رائٹ نہیں کرتا ہے۔

مثال کے طور پر، اگر `logger.level` کو `INFO` پر مقرر کیا گیا ہے اور `logger.filter` کو `iroha_core=debug` پر مقرر کیا جاتا ہے تو، نتیجہ فلٹر سیٹ `info,iroha_core=debug` ہو جائے گا (یعنی تمام ماڈیولز کے لئے `info`، `debug` کے لئے `iroha_core`).

:::

::: tip رن ٹائم اپ ڈیٹ

اس پیرامیٹر کو Torii آپریٹر کے اختتام پوائنٹس کے ذریعے رن ٹائم ترتیب کی تازہ کاری کے تابع ہے.

:::

### `logger.format` {#param-logger-format}

لاگ فارمیٹ.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

سٹرنگ، ممکنہ اقدار:

- `full`: ڈیفالٹ فارمیٹر۔ یہ واقع ہونے والے ہر واقعہ کے لئے انسان پڑھنے کے قابل ، سنگل لائن لاگس جاری کرتا ہے ، جس میں واقعے کی فارمیٹڈ نمائندگی سے پہلے موجودہ اسپین سیاق و سباق دکھایا جاتا ہے۔
- `compact`: ڈیفالٹ فارمیٹر کا ایک متغیر ، مختصر لائن کی لمبائی کے لئے بہتر بنایا گیا ہے۔ موجودہ اسپین سیاق و سباق سے کھیتوں کو فارمیٹ کردہ واقعہ کے کھیتوں میں شامل کیا جاتا ہے ، اور اسپین نام نہیں دکھائے جاتے ہیں۔ لفظی سطح کو ایک ہی حروف تک کم کردیا گیا ہے۔
- `pretty`: بہت خوبصورت، کثیر سطر کے نوشتہ جات جاری کرتا ہے، انسان کی پڑھنے کی صلاحیت کے لئے بہتر بنایا گیا. یہ بنیادی طور پر مقامی ترقی اور ڈیبگنگ میں استعمال کرنے کے لئے تیار کیا جاتا ہے، یا کمانڈ لائن ایپلی کیشنز کے لئے، جہاں لاگ کے خودکار تجزیہ اور کمپیکٹ اسٹوریج کو پڑھنے کی صلاحیت اور بصری اپیل سے زیادہ ترجیح نہیں دی جاتی ہے۔
- `json`: آؤٹ پٹ newline-delimited JSON لکڑی۔ یہ نظاموں کے ساتھ پیداواری استعمال کے لئے موزوں ہے جہاں ساختہ لکڑیوں کو بطور JSON تجزیہ اور دیکھنے کے اوزار کی طرف سے. JSON پیداوار انسانی پڑھنے کی صلاحیت کے لئے بہتر نہیں ہے.

مزید تفصیلات اور نمونہ آؤٹ پٹ کے لئے، [`tracing-subscriber` دستاویزات ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) دیکھیں.

</template>
</param-table>

::: کوڈ گروپ

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura Iroha کا مستقل اسٹوریج انجن ہے (گودام کے لئے جاپانی).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

زیادہ سے زیادہ N آخری بلاکس میموری میں ذخیرہ کیا جائے گا.

اگر ضرورت ہو تو پرانے بلاکس کو میموری سے ہٹا دیا جائے گا اور ڈسک سے لوڈ کیا جائے گا۔

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: کوڈ گروپ

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura شروع کرنے کا طریقہ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

سٹرنگ، ممکنہ اقدار:

- `strict`: تمام بلاکس کی سختی سے تصدیق
- `fast`: صرف بنیادی چیک کے ساتھ تیز رفتار آغاز

</template>
</param-table>

::: کوڈ گروپ

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ڈائرکٹری [^paths] کی وضاحت کرتا ہے جہاں بلاکس ذخیرہ کیے جاتے ہیں۔

یہ بھی دیکھیں: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: کوڈ گروپ

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

کنسول کے لئے نئے بلاکس پرنٹ کرنے کے قابل بنانے کے لئے فلیگ۔

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: کوڈ گروپ

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## قطار {#queue}

### `queue.capacity` {#param-queue-capacity}

قطار میں انتظار کرنے والے لین دین کی تعداد کی اوپری حد۔

<param-table type=number default-value=65_536 />

::: کوڈ گروپ

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ایک ہی صارف کے لئے قطار میں انتظار کرنے والے لین دین کی تعداد کی اوپری حد۔

اس اختیار کا استعمال کر کے تھروکلنگ لگائیں۔

<param-table type=number default-value=65_536 />

::: کوڈ گروپ

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ٹرانزیکشن کو اس وقت کے بعد منسوخ کردیا جائے گا اگر یہ اب بھی قطار میں ہے.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: کوڈ گروپ

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi سافٹ فورک ہینڈلنگ کے راستوں کی مشق کے لئے صرف ڈیبگ سوئچ۔ اس کو کنٹرول شدہ ٹیسٹوں سے باہر غیر فعال کردیں؛ اسے چلانے والے پروڈکشن نیٹ ورک پر تبدیل کرنے سے ہم مرتبہ اتفاق رائے کے رویے کے بارے میں متفق نہیں ہوسکتے ہیں۔

<param-table type=bool default-value=false />

::: کوڈ گروپ

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## تصویر {#snapshot}

یہ ماڈیول [ ورلڈ اسٹیٹ ویو ](/ur/blockchain/world#world-state-view-wsv) کے سنیپ شاٹس کو پڑھنے اور لکھنے کے لئے ذمہ دار ہے۔

اسنیپ شاٹس ورلڈ اسٹیٹ ویو کے ایک سلسلہ بندی شدہ چیک پوائنٹ کو اسٹور کرتی ہیں تاکہ پیئر Kura سے ہر بلاک کو دوبارہ کھیلنے کے بغیر دوبارہ شروع کرسکے۔ Kura بلیک کی دیرپا تاریخ اور دوبارہ چلانے کے لئے سچائی کا ذریعہ رہتا ہے۔ اسنیپشاٹس تیز رفتار راستہ ہیں۔ اسٹارٹ اپ پر ، Iroha ترتیب شدہ سلسلہ اور ذخیرہ شدہ بلاکس کے ساتھ سنیپ شاٹ میٹا ڈیٹا کو چیک کرتا ہے اس سے پہلے کہ فیصلہ کیا جائے کہ آیا اسنیپ شاٹ لوڈ کرنا ہے یا دوبارہ چلانے کے لئے واپس جانا ہے۔

::: tip اسنیپ شاٹس مٹائیں

اگر اسنیپ شاٹس سسٹم میں کچھ غلط ہے، اور آپ ایک خالی صفحے سے شروع کرنا چاہتے ہیں (اسنیپ شاٹ کے لحاظ سے) ، آپ [`snapshot.store_dir`](#param-snapshot-store-dir) کی طرف سے مخصوص ڈائرکٹری کو ہٹا سکتے ہیں.

:::

### `snapshot.mode` {#param-snapshot-mode}

اسنیپ شاٹ سسٹم کا طریقہ کار۔

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

سٹرنگ، ممکنہ اقدار:

- `read_write`: Iroha ایک مدت کے ساتھ اسنیپ شاٹس بناتا ہے جس کی وضاحت [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) کرتا ہے۔ اسٹارٹ اپ پر ، Iroha ایک موجودہ اسنیپشاٹ (اگر کوئی ہو) پڑھتا ہے اور تصدیق کرتا ہے کہ یہ بلاکس اسٹوریج کے ساتھ تازہ ترین ہے.
- `readonly`: `read_write` کی طرح لیکن Iroha کسی بھی سنیپ شاٹس پیدا نہیں کرتا.
- `disabled`: Iroha نہ ہی نئے سنیپ شاٹس بناتا ہے اور نہ ہی اسٹارٹ اپ پر ایک موجودہ کو پڑھتا ہے۔

</template>
</param-table>

::: کوڈ گروپ

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

فوری تصاویر کی تعدد.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: کوڈ گروپ

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

ڈائرکٹری جہاں تصاویر ذخیرہ کرنے کے لئے.

یہ بھی پڑھیں: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: کوڈ گروپ

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## ٹیلی میٹری {#telemetry}

ٹیلی میٹری بیرونی ٹیلی میٹری مجموعہ میں ہم مرتبہ تشخیص برآمد کرتا ہے۔ `telemetry.name` اور `telemetry.url` دونوں کو ترتیب دیں جب ہم مرتبہ کو ایک جمع کرنے والے کو رپورٹ کرنا چاہئے۔ جب ٹیلی میٹر استعمال نہیں کیا جاتا ہے تو سیکشن کو خارج کردیں.

`name` اور `url` کو جوڑا ہونا چاہئے۔

تمام `telemetry` سیکشن اختیاری ہے۔

### `telemetry.name` {#param-telemetry-name}

نوڈ کا نام ٹیلی میٹری پر دکھایا جائے۔

<param-table type=string />

::: کوڈ گروپ

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

ٹیلی میٹری مجموعہ کا WebSocket URL۔

<param-table type=string />

::: کوڈ گروپ

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

دوبارہ منسلک ہونے سے پہلے انتظار کرنے کا کم از کم وقت۔

<param-table type=millis default-value=1_000  default-note="1 second" />

::: کوڈ گروپ

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 کا زیادہ سے زیادہ نمایاں عنصر جو دوبارہ منسلک ہونے کے درمیان تاخیر کو بڑھانے کے لئے استعمال کیا جاتا ہے۔

<param-table type=number default-value=4 />

::: کوڈ گروپ

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ڈویلپمنٹ ٹیلی میٹری لکھنے کے لئے فائل راستہ

<param-table type=file-path />

::: کوڈ گروپ

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
