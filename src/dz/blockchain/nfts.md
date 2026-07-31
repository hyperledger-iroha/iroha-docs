---
translation_locale: dz
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT འདི་ བདག་འཛིན་པ་གཅིག་ཡོད་མི་ ཁྱད་དུ་འཕགས་པའི་རྩིས་དེབ་ཀྱི་དངོས་པོ་ཨིན། ཡིག་ཆ་ཅིག་གིས་ རང་སོའི་ངོ་རྟགས་, metadata, ཚེ་འཁོར་གྱི་བྱུང་རྐྱེན་ཚུ་དང་བདག་དབང་སྤེལ་བའི་བརྡ་དོན་ཚུ་ དགོས་མཁོ་ཡོད་རུང་ གྱངས་ཁ་མཐུན་མེད་པ་ཅིན་ NFTs ལག་ལེན་འཐབ་ཨིན།

ཨང་གྲངས་ཀྱི་ [ རྒྱུ་དངོས་](/dz/blockchain/assets.md) དེ་དང་མ་འདྲ་བར་ NFT འདི་ནང་ལུ་ དངོས་གྲུབ་དང་ བརྟག་ཞིབ་འབད་ཐངས་ ཡང་ན་རྩིས་ཁྲ་གི་གནས་ཚད་མེདཔ་ཨིན། NFT གིས་ ཐོ་བཀོད་ཅན་གྱི་དངོས་པོ་ཅིག་སྦེ་ཡོདཔ་ལས་ བདག་དབང་འདི་ཐད་ཀར་དུ་ གནད་དོན་དེའི་གུ་བཟུང་སྟེ་ཡོདཔ་ཨིན།

## བཟོ་བཀོད་ {#structure}

ཐོ་བཀོད་འབད་མི་ `Nft` ནང་འཁོད་ནང་ལུ་:

- `id`: `NftId` འབད་མི་ཅིག་
- `content`: NFT གི་སྐོར་ལས་ གསལ་སྟོན་འབད་ཡོད་པའི་ metadata
- `owned_by`: NFT གི་བདག་འཛིན་འཐབ་མི་རྩིས་ཁྲ།

`content` ས་ཁོངས་འདི་ `Metadata` གི་ས་ཁྲ་ཨིན། འདི་འཇམ་ཏོང་ཏོ་སྦེ་བཞག་: ཁ་གསལ་གྱི་ས་སྒོ་ཚུ་, གནས་བརྟན་ཁ་བྱང་ཚུ་, ཧེཤ་ཚུ་, URIs, ཡང་ན་ SoraFS ལྕགས་ལམ་ཚུ་ ཐོ་བཀོད་འབད། ཡིག་ཆ་སྦོམ་, བརྡ་བརྒྱུད་དང་ ཡང་ན་ རྒྱུན་ཆད་ཆེ་བའི་ལག་ལེན་ཚུ་གི་གནས་སྟངས་འདི་ བཀག་དམ་འབད་ཞིནམ་ལས་ བརྟག་ཞིབ་འབད་ཚུགས་པའི་ཁ་བྱང་རྐྱངམ་ཅིག་ ཐོ་བཀོད་ཀྱི་ནང་བཙུགས་འབད། NFT

## Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

མི་མང་གི་ Taira བརྟག་དཔྱད་དྲ་ལམ་ནང་ལུ་ ད་རེས་ NFT ཡིག་ཆ་ཡོད་མེད་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

ཁྱོད་ཀྱིས་ NFT ཕྲང་ལམ་ཚུ་སླར་ལོག་འབད་ནིའི་དོན་ལུ་ OpenAPI ཡིག་ཆ་ངོ་མ་ལུ་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

empty `items` arrayའདི་ མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་ནང་ལུ་ ཆ་གནས་ཅན་གྱི་ལན་ཨིན། འདི་གིས་འབད་བ་ཅིན་ ད་ལྟོའི་ཤོག་ལེབ་ནང་ NFTs ཚུ་མེད་ཟེར་མ་སླབ་པར་ NFT གི་བསླབ་བྱ་ཚུ་མེད་ཟེར་ཡང་མེན།

## NFT IDs {#nft-ids}

`NftId` གིས་ ཡིག་ཆ་འདི་ལག་ལེན་འཐབ་ཨིན།

```text
name$domain
name$domain.dataspace
```

དཔེར་ན་ `badge$docs.universal` ངོས་འཛིན་འབདཝ་ཨིན། `badge` NFT འདི་ནང་ལུ་ `docs.universal` ཌའི་ཊ་ས་པི་ལེནཌ་འདི་སེལ་འཐུ་འབད་མ་བཏུབ་པ་ཅིན་ ད་ལྟོའི་པཱསི་ར་འདི་གིས་ `universal` data spaces འདི་འབདཝ་ལས་ `badge$docs` གྲོས་ཐག་བཅད་ཡོདཔ་ `badge$docs.universal`.

གནས་བརྟན་གི་མིང་ཚུ་ལག་ལེན་འཐབ་ནི་ NFT IDs. འདི་ཚུ་ ID འདི་ བརྡ་བཀོད་ཚུ་དང་ དྲི་བ་ཚུ་དང་ ངོས་ལེན་ཚུ་དང་ འབྱུང་རྐྱེན་སེལ་ཐིག་ དེ་ལས་ ལག་ལེན་ཡིག་གི་ཁ་བྱང་ཚུ་ནང་ལག་ལེན་འཐབ་མི་ གནད་དོན་ངོ་རྟགས་ཨིན།

## སྲོལ་འཁོར་ {#lifecycle}

NFT སྲོལ་འཁོར་ལག་ལེན་འཐབ་ཐབས། Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་:

- [`Register`](/dz/blockchain/instructions.md#un-register) གིས་ འགོ་ཐོག་གི་ `content`དང་གཅིག་ཁར་ NFT བཟོཝ་ཨིན།
- [`Unregister`](/dz/blockchain/instructions.md#un-register) གིས་ NFT བཏོན་འབདཝ་ཨིན།
- [`Transfer`](/dz/blockchain/instructions.md#transfer) བསྒྱུར་བཅོས་འབད་མི་ཚུ་ `owned_by`.
- [`SetKeyValue`དང་ `RemoveKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) ད་ལྟོའི་ NFT མེ་ཊ་ཌའི་ཊཱག་ཚུ་

## ས་གནས་ཀྱི་དོན་ལུ་ བརྟག་དཔྱད་འབད་ {#try-it-locally}

དཔེ་འདི་ཚུ་གིས་ ཁྱོད་ཀྱིས་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ཅིག་ གཞི་བཙུགས་འབད་ཡོདཔ་དང་ ཁྱོད་ཀྱིས་ [CLI ལམ་སྟོན་](/dz/get-started/operate-iroha-via-cli.md)ལས་ ཌའི་ལོག་ client སྒྲིག་གཞི་བཟོ་ཡོད་པའི་རེ་བ་བསྐྱེད་འོང་།

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ས་གནས་ཀྱི་དྲ་རྒྱ་འདི་ ཧེ་མ་ལས་ གཞི་སྒྲིག་འབདཝ་ཨིན། `wonderland.universal` དེ་ལས་ SNS ས་ཁོངས་གཞན་ཅིག་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ དང་པ་རང་གསལ་སྒྲགས་དང་གཅིག་ཁར་བཟོ་དགོ། `app alias setup plan` དང་ `app alias setup apply` སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 10 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 1 སྔོན་ལ་གསར་བཅོས་བྱས། [ས་ཁོངས་ཚུ་](/dz/blockchain/domains.md#registration).

ཐོ་བཀོད་འབད་ཐངས་འདི་ NFT ཨིན་ཨིན། ཐོ་བཀོད་ཀྱི་ནང་འཁོད་ནང་ལུ་ འགོ་ཐོག་གི་དོན་གནད་ JSON འདི་ ཨེབ་གཏང་ཐངས་ལས་ལྷག་སྟེ་འདུག

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

ཁྱོད་ཀྱིས་ NFT འདི་ཐད་ཀར་དུ་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ NFTs ཚུ་ཆ་མཉམ་ནང་བཀོད་ཡོད་པའི་ཐོ་ཡིག་ཅིག་བཟོ་དགོ།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

NFT ལུ་ metadata key ཅིག་བཙུགས་ཏེ་ སླར་ཡང་ཀློག་:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

metadata key འདི་བཏོན་:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

གདམ་ཁ་རྐྱབས་སྦེ་ NFT སྤོ་བཤུད་འབད། ད་ལྟོའི་ཇོ་བདག་དེ་ `owned_by` ལས་ལྷག་སྟེ་བལྟ་ནིའི་དོན་ལུ་ `ledger nft get` ལག་ལེན་འཐབ་དང་ འགྲོ་འགྲུལ་འབད་སའི་རྩིས་ཁྲ་ ID འཚོལ་ནིའི་དོན་ལུ་ `ledger account list all` ལག་ལེན་འཐབ་།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

ཁྱོད་ཀྱིས་འབད་ཚར་བའི་ཤུལ་ལས་ བཏོན་གཏང་། ཁྱོད་ཀྱིས་ NFT སྤོ་བཤུད་འབད་བ་ཅིན་ ད་ལྟོའི་ཇོ་བདག་གི་རྩིས་ཁྲ་བཟོ་ཐངས་དང་གཅིག་ཁར་ བཀའ་འདི་ལག་ལེན་འཐབ་ ཡང་ན་ NFT སླར་ལོག་སྤོ་བཤུད་འབད།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## དྲི་བཀོད་དང་བྱུང་རྐྱེན་ཚུ་ {#queries-and-events}

[`FindNfts`](/dz/reference/queries.md#assets-nfts-and-rwas) ལག་ལེན་འཐབ་སྟེ་ NFTs དང་ [`FindNftsByAccountId`](/dz/reference/queries.md#assets-nfts-and-rwas)རྩིས་ཁྲ་གི་བདག་དབང་ལུ་ཡོད་པའི་ NFTs ཚུ་ནང་ཐོ་བཀོད་འབད་འོང་།

NFT ཐོ་བཀོད་འབད་ནི་དང་ བཏོན་གཏང་ནི་ མེད་ཌེ་ཊ་ཊཱ། ཕྱིར་སྤེལ་འབད་ནི་ དེ་ལས་ གནད་སྡུད་གསར་བཅོས་འདི་ NFT གི་དོན་རྐྱེན་ཚུ་ ཐོན་སྐྱེད་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ `Nft` གི་དོན་རྐྱེན་བརྟག་དཔྱད་དེ་ ལག་ལེན་འཐབ་པ་ཅིན་ ལྡོག་ཕྱོགས་ཤོག་སྒྲིལ་ལུ་འགྱུར་བཅོས་འབད་མི་ཚུ་ ཡང་ན་ NFT སྲོལ་འཁོར་གྱི་དོན་རྐྱེན་ཚུ་ལུ་ ཐད་ཀར་དུ་འབྲེལ་བ་ཡོད་པའི་ རྩིག་ཁྲམ་བཟོ་མི་ཚུ་ བཟོ་དགོ།

## ངོས་ལེན་ཚུ་ {#permissions}

གཞི་སྒྲིག་གི་ཆོག་ཐམ་གྱི་ཐོ་བཀོད་ནང་ལུ་ NFT གི་དོན་ལུ་ དམིགས་བསལ་གྱི་རྟགས་མཚན་ཚུ་ཡོདཔ་ཨིན།

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ངོས་ལེན་བརྟག་དཔྱད་ཚུ་ ལག་ལེན་འཐབ་མི་ runtime validatorགིས་ བཏོན་དོ་ཡོདཔ་ལས་ འབྲེལ་མཐུད་དེ་ཅིག་གིས་ ལག་ལེན་པ་ཡར་དྲག་གཏང་ཐོག་ལས་ ངོས་ལེན་འདི་ རང་བཞིན་སྒྲིག་ཚུགསཔ་ཨིན། ད་ལྟོའི་ default token གི་ཐོ་ཡིག་གི་དོན་ལུ་ [Permission Tokens](/dz/reference/permissions.md) ལུ་བལྟ་དགོ།

## གདམ་ཁ་རྐྱབ་ནི་ NFTs {#choosing-nfts}

NFT ལག་ལེན་འཐབ་ནི་ ཐོ་བཀོད་ནང་ལུ་ ཁྱད་ལྡན་དང་བདག་འཛིན་གྱི་གནད་དོན་ཚུ་:

- ཐོ་བཀོད་དང་ལྡནམ་སྦེ་ ལག་ཁྱེར་དང་ལག་འཁྱེར་ཚུ་
- ཐོ་བཀོད་དང་འབྲེལ་བའི་ཐོ་ཡིག་ཚུ་
- ངོས་འཛིན་དང་འབྲེལ་བའི་ ཐོ་བཀོད་ཚུ་ ཡང་ན་ རྩིས་ཁྲ་ནང་ཡོད་པའི་ ཐོ་བཀོད་ཀྱི་ཐོ་ཡིག
- བརྡ་བརྒྱུད་དང་ ཡིག་ཆ་ཚུ་ ཡང་ན་ འགྲེམ་ཐོག་ཚོགས་སྟོན་ཚུ་ནང་ འབྲེལ་གཏོགས་འབད་མི་ཚུ་ཨིན།

Fungible balance ཚུ་གི་དོན་ལུ་ ཨང་གྲངས་ཐོན་སྐྱེད་ལག་ལེན་འཐབ་ནི་དང་ data [ metadata ](/dz/blockchain/metadata.md) ལག་ལེན་འཐབ་ད་ data འདི་གནས་ཡོད་པའི་ ledger ობიექტიཅིག་གི་ compact attribut རྐྱངམ་གཅིག་ཨིན།

འདི་ཡང་བལྟ་:

- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [metadata](/dz/blockchain/metadata.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [དྲི་བཀོད་ཚུ་](/dz/blockchain/queries.md)
