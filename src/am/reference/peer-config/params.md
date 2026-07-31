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

# የግንባታ መለኪያዎች {#configuration-parameters}

[toc]

## ሥር-ደረጃ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

በእያንዳንዱ ግብይት ውስጥ መካተት ያለበት ሰንሰለት ID።

የመልሶ ማጫወት ጥቃት ከተፈለገበት የተለየ አውታረመረብ ጋር ትክክለኛውን ግብይት ለማቅረብ የሚደረግ ሙከራ ነው። `chain` የተፈረመው የግብይት ጥቅማጥቅሞች አካል ስለሆነ ለአንድ ሰንሰለት የተፈረመ ግብይት በሌላ ሰንሰለት ID በሚጠቀሙ እኩዮች ውድቅ ይደረጋል።

<param-table type=string env=CHAIN />

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

አስቀድሞ የተገለጹ የታመኑ እኩዮች ዝርዝር።

የስምምነት ማረጋገጫ ሰጪዎች BLS- መደበኛ የእኩዮች ቁልፎችን መጠቀም አለባቸው። ለእያንዳንዱ የማረጋገጫ ሰጭም ተመሳሳይ የሆነ [`trusted_peers_pop`](#param-trusted-peers-pop) መግቢያ ያቅርቡ ።

<param-table env="TRUSTED_PEERS">
<template #type>

P2P አድራሻ በሚታወቅበት ጊዜ `PUBLIC_KEY@ADDRESS` ን ይጠቀሙ; ባዶ `PUBLIC_KEY` እንዲሁ ተቀባይነት አለው እና የባልደረባ አድራሻውን ከጨዋው እንዲገኝ ያስችለዋል ።

</template>
</param-table>

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

ለቅርብ ጊዜው ብሎክ ከባልደረቦቹ ጋር ለሚደረጉ ጥያቄዎች መካከል ያለው የጊዜ ልዩነት.

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊሞላ ይችላል።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: የኮድ ቡድን

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

በሐሜት ስብስብ መልዕክት ውስጥ ከፍተኛ የግብይቶች ብዛት።

አነስተኛ መጠን ለማመሳሰል ረዘም ያለ ጊዜ ያስከትላል, ነገር ግን ከፍተኛ የፓኬት ኪሳራ ካለዎት ጠቃሚ ነው.

<param-table type=number default-value=500 />

::: የኮድ ቡድን

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

በእኩዮች መካከል የሚደረገውን ግብይት በመጠባበቅ ላይ ወሬ የመናገር ጊዜ።

በተደጋጋሚ የሚነገር ወሬ የማመሳሰል ጊዜን ያጠርጣል፤ ነገር ግን አውታረ መረቡን ከመጠን በላይ ሊሞላ ይችላል።

<param-table type=millis default-value=1_000 default-note="1 second" />

::: የኮድ ቡድን

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

ከባልደረባው ጋር ያለው ግንኙነት ካልተቋረጠ በኋላ የሚቆየው ጊዜ።

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: የኮድ ቡድን

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

የ Torii አገልጋይ ማዳመጥ ያለበት እና ደንበኛው ጥያቄዎቹን የሚያቀርብበት አድራሻ።

<param-table type=socket-addr env=API_ADDRESS />

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

አንድ ጥያቄ ካልተደረሰም በመደብሩ ውስጥ ሊቆይ የሚችልበት ጊዜ።

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: የኮድ ቡድን

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

የቀጥታ መጠይቆች ብዛት ከፍተኛ ገደብ.

<param-table type=number default-value=128 />

::: የኮድ ቡድን

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ለአንድ ተጠቃሚ የቀጥታ መጠይቆች ብዛት ከፍተኛ ገደብ።

<param-table type=number default-value=128 />

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

[`logger.level`](#param-logger-level) በተጨማሪ የተሻሻሉ መዝገብ ማጣሪያዎች።

<param-table type=string env=LOG_FILTER>
<template #type>

አንድ ወይም ከዚያ በላይ በኮማ የተለዩ መመሪያዎችን ያጠቃልላል ። እያንዳንዱ መመሪያ የሚዛመደው ከፍተኛ የቃል መጠን ሊኖረው ይችላል ፣ ይህም (ለምሳሌ ፣ ይምረጣል) ተጓዳኝ ርዝመቶችን እና ክስተቶችን ያስችላል። Iroha ያነሰ ውስንነት ያላቸው ደረጃዎች (እንደ `trace` ወይም `info`) የበለጠ ውስንነት ካላቸው ደረጃዎች (ለምሳሌ `error` ወይም `warn`) የበለጠ አነጋገር አላቸው.

በከፍተኛ ደረጃ የዲሬክቲቭ አገባብ በርካታ ክፍሎችን ያቀፈ ነው-

```
target[span{field=value}]=level
```

ተጨማሪ ዝርዝሮችን ለማግኘት [`tracing-subscriber` ሰነድ ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ይመልከቱ።

</template>

</param-table>

::: የኮድ ቡድን

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) ጋር ተኳሃኝነት

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

ገመድ, የሚቻል እሴቶች:

- `full`: ነባሪው ቅርጸት. ይህ የሚከሰተው ለእያንዳንዱ ክስተት የሰው ሊነበብ የሚችል ፣ የአንድ መስመር መዝገቦችን ያወጣል ፣ የአሁኑ የጊዜ ሰሌዳ አውድ ከታየበት ክስተቱ ቅርጸት የተሰጠው መግለጫ በፊት ይታያል ።
- `compact`: ለጥቂት የመስመር ርዝመቶች የተመቻቸ ነባሪ ቅርጸት አቀራረብ። ከአሁኑ የጊዜ ሰሌዳ አውድ ውስጥ ያሉ መስኮች ወደ የተቀየሰ ክስተቱ መስኮች ተያይዘዋል ፣ እና የጊዜ ሰፈሩ ስሞች አይታዩም ፣ የቃላት ደረጃ ወደ አንድ ቁምፊ አጭር ነው ።
- `pretty`: እጅግ በጣም ቆንጆ, ባለብዙ መስመር መዝገቦችን ያወጣል, ለሰው ልጅ ሊነበብ የሚችል. ይህ በዋናነት በአካባቢያዊ ልማት እና debugging ውስጥ ወይም ትዕዛዝ-መስመር መተግበሪያዎች ላይ ለመጠቀም ታስቦ ነው, የአውቶማቲክ ትንተና እና የታሸጉ መዝገቦችን ማከማቸት ከአንባቢነት እና የእይታ ማራኪነት ያነሰ ቅድሚያ የሚሰጥባቸው ጊዜያት።
- `json`: አዲስ መስመር-የተገደበ JSON መዝገቦችን ያወጣል ። ይህ የተዋቀሩ መዝገቦች በትንታኔ እና በማየት መሳሪያዎች እንደ JSON በሚጠቀሙባቸው ስርዓቶች ውስጥ ለማምረት የታሰበ ነው ። የ JSON ውፅዓት ለሰው ልጅ ሊነበብ የማይችል ነው ።

ተጨማሪ ዝርዝሮች እና የናሙና ውጤቶች ለማግኘት [`tracing-subscriber` ሰነድ ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ይመልከቱ።

</template>
</param-table>

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura የመነሻ መንገድ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

ገመድ, የሚቻል እሴቶች:

- `strict`: የሁሉም ብሎኮች ጥብቅ ማረጋገጫ
- `fast`: ፈጣን ጅምርነት በዋና ምርመራዎች ብቻ

</template>
</param-table>

::: የኮድ ቡድን

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ብሎኮቹ የሚቀመጡበትን ማውጫ [^paths] ያመለክታል.

በተጨማሪም ተመልከት: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: የኮድ ቡድን

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

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ለአንድ ተጠቃሚ ረድፍ ውስጥ የሚጠብቁ ግብይቶች ብዛት ከፍተኛ ገደብ።

ይህን አማራጭ ተጠቅመህ ማሽቆልቆልን ተግባራዊ አድርግ።

<param-table type=number default-value=65_536 />

::: የኮድ ቡድን

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ግብይቱ ከዚህ ጊዜ በኋላ አሁንም ረድፍ ውስጥ ከሆነ ይቋረጣል.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: የኮድ ቡድን

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi ለስላሳ-ፎርክ አያያዝ መንገዶችን ለመለማመድ ዲቦግ-ብቻ ማብሪያ። ይህንን ከቁጥጥር ምርመራዎች ውጭ ያሰናክሉ; በሂደት ላይ ባለው የምርት አውታረመረብ ላይ መለወጥ የእኩዮቹን ስምምነት ባህሪ በተመለከተ አለመግባባት ሊያመጣ ይችላል ።

<param-table type=bool default-value=false />

::: የኮድ ቡድን

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## ፈጣን ፎቶግራፍ {#snapshot}

ይህ ሞጁል የ [World State View](/am/blockchain/world#world-state-view-wsv) ቅጽበታዊ ገጽ እይታዎችን ለማንበብ እና ለመጻፍ ኃላፊነት አለበት.

ቅጽበታዊ ገጽ እይታዎች የዓለምን ሁኔታ እይታ ተከታታይ የፍተሻ ነጥብ ያስቀምጣሉ ስለሆነም አንድ እኩይ ከ Kura እያንዳንዱን ብሎክ እንደገና ሳይጫወት ዳግም ማስጀመር ይችላል ። Kura ዘላቂው የብሎክ ታሪክ እና ለድጋሚ መጫወት የእውነት ምንጭ ሆኖ ይቆያል; ቅጽበታዊ እይታዎች የማፋጠን መንገድ ናቸው ። በመጀመር ላይ Iroha ቅጽበታዊ ገጽ እይታ ሜታዳታዎችን ከተዋቀረው ሰንሰለት እና ከተከማቹ ብሎኮች ጋር ከመፈተሽዎ በፊት ቅጽበታዊ እይታን ለመጫን ወይም እንደገና ለመጫወት መመለስዎን ይወስናል ።

::: tip የቅጽበታዊ ገጽ እይታዎችን ማጽዳት

በቅጽበታዊ ገጽ እይታዎች ስርዓት ውስጥ የሆነ ችግር ካለ እና ከባዶ ገጽ መጀመር ከፈለጉ (ከቅጽበታዊ እይታዎች አንፃር) ፣ በ [ `snapshot.store_dir`](#param-snapshot-store-dir) የተጠቀሰውን ማውጫ ማስወገድ ይችላሉ ።

:::

### `snapshot.mode` {#param-snapshot-mode}

የ Snapshot ሥርዓት የሚሠራበት ሁነታ።

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ገመድ፣ ሊሆኑ የሚችሉ እሴቶች

- `read_write`: Iroha በ [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) በተጠቀሰው ጊዜ ውስጥ ቅጽበታዊ ገጽ እይታዎችን ይፈጥራል ። ሲጀምር ፣ Iroha ነባር ቅጽበታዊ እይታን (የሚኖር ከሆነ) ያነባል እና ከብሎኮች ማከማቻ ጋር ወቅታዊ መሆኑን ያረጋግጣል ።
- `readonly`: ልክ እንደ `read_write` ነገር ግን Iroha ምንም ቅጽበታዊ ገጽ እይታዎች መፍጠር አይደለም.
- `disabled`: Iroha አዲስ ቅጽበታዊ ገጽ እይታዎችን አይፈጥርም ወይም ሲጀምር ነባር ቅጽበታዊ እይታን አያነብም.

</template>
</param-table>

::: የኮድ ቡድን

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

::: የኮድ ቡድን

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

ቅጽበታዊ ፎቶዎችን የማከማቸት ማውጫ።

በተጨማሪም ተመልከት: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: የኮድ ቡድን

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## ቴሌሜትሪ {#telemetry}

ቴሌሜትሪ የእኩዮች ምርመራን ወደ ውጫዊ የቴሌሜትሪክ ሰብሳቢ ያወጣል። አንድ እኩያ ለሰብሳቢ ሪፖርት ማድረግ በሚገባበት ጊዜ `telemetry.name` እና `telemetry.url` ሁለቱንም ያዋቅሩ; ቴሌሜትር ጥቅም ላይ ካልዋለ ክፍሉን ይጥሉ.

`name` እና `url` በፓር መሆን አለባቸው።

ሁሉም `telemetry` ክፍል አማራጭ ነው።

### `telemetry.name` {#param-telemetry-name}

በቴሌሜትሪው ላይ የሚታየው የአገናኙ ስም ነው።

<param-table type=string />

::: የኮድ ቡድን

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

የቴሌሜትሪ ሰብሳቢው WebSocket URL።

<param-table type=string />

::: የኮድ ቡድን

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

እንደገና ከመገናኘቱ በፊት መጠበቅ ያለበት ዝቅተኛ ጊዜ።

<param-table type=millis default-value=1_000  default-note="1 second" />

::: የኮድ ቡድን

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

በግንኙነቶች መካከል ያለውን መዘግየት ለመጨመር ጥቅም ላይ የሚውለው የ 2 ከፍተኛ ጠቋሚ።

<param-table type=number default-value=4 />

::: የኮድ ቡድን

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ወደ dev-ቴሌሜትሪ ለመጻፍ የፋይልፓት

<param-table type=file-path />

::: የኮድ ቡድን

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
