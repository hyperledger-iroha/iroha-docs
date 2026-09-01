---
translation_locale: am
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# የውቅረት መለኪያዎች {#configuration-parameters}

[[TOC]]

## የ ስርወ-ደረጃ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

በእያንዳንዱ ግብይት ውስጥ መካተት ያለበት ሰንሰለት መታወቂያ። የመልሶ ማጫወት ጥቃቶችን ለመከላከል ጥቅም ላይ ይውላል።

የድጋሚ አጫውት ጥቃት ትክክለኛ ግብይት ከታሰበው የተለየ አውታረ መረብ ለማስገባት የሚደረግ ሙከራ ነው። `chain` የተፈረመው የግብይት ጭነት አካል ስለሆነ፣ ለአንድ ሰንሰለት የተፈረመ ግብይት ሌላ የሰንሰለት መታወቂያ በሚጠቀሙ የአውታረ መረብ እኩዮች ውድቅ ይደረጋል።

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

የእኩዩ ይፋዊ ቁልፍ። የጋራ ስምምነት አረጋጋጭ እኩዮች BLS-Normal ቁልፎችን መጠቀም አለባቸው።

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

የአውታረ መረብ አቻ የግል ቁልፍ. ከ `public_key` ጋር መዛመድ አለበት; የጋራ መግባባት አረጋጋጭ አውታረ መረብ እኩዮች BLS-መደበኛ ቁልፎችን መጠቀም አለባቸው።

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

አስቀድሞ የተገለጹ የታመኑ የአውታረ መረብ እኩዮች ዝርዝር።

የጋራ መግባባት አረጋጋጮች መጠቀም አለባቸው BLS- መደበኛ የአውታረ መረብ አቻ ቁልፎች። ለእያንዳንዱ አረጋጋጭ፣ እንዲሁም ተዛማጅ ያቅርቡ [`trusted_peers_pop`](#param-trusted-peers-pop) ግቤት.

<param-table env="TRUSTED_PEERS">
<template #type>

የአውታረ መረብ አቻ ሕብረቁምፊዎች ድርድር. የ P2P አድራሻ በሚታወቅበት ጊዜ `PUBLIC_KEY@ADDRESS` ይጠቀሙ; ባዶ `PUBLIC_KEY` እንዲሁ ተቀባይነት አለው እና የአውታረ መረብ አቻ አድራሻ ከሐሜት እንዲገኝ ያስችለዋል።

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

BLS ለአረጋጋጭ የታመኑ የአውታረ መረብ እኩዮች የይዞታ ማረጋገጫ ግቤቶች።

<param-table env="TRUSTED_PEERS_POP">
<template #type>

የ እቃዎች ማዘጋጃ ከ `public_key` እና `pop_hex` ሜዳዎች ጋር

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

## blockchain ጀነሲስ {#genesis}

### `genesis.file` {#param-genesis-file}

በ`kagami genesis sign` ወደ ተፈጠረው የተፈረመው blockchain genesis የብሎክ ጭነት የፋይል መንገድ የመነጩ መገለጫዎች በተለምዶ ይህንን እንደ Norito `.nrt` ፋይል ይጽፋሉ።

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

የብሎክቼይን ጀነሲስ ቁልፍ ጥንድ የህዝብ ቁልፍ።

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

## አውታረ መረብ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

ለጋራ ስምምነት (sumeragi) እና ለብሎክ ማመሳሰል (block_sync) የ p2p ግንኙነት አድራሻ።

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

የአቻ-ለ-አቻ አድራሻ (ውጫዊ፣ በሌሎች የአውታረ መረብ እኩዮች እንደሚታየው)።

ከሌሎች የአውታረ መረብ እኩዮች ጋር ማጋራት እንዲችሉ ከተገናኙ የአውታረ መረብ እኩዮች ጋር ይጋራል።

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

በአንድ የማመሳሰል መልእክት ውስጥ ሊላኩ የሚችሉ ብሎኮች መጠን።

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

ለቅርብ ጊዜ ብሎክ ለአውታረ መረብ እኩዮች በሚቀርቡ ጥያቄዎች መካከል ያለው የጊዜ ክፍተት።

ብዙ ጊዜ ሐሜት የማመሳሰል ጊዜን ያሳጥራል, ነገር ግን አውታረ መረቡን ከመጠን በላይ መጫን ይችላል.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

በወሬ ባች መልእክት ውስጥ ከፍተኛው የግብይቶች ብዛት።

አነስተኛ መጠን ለማመሳሰል ረጅም ጊዜ ይመራል, ነገር ግን ከፍተኛ የፓኬት ኪሳራ ካለብዎ ጠቃሚ ነው.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

በአውታረ መረብ እኩዮች መካከል በመጠባበቅ ላይ ያለ ግብይት የሐሜት ጊዜ።

ብዙ ጊዜ ሐሜት የማመሳሰል ጊዜን ያሳጥራል, ነገር ግን አውታረ መረቡን ከመጠን በላይ መጫን ይችላል.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

የአውታረ መረብ አቻ ስራ ፈትቶ ከሆነ ከአውታረ መረብ አቻ ጋር ያለው ግንኙነት የሚቋረጥበት የጊዜ ቆይታ።

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii አገልጋዩ ማዳመጥ ያለበት እና ደንበኛው (ዎች) ጥያቄያቸውን የሚያቀርቡበት አድራሻ።

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

በጥሬ የጥያቄ አካል ውስጥ ያለው ከፍተኛው የባይት ብዛት በ [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md) ተቀባይነት አለው።

ይህ ገደብ DOS ጥቃቶችን ለመከላከል ይጠቅማል።

<param-table>
<template #type>

ቁጥር (የባይት)

</template>
<template #default-value>

`64_000_000` (64 ሚሊዮን ባይቶች)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

መጠይቁ ካልደረሰ በመደብሩ ውስጥ ሊቆይ የሚችልበት ጊዜ።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

የቀጥታ መጠይቆች ብዛት የላይኛው ገደብ።

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ለአንድ ተጠቃሚ የሚፈቀደው ከፍተኛው የቀጥታ መጠይቆች ብዛት።

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ሎገር {#logger}

### `logger.level` {#param-logger-level}

አጠቃላይ የምዝግብ ማስታወሻ ቃል (ይመልከቱ) [`logger.filter`](#param-logger-filter) ለተጣራ ውቅር) ።

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ሕብረቁምፊ፣ ሊሆኑ የሚችሉ እሴቶች

- `TRACE` ሁሉም ክስተቶች፣ ዝቅተኛ ደረጃ ስራዎችን ጨምሮ።
- `DEBUG` የማረም ደረጃ መልዕክቶች፣ ለምርመራ ይጠቅማሉ።
- `INFO` አጠቃላይ የመረጃ መልዕክቶች።
- `WARN` ሊከሰቱ የሚችሉ ጉዳዮችን የሚያመለክቱ ማስጠንቀቂያዎች።
- `ERROR` መደበኛውን ተግባር የሚያበላሹ ነገር ግን ቀጣይ ስራን የሚፈቅዱ ስህተቶች።

ለአጠቃቀም ጉዳይዎ በጣም የሚስማማውን ደረጃ ይምረጡ። የተለያዩ የምዝግብ ማስታወሻ ደረጃዎችን እንዴት መጠቀም እንደሚቻል ተጨማሪ ዝርዝሮችን ለማግኘት [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ይመልከቱ።

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

::: tip የሶፍትዌር ማስፈጸሚያ አካባቢ ዝመና

ይህ ግቤት በ Torii ኦፕሬተር API የመጨረሻ ነጥቦች በኩል ለሶፍትዌር ማስፈጸሚያ አካባቢ ውቅር ማሻሻያ ተገዢ ነው።

:::

### `logger.filter` {#param-logger-filter}

የተጣራ የምዝግብ ማስታወሻ ማጣሪያዎች በተጨማሪ [`logger.level`](#param-logger-level). በአንድ ዒላማ የምዝግብ ማስታወሻዎችን ማበጀት ያስችላል።

<param-table type=string env=LOG_FILTER>
<template #type>

ሕብረቁምፊ፣ አንድ ወይም ከዚያ በላይ በነጠላ ሰረዝ የተለዩ መመሪያዎችን ያቀፈ ነው። እያንዳንዱ መመሪያ የሚዛመዱ ስኬቶችን እና ክስተቶችን የሚያስችል (ለምሳሌ፣ የሚመርጥ) ተጓዳኝ ከፍተኛ የቃላት ደረጃ ሊኖረው ይችላል። Iroha ያነሱ ልዩ ደረጃዎችን (እንደ `trace` ወይም `info`) ከልዩ ደረጃዎች (እንደ `error` ወይም `warn` ያሉ) የበለጠ የቃላት መሆናቸውን ይቆጥራል።

በከፍተኛ ደረጃ፣ የመመሪያዎች አገባብ በርካታ ክፍሎችን ያቀፈ ነው-

```
target[span{field=value}]=level
```

ለተጨማሪ ዝርዝሮች ይመልከቱ [`tracing-subscriber` ሰነድ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info ቅንብር ከ ጋር [`logger.level`](#param-logger-level)

`logger.filter` አብሮ ይሰራል [`logger.level`](#param-logger-level) እና አንዳቸውም ሌላውን አይጽፉም.

ለምሳሌ፣ `logger.level` ወደ `INFO` እና `logger.filter` ወደ `iroha_core=debug` ከተዋቀረ፣ የተገኘው የማጣሪያ ስብስብ `info,iroha_core=debug` ይሆናል (ማለትም `info` ለሁሉም ሞጁሎች፣ `debug` ለ `iroha_core`)።

:::

::: tip የሶፍትዌር ማስፈጸሚያ አካባቢ ዝመና

ይህ ግቤት በ Torii ኦፕሬተር API የመጨረሻ ነጥቦች በኩል ለሶፍትዌር ማስፈጸሚያ አካባቢ ውቅር ማሻሻያ ተገዢ ነው።

:::

### `logger.format` {#param-logger-format}

የምዝግብ ማስታወሻዎች ቅርጸት.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ሕብረቁምፊ፣ ሊሆኑ የሚችሉ እሴቶች

- `full` ነባሪው ቅርጸት። ለእያንዳንዱ ክስተት በሰው ሊነበብ የሚችል፣ ባለ አንድ መስመር ምዝግብ ማስታወሻዎችን ያወጣል፣ ይህም ከተቀረጸው የክስተት ውክልና በፊት የአሁኑን የስፔን አውድ ያሳያል።
- `compact`፦ ለአጭር መስመሮች የተመቻቸ የነባሪው ቅርጸት አቀናባሪ ልዩነት። የአሁኑ ስፓን አውድ መስኮች በተቀረጸው ክስተት መስኮች ላይ ይታከላሉ፣ የስፓን ስሞች አይታዩም፤ የዝርዝር ደረጃውም ወደ አንድ ቁምፊ ይጠራል።
- `pretty` ለሰው ልጅ ተነባቢነት የተመቻቸ ከመጠን በላይ ቆንጆ፣ ባለብዙ መስመር ምዝግብ ማስታወሻዎችን ያመነጫል። ይህ በዋነኝነት የታሰበው በአከባቢው ልማት ውስጥ ጥቅም ላይ እንዲውል እና ማረም፣ ወይም ለትእዛዝ መስመር አፕሊኬሽኖች፣ አውቶማቲክ ትንተና እና የታመቀ የምዝግብ ማስታወሻዎች ከተነባቢነት እና ከእይታ ማራኪነት ያነሰ አስፈላጊ ናቸው።
- `json` አዲስ መስመር የተገደቡ JSON ምዝግብ ማስታወሻዎችን ያወጣል። ይህ የተዋቀሩ ምዝግብ ማስታወሻዎች እንደ JSON በመተንተን እና በመመልከቻ መሳሪያዎች ከሚጠቀሙባቸው ስርዓቶች ጋር ለምርት ጥቅም ላይ እንዲውል የታሰበ ነው። የ JSON ውፅዓት ለሰው ተነባቢነት የተመቻቸ አይደለም።

ለተጨማሪ ዝርዝሮች እና የናሙና ውጤቶች ይመልከቱ [`tracing-subscriber` ሰነድ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura የ Iroha (ጃፓንኛ ለመጋዘን) የማያቋርጥ የማከማቻ ሞተር ነው።

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

ቢበዛ N የመጨረሻ ብሎኮች በማህደረ ትውስታ ውስጥ ይቀመጣሉ።

የቆዩ ብሎኮች ከማህደረ ትውስታ ይጣላሉ እና አስፈላጊ ከሆነ ከዲስክ ይጫናሉ.

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

Kura የማስጀመሪያ ሁነታ. `strict` መደበኛ እና ነባሪ ሁነታ ነው ኖድ ንቁ ከመሆኑ በፊት ነጠላ ፕሮቶኮል-መደበኛ ታሪክን፣ የመልሶ ማግኛ አርቲፋክቶችን፣ ረዳት ኢንዴክሶችን እና የማከማቻ ሂሳብን ያረጋግጣል።

`fast` የተሟላ የጅምር ኦዲት መቋረጥን አደጋ ላይ በሚጥልበት ጊዜ የአሠራር ታይነትን ወደነበረበት ለመመለስ የአደጋ ጊዜ የተበላሸ የአገልግሎት ሁነታ ነው። ከዚህ ቀደም በ`strict` የተጀመረ ማከማቻ እና በትክክል አምስት አርቲፋክቶችን የያዘ የአሁኑን የውሂብ እይታ ማመንጨት ይፈልጋል። `snapshot.data`፣ `snapshot.sha256`፣ `snapshot.sig`፣ `snapshot.fast.norito` እና `snapshot.merkle.json`። በጎራ የተለየ ኦፕሬተር ፊርማ የማስታወቂያውን ጭነት ክሪፕቶግራፊያዊ ዳይጀስት እና የታሰረውን ቴክኒካዊ ማኒፌስት ያገናኛል። ቴክኒካል ማኒፌስት የጭነት ርዝመትን፣ ሰንሰለት/የአውታረ መረብ ማንነትን፣ የተርሚናል ቁመት/ሃሽን፣ SCCP ፖሊሲ ምስጠራ ሃሽ እና ቡትስትራፕ-የዘር መገኘትን ያገናኛል። ፈጣን የማስነሻ የተከታታይነትን ውድቅ ያደርጋል እና ትክክለኛውን ተመሳሳይ ምልክት ማድረጊያ/ቆጠራ/ጫፍ ድንበር ከረጅም ጊዜ Kura ይፈልጋል። የመጀመሪያ ልቀት አንጓዎች በትክክል እነዚያን አምስት አርቲፋክቶች ይቀበላሉ እና እያንዳንዱን ሌላ የአርቲፋክት ብዛት ወይም የፋይል ስም ስብስብ ውድቅ ያደርጋሉ።

እነዚያን አምስት ስሞች በፍጥነት ያቆምጣል እና ሜታዳታ ጭነቱን እና የሜርክል ፋይሎችን ያገናኛል፣ ነገር ግን ይዘታቸውን አያነብም፣ ምስጠራ አያደርግም፣ አይተነትንም ወይም አይፈታም። ከተፈረመው ቴክኒካል ማኒፌስት አነስተኛውን ዓለም/Nexus ይገነባል፣ ትክክለኛውን Kura ምስጠራ ሃሽ ቅድመ ቅጥያ ተነባቢ ብቻ ካርታ ያዘጋጃል፣ እና የነጥብ-በ-ጊዜ የውሂብ እይታ ዓለም፣ የብሎክ-ሃሽ ድርድር፣ የግብይት ታሪክ፣ የተገኙ ኢንዴክሶች እና ዘላቂ የመልሶ ማግኛ መጽሔቶች ሳይከፈቱ ይተዋል።. ሜርክል፣ ነጠላ ፕሮቶኮል-ስታንዳርድ እና የትርጓሜ ነጥብ-በ-ጊዜ የውሂብ እይታ ኦዲቶች፣ ታሪካዊ ብሎክ/የመጨረሻ/SCCP እርቅ፣ Sumeragi ንቁ-ቁመት መልሶ ማግኛ፣ ውህደት እና መጠይቅ መጽሔቶች፣ የማስፈጸሚያ መስመር አንጸባራቂ/ተገዢነት ምንጮች፣ Kura የሚደገፉ SoraFS ማህደሮች፣ ተደጋጋሚ የማከማቻ ሂሳብ እና አማራጭ አገልግሎት ማስታረቅ ለሌላ ጊዜ ተላልፈዋል። የአካባቢ ግብይት መግቢያ፣ ፕሮፖዛል፣ ድምጽ መስጠት፣ ነጠላ ፕሮቶኮል-መደበኛ የመጻፍ ክዋኔዎች እና ረዳት አምራቾች ተሰናክለዋል። Kura ራሱ የጸሐፊ ጅምር እና ዘላቂ ሚውቴሽን ውድቅ ያደርጋል; የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት እና FASTPQ የጽናት ወረፋዎች ስራን ከማቆየት ወይም ከመቀየር ይልቅ ወዲያውኑ ውድቅ ያደርጋሉ።. Kura አንብብ APIs እንዲሁም የጥገና እና የመቆየት ማመሳሰል ባህሪን ያሰናክሉ ጊዜያዊ ረዳት መዝገቦች አይተዋወቁም፣ የጎደሉ የማስፈጸሚያ ሌይን አርቲፋክቶች አልታተሙም፣ እና የሂደት መሰናክሎች አልተመሳሰሉም። Sumeragi እና የግብይት ወሬ አልተጀመረም። Torii ጤናን፣ ሕያውነትን፣ ዝግጁነትን፣ የአውታረ መረብ አቻ እና የማዋቀር ስራዎችን ብቻ ያጋልጣል። API-ስሪት፣ ሁኔታ፣ መለኪያዎች እና ሁሉም መደበኛ የሁኔታ/ታሪክ መስመሮች አይገኙም። ጥብቅ ዳግም እስኪጀምር ድረስ ዝግጁነት አይገኝም።

`fast`ን ለአንድ ክስተት ብቻ ይጠቀሙ። አንዴ አገልግሎቱ ከተረጋጋ አንዴ ኖዱን ያቁሙ፣ `strict`ን ወደነበረበት ይመልሱ እና እንደገና ያስጀምሩ ስለዚህ እያንዳንዱ የዘገየ ቼክ እና ኢንዴክስ መልሶ መገንባት ምርት ከመቀጠሉ በፊት ይሰራል። ፈጣን ሁነታ የዘገየውን የውህደት ምዝግብ ማስታወሻ አይፈልግም እና ነጠላ ፕሮቶኮል-መደበኛ ማከማቻን አይፈጥርም፣ አይጠግንም፣ አይቆርጥም ወይም አያስመጣም። ያልታተሙ ቅጥያዎች እና በመጠባበቅ ላይ ያሉ ረዳት መልሶ ማግኛ ደረጃዎች ሳይነበቡ ወይም ሳይሻሻሉ ችላ ይባላሉ፣ ከዚያም ለጥብቅ መልሶ ማግኛ ይቀራሉ። ከውጭ የመጣ ሃሽ-ብቻ ነጥብ-በ-ጊዜ ውሂብ view የተከታታይነት አይገኝም። የጎደለ ወይም ልክ ያልሆነ የአሁኑ ነጥብ-በ-ጊዜ ውሂብ እይታ ወዲያውኑ አይሳካም; በፍጥነት ወደ ባዶ-አለም ወይም ታሪካዊ ድጋሚ መልሶ መገንባት አይወድቅም።

<param-table default-value=strict>
<template #type>

ሕብረቁምፊ፣ ሊሆኑ የሚችሉ እሴቶች

- `strict` የተሟላ ማረጋገጫ እና መደበኛ ምርት
- `fast` ጥብቅ ዳግም ማስጀመር እስኪጀምር ድረስ የታሰረ የአደጋ ጊዜ ጅምር ከምርት ጋር ተገልሏል

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ብሎኮች የሚቀመጡበትን ማውጫ[^paths] መወሰኛ

በተጨማሪ አንብበው [`snapshot.store_dir`](#param-snapshot-store-dir).

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

አዲስ ብሎኮችን ወደ ኮንሶል ማተምን ለማንቃት ባንዲራ ያድርጉ።

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

## ወረፋ {#queue}

### `queue.capacity` {#param-queue-capacity}

ወረፋው ውስጥ የሚጠብቁ ግብይቶች ብዛት የላይኛው ገደብ.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ለአንድ ተጠቃሚ ወረፋ ውስጥ የሚጠብቁ ከፍተኛው የግብይቶች ብዛት።

ስሮትሊንግን ለመተግበር ይህንን አማራጭ ይጠቀሙ።

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ግብይቱ አሁንም ወረፋው ውስጥ ከሆነ ከዚህ ጊዜ በኋላ ይቋረጣል።

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi ለስላሳ ፎርክ አያያዝ መንገዶችን ለመለማመድ ማረም-ብቻ ማብሪያ / ማጥፊያ። ይህንን ከቁጥጥር ውጭ ከሚደረግባቸው ሙከራዎች ውጭ ተሰናክሏል; በሚሰራ የምርት አውታረመረብ ላይ መቀየር የአውታረ መረብ እኩዮች ስለ መግባባት ባህሪ እንዳይስማሙ ሊያደርግ ይችላል።

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus አቶሚክ የግል የፋይናንስ ግብይት ማጠናቀቂያ {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` የተለየውን `AtomicPrivateSettlementV1` መንገድ ይቆጣጠራል። በነባሪ ጠፍቷል። `enabled = true` ማድረግ `activation_height`ንም ይጠይቃል፤ በሰንሰለት ላይ ያለው ብቃት፣ የማስታወቂያ ጊዜ፣ የተወሰነው የማረጋገጫ መገለጫ እና የፑል/ኦዲት አስተዳደር ንቁ ካልሆኑ፣ መግቢያው በአስተማማኝ ሁኔታ ውድቅ ይሆናል።

ዋናዎቹ ድንበሮች `max_participants`፣ `max_expiry_blocks`፣ `audit_timeout_blocks`፣ `prepare_timeout_blocks`፣ `commit_timeout_blocks`፣ `max_proof_bytes`፣ `max_capsule_bytes`፣ `max_carrier_bytes`፣ `sidecar_retention_blocks`፣ `sidecar_max_records` እና `sidecar_max_total_bytes` ናቸው። `capsule_padding_classes_bytes` የ V1 ንጣፍ ክፍሎች በጥብቅ እየጨመረ የሚሄድ ንዑስ ስብስብ መሆን አለበት። `permitted_policy_versions` የሚቀበለው V1 ብቻ ነው።

`max_capsule_bytes` AAD፣ ምስጠራ ኖስ እሴት፣ ምስጢራዊ ጽሑፍ፣ የቬክተር ፍሬም እና እያንዳንዱን ኦዲተር የተጠቀለለ-DEK ረድፍ ጨምሮ የሙሉ `PrivateSettlementAuditCapsuleV1` ነጠላ ፕሮቶኮል-ስታንዳርድ Norito ባይት ይለካል። የምስጢር-ጽሑፍ ብቻ ገደብ አይደለም። እያንዳንዱ የነቃ የፓዲንግ ክፍል ቢያንስ ለ`default_min_auditor_approvals` ኦዲተሮች ወግ አጥባቂ ሙሉ-ካፕሱል ዳታ ኮንቴይነር መገጣጠም አለበት። ያ የማጽደቅ መቼት እንዲሁ የሚተዳደር ወለል ነው - Torii ዝቅተኛ `min_approvals` እሴት ያለው አዲስ ተቀባይነት ያለው ፖሊሲን ውድቅ ያደርጋል እና ከነጠላ ፕሮቶኮል-መደበኛ ባይት ገደብ በላይ ማንኛውንም ትክክለኛ ካፕሱል ውድቅ ያደርጋል።.

እነዚህ መቼቶች የምርት አካባቢ-ተለዋዋጭ የማግበር ማለፊያ የላቸውም። ለተሟላ ውቅር [አቶሚክ የግል አቋራጭ-ዳታስፔስ የፋይናንስ ግብይት ማጠናቀቂያን ያሂዱ](/am/get-started/atomic-private-settlement) ይመልከቱ እና የአሠራር መስፈርቶች. የተመዘገቡት የውጭ መልቀቂያ በሮች እስኪያልፉ ድረስ መንገዱ ለምርት ብቁ አይደለም።

## ነጥብ-በ-ጊዜ የውሂብ እይታ {#snapshot}

ይህ ሞጁል የ [የየዓለም ሁኔታ እይታ](/am/blockchain/world#world-state-view-wsv) ነጥብ-በ-ጊዜ የውሂብ እይታዎችን የማንበብ እና የመፃፍ ሃላፊነት አለበት።

ነጥብ-በጊዜ ውሂብ እይታዎች ተከታታይ የፍተሻ ነጥብ ያከማቻሉ ስለዚህ የአውታረ መረብ አቻ እያንዳንዱን ብሎክ ከ Kura ሳያጫውት እንደገና መጀመር ይችላል። Kura ዘላቂ የብሎክ ታሪክ እና የእውነት ምንጭ ሆኖ ይቆያል። ነጥብ-በጊዜ ውሂብ እይታዎች የፍጥነት መንገድ ናቸው። በሚነሳበት ጊዜ፣ Iroha የነጥብ-በ-ጊዜ ውሂብ እይታ ሜታዳታ ከተዋቀረው ሰንሰለት እና ከተከማቹ ብሎኮች ጋር ይፈትሻል።

::: tip ነጥብ-በጊዜ የውሂብ እይታዎችን ይጥረጉ

በነጥብ-በጊዜ የውሂብ እይታዎች ስርዓት ላይ የሆነ ችግር ካለ፣ እና ከባዶ ገጽ መጀመር ይፈልጋሉ (በጊዜ ዳታ እይታዎች አንፃር) የተገለጸውን ማውጫ ማስወገድ ይችላሉ [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

የጊዜ ነጥብ ውሂብ ሁነታ view ስርዓት የሚሰራው.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ሕብረቁምፊ፣ ሊሆኑ የሚችሉ እሴቶች

- `read_write`: Iroha የጊዜ ገደብ ከ ጊዜ ጋር የ ነጥብ ዳታ እይታዎችን ይፈጥራል [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). በሚነሳበት ጊዜ ፣ Iroha ነባር ነጥብ-በ-ጊዜ የውሂብ እይታ (ካለ) ያነባል እና ከብሎኮች ማከማቻ ጋር ወቅታዊ መሆኑን ያረጋግጣል።
- `readonly` ከ `read_write` ጋር ተመሳሳይ ነገር ግን Iroha ምንም ቅጽበታዊ ገጽ እይታ አይፈጥርም።
- `disabled` Iroha አዲስ ነጥብ-በ-ጊዜ የውሂብ እይታዎችን አይፈጥርም ወይም በሚነሳበት ጊዜ ያለውን አያነብም።.

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

የየነጥብ-በ-ጊዜ ውሂብ እይታዎች ድግግሞሽ።

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

የነጥብ-በ-ጊዜ ውሂብ እይታዎችን የት እንደሚከማቹ ማውጫ።

በተጨማሪ አንብበው [`kura.store_dir`](#param-kura-store-dir)

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

ቴሌሜትሪ የአውታረ መረብ አቻ ምርመራዎችን ወደ ውጫዊ የቴሌሜትሪ ሰብሳቢ ይልካል። የአውታረ መረብ አቻ ለሰብሳቢ ሪፖርት ማድረግ ሲገባው ሁለቱንም `telemetry.name` እና `telemetry.url` ያዋቅሩ; ቴሌሜትሪ ጥቅም ላይ በማይውልበት ጊዜ ክፍሉን ይተዉት።

`name` እና `url` ማጣመር አለባቸው።

ሁሉም `telemetry` ክፍል አማራጭ ነው።

### `telemetry.name` {#param-telemetry-name}

በቴሌሜትሪ ላይ የሚታየው የኖድ ስም።

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL የቴሌሜትሪ ሰብሳቢ።

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

እንደገና ከመገናኘትዎ በፊት ለመጠበቅ ዝቅተኛው ጊዜ።

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

በድጋሚ ግንኙነቶች መካከል መዘግየትን ለመጨመር ጥቅም ላይ የሚውለው ከፍተኛው የ 2 ገላጭ።

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ዴቭ-ቴሌሜትሪ ለመጻፍ የፋይል መንገድ

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
