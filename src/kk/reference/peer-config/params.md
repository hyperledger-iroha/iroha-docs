---
translation_locale: kk
translation_source: /reference/peer-config/params.md
translation_source_hash: ebc05275774a1a86c81d5c5667613ffc2d9ad115ac19e40ba804daa736ba4084
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Конфигурация параметрлері {#configuration-parameters}

[[Мазмұны]]

## Түбір деңгейі {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Әр транзакцияда көрсетілуі тиіс тізбек идентификаторы. Қайталанатын шабуылдарды болдырмау үшін қолданылады.

Қайталама шабуыл дегеніміз – жарамды транзакцияны ол бағытталған желіден басқа желіге жіберуге тырысудың әрекеті. Өйткені `chain` қол қойылған транзакция жүктемесінің бөлігі болып табылады, бір тізбек үшін қол қойылған транзакция басқа тізбек идентификаторын пайдаланатын желі әріптестерімен қабылданбайды.

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

Желі пирінің ашық кілті. Консенсус валидатор желі пирлері BLS-Normal кілттерін пайдалануы керек.

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

Тораптың жеке кілті. `private_key` не тек иесіне қолжетімді кілт файлының жолы болатын `private_key_file` параметрінің дәл біреуін баптаңыз. Кілт `public_key` мәніне сәйкес болуы тиіс; консенсус валидатор тораптары BLS-Normal кілттерін пайдаланады.

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

Алдын ала анықталған сенімді желі әріптестерінің тізімі.

Консенсус растайтындар пайдалануы керек BLS-Қалыпты желілік тіркелім кілттері. Әрбір тексеруші үшін сәйкесін де қамтамасыз етіңіз [`trusted_peers_pop`](#param-trusted-peers-pop) кіру.

<param-table env="TRUSTED_PEERS">
<template #type>

Желі әріптесінің жолдарының массиві. P2P мекенжайы белгілі болғанда `PUBLIC_KEY@ADDRESS` пайдаланыңыз; таза `PUBLIC_KEY` де қабылданады және желі әріптесінің мекенжайы аңыздан анықталуына мүмкіндік береді.

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

BLS сенімдір желідегі процессор серіктестері үшін меншікке дәлел жазбалары.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` және `pop_hex` өрістеріне ие объектілер массиві

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

## блокчейн генерациясы {#genesis}

Алғаш және қайта іске қосқанда генезис сенім түбірінің дәл бір көзі қажет: `genesis.expected_hash` немесе `genesis.expected_hash_file`. Жасалған торап конфигурациялары екіншісін қолданып, қол қойылған блок жанындағы `genesis.expected_hash` файлын көрсетеді. Жасалған профильді көшіргенде осы байланысты сақтаңыз.

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` арқылы жасалған қол қойылған блокчейн бастау блогының жүктемесіне жол. Жасалған профильдер оны әдетте Norito `.nrt` файл деп жазады.

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

Блокчейннің бастапқы кілт жұбының ашық кілті.

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

## Желі {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Келісімге (sumeragi) және блоктарды синхрондау (block_sync) мақсатында p2p байланысқа арналған мекенжай.

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

Теңдес-құрылымдық мекен-жай (сыртқы, басқа желідегі теңдестер арқылы көрінетін).

Бұл байланысты желідегі тараптарға айтылып, олар оны басқа желідегі тараптарға тарата алады.

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

Блок синхрондау хабарларының таралу шегі: торап үлгілері және блок синхрондау жаңартулары.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Ең соңғы блок үшін желідегі әріптестерге сұрау салу арасындағы уақыт аралығы.

Жиі қауесет тарату синхрондау уақытын қысқартады, бірақ желіні шамадан тыс жүктеуі мүмкін.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Ауызша хабарлама пакетіндегі транзакциялардың максималды саны.

Кіші мөлшер синхрондауға уақытты ұзартады, бірақ егер сізде пакет жоғалуы жоғары болса, пайдалы болады.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Желідегі әріптестер арасындағы операция туралы қауесет тарап жатқан кезең.

Жиі қауесет тарату синхрондау уақытын қысқартады, бірақ желіні шамадан тыс жүктеуі мүмкін.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Желідегі әріптес тарап әрекетсіз болса, желідегі әріптеспен байланыс тоқтайтын уақыт ұзақтығы.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii сервері тыңдауы тиіс және клиент(тер) өз сұрауларын жасайтын мекенжай.

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

[Torii соңғы нүктелері](/kk/reference/torii-endpoints.md) қабылдайтын бастапқы сұрау денесіндегі байттардың ең көп саны.

Бұл шектеу DOS шабуылдарының алдын алу үшін қолданылады.

<param-table>
<template #type>

Байт саны

</template>
<template #default-value>

`64_000_000` (64 миллион байт)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Сұрау ешкім кірмесе, дүкенде қанша уақыт тұра алатыны.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Тікелей сұраулар санының жоғарғы шегі.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Бір пайдаланушыға арналған тірі сұраулар санының жоғарғы шегі.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Күнделік жүргізуші {#logger}

### `logger.level` {#param-logger-level}

Жалпы журнал жазу деңгейі (қараңыз [`logger.filter`](#param-logger-filter) нысқалы конфигурация үшін).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Жол, мүмкін болатын мәндер:

- `TRACE`: Барлық оқиғалар, төмен деңгейдегі операцияларды қоса алғанда.
- `DEBUG`: Диагностика үшін пайдалы, ақауларды түзету деңгейіндегі хабарламалар.
- `INFO`: Жалпы ақпараттық хабарлар.
- `WARN`: Мүмкін болатын мәселелерді көрсететін ескертулер.
- `ERROR`: Нормалды жұмысқа кедергі келтіретін, бірақ жұмысты жалғастыруға мүмкіндік беретін қателер.

Өзіңіздің қолдану жағдайыңызға ең сәйкес деңгейді таңдаңыз. Әртүрлі журнал деңгейлерін қалай пайдалану туралы қосымша мәліметтер үшін [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) қараңыз.

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

Сонымен қоса жетілдірілген журнал сүзгілері [`logger.level`](#param-logger-level). Әр мақсат үшін журнал жүргізудің егжей-тегжейлілігін баптауға мүмкіндік береді.

<param-table type=string env=LOG_FILTER>
<template #type>

Жол, бір немесе бірнеше үтірмен бөлінген нұсқаулардан тұрады. Әр нұсқаудың сәйкес ең үлкен егжей-тегжей деңгейі болуы мүмкін, ол сәйкес келетін аралықтар мен оқиғаларды қосуға (мысалы, таңдау жасауға) мүмкіндік береді. Iroha аз дараланған деңгейлерді (мысалы, `trace` немесе `info`) көбірек дараланған деңгейлерге (мысалы, `error` немесе `warn`) қарағанда сөздік тұрғыдан ұзын деп санайды.

Жалпы айтқанда, нұсқаулардың синтаксисі бірнеше бөліктен тұрады:

```
target[span{field=value}]=level
```

Толығырақ ақпарат үшін қараңыз [`tracing-subscriber` құжаттама](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Құрамы бар [`logger.level`](#param-logger-level)

`logger.filter` бірге жұмыс істейді [`logger.level`](#param-logger-level) және ешқайсысы бір-бірін жазып қоймайды.

Мысалы, егер `logger.level` `INFO`-ге орнатылса және `logger.filter` `iroha_core=debug`-ке орнатылса, нәтижесінде алынған сүзгі жинағы `info,iroha_core=debug` болады (яғни, барлық модульдер үшін `info`, `iroha_core` үшін `debug`).

:::

### `logger.format` {#param-logger-format}

Журналдардың форматы.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Жол, мүмкін болатын мәндер:

- `full`: Әдепкі форматтаушы. Бұл әрбір орын алған оқиға үшін адам оқитындай бір жолдық журналдарды шығарады, ағымдағы спан контексті оқиғаның форматталған көрінісінен бұрын көрсетіледі.
- `compact`: Әдепкі форматтаушының нұсқасы, қысқа жол ұзындықтарына оңтайландырылған. Ағымдағы спан контекстіндегі өрістер форматталған оқиға өрістеріне қосылады, және спан аттары көрсетілмейді; егжей-тегжей деңгейі бір таңбаға қысқартылған.
- `pretty`: Адам оқуға ыңғайлы етіп оңтайландырылған, тым әдемі, көпжақты журналдарды шығарады. Бұл негізінен жергілікті әзірлеуде қолдануға арналған. дебаг жүргізу немесе командалық жол қосымшалары үшін, мұнда логтарды автоматты талдау және ықшам сақтау оқу жеңілдігі мен визуалды тартымдылыққа қарағанда маңызды емес.
- `json`: Жаңа жолмен бөлінген JSON журналдарын шығарады. Бұл құрылымдалған журналдарды талдау және қарау құралдары JSON ретінде тұтынатын жүйелерде өндірістік пайдалану үшін арналған. JSON шығару адамға оқуға оңтайландырылмаған.

Қосымша мәліметтер мен үлгі нәтижелерді көру үшін қараңыз [`tracing-subscriber` құжаттама](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura — Iroha (қойма үшін жапон сөзі) тұрақты сақтау жүйесінің қозғалтқышы болып табылады.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Есте сақтау қабілетінде ең көп N соңғы блок сақталады.

Егер қажет болса, ескі блоктар жадтан өшіріліп, дискіден жүктеледі.

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

Kura инициализация режимі. `strict` қалыпты және әдепкі режим болып табылады: ол түйін белсенді болмас бұрын бір протоколдық стандарт тарихын, қалпына келтіру артефактілерін, қосымша индекстерді және сақтау есебін тексереді.

`fast` - толық іске қосу аудиті тоқтап қалу қаупін тудыратын жағдайда операциялық көріністі қалпына келтіру үшін арналған төтенше деградацияланған қызмет режимі. Ол `strict` арқылы алдын ала инициализацияланған сақтау құрылымын және дәл бес артефакттан тұратын ағымдағы уақыттағы мәліметтер көрінісін генерациялауды қажет етеді: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` және `snapshot.merkle.json`. Домен бойынша бөлінген оператор қолтаңбасы жарнамаланған payload криптографиялық дайджест мәнін және шектелген техникалық манифестті байланыстырады; техникалық манифест жүктеме ұзындығын, тізбек/желі бірегейлігін, терминал биіктігі/хэшін, SCCP саясаттық криптографиялық хэшін және бастапқы буынның болуын байланыстырады. Fast bootstrap текті тез тастайды және тұрақты Kura элементінен дәл сол маркер/есеп/шырын шекарасын талап етеді. Бірінші шығарылым түйіндері дәл сол бес артефактіді қабылдайды және басқа барлық артефакт санын немесе файл атауының жиынтығын қабылдамайды.

Fast осы бес атауды түгендеп, пайдалы жүктеме мен Merkle файлдарын метадеректері бойынша байланыстырады, бірақ олардың мазмұнын оқымайды, хэштемейді, талдамайды және декодтамайды. Ол қол қойылған манифесттен ең аз World/SORA Nexus құрады, дәл Kura хэш префиксін тек оқу үшін бейнелейді және күй кескінінің World бөлігін, блок хэштері массивін, транзакция тарихын, туынды индекстерді және тұрақты қалпына келтіру журналдарын ашпайды. Merkle аудиттері, канондық және семантикалық күй кескіні аудиттері, тарихи блок/түпкілікті бекітілу/SCCP салыстырулары, Sumeragi белсенді биіктігін қалпына келтіру, біріктіру және сұрау журналдары, арна манифесті/сәйкестік көздері, Kura негізіндегі SoraFS архивтері, рекурсивті сақтау есебі және міндетті емес қызмет салыстырғыштары кейінге қалады. Жергілікті транзакция қабылдау, ұсыныстар, дауыс беру, канондық жазулар және қосалқы өндірушілер өшірулі қалады. Kura өзі жазушыны іске қосуды және тұрақты өзгертулерді қабылдамайды; өңдеу тізбегі мен FASTPQ тұрақты сақтау кезектері жұмысты сақтамай не кодтамай, дереу қабылдамайды. Kura оқу APIs интерфейстері жөндеу мен тұрақтылықты синхрондауды да өшіреді: уақытша қосалқы файлдар негізгіге айналмайды, жетіспейтін арна артефактілері жарияланбайды және ілгерілеу тосқауылдары fsync арқылы синхрондалмайды. Sumeragi және транзакция тарату қызметі іске қосылмайды. Torii тек денсаулық, тірілік, дайындық, торап және конфигурация операцияларын ұсынады; API нұсқасы, күй, метрикалар және барлық кәдімгі күй/тарих маршруттары қолжетімсіз қалады. Strict режимінде қайта іске қосқанша дайындық қолжетімсіз болады.

Тек оқиғаға арналған `fast` пайдаланыңыз. Қызмет тұрақты болғаннан кейін, түйінді тоқтатып, `strict`-ді қалпына келтіріңіз және қайта іске қосыңыз, сонда барлық кейінге қалдырылған тексерулер мен индексті қайта құрулар өндіріс қайта басталар алдында орындалады. Жылдам режим кешіктірілген біріктіру журналына мұқтаж емес және бір протокол стандартты сақтау орындарын жасамайды, жөндемейді, қысқартпайды немесе импорттамайды; жарияланбаған қосымшалар мен күтіп тұрған қосалқы қалпына келтіру кезеңдері оқылмай немесе өзгертілмей еленбейді, кейін Қатаң қалпына келтіру үшін қалдырылады. Импортталған тек хэш бойынша уақыт нүктесіндегі мәліметтер көрінісінің сызықтық байланысы қолжетімсіз болып қалады. Қазіргі уақыт нүктесіндегі мәліметтер көрінісі жоқ немесе жарамсыз болса, дереу қате шығады; Fast ешқашан бос әлемге немесе тарихи қайта ойнауға қайта құруға қайтпайды.

<param-table default-value=strict>
<template #type>

Жол, мүмкін болатын мәндер:

- `strict`: толық тексеру және қалыпты өндіру
- `fast`: шектеулі төтенше іске қосу, өндіріс қатаң қайта іске қосылғанға дейін карантинде

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Блоктар сақталатын каталогты [^paths] көрсетеді.

Сондай-ақ қараңыз: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Жаңа блоктарды консольға шығару үшін белгі.

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

## Кезек {#queue}

### `queue.capacity` {#param-queue-capacity}

Кезекте күтіп тұрған транзакциялар санының жоғарғы шегі.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Бір пайдаланушы үшін кезекте тұрған транзакциялар санының ең жоғарғы шегі.

Тәуелділікті қолдану үшін осы параметрді пайдаланыңыз.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Егер транзакция әлі де кезекте болса, бұл уақыттан кейін ол жойылады.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

`[sumeragi]` түйінге жергілікті қатысуды, қол қою кілттерінің сақталуын, қауіпсіздік жазбаларының жолдарын және құжатталған күту уақыты мен синхрондау түзетулерін қамтиды. Консенсус режимі, комитет өлшемі, кворум, блок өлшемі және транзакция шектері қол қойылған генезис пен бекітілген күйден алынады. Ақау енгізу детерминдік симуляторға тиесілі.

Қолдау көрсетілетін өрістер үшін [конфигурацияны](/kk/guide/configure/overview.md) және бекітілген нұсқадағы [конфигурация анықтамалығын](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/references/configuration.md) қараңыз.

## SORA Nexus атомдық жеке есеп айырысуы {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` бір түйіндегі шифрланған қосалқы жазбалардың сақталуын баптайды. Ол дәл екі жергілікті сақтау шегін қамтиды:

- `sidecar_max_records`: сақталатын шифрланған есеп айырысу жазбаларының ең көп саны.
- `sidecar_max_total_bytes`: сақталатын канондық байттардың ең көп саны.

Белсендіру, дәлел профильдері, төлем шектері, жарамдылық мерзімі және аудитор саясаты бекітілген құпиялылық саясатынан алынады. Түйін конфигурациясы бұл жарамдылық ережелерін белсендіре не өзгерте алмайды.

Сақтау конфигурациясы мен операциялық талаптар үшін [Деректер кеңістіктері арасында атомдық жеке есеп айырысуды орындау](/kk/get-started/atomic-private-settlement.md) бөлімін қараңыз. Компоненттің іске асырылуы өндірістік біліктіліктің расталғанын білдірмейді.

## уақыт нүктесіндегі деректер көрінісі {#snapshot}

Бұл модуль [Әлемдік мемлекет көрінісі](/kk/blockchain/world#world-state-view-wsv) уақыт нүктесіндегі деректер көріністерін оқып жазуға жауап береді.

уақыт бойынша деректер көріністері Әлем Күйі Көрінісінің сериализацияланған тексеру нүктесін сақтайды, сондықтан желі әріптесі әр блокты Kura-ден қайта ойнатпай қайта бастауы мүмкін. Kura беріктігі бар блок тарихы және қайта ойнатудың шынайы дерек көзі болып қала береді; уақыт бойынша деректер көріністері жылдамдату жолы болып табылады. Жүктеу кезінде Iroha нүкте-уақыт деректерін көру метадеректерін конфигурацияланған тізбек пен сақталған блоктармен салыстырады, содан кейін нүкте-уақыт деректерін қарауды жүктеуге немесе қайта ойнатуға оралуға шешім қабылдайды.

::: tip Белгілі бір уақыттағы деректер көріністерін өшіру

Егер уақыт бойынша деректерді көру жүйесінде бірдеңе дұрыс болмаса, және сіз нүктелік уақыт деректерін көру тұрғысынан бос беттен бастауғыңыз келсе, сіз келесі арқылы көрсетілген каталогты өшіруге болады [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Нүктелік уақыт деректері көрінісі жүйесі жұмыс істейтін режим.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Жол, мүмкін болатын мәндер:

- `read_write`: Iroha көрсетілген мерзіммен уақыт нүктесіндегі деректер көздерін жасайды [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Жүктеу кезінде, Iroha бар болса, бар нүктелік уақыт деректер көрінісін оқиды және оның блоктар сақтауымен жаңартылғанын тексереді.
- `readonly`: `read_write` сияқты, бірақ Iroha ешқандай снэпшот жасамайды.
- `disabled`: Iroha жаңа уақыт нүктесіндегі деректер көріністерін жасамайды және іске қосқанда бар көріністі оқымайды.

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

Снимоктардың жиілігі.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Снэпшоттарды сақтау жері болатын каталог.

Сондай-ақ қараңыз: [`kura.store_dir`](#param-kura-store-dir)

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

Телеметрия торап диагностикасын сыртқы телеметрия жинағышына экспорттайды. Торап жинағышқа есеп беруі керек болса, `telemetry.url` баптаңыз; жинағыш қолданылмаса, бұл бөлімді қоспаңыз. Қайталау уақыты сол міндетті емес кестеде бапталады.

### `telemetry.url` {#param-telemetry-url}

Телеметрия жинағышының WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Қайта қосылу алдында күту үшін ең аз уақыт мерзімі.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Қосылулар арасындағы кідіртуді арттыру үшін қолданылатын 2 негізінің ең үлкен көрсеткіші.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Dev-telemetry жазу үшін файл жолы

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
