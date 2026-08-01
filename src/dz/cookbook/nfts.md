---
translation_locale: dz
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## གྲུབ་འབྲས་ {#outcome}

བརྟག་དཔྱད་འབད་ Taira NFT གནད་སྡུད་ཚུ་བཙུགས་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་ནི་དང་ ད་ལྟོའི་གནས་སྟངས་ལུ་ བཏོན་གཏང་ནི་ དེ་ལས་ ཁྱད་དུ་འཕགས་པའི་ཡིག་ཆ་ཅིག་འཚོལ་ NFT ལས་རིམ་དེ་ནང་ ལཱ་འབད་ཐངས་ཚུ་ ཡོངས་འབྲེལ་ཐོག་ལས་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། `name$domain.dataspace` NFT ID དང་ ཀ་ནོ་ནི་ཀཱན་གྱི་ I105 སྦྱིན་བདག་ IDs.

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ current `iroha` CLI
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- ཡིག་ཚང་གི་དོན་ལུ་ [ལས་ local network ཐོན་སྐྱེད་འབད་ Iroha](/dz/get-started/launch-iroha.md)འགོ་བཙུགསཔ་ད་ `./localnet/client.toml` དང་ Torii ལུ་ `http://127.0.0.1:8080`.

## རིམ་པ་ཚུ་ {#steps}

### 1. མི་མང་གི་བསྡུ་ལེན་ Taira བརྟག་ཞིབ་འབད་ {#_1-inspect-the-public-taira-collection}

སྟོངམ་གི་ཤོག་ལེབ་འདི་ ཀློག་ཐེངསམ་ཅིག་ཨིནམ་ད་ འདི་གི་དོན་ལས་ དགོས་མཁོ་ཅན་གྱི་ཤོག་ལེབ་ནང་ལུ་ མཐོང་ཚུགས་མི་ NFTs ཚུ་མེད་ཟེར་ཨིན་མས།

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs གིས་ ཁྱད་དུ་འཕགས་པའི་ཐོ་ཡིག་ཚུ་ཨིན། ཨང་གྲངས་ཀྱི་སྒྲོམ་མེན། ཁོང་ནང་ ID ཡོད་པའི་ཁར་ བདག་འཛིན་པ་གཅིག་ཡོདཔ་མ་ཚད་ `content` མེ་ཊ་ཌའི་ཊ་ཀ་པཡང་ཡོདཔ་ཨིན།

### ས་གནས་ཀྱི་བདག་འཛིན་འཐབ་མི་ཚུ་ལུ་ གྲ་སྒྲིག་འབད་ IDs {#_2-prepare-local-owner-ids}

ཡིག་སྣོད་དཔེ་རྙིངམ་འདི་ `wonderland.universal` ཌོ་मेनལག་ལེན་འཐབ་ཨིན། གཞི་སྒྲིག་འབད་ཡོད་པའི་དབང་འཛིན་དེ་ སྒེར་གྱི་ལྡེ་མིག་མ་བཏོན་པར་བཏོན་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་རྩིས་ཁྲ་གཞན་ཅིག་ལུ་ བསྒྱུར་བཅོས་འབད་སའི་ས་གནས་སྦེ་ གདམ་ཁ་རྐྱབས་འོང་།

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` དབྱེ་བྲག་འདི་ NFT ཡིག་སྣོད་ནང་ཚུད་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་ `wonderland.universal` ཌོ་མེ་ནདང་ ཌ་ཊ་ས་བིསི་གི་རྒྱབ་སྒྲིལ་ཚུ་ཆ་མཉམ་སྦེ་བཞག་དགོ།

### ༣༽ NFT དང་འབྲེལ་གྱི་དོན་ཚན་ཚུ་ནང་ ཐོ་བཀོད་འབད་ {#_3-register-the-nft-with-initial-content}

CLI གིས་འགོ་དང་པ་གི་ JSON འདྲ་ཕབ་ཚུ་ ཨེབ་ཐོར་ལས་ལྷག་ཨིན། ད་ལྟོའི་དབང་འཛིན་དེ་ བདག་འཛིན་འཐབ་མི་ལུ་འགྱུར་ནུག

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. ནང་དོན་གི་ཇོ་བཀོད་འདི་ ད་ལྟོའི་བར་དུ་བཟོ་བཅོས་འབདཝ་ཨིན། {#_4-update-the-content-map}

metadata གནས་གོང་འདི་ JSON ཨིན། ཁ་ལྡེ་མིག་ཅིག་བཙུགས་ནི་ ཡང་ན་ ཨེབ་ཐོ་བཀོད་དེ་ཚབ་མ་བཙུགས། འདི་གིས་ NFT ཐོ་བཀོད་ཡོངས་ཀྱི་ཚབ་མ་བཙུགསཔ་ཨིན།

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. ཕྱིར་འབུད་ཀྱི་དབང་ཆ་ {#_5-transfer-ownership}

ཅ་ཆས་གཉིས་ཆ་ར་ Canonical I105 རྩིས་ཁྲ་ IDs. མིང་རྟགས་འདི་ ལག་ལེན་འཐབ་པའི་ཧེ་མ་ སེལ་འཐུ་འབད་དགོཔ་ཨིན། `--from` ཡང་ན་ `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

ཐོ་བཀོད་འབད་ནི་ Taira, འབྲི་མི་ག་ར་གིས་ཡང་ དགོཔ་ཨིན། `--metadata ./taira.tx-metadata.json` ཐོ་བཀོད་, བསྒྱུར་བཅོས་,སེལ་འཐུ་,དང་ metadata ད་ལྟོའི་ཐོག་ལས་བརྟག་དཔྱད་འབད་དོ་ཡོདཔ་ཨིན།`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, དང་ `CanModifyNftMetadata` རང་སོའི་ལག་ལེན་ལུ་ བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ ས་ཁོངས་འདི་ ལག་ལེན་འཐབ་ ཡང་ན་ localnet ལུ་ འདི་བརྒྱུད་དེ་འགྱོ་དགོ།

:::

ལས་བྱེདཔ་ཚུ་གི་དོན་ལུ་ Kotodama གིས་ typeed NFT host call ཚུ་མངོན་གསལ་བཟོཝ་ཨིན། འ་ནི་འདི་ཚེ་རིང་མཐའ་འཁོར་སྒྲིག་གཞི་ངོ་མ་ཨིན་པིན་ཌ་གི་ IVM ཡིག་སྣོད་བརྟག་དཔྱད་འབད་བའི་ཐོག་ལས་ བསྡུ་བསྒྱོམ་དང་ལག་ལེན་འབད་ཡོདཔ་ཨིན།

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

I105 ཚད་གཞི་གཉིས་འདི་ ཆུ་རུད་གོང་མའི་བརྟག་དཔྱད་ཐིག་ཁྲམ་ཚུ་ཨིན་ རིན་སེངྒེ་འདི་གིས་ འགོ་བཙུགས་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་སའི་ས་ཁོངས་ལུ་ ཐོ་བཀོད་ཀྱི་རྩིས་རྐྱབ་ཨིན། དེ་ཚུ་ `CURRENT_OWNER` དང་ `NEW_OWNER` ལས་མེད་ CLI སྒྲིག་འཇུག་གི་འཆམ་ཡིག་གི་དོན་ལུ་ ཨའི་གི་བདེན་པའི་རྩིས་ཁྲ་ཚུ་བཙུགས་ཞིནམ་ལས་ བསྡུ་སྒྲིག་འབད་ནི་དང་ བརྟག་དཔྱད་འབད་ནི་ དེ་ལས་ ལག་ལེན་འཐབ་ནི་ དེ་ལས་ [Smart contracts](./smart-contracts.md)བརྒྱུད་དེ་འབོ་དགོ། བི་ཊེཀོཌ་ལོག་ལྟ་མ་འབད་བར་ Taira ལུ་བཙུགས་མི་དགོ་ དེ་ལས་འཆམ་ཡིག་གི་ལག་ལེན་འབད་ཐངས་འདི་ རྒྱུན་སྐྱོང་དུས་ཚོད་ལུ་ ངོས་འཛིན་འབད་དགོ་ཟེར་ དྲན་པ་བཏོན་དགོ།

## བརྟག་དཔྱད་འབད་ {#verify}

NFT འདི་ ཀྲིག་ཀྲི་སྦེ་ཀློག་ཞིནམ་ལས་ འདི་གི་ཇོ་བདག་དེ་ བསྒྱུར་བཅོས་འབད་ཡོདཔ་དང་དེའི་དོན་གནད་ཚུ་ ལྕོགས་གྲུབ་ཅན་ཅིག་སྦེ་ར་ བཞག་སྟེ་ཡོད་ཟེར་ གསལ་སྟོན་འབདཝ་ཨིན།

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI གིས་ཐོ་ཡིག་འདི་ཐོན་སྐྱེད་ཁེབས་ནང་བཀབ་པ་ཅིན་ JSON འདི་ཚར་གཅིག་བརྟག་དཔྱད་འབད་ཞིནམ་ལས་ ནང་འཁོད་ལུ་ཡོད་པའི་ NFT ობიექტიལུ་ སྙན་ཞུ་དེ་ལག་ལེན་རྐྱབས། ངོས་འཛིན་ཅན་གྱི་འགྱུར་ལྡོག་ཚུ་ `id`, `owned_by` དང་ `content`ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `name$domain` ཌའི་ཊ་ས་པི་སི་ཚུ་ནང་ སྤྱིར་བཏང་གནས་སྡུད་ཀྱི་གནས་ཚད་ལུ་ གཞི་སྒྲིག་འབད་ཚུགས། ཨིན་རུང་ Cookbook དང་ Application IDs གིས་ གསལ་ཏོག་ཏོ་སྦེ་ `name$domain.dataspace` གི་བཟོ་རྣམ་འདི་ལག་ལེན་འཐབ་དགོ།
- འདི་བཟུམ་སྦེ་ NFT ID གི་ ཐོ་བཀོད་ལོག་ལྟབ་སྦེ་འབད་ནི་དེ་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན། ས་གནས་ཀྱི་དྲ་ལམ་གསརཔ་ཅིག་ལག་ལེན་འཐབ་ ཡང་ན་ དམིགས་བསལ་ཡིག་རྒྱུན་གྱི་དོན་ལུ་ གནས་བརྟན་གསརཔ་ ID གདམ་ཁ་རྐྱབས།
- metadata inputའདི་ JSON ཚད་ལྡན་ནང་ཐོ་བཀོད་འབད་ནི་ཨིན། JSON གི་ཚིག་ཡིག་མ་བཀོད་པའི་ shell string འདི་ metadata value མིན་མེད་ཨིན།
- ད་ལྟོའི་བདག་འཛིན་འཐབ་མི་ལས་བརྒལ་བའི་རྩིས་ཁྲ་ཅིག་གིས་མིང་རྟགས་བཀོད་པའི་བསྐྱིན་འགྲུལ་འདི་ ངེས་བདེན་སྦེ་ ངོས་ལེན་འབད་དགོཔ་ཨིན། `--from` བསྒྱུར་བཅོས་འབད་ནི་དེ་གིས་ ངོ་རྟགས་བཙུགས་མི་དེ་ཡང་ བསྒྱུར་བཅོས་མེདཔ།
- བསྒྱུར་བཅོས་འབད་བའི་ཤུལ་ལས་ ངོ་མ་མགྲོན་པ་ལུ་ NFT བཟོ་བཀོད་བསྒྱུར་བཅོས་འབད་ནི་དང་ ཐོ་བཀོད་མ་རྐྱབ་པར་བཞག་ཚུགས། ལག་ལེན་པ་གསརཔ་གི་མིང་རྟགས་ཅན་ ཡང་ན་ ངོས་འཛིན་ཅན་གྱི་ལག་ལེན་འགོ་དཔོན་ཅིག་ལག་ལེན་འཐབ་དགོ།
- Taira གིས་ NFT ནང་ཁྲལ་སྟོངམ་ལོག་གཏང་ཚུགས། ཁྱོད་ཀྱིས་ `items: []` ལུ་ NFT གི་བཀོད་རྒྱ་ཚུ་མ་ཐོབ་པའི་ཁུངས་ཅིག་སྦེ་ལག་ལེན་འཐབ་མ་བཅུག།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [NFT འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs) ལུ་འབདཝ་ཨིན།
- [Kotodama NFT host-call བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ཕྲང་བདེན་ Kotodama NFT སྲོལ་རྒྱུན་འཁོར་གྱི་ མཐུད་སྦྲེལ་ཐོ་བཀོད་ནང་](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/dz/blockchain/nfts.md)
- [metadata](/dz/blockchain/metadata.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
