---
translation_locale: my
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
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

`chain` သည် လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှု အသုံးဝင်မှု၏ တစ်စိတ်တစ်ပိုင်းဖြစ်သည်မို့၊ ချိတ်ဆက်မှုတစ်ခုအတွက် လက်မှတ်ရေးဆွဲထားသည့် ငွေလဲလှယ်မှုကို အခြားချိတ်ဆက်မှု ID ကို အသုံးပြုသူများက ပစ်ပယ်ကြသည်။

<param-table type=string env=CHAIN />

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

အရင်ဆုံး သတ်မှတ်ထားတဲ့ ယုံကြည်ရတဲ့ အဖော်စာရင်း။

Consensus validators များသည် BLS-Normal peer keys များကို အသုံးပြုရမည်ဖြစ်သည်။ validator တစ်ခုစီအတွက်လည်း [`trusted_peers_pop`](#param-trusted-peers-pop) entry ကိုပေးသွင်းပါ။

<param-table env="TRUSTED_PEERS">
<template #type>

P2P လိပ်စာသိရှိပါက `PUBLIC_KEY@ADDRESS` ကိုအသုံးပြုပါ။ bare `PUBLIC_KEY` ကိုလည်းလက်ခံပြီး gossip မှ peer address ကိုရှာဖွေနိုင်စေသည်။

</template>
</param-table>

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

နောက်ဆုံး block အတွက် peer တွေကို တောင်းဆိုချက်ကြားက အချိန်အကွာအဝေး။

မကြာခဏ ဝေဖန်ခြင်းဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group ကို

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Gossip batch စာတိုမှာ အတိုင်းအတာ အများဆုံး ငွေပေးချေမှု။

ပိုသေးတဲ့ အရွယ်အစားက synchronize လုပ်ဖို့ အချိန်ပိုကြာစေပေမဲ့ ပါကက်အဆုံးရှုံးမှု မြင့်မားရင် အသုံးဝင်ပါတယ်။

<param-table type=number default-value=500 />

::: code-group ကို

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

အဖော်များအကြား ငွေပေးချေမှုကို စောင့်ဆိုင်းနေစဉ် ဝေဖန်ပြောဆိုခြင်း ကာလ။

မကြာခဏ ဝေဖန်ခြင်းဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group ကို

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

peer နဲ့ ဆက်နွယ်မှု ရပ်တန့်သွားတဲ့ အချိန်ကာလ၊ peer က အလုပ်မလုပ်ဘူးဆိုရင်။

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group ကို

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii ဆာဗာက နားထောင်ဖို့လိုပြီး ဖောက်သည်တွေက သူတို့တောင်းဆိုချက်တွေကို တင်ပြရမယ့်လိပ်စာ။

<param-table type=socket-addr env=API_ADDRESS />

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

ဝင်ရောက်မတွေ့ရင် စတိုးဆိုင်မှာ မေးမြန်းမှုရှိနေနိုင်တဲ့ အချိန်ပါ။

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group ကို

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

တိုက်ရိုက် မေးမြန်းမှု အရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်ပါ။

<param-table type=number default-value=128 />

::: code-group ကို

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

သုံးစွဲသူတစ်ဦးအတွက် တိုက်ရိုက် မေးမြန်းမှု အရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်ပါ။

<param-table type=number default-value=128 />

::: code-group ကို

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

::: code-group ကို

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

[`logger.level`](#param-logger-level) နှင့်အတိုးအလျှော့ log filter များကို ပြုပြင်နိုင်သည်။

<param-table type=string env=LOG_FILTER>
<template #type>

string သည် comma ကွဲပြားသော ညွှန်ကြားချက်တစ်ခု (သို့မဟုတ်) များစွာမှပါဝင်သည်။ ညွှန်ပြချက်တိုင်းသည်အလျောက်တူညီသော အမြင့်ဆုံး verbosity အဆင့်ရှိနိုင်ပြီး (ဥပမာ၊ရွေးချယ်ခြင်းများအတွက်) ကိုက်ညီသည့် span နှင့်ဖြစ်စဉ်များကိုခွင့်ပြုသည်။ Iroha ဆိုသည်မှာ ရှားပါးသော သီးခြားအဆင့်များ (ဥပမာ `trace` သို့မဟုတ် `info`) များကို ပိုပြီး သီးခြားအဆင့်များထက် ပို၍ စကားလုံးများသည်ဟု ယူဆသည် (ဥပမာ`error` သို့မဟုတ် `warn`) ။

အဆင့်မြင့်အဆင့်မှာ ညွှန်ကြားချက်တွေရဲ့ သဒ္ဒါဟာ အစိတ်အပိုင်းများစွာနဲ့ ဖွဲ့စည်းထားပါတယ်။

```
target[span{field=value}]=level
```

အသေးစိတ်အချက်အလက်များအတွက် [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ကို ကြည့်ပါ။

</template>

</param-table>

::: code-group ကို

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) နှင့် ကိုက်ညီမှု

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

- `full`: Default formatter သည်ဖြစ်စဉ်တစ်ခုစီအတွက် လူသားဖတ်ရှုနိုင်သော တစ်တန်းတည်းမှတ်တမ်းများကို ထုတ်လွှင့်ပေးသည်၊ ဖြစ်ရပ်၏ ဖေါ်မြူထားသည့် ကိုယ်စားပြုမှုမတိုင်မီတွင် လက်ရှိအကန့်အသတ် အခြေအနေကို ပြသသည်။
- `compact`: အတိုတန်းအလျားများအတွက်ကောင်းမွန်သော default formatter ၏ကွဲပြားမှုတစ်ခုဖြစ်သည်။ လက်ရှိ span အခြေအနေမှ Fields များကို formatted ဖြစ်ရပ်၏ field များနှင့်အတူဆက်စပ်ထားပြီး span နာမည်များကိုပြသခြင်းမရှိပါ။ verbosity အဆင့်သည်တစ်လုံးတည်းသောစာလုံးအဖြစ်တိုကောက်ခံသည်။
- `pretty`: အလွန်အမင်း လှပတဲ့ လိုင်းစုံမှတ်တမ်းတွေကို ထုတ်လွှင့်ပေးတယ်၊ လူသားဖတ်နိုင်မှုအတွက် အကောင်းဆုံးပါ။ ဒါက အဓိကအားဖြင့် ဒေသတွင်း ဖွံ့ဖြိုးတိုးတက်မှုနဲ့ debugging မှာ (သို့) command-line application တွေမှာ သုံးဖို့ ရည်ရွယ်တာပါ။ စာရွက်စာတမ်းတွေကို အလိုအလျောက်သုံးပြီး သိမ်းဆည်းထားတာက ဖတ်လို့ရတာနဲ့ အမြင်ပိုင်းအရ ဆွဲဆောင်မှုထက် ပိုအရေးမကြီးပါဘူး။
- `json`: newline-delimited JSON log များထုတ်လုပ်ခြင်း။ ဤသည်မှာ တည်ဆောက်ထားသော log များကို বিশ্লেষণနှင့်ကြည့်ရှုရေးကိရိယာများမှတစ်ဆင့် JSON အဖြစ်သုံးစွဲသည့်စနစ်များဖြင့် ထုတ်လုပ်မှုအသုံးပြုရန်ရည်ရွယ်သည်။ JSON ထုတ်ကုန်သည်လူသားဖတ်နိုင်စွမ်းအတွက်ကောင်းမွန်အောင်ပြုစုထားခြင်းမရှိပါ။

အသေးစိတ်အချက်အလက်များနှင့် နမူနာထုတ်ကုန်များကို [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ကိုကြည့်ပါ။

</template>
</param-table>

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura အစပျိုးမှုပုံစံ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `strict`: ဘလော့များအား တင်းကျပ်စွာ စစ်ဆေးခြင်း
- `fast`: အခြေခံစစ်ဆေးချက်များသာဖြင့် အမြန်စတင်ခြင်း

</template>
</param-table>

::: code-group ကို

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

blocks တွေကို သိုလှောင်ထားတဲ့ directory [^paths] ကို သတ်မှတ်ပါတယ်။

[`snapshot.store_dir`](#param-snapshot-store-dir) ကိုလည်း ကြည့်ပါ။

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group ကို

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

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

သုံးစွဲသူတစ်ဦးအတွက် အတန်းမှာ စောင့်နေတဲ့ ငွေပေးချေမှု ကိန်းဂဏန်းရဲ့ အထက်ဆုံး ကန့်သတ်ချက်

ဒီ option ကိုသုံးပြီး throttling လုပ်ပါ။

<param-table type=number default-value=65_536 />

::: code-group ကို

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ဒီအချိန်အပြီးမှာ စာတန်းထဲမှာ ရှိနေဆဲဆိုရင် ငွေပေးချေမှုကို ပယ်ဖျက်သွားမှာပါ။

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group ကို

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi soft-fork ကိုင်တွယ်ခြင်းလမ်းကြောင်းများကိုလေ့ကျင့်ရန် Debug-only switch ကိုပိတ်ပါ။ ထိန်းချုပ်ထားသောစမ်းသပ်ချက်များအပြင်တွင်၎င်းကိုပိတ်ထားပါ; ပြင်းထန်နေသည့်ထုတ်လုပ်ရေးကွန်ရက်တစ်ခုတွင်ပြောင်းသည်ဆိုသည်မှာညီညွတ်မှုပြုမူမှုအပေါ်တူညီမှုမရှိစေနိုင်သည်။

<param-table type=bool default-value=false />

::: code-group ကို

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## ဓာတ်ပုံရိုက်ကူးခြင်း {#snapshot}

ဒီမော်ဂျူးက [World State View](/my/blockchain/world#world-state-view-wsv) ရဲ့ snapshots တွေကို ဖတ်ပြီး ရေးဖို့ တာဝန်ယူပါတယ်။

Snapshots များသည် World State View ၏ အစဉ်လိုက် စစ်ဆေးရေးမှတ်တိုင်ကို သိမ်းဆည်းထားသည့်ကြောင့် peer သည် Kura မှ block တစ်ခုစီကို playback မလုပ်ဘဲ restart လုပ်နိုင်သည်။ Kura သည် ရေရှည်တည်တံ့သော block သမိုင်းနှင့် replay အတွက် အမှန်တရား၏ အရင်းအမြစ်ဖြစ်နေဆဲဖြစ်သည်။ snapshots သည်အရှိန်မြှင့်လမ်းကြောင်းတစ်ခုဖြစ်သည်။ startup မှာ Iroha က snapshot metadata တွေကို configured chain နဲ့ stored blocks တွေနဲ့ စစ်ဆေးပြီး snapshot ကို load လုပ်မလား ဒါမှမဟုတ် ပြန်လည် play လုပ်မလား ဆုံးဖြတ်ပါတယ်။

::: tip Snapshots များကို ဖယ်ရှားပါ

snapshots စနစ်မှာ တစ်ခုခု မှားယွင်းနေပါက ( snapshots တွေအရ) ပလပ်စတစ် စာမျက်နှာတစ်ခုကနေ စတင်ချင်ရင် [`snapshot.store_dir`](#param-snapshot-store-dir) က သတ်မှတ်ထားတဲ့ directory ကို ဖျက်ပစ်နိုင်ပါတယ်။

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot စနစ် လုပ်ဆောင်မှုပုံစံ။

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `read_write`: Iroha သည် [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) တွင် သတ်မှတ်ထားသော ကာလနှင့်အတူ snapshots များကိုဖန်တီးသည်။ စတင်ချိန်တွင်, Iroha သည်တည်ရှိသည့် snapshot ကိုဖတ်ရှုသည် (ဖြစ်ပါက) နှင့်စစ်ဆေးသည် blocks သိုလှောင်ခြင်းနှင့်အတူ update ဖြစ်သည်.
- `readonly`: `read_write` နဲ့ ဆင်တူပေမဲ့ Iroha က snapshots တွေကို မဖန်တီးဘူး။
- `disabled`: Iroha သည်စတင်ချိန်တွင် snapshots အသစ်များကို မဖန်တီးနိုင်၊ ရှိပြီးသား snapshot ကိုလည်း မဖတ်နိုင်ပါ။

</template>
</param-table>

::: code-group ကို

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

::: code-group ကို

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

snapshots တွေကို ဘယ်မှာ သိမ်းထားရမလဲဆိုတဲ့ directory ပါ။

[`kura.store_dir`](#param-kura-store-dir) ကိုလည်း ကြည့်ပါ။

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group ကို

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## တယ်လီမီထရီ {#telemetry}

`telemetry.name` နှင့် `telemetry.url` နှစ်ခုစလုံးကို ကောက်ခံသူထံ အစီရင်ခံသင့်သည့် အချိန်တွင် သတ်မှတ်ပါ။ တယ်လီမထရီကို မသုံးပါက အပိုင်းကို ချန်ထားပါ။

`name` နှင့် `url` တို့ကို စုံတွဲထည့်ပေးရမည်။

`telemetry` အပိုင်းအားလုံးဟာ ရွေးချယ်စရာပါ။

### `telemetry.name` {#param-telemetry-name}

ကနဦးရဲ့ နာမည်ကို တယ်လီမီတာမှာ ပြသဖို့ပါ။

<param-table type=string />

::: code-group ကို

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL ကီလိုမီထရီစုဆောင်းစက်။

<param-table type=string />

::: code-group ကို

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

ပြန်လည်ဆက်သွယ်ရေး မတိုင်မီ စောင့်ဆိုင်းရမည့် အနည်းဆုံး အချိန်ကာလ။

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group ကို

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

ပြန်လည်ဆက်သွယ်မှုအကြား နှောင့်နှေးမှုကို မြှင့်တင်ဖို့ အသုံးပြုတဲ့ အမြင့်ဆုံး exponent 2 ပါ။

<param-table type=number default-value=4 />

::: code-group ကို

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

dev-telemetry ကိုရေးဖို့ filepath ကို

<param-table type=file-path />

::: code-group ကို

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
