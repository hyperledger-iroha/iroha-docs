---
translation_locale: mn
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
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

Урьдчилсан гүйлгээний халдлага нь тухайн үйл явцаас өөр нэг сүлжээ рүү хүчинтэй гүйлгээг хүргэх оролдлого юм. `chain` нь гарын үсэг зурсан гүйлгэний ашигтай ачааллын нэг хэсэг тул нэг зангилаар гарын үсгийн гүйлгээ нь ID -ийг ашигладаг өрсөлдөгчид татгалзаж байна.

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

Үндсэн санал хураалтын баталгаажуулагчид BLS-Нормаль ижил төстэй түлхүүр ашиглаж байх ёстой. Арьсны баталгаажуулалтанд нийцсэн [`trusted_peers_pop`](#param-trusted-peers-pop) нэвтрүүлгийг өгөх хэрэгтэй.

<param-table env="TRUSTED_PEERS">
<template #type>

Нөхөр зөөврийн шугам. `PUBLIC_KEY@ADDRESS` хаягийг мэддэг бол P2P нэгийг ашигла; Bare `PUBLIC_KEY` нь мөн хүлээн зөвшөөрөгдсөн бөгөөд өрсөлдөгчийн хаягийг гайхамшигнаас илрүүлэх боломжийг олгоно.

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

Хэрэглэгт хүрэхгүй бол дэлгүүрийн дотор үлдэх хугацаа

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

Стринг нь нэг эсвэл хэд хэдэн мөрийн дугаартай хуваагдсан захирамжаас бүрддэг. Тухайлбал, тохиромжтой хугацаа болон үйл явдлыг сонгон шалгаруулахад боломжийг олгодог. Iroha хялбар бус түвшинд тооцоолдог (гэхдээ: `trace` эсвэл `info`) нь илүү илүүдэлч түвшинээс илүү гүнзгий байх ёстой `error` эсвэл `warn`).

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

::: info [`logger.level`](#param-logger-level)-тай нийцүүлэлт

`logger.filter` нь [`logger.level`](#param-logger-level)тай хамтран ажилладаг бөгөөд аль нэг нь өөрөөс нь давхар бичдэггүй байна.

Тухайлбал, `logger.level` нь `INFO` болон `logger.filter` нь `iroha_core=debug` гэж тохируулсан бол үр дүнд гарсан филтрын багц нь `info,iroha_core=debug` (гэхдээ бүх модулийн хувьд `info` бөгөөд `iroha_core`-ийн хувьд `debug` болно).

:::

::: tip Үйл ажиллагааны цаг хугацааг шинэчлэл

Энэ параметр нь Torii үйлдвэрийн эцсийн цэгүүдээр дамжуулан гүйлгээний цаг үеийн конфигурацыг шинэчлэх боломжтой.

:::

### `logger.format` {#param-logger-format}

Номын тэмдэглэлийн хэлбэр.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `full`: Үндсэн форматч. Энэ нь тухайн үйл явдлын хүн уншигч, нэг шугамаар бүртгэгддэг бөгөөд үйл явдлыг форматжуулсан төлөөлөхөөс өмнө өнөөгийн хугацааны хүрээг харуулдаг байна.
- `compact`: Дээрх хэлбэлзүүлэгчний хувилбар, богино шугам урттай тохируулсан. Одоогийн өргөн хүрээний хүрээнд байгаа талбайг форматчилсан үйл явдлын талбаанд хавсралтлуулж, өргөн хүрэх нэрүүдийг үзүүлдэггүй; үгний түвшин нэг үсэгтэй товчлогдсон байна.
- `pretty`: Хүний уншдагд зориулан сайжруулсан хэт сайхан, олон шугамтай тэмдэглэлийг гаргана. Энэ нь үндсэндээ орон нутгийн хөгжил, засваржуулахад эсвэл командын шугам дахь хэрэгслийн хувьд ашиглах зорилготой Тогтоолын автоматжуулсан шинжилгээ, компакт хадгаламж нь уншигчтай байдал болон дүрсэд илтгэлтэй байдгаас илүү чухал биш.
- `json`: Шинэ шугамтай хязгаарлагдмал JSON номыг гаргадаг. Энэ нь зохион байгуулалттай номыг шинжилгээ, үзэх хэрэгсэлээр JSON гэж хэрэглэдэг системүүдээр үйлдвэрлэлийн хэрэглээний тулд зориулагдсан юм. JSON нөөц нь хүний уншлын хувьд сайжруулахгүй.

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

Kura нэвтрүүлгийн хэлбэр

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `strict`: бүх блокнуудыг хатуу баталгаажуулах
- `fast`: Зөвхөн үндсэн хяналт шалгалтын тусламжтайгаар хурдан эхлүүлж байна

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

Блокууд хадгалагдаж байгаа [^paths] захиалгыг тодорхойлдог.

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

Sumeragi мундаг шулуун хөөцөлдөх замыг хэрэгжүүлэхэд зөвхөн алдааны хөдөлгөөнтэй шилжүүлэг. Энэ нь хяналтын туршилтуудаас гадуур буулгах; үйл ажиллагаа явуулж буй үйлдвэрлэлийн сүлжээнд өөрчлөх нь эв нэгдлийн хандлагын талаар өрсөлдөгчдийн санал зөрчигдсөн болно.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Зураг зураг {#snapshot}

Энэ модуль нь [World State View](/mn/blockchain/world#world-state-view-wsv)-ийн хүйтэн зургуудыг уншиж, бичдэг.

Снэпсхоуд нь World State View-ийн цувралсан хяналтын цэг хадгалдаг бөгөөд энэ нь Kura -аас бүхий л блок дахин тоглуулахгүйгээр дундаж эхлэх боломжтой юм. Kura бол удаан хугацаагаар үргэлжилсэн блокийн түүх болон дахин тоглох үнэн үүсвэр хэвээр үлддэг; снэпсHOOT нь хурдацлах зам юм . Эхлэлтийн үед Iroha нь хяналтын снэп-шоогийн метабараа конфигуруулсан зангилга, хадгалан үлдсэн блоктай харьцуулахад хяналт тавих эсвэл дахин тоглох эсэхээ шийдэхээс өмнө шалгаж байна.

::: tip Зураг зургуудыг арилгах

Снэпсхотын систем дээр ямар нэгэн асуудал үүссэн тохиолдолд, та богино хуудастан эхлүүлэх хүсэлтэй бол [`snapshot.store_dir`](#param-snapshot-store-dir) заасан захиалгыг арилгаж болно.

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

Telemetry нь гадаад телеметрийн цуглуулгад өрсөлдөгчдийн диагностиг экспорторуулдаг. `telemetry.name` болон `telemetry.url` аль алиныг нь төсөөлөгч нь цуглуулга руу мэдээлэх ёстой үед тохируулах; телеметрийг ашиглахгүй тохиолдолд хэсгийг орхисугай.

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
