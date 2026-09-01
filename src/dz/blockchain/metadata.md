---
translation_locale: dz
translation_source: /blockchain/metadata.md
translation_source_hash: 20e78492bf757147f2c9afed2d3b51639bc79913d3d8e4351193b6011f5469c2
translation_status: machine-validated
translation_engine: human-reviewed
---
# གཞི་རྟེན་འབྱུང་ཁུངས་ {#metadata}

མེ་ཊ་ཌེ་ཊ་འདི་ ལེ་ཇར་དངོས་པོ་ཚུ་ལུ་མཉམ་སྦྲགས་འབད་ཡོད་པའི་ ཞིབ་དཔྱད་འབད་ཡོད་པའི་ལྡེ་མིག་-གནས་གོང་སབ་ཁྲ་ཅིག་ཨིན། ལྡེ་མིག་ཚུ་ `Name` གནས་གོང་ཚུ་ཨིནམ་དང་ གནས་གོང་ཚུ་ JSON (`Json`) ནང་དོན་གནད་སྡུད་ཚུ་ཨིན།

འོག་གི་དངོས་པོ་ཚུ་གིས་ མེ་ཊ་ཌེ་ཊ་འབག་ཚུགས།

- མངའ་ཁོངས་ཚུ།
- རྩིས་ཐོ་
- རྒྱུ་དངོས་ཚུ་
- རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་
- NFTs
- RWAs
- འབྱུང་ཁུངས།
- ཚོང་འབྲེལ་ཚུ་

ཟུར་ཐོ་ནང་ཚུད་མི་ འགྲེལ་བཤད་ཀྱི་ས་ཁོངས་ཆུང་ཤོས་དང་ ཚད་འཛིན་གྱི་ས་ཁོངས་ཚུ་གི་དོན་ལུ་ མེ་ཊ་ཌེ་ཊ་ཚུ་ལག་ལེན་འཐབ་ཨིན། ཟུར་ཐོ་སྦོམ་འདི་ WSV གི་ཕྱི་ཁར་བཞག་དགོཔ་དང་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན། URI ཡང་ན་ SoraFS ལྕགས་ལམ་གྱིས་ བསྡུ་ལེན་འབདཝ་ཨིན།

མེ་ཊ་ཌེ་ཊ་ རྒྱུ་དངོས་ NFTs RWAs ཡང་ན་ རྒྱུན་རིམ་གྱི་གསོག་འཇོག་གདམ་ཁ་རྐྱབ་ནིའི་ལམ་སྟོན་གྱི་དོན་ལུ་ [ མེ་ཊ་ཌེ་ཊ་དང་ བཀག་ཆའི་རྩིས་ཐོ་གསོག་འཇོག་གདམ་ཁ་](/dz/guide/configure/metadata-and-store-assets.md) ལུ་བལྟ།

## Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

མེ་ཊ་ཌེ་ཊ་དེ་ སྤྱིར་བཏང་ཐོན་ཁུངས་ཀྱི་བཀླག་ཐངས་ཐོག་ལས་མཐོང་ཚུགསཔ་ཨིན། འ་ནི་བཀའ་རྒྱ་འདི་ Taira རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་ནང་ལུ་ ད་རེས་ མེ་ཊ་དའི་ཊ་ཡོད་མི་ཚུ་ཡོདཔ་ཨིན།

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

མངའ་ཁོངས་དང་རྩིས་ཐོ་ཚུ་གི་དོན་ལུ་ དཔེ་རིས་གཅིགཔོ་འདི་ལག་ལེན་འཐབ།

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'

curl -fsS 'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

སྟོངམ་ཐོན་ཐོ་བཀོད་འདི་ ཆ་གནས་གྲུབ་འབྲས་ཅིག་སྦེ་བརྩི་དགོ། འདི་གིས་དོན་ནི་ Taira འདྲ་མཉམ་ཚུ་གི་ ད་ལྟོའི་ཤོག་ལེབ་ནང་ལུ་ ཟུར་གནས་གནད་སྡུད མེད་འདུག་ཟེར་མ་བཤད་པར་ མཇུག་མཐའན་མཇུག་གི་ཐོ་བཀོད་ཀྱི་ཐོ་བཀུད་དེ་ རྩ་མེད་བཏང་ཡི་ཟེར་ཨིན་པས།

## གནས་བརྡ་དུས་མཐུན་བཟོ་ནི་ {#updating-metadata}

ཟུར་གནས་གནད་སྡུདའདི་ Iroha དམིགས་བསལ་བསླབ་བྱ་ཚུ་དང་གཅིག་ཁར་ བསྒྱུར་བཅོས་འབདཝ་ཨིན།

- [`SetKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue)གིས་ལྡེ་མིག་ཚུ་བཙུགས་ཏེ་ བསྒྱུར་བཅོས་འབདཝ་ཨིན།
- [`RemoveKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) གིས་ལྡེ་མིག་ཅིག་བཏོན་འབདཝ་ཨིན།

གནད་དོན་འདི་ བགོ་བཀྲམ་འབད་མི་དབང་འཛིན་དེ་ ལཱ་འབད་ཡོད་པའི་ ལག་བསྟར་མཉེན་ཆས བདེན་དཔྱད་པ གིས་ དགོས་མཁོ་ཅན་གྱི་ ངོས་ལེན་ཡོད་དགོཔ་ཨིན། རང་བཞིན་གྱི་ ངོས་ལེན་གི་མཐར་ཐུག་གི་དོན་ལུ་ [ གནང་བ ཊོ་ཀེན་ཚུ](/dz/reference/permissions.md)བལྟ་དགོ།

## འབྱུང་རྐྱེན་ཚུ་ {#events}

གནད་སྡུད་བྱུང་ལས་ཚུ་ མེ་ཊ་གནད་སྡུད་བསྒྱུར་བཅོས་འབད་བའི་སྐབས་ བཏོན་གཏངམ་ཨིན། སྤྱིར་བཏང་བྱུང་ལས་ནང་དོན་གནད་སྡུད་འདི་ `MetadataChanged<Id>`:

```mermaid
classDiagram

class MetadataChanged~Id~ {
  target: Id
  key: Name
  value: Json
}

class AccountMetadataChanged
class AssetMetadataChanged
class AssetDefinitionMetadataChanged
class DomainMetadataChanged

MetadataChanged --> AccountMetadataChanged
MetadataChanged --> AssetMetadataChanged
MetadataChanged --> AssetDefinitionMetadataChanged
MetadataChanged --> DomainMetadataChanged
```

[གནད་སྡུད བྱུང་ལས ཚགས་མ](/dz/blockchain/filters.md#data-event-filters) ལག་ལེན་འཐབ་སྟེ་ འབྲེལ་གཏོགས་འབད་ནིའི་དོན་ལས་ ཁག་ཆེཝ་ཨིན་མི་ གནད་སྡུད་གི་དབྱེ་བ་དང་ ཡང་ན་ བྱ་སྟབས་མ་བདེཝ་ཚུ་གི་དོན་ལུ་ ཟུར་གནས་གནད་སྡུད བྱུང་ལས་ཚུ ID ལུ་རྐྱངམ་ཅིག་ ཐོ་བཀོད་འབདཝ་ཨིན།

## དྲི་བཀོད་ཚུ་ {#queries}

མེ་ཊ་ཌེ་ཊ་དེ་ བརྟག་ཞིབ་འབད་ཡོད་པའི་དངོས་རྫས་ཀྱི་ཆ་ཤས་ཅིག་སྦེ་ལོག་གཏོགསཔ་ཨིན། དཔེར་ན་ [`FindAccountById`](/dz/reference/queries.md#accounts-and-permissions), [`FindDomainById`](/dz/reference/queries.md#domains-and-peers) ཡང་ན་ [`FindAssetDefinitionById`](/dz/reference/queries.md#assets-nfts-and-rwas) ལག་ལེན་འཐབ་ཨིན། [`FindNfts`](/dz/reference/queries.md#assets-nfts-and-rwas) ཡང་ན་ [`FindNftsByAccountId`](/dz/reference/queries.md#assets-nfts-and-rwas) གི་དོན་ལས་ NFTs དང་ [`FindRwas`](/dz/reference/queries.md#assets-nfts-and-rwas) གི་དོན་ལས་RWA ལོཊ་ཚུ་ལག་ལེན་འཐབ་ཞིནམ་ལས་ གནད་སྡུད་ཀྱི་དོན་ལུ་ ཟུར་གནས་གནད་སྡུད ཞིང་ ཀློག་ཐེངསམ་ཨིན། NFT འདྲི་བ་གི་ལན་ལུ་ NFT `content` མ་པ་འདི་ ཐོ་བཀོད་ ཟུར་གནས་གནད་སྡུདསྦེ་བཏོན་འོང་།

མེ་ཊ་ཌེ་ཊ་ལྡེ་མིག་ཚུ་ བཀག་ཆའི་རྩིས་ཐོའི་གནས་སྟངས་ཀྱི་ཆ་ཤས་ཅིག་ཨིནམ་ལས་ དེ་ཚུ་ བརྟན་ཏོག་ཏོ་སྦེ་བཞག་སྟེ་ JSON གནས་གོང་ཅིག་གིས་ ཐོན་རིམ་དེ་ གསལ་ཏོག་ཏོ་སྦེ་ འབག་ཚུགས་པའི་སྐབས་ ལྡེ་མིག་མིང་ནང་ གློག་རིམ་དམིགས་བསལ་གྱི་ཐོན་རིམ་ཆརན་འདི་ ཨིན་ཀོ་ཌིང་འབད་ནི་ལས་ འཛེམ་དགོ།
