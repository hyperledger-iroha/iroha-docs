---
translation_locale: am
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# የግንባታ መለኪያዎች {#configuration-parameters}

[toc]

## ሥር-ደረጃ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

በእያንዳንዱ ግብይት ውስጥ መካተት ያለበት ሰንሰለት ID።

የመልሶ ማጫወት ጥቃት ከተፈለገበት የተለየ አውታረመረብ ጋር ትክክለኛውን ግብይት ለማቅረብ የሚደረግ ሙከራ ነው። `chain` የተፈረመው የግብይት ጥቅማጥቅሞች አካል ስለሆነ ለአንድ ሰንሰለት የተፈረመ ግብይት በሌላ ሰንሰለት ID በሚጠቀሙ እኩዮች ውድቅ ይደረጋል።

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

የጋራ ቁልፍ: የጋራ ስምምነት ማረጋገጫ መሳሪያዎች BLS - መደበኛ ቁልፎችን መጠቀም አለባቸው።

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

የባልደረባው የግል ቁልፍ: `public_key` ጋር የሚመሳሰል መሆን አለበት; የስምምነት ማረጋገጫ ባልደረባዎች BLS - መደበኛ ቁልፎችን መጠቀም አለባቸው.

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

የስምምነት ማረጋገጫ ሰጪዎች BLS- መደበኛ የእኩዮች ቁልፎችን መጠቀም አለባቸው ለእያንዳንዱ ማረጋገጫ አቅራቢም ተመጣጣኝ የሆነ [`trusted_peers_pop`](#param-trusted-peers-pop) ግቤት ያቅርቡ ።

<param-table env="TRUSTED_PEERS">
<template #type>

P2P አድራሻ በሚታወቅበት ጊዜ `PUBLIC_KEY@ADDRESS` ን ይጠቀሙ; ባዶ `PUBLIC_KEY`ም ተቀባይነት አለው እና የባልደረባ አድራሻውን ከጨዋው እንዲገኝ ያስችለዋል ።

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

BLS የማረጋገጫ ወረቀቶች ለቫሊዲተሮች የታመኑ እኩዮች።

<param-table env="TRUSTED_PEERS_POP">
<template #type>

የ `public_key` እና `pop_hex` መስኮች ያሉት የዕቃዎች ሰንጠረዥ

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

በ የተፈጠረ የፊርማ ጀነሲስ ብሎክ ጥቅማጥቅሞች ፋይል መንገድ `kagami genesis sign`. የተፈጠሩ መገለጫዎች በተለምዶ ይህን እንደ ይጽፉ Norito `.nrt` መዝገብ።

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

የጄኔሲስ ቁልፍ ጥንድ የሕዝብ ቁልፍ።

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

## አውታረመረብ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

ለስምምነት (sumeragi) እና ለብሎክ ማመሳሰል (block_sync) ዓላማዎች የፒ 2 ፒ ግንኙነት አድራሻ።

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

የእኩዮች-ወደ-እኩዮች አድራሻ (ሌሎች እኩዮች እንደሚመለከቱት ውጫዊ) ።

ለሌሎች እኩዮችም ሹክሹክ አድርገው እንዲነግሯቸው የተገናኙ እኩዮቻቸው ይነጋገራሉ።

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

በአንድ የማመሳሰል መልዕክት ውስጥ ሊላኩ የሚችሉትን የብሎኮች ብዛት።

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

ለቅርብ ጊዜው ብሎክ ከባልደረቦቹ ጋር ለሚደረጉ ጥያቄዎች መካከል ያለው የጊዜ ልዩነት.

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊሞላ ይችላል።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

በሐሜት ስብስብ መልዕክት ውስጥ ከፍተኛ የግብይቶች ብዛት።

አነስተኛ መጠን ለማመሳሰል ረዘም ያለ ጊዜ ያስከትላል, ነገር ግን ከፍተኛ የፓኬት ኪሳራ ካለዎት ጠቃሚ ነው.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

በእኩዮች መካከል የሚደረገውን ግብይት በመጠባበቅ ላይ ወሬ የመናገር ጊዜ።

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊሞላ ይችላል።

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

የ Torii አገልጋይ ማዳመጥ ያለበት እና ደንበኛው ጥያቄዎቹን የሚያቀርብበት አድራሻ።

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

በ [Torii መጨረሻ ነጥቦች ](/am/reference/torii-endpoints.md) ተቀባይነት ባለው ጥሬ ጥያቄ አካል ውስጥ ከፍተኛው የባይት ቁጥር።

ይህ ገደብ የ DOS ጥቃቶችን ለመከላከል ጥቅም ላይ ይውላል።

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

አንድ ጥያቄ ካልተደረሰም በመደብሩ ውስጥ ሊቆይ የሚችልበት ጊዜ።

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

አጠቃላይ የመመዝገቢያ ግስጋሴ (ለተሻሻለ ውቅር [`logger.filter`](#param-logger-filter) ይመልከቱ) ።

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `TRACE`: በዝቅተኛ ደረጃ የሚከናወኑትን ጨምሮ ሁሉም ክስተቶች።
- `DEBUG`: ለዲያግኖስቲክስ ጠቃሚ የሆኑ የድብርት ደረጃ መልዕክቶች.
- `INFO`: አጠቃላይ መረጃ ሰጭ መልዕክቶች።
- `WARN`: ሊከሰቱ የሚችሉ ጉዳዮችን የሚያመለክቱ ማስጠንቀቂያዎች።
- `ERROR`: መደበኛ ተግባርን የሚያስተጓጉሉ ግን ቀጣይነት ያለው ሥራን የሚፈቅዱ ስህተቶች።

ለአጠቃቀም ጉዳይዎ በጣም የሚስማማውን ደረጃ ይምረጡ. የተለያዩ የሎግ ደረጃዎችን እንዴት እንደሚጠቀሙ ተጨማሪ ዝርዝሮችን ለማግኘት ወደ [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ይመልከቱ።

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

ይህ መለኪያ በ Torii ኦፕሬተር መጨረሻ ነጥቦች አማካኝነት የስራ ሰዓት ውቅር ዝማኔን ያካትታል.

:::

### `logger.filter` {#param-logger-filter}

ከ [ `logger.level`](#param-logger-level) በተጨማሪ የተሻሻሉ የሎግ ማጣሪያዎች። በዒላማው ላይ የመመዝገብ አነጋገርን ለማበጀት ያስችለዋል.

<param-table type=string env=LOG_FILTER>
<template #type>

አንድ ወይም ከዚያ በላይ በኮማ የተለዩ መመሪያዎችን ያቀፈ string፣ እያንዳንዱ መመሪያ የሚዛመደው ከፍተኛ የቃላት መጠን ሊኖረው ይችላል ይህም (ለምሳሌ ይምረጣል) የሚስማሙ ርዝመቶችን እና ክስተቶችን ያስችላል። Iroha ያነሰ ውስንነት ያላቸው ደረጃዎች (እንደ `trace` ወይም `info`) የበለጠ ውስንነት ካላቸው ደረጃዎች (ለምሳሌ `error` ወይም `warn`) የበለጠ አነጋገር ናቸው ብሎ ይቆጥረዋል።

በከፍተኛ ደረጃ የዲሬክቲቭ አገባብ በርካታ ክፍሎችን ያቀፈ ነው-

```
target[span{field=value}]=level
```

ተጨማሪ ዝርዝሮችን ለማግኘት [`tracing-subscriber` ሰነድ ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ይመልከቱ።

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

::: info [`logger.level`](#param-logger-level) ጋር በጋራ መጠቀም

`logger.filter` ከ [`logger.level` ](#param-logger-level) ጋር አብሮ ይሠራል እና አንዳቸውም ሌላውን አይሸፍኑም ።

ለምሳሌ፣ `logger.level` ተዘጋጅቷል `INFO` እና `logger.filter` ተዘጋጅቷል `iroha_core=debug`, የተገኘው የማጣሪያ ስብስብ ይሆናል `info,iroha_core=debug` (ማለትም `info` ለሁሉም ሞጁሎች፣ `debug` ለ `iroha_core`).

:::

::: tip የስራ ሰዓት ዝመና

ይህ መለኪያ በ Torii ኦፕሬተር መጨረሻ ነጥቦች አማካኝነት የስራ ሰዓት ውቅር ዝማኔን ያካትታል.

:::

### `logger.format` {#param-logger-format}

መዝገብ ቅርጸት.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `full`: ነባሪው ቅርጸት. ይህ የሚከሰተው ለእያንዳንዱ ክስተት የሰው ሊነበብ የሚችል ፣ የአንድ መስመር መዝገቦችን ያወጣል ፣ የአሁኑ የጊዜ ሰሌዳ አውድ ከታየበት ክስተቱ ቅርጸት የተሰጠው መግለጫ በፊት ይታያል ።
- `compact`: ለጥቂት የመስመር ርዝመቶች የተመቻቸ ነባሪ ቅርጸት አቀራረብ። አሁን ካለው የጊዜ ሰሌዳ አውድ ውስጥ ያሉ መስኮች ወደ የተቀረፀው ክስተት መስኮች ተያይዘዋል ፣ እና የጊዜ ሰፈሩ ስሞች አይታዩም; የቃላት ደረጃ ወደ አንድ ቁምፊ አጭር ነው ።
- `pretty`: እጅግ በጣም ቆንጆ, ባለብዙ መስመር መዝገቦችን ያወጣል, ለሰው ልጅ ሊነበብ የሚችል. ይህ በዋናነት በአካባቢያዊ ልማት ውስጥ ጥቅም ላይ ይውላል የአውቶማቲክ ትንተና እና የታሸጉ መዝገቦችን ማከማቸት ከአንባቢነት እና ከዓይን አግባብነት ያነሰ ቅድሚያ የሚሰጠው የትእዛዝ መስመር መተግበሪያዎች ላይ።
- `json`: አዲስ መስመር-የተገደበ JSON መዝገቦችን ያወጣል ። ይህ የተዋቀሩ መዝገቦች በትንታኔ እና በመመልከቻ መሳሪያዎች እንደ JSON በሚጠቀሙባቸው ስርዓቶች ውስጥ ለማምረት የታሰበ ነው ። የ JSON ውፅዓት ለሰው ልጅ ሊነበብ የሚችል አይደለም ።

ተጨማሪ ዝርዝሮች እና የናሙና ውጤቶች ለማግኘት [`tracing-subscriber` ሰነድ ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ይመልከቱ።

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

Kura የ Iroha ቀጣይነት ያለው የማከማቻ ሞተር ነው (ጃፓንኛ ለ መጋዘን) ።

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

ቢያንስ N የመጨረሻ ብሎኮች ትውስታ ውስጥ ይቀመጣሉ.

አሮጌዎቹ ብሎኮች ከሜሞሪ ውስጥ ይወርዳሉ እና አስፈላጊ ከሆነ ከዲስኩ ይጫናሉ።

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

Kura የመነሻ ሁነታ. `strict` መደበኛ እና ነባሪ ሁነታ ነው: አገናኙ ንቁ ከመሆኑ በፊት የካኖኒካል ታሪክ, የማገገም ቅርሶች, ረዳት ማውጫዎች እና ማከማቻ ሂሳብን ያረጋግጣል.

`fast` የተሟላ የጅምር ኦዲት መቋረጥ አደጋ ላይ በሚወድቅበት ጊዜ የአሠራር ታይነትን ለመመለስ የሚያስችል የአደጋ ጊዜ ዝቅተኛ አገልግሎት ሁነታ ነው ። ቀደም ሲል በ `strict` ተጀምሮ የተቀመጠ ማከማቻ እና በትክክል አምስት ቅርሶችን የያዘ የአሁኑ ቅጽበታዊ ገጽ እይታ ትውልድ ይጠይቃል- `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, እና `snapshot.merkle.json`። የጎራ-የተለዩ ኦፕሬተር ፊርማ ማስታወቂያ የተሰጠውን የፍጆታ ጭነት ዲጀስት እና የተገደበ ማንፊስ ይያዛል; ማንፊስቱ የፍጆታ ሸክሙን ርዝመት ፣ ሰንሰለት / አውታረ መረብ ማንነት ፣ የterminal height/hash ፣ SCCP ፖሊሲ ሃሽ ፣ እና የመነሻ መስመር መኖርን ያገናኛል ። ፈጣን የመነሻ መስመርን ውድቅ ያደርጋል እና ከጠንካራው Kura ተመሳሳይ ትክክለኛ ማርከር / መቁጠር / ጫፍ ወሰን ይፈልጋል። የመጀመሪያ ልቀት ኖዶች በትክክል እነዚያን አምስት ቅርሶች ይቀበላሉ እና ሁሉንም ሌሎች የቅርፃ ቅርጾች ብዛት ወይም የፋይል ስም ስብስቦችን ይጥላሉ ።

ፈጣን ክምችት እነዚህ አምስት ስሞች እና ሜታዳታ-የተጠቃሚ ጭነት እና Merkle ፋይሎች ያገናኛል, ነገር ግን ማንበብ አይደለም, ሃሽ, ፓነል, ወይም ይዘታቸውን ዲኮድ. ይህ የተፈረመ ማኒፌስት ከ አነስተኛ ዓለም ይገነባል / Nexus, ትክክለኛውን ካርታዎች ያስቀምጣል Kura የሃሽ ቅድመ-እይታን ብቻ, እና ቅጽበታዊ ገጽ እይታዎች የዓለም, ብሎክ-ሀሽ አደረጃጀት ትቶ, የግብይት ታሪክ፣ የተገኙ መረጃ ጠቋሚዎች እና ዘላቂ መልሶ ማግኛ መጽሔቶች ያልተከፈቱ። ሜርክል ፣ የካኖኒካል እና ሴማንቲክ ቅጽበታዊ ገጽ እይታ ኦዲት ፣ ታሪካዊ ብሎኮች / ፍጻሜ / SCCP ማመሳሰል ፣ Sumeragi ንቁ ቁመት መልሶ ማገገም ፣ ውህደት እና መጠይቅ መጽሔቶች ፣ የመንገድ መገለጫ / ተገዢነት ምንጮች ፣ በ Kura የተደገፉ SoraFS መዝገቦች ፣ ተደጋጋሚ ማከማቻ ሂሳብ እና አማራጭ የአገልግሎት ማስተካከያዎች ወደኋላ ቀርተዋል ። አካባቢያዊ የግብይት ምዝገባ ፣ ጥቆማዎች ፣ ድምጽ መስጠት ፣ የካኖኒካል ጽሁፎች እና ረዳት አምራቾች አሁንም ተሰናክለዋል። Kura ራሱ የደራሲውን ጅምር እና ዘላቂ ለውጦችን ውድቅ ያደርጋል; ቧንቧ እና FASTPQ የማያቋርጥ ረድፎች ሥራውን ከማቆየት ወይም ከመተርጎም ይልቅ ወዲያውኑ ውድቅ ያደርጉታል. Kura APIs ን ያንብቡ እንዲሁም የጥገና እና ዘላቂነት-ማመሳሰል ባህሪን ያሰናክሉ: ጊዜያዊ የጎን ተሽከርካሪዎች አይስተዋወቁም ፣ የጎደለው የመንገድ ዕቃዎች አይታተሙም ፣ እና የእድገት መሰናክሎች አልተሰነዘሩም ። Sumeragi እና የግብይት ወሬ አይጀመርም። Torii የጤና, ተለዋዋጭነት, ዝግጁነት, የእኩዮች እና ውቅር ስራዎችን ብቻ ያጋልጣል; API - ስሪት, ሁኔታ, መለኪያዎች, እና ሁሉም መደበኛ ሁኔታ / ታሪክ መስመሮች አይገኙም.

`fast` ን ለአንድ ክስተት ብቻ ይጠቀሙ። አገልግሎት ከተረጋጋ በኋላ አገናኙን ያቁሙ ፣ `strict` ን መልሰው ያስጀምሩ እና እያንዳንዱ የተዘገየ የቼክ እና የመረጃ ጠቋሚ ዳግም ግንባታ ምርት ከመጀመሩ በፊት ይሠራል። ፈጣን ሁነታ የተዘገየውን ማዋሃድ መዝገብ አያስፈልገውም እንዲሁም ቀኖናዊ ማከማቻን አይፈጥርም ፣ አያስተካክልም ፣ አይቆርጥም ወይም አይያስገባም ፤ ያልታተሙ ድጋፎችን እና የሚጠብቁ ረዳት መልሶ ማግኛ ደረጃዎች ሳይነበቡ ወይም ሳይለወጡ ችላ ይባላሉ ፣ ከዚያ ለጠንካራ መልሶ ማገገም ይተፋሉ ። ከውጭ የሚመጣው የሃሽ-ብቻ ቅጽበታዊ ገጽ እይታ መስመር አሁንም አይገኝም ። የጎደለው ወይም ልክ ያልሆነ የአሁኑ ቅጽበታዊ እይታ ወዲያውኑ ይወድቃል። ፈጣን በጭራሽ ወደ ባዶ ዓለም ወይም ታሪካዊ መልሶ ማጫወት እንደገና ለመገንባት ወደኋላ አይገባም።

<param-table default-value=strict>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `strict`: ሙሉ ማረጋገጫ እና መደበኛ ምርት
- `fast`: የተገደበ የአደጋ ጊዜ ጅምር እና ምርቱ እስከ ጥብቅ ዳግም ማስጀመር ድረስ በኳራንቲን ውስጥ

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ብሎኮቹ የሚቀመጡበትን ማውጫ [^paths] ያመለክታል.

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

ለኮንሶል አዲስ ብሎኮችን ማተም እንዲቻል ባንዲራ።

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

ረድፍ ላይ የሚጠብቁ ግብይቶች ብዛት ከፍተኛ ገደብ።

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ለአንድ ተጠቃሚ ረድፍ ውስጥ የሚጠብቁ ግብይቶች ብዛት ከፍተኛ ገደብ።

ይህን አማራጭ ተጠቅመህ ማሽቆልቆልን ተግባራዊ አድርግ።

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ግብይቱ ከዚህ ጊዜ በኋላ አሁንም ረድፍ ውስጥ ከሆነ ይቋረጣል.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi ለስላሳ-ፎርክ አያያዝ መንገዶችን ለመለማመድ ዲቦግ-ብቻ ማብሪያ። ይህንን ከቁጥጥር ምርመራዎች ውጭ ያሰናክሉ; በሂደት ላይ ባለው የምርት አውታረመረብ ላይ መለወጥ የእኩዮቹን ስምምነት ባህሪ በተመለከተ አለመግባባት ሊያመጣ ይችላል ።

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus የአቶሚክ የግል ስምምነት {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` የተለየውን `AtomicPrivateSettlementV1` ዱካ ይቆጣጠራል። እሱ በነባሪነት ተሰናክሏል ። `enabled = true` ማዘጋጀትም እንዲሁ `activation_height` ይጠይቃል; በሰንሰለት ላይ ያለው አቅም ፣ የማስጠንቀቂያ ጊዜ ፣ ቋሚ ማስረጃ መገለጫ እና የመጠባበቂያ / ኦዲት አስተዳደር ካልተንቀሳቀሱ በስተቀር መግቢያ አሁንም አይዘጋም።

ዋናዎቹ ድንበሮች `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, እና `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` በጥብቅ እየጨመረ የሚሄድ ንዑስ ቡድን መሆን አለበት V1 የፓዲንግ ትምህርቶች። `permitted_policy_versions` ብቻ ይቀበላል V1.

`max_capsule_bytes` የቅዱሳን መጻሕፍት Norito የጠቅላላው ባይት `PrivateSettlementAuditCapsuleV1`, ጨምሮ AAD, የኖንሴ፣ የሲፊር ጽሑፍ፣ የቬክተር ማዕቀፍ፣ እና እያንዳንዱ ኦዲተር የታሸገ...DEK ሁሉም የተፈቀደ የሽፋን ክፍሎች ለ  ቢያንስ `default_min_auditor_approvals` ኦዲተሮች ይህ የምስክር ወረቀት መስፈርት እንዲሁ የተስተካከለ ደረጃ ነው: Torii አዲስ ተቀባይነት ያገኘውን ፖሊሲ ዝቅተኛ ዋጋ ያለው `min_approvals` ከካኖኒካል ባይት ገደብ በላይ የሆነ ማንኛውንም እውነተኛ ካፕሱል ውድቅ ያደርጋል።

እነዚህ ቅንብሮች የምርት አካባቢ-ተለዋዋጭ ማግበር bypass የላቸውም. [የአቶሚክ የግል የመረጃ-መተላለፊያ ቦታ ማስተካከያ ያካሂዱ](/am/get-started/atomic-private-settlement) የተሟላ የግንባታ ምሳሌ እና የአሠራር መስፈርቶች። መንገድ ሰነድ ውጫዊ የመልቀቂያ በሮች ያልፋሉ ድረስ ምርት-የተረጋገጠ አይደለም.

## ፈጣን ፎቶግራፍ {#snapshot}

ይህ ሞጁል የ [World State View](/am/blockchain/world#world-state-view-wsv) ቅጽበታዊ ገጽ እይታዎችን ለማንበብ እና ለመጻፍ ኃላፊነት አለበት.

ቅጽበታዊ ገጽ እይታዎች የዓለምን ሁኔታ እይታ ተከታታይ የፍተሻ ነጥብ ያስቀምጣሉ ስለሆነም አንድ እኩይ ከ Kura እያንዳንዱን ብሎክ እንደገና ሳይጫወት ዳግም ማስጀመር ይችላል ። Kura ዘላቂው የብሎክ ታሪክ እና ለድጋሚ መጫወት የእውነት ምንጭ ሆኖ ይቆያል ፣ ቅጽበታዊ እይታዎች የማፋጠን መንገድ ናቸው። በመጀመር ላይ Iroha ቅጽበታዊ ገጽ እይታ ሜታዳታዎችን ከተዋቀረው ሰንሰለት እና ከተከማቹ ብሎኮች ጋር ከመፈተሽዎ በፊት ቅጽበታዊ እይታን ለመጫን ወይም እንደገና ለመጫወት መመለስዎን ይወስናል ።

::: tip ቅጽበታዊ ገጽ እይታዎችን ማጽዳት

በቅጽበታዊ ገጽ እይታዎች ስርዓት ውስጥ የሆነ ችግር ካለ እና ከባዶ ገጽ (በቅጽበታዊ እይታዎች) መጀመር ከፈለጉ ፣ በ [`snapshot.store_dir`](#param-snapshot-store-dir) የተጠቀሰውን ማውጫ ማስወገድ ይችላሉ ።

:::

### `snapshot.mode` {#param-snapshot-mode}

የ Snapshot ሥርዓት የሚሠራበት ሁነታ።

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `read_write`: Iroha የጊዜ ሰሌዳዎችን ያዘጋጃል [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). በመጀመር ላይ, Iroha ነባር ቅጽበታዊ ገጽ እይታን (የሚገኝ ከሆነ) ያነባል እንዲሁም ከብሎኮች ማከማቻ ጋር ወቅታዊ መሆኑን ያረጋግጣል ።
- `readonly`: ልክ እንደ `read_write` ነገር ግን Iroha ምንም ቅጽበታዊ ገጽ እይታዎች መፍጠር አይደለም.
- `disabled`: Iroha አዲስ ቅጽበታዊ ገጽ እይታዎችን አይፈጥርም ወይም ሲጀምር ነባር ቅጽበታዊ እይታን አያነብም.

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

የፎቶግራፍ ድግግሞሽ።

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

ቴሌሜትሪ የእኩዮች ምርመራን ወደ ውጫዊ የቴሌሜትሪክ ሰብሳቢ ያወጣል። አንድ እኩያ ለሰብሳቢ ሪፖርት ማድረግ በሚገባበት ጊዜ `telemetry.name` እና `telemetry.url` ሁለቱንም ያዋቅሩ; ቴሌሜትር ጥቅም ላይ ካልዋለ ክፍሉን ያስወግዱ.

`name` እና `url` በፓር መሆን አለባቸው።

ሁሉም `telemetry` ክፍል አማራጭ ነው።

### `telemetry.name` {#param-telemetry-name}

በቴሌሜትሪው ላይ የሚታየው የአገናኙ ስም ነው።

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

የቴሌሜትሪ ሰብሳቢው WebSocket URL።

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
