---
translation_locale: am
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# የማዋቀር መለኪያዎች {#configuration-parameters}

[toc]

## ሥር-ደረጃ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ሰንሰለት ID ይህም በእያንዳንዱ ግብይት ውስጥ መካተት አለበት.

የመልሶ ማጫወት ጥቃት ትክክለኛውን ግብይት ለተለየ
ምክንያቱም የኤሌክትሮኒክ መረብ `chain` አካል ነው
የተፈረመ የግብይት ጥቅማጥቅም ጭነት፣ ለአንድ ሰንሰለት የተፈረመ ግብይት ውድቅ ተደርጓል
ሌላ ሰንሰለት የሚጠቀሙ እኩዮች ID.

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

የጋራ ቁልፍ: የጋራ ስምምነት ማረጋገጫ BLS- መደበኛ ቁልፎች.

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

የባልደረባው የግል ቁልፍ `public_key`; የስምምነት ማረጋገጫ ባልደረቦች
መጠቀም አለበት BLS- መደበኛ ቁልፎች.

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

አስቀድሞ የተገለጹ የታመኑ እኩዮች ዝርዝር።

የስምምነት ማረጋገጫ ሰጪዎች መጠቀም አለባቸው BLS- መደበኛ የእኩዮች ቁልፎች.
ማመሳሰል ያቅርቡ [`trusted_peers_pop`](#param-trusted-peers-pop) መግቢያ።

<param-table env="TRUSTED_PEERS">
<template #type>

የእኩዮች ገመዶች ስብስብ። `PUBLIC_KEY@ADDRESS` መቼ ነው P2P አድራሻው ይታወቃል፤
ባዶ `PUBLIC_KEY` በተጨማሪም ተቀባይነት አግኝቷል እና የእኩዮች አድራሻ ከ
ወሬ።

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

BLS ለታመነ ባልደረባዎች የማረጋገጫ ማረጋገጫ ምዝገባዎች።

<param-table env="TRUSTED_PEERS_POP">
<template #type>

የዕቃዎች ሰንሰለት `public_key` እና `pop_hex` መስኮች

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

## ዘፍጥረት {#genesis}

### `genesis.file` {#param-genesis-file}

በ የተፈጠረ የፊርማ ጀነሲስ ብሎክ ተጠቃሚነት ወደ ፋይል መንገድ `kagami genesis sign`.
የተፈጠሩ መገለጫዎች በተለምዶ ይህን እንደ Norito `.nrt` መዝገብ።

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

የጄኔሲስ ቁልፍ ጥንድ የህዝብ ቁልፍ።

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

## የአውታረ መረብ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

የፒ 2 ፒ ግንኙነት አድራሻ ለስምምነት (ሱሜራጊ) እና ለብሎክ ሲንክሮኒዜሽን (ብሎክ)_(የተመሳሰሉት) ዓላማዎች።

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

ከባልደረባው ወደ ባልደረባው አድራሻ (ሌሎች ባልደረቦች እንደሚመለከቱት ውጫዊ) ።

ለሌሎች እኩዮችም ወሬው እንዲነገርላቸው ለተገናኙ እኩዮች ይነገራል ።

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

በአንድ የማመሳሰል መልዕክት ውስጥ ሊላኩ የሚችሏቸው ብሎኮች ብዛት።

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

የቅርብ ጊዜውን ብሎክ ለባልደረቦቹ ጥያቄዎች መካከል ያለው የጊዜ ልዩነት.

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊጫነው ይችላል።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

በሐሜት ስብስብ መልዕክት ውስጥ ከፍተኛ የግብይት ብዛት።

ትናንሽ መጠን ለጊዜው ለማመሳሰል ረዘም ያለ ጊዜ ያስከትላል, ነገር ግን ከፍተኛ የፓኬት ኪሳራ ካለዎት ጠቃሚ ነው.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

በእኩዮች መካከል ያለውን ግብይት በመጠባበቅ ላይ የሚወራጨው ወሬ።

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊጫነው ይችላል።

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

ከባልደረባው ጋር ያለው ግንኙነት ካልተቋረጠ በኋላ የሚቆየው ጊዜ።

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

አድራሻ Torii አገልጋዩ ማዳመጥ አለበት እና ደንበኛው ጥያቄዎቹን የሚያቀርብለት።

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

በቁሳዊ ጥያቄ አካል ውስጥ የባይቶች ከፍተኛ ቁጥር
[Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md).

ይህ ገደብ ለመከላከል ጥቅም ላይ ይውላል DOS ጥቃቶች።

<param-table>
<template #type>

ቁጥር (የባይቶች)

</template>
<template #default-value>

`64_000_000` (64 ሚሊዮን ባይት)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

አንድ ጥያቄ ካልተደረሰም በመደብሩ ውስጥ ሊቆይ የሚችለው ጊዜ።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

የቀጥታ መጠይቆች ብዛት ከፍተኛ ገደብ.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ለአንድ ተጠቃሚ የቀጥታ መጠይቆች ብዛት ከፍተኛ ገደብ።

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## የእንጨት ሰሪ {#logger}

### `logger.level` {#param-logger-level}

_አጠቃላይ_ የቃላት አጠቃቀም (እይታ) [`logger.filter`](#param-logger-filter) ለተጣራ ውቅር) ።

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `TRACE`: ዝቅተኛ ደረጃዎችን ጨምሮ ሁሉም ክስተቶች።
- `DEBUG`: ለዲያግኖስቲክስ ጠቃሚ የሆኑ የድብርት ደረጃ መልዕክቶች።
- `INFO`: አጠቃላይ የመረጃ መልዕክቶች
- `WARN`: ሊከሰቱ የሚችሉ ጉዳዮችን የሚያመለክቱ ማስጠንቀቂያዎች።
- `ERROR`: የተለመዱ ተግባራትን የሚያስተጓጉሉ ግን ቀጣይነት ያለው ሥራን የሚፈቅዱ ስህተቶች።

ለአጠቃቀም ሁኔታዎ በጣም የሚስማማውን ደረጃ ይምረጡ.
[የጅምላ ፍሰት](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ተጨማሪ
የተለያዩ የሎግ ደረጃዎችን እንዴት መጠቀም እንደሚቻል ዝርዝር መረጃ።

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

::: tip የስራ ሰዓት ዝመና

ይህ መለኪያ በ runtime ውቅር ማዘመን ተገዢ ነው Torii የኦፕሬተር መጨረሻ ነጥቦች።

:::

### `logger.filter` {#param-logger-filter}

የተጣራ የሎግ ማጣሪያዎች በተጨማሪ [`logger.level`](#param-logger-level). መዝገብ የቃላት ብዛት ለማበጀት ይፈቅዳል
በ..._ግብ_.

<param-table type=string env=LOG_FILTER>
<template #type>

አንድ ወይም ከዚያ በላይ በኮማ የተለዩ መመሪያዎች ያቀፈ string.
_ደረጃ_ ይህም (ለምሳሌ፣ _ለ_) የሚዛመዱ ክስተቶችና ተከታታይ ክስተቶች። Iroha ያነሰ ውስን ደረጃዎችን (እንደ
`trace` ወይም `info`) የበለጠ ግላዊነት የተላበሰ ደረጃዎች (እንደ `error` ወይም `warn`).

በከፍተኛ ደረጃ የዳይሬክቲቭዎች አገባብ በርካታ ክፍሎችን ያጠቃልላል-

```
target[span{field=value}]=level
```

ተጨማሪ መረጃ ለማግኘት ተመልከት
[`tracing-subscriber` ሰነድ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info ጋር ተኳሃኝነት [`logger.level`](#param-logger-level)

`logger.filter` ሥራዎች _አንድ ላይ_ ጋር [`logger.level`](#param-logger-level) አንዳቸውም ሌላውን አያጠፉም።

ለምሳሌ፣ `logger.level` ተዘጋጅቷል `INFO` እና `logger.filter` ተዘጋጅቷል `iroha_core=debug`, የተገኘው ማጣሪያ
ተዘጋጅቷል ይሆናል `info,iroha_core=debug` (ማለትም `info` ለሁሉም ሞጁሎች፣ `debug` ለ `iroha_core`).

:::

::: tip የስራ ሰዓት ዝመና

ይህ መለኪያ በ runtime ውቅር ማዘመን ተገዢ ነው Torii የኦፕሬተር መጨረሻ ነጥቦች።

:::

### `logger.format` {#param-logger-format}

የመለያ ቅርጸት.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `full`: ነባሪ ቅርጸት. ይህ ሰው ሊነበብ የሚችል, አንድ መስመር መዝገቦች ያወጣል
  ክስተቱን ቅርጸት ያወጣው መግለጫ ከመድረሱ በፊት የሚታየው የአሁኑ የጊዜ ሰሌዳ አውድ።
- `compact`: ለአጭር የመስመር ርዝመት የተመቻቸ ነባሪ ቅርጸት አቀራረብ።
  በፎርማቱ የተካተተው ክስተት መስኮች ላይ ተያይዘዋል ፣ እና የጊዜ ሰሌዳ ስሞች አይታዩም; የአፈፃፀም ደረጃ ወደ
  አንድ ነጠላ ገጸ-ባህሪ።
- `pretty`: ይህ በዋነኝነት የሰው አንባቢነት የተመቻቸ እጅግ ውብ, ባለብዙ መስመር መዝገቦችን ያወጣል.
  በአካባቢያዊ ልማት እና debugging ውስጥ ጥቅም ላይ የሚውለው ወይም በራስ-ሰር ትንተና እና የታመቀ የትእዛዝ መስመር መተግበሪያዎች
  የመረጃ ቋቶችን ማከማቸት ከአንባቢነትና ከዓይን አግባብነት ይልቅ ቅድሚያ የሚሰጠው ጉዳይ አይደለም።
- `json`: የውጤቶች አዲስ መስመር-የተወሰነ JSON ይህ የተዋቀረ መዝገብ ያላቸው ሥርዓቶች ጋር ምርት አጠቃቀም የታሰበ ነው
  እንደ JSON በመተንተን እና በማየት መሳሪያዎች. JSON ውጤቱ ለሰው ልጅ ሊነበብ የሚችልበት ሁኔታ የተሻሻለ አይደለም።

ተጨማሪ ዝርዝሮች እና የናሙና ውጤቶች ተመልከት
[`tracing-subscriber` ሰነድ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_ኩራ_ የ የማያቋርጥ ማከማቻ ሞተር ነው Iroha (ጃፓንኛ ለ _መጋዘን_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

ቢያንስ N የመጨረሻዎቹ ብሎኮች በማስታወስ ውስጥ ይቀመጣሉ.

አሮጌዎቹ ብሎኮች ከሜሞሪው ይወርዳሉ እና አስፈላጊ ከሆነ ከዲስኩ ይጫናሉ።

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

Kura የመነሻ ዘዴ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `strict`: የሁሉም ብሎኮች ጥብቅ ማረጋገጫ
- `fast`: በዋነኛ ቁጥጥር ብቻ ፈጣን ጅምር ማድረግ

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

ብሎኮቹ የተከማቹበትን ማውጫ [^paths] ይገልጻል።

በተጨማሪም ተመልከት: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

ለኮንሶል አዲስ ብሎኮች ማተም እንዲቻል ባንዲራ።

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

## ረድፍ {#queue}

### `queue.capacity` {#param-queue-capacity}

ረድፍ ላይ የሚጠብቁ ግብይቶች ብዛት ከፍተኛ ገደብ

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ለአንድ ተጠቃሚ በመስመር ላይ የሚጠብቁ ግብይቶች ብዛት ከፍተኛ ገደብ።

ይህን አማራጭ ተጠቅመህ ማሽቆልቆልን ተግባራዊ አድርግ።

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ግብይቱ ከዚህ ጊዜ በኋላ አሁንም በዝርዝሩ ውስጥ ከሆነ ይቋረጣል ።

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

የአካል ብቃት እንቅስቃሴን ለመለማመድ ብቻ የሚሰራው ማብሪያ Sumeragi ለስላሳ-ፎርክ የማስተዳደር መንገዶች.
ከቁጥጥር ምርመራዎች ውጪ ማሰናከል፤ በሂደት ላይ ባለው የምርት አውታረመረብ ላይ መለወጥ
በጋራ መግባባት በሚደረግበት መንገድ ላይ የእኩዮችን አለመግባባት ሊያመጣ ይችላል።

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## ቅጽበታዊ ገጽ እይታ {#snapshot}

ይህ ሞጁል የፕሮግራሙን ቅጽበታዊ ገጽ እይታዎች ለማንበብ እና ለመጻፍ ኃላፊነት አለበት
[የዓለም ሁኔታ አመለካከት](/am/blockchain/world#world-state-view-wsv).

የእኩዮቹ ሊጠቀሙበት የሚችሉት የዓለም ሁኔታ እይታ በተከታታይ የተቀመጠውን የመቆጣጠሪያ ነጥብ ያስቀምጣል
እያንዳንዱን ብሎክ እንደገና ሳይጫወት ዳግም ማስጀመር Kura. Kura የሚበረክት ብሎክ ሆኖ ይቆያል።
ታሪክና የመድገም እውነት ምንጭ፤ ቅጽበታዊ ገጽ እይታዎች የፍጥነት መንገድ ናቸው።
በመጀመር ላይ, Iroha የተዋቀረው ሰንሰለት እና የ
ቅጽበታዊ ገጽ እይታን ለመጫን ወይም እንደገና ለመጫወት ከመወሰንዎ በፊት የተከማቹ ብሎኮች።

::: tip ቅጽበታዊ ገጽ እይታዎችን ማጽዳት

ቅጽበታዊ ገጽ እይታዎች ሥርዓት ጋር አንድ ነገር ስህተት ከሆነ, እና እርስዎ ባዶ ገጽ ላይ መጀመር የሚፈልጉ ከሆነ (በ አንፃር
snapshots), እርስዎ በ የተጠቀሰው ማውጫ ማስወገድ ይችላሉ [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

የ Snapshot ስርዓት የሚሠራበት ሁነታ።

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `read_write`: Iroha የጊዜ ሰሌዳዎችን በ
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). በመጀመር ላይ, Iroha ነባር ቅጽበታዊ ገጽ እይታን ያነባል (አለ)
  እና ከብሎኮች ማከማቻ ጋር ወቅታዊ መሆኑን ያረጋግጣል.
- `readonly`: ተመሳሳይ `read_write` ግን Iroha ምንም ቅጽበታዊ ገጽ እይታዎችን አይፈጥርም.
- `disabled`: Iroha አዲስ ቅጽበታዊ ገጽ እይታዎችን አይፈጥርም ወይም በጅምር ጊዜ ነባር ቅጽበታዊ እይታን አያነብም።

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

የቅጽበታዊ ገጽ እይታዎች ድግግሞሽ።

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

ቅጽበታዊ ፎቶዎችን የማከማቸት ማውጫ።

በተጨማሪም ተመልከት: [`kura.store_dir`](#param-kura-store-dir)

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

## ቴሌሜትሪ {#telemetry}

ቴሌሜትሪ የእኩዮች ምርመራን ወደ ውጫዊ የቴሌሜትሪክ ሰብሳቢ ያወጣል
ሁለቱም `telemetry.name` እና `telemetry.url` አንድ እኩያ ለ
የቴሌሜትሪ አገልግሎት ካልተጠቀመ ክፍሉን ማስወገድ።

`name` እና `url` ማያያዝ አለባቸው።

ሁሉም `telemetry` ክፍሉ አማራጭ ነው።

### `telemetry.name` {#param-telemetry-name}

በቴሌሜትሪው ላይ የሚታየው የአገናኙ ስም።

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

የ WebSocket URL የቴሌሜትሪ ሰብሳቢ።

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

እንደገና ከመገናኘቱ በፊት መጠበቅ ያለበት ዝቅተኛ ጊዜ።

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

በግንኙነቶች መካከል ያለውን መዘግየት ለመጨመር ጥቅም ላይ የሚውለው የ 2 ከፍተኛ ጠቋሚ።

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ወደ dev-ቴሌሜትሪ ለመጻፍ የፋይልፓት

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
