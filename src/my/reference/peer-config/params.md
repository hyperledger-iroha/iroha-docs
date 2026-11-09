---
translation_locale: my
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# ပြင်ဆင်သတ်မှတ်မှုပါရာမီတာများ {#configuration-parameters}

[toc]

## အမြစ်အဆင့် {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ချိတ်ဆက်မှုတိုင်းမှာ ပါဝင်ဖို့လိုတဲ့ Chain ID ကို ပြန်လည်ဖြန့်ဝေခြင်း တိုက်ခိုက်မှုတွေကို တားဆီးဖို့ သုံးတယ်။

`chain` သည် လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုအကျိုးစီးပွား၏ အစိတ်အပိုင်းဖြစ်သည်မို့၊ ချိတ်ဆက်မှုတစ်ခုအတွက် လက်မှတ်ရေးဆွဲထားသည့် ငွေလဲလှယ်မှုကို အခြားချိတ်ဆက် ID ကိုသုံးသော ကွန်ရက်တူညီသူများက ပယ်ချသည်။

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

peer ၏ အများသုံးကီးဖြစ်သည်။ သဘောတူညီမှု validator peer များသည် BLS-Normal ကီးများကို အသုံးပြုရမည်။

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

peer ၏ ကိုယ်ပိုင်ကီးဖြစ်သည်။ `public_key` နှင့် ကိုက်ညီရမည်။ သဘောတူညီမှု validator peer များသည် BLS-Normal ကီးများကို အသုံးပြုရမည်။

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

ကြိုတင်သတ်မှတ်ထားသော ယုံကြည်ရသည့် peer စာရင်းဖြစ်သည်။

သဘောတူညီမှု validator များသည် BLS-Normal သုံး peer ကီးများကို အသုံးပြုရမည်။ validator တစ်ခုချင်းစီအတွက် ကိုက်ညီသော [`trusted_peers_pop`](#param-trusted-peers-pop) မှတ်တမ်းကိုလည်း ပေးပါ။

<param-table env="TRUSTED_PEERS">
<template #type>

peer စာသားတန်းများ၏ အစုဖြစ်သည်။ P2P လိပ်စာကို သိလျှင် `PUBLIC_KEY@ADDRESS` ကို အသုံးပြုပါ။ `PUBLIC_KEY` တစ်ခုတည်းကိုလည်း လက်ခံပြီး ဖြန့်ဝေဆက်သွယ်မှုမှ peer လိပ်စာကို ရှာဖွေခွင့်ပြုသည်။

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

validator ဖြစ်သော ယုံကြည်ရသည့် peer များအတွက် BLS ကီးပိုင်ဆိုင်ကြောင်းအထောက်အထား မှတ်တမ်းများဖြစ်သည်။

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

## blockchain ပေါ်ထွန်းမှု {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` မှထုတ်လုပ်သော လက်မှတ်ရေးထိုးထားသော blockchain genesis ဘလော့က အသုံးဝင်မှုလမ်းကြောင်း။ ထုတ်လုပ်သောပရိုဖိုင်များတွင် အများအားဖြင့် Norito `.nrt` ဖိုင်တစ်ခုအဖြစ် ရေးသားသည်။

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

genesis ကီးတွဲ၏ အများသုံးကီးဖြစ်သည်။

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

peer အချင်းချင်း ဆက်သွယ်ရေးလိပ်စာ (အခြား peer များ မြင်ရသော ပြင်ပလိပ်စာ) ဖြစ်သည်။

ဆက်သွယ်ထားတဲ့ ကွန်ရက် လုပ်ဖော်ကိုင်ဖက်တွေကို ကောလာဟလတွေပြောပေးမှာပါ၊ ဒီတော့ အခြားကွန်ရက်လုပ်ဖော်ကိုင်ဖက်တွေအတွက်လည်း သူတို့ ကောလာဟာလတွေ ပြောနိုင်မှာပါ။

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

နောက်ဆုံး block အတွက် network peers ကို request တွေကြားမှာရှိတဲ့ အချိန်အကွာအဝေးပါ။

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

ကွန်ရက် အဖော်များအကြား ငွေပေးချေမှုများကို စောင့်ဆိုင်းနေသော ခေတ်ကာလ။

မကြာခဏ ဝေဖန်ခြင်းဟာ sync လုပ်ဖို့ အချိန်ကို တိုစေပေမဲ့ ကွန်ရက်ကို လွှမ်းမိုးနိုင်တယ်။

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Network peer နဲ့ ချိတ်ဆက်မှု ရပ်တန့်သွားတဲ့ အချိန်ကာလ၊ network peer က အလုပ်မလုပ်ဘူးဆိုရင်။

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

[Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md) က လက်ခံထားတဲ့ raw request body ထဲက byte အမြင့်ဆုံးအရေအတွက်။

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

General logging verbosity (ကြည့်ပါ) [`logger.filter`](#param-logger-filter) ပြီးပြည့်စုံတဲ့ ဖွဲ့စည်းမှုအတွက်)

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `TRACE`: အနိမ့်အဆင့် လုပ်ငန်းများအပါအဝင် ဖြစ်ရပ်အားလုံး။
- `DEBUG`: Debug-level သတင်းအချက်အလက်တွေ၊ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပါတယ်။
- `INFO`: ယေဘုယျ သတင်းအချက်အလက်သတင်းများ။
- `WARN`: ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာတွေကို ထောက်ပြတဲ့ သတိပေးချက်များ။
- `ERROR`: ပုံမှန်လုပ်ဆောင်မှုကို နှောင့်ယှက်ပေမဲ့ ဆက်လက်လုပ်ဆောင်ခွင့်ပြုတဲ့အမှားများ။

အသုံးပြုမှုကိစ္စအတွက် အကောင်းဆုံး အဆင့်ကို ရွေးချယ်ပါ။ မတူညီတဲ့ မှတ်တမ်းအဆင့်တွေကို ဘယ်လို သုံးရမလဲဆိုတဲ့ အပိုအချက်အလက်များအတွက် [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ကို ကြည့်ရှုပါ။

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

::: tip ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်ကို update လုပ်ခြင်း

ဤသတ်မှတ်ချက်ကို Torii အော်ပရေတာ ချိတ်ဆက်လိပ်စာများမှတစ်ဆင့် လည်ပတ်နေစဉ် ပြင်ဆင်နိုင်သည်။

:::

### `logger.filter` {#param-logger-filter}

ပိုမိုကောင်းမွန်သော log filter များအပြင် [`logger.level`](#param-logger-level). ရည်မှန်းချက်တစ်ခုစီအတွက် logging verbosity ကို customization လုပ်ခွင့်ပေးတယ်။

<param-table type=string env=LOG_FILTER>
<template #type>

ကော်မာဖြင့်ခြားထားသော ညွှန်ကြားချက်တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို ပါဝင်သည့် စာသားတန်းဖြစ်သည်။ ညွှန်ကြားချက်တစ်ခုချင်းစီတွင် ကိုက်ညီသော span နှင့် ဖြစ်ရပ်များကို ဖွင့်ပေးသော (ဥပမာ _ရွေးချယ်ပေးသော_) အများဆုံးအသေးစိတ်ဖော်ပြမှု _အဆင့်_ ရှိနိုင်သည်။ Iroha သည် `trace` သို့မဟုတ် `info` ကဲ့သို့ ပိုမိုပါဝင်စေသောအဆင့်များကို `error` သို့မဟုတ် `warn` ကဲ့သို့ ပိုမိုကန့်သတ်သောအဆင့်များထက် အသေးစိတ်ပိုများသည်ဟု သတ်မှတ်သည်။

အဆင့်မြင့်အဆင့်မှာ ညွှန်ကြားချက်တွေရဲ့ သဒ္ဒါဟာ အစိတ်အပိုင်းများစွာနဲ့ ဖွဲ့စည်းထားပါတယ်။

```
target[span{field=value}]=level
```

အသေးစိတ်သိရှိလိုပါက [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info ပေါင်းစပ်မှု [`logger.level`](#param-logger-level)

`logger.filter` ပူးပေါင်းဆောင်ရွက်ခြင်း [`logger.level`](#param-logger-level) တစ်ခုမှ အခြားတစ်ခုကို မ overwrites ။

ဥပမာ၊ `logger.level` သတ်မှတ်ထားသည် `INFO` နှင့် `logger.filter` သတ်မှတ်ထားသည် `iroha_core=debug`, ရလာတဲ့ filter set ကတော့ `info,iroha_core=debug` (အဲဒါက `info` မော်ဂျူးအားလုံးအတွက်၊ `debug` အတွက် `iroha_core`).

:::

::: tip ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်ကို update လုပ်ခြင်း

ဤသတ်မှတ်ချက်ကို Torii အော်ပရေတာ ချိတ်ဆက်လိပ်စာများမှတစ်ဆင့် လည်ပတ်နေစဉ် ပြင်ဆင်နိုင်သည်။

:::

### `logger.format` {#param-logger-format}

မှတ်ပုံတင်ပုံစံ။

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `full`: ပုံမှန်ပုံစံချကိရိယာဖြစ်သည်။ ဖြစ်ပေါ်သောဖြစ်ရပ်တိုင်းအတွက် လူဖတ်နိုင်သော တစ်ကြောင်းတည်းမှတ်တမ်းကို ထုတ်ပေးပြီး ပုံစံချထားသောဖြစ်ရပ်မတိုင်မီ လက်ရှိ span နောက်ခံကို ပြသသည်။
- `compact`: စာကြောင်းတိုများအတွက် အကောင်းဆုံးပြင်ဆင်ထားသော ပုံမှန်ပုံစံချကိရိယာ၏ မူကွဲဖြစ်သည်။ လက်ရှိ span နောက်ခံမှ အကွက်များကို ပုံစံချထားသောဖြစ်ရပ်အကွက်များနောက်တွင် ဆက်ထည့်ပြီး span အမည်များကို မပြပါ။ အသေးစိတ်ဖော်ပြမှုအဆင့်ကို စာလုံးတစ်လုံးအဖြစ် ချုံ့ထားသည်။
- `pretty`: အလွန်အမင်း လှပပြီး လိုင်းများစွာပါတဲ့ မှတ်တမ်းတွေကို ထုတ်လွှင့်ပေးတယ်၊ လူသားတွေ ဖတ်နိုင်ဖို့ အကောင်းဆုံးပါ။ ဒါက အဓိကအားဖြင့် ဒေသဖွံ့ဖြိုးရေးမှာ အသုံးပြုဖို့ ရည်ရွယ်ထားတာပါ။ Debugging (သို့) command-line application များအတွက်တော့ အလိုအလျောက်လေ့လာခြင်းနှင့် log တွေကို compact store လုပ်ခြင်းသည် ဖတ်နိုင်မှုနှင့် visual appeal ထက် ပို၍ ဦးစားမပေးပါ။
- `json`: စာကြောင်းအသစ်ဖြင့် ခွဲထားသော JSON မှတ်တမ်းများကို ထုတ်ပေးသည်။ ဖွဲ့စည်းပုံရှိသောမှတ်တမ်းများကို ခွဲခြမ်းစိတ်ဖြာနှင့် ကြည့်ရှုကိရိယာများက JSON အဖြစ် ဖတ်သောစနစ်များတွင် တကယ့်လုပ်ငန်းသုံးအတွက် ရည်ရွယ်သည်။ JSON အထွက်ကို လူဖတ်ရလွယ်ကူရန် အကောင်းဆုံးပြင်ဆင်ထားခြင်း မဟုတ်ပါ။

အသေးစိတ်အချက်အလက်များနှင့် နမူနာထုတ်ကုန်များကို ကြည့်ပါ။ [`tracing-subscriber` စာရွက်စာတမ်း](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura အစပျိုးမှု mode။ `strict` သည် ပုံမှန်နှင့်အဓိက mode ဖြစ်သည်: ၎င်းသည် node ကို တက်ကြွမလာမီ Single Protocol-Standard သမိုင်း၊ ပြန်လည်ထူထောင်ရေးလက်ရာများ၊ အထောက်အကူအညွှန်းကိန်းများနှင့် သိုလှောင်စာရင်းကို validates။

`fast` အရေးပေါ်အခြေအနေမှာ အန္တရာယ်ရှိနေတဲ့ ဝန်ဆောင်မှုစနစ်ကို အသုံးပြုပြီး လုပ်ငန်းခွင်ရဲ့ မြင်နိုင်မှုကို ပြန်လည်ထူထောင်ပေးပါတယ်။ အစပျိုးရေးစစ်ဆေးမှုတစ်ခုလုံးဟာ ချို့ယွင်းမှုအန္တရာယ်ရှိလိမ့်မယ်။ `strict` နောက်ပြီး လက်ရှိ point-in-time ဒေတာအမြင်မျိုးဆက်တစ်ခုမှာ အနုပညာပစ္စည်း ငါးခုကို အတိအကျပါဝင်ပါတယ်။ `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, နှင့် `snapshot.merkle.json`. Domain ကွဲပြားတဲ့ operator လက်မှတ်က ကြော်ငြာထားတဲ့ payload cryptographic digest value နဲ့ bounded technical manifest ကို ချိတ်ဆက်ပေးပါတယ်။ Technical manifest မှာ အသုံးဝင် ဝန်ဆောင်မှု အလျား၊ ကွင်းဆက်/ကွန်ရက် အထောက်အထား၊ terminal height/hash တွေကို ချိတ်ဆက်ပေးပါတယ်။ SCCP မူဝါဒကို cryptographic hash နဲ့ bootstrap lineage တည်ရှိမှု။ မြန်မြန်ငြင်းပယ် bootstrap lineage နှင့်အတူတူသောတိကျသည့် marker / count / tip နယ်နိမိတ်ကိုလိုအပ်သည် Kura. ပထမဦးဆုံးထုတ်ပြန်တဲ့ node တွေက ဒီလက်ရာငါးခုကို အတိအကျ လက်ခံပြီး အခြားလက်ရာစာရင်း (သို့) ဖိုင်နာမ်အစီအစဉ်အားလုံးကို ပယ်ချပါတယ်။

Fast သည် ထိုဖိုင်အမည်ငါးခုကို စာရင်းပြုစုပြီး payload နှင့် Merkle ဖိုင်များကို metadata ဖြင့် ချိတ်ဆက်သော်လည်း ၎င်းတို့၏အကြောင်းအရာကို ဖတ်ခြင်း၊ ဟက်ရှ်တွက်ခြင်း၊ ခွဲခြမ်းခြင်း သို့မဟုတ် ကုဒ်ဖြည်ခြင်း မပြုပါ။ လက်မှတ်ထိုး manifest မှ အနည်းဆုံးလိုအပ်သော ကမ္ဘာ့အခြေအနေနှင့် SORA Nexus အခြေအနေကို တည်ဆောက်ပြီး တိကျသော Kura ဟက်ရှ်ရှေ့ပိုင်းကို ဖတ်ရှုရန်သာ မှတ်ဉာဏ်သို့ ချိတ်သည်။ snapshot ထဲရှိ ကမ္ဘာ့အခြေအနေ၊ ဘလော့ခ်ဟက်ရှ်အစု၊ transaction သမိုင်း၊ ဆင်းသက်အညွှန်းများနှင့် တည်မြဲသောပြန်လည်ထူထောင်ရေးမှတ်တမ်းများကို မဖွင့်ပါ။ Merkle၊ စံသတ်မှတ်မှုနှင့် အဓိပ္ပာယ်ဆိုင်ရာ snapshot စစ်ဆေးမှုများ၊ သမိုင်းဘလော့ခ်နှင့် အပြီးသတ်အတည်ဖြစ်မှုနှင့် SCCP ညှိနှိုင်းမှု၊ Sumeragi လက်ရှိအမြင့် ပြန်လည်ရယူမှု၊ ပေါင်းစည်းရေးနှင့် query မှတ်တမ်းများ၊ lane manifest နှင့် စည်းကမ်းလိုက်နာမှုရင်းမြစ်များ၊ Kura အခြေပြု SoraFS archive များ၊ ပြန်ခေါ်ဆင့်ပွားသိုလှောင်မှုတွက်ချက်ခြင်းနှင့် ရွေးချယ်နိုင်သောဝန်ဆောင်မှုညှိနှိုင်းသူများကို ဆိုင်းငံ့ထားသည်။ စက်တွင်း transaction လက်ခံမှု၊ အဆိုပြုမှု၊ မဲပေးမှု၊ စံသတ်မှတ်ရေးသားမှုနှင့် အကူထုတ်လုပ်သူများကို ဆက်ပိတ်ထားသည်။ Kura ကိုယ်တိုင်က ရေးသားသူစတင်မှုနှင့် တည်မြဲသောပြောင်းလဲမှုများကို ငြင်းပယ်သည်။ လုပ်ငန်းစဉ်အဆင့်ဆင့်နှင့် FASTPQ သိမ်းဆည်းရေးစောင့်ဆိုင်းတန်းများက အလုပ်ကို သိမ်းထားခြင်း သို့မဟုတ် ကုဒ်သွင်းခြင်းအစား ချက်ချင်းငြင်းပယ်သည်။ Kura ဖတ်ရှု APIs များသည် ပြုပြင်မှုနှင့် တည်မြဲရေးညှိနှိုင်းမှုကိုလည်း ပိတ်ထားသည်။ ယာယီအကူဖိုင်များကို အတည်မပြု၊ ပျောက်နေသော lane ဖိုင်များကို မထုတ်ဝေ၊ တိုးတက်မှုအတားများကို fsync မလုပ်ပါ။ Sumeragi နှင့် transaction ဖြန့်ဝေဆက်သွယ်မှုကို မစတင်ပါ။ Torii သည် ကျန်းမာရေး၊ အသက်ဝင်မှု၊ အဆင်သင့်ဖြစ်မှု၊ peer နှင့် ပြင်ဆင်သတ်မှတ်မှုလုပ်ဆောင်ချက်များကိုသာ ဖွင့်ပေးသည်။ API ဗားရှင်း၊ အခြေအနေ၊ တိုင်းတာချက်များနှင့် ပုံမှန်အခြေအနေ၊ သမိုင်းလမ်းကြောင်းအားလုံး မရနိုင်ပါ။ Strict ဖြင့် ပြန်မစမချင်း အဆင်သင့်ဖြစ်မှု မရနိုင်ပါ။

`fast` ကို ဖြစ်ရပ်တစ်ခုအတွက်သာ အသုံးပြုပါ။ ဝန်ဆောင်မှု တည်ငြိမ်ပြီးနောက် node ကို ရပ်ဆိုင်းပြီး `strict` ကိုပြန်လည် restart လုပ်ပါ production ပြန်မစခင် အချိန်ဆွဲထားတဲ့ စစ်ဆေးခြင်းနှင့် index ပြန်လည်တည်ဆောက်မှုတိုင်းကို ပြန်လည်စတင်ရန်။ Fast mode က Deferred merge log ကို မလိုဘဲ Single Protocol Standard storage ကို ဖန်တီး၊ ပြင်ဆင်၊ ဖြတ်တောက်၊ တင်သွင်းခြင်း မရှိပါ။ မထုတ်ဝေသေးတဲ့ suffixes တွေနဲ့ စောင့်ဆိုင်းနေဆဲ အထောက်အကူ ပြန်လည်ထူထောင်ရေးအဆင့်တွေကို ဖတ်ရှုခြင်း (သို့) အပြောင်းအလဲမပြုပဲ လျစ်လျူရှုပြီး Strict Recovery အတွက် ထားတယ်။ တင်သွင်းထားသော hash-only point-in-time data view lineage ကိုမရရှိနိုင်ပါ။ ပျောက်နေသည့် (သို့) မတည်ငြိမ်သော လက်ရှိ point-in - time data view သည် ချက်ချင်းကျရှုံးသည်; Fast သည်အလွတ်ကမ္ဘာသို့မဟုတ်သမိုင်းပြန်လည်ဖန်တီးခြင်းသို့ ဘယ်တော့မှ ပြန်မကျတော့ပါ။

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

blocks တွေကို သိမ်းထားတဲ့ directory [^paths] ကို သတ်မှတ်ပေးတယ်။

နောက်တစ်ချက်ကြည့်ပါ- [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Sumeragi soft-fork ကိုင်တွယ်လမ်းကြောင်းများကို စမ်းသပ်ရန် debug သီးသန့်ခလုတ်ဖြစ်သည်။ ထိန်းချုပ်ထားသောစမ်းသပ်မှုများအပြင်၌ ၎င်းကို ပိတ်ထားပါ။ လည်ပတ်နေသောတကယ့်လုပ်ငန်းသုံးကွန်ရက်တွင် ပြောင်းလဲခြင်းက peer များအကြား သဘောတူညီမှုအပြုအမူ ကွဲပြားစေနိုင်သည်။

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေကြေးငွေပေးချေမှု Settlement {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` သည် သီးခြား `AtomicPrivateSettlementV1` လမ်းကြောင်းကို အုပ်ချုပ်သည်။ ၎င်းသည် အလိုအလျောက် ပိတ်ထားသည်။ `enabled = true` ကိုသတ်မှတ်ခြင်းသည်လည်း `activation_height` ကိုလိုအပ်သည်။ လက်ခံမှုသည် ဆက်လက်မပိတ်နိုင်ပါက လိုင်းပေါ်ရှိစွမ်းဆောင်ရည်၊ ကြေညာချက်ကာလ၊ တည်ငြိမ်သော သက်သေပြရေးဂုဏ်သတ္တိနှင့် စုစုပေါင်း / စစ်ဆေးမှုအုပ်ချုပ်ရေးက တက်ကြွမှတစ်ဆင့်ဖြစ်သည်။

အဓိက ကန့်သတ်ချက်တွေက `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, နှင့် `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` ပြင်းထန်စွာ တိုးတက်လာနေသော V1 အဝတ်လျှော်သင်တန်းတွေပေါ့။ `permitted_policy_versions` လက်ခံတာပဲ V1.

`max_capsule_bytes` သည် `PrivateSettlementAuditCapsuleV1` အပြည့်အစုံ၏ တစ်ကိုယ်ရေပရိုတိုကုတ်စံညွှန်း Norito ဘိုင်တာများကို တိုင်းထွာသည်၊ AAD အပါအဝင်, cryptographic nonce တန်ဖိုး, encryption စာသား, vector framing နှင့်DEK ကိုဖုံးအုပ်ထားသော auditor တစ်ခုချင်းစီ; ၎င်းသည် encryption text အတွက်သာ ကန့်သတ်ချက်မဟုတ်ပါ။ ခွင့်ပြုထားသော padding class တစ်ခုစီသည် အနည်းဆုံး `default_min_auditor_approvals` စာရင်းကိုင်များအတွက် ထိန်းသိမ်းထားသည့် တစ်လုံးလုံး capsule data container ကို တပ်ဆင်ရမည်ဖြစ်သည်။ အဆိုပါ ထောက်ခံမှု setting သည်လည်း အုပ်ချုပ်ထားသော flooring ဖြစ်ပါသည်။ Torii က `min_approvals` တန်ဖိုးနိမ့်တဲ့ အသစ်လက်ခံထားတဲ့ မူဝါဒကို ပယ်ချပြီး Single Protocol-standard byte limit ကိုကျော်တဲ့ တကယ့် capsule ကို ပယ်ချတယ်။

ဤသတ်မှတ်ချက်များတွင် တကယ့်လုပ်ငန်းသုံးအတွက် ပတ်ဝန်းကျင်တန်ဖိုးဖြင့် ဖွင့်ပေးသည့် ရှောင်လွှဲလမ်း မရှိပါ။ ပြည့်စုံသောပြင်ဆင်သတ်မှတ်မှုနမူနာနှင့် လုပ်ငန်းဆောင်ရွက်မှုလိုအပ်ချက်များအတွက် [ပုဂ္ဂလိက data space များအကြား အားလုံးအောင်မြင်မှသာ အတည်ပြုသော ငွေစာရင်းရှင်းလင်းမှုကို လုပ်ဆောင်ခြင်း](/my/get-started/atomic-private-settlement) ကို ကြည့်ပါ။ မှတ်တမ်းတင်ထားသော ပြင်ပထုတ်ဝေမှုစစ်ဆေးချက်များ မအောင်မြင်မချင်း ဤလမ်းကြောင်းကို တကယ့်လုပ်ငန်းသုံးအဖြစ် အရည်အချင်းပြည့်မီသည်ဟု မသတ်မှတ်နိုင်ပါ။

## point-in-time ဒေတာအမြင် {#snapshot}

ဒီ module က [ကမ္ဘာ့အမြင်](/my/blockchain/world#world-state-view-wsv) ရဲ့ point-in-time data views တွေကို ဖတ်ပြီး ရေးဖို့ တာဝန်ရှိပါတယ်။

point-in-time data views က World State View ရဲ့ serialized checkpoint ကို သိုလှောင်ထားပြီး network peer က Kura မှ block တစ်ခုချင်းစီကို playback မလုပ်ဘဲ restart လုပ်နိုင်ပါတယ်။ Kura ဟာ durable block history နဲ့ replay အတွက် အမှန်တရားရဲ့ အရင်းအမြစ် ဖြစ်နေဆဲပါ။ point-in time data views တွေဟာ အရှိန်မြှင့်တဲ့ လမ်းကြောင်းတစ်ခု ဖြစ်ပါတယ်။ Start မှာ Iroha သည် point-in-time data view metadata ကို configured chain နှင့် stored blocks များနှင့် နှိုင်းယှဉ်ပြီး point-in time data view ကို load လုပ်မလား (သို့မဟုတ်) playback လုပ်မလား ဆုံးဖြတ်မပေးခင် စစ်ဆေးတယ်။

::: tip Point-in-time data view တွေကို ဖျက်ပစ်ပါ။

Point-in-time data viewing system မှာ တစ်ခုခု မှားနေရင် (point-in-time data view တွေအရ) အလွတ်စာမျက်နှာတစ်ခုကနေ စချင်ရင် [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Point-in-time data view system ရဲ့ လုပ်ဆောင်ချက်ပုံစံ။

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ကြိုး၊ ဖြစ်နိုင်ခြေတန်ဖိုးများ:

- `read_write`: Iroha သည် [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) တွင် သတ်မှတ်ထားသောအချိန်ကာလအလိုက် snapshot များကို ဖန်တီးသည်။ စတင်ချိန်၌ Iroha သည် ရှိပြီးသား snapshot ရှိလျှင် ဖတ်ယူပြီး ဘလော့ခ်သိုလှောင်မှုနှင့် နောက်ဆုံးအခြေအနေကိုက်ညီကြောင်း စစ်ဆေးသည်။
- `readonly`: `read_write` နဲ့ ဆင်တူပေမဲ့ Iroha က snapshots တွေကို မဖန်တီးဘူး။
- `disabled`: Iroha သည် point-in-time ဒေတာအမြင်အသစ်များကိုမဖန်တီးသည်မဟုတ်ဘဲစတင်ချိန်တွင်ရှိဆဲတစ်ခုကိုဖတ်ခြင်းမရှိပါ။

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

နောက်တစ်ချက်ကြည့်ပါ- [`kura.store_dir`](#param-kura-store-dir)

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

`telemetry.name` နှင့် `telemetry.url` နှစ်ခုစလုံးကို ကွန်ရက် peer သည် ကောက်ခံသူအား အစီရင်ခံသင့်သည့်အချိန်တွင် ညွှန်ကြားပါ။ telemetry ကိုအသုံးပြုခြင်းမရှိပါက အပိုင်းကိုပိတ်ထားသည်။

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
