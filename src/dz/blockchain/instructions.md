---
translation_locale: dz
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: human-reviewed
---
# Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་ཚུ་ {#iroha-special-instructions}

ང་བཅས་ཀྱིས་སླབ་པའི་སྐབས་ [ག་དེ་སྦེ་ Iroha ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན།](/dz/blockchain/iroha-explained), ང་བཅས་ཀྱིས་འདི་སླབ་ཅི་ Iroha དམིགས་བསལ་གྱི་བསླབ་བྱ་འདི་ འཛམ་གླིང་གི་གནས་སྟངས་ལུ་ བསྒྱུར་བཅོས་འབད་ནི་གི་ ཐབས་ལམ་གཅིག་པུ་ཨིན། ང་བཅས་ཀྱིས་ ག་ཅི་བཟུམ་གྱི་བསླབ་བྱ་ཚུ་ཐོབ་དོ་ཡོདཔ་ཨིན་ན? ཁྱོད་ཀྱིས་ ཆོས་སྟོན་པའི་ནང་ཡོད་མི་ སྐད་ཡིག་གི་ཁ་ཐུག་ལས་ བརྡ་འགྲེལཔ་ཚུ་ ཀློག་ཚུགས་པ་ཅིན་ ཁྱོད་ཀྱིས་ བརྡ་བཀོད་དག་པ་ཅིག་མཐོང་ཚར་ནུག `Register<Account>` དང་ `Mint<Numeric>`.

Iroha དམིགས་བསལ་བསླབ་བྱ་ཚུ་གི་ཐོ་ཡིག་འདི་ ནཱ་ལུ་བཀོད་ཡོདཔ་ཨིན།

|བརྡ་སྟོན་ |འགྲེལ་བཤད་ |
| | |
| [ཐོ་བཀོད་/རྩིས་མེད་འབད་ ](#un-register) |ID བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལུ་ སྡེབ་ཐག ནང་ལུ་སྡེ་ཚན་གསརཔ་ལུ་བྱིན་. |
| [Mint/Burn](#mint-burn) | མིན་ཊི་/བརན་ཨང་གྲངས་རྒྱུ་དངོས་ཡང་ན་ ཊི་རི་གཱར་བསྐྱར་ལོག་ཚུ། |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |བཀྲམ་སྤེལ་འབད་ཐངས་ཀྱི་འབྱུང་ཁུངས་ ཟུར་གནས་གནད་སྡུད. |
| [SetParameter](#setparameter) |ལྕགས་ཐག་གི་ཁྱབ་ཚད་ཅིག་ གཞི་སྒྲིག་རྐྱབས། |
| [Grant/Revoke](#grant-revoke) | གནང་བ་དང་འགན་ཁུར་སྤྲོད་ནི་ཡང་ན་རྩ་བསྐྲད་གཏང་། |
| [བསྒྱུར་བཅོས་](#transfer) |རྒྱུ་དངོས་གི་བཅའ་མར་གཏོགས་ནི་དང་ གཏན་འཁེལ་གྱི་གནས་གོང་ཚུ་ བསྒྱུར་བཅོས་འབདཝ་ཨིན། |
| [རང་ལུགས་ཀྱི་གཏའ་མ་དང་ རྒྱུ་དངོས་གི་བཀག་སྡོམ་ཚུ་ ](#native-escrow-and-asset-locks) |ཐོ་བཀོད་འབད་ཡོད་པའི་ཨང་གྲངས་ནོར་རྫས་ཚུ་ ལྕོགས་གྲུབ་ཅན་སྦེ་བཞག་དགོ།|
| [རང་རྐྱང་གི་བར་ནའི་མཐུན་རྐྱེན་ཚུ་](#atomic-private-settlement) | གསང་བའི་ གསོག་ཚོགས དང་ དུས་གཅིག་ལག་བསྟར ཆ་ཚན ཚུ་ བདག་འཛིན་འཐབ་ཨིན། |
| [ExecuteTrigger](#executetrigger) |ཐིག་ཁྲམ་ཚུ་ལག་ལེན་འཐབ་དགོ། |
| [Log/Custom/Upgrade](#other-instructions) |ཐོ་བཀོད་, རྒྱུན་རིམ། ཡང་ན་ ལག་བསྟར་མཉེན་ཆས གི་སྤྱོད་ལམ་ཡར་དྲག་གཏང་། |

ང་བཅས་ཀྱིས་ Iroha དམིགས་བསལ་བསླབ་བྱ་ཚུ་གི་ གྲོས་བསྡུར་ཐོག་ལས་འགོ་འགོ་བཙུགསཔ་ཨིན། ཁྱོད་ཀྱིས་བཀོད་རྒྱ་རེ་རེ་ལུ་ ག་ཅི་གི་དོན་ལུ་འབོ་ཚུགས་ནི་ཡོདཔ་ཨིན་ན་དང་ བྱ་སྟབས་མ་བདེཝ་རེ་རེ་གི་དོན་ལུ་ ལག་ལེན་འཐབ་བཏུབ་པའི་བསླབ་བྱ་ཚུ་ག་ཅི་ཨིན་ན?

## གྲུབ་མཐའ་ཚུ་ {#summary}

བཀོད་རྒྱ་རེ་རེ་གི་དོན་ལུ་ བཀོད་རྒྱ་འདི་གཡོག་བཀོལ་ཚུགས་པའི་དངོས་པོ་ཚུ་གི་ཐོ་ཡིག་ཡོདཔ་ཨིན། དཔེར་ན་ སྤོ་བཤུད་འགྱུར་ཅན་ཚུ་གིས་ བདག་དབང་འབད་བཏུབ་པའི་ ལེ་ཇར་དངོས་པོ་དང་ ཨང་གྲངས་རྒྱུ་དངོས་ཚུ་ ཁྱབ་ཚུགསཔ་ཨིན་ དེ་འབདཝ་ད་ མིན་ཊིང་གིས་ ཨང་གྲངས་རྒྱུ་དངོས་ཚུ་ ཁྱབ་ཚུགསཔ་ཨིནམ་དང་ བསྐྱར་ལོག་ཚུ་ འབྱུང་བཅུགཔ་ཨིན།

སྒྲིག་གཞི་ལ་ལུ་ཅིག་ནང་ དམིགས་ཡུལ་ཅིག་ ངེས་གཏན་སྦེ་བཀོད་དགོཔ་ཨིན། དཔེར་ན་ ཁྱོད་ཀྱིས་ རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་བ་ཅིན་ ཁྱོད་ཀྱིས་ རྟག་བུ་རང་ དེ་ཚུ་ ག་གི་རྩིས་ཐོ་ལུ་ བསྒྱུར་བཅོས་འབད་དོ་ཡོདཔ་ཨིན་ན་ གསལ་སྟོན་འབད་དགོཔ་ཨིན། གཞན་ཁ་ཐུག་ལས་ ཁྱོད་ཀྱིས་ གནད་དོན་གཅིག་ ཐོ་བཀོད་འབད་བའི་སྐབས་ལུ་ ཁྱོད་ལུ་དགོ་མི་དེ་ ཁྱོད་ཀྱིས་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ འདོད་པའི་དངོས་པོ་འདི་ཨིན།

|བརྡ་སྟོན་ |གནད་དོན་ཚུ་ |འགྲོ་འགྲུལ་འབད་སའི་ས་གནས་ |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |སྤྱིར་བཏང མངའ་ཁོངས, གནད་སྡུད་ས་སྟོང-མིང་གཞན དང་ རྩིས་ཐོའི་མིང་གཞན གཞི་སྒྲིག |                      |
| [ཐོ་བཀོད་/རྩིས་མེད་འབད་ ](#un-register) |རྩིས་ཐོ་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, NFTs, འགན་འཁྲི་, སྐུལ་རྟེན, མཉམ་རོགས་ཚུ; ཌོ་མེ་ནེཊ་བཏོན་ཐོ།|                      |
| [Mint/Burn](#mint-burn) |ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ བརྒྱུད་འཕྲིན་ལོག་བཤད་པ་ |རྩིས་ཐོ་ ཡང་ན་ སྐུལ་རྟེན |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[ ཟུར་གནས་གནད་སྡུད](./metadata.md) ཡོད་པའི་དངོས་པོ་: ས་ཁོངས་,རྩིས་ཐོ་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, NFTs, RWAs, སྐུལ་རྟེན ཚུ་|                      |
| [SetParameter](#setparameter) |ལྕགས་ཐག་གི་བརྡ་དོན་ཚུ་ |                      |
| [Grant/Revoke](#grant-revoke) | [འགན་འཁྲི་ཚུ་དང་ ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/blockchain/permissions.md) |རྩིས་ཐོ་དང་ འགན་ཁུར་ཚུ་ |
| [བསྒྱུར་བཅོས་](#transfer) |ས་ཁོངས་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་, ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་, NFTs |རྩིས་ཐོ་ |
| [རང་ལུགས་ཀྱི་གཏའ་མ་དང་ རྒྱུ་དངོས་གི་བཀག་སྡོམ་ཚུ་ ](#native-escrow-and-asset-locks) |ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་གི་བཅའ་ཁྲལ་དང་ རྒྱུ་དངོས་ཚུ་གི་བཅའ་ཁྲལ། ངོ་མ་ཤེས་པའི་བཅའ་ཁྲལཔ་ཚུ་ |ཚོང་ཉོ་མི་ཚུ་དང་ འགྲོ་འགྲུལ་འབད་སའི་ ས་ཁོངས་ཚུ་ ཡང་ན་ རྩོད་གཞི་ནང་ བཅའ་མར་གཏོགས་ནི་ |
| [རང་རྐྱང་གི་བར་ནའི་མཐུན་རྐྱེན་ཚུ་](#atomic-private-settlement) | རྒྱུན་ལམ ལུ་བཀག་པའི་གསང་བའི་ གསོག་ཚོགས ཚུ་ སྲིད་བྱུས བསྐོར་བརྗེ ཚུ་ མཇུག་བསྡུ་ཡོད་པའི་ ཆ་ཚན ཚུ་དང་ བཀག མཚོན་རྟགས ཚུ་ | |
| [ExecuteTrigger](#executetrigger) |སྐུལ་རྟེན |                      |
| [Log/Custom/Upgrade](#other-instructions) |ཐོ་བཀོད་ཐོ་ཡིག་, ལག་ལེན་པ་ལུ་དམིགས་ཏེ་ ནང་དོན་གནད་སྡུད་གྱི་ཐོ་བཀོད་ཚུ་, ལག་ལེན་པའི་གནས་གོང་བཟོ། |                      |

ད་རུང་ ISI ལུ་བལྟ་ནིའི་ཐབས་ལམ་གཞན་ཅིག་ཡོདཔ་ད་ ཁོང་གིས་འདོགས་ཡོད་པའི་ ལེན་ཐོ་ཨིན་ཊཱག་གི་ཐད་ལུ་:

| དམིགས་ཚད། | བཀོད་སྒྲིག |
| ---------------- | |---------------------------------------------------------
| རྩིས་ཐོ་ | ཐོ་བཀོད་འབད་ནི་/ཐོ་བཀོད་འབད་ནི་མེདཔ་བཟོ་ནི་ རྒྱུ་དངོས་ཚུ་ལེན་ནི་ རྩིས་ཐོའི་མེ་ཊ་ཌེ་ཊ་དུས་མཐུན་བཟོ་ནི་ གནང་བ་དང་འགན་ཁུར་ཚུ་ བྱིན་ནི་/ཆ་མེད་གཏང་ནི་ |
| མངའ་ཁོངས་ | མངའ་ཁོངས་གཞི་སྒྲིག་ངེས་གཏན་བཟོ་ནི། མངའ་ཁོངས་ཚུ་ཐོ་བཀོད་འབད་མ་བཏུབ། མངའ་ཁོངས་བདག་དབང་སྤོ་བཤུད་འབད་ནི། མངའ་ཁོངས་མེ་ཊ་ཌེ་ཊ་དུས་མཐུན་བཟོ་ནི། |
| རྒྱུ་དངོས་ངེས་ཚིག | ཐོ་བཀོད་/ཐོ་བཀོད་མ་འབད་བའི་ངེས་ཚིག་ཚུ་ བདག་དབང་སྤོ་བཤུད་འབད་ནི་ མེ་ཊ་ཌེ་ཊ་དུས་མཐུན་བཟོ་ནི་ |
| རྒྱུ་ནོར་ | མིན་ཊི་/མེ་འབར་ཨང་གྲངས་འབོར་ཚད། སྤོ་བཤུད་ཨང་གྲངས་འབོར་ཚད་ |
|བར་གཏོགས་བདག་ཉར་ |ཁ་ཕྱེ་, ངོས་ལེན་འབད་, གཏན་འཁེལ་སྤྲོད་ཐོ་བཀོད་བཏང་། བཏོན་གཏང་། ཆ་མེད་གཏང་། རྩོད་པ་ཕྱོགས།། གྲོས་ཐག་ཆད།། ཡང་ན་ རང་སོའི་བདག་འཛིན་ཐོ་ཡིག་ཚུ་མཇུག་བསྡུ་བཅུག།|
|NFT |NFTs ཐོ་བཀོད་/ཐོ་བཀོད་ཆ་མེད་, བདག་དབང་སྤོ་བཤུད་, ཟུར་གནས་གནད་སྡུད དུས་མཐུན་བཟོ་ནི་ |
| RWA | ཐོ་བཀོད་འབད་ནིའི་ མང་ཚོགས་ཚུ་ སྤོ་བཤུད་འབད་ནིའི་འབོར་ཚད་ བཀག་བཞག་/བཏོན་གཏང་ནི་ གྱང་ཤུགས་/གྱང་མ་བཏོན་ བསྐྱར་གསོ་འབད་ནི་ མཉམ་བསྡོམས་འབད་ནི་ མེ་ཊ་ཌེ་ཊ་དུས་མཐུན་བཟོ་ནི་དང་ ཚད་འཛིན་ཚུ་ |
| འབྱུང་ཁུངས་ | ཐོ་བཀོད་/ཐོ་བཀོད་མ་འབད་, མིན་ཊི་/བརན་ཊི་གར་བསྐྱར་ལོག, ཊི་གར་ལག་ལེན་འཐབ་ནི་, ཊི་གར་མེ་ཊ་ཌེ་ཊ་དུས་མཐུན་བཟོ་ནི། |
| འཛམ་གླིང་ | ཐོ་བཀོད་/ཐོ་བཀོད་མ་འབད་ མཉམ་རོགས་དང་འགན་ཁུར་ཚུ་ ཚད་གཞི་ཚུ་གཞི་སྒྲིག་འབད་ ལག་ལེན་འཐབ་མི་འདི་ཡར་འཕར་འབད། |

## CLI དཔེ་སྟོན་ཚུ་ {#cli-examples}

འ་ནི་ཤོག་ལེབ་ནང་གི་དཔེ་སྟོན་འདི་ ཁྱོད་ཀྱིས་ཁ་ཐུག་ལུ་ཡོད་པའི་ Iroha ལས་སྡེའི་ས་ཁོངས་ནང་ལས་ ཌེ་པཱལཊ་གི་གནས་སྐབས་ཀྱི་ གནས་སྐབས་ཀྱི་ ཞབས་ཏོག་ལེན་མི སྒྲིག་ལམ་ལུ་ གཞི་སྒྲིག་འབད་ཐོག་ལས་ བཀའ་རྒྱ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་སྦེ་བཀོད་འོང་།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

ཁྱོད་ཀྱིས་ `iroha` གཉིས་ལྡན་གཞི་བཙུགས་འབད་བ་ཅིན་ དེ་གི་ཚབ་ལུ་ `iroha --config ./defaults/client.toml` ལག་ལེན་འཐབ། ཁྱོད་རའི་ཡོངས་འབྲེལ་ནང་ལས་ གནས་གོང་ཚུ་དང་གཅིག་ཁར་ འོག་གི་ས་གནས་འཛིན་མི་ཚུ་ཚབ་བཙུགས།

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

མི་མང་གི་ Taira བརྟག་དཔྱད་དྲ་རྒྱ ལུ་དམིགས་གཏད་འབད་བའི་སྐབས་ Taira ཞབས་ཏོག་ལེན་མི གི་རིམ་སྒྲིག་ལག་ལེན་འཐབ། འཐུས་སྤྲོད་པའི་དཔེ་ཚུ་གཡོག་མ་བཀོལ་བའི་ཧེ་མ་ [Taira ལས བརྟག་དཔྱད་དྲ་རྒྱ XOR ལེན།](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ནང་གི བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག རོགས་རམ་འདི་ `taira_faucet_claim.py` སྦེ་སྲུང་བཞག་འབད་ཞིནམ་ལས་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག ལས་ བརྟག་དཔྱད་དྲ་རྒྱ XOR ལེན།

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གྱིས་མ་དངུལ་བཏང་ཡོད་པའི་རྒྱུ་དངོས་འདི་མཐོང་པའི་ཤུལ་ལས་ ཚོང་འབྲེལ་ཚུ་འབྲི་ནི་ལུ་དགོ་པའི་རླངས་རླུང་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་མཉམ་སྦྲགས་འབད།

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` འདི་ མངའ་ཁོངས དང་ SNS གླ་སྤྱོད བཟོ་ནིའི་དོན་ལུ་འགོ་ཐོག་ཐོན་རིམ་གྱི་སྤྱིར་བཏང་ལམ་ཨིན། འདི་གིས་ གནད་སྡུད་ས་སྟོང ཏག་ཏག་ ཇོ་བདག་ གླ་སྤྱོད གི་དུས་ཡུན་དང་ གླ་ཡོན་གོང་ཚད སྲུང་སྐྱོབ ཚུ་གསལ་བཀོད་ཐོག་ལས་མཉམ་སྦྲེལ་འབད་དེ་ དགོ་པའི་གནས་སྟངས་ག་ར་ དུས་གཅིག་ལག་བསྟར ཐོག་ལས་བཟོཝ་ཡང་ན་ཉམས་བཅོས་འབདཝ་ཨིན། ངོ་སྤྲོད་ཅན་གྱི་ `POST /v1/aliases/setup/plan` མཐའ་མཚམས ཡང་ན་དེ་དང་མཐུན་པའི་ CLI ལས་རིམ་ལག་ལེན་འཐབ།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

དམིགས་ཡུལ་དང་འཆར་གཞི་འདི་གསང་བ་མེདཔ་ཨིན་རུང་ འཇུག་སྤྱོད་ཀྱི་གོ་རིམ་འདི་གིས་ རིམ་སྒྲིག་འབད་ཡོད་པའི་རྩིས་ཐོ་དང་གཅིག་ཁར་ སྤྱིར་བཏང་གི་ཚོང་འབྲེལ་ཅིག་ རྟགས་བཀོད་དེ་ བཙུགསཔ་ཨིན། འཆར་གཞི་འདི་ དེ་གི་རྒྱུན་རིམ་དང་ དབང་ཚད་ དེ་ལས་ གནས་སྟངས་ཀྱི་ གཞི་རྟེན་དང་ དུས་ཚོད་ཚུ་ལུ་ མཐུད་དེ་ཡོདཔ་ཨིན། ཡོངས་འབྲེལ་གཞན་ཅིག་གུ་ལོག་སྟེ་ལག་ལེན་མ་འཐབ།

## (ཐོ་བཀོད་མེད) ཐོ་བཀོད་འབད་ {#un-register}

ཐོ་བཀོད་འབད་ནི་དང་ ཐོ་བཀོད་མ་འབད་ནི་འདི་ བཀག་ཆའི་ཐོག་ལུ་ ངོ་བོ་གསརཔ་ཅིག་ལུ་ ID བྱིན་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་མི་ བཀོད་རྒྱ་ཚུ་ཨིན།

ཐོ་བཀོད་འབད་ཚུགས་མི་དེ་ `Registrable` དང་ `Identifiable` གཉིས་ཆ་ར་ཨིན་ དེ་འབདཝ་ད་ `Identifiable` འདི་ག་ར་ `Registrable`མེན། དངོས་པོ་མང་ཤོས་ཅིག་ ཐད་ཀར་དུ་ཐོ་བཀོད་འབདཝ་ཨིན་ ཨིན་རུང་ གནད་དོན་ལ་ལུ་ཅིག་ནང་ བཀྲིས་ཧྲིལ་བུའི་ནང་ཡོད་པའི་ངོ་ཚབ་འདི་ གནས་སྡུད་མང་སུ་ཅིག་ཡོདཔ་ཨིན། ཉེན་སྲུང་དང་གྲུབ་འབྲས་ཀྱི་དོན་ལས་ ང་བཅས་ཀྱིས་ གནད་སྡུད་བཟོ་སྐྲུན་འབད་མི་ཚུ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། དཔེར་ན་ `NewAccount` འདི་དང་འདྲཝ་སྦེ་ རེ་རེ་ཇུས་ཊར་ནང་ལུ་ བདག་དབང་གི་དཔང་རྟགས་བཀོད་ཐོ་བཀོད་འབདཝ་ཨིན། སྤྱིར་བཏང་ལུ་ ཐོ་བཀོད་འབད་ཚུགས་མི་ཆ་མཉམ་ཡང་ ཐོ་བཀོད་ཀྱི་རྩིས་མེད་འབད་ཚུགས། ཨིན་རུང་ དེ་འཇམ་ཏོང་ཏོ་དང་ མགྱོགས་པ་ཅིག་མེདཔ།

ཁྱོད་ཀྱིས་རྩིས་ཐོ་ཚུ་ ཐོ་བཀོད་འབད་ཚུགས། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ NFTs, མཐུད་མཚམས་, འགན་འཁྲི་,དང་ སྐུལ་རྟེན. མངའ་ཁོངས གཞི་སྒྲིག ལག་ལེན་འཐབ་ནི་ `EnsureAlias`; མ་བཅོས `Register::Domain` ནང་དོན་གནད་སྡུད འདི་ འགོ་ཐོག/འགོ་སྒྲིགགི་དོན་ལུ་བཞག་ཡོདཔ་ཨིན། མཉམ་རོགས ཐོ་བཀོད ལག་ལེན་འཐབ་ནི་`RegisterPeerWithPop` འདི་གིས་ མཉམ་རོགས ལྡེ་མིག གི་དབང་འཛིན་གྱི་ཁུངས་སྐྱེལ་འབག་ཨིན། [མིང་ཐོ་བཀོད་ཞལ་འཆེས་](/dz/reference/naming.md)ལུ་བལྟ་ཞིནམ་ལས་ ལས་འཛིན་གྱི་མིང་གུ་ བཀག་དམ་ཚུ་གི་སྐོར་ལས་ ཤེས་ཚུགས།

RWA ལྡོག་ཕྱོགས་ཚུ་ དམིགས་གཏད་ཅན་གྱི་ `RegisterRwa` བརྡ་བཀོད་ཐོག་ལས་ བཟོ་སྐྲུན་འབད་ཡོདཔ་ཨིན། ད་ལྟོའི་བརྡ་སྟོན་ནང་ `UnregisterRwa` བརྡ་བཀོད་འདི་མེད་; ངོ་སྤྲོད་འབད་མི་གི་གྲངས་རྩིས་སླར་གསོ་འབད་ནི་ལུ་ `RedeemRwa` ལག་ལེན་འཐབ་དགོ།

::: info

ཁྱོད་ཀྱིས་ [འགོ་ཐོག ༡.](/dz/guide/configure/genesis.md)འདི་ `genesis.json`ནང་ལུ་ ག་དེ་སྦེ་ གཞི་བཙུགས་འབད་ནི་སྦེ་ ཐག་བཅད་ཡོདཔ་ཨིན་ནའི་ཐད་ཁར་ (དམིགས་བསལ་དུ་ ཁྱོད་ཀྱིས་ཆོག་ཐམ་གི་རྟགས་མཚན་ཚུ་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན་ན་མེན་ན་) རྩིས་ཐོ་ཅིག་ ཐོ་བཀོད་ཀྱི་ བྱ་རིམ་དེ་ ཁྱད་པར་སྦོམ་འགྱོ་ཚུགས། སྤྱིར་བཏང་ལུ་ ང་བཅས་ཀྱིས་ འདི་བཟུམ་སྦེ་བཀོད་ཚུགསཔ་ཨིན།

- _མི་མང_ སྡེབ་ཐག ནང་ མི་ག་ར་གིས་ རྩིས་ཐོ་ཐོ་བཀོད་འབད་ཚུགས་དགོ།
- སྒེར་སྡེའི་ སྡེབ་ཐགནང་ལུ་ རྩིས་ཐོ་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ ཁྱད་དུ་འཕགས་པའི་ བྱ་རིམ་ཅིག་འོང་ཚུགས། རང་ལུགས་ཀྱི་ སྒེར་སྡེ་གི་ སྡེབ་ཐགནང་ལུ་ འདི་འབདཝ་ལས་ རྩིས་ཐོའི་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ ཁྱད་དུ་ལྡན་གྱི་ བྱ་རིམ་མེད་པའི་ སྡེབ་ཐགནང་ལུ་ ཁྱོད་ཀྱིས་རྩིས་ཐོ་གཞན་ཅིག་ ཐོ་བཀུད་འབད་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཡོདཔ་ཨིན།

ང་བཅས་ [གིས་ སྒེར་གྱི་དང་ མི་མང་གི་ བཀྲམ་སྤེལ་ཁང་](/dz/guide/configure/modes.md)ཚུ་བསྡུར་འབད་བའི་སྐབས་ལུ་ ཁྱད་པར་འདི་ དབྱེ་ཞིབ་ནང་ གྲོས་བསྟུན་འབདཝ་ཨིན།

:::

::: info

ཆ་རོགས་ཅིག་ཐོ་བཀོད་འབད་ནི་འདི་ ད་ལྟོ་ ཡོངས་འབྲེལ་ལུ་གཞི་སྒྲིག་འབད་མི་ བློ་གཏད་ཅན་གྱི་ཆ་རོགས་ངོ་མ་གི་ཆ་ཤས་མེན་མི་ ཆ་རོགས་ཚུ་ཁ་སྐོང་བརྐྱབ་ནིའི་ཐབས་ལམ་རྐྱངམ་ཅིག་ཨིན།

:::

བཀག་ཆ་དངོས་པོ་ཚུ་ཐོ་བཀོད་འབད་ནི་ལུ་ སྐད་ཡིག་དམིགས་བསལ་གྱི་ལམ་སྟོན་ལག་ལེན་འཐབ།

| སྐད་ཡིག | ལམ་སྟོན། |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/dz/get-started/operate-iroha-via-cli.md) ཌོ་མེན གཞི་བཙུགས་འབད་ནི་དང་རྩིས་ཐོ་དང་ རྒྱུ་དངོས་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་དགོ།|
|Rust |[Rust སྦྱོང་བརྡར་ལག་ལེན་འཐབ་](/dz/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java](/dz/guide/tutorials/kotlin-java.md) ལག་ལེན་འཐབ་དགོ། |
|Python |[Python སྦྱོང་བརྡར་ལག་ལེན་འཐབ་](/dz/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript](/dz/guide/tutorials/javascript.md).|

སྤྱིར་བཏང་མངའ་ཁོངས་གཞི་སྒྲིག་འཆར་གཞི་དང་འཇུག་སྤྱོད་འབད་ཞིནམ་ལས་ མངའ་ཁོངས་འདི་དགོཔ་མེད་པའི་སྐབས་ ཐོ་བཀོད་འབད་མ་བཏུབ།

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

རྩིས་ཐོ་ཐོ་བཀོད་དང་ཐོ་བཀོད་མེདཔ་བཟོ་ནི།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

ཐོ་བཀོད་དང་ཐོ་བཀོད་མེད་པའི་རྒྱུ་དངོས་ངེས་ཚིག།

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

ཐོ་བཀོད་དང་ཐོ་བཀོད་མེད་པའི་འགན་ཁུར་ཚུ་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

ཐོ་བཀོད་དང་ ཐོ་བཀད་མ་བཏུབ་པའི་ གློག་ཐག་ར་བ་འདི་ ཐོ་བཀོད་ཀྱི་དོན་ལུ་ IVM བཱའིཊི་ཨང་རྟགས ཡང་ན་ བརྡ་བཀོད་གི་ཐོ་ཡིག་ཅིག་ དགོཔ་ཨིན། དཔེ་འདི་ནང་ལུ་ `Log` སྒྲིག་གཞི་འདི་ CLI དང་གཅིག་ཁར་ བཟོ་ཞིནམ་ལས་ ཐོ་བཀོད་པ་ནང་བཙུགས་འབདཝ་ཨིན།

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

མཉམ་རོགས་ ཐོ་བཀོད་དང་ ཐོ་བཀོད་མེདཔ་བཟོ་ནི། ཁྱོད་ལུ་ཧེ་མ་ལས་མེད་པ་ཅིན་ `kagami` དང་ཅིག་ཁར་ BLS ལྡེ་མིག་དང་ PoP འདི་བཟོ་བཏོན་འབད།

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## བཟོ་སྐྲུན་འབད་མི་ཚུ་ {#mint-burn}

མིན་ཊིང་དང་ མེ་བཏང་མི་འདི་གིས་ ཨང་གྲངས་རྒྱུ་དངོས་དང་ བསྐྱར་ལོག་གྱངས་ཁ་ཚད་འཛིན་འབད་མི་ ཊི་གཱར་ཚུ་ལུ་ གཞི་བསྟུན་འབད་ཚུགས། རྒྱུ་དངོས་ལ་ལུ་ཅིག་ དངུལ་བཏོན་མ་བཏུབ་སྦེ་ གསལ་བསྒྲགས་འབད་ཚུགས་ནི་ཨིནམ་ད་ དེ་ཡང་ ཐོ་བཀོད་འབད་བའི་ཤུལ་ལས་ ཚར་གཅིག་རྐྱངམ་གཅིག་ བཏོན་ཚུགས་ནི་ཨིན་པས།

རྒྱུ་དངོས་ཚུ་ དམིགས་བསལ་གྱི་རྩིས་ཐོ་ཅིག་ནང་ བཙུགས་ཡོདཔ་ད་ སྤྱིར་བཏང་ལུ་ རྒྱུ་དངོས་འདི་ འགོ་དང་པ་ཐོ་བཀོད་འབད་མི་རྩིས་ཐོ་འདི་ཨིན། རྒྱུ་དངོས་འབོར་ཚད་ཚུ་ ལོག་པ་མེན་པས་ དེ་འབདཝ་ལས་ ཁྱོད་ཀྱིས་ རྒྱུ་དངོས་ཅིག་གི་ `$-1.0` ནམ་ཡང་ ཡང་ན་ ལོག་པའི་འབོར་ཚད་ཅིག་ མེ་བཏང་ཞིནམ་ལས་ མིན་ཊི་ཅིག་ཐོབ་མི་ཚུགས།

བཀག་ཆ་རྒྱུ་དངོས་སྤྲོད་ནིའི་དོན་ལུ་སྐད་ཡིག་དམིགས་བསལ་གྱི་ལམ་སྟོན་ལག་ལེན་འཐབ།

- [CLI](/dz/get-started/operate-iroha-via-cli.md)
- [Rust](/dz/guide/tutorials/rust.md)
- [Kotlin/Java](/dz/guide/tutorials/kotlin-java.md)
- [Python](/dz/guide/tutorials/python.md)
- [JavaScript/TypeScript](/dz/guide/tutorials/javascript.md)

འདི་ནང་ལུ་ རྒྱུ་དངོས་ཚུ་ མེ་གིས་འཚིག་པའི་དཔེ་ཚུགས།

- [CLI](/dz/get-started/operate-iroha-via-cli.md)
- [Rust](/dz/guide/tutorials/rust.md)

དངུལ་བཏོན་ཏེ་ ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ མེ་བཏང་།

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

མིན་ཊི་དང་མེ་འབར་གྱི་འབྱུང་ཁུངས་བསྐྱར་ལོག:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## བསྒྱུར་བཅོས་ {#transfer}

བརྗེ་སོར་ཚུ་གིས་རྩིས་ཐོ་ཚུ་གི་བར་ན་ རྒྱུ་དངོས་དང་གོང་ཚད་སྤོ་བཤུད་འབདཝ་ཨིན། ཡོངས་འབྲེལ་གྱི་ བརྗེ་སུད་དབྱེ་བ་ཚུ་གིས་ ས་ཁོངས་ཚུ་དང་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ དེ་ལས་ ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་ཚུ་བཀོདཔ་ཨིན། དང་ NFTs. RWA འབོར་ཚད་ འགྲོ༌འགྲུལ༌ ལག་ལེན་འཐབ་ནི་ ཆེད༌བརྩོན༌གྱི༌ `TransferRwa` དང་ `ForceTransferRwa` བརྡ་བཀོད་ཚུ་ [གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་](/dz/blockchain/rwas.md).

འདི་གི་དོན་ལུ་ རྩིས་ཐོ་སྤྲོད་དགོཔ་ཨིན། [རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་ནིའི་ཆོག་ཐམ་](/dz/reference/permissions.md). དཔྱད་ཡིག་འདི་ནང་ལུ་ རྒྱུ་དངོས་ཚུ་ ག་དེ་སྦེ་སྤོ་བཤུད་འབད་ཡོདཔ་ཨིན་ནའི་ དཔེ་གཅིག་བཀོད་དགོ། [CLI](/dz/get-started/operate-iroha-via-cli.md) ཡང་ན་ [Rust](/dz/guide/tutorials/rust.md).

ཨང་གྲངས་རྒྱུ་དངོས་སྤོ་བཤུད་འབད།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

གནས་སྤོ་བཤུད་ མངའ་ཁོངས, རྒྱུ་དངོས ངེས་ཚིག, དང་ བདག་དབང NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## རང་ལུགས་ཀྱི་དངུལ་ཁང་དང་ རྒྱུ་དངོས་ཚུ་གི་བཀག་སྡོམ་ཚུ་ {#native-escrow-and-asset-locks}

ནང་སྐྱེས བར་གཏོགས་བདག་ཉར བཀོད་རྒྱ་ཚུ གིས་ ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་ཚུ་ རྩིས་དེབ- འཛིན་སྐྱོང་འབད་ཡོད་མི་ གནས་སྤོ་ལམ་ལུགས བདག་ཉར ནང་ བཀག་སྡོམ འབདཝ་ཨིན། ཁོང་ ཚོང་ར བཟོ་རྣམ རྩིས་རྒྱག, སྤྱིར་བཏང རྒྱུ་དངོས བཀག་སྡོམ་ཚུ དང་ མིང་མེད ཉེན་སྲུང་ཅན བར་གཏོགས་བདག་ཉར བྱ་རིམ་ཚུ གི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན།

ཚོང་འབྲེལ་གྱི་ས་ཁོངས་ནང་ གཏན་འཁེལ་གྱི་ལག་ལེན་ཚུ་ `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, དང་ `ResolveEscrowDispute`. སྤྱིར་བཏང་རྒྱུ་དངོས་ཀྱི་བཀག་སྡོམ་ལག་ལེན་འཐབ་ནི་ `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, དང་ `ExpireAssetLock`. མིང་མེད བར་གཏོགས་བདག་ཉར གིས་ཚོང་ཁྲོམ་གྱི་ཚེ་རིང་ཚུ་ནང་ལུ་ `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, དང་ `ResolveAnonymousEscrowDispute`.

འ་ནི་ ISIs འདི་ནང་ ད་རེས་ དབྱེ་རིམ་༡ པའི་ CLI བཀའ་རྒྱ་ཚུ་མེད་ཨིན། ཁྱོད་ཀྱིས་ SDK བཟོ་སྐྲུན་འབད་མི་ཚུ་དང་ ཡང་ན་ གྲལ་སྒྲིག་ཅན་གྱི་བསླབ་བྱ་གི་ནང་དོན་གནད་སྡུད་འབག་མི་ཚུ་ལག་ལེན་འཐབ་སྟེ་བལྟ་ཞིནམ་ལས་ [རང་སའི་རྒྱུ་དངོས་བཅོལ་ཉར](/dz/blockchain/escrow.md) འཚོལ་བའི་ཚེ་ཚད་ཀྱི་ཐོ་ཡིག་དང་ ངོས་ལེན་དང་དྲི་བཀོད་དང་བྱུང་རྐྱེན་ དེ་ལས་ Rust དཔེ་ཚུགས།

## རང་རྐྱང་གི་བར་ནའི་མཐུན་རྐྱེན་ཚུ་ {#atomic-private-settlement}

ཚད་འཛིན་ཅན་གྱི་ རང་བཞིན་གྱི་གཞི་སྒྲིག་གི་བསླབ་བྱ་ཚུ་ དྭངས་འཕྲོས་འཕྲོས་སྦེ་ཡོད་མི་ ཨེ་མ་ལས་སོ་སོ་ཨིན། AMX. `ActivatePrivateSettlementPoolV1` གཅིག་ གསང་བའི་བཟོ་སྐྲུན་ `pool` གཞུང་སྐྱོང་གི་ཐོ་ཡིག་དང་ རྫོང་ཁའི་འབྱུང་ཁུངས་ཀྱི་ ཁས་བླངས་ཚུ་ནང་ལས་ ཕྲང་ལམ་ཅིག་བཏོན་ནིའི་དོན་ལུ་ཨིན། `FinalizeAtomicPrivateSettlementV1` གྲོས་འཛོམས་ནང་ བཅའ་མར་གཏོགས་མི་སྡེ་ཚན་ག་ར་གིས་ འཛིན་སྐྱོང་འཐབ་མི་སྡེ་ཚན་ཆ་མཉམ་ཅིག་གིས་ ཆ་འཇོག་འབད་ཡོད་པའི་ ཐོ་བཀོད་ལག་ལེན་དེ་ ལག་ལེན་འཐབ་ཨིན། `AbortAtomicPrivateSettlementV1` ཞབས་ཏོག་བྱིན་མི་གིས་ ངོས་འཛིན་འབད་མི་ མི་མང་གི་མཐའ་མཚམས་རྟགས་འདི་རྐྱངམ་གཅིག་ དཔར་བསྐྲུན་འབདཝ་ཨིན།

`RotatePrivateSettlementPoolPolicyV1` འདི་ སྒེར་གསང་གཞུང་སྐྱོང་ལུ་ བཀག་ཆ་འབད་ཡོདཔ་ཨིན། འདི་ལུ་ ད་ལྟོའི་གཞུང་སྐྱོང་གྱི་ བཅུད་བསྡུ་དགོཔ་དང་ ལམ་ལུགས་ ཆུ་རྫིང་ རྒྱུ་དངོས་བཀག་སྡོམ་གྱི་ཁས་བླངས་ མངའ་སྡེའི་ས་མཚམས་ བསྐྱར་རྩེད་ཆ་ཚན་ དེ་ལས་ མཐའ་དཔྱད་ཀྱི་ འོང་འབབ་ཚུ་ མི་མང་བསྐྱར་ཞིབ་འདི་ གཅིག་གིས་ གོང་འཕེལ་བཏང་དགོཔ་མ་ཚད་ རྩིས་ཞིབ་པ་གཙོ་བོ་གི་དུས་སྐབས་གསརཔ་འདི་ ལག་ལེན་འཐབ་དགོཔ་ཨིན། བསྒྱིར་ནི་འདི་གིས་ དེ་གི་གྲངས་སུ་བཙུགས་པའི་མཐོ་ཚད་ལུ་ཤུགས་ལྡན་བཟོཝ་ཨིནམ་དང་ མཐོ་ཚད་དེ་ འགྲུལ་ལམ་/ཆུ་རྫིང་གཅིག་པའི་དོན་ལུ་ འབྱོར་རྟགས་དང་གཅིག་ཁར་ བརྗེ་སོར་འབད་མི་ཚུགས། མི་མང་བསྐྱར་ཞིབ་རིགས་བརྒྱུད་འདི་གིས་ བསྒྱིར་ཚད་ལོག་འགོ་བཙུགས་པའི་ཧེ་མ་ འོང་འབབ་ཚུ་ མཐའ་དཔྱད་འབད་དེ་བཞགཔ་ཨིན། ལས་རིམ་ནང་ཡོད་པ སྲིད་བྱུས་རྙིངམ་གི་བང་རིམ་ཚུ་ འཐུས་ཤོར་ཁ་བསྡམ་ཡོདཔ། བཀོལ་སྤྱོད་པ་ཚུ་གིས་ གསོག་འཇོག་འབད་ཡོད་པའི་ ཀེབ་སུལ་ཚུ་གི་དོན་ལུ་ གསང་བཟོའི་ལྡེ་མིག་རྙིངམ་ཚུ་ བཞག་དགོཔ་ཨིན་ ཡང་ན་ དེ་ཚུ་མེདཔ་མ་བཏང་པའི་ཧེ་མ་ ཀེབ་སུལ་ཚུ་ ལོག་སྟེ་བཀབ་ནི་འདི་ གཞུང་སྐྱོང་དང་བརྟག་དཔྱད་འབད་དགོ།

ཐབས་ལམ་འདི་ སྔོན་སྒྲིག་ཐོག་ལས་ བཀག་ཆ་འབད་ཡོདཔ་ལས་ བཟོ་སྐྲུན་ལུ་ ཁྱད་ཚད་མེདཔ་ཨིན། སྒྲིག་གཞི་བཟོ་ནི་དང་ དབང་ཚད་སྤྲོད་ནི་ དེ་ལས་ བརྟག་ཞིབ་འབད་ནི་དང་ ལོག་སྤྱོད་འབད་ནི་ དེ་ལས་ ཕྱིར་བཏོན་འབད་ནི་གི་ དགོས་མཁོ་ཚུ་གི་དོན་ལུ་ [དུས་གཅིག་ལག་བསྟར སྒེར ཕན་ཚུན ལཱ་འབད་-གནད་སྡུད-ས་སྟོང རྩིས་རྒྱག](/get-started/atomic-private-settlement) ལུ་བལྟ་དགོ།

## གྲོགས་རམ་/ཕྱིར་འབུད་ {#grant-revoke}

གྲོགས་རམ་དང་ ཆ་མེད་གཏང་ནི་གི་བསླབ་བྱ་ཚུ་རྩིས་ཐོ་ [གི་ཆོག་ཐམ་དང་ འགན་ཁུར་](permissions.md)གི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན།

`Grant` འདི་ ལག་ལེན་འཐབ་མི་ཅིག་ལུ་ ངོས་ལེན་གཅིག་དང་ ཡང་ན་ ངོས་ལེན་སྡེ་ཚན་ ("འགན་ཁུར་") ཚུ་ གཏན་འཇགས་སྦེ་བྱིན་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་ཨིན། ངོས་ལེན་ཅན་གྱི་ འགན་འཁྲི་དང་ ངོས་ལེན་འདི་ `Revoke` གི་བསླབ་བྱ་བརྒྱུད་དེ་རྐྱངམ་གཅིག་ བཏོན་ཚུགསཔ་ཨིན། འདི་འབདཝ་ལས་ འ་ནི་བསླབ་བྱ་ཚུ་ ལེགས་ཤོམ་སྦེ་ ལག་ལེན་འཐབ་དགོཔ་ཨིན།

རྩིས་ཐོ་ཅིག་གུ་འགན་ཁུར་བྱིན་ནི་དང་ ཆ་མེད་གཏང་ནི།

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

འགན་ཁུར་ཅིག་གུ་གནང་བ་བྱིན་ནི་དང་ ཆ་མེད་གཏང་ནི།

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

འ་ནི་བསླབ་བྱ་འདི་ དངོས་པོ [ཟུར་གནས་གནད་སྡུད](/dz/blockchain/metadata.md) གསར་གཏོད་འབད་ནི་ཨིན། ཟུར་གནས་གནད་སྡུད ཐོ་འགོད ཚུ་བཙུགས་ནི་དང་ཚབ་རྐྱབ་ནིའི་དོན་ལུ་ `SetKeyValue` ལག་ལེན་འཐབ་སྟེ་དང་ `RemoveKeyValue` འདི་སེལ་འཐུ་འབད་འོང་།

མེ་ཊ་ཌེ་ཊ་ `set` བརྡ་བཀོད་ཚུ་གིས་ ཚད་ལྡན་ཨིན་པུཊི་ལས་ JSON གནས་གོང་ལྷགཔ་ཨིན།

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

རྩིས་ཐོ་དང་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་ NFTs, RWAs གི་དོན་ལུ་ཡང་ དཔེ་འདི་རང་ཡོདཔ་མ་ཚད་ གདོང་ལེན་ཅན་ཚུ་ཡང་:

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

`SetParameter` གིས་ ཤུགས་ལྡན་གནད་སྡུད་དཔེ་ཚད་དང་ ལག་ལེན་འཐབ་མི་གིས་ གསལ་སྟོན་འབད་མི་ རིམ་སྒྲིག་རྒྱ་ཚད་ཚད་གཞི་ཚུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན།

གནས་ཚད་ཅིག་ གཞི་སྒྲིག་འབད་ཞིནམ་ལས་ གནས་ཚད་གཅིག་ཨིན་པའི་ JSON འདྲ་ཕབ་འདི་ ཐོ་བཀོད་ལམ་ལུགས་ནང་ བཏོན་ཐོག་ལས་:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

བརྡ་བཀོད་འདི་ [ སྐུལ་རྟེན](./triggers.md)ཚུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ཨིན།

CLI གིས་ སྐུལ་རྟེན ཐོ་བཀོད་འབད་ཚུགས་ནི་ དེ་ལས་ སྐུལ་རྟེན ལག་བསྟར བྱུང་ལས་ཚུ ལུ་ ཐད་ཀར་དུ་ ཐོ་འགོད འབད་ཚུགས། འདི་ནང་ལུ་ དབྱེ་བ་གསལ་བཀོད་ཅན་གྱི་ `execute trigger` བཀའ་རྒྱ སྟོན་མི་མེད་ དེ་འབདཝ་ལས་ ལག་ལེན་ལག་ཁྱེར་ `ExecuteTrigger` གི་བཀོད་རྒྱ་ཚུ་བཙུགས་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ SDK ཡང་ན་ ལག་ལེན་འཕྲུལ་ཆས་ལག་ལེན་འཐབ་ཐོག་ལས་ རིམ་སྒྲིག་ཨང་སྒྱུར `InstructionBox` བཟོ་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་མི་ JSON ཨེ་རེའདི་ `ledger transaction stdin` གི་ནང་འཁོད་ལུ་སྤར་གཏང་དགོ།

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## ལམ་སྟོན་གཞན་ཚུ་ {#other-instructions}

Iroha འདི་ཡང་ ལག་བསྟར་མཉེན་ཆས དང་ ལག་བསྟར་པ འབྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་ འོག་གི་གནས་ཚད་ཀྱི་བསླབ་བྱ་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན།

- `Log`: ལག་ལེན་འཐབ་པའི་སྐབས་ དྲན་ཐོ་ཐོ་བཀོད་ཅིག་བཏོན་གཏང་།
- `CustomInstruction`: ལག་ལེན་འཐབ་མི་དམིགས་བསལ་ JSON ནང་དོན་གནད་སྡུད་ཚུ་འབག་འོང་།
- `Upgrade`: ལག་ལེན་འཐབ་མི་ཡར་འཕར་ཅིག་ཤུགས་ལྡན་བཟོ།

པིང་གྲོགས་རམ་དང་གཅིག་ཁར་ `Log` བཀོད་རྒྱ་ཅིག་བཙུགས།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

རང་ལུགས་ལག་བསྟར་སྤྱོད་འབད་ནིའི་བསླབ་བྱ་ཚུ་ གྲལ་སྒྲིག་སྦེ་བཙུགས་ནི། `InstructionBox`. ནང་དོན་གནད་སྡུད་གྱི་ཁེ་རྒུད་ཀྱི་བཟོ་རྣམ་འདི་ ལག་ལེན་པ་ལུ་དམིགས་ཏེ་ཡོདཔ་ལས་ སྒྲིག་གཞི་ཚུ་ བཀྲམ་སྤེལ་འབད་ནི་དང་བསྟུན་འབད་ SDK ཡང་ན་ ལག་ལེན་འཕྲུལ་ཆས་ཚུ་:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

ལག་བསྟར་སྤྱོད་འབད་མི་འདི་ བསྡུ་སྒྲིག་འབད་མི་ IVM བཱའིཊི་ཨང་རྟགས ཌའི་ལོག་ནང་ལས་ ཡར་དྲག་གཏང་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
