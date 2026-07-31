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

သံကြိုး ID ဒီဖလှယ်မှုတိုင်းမှာ ထည့်သွင်းဖို့လိုပါတယ်။ ပြန်လည်ဖြန့်ဝေတဲ့ တိုက်ခိုက်မှုတွေကို တားဆီးဖို့ သုံးတယ်။

Replay တိုက်ခိုက်မှုဆိုသည်မှာ တရားဝင် ငွေပေးချေမှုကို အခြား
ကွန်ရက်က ရည်ရွယ်ချက်ထက် ပိုများပါတယ်။ `chain` အစိတ်အပိုင်းဖြစ်သည်
လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှု အကျိုးဆောင် ဝန်ထုပ်၊ ချိတ်ဆက်မှုတစ်ခုအတွက် လက်မှတ်ရေးဆွဲထားသော ငွေလဲလှယ်မှုအား ပယ်ချခြင်း
အခြားကွင်းဆက်ကို သုံးတဲ့ အဖော်များ ID.

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

အများသုံး peer key ကို သုံးရပါမယ်။ consensus validator ကို peers တွေ အသုံးပြုရမှာပါ။ BLS- ပုံမှန် သော့တွေ။

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

တူညီတဲ့ ပုဂ္ဂလိက သော့ပါ။ `public_key`; သဘောတူညီချက် အတည်ပြုသူ တူညီသူများ
သုံးရမယ်။ BLS- ပုံမှန် သော့တွေ။

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

အမှီအခိုကင်းတဲ့ အဖော်စာရင်း

Consensus validators တွေက သုံးရမယ်။ BLS- ပုံမှန် peer key တွေကို validator တစ်ခုစီအတွက်လည်း
ကိုက်ညီမှု ပေးပါ [`trusted_peers_pop`](#param-trusted-peers-pop) ဝင်ရောက်မှု။

<param-table env="TRUSTED_PEERS">
<template #type>

တူညီတဲ့ ကြိုးတွေရဲ့ အတန်းအစား။ `PUBLIC_KEY@ADDRESS` ဘယ်အချိန်မှာ P2P လိပ်စာကို သိရှိထားပါ။
အဝတ်လျှော်ခြင်း `PUBLIC_KEY` လက်ခံထားရပြီး peer address ကို တွေ့ရှိခွင့်ပြုပါတယ်။
ဝေဖန်ပြောဆိုခြင်း။

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

BLS အတည်ပြုသူရဲ့ ယုံကြည်မှုရှိတဲ့ တူညီသူတွေအတွက် ပိုင်ဆိုင်မှု သက်သေပြစာရင်းတွေ။

<param-table env="TRUSTED_PEERS_POP">
<template #type>

အစိတ်အပိုင်းများအတန်း `public_key` နှင့် `pop_hex` ကွင်းများ

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

လက်မှတ်ရေးထိုးထားတဲ့ genesis block သုံးစွဲမှုလမ်းကြောင်းကို `kagami genesis sign`.
Generated Profiles တွေက ဒါကို Norito `.nrt` မှတ်တမ်းတင်ပါ။

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

Genesis key pair ရဲ့ အများသုံး သော့ပါ။

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

သဘောတူညီချက်အတွက် P2P ဆက်သွယ်ရေးအတွက်လိပ်စာ (sumeragi) နှင့် ဘလော့ကော်မတီကို synchronization (ဘလော့ကော်)_sync) ရည်ရွယ်ချက်များ။

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

Peer-to-peer address (အခြား peers တွေမြင်တဲ့အတိုင်း ပြင်ပ)

အခြား အဖော်တွေဆီ ဝေဖန်နိုင်အောင် ဆက်သွယ်ထားတဲ့ အဖော်တွေကို ဝေဖန်ပါလိမ့်မယ်။

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

Synchronization message တစ်ခုတည်းမှာ ပို့နိုင်မယ့် blocks တွေရဲ့ အရေအတွက်ပါ။

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

မကြာသေးခင်က ဘလော့အတွက် peers ကို တောင်းဆိုချက်ကြားမှာရှိတဲ့ အချိန်အ interval။

မကြာခဏ ဝေဖန်မှုဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Gossip batch သတင်းစာမှာ အများဆုံး ငွေပေးချေမှု။

ပိုသေးတဲ့ အရွယ်အစားက synchronize လုပ်ဖို့ အချိန်ပိုကြာစေပေမဲ့ ပါကက်အဆုံးရှုံးမှု မြင့်မားရင် အသုံးဝင်ပါတယ်။

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

အဖော်တွေကြားက ငွေကြေးရေး ကိစ္စရပ်ကို စောင့်ဆိုင်းနေစဉ် ဝေဖန်ပြောဆိုခြင်း ကာလပါ။

မကြာခဏ ဝေဖန်မှုဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

အဖော်နှင့်ဆက်သွယ်မှု ရပ်ဆိုင်းခြင်းနောက် အချိန်ကာလ၊ အဖော်က အလုပ်မလုပ်ပါက။

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

အမည်: Torii server က နားထောင်ရပြီး client တွေက သူတို့တောင်းဆိုချက်တွေကို လုပ်ပေးတယ်။

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

ရိုးရိုးတောင်းဆိုမှုအဖွဲ့အစည်းတစ်ခုတွင် ဘိုက်တာ အများဆုံးအရေအတွက်ကို
[Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md).

ဒီကန့်သတ်ချက်ကို ကာကွယ်ဖို့ သုံးပါတယ်။ DOS တိုက်ခိုက်မှု။

<param-table>
<template #type>

ဘိုင်တာ (အရေအတွက်)

</template>
<template #default-value>

`64_000_000` (64 သန်း byte)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

ဝင်ရောက်မတွေ့ရင် စတိုးထဲမှာ မေးမြန်းမှုတစ်ခု ဆက်ရှိနေနိုင်တဲ့ အချိန်ပါ။

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

အသုံးပြုသူတစ်ဦးအတွက် တိုက်ရိုက် မေးမြန်းမှုအရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်။

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## သစ်သားထုတ်လုပ်သူ {#logger}

### `logger.level` {#param-logger-level}

_အထွေထွေ_ logging verbosity (ကြည့်ပါ) [`logger.filter`](#param-logger-filter) ပြီးပြည့်စုံတဲ့ ဖွဲ့စည်းမှုအတွက်)

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ချေတန်ဖိုးများ:

- `TRACE`: အဆင့်နိမ့် လုပ်ဆောင်မှုတွေ အပါအဝင် ဖြစ်ရပ်အားလုံးပါ။
- `DEBUG`: Debug အဆင့် သတင်းစကားတွေ၊ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပါတယ်။
- `INFO`: ယေဘုယျ သတင်းအချက်အလက် အချက်အလက်များ။
- `WARN`: ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာတွေကို ထောက်ပြတဲ့ သတိပေးချက်တွေပါ။
- `ERROR`: ပုံမှန် လုပ်ဆောင်မှုကို ချိုးဖောက်ပေမဲ့ ဆက်လက်လုပ်ဆောင်ခွင့်ပေးတဲ့ အမှားတွေပါ။

သင့်အတွက် အကောင်းဆုံး အဆင့်ကို ရွေးချယ်ပါ။
[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) အပို
မှတ်စုအဆင့် အမျိုးမျိုးကို ဘယ်လို အသုံးပြုရမလဲဆိုတာ အသေးစိတ်ပါ။

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

ဤပမာဏသည် runtime configuration update ကို subjected to through Torii Operator အဆုံးမှတ်တွေ

:::

### `logger.filter` {#param-logger-filter}

ပိုမိုကောင်းမွန်သော log filter များအပြင် [`logger.level`](#param-logger-level). logging verbosity ကို customizing လုပ်ခွင့်ပေးသည်
တစ်နေ့ကို_ရည်မှန်းချက်_.

<param-table type=string env=LOG_FILTER>
<template #type>

String သည် အမျဉ်းစုခွဲခြားထားသော ညွှန်ကြားချက်တစ်ခု (သို့မဟုတ်) ပိုများသော ညွှန်းကြားချက်များကို ပြုလုပ်သည်။ ညွှန် ကြားချက်တိုင်းသည် သက်ဆိုင်ရာ အမြင့်ဆုံး နှုတ်မှုနှုန်းရှိနိုင်သည်။
_အဆင့်_ (ဥပမာ) _ရွေးချယ်မှု_) ကန့်သတ်ချက်များနှင့် သက်ဆိုင်သော အဖြစ်အပျက်များ။ Iroha ပိုနည်းတဲ့ သီးခြားအဆင့်တွေကို ထည့်တွက်တယ်။
`trace` ဒါမှမဟုတ် `info`) ကွဲပြားတဲ့ အဆင့်တွေထက် ပိုပြောဆိုနိုင်ဖို့ (ဥပမာ `error` ဒါမှမဟုတ် `warn`).

အဆင့်မြင့်အဆင့်မှာ ညွှန်ကြားချက်တွေရဲ့ သဒ္ဒါဟာ အစိတ်အပိုင်းများစွာပါဝင်ပါတယ်။

```
target[span{field=value}]=level
```

အသေးစိတ်အချက်အလက်များအတွက် ကြည့်ပါ
[`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info ကိုက်ညီမှု [`logger.level`](#param-logger-level)

`logger.filter` လက်ရာများ _အတူတူ_ နှင့်အတူ [`logger.level`](#param-logger-level) တစ်ခုမှ အခြားတစ်ခုကို မ overwrites ။

ဥပမာ၊ `logger.level` ကို သတ်မှတ်ထားသည် `INFO` နှင့် `logger.filter` ကို သတ်မှတ်ထားသည် `iroha_core=debug`, ရလာတဲ့ filter ကို
set ကို `info,iroha_core=debug` (အဲဒါဆိုတာက `info` မော်ဂျူးအားလုံးအတွက်၊ `debug` အတွက် `iroha_core`).

:::

::: tip Runtime ကို update လုပ်ပေးရန်

ဤပမာဏသည် runtime configuration update ကို subjected to through Torii Operator အဆုံးမှတ်တွေ

:::

### `logger.format` {#param-logger-format}

မှတ်တမ်းပုံစံ။

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ချေတန်ဖိုးများ:

- `full`: default formatter ကိုသုံးပြီး ဖြစ်စဉ်တိုင်းအတွက် လူသားဖတ်လို့ရတဲ့ တစ်တန်းတည်းမှတ်တမ်းတွေကို ထုတ်ပေးပါတယ်။
  ဖြစ်ရပ်ကို ဖေါ်မြူထားပုံတင်မလုပ်ခင် ပြသနေတဲ့ လက်ရှိအကြာင်းကာလ အခြေအနေ။
- `compact`: အတိုတန်းအလျားများအတွက်ကောင်းမွန်သော default formatter ၏ကွဲပြားမှုတစ်ခုဖြစ်သည်။ လက်ရှိ span အခြေအနေမှကွင်းများ
  ဖိုရမ်လိုက်တဲ့ ဖြစ်ရပ်ရဲ့ ကွင်းတွေကို ချိတ်ဆက်ထားပြီး span နာမည်တွေ မပြသပါဘူး။ Verbosity Level ကို
  ဇာတ်ကောင်တစ်ကောင်တည်းပါ။
- `pretty`: လူ့ဖတ်လို့ရတဲ့အတွက် အကောင်းမွန်အောင်လုပ်ထားတဲ့ လှပလွန်းတဲ့ လိုင်းစုံမှတ်တမ်းတွေကို ထုတ်ပေးပါတယ်။
  ဒေသတွင်းဖွံ့ဖြိုးမှုနှင့် debugging တွင်အသုံးပြုခြင်း၊ သို့မဟုတ် command-line application များအတွက် အလိုအလျောက်စစ်ဆေးခြင်းနှင့် Compact
  မှတ်တမ်းတွေကို သိမ်းဆည်းထားခြင်းဟာ ဖတ်နိုင်မှုနဲ့ အမြင်ပိုင်း ဆွဲဆောင်မှုထက် ဦးစားပေးမှု နည်းပါတယ်။
- `json`: Outputs newline-delimited များ JSON logs များ။ ဤသည်မှာ တည်ဆောက်ထားသော logs များရှိသည့်စနစ်များနှင့်အတူထုတ်လုပ်မှုအသုံးပြုရန်ရည်ရွယ်ထားသည်။
  စားသုံးခြင်းအားဖြင့် JSON လေ့လာရေး ကိရိယာများဖြင့် JSON ထုတ်ကုန်ဟာ လူသားရဲ့ ဖတ်နိုင်မှုအတွက် အံဝင်ခွင်ကျ မဟုတ်ဘူး။

အသေးစိတ်အချက်အလက်များနှင့် နမူနာထုတ်ကုန်များကို ကြည့်ပါ
[`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_ကိုရာ_ အဆက်မပြတ် သိုလှောင်တဲ့ မော်တာဖြစ်ပါတယ် Iroha (ဂျာပွန်ဘာသာဖြင့် _သိုလှောင်ရုံ_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

နောက်ဆုံး N ဘလော့က Memory ထဲမှာ သိမ်းထားမှာပါ။

ပိုမိုဟောင်းတဲ့ ဘလော့ကစ်တွေကို မှတ်ဉာဏ်ကနေ ပိတ်ပစ်ပြီး လိုအပ်ရင် ဒစ်ကစ်ကနေ တင်ပေးပါလိမ့်မယ်။

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

Kura အစပျိုးမှုပုံစံ

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ချေတန်ဖိုးများ:

- `strict`: ဘလော့တွေအားလုံးကို တင်းကျပ်စွာ စစ်ဆေးခြင်း
- `fast`: အခြေခံ စစ်ဆေးချက်များဖြင့် အမြန် စတင်ခြင်း

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

blocks တွေကို သိုလှောင်ထားတဲ့ directory ကို သတ်မှတ်ပါတယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။ [`snapshot.store_dir`](#param-snapshot-store-dir).

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

အတန်းမှာ စောင့်နေတဲ့ ငွေပေးချေမှုအရေအတွက်ရဲ့ အထက်ပိုင်းကန့်သတ်ချက်ပါ။

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

သုံးစွဲသူတစ်ဦးအတွက် အတန်းထဲမှာ စောင့်နေတဲ့ ငွေကြေးပူးပေါင်းမှုအရေအတွက်ရဲ့ အထက်ဆုံး ကန့်သတ်ချက်ပါ။

ဒီရွေးချယ်မှုကို နှိပ်စက်ဖို့ အသုံးပြုပါ။

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ဒီအချိန်အပြီးမှာ စာတန်းထဲမှာ ရှိနေသေးရင် ငွေပေးချေမှုကို ပယ်ဖျက်သွားမှာပါ။

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

လေ့ကျင့်ခန်းအတွက် Debug-only switch Sumeragi Soft-fork ကိုင်တွယ်ရေးလမ်းကြောင်းများ။
ထိန်းချုပ်ထားတဲ့ စမ်းသပ်မှုအပြင်မှာ မလုပ်နိုင်အောင် လုပ်ပေးပါ။ ပြေးနေတဲ့ ထုတ်လုပ်ရေးကွန်ရက်တစ်ခုမှာ ပြောင်းပေးတယ်။
အညီအမျှ သဘောတူတဲ့ ပြုမူပုံနဲ့ ပတ်သက်ပြီး အဖော်တွေ သဘောမတူအောင် လုပ်နိုင်တယ်။

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## ဓာတ်ပုံရိုက်ကူးခြင်း {#snapshot}

ဒီမော်ဂျူးက စာဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် တာဝန်ရှိပါတယ်။
[ကမ္ဘာ့အမြင်](/my/blockchain/world#world-state-view-wsv).

Snapshots တွေဟာ World State View ရဲ့ စစ်ဆေးရေးမှတ်တိုင်ကို စုစည်းထားပြီး တစ်တန်းစားတစ်ဦးက
ဘလော့ကဒ်တိုင်းကို ပြန်မဖွင့်ဘဲ ပြန်စတင်ပါ။ Kura. Kura ခိုင်မာတဲ့ ဘလော့က ဆက်ရှိနေတုန်းပါ။
သမိုင်းနဲ့ ပြန်လည်ပြသဖို့ အမှန်တရားရဲ့ အရင်းအမြစ်၊ snapshots တွေဟာ အရှိန်မြှင့်တဲ့ လမ်းကြောင်းပါ။
စတင်ချိန်မှာ Iroha ချိတ်ဆက်ထားသော ကွင်းဆက်နှင့် snapshot metadata ကို စစ်ဆေးခြင်း
snapshot ကို load လုပ်မလား၊ ပြန်ရိုက်မလား ဆုံးဖြတ်မပေးခင် stored blocks တွေပါ။

::: tip Snapshots များကို ဖယ်ရှားပါ

Snapshots စနစ်မှာ တစ်ခုခု မှားနေရင်၊ သင်ဟာ ပလပ်စတစ် စာမျက်နှာတစ်ခုကနေ စတင်ချင်တယ်ဆိုရင် (
snapshots) ဆိုပါစို့၊ [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot စနစ် အလုပ်လုပ်တဲ့ Mode ကို

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ချေတန်ဖိုးများ:

- `read_write`: Iroha အချိန်ကာလကို သတ်မှတ်ထားတဲ့ snapshots တွေကို ဖန်တီးတယ်။
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). စတင်ချိန်မှာ Iroha ရှိနေတဲ့ snapshot ကိုဖတ်တယ် (ရှိရင်)
  ပြီးတော့ ဘလော့ကဒ်တွေကို သိမ်းထားတဲ့အချိန်ကို စစ်ဆေးတယ်။
- `readonly`: အလားတူ `read_write` ဒါပေမဲ့ Iroha snapshots တွေကို မဖန်တီးဘူး။
- `disabled`: Iroha စတင်တဲ့အခါမှာ အသစ်တွေကို ဖန်တီးတာမဟုတ်၊ ရှိတာကို ဖတ်တာမဟုတ်ပါ။

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

ဓာတ်ပုံတွေကို သိုလှောင်တဲ့ စာရင်းပါ။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။ [`kura.store_dir`](#param-kura-store-dir)

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

Telemetry သည် peer diagnostics ကို ပြင်ပ telemetry ကောက်ခံစက်သို့ တင်ပို့သည်။
နှစ်ခုစလုံး `telemetry.name` နှင့် `telemetry.url` အထက်ပါအချက်အလက်များအား
ကောက်ယူသူ၊ တယ်လီမထရီ မသုံးတဲ့အခါ အပိုင်းကို ချန်ထားပါ။

`name` နှင့် `url` နှစ်ယောက်တွဲလုပ်ရမယ်။

အားလုံး `telemetry` အပိုင်းက ရွေးချယ်စရာပါ။

### `telemetry.name` {#param-telemetry-name}

ကွင်းဆက်ရဲ့ နာမည်ကို တယ်လီမီထရီမှာ ပြသဖို့ပါ။

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

နိုင်ငံခြားရေး WebSocket URL တယ်လီမီတာ ကောက်ခံစက်ရဲ့

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

ပြန်လည်ဆက်သွယ်ရန်အတွက် အနည်းဆုံး စောင့်ဆိုင်းရမည့် အချိန်ကာလ။

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

ပြန်လည်ဆက်သွယ်မှုအကြား နှောင့်နှေးမှုကို တိုးမြှင့်ဖို့ အသုံးပြုတဲ့ အမြင့်ဆုံး exponent 2 ပါ။

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
