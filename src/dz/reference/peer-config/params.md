---
translation_locale: dz
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
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

སླར་ལོག་འཐབ་ནི་དེ་ བརྒྱུད་འཕྲིན་ལག་ལེན་འདི་ ཕྱིར་བཏོན་འབད་ནིའི་ཐབས་ལམ་ཨིན། `chain` འདི་བཀོད་རྒྱ་ཅན་གྱི་ལག་ལེན་གྱི་འགན་ཁུར་གི་ཆ་ཤས་ཅིག་ཨིནམ་ལས་ ཐིག་ཁྲམ་གཅིག་གི་དོན་ལུ་བཀོད་རྒྱ་འབད་མི་ལག་ལེན་འདི་ གཞན་ཐིག་ཁྲམ་ ID ལག་ལེན་འཐབ་མི་མཉམ་འབྲེལ་ཚུ་གིས་ ཆ་མེད་བཏང་དོ་ཡོདཔ་ཨིན་པས།

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

གྲྭ་ཚང་གི་ཐིག་ཁྲམ་ཚུ་ ལག་ལེན་འཐབ་ཨིན། `PUBLIC_KEY@ADDRESS` ཌའི་ལེནདེ་ P2P ཡི་གུ་ཤེས་པའི་སྐབས་ལག་ལེན་འཐབ་; bare `PUBLIC_KEY` འདི་ཡང་ཆ་ལེན་འབད་ཡོདཔ་མ་ཚད་ ཕོག་གཏམ་ནང་ལས་ རྭ་ཚང་གི་ཁ་བྱང་འདི་མཐོང་ཚུགསཔ་བཟོཝ་ཨིན།

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

## མཐུན་རྐྱེན་ཚུ་ {#network}

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

དོ་ཚོང་ཁང་ནང་ལུ་ དྲི་བཀོད་འབད་མ་བཏུབ་པའི་དུས་ཡུན་འདི་ཨིན།

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

string འདི་ ཀོ་མ་གིས་སོ་སོར་སྦེ་དབྱེ་བ་ཕྱེ་མི་ འབྲི་ཤོག་གཅིག་ ཡང་ན་མང་ཤོས་ཅིག་ལས་གྲུབ་ཨིན། འབྲི་ཤོག་རེ་རེའི་ནང་ ཁ་གསལ་གྱི་གནས་ཚད་མཐོ་ཤོས་ཡོད་མི་དེ་ འོས་འབབ་ཡོདཔ་ལས་ (དཔེར་ན་ གདམ་ཁ་རྐྱབས་ནི་) དུས་ཡུན་དང་བྱུང་རྐྱེན་ཚུ་འདྲ་མཉམ་བཟོ་ཚུགས། Iroha གིས་ དམིགས་བསལ་གྱི་གནས་ཚད་ཉུང་སུ་ཅིག་ (དཔེར་ན་ `trace` ཡང་ན་ `info`) ཟེར་བརྩིས་ཏེ་ མཚམས་འཇོག་འབད་དོ་ཡོདཔ་ལས་ ཚིག་མཐུན་ཆེ་བའི་གནས་ཚད་ཚུ་ (དཔེར་ན། `error` ཡང་ན་ `warn`) ཟེར་ཨིན་པས།

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

::: info [`logger.level`](#param-logger-level)དང་མཐུན་ཚུགསཔ་བཟོ་ནི།

`logger.filter`གིས་ [`logger.level`](#param-logger-level)དང་གཅིག་ཁར་ལཱ་འབད་དོ་ཡོདཔ་ལས་ གཅིག་གིས་གཅིག་ལུ་ཡང་ མགུ་མཐུད་མ་རྐྱབ་པར་ཡོདཔ་ཨིན།

དཔེར་ན་: `logger.level` གཞི་སྒྲིག་འབདཝ་ཨིན། `INFO` དང་ `logger.filter` གཞི་སྒྲིག་འབདཝ་ཨིན། `iroha_core=debug`, འགྲུབ་ཚུགས་མི་ ཕི་ལཊར་ གཞི་སྒྲིག་འདི་ཨིན། `info,iroha_core=debug` འདི་འབདཝ་ལས་ `info` ཚད་གཞིའི་དོན་ལུ་། `debug` དོན་ལུ་ `iroha_core`).

:::

::: tip འགྲུལ་བསྐྱོད་དུས་ཡུན་ ད་ལྟོའི་གནས་གོང་

གནད་དོན་འདི་ Torii ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ Runtime Configuration Update འབད་ནི་ལུ་བསྟུན་ཨིན།

:::

### `logger.format` {#param-logger-format}

ཐོ་བཀོད་ཡིག་ཚང་གི་བཟོ་རྣམ་

<param-table default-value=full env=LOG_FORMAT>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `full`: default formatter འདི་བྱུང་བའི་གནད་དོན་རེ་གི་དོན་ལུ་ མི་གིས་ཀློག་ཚུགས་པའི་ ཐིག་ཁྲམ་ཐོ་བཀོད་རྐྱང་གི་ཐོ་ཡིག་ཚུ་བཏོན་དོ་ཡོདཔ་ད་ ད་ལྟོའི་དུས་ཡུན་གྱི་གནས་སྟངས་དེ་ གནད་དོན་འདི་གི་ འདྲ་བཤུས་བཀོད་འབད་ཡོད་པའི་ཧེ་མར་སྟོན་འབདཝ་ཨིན།
- `compact`: ཌེ་པཱོལ་བཟོ་ཐིག་གི་རྣམ་འགྱུར་ཅིག་ཨིནམ་ད་ ཚེ་རིང་ཐུང་ཀུ་ཚུ་གི་དོན་ལུ་བཟོ་བཅོས་འབད་ཡོདཔ་ཨིན། ད་ལྟོའི་དུས་ཡུན་གྱི་གནས་སྟངས་ནང་ལས་ ས་ཁོངས་ཚུ་ བརྡ་བཀོད་འབད་ཡོད་པའི་བྱུང་རྐྱེན་གྱི་ས་ཁོངས་ཚུ་ནང་བཙུགས་ཏེ་ཡོདཔ་ལས་ དུས་ཡུན་གྱི་མིང་འདི་སྟོན་མི་ཚུགས། ཚིག་ཡིག་གི་གནས་ཚད་དེ་ ཡིག་འབྲུ་གཅིག་སྦེ་མ་རྫོགས་པར་ཨིན།
- `pretty`: མི་གིས་ལྷག་ཚུགསཔ་བཟོ་བའི་དོན་ལུ་ བཟོ་སྐྲུན་འབད་མི་ ཚེ་རིང་གྲལ་ཐིག་གི་ ཐོ་བཀོད་ཚུ་ བཏོན་དོ་ཡོདཔ་ཨིན། འདི་ངོ་མ་ར་ ས་གནས་གོང་འཕེལ་དང་ ཌེ་བི་གཱག་འབད་ནི་ལུ་ ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ཨིན། ཡང་ན་ བཀའ་རྒྱ་ཀྱི་གྲལ་ཐིག་ལག་ལེན་ཚུ་གི་དོན་ལུ་། ཐོ་བཀོད་ཅན་གྱི་ཐོ་ཡིག་ཚུ་ དཔར་བསྐྲུན་འབད་ནི་དང་ བསྡུ་བསྒྱོམ་འབད་ནིའི་དོན་ལས་ ཨེབ་གཏང་འབད་ནི་དེ་ ཁག་ཆེ་ཤོས་ཅིག་ཨིན།
- `json`: Newline-delimited JSON logs བཟོ་སྐྲུན་འབད་ཐབས། འདི་གིས་བཟོ་སྐྲུན་ནང་ལག་ལེན་འཐབ་ནི་གི་དོན་ལས་ཨིན། འདི་ནང་ལུ་ བཟོ་བཀོད་ཅན་གྱི་ logsཚུ་ དབྱེ་ཞིབ་དང་མཐོང་ཐངས་ཀྱི་འཕྲུལ་ཆས་ཚུ་གིས་ JSON སྦེ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། JSON ཐོན་སྐྱེད་འདི་ མི་གིས་ལྷག་ཚུགསཔ་བཟོ་བའི་དོན་ལུ་མ་བཏུབ་པས།

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

Kura འགོ་འདྲེན་འཐབ་ནིའི་རྣམ་ཐར།

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `strict`: བཀྲམ་སྤེལ་འབད་མི་ཚུ་ ཆ་མེད་གཏང་དགོཔ་ཨིན།
- `fast`: གཞི་རྟེན་བརྟག་དཔྱད་ཚུ་རྐྱངམ་གཅིག་འབད་ཐོག་ལས་ འགོ་འདྲེན་འཐབ་ནི་མགྱོགས་དྲགས་ཨིན།

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

སྦྲག་ཚུ་བཞག་སའི་ ཐོ་བཀོད་[^paths] འདི་གསལ་སྟོན་འབདཝ་ཨིན།

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

ཟད་འགྲོ་བཏང་མི་ གྱངས་ཁ་མཐོ་སའི་ཚད་གཞི་འདི་ཨིན།

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

Sumeragi Soft-fork handling paths ཚུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ Debug-only switch བཏོན་གཏང་། འདི་སེལ་འཐུ་འབད་ཡོད་པའི་བརྟག་དཔྱད་ཀྱི་ཕྱི་ཁར་བཞག་གནང་། དེད་གཡོགཔ་ཚུ་གིས་ གྲོས་བསྟུན་འབད་ནིའི་ སྤྱོད་ལམ་ལུ་ ངོས་ལེན་མ་འབད་བ་ཅིན་ བཟོ་སྐྲུན་གྱི་ཁ་ཐུག་ལུ་ བསྒྱུར་བཅོས་འབད་ནི་འདི་གིས་ འདྲན་འདྲ་ཚོར་སྣང་འབྱུང་ཚུགས།

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## གློག་བརྙན་འདི་ {#snapshot}

ལས་འགན་འདི་ [World State View](/dz/blockchain/world#world-state-view-wsv) གི་གློག་བརྙན་ཚུ་ལྷག་སྟེ་བྲིས་ནི་ཨིན་མས།

Snapshots གིས་ World State View གྱི་ བརྟག་དཔྱད་སྒོ་ར་རིམ་སྒྲིག་སྦེ་བཞག་ཡོདཔ་ལས་ peer གིས་ Kura ལས་ блокརེ་ཡང་ ལོག་གློག་བརྙན་མ་རྐྱབ་པར་ ལོག་འགོ་བཙུགས་ཚུགསཔ་ཨིན། Kura འདི་ལོག་གློག་བརྙན་གྱི་དོན་ལུ་ བདེན་པའི་འབྱུང་ཁུངས་དང་ ཡུན་བརྟན་ཅན་ཅིག་ཨིན་ snapshots འདི་མགྱོགས་དྲགས་འབད་ནིའི་ལམ་ཨིན། འགོ་བཙུགས་པའི་སྐབས་ལུ་ Iroha གིས་ སྒྲིག་གཞི་སྒྲིག་འབད་ཡོད་པའི་ ལྕགས་ཐག་དང་ བཀྲམ་སྤེལ་འབད་ཡོད་མི་ སྦྲག་ཚུ་དང་གཅིག་ཁར་ གློག་བརྙན་འདི་གློག་བརྙན་ནང་ལུ་ བཙུགས་ནི་ཨིན་ན་ ཡང་ན་ ལོག་སྤྱོད་འབད་ནི་ཨིན་ན་ ཐག་བཅད་པའི་ཧེ་མར་ གློག་བརྙན་གྱི་ metadata འདི་བརྟག་དཔྱད་འབདཝ་ཨིན།

::: tip གློག་བརྙན་ཚུ་སེལ་འཐུ་འབད།

གལ་སྲིད་ snapshots གི་ལམ་ལུགས་ནང་ལུ་ གནད་དོན་ག་ཅི་ཡང་མ་བདེཝ་ཡོད་པ་ཅིན་ ཁྱོད་ཀྱིས་གློག་བརྙན་ཚུ་གི་ཐད་ལུ་ སྟོངམ་སྦེ་ཡོད་པའི་ཤོག་ལེབ་ནང་ལས་ འགོ་བཙུགས་དགོ་པ་ཅིན་ [`snapshot.store_dir`](#param-snapshot-store-dir) གིས་བཀོད་མི་ directory འདི་བཏོན་གཏང་ཚུགས།

:::

### `snapshot.mode` {#param-snapshot-mode}

གློག་བརྙན་གློག་བརྙན་འཛིན་སྐྱོང་ལམ་ལུགས་ནང་ལུ་ ལཱ་འབད་ཐངས་

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

string, ཚད་གཞི་ཚུ་:

- `read_write`: Iroha གིས་ [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)གིས་གསལ་བཀོད་འབད་ཡོད་པའི་དུས་ཡུན་ཁར་གློག་བརྙན་ཚུ་བཟོ་བཀོད་འབདཝ་ཨིན། འགོ་འབྱེད་འབད་བའི་བསྒང་ལས་, Iroha གིས་ ཧེ་མ་ཡོད་པའི་གློག་བརྙན། (མེད་པ་ཅིན་) ཀློག་ཞིནམ་ལས་ བཀྲམ་སྟོན་འབད་དོ་ཡོདཔ་དང་ བཀྲམ་སྤེལ་འབད་ཡོདཔ་ཨིན།
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

ཊེ་ལི་མེ་ཏྲི་གིས་ གཞན་གྱི་མི་འདྲ་མཉམ་ཚུ་གི་བརྟག་དཔྱད་ཚུ་ ཕྱི་ཁའི་ ཊེ་ལེ་མེ་ཊིརི་སྒྲོམ་ཅིག་ལུ་ བཏང་ཨིན། `telemetry.name` དང་ `telemetry.url` གཉིས་ཆ་ར་ལུ་ གཞི་སྒྲིག་འབད་ཞིནམ་ལས་ ཌེ་ལི་མེ་ཊཱིར་སྒྲོམ་ཅིག་ནང་ སྙན་ཞུ་འབད་དགོ་པའི་སྐབས་ བཏོན་གཏང་དགོ། ཊེ་ལོ་མེ་ཊིᱨᱤལག་ལེན་འཐབ་མ་བཏུབ་པ་ཅིན་ ཆ་ཤས་འདི་སེལ་འཐུ་འབད།

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
