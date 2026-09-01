---
translation_locale: hy
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
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

Կրկնակի հարձակումը փորձ է իրականացնել վավեր գործարքը մեկ այլ ցանցում, քան այն, որի համար նախատեսված էր: `chain` ստորագրված գործարքի օգտակար բեռի մաս է կազմում, մեկ շղթայի համար ստորագրված փոխարժեքը մերժվում է այլ շղթայի օգտագործող հանգույցների կողմից ID.

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

Համաձայնության հավաստիացնող հանգույցները պետք է օգտագործեն BLS-Normal բանալիները:

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

Պեկերի մասնավոր բանալին. Այն պետք է համապատասխանի `public_key`; համաձայնության հավաստիացնող հանգույցները պետք է օգտագործեն BLS-Normal բանալիներ:

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

Նախանշված վստահելի հանգույցների ցանկ:

Համաձայնության վավերացողները պետք է օգտագործեն BLS-Normal peer բանալիներ: Յուրաքանչյուր վավերացողի համար նաեւ տրամադրեք համապատասխան [`trusted_peers_pop`](#param-trusted-peers-pop) մուտք:

<param-table env="TRUSTED_PEERS">
<template #type>

Պարբերականների շղթաների շարքը: Օգտագործեք `PUBLIC_KEY@ADDRESS`, երբ հայտնի է P2P հասցեն; նաեւ ընդունվում է մերկ `PUBLIC_KEY` եւ թույլ է տալիս հանգույցների հասցեին հայտնաբերել կատակերգությունից:

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

BLS վավերացողի վստահելի հանգույցների սեփականության ապացույցի գրառումները:

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` եւ `pop_hex` դաշտերով օբյեկտների շարքը

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

## Գենեզիս {#genesis}

### `genesis.file` {#param-genesis-file}

Փաստաթղթի ուղին ստորագրված genesis բլոկի օգտակար լիցքավորման համար, որը ստեղծվում է `kagami genesis sign`: Ստեղծված պրոֆիլները սովորաբար գրում են դա որպես Norito `.nrt` ֆայլ:

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

Գնահատության բանալիների զույգի հանրային բանալին:

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

## Համացանց {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Կոնսենսուսի (sumeragi) և բլոկների համաժամացման (block_sync) նպատակով p2p հաղորդակցության հասցե։

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

Պարբերական հասցե (արտաքին, ինչպես տեսնում են այլ հանգույցներ):

Խոսակցություններ կներկայացվեն հարազատների հետ, որպեսզի նրանք կարողանան խոսակցել այն մյուս զուգահեռների հետ:

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

Բլոկների քանակը, որը կարող է ուղարկվել միաժամանակման հաղորդագրության մեջ:

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Վերջին բլոկի համար հանգույցների խնդրանքների միջեւ եղած ժամանակահատվածը:

Ավելի հաճախական կատակերգությունը կարճացնում է համաժամացման ժամանակը, բայց կարող է գերբեռնված լինել ցանցը:

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Խոսքային խմբի հաղորդագրության մեջ կատարված գործարքների առավելագույն թիվը:

Փոքր չափը հանգեցնում է ավելի երկար ժամանակի համաժամացման, բայց օգտակար է, եթե դուք ունեք բարձր փաթեթների կորուստ:

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Դեռահասների միջեւ գործարքի սպասման ժամանակահատվածը:

Ավելի հաճախական կատակերգությունը կարճացնում է համաժամացման ժամանակը, բայց կարող է գերբեռնված լինել ցանցը:

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Ժամանակի տեւողությունը, որից հետո հանգույցի հետ կապը դադարեցվում է, եթե հանգույցը գործազուրկ է:

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

հասցեն, որին պետք է լսի Torii սերվերը եւ որին հաճախորդներն են դիմում իրենց պահանջները:

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

[Torii վերջային կետերի ](/hy/reference/torii-endpoints.md) կողմից ընդունված բայթների առավելագույն թիվը կեղծ խնդրանքային մարմնի մեջ:

Այս սահմանը օգտագործվում է DOS հարձակումների կանխարգելման համար:

<param-table>
<template #type>

Բայթների թիվը

</template>
<template #default-value>

`64_000_000` (64 մլն բայթ)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Ժամանակը, երբ հարցումը կարող է մնալ խանութում, եթե մուտք չկա:

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Բարձրագույն սահմանը կենդանի հարցումների քանակին:

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Մի օգտագործողի համար կենդանի հարցումների քանակի վերին սահմանը:

<param-table type=number default-value=128 />

::: code-group

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

::: code-group

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

String- ը բաղկացած է մեկ կամ մի քանի գծով առանձին հրահանգներից: Յուրաքանչյուր հրահանգ կարող է ունենալ համապատասխան առավելագույն բառապաշարային մակարդակ, որը հնարավորություն է տալիս (օրինակ՝ ընտրում) համապատասխան տարածություններ եւ իրադարձություններ։ Iroha ենթադրում է, որ ավելի քիչ բացառիկ մակարդակները (օրինակ՝ `trace` կամ `info`) ավելի խոսակցական են, քան առավել բացառիկ մակարդակներ (օրինակ՝`error` կամ `warn`):

Բարձր մակարդակով, հրահանգների սինտակսը բաղկացած է մի քանի մասերից.

```
target[span{field=value}]=level
```

Ավելի մանրամասն տեղեկություններ ստանալու համար դիտեք [`tracing-subscriber` փաստաթղթերը](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info [`logger.level`](#param-logger-level) ի հետ համատեղ օգտագործում

`logger.filter` աշխատում է միասին [`logger.level`](#param-logger-level), եւ ոչ մեկը չի վերագրում մյուսը:

Օրինակ, եթե `logger.level` սահմանված է `INFO` եւ `logger.filter` սահմանված է `iroha_core=debug`, արդյունաբերվող ֆիլտրի հավաքածուն կլինի `info,iroha_core=debug` (այսինքն՝ `info` բոլոր մոդուլների համար, `debug` համար `iroha_core`).

:::

::: tip Գործընթացային ժամանակի թարմացում

Torii օպերատորի վերջային կետերի միջոցով այս պարամետրը ենթակա է վազման ժամանակի կոնֆigurացիայի թարմացման:

:::

### `logger.format` {#param-logger-format}

Լոգերի ձեւաչափը:

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `full`: Պաշտոնական ձեւաչափը: Սա թողարկում է մարդկային ընթերցելի, մեկ գծի օրագրեր յուրաքանչյուր իրադարձության համար, որը տեղի է ունենում, ընթացիկ տարածման համատեքստը ցուցադրվում է նախքան իրադարձության ձեւաչափված ներկայացումը:
- `compact`: Սովորական ձեւաչափի տարբերակ, որը օպտիմալացվել է կարճ գծի երկարությունների համար: Ներկայիս տարածության համատեքստից դաշտերը լրացվում են ձեւակերպված իրադարձության դաշտերին, եւ տարածության անունները չեն ցուցադրվում; բառապաշարային մակարդակը կրճատվում է մեկ տառով:
- `pretty`: արտանետում է չափազանց գեղեցիկ, բազմակողմանի օրագրեր, օպտիմալացված մարդկային ընթերցելիության համար: Սա հիմնականում նախատեսված է տեղական զարգացման համար եւ debugging, կամ հրամանատարների շարքի ծրագրերի համար, որտեղ ավտոմատացված վերլուծությունը եւ օրագրերի կոմպակտ պահեստավորումն ավելի քիչ առաջնահերթություն են տալիս, քան ընթերցելիությունն ու տեսողական գրավիչությունը:
- `json`: արտադրանքը նոր գծով սահմանված JSON օրագրեր: Սա նախատեսված է արտադրական օգտագործման համար համակարգերի հետ, որտեղ կառուցված օրագրերը սպառվում են որպես JSON վերլուծության եւ դիտման գործիքների միջոցով: JSON արտադրանքն օպտիմալացված չէ մարդկային ընթերցելիության համար:

Լրացուցիչ մանրամասների եւ նմուշի արդյունքների համար դիտեք [`tracing-subscriber` փաստաթղթերը ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura -ի մշտական պահեստային շարժիչը Iroha (հավաքարանի համար ճապոնական)

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Առավելագույնը N վերջին բլոկները պահվում են հիշողության մեջ:

Ավելի հին բլոկները կհեռացվեն հիշողությունից եւ կբեռնվեն սկավառակի վրա, եթե դրանք անհրաժեշտ են:

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

Kura նախաձեռնման ռեժիմը: `strict` սովորական եւ կանխատեսված ռեժիսմն է. այն հավաստիացնում է քանոնիկ պատմությունը, վերականգնման արվեստները, օժանդակ ինդեքսները եւ պահեստային հաշվառումը մինչեւ հանգույցը ակտիվանա:

`fast` Օպերացիոն տեսանելիությունը վերականգնելու համար շտապային ծառայության վատթարացված ռեժիմ է, երբ Սկզբնական վերլուծությունը կարող է խափանվել: Այն պահանջում է պահեստավորում, որը նախապես նախաձեռնված էր `strict` եւ ներկայիս ակնթարթային պատճենի սերունդ, որը պարունակում է ճիշտ հինգ արվեստի գործիքներ. `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, եւ `snapshot.merkle.json`. Տիրույթների առանձին օպերատորի ստորագրությունը կապում է գովազդված օգտակար բեռը եւ սահմանված մանիֆեսը; մանիֆեսը կապում է օգտակար բեռի երկարությունը, շղթայի/հոսքի ինքնությունը, վերջակետային բարձրությունը/հաշը, SCCP քաղաքականության hash, եւ bootstrap-lineage ներկայությունը. արագ մերժում է bootstrap ցեղատեսակ եւ պահանջում է նույն ճշգրիտ նշանի/հաշվարկի/ծնիկի սահմանը' տեւականից Kura. Առաջին թողարկման հանգույցները ընդունում են հենց այդ հինգ արվեստի գործիքները եւ մերժում են բոլոր այլ արվեստիագործների թվերը կամ ֆայլերի անունները:

`fast` ռեժիմը inventory է անում այդ հինգ անունները և metadata-ով կապում payload ու Merkle ֆայլերը, բայց չի կարդում, hash անում, parse անում կամ decode անում դրանց բովանդակությունը։ Այն ստորագրված manifest-ից կառուցում է նվազագույն World/Nexus, Kura-ի ճշգրիտ hash prefix-ը map անում միայն կարդալու համար և չի բացում snapshot-ի World-ը, block-hash array-ը, transaction history-ն, derived index-ները և durable recovery journal-ները։ Merkle, canonical և semantic snapshot audit-ները, պատմական block/finality/SCCP reconciliation-ը, Sumeragi active-height recovery-ն, merge ու query journal-ները, lane manifest/compliance աղբյուրները, Kura-backed SoraFS archive-ները, recursive storage accounting-ը և optional service reconciler-ները հետաձգվում են։ Local transaction admission-ը, proposal-ները, voting-ը, canonical write-երը և auxiliary producer-ները մնում են անջատված։ Kura-ն ինքն է մերժում writer startup-ը և durable mutation-ները, իսկ pipeline ու FASTPQ persistence queue-ները աշխատանքն անմիջապես մերժում են՝ այն պահելու կամ encode անելու փոխարեն։ Kura read APIs-ները նաև անջատում են repair և durability-sync վարքը․ temporary sidecar-ները չեն առաջ մղվում, բացակայող lane artifact-ները չեն հրապարակվում, progress barrier-ները fsync չեն արվում։ Sumeragi-ն և transaction gossip-ը չեն գործարկվում։ Torii-ն տրամադրում է միայն health, liveness, readiness, peer և configuration operation-ները․ API version-ը, status-ը, metrics-ը և սովորական state/history route-երը մնում են անհասանելի։ Readiness-ը անհասանելի է մինչև `strict` ռեժիմով վերագործարկումը։

Օգտագործեք `fast` միայն միջադեպի համար: Երբ ծառայությունը կայուն է, դադարեցրեք հանգույցը, վերականգնեք `strict` եւ վերսկսեք այնպես, որ յուրաքանչյուր հետաձգված ստուգում եւ ինդեքս վերակառուցումը սկսվի նախքան արտադրությունը վերսկսելը: Արագ ռեժիմը չի պահանջում հետաձգված համալրման արձանագրությունը եւ չի ստեղծում, վերականգնում, կտրում կամ ներմուծում կանոնիկ պահեստավորում: Անբացահայտված հաջորդականությունները եւ սպասվող օժանդակ վերականգնման փուլերը անտեսվում են ՝ առանց կարդալու կամ մուտացիայի, այնուհետեւ թողնելով խիստ վերականգնման համար: Միայն ներմուծված շեշային ակնթարթային պատճենների գիծը դեռեւս հասանելի չէ: Մնացած կամ անվավեր ընթացիկ շեշը անհետանում է անմիջապես. Արագը երբեք չի վերադառնում դատարկ աշխարհին կամ պատմական կրկնապատկման վերակառուցմանը:

<param-table default-value=strict>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `strict`: ամբողջական վավերացում եւ նորմալ արտադրություն
- `fast`: սահմանափակ շտապային մեկնարկ, արտադրությունը կարանտինի տակ է մինչեւ խիստ վերագործարկում

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Նշում է ցուցակը[^paths], որտեղ պահվում են բլոկները:

Նայեք նաեւ. [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Պիտակ, որը թույլ է տալիս տպել նոր բլոկներ կոնսոլի համար:

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

## Աջակցություն {#queue}

### `queue.capacity` {#param-queue-capacity}

Բարձրագույն սահմանը հերթում սպասող գործարքների քանակի համար:

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Մեկ օգտագործողի համար հերթում սպասվող գործարքների քանակի վերին սահմանը:

Օգտագործեք այս տարբերակը ջրհեղեղման համար:

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Գործարքը հետաձգվում է այս ժամանակից հետո, եթե այն դեռեւս հերթում է:

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Դեբուգ-միայն կոճակը վարելու համար Sumeragi փափուկ ճյուղի կառավարման ուղիները: Թող այն անջատվի վերահսկվող փորձարկումների սահմաններից դուրս. Գործող արտադրական ցանցում դրա փոփոխությունը կարող է հանգույցների հետ համաձայնության չհամաձայնել կոնսենսուսային վարքագծի վերաբերյալ:

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Ատոմային մասնավոր կարգավորում {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` կառավարում է առանձին `AtomicPrivateSettlementV1` ուղին: Այն անջատված է կանխորոշմամբ: `enabled = true` սահմանումը պահանջում է նաեւ `activation_height`; մուտքը դեռեւս չի փակվում, եթե ակտիվ չեն ցանցային հնարավորությունը, ծանուցման ժամկետը, հաստատված ապացույցի պրոֆիլը եւ բյուջեի / աուդիտի կառավարումը։

Հիմնական սահմանները հետեւյալն են. `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, եւ `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` պետք է լինի խիստ աճող ենթակազմի V1 պաշինգի դասեր: `permitted_policy_versions` ընդունում է միայն V1.

`max_capsule_bytes` չափում է ամբողջական `PrivateSettlementAuditCapsuleV1` բայթերի քանոնիկ Norito, ներառյալ AAD, նոնս, կոդային տեքստ, վեկտորային շրջանակավորում եւ յուրաքանչյուր աուդիտոր, որը փակված է DEK շարքում: Սա ոչ միայն կոդային թեքստի սահման է: Յուրաքանչյուր թույլատրված լցնման դասը պետք է համապատասխանի պահպանողական ամբողջ կապսուլային փաթեթին առնվազն `default_min_auditor_approvals` աուդիտորների համար: Այդ հավանության կարգավորումը նաեւ կառավարվող հատակ է. Torii մերժում է նոր ընդունված քաղաքականությունը, որն ունի ավելի ցածր արժեք `min_approvals` եւ մերժում ցանկացած փաստացի կապսուլի, որը գերազանցում է կանոնական բայթային սահմանը:

Այս կարգավորումները արտադրական միջավայրի փոփոխականով ակտիվացումը շրջանցելու միջոց չունեն։ Կազմաձևման ամբողջական օրինակի և գործառնական պահանջների համար տես [Գործարկել ատոմային մասնավոր հաշվարկը տվյալների տարածքների միջև](/hy/get-started/atomic-private-settlement) բաժինը։ Ուղին արտադրական օգտագործման համար որակավորված չէ, քանի դեռ չի անցել փաստաթղթավորված արտաքին թողարկման բոլոր ստուգումները։

## Նկարներ {#snapshot}

Այս մոդուլը պատասխանատու է [Համաշխարհային վիճակի տեսք](/hy/blockchain/world#world-state-view-wsv) կայքի ակնթարթային ակնթարթային պատճենների կարդալու եւ գրելու համար:

Snapshots- ը պահում է World State View- ի սերիալացված ստուգման կետ, որպեսզի հանգույցն կարողանա վերսկսել ՝ առանց Kura -ից յուրաքանչյուր բլոկի կրկնելու: Kura-ը մնում է ամուր բլոկների պատմությունը եւ կրկնելու համար ճշմարտության աղբյուրը. snapshots- ն արագացման ուղին է: Սկսելիս Iroha-ը ստուգում է շտանկարային մետադատաները կազմված շղթայի եւ պահվող բլոկների հետ, նախքան որոշելը, թե արդյոք ներբեռնել կամ վերադառնալ կրկնօրինակելու:

::: tip Սրբել նկարները

Այն դեպքում, եթե ինչ-որ բան սխալ է snapshots համակարգի հետ, եւ դուք ցանկանում եք սկսել դատարկ էջից (հետաքրքրական ակնթարթային պատճենների առումով), կարող եք հեռացնել ցուցակը նշված է [`snapshot.store_dir`](#param-snapshot-store-dir):

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot համակարգի ռեժիմը:

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Շերտեր, հնարավոր արժեքներ.

- `read_write`: Iroha ստեղծում է snapshots ժամանակահատվածով, որը նշված է [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Սկսելուց հետո, Iroha կարդում է գոյություն ունեցող snapshot (եթե կա) եւ ստուգում է, որ այն արդիական է բլոկների պահեստավորման հետ:
- `readonly`: Հավասար է `read_write`, բայց Iroha չի ստեղծում որեւէ snapshots.
- `disabled`: Iroha չի ստեղծում նոր ակնթարթային պատճեններ եւ չի կարդում առկա ակնթարթային պատճենները մեկնարկից հետո:

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

Հանկարծակի ակնթարթային պատճենների հաճախականությունը:

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Գրադարան, որտեղ կարելի է պահել ակնթարթային պատճենները:

Տես նաեւ. [`kura.store_dir`](#param-kura-store-dir)

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

## Հեռաչափություն {#telemetry}

Հեռաչափությունը արտահանում է հանգույցների ախտորոշումը արտաքին հեռաչափության հավաքագրող: Կոնֆigurել `telemetry.name` եւ `telemetry.url`, երբ հանգույցին պետք է զեկուցի հավաքողին. բաց թողնել բաժինը, երբ հեռաչափությունը չի օգտագործվում:

`name` եւ `url` զույգերը պետք է լինեն:

Բոլոր `telemetry` բաժինները ընտրանքային են:

### `telemetry.name` {#param-telemetry-name}

Նոթի անունը, որը պետք է ցուցադրվի հեռաչափության վրա:

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Հեռաչափման հավաքիչի WebSocket URL

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Վերադարձ կապից առաջ սպասելու նվազագույն ժամկետը:

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 առավելագույն ցուցանիշը, որը օգտագործվում է վերապակցումների միջեւ հետաձգման մեծացման համար:

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Փաստաթուղթը գրելու dev-telemetry

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
