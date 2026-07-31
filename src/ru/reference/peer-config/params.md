---
translation_locale: ru
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Параметры конфигурации {#configuration-parameters}

[toc]

## Корневой уровень {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Цепь ID, которая должна быть включена в каждую транзакцию. используется для предотвращения повторных атак.

Повторная атака - это попытка подать действительную транзакцию в другую сеть, чем она была предназначена. Поскольку `chain` является частью подписанной полезной нагрузки транзакции, сделка, подписанная для одной цепи, отклоняется коллегами, которые используют другую цепь ID.

<param-table type=string env=CHAIN />

::: группа кодов

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Публичный ключ сверстника. Сверстники-варидаторы консенсуса должны использовать ключи BLS -Normal.

<param-table type="public-key" env="PUBLIC_KEY" />

::: группа кодов

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Частный ключ сверстника. Он должен совпадать с `public_key`; сверстники-варидаторы консенсуса должны использовать BLS-Normal keys.

<param-table type="private-key" env="PRIVATE_KEY" />

::: группа кодов

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Список заранее определенных доверенных сверстников.

Валидаторы консенсуса должны использовать BLS-Normal peer keys. Для каждого валидатора также укажите соответствующую запись [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

Серия строк сверстников. Используйте `PUBLIC_KEY@ADDRESS`, когда адрес P2P известен; также принимается голый `PUBLIC_KEY` и позволяет обнаружить адрес сверстника из сплетни.

</template>
</param-table>

::: группа кодов

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

BLS записи подтверждения владения для доверенных партнеров-валидаторов.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Порядок объектов с полями `public_key` и `pop_hex`

</template>
</param-table>

::: группа кодов

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

## Бытие {#genesis}

### `genesis.file` {#param-genesis-file}

Файловый путь к подписанному блоку генезиса полезной нагрузки, созданный `kagami genesis sign`. Обычно генерируемые профили записывают это как Norito `.nrt` Досье.

<param-table type="file-path" env="GENESIS" />

::: группа кодов

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Публичный ключ от пары ключей генезиса.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: группа кодов

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

Адрес для p2p-коммуникаций в целях консенсуса (sumeragi) и синхронизации блоков (block_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: группа кодов

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Примечательный адрес (внешний, как это видят другие сверстники).

Будут сплетнивать к близким сверстникам, чтобы они могли сплетничать другим сверстницам.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: группа кодов

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

Количество блоков, которые могут быть отправлены в одном сообщении синхронизации.

<param-table type=number default-value=4 />

::: группа кодов

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Временный интервал между просьбами к коллегам по последнему блоку.

Более частые сплетни сокращают время синхронизации, но могут перегружать сеть.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: группа кодов

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Максимальное количество транзакций в сообщениях о сплетнях.

Уменьшение размера приводит к более длительному времени синхронизации, но полезно, если у вас высокая потеря пакета.

<param-table type=number default-value=500 />

::: группа кодов

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Период сплетни в ожидании сделки между сверстниками.

Более частые сплетни сокращают время синхронизации, но могут перегружать сеть.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: группа кодов

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Продолжительность времени, после которого связь с партнером прекращается, если партнёр не работает.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: группа кодов

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Адрес, к которому должен прислушиваться сервер Torii и к которому клиенты* подают свои запросы.

<param-table type=socket-addr env=API_ADDRESS />

::: группа кодов

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

Максимальное количество байтов в органе необработанных запросов, принятых конечными точками [Torii ](/ru/reference/torii-endpoints.md).

Это ограничение используется для предотвращения атак DOS.

<param-table>
<template #type>

Количество (байтов)

</template>
<template #default-value>

`64_000_000` (64 миллионов байтов)

</template>
</param-table>

::: группа кодов

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Время, в течение которого запрос может оставаться в магазине, если он не будет доступен.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: группа кодов

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Верхний предел количества запросов в прямом эфире.

<param-table type=number default-value=128 />

::: группа кодов

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Верхний лимит количества запросов в режиме реального времени для одного пользователя.

<param-table type=number default-value=128 />

::: группа кодов

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Деревянщик {#logger}

### `logger.level` {#param-logger-level}

Общая вербоспособность регистрации (см. [`logger.filter`](#param-logger-filter) для уточненной конфигурации).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Струнные, возможные значения:

- `TRACE`: Все события, включая операции на низком уровне.
- `DEBUG`: сообщения на уровне дебога, полезные для диагностики.
- `INFO`: Общие информационные сообщения.
- `WARN`: предупреждения, указывающие на возможные проблемы.
- `ERROR`: Ошибки, которые нарушают нормальную работу, но позволяют продолжить работу.

Выберите уровень, который наиболее подходит для вашего случая использования. [Загрузочный переток](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) для получения дополнительных деталей о том, как использовать различные уровни журналов.

</template>
</param-table>

::: группа кодов

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip Обновление времени запуска

Данный параметр подлежит обновлению конфигурации запуска через конечные точки оператора Torii.

:::

### `logger.filter` {#param-logger-filter}

Рафинированные журнальные фильтры в дополнение к [`logger.level`](#param-logger-level). Позволяет настраивать вербозность регистрации за целью.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг состоит из одной или нескольких директив, разделенных кометами.Каждая директива может иметь соответствующий максимальный уровень вербильности, который позволяет (например, выбирает для) совпадающие периоды и события. Iroha считает менее эксклюзивные уровни (например, `trace` или `info`) более сложными, чем более исключительные уровни (такие как `error` или `warn`).

На высоком уровне, синтаксис директив состоит из нескольких частей:

```
target[span{field=value}]=level
```

Дополнительная информация приведена в [`tracing-subscriber` документации](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: группа кодов

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Совместимость с [`logger.level`](#param-logger-level)

`logger.filter` работает совместно с [`logger.level`](#param-logger-level), и ни одна из них не переписывает другую.

Например, если: `logger.level` устанавливается `INFO` и `logger.filter` устанавливается `iroha_core=debug`, полученный набор фильтров будет `info,iroha_core=debug` (т.е. `info` для всех модулей, `debug` для `iroha_core`).

:::

::: tip Обновление времени запуска

Данный параметр подлежит обновлению конфигурации запуска через конечные точки оператора Torii.

:::

### `logger.format` {#param-logger-format}

Формат журналов.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Струнные, возможные значения:

- `full`: По умолчанию форматирующий устройство. Это выпускает читаемые человеком, однострочные журналы для каждого события, которое происходит, с текущим контекстом интервала отображается перед форматным представлением события.
- `compact`: Вариант форматировщика по умолчанию, оптимизированный для коротких длин строк. Поле из текущего контекста интервала приложены к полям форматного события, а названия интервала не отображаются; уровень вербильности сокращается до одного символа.
- `pretty`: Выпускает чрезвычайно красивые, многолинейные журналы, оптимизированные для человеческой читаемости. Это в первую очередь предназначено для использования в локальной разработке и дебюгировании, или для приложений командной линии, где автоматизированный анализ и компактное хранение журналов являются менее приоритетными, чем читаемость и визуальная привлекательность.
- `json`: Выходы с новой линией JSON Это предназначено для использования в производстве с системами, где структурированные бревна потребляются как JSON С помощью инструментов анализа и просмотра. JSON выпуск не оптимизирован для человеческой читаемости.

Дополнительные сведения и результаты выборки приведены в документации [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: группа кодов

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura - постоянный двигатель хранения Iroha (японский для склада).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

В памяти будет храниться не более N последних блоков.

Старые блоки будут удалены из памяти и загружены с диска, если они понадобятся.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: группа кодов

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Режим инициализации Kura

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Струнные, возможные значения:

- `strict`: строгая проверка всех блоков
- `fast`: Быстрая инициализация с помощью только базовых проверок

</template>
</param-table>

::: группа кодов

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Указывает каталог [^paths], в котором хранятся блоки.

См. также: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: группа кодов

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Флаг, позволяющий печатать новые блоки для консоли.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: группа кодов

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## В очереди {#queue}

### `queue.capacity` {#param-queue-capacity}

Верхний лимит количества транзакций, ожидающих в очереди.

<param-table type=number default-value=65_536 />

::: группа кодов

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Верхний лимит числа транзакций, ожидающих в очереди для одного пользователя.

Используйте этот вариант для подавления.

<param-table type=number default-value=65_536 />

::: группа кодов

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

После этого времени сделка будет отменена, если она все еще находится в очереди.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: группа кодов

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Приключатель только для отладки для упражнений Sumeragi пути обращения с мягким вилком. Оставьте его отключенным вне контролируемых испытаний; изменение его на работе производственной сети может привести к несогласия с коллегами по поводу консенсусного поведения.

<param-table type=bool default-value=false />

::: группа кодов

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Снимок {#snapshot}

Этот модуль отвечает за чтение и написание мгновенных снимков [Взгляд на мир](/ru/blockchain/world#world-state-view-wsv).

Снэпшоты хранят сериализированный контрольный пункт World State View, чтобы одноклассник мог перезагрузить без повторного воспроизведения каждого блока из Kura. Kura остается долговечной историей блокировки и источником истины для воспроизведения. Снэпшоты являются пути ускорения. При запуске Iroha проверяет метаданные снимка с конфигурированной цепочкой и хранящимися блоками, прежде чем решать, загрузить снимок или вернуться к воспроизведению.

::: tip Стирать снимки

В случае, если с системой снимков что-то не так, и вы хотите начать с пустой страницы (с точки зрения фотографий), вы можете удалить каталог, указанный [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Режим работы системы Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Струнные, возможные значения:

- `read_write`: Iroha создает мгновенные снимки с периодом, указанным в [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). При запуске Iroha читает существующий мгновенный снимок (если таковой есть) и проверяет, что он обновлен для хранения блоков.
- `readonly`: Похожие на `read_write`, но Iroha не создает никаких снимков.
- `disabled`: Iroha не создает новых снимков и не читает уже существующих при запуске.

</template>
</param-table>

::: группа кодов

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Частота снимков.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: группа кодов

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Справочник, где хранить снимки.

См. также: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: группа кодов

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Телеметрия {#telemetry}

Телеметрия экспортирует диагностику сверстников на внешний коллектор телеметрии. Конфигурируйте как `telemetry.name` и `telemetry.url`, когда сверстник должен сообщать коллектору; исключите раздел, когда не используется телеметрия.

`name` и `url` должны быть соединены в пару.

Все разделы `telemetry` являются необязательными.

### `telemetry.name` {#param-telemetry-name}

Название узла должно быть отображено на телеметрии.

<param-table type=string />

::: группа кодов

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL коллектора телеметрии.

<param-table type=string />

::: группа кодов

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Минимальный срок ожидания до восстановления связи.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: группа кодов

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Максимальный экспонент 2 используется для увеличения задержки между восстановлением связи.

<param-table type=number default-value=4 />

::: группа кодов

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Файловой путь для написания разработки телеметрии в

<param-table type=file-path />

::: группа кодов

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
