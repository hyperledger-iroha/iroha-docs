---
translation_locale: ru
translation_source: /reference/peer-config/params.md
translation_source_hash: ebc05275774a1a86c81d5c5667613ffc2d9ad115ac19e40ba804daa736ba4084
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Параметры конфигурации {#configuration-parameters}

[[оглавление]]

## На уровне корня {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Идентификатор цепочки, который должен быть включен в каждую транзакцию. Используется для предотвращения повторных атак.

Атака повторного воспроизведения — это попытка отправить действительную транзакцию в другую сеть, чем та, для которой она предназначалась. Поскольку `chain` является частью подписанного содержимого транзакции, транзакция, подписанная для одной цепочки, отклоняется узлами сети, которые используют другой идентификатор цепочки.

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

Публичный ключ сетевого участника. Сетевые участники валидатора консенсуса должны использовать ключи BLS-Normal.

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

Закрытый ключ узла. Настройте ровно одно из полей: `private_key` или `private_key_file` — путь к файлу ключа, доступному только владельцу. Ключ должен соответствовать `public_key`; узлы-валидаторы консенсуса используют ключи BLS-Normal.

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

Список предопределённых доверенных сетевых узлов.

Валидаторы консенсуса должны использовать BLS-Обычные ключи сетевых узлов. Для каждого валидатора также предоставьте соответствующий [`trusted_peers_pop`](#param-trusted-peers-pop) запись.

<param-table env="TRUSTED_PEERS">
<template #type>

Массив строк сетевых узлов. Используйте `PUBLIC_KEY@ADDRESS`, когда известен адрес P2P; также допускается использование только `PUBLIC_KEY`, что позволяет обнаружить адрес сетевого узла через систему сплетен.

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

BLS записи подтверждения владения для доверенных сетевых узлов валидатора.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Массив объектов с полями `public_key` и `pop_hex`

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

## генезис блокчейна {#genesis}

При первом запуске и перезапусках требуется ровно один источник корня доверия генезиса: `genesis.expected_hash` или `genesis.expected_hash_file`. Сгенерированные конфигурации узлов используют второй вариант, указывающий на файл `genesis.expected_hash` рядом с подписанным блоком. Сохраняйте эту привязку при копировании сгенерированного профиля.

### `genesis.file` {#param-genesis-file}

Путь к файлу полезной нагрузки генезис-блока блокчейна с подписью, сгенерированной `kagami genesis sign`. Сгенерированные профили обычно записывают это как файл Norito `.nrt`.

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

Публичный ключ пары ключей генезиса блокчейна.

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

Адрес для p2p-связи для целей консенсуса (sumeragi) и синхронизации блоков (block_sync).

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

Адрес межузлового соединения (внешний, как его видят другие узлы).

Будет передано другим узлам сети через слухи, чтобы они могли передавать это другим узлам сети.

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

Максимальное число адресатов gossip-рассылки синхронизации блоков: выборок узлов и обновлений синхронизации блоков.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Интервал времени между запросами к сетевым узлам для получения самого последнего блока.

Более частые сплетни сокращают время синхронизации, но могут перегрузить сеть.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Максимальное количество транзакций в сообщении пакета слухов.

Меньший размер приводит к более длительному времени синхронизации, но полезен, если у вас высокая потеря пакетов.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Период сплетен о предстоящих транзакциях между участниками сети.

Более частые сплетни сокращают время синхронизации, но могут перегрузить сеть.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Продолжительность времени, после которой соединение с сетевым узлом разрывается, если сетевой узел бездействует.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Адрес, на котором сервер Torii должен слушать и на который клиенты отправляют свои запросы.

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

Максимальное число байт исходного тела запроса, принимаемого [конечными точками Torii](/ru/reference/torii-endpoints.md).

Этот лимит используется для предотвращения атак DOS.

<param-table>
<template #type>

Количество (байт)

</template>
<template #default-value>

`64_000_000` (64 миллиона байт)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Время, в течение которого запрос может оставаться в хранилище без доступа.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Верхний предел числа активных запросов.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Верхний предел количества активных запросов для одного пользователя.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Лесоруб {#logger}

### `logger.level` {#param-logger-level}

Общая подробность ведения журнала (см. [`logger.filter`](#param-logger-filter) для уточнённой настройки).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Строка, возможные значения:

- `TRACE`: Все события, включая низкоуровневые операции.
- `DEBUG`: Сообщения уровня отладки, полезные для диагностики.
- `INFO`: Общие информационные сообщения.
- `WARN`: Предупреждения, указывающие на потенциальные проблемы.
- `ERROR`: Ошибки, которые нарушают нормальное функционирование, но позволяют продолжать работу.

Выберите уровень, который лучше всего подходит для вашего случая использования. Смотрите [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) для дополнительных сведений о том, как использовать различные уровни журналирования.

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

Уточнённые фильтры журналов в дополнение к [`logger.level`](#param-logger-level). Позволяет настраивать подробность ведения логов для каждой цели.

<param-table type=string env=LOG_FILTER>
<template #type>

Строка, состоит из одной или нескольких директив, разделённых запятыми. Каждая директива может иметь соответствующий максимальный уровень подробности, который включает (например, выбирает) соответствующие диапазоны и события. Iroha считает, что менее эксклюзивные уровни (такие как `trace` или `info`) являются более многословными, чем более эксклюзивные уровни (такие как `error` или `warn`).

На высоком уровне синтаксис директив состоит из нескольких частей:

```
target[span{field=value}]=level
```

Для получения дополнительных сведений см. [`tracing-subscriber` документация](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Композиция с [`logger.level`](#param-logger-level)

`logger.filter` работает вместе с [`logger.level`](#param-logger-level) и ни один не перезаписывает другой.

Например, если `logger.level` установлен на `INFO`, а `logger.filter` установлен на `iroha_core=debug`, результирующий набор фильтров будет `info,iroha_core=debug` (т.е. `info` для всех модулей, `debug` для `iroha_core`).

:::

### `logger.format` {#param-logger-format}

Формат журналов.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Строка, возможные значения:

- `full`: Форматировщик по умолчанию. Он создает человеко-читаемые однострочные логи для каждого происходящего события, при этом текущий контекст диапазона отображается перед форматированным представлением события.
- `compact`: Вариант стандартного форматировщика, оптимизированный для коротких строк. Поля из текущего контекста спана добавляются к полям форматированного события, а имена спанов не отображаются; уровень подробности сокращен до одного символа.
- `pretty`: Генерирует чрезмерно красивые многострочные логи, оптимизированные для удобочитаемости человеком. Это предназначено прежде всего для использования в локальной разработке и отладка или для командных приложений, где автоматический анализ и компактное хранение логов менее важны, чем читаемость и визуальная привлекательность.
- `json`: Выводит журналы JSON, разделённые переводом строки. Предназначено для использования в производственной среде с системами, где структурированные журналы обрабатываются как JSON инструментами анализа и просмотра. Вывод JSON не оптимизирован для удобства чтения человеком.

Для получения дополнительной информации и примеров результатов смотрите [`tracing-subscriber` документация](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura — это движок постоянного хранения для Iroha (по-японски означает «склад»).

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

Kura режим инициализации. `strict` - это нормальный и стандартный режим: он проверяет каноническую историю, артефакты восстановления, вспомогательные индексы и учет хранения перед тем, как узел станет активным.

`fast` — это аварийный режим с ограниченной службой для восстановления операционной видимости, когда полная проверка при запуске может привести к отключению. Он требует хранилища, ранее инициализированного `strict`, и текущего снимка данных, содержащего ровно пять артефактов: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` и `snapshot.merkle.json`. Подпись оператора с разделением по доменам связывает заявленное криптографическое значение дайджеста полезной нагрузки и ограниченный технический манифест; технический манифест связывает длину полезной нагрузки, идентичность цепочки/сети, высоту/хэш терминала, криптографический хэш политики SCCP и наличие линии загрузки-предка. Fast отвергает наследование bootstrap и требует точно такой же маркер/счетчик/границу конца от durable Kura. Узлы первого выпуска принимают ровно эти пять артефактов и отвергают любую другую комбинацию количества артефактов или имени файла.

Режим Fast инвентаризирует эти пять имён и связывает файлы полезной нагрузки и дерева Меркла по метаданным, но не читает, не хеширует, не разбирает и не декодирует их содержимое. Он строит минимальный World/SORA Nexus из подписанного манифеста, отображает точный префикс хешей Kura только для чтения и не открывает World снимка, массив хешей блоков, историю транзакций, производные индексы и устойчивые журналы восстановления. Проверки дерева Меркла, каноничности и семантики снимка, согласование исторических блоков/финальности/SCCP, восстановление активной высоты Sumeragi, журналы слияния и запросов, источники манифестов и соответствия требованиям линий, архивы SoraFS на основе Kura, рекурсивный учёт хранилища и необязательные средства согласования сервисов остаются отложенными. Локальный допуск транзакций, предложения блоков, голосование, канонические записи и вспомогательные производители остаются отключёнными. Сам Kura запрещает запуск средств записи и устойчивые изменения; очереди сохранения конвейера и FASTPQ немедленно отклоняют работу, а не сохраняют или кодируют её. APIs чтения Kura также отключают восстановление и синхронизацию устойчивого хранения: временные вспомогательные записи не переводятся в постоянные, отсутствующие артефакты линий не публикуются, а барьеры прогресса не синхронизируются через fsync. Sumeragi и gossip транзакций не запускаются. Torii предоставляет только операции проверки здоровья, работоспособности, готовности, узлов и конфигурации; версия API, статус, метрики и все обычные маршруты состояния и истории остаются недоступными. Готовность остаётся недоступной до перезапуска в режиме Strict.

Используйте `fast` только для инцидента. Как только сервис станет стабильным, остановите узел, восстановите `strict` и перезапустите его, чтобы все отложенные проверки и восстановление индекса выполнялись до возобновления работы в продуктивной среде. Режим быстрого выполнения не требует отложенного журнала слияния и не создает, не восстанавливает, не обрезает и не импортирует каноническое хранилище; неопубликованные суффиксы и ожидающие вспомогательные стадии восстановления игнорируются без чтения или изменения, а затем остаются для строгого восстановления. Импортированная линейка снимков данных только с хешами остается недоступной. Отсутствующий или недействительный текущий снимок данных вызывает немедленный сбой; Fast никогда не возвращается к пустому миру или пересборке с историческим воспроизведением.

<param-table default-value=strict>
<template #type>

Строка, возможные значения:

- `strict`: полная проверка и нормальное производство
- `fast`: ограниченный аварийный запуск с карантинной остановкой производства до строгого перезапуска

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Указывает каталог[^paths], в котором хранятся блоки.

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

Флаг для включения вывода новых блоков в консоль.

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

## Очередь {#queue}

### `queue.capacity` {#param-queue-capacity}

Верхний предел числа транзакций, ожидающих в очереди.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Верхний предел числа транзакций, ожидающих в очереди для одного пользователя.

Используйте эту опцию для применения ограничения скорости.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Транзакция будет отменена после этого времени, если она все еще находится в очереди.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

Раздел `[sumeragi]` содержит локальные настройки участия узла, хранения средств подписи, путей записей безопасности и документированные переопределения тайм-аутов и синхронизации. Режим консенсуса, геометрия комитета, кворум, размер блока и ограничения транзакций задаются подписанным генезисом и зафиксированным состоянием. Инъекция сбоев относится к детерминированному симулятору.

Поддерживаемые поля описаны в разделе [Конфигурация](/ru/guide/configure/overview.md) и закреплённом [справочнике конфигурации](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/references/configuration.md).

## Атомарные приватные расчёты SORA Nexus {#nexus-atomic-private-settlement}

Раздел `[nexus.atomic_private_settlement]` настраивает хранение зашифрованных вспомогательных записей на одном узле. Он содержит ровно два локальных ограничения хранения:

- `sidecar_max_records`: максимальное число сохраняемых зашифрованных записей расчётов.
- `sidecar_max_total_bytes`: максимальный объём сохраняемых канонических байтов.

Активация, профили доказательств, лимиты платежей, сроки действия и политика аудиторов определяются зафиксированной политикой конфиденциальности. Конфигурация узла не может активировать или менять эти правила допустимости.

Конфигурация хранения и эксплуатационные требования описаны в разделе [Выполнение атомарных приватных расчётов между пространствами данных](/ru/get-started/atomic-private-settlement.md). Реализация компонентов не подтверждает пригодность для промышленной эксплуатации.

## снимок данных {#snapshot}

Этот модуль отвечает за чтение и запись снимков данных [Вид мирового государства](/ru/blockchain/world#world-state-view-wsv).

Снимки данных хранят сериализованную контрольную точку обзора состояния мира, чтобы сетевой узел мог перезапуститься без воспроизведения каждого блока с Kura. Kura остается долговечной историей блоков и источником истины для воспроизведения; снимки данных являются ускоренным путем. При запуске Iroha проверяет метаданные снимка данных на соответствие настроенной цепочке и сохранённым блокам, прежде чем принять решение о загрузке снимка данных или возврате к воспроизведению.

::: tip Стереть снимки данных

В случае если с системой снимков данных что-то не так, и вы хотите начать с пустая страница (в терминах снимков данных), вы могли бы удалить указанный каталог [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Режим, в котором функционирует система снимков данных.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Строка, возможные значения:

- `read_write`: Iroha создает снимки данных с периодом, указанным [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). При запуске, Iroha считывает существующий снимок данных (если таковой имеется) и проверяет, что он актуален по отношению к хранилищу блоков.
- `readonly`: Похоже на `read_write`, но Iroha не создаёт никаких снимков.
- `disabled`: Iroha не создает новые снимки данных и не считывает существующие при запуске.

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

Каталог, в котором будут храниться снимки.

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

Телеметрия отправляет диагностические данные узла внешнему сборщику. Настройте `telemetry.url`, если узел должен отправлять данные сборщику; если сборщик не используется, опустите этот раздел. Периоды повторных попыток настраиваются в той же необязательной таблице.

### `telemetry.url` {#param-telemetry-url}

WebSocket URL телеметрического коллектора.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Минимальный период времени, который нужно ждать перед повторным подключением.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Максимальная степень числа 2, которая используется для увеличения задержки между повторными подключениями.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Путь к файлу для записи dev-telemetry

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
