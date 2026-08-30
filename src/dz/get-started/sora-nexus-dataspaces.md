---
translation_locale: dz
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA ༣ ལུ་ གཞི་བཙུགས་འབད་:Taira དང་ Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 འདི་ལག་ལེན་ཁ་ཐུག་གི་ མི་སེར་གྱི་ཁྱབ་སྤེལ་ལམ་གཞི་བཙུགས་འབད་ཡོདཔ་ཨིན། Iroha 3 དང་ SORA Nexus. བཟོ་སྐྲུན་འབད་ཞིནམ་ལས་ བསྐྱར་ཞིབ་འབདཝ་ཨིན། Taira དང་པ་རང་ ཌོག་ཊར་བཟོ་རྣམ་འདི་ སྤོ་བཤུད་འབད་ཞིནམ་ལས་ Minamoto ཁྱོད་ཀྱིས་ངོ་མ་གི་ལྡེ་མིག་ཚུ་སོ་སོ་སྦེ་ལག་ལེན་འཐབ་པ་ཅིན་རྐྱངམ་གཅིག་ཨིན། XOR དངུལ་ཕོགས་དང་ བཟོ་སྐྲུན་གྱི་དོན་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན།

འ་ནི་སྟོན་ཐངས་འདི་ public SORA networksགི་དོན་ལུ་ Iroha client གཞི་སྒྲིག་འབད་ནིའི་ཐབས་ལམ་ཚུ་སྟོན་འབདཝ་ཨིན།

- Taira བརྟག་དཔྱད་འབད་ཐངས་འདི་ `https://taira.sora.org`
- Minamoto མང་སྡེ་ཁ་ལུ་ `https://minamoto.sora.org`

མཉམ་འབྲེལ་བརྟག་དཔྱད་འབད་ནི་ལུ་ Taira ལག་ལེན་འཐབ་ནི་, ཐབ་ཤིང་ལས་དངུལ་བསྡུ་ལེན་འབད་མི་ཡིག་འབྲུ་འཕྲུལ་ཆས་ཚུ་དང་ བཙུགས་ནི་གི་ཉམས་མྱོང་། བཟོ་སྐྲུན་གྱི་དོན་ལུ་ གྲ་སྒྲིག་འབད་ཡོད་པའི་ majinnet ལས་འགུལ་ཚུ་གི་དོན་ལུ་རྐྱངམ་ཅིག་ Minamoto ལག་ལེན་འཐབ་ནི། གློག་ཐག་གཉིས་ཆ་ར་གིས་XOR ལུ་འཐུས་སྤྲོད་དོ་ཡོདཔ་ཨིན།

- Taira བརྟག་དཔྱད་ཐིག་ཁྲམ་ XOR གི་ལག་ལེན་འཐབ་ཨིན།
- Minamoto གིས་བདེན་པའི་ XOR ལག་ལེན་འཐབ་ཨིན། Minamoto འབུབ་མེད་ཡོདཔ་ཨིན།

## བཟོ་སྐྲུན་འབད་ནིའི་ལམ་ {#builder-path}

|ཐབས་ལམ་ |Taira བརྟག་དཔྱད་འབད་ཐངས་ |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|འབྲེལ་མཐུད་ཀྱི་གནས་གོང་ཚུ་ བསྐྱར་ཞིབ་འབད་ནི་འགོ་བཙུགས་གནང་།|དྲི་བཀོད་ `/status` ལྡེ་མིག་མེད་|དྲི་བཀོད་ `/status` ལྡེ་མིག་མེད་|
|གཞི་རྟེན་གནས་ཚད་ཅིག་ གདམ་ཁ་རྐྱབས།|མི་མང་གི་ལག་ལེན་ `universal` ག་དེམ་ཅིག་སྦེ་ ཁྱོད་ཀྱི་ལག་ལེན་ལུ་ལམ་ལུགས་བཟོ་དགོཔ་མེད་པ་ཅིན་ |གནད་སྡུད་གནས་ཚད་འདི་ mainnet ངོས་ལེན་འབད་བའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ལག་ལེན་འཐབ་ནི། |
|དངུལ་ཕོགས་ཐོབ་ཐབས།|མི་མང་གི་ Taira faucet ལག་ལེན་འཐབ་། |XOR ལས་དངུལ་རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ Minamoto རྩིས་ཁྲ་ ཡང་ན་ ངོས་འཛིན་ཅན་གྱི་ དངུལ་རྩིས་ཐོན་སྐྱེད་ནང་ལས་ཐོབ་ཐབས། |
|བརྟག་དཔྱད་འདི་གིས་བྲིས་ནུག|བརྟག་དཔྱད་དེ་ འབུབ་ལས་མ་དངུལ་ལག་ལེན་འཐབ་ XOR |དཔྱད་རྩོམ། ལག་ཆས་ལག་ལེན་འཐབ་མ་བཅུག། འབྲི་གུང་དངུལ་ཀྲམ་ངོ་མ་ XOR |
|གོང་འཕེལ་གཏང་ནི་ |ལოგიཀ་, ལྟ་རྟོག་དང་བརྡ་བཀོད་ལག་ལེན་ཚུ་ ལོག་སྟེ་ར་ བརྟག་དཔྱད་འབད་ |རང་རྐྱང་གི་ལྡེ་མིག་ཚུ་ ལག་ལེན་འཐབ་ནི་ དངུལ་ཕོགས་དང་གློག་བཀྲམ་སྤེལ་འཛིན་སྐྱོང་ |

ལག་རྩལ་གྱི་རྒྱུགས་ཆུ་འདི་:

1. ཁྱོད་ཀྱིས་ Taira གི་རྒྱབ་ལས་ client བཟོ་ཞིནམ་ལས་ མི་མང་གི་ `universal` ཌེ་ཊ་ས་པི་སི་ལག་ལེན་འཐབ་དགོ།
2. ཟུར་རྟགས་བཀོད་མི་ཅིག་བཙུགས་ཞིནམ་ལས་ Taira faucet གྱི་ཐོག་ལས་ དངུལ་རྐྱང་གཏང་དགོ།
3. ཁྱོད་ཀྱིས་ Taira གྱི་ཐད་ལུ་ ཁྱོད་ཀྱི་ལག་ལེན་གི་རྣམ་གཞག་ བརྟག་ཞིབ་འབད་དགོ་པའི་སྐབས་ འཛོལ་བ་ཚུ་ ཁེ་རྒོ་དང་ མཐོང་ཚུགས་པའི་བར་ན་ཡང་ཨིན།
4. Minamoto འབྲི་ཤོག་སོ་སོ་བཟོ་ནི་དང་ ངོ་མ་ XOR ལུ་དངུལ་སྤྲོད་ནི་ དེ་ལས་བརྟག་ཞིབ་འབད་ཡོད་པའི་ལག་ལེན་ཚུ་རྐྱངམ་གཅིག་ མའི་ནེཊ་ལུ་སྤོ་བཤུད་འབདཝ་ཨིན།

## བཞེས་སྒོའི་དེབ་འདི་ འཕྲོ་མཐུད་ལག་ལེན་འཐབ་དགོ། {#continue-with-the-cookbook}

འ་ནི་ལམ་སྟོན་འདི་ལག་ལེན་འཐབ་ཞིནམ་ལས་ ཁྱོད་ཀྱིས་ཁ་ཐོ་བཀོད་འབད་མི་དང་ ལག་ལེན་གྱི་འཐུས་ཚུ་ གདམ་ཁ་རྐྱབས་ཨིན། དེ་ལས་ཁྱོད་ཀྱིས་བཟོ་དགོ་པའི་ལག་ལེན་གི་སྤྱོད་ལམ་ལུ་ འགྱུར་ལྡནམ་སྦེ་ བཟོ་ནིའི་སྨན་རྫས་འདི་མུ་མཐུད་འབད་:

|དམིགས་གཏད་ |བཏང་ཐིག་ |
| --- | --- |
|Taira བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ མཁན་པོ་ཅིག་བཟོ་ནི། | [Taira](/dz/cookbook/connect-to-taira.md) ལུ་མཐུད་སྦྲེལ་འབད་ |
|དང་པ་ཡིག་འབྲུ་བཏང་ཞིནམ་ལས་ གྲུབ་འབྲས་འདི་བརྟག་དཔྱད་འབད།| [ཚོང་འབྲེལ་ཚུ་ བཏང་ནི་དང་ བདེན་དཔྱད་འབད་ ](/dz/cookbook/submit-and-verify-transactions.md) |
|ཐོ་བཀོད་དང་དངུལ་ཀྲམ་བཟོ་ནི་དང་ གནས་སྤོ་གོང་ | [ཕན་ནུས་ཅན་གྱི་རྒྱུ་དངོས་ཚུ་](/dz/cookbook/fungible-assets.md) |
|ཀློག་ཐེངསམ་ལག་ལེན་གྱི་གནས་གོང་ | [ཞིབ་འཚོལ་ཞིབ་འཇུག་གི་གནས་སྟངས་](/dz/cookbook/query-ledger-state.md) |
|བསྒྱུར་བཅོས་འབད་ནིའི་དོན་ལས་ གྲོས་ཐག་ཆོད་ | [རྒྱུན་འགྲུལ་གྱི་བྱུང་རྐྱེན་](/dz/cookbook/stream-events.md) |

བཞེས་སྒོའི་དཔེ་དེབ་འདི་ ལཱ་གི་རྒྱུན་ལམ་རེ་རེ་ལུ་ དམིགས་གཏད་ཅན་སྦེ་བཞག་ཞིནམ་ལས་ Taira དངུལ་རྐྱང་དང་ ཡང་ན་ SORA Nexus འབྲེལ་མཐུད་ཀྱི་ གནས་སྟངས་ནང་ལུ་ དགོས་མཁོ་བྱུང་བའི་སྐབས་ལུ་ འདི་ཁར་སླར་ལོག་འབད་ཡོདཔ་ཨིན།

## 1. ཁྱོད་ཀྱིས་ག་ཅི་བརྩམས་དོ་ཡོདཔ་ཨིན་ན་ ཧ་གོ་དགོ། {#_1-understand-what-you-are-setting-up}

SORA Nexus ནང་ལུ་ ཌེ་ཊ་ས་པི་ལེན (data space) འདི་ net lane དང་ routing catalogue གི་ཆ་ཤས་ཅིག་ཨིན། client གིས་ public datapace གསར་བཟོཝ་འདི་ `client.toml` བསྒྱུར་བཅོས་འབད་དེ་རྐྱངམ་ཅིག་མེན། Client setupགིས་ལཱ་གཉིས་འབདཝ་ཨིན།

1. ཚོང་མགྲོན་པ་ལུ་ Torii ཕྱོགས་གཡས་ཁ་ཐུག་གི་མཇུག་ཐོ་བཀོད་འབད་ནི།
2. domain དང་ dataspace routing context འདི་ canonical account གི་དོན་ལུ་ སེལ་འཐུ་འབད།

`AccountId` འདི་ཨ་རྟག་རང་ ཀ་ནོ་ནི་ཡཱན་དང་ ཌོ་เมนམེད་ཨིན། `client.toml` ནང་གི་ `[account].domain` གནས་གོང་འདི་གིས་ རུ་ཊི་དང་ ཨའི་ལིསི་གི་གནས་སྟངས་བྱིན་དོ་ཡོདཔ་ཨིན། དེ་གིས་རྩིས་ཁྲ་གི་ངོ་རྟགས་ཀྱི་ཡན་ལག་ཅིག་སྦེ་མི་འགྱུར་བས། ལག་ལེན་མང་ཤོས་ཅིག་གི་དོན་ལུ་ མི་མང་གི་ `universal` ཌེ་ཊ་ས་པཱལ་ལས་འགོ་བཙུགས་འོང་། ཌོ་མེ་ནིན་གྱི་གནས་སྟངས་ཀྱིས་ `domain.dataspace` དཔེ་ཡིག་འདི་ལག་ལེན་འཐབ་ཚུགས།

```text
wonderland.universal
```

ཁྱོད་ཀྱིས་ གནད་སྡུད་ཀྱི་ས་ཁོངས་གསརཔ་ཅིག་ དགོས་མཁོ་ཡོད་པ་ཅིན་ སྤྱིར་བཏང་ལག་ལེན་གྱི་རྩིས་ཁྲ་ནང་ལས་ ཐོ་བཀོད་འབད་ནི་ལུ་ བརྩོན་ཤུགས་བསྐྱེད་པའི་ཚབ་ལུ་ ཡིག་སྣོད་དང་ལམ་སྟོན་འཆར་གཞི་ཚུ་ གྲ་སྒྲིག་རྐྱབས། [New Dataspace](#_8-provision-a-new-dataspace) བྱིན་ནི་འདི་ འོག་གི་ཤོག་ལེབ་ཚུ་ནང་མཐོང་འོང་།

## 2. མི་མང་གི་མཐའ་མ་ Torii བརྟག་དཔྱད་འབད་ {#_2-check-the-public-torii-endpoint}

ཐོ་བཀོད་མ་རྐྱབ་པའི་ཧེ་མར་ དམིགས་གཏད་མཇུག་གི་ཐིག་ཁྲ་དེ་ འགོ་བཙུགས་ཡོདཔ་ཨིན་ན་ བརྟག་ཞིབ་འབད་དགོ།

Taira གི་དོན་ལུ་:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto གི་དོན་ལུ་:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ཌེ་ཊ་ས་པི་སི་དང་ བརྒྱུད་ལམ་མཐོང་ཐོ་བཀོད་འབད་ཡོད་པའི་ཨེབ་ཐག་འདི་ བརྟག་ཞིབ་འབད་:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

mainnetགི་དོན་ལུ་ `https://minamoto.sora.org/status` དང་གཅིག་ཁར་བཀའ་རྒྱ་དེ་རང་ལག་ལེན་འཐབ་དགོ།

## Taira MCP ཕྱིར་འཐེན་འབད་མི་ཚུ་གི་དོན་ལུ་ {#taira-mcp-for-agents}

Taira གིས་ཡང་ Torii-native Model Context Protocol (MCP) གྱི་དོན་ལུ་ལག་ལེན་འཐབ་ནིའི་དུས་ཚོད་གི་དོན་ལུ་ ལག་ལེན་འཐབ་ཨིན། ལས་འཛིན་གྱིས་འགོ་དང་པ་ རང་ལུགས་ཀྱི་ Torii ཌའི་ལོག་ client བཟོ་མ་དགོ་པར་ ཐད་ཀར་དུ་ testnet ཀློག་ཐངས་, scripted diagnostics, ཡང་ན་ དྭངས་གསལ་སྦེ་ བསྐྱར་ཞིབ་འབད་ཡོད་པའི་ཡིག་འབྲུ་ rehearsals དགོས་པའི་སྐབས་ ལག་ལེན་འཐབ་འོང་།

|གཞི་སྒྲིག་འབདཝ་ཨིན།|གནས་གོང་ |
| --- | --- |
|MCP མཐའ་མཇུག་གི་ཐིག་ཁྲ།|`https://taira.sora.org/v1/mcp` |
|གྲོག་ཐིག་རྩ་བ་ |`https://taira.sora.org` |
|དམིགས་གཏད་ཅན་གྱི་ལག་ལེན་ |Taira testnet ཀློག་ཐངས་དང་ faucet-མ་དངུལ་གྱི་འབྲི་ཉམས་མྱོང་ |
|བཟོ་སྐྲུན་གྱི་འདྲ་མཉམ་ |ནང་དོན་འདི་ Minamoto ལུ་བཀོད་མི་དགོ་ ག་དེམ་ཅིག་སྦེ་ ཚད་འཛིན་འབད་ཐངས་ (mainnet) MCP ཀྱི་མཐའ་མཚམས་དང་ བཀྲམ་སྤེལ་བཀག་འཛིན་ཚུ་ གསལ་ཏོག་ཏོ་སྦེ་ ངོས་ལེན་མ་འབད་བར་ཡོདཔ་ཨིན།|

ཟུར་རྟགས་མ་བཙུགས་པའི་ཧེ་མར་ Bridge metadata ཚུ་ བརྟག་དཔྱད་འབད་:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL ཌོག་ཊར་ལག་ལེན་འཐབ་མི་གི་གནས་སྟངས་ནང་སེལ་འཐུ་འབད་ནིའི་དུས་ཚོད་ལུ་ MCP ཞབས་ཏོག་ཅིག་སྦེ་བཟོ་བཀོད་རྐྱབས། ཁྱོད་ཀྱིས་ཡིག་ཚང་འདི་ནང་ལུ་ MCP config, API tokens, forwarded auth headers, `authority` ཡང་ན་ `private_key` valuesཚུ་མ་བཙུགས་པར་སྡོད་འོང་།

Taira དང་གཅིག་ཁར་ལཱ་ལེགས་ཤོམ་འབད་ནིའི་ ཁྲིམས་ལུགས་ཚུ་ Agent prompt:

- MCP ཌོག་ཊར་ལས་ ལག་ཆས་ཚུ་ བཏབ་ནི་དེ་ བཏབ་མ་ཚར་བའི་ཧེ་མ་; ཞབས་ཏོག་གིས་ `listChanged` སྙན་ཞུ་འབད་ཡོད་པ་ཅིན་ ལོག་སྟེ་འཚོལ་དགོ།
- `iroha.` ཚོས་གཞི་ཅན་གྱི་ལག་ཆས་ཚུ་ `torii.` ཚོས་གཞི་མེད་པའི་ལག་ཆས་ཚུ་གི་ཧེ་མར་ གདམ་ཁ་རྐྱབ་དགོ།
- ཀློག་རྐྱང་སྦེ་འགོ་བཙུགས་: ཡིག་ཆ་ཚུ་དང་ རྒྱུ་དངོས་ཚུ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ འབྲི་ཤོག་ཚུ་ གྲོས་ཐག་མ་བཙུགས་པའི་ཧེ་མར་ མིང་རྟགས་ཚུ་, མཚམས་སྦྱོར་ཚུ་, གཞུང་སྐྱོང་གི་གནས་སྟངས་ དེ་ལས་ རྩིས་སྤྲོད་ཀྱི་ གནས་གོང་ཚུ་ བལྟ་དགོ།
- ཐད་ཀར་དུ་བརྟག་དཔྱད་འབད་ཐངས་ཀྱི་འགྱུར་བཅོས་མ་འབྱུང་པའི་ཧེ་མར་ མི་གིས་ གསལ་ཏོག་ཏོ་སྦེ་སྟོན་དགོཔ་འདི་ དགོཔ་ཨིན། སྔོན་ལས་ལག་ལེན་གྱི་ ཤོག་སྒྲིལ་ཚུ་ནང་ ལག་ལེན་འཐབ་པ་ཅིན་ `iroha.transactions.submit_and_wait` འདི་འབདཝ་ལས་ ལས་འཛིན་གྱིས་ གྲུབ་འབྲས་དེ་ བཏང་བའི་ཚབ་ལུ་ མཇུག་བསྡུ་བར་སྒུག་སྡོད་འོང་།
- ལས་འཛིན་གྱི་ལན་འདེབས་ནང་ལུ་ ཕྱིར་ཚོང་གི་ཧེཤ་དང་ མཐའ་མཇུག་གི་གནས་སྟངས་ དེ་ལས་ ཞབས་ཏོག་གི་བདེན་ཁུངས་ཀྱི་འཛོལ་བ་ཚུ་ བསྡུ་སྒྲིག་རྐྱབས།

### ལས་གཡོགཔ་ཚུ་དང་གཅིག་ཁར་ གོང་འཕེལ་གྱི་ ལཱ་འབད་ཐངས་ {#development-workflow-with-agents}

Iroha ཌའི་ཇི་ཊཱནསི་ཀིཔ་ཊི་དང་ བརྟག་དཔྱད་ཐིག་ཁྲམ་ཚུ་ ལག་ལེན་འཐབ་སྟེ་ ཌའི་ཇེཊ་གི་ལག་ལེན་གྱི་དོན་ལུ་ གྲོགས་རམ་འབད་མི་ཚུ་སྦེ་ ལག་ལེན་འཐབ་དགོ། འདི་གིས་ code བརྟག་ཞིབ་འབད་ཚུགས། Taira གནས་སྟངས་བཀླག་ཚུགས། བསྒྱུར་བཅོས་འབད་ནི་དང་ ས་གནས་ཀྱི་བརྟག་དཔྱད་ཚུ་ འབད་ཚུགས། དེ་འབདཝ་ད་ མི་ཅིག་གིས་ དབྱེ་གསལ་ཅན་གྱི་ལག་ལེན་འདི་ ངོས་འཛིན་མ་འབད་ཚུན་ཚོད་ ཕྲང་བའི་དྲ་ལམ་ལུ་འགྱུར་བཅོས་འབད་མི་བཏུབ་ཨིན་མས།

ལག་རྩལ་གྱི་ ལཱ་གི་ལམ་ལུགས་འདི་:

1. ཌོག་ཊར་ལུ་ ཡིག་ཆ་དང་ SDK code དང་ CLI བཀའ་རྒྱ་ ཡང་ན་ MCP ལག་ཆས་བཟོ་རྣམ་ཚུ་ བརྟག་ཞིབ་འབད་དགོཔ་སྦེ་ ཞུ་བ་འབད་ before it writes code.
2. ལས་འཛིན་གྱིས་ འགོ་དང་པ་ ཁྱོད་ཀྱིས་ client path ཆུང་ཤོས་ཅིག་འབྲི་བཅུགཔ་: status check, account search, alias resolution, or balance search.
3. གནད་དོན་འདི་ Taira གྱི་རྒྱབ་འགལ་ལུ་ ཀློག་རྐྱང་གི་འབོ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་རྐྱངམ་ཅིག་ བསྡུ་ལེན་བཟོ་ནིའི་ code ཚུད་འབད།
4. ཐད་ཀར་དུ་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ འགྲེམ་ཐོག་ཚོགས་སྡེའི་བརྟག་དཔྱད་ཚུ་སེལ་འཐུ་འབད། དཔེར་ན་ `TAIRA_LIVE=1` གྱི་རྒྱབ་ཁར་བཞག་པ་ཅིན་ དབྱེ་ཞིབ་སྡེ་ཚན་ཅིག་གི་བརྟག་དཔྱད་ལམ་ལུགས་དེ་ དུས་རྒྱུན་དུ་ བརྟག་དཔྱད་ཚོགས་སྡེའི་དོན་ལུ་ མ་དངུལ་མ་བྱིན་པར་སྡོད་ནི་དང་ ཡང་ན་ མཐུན་འབྲེལ་ཡོད་ཚད་ལས་བརྟེན་མི་ཚུགས།
5. ལས་འཛིན་གྱིས་ རྩིས་སྤྲོད་མ་འབད་བའི་ཧེ་མར་ འབྲེལ་མཐུད་ཀྱི་རྩ་བ་, ལྕགས་ཐག་,དབང་འཛིན་གྱི་རྩིས་ཁྲ་, བརྡ་བཀོད་བསྡོམས་, དངུལ་ཕོགས་དངུལ་རྐྱང་དང་ གནས་སྟངས་ཐད་ལུ་ འགྱུར་བ་འབྱུང་ནི་གི་ རེ་བ་བསྐྱེད་དགོཔ་སྦེ་ཞུ་དགོ།
6. གསང་བའི་ལག་ལེན་གྱི་དོན་ལུ་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ code འདི་ CI ཡང་ན་ mainnet གི་ལཱ་རྒྱུན་འགྲུལ་ལུ་ ཡར་སེང་མ་གཏང་པའི་ཧེ་མར་ བསྐྱར་ཞིབ་འབད་ནི་དང་ བརྟག་དཔྱད་འབད་ནིའི་ བྱ་བ་སྤྱོད་ལམ་, idempotency, དང་ reject handling གི་དོན་ལུ་ བསྐྱར་ཞིབ་འབདཝ་ཨིན།

གོང་འཕེལ་གྱི་དོན་ལུ་ ལག་ལེན་འཐབ་ཚུགས་པའི་ ཀློག་རྐྱང་ MCP ལག་ཆས་ཚུ་ནང་རྩིས་ཁྲ་གི་ རྒྱུ་དངོས་འཚོལ་ཐབས།། པི་ལཱསི་གྲོས་ཐག་བཅད་ཐབས།། བཀྲམ་སྤེལ་ཐབས།། ཚོང་འབྲེལ་འཚོལ་ཐབས། འབྲེལ་བ་འཐབ་ཐབས།། དང་ pipeline གནས་གོང་བརྟག་དཔྱད་ཐབས། ཐོ་བཀོད་འབད་ནིའི་སྔོན་ལུ་ བློ་གཏད་བཟོ་ནིའི་དོན་ལུ་འདི་ལག་ལེན་འཐབ་ཨིན།

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ཚོང་འབྲེལ་ལས་བྱེདཔ་ཚུ་གི་ཐོག་ལས་ ལཱ་འབད་ཐངས་ {#transaction-workflow-through-agents}

MCP སྦྲག་འདི་གིས་ Iroha གོ་བརྡ་སྤྲོད་ལེན་ཅིག་བཙུགས་རུང་ ངོ་མ་གི་ཚོང་འབྲེལ་གྱི་ དགོས་མཁོ་ཚུ་ བཏོན་མི་བཏུབ་ཨིན། ཚོང་འབྲེལ་དེ་གི་དོན་ལུ་ ཁྱད་ལྡན་དབང་འཛིན་, ངོས་ལེན་, དངུལ་ཕོགས་དངུལ་ཁང་, ལྕགས་ཐག་ ID, མེ་ཊ་ཌེ་ཊ་དང་མིང་ཐོ་བཀོད་འབད་དགོཔ་ཡོདཔ་ཨིན།

རིན་པོ་ཆེ་ Iroha གྱི་ཚོང་འབྲེལ་ཚུ་གི་དོན་ལུ་ དང་པ་ར་ SDK ཡང་ན་ CLI ཟེར་མི་ཡིག་གཟུགས་ཚུ་བཟོ་སྟེ་ བཏང་ཞིནམ་ལས་ ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཌོག་ཊར་ལུ་ ཀ་ནོ་ནི་ཀཱན་གྱི་ཡིག་གཟུགས་རྐྱངམ་གཅིག་བྱིན་དགོ། ཟད་འགྲོ་བཏང་མི་ བའི་ཊི་ཚུ་ `body_base64` ལུ་ཨེབ་གཏང་འབད་ཚུགས། ལས་འཛིན་གྱིས་ཁེབས་འདི་ `iroha.transactions.submit_and_wait` དང་གཅིག་ཁར་བཙུགས་ཚུགས། ཡང་ན་ `iroha.transactions.submit` དང་གཅིག་ཁར་བཙུགས་ནི་དང་ ཞིབ་འཚོལ་དེ་ `iroha.transactions.wait` ཟེར་མི་ནང་བཙུགས་འོང་།

སྒེར་གྱི་ལྡེ་མིག་ཚུ་ ཨེགསི་ཨེབ་གཏང་མ་རྐྱབས། གལ་སྲིད་ ཌོག་ཊར་ཅིག་གིས་ ཚོང་འབྲེལ་བཟོ་དགོ་པ་ཅིན་ ལག་ལེན་འཐབ་མིའི་དུས་ཚོད་ནང་ལས་ གསང་བ་ཚུ་ བསྡུ་བསྒྱོམ་འབད་ཡོད་པའི་ ས་གནས་ཀྱི་ ཀོ་ཌ་ལུ་བཏོན་གཏང་དགོ། གནས་སྟངས་, keychain, hardware signer, ཡང་ན་ testnet སྒྲིག་གཞི་ཡིག་སྣོད་ཚུ་སྣང་མེད་བསྐྱུར་དགོ། ལས་འཛིན་དེ་གིས་ Key material འདི་ Markdown, fixtures, logs, ཡང་ན་ commits ལུ་ནམ་ཡང་འབྲི་ནི་མི་འོང་།

ཚོང་འབྲེལ་མ་སྤྲོད་པའི་ཧེ་མར་ ལས་འཛིན་གྱིས་ ཚོང་འབྲེལ་གྱི་འཆར་གཞི་ཐུང་ཀུ་ཅིག་བཟོ་དགོཔ་ཨིན།

- `network`: Taira བརྟག་དཔྱད་ཐིག་ཁྲམ་ root དང་ chain ID
- `authority`: ཐོ་བཀོད་དང་འཐུས་སྤྲོད་མིའི་རྩིས་ཁྲ།
- `instructions`: Register, mint, burn, transfer, metadata, permission, or contract call summary མཁོ་འདོད་བཀོད་མི་ཡིག་ཚང་གི་མིང་།
- `fee asset`: རྒྱུ་དངོས་འདི་ Taira ལུ་རྩིས་སྤྲོད་འབད་ནི་ཨིན།
- `preflight reads`: རྩིས་ཁྲ་, རྒྱུ་དངོས་གི་ལྷག་ལུས་, ངོས་ལེན་ཚུ་, མིང་རྟགས་དང་ ཡང་ན་ སྔོན་འགོག་འབད་ཡོད་པའི་ བརྟག་ཞིབ་འབདཝ་ཨིན།
- `expected result`: བརྟན་གྲུབ་པའི་ཤུལ་ལས་ མཐོང་ཚུགས་པའི་གནས་གོང་
- `idempotency`: ག་དེམ་ཅིག་སྦེ་ ཞུ་བ་དེ་ཡང་ ལོག་སྟེ་ར་ བསྐྱར་ཞིབ་འབད་བ་ཅིན་ ག་ཅི་འབྱུང་འོང་།

བཏང་ཚར་བའི་ཤུལ་ལས་ ཌའི་ཊི་བི་དེ་ མཐའ་མཇུག་གི་གནས་སྟངས་ལུ་སྒུག་སྡོད་བཅུག་ཞིནམ་ལས་ གནས་སྟངས་ཀྱི་འགྱུར་བཅོས་འདི་ ཀློག་ཐངས་དྲི་བ་ཐོག་ལས་ བདེན་དཔྱད་འབད་ཚུགས། ཕན་ཐོགས་ཅན་ཅིག་ཨིན་པའི་ མཇུག་བསྡུ་སྙན་ཞུ་ནང་ལུ་:

- ཕྱིར་ཚོང་འབད་ནིའི་དོན་ལས་
- མཐའན་མཇུག་གི་གནས་གོང་ དཔེར་ན་ `Committed`, `Applied`, `Rejected` ཡང་ན་ `Expired`
- སྦ་སྒོར་དང་ བརྟག་ཞིབ་འབད་ཐངས་ཚུ་ ལག་ལེན་འཐབ་ཚུགས་པ་ཅིན་
- དབྱེ་ཞིབ་སྙན་ཞུ་གི་ གྲུབ་འབྲས་
- ཆ་མེད་གཏང་ནི་གི་ བརྡ་དོན་དང་ འཛོལ་བ་འདི་ ངོས་ལེན་, དངུལ་ཕོགས་, བདེན་ཁུངས་, གནས་སྟངས་རྙིངམ་, ཡང་ན་ མཐའ་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་བཟུམ་སྦེ་མཐོང་ཨིན་ན་

དཔེར་ན་ ཉེན་སྲུང་ཅན་གྱི་བརྡ་སྟོན་:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

རྟགས་བཀོད་འབད་མི་ ཤོག་སྒྲིལ་འདི་ གྲ་སྒྲིག་འབད་ཚར་བའི་ཤུལ་ལས་:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

སྨན་བཅོས་འབད་ Taira MCP མི་མང་གི་བརྟག་དཔྱད་འཕྲུལ་ཆས་ལག་ལེན་གྱི་ས་ཁོངས་ཅིག་སྦེ་ Taira ལྡེ་མིག་ཚུ་ བརྟག་དཔྱད་འབད་ཐངས་ XOR, faucet accounts, དང་ canary signers འདི་གཅིག་པུར་འབད་ཚུགས་དོ་ཡོདཔ་དང་ Minamoto ཀི་པི་ཚུ་དང་ བཟོ་སྐྲུན་གྱི་ཐོན་སྐྱེད་ཀྱི་ལཱ་རྒྱུན་ལམ་ཚུ་

## ད་ཁྱོད་ཀྱིས་རྩེད་རིགས་ཀྱི་དཔེ་ཚུ་ བརྟག་དཔྱད་འབད་ཚུགས་ {#toy-examples-you-can-try-now}

འ་ནི་དཔེ་རྙིངམ་འདི་ ཀློག་རྐྱངམ་ཅིག་ཨིན་ འདི་ཚུ་ ཁྱོད་ཀྱིས་ལྡེ་མིག་བཟོ་མ་ཚར་བའི་ཧེ་མ་ལས་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ མི་མང་གི་དྲ་ལམ་གཉིས་ཆ་ར་ལུ་ བཀྲམ་སྤེལ་འབད་ཚུགས་པའི་ ཉེན་ཁ་ཡོདཔ་ཨིན།

Taira བརྟག་དཔྱད་ཐིག་དང་ Minamoto ཚད་འཛིན་ཐིག་ཚུ་བསྡུར་འབད་:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira གིས་ གསལ་སྟོན་འབད་ཡོད་པའི་ མི་མང་གི་ གནད་སྡུད་གནས་སྟངས་ཀྱི་ལམ་ཐོ་ཚུ་:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

འདི་བཟུམ་སྦེ་ Minamoto གི་རྒྱབ་འགལ་ལུ་ བཀའ་རྒྱ་འདི་ལག་ལེན་འཐབ་ད་ ཁྱོད་ཀྱིས་ mainnet མཐོང་སྣང་ དགོཔ་ཨིན།

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Dashboard, bot ཡང་ན་ deployment checkགི་དོན་ལུ་ Node.js status probe ཆུང་ཀུ་ཅིག་བཟོ་:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

ཨང་དང་པ་འབྲི་སའི་ལག་ཆས་འདི་ Taira faucet claim འབད་ནི་ཨིན། དེ་གིས་ testnet XOR ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ Minamoto ལུ་ཡང་ བཏོན་ནི་མི་འོང་།

## 3. Taira Client Config བཟོ་དགོ {#_3-create-a-taira-client-config}

ཁྱོད་ཀྱིས་ ལག་ལེན་མ་འཐབ་པར་ཡོད་པ་ཅིན་ Keypair བཟོ་:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

བཟོ་ནི་ `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

མཐོ་ཤོས་གི་གནས་ཚད་ `chain` འདི་བདེན་པའི་ Taira ཕྱིར་ཚོང་གྱི་ཐིག་ཁྲམ་འདི་ཨིན། ID གཞི་སྒྲིག་དེ་ `[account].profile = "taira"` གིས་ རང་རང་སོ་སོ་སྦེ་དབྱེ་ཞིབ་འབདཝ་ཨིན། Taira I105 ལྕགས་ཀྱུའི་དབྱེ་སྒྲོམ་འདི་ གདམ་ཁ་རྐྱབ་ཨིན། ཐིག་ཁྲམ་ ID གིས་རྩིས་ཁྲ་གི་ཡིག་གཟུགས་ལུ་ གདམ་ཁ་མི་རྐྱབས་པས།

ཀློག་རྐྱང་གི་བརྟག་དཔྱད་འབད་:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

བརྟག་དཔྱད་ཚུ་བཀོད་པའི་ཧེ་མ་ མི་མང་གི་བརྟག་དཔྱད་ Taira འབད་ནི་:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira རྩིས་ཁྲ་དེ་ ཁྱོད་ཀྱིས་འཐུས་སྤྲོད་མི་ཡིག་ཚང་ཚུ་མ་བཙུགས་པའི་ཧེ་མར་ དངུལ་ཕོགས་དངུལ་ཀྲམ་ཐོནམ་ཨིན། ཐད་ཀར་དུ་ faucet flux འདི་ [Get Testnet XOR ལུ་ Taira](#_4-get-testnet-xor-on-taira) ལུ་ཡོདཔ་ཨིན།

ཐབ་ཤིང་གི་ claim ངོས་ལེན་འབད་ཚར་ཞིནམ་ལས་ རྩིས་ཁྲ་དངུལ་སྤྲོད་ཚར་བའི་ཤུལ་ལས་ Taira canary འདི་ optional write smoke test ཨིན།

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary གིས་མིང་རྟགས་བཀོད་མི་ ping བཏབ་ནི་ དེ་ལས་ confirmation གི་དོན་ལུ་སྒུག་སྟེ་ཡོདཔ་དང་ runtime signer config འདི་ `--write-config` བྱིན་པའི་བསྒང་ཨིན། Taira ནི་ མི་མང་གི་ testnet ཨིན་ཨིན། འདི་འབདཝ་ལས་ གྱངས་ཁ་ཚངམ་གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ པིན་ཌི་དེ་ ཐབས་ལམ་ནང་མ་ལྷོད་པའི་སྐབས་ཡང་ འབད་ཚུགས། གལ་སྲིད་ `taira doctor` གིས་ གྱངས་ཐངས་ཚངམ་ཅིག་ སྙན་ཞུ་འབད་བ་ཅིན་ ཡང་ན་ ཀ་ནའི་རི་འདི་གིས་ `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` བཏབ་པ་ཅིན་ དེ་ client config error ཨིན་ཟེར་ མ་སླབ་པར་སྒུག་སྟེ་ ལོག་ལྟབ་སྦེ་ བལྟ་དགོ།

ཉེན་སྲུང་མེད་པའི་དུ་པ་བརྟག་དཔྱད་ཚུ་གི་དོན་ལུ་ ཀ་ནེ་རི་ལུ་ མཐའ་ཟུར་གྱི་སླར་ལོག་བརྟག་དཔྱད་ ལྡེ་མིག་ནང་བཀབ་དགོ།

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

སླར་ཡང་ བརྟག་དཔྱད་འབད་མ་དགོ་པ་ཅིན་ `iroha taira doctor` གིས་ དཀའ་སྡུག་ཅན་གྱི་འཛོལ་བ་བཏོན་དོ་ཡོདཔ་ཨིན། སྒོ་སྒྲིག་གི་ཚངམ་དང་འཐུས་མཁོ་སྤྲོད་འབད་ནི་ལུ་ ཆ་མེད་གཏང་ནི་དེ་ མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་གྱི་ གནས་སྐབས་ཀྱི་གནས་སྟངས་ཨིན། DNS, TLS ཡང་ན་ `status = "fail"` ནད་ཡམས་ཚུ་མེདཔ།

## SORA Nexus རྩིས་ཁྲ་ ID བཟོ་དགོ། {#generate-a-sora-nexus-account-id}

SORA Nexus རྩིས་ཁྲ་ ID འདི་རྩིས་ཁྲའི་གཞུང་ལྡེ་མིག་དང་ དམིགས་གཏད་ཡོད་པའི་དྲ་ལམ་གི་ སྔོན་སྒྲིག་ནང་ལས་ འབྱུང་འབབ་ཡོད་མི་ ཀན་ནོ་ཀཱན་གྱི་ I105 ཁ་བྱང་ཨིན། དེ་གིས་ `[account].domain` ཌོག་ཊར་ནང་གདམ་ཁ་མེདཔ། TOML. མི་མང་གི་ལྡེ་མིག་གཅིག་རང་ IDs ལུ་ Taira དང་ Minamoto གི་ལྡེ་མིག་སོ་སོ་ལུ་ ཨེབ་གཏང་འབད་དོ་ཡོདཔ་ད་ བཟོ་སྐྲུན་གྱི་ལག་ལེན་འཐབ་མི་ཚུ་གིས་ Minamoto གི་དོན་ལུ་ ཁྱད་པར་ཅན་ལྡེ་མིག་གཉིས་བཟོ་དགོཔ་ཨིན་མས།

ཨེཌ་༢༥༥༡༩ གི་ལྡེ་མིག་རྣམ་གཉིས་འདི་བཟོ། ཡང་ན་ཨེབ་གཏང་འབད། འདི་གིས་རྩིས་ཁྲ་འཛིན་སྐྱོང་འབད་འོང་།

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

མི་མང་གི་ལྡེ་མིག་འདི་ Taira རྩིས་ཁྲ་ ID ལུ་བསྒྱུར་གཏང་དགོ།

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto public key འདི་ mainnet prefix དང་གཅིག་ཁར་བསྒྱུར་འབད།

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ཁྱོད་ཀྱིས་ Nexus API ཡང་ན་ CLI བཀའ་རྒྱ་ནང་ ཀ་ནོ་ནི་ཀཱོལ་རྩིས་ཁྲ་ ID འབྲི་དགོ་པ་ཅིན་ གྲུབ་འབྲས་ཐོན་པའི་རྩིས་ཁྲ་འདི་ ID ལག་ལེན་འཐབ་དགོ། དཔེར་ན་ Taira འབུད་ཀ་ `account_id` བཀྲམ་སྤེལ་འབད་དགོ་པའི་དྲིས་ལན། ཟད་དམ་ཅན་གྱི་རྩིས་ཁྲ་ Fields ཡང་ན་ Alias འབྲེལ་གཏུགས་འབད་ཐབས། ཁྱོད་ཀྱིས་ client config ནང་དང་བསྟུན་མི་ སྒེར་གྱི་ལྡེ་མིག་འདི་བཞག་ཞིནམ་ལས་ `[account].profile = "taira"` ཡང་ན་ `[account].profile = "minamoto"` གི་ public network འདི་རང་བཙག་དགོ།

ID བཟོ་སྐྲུན་འབད་ནི་འདི་གིས་ རང་གིས་རང་ལུ་ དངུལ་ཐོག་གི་རྩིས་ཁྲ་བཟོ་མི་ཚུགས། Taira ལུ་ ཐབ་རྡོག་དེ་གིས་ རྩིས་ཁྲ་བཟོ་ནི་དང་ དངུལ་ཕོགས་སྤྲོད་ནི་ཨིན། Minamoto ལུ་, ངོས་ལེན་ཅན་གྱི་ mainnetonboarding ཡང་ན་ Treasury flow ལག་ལེན་འཐབ་དགོ།

### ཨེབ་རྟ་དང་ལྡནམ་སྦེ་བཞག་ནི། {#key-storage-and-backup}

རྩིས་ཁྲ་ ID དང་ མི་མང་གི་ལྡེ་མིག་ཚུ་ བརྗེ་སོར་འབད་ཚུགས། སྒེར་གྱི་ལྡེ་མིག་དང་ Passphrase སྦྲེལ་ཐིག་ དེ་ལས་ གསང་བའི་ཡིག་ཆ་ཚུ་ གསང་བ་སྦེ་བཞག་དགོཔ་ཨིན།

SORA Nexus རྩིས་ཁྲ་ཚུ་གི་དོན་ལུ་ འ་ནི་ལག་ལེན་ཚུ་ལག་ལེན་འཐབ་དགོ།

- སྒེར་གྱི་ལྡེ་མིག་ཚུ་ སྦྲགས་ཡོད་པའི་ Password Manager, Hardware-backed keystore, ཡང་ན་ དམིགས་གཏད་ཅན་གྱི་ Signage ཞབས་ཏོག་ནང་བཞག་དགོ། གཞི་རྟེན་འཛིན་སྐྱོང་ལུ་ལྡེ་མིག་ལག་ལེན་མ་རྐྱབས། ཡང་ཅིན་ ཤེལ་ལོ་གི་ལོ་རྒྱུས་ནང་ལུ་ བཟོ་སྐྲུན་ལྡེ་མིག་བཞག་ནི་མི་འོང་། ཐོ་བཀོད་འབད་ནི་དང་ བཀྲིས་བསྡུར་འབད་ནི་ དེ་ལས་ ལག་ལེན་མ་འཐབ་པའི་རྒྱབ་སྐྱོར་ཚུ་ནང་བཞག་མི་དགོ་།
- ཝོཊ ཡང་ན་ བཟོ་སྐྲུན་རྟགས་བཀོད་མི་རེ་གི་དོན་ལུ་ ཁྱད་དུ་འཕགས་པའི་ ཨེན་ཏྲོ་པི་ལྡེ་ཌིསི་ལག་ལེན་འཐབ་ཨིན། Passphrases འདི་ཁ་བྱང་འཛིན་སྐྱོང་པ་ ཡང་ན་ བཀྲམ་སྤེལ་བཞག་སའི་ བྱ་རིམ་ནང་ལུ་བཙུགསཔ་མ་གཏོགས་ ཡིག་སྣོད་དང་ རྒྱབ་སྐྱོར་སྦ་སྒོར་ཚུ་ནང་མ་བཙུགསཔ་སྦེ་ གསལ་བཀོད་འབད་ཡོད་པའི་ སྒེར་གྱི་ལྡེ་ཌེསི་ཅིག་ནང་ བཙུགས།
- Taira དང་ Minamoto གི་ལྡེ་མིག་ཚུ་སོ་སོ་སྦེ་བཞག་དགོཔ་ཨིན། Taira གི་ལྡེ་མིག་འདི་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་བརྟག་དཔྱད་འཕྲུལ་ཆས་ཅིག་ཨིནམ་ད་ Minamoto གྱི་ལྡེ་མིག་དེ་ བཟོ་སྐྲུན་གྲོགས་རམ་དབང་འཛིན་ཅིག་སྦེ་ལག་ལེན་འབད་དགོ།
- སྒེར་གྱི་ལྡེ་མིག་དང་ མི་མང་ལྡེ་མིག་ དེ་ལས་རྩིས་ཁྲ་ ID དང་རྩིས་ཁྲ་གི་ཡིག་གཟུགས་ དེ་ལས་ཁ་ཐོ་བཀོད་འབད་མི་ཚུ་ ལོག་སྤྱོད་འབད་ནི་ལུ་ འོས་འབབ་ཡོད་པའི་རྩིས་ཁྲ་སླར་གསོ་ ཡང་ན་ གསལ་སྟོན་ཚུ་ རྒྱབ་སྐྱོར་འབད། གྲོག་སྡེའི་ལྡེ་མིག་མེད་པའི་སྒེར་ལྡེ་མིག་འདི་ ལོག་སྤྱོད་འབད་བའི་སྐབས་ལུ་ ལག་ལེན་འཐབ་ནི་འཇམ་ཏོང་ཏོ་ཨིན།
- བཟོ་སྐྲུན་གྱི་བརྡ་རྟགས་ཚུ་གི་དོན་ལུ་ ཨེན་དྲིལ་ཨེབ་ལྡེ་མིག་ཅིག་དང་ ས་གནས་སོ་སོར་སྦེ་ ཨེབ་ལྡེ་ཁ་འབད་ཡོད་པའི་ ཨེན་དྲེལ་ཨེབ་ལྡེབ། ཨེབ་ལྡི་གུ་ལས་ སྔོན་འགོག་འབད་ནི་ལུ་ གཞི་བཞག་སྟེ་ ཀློག་ཐངས་རྐྱངམ་གཅིག་གིས་ བརྟག་དཔྱད་སླར་གསོ་འབདཝ་ཨིན།
- ཟུར་རྟགས་བཀོད་མི་ཡིག་ཆ་འདི་ བསྒྱུར་བཅོས་འབད་ ཡང་ན་ བསྒྱུར་བཅོས་འབད་བ་ཅིན་ སྒེར་གྱི་ལྡེ་མིག་དང་ Passphrase དང་ Backup Media དེ་ལས་ Signing host འདི་ཡང་མངོན་སུམ་སྦེ་མཐོང་ཚུགས་འོང་།

ལྷག་པར་དུ་བལྟ་བ་ཅིན་ [Storing Cryptographic Keys](/dz/guide/security/storing-cryptographic-keys.md)དང་ [Password Security](/dz/guide/security/password-security.md)

## 4. Testnet XOR ལུ་ Taira ལུ་ཨེབ་གཏང་འབད། {#_4-get-testnet-xor-on-taira}

ཐད་ཀར་དུ་ མི་མང་གི་ ཆུ་རྐ་ལག་ལེན་འཐབ་ཨིན། རླུང་ཤུགས་འདི་:

1. ཐོ་བཀོད་འབད་མི་ཅིག་བཟོ། ཡང་ན་ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་ཀྱི་རྩིས་ཁྲ་ Taira ID རྩིས་རྐྱབས་ཚུགས།
2. ད་ལྟོའི་ཐབ་ཤིང་གི་ puzzle འདི་འབག་ཤོག
3. `difficulty_bits` ཚད་འདི་ `0` ལས་བརྒལ་ཡོད་པ་ཅིན་ puzzle སེལ་འཐུ་འབད།
4. འབུབ་ཀྱི་དོན་ལུ་ ཞུ་ཡིག་བཙུགས་དགོ།
5. རྩིས་ཁྲ་དང་ ཡང་ན་ རྒྱུ་དངོས་གི་ཆ་བཞག་ཚུ་ མཐོང་ཚུགས་པའི་བར་དུ་བསྒུགས་ཏེ་ དངུལ་སྤྲོད་ཡི་གུ་ཚུ་བཏང་མ་ཚར་བར་སྡོད་དགོ།

མི་མང་གི་ལྡེ་མིག་འདི་ Taira I105 རྩིས་ཁྲ་ནང་ ID བསྒྱུར་བཅོས་འབད་འོང་།

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

རོལ་གྲོལ་འདི་འབག་ཤོག

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

ཐབ་ཤིང་འདི་ མི་མང་གི་ བརྟག་དཔྱད་དྲ་ལམ་ ཞབས་ཏོག་ཨིན། གལ་སྲིད་ puzzle ཡང་ན་ claim endpoint གིས་ `502`, timeout, ཡང་ན་ gateway level གི་འཛོལ་བ་གཞན་ཅིག་ལོག་འོང་པ་ཅིན་ ཁྱོད་ཀྱི་ལྡེ་མིག་དང་ client config ཚུ་མ་འགྱུར་བའི་ཧེ་མ་སྒུག་སྟེ་ ཡང་བསྐྱར་བརྩམས་དགོ།

དེའི་ལན་འདི་ འདི་བཟུམ་སྦེ་ཨིན།

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

གལ་སྲིད་ `difficulty_bits`འདི་ `0`ཨིན་པ་ཅིན་ རྩིས་ཁྲ་ ID རྐྱངམ་ཅིག་བཙུགས་དགོ།

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` ཚད་འདི་ `0` ལས་བརྒལ་མེད་པ་ཅིན་ མཚམས་སྦྱོར་དེ་ སེལ་ཞིནམ་ལས་ ཀྲོང་ཏོ་གི་མཐོ་ཚད་དང་ nonce འདི་རྩིས་དགོ།

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

གྲུབ་ཚིག་གི་ ཨག་རི་ཏིམ་འདི་:

1. བརྩོན་འགྲུས་འདི་ SHA-256 སྦེ་བཟོ་ནི་:
   - `iroha:accounts:faucet:pow:v2` གི་ བའི་ཊི་ཚུ་
   - UTF-8 གི་རྩིས་ཁྲ་ ID
   - `anchor_height` འདི་བཟུམ་སྦེ་ big-endian `u64`
   - `anchor_block_hash_hex` བའི་ཊི་སྦེ་རྩིས་སྟོནམ་ཨིན།
   - `challenge_salt_hex` བའི་ཊི་སྦེ་ཁ་གསལ་འབད་ཡོདཔ་ད་
2. `u64` nonces འདི་ big-endian 8-byte ཚད་འཛིན་སྦེ་ཨེབ་གཏང་འབད་ནིའི་ དཔའ་བཅམ་ပါ။
3. nonce གི་དོན་ལས་ scrypt འདི་ལག་ལེན་འཐབ་དགོ།
   - Password: 8-byte nonce
   - ཚྭ་: བི་ཊ་༣༢ ཀྱི་དཀའ་ངལ་
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - ཕྱིར་བཏོན་འབད་ཐངས་: 32 byte
4. ཨང་དང་པ་ཐོབ་མི་ nonce འདི་ཉུང་ཤོས་ར་ `difficulty_bits` གིས་ བི་ཊ་སྟོང་པ་སྦེ་འགོ་འདྲེན་འཐབ་ཨིན།

འབུབ་ཀྱི་ལན་ལུ་ དངུལ་རྐྱང་གི་རྒྱུ་དངོས་དང་ ཐིམ་ཕུག་གི་ཚོང་འབྲེལ་ཧེཤ་ཚུ་ཚུདཔ་ཨིན།

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

གནད་དོན་འདི་ ད་རེས་ HTTP `202 Accepted` ལུ་ བཏབ་དོ་ཡོདཔ་ཨིན། འདི་གི་ `asset_definition_id` འདི་ མི་མང་གི་ཁྲལ་ལས་ དངུལ་ཕོགས་ཐོབ་མི་ ད་ལྟོའི་ Taira ཁྲལ་གྱི་རྒྱུ་དངོས་ཨིན། དཔེ་སྟོན་ ID གི་ཚབ་ལུ་ ལན་འདེབས་ནང་ལས་བཏོན་དགོ། འབུབ་འདི་གིས་ ཞུ་ཡིག་དེ་ ཆ་འཇོག་འབད་ཡོདཔ་ད་ ཁོ་གིས་ `tx_hash_hex` དང་ `status: "QUEUED"` སླར་ལོག་རྐྱབ་པའི་བསྒང་ཨིན།

དེ་ལས་ རང་སོའི་འཐུས་སྤྲོད་ལེན་གྱི་ཞལ་འདེབས་མ་བཙུགས་པའི་ཧེ་མར་ དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ ཞིབ་འཚོལ་འབད་:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

གལ་སྲིད་ faucet ཐོབ་བརྗོད་དེ་ཆ་ལེན་འབད་ཡོད་རུང་ རྩིས་ཁྲ་དང་ རྒྱུ་དངོས་ཚུ་ ད་ལྟོ་མཐོང་མ་ཚུགསཔ་འབད་བ་ཅིན་ ཕྱིར་ཚོང་འདི་ public testnet queue processing གི་རྒྱབ་ལུ་ར་ ཡོདཔ་ཨིན། བལྟ་ཞིནམ་ལས་ བཏང་བའི་ཧེ་མར་ སླར་ཡང་བཀླག་ནིའི་ དཔའ་བཅམ་ཚུགས།

གྲ་སྒྲིག་འབད་ཚར་བའི་ ཐད་ཀར་དུ་ API བརྟག་ཞིབ་འབདཝ་ད་འདི་ `taira_faucet_claim.py`སྦེ་སྤོ་བཤུད་འབད་ཞིནམ་ལས་ Taira I105 རྩིས་ཁྲ་ ID ལུ་བབ་གཏང་དགོ།

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

འབུབ་འདི་ Taira བརྟག་ཞིབ་འབད་ཐངས་ཀྱི་དོན་ལུ་རྐྱངམ་གཅིག་ཨིན། ཁྱོད་ཀྱིས་ XOR བརྟག་དཔྱད་འབད་ཐངས་, འབུབ་རྩིས་ཁྲ་, ཡང་ན་ Taira ཀན་རི་རྟགས་མ་ཚུ་ Minamoto གི་ནང་ལག་ལེན་འཐབ་ནི་མི་འོང་།

## 5. Minamoto Client Config བཟོ་དགོ། {#_5-create-a-minamoto-client-config}

Minamoto གི་དོན་ལུ་ ཁྱད་པར་ཅན་ལྡེ་མིག་གཉིས་ལག་ལེན་འཐབ་ འབྲེལ་མཐུད་ཀྱི་དོན་ལུ་ Taira ལྡེ་མིག་ཚུ་ ལོག་མ་ལག་ལེན་འཐབ་།

བཟོ་ནི་ `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

མཐོ་ཤོས་གི་གནས་ཚད་ `chain` འདི་ current Nexus གློག་ཐག་ར་བ་གི་ལྡེ་མིག་ ID. `[account].profile = "minamoto"` གདམ་ཁ་རྐྱབས་ Minamoto I105 ལྕགས་ཀྱི་དབྱེ་བ་ཕྱེ་མི་; མཐའ་མཇུག་གི་སྒོ་ར་ཁའི་མིང་དང་ ལྕགས་ཐག་ ID འདི་གི་སྐོར་ལས་ ཐད་ཀར་དུ་ གདམ་ཁ་རྐྱབ་ནི་མི་འོང་།

Minamoto མི་མང་གི་ལྡེ་མིག་འདི་ I105 གི་རྩིས་ཁྲ་ ID ལུ་ mainnet prefix དང་གཅིག་ཁར་བསྒྱུར་གཏང་དགོ།

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

རྩིས་ཁྲ་དེ་ མང་ཤོས་ཀྱི་དྲ་ལམ་ནང་ལུ་ འཛུལ་ཞུགས་འབད་ནི་དང་ ཡང་ན་ གཞུང་སྐྱོང་འབད་ཐངས་ཐོག་ལས་ མ་དངུལ་མ་བསྡུ་ཚུན་ཚོད་ ཀློག་ཐངས་རྐྱངམ་གཅིག་ལུ་ བརྟག་ཞིབ་འབད།

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet ཡང་ན་ write-canary assistant འདི་ Minamoto ལུ་མ་ལག་ལེན་འཐབ་ནི་མི་འོང་།

## 6. Minamoto གི་རྩིས་ཁྲ་ལུ་དངུལ་ཕོགས་སྤྲོད་ནི་ XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto ཅ་ཆས་ཚུ་ བཟོ་སྐྲུན་འབད་ཐོག་ལས་ སྤྲོད་དགོཔ་ཨིན། XOR, དང་ Minamoto ཌེ་པི་ཊིཀ་མེད་མི་ རྩིས་ཁྲ་བཟོ་སྟེ་ཡོད་མི་ལུ་ ངོས་འཛིན་ཅན་གྱི་ མའི་ནེཊ་ཨོན་བཱའིན་ཌིང་ ཡང་ན་ དངུལ་རྩིས་གནས་སྤེལ་གྱི་ཐོག་ལས་ དངུལ་ཕོགས་སྤྲོད་ནི་ དེ་ལས་ XOR དངུལ་འབྲེལ་མཐུན་རྐྱེན་ཡོད་པའི་ནང་ལས་ Minamoto རྩིས་ཁྲ་

ཐོ་བཀོད་མ་བཙུགས་པའི་ཧེ་མར་ ཀན་ནོག་གི་རྩིས་ཁྲ་ ID དང་ མ་དངུལ་ཚུ་ བསྐྱར་ཞིབ་རྐྱང་ཐོག་ལས་བརྟག་དཔྱད་འབད་ Minamoto XOR འདི་ཡང་ བཟོ་སྐྲུན་གྱི་ཞལ་འདེབས་སྦེ་བརྩི་དགོ། དང་པ་ར་ Taira ལུ་ བྱ་བ་འདི་རང་ཉམས་མྱོང་འབད་ཞིནམ་ལས་ བཟོ་སྐྲན་ཀྱི་ལྡེ་མིག་སོ་སོ་སྦེ་བཞག་ དེ་ལས་ མེན་ཊེཊི་ཚོང་འབྲེལ་དེ་ ལོག་གཞི་སྒྲིག་འབད་ཚུགས་ཟེར་ མནོ་བསམ་མ་གཏང་།

Taira XOR གིས་ Minamoto གི་འཐུས་སྤྲོད་མི་ཚུགས། བརྟག་ཞིབ་འབད་ཐངས་ཀྱི་ལྷག་ལུས་དང་ཁྲལ་ཚུ་ Minamoto ལུ་སྤེལ་མི་བཏུབ་ཨིན།

## ཌེ་ཊ་ས་པི་སི་ནང་ ལཱ་འབད་ {#_7-work-inside-an-existing-dataspace}

གནད་སྡུད་ཀྱི་ས་ཁོངས་ནང་ སྡོད་མི་ཚུ་གི་དོན་ལུ་ ཁྱད་ཚད་ཅན་ཡོངས་ཁྱབ་གི་མིང་ལག་ལེན་འཐབ་། དཔེར་ན་ མི་མང་གི་གནས་སྡུད་ནང་གི་ ལས་འགུལ་གྱི་ས་ཁོངས་ནང་ལུ་ ལག་ལེན་འཐབ་དགོཔ་འདི་:

```text
apps.universal
```

ཁྱོད་ཀྱིས་རྩིས་ཁྲ་ལུ་ དགོས་མཁོ་ཅན་གྱི་ ངོས་ལེན་ཚུ་ཐོབ་པའི་ཤུལ་ལས་ ཌོ་मेनགི་དོན་ལུ་ གསང་བ་མེད་པའི་ intent `AliasSetupPlanRequestV1` བཟོ་ཞིནམ་ལས་ declarative planner ལག་ལེན་འཐབ་:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto གི་དོན་ལུ་ དམིགས་གཏད་དང་ འཆར་གཞི་ངོ་མ་སོ་སོ་ཅིག་ བཟོ་ནི་དང་ ཆ་འཇོག་འབད་ཡོདཔ་ཨིན། འཆར་གཞི་ཚུ་ ཁོང་རའི་ ལྕགས་ཐག་, དབང་ཚད་, འཚོ་བ་གནས་སྟངས་ཀྱི་ མཐུད་སྦྲེལ་འབད་ནི་དང་ དུས་ཡུན་ལུ་བཅའ་མར་གཏོགས་ཡོདཔ་ལས་ Taira གི་འཆར་གཞི་འདི་ ཡར་དྲག་གཏང་མི་ཚུགས་ ཡང་ན་ ལོག་སྤྱོད་འབད་ཚུགས།

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Account aliases གིས་ data spaces གི་རྒྱབ་སྒྲིལ་འདི་རང་ ལག་ལེན་འཐབ་ཨིན།

```text
alice@apps.universal
alice@universal
```

ཐད་ཀར་དུ་རྩིས་ཐོ་བཀོད་འབད་སའི་ ས་ཁོངས་ཚུ་ནང་ལུ་ Canonical still ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། I105 རྩིས་ཁྲ་ IDs. མིང་མིང་འདི་ མི་གིས་ཀློག་ཚུགས་པའི་ བསྡུ་སྒྲིག་ཅིག་སྦེ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ལས་ དེ་ཚུ་ ཀ་ནོ་ནི་ཀཱན་གྱི་རྩིས་ཁྲམ་ནང་ བཀག་ཆ་འབད་ཡོདཔ་ཨིན། IDs.

## ཌེ་ཊ་ས་པི་སི་གསརཔ་ བཟོ་ནི་ {#_8-provision-a-new-dataspace}

ཌེ་ཊ་ས་པི་སི་གསརཔ་འདི་ ལས་འཛིན་དང་ གཞུང་སྐྱོང་གནས་སྟངས་ལུ་ བསྒྱུར་བཅོས་འབདཝ་ཨིན། མི་མང་ Torii མཇུག་མཐར་ཐུག་གིས་ འགྲུལ་ལམ་དེ་ གཞི་སྒྲིག་འབད་ཡོད་པའི་ཌེ་ཊའི་ས་པིསི་ཚུ་ལུ་ བཏོན་གཏང་ཚུགས་རུང་ ངོ་མ་ཤེས་པའི་ཌེ་ཊི་ས་པི་ཨེས་ཀྱི་མིང་ཚུ་མ་བཏུབ་ཨིན།

བསྒྱུར་བཅོས་ཚུ་ གྲ་སྒྲིག་མ་རྐྱབ་པའི་ཧེ་མར་ ད་ལྟོའི་གནས་གོང་གི་ཡིག་ཐོ་འདི་ལག་ལེན་འབད་:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ལས་འཛིན་གྱི་རྩིས་ཁྲ་གི་དོན་ལུ་ རྒྱང་བསྒྲགས་ལམ་སྟོན་གི་གནས་སྟངས་འདི་ཡང་ བརྟག་དཔྱད་འབད་:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ཕྲང་ལམ་ ID, data space ID, validator set, fault tolerance, manifest, routing rules, and operational ownerཚུ་མཉམ་འབྲེལ་སྦེ་ བསྐྱར་ཞིབ་མ་འབད་བ་ཅིན་ མིང་མིང་གསརཔ་སྤེལ་མི་ཆོག། སྤྱིར་བཏང་ལག་ལེན་གྱི་རྩིས་ཁྲམ་ཅིག་གིས་ དགོས་མཁོ་ཅན་གྱི་ ངོས་ལེན་ཚུ་འབད་ཐོག་ལས་ ཌེ་ཊ་ས་པི་ལེན (data space) གི་ནང་འཁོད་ལུ་ SNS ཌེ་ཀྲ་ས་པིན (lease) བཟོ་ཚུགས་ནི་ཨིནམ་ད་ དེ་གིས་ གསལ་ཏོག་ཏོ་སྦེ་ མི་མང་གི་ གནད་སྡུད་ས་པི་ལེ་གསརཔ་བཙུགས་མི་ཚུགས་ཡོདཔ་ཨིན།

སྒེར་གྱི་ ཡང་ན་ ལས་སྡེའི་ གནད་སྡུད་ས་སྟོང་གི་དོན་ལུ་ བསྒྱུར་བཅོས་ཡིག་ཐོ་འདི་ གྲ་སྒྲིག་འབད།

- ཌེ་ཊ་ས་པི་སི་གི་ངོ་རྟགས་དང་ ཨང་གྲངས་ `id`
- འབྲེལ་མཐུད་ལམ་གྱི་འཛུལ་སྒོ་ ཡང་ན་ ད་ལྟོའི་ལམ་གྱི་བཅའ་ཡིག་
- ཌེ་ཊ་ས་པི་སི་ `fault_tolerance`
- ལམ་སྟོན་དང་རྩིས་ཁྲའི་གནས་ཚད་ཚུ་གི་དོན་ལུ་ ལམ་ལུགས་ཚུ་
- གནས་སྡུད་ཐོ་ཡིག་ཅིག་ ཡང་ན་ གནས་སྡུད་གནས་སྡུད་ནང་ UAID གི་ནུས་ཤུགས་ཚུ་བཏོན་པའི་སྐབས་ ཌེ་ཊ་ས་པི་ལེནཌ་ (rollout evidence) འདི་དང་འདྲན་འདྲ་ཨིན།
- སྲིད་བྱུས་དང་བསྟུན་པའི་ གྲོས་ཆོད་ དེ་ལས་ ལྟ་རྟོག་ཀྱི་དོན་ལུ་ གཞུང་སྐྱོང་གི་ངོས་ལེན་

བསྐྱར་ཞིབ་འབད་བཏུབ་པའི་ སྒྲིག་གཞི་དུམ་བུ་འདི་འདི་བཟུམ་ཨིན།

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

ལས་འཛིན་གྱི་ འཛིན་སྐྱོང་འབད་ཐངས་ནང་ འ་ནི་སྒོ་ར་ཚུ་ཚུད་དགོ།

- `iroha3d --sora --config <config.toml> --trace-config` གིས་ སེལ་འཐུ་འབད་ཡོད་པའི་ མཚམས་སྦྱོར་དེ་ བཏོན་འོང་།
- བཟོ་སྐྲུན་འབད་མི་ ཡང་ན་ བསྐྱར་ཞིབ་འབད་ཡོད་པའི་བརྡ་སྟོན་འདི་ ཧེཤ་དང་མིང་རྟགས་ཚུ་དང་གཅིག་ཁར་ archive འབད་ནི་ཨིན།
- དུ་པ་བརྟག་དཔྱད་ཚུ་ Taira ལུ་འབད་ཚར་ཞིནམ་ལས་ Minamoto སྐུལ་བསྒྲགས་མ་འབད་བའི་ཧེ་མ་ འབད་ཚུགས།
- བསྒྱུར་བཅོས་འབད་བའི་ཤུལ་ལུ་ `/status` གི་ཡིག་ཐོ་ནང་ལུ་ གྲོས་འཆར་ཅན་གྱི་ལམ་དང་ ཌེ་ཊ་ས་པི་སི་སྟོན་ཡོདཔ་ཨིན།
- `iroha app nexus lane-report --summary` གིས་ དགོས་མཁོ་ཅན་གྱི་ བརྡ་བྱང་ཚུ་མ་མཐོང་པའི་ སྙན་ཞུ་མ་འབད་བས།

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ཌེ་ཊ་ས་བཱསི་དེ་ Minamoto ལུ་ ཡར་སེང་འབད་ཞིནམ་ལས་རྐྱངམ་ཅིག་ Taira གཞི་བཙུགས་འབད་ནི་དང་ དུ་པ་བརྟག་དཔྱད་འབད་ནི་དང་ ལྟ་རྟོག་འབད་ནི་ དེ་ལས་ གཞུང་སྐྱོང་གི་ཁུངས་ཚུ་ མཇུག་བསྡུ་ཚར་བའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ཨིན།

## འབྲེལ་ཡོད་ཤོག་ལེབ་ཚུ་ {#related-pages}

- [གཞི་བཙུགས་འབད་ Iroha 3](/dz/get-started/install-iroha.md)
- [Iroha 3 གི་ཐོག་ལས་ལཱ་འབད་ CLI](/dz/get-started/operate-iroha-via-cli.md)
- [སྒེར་གྱི་གནས་སྡུད་ཀྱི་དོན་ལུ་རྒྱབ་སྐྱོར་འཐུས་](/dz/get-started/private-dataspace-fee-sponsor.md)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
- [འོད་ཡིག་གི་མིང་། ](/dz/reference/genesis.md)
