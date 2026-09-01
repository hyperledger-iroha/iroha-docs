---
translation_locale: mn
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Тохиргооны параметрүүд {#configuration-parameters}

[[Агуулга]]

## Үндэсний түвшин {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Бүх гүйлгээний дотор оруулах ёстой гинжин ID. Дахин тоглох халдлагаас урьдчилан сэргийлэхэд ашиглагдана.

Давтан халдлага гэдэг нь хүчинтэй гүйлгээг анх зориулагдаагүй өөр сүлжээнд илгээх оролдлого юм. Учир нь `chain` нь гарын үсэг зурсан гүйлгээний агуулгын нэг хэсэг тул нэг сүлжээний үүрэгт зориулан гарын үсэг зурсан гүйлгээг өөр сүлжээний ID-г ашигладаг сүлжээний хамтрагчид татгалздаг.

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

Зангилааны нийтийн түлхүүр. Зөвшилцлийн баталгаажуулагч зангилаа BLS-Normal түлхүүр ашиглах ёстой.

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

Зангилааны хувийн түлхүүр. Энэ нь `public_key`-тай тохирох ёстой; зөвшилцлийн баталгаажуулагч зангилаанууд BLS-Normal түлхүүр ашиглана.

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

Өмнө нь тодорхойлсон итгэмжтэй сүлжээний оролцогчдын жагсаалт.

Тохиролцлын баталгаажуулагчид ашиглах ёстой BLS-Ердийн сүлжээний тавигчийн түлхүүрүүд. Бүх баталгаажуулагч бүрт таарах түлхүүрийг бас өгөөрэй [`trusted_peers_pop`](#param-trusted-peers-pop) орц.

<param-table env="TRUSTED_PEERS">
<template #type>

Зангилааг илэрхийлэх тэмдэгт мөрүүдийн массив. P2P хаяг мэдэгдэж байвал `PUBLIC_KEY@ADDRESS` ашиглана; дан `PUBLIC_KEY`-г мөн хүлээн авах бөгөөд зангилааны хаягийг gossip-оор илрүүлнэ.

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

BLS батлах эрхтэй сүлжээний хамтрагчдын баталгаажуулалтын эзэмшлийн нотолгоо оруулга.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Обьектуудын массив нь `public_key` ба `pop_hex` талбаруудтай

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

## блокчэйн уг эх {#genesis}

### `genesis.file` {#param-genesis-file}

Гэрээнд гарын үсэг зурсан блокчэйн эхний блокын өгөгдөл үүсгэсэн файлын зам `kagami genesis sign`. Үүсгэсэн профайл ихэвчлэн үүнийг ингэж бичдэг Norito `.nrt` файл.

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

Блокчэйн генезис түлхүүрийн хосын нийтийн түлхүүр.

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

Таамаглал (sumeragi) болон блок нийцүүлэл (block_sync) зорилгоор p2p харилцааны хаяг.

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

Тэнцүү-байрлалын хаяг (гадна, бусад сүлжээний хамтрагчдаар харагдах).

Сүлжээтэй холбогдсон бусад холбоотон түнш нарт хэлсэнээр тэд үүнийг бусад сүлжээний түнш нарт хэлэлцэж чадна.

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

Нэгэн зэрэг ижилсөлтийн мэдэгдэлд илгээж болох блокуудын хэмжээ.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Сүлжээний ижил тавигчдаас хамгийн сүүлийн блокийг хүсэх хоорондох цагийн завсарлал.

Ихэвчлэн цуу яриа тараах нь синхрончлолын хугацааг богиносгодог ч сүлжээг хэт ачааллуулж болзошгүй.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Цуу ярианы багц мессеж дэх хамгийн их гүйлгээний тоо.

Жижиг хэмжээ нь синхрончлоход илүү их цаг зарцуулдаг боловч пакетууд их алдагддаг бол хэрэгтэй.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Сүлжээний хамтрагчдын хоорондох гүйлгээний талаар хов ярианы хугацаа.

Ихэвчлэн цуу яриа тараах нь синхрончлолын хугацааг богиносгодог ч сүлжээг хэт ачааллуулж болзошгүй.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Сүлжээний хамтрагчийг завгүй байвал холбоог таслах хүртэлх хугацаа.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii сервер сонсох ёстой хаяг ба клиент(ууд) хүсэлтээ илгээдэг хаяг.

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

[Torii API төгсгөлийн цэгүүд](/mn/reference/torii-endpoints.md)-аас хүлээн авсан түүхий хүсэлтийн биеийн дээд зэргийн байт тоо.

Энэхүү хязгаарлалт нь DOS халдлагаас урьдчилан сэргийлэхэд ашиглагддаг.

<param-table>
<template #type>

Тоо (байтуудаар)

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

Хандлага аваагүй тохиолдолд хүсэлтийн дэлгүүрт үлдэж болох хугацаа.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Амьд асуулгын тооны дээд хязгаар.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Нэг хэрэглэгчийн амьд асуулгын тооны дээд хязгаар.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Мод бэлтгэгч {#logger}

### `logger.level` {#param-logger-level}

Ерөнхий бүртгэх нарийвчлал (үзнэ үү [`logger.filter`](#param-logger-filter) нарийвчилсан тохиргоонд зориулсан).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Мөр, боломжит утгууд:

- `TRACE`: Бүх үйл явдлууд, түүн дотор доод түвшний үйлдлүүд.}
- `DEBUG`: Алдааг оношлоход ашиглагддаг, алдааны түвшний мессежүүд.
- `INFO`: Ерөнхий мэдээллийн мессежүүд.
- `WARN`: Болзошгүй асуудлуудыг заадаг анхааруулгууд.
- `ERROR`: Энгийн үйл ажиллагааг саатуулдаг боловч үргэлжлүүлэн ажиллах боломж олгодог алдаанууд.

Өөрийн хэрэглээний нөхцөлд хамгийн тохиромжтой түвшинг сонго. Янз бүрийн тэмдэглэлтийн түвшинг хэрхэн ашиглах талаар дэлгэрэнгүй мэдээллийг [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)-ийг үзнэ үү.

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

::: tip програм хангамжийн гүйцэтгэх орчны шинэчлэлт

Энэ параметр нь програм хангамжийн гүйцэтгэх орчны тохиргоог Torii операторын API төгсгөлийн цэгээр шинэчлэхэд хамаарна.

:::

### `logger.filter` {#param-logger-filter}

Нэмэлтээр сайжруулсан тэмдэглэлийн шүүлтүүрүүд [`logger.level`](#param-logger-level). Төслийн чиглэл бүрт бүртгэлдэлийн нарийвчлалыг тохируулах боломжийг олгодог.

<param-table type=string env=LOG_FILTER>
<template #type>

Тэмдэгт мөр, нэг буюу хэд хэдэн таслалаар салгасан заавруудаас бүрдэнэ. Тус бүр зааварт тохирох дээд дуугарлын түвшин байж болох бөгөөд энэ нь тохирох зай болон үйл явдлуудыг идэвхжүүлдэг (жишээ нь, сонгодог). Iroha нь илүү онцгой бус түвшингүүдийг (жишээлбэл `trace` эсвэл `info`) илүү онцгой түвшингүүдтэй (жишээлбэл `error` эсвэл `warn`) харьцуулахад илүү нурших мэт гэж үздэг.

Өндөр түвшинд зааврын синтакс нь хэд хэдэн хэсгээс бүрддэг:

```
target[span{field=value}]=level
```

Дэлгэрэнгүйг үзнэ үү [`tracing-subscriber` баримт бичиг](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Хэрхэн зохиомжтой [`logger.level`](#param-logger-level)

`logger.filter` хамтран ажилладаг [`logger.level`](#param-logger-level) мөн аль нь ч нөгөөхийг давхарлахгүй.

Жишээлбэл, хэрэв `logger.level`-ыг `INFO` руу тохируулавал, `logger.filter`-ыг `iroha_core=debug`-рүү тохируулахад, үүсэх шүүлтүүрийн цуглуулга нь `info,iroha_core=debug` болох бөгөөд (өөрөөр хэлбэл бүх модулиудад `info`, `iroha_core`-д `debug`) юм.

:::

::: tip програм хангамжийн гүйцэтгэх орчны шинэчлэлт

Энэ параметр нь програм хангамжийн гүйцэтгэх орчны тохиргоог Torii операторын API төгсгөлийн цэгээр шинэчлэхэд хамаарна.

:::

### `logger.format` {#param-logger-format}

Шуудангийн формат.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Мөр, боломжит утгууд:

- `full`: Анхдагч форматлагчаар. Энэ нь болоод өнгөрөх бүх үйл явдлыг хүний уншихад ойлгомжтой, нэг мөрийнлөн бүртгэгдсэн тэмдэглэлүүдийг үүсгэдэг бөгөөд тухайн үйл явдлын форматлагдсан төлөөллийг харуулахын өмнө одоогийн зайгийн контекстыг харуулна.
- `compact`: Эхлэлийг форматлагчийн хувилбар, богино мөрийн уртанд зориулагдсан. Одоо байгаа span-ийн нөхцлөөс гаралтай талбаруудыг форматлагдсан үйл явдлын талбарууддаа нэмдэг бөгөөд span-ийн нэрсийг харуулдаггүй; дэлгэрэнгүйгийн түвшинг нэг тэмдгээр товчилсон.
- `pretty`: Хэтэрхий сайхан, олон мөртэй журналуудыг гаргаж, хүний уншигдахуйд зориулан оновчтой болгосон. Энэ нь голчлон орон нутгийн хөгжүүлэлтэд ашиглахад зориулагдсан. алдааг олж засах, эсвэл командын мөрийн програмуудын хувьд, автомат дүн шинжилгээ хийх болон тэмдэглэлийн бичилтийг багтаах нь уншигдах байдал ба харааны үзэмжээс илүү чухал биш байдаг.
- `json`: Шугам шинэ мөрөөр тусгаарласан JSON тэмдэглэлийг гаргадаг. Энэ нь бүтцийн тэмдэглэлийг JSON болгон анализ, үзэх хэрэгслүүдэд ашигладаг системд үйлдвэрлэлийн зориулалтаар ашиглах зориулалттай. JSON гаралт нь хүний уншихад оптимизаци хийгдээгүй.

Дэлгэрэнгүй мэдээлэл ба жишээ гаралтыг харах бол [`tracing-subscriber` баримт бичиг](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura нь Iroha (адил тодоор ороод “агуулах” гэсэн утгатай Япон үг) –ийн байнгын хадгалах механизм юм.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Хамгийн ихдээ сүүлийн N блок санах ойд хадгалагдах болно.

Хуучин блокуудыг санах ороос хаяад, шаардлагатай бол дискаас ачааллах болно.

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

Kura эхлүүлэх горим. `strict` нь энгийн, анхдагч горим бөгөөд: нод идэвхтэй болохоос өмнө ганц протоколын стандарт түүх, сэргээх файлууд, туслах индексүүд, хадгалах бүртгэлийг баталгаажуулна.

`fast` нь бүрэн эхлүүлэх аудит нь зогсох эрсдэлтэй үед үйл ажиллагааны харагдацыг сэргээх яаралтай үйлчилгээний доройтсон горим юм. Энэ нь өмнө нь `strict`-ээр эхлүүлсэн хадгалах сан болон яг таван урлагийг агуулсан одоогийн үеийн өгөгдлийн харагдац үүсгэхийг шаарддаг: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, ба `snapshot.merkle.json`. Домайн тусгаарласан операторын гарын үсэг нь зарласан ачаа өгөгдлийн криптографийн дижестийн утга болон хязгаарлагдмал техникийн тайлбар бичгийг холбодог; техникийн илэрхийлэл нь ачааны урт, гинжин/сүлжээний таних тэмдэг, терминалын өндөр/хэш, SCCP бодлогын криптограф хэш, болон эхлэх үеийн удам угсааны байгааг холбодог. Fast нь bootstrap угсааг шууд няцаадаг ба устуулагдашгүй Kura-аас яг адил маркер/тоо/зөвлөмжийн хязгаарыг шаардана. Анхны гарсан зангилаанууд яг тэдгээр таван хиймэл зүйлсийг хүлээн авч, бусад бүх хиймэл зүйлсийн тоо эсвэл файлын нэрийн багцыг няцаана.

Fast тэдгээр таван нэрийг болон metadata-г ачааллын болон Merkle файлуудад холбоодог боловч тэдгээрийн агууламжийг уншдаг, криптографийн хэшийг гаргадаг, задлан уншдаг эсвэл тайлдаггүй. Энэ нь гарын үсэгтэй техникийн хэвлэлийг ашиглан хамгийн бага World/Nexus-ийг бүтээдэг, яг Kura криптографын хэшийн префиксийг зөвхөн уншигдах байдлаар зураглалдаж, цаг үеийн өгөгдлийн World, блок-хэш массив, гүйлгээний түүх, гарсан индексүүд, болон удаан хугацааны сэргээх сэтгүүлүүдийг нээгдэлгүй үлдээдэг. Меркле, нэг протокол-стандарт ба семантик цаг үеийн өгөгдлийн харааны аудитууд, түүхэн блок/финалчилах/SCCP тааруулга, Sumeragi идэвхтэй өндрөөр сэргээх, нэгдүүлэх ба лавлах сэтгүүлүүд, гүйцэтгэлийн замын жагсаалт/сотрингийн эх үүсвэрүүд, Kura-ээр баталгаажсан SoraFS архивууд, давталт хадгалалт тооцоолол, болон сонголттой үйлчилгээний тохируулагчид хойшлогдсон хэвээр байна. Орон нутгийн гүйлгээний хүлээн авалт, санал, санал хураалт, нэг протоколын стандарт бичлэгүүд, болон туслах үйлдвэрлэгчид идэвхгүй хэвээр байна. Kura өөрөө зохиогчийн эхлэл болон тогтвортой хувиралтыг татгалздаг; програм хангамжийн боловсруулалтын урсгал ба FASTPQ хадгалах мөрүүд ажлыг шууд татгалздаг, хадгалах эсвэл кодлохын оронд. Kura мөн APIs-ийг уншаад засвар болон тэсвэртэй байдлын синк зуршлыг унтраана: түр зуурын туслах бүртгэлүүд дэмжлэгт орохгүй, гүйцэтгэлийн шугамын алдагдсан объектууд нийтэд гардаггүй, болон явцын саадууд fsync хийгдэхгүй. Sumeragi болон гүйлгээний цуурхал эхлэгддэггүй. Torii зөвхөн эрүүл мэнд, амьдрах байдал, бэлэн байдал, сүлжээний хамтрагч, тохиргооны үйлдлүүдийг илрүүлнэ; API-хугацаа, байдал, хэмжүүр, болон бүх энгийн төлөв/түүхийн чиглэлтүүд боломжгүй хэвээр байна. Бэлэн байдал нь Strict restart болох хүртэл боломжгүй хэвээр байна.

Зөвхөн тохиолдлын хувьд `fast`-г ашигла. Үйлчилгээ тогтвортой болсон даруйд нодыг зогсоож, `strict`-ийг сэргээж, дахин эхлүүлээрэй, ингэснээр бүх хойшлогдсон шалгалт болон индексийг дахин бүтээх ажил үйлдвэрлэл дахин эхлэхээс өмнө хийгдэнэ. Хурдан горим нь хойшлуулсан нэгдлийн тэмдэглэлийг шаарддаггүй ба нэг протокол стандартад нийцсэн хадгалагыг үүсгэх, засах, огтлох эсвэл импортлох шаардлагагүй; хэвлэгдээгүй эцсийн залгуур болон хүлээгдэж буй туслах сэргээх шатнуудыг уншиж эсвэл өөрчилөлт оруулаагүйгээр үл тоомсорлож, дараа нь Хүчтэй сэргээхэд үлдээдэг. Импортлогдсон зөвхөн хэштэй цэг цагаар үзэх өгөгдлийн урсгал одоогоор ашиглах боломжгүй хэвээр байна. Одоогийн цэг цагаар үзэх өгөгдлийн ямар нэгэн алга болсон эсвэл буруу байвал шууд алдаа гарна; Fast хэзээ ч хоосон ертөнц эсвэл түүхэн дахин тоглуулах rebuild руу шилждэггүй.

<param-table default-value=strict>
<template #type>

Мөр, боломжит утгууд:

- `strict`: бүрэн баталгаажуулалт ба хэвийн үйлдвэрлэл
- `fast`: үйлдвэрлэл хориотой байх үед хязгаарлагдмал онцгой байдлын эхлүүлэлтийг хатуу дахин эхлэлт хүртэл

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Блокууд хадгалагдсан фолдерыг[^paths] заана.

Мөн үзэх: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Шинэ блокыг консолд хэвлэхийг идэвхжүүлэх туг.

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

## Эрэмбэлсэн дараалал {#queue}

### `queue.capacity` {#param-queue-capacity}

Эрэмбэлэгдсэн эгнээнд хүлээж буй гүйлгээний тооны дээд хязгаар.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Нэг хэрэглэгчийн ээлжинд хүлээгдэж байгаа гүйлгээний тооны дээд хязгаар.

Энэхүү сонголтыг хурдыг хязгаарлахад ашиглана уу.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Хэрвээ энэ нь ээлжиндээ байсаар байвал энэ хугацааны дараа гүйлгээг устгана.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Зөвхөн алдааг олж засах зориулалтын унтраалга нь Sumeragi софт-форк боловсруулах замыг хэвийн ажиллуулахад ашиглагдана. Үүнийг хяналттай туршилтуудаас гадуур идэвхгүйгээр үлдээнэ үү; ажиллаж буй үйлдвэрлэлийн сүлжээнд үүнийг өөрчилвөл сүлжээний хамтрагчид нийтийн саналын зан үйлд санал зөрөлдөж магадгүй.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic хувийн санхүүгийн гүйлгээний төлбөр тооцоо {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` нь тусад нь `AtomicPrivateSettlementV1` замыг зохицуулдаг. Энэ нь анхдагчаар идэвхгүй байна. `enabled = true` тохируулахад мөн `activation_height` шаардлагатай; сүлжээнд суурилсан чадамж, мэдэгдлийн хугацаа, тогтмол нотлох баримтын профайл, болон сан/шийдлийн засаглал идэвхтэй бус бол нэвтрэх нь хаалттай хэвээр байна.

Гол хязгаарлалтууд нь `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, ба `sidecar_max_total_bytes` юм. `capsule_padding_classes_bytes` нь V1 дүүргэлтийн ангиллын зөвхөн өсөх дарааллаар багцаах заавал байх ёстой. `permitted_policy_versions` зөвхөн V1-ыг хүлээн авдаг.

`max_capsule_bytes` нь бүх `PrivateSettlementAuditCapsuleV1`-ийн дан протоколын стандарт Norito байтыг хэмждэг, үүнд AAD, криптографийн nonce утга, шифрт текст, векторын бүтэц, мөн бүх аудиторын боолттой-DEK мөр орно; энэ нь зөвхөн шифрт текстийн хязгаар биш юм. Бүх идэвхжсэн padding ангилал нь дор хаяж `default_min_auditor_approvals` аудиторт зориулагдсан консерватив бүхий л капсул өгөгдлийн саванд тохирох ёстой. Тухайн баталгаажуулалтын тохиргоо нь мөн хяналтын шалгуур юм: Torii нь шинэ бүртгэгдсэн бодлогыг бага `min_approvals` утгатай бол татгалзаж, нэг протоколын стандарт байт хязгаараас хэтэрсэн аливаа бодит капсулыг татгалздаг.

Эдгээр тохиргоонууд нь үйлдвэрлэлийн орчны хувьсах идэвхжүүлэлтийг тойрч гарах боломжгүй. Бүрэн тохиргооны жишээ болон ажиллагааны шаардлагыг үзэхийн тулд [Атомик хувийн Cross-Dataspace санхүүгийн гүйлгээний тохиролцоог ажиллуулах](/mn/get-started/atomic-private-settlement)-ыг үзнэ үү. Бичигдсэн гадаадын гаргах эрхийг давсан хүртэл зам нь үйлдвэрлэлийн үүрэг хүлээсэн гэж тооцогдохгүй.

## цэг цагаар өгөгдлийн үзүүлэлт {#snapshot}

Энэхүү модуль нь [Дэлхийн улсын үзэл](/mn/blockchain/world#world-state-view-wsv)-ийн тодорхой хугацааны мэдээллийн үзэл баримтлалыг унших, бичих үүрэгтэй.

цэг-цагийн өгөгдлийн үзүүлэлтүүд нь Дэлхийн Төлвийн Үзүүлэлтийн цувруулсан чекпойнтыг хадгалдаг тул сүлжээний хамтрагч нь Kura-аас бүх блокыг дахин тоглуулахгүйгээр дахин эхлүүлж чадна. Kura нь бат бөх блокын түүх бөгөөд дахин тоглуулахын үнэн эх сурвалж хэвээр байна; цэг-цагийн өгөгдлийн үзүүлэлтүүд нь хурджуулах зам юм. Эхлэх үед, Iroha цэг цагийн өгөгдлийн харагдацын метадатаг тохируулсан гинжлэлийн болон хадгалагдсан блокуудтай харьцуулж шалгаад, цэг цагийн өгөгдлийн харагдацыг ачааллах уу эсвэл дахин тоглуулах руу буцах уу гэдгийг шийддэг.

::: tip Цэгц үеийн мэдээллийн үзэгдлийг арчих

Хэрэв цэг хугацааны өгөгдлийн харуулах системд ямар нэг асуудал гарвал, мөн та эхлэхийг хүсч байвал хоосон хуудсаас (цэг хугацааны өгөгдлийн үзэлтийн хувьд), та зааж өгсөн хавтсыг устгаж болно [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Цаг хугацааны тодорхой цэг дээрх өгөгдлийн хяналтын системийн ажиллах горим.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Мөр, боломжит утгууд:

- `read_write`: Iroha тодорхойлсон хугацаагаар цэг хугацааны өгөгдлийн харагдац үүсгэдэг [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Эхлэхэд, Iroha байгаа бол тухайн үеийн өгөгдлийн хандалтыг уншиж, блокын хадгалалттай шинэчлэгдсэн эсэхийг шалгадаг.
- `readonly`: `read_write`-тай адилхан боловч Iroha ямар ч агшны зургууд үүсгэдэггүй.
- `disabled`: Iroha нь шинэ цэг хугацааны өгөгдлийн хандалтыг үүсгэдэггүй бөгөөд эхлэхдээ одоо байгаа хандалтыг уншдаггүй.

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

Хуулбарын давтамж.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Снэпшотыг хадгалах лавлах

Мөн үзэх: [`kura.store_dir`](#param-kura-store-dir)

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

Телеметр нь сүлжээний хамтрагчийн оношилгоог гадаад телеметр цуглуулагч руу экспортлдог. Сүлжээний хамтрагч цуглуулагчид мэдээлэл өгөх ёстой үед `telemetry.name` болон `telemetry.url`-г тохируулна уу; телеметр ашиглахгүй бол хэсгийг орхино уу.

`name` ба `url` хооронд хосууд байх ёстой.

Бүх `telemetry` хэсэг нь сонголттой.

### `telemetry.name` {#param-telemetry-name}

Телеметрийн дээр дэлгээгдэх товчны нэр.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Телеметрийн цуглуулагчийн WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Дахин холбогдохын өмнө хүлээх хамгийн бага хугацаа.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Дахин холбогдох хоорондох саатлыг нэмэгдүүлэхэд ашиглагддаг 2-ийн хамгийн их зэрэг.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

dev-telemetry-г бичих файлын зам

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
