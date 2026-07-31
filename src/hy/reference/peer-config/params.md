---
translation_locale: hy
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Կազմակերպման պարամետրեր {#configuration-parameters}

[toc]

## Հիմնական մակարդակ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID շղթան, որը պետք է ներառվի յուրաքանչյուր գործարքի մեջ: Օգտագործվում է վերահսկողության հարձակումների կանխարգելման համար:

Կրկնակի հարձակումը փորձ է իրականացնել վավեր գործարքը մեկ այլ ցանցում, քան այն, որի համար նախատեսված էր: `chain` ստորագրված գործարքի օգտակար բեռի մաս է կազմում, մեկ շղթայի համար ստորագրված փոխարժեքը մերժվում է այլ շղթայի օգտագործող գործընկերների կողմից ID.

<param-table type=string env=CHAIN />

::: կոդային խումբ

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Համաձայնության հավաստիացնող գործընկերները պետք է օգտագործեն BLS-Normal բանալիները:

<param-table type="public-key" env="PUBLIC_KEY" />

::: կոդային խումբ

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Պեկերի մասնավոր բանալին. Այն պետք է համապատասխանի `public_key`; համաձայնության հավաստիացնող զուգընկերները պետք է օգտագործեն BLS-Normal բանալիներ:

<param-table type="private-key" env="PRIVATE_KEY" />

::: կոդային խումբ

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Վստահելի գործընկերների ցուցակ:

Համաձայնության հավաստիացնողները պետք է օգտագործեն BLS-Normal peer բանալիները: Յուրաքանչյուր հավաստիացողի համար նաեւ տրամադրեք համապատասխան [`trusted_peers_pop`](#param-trusted-peers-pop) մուտք:

<param-table env="TRUSTED_PEERS">
<template #type>

Պարբերականների շղթաների շարքը: Օգտագործեք `PUBLIC_KEY@ADDRESS`, երբ հայտնի է P2P հասցեն; նաեւ ընդունվում է մերկ `PUBLIC_KEY` եւ թույլ է տալիս զուգընկերների հասցեին հայտնաբերել կատակերգությունից:

</template>
</param-table>

::: կոդային խումբ

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

BLS վավերացողի վստահելի գործընկերների սեփականության ապացույցի գրառումները:

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` եւ `pop_hex` դաշտերով օբյեկտների շարքը

</template>
</param-table>

::: կոդային խումբ

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

## Ծննդոց {#genesis}

### `genesis.file` {#param-genesis-file}

Փաստաթղթի ուղին ստորագրված genesis բլոկի օգտակար լիցքավորման համար, որը ստեղծվում է `kagami genesis sign`: Ստեղծված պրոֆիլները սովորաբար գրում են դա որպես Norito `.nrt` ֆայլ:

<param-table type="file-path" env="GENESIS" />

::: կոդային խումբ

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Գնահատության բանալիների զույգի հանրային բանալին:

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: կոդային խումբ

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## Համացանց {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Address for p2p communication for consensus (sumeragi) and block synchronization (block_sync) նպատակների համար:

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: կոդային խումբ

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Պարբերական հասցե (արտաքին, ինչպես տեսնում են այլ գործընկերներ):

Խոսակցություններ կներկայացվեն հարազատների հետ, որպեսզի նրանք կարողանան խոսակցել այն մյուս զուգահեռների հետ:

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: կոդային խումբ

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

Բլոկների քանակը, որը կարող է ուղարկվել միաժամանակման հաղորդագրության մեջ:

<param-table type=number default-value=4 />

::: կոդային խումբ

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Վերջին բլոկի համար զուգընկերների խնդրանքների միջեւ եղած ժամանակահատվածը:

Ավելի հաճախական կատակերգությունը կարճացնում է համաժամացման ժամանակը, բայց կարող է գերբեռնված լինել ցանցը:

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: կոդային խումբ

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Խոսքային խմբի հաղորդագրության մեջ կատարված գործարքների առավելագույն թիվը:

Փոքր չափը հանգեցնում է ավելի երկար ժամանակի համաժամացման, բայց օգտակար է, եթե դուք ունեք բարձր փաթեթների կորուստ:

<param-table type=number default-value=500 />

::: կոդային խումբ

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Դեռահասների միջեւ գործարքի սպասման ժամանակահատվածը:

Ավելի հաճախական կատակերգությունը կարճացնում է համաժամացման ժամանակը, բայց կարող է գերբեռնված լինել ցանցը:

<param-table type=millis default-value=1_000 default-note="1 second" />

::: կոդային խումբ

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Ժամանակի տեւողությունը, որից հետո զուգընկերոջ հետ կապը դադարեցվում է, եթե զուգընկերը գործազուրկ է:

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: կոդային խումբ

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

հասցեն, որին պետք է լսի Torii սերվերը եւ որին հաճախորդներն են դիմում իրենց պահանջները:

<param-table type=socket-addr env=API_ADDRESS />

::: կոդային խումբ

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii վերջային կետերի ](/hy/reference/torii-endpoints.md) կողմից ընդունված բայթների առավելագույն թիվը կեղծ խնդրանքային մարմնի մեջ:

Այս սահմանը օգտագործվում է DOS հարձակումների կանխարգելման համար:

<param-table>
<template #type>

Բայթների թիվը

</template>
<template #default-value>

`64_000_000` (64 միլիոն բայթ)

</template>
</param-table>

::: կոդային խումբ

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Ժամանակը, երբ հարցումը կարող է մնալ խանութում, եթե մուտք չկա:

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: կոդային խումբ

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Բարձրագույն սահմանը կենդանի հարցումների քանակին:

<param-table type=number default-value=128 />

::: կոդային խումբ

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Մի օգտագործողի համար կենդանի հարցումների քանակի վերին սահմանը:

<param-table type=number default-value=128 />

::: կոդային խումբ

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Լոգեր {#logger}

### `logger.level` {#param-logger-level}

Գլխավոր արձանագրման բառապաշարը (տես [`logger.filter`](#param-logger-filter)՝ պարզեցված կոնֆիգուրացիայի համար):

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `TRACE`: Բոլոր միջոցառումները, ներառյալ ցածր մակարդակի գործողությունները:
- `DEBUG`: Debug- մակարդակի հաղորդագրություններ, օգտակար ախտորոշման համար:
- `INFO`: Ընդհանուր տեղեկատվական ուղերձներ:
- `WARN`: նախազգուշացումներ, որոնք ցույց են տալիս հնարավոր խնդիրներ:
- `ERROR`: Սխալներ, որոնք խանգարում են նորմալ գործառույթին, բայց թույլ են տալիս շարունակել աշխատանքը:

Ընտրեք այն մակարդակը, որը լավագույնս համապատասխանում է ձեր օգտագործման դեպքում: Հետեւեք [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)-ին ՝ տարբեր օրագրային մակարդակների օգտագործման մասին լրացուցիչ մանրամասների համար:

</template>
</param-table>

::: կոդային խումբ

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip Գործընթացային ժամանակի թարմացում

Torii օպերատորի վերջային կետերի միջոցով այս պարամետրը ենթակա է վազման ժամանակի կոնֆigurացիայի թարմացման:

:::

### `logger.filter` {#param-logger-filter}

Պարզացված արձանագրական ֆիլտրերը, բացի [`logger.level`](#param-logger-level): Թույլ է տալիս հարմարեցնել արձանագրման բառապաշարը յուրաքանչյուր թիրախի համար.

<param-table type=string env=LOG_FILTER>
<template #type>

String- ը բաղկացած է մեկ կամ մի քանի գծով առանձին հրահանգներից: Յուրաքանչյուր հրահանգ կարող է ունենալ համապատասխան առավելագույն բառապաշարային մակարդակ, որը թույլ է տալիս (օրինակ ՝ ընտրում) համապատասխան տարածություններ եւ իրադարձություններ: Iroha ենթադրում է, որ ավելի քիչ բացառիկ մակարդակները (ինչպիսիք են `trace` կամ `info`) ավելի խոսակցական են, քան առավել բացառիկ մակարդակներ (ինչպիսին են `error` կամ `warn`):

Բարձր մակարդակով, հրահանգների սինտակսը բաղկացած է մի քանի մասերից.

```
target[span{field=value}]=level
```

Ավելի մանրամասն տեղեկություններ ստանալու համար դիտեք [`tracing-subscriber` փաստաթղթերը](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: կոդային խումբ

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Համատեղելիություն [`logger.level`](#param-logger-level)

`logger.filter` աշխատում է միասին [`logger.level`](#param-logger-level), եւ ոչ մեկը չի վերագրում մյուսը:

Օրինակ, եթե `logger.level` սահմանված է `INFO` եւ `logger.filter` սահմանված է `iroha_core=debug`, արդյունաբերվող ֆիլտրի հավաքածուն կլինի `info,iroha_core=debug` (այսինքն՝ `info` բոլոր մոդուլների համար, `debug` համար `iroha_core`).

:::

::: tip Գործընթացային ժամանակի թարմացում

Torii օպերատորի վերջային կետերի միջոցով այս պարամետրը ենթակա է վազման ժամանակի կոնֆigurացիայի թարմացման:

:::

### `logger.format` {#param-logger-format}

Օրագրերի ձեւաչափը:

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `full`: Պաշտոնական ձեւաչափը: Սա թողարկում է մարդկային ընթերցելի, մեկ գծի օրագրեր յուրաքանչյուր իրադարձության համար, որը տեղի է ունենում, ներկայիս տարածման համատեքստը ցուցադրվում է նախքան իրադարձության ձեւաչափված ներկայացումը:
- `compact`: Սովորական ձեւաչափի տարբերակ, որը օպտիմալացվել է կարճ գծի երկարությունների համար: Ներկայիս տարածման համատեքստից դաշտերը լրացվում են ձեւաչափված իրադարձության դաշտերին, եւ տարածման անունները չեն ցուցադրվում; բառապաշարային մակարդակը կրճատվում է միայն մեկ տառով:
- `pretty`: Արտադրում է չափազանց գեղեցիկ, բազմակողմանի օրագրեր, օպտիմալացված մարդկային ընթերցելիության համար: Սա հիմնականում նախատեսված է օգտագործվելու տեղական զարգացման եւ debugging, կամ հրամանատարների գծի ծրագրերի համար. որտեղ օրագրերի ավտոմատացված վերլուծությունն ու համապարփակ պահպանումը ավելի քիչ առաջնահերթություն են տալիս, քան ընթերցելիությունը եւ տեսողական գրավիչությունը:
- `json`: արտադրանքը նոր գծով սահմանված JSON օրագրեր: Սա նախատեսված է արտադրական օգտագործման համար համակարգերի հետ, որտեղ կառուցված օրագրերը սպառվում են որպես JSON վերլուծության եւ դիտման գործիքների միջոցով: JSON արտադրանքն օպտիմալացված չէ մարդու ընթերցելիության համար:

Լրացուցիչ մանրամասների եւ նմուշի արդյունքների համար դիտեք [`tracing-subscriber` փաստաթղթերը ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: կոդային խումբ

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura -ի մշտական պահեստային շարժիչը Iroha (հավաքարանի համար ճապոնական)

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Առավելագույնը N վերջին բլոկները պահվում են հիշողության մեջ:

Ավելի հին բլոկները կհեռացվեն հիշողությունից եւ կբեռնվեն սկավառակի վրա, եթե դրանք անհրաժեշտ են:

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: կոդային խումբ

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura սկզբնականացման ռեժիմ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `strict`: բոլոր բլոկների խիստ վավերացում
- `fast`: Արագ նախաձեռնություն՝ միայն հիմնական ստուգումների միջոցով

</template>
</param-table>

::: կոդային խումբ

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Սpecifies the directory[^paths] որտեղ բլոկները պահվում են:

Նայեք նաեւ. [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: կոդային խումբ

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Պիտակ, որը թույլ է տալիս տպել նոր բլոկներ կոնսոլի համար:

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: կոդային խումբ

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## Աջակցություն {#queue}

### `queue.capacity` {#param-queue-capacity}

Բարձրագույն սահմանը հերթում սպասող գործարքների քանակի համար:

<param-table type=number default-value=65_536 />

::: կոդային խումբ

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Մեկ օգտագործողի համար հերթում սպասվող գործարքների քանակի վերին սահմանը:

Օգտագործեք այս տարբերակը ջեռուցման համար:

<param-table type=number default-value=65_536 />

::: կոդային խումբ

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Գործարքը հետաձգվում է այս ժամանակից հետո, եթե այն դեռեւս հերթում է:

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: կոդային խումբ

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Դեբուգ-միայն կոճակը վարելու համար Sumeragi փափուկ ճյուղի կառավարման ուղիները: Թող այն անջատվի վերահսկվող փորձարկումների սահմաններից դուրս. Գործող արտադրական ցանցում դրա փոփոխությունը կարող է զուգընկերների հետ համաձայնության չհամաձայնել կոնսենսուսային պահվածքի վերաբերյալ:

<param-table type=bool default-value=false />

::: կոդային խումբ

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Նկարներ {#snapshot}

Այս մոդուլը պատասխանատու է [World State View](/hy/blockchain/world#world-state-view-wsv) կայքի ակնթարթային լուսանկարների ընթերցման եւ գրելու համար:

Snapshots- ը պահում է World State View- ի սերիալացված ստուգման կետը, այնպես որ զուգընկերն կարող է վերսկսել ՝ առանց Kura -ից յուրաքանչյուր բլոկի կրկնելու: Kura -ը մնում է ամուր բլոկային պատմությունը եւ կրկնելու համար ճշմարտության աղբյուրը. snapshots- ն արագացման ուղին է: Սկսելիս Iroha-ը ստուգում է շտանկարային մետադատաները կազմված շղթայի եւ պահվող բլոկների հետ, նախքան որոշելը, թե արդյոք ներբեռնել կամ վերադառնալ կրկնօրինակելու:

::: tip Սրբել նկարները

Այն դեպքում, եթե ինչ-որ բան սխալ է snapshots համակարգի հետ, եւ ցանկանում եք սկսել դատարկ էջից (հետաքրքրական լուսանկարների առումով), դուք կարող եք հեռացնել ցուցակը, որը նշված է [`snapshot.store_dir`](#param-snapshot-store-dir):

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot համակարգի ռեժիմը:

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `read_write`: Iroha ստեղծում է snapshots ժամանակահատվածով, որը նշված է [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Սկսելիս, Iroha կարդում է գոյություն ունեցող snapshot (եթե կա) եւ ստուգում է, որ այն թարմ է բլոկների պահեստավորման հետ:
- `readonly`: Հավասար է `read_write`, բայց Iroha չի ստեղծում որեւէ snapshots.
- `disabled`: Iroha չի ստեղծում նոր լուսանկարներ եւ չի կարդում առկա լուսանկարները մեկնարկից հետո:

</template>
</param-table>

::: կոդային խումբ

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Հանկարծակի լուսանկարների հաճախականությունը:

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: կոդային խումբ

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Գրադարան, որտեղ կարելի է պահել լուսանկարները:

Տես նաեւ. [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: կոդային խումբ

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Հեռաչափություն {#telemetry}

Հեռաչափությունը արտահանում է զուգընկերների ախտորոշումը արտաքին հեռաչափության հավաքագրող: Կոնֆigurել `telemetry.name` եւ `telemetry.url`, երբ զուգընկերոջը պետք է զեկուցի հավաքողին. բաց թողնել բաժինը, երբ հեռաչափությունը չի օգտագործվում:

`name` եւ `url` զույգերը պետք է լինեն:

Բոլոր `telemetry` բաժինները ընտրանքային են:

### `telemetry.name` {#param-telemetry-name}

Նոթի անունը, որը պետք է ցուցադրվի հեռաչափության վրա:

<param-table type=string />

::: կոդային խումբ

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Հեռաչափման հավաքիչի WebSocket URL

<param-table type=string />

::: կոդային խումբ

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Վերադարձ կապից առաջ սպասելու նվազագույն ժամկետը:

<param-table type=millis default-value=1_000  default-note="1 second" />

::: կոդային խումբ

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 առավելագույն ցուցանիշը, որը օգտագործվում է վերապակցումների միջեւ հետաձգման մեծացման համար:

<param-table type=number default-value=4 />

::: կոդային խումբ

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Փաստաթուղթը գրելու dev-telemetry

<param-table type=file-path />

::: կոդային խումբ

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
