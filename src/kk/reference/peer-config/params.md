---
translation_locale: kk
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Конфигурация параметрлері {#configuration-parameters}

[toc]

## Тамыр деңгейі {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID тізбегі әрбір транзакцияға енгізілуі тиіс. Қайта ойнау шабуылдарын болдырмау үшін қолданылады.

Қайта ойнату атағы - жарамды транзакцияны басқа желіге жіберу әрекеті. Себебі `chain` қол қойылған транзакцияның пайдалы жүктемесінің бөлігі болып табылады, бір тізбекке қол қойылған трансакцияны басқа тізбекті пайдаланатын әріптестері бас тартады. ID.

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

Консенсус құлақтандырушы жұртшылық кілті BLS-Нормалды кілттерді қолдануы тиіс.

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

Салыстырманың жеке кілті: ол `public_key` сәйкес келуі тиіс; келісімді растаушы теңгерімдер BLS-Әдеттегі кілттерді қолдануы керек.

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

Алдын-ала анықталған сенімді әріптестер тізімі.

Келiсiмдiк бекiтушiлер BLS-Нормалды теңгершiлiк кілттердi қолдануы тиiс. Әрбiр бекiтуші үшiн, сондай-ақ сәйкес келетiн [`trusted_peers_pop`](#param-trusted-peers-pop) жазуын беріңіз.

<param-table env="TRUSTED_PEERS">
<template #type>

Жақсылар жіптерінің қатаршығы. `PUBLIC_KEY@ADDRESS` адресі белгілі болған кезде P2P пайдалану; бос `PUBLIC_KEY` де қабылданады және жаңсақтардың мекенжайы масқарадан анықталады.

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

BLS растаушының сенімді әріптестері үшін иелік дәлелдемесі.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` және `pop_hex` өрістері бар нысандар тізімі

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

## Жаратылыс {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` тудырған қол қойылған генез блогының пайдалы жүктемесіне файл жолы. Жаратылған профильдер әдетте оны Norito `.nrt` файлы ретінде жазады.

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

Жаратылыс кілтінің қоғамдық кілті.

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

Консенсус (sumeragi) және блок синхронизациясы (block_sync) мақсаттары үшін p2p байланыс адресі.

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

Бір-бірімен байланысқан мекенжай (басқа бір-бірінен көрінетін сыртқы).

Жақсы достармен әңгімелесуге болады, сонда олар басқа достармен сөйлесе алады.

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

Бір синхрондық хабарламада жіберілетін блоктардың саны.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Соңғы блок үшін әріптестерге сұраулар арасындағы уақыт аралығы.

Көбірек әңгімелесу синхронлау уақытын қысқартады, бірақ желіге артық жүктеме әкелуі мүмкін.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Ақыл-кеңес туралы хабардың ең көп транзакциялары.

Кішкентай өлшемі ұзағырақ уақытқа әкеледі, бірақ егер пакеттерді жоғалту көп болса пайдалы.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Бір-бірімен қарым-қатынас жасауды күтіп тұрып, әңгімелесу кезеңі.

Көбірек әңгімелесу синхронлау уақытын қысқартады, бірақ желіге артық жүктеме әкелуі мүмкін.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Егер теңгерімсіз болса, теңгеріммен байланыс тоқтатылатын уақыт.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii сервері тыңдауға тиіс және клиент өз өтініштерін қояды.

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

[Torii аяқтық нүктелері ](/kk/reference/torii-endpoints.md) қабылдаған шикі өтiнiш органындағы байттардың ең көп саны.

Бұл шегі DOS шабуылын болдырмау үшін қолданылады.

<param-table>
<template #type>

Байт саны (байттер)

</template>
<template #default-value>

`64_000_000` (64 млн. байт)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Сұрау салуға қол жеткізбеген жағдайда дүкенде болуы мүмкін уақыт.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Тікелей сұрау салғандардың санының жоғарғы шегі.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Бір пайдаланушы үшін тікелей сұрау салулар санының жоғарғы шегі.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Ағаш кесуші {#logger}

### `logger.level` {#param-logger-level}

Жалпы тіркелу сөзбе-сөзділігі (жақсыланған конфигурация үшін [`logger.filter`](#param-logger-filter) қараңыз).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Стринг, мүмкін мәндер:

- `TRACE`: Төменгі деңгейдегі операцияларды қоса алғанда, барлық іс-шаралар.
- `DEBUG`: Дебог деңгейіндегі хабарламалар, диагностика үшін пайдалы.
- `INFO`: Жалпы ақпараттық хабарлар.
- `WARN`: Әлеуетті мәселелерді көрсететін ескертулер.
- `ERROR`: Әдеттегі жұмыс істеуіне кедергі келтіретін, бірақ жалғастыруға мүмкіндік беретін қателер.

Сіздің пайдалану жағдайыңызға ең қолайлы деңгейді таңдаңыз. Әртүрлі журналды пайдалану деңгейі туралы қосымша мәліметтер үшін [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) дегенге жүгініңіз.

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

::: tip Жүргізу уақытын жаңарту

Бұл параметр Torii операторының аяқтық нүктелері арқылы жұмыс уақытының конфигурациясын жаңартуға жатады.

:::

### `logger.filter` {#param-logger-filter}

[ `logger.level`](#param-logger-level) қосымшасы бойынша тазартылған журналды сүзгілер. Арнайы мақсат бойынша жазу сөзділігін баптауға мүмкіндік береді.

<param-table type=string env=LOG_FILTER>
<template #type>

Стринг, бiр немесе бiрнеше сызықпен бөлiнген директивтерден тұрады. Әрбiр директиваға сәйкес келген ең жоғары сөздiлiк деңгейi болуы мүмкiн, бұл (мысалы, таңдап алады) соған сәйкес аралықтар мен оқиғаларды қамтамасыз етедi. Iroha кем эксклюзивті деңгейлерді (мысалы, `trace` немесе `info`) көбірек эксклюзівті деңгейлерден гөрі сөзбе-сөзді деп санайды ( мысалы, `error` немесе `warn`).

Жоғары деңгейдегі директивалар синтаксисі бірнеше бөлімнен тұрады:

```
target[span{field=value}]=level
```

Қосымша мәлімет үшін [`tracing-subscriber` құжаттамасын қараңыз ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info [`logger.level`](#param-logger-level) параметрімен бірге қолдану

`logger.filter` [`logger.level`](#param-logger-level)мен бірге жұмыс істейді және екеуі де бірін-бірі өшіріп тастамайды.

Мысалы, егер `logger.level` белгіленеді `INFO` және `logger.filter` белгіленеді `iroha_core=debug`, нәтижелі сүзгі жиынтығы: `info,iroha_core=debug` (мысалы, `info` барлық модульдер үшін, `debug` үшін `iroha_core`).

:::

::: tip Жүргізу уақытын жаңарту

Бұл параметр Torii операторының аяқтық нүктелері арқылы жұмыс уақытының конфигурациясын жаңартуға жатады.

:::

### `logger.format` {#param-logger-format}

Журнал форматы.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Стринг, мүмкін мәндер:

- `full`: Әдеттегі форматтаушы. Бұл оқиғаның пішімделген бейнелеуінен бұрын ағымдағы аралық контексті көрсетіле отырып, әрбір оқиға үшін адам оқитын, біржолғы журналды шығарады.
- `compact`: Қысқа сызық ұзындығы үшін оңтайландырылған әдеттегі форматтаушының нұсқасы. Назардағы аралық контекстіндегі өрістер форматталған оқиғаның өрістерімен қоса беріледі, ал аралық атаулары көрсетілмейді; сөздік деңгейі бір таңбаға қысқартылады.
- `pretty`: Өте әдемі, көп сызықты журналды шығарады, ол адамның оқу қабілеті үшін оңтайландырылған. Бұл негізінен жергілікті даму және тіркелгілердің автоматтандырылған талдау және компакт-диспетчерлік сақталуы оқу қабілеті мен көрнекі тартымдылығынан аз басымдық беретін командалық желідегі қолданбалар үшін дебоғаттау.
- `json`: Жаңа сызықпен шектелген JSON журналдарды шығарады. Бұл құрылымдалған журналды талдау және қарау құралдары арқылы JSON ретінде тұтыну жүйелерімен өндірістік пайдалануға арналған. JSON шығысы адамның оқу қабілеті үшін оңтайландырылмайды.

Қосымша мәліметтер мен үлгінің шығыстары үшін [`tracing-subscriber` құжаттамасын қараңыз ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura - Iroha тұрақты сақтау қозғалтқышы (шатыр үшін жапон).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Ең көп дегенде N соңғы блоктар жадында сақталады.

Бұрынғы блоктар естуден шығарылады және қажет болған жағдайда дисктен жүктеледі.

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

Kura бастау режимі. `strict` - қалыпты және әдеттегі режим: ол түйін белсенді болудан бұрын каноникалық тарихын, қалпына келтіру артефакттерін, көмекші индекстерді және сақтау есебін растайды.

`fast` операциялық көріністі қалпына келтіру үшін төтенше қызмет режимінің төмендеуі. толық стартап аудитін тоқтату қаупі бар. Ол алдын ала `strict` және дәл бес артефактті қамтитын ағымдағы шұғыл сурет генерациясы: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, және `snapshot.merkle.json`. Доменге бөлінген оператордың қолтаңбасы жарнамаланған пайдалы жүк дигесін және шектелген манифесті бекітеді; манифест пайдалы жүктеменің ұзындығын, тізбек/желіктегі сәйкестігін, терминал биіктігін/шашықты байланыстырады; SCCP саясатты шеш, және ботстрап-линейгі болуы. жылдам бас тартады ботстрапты тұқым және тұрақтыдан дәл бірдей таңбалаушы / санаушы / ұпай шекарасын талап етеді Kura. Алғашқы релиз түйіндері дәл сол бес артефактті қабылдайды және басқа артефакт санын немесе файл атау жиынтығын бас тартады.

Бұл 5 атау мен метамәдени деректерді тез қорғайды. Пайдалы жүктемені және Merkle файлдарын байлайды, бірақ олардың мазмұнын оқымайды, хэш, талдау немесе кодтамайды. Ол қол қойылған манифесттен минималды әлем / Nexus жасайды, нақты Kura хэш префиксін тек оқу арқылы картаға шығарады және World, block-hash массивін қалдырады, транзакция тарихын, түзілген индекстерді және ұзақ мерзімді қалпына келтіру журналдарын ашпаған. Merkle, каноникалық және семантикалық шұғыл аудиттер, тарихи блок/тоқсандық/SCCP келісу, Sumeragi белсенді биіктіктегі қалпына келтіру, біріктіру және сұрау журналдары, жол манифесті / сәйкестік көздері, Kura қолданатын SoraFS мұрағаттар, рекурсивті сақтауды есепке алу және ерікті көрсетілетін қызметтердің келісушілері кейінге қалдырылды. Жергілікті транзакцияларды қабылдау, ұсыныстар, дауыс беру, каноникалық жазбалар және көмекші өндірушілер рұқсат етілмейді. Kura өзі жазушыны бастау мен тұрақты мутацияларды қабылдамайды; құбыр және FASTPQ табандылық кезектері оны сақтау немесе кодтаудың орнына жұмысты дереу бас тартады. Kura оқыңыз APIs сондай-ақ жөндеуді және ұзаққа созылғандықты синхронизациялау мінез-құлқын өшіріңіз: уақытша қосалқы автокөліктер таныстырылмайды, жоғалған жол артефактілері жарияланбайды және прогресске кедергілер орнатылмайды. Sumeragi және транзакция мақалалары іске асырылмайды. Torii тек денсаулықты, өмір сүру қабілетін, дайындық пен конфигурациялық операцияларды көрсетеді; API-версиясы, жай-күйі, өлшемдері және барлық әдеттегі мемлекет / тарих бағыттары қолжетімді емес.

`fast` тек бір оқиға үшін қолданылады. Қызмет тұрақты болған соң, түйінді тоқтатып, `strict` қалпына келтіріңіз және қайта бастаңыз, сондықтан әрбір кейінге қалдырылған тексеру мен индекс қайта құру өндіріс қайта басталмастан бұрын орындалады. Шұғыл режим кейінге қалдырылған қосылу журналын қажет етпейді және қаноникалық сақтауды құру, жөндеу, қысқарту немесе импорттау мүмкін емес; жарияланбаған суффикстер мен күтілетін көмекші қалпына келтіру кезеңдері оқылмастан немесе өзгерместен назардан тыс қалып, содан кейін Қатаң қалпына келтіру үшін қалдырылады. Импортталған тек хештан жасалған мылтық кескіндеме желісі әлі де қолжетімді емес. Жоғалған немесе жарамсыз ағымдағы мылтык кескін дереу сәтсіздікке ұшырайды; жылдам ешқашан бос әлемге немесе тарихи қайта құруға қайтып кірмейді.

<param-table default-value=strict>
<template #type>

Стринг, мүмкін мәндер:

- `strict`: толық растау және қалыпты өндіріс
- `fast`: Шектелген шұғыл іске қосу, өндіріс қарантинге шығарылғанға дейін Қатаң қайта бастау

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Блоктардың сақталған каталогы [^paths] көрсетіледі.

Сондай-ақ, қараңыз: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Консольге жаңа блоктарды басып шығаруға мүмкіндік беретін байрақ.

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

Кезекте тұрған транзакциялардың санының жоғарғы шегі.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Бір пайдаланушы үшін кезекте тұрған транзакциялардың санының жоғарғы шегі.

Бұл параметрді құю үшін пайдаланыңыз.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Егер транзакция әлі кезекте тұрса, ол осы уақыттан кейін тоқтатылады.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi жұмсақ бұрылғыларды басқару жолдарын жүзеге асыру үшін дебог-тек коммутатор. Оны бақыланатын сынақтардың сыртында рұқсат етіңіз; оны жұмыс істеп тұрған өндірістік желіде өзгерту әріптестердің консенсус мінез-құлқы туралы келіспеушілік тудыруы мүмкін.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Атомдық жеке есеп айырысу {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` бөлек `AtomicPrivateSettlementV1` жолды реттейді. Ол әдетті түрде өшіріледі. `enabled = true` параметрін орнату үшін, сондай-ақ `activation_height` қажет; қосылу желідегі мүмкіндік, ескерту мерзімі, тұрақты дәлелді профиль және қор / аудит басқару белсенді болмаса, әлі де жабылады.

Негізгі шектеулер: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, және `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` қатаң өсіп келе жатқан қосалқы жиынтық болуы тиіс V1 Жүгіру сабақтары. `permitted_policy_versions` тек қана қабылдайды V1.

`max_capsule_bytes` толық `PrivateSettlementAuditCapsuleV1` байттарының, соның ішінде AAD, нонс, шифрлы мәтіннің, векторлық қоршаудың және DEK жіптелген әрбір аудитордың канондық Norito байттарын өлшереді; бұл тек шифрлы текстке ғана шектелмейді. Әрбір рұқсат етілген толтыру класы кем дегенде `default_min_auditor_approvals` аудиторлар үшін консервативті тұтас капсула конвертіне сәйкес келуі керек. Бұл бекіту параметрі де реттелетін деңгей болып табылады: Torii жаңадан қабылданған `min_approvals` мәнінің төмен саясатты бас тартады және каноникалық байт шегінен жоғары кез келген нақты капсуланы бас тартады.

Бұл параметрлерде өндірістік ортаның ауытқушы белсенділеу бұйырылуы жоқ. Толық конфигурация мысалы мен пайдалану талаптары үшін ](/kk/get-started/atomic-private-settlement) Atomic Private Cross-Dataspace Settlement[ Run қараңыз. Құжатталған сыртқы босату қақпалары өткенше жол өндіріске жарамды емес.

## Кескесім {#snapshot}

Бұл модуль [World State View](/kk/blockchain/world#world-state-view-wsv) фотосуреттерін оқу және жазу үшін жауапты.

Снэп-шоттар World State View сериялы бақылау нүктесін сақтайды, сондықтан достар Kura блогының әрбір блогын қайта ойнамай-ақ қайта бастауы мүмкін. Kura тұрақты блок тарихын және қайта ойнау үшін шындық көзі болып қалады; снэп-шоттар жеделдету жолы болып табылады. Бастау кезінде Iroha слайдтың метамәдени деректерін конфигурацияланған тізбек пен сақталған блоктармен тексеріп, слайдты жүктеуге немесе қайта ойнауға шешім қабылдауға кіріседі.

::: tip Кескіндерді өшіру

Егер шұғыл суреттер жүйесінде бірдеңе дұрыс болмаса және сіз бос беттен бастағыңыз келсе, [`snapshot.store_dir`](#param-snapshot-store-dir) арқылы көрсетілген каталогты алып тастауыңыз мүмкін.

:::

### `snapshot.mode` {#param-snapshot-mode}

Сnapshot жүйесінің режимі.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Стринг, мүмкін мәндер:

- `read_write`: Iroha слайдтар арқылы келтірілген мерзімге слайдтарды құру [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Бастау кезінде, Iroha Қолданыстағы шұғыл кескінді (бар болса) оқып, блоктардың сақталуымен өзекті екендігін тексереді.
- `readonly`: `read_write`-ға ұқсас, бірақ Iroha кездейсоқ суреттер туғызбайды.
- `disabled`: Iroha жаңа фотосуреттерді пайда етпейді және бастапқыда бар суреттерді оқымайды.

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

Кескіннің жиілігі.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Суреттерді сақтау үшін каталог.

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

Телеметрия теңгерімдік диагностикаларды сыртқы телеметриялық коллекторға экспорттайды. `telemetry.name` және `telemetry.url` теңгерімді коллекторға хабарлағанда орнату; телеметрия қолданылмайтын жағдайда бөлімді қалдыру.

`name` және `url` жұпталуы тиіс.

Барлық `telemetry` бөлім ерікті.

### `telemetry.name` {#param-telemetry-name}

Телеметрияда көрсетiлетiн түйiннің аты.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Телеметрия жинағыштың WebSocket URL

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Қайта қосылудан бұрын күтудің ең аз уақыты.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Қайта қосылулар арасындағы кешіктіруді арттыру үшін пайдаланылатын 2 максималдық экспоненті.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Деве-телеметрияны жазудың файл жолы

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
