---
translation_locale: dz
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: human-reviewed

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# གྲོས་སྒྲིག་གི་གནས་ཚད་ཚུ་ {#configuration-parameters}

མཆོདཔ་ཚུ་

## གཞི་རྟེན་གནས་ཚད་ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ཚོང་འབྲེལ་རེ་རེ་ནང་ བཙུགས་དགོ་པའི་ རིམ་སྒྲིག་ཨའི་ཌི། ལོག་གཏང་ནིའི་གནོདཔ་བཀག་ཐབས་ལུ་ལག་ལེན་འཐབ་ཨིན།

བསྐྱར་རྩེད་འཇབ་རྒོལ་འདི་ དམིགས་གཏད་བསྐྱེད་མི་ལས་ ཡོངས་འབྲེལ་སོ་སོ་ཅིག་ལུ་ ནུས་ཅན་གྱི་ཚོང་འབྲེལ་ཅིག་ བཙུགས་ནིའི་དཔའ་བཅམ་མི་འདི་ཨིན། `chain` འདི་ མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་གྱི་ འབབ་ཁུངས་ཀྱི་ཆ་ཤས་ཅིག་ཨིནམ་ལས་ རིམ་སྒྲིག་གཅིག་གི་དོན་ལུ་ མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་འདི་ གཞན་མི་རིམ་སྒྲིག་ཨའི་ཌི་ལག་ལེན་འཐབ་མི་ མཉམ་རོགས་ཀྱིས་ ངོས་ལེན་མི་འབད།

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

མཐུད་མཚམས་གི་སྤྱིར་བཏང་ལྡེ་མིག་ མཐུད་མཚམས་ཚུ་གི་མཐུན་རྐྱེན་ལག་ལེན་པ་ཚུ་གིས་ BLS-སྤྱིར་བཏངལྡེ་མིག་ཚུ་ ལག་ལེན་འཐབ་དགོ།

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

མཉམ་རོགས་ཀྱི་སྒེར་གྱི་ལྡེ་མིག། དེ་གིས་ `public_key` མཐུན་སྒྲིག་འབད་དགོ; མོས་མཐུན་བདེན་དཔྱད་འབད་མི་ཆ་རོགས་ཚུ་གིས་ BLS-སྤྱིར་བཏང ལྡེ་མིག་ཚུ་ལག་ལེན་འཐབ་དགོ།

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

སྔོན་སྒྲིག་བློ་གཏད་ཅན་གྱི་ཆ་རོགས་ཚུ་གི་ཐོ་ཡིག།

གྲོས་འཆམ་བརྟག་དཔྱད་འབད་མི་ཚུ་གིས་ BLS-སྤྱིར་བཏང མཉམ་རོགས ལྡེ་མིག་ཚུ ལག་ལེན་འཐབ་དགོཔ་ཨིན། སྒྲུབ་རྟགས་བརྟག་དཔྱད་འབད་མི་རེ་གི་དོན་ལུ་ཡང་ [`trusted_peers_pop`](#param-trusted-peers-pop) ནང་ཐོ་བཀོད་འདི་བྱིན་དགོ།

<param-table env="TRUSTED_PEERS">
<template #type>

མཉམ་རོགས་ཡིག་རྒྱུན་གྱི་ཨེ་རེ། P2P ཁ་བྱང་འདི་ཤེས་པའི་སྐབས་ `PUBLIC_KEY@ADDRESS` ལག་ལེན་འཐབ། རྐྱང་པ `PUBLIC_KEY` འདི་ཡང་ངོས་ལེན་འབད་ཡོདཔ་དང་ མཉམ་རོགས་ཁ་བྱང་འདི་ ཁ་གཏམ་ལས་ འཚོལ་ཞིབ་འབད་བཅུགཔ་ཨིན།

</template>།
</param-table>།

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

བདེན་དཔྱད་འབད་མི་བློ་གཏད་ཅན་གྱི་ཆ་རོགས་ཚུ་གི་དོན་ལུ་ BLS བདག་དབང་གི་བདེན་ཁུངས་ཐོ་བཀོད་ཚུ།

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` དང་ `pop_hex` ས་སྒོ་ཚུ་དང་གཅིག་ཁར་ དངོས་པོ་ཚུ་གི་ཨེ་རེ་།

</template>།
</param-table>།

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

## འོད་ཁམས། {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` གིས་བཟོས་པའི་མིང་རྟགས་ཅན་གྱི འགོ་ཐོག སྡེབ་ཚན ནང་དོན་གནད་སྡུད གི་ཡིག་སྣོད་ལམ། བཟོས་པའི གསལ་སྡུད ཚུ་གིས་འདི་སྤྱིར་བཏང་ལུ་ Norito `.nrt` ཡིག་སྣོད་སྦེ་འབྲི།

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

རིགས་མཚན་ལྡེ་མིག་ཆ་གཅིག་གི་ མི་མང་ལྡེ་མིག།

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

## མཐུད་སྦྲེལ་འབད་ནི་ {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

མོས་མཐུན་ (sumeragi) དང་ བཀག་ཆ་མཉམ་འབྱུང་ (སྡེབ་ཚན_sync) གི་དོན་ལུ་ p2p བརྒྱུད་འབྲེལ་གྱི་ཁ་བྱང་།

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

མཉམ་རོགས་ཁ་བྱང་ (ཕྱི་ཁའི་ མཉམ་རོགས་གཞན་ཚུ་གིས་མཐོང་དོ་བཟུམ་སྦེ་)།

འབྲེལ་མཐུད་ཡོད་པའི་མཉམ་རོགས་ཚུ་ལུ་ ཁ་གཏམ་སླབ་འོང་ དེ་ལས་ ཆ་རོགས་གཞན་ཚུ་ལུ་ ཁ་གཏམ་སླབ་ཚུགས།

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

མཉམ་འབྱུང་འཕྲིན་དོན་རྐྱང་པ་ཅིག་ནང་གཏང་བཏུབ་པའི་སྡེབ་ཚན་ཚུ་གི་བསྡོམས་འདི།

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

འཕྲལ་གྱི་སྡེབ་ཚན་གྱི་དོན་ལུ་ མཉམ་རོགས་ཚུ་ལུ་ཞུ་བ་འབད་བའི་བར་ནའི་དུས་ཚོད་བར་མཚམས།

འཕྲལ་འཕྲལ་སྦེ་ར་ ཁ་གཏམ་སླབ་མི་འདི་གིས་ མཉམ་འབྱུང་འབད་ནི་གི་དུས་ཚོད་ཐུང་ཀུ་བཟོཝ་ཨིན་རུང་ ཡོངས་འབྲེལ་འདི་ མངམ་སྦེ་བཀལ་ཚུགས།

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

ཁ་གཏམ་བེཆ་བརྡ་འཕྲིན་ནང་ ཚོང་འབྲེལ་གྱི་གྱངས་ཁ་མང་ཤོས།

ཚད་ཆུང་བ་འདི་གིས་ མཉམ་འབྱུང་འབད་ནི་ལུ་ དུས་ཡུན་རིངམོ་འགྱོཝ་ཨིན་ དེ་འབདཝ་ད་ ཁྱོད་ལུ་ སྦུང་ཚན་གྱོང་རྒུད་མཐོ་དྲགས་ཡོད་པ་ཅིན་ ཕན་ཐོགས་ཅན་ཨིན།

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

མཉམ་རོགས་ཀྱི་བར་ན་ ཚོང་འབྲེལ་གྱི་དོན་ལུ་ བསྒུག་སྡོད་པའི་ སྐད་ཆ་བཤད་པའི་དུས་ཡུན།

འཕྲལ་འཕྲལ་སྦེ་ར་ ཁ་གཏམ་སླབ་མི་འདི་གིས་ མཉམ་འབྱུང་འབད་ནི་གི་དུས་ཚོད་ཐུང་ཀུ་བཟོཝ་ཨིན་རུང་ ཡོངས་འབྲེལ་འདི་ མངམ་སྦེ་བཀལ་ཚུགས།

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

གལ་སྲིད་ པི་ཡར་འདི་ ལཱ་མེད་ཨིན་པ་ཅིན་ པི་ཡར་དང་གཅིག་ཁར་ མཐུད་ལམ་འདི་ མཇུག་བསྡུ་བའི་ཤུལ་ལས་ དུས་ཡུན་གྱི་དུས་ཡུན།

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii ཌེཀ་ར་གིས་ཉན་དགོ་པའི་ཁ་བྱང་དང་ ཀི་ལིཊ་ཚུ་གིས་ ཁོང་གི་ཞུ་ཡིག་བཙུགས་དགོཔ་ཨིན།

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

[Torii ཚད་མཇུག་གི་ཐིག་ཁྲམ་](/dz/reference/torii-endpoints.md)གིས་ ངོས་ལེན་འབད་ཡོད་པའི་ མ་བཅོས ཞུ་བ ནང་དོནནང་ལུ་ བཱའིཊི མང་ཤོས་ཅིག་ཨིན་མས།

ཚད་གཞི་འདི་ DOS གི་འཇབ་རྒོལ་བཀག་ཐབས་ལུ་ལག་ལེན་འཐབ་ཨིན།

<param-table>
<template #type>

གྱངས་ཁ་ (བཱའིཊིསི་གི་)།

</template>།
<template #default-value>

`64_000_000` (ཡ་འབུམ་༦༤ བཱའིཊི)

</template>།
</param-table>།

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

འདྲི་དཔྱད་ཅིག་འཛུལ་སྤྱོད་མ་འབད་བ་ཅིན་ ཚོང་ཁང་ནང་ལུས་ཚུགས་པའི་དུས་ཚོད།

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

ཐད་ཀར་དུ་དྲི་བའི་གྱངས་ཁ་གི་ཐོ་བཀོད་ཚད་མཐོ་སར་ཡོདཔ་ཨིན།

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ལག་ལེན་པ་གཅིག་གི་དོན་ལུ་ ཐད་རི་བ་རི་འདྲི་དཔྱད་ཀྱི་གྱངས་ཁ་གི་མཐོ་ཚད།

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ཤིང་བཟོ་མི་ {#logger}

### `logger.level` {#param-logger-level}

ཐོ་བཀོད་འབད་ནིའི་ སྤྱིར་བཏང་ཚིག་དོན་ཚུ་ [`logger.filter`](#param-logger-filter) མཐོངམ་ཨིན། སྒྲིག་གཞི་བཟོ་སྐྲུན་གྱི་དོན་ལུ་།

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ཡིག་རྒྱུན་ འབྱུང་སྲིད་པའི་གནས་གོང་ཚུ།

- `TRACE`: གནས་རིམ་དམའ་བའི་བཀོལ་སྤྱོད་ཚུ་རྩིས་ཏེ་ བྱུང་ལས་ཆ་མཉམ།
- `DEBUG`: རྐྱེན་སེལ་གནས་རིམ་གྱི་འཕྲིན་དོན་ཚུ་ བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ཕན་ཐོགས་ཅན་ཨིན།
- `INFO`: སྤྱིར་བཏང་ བརྡ་དོན་བརྡ་འཕྲིན་ཚུ་
- `WARN`: འབྱུང་འགྱུར་གྱི་གནད་དོན་སྟོན་མི་ཉེན་བརྡ་ཚུ།
- `ERROR`: སྤྱིར་བཏང་ལས་འགན་ལུ་བར་ཆད་རྐྱབ་མི་འཛོལ་བ་ཚུ་ཨིན་རུང་ འཕྲོ་མཐུད་བཀོལ་སྤྱོད་འབད་བཅུགཔ་ཨིན།

ཁྱོད་ཀྱིས་ལག་ལེན་གྱི་ཐད་ལུ་ འོས་འབབ་ཡོད་པའི་གནས་ཚད་འདི་ གདམ་ཁ་རྐྱབས། ཐོ་བཀོད་གི་གནས་ཚད་ཁྱད་པར་ཅན་ཚུ་ ག་དེ་སྦེ་ལག་ལེན་འཐབ་ནི་ཨིན་ནའི་ལྷག་པའི་གསལ་བཤད་ཚུ་གི་དོན་ལུ་ [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ལུ་བལྟ་དགོ།

</template>
</param-table>།

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip འགྲུལ་བསྐྱོད་དུས་ཡུན་ ད་ལྟོའི་གནས་གོང་

གནད་དོན་འདི་ Torii ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ ལག་བསྟར་མཉེན་ཆས རིམ་སྒྲིག དུས་མཐུན འབད་ནི་ལུ་བསྟུན་ཨིན།

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level)ལས་ལྷག་པའི་ ལེགས་སྦྱར་ཅན་གྱི་ཐོ་ཡིག་བརྟག་དཔྱད་ཐིག་ཁྲ། དམིགས་གཏད་རེ་ལུ་ ཐོ་བཀོད་འབད་ནིའི་ཚིག་དོན་ཚུ་ རང་ལུགས་བཟོ་བཅོས་འབད་ཚུགས།

<param-table type=string env=LOG_FILTER>
<template #type>

ཡིག་རྒྱུན་, གཅིག་ཡང་ན་མངམ་ལྷོད་རྟགས་ཀྱིས་ཁ་ཕྱེ་ཡོད་པའི་བཀོད་རྒྱ་ཚུ་ཡོདཔ་ཨིན། བཀོད་རྒྱ་རེ་རེ་ལུ་ མཐུན་སྒྲིག་འབད་མི་ ཁྱབ་ཚད་དང་བྱུང་ལས་ཚུ་ ལྕོགས་ཅན་བཟོ་མི་ ༼དཔེར་ན་ _selects དོན་ལུ_༽ ལྕོགས་ཅན་བཟོ་མི་ མཐུན་སྒྲིག་ཅན་གྱི་ ཚིག་མང་ཤོས་ _གནས་རིམ_ འོང་། Iroha གིས་ ཁྱད་འཕགས་གནས་རིམ་ཉུང་སུ་ (`trace` ཡང་ན་ `info` བཟུམ་) ཁྱད་འཕགས་གནས་རིམ་མངམ་ལས་ ཚིག་མང་སུ་སྦེ་བརྩི་དོ་ཡོདཔ་ཨིན། (`error` ཡང་ན་ `warn` བཟུམ་)།

གནས་རིམ་མཐོ་བའི་ནང་ལུ་ བཀོད་རྒྱ་ཚུ་གི་དོན་ལུ་ཚིག་སྦྱོར་འདི་ཆ་ཤས་ལེ་ཤ་ཅིག་ཡོདཔ་ཨིན།

```
target[span{field=value}]=level
```

བརྡ་དོན་ལྷག་མ་ཚུ་གི་དོན་ལུ་ [`tracing-subscriber` ཡིག་སྣོད་](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html)བལྟ་དགོ།

</template>།

</param-table>།

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) དང་མཉམ་སྦྱོར་ལག་ལེན།

`logger.filter`གིས་ [`logger.level`](#param-logger-level)དང་གཅིག་ཁར་ལཱ་འབད་དོ་ཡོདཔ་ལས་ གཅིག་གིས་གཅིག་ལུ་ཡང་ མགུ་མཐུད་མ་རྐྱབ་པར་ཡོདཔ་ཨིན།

དཔེར་ན་: `logger.level` གཞི་སྒྲིག་འབདཝ་ཨིན། `INFO` དང་ `logger.filter` གཞི་སྒྲིག་འབདཝ་ཨིན། `iroha_core=debug`, འགྲུབ་ཚུགས་མི་ ཕི་ལཊར་ གཞི་སྒྲིག་འདི་ཨིན། `info,iroha_core=debug` འདི་འབདཝ་ལས་ `info` ཚད་གཞིའི་དོན་ལུ་། `debug` དོན་ལུ་ `iroha_core`).

:::

::: tip འགྲུལ་བསྐྱོད་དུས་ཡུན་ ད་ལྟོའི་གནས་གོང་

གནད་དོན་འདི་ Torii ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ ལག་བསྟར་མཉེན་ཆས རིམ་སྒྲིག དུས་མཐུན འབད་ནི་ལུ་བསྟུན་ཨིན།

:::

### `logger.format` {#param-logger-format}

དྲན་ཐོའི་རྩ་སྒྲིག།

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ཡིག་རྒྱུན་ འབྱུང་སྲིད་པའི་གནས་གོང་ཚུ།

- `full`: སྔོན་སྒྲིག་རྩ་སྒྲིག་འབད་མི་འདི། འདི་གིས་ མི་གིས་ལྷག་བཏུབ་པའི་ བྱུང་ལས་རེ་རེ་གི་དོན་ལུ་ གྲལ་ཐིག་རྐྱང་པའི་དྲན་ཐོ་ཚུ་ བཏོནམ་ཨིནམ་དང་ ད་ལྟོའི་ཁྱབ་ཚད་སྐབས་དོན་འདི་ བྱུང་ལས་ཀྱི་རྩ་སྒྲིག་འབད་ཡོད་པའི་ངོ་ཚབ་ཀྱི་ཧེ་མ་བཀྲམ་སྟོན་འབད་ཡོདཔ་ཨིན།
- `compact`: གྲལ་ཐིག་ཐུང་ཀུ་གི་རིང་ཚད་ཚུ་གི་དོན་ལུ་ ལེགས་བཅོས་འབད་ཡོད་པའི་ སྔོན་སྒྲིག་རྩ་སྒྲིག་འབད་མི་གི་འགྱུར་བ། ད་ལྟོའི་སི་པེན་སྐབས་དོན་ལས་ས་སྒོ་ཚུ་རྩ་སྒྲིག་འབད་ཡོད་པའི་བྱུང་ལས་ཀྱི་ས་སྒོ་ཚུ་ལུ་མཉམ་སྦྲགས་འབད་ཡོདཔ་དང་ ཨིས་པེན་མིང་ཚུ་སྟོན་མི་བཏུབ། ཞིབ་ཚད གནས་རིམ་འདི་ཡིག་འབྲུ་གཅིག་ལུ་བསྡུས་ཡོདཔ་ཨིན།
- `pretty`: མི་གིས་ལྷག་ཚུགས་པའི་དོན་ལུ་ ཡར་དྲག་བཏང་ཡོད་མི་ གྲལ་ཐིག་སྣ་ཚོགས་ཀྱི་དྲན་ཐོ་ཚུ་ ཚད་ལས་བརྒལ་ཏེ་ མཛེས་ཏོག་ཏོ་སྦེ་བཏོནམ་ཨིན། འདི་ངོ་མ་རང་ ས་གནས་ཀྱི་གོང་འཕེལ་དང་ རྐྱེན་སེལ་འབད་ནི་ལུ་ ཡང་ན་ བརྡ་བཀོད་གྲལ་ཐིག་གློག་རིམ་ཚུ་གི་དོན་ལུ་ ལག་ལེན་འཐབ་ནི་ལུ་དམིགས་གཏད་བསྐྱེདཔ་ཨིན་ དེ་ཡང་ རང་བཞིན་དབྱེ་དཔྱད་དང་ དྲན་ཐོ་ཚུ་གི་ བསྡུ་སྒྲིག་གསོག་འཇོག་འདི་ ལྷག་ཚུགས་མི་དང་ མཐོང་སྣང་གི་ མཐོ་གཏུགས་ལས་ གཙོ་རིམ་ཉུང་སུ་ཡོདཔ་ཨིན།
- `json`: གྲལ་ཐིག་གསརཔ་-ཚད་འཛིན་འབད་ཡོད་པའི་ JSON དྲན་ཐོ་ཚུ་ཐོན་འབྲས་འབདཝ་ཨིན། འདི་ཡང་ དབྱེ་དཔྱད་དང་བལྟ་ནི་གི་ལག་ཆས་ཚུ་གིས་ བཟོ་བཀོད་འབད་ཡོད་པའི་དྲན་ཐོ་ཚུ་ JSON བཟུམ་སྦེ་ བཀོལ་སྤྱོད་འབད་སའི་ ལམ་ལུགས་ཚུ་དང་གཅིག་ཁར་ བཟོ་བསྐྲུན་ལག་ལེན་འཐབ་ནི་གི་དོན་ལུ་ཨིན། JSON ཐོན་འབྲས་འདི་མི་གིས་ལྷག་ཚུགས་པའི་དོན་ལུ་ ཡར་འཕེལ་མ་བཟོཝ་ཨིན།

ཞིབ་འཇུག་དང་ བརྟག་དཔྱད་ཐོན་སྐྱེད་ཚུ་གི་དོན་ལུ་ [`tracing-subscriber` ཡིག་སྣོད་](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ལུ་བལྟ་དགོ།

</template>།
</param-table>།

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

Kura འདི་ Iroha གི་རྒྱུན་བརྟན་གསོག་འཇོག་འཕྲུལ་ཆས་ཨིན་ (ཉི་ཧོང་སྐད་ནང་ _མཛོད་ཁང་_ ཟེར་བའི་དོན་ཨིན)།

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

མཐོ་ཤོས་ N མཐའ་མའི་སྡེབ་ཚན་ཚུ་དྲན་ཚད་ནང་གསོག་འཇོག་འབད་འོང་།

སྡེབ་ཚན་རྙིངམ་ཚུ་དྲན་ཚད་ལས་བཏོན་གཏང་ཞིནམ་ལས་ དགོ་པ་ཅིན་ ཌིཀསི་ལས་མངོན་གསལ་འབད་འོང་།

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

Kura འགོ་འདྲེན་འཐབ་ནིའི་ལམ་ལུགས་ `strict` འདི་ སྤྱིར་བཏང་དང་ སྔོན་སྒྲིག་གི་ལམ་ལུགས་ཨིན། འདི་གིས་ ཀ་ནོ་ཌིཀའི་ལོ་ནི་ཀ་, བསྐྱར་གསོ་འབད་ཡོད་པའི་ལག་ཆས་ཚུ་, གྲོགས་རམ་ཅན་གྱི་ཐོ་ཡིག་ཚུ་, དེ་ལས་ མཚམས་འཇོག་རྩིས་ཐོ་འདི་ མཐུད་མཚམས ཤུགས་བསྐྱེད་པའི་ཧེ་མར་ ཆ་མེད་གཏང་འོང་།

`fast` འདི ཆ་ཚང འགོ་བཙུགས རྩིས་ཞིབ གིས ཞབས་ཏོག་ཆད ཉེན་ཁ་བཟོ་སྲིད་པའི་སྐབས ལག་བསྟར་གྱི མཐོང་ཚད སླར་གསོ་འབད་ནིའི གློ་འབུར་ ཉམས་ཆག-ཞབས་ཏོག ཐབས་ལམ ཨིན། འདི་ལུ `strict` གིས་ཧེ་མ འགོ་སྒྲིག འབད་མི གསོག་འཇོག དང་ `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, `snapshot.merkle.json` ཟེར་མི བཟོས་དངོས ཏག་ཏག་ལྔ་ཡོད་པའི ད་ལྟོའི གནས་སྟངས་འདྲ་བཤུས བཟོ་སྐྲུན དགོ། མངའ་ཁོངས-སོ་སོར་ཕྱེ་ཡོད བཀོལ་སྤྱོད་པ མིང་རྟགས གིས ཁྱབ་བསྒྲགས་ཡོད ནང་དོན་གནད་སྡུད བསྡུས་རྟགས དང ཚད་བཀལ་ཅན གསལ་སྟོན་ཡིག་ཆ སྦྲེལཝ་ཨིན། གསལ་སྟོན་ཡིག་ཆ གིས ནང་དོན་གནད་སྡུད རིང་ཚད, སྡེབ་ཐག/དྲ་རྒྱ ངོ་རྟགས, མཐའ་མཇུག མཐོ་ཚད/བསྡུས་རྟགས, SCCP སྲིད་བྱུས བསྡུས་རྟགས དང འགོ་སྒྲིག-རྒྱུད་རིམ ཡོད་མེད སྦྲེལཝ་ཨིན། མགྱོགས་དྲགས་ གིས འགོ་སྒྲིག རྒྱུད་རིམ ཆ་མེད་གཏངམ་ཨིན་ དེ་ལས ཡུན་བརྟན Kura ནང་གི མཚོན་རྟགས/གྲངས་བརྩི/བསླབ་བྱ མཐའ་མཚམས ཏག་ཏག་གཅིག་པ་དགོ། དང་པ་-གསར་བཏོན མཐུད་མཚམས ཚུ་གིས བཟོས་དངོས ལྔ་པོ་དེ་རྐྱངམ་གཅིག་ལེན་ཞིནམ་ལས བཟོས་དངོས གྲངས་བརྩི ཡང་ན ཡིག་སྣོད་མིང ཆ་ཚན གཞན་ཆ་མཉམ་ཆ་མེད་གཏངམ་ཨིན།

མགྱོགས་དྲགས་ ཐབས་ལམ གིས་མིང་ལྔ་དེ་ཚུ་ཐོ་བཀོད་འབད་དེ་ ནང་དོན་གནད་སྡུད དང་ Merkle ཡིག་སྣོད ཚུ་ ཟུར་གནས་གནད་སྡུད ཐོག་ལས་མཉམ་སྦྲེལ་འབདཝ་ཨིན། ཨིན་རུང་དེ་ཚུ་གི་ནང་དོན་ལྷག་ བསྡུས་རྟགས བཟོ་ དབྱེ་དཔྱད ཡང་ན་ ཨང་འགྲོལ མི་འབད། རྟགས་བཀོད་ཅན་གྱི་ གསལ་སྟོན་ཡིག་ཆ ལས་ འཛམ་གླིང་/Nexus ཉུང་མཐའ་ཅིག་བཟོ་སྟེ་ Kura བསྡུས་རྟགས སྔོན་འཇུག་ ཏག་ཏག་ཀློག་རྐྱང་སྦེ་ སྦྲེལ་སྒྲིག འབདཝ་ཨིན། གནས་སྟངས་འདྲ་བཤུས འཛམ་གླིང་ དང་ སྡེབ་ཚན་བསྡུས་རྟགས གྲལ་སྒྲིག དེ་ལས་ ཚོང་འབྲེལ བྱུང་རབས དང་ འབྱུང་ཁུངས ཟུར་ཐོ ཚུ་དང་ཡུན་བརྟན་གྱི་ ལོག༌ཐོབ༌ དུས་དེབ ཚུ་སྒོ་མ་ཕྱེ་བར་བཞགཔ་ཨིན། Merkle རྩིས་ཞིབ དང་ ཚད་ལྡན/བརྡ་དོན་རིག་པ གནས་སྟངས་འདྲ་བཤུས རྩིས་ཞིབ ཚུ་ ལོ་རྒྱུས་ཅན སྡེབ་ཚན/མཐའ་མཐའ/SCCP གི་མཐུན་སྒྲིག་ Sumeragi ཤུགས་ལྡན་-མཐོ་ཚད ལོག༌ཐོབ༌ དང་ མཉམ་སྡེབ/འདྲི་དཔྱད དུས་དེབ ཚུ་ ལག་བསྟར་རྒྱུན་ལམ གསལ་སྟོན་ཡིག་ཆ/མཐུན༌པ༌ ཐོན༌ཁུངས༌ ཚུ་ ཀུ་ར་རྒྱབ་སྐྱོར SoraFS ཡིག་མཛོད ཚུ་ རང་བསྐྱར གསོག་འཇོག རྩིས་དང་གདམ་ཁ་ཅན་གྱི་ ཞབས་ཏོག མཐུན་སྒྲིག་འབད་མི ཚུ་ཤུལ་ལུ་འབད་ནི་སྦེ་བཞགཔ་ཨིན། ས་གནས ཚོང་འབྲེལ འཛུལ་ཆོག དང་ གྲོས་འཆར་ ཚུ་ ཚོགས་རྒྱན དང་ ཚད་ལྡན བྲི་ ཚུ་དང་རྒྱབ་སྐྱོར་གྱི་ བཟོ་སྐྲུན་པ ཚུ་མུ་མཐུད་དེ་ལཱ་མེདཔ་བཟོ་ཡོད། Kura གིས་ རྩོམ་པ་པོ འགོ་བཙུགས་ནི་དང་ཡུན་བརྟན་གྱི་ འགྱུར་བ ཆ་མེད་གཏངམ་ཨིན། མདོང་ལམ དང་ FASTPQ བརྩོན་འགྲུས གྱལ་ ཚུ་གིས་ལཱ་བཞག་ནི་ཡང་ན་ ཨང་སྒྱུར འབད་ནིའི་ཚབ་ལུ་དེ་འཕྲལ་ལས་ཆ་མེད་གཏངམ་ཨིན། Kura ལྸག་ནི་ APIs ཚུ་གིས་ ཉམས་བཅོས དང་ གཏན་བརྟན་མཉམ་བསྒྲིག བྱ༌སྤྱོད༌ ཡང་ལཱ་མེདཔ་བཟོཝ་ཨིན། གནས་སྐབས་ཀྱི་ ཟུར་ཐོ ཚུ་ཡར་སེང་མི་འབད་ ལག་བསྟར་རྒྱུན་ལམ བཟོ་ཐོན བྱང་མི་ཚུ་དཔར་བསྐྲུན་མི་འབད་དེ་ མདུན༌སྐྱོད༌ བཀག་ར ཚུ་ fsync མི་འབད། Sumeragi དང་ ཚོང་འབྲེལ གནས་ཚུལ་ཕན་ཚུན་བཀྲམ འགོ་མི་བཙུགས། Torii གིས་ གཟུགས་ཁམས་ དང་ ཤུགས་ལྡན་གནས་ཐུབ དེ་ལས་ གྲ་སྒྲིག དང་ མཉམ་རོགས དང་ རིམ་སྒྲིག བྱ་བ ཚུ་རྐྱངམ་ཅིག་སྟོནམ་ཨིན། API ཐོན་རིམ་ དང་ གནས་ཚད་ དེ་ལས་ ཚད་འཇལ དང་སྤྱིར་བཏང་གི་ གནས་སྟངས/བྱུང་རབས རྒྱུན་ལམ ག་ར་མི་ཐོབ། དམ་དམ་ ཐོག་ལས་ལོག་འགོ་མ་བཙུགས་ཚུན་ གྲ་སྒྲིག མི་ཐོབ།

`fast` འདི་ བྱུང་རྐྱེན་ཅིག་གི་དོན་ལུ་རྐྱངམ་ཅིག་ལག་ལེན་འཐབ། ཞབས་ཏོག་འདི་བརྟན་ཏོག་ཏོ་འགྱོ་ཚརཝ་ད་ མཐུད་མཚམས་འདི་བཀག་ཞིནམ་ལས་ `strict` སླར་གསོ་འབད་ཞིནམ་ལས་ བཟོ་བསྐྲུན་ལོག་མ་འགོ་བཙུགས་པའི་ཧེ་མ་ ཕར་འགྱངས་འབད་ཡོད་པའི་ཞིབ་དཔྱད་དང་ཟུར་ཐོ་བསྐྱར་བཟོ་ཚུ་ག་ར་གཡོག་བཀོལཝ་ཨིན། མགྱོགས་ཐབས་ལམ་ལུ་ ཕྱིར་འགྱངས་འབད་ཡོད་པའི་མཉམ་བསྡོམས་དྲན་ཐོ་དགོཔ་མེདཔ་ལས་ གསར་བསྐྲུན་འབད་ནི་དང་ ཉམས་བཅོས་འབད་ནི་ བཏོག་ནི་ ཡང་ན་ ཚད་ལྡན་གསོག་འཇོག་ནང་འདྲེན་འབད་ནི་ཚུ་ མི་དགོ། དཔར་བསྐྲུན་མ་འབད་བའི་རྗེས་འཇུག་ཚུ་དང་ བསྒུག་སྡོད་མི་ ལྷན་ཐབས་སླར་གསོའི་གནས་རིམ་ཚུ་ ལྷག་མ་བཏུབ་པར་ ཡང་ན་ བསྒྱུར་བཅོས་མ་འབད་བར་ སྣང་མེད་བཞག་སྟེ་ དེ་ལས་ སླར་གསོའི་དོན་ལུ་ དམ་དམ་སྦེ་བཞགཔ་ཨིན། ནང་འདྲེན་འབད་ཡོད་པའི་ཧེཤི་རྐྱངམ་ཅིག་པར་བཏབ་མི་རིགས་རྒྱུད་འདི་འཐོབ་མ་ཚུགསཔ་སྦེ་ལུསཔ་ཨིན། ད་ལྟོའི་པར་བརྙན་བརླག་སྟོར་ཤོར་མི་ཡང་ན་ནུས་མེད་ཅིག་ དེ་འཕྲོ་ལས་འཐུས་ཤོར་བྱུངམ་ཨིན། མགྱོགས་དྲགས་འདི་ འཛམ་གླིང་སྟོངམ་དང་ ཡང་ན་ བྱུང་རབས་བསྐྱར་བཟོ་འབད་ནི་ལུ་ ལོག་མི་འགྱོ།

<param-table default-value=strict>
<template #type>

ཡིག་རྒྱུན་ འབྱུང་སྲིད་པའི་གནས་གོང་ཚུ་:

- `strict`: བརྟན་ཏོག་ཏོ་སྦེ་བཟོ་ནི་དང་ བཟོ་སྐྲུན་འབད་ཐངས་ཚུ་
- `fast`: ཚད་འཛིན་ཅན་གྱི་གློ་བུར་འགོ་བཙུགས་དང་ ཐོན་སྐྱེད་བཀག་སྡོམ་འབད་དེ་ ལོག་སྟེ་འགོ་བཙུགས་ཚུན་ཚོད་

</template>།
</param-table>།

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

སྡེབ་ཚན་ཚུ་གསོག་འཇོག་འབད་ཡོད་པའི་སྣོད་ཐོ་[^paths] གསལ་བཀོད་འབདཝ་ཨིན།

འདི་ཡང་བལྟ་: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

ཀོན་སོལ་ལུ་ སྡེབ་ཚན་གསརཔ་དཔར་བསྐྲུན་འབད་ནི་ལྕོགས་ཅན་བཟོ་ནི་ལུ་ དར་ཆ།

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

## གྲལ་ཐིག་ {#queue}

### `queue.capacity` {#param-queue-capacity}

ཟད་འགྲོ་བཏང་མི་ གྱངས་ཁ་མཐོ་སའི་ཚད་གཞི་འདི་

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ལག་ལེན་པ་གཅིག་གི་དོན་ལུ་ བང་རིམ་ནང་བསྒུག་སྡོད་མི་ ཚོང་འབྲེལ་གྱི་གྱངས་ཁ་གི་མཐོ་ཚད།

ཐབས་ལམ་འདི་འཇུག་སྤྱོད་འབད་ནི་ལུ་ གདམ་ཁ་འདི་ལག་ལེན་འཐབ།

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

གལ་སྲིད་ ད་ལྟོ་ཡང་ བང་རིམ་ནང་ཡོདཔ་ཨིན་པ་ཅིན་ དུས་ཚོད་འདི་གི་ཤུལ་ལས་ བརྗེ་སོར་འདི་ བཀོག་བཞག་འོང་།

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi མཉེན་ཆས་ཕོརཀ་འཛིན་སྐྱོང་འགྲུལ་ལམ་ཚུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ རྐྱེན་སེལ་རྐྱངམ་ཅིག་སོར་བསྒྱུར་འབད། འདི་ཚད་འཛིན་འབད་ཡོད་པའི་བརྟག་དཔྱད་ཚུ་གི་ཕྱི་ཁར་ལྕོགས་མིན་བཟོ་བཞག། གཡོག་བཀོལ་བའི་ཐོན་སྐྱེད་ཡོངས་འབྲེལ་གུ་བསྒྱུར་བཅོས་འབད་མི་འདི་གིས་ ཡོངས་འབྲེལ་གྱི་ཆ་རོགས་ཚུ་ མོས་མཐུན་སྤྱོད་ལམ་གྱི་སྐོར་ལས་ མོས་མཐུན་མེདཔ་བཟོ་ཚུགས།

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus ཨ་ཏོ་མ་གི་ སྒེར་གྱི་མཐུན་རྐྱེན་ {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` གིས་ `AtomicPrivateSettlementV1` འགྲུལ་ལམ་སོ་སོ་འདི་འཛིན་སྐྱོང་འཐབ་ཨིན། སྔོན་སྒྲིག་གིས་ལྕོགས་མིན་བཟོཝ་ཨིན། གཞི་སྒྲིག་ `enabled = true` ལུ་ཡང་ `activation_height` དགོཔ་ཨིན། འཛུལ་ཞུགས་འདི་ ད་ལྟོ་ཡང་ རིམ་སྒྲིག་ལྕོགས་གྲུབ་དང་ བརྡ་དོན་དུས་ཡུན་ གཏན་འཇགས་བདེན་ཁུངས་གསལ་སྡུད་ དེ་ལས་ ཆུ་རྫིང་/རྩིས་ཞིབ་གཞུང་སྐྱོང་ཚུ་ ཤུགས་ཅན་སྦེ་མ་གཏོགས་ སྒོ་བསྡམ་མ་ཚུགས།

མཐའ་མཚམས་གཙོ་བོ་ཚུ་ `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records` དང་ `sidecar_max_total_bytes` ཨིན། `capsule_padding_classes_bytes` འདི་ V1 ཁ་སྐོང འཛིན་གྲྭ གི་ དམ་དྲག་སྦེ ཡར་སེང་འགྱོ་དོ ཡན་ལག་ཚན ཅིག་ཨིན་དགོ། `permitted_policy_versions` གིས་ V1 རྐྱངམ་གཅིག་ཁས་ལེན་འབདཝ་ཨིན།

`max_capsule_bytes` གིས་ `PrivateSettlementAuditCapsuleV1` སྦྱིས་ཚང་གི་ Norito བཱའིཊི་ཚུ འདི་རྩིས་ཏེ་ AAD, ཚར་གཅིག་ཨང, གསང་ཡིག, ཕྱོགས་ཚད གཞི་ཁྲམ་བཟོ་བ དང་DEK གྱལ་སྒྲོམ་ནང་ལུ་ཨོ་ཌི་ཊར་ཡོངས་བསྡོམས་འབད་མི་དེ་ བཏོན་དོ་ཡོདཔ་ཨིན། འདི་གིས་ ལས་རིམ་ཨང་རྟགས-ཡིག་ཚིགརྐྱངམ་ཅིག་མེདཔ། ཐོ་བཀོད་འབད་ཡོད་པའི་ བཀྲམ་སྤེལ་གྱི་སྡེ་ཚན་ག་ར་གིས་ ཉུང་ཤོས་ར་ `default_min_auditor_approvals` ལྟ་རྟོག་པ་ཚུ་གི་དོན་ལུ་ རང་བཞིན་གནས་སྟངས་ཀྱི་ ཕུན་ཚོགས་གླིང་གི་ཁེབས་ནང་ འཛུགས་སྐྱོང་འབད་དགོཔ་ཨིན། འདི་ཡང་ ངོས་ལེན་གྱི་སྒྲིག་གཞི་འདི་ ཁྲིམས་ལུགས་ཅན་ཅིག་ཨིན་: Torii གིས་ `min_approvals` གི་གོང་ཚད་དམའ་བ་ཡོད་མི་ ཆ་འཇོག་གྲུབ་མི་ སྲིད་བྱུས་ཅིག་ལུ་ ཁ་བཟེད་དོ་ཡོདཔ་མ་ཚད་ དངོས་སུ་ཅན་གྱི་ ཕུན་སུམ་ཚོགས་པའི་ གནད་སྡུད་ཕྱི་ཤུབ ཚུ་ ཀན་ནོ་ནི་ཀཱན་གྱི་ བཱའིཊི ཚད ལས་བརྒལ་སྦེ་ ཆ་མེད་གཏང་ཡོདཔ་ཨིན།

འ་ནི་སྒྲིག་གཞི་ཚུ་ནང་ བཟོ་སྐྲུན་མཐའ་འཁོར་གྱི་འགྱུར་ལྡོག་ཅན་གྱི་ སི་ཊི་བཱསི་མེད་ཡོདཔ་ཨིན། སྒྲིག་ལམ་གྱི་དཔེ་དང་ལག་ལེན་གྱི་ དགོས་མཁོ་ཚུ་གི་དོན་ལུ་ [གནས་སྡུད་བར་སྟོང་ཕན་ཚུན་གྱི་གསང་བའི་རྡུལ་ཕྲན་རྩིས་རྒྱག་གཡོག་བཀོལ](/dz/get-started/atomic-private-settlement) ལུ་བལྟ་དགོ། ཐབས་ལམ་འདི་ གསལ་བཀོད་འབད་ཡོད་པའི་ ཕྱི་ཁའི་ཐར་ཐོ་བཀོད་སྒོ་ར་མ་འགྱོ་བའི་བར་དུ་ བཟོ་སྐྲན་ལུ་འོས་འབབ་མེད་ཨིན།

## གནས་སྟངས་འདྲ་བཤུས་འདི་ {#snapshot}

ལས་འགན་འདི་ [འཛམ་གླིང་གནས་སྟངས་མཐོང་སྣང](/dz/blockchain/world#world-state-view-wsv) གི་གནས་སྟངས་འདྲ་བཤུས་ཚུ་ལྷག་སྟེ་བྲིས་ནི་ཨིན་མས།

གནས་སྟངས་འདྲ་བཤུས་ཚུ གིས་ འཛམ་གླིང་གནས་སྟངས་མཐོང་སྣང གི་ བརྟག་དཔྱད་སྒོ་ར་རིམ་སྒྲིག་སྦེ་བཞག་ཡོདཔ་ལས་ མཉམ་རོགས གྱིས་ Kura ལས་ སྡེབ་ཚན་རེ་ཡང་ ལོག་གནས་སྟངས་འདྲ་བཤུས་མ་རྐྱབ་པར་ ལོག་འགོ་བཙུགས་ཚུགས། Kura འདི་ལོག་གནས་སྟངས་འདྲ་བཤུས་གྱི་དོན་ལུ་ དཀའཝ་སྤྱད་ཚུགས་པའི་ ཨེབ་རྟ་དང་བདེན་པའི་འབྱུང་ཁུངས་ཨིན། གནས་སྟངས་འདྲ་བཤུས་ཚུ འདི་མགྱོགས་དྲགས་འབད་ནི་གི་ལམ་ཨིན། འགོ་བཙུགས་པའི་སྐབས་ལུ་ Iroha གིས་ སྒྲིག་གཞི་སྒྲིག་འབད་ཡོད་པའི་ ལྕགས་ཐག་དང་ བཀྲམ་སྤེལ་འབད་ཡོད་མི་ སྦྲག་ཚུ་དང་གཅིག་ཁར་ གནས་སྟངས་འདྲ་བཤུས་འདི་གནས་སྟངས་འདྲ་བཤུས་ནང་ལུ་ བཙུགས་ནི་ཨིན་ན་ ཡང་ན་ ལོག་སྤྱོད་འབད་ནི་ཨིན་ན་ ཐག་བཅད་པའི་ཧེ་མར་ གནས་སྟངས་འདྲ་བཤུས་གྱི་ ཟུར་གནས་གནད་སྡུད འདི་བརྟག་དཔྱད་འབདཝ་ཨིན།

::: tip snapshot་ཚུ་སེལ་འཐུ་འབད།

གལ་སྲིད་ གནས་སྟངས་འདྲ་བཤུས་ཚུ གི་ལམ་ལུགས་ནང་ལུ་ གནད་དོན་ག་ཅི་ཡང་མ་བདེཝ་ཡོད་པ་ཅིན་ ཁྱོད་ཀྱིས་གནས་སྟངས་འདྲ་བཤུས་ཚུ་གི་ཐད་ལུ་ སྟོངམ་སྦེ་ཡོད་པའི་ཤོག་ལེབ་ནང་ལས་ འགོ་བཙུགས་དགོ་པ་ཅིན་ [`snapshot.store_dir`](#param-snapshot-store-dir)གིས་བཀོད་མི་ སྣོད་ཐོ འདི་བཏོན་གཏང་ཚུགས།

:::

### `snapshot.mode` {#param-snapshot-mode}

པར་ཆས་རིམ་ལུགས་ཀྱིས་ལཱ་འགན་འབད་མི་ཐབས་ལམ།

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ཡིག་རྒྱུན་ འབྱུང་སྲིད་པའི་གནས་གོང་ཚུ།

- `read_write`: Iroha གིས་ [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)གིས་གསལ་བཀོད་འབད་ཡོད་པའི་དུས་ཡུན་ལུ་ གནས་སྟངས་འདྲ་བཤུས་ཚུ བཟོ་དོ་ཡོདཔ་ཨིན། འགོ་བཙུགས་པའི་བསྒང་ལས་, Iroha གིས་གནས་གོང་ཅན་གྱི་ གནས་སྟངས་འདྲ་བཤུས (ག་ཡོད་ཡོད་པ་ཅིན་) ཀློག་ཞིནམ་ལས་ སྡེབ་ཚན་ཚུ སྒྲིང་སྒྲི་ཚུ་དང་གཅིག་ཁར་ ད་ལྟོའི་གནས་སྟངས་ནང་ཡོདཔ་ཨིན་ན་ བརྟག་ཞིབ་འབདཝ་ཨིན།
- `readonly`: `read_write`དང་འདྲཝ་ཨིན་རུང་ Iroha གིས་ གནས་སྟངས་འདྲ་བཤུས་ཚུ ག་ནི་ཡང་ བཟོ་མི་ཚུགས།
- `disabled`: Iroha གིས་གནས་སྟངས་འདྲ་བཤུས་གསརཔ་ཚུ་ བཟོ་མི་ཡང་ན་ འགོ་བཙུགས་པའི་བསྒང་ལས་ཡོད་པའི་གློག་འཕྲིན་ཚུ་ ཀློག་མི་ཚུགས།

</template>།
</param-table>།

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

པར་རིས་ཚུ་གི་བསྐྱར་འབྱུང་།

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

པར་ཆས་ཚུ་ག་སྟེ་ལུ་གསོག་འཇོག་འབད་ནི་ཨིན་ནའི་སྣོད་ཐོ།

འདི་ཡང་བལྟ་: [`kura.store_dir`](#param-kura-store-dir)

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

## གློག་ཐག་ར་བ་ {#telemetry}

ཊེ་ལི་མི་ཊི་གིས་ ཕྱིའི་ཊེ་ལི་མི་ཊི་བསྡུ་ལེན་འབད་མི་ལུ་ མཉམ་རོགས་བརྟག་དཔྱད་ཚུ་ཕྱིར་འདྲེན་འབདཝ་ཨིན། མཉམ་འབྲེལ་པ་ཅིག་གིས་ བསྡུ་ལེན་འབད་མི་ཅིག་ལུ་སྙན་ཞུ་འབད་དགོཔ་ད་ `telemetry.name` དང་ `telemetry.url` གཉིས་ཆ་ར་རིམ་སྒྲིག་འབད། ཊེ་ལི་མི་ཊི་ལག་ལེན་མ་འཐབ་པའི་སྐབས་ དབྱེ་ཚན་འདི་བཏོན་གཏང་།

`name` དང་ `url` ཆ་སྒྲིག་འབད་དགོ།

`telemetry` དབྱེ་ཚན་ཆ་མཉམ་གདམ་ཁ་ཅན་ཨིན།

### `telemetry.name` {#param-telemetry-name}

ཊེ་ལི་མི་ཊི་གུ་བཀྲམ་སྟོན་འབད་ནི་ཨིན་པའི་ མཐུད་མཚམས་ཀྱི་མིང་།

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL ཊེ་ལི་མེ་ཏིརི་ བསྡུ་ལེན་འབད་ཐངས་ཨིན།

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

ལོག་མཐུད་མ་འབད་བའི་ཧེ་མ་ བསྒུག་དགོ་པའི་དུས་ཡུན་ཉུང་ཤོས།

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

ལོག་མཐུད་ལམ་གྱི་བར་ན་ ཕྱིར་འགྱངས་ཡར་སེང་འབད་ནི་ལུ་ལག་ལེན་འཐབ་མི་ ༢ གི་ མཐོ་ཚད་མཐོ་ཤོས།

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ཌེབ་-ཊེ་ལི་མི་ཊི་རི་ ༡ ལུ་འབྲི་ནིའི་ཡིག་སྣོད་འགྲུལ་ལམ།

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
