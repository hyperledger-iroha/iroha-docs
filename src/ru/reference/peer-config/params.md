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

Цепочка ID Используется для предотвращения повторных атак.

Повторная атака - это попытка передать действительную транзакцию другому
В то же время, как и в других странах. `chain` является частью
подписанная транзакция полезная нагрузка, сделка подписанная для одной цепи отклоняется
Совершающимися, которые используют другую цепь ID.

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

Публичный ключ однородной. BLS- Нормальные ключи.

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

Частный ключ однокурсника. `public_key`; коллеги-варидаторы консенсуса
должны использовать BLS- Нормальные ключи.

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

Список заранее определенных доверенных сверстников.

Валидаторы консенсуса должны использовать BLS- Нормальные ключи для каждого валидатора.
обеспечить соответствие [`trusted_peers_pop`](#param-trusted-peers-pop) Вход.

<param-table env="TRUSTED_PEERS">
<template #type>

Сборник струн сверстников. `PUBLIC_KEY@ADDRESS` когда P2P адрес известен;
голые `PUBLIC_KEY` также принимается и позволяет обнаружить адрес сверстников
сплетни.

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

BLS записи о доказательстве владения для доверенных коллег валидатора.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Арей объектов с `public_key` и `pop_hex` поля

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

## Бытие {#genesis}

### `genesis.file` {#param-genesis-file}

Файловый путь к подписанному полезному нагрузке блока генезис, созданный `kagami genesis sign`.
Профили, созданные обычно пишут это как Norito `.nrt` Досье.

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

Публичный ключ пары ключей "Бытие".

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

## Сеть {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Адрес для p2p связи для консенсуса (sumeragi) и синхронизации блоков (блок)_(с синхронизацией)

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

Примечательный адрес (внешний, как это видят другие сверстники).

Будут сплетнивать к близким сверстникам, чтобы они могли сплетничать другим сверстниками.

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

Количество блоков, которые могут быть отправлены в одном сообщении синхронизации.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Временный промежуток между просьбами к коллегам за последний блок.

Частые сплетни сокращают время синхронизации, но могут перегружать сеть.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Максимальное количество транзакций в сообщении о сплетнях.

Малый размер приводит к более длительному времени синхронизации, но полезен, если у вас высокая потеря пакетов.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Период сплетни в ожидании сделки между сверстниками.

Частые сплетни сокращают время синхронизации, но могут перегружать сеть.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Продолжительность времени, после которого связь с однородником прекращается, если однородник не работает.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Адрес, на который Torii сервер должен слушать и к которому клиент*с) обращается с просьбой.

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

Максимальное количество байтов в организме запросов, принятых
[Torii конечные точки](/ru/reference/torii-endpoints.md).

Этот лимит используется для предотвращения DOS Нападения.

<param-table>
<template #type>

Количество (байтов)

</template>
<template #default-value>

`64_000_000` (64 млн байтов)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Время, в течение которого запрос может оставаться в магазине, если он не доступен.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Верхний предел количества запросов в прямом эфире.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Верхний лимит количества запросов на живое для одного пользователя.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Деревянник {#logger}

### `logger.level` {#param-logger-level}

_Генеральный_ Логографическая вербоспособность (см. [`logger.filter`](#param-logger-filter) для усовершенствованной конфигурации).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Струн, возможные значения:

- `TRACE`: Все мероприятия, включая операции на низком уровне.
- `DEBUG`: Сообщения на уровне дебога, полезные для диагностики.
- `INFO`: Общие информационные сообщения.
- `WARN`: Предупреждения, указывающие на возможные проблемы.
- `ERROR`: Ошибки, которые нарушают нормальную функцию, но позволяют продолжить работу.

Выберите уровень, который лучше всего подходит для вашего случая использования.
[Переполнение стака](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) для дополнительных
подробности о том, как использовать различные уровни журналов.

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

::: tip Обновление времени запуска

Этот параметр подлежит обновлению конфигурации запуска через Torii конечные точки оператора.

:::

### `logger.filter` {#param-logger-filter}

Рафинированные фильтры журналов [`logger.level`](#param-logger-level). Позволяет настраивать вербосостояние записи
по ..._Цель_.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг, состоящий из одной или нескольких директив, разделенных по ссылке.
_уровень_ что позволяет (например, _выбирает для_) и соответствующих событий. Iroha учитывает менее исключительные уровни (например,
`trace` или `info`(например, в том числе и на уровне эксклюзивности). `error` или `warn`).

На высоком уровне синтаксис директив состоит из нескольких частей:

```
target[span{field=value}]=level
```

Подробнее см.
[`tracing-subscriber` документация](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Совместимость [`logger.level`](#param-logger-level)

`logger.filter` Работы _вместе_ с [`logger.level`](#param-logger-level) и ни одна из них не переписывает другую.

Например, если `logger.level` устанавливается на `INFO` и `logger.filter` устанавливается на `iroha_core=debug`, полученный фильтр
набор будет `info,iroha_core=debug` (т.е. `info` для всех модулей, `debug` для `iroha_core`).

:::

::: tip Обновление времени запуска

Этот параметр подлежит обновлению конфигурации запуска через Torii конечные точки оператора.

:::

### `logger.format` {#param-logger-format}

Формат журналов.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Струн, возможные значения:

- `full`: По умолчанию форматизатор. Это выдает человекочитаемые, однострочные журналы для каждого события, которое происходит, с
  текущий контекст, отображаемый до форматированного представления события.
- `compact`: Вариант форматировщика по умолчанию, оптимизированный для коротких длин линий. Поле из текущего контекста интервала
  приложены к полям форматированного события, а названия промежуточных периодов не отображаются; уровень вербильности сокращается до
  один персонаж.
- `pretty`: Выпускает чрезвычайно красивые, многолинейные журналы, оптимизированные для человеческой читаемости.
  используется в локальной разработке и дебъгаге или для приложений командной линии, где автоматизированный анализ и компактные
  хранение журналов имеет меньший приоритет, чем читаемость и визуальная привлекательность.
- `json`: Выходы на новой строке JSON лог. Это предназначено для производственного использования с системами, в которых структурированные логи
  употребляются в качестве JSON С помощью инструментов анализа и просмотра. JSON выпуск не оптимизирован для человеческой читаемости.

Дополнительная информация и результаты выборки см.
[`tracing-subscriber` документация](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_Кура_ является постоянным двигателем хранения Iroha (японский для _хранилище_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

В памяти будет храниться не более N последних блоков.

Старые блоки будут удалены из памяти и загружены с диска, если они понадобятся.

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

Kura режим инициирования

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Струн, возможные значения:

- `strict`: строгая проверка всех блоков
- `fast`: Быстрая инициализация только с базовыми проверками

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

Указывает каталог [^paths], где хранятся блоки.

См. также: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Флаг, позволяющий печатать новые блоки на консоли.

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

## В очереди {#queue}

### `queue.capacity` {#param-queue-capacity}

Верхний лимит числа транзакций, ожидающих в очереди.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Верхний лимит количества транзакций, ожидающих в очереди для одного пользователя.

Используйте этот вариант для подавления.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Транзакция будет отменена после этого времени, если она все еще в очереди.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Проводчик только для отладки для упражнений Sumeragi Прогулки с мягкими вилками.
отключается за пределами контролируемых испытаний; изменяется в работе производственной сети
может вызвать разногласия среди сверстников по поводу консенсусного поведения.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Снимок {#snapshot}

Этот модуль отвечает за чтение и написание снимков
[Взгляд на мир](/ru/blockchain/world#world-state-view-wsv).

Снимки хранят сериализированный контрольно-пропускной пункт World State View , чтобы одноклассник мог
перезагрузить без повторного воспроизведения каждого блока из Kura. Kura остается прочным блоком
История и источник истины для повторного воспроизведения; снимки - это ускорение.
На старте, Iroha Проверяет метаданные мгновенных снимков с конфигурированной цепочкой и
хранящиеся блоки, прежде чем решить, загрузить снимок или вернуться к воспроизведению.

::: tip Стирать снимки

В случае, если что-то не так с системой мгновенных снимков, и вы хотите начать с пустой страницы (с точки зрения
snapshots), вы можете удалить каталог , указанный [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Режим работы системы Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Струн, возможные значения:

- `read_write`: Iroha создает мгновенные снимки с периодом, указанным в
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). На старте, Iroha читает существующий снимок (если есть)
  и проверяет, что она актуальна для хранения блоков.
- `readonly`: Похожие на `read_write` но Iroha не создает никаких мгновенных снимков.
- `disabled`: Iroha не создает новых снимков и не читает существующих при запуске.

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

Частота снимков.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Справочник, где хранить снимки.

См. также: [`kura.store_dir`](#param-kura-store-dir)

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

## Телеметрия {#telemetry}

Телеметрия экспортирует диагностику сверстников на внешний коллектор телеметрии.
оба `telemetry.name` и `telemetry.url` когда одноклассник должен сообщить
сборник; исключить раздел, когда телеметрия не используется.

`name` и `url` Они должны быть сочетаны.

Все `telemetry` Раздел - необязательный.

### `telemetry.name` {#param-telemetry-name}

Название узла должно быть отображено на телеметрии.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Сборник WebSocket URL Телеметрического коллектора.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Минимальный срок ожидания перед восстановлением связи.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Максимальный экспонент 2 используется для увеличения задержки между пересоединениями.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Дополнительный путь для написания разработки телеметрии

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
