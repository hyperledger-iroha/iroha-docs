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

# Байгууллагын параметр {#configuration-parameters}

Хөдөлмөр

## Үр дүнд хүрэх түвшин {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Хүрэлсүх ID Энэ нь аливаа гүйлгээний дотор байх ёстой. Урьдчилгааны халдлагыг урьдчилан сэргийлэхэд ашиглана.

Хоёр дахин үйлдэл нь үйл ажиллагааг өөр нэг байгууллагад
Энэ нь тухайн төслийнхээс илүү `chain` Энэ нь
гарын үсэг зурсан гүйлгээний ашиг ачаалал, нэг сүлжээний төлөө гарын үсгийн гүйлгээг татгалздаг
өөр зангилаа ашигладаг ижилхэн ID.

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

Эрдэнэтгэгчдийн олон нийтийн ач холбогдол. BLS-Эрөнхий ач холбогдолтой.

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

Хэдэн үеийнхний хувийн ачкыж нь нийцэж байх ёстой `public_key`; санал нэгдлийн баталгаажуулагч зэрэгцэнүүд
хэрэглэх ёстой BLS-Эрөнхий ач холбогдолтой.

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

Эдгээртээ итгэж байгаа найз нөхөдний жагсаалт.

Зөвлөлтийн баталгаажуулагчдыг ашиглах ёстой BLS-Хэрэг батлан баталгаажуулагчдын хувьд ч
нийлүүлэх [`trusted_peers_pop`](#param-trusted-peers-pop) Дотоод орох.

<param-table env="TRUSTED_PEERS">
<template #type>

Дундаж дугуйны шугам. `PUBLIC_KEY@ADDRESS` тухайн үед P2P хаяг нь мэдэгдэх;
хараагүй `PUBLIC_KEY` мөн хүлээн зөвшөөрөгдсөн бөгөөд ижил хүйстний хаягийг олж авах боломжтой
Хэлэлцүүлэг.

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

BLS баталгаажуулагчдын итгэж байгаа өрсөлдөгчдийн эзэмшилийн гэрчилгээний бүртгэл.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Нөөцтэй эд зүйлс `public_key` болон `pop_hex` талбар

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

Genesis block-ийн гарын үсэг зурсан хэрэглээний ачааллын файлын замыг `kagami genesis sign`.
Одоогоор үүсгэсэн хувилбар нь Norito `.nrt` Хөгжлийн баримт.

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

Женезис цомгийн нөөцний олон нийтийн гол.

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

## Түлжээ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Зөвлөлдөх (sumeragi) болон блокын синхрончлалын (block) зорилгоор p2p харилцааны хаяг_Хөгжлийн чиглэлээр.

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

Энэ нь бусад хүмүүстэй яригдах болно.

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

Нэг удаагийн синхронсолын мэдээгээр илгээж болох блоктын тоо.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Хамгийн сүүлд хийсэн блогын талаарх өрсөлдөгчдийн хүсэлтийн хоорондын цаг хугацаа.

Урьдчилсан яриа нь холбооны цаг хугацааг багасгах боловч сүлжээг хэтрүүлнэ.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Хэлэлцүүлгийн хамгийн их тооны гүйлгээ.

Жижиг хэмжээ нь илүү удаан хугацаагаар синхрон болгох боломжийг олгодог, гэхдээ та өндөр багцын алдагдалтай бол ашигтай.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Хэдэн үеийнхний хоорондын гүйлгээг хүлээсэн цамхагийн хугацаа.

Урьдчилсан яриа нь холбооны цаг хугацааг багасгах боловч сүлжээг хэтрүүлнэ.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Хөгжлийн хяналтгүй байгаа тохиолдолд хамтын ажиллагааг зогсоох хугацаа.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Хөдөлмөрийн хэрэгсэл Torii Хэрэглэгчийн хүсэлтийг хүлээн авах үйлчилгээг сонсох ёстой.

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

Нүүр хуудас
[Torii төгсгөл](/mn/reference/torii-endpoints.md).

Энэ хязгаар нь урьдчилан сэргийлэх зорилгоор хэрэглэдэг. DOS Хөдөлмөр.

<param-table>
<template #type>

(Байтт)

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

Хэрэглээгүй бол дэлгүүрд үлдэх хугацаа.

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

## Хөрсний үйлдвэрлэгч {#logger}

### `logger.level` {#param-logger-level}

_Ерөнхий сайд_ бүртгэлийн үгс (цаах) [`logger.filter`](#param-logger-filter) боловсруулсан конфигурацын хувьд).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `TRACE`: Бүх үйл ажиллагаа, тэр дундаа доод түвшний үйл ажиллагаа.
- `DEBUG`: Халуун сэргээлт, оношилгоонд ашигтай.
- `INFO`: Ерөнхий мэдээллийн мэдээ.
- `WARN`: Харилцааны асуудал үүсэх талаар сэрэмжлүүлэг.
- `ERROR`: Эргэлт нь хэвийн үйл ажиллагааг хамардаг боловч цаашид ажиллах боломжийг олгодог.

Хэрэглээний хэргийг хамгийн тохиромжтой түвшинг сонгох.
[Хөгжлийн давхаргын урсгал](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) нэмэлт
янз бүрийн бүртгэлийн түвшин ашиглах талаар дэлгэрэнгүй мэдээлэл.

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

::: tip Хөдөлмөрийн цаг хугацааг шинэчлэх

Энэ параметр нь цагийн тохируулалтын шинэчлэлийг Torii операторын төгсгөл.

:::

### `logger.filter` {#param-logger-filter}

Өргөтгөлийн сайтар филтрүүд [`logger.level`](#param-logger-level). Тогтоолын үгслэлийг өөрчлөх боломжтой
-_зорилт_.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг нь нэг эсвэл хэд хэдэн мөрийн дугаартай хуваагдсан захирамжаас бүрдэнэ.
_түвшин_ Энэ нь боломжийг олгодог (г.д., _сонгодог_) болон тохиромжтой үйл явдлууд. Iroha бага тусгайлан хамгаалах түвшин (гэхдээ
`trace` эсвэл `info`) нь илүү илүүдэлч түвшинээс илүү гүнзгий байх (гэхдээ `error` эсвэл `warn`).

Дээрх дүгнэлтийн синтаксис өндөр түвшинд хэд хэдэн хэсгээс бүрдэнэ:

```
target[span{field=value}]=level
```

Дэлгэрэнгүй мэдээллийг үзнэ үү
[`tracing-subscriber` баримт бичиг](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Нүүр хуудас [`logger.level`](#param-logger-level)

`logger.filter` ажил _хамтдаа_ хамтран [`logger.level`](#param-logger-level) Нэг нь нөгөөгөөс давтахгүй.

Жишээ нь: `logger.level` . `INFO` болон `logger.filter` . `iroha_core=debug`, үр дүнд хүрсэн филтр
тоног нь болно `info,iroha_core=debug` (гэхдээ: `info` бүх модулийн хувьд, `debug` . `iroha_core`).

:::

::: tip Хөдөлмөрийн цаг хугацааг шинэчлэх

Энэ параметр нь цагийн тохируулалтын шинэчлэлийг Torii операторын төгсгөл.

:::

### `logger.format` {#param-logger-format}

Тогтоолын хэлбэр.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `full`: Энэ нь хүн уншигч, нэг шугам бүртгэлийн тухайн үйл явдлын
  үйл явдлын форматтай дүрслэлээс өмнө дэлгэгдсэн өнөөгийн хугацааны контекст.
- `compact`: Дундаж шугам урттайгаар тохируулсан загварын үндсэн форматтын өөрчилмөц.
  хэлбэлзсэн үйл явдлын талбайд хавсралтгүй, хугацааны нэрүүд илрэхгүй; үгний түвшин нь
  Нэг л дүр.
- `pretty`: Хүний уншихад тохиромжтой хэтэрхий сайхан, олон шугамтай тэмдэглэлийг гаргадаг.
  Орон нутгийн хөгжил, засваржуулалт болон команд шугамтай хэрэглээнд хэрэглэгддэг бөгөөд автоматаар шинжилгээ хийж, компакт
  Тогтоолын хадгаламж нь уншдаг байдал болон дүрслэх уялдуулалтайгаас илүү чухал биш юм.
- `json`: Өргөдлийн шинэ шугам JSON Энэ нь үйлдвэрлэлийн хэрэглээний системүүдэд зохион байгуулалттай
  хэрэглэдэг JSON Эрдэм шинжилгээний болон үзэл баримтын хэрэгслээр. JSON Хүний уншлын хувьд үр дүнг сайжруулахгүй.

Тодруулбал, шинжилгээний үр дүнг үзнэ үү
[`tracing-subscriber` баримт бичиг](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_Кура_ - Iroha (Япон хэлээр _хадгаламж_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Хамгийн ихдээ N сүүлийн блок нь дурсамжинд хадгалагдана.

Эртний блокууд дурсамжнаас хаягдаж, шаардлагатай бол дискээс ачаалал болно.

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
- `fast`: Зөвхөн үндсэн хяналт шалгаруулалтаар хурдан эхлүүлэх

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

Блокууд хадгалагдаж буй [^paths] захиалгыг тодорхойлдог.

Дараахь мэдээллийг үзнэ үү: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Нэг хэрэглэгчийн дараахт хүлээх гүйлгээний тооны дээд хязгаар.

Энэ сонголтыг ашиглаж, утааг хэрэглэх.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Энэ цагаас хойш аливаа гүйлгээ нь аливаа удаагийн жагсаалтад байгаа бол цуцлагдана.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Томоохон хөдөлгөөнд зориулсан зөвхөн алдааны шилжүүлэгч Sumeragi Хөдөлмөрийн замын хөдөлгөөн.
хяналтын туршилтын гадна хүчингүй болгосон; үйл ажиллагаа явуулж буй үйлдвэрлэлийн сүлжээнд өөрчлөх
эв нэгдлийн ёс зүйн талаар өрсөлдөгчдийн санал зөрчигдөхэд хүргэж болно.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Урьдчилсан зураг {#snapshot}

Энэ модуль нь
[Дэлхийн нөхцөл байдлын талаарх үзэл бодол](/mn/blockchain/world#world-state-view-wsv).

Снэп-шоутууд нь Дэлхийн байдлын үзлэгт цувралтай хяналтын цэг хадгалах бөгөөд тэгж залуус
бүх блок нь дахин тоглохгүйгээр эхлүүлнэ Kura. Kura тогтвортой блок хэвээр байна
түүхийн болон үнэний эх үүсвэр нь дахин тоглох; хүйтэн зураг нь хурдацлах зам юм.
Барилга хийхэд Iroha Урьдчилсан зангилаа болон
Хүрэлтийг борлуулах эсвэл дахин тоглох эсэхийг шийдэхээс өмнө хадгалуулсан блок.

::: tip Зураг бичгийг арилгах

Хэрэв нэг зүйл нь алдаатай байна шнэп-схот систем, та эхлэх хүсч байгаа
снэпсхойт), та [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot системийн үйл ажиллагааны хэв маяг.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Хадгаар, боломжтой үнэ цэнэ:

- `read_write`: Iroha Урьдчилсан хугацаатай хүйтэн зураг авна
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Барилга хийхэд Iroha одоогийн хүйтэн зураг (эгвэл) уншдаг
  болон блокнуудын хадгаламжтай холбоотой цаг үеийн байдлыг баталгаажуулна.
- `readonly`: Нүүр хуудас `read_write` Гэхдээ Iroha Энэ нь ямар ч гэрэл зураг үүсгэдэггүй.
- `disabled`: Iroha шинэ снэп-шоог бүтээхгүй, аль хэдийн бий болсон снэпсхоо эхлүүлэхэд уншдаггүй.

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

Хэлтийн ихэвчлэн.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Сүрэлтийг хаана хадгалах вэ?

Дараахь мэдээллийг үзнэ үү: [`kura.store_dir`](#param-kura-store-dir)

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

Телеметри нь хамтын диагностиг гадаад телеметрийн цуглуулгад экспортлодог.
хоёулаа `telemetry.name` болон `telemetry.url` хэрэв нэгэн ижил хүйстэй хүн
Telemetry ашиглахгүй бол хэсгийг орхино.

`name` болон `url` Тэдгээр нь хамарсан байх ёстой.

Бүгд `telemetry` хэсэг нь сонголттой.

### `telemetry.name` {#param-telemetry-name}

Телеметрийн системд үзүүлэх түймрийн нэр.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Хөдөлмөрийн WebSocket URL Телеметрийн цуглуулга.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Цаг хугацааны хамгийн бага хугацаа нь сэргээлт хийхээс өмнө хүлээх хугацаа юм.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Цаашид холбогдлын хоорондын хохирлыг нэмэгдүүлэхэд ашигладаг хамгийн их үзүүлэлт 2.

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
