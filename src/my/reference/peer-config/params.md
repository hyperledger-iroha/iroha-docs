---
translation_locale: my
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Configuration Parameters များ {#configuration-parameters}

[toc]

## အမြစ်အဆင့် {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Chain ID ကို transaction တစ်ခုချင်းစီမှာ ထည့်သွင်းရမယ်။ ပြန်လည်ဖြန့်ဝေမှု တိုက်ခိုက်မှုတွေကို တားဆီးဖို့ သုံးတယ်။

replay တိုက်ခိုက်မှုဆိုသည်မှာ valid transaction ကို ရည်ရွယ်ချက်နှင့်မတူသောကွန်ရက်တစ်ခုသို့ တင်ပြရန်ကြိုးပမ်းခြင်းဖြစ်သည်။ `chain` လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှု အသုံးဝင် ဝန်ဆောင်မှု အစိတ်အပိုင်းတစ်ခုဖြစ်ပြီး ချိတ်ဆက်မှု တစ်ခုအတွက် လက်မှတ်ရေးဆွဲထားသည့် ငွေလဲလှယ်မှုတစ်ခုကို အခြား ချိတ်ဆက်မှုကို သုံးတဲ့ တူညီသူတွေက ပယ်ချလိုက်ပါတယ်။ ID.

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

အများသုံး peer key: Consensus validator peers တွေဟာ BLS-Normal keys ကို သုံးရမယ်။

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

Peer private key: `public_key` နှင့် ကိုက်ညီရမည်။ Consensus validator peers များသည် BLS-Normal keys များကို အသုံးပြုရမည်ဖြစ်သည်။

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

အရင်ဆုံး သတ်မှတ်ထားတဲ့ ယုံကြည်ရတဲ့ အဖော်စာရင်း။

Consensus validators များသည် BLS-Normal peer keys များကို အသုံးပြုရမည်ဖြစ်သည်။ validator တစ်ခုစီအတွက်လည်း [`trusted_peers_pop`](#param-trusted-peers-pop) entry ကိုပေးပါ။

<param-table env="TRUSTED_PEERS">
<template #type>

P2P လိပ်စာသိရှိပါက `PUBLIC_KEY@ADDRESS` ကို အသုံးပြုပါ။ bare `PUBLIC_KEY` ကိုလည်း လက်ခံထားပြီး gossip မှ peer address ကိုရှာဖွေခွင့်ပြုတယ်။

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

BLS validator ကိုယုံကြည်တဲ့ အဖော်များအတွက် ပိုင်ဆိုင်မှုသက်သေစာရင်းသွင်းခြင်း။

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` နှင့် `pop_hex` ကွင်းများနှင့်အတူ အရာဝတ္ထုတန်း

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

## ဇင်နဝါရီ {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` မှထုတ်လုပ်သော လက်မှတ်ရေးထိုးထားသော genesis block ၏ အသုံးဝင်ဝန်ဆောင်မှုသို့ ဖိုင်လမ်းကြောင်း။ Generated profiles များတွင်ဤကို Norito `.nrt` ဖိုင်အဖြစ် ရေးသားလေ့ရှိသည်။

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

Genesis Key ရဲ့ အများသုံး သော့ပါ။

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

## ကွန်ရက် {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

သဘောတူညီချက် (sumeragi) နှင့် ဘလော့က ပေါင်းစပ်ခြင်း (block_sync) ရည်ရွယ်ချက်များအတွက် p2p ဆက်သွယ်ရေးအတွက်လိပ်စာ။

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

Peer-to-peer address (အခြား peers တွေမြင်သလို ပြင်ပ) ။

အဆက်အသွယ် ရှိတဲ့ အဖော်တွေဆီ ဝေဖန်ခံရမှာမို့လို့ အခြား အဖော်တွေဆီကို ဝေဖန်နိုင်မှာပါ။

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

Synchronization message တစ်ခုတည်းမှာ ပို့နိုင်တဲ့ blocks အရေအတွက်။

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

နောက်ဆုံး block အတွက် peer တွေကို တောင်းဆိုချက်ကြားက အချိန်အကွာအဝေး။

မကြာခဏ ဝေဖန်ခြင်းဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Gossip batch စာတိုမှာ အတိုင်းအတာ အများဆုံး ငွေပေးချေမှု။

ပိုသေးတဲ့ အရွယ်အစားက synchronize လုပ်ဖို့ အချိန်ပိုကြာစေပေမဲ့ ပါကက်အဆုံးရှုံးမှု မြင့်မားရင် အသုံးဝင်ပါတယ်။

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

အဖော်များအကြား ငွေပေးချေမှုကို စောင့်ဆိုင်းနေစဉ် ဝေဖန်ပြောဆိုခြင်း ကာလ။

မကြာခဏ ဝေဖန်ခြင်းဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

peer နဲ့ ဆက်နွယ်မှု ရပ်တန့်သွားတဲ့ အချိန်ကာလ၊ peer က အလုပ်မလုပ်ဘူးဆိုရင်။

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii ဆာဗာက နားထောင်ဖို့လိုပြီး ဖောက်သည်တွေက သူတို့တောင်းဆိုချက်တွေကို တင်ပြရမယ့်လိပ်စာ။

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

[Torii အကန့်အသတ်မှတ်ချက်များ ](/my/reference/torii-endpoints.md) ကလက်ခံသော raw request body တွင် byte အများဆုံးအရေအတွက်။

DOS တိုက်ခိုက်မှုတွေကို တားဆီးဖို့ ဒီကန့်သတ်ချက်ကို သုံးပါတယ်။

<param-table>
<template #type>

(ဘိုက်တာများ)

</template>
<template #default-value>

`64_000_000` (ဘိုက်ပေါင်း သန်း ၆၄)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

ဝင်ရောက်မတွေ့ရင် စတိုးဆိုင်မှာ မေးမြန်းမှုတစ်ခု ဆက်ရှိနေနိုင်တဲ့ အချိန်ပါ။

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

တိုက်ရိုက် မေးမြန်းမှု အရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်ပါ။

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

သုံးစွဲသူတစ်ဦးအတွက် တိုက်ရိုက် မေးမြန်းမှု အရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်ပါ။

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## သစ်သားလုပ်သူ {#logger}

### `logger.level` {#param-logger-level}

General logging verbosity [ `logger.filter`](#param-logger-filter) ကို ကြည့်ပါ။

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `TRACE`: အနိမ့်အဆင့် လုပ်ငန်းများအပါအဝင် ဖြစ်ရပ်အားလုံး။
- `DEBUG`: Debug-level သတင်းအချက်အလက်တွေ၊ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပါတယ်။
- `INFO`: ယေဘုယျ သတင်းအချက်အလက်သတင်းများ။
- `WARN`: ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာတွေကို ထောက်ပြတဲ့ သတိပေးချက်များ။
- `ERROR`: ပုံမှန်လုပ်ဆောင်မှုကို နှောင့်ယှက်ပေမဲ့ ဆက်လက်လုပ်ဆောင်ခွင့်ပြုတဲ့အမှားများ။

သင့်အသုံးပြုမှုကိစ္စအတွက်အကောင်းဆုံးအဆင့်ကိုရွေးချယ်ပါ။ မတူညီတဲ့မှတ်တမ်းအဆင့်များကိုဘယ်လိုသုံးရမလဲဆိုတဲ့အပိုဒ်များအတွက် [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ကိုကြည့်ပါ။

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

::: tip Runtime ကို update လုပ်ပေးရန်

ဤပမာဏသည် Torii အော်ပရေတာအဆုံးမှတ်များမှတစ်ဆင့် runtime configuration update ကို subjected ဖြစ်ပါသည်။

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level) အပြင် ပြင်ဆင်ထားသော log filter များ။ ရည်မှန်းချက်တစ်ခုစီအတွက် logging verbosity ကို customization လုပ်ခွင့်ပေးတယ်။

<param-table type=string env=LOG_FILTER>
<template #type>

String ဆိုသည်မှာ ဝါယာကြိုးဖြင့်ခွဲခြားထားသော ညွှန်ကြားချက်တစ်ခု (သို့မဟုတ်) များစွာမှ ပါဝင်သည်။ ညွှန်ပြချက်တိုင်းတွင် corresponding maximum verbosity level which enables (e.g., selects for) spans and events that match (ဥပမာ၊ ရွေးချယ်ခြင်းများ) Iroha ပိုနည်းတဲ့ သီးခြားအဆင့်တွေကို ထည့်တွက်တယ် (ဥပမာ `trace` ဒါမှမဟုတ် `info`) ကို ပိုပိုပြီး သီးသန့်အဆင့်များထက် ပိုမိုပြောဆိုနိုင်ရန် (ဥပမာ: `error` ဒါမှမဟုတ် `warn`).

အဆင့်မြင့်အဆင့်မှာ ညွှန်ကြားချက်တွေရဲ့ သဒ္ဒါဟာ အစိတ်အပိုင်းများစွာနဲ့ ဖွဲ့စည်းထားပါတယ်။

```
target[span{field=value}]=level
```

အသေးစိတ်အချက်အလက်များအတွက် [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ကို ကြည့်ပါ။

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

::: info [`logger.level`](#param-logger-level) နှင့် ပေါင်းစပ်အသုံးပြုခြင်း

`logger.filter` သည် [`logger.level`](#param-logger-level) နှင့် အတူတကွ အလုပ်လုပ်ပြီး တစ်ခုမှ အခြားတစ်ခုကို overwrites မလုပ်ပါ။

ဥပမာ၊ `logger.level` သတ်မှတ်ထားသည် `INFO` နှင့် `logger.filter` သတ်မှတ်ထားသည် `iroha_core=debug`, ရလာတဲ့ filter set ကတော့ `info,iroha_core=debug` (အဲဒါက `info` မော်ဂျူးအားလုံးအတွက်၊ `debug` အတွက် `iroha_core`).

:::

::: tip Runtime ကို update လုပ်ပေးရန်

ဤပမာဏသည် Torii အော်ပရေတာအဆုံးမှတ်များမှတစ်ဆင့် runtime configuration update ကို subjected ဖြစ်ပါသည်။

:::

### `logger.format` {#param-logger-format}

မှတ်ပုံတင်ပုံစံ။

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `full`: Default formatter။ ဒါက ဖြစ်စဉ်တစ်ခုစီအတွက် လူသားဖတ်လို့ရတဲ့ တစ်တန်းတည်းမှတ်တမ်းတွေကို ထုတ်လွှင့်ပေးပြီး ဖြစ်ရပ်ရဲ့ ပုံသွင်းထားတဲ့ ကိုယ်စားပြုမှုမတိုင်မီမှာ လက်ရှိ span အခြေအနေကို ပြသတယ်။
- `compact`: အတိုတန်းအလျားများအတွက်ကောင်းမွန်သော default formatter ၏ကွဲပြားမှုတစ်ခုဖြစ်သည်။ လက်ရှိ span အခြေအနေမှ Fields များကို formatted ဖြစ်ရပ်၏ field များနှင့်အတူဆက်စပ်ထားပြီး span နာမည်များကိုပြသခြင်းမရှိပါ။ verbosity အဆင့်သည်တစ်လုံးတည်းသောစာလုံးအဖြစ် shortened ဖြစ်ပါသည်။
- `pretty`: အလွန်အမင်း လှပတဲ့ လိုင်းများစွာပါတဲ့ မှတ်တမ်းတွေကို ထုတ်လွှင့်ပေးတယ်။ လူသားတွေ ဖတ်နိုင်ဖို့ အကောင်းဆုံးပါ။ ဒါက အဓိကအားဖြင့် ဒေသဖွံ့ဖြိုးရေးမှာ အသုံးပြုဖို့ ရည်ရွယ်ထားပြီး Debugging (သို့) command-line application များအတွက်တော့ အလိုအလျောက်လေ့လာခြင်းနှင့် log တွေကို compact store လုပ်ခြင်းသည် ဖတ်နိုင်မှုနှင့် visual appeal ထက် ပို၍ ဦးစားမပေးပါ။
- `json`: newline-delimited JSON logs များထုတ်လုပ်ခြင်း။ ဤသည်မှာ တည်ဆောက်ထားသော logs များကို বিশ্লেষণနှင့်ကြည့်ရှုရေးကိရိယာများမှတစ်ဆင့် JSON အဖြစ်သုံးစွဲသည့်စနစ်များဖြင့် ထုတ်လုပ်မှုအသုံးပြုရန်ရည်ရွယ်သည်။ JSON ထုတ်ကုန်သည် လူသားဖတ်နိုင်စွမ်းအတွက်ကောင်းမွန်အောင်မပြုပြင်ပါ။

အသေးစိတ်အချက်အလက်များနှင့် နမူနာထုတ်ကုန်များကို [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ကိုကြည့်ပါ။

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

Kura သည် Iroha (သိုလှောင်ရုံအတွက် ဂျပန်ဘာသာ) ၏ တည်ငြိမ်သော သိုလှောင်မော်တာဖြစ်သည်။

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

နောက်ဆုံး N ဘလော့က Memory ထဲမှာ သိမ်းထားမှာပါ။

ပိုမိုဟောင်းတဲ့ ဘလော့ကစ်တွေကို မှတ်ဉာဏ်ကနေ ပိတ်ပစ်ပြီး လိုအပ်ရင် ဒစ်ကစ်ကနေ ထည့်သွင်းပေးမှာပါ။

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

Kura အစပျိုးမှု mode။ `strict` သည် ပုံမှန်နှင့်အဓိက mode ဖြစ်သည်: node တက်ကြွမလာမီ Canonical History, Recovery artefacts, Auxiliary indexes နှင့် Storage accounting ကို validates လုပ်ပါသည်။

`fast` အရေးပေါ်အခြေအနေမှာ အန္တရာယ်ရှိနေတဲ့ ဝန်ဆောင်မှုစနစ်ကို အသုံးပြုပြီး လုပ်ငန်းခွင်ရဲ့ မြင်နိုင်မှုကို ပြန်လည်ထူထောင်ပေးပါတယ်။ အစပျိုးရေးစစ်ဆေးမှုတစ်ခုလုံးဟာ ချို့ယွင်းမှုအန္တရာယ်ရှိလိမ့်မယ်။ `strict` နောက်ပြီး လက်ရှိ snapshot မျိုးဆက်မှာ အနုပညာပစ္စည်း ငါးခုကို ထည့်သွင်းထားပါတယ်။ `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, နှင့် `snapshot.merkle.json`. Domain ကွဲပြားတဲ့ operator လက်မှတ်က ကြော်ငြာပြုလုပ်ထားတဲ့ payload digest နဲ့ bounded manifest ကို ချိတ်ဆက်ပါတယ်။ မော်နီဖစ်က အသုံးဝင် ဝန်ဆောင်မှုအလျား၊ သံကြိုး/ကွန်ရက် အထောက်အထား၊ အပြီးသတ်အမြင့်/ဟက်ရှ်ကို ချိတ်ဆက်ပေးပါတယ်။ SCCP မူဝါဒ hash နှင့် bootstrap lineage တည်ရှိမှု။ Fast က bootstrap ကိုငြင်းပယ် မျိုးရိုးစဉ်နဲ့ ရေရှည်ခံကနေ အမှတ်တံဆိပ်/ရေတွက်ချက်မှု/ထိပ်အကန့်အသတ် အတိအကျကိုပဲ လိုအပ်ပါတယ်။ Kura. ပထမဦးဆုံးထုတ်ပြန်တဲ့ node တွေက ဒီလက်ရာငါးခုကို အတိအကျ လက်ခံပြီး အခြားလက်ရာစာရင်း (သို့) ဖိုင်နာမ်အစီအစဉ်အားလုံးကို ပယ်ချပါတယ်။

Fast inventories those five names and metadata-binds the payload and Merkle files, but does not read, hash, parse or decode their contents. it builds a minimal World/Nexus from the signed manifest, maps the exact Kura hash prefix read-only, and leaves the snapshot World, block-hash array, transaction history, derived indexes, and durable recovery journals unopened. Merkle, canonical and semantic snapshot audits, historical block/finality/SCCP reconciliation, Sumeragi active-height recovery, merge and query journals, lane manifest/conformity sources, Kura ထောက်ပံ့သော SoraFS မှတ်တမ်းများ၊ ပြန်လည်သိမ်းဆည်းမှု စာရင်းအင်းများနှင့် ရွေးချယ်စရာ ဝန်ဆောင်မှု ညှိနှိုင်းရေး ကိရိယာများကို အချိန်ဆွဲထားဆဲဖြစ်သည်။ ဒေသတွင်း ငွေပေးချေမှုကို လက်ခံခြင်း၊ အဆိုပြုချက်များ၊ မဲပေးခြင်းများ၊ ကျမ်းဝင်စာရွက်စာတမ်းများနှင့် အထောက်အကူထုတ်လုပ်သူများအား ပိတ်ပင်ထားဆဲဖြစ်သည်။ Kura ကိုယ်တိုင်သည် စာရေးသူစတင်ခြင်းနှင့် ရေရှည်တည်တံ့သော ဗီဇပြောင်းမှုကို ပယ်ချသည်။ pipeline နှင့် FASTPQ persistence queues သည်အလုပ်ကို ထိန်းသိမ်းခြင်း (သို့မဟုတ်) ကုဒ်သွင်းခြင်းအစား ချက်ချင်းပယ်ချသည်။ Kura စာဖတ်ပါ APIs ပြင်ဆင်ခြင်းနှင့် ရေရှည်တည်တံ့မှု နှိုင်းယှဉ်ပြုမူမှုကိုလည်းပိတ်ထားသည်: ယာယီ ဘေးကားများအား မကြော်ငြာခြင်း၊ လမ်းကြောင်းပျောက်ကွယ်သော လက်ရာပစ္စည်းများကို ထုတ်ဝေခြင်းမရှိခြင်း၊ တိုးတက်မှုအတားအဆီးများကို ပိတ်ပင်ခြင်းမရှိခြင်း။ Sumeragi နှင့် ငွေပေးချေမှု ဝေဖန်မှုများမစတင်ပါ။ Torii သည် ကျန်းမာရေး၊ သက်တောင့်သက်သာ၊ အသင့်ရှိမှု, အဖော်များနှင့် ဖွဲ့စည်းမှု လုပ်ဆောင်ချက်များကိုသာ ဖော်ပြသည်။ API-ဗားရှင်း, အခြေအနေ, မက်ထရစ်များနှင့် သာမန်အခြေအနေ / သမိုင်းလမ်းကြောင်းအားလုံးရရှိနိုင်ခြင်းမရှိပါ။ ကြံ့ခိုင်မှုသည် Strict ပြန်လည်မစတင်ခင်အထိမရရှိပါ။

`fast` ကို ဖြစ်ရပ်တစ်ခုအတွက်သာ အသုံးပြုပါ။ ဝန်ဆောင်မှု တည်ငြိမ်ပြီးတာနဲ့ node ကို ရပ်ဆိုင်းပြီး `strict` ကိုပြန်လည် restart လုပ်ပါ၊ ထုတ်လုပ်မှုကို ပြန်မစတင်ခင် အချိန်ဆွဲထားတဲ့ စစ်ဆေးမှုနဲ့ အညွှန်းကိန်း ပြန်လည်တည်ဆောက်မှုတိုင်းကို ပြန်လည်စတင်ပါ။ Fast mode သည် ရွှေ့ဆိုင်းထားသော merge log ကိုလိုအပ်ခြင်းမရှိဘဲ Canonical Storage ကိုဖန်တီးခြင်း၊ ပြင်ဆင်ခြင်း၊ ဖြတ်တောက်ခြင်း သို့မဟုတ် တင်သွင်းခြင်းမရှိပါ။ မထုတ်ဝေသေးသည့် suffixes နှင့် စောင့်ဆိုင်းနေဆဲအကူအညီ recovery အဆင့်များကို ဖတ်ရှုခြင်း (သို့) အပြောင်းအလဲမပြုဘဲ လျစ်လျူရှုကာ Strict Recovery အတွက်ကျန်ရစ်သည်။ Imported hash-only snapshot lineage ကိုမရရှိနိုင်ပါ။ ပျောက်နေတဲ့ (သို့) မတည်ငြိမ်တဲ့ လက်ရှိ snapshot သည် ချက်ချင်း ကျရှုံးသည်; Fast သည်အလွတ်ကမ္ဘာသို့မဟုတ်သမိုင်းပြန်လည်ဖန်တီးခြင်းသို့ ဘယ်တော့မှ ပြန်မကျဘူး။

<param-table default-value=strict>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `strict`: အပြည့်အဝစစ်ဆေးခြင်းနှင့် ပုံမှန်ထုတ်လုပ်မှု
- `fast`: အရေးပေါ်စတင်မှု အကန့်အသတ်ရှိပြီး ထုတ်လုပ်မှုကို တင်းကျပ်တဲ့ ပြန်လည်စတင်ခြင်းမတိုင်မီ Quarantine လုပ်ထား

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

blocks တွေကို သိမ်းထားတဲ့ directory [^paths] ကို Specifies လုပ်ပါတယ်။

[`snapshot.store_dir`](#param-snapshot-store-dir) ကိုလည်း ကြည့်ပါ။

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

Console အတွက် ဘလော့အသစ်တွေကို ပုံနှိပ်နိုင်အောင် Flag ကိုနှိပ်ပါ။

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

## တန်းစီ {#queue}

### `queue.capacity` {#param-queue-capacity}

အတန်းမှာ စောင့်နေတဲ့ ငွေပေးချေမှုအရေအတွက်ရဲ့ အထက်ပိုင်းကန့်သတ်ချက်။

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

သုံးစွဲသူတစ်ဦးအတွက် အတန်းမှာ စောင့်နေတဲ့ ငွေပေးချေမှု ကိန်းဂဏန်းရဲ့ အထက်ဆုံး ကန့်သတ်ချက်

ဒီ option ကိုသုံးပြီး throttling လုပ်ပါ။

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ဒီအချိန်အပြီးမှာ စာတန်းထဲမှာ ရှိနေဆဲဆိုရင် ငွေပေးချေမှုကို ပယ်ဖျက်သွားမှာပါ။

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi soft-fork ကိုင်တွယ်ခြင်းလမ်းကြောင်းများအတွက် Debug-only switch ကိုလုပ်ပါ။ ထိန်းချုပ်ထားသောစမ်းသပ်ချက်များအပြင်ဘက်တွင်ဤကိုပိတ်ထားပါ; ပြင်းထန်နေသည့်ထုတ်လုပ်ရေးကွန်ရက်တစ်ခုတွင်ပြောင်းသည်ဆိုသည်မှာညီညွတ်မှုပြုမူမှုအပေါ်တူညီမှုမရှိစေနိုင်သည်။

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic Private Settlement {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` သည် သီးခြား `AtomicPrivateSettlementV1` လမ်းကြောင်းကို အုပ်ချုပ်သည်။ ၎င်းသည် အလိုအလျောက် ပိတ်ထားသည်။ `enabled = true` ကိုသတ်မှတ်ခြင်းသည်လည်း `activation_height` ကိုလိုအပ်သည်။ လက်ခံမှုသည် ဆက်လက်မပိတ်နိုင်ပါက လိုင်းပေါ်ရှိစွမ်းဆောင်ရည်၊ ကြေညာချက်ကာလ၊ တည်ငြိမ်သော သက်သေပြရေးဂုဏ်သတ္တိနှင့် စုစုပေါင်း / စစ်ဆေးမှုအုပ်ချုပ်ရေးက တက်ကြွမှတစ်ဆင့်ဖြစ်သည်။

အဓိက ကန့်သတ်ချက်တွေက `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, နှင့် `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` ပြင်းထန်စွာ တိုးတက်လာနေသော V1 အဝတ်လျှော်သင်တန်းတွေပေါ့။ `permitted_policy_versions` လက်ခံတာပဲ V1.

`max_capsule_bytes` Canonical ကို တိုင်းတာ Norito complete ၏ byte များ `PrivateSettlementAuditCapsuleV1`, ပါဝင်သည် AAD, nonce, encrypted text, vector framing နဲ့ အော်ဒီတာတိုင်း ဖုံးအုပ်ထားတယ်။DEK စာလုံးစာသားကိုသာ ကန့်သတ်ထားခြင်းမဟုတ်ပါ။ ဖွင့်ထားတဲ့ padding class တစ်ခုစီသည် conservative whole capsule envelope ကို fit လုပ်ရန်လိုအပ်သည်။ အနည်းဆုံး `default_min_auditor_approvals` ဒီထောက်ခံမှု သတ်မှတ်ချက်ကလည်း ထိန်းချုပ်ထားတဲ့ အဆောက်အအုံတစ်ခုပါ။ Torii အသစ်လက်မှတ်ပြုထားတဲ့ မူဝါဒကို ပယ်ချလိုက်ပါတယ်။ `min_approvals` တန်ဖိုးရှိပြီး Canonical byte အကန့်အသတ်ကို ကျော်တဲ့ သက်ဆိုင်ရာ capsule တစ်ခုလုံးကို ပယ်ချတယ်။

ဤ settings များတွင် production environment-variable activation bypass မရှိပါ။ အပြည့်အဝ configuration နမူနာနှင့် လုပ်ဆောင်မှုလိုအပ်ချက်များအတွက် ](/my/get-started/atomic-private-settlement) Run Atomic Private Cross-Dataspace Settlement[ ကိုကြည့်ပါ။ မှတ်တမ်းတင်ထားသော ပြင်ပ release gate များမကျော်မီ Path သည် production-qualified မဖြစ်ပေ။

## ဓာတ်ပုံရိုက်ကူးခြင်း {#snapshot}

ဒီမော်ဂျူးက [World State View](/my/blockchain/world#world-state-view-wsv) ရဲ့ snapshots တွေကို ဖတ်ပြီး ရေးဖို့ တာဝန်ယူပါတယ်။

Kura မှ block တစ်ခုစီကို playback မလုပ်ဘဲ peer က restart လုပ်နိုင်ရန် World State View ၏ serialized checkpoint ကို သိမ်းဆည်းထားသည်။ Kura သည် ရေရှည်တည်တံ့သော block သမိုင်းနှင့် replay အတွက် အမှန်တရား၏ အရင်းအမြစ်ဖြစ်နေဆဲဖြစ်သည်။ snapshots သည်အရှိန်မြှင့်လမ်းကြောင်းတစ်ခုဖြစ်သည်။ startup မှာ Iroha က snapshot metadata တွေကို configured chain နဲ့ stored blocks တွေနဲ့ စစ်ဆေးပြီး snapshot ကို load လုပ်မလား ဒါမှမဟုတ် ပြန်လည် play လုပ်မလား ဆုံးဖြတ်ပါတယ်။

::: tip Snapshots များကို ဖျက်ပစ်ပါ

snapshots စနစ်မှာ တစ်ခုခု မှားယွင်းနေပြီဆိုရင်၊ သင်ဟာ ပလပ်စတစ် စာမျက်နှာတစ်ခုကနေ စတင်ချင်တယ်ဆိုပါစို့ ( snapshots တွေအရ) [`snapshot.store_dir`](#param-snapshot-store-dir) က သတ်မှတ်ထားတဲ့ directory ကို ဖျက်ပစ်နိုင်ပါတယ်။

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot စနစ် လုပ်ဆောင်မှုပုံစံ။

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `read_write`: Iroha သည် [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) တွင် သတ်မှတ်ထားသောကာလနှင့်အတူ snapshots များကိုဖန်တီးသည်။ စတင်ချိန်တွင်, Iroha သည်တည်ရှိသည့် snapshot ကိုဖတ်ရှုသည် (ဖြစ်ပါက) နှင့်စစ်ဆေးသည် blocks သိုလှောင်မှုနှင့်အတူ update ကို.
- `readonly`: `read_write` နဲ့ ဆင်တူပေမဲ့ Iroha က snapshots တွေကို မဖန်တီးဘူး။
- `disabled`: Iroha သည်စတင်ချိန်တွင် snapshots အသစ်များကို မဖန်တီး၊ မရှိသေးသော snapshot ကိုလည်း မဖတ်ပါ။

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

snapshots များရဲ့ ကြိမ်နှုန်း။

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

snapshots တွေကို ဘယ်မှာ သိမ်းထားရမလဲဆိုတဲ့ directory ပါ။

[`kura.store_dir`](#param-kura-store-dir) ကိုလည်း ကြည့်ပါ။

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

## တယ်လီမီထရီ {#telemetry}

`telemetry.name` နှင့် `telemetry.url` နှစ်ခုစလုံးကို ကောက်ခံသူထံ တိုင်ကြားသင့်သည့် အချိန်တွင် ညွှန်ပြပါ။ တယ်လီမီထရီ မသုံးပါက အပိုင်းကို ရှောင်ရှားပါ။

`name` နှင့် `url` တို့ကို စုံတွဲထည့်ပေးရမည်။

`telemetry` အပိုင်းအားလုံးဟာ ရွေးချယ်စရာပါ။

### `telemetry.name` {#param-telemetry-name}

ကနဦးရဲ့ နာမည်ကို တယ်လီမီတာမှာ ပြသဖို့ပါ။

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL ကီလိုမီထရီစုဆောင်းစက်။

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

ပြန်လည်ဆက်သွယ်ရေး မတိုင်မီ စောင့်ဆိုင်းရမည့် အနည်းဆုံး အချိန်ကာလ။

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

ပြန်လည်ဆက်သွယ်မှုအကြား နှောင့်နှေးမှုကို မြှင့်တင်ဖို့ အသုံးပြုတဲ့ အမြင့်ဆုံး exponent 2 ပါ။

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

dev-telemetry ကိုရေးဖို့ filepath ကို

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
