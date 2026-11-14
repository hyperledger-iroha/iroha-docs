---
translation_locale: mn
translation_source: /reference/peer-config/params.md
translation_source_hash: ebc05275774a1a86c81d5c5667613ffc2d9ad115ac19e40ba804daa736ba4084
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta

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

### `private_key` {#param-private-key}

Зангилааны хувийн түлхүүр. `private_key` эсвэл зөвхөн эзэмшигч нэвтрэх түлхүүрийн файлын зам болох `private_key_file`-ийн яг нэгийг тохируулна. Түлхүүр нь `public_key`-тэй таарах ёстой; зөвшилцлийн баталгаажуулагч зангилаанууд BLS-Normal түлхүүр ашиглана.

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

Анхны болон дахин эхлэлтэд эхлэл төлөвийн итгэлийн үндсийн яг нэг эх сурвалж хэрэгтэй: `genesis.expected_hash` эсвэл `genesis.expected_hash_file`. Үүсгэсэн зангилааны тохиргоо сүүлийн хувилбарыг ашиглаж, гарын үсэгтэй блокийн хажуугийн `genesis.expected_hash`-д заана. Үүсгэсэн профайлыг хуулахдаа энэ холболтыг хадгална.

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

Блок синхрончлох түгээлтийн тархалтын дээд хэмжээ: зангилааны сорьц болон блокийн синхрончлолын шинэчлэлт.

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

[Torii төгсгөлийн цэгүүдийн](/mn/reference/torii-endpoints.md) хүлээн авах хүсэлтийн түүхий агуулгын байтын дээд хэмжээ.

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

Fast эдгээр таван нэрийг жагсааж, агуулга болон Merkle файлыг метадатагаар холбох боловч агуулгыг нь унших, хэшлэх, задлах, декодлохгүй. Гарын үсэгтэй манифестээс хамгийн бага World/SORA Nexus үүсгэж, яг Kura хэшийн угтварыг зөвхөн уншихаар зураглан, агшин төлөвийн World, блокийн хэшийн массив, гүйлгээний түүх, уламжилсан индекс болон найдвартай сэргээх журналыг нээхгүй. Merkle, каноник ба семантик агшин төлөвийн аудит, түүхэн блок/эцэслэлт/SCCP тулгалт, Sumeragi идэвхтэй өндрийн сэргээх ажиллагаа, нэгтгэх ба асуулгын журнал, эгнээний манифест/нийцлийн эх, Kura-д тулгуурласан SoraFS архив, хадгалалтын рекурсив тооцоо болон сонголттой үйлчилгээний тулгалтууд хойшлогдсон хэвээр байна. Дотоод гүйлгээ хүлээн авах, санал гаргах, санал өгөх, каноник бичих болон туслах үүсгэгчид идэвхгүй хэвээр. Kura өөрөө бичигчийг эхлүүлэх болон найдвартай өөрчлөлтийг няцаана; боловсруулалтын урсгал болон FASTPQ хадгалалтын дараалал ажлыг хадгалах эсвэл кодлохын оронд шууд няцаана. Kura унших APIs мөн засах болон найдвартай синхрончлох үйлдлийг идэвхгүй болгоно: түр дагалдах файлыг үндсэн файл болгохгүй, дутуу эгнээний артефакт нийтлэхгүй, ахицын хаалтыг fsync хийхгүй. Sumeragi болон гүйлгээний түгээлт эхлэхгүй. Torii зөвхөн эрүүл байдал, ажиллаж буй эсэх, бэлэн байдал, зангилаа болон тохиргооны үйлдлийг гаргана; API хувилбар, төлөв, хэмжүүр болон бүх ердийн төлөв/түүхийн маршрут боломжгүй хэвээр. Strict горимоор дахин эхлүүлэх хүртэл бэлэн байдал боломжгүй байна.

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

`[sumeragi]` нь зангилааны дотоод оролцоо, гарын үсгийн материалын хамгаалалт, аюулгүй байдлын бүртгэлийн зам болон баримтжуулсан хугацаа, синхрончлолын орлуулах утгуудыг агуулна. Зөвшилцлийн горим, хорооны бүтэц, кворум, блокийн хэмжээ болон гүйлгээний хязгаар гарын үсэгтэй эхлэл төлөв, батлагдсан төлөвөөс ирнэ. Алдаа оруулах ажиллагаа детерминистик симуляторт хамаарна.

Дэмждэг талбаруудыг [тохиргоо](/mn/guide/configure/overview.md) болон тогтоосон [тохиргооны лавлах](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/references/configuration.md)-аас үзнэ үү.

## SORA Nexus атомик хувийн тооцоо нийлэлт {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` нэг зангилаан дээр шифрлэсэн дагалдах өгөгдлийн хамгаалалтыг тохируулна. Энэ нь дотоод хадгалалтын яг хоёр хязгаартай:

- `sidecar_max_records`: хадгалж болох шифрлэсэн тооцоо нийлэх бүртгэлийн дээд тоо.
- `sidecar_max_total_bytes`: хадгалж болох каноник байтын дээд тоо.

Идэвхжүүлэлт, нотолгооны профайл, төлбөрийн хязгаар, дуусах хугацаа болон аудиторын бодлого нь батлагдсан нууцлалын бодлогоос ирнэ. Зангилааны тохиргоо эдгээр хүчинтэй байдлын дүрмийг идэвхжүүлэх эсвэл өөрчлөх боломжгүй.

Хамгаалалтын тохиргоо болон ашиглалтын шаардлагыг [Өгөгдлийн орон зай хоорондын атомик хувийн тооцоо нийлэлтийг ажиллуулах](/mn/get-started/atomic-private-settlement.md) хэсгээс үзнэ үү. Компонент хэрэгжсэн нь үйлдвэрлэлийн хэрэглээнд тэнцсэн гэсэн үг биш.

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

Телеметр зангилааны оношилгоог гаднын телеметр цуглуулагчид экспортолно. Зангилаа цуглуулагчид мэдээлэх ёстой бол `telemetry.url` тохируулна; цуглуулагч ашиглахгүй бол энэ хэсгийг орхино. Дахин оролдох хугацааг ижил сонголттой хүснэгтэд тохируулна.

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
