---
translation_locale: mn
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Конфигурацын параметр {#configuration-parameters}

[toc]

## Хөгжлийн түвшин {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID сүлжээ нь аливаа гүйлгээнд нэгтгэх ёстой.

Урьдчилгааны халдлага нь үйл ажиллагаа явуулж байгаагаас өөр сүлжээг хүлээн авахыг хичээдэг. `chain` нь гарын үсэг зурсан гүйлгээний ашигтай ачааллын нэг хэсэг тул, нэг сүлжээний төлөө гарын үсэг зурсан гүйлгээг өөр сүлжээ ID ашигладаг өрсөлдөгчид татгалздаг.

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

Үндсэн ойлголцлын баталгаажуулагч өрсөлдөгчид нь BLS-Нормаль түлхүүр ашиглах ёстой.

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

Төгсчийн хувийн товчоо. Энэ нь `public_key`тай нийцэж байх ёстой; санал нэгдлийн баталгаажуулагч орнууд BLS-Нормалын товчоо ашиглах ёстой.

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

Дашрамдсан итгэх нөхөд жагсаалт.

Үндсэн санал хураалтын баталгаажуулагчид BLS-Нормаль ижил төстэй түлхүүр ашиглах ёстой. Арьсны баталгаажуулалтаар [`trusted_peers_pop`](#param-trusted-peers-pop) бүртгэлтэй нийцүүлнэ.

<param-table env="TRUSTED_PEERS">
<template #type>

Нөхөр зөөврийн шугам. `PUBLIC_KEY@ADDRESS` хаягийг мэддэг бол P2P нэгийг ашигла; Bare `PUBLIC_KEY` нь мөн хүлээн зөвшөөрөгдсөн бөгөөд үүлшүүрээс өрсөлдөгчийн хаягийг илрүүлэх боломжтой юм.

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

BLS баталгаажуулагчаар итгэж байгаа өрсөлдөгчдийн эзэмшлийн гэрчилгээ.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` болон `pop_hex` гэсэн талбайтай объектүүдийн жагсаалт

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

## Эхлэл {#genesis}

### `genesis.file` {#param-genesis-file}

Genesis block-ийн гарын үсэг зурсан хэрэглээний ачааллын файлын замыг `kagami genesis sign`. Жинэсэн хувилбар нь ихэвчлэн үүнийг Norito `.nrt` Документ.

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

Женезис цомгийн нөөцний гол.

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

## Сүлжээ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Зөвлөлдөх (sumeragi) болон блокийн синхрончлалын (block_sync) зорилгоор p2p харилцааны хаяг.

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

Хэдэн үеийнхний хоорондын хаяг (баруун, бусад өрсөлдөгчдийн харж байгаагаар).

Бусад залуучуудад гайхмаар ярих болно.

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

Нэг удаагийн синхрончлалын мэдээгээр дамжуулж болох блоктын тоо.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Хамгийн сүүлд хийсэн блогын өрсөлдөгчдийн хүсэлтийн хоорондын цаг хугацааны интервал.

Урьдчилсан яриа нь холбооны цаг хугацааг багасгах боловч сүлжээ хэтрүүлэн ачаалалтай болно.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Хэлэлцүүлгийн хамгийн их тооны транзакциуд.

Жижиг хэмжээ нь илүү удаан хугацаагаар синхрон болгох боломжийг олгодог, гэхдээ зургийн алдагдал өндөр бол ашигтай.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Хэдэн үеийнхний хоорондын гүйлгээг хүлээсэн хүйтэн ярианы үе.

Урьдчилсан яриа нь холбооны цаг хугацааг багасгах боловч сүлжээ хэтрүүлэн ачаалалтай болно.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Хөгжлийн хязгаарлалтын хугацаа:

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii сервер нь сонсох ёстой, үйлчлүүлэгчид хүсэлтээ гаргадаг хаяг.

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

[Torii эцсийн цэгүүд ](/mn/reference/torii-endpoints.md) хүлээн зөвшөөрөгдсөн түүхий эдийн хүсэлтийн байгууллагын хамгийн их байтын тоо.

Энэ хязгаар нь DOS халдлагын урьдчилан сэргийлэх зорилгоор ашиглагддаг.

<param-table>
<template #type>

(Байтын тоо)

</template>
<template #default-value>

`64_000_000` (64 сая байт)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Хэрэглэгт хүрэхгүй бол дэлгүүрт үлдэх хугацаа.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Амьдралын асуултын тооны дээд хязгаар.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Нэг хэрэглэгчийн хувьд шууд хайлтын тооны дээд хязгаар.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Хөдөлмөрч {#logger}

### `logger.level` {#param-logger-level}

Бүхэл бүтэн бүртгэлийн үгс (шинэ үү [`logger.filter`](#param-logger-filter) боловсруулсан конфигурацын талаар).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `TRACE`: Бүх үйл ажиллагаа, тэр дундаа бага түвшний үйл ажиллагаа.
- `DEBUG`: Диагноз шалгаруулалтад ашигтай алдааны түвшний мэдээ.
- `INFO`: Ерөнхий мэдээлэл.
- `WARN`: Бодит асуудлуудыг илтгэх сэрэмжлэл.
- `ERROR`: Эдийн засгийн хэвийн үйл ажиллагааг хамарсан, гэхдээ үргэлжлүүлэн ажиллуулах боломжийг олгодог алдаа.

Хэрэглээний хэргийнхээ хамгийн тохиромжтой түвшинг сонгох. Бусад бүртгэлийн түвшинүүдийг хэрхэн ашиглах талаар дэлгэрэнгүй мэдээлэл авахын тулд [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)-д хараарай.

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

::: tip Үйл ажиллагааны цаг хугацааг шинэчлэл

Энэ параметр нь Torii үйлдвэрийн эцсийн цэгүүдээр дамжуулан гүйлгээний цаг үеийн конфигурацыг шинэчлэх боломжтой.

:::

### `logger.filter` {#param-logger-filter}

[ `logger.level`](#param-logger-level)-ийн нэмэлт, боловсруулсан номын сангийн филтрүүд. Зорилгоор бүртгэх үгний түвшинг өөрчлөх боломжийг олгодог.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг нь нэг эсвэл хэд хэдэн мөрийн дугаартай хуваагдсан чиглэлээс бүрддэг. Тухайлбал, тохиромжтой хугацаа болон үйл явдлыг сонгон шалгаруулахад боломжийг олгодог хамгийн их үгний түвшингтэй. Iroha хялбар бус түвшинд тооцоолдог (гэхдээ: `trace` эсвэл `info`) нь илүү илүүдэлч түвшинээс илүү гүнзгий байх ёстой `error` эсвэл `warn`).

Дээрх дүгнэлтийн синтаксис нь өндөр түвшинд хэд хэдэн хэсгээс бүрддэг:

```
target[span{field=value}]=level
```

Дэлгэрэнгүй дэлгэрэнгүй мэдээллийг [`tracing-subscriber` баримт бичигт](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) үзнэ үү.

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

::: info [`logger.level`](#param-logger-level) тэй хамт ашиглах

`logger.filter` нь [`logger.level`](#param-logger-level)тай хамтран ажилладаг бөгөөд аль нэг нь өөрөөс нь давхар бичдэггүй байна.

Жишээ нь: `logger.level` . `INFO` болон `logger.filter` . `iroha_core=debug`, үр дүнд хүрсэн фильтр нь: `info,iroha_core=debug` (Энэ нь: `info` бүх модулийн хувьд, `debug` . `iroha_core`).

:::

::: tip Үйл ажиллагааны цаг хугацааг шинэчлэл

Энэ параметр нь Torii үйлдвэрийн эцсийн цэгүүдээр дамжуулан гүйлгээний цаг үеийн конфигурацыг шинэчлэх боломжтой.

:::

### `logger.format` {#param-logger-format}

Номын тэмдэглэлийн хэлбэр.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `full`: Үндсэн форматч. Энэ нь тухайн үйл явдлын хүн уншигч, нэг шугамаар бүртгэгддэг бөгөөд үйл явдлыг форматжуулсан төлөөлөхөөс өмнө өнөөгийн хугацааны хүрээлэнг харуулдаг байна.
- `compact`: Дээрх форматтын вариант, товч шугам урттай тохируулсан. Одоогоор өргөн хүрээний хүрээнд байгаа талбайг форматчилсан үйл явдлын талбайдад нэмж өгдөг бөгөөд өргөн хүрэлтийн нэрүүдийг үзүүлдэггүй; үгний түвшин нэг тэмдэгтээр буурдаг.
- `pretty`: Хүний уншдагд зориулагдсан хэт сайхан, олон шугамтай тэмдэгт гаргадаг. Энэ нь голчлон орон нутгийн хөгжилд ашиглах зорилготой бөгөөд Захиргааны жагсаалтыг автоматжуулсан шинжилгээ, компакт хадгалах нь уншигчтай байдал болон дүрслэх уялдуулалгаас бага зэрэг чухал ач холбогдолтой команд шугамт хэрэглээнд зориулалттай.
- `json`: Шинэ шугамтай хязгаарлагдмал JSON номыг гаргадаг. Энэ нь зохион байгуулалттай номыг шинжилгээ, үзэх хэрэгслийн тусламжтайгаар JSON гэж хэрэглэдэг системүүдээр үйлдвэрлэлийн хэрэгцээнд зориулагдсан юм. JSON нөөц нь хүний уншлын тулд сайжруулсангүй.

Дэлгэрэнгүй дэлгэрэнгүй мэдээллийг болон үлгэрийн үр дүнг үзвэл [`tracing-subscriber` баримт бичгийг](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) үзнэ үү.

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

Kura нь Iroha (хурбайн зориулалтаар Япон хэлээр) -ийн тасралтгүй агуулах хөдөлгүүр юм.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Хамгийн ихдээ N сүүлийн блок нь дурсамжинд хадгалагдах болно.

Эртний блокууд нь дурсамжаас хаягдаж, шаардлагатай бол дискээс ачаалал болно.

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

Kura эхлүүлэх хэв маяг. `strict` нь хэвийн болон урьдчилсан хэлбэр юм: энэ нь нод идэвхтэй байхын өмнө санхүүгийн түүх, сэргээлт артефакт, туслах индекс, хадгаламжийн тооцоог баталгаажуулна.

`fast` үйл ажиллагааны үзэгдлийг сэргээхэд бэлэн байдлын бохирдолтой үйлчилгээний хэв маяг . бүрэн эхлэлийн хяналт шалгалтыг зогсоох эрсдэлтэй болно. `strict` болон яг таван артефактыг бүрдүүлж байгаа одоогийн снэп-шоутын үеийнх нь: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, болон `snapshot.merkle.json`. Доменийн тусгаар тогтнолын гарын үсэг нь зарласан хэрэглээний ачаалал, хязгаарлагдмал жагсаалтыг нэгтгэдэг. Манифес нь ашиг ачааны урт, зангил/сүлжээний тодруулгыг, галт тэрэгний өндөр/хашийг холбодог. SCCP Хууль зүйн хэш, Bootstrap-ийн гарын үсэгтэй байх. тавилга, мөн адил тодорхой тэмдэглэл / тоо / хувилбарын хилээс тогтвортой Kura. Анх нэвтрүүлэг хийх цэгүүд яг эдгээр таван артефактыг хүлээн зөвшөөрч, бусад артефактын тоо болон файлын нэр багтаалыг үгүйсгэнэ.

Хэтэрхий хурдан эдгээр таван нэр, мета өгөгдлийг хадгалах нь ашигтай ачаалал болон Merkle файлуудыг холбоно, гэхдээ тэдгээрийн агуулгыг уншдаггүй, хэш, шинжилгээ хийх, эсвэл уншиулахгүй. Энэ нь гарын үсэг зурсан манифестээс хамгийн бага ертөнц /Nexus барьж, яг Kura хэш префиксийг зөвхөн уншихгаар зураач, мөн World, block-hash массивийг үлдээж, гүйлгээний түүх, дэргэдэх индекс болон удаан хугацааны сэргээлтийн сэтгүүл нээлттэй. Merkle, каноникийн болон семантикийн хяналт шалгалт, түүхэн блок / төгсгөл/SCCP тохиролцоо, Sumeragi идэвх өндөрний сэргээлт, нэгдсэн болон асуултын сэтгүүл, замын жагсаалт / нийцлийн эх үүсвэр, Kura-ийн дэмжлэгтэй SoraFS архив, рекурсив хадгаламжийн бүртгэл, сонголттой үйлчилгээний тохижуулагч хэвээр байна. Орон нутгийн гүйлгээ хүлээн авах, санал гаргах, саналаа өгөх, санхүүжилтийн бичиг баримт бичгүүд болон туслах үйлдвэрлэгчдийг зогсоож байна. Kura нь өөрөө зохиолчдын эхлүүлэх болон удаан хугацааны өөрчлөлтийг үгүйсгэнэ; түвшний шугам болон FASTPQ тогтвортой байдлын шугам нь ажлыг хадгалах эсвэл кодлуулахын оронд цахимаар үгүйсгэдэг. Kura уншсан APIs нь мөн засварын болон удаан эдэлгээний синхрончлалын үйл ажиллагааг зогсоодог: түр зуурын хавсралтын автомашиныг сурталчлахгүй, хохирогч замын артефактыг нийтлэхгүй, хөгжлийн саад бэрхшээлүүдийг зохицуулахгүй. Sumeragi болон транзакцын гайхамшиг эхлүүлэхгүй. Torii нь зөвхөн эрүүл мэнд, амьжиргаа, бэлэн байдал, өрсөлдөөн болон конфигурацийн үйл ажиллагааг илрүүлж байна. API-ийн хувилбар, байдал, үзүүлэлтүүд болон бүх хэвийн байдлын / түүхийн замыг ашиглах боломжгүй хэвээр байна. Урьдчилсан сэргээлт хийх хүртэл бэлэн байдал ашиглах боломжгүй байдаг.

`fast` нь зөвхөн тохиолдлын хувьд ашиглана. Хөдөлмөрийн тогтвортой болсны дараа түймрийг зогсоож, `strict`-г сэргээж, дахин эхлүүлээрэй. Хурд хэлбэр нь хойшлуулсан нэгдсэн тэмдэглэлийг шаардахгүй бөгөөд Canonical хадгаламжийг бий болгох, засварлах, буулгах, импортлох боломжгүй; хэвлэгдээгүй хавсралт болон хүлээсэн туслах сэргээлтийн үе шатг уншаагүй эсвэл өөрчлөлт оруулахгүйгээр орхиж, дараа нь Strict сэргээлтэд үлдээх болно. Идэвчилсэн хэш цорын ганц снэп-шоутын хувилбар нь нөөцгүй хэвээр байна. Хойсон эсвэл хүчингүй одоогийн снэپ-шоу нь шуурхай алдаатай байдаг; хурдан хэзээ ч бохирдлын ертөнцөд эсвэл түүхэн дурдах нөхөн бүтээн байгуулалтад эргүүлэхгүй.

<param-table default-value=strict>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `strict`: бүрэн баталгаажуулалт, хэвийн үйлдвэрлэл
- `fast`: хязгаарлагдмал бэлэн байдлын шуурхай үйл ажиллагааг эхлүүлэх, үйлдвэрлэлийг хатуу сэргээлт хүртэл карантинд байлгах

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Блокууд хадгалагдаж байгаа [^paths] номын жагсаалтыг тодорхойлох.

Мөн: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Консоль дээр шинэ блок хэвлэх боломжийг олгодог флаг.

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

## Төмөр {#queue}

### `queue.capacity` {#param-queue-capacity}

Захиргаанд хүлээх гүйлгээний тооны дээд хязгаар.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Зөвхөн нэг хэрэглэгчийн хувьд шуурхай хүлээх гүйлгээний тооны дээд хязгаар.

Энэ хувилбарыг ашиглаж, дулаан хийлгэх.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Энэ цагаас хойш аливаа бүтээн байгуулалтыг зогсоож болно, хэрэв энэ нь хэсгээрээ байгаа бол.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi хялбар шүлэгний дагаж мөрдөх замыг хэрэгжүүлэхэд зөвхөн алдааны хөдөлгүүр. Энэ нь хяналтын туршилтуудаас гадуур буулгах; үйл ажиллагаа явуулж буй үйлдвэрлэлийн сүлжээнд өөрчлөх нь өрсөлдөгчдийн санал нэгдмэл байдлын талаар зөрчилдөхөд хүргэж болно.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic Private Settlement {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` нь тусгаарлагдсан `AtomicPrivateSettlementV1` замыг зохицуулдаг. Энэ нь урьдчилан сэргийлэгдсэн байдаг. `enabled = true` -ийн тохируулалт нь `activation_height` -ийг шаарддаг; дотоод зах зээлийн хүчин чадал, мэдэгдэл хугацаа, тогтмол баталгааны профил, цогцолбор / аудитын удирдлага идэвхтэй бол хүлээн зөвшөөрөл хаагдахгүй байна.

Гол хязгаар нь: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, болон `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` Энэ нь үүнтэй холбоотойгоор V1 Барилгын хичээл. `permitted_policy_versions` зөвхөн хүлээн зөвшөөрдөг V1.

`max_capsule_bytes` нь бүхэл бүтэн `PrivateSettlementAuditCapsuleV1` байтын каноникийн Norito байтыг хэмнэдэг, тэр дундаа AAD, нонс, шифрлэгийн текст, векторын рамжлал, болон DEK -ийн бүрэлдэхүүнтэй аудитор; энэ бол зөвхөн шифрлэлийн текстээр хязгаарлалт биш юм. Шаардлагатай дүүрэн анги бүр хамгийн багадаа `default_min_auditor_approvals` хяналтын ажилтнуудыг хамарсан цэцэрлэг капсулагийн хувцастай байх ёстой. Энэ зөвшөөрлийн тохиролцоо нь ч зохицуулагдсан түвшин юм: Torii нь `min_approvals` хэмжээнд доош үнэлгээтэй шинээр хүлээн зөвшөөрөгдсөн бодлогыг үгүйсгүүлж, хуулиар заасан байтын хязгаарыг давхсан ямар нэгэн бодит капсулалыг үгүйсгэнэ.

Эдгээр тохируулалтууд нь үйлдвэрлэлийн орчны өөрчлөлтийн идэвхжилтийн дутагдалгүй юм. Тодорхой конфигурацийн жишээ болон үйл ажиллагааны шаардлагуудын хувьд [ Atomic Private Cross-Dataspace Settlement](/mn/get-started/atomic-private-settlement)-ийг үзнэ үү. Документиар бичигдсэн гадаад нээлттэй хаалганы хаалга өнгөрөх хүртэл замыг үйлдвэрлэх шаардлага хангахгүй байна.

## Зураг зураг {#snapshot}

Энэ модуль нь [World State View](/mn/blockchain/world#world-state-view-wsv)-ийн хүйтэн зургуудыг уншиж, бичдэг.

Снэпсхоуд нь World State View-ийн цувралсан хяналтын цэг хадгалдаг бөгөөд энэ нь Kura -аас бүх блоктыг дахин тоглохгүйгээр дурдах боломжтой юм. Kura бол удаан хугацаагаар үргэлжилж буй блок түүхийн болон дахин тоглуулахын үнэн эх үүсвэр хэвээр байна; снэпсHOOT нь хурдацлалтын зам юм. Эхлэлтийн үед Iroha нь хяналтын снэп-шоогийн метабараа конфигуруулсан зангилга, хадгалан үлдсэн блоктай харьцуулахад хяналт тавих эсвэл дахин тоглох эсэхээ шийдэхээс өмнө шалгаж байна.

::: tip Зураг зургуудыг арилгах

Снэпсхотын систем дээр ямар нэгэн асуудал үүссэн тохиолдолд, та богино хуудастан эхлүүлэх хүсэлтэй бол [`snapshot.store_dir`](#param-snapshot-store-dir) заасан захиалгыг устгах боломжтой.

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot системийн үйл ажиллагааны хэлбэр.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `read_write`: Iroha Урьдчилсан хугацаатай хяналтын зургуудыг бий болгох: [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Сургуулахдаа, Iroha одоогийн хяналтын зургийг уншиж, блокийн хадгаламжтай холбоотой цаг үеийн байдлыг баталгаажуулна.
- `readonly`: `read_write`-тай ижил төстэй боловч Iroha нь ямар нэгэн хүйтэн зургийг үүсгэхгүй байна.
- `disabled`: Iroha нь нээлт эхлэхэд шинэ хяналтын зургуудыг бий болгодоггүй, одоогийн зургийг уншдаггүй.

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

Сэтгэгдлийн давтамж.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Зураг зургийг хаана хадгалах вэ?

Түүнчлэн үзнэ үү: [`kura.store_dir`](#param-kura-store-dir)

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

## Телеметри {#telemetry}

Telemetry нь гадаад телеметрийн цуглуулгад өрсөлдөгчдийн диагностиг экспорторуулдаг. `telemetry.name` болон `telemetry.url` аль алиныг нь төсөөлөгч нь цуглуулга руу мэдээлэх ёстой үед тохируулах; телеметрийн хэрэгслийг ашиглахгүй тохиолдолд хэсгийг орхисугай.

`name` болон `url` нь хамарсан байх ёстой.

Бүх `telemetry` хэсэг нь сонголттой.

### `telemetry.name` {#param-telemetry-name}

Тэлеметрийн дагуу үзүүлэх түймрийн нэр.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Телеметрийн цуглуулгачийн WebSocket URL .

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Цаг хугацааны хамгийн бага хугацаа нь сэргээлтийн өмнө хүлээх хугацаа юм.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Цаашид холбогдлын хоорондын хохирлыг нэмэгдүүлэхэд ашигладаг 2-ийн дээд үзүүлэлт.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

De-Telemetry бичих файлын замыг

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
