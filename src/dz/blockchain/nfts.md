---
translation_locale: dz
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: human-reviewed
---
# NFTs {#nfts}

Iroha NFT འདི་ བདག་འཛིན་པ་གཅིག་ཡོད་མི་ ཁྱད་དུ་འཕགས་པའི་རྩིས་དེབ་ཀྱི་དངོས་པོ་ཨིན། ཡིག་ཆ་ཅིག་གིས་ རང་སོའི་ངོ་རྟགས་, ཟུར་གནས་གནད་སྡུད, ཚེ་འཁོར་གྱི་བྱུང་རྐྱེན་ཚུ་དང་བདག་དབང་སྤེལ་བའི་བརྡ་དོན་ཚུ་ དགོས་མཁོ་ཡོད་རུང་ གྱངས་ཁ་མཐུན་མེད་པ་ཅིན་ NFTs ལག་ལེན་འཐབ་ཨིན།

ཨང་གྲངས་ཀྱི་ [ རྒྱུ་དངོས་](/dz/blockchain/assets.md) དེ་དང་མ་འདྲ་བར་ NFT འདི་ནང་ལུ་ དངོས་གྲུབ་དང་ བརྟག་ཞིབ་འབད་ཐངས་ ཡང་ན་རྩིས་ཐོ་གི་གནས་ཚད་མེདཔ་ཨིན། NFT གིས་ ཐོ་བཀོད་ཅན་གྱི་དངོས་པོ་ཅིག་སྦེ་ཡོདཔ་ལས་ བདག་དབང་འདི་ཐད་ཀར་དུ་ གནད་དོན་དེའི་གུ་བཟུང་སྟེ་ཡོདཔ་ཨིན།

## བཟོ་བཀོད་ {#structure}

ཐོ་བཀོད་འབད་ཡོད་པའི་`Nft` ནང་ལུ་ཡོདཔ་ཨིན།

- `id`: `NftId` འབད་མི་ཅིག་
- `content`: NFT གི་སྐོར་ལས་ གསལ་སྟོན་འབད་ཡོད་པའི་ ཟུར་གནས་གནད་སྡུད
- `owned_by`: NFT གི་བདག་འཛིན་འཐབ་མི་རྩིས་ཐོ།

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

སྟོངམ་ `items` གྲལ་སྒྲིགའདི་ མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་ནང་ལུ་ ཆ་གནས་ཅན་གྱི་ལན་ཨིན། འདི་གིས་འབད་བ་ཅིན་ ད་ལྟོའི་ཤོག་ལེབ་ནང་ NFTs ཚུ་མེད་ཟེར་མ་སླབ་པར་ NFT གི་བསླབ་བྱ་ཚུ་མེད་ཟེར་ཡང་མེན།

## NFT IDs {#nft-ids}

`NftId` གིས་ཚིག་ཡིག་འབྲི་ཤོག་འདི་ལག་ལེན་འཐབ་ཨིན།

```text
name$domain
name$domain.dataspace
```

དཔེར་ན་ `badge$docs.universal` ངོས་འཛིན་འབདཝ་ཨིན། `badge` NFT འདི་ནང་ལུ་ `docs.universal` ཌའི་ཊ་ས་པི་ལེནཌ་འདི་སེལ་འཐུ་འབད་མ་བཏུབ་པ་ཅིན་ ད་ལྟོའི་པཱསི་ར་འདི་གིས་ `universal` གནད་སྡུད ས་སྟོང་ཚུ འདི་འབདཝ་ལས་ `badge$docs` གྲོས་ཐག་བཅད་ཡོདཔ་ `badge$docs.universal`.

NFT IDs ལུ་ གཏན་འཇགས་ཅན་གྱི་མིང་ལག་ལེན་འཐབ། ID འདི་ བཀོད་རྒྱ, འདྲི་དཔྱད, གནང་བ, བྱུང་ལས ཚགས་མ དང་ གློག་རིམ ཟུར་བརྟེན ཚུ་ནང་ལག་ལེན་འཐབ་མི་ དངོས་པོ ངོ་རྟགས ཨིན།

## སྲོལ་འཁོར་ {#lifecycle}

NFT མི་ཚེ་འཁོར་རིམ་བཀོལ་སྤྱོད་ཀྱི་ Iroha དམིགས་བསལ་གྱི་བཀོད་རྒྱ།

- [`Register`](/dz/blockchain/instructions.md#un-register) གིས་ འགོ་ཐོག་གི་ `content`དང་གཅིག་ཁར་ NFT བཟོཝ་ཨིན།
- [`Unregister`](/dz/blockchain/instructions.md#un-register) གིས་ NFT བཏོན་འབདཝ་ཨིན།
- [`Transfer`](/dz/blockchain/instructions.md#transfer) བསྒྱུར་བཅོས་འབད་མི་ཚུ་ `owned_by`.
- [`SetKeyValue`དང་ `RemoveKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) ད་ལྟོའི་ NFT མེ་ཊ་ཌའི་ཊཱག་ཚུ་

## ས་གནས་ཀྱི་དོན་ལུ་ བརྟག་དཔྱད་འབད་ {#try-it-locally}

དཔེ་འདི་ཚུ་གིས་ ཁྱོད་ཀྱིས་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ཅིག་ གཞི་བཙུགས་འབད་ཡོདཔ་དང་ ཁྱོད་ཀྱིས་ [CLI ལམ་སྟོན་](/dz/get-started/operate-iroha-via-cli.md)ལས་ ཌའི་ལོག་ ཞབས་ཏོག་ལེན་མི སྒྲིག་གཞི་བཟོ་ཡོད་པའི་རེ་བ་བསྐྱེད་འོང་།

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ འདི་གིས་ `wonderland.universal` དང་ དེའི་ SNS གླ་སྤྱོད ཧེ་མ་ལས་གཞི་སྒྲིག་འབདཝ་ཨིན། མངའ་ཁོངས གཞན་ཅིག་ལག་ལེན་འཐབ་པ་ཅིན་ [ས་ཁོངས་ཚུ་](/dz/blockchain/domains.md#registration) ནང་གསལ་བཤད་འབད་མི་ གསལ་བསྒྲགས་ཅན `app alias setup plan` དང་ `app alias setup apply` ལཱ་རྒྱུན་ཐོག་ལས་ ཧེ་མ་ར་བཟོ་དགོ།

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

NFT ལུ་ ཟུར་གནས་གནད་སྡུད ལྡེ་མིག ཅིག་བཙུགས་ཏེ་ སླར་ཡང་ཀློག་:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

མེ་ཊ་ཌེ་ཊ་ལྡེ་མིག་འདི་བཏོན་གཏང་།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

གདམ་ཁ་རྐྱབས་སྦེ་ NFT སྤོ་བཤུད་འབད། ད་ལྟོའི་ཇོ་བདག་དེ་ `owned_by` ལས་ལྷག་སྟེ་བལྟ་ནིའི་དོན་ལུ་ `ledger nft get` ལག་ལེན་འཐབ་དང་ འགྲོ་འགྲུལ་འབད་སའི་རྩིས་ཐོ་ ID འཚོལ་ནིའི་དོན་ལུ་ `ledger account list all` ལག་ལེན་འཐབ་།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

དཔེ་འདི་ NFT བཏུབ་ཚར་བའི་ཤུལ་ལས་བཏོན་གཏང་། ཁྱོད་ཀྱིས་དེ་བསྐྱར་སྦེ་སྤོ་བཤུད་འབད་བ་ཅིན་ ཡང་ན་ ད་ལྟོའི་ཇོ་བདག་གི་རྩིས་ཐོ་བཟོ་ཐངས་དང་གཅིག་ཁར་ ཐོ་བཀོད་མ་རྐྱབས་པའི་བཀའ་ཡིག་འདི་བཙུགས་དགོ།

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## དྲི་བཀོད་དང་བྱུང་རྐྱེན་ཚུ་ {#queries-and-events}

[`FindNfts`](/dz/reference/queries.md#assets-nfts-and-rwas) ལག་ལེན་འཐབ་སྟེ་ NFTs དང་ [`FindNftsByAccountId`](/dz/reference/queries.md#assets-nfts-and-rwas)རྩིས་ཐོ་གི་བདག་དབང་ལུ་ཡོད་པའི་ NFTs ཚུ་ནང་ཐོ་བཀོད་འབད་འོང་།

NFT ཐོ་བཀོད་འབད་ནི་དང་ བཏོན་གཏང་ནི་ མེད་ཌེ་ཊ་ཊཱ། ཕྱིར་སྤེལ་འབད་ནི་ དེ་ལས་ གནད་སྡུད་གསར་བཅོས་འདི་ NFT གི་དོན་རྐྱེན་ཚུ་ ཐོན་སྐྱེད་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ `Nft` གི་དོན་རྐྱེན་བརྟག་དཔྱད་དེ་ ལག་ལེན་འཐབ་པ་ཅིན་ ལྡོག་ཕྱོགས་ཤོག་སྒྲིལ་ལུ་འགྱུར་བཅོས་འབད་མི་ཚུ་ ཡང་ན་ NFT སྲོལ་འཁོར་གྱི་དོན་རྐྱེན་ཚུ་ལུ་ ཐད་ཀར་དུ་འབྲེལ་བ་ཡོད་པའི་ རྩིག་ཁྲམ་བཟོ་མི་ཚུ་ བཟོ་དགོ།

## ངོས་ལེན་ཚུ་ {#permissions}

གཞི་སྒྲིག་གི་ཆོག་ཐམ་གྱི་ཐོ་བཀོད་ནང་ལུ་ NFT གི་དོན་ལུ་ དམིགས་བསལ་གྱི་རྟགས་མཚན་ཚུ་ཡོདཔ་ཨིན།

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ངོས་ལེན་བརྟག་དཔྱད་ཚུ་ ལག་ལེན་འཐབ་མི་ ལག་བསྟར་མཉེན་ཆས བདེན་དཔྱད་པགིས་ བཏོན་དོ་ཡོདཔ་ལས་ འབྲེལ་མཐུད་དེ་ཅིག་གིས་ ལག་ལེན་པ་ཡར་དྲག་གཏང་ཐོག་ལས་ ངོས་ལེན་འདི་ རང་བཞིན་སྒྲིག་ཚུགསཔ་ཨིན། ད་ལྟོའི་ སྔོན་སྒྲིག ཊོ་ཀེན གི་ཐོ་ཡིག་གི་དོན་ལུ་ [ངོས་ལེན་རྟགས་ཚུ་](/dz/reference/permissions.md) ལུ་བལྟ་དགོ།

## གདམ་ཁ་རྐྱབ་ནི་ NFTs {#choosing-nfts}

NFT ལག་ལེན་འཐབ་ནི་ ཐོ་བཀོད་ནང་ལུ་ ཁྱད་ལྡན་དང་བདག་འཛིན་གྱི་གནད་དོན་ཚུ་:

- ལག་ཁྱེར་དང་ངོ་རྟགས་ ཆོག་ཐམ་དང་བདེན་དཔང་ཚུ།
- འཐུས་མིའམ་འཛུལ་སྤྱོད་དྲན་ཐོ།
- ངོ་རྟགས་བཀག་སྡོམ་ཡང་ན་རྩིས་ཐོའི་བདག་དབང་ཡོད་པའི་ཞུ་ཡིག་དྲན་ཐོ།
- བརྡ་བརྒྱུད་དང་ཡིག་ཆ་ ཡང་ན་ གསལ་བསྒྲགས་ཚུ་ལུ་ གཞི་བསྟུན་འབདཝ་ཨིན།

ཕང་ཇི་བཱལ་ལྷག་ལུས་ཚུ་གི་དོན་ལུ་ ཨང་གྲངས་རྒྱུ་དངོས་ཅིག་ལག་ལེན་འཐབ། དེ་ལས་ གནད་སྡུད་འདི་ ད་ལྟོ་ཡོད་པའི་བཀག་ཆའི་རྩིས་ཐོ་དངོས་པོ་གི་ ཁྱད་ཆོས་ཆུང་ཀུ་ཅིག་རྐྱངམ་ཅིག་ཨིན་པའི་སྐབས་ [མེ་ཊ་ཌེ་ཊ་](/dz/blockchain/metadata.md) ལག་ལེན་འཐབ།

ད་དུང་གཟིགས།

- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [ཟུར་གནས་གནད་སྡུད](/dz/blockchain/metadata.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [དྲི་བཀོད་ཚུ་](/dz/blockchain/queries.md)
