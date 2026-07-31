---
translation_locale: ba
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Конфигурация параметрҙары {#configuration-parameters}

[[toc]]

## Төп кимәле {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID сылбыры һәр транзакцияға ҡушылырға тейеш.

Ҡабатлау һөжүме - ғәмәлдә булған транзакцияны башҡа селтәргә тапшырырға тырышыу. `chain` ҡул ҡуйылған транзакцияның файҙалы йөкләмәһенең өлөшө булғанлыҡтан, бер сылбыр өсөн төҙөлгән транзакция икенсе сылбырҙы ҡулланыусы тиңдәштәре тарафынан кире ҡағыла ID.

<param-table type=string env=CHAIN />

::: код төркөмө

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Берҙәмлек раҫлаусы берләшмәләр BLS-Нормаль асҡыстарҙы ҡулланырға тейеш.

<param-table type="public-key" env="PUBLIC_KEY" />

::: код төркөмө

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Тиҫтерҙең шәхси асҡысы: ул `public_key` менән тура килергә тейеш; консенсус раҫлаусы тиҫтерҙәр BLS-Нормаль асҡыстар ҡулланырға тейеш.

<param-table type="private-key" env="PRIVATE_KEY" />

::: код төркөмө

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Иҫәпкә алынған ышаныслы хеҙмәттәштәре исемлеге

Консенсус валидаторҙары BLS-Нормаль тиҫтер асҡыстарын ҡулланырға тейеш. Һәр валидаторы өсөн шулай уҡ [`trusted_peers_pop`](#param-trusted-peers-pop) яҙыуын күрһәтергә кәрәк.

<param-table env="TRUSTED_PEERS">
<template #type>

P2P адресы билдәле булғас, `PUBLIC_KEY@ADDRESS` ҡулланығыҙ; шулай уҡ `PUBLIC_KEY` яланғас ҡабул ителә һәм курьерҙың адресын гайбәттән асыҡларға мөмкинлек бирә.

</template>
</param-table>

::: код төркөмө

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

BLS валидаторҙың ышаныслы тиңдәштәре өсөн эйә булыу иҫбатлау яҙмалары.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` һәм `pop_hex` өлкәләре булған объекттар рәтлеге

</template>
</param-table>

::: код төркөмө

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

## Башланмыш {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` тарафынан сығарылған ҡул ҡуйылған генез блогы файҙалы йөкләмәһенә файл юлдары. Генерацияланған профилдәр йыш ҡына быны Norito `.nrt` файлы итеп яҙа.

<param-table type="file-path" env="GENESIS" />

::: код төркөмө

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Йәмәғәт асҡысы "Башланмыш" асҡысы парының.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: код төркөмө

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## Сеть {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Консенсус (sumeragi) һәм блок-синхронлаштырыу (блок_sync) маҡсатында p2p элемтәһе өсөн адрес.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: код төркөмө

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Тиҫтерҙәр менән тиҫтерҙәр араһындағы адрес (башҡа тиҫтерҙар күргәнсә, тышҡы).

Яҡташтарың менән һөйләшкәндә, улар был хаҡта башҡаларға һөйләй аласаҡ.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: код төркөмө

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

Бер генә синхронлаштырыу хәбәрендә ебәрелә торған блоктар һаны.

<param-table type=number default-value=4 />

::: код төркөмө

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Иң һуңғы блогы өсөн тиҫтерҙәрҙән һорауҙар араһындағы ваҡыт арауығы.

Йыш ҡына ҡысҡырып һөйләү синхронлаштырыу ваҡытын ҡыҫҡарта, әммә был селтәрҙе артыҡ тултырырға мөмкин.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: код төркөмө

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Макс һанлы транзакциялар шелтәле хәбәрҙәр төркөмөндә.

Кесе күләмдә синхронлаштырыу ваҡыты оҙағыраҡ була, әммә пакеттарҙың юғалтыуҙары ҙур икән, был файҙалы.

<param-table type=number default-value=500 />

::: код төркөмө

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Бер-береһе менән аралашып һөйләшеүҙәр алып барыу ваҡыты.

Йыш ҡына ҡысҡырып һөйләү синхронлаштырыу ваҡытын ҡыҫҡарта, әммә был селтәрҙе артыҡ тултырырға мөмкин.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: код төркөмө

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Бер-береһе менән бәйләнеш өҙөлгән ваҡыттың оҙайлығы.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: код төркөмө

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii серверын тыңларға тейеш һәм клиенттар үҙенең һорауҙарын бирергә тейешле адрес.

<param-table type=socket-addr env=API_ADDRESS />

::: код төркөмө

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii һуңғы нөктәләре ](/ba/reference/torii-endpoints.md) тарафынан ҡабул ителгән сыма заявка корпусында байттарҙың максималь һаны.

Был сикләү DOS һөжүмдәрен булдырмау өсөн ҡулланыла.

<param-table>
<template #type>

Беттар һаны (байт)

</template>
<template #default-value>

`64_000_000` (64 миллион байт)

</template>
</param-table>

::: код төркөмө

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Дүкөндә һорау алыу ваҡыты, әгәр инеүһеҙ ҡалһа.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: код төркөмө

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Тере һорауҙар һанының өҫкө сиге.

<param-table type=number default-value=128 />

::: код төркөмө

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Бер ҡулланыусы өсөн тере һорауҙар һанының өҫкө сиге.

<param-table type=number default-value=128 />

::: код төркөмө

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Ағас эшкәртеүсе {#logger}

### `logger.level` {#param-logger-level}

Дөйөм яҙыу вербологияһы (ҡара: [`logger.filter`](#param-logger-filter) нәфис конфигурация өсөн).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Стринг, мөмкин булған ҡиммәттәр:

- `TRACE`: Бөтә ваҡиғалар, шул иҫәптән түбән кимәлдәге операциялар ҙа.
- `DEBUG`: Дебаг кимәлендәге хәбәрҙәр, улар диагностика өсөн файҙалы.
- `INFO`: Дөйөм мәғлүмәт хәбәрҙәре.
- `WARN`: потенциаль проблемалар тураһында иҫкәртеүҙәр.
- `ERROR`: Ғәҙәттәгесә эш итеүгә ҡамасаулаған, әммә артабан да эшләү мөмкинлеген биргән хаталар.

Үҙ ҡулланыу осрағығыҙға иң яраҡлы кимәлде һайлағыҙ. [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)-ға ҡарағыҙ, төрлө журнал кимәлдәрен нисек файҙаланыу тураһында өҫтәмә мәғлүмәт алырһығыҙ.

</template>
</param-table>

::: код төркөмө

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip Эшләү ваҡытын яңыртыу

Был параметр Torii операторының һуңғы нөктәләре аша хәрәкәт итеү ваҡыты конфигурацияһы яңыртыла.

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level) өҫтәмә төҙөкләндерелгән журналды фильтрлау.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг, бер йәки бер нисә ҡыҫала менән айырылған директиванан тора.Һәр директиваға тейешле максималь вербоситет кимәле булырға мөмкин, был мөмкинлек бирә (мәҫәлән, һайлай) оҙонлоғо һәм ваҡиғалар тап килә. Iroha аҙ эксклюзив кимәлдәрҙе (мәҫәлән, `trace` йәки `info`) күберәк эксклузив кимәлдәргә ҡарағанда ауыҙлыҡлыраҡ тип һанай (мәҫәлем, `error` йәки `warn`).

Юғары кимәлдә, директивалар өсөн синтаксис бер нисә өлөштән тора:

```
target[span{field=value}]=level
```

Тулыраҡ мәғлүмәт өсөн [`tracing-subscriber` документацияһы](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ҡарағыҙ.

</template>

</param-table>

::: код төркөмө

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) менән оҡшашлыҡ

`logger.filter` менән бергә эшләй [`logger.level`](#param-logger-level) һәм береһе лә икенсеһен ҡапма-ҡаршы яҙмай.

Мәҫәлән, әгәр: `logger.level` билдәләнгән `INFO` һәм `logger.filter` билдәләнгән `iroha_core=debug`, һөҙөмтәле фильтр йыйылмаһы: `info,iroha_core=debug` (йәғни. `info` бөтә модулдәр өсөн, `debug` өсөн `iroha_core`).

:::

::: tip Эшләү ваҡытын яңыртыу

Был параметр Torii операторының һуңғы нөктәләре аша хәрәкәт итеү ваҡыты конфигурацияһы яңыртыла.

:::

### `logger.format` {#param-logger-format}

Журнал форматы.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Стринг, мөмкин булған ҡиммәттәр:

- `full`: Дефолт форматлаусы. Был һәр ваҡиға өсөн кеше уҡый торған, бер һыҙыҡлы журналдар сығара, был ваҡиғаның форматташтырылған сағылышынан алда ағымдағы арауыҡ контексты күрһәтелә.
- `compact`: Ҡыҫҡа һыҙыҡ оҙонлоҡтары өсөн оптималләтелгән дефолт форматлаусының варианты. Форматталған ваҡиғаның майҙансыҡтарына ағымдағы арауыҡ контекстындағы баҫыуҙар ҡушыла, һәм арауыҡ исемдәре күрһәтелмәй; һүҙлелек кимәле бер хәрефкә ҡыҫҡартыла.
- `pretty`: Өҫтәмә матур, күп һыҙыҡлы журналдар сығара, кеше уҡый өсөн оптималләтелгән. Был башлыса урындағы үҫеш һәм дебэглауҙа йәки команда-сығана ҡулланыу өсөн тәғәйенләнгән, автоматик анализ һәм журналдарҙы компакт һаҡлау уҡыусанлыҡ һәм визуаль йәлеп итеүсәнлек менән сағыштырғанда өҫтөнлөк бирмәй.
- `json`: Яңы линия менән сикләнгән JSON журналдарын сығара. Был системалар менән производствоға ҡулланыу өсөн тәғәйенләнә, унда структуралы журналдар анализ һәм күҙәтеү ҡорамалдары ярҙамында JSON кеүек ҡулланыла. JSON сығанағы кеше уҡый алһын өсөн оптимизирован түгел.

Тулыраҡ мәғлүмәт һәм өлгө сығанаҡтары өсөн [`tracing-subscriber` документацияһын ҡарағыҙ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: код төркөмө

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura - Iroha даими һаҡлау двигателе (япон телендә склад өсөн).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Иң күп N һуңғы блоктар хәтерҙә һаҡланасаҡ.

Иҫке блоктар иҫтәлектән төшөрөлгән һәм, кәрәк булһа, дисктан йөкләнгән.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: код төркөмө

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura башланғыс режимы

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Стринг, мөмкин булған ҡиммәттәр:

- `strict`: бөтә блоктарҙы ла ҡаты раҫлау
- `fast`: Тик төп тикшеренеүҙәр менән тиҙ башланғыс

</template>
</param-table>

::: код төркөмө

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Блоктарҙың һаҡланған каталогы[^paths] билдәләнә.

Шулай уҡ ҡарағыҙ: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: код төркөмө

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Консоль өсөн яңы блоктарҙы баҫтырыу мөмкинлеген бирәсәк флаг.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: код төркөмө

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## Көтөү {#queue}

### `queue.capacity` {#param-queue-capacity}

Сиратта торған транзакциялар һаны өсөн өҫкө сик.

<param-table type=number default-value=65_536 />

::: код төркөмө

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Бер ҡулланыусы өсөн сиратта торған транзакциялар һанының өҫкө сиктәре.

Был вариантты дронтлау өсөн ҡулланығыҙ.

<param-table type=number default-value=65_536 />

::: код төркөмө

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Транзакция ошо ваҡыттан һуң, әгәр ул һаман да сиратта булһа, туҡтатыласаҡ.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: код төркөмө

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi йомшаҡ киҫәк менән идара итеү юлдарын башҡарыу өсөн деbug-тан ғына коммутатор. Уны контроль һынауҙарҙан ситтә эшләтеп ҡалдырығыҙ; уны эшләүсе производство селтәрендә үҙгәртеү үҙ-ара килешеү тәртибе тураһында фекер алышыусанлыҡ тыуҙыра ала.

<param-table type=bool default-value=false />

::: код төркөмө

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Кәрәкле фотоһүрәт {#snapshot}

Был модуль [World State View](/ba/blockchain/world#world-state-view-wsv) фотоһүрәттәрен уҡып яҙыу өсөн яуаплы.

Снапшоттар World State View-тың сериялы контроль нөктәһен һаҡлай, шуға күрә бер яҡташы Kura тан һәр блокты ҡабатланмайынса яңынан башҡара ала. Kura тотороҡло блок тарихын һәм ҡабатлау өсөн хәҡиҡәт сығанағы булып ҡала; снапшоттарҙың тиҙләтеү юлы була. Башланғанда, Iroha бер мизгелдәге метамәғлүмәттәрҙе конфигурацияланған сылбыр һәм һаҡланған блоктар менән тикшереп тора.

::: tip Кәрәкле фотоһүрәттәрҙе һүндереү

Әгәр ҙә һынылыштар системаһында ниндәйҙер проблема булһа, һәм һеҙ буш биттән башларға теләһәгеҙ (сынылыштар йәһәтенән), һеҙ [`snapshot.store_dir`](#param-snapshot-store-dir) тарафынан күрһәтелгән каталогты алып ташлай алаһығыҙ.

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot системаһының режимы.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Стринг, мөмкин булған ҡиммәттәр:

- `read_write`: Iroha [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) тарафынан билдәләнгән осорҙа хикәйәләр ижад итә. Башланғанда, Iroha булған хикәйәне уҡып сығара (әгәр булһа) һәм блоктарҙы һаҡлау менән яңыртылғанын тикшерә.
- `readonly`: `read_write` менән оҡшаш, әммә Iroha бер ниндәй ҙә мгновенные фотоһүрәттәр тыуҙырмай.
- `disabled`: Iroha яңы фотоһүрәттәр тыуҙыра ла, стартапта булған фотоһүрәтте уҡый ҙа.

</template>
</param-table>

::: код төркөмө

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Фотоһүрәттәрҙең йышлығы.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: код төркөмө

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Фотоһүрәттәрҙе ҡайҙа һаҡларға кәрәклеге тураһында белешмә.

Шулай уҡ ҡара: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: код төркөмө

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Телеметрия {#telemetry}

Телеметрия тышҡы телеметрия коллекторына тиңдәш диагностикаһын экспортлай. `telemetry.name` һәм `telemetry.url` икеһен дә конфигурациялағыҙ, әгәр бер тиңдәш коллекторға хәбәр итергә тейеш булһа; телеметрия ҡулланылмаһа, бүлекте ситләтегеҙ.

`name` һәм `url` парлы булырға тейеш.

`telemetry` бүлегенең бөтәһе лә ирекле.

### `telemetry.name` {#param-telemetry-name}

Телеметрҙа күрһәтелә торған узел исеме.

<param-table type=string />

::: код төркөмө

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL телеметрия коллекторы.

<param-table type=string />

::: код төркөмө

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Ҡабаттан бәйләнешкә сығыр алдынан көткән минималь ваҡыт.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: код төркөмө

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2-нең ҡабаттан тоташыуҙар араһындағы кисектереүҙе арттырыу өсөн ҡулланылған максималь күрһәткесе.

<param-table type=number default-value=4 />

::: код төркөмө

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Деве-телеметрияны яҙыу өсөн файл юлы

<param-table type=file-path />

::: код төркөмө

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
