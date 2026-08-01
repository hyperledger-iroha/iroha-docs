---
translation_locale: dz
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་ཚུ་ {#iroha-special-instructions}

ང་བཅས་ཀྱིས་སླབ་པའི་སྐབས་ [ག་དེ་སྦེ་ Iroha ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན།](/dz/blockchain/iroha-explained), ང་བཅས་ཀྱིས་འདི་སླབ་ཅི་ Iroha དམིགས་བསལ་གྱི་བསླབ་བྱ་འདི་ འཛམ་གླིང་གི་གནས་སྟངས་ལུ་ བསྒྱུར་བཅོས་འབད་ནི་གི་ ཐབས་ལམ་གཅིག་པུ་ཨིན། ང་བཅས་ཀྱིས་ ག་ཅི་བཟུམ་གྱི་བསླབ་བྱ་ཚུ་ཐོབ་དོ་ཡོདཔ་ཨིན་ན? ཁྱོད་ཀྱིས་ ཆོས་སྟོན་པའི་ནང་ཡོད་མི་ སྐད་ཡིག་གི་ཁ་ཐུག་ལས་ བརྡ་འགྲེལཔ་ཚུ་ ཀློག་ཚུགས་པ་ཅིན་ ཁྱོད་ཀྱིས་ བརྡ་བཀོད་དག་པ་ཅིག་མཐོང་ཚར་ནུག `Register<Account>` དང་ `Mint<Numeric>`.

Iroha དམིགས་བསལ་བསླབ་བྱ་ཚུ་གི་ཐོ་ཡིག་འདི་ ནཱ་ལུ་བཀོད་ཡོདཔ་ཨིན།

|བརྡ་སྟོན་ |འགྲེལ་བཤད་ |
| --------------------------------------------------------- | ------------------------------------------------ |
| [ཐོ་བཀོད་/རྩིས་མེད་འབད་ ](#un-register) |ID བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལུ་ blockchain ནང་ལུ་སྡེ་ཚན་གསརཔ་ལུ་བྱིན་. |
| [Mint/Burn](#mint-burn) |Mint/burn ཨང་གྲངས་ཐོན་སྐྱེད་ཚུ་ ཡང་ན་ སླར་ལོག་འབད་ནི་འདི་ འགོ་བཙུགས་འབདཝ་ཨིན། |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |བཀྲམ་སྤེལ་འབད་ཐངས་ཀྱི་འབྱུང་ཁུངས་ metadata. |
| [SetParameter](#setparameter) |ལྕགས་ཐག་གི་ཁྱབ་ཚད་ཅིག་ གཞི་སྒྲིག་རྐྱབས། |
| [Grant/Revoke](#grant-revoke) |ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་བྱིན་ ཡང་ན་བཏོན་གཏང་། |
| [བསྒྱུར་བཅོས་](#transfer) |རྒྱུ་དངོས་གི་བཅའ་མར་གཏོགས་ནི་དང་ གཏན་འཁེལ་གྱི་གནས་གོང་ཚུ་ བསྒྱུར་བཅོས་འབདཝ་ཨིན། |
| [རང་ལུགས་ཀྱི་གཏའ་མ་དང་ རྒྱུ་དངོས་གི་ལྡེ་མིག་ཚུ་ ](#native-escrow-and-asset-locks) |ཐོ་བཀོད་འབད་ཡོད་པའི་ཨང་གྲངས་ནོར་རྫས་ཚུ་ ལྕོགས་གྲུབ་ཅན་སྦེ་བཞག་དགོ།|
| [ExecuteTrigger](#executetrigger) |ཐིག་ཁྲམ་ཚུ་ལག་ལེན་འཐབ་དགོ། |
| [ཐོ་བཀོད་/སྤྱོད་ལམ་/ཡར་དྲག་གཏང་ ](#other-instructions) |ཐོ་བཀོད་, རྒྱུན་རིམ། ཡང་ན་ runtime གི་སྤྱོད་ལམ་ཡར་དྲག་གཏང་། |

ང་བཅས་ཀྱིས་ Iroha དམིགས་བསལ་བསླབ་བྱ་ཚུ་གི་ གྲོས་བསྡུར་ཐོག་ལས་འགོ་འགོ་བཙུགསཔ་ཨིན། ཁྱོད་ཀྱིས་བཀོད་རྒྱ་རེ་རེ་ལུ་ ག་ཅི་གི་དོན་ལུ་འབོ་ཚུགས་ནི་ཡོདཔ་ཨིན་ན་དང་ བྱ་སྟབས་མ་བདེཝ་རེ་རེ་གི་དོན་ལུ་ ལག་ལེན་འཐབ་བཏུབ་པའི་བསླབ་བྱ་ཚུ་ག་ཅི་ཨིན་ན?

## གྲུབ་མཐའ་ཚུ་ {#summary}

བརྡ་བཀོད་རེ་རེ་གི་དོན་ལུ་ བརྡ་བཀོད་འདི་ལག་ལེན་འཐབ་ཚུགས་པའི་ གནད་དོན་ཚུ་གི་ཐོ་ཡིག་ཅིག་ཡོདཔ་ཨིན། དཔེར་ན་ བསྒྱུར་བཅོས་གྱི་འགྱུར་སྒྲིག་ཚུ་གིས་ ལག་ལེན་ཅན་གྱི་རྩིས་དེབ་ཀྱི་ གནད་དོན་དང་ ཨང་གྲངས་གི་རྒྱུ་དངོས་ཚུ་བཀོདཔ་ཨིན། Minting གིས་ ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ཁོག་བཀལཝ་མ་ཚད་ སླར་ལོག་འབད་ནི་ལུ་བརྟེན་འབདཝ་ཨིན།

སྒྲིག་གཞི་ལ་ལུ་ཅིག་ནང་ དམིགས་ཡུལ་ཅིག་ ངེས་གཏན་སྦེ་བཀོད་དགོཔ་ཨིན། དཔེར་ན་ ཁྱོད་ཀྱིས་ རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་བ་ཅིན་ ཁྱོད་ཀྱིས་ རྟག་བུ་རང་ དེ་ཚུ་ ག་གི་རྩིས་ཁྲ་ལུ་ བསྒྱུར་བཅོས་འབད་དོ་ཡོདཔ་ཨིན་ན་ གསལ་སྟོན་འབད་དགོཔ་ཨིན། གཞན་ཁ་ཐུག་ལས་ ཁྱོད་ཀྱིས་ གནད་དོན་တစ်ခုကို ཐོ་བཀོད་འབད་བའི་སྐབས་ལུ་ ཁྱོད་ལུ་དགོ་མི་དེ་ ཁྱོད་ཀྱིས་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ འདོད་པའི་དངོས་པོ་འདི་ཨིན།

|བརྡ་སྟོན་ |གནད་དོན་ཚུ་ |འགྲོ་འགྲུལ་འབད་སའི་ས་གནས་ |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |སྤྱིར་བཏང་མངའ་སྡེ། ཌེ་ཊ་ས་པི་སི་གི་མིང་། དང་རྩིས་ཁྲའི་མིང་ཐོ་བཀོད་འབད་|                      |
| [ཐོ་བཀོད་/རྩིས་མེད་འབད་ ](#un-register) |རྩིས་ཁྲ་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, NFTs, འགན་འཁྲི་, trigger, peers; ཌོ་མེ་ནེཊ་བཏོན་ཐོ།|                      |
| [Mint/Burn](#mint-burn) |ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ བརྒྱུད་འཕྲིན་ལོག་བཤད་པ་ |རྩིས་ཁྲ་ ཡང་ན་ trigger |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[ metadata](./metadata.md) ཡོད་པའི་དངོས་པོ་: ས་ཁོངས་,རྩིས་ཁྲ་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, NFTs, RWAs, trigger ཚུ་|                      |
| [SetParameter](#setparameter) |ལྕགས་ཐག་གི་བརྡ་དོན་ཚུ་ |                      |
| [Grant/Revoke](#grant-revoke) | [འགན་འཁྲི་ཚུ་དང་ ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/blockchain/permissions.md) |རྩིས་ཁྲ་དང་ འགན་ཁུར་ཚུ་ |
| [བསྒྱུར་བཅོས་](#transfer) |ས་ཁོངས་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་, NFTs |རྩིས་ཁྲ་ |
| [རང་ལུགས་ཀྱི་གཏའ་མ་དང་ རྒྱུ་དངོས་གི་ལྡེ་མིག་ཚུ་ ](#native-escrow-and-asset-locks) |ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་གི་བཅའ་ཁྲལ་དང་ རྒྱུ་དངོས་ཚུ་གི་བཅའ་ཁྲལ། ངོ་མ་ཤེས་པའི་བཅའ་ཁྲལཔ་ཚུ་ |ཚོང་ཉོ་མི་ཚུ་དང་ འགྲོ་འགྲུལ་འབད་སའི་ ས་ཁོངས་ཚུ་ ཡང་ན་ རྩོད་གཞི་ནང་ བཅའ་མར་གཏོགས་ནི་ |
| [ExecuteTrigger](#executetrigger) |trigger |                      |
| [ཐོ་བཀོད་/སྤྱོད་ལམ་/ཡར་དྲག་གཏང་ ](#other-instructions) |ཐོ་བཀོད་ཐོ་ཡིག་, ལག་ལེན་པ་ལུ་དམིགས་ཏེ་ ཁེ་ཕན་གྱི་ཐོ་བཀོད་ཚུ་, ལག་ལེན་པའི་གནས་གོང་བཟོ། |                      |

ད་རུང་ ISI ལུ་བལྟ་ནིའི་ཐབས་ལམ་གཞན་ཅིག་ཡོདཔ་ད་ ཁོང་གིས་འདོགས་ཡོད་པའི་ ལེན་ཐོ་ཨིན་ཊཱག་གི་ཐད་ལུ་:

|དམིགས་གཏད་ |ལམ་སྟོན་ཚུ་ |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|རྩིས་ཁྲ་ |ཐོ་བཀོད་འབད་/མ་བཙུགས་པའི་རྩིས་ཁྲ་,ཐོབ་ཐངས་ཀྱི་རྒྱུ་དངོས་ཚུ་, རྩིས་ཁྲ་ཚུ་གི་གནས་གོང་གསར་བཅོས་འབད་ནི་, ཐོབ་ཐངས་དང་ འགན་ཁུར་ཚུ་བྱིན་/ཕྱིར་འབུད་ |
|ས་ཁོངས་ |ཌོ་मेन གཞི་བཙུགས་འབད་ནི་དང་ ཐོ་བཀོད་འབད་མ་བཏུབ་པའི་ཌོ་मेनཚུ་ བཏོན་གཏང་ནི་དང་ ཌོ་เมནའི་གི་ ཐོབ་དབང་སྤེལ་ནི་ དེ་ལས་ ཌོ་ମେནའི་གི་ མེ་ཊ་ཌེ་ཊ་ཚུ་ ད་ལྟོའི་བར་ན་ཡང་བཟོ་བཅོས།|
|རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ |ཐོ་བཀོད་ / ཐོ་བཀོད་ཀྱི་དོན་འགྲེལ་ཚུ་, རྒྱུན་འགྲུལ་གྱི་དབང་ཆ་, ད་ལྟོའི་བརྡ་དོན་ཚུ་ |
|རྒྱུ་དངོས་ |ཨང་གྲངས་ཉུང་ཚད་ / བསྲེག་གཏང་ཐབས། ཨང་གྲངས་ཉུང་གནས་ཚུལ།|
|གཏན་འཁེལ་གཏེར་ |ཁ་ཕྱེ་, ངོས་ལེན་འབད་, གཏན་འཁེལ་སྤྲོད་ཐོ་བཀོད་བཏང་། བཏོན་གཏང་། ཆ་མེད་གཏང་། རྩོད་པ་ཕྱོགས།། གྲོས་ཐག་ཆད།། ཡང་ན་ རང་སོའི་བདག་འཛིན་ཐོ་ཡིག་ཚུ་མཇུག་བསྡུ་བཅུག།|
|NFT |Register/unregister NFTs, transfer ownership, updated metadata |
|RWA |ཨང་གྲངས་ཚུ་ ཐོ་བཀོད་འབད་ནི་དང་ བརྗེ་སོར་འབད་ནི་གི་ ཚད་གཞི་བཞག་ནི་/སེལ་འཐུ་འབད་ནི་ མུ་ཏིག་གཏང་ནི་ (freeze) མུ་ཏོང་གཏང་ནི་ མཉམ་འབྲེལ་བཟོ་ནི་ མེ་ཊ་ཌེ་ཊ་ཚུ་ ད་ལྟོའི་གནས་སྟངས་ནང་བཙུགས་ནི་དང་ ལག་ལེན་འཐབ་ནི་ |
|ཐིག་ཁྲམ་ |Register/unregister, mint/burn trigger repeats, execute trigger, update trigger metadata ཚུ་ ཐོ་བཀོད་འབད་ནི་དང་སེལ་འཐུ་འབད་ནི་|
|འཛམ་གླིང་ |Register/unregister peers and roles, set parameters, upgrade the executor  ཡིག་ཚང་གི་འགན་ཁུར་འདི་སེལ་འཐུ་འབད་|

## CLI དཔེ་སྟོན་ཚུ་ {#cli-examples}

འ་ནི་ཤོག་ལེབ་ནང་གི་དཔེ་སྟོན་འདི་ ཁྱོད་ཀྱིས་ཁ་ཐུག་ལུ་ཡོད་པའི་ Iroha ལས་སྡེའི་ས་ཁོངས་ནང་ལས་ ཌེ་པཱལཊ་གི་གནས་སྐབས་ཀྱི་ གནས་སྐབས་ཀྱི་ client སྒྲིག་ལམ་ལུ་ གཞི་སྒྲིག་འབད་ཐོག་ལས་ བཀའ་རྒྱ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་སྦེ་བཀོད་འོང་།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

ཁྱོད་ཀྱིས་ `iroha` ཌའི་ལོག་གཞི་བཙུགས་འབད་བ་ཅིན་ འདི་ཚབ་ལུ་ `iroha --config ./defaults/client.toml` ལག་ལེན་འཐབ་ཨིན། ཁྱོད་ཀྱི་ཁ་ཐིག་ལས་ གནས་གོང་ཚུ་དང་གཅིག་ཁར་ འོག་གི་གནས་ཚད་འཛིན་བཟུང་འབད་:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

མི་མང་ལུ་ དམིགས་གཏད་བསྐྱེད་པའི་སྐབས་ལུ་ Taira བརྟག་དཔྱད་ net, ལག་ལེན་འཐབ་ནི་ Taira client སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 10 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ཟླ 6 སྔོན་ལ་གསར་བཅོས་བྱས། [Testnet བཏོན་ཐོབ། XOR འབད་ནི་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) འདི་བཟུམ་སྦེ་ `taira_faucet_claim.py`, དེ་ལས་ claim testnet XOR གློག་ཐག་ནང་ལས་:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

འབུ་ཊི་གིས་དངུལ་སྤྲོད་མི་ རྒྱུ་དངོས་ཚུ་མཐོང་ཚར་བའི་ཤུལ་ལས་ ཚོང་འབྲེལ་ཡིག་འབྲུ་འབྲི་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་ ས་སྣུམ་གྱི་ རྒྱུ་དངོས་ཚུ་གི་ metadata མཐུད་སྦྲེལ་འབད་:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` འདི་ domain དང་ SNS lease བཟོ་ནིའི་དོན་ལུ་ འགོ་དང་པ་ཐོན་པའི་ལམ་ལུགས་ཨིན། འདི་གིས་ data spaces, owner, lease term, and quote guardཚུ་ གསལ་བཀོད་འབད་ཞིནམ་ལས་ དགོས་མཁོ་ཅན་གྱི་གནས་སྟངས་ག་ར་ atomically བཟོ་སྐྲུན་འབད་ནི་དང་ ཡང་ཅིན་ བསྐྱར་གསོ་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ `POST /v1/aliases/setup/plan` ཚད་འཛིན་འབད་ཡོད་པའི་མཐའ་མཇུག་གི་སྒོ་ཡང་ན་ CLI སྒྲིག་འཇུག་ཐོ་བཀོད་འདི་ལག་ལེན་འཐབ་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

དམིགས་གཏད་དང་ འཆར་གཞི་འདི་ གསང་བ་མེད་རུང་ ཐབས་ལམ་རྟགས་ཚུ་ལག་ལེན་འཐབ་སྟེ་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་རྩིས་ཁྲ་དང་གཅིག་ཁར་ སྤྱིར་བཏང་གི་ཞལ་འདེབས་བཙུགས་ཡོདཔ་ཨིན། འཆར་གཞི་དེ་ ལྕགས་ཐག་དང་དབང་ཤུགས་ དེ་ལས་ དུས་ཡུན་མཐའ་མ་ལུ་བཅའ་མར་གཏོགས་དོ་ཡོདཔ་ལས་ གཞན་མི་ཁ་ཐུག་ལུ་ ལོག་སྤྱོད་མ་འབད་ཚུགས།

## (Un) ཐོ་བཀོད་འབད་ {#un-register}

ཐོ་བཀོད་དང་མ་བཙུགས་ནི་དེ་ ID བྱིན་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་མི་བཀོད་རྒྱ་ཚུ་ཨིན། ལས་འཛིན་གསརཔ་ཅིག་ལུ་ བཀྲིས་སྒང་གི་ཧེ་མར་ཨིན།

ཐོ་བཀོད་འབད་ཚུགས་མི་དེ་ `Registrable` དང་ `Identifiable` གཉིས་ཆ་ར་ཨིན་ དེ་འབདཝ་ད་ `Identifiable` འདི་ག་ར་ `Registrable`མེན། དངོས་པོ་མང་ཤོས་ཅིག་ ཐད་ཀར་དུ་ཐོ་བཀོད་འབདཝ་ཨིན་ ཨིན་རུང་ གནད་དོན་ལ་ལུ་ཅིག་ནང་ བཀྲིས་ཧྲིལ་བུའི་ནང་ཡོད་པའི་ངོ་ཚབ་འདི་ གནས་སྡུད་མང་སུ་ཅིག་ཡོདཔ་ཨིན། ཉེན་སྲུང་དང་གྲུབ་འབྲས་ཀྱི་དོན་ལས་ ང་བཅས་ཀྱིས་ གནད་སྡུད་བཟོ་སྐྲུན་འབད་མི་ཚུ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། དཔེར་ན་ `NewAccount` འདི་དང་འདྲཝ་སྦེ་ རེ་རེ་ཇུས་ཊར་ནང་ལུ་ བདག་དབང་གི་དཔང་རྟགས་བཀོད་ཐོ་བཀོད་འབདཝ་ཨིན། སྤྱིར་བཏང་ལུ་ ཐོ་བཀོད་འབད་ཚུགས་མི་ཆ་མཉམ་ཡང་ ཐོ་བཀོད་ཀྱི་རྩིས་མེད་འབད་ཚུགས། ཨིན་རུང་ དེ་འཇམ་ཏོང་ཏོ་དང་ མགྱོགས་པ་ཅིག་མེདཔ།

ཁྱོད་ཀྱིས་རྩིས་ཁྲ་ཚུ་ ཐོ་བཀོད་འབད་ཚུགས། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ NFTs, འདྲན་འདྲ་, འགན་འཁྲི་,དང་ trigger. Domain setup ལག་ལེན་འཐབ་ནི་ `EnsureAlias`; raw `Register::Domain` payload འདི་ genesis/bootstrapགི་དོན་ལུ་བཞག་ཡོདཔ་ཨིན། peer registration ལག་ལེན་འཐབ་ནི་`RegisterPeerWithPop` འདི་གིས་ peer key གི་དབང་འཛིན་གྱི་ཁུངས་སྐྱེལ་འབག་ཨིན། [མིང་ཐོ་བཀོད་ཞལ་འཆེས་](/dz/reference/naming.md)ལུ་བལྟ་ཞིནམ་ལས་ ལས་འཛིན་གྱི་མིང་གུ་ བཀག་དམ་ཚུ་གི་སྐོར་ལས་ ཤེས་ཚུགས།

RWA ལྡོག་ཕྱོགས་ཚུ་ དམིགས་གཏད་ཅན་གྱི་ `RegisterRwa` བརྡ་བཀོད་ཐོག་ལས་ བཟོ་སྐྲུན་འབད་ཡོདཔ་ཨིན། ད་ལྟོའི་བརྡ་སྟོན་ནང་ `UnregisterRwa` བརྡ་བཀོད་འདི་མེད་; ངོ་སྤྲོད་འབད་མི་གི་གྲངས་རྩིས་སླར་གསོ་འབད་ནི་ལུ་ `RedeemRwa` ལག་ལེན་འཐབ་དགོ།

::: info

ཁྱོད་ཀྱིས་ [genesis block](/dz/guide/configure/genesis.md)འདི་ `genesis.json`ནང་ལུ་ ག་དེ་སྦེ་ གཞི་བཙུགས་འབད་ནི་སྦེ་ ཐག་བཅད་ཡོདཔ་ཨིན་ནའི་ཐད་ཁར་ (དམིགས་བསལ་དུ་ ཁྱོད་ཀྱིས་ཆོག་ཐམ་གི་རྟགས་མཚན་ཚུ་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན་ན་མེན་ན་) རྩིས་ཁྲ་ཅིག་ ཐོ་བཀོད་ཀྱི་ བྱ་རིམ་དེ་ ཁྱད་པར་སྦོམ་འགྱོ་ཚུགས། སྤྱིར་བཏང་ལུ་ ང་བཅས་ཀྱིས་ འདི་བཟུམ་སྦེ་བཀོད་ཚུགསཔ་ཨིན།

- མི་མང་གི་ blockchainནང་ལུ་ མི་ག་གིས་ཡང་ ཐོ་བཀོད་འབད་ཚུགསཔ་ཨིན།
- སྒེར་སྡེའི་ blockchainནང་ལུ་ རྩིས་ཁྲ་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ ཁྱད་དུ་འཕགས་པའི་ བྱ་རིམ་ཅིག་འོང་ཚུགས། རང་ལུགས་ཀྱི་ སྒེར་སྡེ་གི་ blockchainནང་ལུ་ འདི་འབདཝ་ལས་ རྩིས་ཁྲའི་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ ཁྱད་དུ་ལྡན་གྱི་ བྱ་རིམ་མེད་པའི་ blockchainནང་ལུ་ ཁྱོད་ཀྱིས་རྩིས་ཁྲ་གཞན་ཅིག་ ཐོ་བཀུད་འབད་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཡོདཔ་ཨིན།

ང་བཅས་ [གིས་ སྒེར་གྱི་དང་ མི་མང་གི་ བཀྲམ་སྤེལ་ཁང་](/dz/guide/configure/modes.md)ཚུ་བསྡུར་འབད་བའི་སྐབས་ལུ་ ཁྱད་པར་འདི་ དབྱེ་ཞིབ་ནང་ གྲོས་བསྟུན་འབདཝ་ཨིན།

:::

::: info

འདི་འབདཝ་ལས་ ད་རེས་ འདྲན་འདྲ་མཉམ་ཅིག་ ཐོ་བཀོད་འབད་མི་དེ་ ཧེ་མ་གི་ ཡིད་ཆེས་འདྲན་འདྲ་ཚོགས་པའི་ནང་ མ་ཚུད་མི་འདྲན་འདྲ་ཚུ་ མཐུད་སྦྲེལ་འབད་ནིའི་ཐབས་ལམ་གཅིག་པུ་ཨིན།

:::

blockchain འདྲ་ཕབ་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ སྐད་ཡིག་གི་དམིགས་བསལ་ལམ་སྟོན་ལག་ལེན་འཐབ་:

|སྐད་ཡིག་ |ལམ་སྟོན་ |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/dz/get-started/operate-iroha-via-cli.md) ཌོ་मेन གཞི་བཙུགས་འབད་ནི་དང་རྩིས་ཁྲ་དང་ རྒྱུ་དངོས་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་དགོ།|
|Rust |[Rust སྦྱོང་བརྡར་ལག་ལེན་འཐབ་](/dz/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java སློབ་སྟོན་](/dz/guide/tutorials/kotlin-java.md) ལག་ལེན་འཐབ་དགོ། |
|Python |[Python སྦྱོང་བརྡར་ལག་ལེན་འཐབ་](/dz/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript སྦྱོང་བརྡར་འདི་ལག་ལེན་འཐབ་ନ୍ତୁ ](/dz/guide/tutorials/javascript.md).|

ཌོ་མེ་ནེཌ་ཚུ་ གཞི་བཙུགས་འབད་ནིའི་དོན་ལུ་ འཆར་གཞི་བརྩམ་ནི་དང་ ལག་ལེན་འཐབ་ནི་ དེ་ལས་ དགོས་མཁོ་མེད་པའི་བསྒང་ལས་ དོ་མེ་ནེ།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

ཐོ་བཀོད་དང་མ་ཐོ་བཀོད་འབད་མི་རྩིས་ཁྲ་ཚུ་

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

ཐོ་བཀོད་དང་མ་ཐོ་བཀོད་འབད་ཡོད་པའི་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

ཐོ་བཀོད་དང་ ཐོ་བཀོད་ཀྱི་རྩིས་མེད་འབད་ NFTs ཐོ་བཀོད། NFT གིས་ ནང་དོན་འདི་ JSON ལས་ཐངས་ཅན་ནང་བཙུགས་མི་ནང་ལས་ བསྐྱར་ཞིབ་འབདཝ་ཨིན།

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

ཐོ་བཀོད་དང་མ་ཐོ་བཀོད་འབད་ནིའི་འགན་ཁུར་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

ཐོ་བཀོད་དང་ ཐོ་བཀད་མ་བཏུབ་པའི་ གློག་ཐག་ར་བ་འདི་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ IVM bytecode ཡང་ན་ བརྡ་བཀོད་གི་ཐོ་ཡིག་ཅིག་ དགོཔ་ཨིན། དཔེ་འདི་ནང་ལུ་ `Log` སྒྲིག་གཞི་འདི་ CLI དང་གཅིག་ཁར་ བཟོ་ཞིནམ་ལས་ ཐོ་བཀོད་པ་ནང་བཙུགས་འབདཝ་ཨིན།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

གྲྭ་ཚང་ཚུ་ ཐོ་བཀོད་དང་མ་ཐོ་བཀོད་འབད་ BLS ལྡེ་མིག་དང་ PoP འདི་ཡང་ `kagami` དང་གཅིག་ཁར་བཏོན་གཏང་པ་ཅིན་ ཁྱོད་ཀྱིས་ད་ལྟོ་འདི་མེད་པ་ཅིན་:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## བཟོ་སྐྲུན་འབད་མི་ཚུ་ {#mint-burn}

བཟོ་སྐྲུན་དང་འཚིག་ནི་དེ་ ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་ཚུ་ཨིནམ་ད་ འདི་ཡང་ ཐོ་བཀོད་ཐེངས་ཉུང་སུ་ཅིག་འབད་ཐོག་ལས་ འགོ་བཙུགས་དོ་ཡོདཔ་ཨིན། རྒྱུ་དངོས་ལ་ལུ་ཅིག་གིས་ བཟོ་སྐྲག་འབད་ནི་མེད་ཟེར་ གསལ་སྟོན་འབད་བཏུབ། འདི་གི་དོན་ལས་ ཁོང་གིས་ ཐོ་བཀོད་ཀྱི་ཤུལ་ལས་ ཚར་གཅིག་རྐྱངམ་གཅིག་ བཟོ་སྐྲན་འབད་ཚུགས་འོང་།

རྒྱུ་དངོས་ཚུ་ རྩིས་ཁྲ་ངོ་མ་ཅིག་ལུ་ བཙུགས་དོ་ཡོདཔ་ད་ དེ་ཡང་ འགོ་དང་པ་ར་ རྒྱུ་དངོས་དེ་ ཐོ་བཀོད་འབད་མི་དེ་ཨིན། རྒྱུ་དངོས་གི་གྱངས་ཁ་འདི་ ཁེ་ཕན་མེད་མི་ཨིནམ་ལས་ ཁྱོད་ཀྱིས་ནམ་ཡང་ `$-1.0` གྱི་རྒྱུ་དངོས་ ཐོབ་མ་ཚུགས། ཡང་ན་ ཁེ་ཕན་མེད་པའི་དངུལ་ཕོགས་བྱིན་ཞིནམ་ལས་ དངུལ་ཕོགས་ཐོབ་ཚུགས།

Mint blockchain རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ སྐད་ཡིག་གི་དམིགས་བསལ་གྱི་ལམ་སྟོན་ལག་ལེན་འཐབ་:

- [CLI](/dz/get-started/operate-iroha-via-cli.md)
- [Rust](/dz/guide/tutorials/rust.md)
- [Kotlin/Java](/dz/guide/tutorials/kotlin-java.md)
- [Python](/dz/guide/tutorials/python.md)
- [JavaScript/TypeScript](/dz/guide/tutorials/javascript.md)

འདི་ནང་ལུ་ རྒྱུ་དངོས་ཚུ་ མེ་གིས་འཚིག་པའི་དཔེ་ཚུགས།

- [CLI](/dz/get-started/operate-iroha-via-cli.md)
- [Rust](/dz/guide/tutorials/rust.md)

ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Mint དང་ burning trigger repeats:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## བསྒྱུར་བཅོས་ {#transfer}

བརྗེ་སོར་ཚུ་གིས་རྩིས་ཁྲ་ཚུ་གི་བར་ན་ རྒྱུ་དངོས་དང་གོང་ཚད་སྤོ་བཤུད་འབདཝ་ཨིན། ཡོངས་འབྲེལ་གྱི་ བརྗེ་སུད་དབྱེ་བ་ཚུ་གིས་ ས་ཁོངས་ཚུ་དང་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ དེ་ལས་ ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་ཚུ་བཀོདཔ་ཨིན། དང་ NFTs. RWA quantity movement ལག་ལེན་འཐབ་ནི་ dedicated `TransferRwa` དང་ `ForceTransferRwa` བརྡ་བཀོད་ཚུ་ [གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་](/dz/blockchain/rwas.md).

འདི་གི་དོན་ལུ་ རྩིས་ཁྲ་སྤྲོད་དགོཔ་ཨིན། [རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་ནིའི་ཆོག་ཐམ་](/dz/reference/permissions.md). དཔྱད་ཡིག་འདི་ནང་ལུ་ རྒྱུ་དངོས་ཚུ་ ག་དེ་སྦེ་སྤོ་བཤུད་འབད་ཡོདཔ་ཨིན་ནའི་ དཔེ་གཅིག་བཀོད་དགོ། [CLI](/dz/get-started/operate-iroha-via-cli.md) ཡང་ན་ [Rust](/dz/guide/tutorials/rust.md).

ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

གནས་སྤོ་བཤུད་ domain, asset definition, and ownership NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## རང་ལུགས་ཀྱི་དངུལ་ཁང་དང་ རྒྱུ་དངོས་ཚུ་གི་ལྡེ་མིག་ཚུ་ {#native-escrow-and-asset-locks}

Native escrow instructions གིས་ ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ ledger- འཛིན་སྐྱོང་འབད་ཡོད་མི་ protocol custody ནང་ lock འབདཝ་ཨིན། ཁོང་ marketplace style settlement, generic asset locks དང་ anonymous shielded escrow flows གི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན།

ཚོང་འབྲེལ་གྱི་ས་ཁོངས་ནང་ གཏན་འཁེལ་གྱི་ལག་ལེན་ཚུ་ `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, དང་ `ResolveEscrowDispute`. སྤྱིར་བཏང་རྒྱུ་དངོས་ཀྱི་ལྡེ་མིག་ལག་ལེན་འཐབ་ནི་ `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, དང་ `ExpireAssetLock`. Anonymous escrow གིས་ཚོང་ཁྲོམ་གྱི་ཚེ་རིང་ཚུ་ནང་ལུ་ `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, དང་ `ResolveAnonymousEscrowDispute`.

འ་ནི་ ISIs འདི་ནང་ ད་རེས་ དབྱེ་རིམ་༡ པའི་ CLI བཀའ་རྒྱ་ཚུ་མེད་ཨིན། ཁྱོད་ཀྱིས་ SDK བཟོ་སྐྲུན་འབད་མི་ཚུ་དང་ ཡང་ན་ གྲལ་སྒྲིག་ཅན་གྱི་བསླབ་བྱ་གི་ཁེ་ཕན་འབག་མི་ཚུ་ལག་ལེན་འཐབ་སྟེ་བལྟ་ཞིནམ་ལས་ [Native Asset Escrow](/dz/blockchain/escrow.md) འཚོལ་བའི་ཚེ་ཚད་ཀྱི་ཐོ་ཡིག་དང་ ངོས་ལེན་དང་དྲི་བཀོད་དང་བྱུང་རྐྱེན་ དེ་ལས་ Rust དཔེ་ཚུགས།

## གྲོགས་རམ་/ཕྱིར་འབུད་ {#grant-revoke}

གྲོགས་རམ་དང་ ཆ་མེད་གཏང་ནི་གི་བསླབ་བྱ་ཚུ་རྩིས་ཁྲ་ [གི་ཆོག་ཐམ་དང་ འགན་ཁུར་](permissions.md)གི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན།

`Grant` འདི་ ལག་ལེན་འཐབ་མི་ཅིག་ལུ་ ངོས་ལེན་གཅིག་དང་ ཡང་ན་ ངོས་ལེན་སྡེ་ཚན་ ("འགན་ཁུར་") ཚུ་ གཏན་འཇགས་སྦེ་བྱིན་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན། ངོས་ལེན་ཅན་གྱི་ འགན་འཁྲི་དང་ ངོས་ལེན་འདི་ `Revoke` གི་བསླབ་བྱ་བརྒྱུད་དེ་རྐྱངམ་གཅིག་ བཏོན་ཚུགསཔ་ཨིན། འདི་འབདཝ་ལས་ འ་ནི་བསླབ་བྱ་ཚུ་ ལེགས་ཤོམ་སྦེ་ ལག་ལེན་འཐབ་དགོཔ་ཨིན།

རྩིས་ཁྲ་ནང་ལུ་འགན་ཁུར་བྱིན་ནི་དང་ ཆ་མེད་གཏང་ནི་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

ངོས་ལེན་རྟགས་ཚུ་བྱིན་ནི་དང་ ཆ་མེད་གཏང་། ངོས་ལེན་གྱི་བཀའ་རྒྱ་ཚུ་གིས་ ངོས་ལེན་གི་འབྱུང་ཁུངས་འདི་ རང་བཞིན་གྱི་ནང་ཐོ་བཀོད་ནང་ལས་ བསྐྱར་ཞིབ་འབདཝ་ཨིན།

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

འགན་འཁྲི་ལུ་ ངོས་ལེན་བྱིན་ནི་དང་ ཆ་མེད་གཏང་ནི་:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

འ་ནི་བསླབ་བྱ་འདི་ object [metadata](/dz/blockchain/metadata.md) གསར་གཏོད་འབད་ནི་ཨིན། metadata entry ཚུ་བཙུགས་ནི་དང་ཚབ་རྐྱབ་ནིའི་དོན་ལུ་ `SetKeyValue` ལག་ལེན་འཐབ་སྟེ་དང་ `RemoveKeyValue` འདི་སེལ་འཐུ་འབད་འོང་།

metadata `set` བཀའ་རྒྱ་འདི་གིས་ JSON ཚད་གཞི་ནང་ཐོ་བཀོད་འབད་ཡོད་མི་ནང་ལས་ ཨེབ་གཏང་འབདཝ་ཨིན།

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

རྩིས་ཁྲ་དང་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་ NFTs, RWAs གི་དོན་ལུ་ཡང་ དཔེ་འདི་རང་ཡོདཔ་མ་ཚད་ གདོང་ལེན་ཅན་ཚུ་ཡང་:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter`གིས་ གྲལ་ཐིག་ཡོངས་བསྡོམས་ནང་ གནད་དོན་ཚུ་ བསྒྱུར་བཅོས་འབད་དོ་ཡོདཔ་ད་ འདི་ཡང་ Active Data Model དང་ executor ཚུ་གིས་ གསལ་སྟོན་འབདཝ་ཨིན།

གནས་ཚད་ཅིག་ གཞི་སྒྲིག་འབད་ཞིནམ་ལས་ གནས་ཚད་གཅིག་ཨིན་པའི་ JSON འདྲ་ཕབ་འདི་ ཐོ་བཀོད་ལམ་ལུགས་ནང་ བཏོན་ཐོག་ལས་:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

བརྡ་བཀོད་འདི་ [ trigger](./triggers.md)ཚུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ཨིན།

CLI གིས་ trigger ཐོ་བཀོད་འབད་ཚུགས་ནི་ དེ་ལས་ trigger execution events ལུ་ ཐད་ཀར་དུ་ subscribe འབད་ཚུགས། འདི་ནང་ལུ་ typeed `execute trigger` command སྟོན་མི་མེད་ དེ་འབདཝ་ལས་ ལག་ལེན་ལག་ཁྱེར་ `ExecuteTrigger` གི་བཀོད་རྒྱ་ཚུ་བཙུགས་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ SDK ཡང་ན་ ལག་ལེན་འཕྲུལ་ཆས་ལག་ལེན་འཐབ་ཐོག་ལས་ serialised `InstructionBox` བཟོ་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་མི་ JSON arrayའདི་ `ledger transaction stdin` གི་ནང་འཁོད་ལུ་སྤར་གཏང་དགོ།

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## ལམ་སྟོན་གཞན་ཚུ་ {#other-instructions}

Iroha འདི་ཡང་ runtime དང་ executor འབྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་ འོག་གི་གནས་ཚད་ཀྱི་བསླབ་བྱ་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན།

- `Log`: ལག་ལེན་འཐབ་པའི་སྐབས་ལུ་ ཐོ་བཀོད་ཐོ་ཡིག་ཅིག་བཏོན་དགོ།
- `CustomInstruction`: ལག་ལེན་པ་གི་དོན་ལུ་ ཁྱད་ཆོས་ཅན་གྱི་ JSON ཁེ་ཕན་གྱི་ཅ་ལ་ཚུ་འབག་དགོ།
- `Upgrade`: ལག་བསྟར་འཕྲུལ་ཆས་ ཡར་དྲག་གཏང་ནིའི་ལཱ་འདི་ རྩ་སྒྲིག་འབདཝ་ཨིན།

ཁྱོད་ཀྱིས་ `Log` གི་བསླབ་བྱ་འདི་ མཆིན་ཐིག་ལག་ལེན་འཐབ་ནིའི་བརྡ་སྟོན་འབད་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

རང་ལུགས་ལག་བསྟར་སྤྱོད་འབད་ནིའི་བསླབ་བྱ་ཚུ་ གྲལ་སྒྲིག་སྦེ་བཙུགས་ནི། `InstructionBox`. ཁེ་ཕན་གྱི་ཁེ་རྒུད་ཀྱི་བཟོ་རྣམ་འདི་ ལག་ལེན་པ་ལུ་དམིགས་ཏེ་ཡོདཔ་ལས་ སྒྲིག་གཞི་ཚུ་ བཀྲམ་སྤེལ་འབད་ནི་དང་བསྟུན་འབད་ SDK ཡང་ན་ ལག་ལེན་འཕྲུལ་ཆས་ཚུ་:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

ལག་བསྟར་སྤྱོད་འབད་མི་འདི་ བསྡུ་སྒྲིག་འབད་མི་ IVM bytecode ཌའི་ལོག་ནང་ལས་ ཡར་དྲག་གཏང་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
