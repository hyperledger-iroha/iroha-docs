---
translation_locale: dz
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# གྲོས་སྒྲིག་གི་གནས་ཚད་ཚུ་ {#configuration-parameters}

མཆོདཔ་ཚུ་

## གཞི་རྟེན་གནས་ཚད་ {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

གྲལ་ཐིག་ ID འདི་ བྱ་སྟབས་མ་བདེཝ་རེ་ནང་ཚུད་དགོཔ་ཨིན། སླར་ལོག་འཐབ་རྒོལ་ཚུ་ བཀག་ཐབས་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

སླར་ལོག་འཐབ་ནི་དེ་ བརྒྱུད་འཕྲིན་ལག་ལེན་འདི་ ཕྱིར་བཏོན་འབད་ནིའི་ཐབས་ལམ་ཨིན། `chain` འདི་ ལག་ལེན་གྱི་འགན་ཁུར་གི་ཆ་ཤས་ཅིག་ཨིནམ་ལས་ ཐོ་བཀོད་ཅན་གྱི་ལྡེ་མིག་གཅིག་གི་དོན་ལུ་ ཐོ་བཀོད་ཀྱི་ལྡེ་མིག་ཅིག་གིས་ ལག་ལེན་འཐབ་མི་ལྡེ་མིག་གཞན་ ID ལག་ལེན་འཐབ་མི་ཚུ་གིས་ འཕྲུལ་ཆས་ཅིག་ལུ་ ཁ་བཟེད་མ་ཚུགས།

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

གྲྭ་ཚང་གི་སྤྱིར་བཏང་ལྡེ་མིག་ གྲྭ་ཚང་ཚུ་གི་མཐུན་རྐྱེན་ལག་ལེན་པ་ཚུ་གིས་ BLS-Normalལྡེ་མིག་ཚུ་ ལག་ལེན་འཐབ་དགོ།

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

གྲྭ་ཚང་གི་ སྒེར་གྱི་ལྡེ་མིག་འདི་ `public_key` དང་མཐུན་རྐྱེན་གཏན་འབེབ་འབད་མི་ གྲྭ་ཚང་ཚུ་གིས་ BLS-Normalལྡེ་མིག་ཚུ་ལག་ལེན་འཐབ་དགོ།

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

བློ་གཏད་ཚུགས་པའི་ ཆ་རོགས་ཚུ་གི་ཐོ་ཚུ་

གྲོས་འཆམ་བརྟག་དཔྱད་འབད་མི་ཚུ་གིས་ BLS-Normal peer keys ལག་ལེན་འཐབ་དགོཔ་ཨིན། སྒྲུབ་རྟགས་བརྟག་དཔྱད་འབད་མི་རེ་གི་དོན་ལུ་ཡང་ [`trusted_peers_pop`](#param-trusted-peers-pop) ནང་ཐོ་བཀོད་འདི་བྱིན་དགོ།

<param-table env="TRUSTED_PEERS">
<template #type>

གྲྭ་ཚང་གི་ཐིག་ཁྲམ་ཚུ་ ལག་ལེན་འཐབ་ཨིན། `PUBLIC_KEY@ADDRESS` ཌའི་ལེནདེ་ P2P ཡི་གུ་ཤེས་པའི་སྐབས་ལག་ལེན་འཐབ་; bare `PUBLIC_KEY` འདི་ཡང་ཆ་ལེན་འབད་ཡོདཔ་མ་ཚད་ ཕོག་གཏམ་ནང་ལས་ རྭ་ཚང་གི་ཁ་བྱང་འདི་མཐོང་ཚུགསཔ་བཟོཝ་ཨིན་མས།

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

BLS དམ་ཚིག་ཅན་ལུ་ བློ་གཏད་མི་མཉམ་རོགས་ཚུ་གི་དོན་ལུ་ ཐོབ་དབང་གི་ཁུངས་བཀོད་ཐོ་བཀོད་འབདཝ་ཨིན།

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key`དང་ `pop_hex` གྱི་ས་ཁོངས་ཚུ་ཡོད་པའི་དངོས་པོ་གི་གྲལ་ཐིག་

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

## འོད་ཁམས། {#genesis}

### `genesis.file` {#param-genesis-file}

ཡིག་སྣོད་ལམ་དེ་ `kagami genesis sign`གིས་བཟོཝ་ཨིན། བཟོ་སྐྲུན་འབད་མིའི་ཡིག་གཟུགས་འདི་ སྤྱིར་བཏང་ལུ་ Norito `.nrt` ཡིག་སྣོད་སྦེ་འབྲི་འོང་།

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

འབྱུང་ཁུངས་ཀྱི་ལྡེ་མིག་གི་ལྡེ་མིག་འདི་ གསལ་བཀོད་འབདཝ་ཨིན།

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

གྲོས་བསྟུན་ (sumeragi) དང་ བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་ (block_sync) གི་དོན་ལུ་ p2p བརྡ་སྤྲོད་ཀྱི་ཁ་བྱང་།

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

རིགས་མཐུན་གྱི་ཁ་བྱང་ (ཕྱི་ཁའི་ཁ་བྱང་འདི་ རིགས་མཐུན་གཞན་ཚུ་གིས་མཐོང་དོ་བཟུམ་སྦེ་ཨིན།)

ཆ་རོགས་ཚུ་གི་དོན་ལུ་ ཁ་ཤགས་འབད་ནི་ཨིན་ དེ་སྦེ་འབད་བ་ཅིན་ ཁོང་གཞན་གྱི་ཆ་རོགས་ཚུ་ལུ་ཡང་ ཁ་ཤགས་འབད་ཚུགས།

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

སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 1 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 5 སྔོན་ལ་གསར་བཅོས་བྱས།

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

བཀྲམ་སྤེལ་འབད་དགོ་པའི་ ཞུ་བ་ཚུ་གི་བར་ན་ དུས་ཡུན་རིང་ཐུང་

འཕྲལ་འཕྲལ་གཏམ་བཤད་ནི་གིས་ དུས་ཡུན་ཐུང་ཀུ་བཟོ་དོ་ཡོདཔ་ཨིན་རུང་ ཕྲ་ལམ་དེ་ མང་སུ་སྦེ་ བསྡུ་སྟེ་སྡོད་འོང་།

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

རྩོད་བཤེར་གྱི་ བརྒྱུད་འཕྲིན་ནང་ འབྲེལ་བ་འཐབ་མིའི་གྱངས་ཁ་མཐོ་ཤོས་ཅིག་ཨིན།

ཚད་ཆུང་བ་འདི་ དུས་མཐུན་བཟོ་ནིའི་དུས་ཚོད་ཡུན་རིངམ་སྦེ་འགྱོ་དོ་ཡོདཔ་ཨིན་རུང་ ཕན་ཐོགས་ཅན་ཅིག་ཨིན། ཁྱོད་ཀྱིས་པིག་ཊཱོན་རླག་སྟོར་ཆེ་དྲགས་ཡོད་པ་ཅིན་།

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

འདྲན་འདྲ་ཚུ་གི་བར་ན་ ཚོང་འབྲེལ་འཐབ་པའི་བསྒང་རང་ འཕྲོག་བཤདཔ་ཀྱི་དུས་ཚོད།

འཕྲལ་འཕྲལ་གཏམ་བཤད་ནི་གིས་ དུས་ཡུན་ཐུང་ཀུ་བཟོ་དོ་ཡོདཔ་ཨིན་རུང་ ཕྲ་ལམ་དེ་ མང་སུ་སྦེ་ བསྡུ་སྟེ་སྡོད་འོང་།

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

དུས་ཡུན་དེ་ འདྲན་འདྲ་མཉམ་འབྲེལ་མེད་པ་ཅིན་ མཐུན་རྐྱེན་མཇུག་བསྡུ་བའི་ཤུལ་ལས་ཨིན།

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

[Torii ཚད་མཇུག་གི་ཐིག་ཁྲམ་](/dz/reference/torii-endpoints.md)གིས་ ངོས་ལེན་འབད་ཡོད་པའི་ raw request bodyནང་ལུ་ byte མང་ཤོས་ཅིག་ཨིན་མས།

འ་ནི་ཚད་འཛིན་འདི་ DOS གནོད་སྐྱོན་ཚུ་ བཀག་ཐབས་ལུ་ལག་ལེན་འཐབ་ཨིན།

<param-table>
<template #type>

ཨང་གྲངས་ (byte ཚུ་)

</template>
<template #default-value>

`64_000_000` (ཡ་འབུམ་༦༤ byte)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

དོ་ཚོང་ཁང་ནང་ལུ་ དྲི་བཀོད་འབད་མ་བཏུབ་པའི་དུས་ཚོད་འདི་ཨིན།

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

ལག་ལེན་པ་གཅིག་གི་དོན་ལུ་ ཐད་ཀར་དུ་དྲི་བའི་གྱངས་ཁ་གི་ཐོ་བཀོད་ཚད་མཐོ་སའི་མཐའ་མ་

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

string, ཚད་གཞི་ཚུ་:

- `TRACE`: དམའ་ས་གནས་ཚད་ཀྱི་ལས་སྣ་ཚུ་རྩིས་ཏེ་ ལས་རིམ་ག་ར་།
- `DEBUG`: ཌེ་བི་གེ level message འདི་ diagnostics ལུ་ཕན་ཐོགས་ཡོདཔ་ཨིན།
- `INFO`: སྤྱིར་བཏང་ བརྡ་དོན་བརྡ་འཕྲིན་ཚུ་
- `WARN`: ཉེན་བརྡ་ཚུ་གིས་ དཀའ་ངལ་འབྱུང་ནིའི་ བརྡ་དོན་ཚུ་སྟོན་དོ་ཡོདཔ་ཨིན།
- `ERROR`: རང་བཞིན་གྱི་ལཱ་ལུ་གནོད་འཚེ་བཀལ་རུང་ འཕྲོ་མཐུད་དེ་ར་ འབད་ཚུགསཔ་བཟོ་མི་འཛོལ་བ་ཚུ་ཨིན།

ཁྱོད་ཀྱིས་ལག་ལེན་གྱི་ཐད་ལུ་ འོས་འབབ་ཡོད་པའི་གནས་ཚད་འདི་ གདམ་ཁ་རྐྱབས། ཐོ་བཀོད་གི་གནས་ཚད་ཁྱད་པར་ཅན་ཚུ་ ག་དེ་སྦེ་ལག་ལེན་འཐབ་ནི་ཨིན་ནའི་ལྷག་པའི་གསལ་བཤད་ཚུ་གི་དོན་ལུ་ [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) ལུ་བལྟ་དགོ།

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

::: tip འགྲུལ་བསྐྱོད་དུས་ཡུན་ ད་ལྟོའི་གནས་གོང་

གནད་དོན་འདི་ Torii ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ Runtime Configuration Update འབད་ནི་ལུ་བསྟུན་ཨིན།

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level)ལས་ལྷག་པའི་ ལེགས་སྦྱར་ཅན་གྱི་ཐོ་ཡིག་བརྟག་དཔྱད་ཐིག་ཁྲ། དམིགས་གཏད་རེ་ལུ་ ཐོ་བཀོད་འབད་ནིའི་ཚིག་དོན་ཚུ་ རང་ལུགས་བཟོ་བཅོས་འབད་ཚུགས།

<param-table type=string env=LOG_FILTER>
<template #type>

string འདི་ ཀོ་མ་གིས་སོ་སོར་སྦེ་དབྱེ་བ་ཕྱེ་མི་ འབྲི་ཤོག་གཅིག་ ཡང་ན་ མང་ཤོས་ཅིག་ལས་གྲུབ་ཨིན། འབྲི་ཤོག་རེ་རེར་ འོས་འབབ་ཅན་གྱི་ ཚིག་ཡིག་གི་གནས་ཚད་ཡོདཔ་ད་ འདི་གིས་ (དཔེར་ན་ གདམ་ཁ་རྐྱབས་ནི་) བར་མཚམས་དང་བྱུང་རྐྱེན་ཚུ་འདྲ་མཉམ་འབད་ཚུགསཔ་ཨིན། Iroha གིས་ དམིགས་བསལ་གྱི་གནས་ཚད་ཚུ་ (དཔེར་ན་ `trace` ཡང་ན་ `info`) ཟེར་བརྩིས་ཏེ་ ཚིག་གི་ཚིག་མང་ཤོས་ཅིག་ཨིནམ་ལས་ དམིགས་བསལ་ཆེ་བའི་གནས་ཚད་ཚུ་ ༼དཔེར་ན་`error` ཡང་ན་ `warn`) ཨིན་པས།

གནས་ཚད་མཐོ་ཤོས་ཅིག་ནང་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ བཅའ་ཡིག་ཚུ་ ཡན་ལག་དུམ་གྲ་ཅིག་སྦེ་བཀོད་ཡོདཔ་ཨིན།

```
target[span{field=value}]=level
```

བརྡ་དོན་ལྷག་མ་ཚུ་གི་དོན་ལུ་ [`tracing-subscriber` ཡིག་སྣོད་](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html)བལྟ་དགོ།

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

::: info [`logger.level`](#param-logger-level) དང་མཉམ་སྦྱོར་ལག་ལེན།

`logger.filter`གིས་ [`logger.level`](#param-logger-level)དང་གཅིག་ཁར་ལཱ་འབད་དོ་ཡོདཔ་ལས་ གཅིག་གིས་གཅིག་ལུ་ཡང་ མགུ་མཐུད་མ་རྐྱབ་པར་ཡོདཔ་ཨིན།

དཔེར་ན་: `logger.level` གཞི་སྒྲིག་འབདཝ་ཨིན། `INFO` དང་ `logger.filter` གཞི་སྒྲིག་འབདཝ་ཨིན། `iroha_core=debug`, འགྲུབ་ཚུགས་མི་ ཕི་ལཊར་ གཞི་སྒྲིག་འདི་ཨིན། `info,iroha_core=debug` འདི་འབདཝ་ལས་ `info` ཚད་གཞིའི་དོན་ལུ་། `debug` དོན་ལུ་ `iroha_core`).

:::

::: tip འགྲུལ་བསྐྱོད་དུས་ཡུན་ ད་ལྟོའི་གནས་གོང་

གནད་དོན་འདི་ Torii ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ Runtime Configuration Update འབད་ནི་ལུ་བསྟུན་ཨིན།

:::

### `logger.format` {#param-logger-format}

ཐོ་བཀོད་བཟོ་ཐབས།

<param-table default-value=full env=LOG_FORMAT>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `full`: default formatter འདི་བྱུང་བའི་གནད་དོན་རེ་གི་དོན་ལུ་ མི་གིས་ཀློག་ཚུགས་པའི་ ཐིག་ཁྲམ་ཐོ་བཀོད་རྐྱང་གི་ཐོ་ཡིག་ཚུ་བཏོན་དོ་ཡོདཔ་ད་ ད་ལྟོའི་དུས་ཡུན་གྱི་གནས་སྟངས་དེ་ གནད་དོན་འདི་གི་ འདྲ་བཤུས་བཟོ་ཡོད་པའི་ཧེ་མར་སྟོན་འབདཝ་ཨིན།
- `compact`: ཌེ་པཱལ་ཊར་བཟོ་ཐིག་གི་འགྱུར་སྒྲིག་ཅིག་ཨིནམ་ད་ ཚེ་རིང་ཐུང་ཀུ་ཚུ་གི་དོན་ལུ་བཟོ་བཅོས་འབད་ཡོདཔ་ཨིན། ད་ལྟོའི་རིང་ཚད་ཀྱི་གནས་སྟངས་ནང་ལས་ Fields འདི་ formatted event གི་ས་ཁོངས་ཚུ་ནང་བཀབ་སྟེ་ཡོདཔ་ལས་ span གི་མིང་འདི་སྟོན་མི་བཏུབ་ཨིན། Verbosity level འདི་ཡིག་འབྲུ་གཅིག་སྦེ་ བསྡོམས་ཏེ་ཡོདཔ་ཨིན།
- `pretty`: ཚད་ལས་ལྷག་པའི་མཛེས་སྡུག་ཅན་གྱི་ ལེའུ་མང་རབས་ཀྱི་ ཐོ་བཀོད་ཐོ་བཀོད་འདི་ མི་གིས་ཀློག་ཚུགསཔ་བཟོཝ་ཨིན། འདི་ངོ་མ་རང་ ས་གནས་གོང་འཕེལ་ནང་ལུ་ ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ཨིན། ཌེ་བི་གེསི་ (debugging) ཡང་ན་ བཀའ་རྒྱ་གི་གྲལ་ཐིག་གི་ལག་ལེན་ཚུ་གི་དོན་ལུ་ འདི་ནང་ལུ་ རང་བཞིན་གྱི་དཔྱད་ཡིག་དང་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཐོ་ཡིག་ཚུ་ ཨེབ་གཏང་འབད་ནི་འདི་ ཀློག་ཚུགས་ནི་དང་ མཐོང་སྣང་ལུ་ གནོདཔ་མ་བཀལ་བའི་ལས་ དམིགས་གཏད་ཉུང་ཤོས་ཅིག་ཨིན།
- `json`: Newline-delimited JSON logs བཟོ་སྐྲུན་འབད་ཐབས། འདི་གིས་བཟོ་སྐྲུན་གྱི་དོན་ལུ་ལག་ལེན་འཐབ་ནི་ཨིནམ་ད་ སྒྲིག་གཞི་བཟོ་བཀོད་ཅན་གྱི་ logsཚུ་ དབྱེ་ཞིབ་དང་མཐོང་ཐངས་ཀྱི་ཐོག་ལས་ JSON སྦེ་ལག་ལེན་འབད་དོ་ཡོདཔ་ཨིན། JSON ཐོན་སྐྱེད་འདི་ མི་གིས་ལྷག་ཚུགསཔ་འབད་ནི་ལུ་མ་བཏུབ་ཨིན།

ཞིབ་འཇུག་དང་ བརྟག་དཔྱད་ཐོན་སྐྱེད་ཚུ་གི་དོན་ལུ་ [`tracing-subscriber` ཡིག་སྣོད་](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html) ལུ་བལྟ་དགོ།

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

Kura འདི་ Iroha གི་རྒྱུན་མ་ཆད་པར་བཞག་སའི་སྣུམ་འཁོར་ཨིན་ (Japanese for warehouse) ។

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

མཐའ་མའི་ཨང་གྲངས་ N འདི་ དྲན་ཐོའི་ནང་བཞག་འོང་།

ཌི་སི་ཀིསི་ནང་ལས་ དགོས་མཁོ་ཡོད་པ་ཅིན་ ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཨེབ་གཏང་འབད་ནི་ཨིན།

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

Kura འགོ་འདྲེན་འཐབ་ནིའི་ལམ་ལུགས་ `strict` འདི་ ပုံမှန်དང་ སྔོན་སྒྲིག་གི་ལམ་ལུགས་ཨིན། འདི་གིས་ ཀ་ནོ་ཌིཀའི་ལོ་ནི་ཀ་, བསྐྱར་གསོ་འབད་ཡོད་པའི་ལག་ཆས་ཚུ་, གྲོགས་རམ་ཅན་གྱི་ཐོ་ཡིག་ཚུ་, དེ་ལས་ མཚམས་འཇོག་རྩིས་ཁྲ་འདི་ node ཤུགས་བསྐྱེད་པའི་ཧེ་མར་ ཆ་མེད་གཏང་འོང་།

`fast` འདི་གི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་ ཞབས་ཏོག་ཉམས་བཅོས་འབད་ནིའི་ ཐབས་ལམ་ཨིན་ དེ་བསྒང་ འགོ་འདྲེན་འཐབ་པའི་བརྟག་དཔྱད་མཇུག་བསྡུཝ་ད་ བཀྲམ་སྤེལ་འབད་ནི་ལུ་ ཉེན་ཁ་ཡོདཔ་ཨིན། འདི་གི་དོན་ལུ་ སྔོན་འགོག་ཐོག་ལས་ གཞི་བཙུགས་འབད་མི་ `strict` དེ་ལས་ ད་རེས་ནངས་པར་ snapshot བཟོ་སྐྲུན་འབད་དོ་ཡོདཔ་ད་ འདི་ནང་ལུ་ དངོས་རིགས་༥ པོ་དེ་རང་ཡོདཔ་ཨིན། `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, དང་ `snapshot.merkle.json`. ས་ཁོངས་སོ་སོ་སྦེ་སྦྲེལ་འབད་ཡོད་པའི་ལག་ལེན་པ་གི་རྟགས་མཚན་གྱིས་ གསལ་བསྒྲགས་འབད་མི་ ཁེ་ཕན་གྱི་ཡོ་བྱད་དང་ ཚད་འཛིན་ཅན་གྱི་ཡིག་གཟུགས་ཚུ་ གཅིག་ཁར་བསྡོམས་འབདཝ་ཨིན། བརྡ་བཀོད་འདི་ ཕན་ཐོགས་ཅན་གྱི་མཁོ་ཆས་ཀྱི་རིང་ཐུང་དང་ ཅ་ལ་/དྲ་རྒྱ་གི་ངོ་རྟགས་ དེ་ལས་ ཐའི་མི་ཊར་མཐོ་ཚད་ (hash) ཚུ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན། SCCP སྲིད་བྱུས་ཧེཤ་དང་ bootstrap lineage ཡོད་པའི་. Fast འདི་ bootstrap མེདཔ་བཟོཝ་ཨིན། བཟའ་ཚང་དང་ ཚད་འཛིན་/གྲངས་རྩིས་/མཐར་ཐུག་གི་མཐའ་མཚམས་འདི་ དཀའཝ་སྤྱད་མི་ལས་འདྲན་འདྲ་སྦེ་དགོཔ་ཨིན། Kura. ཨང་དང་པ་ཐོན་མི་ མཚམས་སྦྱོར་ཚུ་ འདི་བཟུམ་གྱི་ལག་ཆ་༥ ཆ་མཉམ་ལུ་ ངོས་ལེན་འབད་ཞིནམ་ལས་ གཞན་གྱི་ལག་ཆ་གྲངས་རྩིས་དང་ ཡིག་སྣོད་གི་མིང་སྡེ་ཚན་ཚུ་ ཆ་མེད་གཏང་ཡོདཔ་ཨིན།

མིང་ལྔ་དང་ metadata ཚུ་མགྱོགས་དྲགས་སྦེ་བཙུགསཔ་ཨིན། ཕན་ཐོགས་ཅན་གྱི་ཡིག་སྣོད་དང་ Merkle ཡིག་སྣོད་ཚུ་བསྡམས་ནི་ཨིན་རུང་ བསྐྱར་ཞིབ་འབད་མ་ཚུགས། ཧེཤ་ཡཱན། སྣ་ཚོགས། ཡང་ན་ དཀའཝ་སྤྱད་མ་ཚུགས། ཨང་གྲངས་ཉུང་མཐའ་ World/Nexus བཟོ་ནི་ དེ་ལས་ཧེཤ་ prefix Kura འདི་ ཀློག་རྐྱང་སྦེ་བཟོ་ཞིནམ་ལས་ snapshot World, block-hash array ཚོང་འབྲེལ་གྱི་ལོ་རྒྱུས། འབྱུང་ཁུངས་དང་ ཡུན་བརྟན་བསྐྱར་གསོ་གི་དུས་དེབ་ཚུ་ སྒོ་བསྡམ་བཞག་ཡོདཔ་ཨིན། Merkle, canonical དང་ semantic snapshot audits, historical block/finality/SCCP reconciliation, Sumeragi active-height recovery, merge and query journals, lane manifest/compliance sources Kura གིས་ རྒྱབ་སྐྱོར་འབད་མི་ SoraFS ཡིག་སྣོད་ཚུ་དང་ ཉམས་བཅོས་འབད་ཡོད་པའི་གནས་སྡུད་རྩིས་ཐོ་བཀོད་དང་ གདམ་ཁ་ཅན་གྱི་ ཞབས་ཏོག་མཐུན་རྐྱེན་ཚུ་ འཕྲལ་མཐུད་དེ་ར་ བཏོན་གཏང་ནི་ཨིན་པས། ས་གནས་ཀྱི་ཚོང་འབྲེལ་གྱི་ འཛུལ་ཞུགས་, གྲོས་འདེབས་, ཚོགས་རྒྱན་བཙུགས་ནི་, ཀ་ནོ་སི་ཡིག་སྣོད་དང་ རྒྱབ་སྐྱོར་ བཟོ་སྐྲུན་འབད་མི་ཚུ་ འཕྲལ་མཐུད་སྦེ་ར་ མེདཔ་ཐལ་དོ་ཡོདཔ་ཨིན། Kura འདི་རང་གིས་རྩོམ་སྒྲིག་པ་འགོ་འབྱེད་དང་ ཡུན་བརྟན་པའི་འགྱུར་བཅོས་ཚུ་མ་བཏུབ་; pipeline དང་ FASTPQ persistence queues གིས་ ལཱ་འདི་ འཕྲལ་མགྱོགས་ར་མ་བཏུབ་པར་བཞག་ནི་དང་ ཡང་ན་ ཨེབ་གཏང་འབད་ནི་ལུ་མ་བཏུབ་ཨིན། Kura ཀློག་ཐེངས APIs འདི་ཡང་ཉམས་བཅོས་དང་ ཡུན་བརྟན་གནས་སྟངས་ཚུ་ བཏོན་མ་ཚུགསཔ་བཟོ་: གནས་སྐབས་ཀྱི་ སྣུམ་འཁོར་ལམ་བདའ་སྟེ་འགྱོ་མི་ཚུ་ལུ་ གོང་འཕེལ་གཏང་ནི་མེད་, ལམ་སྟོངམ་མེད་པའི་ལག་ཆས་ཚུ་ དཔར་བསྐྲུན་འབད་ནི་མེད་, དེ་ལས་གོང་འཕེལ་གྱི་བར་ཆད་ཚུ་ བཏང་མི་ཚུགས། Sumeragi དང་ཚོང་འབྲེལ་གི་གཏམ་ངན་འདི་ འགོ་འདྲེན་འཐབ་མི་མེདཔ། Torii གིས་ གསོ་བའི་གནས་སྟངས་དང་ བདེ་སྲུངཔ་ དེ་ལས་ གྲ་སྒྲིག་གི་ལཱ་ཚུ་རྐྱངམ་གཅིག་བཏོན་དོ་ཡོདཔ་ཨིན། API - འདྲ་བཤུས་, གནས་གོང་, ཐིག་ཁྲམ་ དེ་ལས་ སྤྱིར་བཏང་གནས་སྟངས་/ལོ་རྒྱུས་ཀྱི་ལམ་ལུགས་ཚུ་ ལག་ལེན་མ་འཐབ་པར་ བཞག་དོ་ཡོདཔ་ཨིན། གྲ་སྒྲིག་འབད་ནི་འདི་ དམ་དམ་སྦེ་ ལོག་འགོ་བཙུགས་ཚུན་ཚོད་ ལག་ལེན་མ་བཏུབ་ཨིན།

`fast` འདི་ བྱ་སྟབས་མ་བདེཝ་ཅིག་གི་དོན་ལུ་རྐྱངམ་གཅིག་ལག་ལེན་འཐབ་ཨིན། ཞབས་ཏོག་འདི་སྒྲིང་སྒྲི་སྦེ་ཡོདཔ་ད་ གློག་ཐིག་དེ་ བཀག་བཞག་ཞིནམ་ལས་ `strict` སླར་ལོག་འབད་ཞིནམ་ལས་ ལོག་འགོ་བཙུགས་ཏེ་ བསྐྱར་གསོ་འབད་ནིའི་དོན་ལུ་ བསྐྱར་ཞིབ་དང་ ཚད་འཛིན་བསྐྱར་བཟོའི་ལཱ་ཚུ་ འགོ་འདྲེན་འཐབ་པའི་ཧེ་མ་ སེལ་འཐུ་འབད། Fast mode གིས་ deferred merge log དགོས་མཁོ་མ་བྱིནམ་མ་ཚད་ canonical storage བཟོ་སྐྲུན་འབད་ནི་དང་ ཉམས་བཅོས་འབད་ནི་དང་ truncate འབད་ནི་དང་ ནང་འདྲེན་འབད་ནི་མེད་; དཔར་བསྐྲུན་མ་འབད་བར་ཡོད་མི་ suffixes དང་ pending auxiliary recovery stage འདི་ཚུ་ བསྐྱར་ཞིབ་འབད་ནི་དང་ mutated འབད་ནི་མེད་པར་སྣང་མེད་བསྐྱུར་ཏེ་ Restrict Recovery གི་དོན་ལུ་བཞག་ནུག ཨེབ་གཏང་འབད་ཡོད་པའི་ ཧེཤ་རྐྱངམ་ཅིག་ཨིན་མི་ གློག་བརྙན་ཕྲ་རིང་གི་ཐོ་བཀོད་འདི་ ལག་ལེན་མ་འཐབ་པར་ བཞག་ཡོདཔ་ཨིན། དུས་རྒྱུན་གྱི་གློག་བརྙན་འཕྲོས་འཕྲོས་འཕྲོད་མེད་ ཡང་ན་ ཆ་མེད་བཏང་མི་འདི་ མགྱོགས་པ་ར་རང་ བསྒྱུར་བཅོས་འབད་ནི་ཨིན། དུས་ཡུན་ཐུང་ཀུ་འདི་ ཡང་ཅིན་ དུས་རབས་ཀྱི་བསྐྱར་བཟོའི་ནང་ ལོག་འགྱོ་མི་ཚུགས།

<param-table default-value=strict>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `strict`: བརྟན་ཏོག་ཏོ་སྦེ་བཟོ་ནི་དང་ བཟོ་སྐྲུན་འབད་ཐངས་ཚུ་
- `fast`: ཉེན་སྲུང་ཅན་གྱི་ལཱ་འགོ་བཙུགས་ནི་དང་ བཟོ་སྐྲུན་དེ་ བསྐྱར་འགོ་མ་བཙུགས་ཚུན་ཚོད་ ཟུར་བཞག་འབད་དོ་ཡོདཔ་ཨིན།

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

སྦྲག་ཚུ་བཞག་སའི་ཐོ་ཡིག་[^paths] གསལ་བཀོད་འབདཝ་ཨིན།

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

སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 10 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 5 སྔོན་ལ་གསར་བཅོས་བྱས།

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

ལག་ལེན་འཐབ་མི་གཅིག་གི་དོན་ལུ་ གྱངས་ཁ་ཐུག་ལུ་སྒུག་སྡོད་མིའི་ ཚོང་འབྲེལ་གྱི་གྱངས་ཁ་གི་མཐོ་སའི་མཐའ་མ་ཨིན།

ཁྱོད་ཀྱིས་ འ་ནི་ གདམ་ཁ་འདི་ ལག་ལེན་འཐབ་སྟེ་ མཚམས་འཇོག་འབད་ཐབས།

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ཚོང་འབྲེལ་འདི་ དུས་ཡུན་དེ་གི་ཤུལ་ལས་ ཆ་མེད་གཏང་འོང་ ག་དེམ་ཅིག་སྦེ་ གྱངས་ཁ་མ་ཆད་པར་སྡོད་པ་ཅིན་ཨིན།

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi Soft-fork handling paths ཚུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ Debug-only switch བཏོན་གཏང་། འདི་སེལ་འཐུ་འབད་ཡོད་པའི་བརྟག་དཔྱད་ཀྱི་ཕྱི་ཁར་བཞག་གནང་། དོ་འགྲན་འབད་མི་ བཟོ་སྐྲུན་ཁ་ཐོ་བཀོད་ནང་ལུ་འདི་བསྒྱུར་བཅོས་འབད་ནི་དེ་གིས་ གྲྭ་ཚང་ཚུ་གིས་མཐུན་ལམ་གྱི་ བྱ་སྤྱོད་ལུ་ ངོས་ལེན་མ་ཚུགསཔ་བཟོཝ་ཨིན།

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus ཨ་ཏོ་མ་གི་ སྒེར་གྱི་མཐུན་རྐྱེན་ {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` གིས་ `AtomicPrivateSettlementV1` ཕྲང་ལམ་སོ་སོ་ བཏོན་དོ་ཡོདཔ་ཨིན། འདི་མ་བཏུབ་བཟོཝ་ཨིན། `enabled = true` གཞི་སྒྲིག་འབད་ནི་ལུ་ཡང་ `activation_height` དགོཔ་ཨིན། འཛུལ་ཞུགས་འབད་ཐངས་འདི་ སྒོ་བསྡམས་ནི་མེད་པ་ཅིན་ ལྕགས་ཐག་གི་ནང་ཡོད་པའི་ལྕོགས་གྲུབ་, དྲན་གསོའི་དུས་ཡུན་, རྟག་བརྟན་བདེན་ཁུངས་ཀྱི་ཡིག་གཟུགས་དང་ pool/auditing governance དེ་ཚུ་ ལག་ལེན་འཐབ་མ་ཚུགས།

མང་ཤོས་ཀྱི་མཐའ་མཚམས་འདི་ `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, དང་ `sidecar_max_total_bytes`. `capsule_padding_classes_bytes`  strictly ཡར་སེང་འབད་དོ་ཡོད་པའི་ subsets གི་ V1 བཀྲམ་སྤེལ་གྱི་ཆོས་ཚན་ཚུ་ `permitted_policy_versions` ཆ་མེད་གཏང་ནི་རྐྱངམ་གཅིག་ V1.

`max_capsule_bytes` གིས་ `PrivateSettlementAuditCapsuleV1` སྦྱིས་ཚང་གི་ Norito bytes འདི་རྩིས་ཏེ་ AAD, nonce, ciphertext, vector framing དང་DEK གྱལ་སྒྲོམ་ནང་ལུ་ཨོ་ཌི་ཊར་ཡོངས་བསྡོམས་འབད་མི་དེ་ བཏོན་དོ་ཡོདཔ་ཨིན། འདི་གིས་ code-textརྐྱངམ་ཅིག་མེདཔ། ཐོ་བཀོད་འབད་ཡོད་པའི་ བཀྲམ་སྤེལ་གྱི་སྡེ་ཚན་ག་ར་གིས་ ཉུང་ཤོས་ར་ `default_min_auditor_approvals` ལྟ་རྟོག་པ་ཚུ་གི་དོན་ལུ་ རང་བཞིན་གནས་སྟངས་ཀྱི་ ཕུན་ཚོགས་གླིང་གི་ཁེབས་ནང་ འཛུགས་སྐྱོང་འབད་དགོཔ་ཨིན། འདི་ཡང་ ངོས་ལེན་གྱི་སྒྲིག་གཞི་འདི་ ཁྲིམས་ལུགས་ཅན་ཅིག་ཨིན་: Torii གིས་ `min_approvals` གི་གོང་ཚད་དམའ་བ་ཡོད་མི་ ཆ་འཇོག་གྲུབ་མི་ སྲིད་བྱུས་ཅིག་ལུ་ ཁ་བཟེད་དོ་ཡོདཔ་མ་ཚད་ དངོས་སུ་ཅན་གྱི་ ཕུན་སུམ་ཚོགས་པའི་ capsule ཚུ་ ཀན་ནོ་ནི་ཀཱན་གྱི་ byte limit ལས་བརྒལ་སྦེ་ ཆ་མེད་གཏང་ཡོདཔ་ཨིན།

འ་ནི་སྒྲིག་གཞི་ཚུ་ནང་ བཟོ་སྐྲུན་མཐའ་འཁོར་གྱི་འགྱུར་ལྡོག་ཅན་གྱི་ སི་ཊི་བཱསི་མེད་ཡོདཔ་ཨིན། སྒྲིག་ལམ་གྱི་དཔེ་དང་ལག་ལེན་གྱི་ དགོས་མཁོ་ཚུ་གི་དོན་ལུ་ [Run Atomic Private Cross-Dataspace Settlement](/dz/get-started/atomic-private-settlement) ལུ་བལྟ་དགོ། ཐབས་ལམ་འདི་ གསལ་བཀོད་འབད་ཡོད་པའི་ ཕྱི་ཁའི་ཐར་ཐོ་བཀོད་སྒོ་ར་མ་འགྱོ་བའི་བར་དུ་ བཟོ་སྐྲན་ལུ་འོས་འབབ་མེད་ཨིན།

## གློག་བརྙན་འདི་ {#snapshot}

ལས་འགན་འདི་ [World State View](/dz/blockchain/world#world-state-view-wsv) གི་གློག་བརྙན་ཚུ་ལྷག་སྟེ་བྲིས་ནི་ཨིན་མས།

Snapshots གིས་ World State View གི་ བརྟག་དཔྱད་སྒོ་ར་རིམ་སྒྲིག་སྦེ་བཞག་ཡོདཔ་ལས་ peer གྱིས་ Kura ལས་ блокརེ་ཡང་ ལོག་གློག་བརྙན་མ་རྐྱབ་པར་ ལོག་འགོ་བཙུགས་ཚུགས། Kura འདི་ལོག་གློག་བརྙན་གྱི་དོན་ལུ་ དཀའཝ་སྤྱད་ཚུགས་པའི་ ཨེབ་རྟ་དང་བདེན་པའི་འབྱུང་ཁུངས་ཨིན། snapshots འདི་མགྱོགས་དྲགས་འབད་ནི་གི་ལམ་ཨིན། འགོ་བཙུགས་པའི་སྐབས་ལུ་ Iroha གིས་ སྒྲིག་གཞི་སྒྲིག་འབད་ཡོད་པའི་ ལྕགས་ཐག་དང་ བཀྲམ་སྤེལ་འབད་ཡོད་མི་ སྦྲག་ཚུ་དང་གཅིག་ཁར་ གློག་བརྙན་འདི་གློག་བརྙན་ནང་ལུ་ བཙུགས་ནི་ཨིན་ན་ ཡང་ན་ ལོག་སྤྱོད་འབད་ནི་ཨིན་ན་ ཐག་བཅད་པའི་ཧེ་མར་ གློག་བརྙན་གྱི་ metadata འདི་བརྟག་དཔྱད་འབདཝ་ཨིན།

::: tip གློག་བརྙན་ཚུ་སེལ་འཐུ་འབད།

གལ་སྲིད་ snapshots གི་ལམ་ལུགས་ནང་ལུ་ གནད་དོན་ག་ཅི་ཡང་མ་བདེཝ་ཡོད་པ་ཅིན་ ཁྱོད་ཀྱིས་གློག་བརྙན་ཚུ་གི་ཐད་ལུ་ སྟོངམ་སྦེ་ཡོད་པའི་ཤོག་ལེབ་ནང་ལས་ འགོ་བཙུགས་དགོ་པ་ཅིན་ [`snapshot.store_dir`](#param-snapshot-store-dir)གིས་བཀོད་མི་ directory འདི་བཏོན་གཏང་ཚུགས།

:::

### `snapshot.mode` {#param-snapshot-mode}

གློག་བརྙན་གློག་བརྙན་འཛིན་སྐྱོང་ལམ་ལུགས་ནང་ལུ་ ལཱ་འབད་ཐངས་

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `read_write`: Iroha གིས་ [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)གིས་གསལ་བཀོད་འབད་ཡོད་པའི་དུས་ཡུན་ལུ་ snapshots བཟོ་དོ་ཡོདཔ་ཨིན། འགོ་བཙུགས་པའི་བསྒང་ལས་, Iroha གིས་གནས་གོང་ཅན་གྱི་ snapshot (ག་ཡོད་ཡོད་པ་ཅིན་) ཀློག་ཞིནམ་ལས་ blocks སྒྲིང་སྒྲི་ཚུ་དང་གཅིག་ཁར་ ད་ལྟོའི་གནས་སྟངས་ནང་ཡོདཔ་ཨིན་ན་ བརྟག་ཞིབ་འབདཝ་ཨིན།
- `readonly`: `read_write`དང་འདྲཝ་ཨིན་རུང་ Iroha གིས་ snapshots ག་ནི་ཡང་ བཟོ་མི་ཚུགས།
- `disabled`: Iroha གིས་གློག་བརྙན་གསརཔ་ཚུ་ བཟོ་མི་ཡང་ན་ འགོ་བཙུགས་པའི་བསྒང་ལས་ཡོད་པའི་གློག་འཕྲིན་ཚུ་ ཀློག་མི་ཚུགས།

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

གློག་བརྙན་འཕྲོ་བརླག་གཏང་ཐངས་ཚུ་

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

གློག་བརྙན་ཚུ་བཞག་སའི་ཁ་བྱང་།

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

ཊེ་ལི་མེ་ཏྲི་གིས་ འདྲན་འདྲ་གི་བརྟག་དཔྱད་ཚུ་ ཕྱི་ཁའི་ ཊེ་ལེ་མེ་ཊིརི་སྒྲོམ་ལུ་ བཏང་དོ་ཡོདཔ་ཨིན། `telemetry.name` དང་ `telemetry.url` གཉིས་ཆ་ར་ འདྲན་ཚད་ཅིག་གིས་ སྒྲོམ་ཅིག་ལུ་ སྙན་ཞུ་འབད་དགོ་པའི་སྐབས་ རྩ་སྒྲིག་འབད། ཊེ་ལོ་མི་ཊིརི་ལག་ལེན་འཐབ་མ་བཏུབ་པའི་སྐབས་ ཆ་ཤས་འདི་སེལ་འཐུ་འབདཝ་ཨིན།

`name`དང་ `url` ཚུ་བསྡོམས་འབད་དགོཔ་ཨིན།

`telemetry` ཆ་ཤས་འདི་ གདམ་ཁ་རྐྱབས་ཅིག་ཨིན།

### `telemetry.name` {#param-telemetry-name}

གློག་ཐག་ར་བ་ནང་ ཚད་འཛིན་འབད་ནིའི་དོན་ལས་ མཚམས་འཇོག་འབད་དགོ་པའི་ node གི་མཚན་འདི་ཨིན།

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

མཐུད་སྦྲེལ་མ་འབད་བའི་ཧེ་མ་ བསྒུག་དགོ་པའི་ དུས་ཡུན་ཉུང་ཤོས་ཅིག་ཨིན།

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

མཐུད་སྦྲེལ་གྱི་བར་ན་ དུས་ཡུན་ཐུང་ཀུ་ཡར་སེང་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་མི་ ཨང་གྲངས་ ༢ གི་མཐའན་མཇུག་གི་གྱངས་ཁ་དེ་ཨིན།

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

འདི་ནང་ལུ་ dev-telemetry འབྲི་ནིའི་དོན་ལུ་ filepath

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
