---
translation_locale: my
translation_source: /reference/peer-config/params.md
translation_source_hash: ebc05275774a1a86c81d5c5667613ffc2d9ad115ac19e40ba804daa736ba4084
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta

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

ပြန်လည်အသုံးချတိုက်ခိုက်မှုဆိုသည်မှာ မှန်ကန်သော ထရန်ဇက်ရှင်တစ်ခုကို ရည်ရွယ်ထားသည့်ကွန်ရက်မဟုတ်သော အခြားကွန်ရက်သို့ ပို့ရန် ကြိုးပမ်းခြင်းဖြစ်သည်။ `chain` သည် လက်မှတ်ထိုးထားသော ထရန်ဇက်ရှင်သယ်ဆောင်ဒေတာ၏ အစိတ်အပိုင်းဖြစ်သောကြောင့် ဘလော့ခ်ချိန်းတစ်ခုအတွက် လက်မှတ်ထိုးထားသော ထရန်ဇက်ရှင်ကို အခြားဘလော့ခ်ချိန်း ID သုံးသည့် နိုဒ်များက ပယ်ချသည်။

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

နိုဒ်၏ အများသုံးသော့ဖြစ်သည်။ သဘောတူညီမှုတွင် ပါဝင်သော အတည်ပြုနိုဒ်များသည် BLS-Normal သော့များကို အသုံးပြုရမည်။

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` {#param-private-key}

နိုဒ်၏ လျှို့ဝှက်သော့ဖြစ်သည်။ `private_key` သို့မဟုတ် ပိုင်ရှင်သာ ဝင်ရောက်နိုင်သော သော့ဖိုင်လမ်းကြောင်းဖြစ်သည့် `private_key_file` နှစ်ခုအနက် တစ်ခုအတိအကျကို သတ်မှတ်ပါ။ သော့သည် `public_key` နှင့် ကိုက်ညီရမည်။ သဘောတူညီမှုအတွက် အတည်ပြုနိုဒ်များသည် BLS-Normal သော့များကို သုံးသည်။

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

သဘောတူညီမှုအတည်ပြုနိုဒ်များသည် BLS-Normal နိုဒ်သော့များကို အသုံးပြုရမည်။ အတည်ပြုနိုဒ်တစ်ခုချင်းစီအတွက် ကိုက်ညီသော [`trusted_peers_pop`](#param-trusted-peers-pop) မှတ်တမ်းကိုလည်း ပေးပါ။

<param-table env="TRUSTED_PEERS">
<template #type>

နိုဒ်စာသားတန်းများ၏ အစုဖြစ်သည်။ P2P လိပ်စာကို သိလျှင် `PUBLIC_KEY@ADDRESS` ကို အသုံးပြုပါ။ `PUBLIC_KEY` တစ်ခုတည်းကိုလည်း လက်ခံပြီး အချင်းချင်းသတင်းဖြန့်ဝေမှုမှ နိုဒ်လိပ်စာကို ရှာဖွေနိုင်စေသည်။

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

အတည်ပြုနိုဒ်ဖြစ်သော ယုံကြည်ရသည့်နိုဒ်များအတွက် BLS သော့ပိုင်ဆိုင်ကြောင်းအထောက်အထား မှတ်တမ်းများဖြစ်သည်။

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

အသစ်စတင်ချိန်နှင့် ပြန်စတင်ချိန်တွင် ကနဦးဘလော့ခ်၏ ယုံကြည်မှုအခြေခံရင်းမြစ် `genesis.expected_hash` သို့မဟုတ် `genesis.expected_hash_file` နှစ်ခုအနက် တစ်ခုအတိအကျ လိုအပ်သည်။ ထုတ်လုပ်ထားသော နိုဒ်ပြင်ဆင်သတ်မှတ်မှုများသည် နောက်တစ်မျိုးကို သုံးပြီး လက်မှတ်ထိုးထားသော ဘလော့ခ်ဘေးရှိ `genesis.expected_hash` ကို ညွှန်ပြသည်။ ထုတ်လုပ်ထားသော ပရိုဖိုင်ကို ကူးယူရာတွင် ဤချည်နှောင်မှုကို ထိန်းသိမ်းပါ။

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

ဘလော့ခ်ထပ်တူပြုရေး သတင်းဖြန့်ဝေမှုတွင် နိုဒ်နမူနာများနှင့် ဘလော့ခ်ထပ်တူပြုရေး အပ်ဒိတ်များအတွက် ဖြန့်ပို့မည့်အရေအတွက် ကန့်သတ်ချက်ဖြစ်သည်။

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

နိုဒ်များထံ နောက်ဆုံးဘလော့ခ်ကို တောင်းဆိုသည့်အကြိမ်များအကြား အချိန်ကာလဖြစ်သည်။

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

နိုဒ်က လှုပ်ရှားမှုမရှိဘဲ ဤအချိန်ကာလ ကျော်လွန်လျှင် ၎င်းနှင့်ချိတ်ဆက်မှုကို ရပ်စဲသည်။

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii ဆာဗာက တောင်းဆိုမှုများကို လက်ခံစောင့်ဆိုင်းရမည့် လိပ်စာဖြစ်ပြီး အသုံးပြုသူဆော့ဖ်ဝဲများက ထိုလိပ်စာသို့ တောင်းဆိုမှုများ ပို့သည်။

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

[Torii ၏ endpoint များ](/my/reference/torii-endpoints.md) က လက်ခံသော မူရင်းတောင်းဆိုမှု body အတွင်းရှိ byte အများဆုံးအရေအတွက်။

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

Fast သည် ထိုအမည်ငါးခုကို စာရင်းစစ်ပြီး payload နှင့် Merkle ဖိုင်များကို metadata ဖြင့် ချည်နှောင်သော်လည်း ၎င်းတို့၏ အကြောင်းအရာများကို မဖတ်၊ ဟက်ရှ်မတွက်၊ parse မလုပ်၊ decode မလုပ်ပါ။ လက်မှတ်ထိုးထားသော manifest မှ အနည်းဆုံးလိုအပ်သော World/SORA Nexus ကို တည်ဆောက်ပြီး Kura ဟက်ရှ်ရှေ့ပိုင်း အတိအကျကို ဖတ်ရှုရန်သာ map လုပ်သည်။ Snapshot ၏ World၊ ဘလော့ခ်ဟက်ရှ် array၊ transaction သမိုင်း၊ ဆင်းသက်အညွှန်းများနှင့် ရေရှည်တည်မြဲသော ပြန်လည်ရယူရေး journal များကို မဖွင့်ဘဲ ထားသည်။ Merkle၊ စံပုံစံနှင့် အဓိပ္ပါယ်ဆိုင်ရာ snapshot စာရင်းစစ်များ၊ သမိုင်းဘလော့ခ်/အပြီးသတ်အတည်ဖြစ်မှု/SCCP ညှိနှိုင်းမှု၊ Sumeragi လက်ရှိအမြင့် ပြန်လည်ရယူမှု၊ ပေါင်းစည်းမှုနှင့် query journal များ၊ lane manifest/စည်းမျဉ်းလိုက်နာမှု ရင်းမြစ်များ၊ Kura အခြေပြု SoraFS မော်ကွန်းများ၊ ဆင့်ကဲသိုလှောင်မှု စာရင်းတွက်ချက်မှုနှင့် မဖြစ်မနေမဟုတ်သော ဝန်ဆောင်မှုညှိနှိုင်းသူများကို ဆက်လက်ဆိုင်းငံ့ထားသည်။ ဒေသတွင်း transaction လက်ခံမှု၊ အဆိုပြုမှု၊ မဲပေးမှု၊ စံရေးသားမှုနှင့် အကူထုတ်လုပ်သူများကို ဆက်လက်ပိတ်ထားသည်။ Kura ကိုယ်တိုင်က writer စတင်မှုနှင့် ရေရှည်တည်မြဲသော ပြောင်းလဲမှုများကို ငြင်းပယ်သည်။ Pipeline နှင့် FASTPQ သိမ်းဆည်းရေး တန်းစီစာရင်းများသည် အလုပ်ကို ထိန်းသိမ်း သို့မဟုတ် ကုဒ်သွင်းမည့်အစား ချက်ချင်း ငြင်းပယ်သည်။ Kura ဖတ်ရှုရေး APIs များတွင်လည်း ပြုပြင်မှုနှင့် ရေရှည်တည်မြဲရေး ထပ်တူပြုမှုကို ပိတ်ထားသည်။ ယာယီ sidecar များကို တရားဝင်အဖြစ် မတင်မြှောက်၊ ပျောက်နေသော lane ပစ္စည်းများကို မထုတ်ပြန်၊ တိုးတက်မှုအတားအဆီးများကို fsync မလုပ်ပါ။ Sumeragi နှင့် transaction gossip ကို မစတင်ပါ။ Torii သည် ကျန်းမာရေး၊ အသက်ဝင်မှု၊ အသင့်ဖြစ်မှု၊ နိုဒ်နှင့် ပြင်ဆင်သတ်မှတ်မှု လုပ်ဆောင်ချက်များကိုသာ ဖွင့်ပေးသည်။ API version၊ အခြေအနေ၊ တိုင်းတာချက်များနှင့် ပုံမှန် အခြေအနေ/သမိုင်း လမ်းကြောင်းအားလုံးကို မရရှိနိုင်ပါ။ Strict ဖြင့် ပြန်စတင်သည်အထိ အသင့်ဖြစ်မှုကို မရရှိနိုင်ပါ။

`fast` ကို ဖြစ်ရပ်စစ်ဆေးဖြေရှင်းရာတွင်သာ အသုံးပြုပါ။ ဝန်ဆောင်မှု တည်ငြိမ်လာလျှင် နိုဒ်ကို ရပ်၊ `strict` ကို ပြန်သတ်မှတ်ပြီး ပြန်စတင်ပါ။ ထိုသို့ပြုခြင်းဖြင့် ထုတ်လုပ်ရေးပြန်မစမီ ဆိုင်းငံ့ထားသော စစ်ဆေးချက်နှင့် အညွှန်းပြန်တည်ဆောက်မှုတိုင်း လုပ်ဆောင်မည်။ Fast နည်းလမ်းသည် ဆိုင်းငံ့ထားသော ပေါင်းစည်းမှတ်တမ်းကို မလိုအပ်သလို စံသိုလှောင်မှုကို ဖန်တီး၊ ပြုပြင်၊ ဖြတ်တောက် သို့မဟုတ် တင်သွင်းခြင်း မပြုပါ။ မထုတ်ပြန်ရသေးသော နောက်ဆက်တွဲအပိုင်းများနှင့် စောင့်ဆိုင်းနေသော အထောက်အကူပြန်လည်ရယူမှုအဆင့်များကို မဖတ်ဘဲ၊ မပြောင်းလဲဘဲ ချန်ထားပြီး Strict ပြန်လည်ရယူမှုအတွက် ထားသည်။ တင်သွင်းထားသော ဟက်ရှ်သီးသန့် အခြေအနေမိတ္တူ၏ ဆက်ခံမှတ်တမ်းကို မရရှိနိုင်သေးပါ။ လက်ရှိအခြေအနေမိတ္တူ ပျောက်နေခြင်း သို့မဟုတ် မမှန်ကန်ခြင်းရှိလျှင် ချက်ချင်းပျက်ကွက်သည်။ Fast သည် ဗလာကမ္ဘာ့အခြေအနေ သို့မဟုတ် သမိုင်းပြန်လုပ်ဆောင်၍ တည်ဆောက်ခြင်းကို အစားထိုးနည်းအဖြစ် မည်သည့်အခါမျှ မသုံးပါ။

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

ဘလော့ခ်များ သိမ်းဆည်းသည့် ဖိုင်တွဲ[^paths] ကို သတ်မှတ်သည်။

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

သုံးစွဲသူတစ်ဦးအတွက် တန်းစီစာရင်းတွင် စောင့်ဆိုင်းနိုင်သော ထရန်ဇက်ရှင်အရေအတွက်၏ အများဆုံးကန့်သတ်ချက်ဖြစ်သည်။

ဒီ option ကိုသုံးပြီး throttling လုပ်ပါ။

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ဤအချိန်ကာလ ကုန်ဆုံးပြီးနောက် တန်းစီစာရင်းထဲတွင် ရှိနေဆဲ ထရန်ဇက်ရှင်ကို ဖယ်ရှားမည်။

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

`[sumeragi]` တွင် နိုဒ်ဒေသတွင်း ပါဝင်ဆောင်ရွက်မှု၊ လက်မှတ်ထိုးပစ္စည်း ထိန်းသိမ်းမှု၊ ဘေးကင်းရေးမှတ်တမ်း လမ်းကြောင်းများနှင့် မှတ်တမ်းတင်ထားသော အချိန်ကုန်ဆုံးမှု၊ ထပ်တူပြုမှု အစားထိုးတန်ဖိုးများ ပါဝင်သည်။ Consensus mode၊ ကော်မတီအရွယ်အစား၊ မဲပြည့်အရေအတွက်၊ ဘလော့ခ်အရွယ်အစားနှင့် transaction ကန့်သတ်ချက်များသည် လက်မှတ်ထိုးထားသော genesis နှင့် commit လုပ်ပြီးသော အခြေအနေမှ လာသည်။ ချို့ယွင်းမှုထည့်သွင်းစမ်းသပ်ခြင်းသည် တစ်သမတ်တည်းဖြစ်သော simulator ၏ အလုပ်ဖြစ်သည်။

ပံ့ပိုးထားသော field များကို [ပြင်ဆင်သတ်မှတ်မှု](/my/guide/configure/overview.md) နှင့် သတ်မှတ်ထားသော [ပြင်ဆင်သတ်မှတ်မှု အကိုးအကား](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/references/configuration.md) တွင် ကြည့်ပါ။

## SORA Nexus အက်တမ်သဘောရှိသော သီးသန့် ငွေစာရင်းရှင်းလင်းမှု {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` သည် နိုဒ်တစ်ခုအပေါ် စာဝှက်ထားသော sidecar ထိန်းသိမ်းမှုကို ပြင်ဆင်သတ်မှတ်သည်။ ၎င်းတွင် ဒေသတွင်း သိုလှောင်မှု ကန့်သတ်ချက် နှစ်ခုအတိအကျ ပါဝင်သည်:

- `sidecar_max_records`: ထိန်းသိမ်းထားသော စာဝှက်ထားသည့် ငွေစာရင်းရှင်းလင်းမှု မှတ်တမ်း အများဆုံးအရေအတွက်။
- `sidecar_max_total_bytes`: ထိန်းသိမ်းထားသော စံ byte အများဆုံးပမာဏ။

အသက်သွင်းမှု၊ သက်သေ profile များ၊ ငွေပေးချေမှု ကန့်သတ်ချက်များ၊ သက်တမ်းကုန်ဆုံးမှုနှင့် စာရင်းစစ်မူဝါဒတို့သည် commit လုပ်ပြီးသော ကိုယ်ရေးလုံခြုံမှုမူဝါဒမှ လာသည်။ နိုဒ်ပြင်ဆင်သတ်မှတ်မှုသည် ထိုမှန်ကန်မှုစည်းမျဉ်းများကို အသက်သွင်း သို့မဟုတ် ပြောင်းလဲ၍ မရပါ။

ထိန်းသိမ်းမှု ပြင်ဆင်သတ်မှတ်ချက်နှင့် လည်ပတ်ရေးလိုအပ်ချက်များကို [Data Space များအကြား အက်တမ်သဘောရှိသော သီးသန့် ငွေစာရင်းရှင်းလင်းမှု လုပ်ဆောင်ခြင်း](/my/get-started/atomic-private-settlement.md) တွင် ကြည့်ပါ။ အစိတ်အပိုင်း အကောင်အထည်ဖော်ထားခြင်းသည် ထုတ်လုပ်ရေးသုံး အရည်အချင်းပြည့်မီကြောင်း မသက်သေပြပါ။

## point-in-time ဒေတာအမြင် {#snapshot}

ဒီ module က [ကမ္ဘာ့အမြင်](/my/blockchain/world#world-state-view-wsv) ရဲ့ point-in-time data views တွေကို ဖတ်ပြီး ရေးဖို့ တာဝန်ရှိပါတယ်။

အခြေအနေမိတ္တူများသည် ကမ္ဘာ့အခြေအနေမြင်ကွင်း၏ ဘိုက်အစီအစဉ်အဖြစ် ဖော်ပြထားသော စစ်ဆေးမှတ်ကို သိမ်းထားသောကြောင့် နိုဒ်သည် Kura မှ ဘလော့ခ်တိုင်းကို ပြန်လုပ်ဆောင်စရာမလိုဘဲ ပြန်စတင်နိုင်သည်။ Kura သည် ဘလော့ခ်သမိုင်းကို ရေရှည်သိမ်းဆည်းသည့်နေရာနှင့် ပြန်လုပ်ဆောင်မှုအတွက် အတည်ပြုရင်းမြစ်အဖြစ် ဆက်ရှိနေပြီး အခြေအနေမိတ္တူများသည် အရှိန်မြှင့်ရန်နည်းလမ်းဖြစ်သည်။ စတင်ချိန်တွင် Iroha သည် အခြေအနေမိတ္တူ၏ ဖော်ပြအချက်အလက်များကို သတ်မှတ်ထားသော ဘလော့ခ်ချိန်းနှင့် သိမ်းဆည်းထားသော ဘလော့ခ်များနှင့် စစ်ဆေးပြီးနောက် မိတ္တူကို ဖွင့်တင်မလား၊ ပြန်လုပ်ဆောင်မှုကို အစားထိုးသုံးမလား ဆုံးဖြတ်သည်။

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

အခြေအနေမိတ္တူများ သိမ်းဆည်းမည့် ဖိုင်တွဲဖြစ်သည်။

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

စောင့်ကြည့်တိုင်းတာရေးစနစ်သည် နိုဒ်စစ်ဆေးရေးအချက်အလက်များကို ပြင်ပစုဆောင်းသူထံ ပို့သည်။ နိုဒ်က စုဆောင်းသူထံ အစီရင်ခံရမည်ဆိုလျှင် `telemetry.url` ကို သတ်မှတ်ပါ။ စုဆောင်းသူ မသုံးလျှင် ထိုအပိုင်းကို ချန်ထားပါ။ ပြန်ကြိုးစားမည့်အချိန်ကိုလည်း ထိုရွေးချယ်စရာဇယားတစ်ခုတည်းတွင် သတ်မှတ်သည်။

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
