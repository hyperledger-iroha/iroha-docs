---
translation_locale: dz
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# NFTs {#nfts}

## གྲུབ་འབྲས་ {#outcome}

Taira NFT གནས་སྟངས བརྟག་ཞིབ་འབད། དེ་ལས་ བཏོན་ཡོདཔ ས་གནས དྲ་རྒྱ ཅིག་ནང་ NFT ཁྱད་པར་ཅན་ཅིག་ཐོ་བཀོད་ གསར་བཅོས་ སྤོ་བཤུད་དང་ འདྲི་དཔྱད འབད། ལཱ་རྒྱུན གིས་ ཡོངས་སུ་རྫོགས ཤེས་ཚད་ཅན `name$domain.dataspace` NFT ID དང་ ཚད་ལྡན I105 ཇོ་བདག་ IDs ལག་ལེན་འཐབ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ ད་ལྟོའི `iroha` CLI
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- འབྲི་ནིའི་ཚོང་འབྲེལ་ཚུ་གི་དོན་ལུ་ [Iroha འགོ་བཙུགས་](/dz/get-started/launch-iroha.md) ནང་བཟུམ་སྦེ་ `kagami localnet generate --peers 4 --out-dir ./localnet` གིས་བཟོ་མི་ ས་གནས་དྲ་རྒྱ་ཅིག་ `./localnet/client.toml` དང་ `http://127.0.0.1:8080` གུ་ཡོད་པའི་ Torii དང་གཅིག་ཁར་ དགོཔ་ཨིན། དེ་མ་ཚད་ དེ་གི་མིང་རྟགས་འགོད་མི་གིས་ བདག་དབང་འཛིན་མི་ NFT མངའ་ཁོངས་ཅིག་ཡང་ དགོཔ་ཨིན་ (རིམ་པ་ 2 ལུ་ བལྟ)།

## རིམ་པ་ཚུ་ {#steps}

### 1. མི་མང་གི་བསྡུ་ལེན་ Taira བརྟག་ཞིབ་འབད་ {#_1-inspect-the-public-taira-collection}

སྟོངམ་གི་ཤོག་ལེབ་འདི་ ཀློག་ཐེངསམ་ཅིག་ཨིནམ་ད་ འདི་གི་དོན་ལས་ དགོས་མཁོ་ཅན་གྱི་ཤོག་ལེབ་ནང་ལུ་ མཐོང་ཚུགས་མི་ NFTs ཚུ་མེད་ཟེར་ཨིན་མས།

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs འདི་ ཨང་གྲངས་ལྷག་ལུས་ མེན་པར་ ཐུན་མོང་མ་ཡིན་པའི་ ཐོ་ཡིག་ཚུ་ཨིན། དེ་ཚུ་ལུ་ ID གཅིག་དང་ ཇོ་བདག་གཅིག་ དེ་ལས་ བསྡུས་ཏོག་ཏོ་གི་ ནང་དོན་ཐོ་ཡིག་གཅིག་ ཡོདཔ་ཨིན། ནང་དོན་ཐོ་ཡིག་དེ་ Torii བསྡུ་ཚོགས་ཀྱི་ གྲལ་ཐིག་ཚུ་གིས་ `metadata` སྦེ་ ལོག་བྱིནམ་ཨིནམ་དང་ `ledger nft get` གིས་ `content` སྦེ་ ལོག་བྱིནམ་ཨིན།

### ས་གནས་ཀྱི་བདག་འཛིན་འཐབ་མི་ཚུ་ལུ་ གྲ་སྒྲིག་འབད་ IDs {#_2-prepare-local-owner-ids}

འབྲི་ནིའི་དཔེ་འདི་ལུ་ མིང་རྟགས་འགོད་མི་རྩིས་ཐོ་གིས་ བདག་དབང་འཛིན་མི་ མངའ་ཁོངས་ཅིག་ ཡང་ན་ དེ་གི་དོན་ལུ་ `CanRegisterNft` ཆོག་ཐམ་གནང་བ་ཅིག་ དགོཔ་ཨིན། བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་གིས་ དེ་གི་ཞབས་ཏོག་ལེན་མིའི་དོན་ལུ་ གློག་རིམ་མངའ་ཁོངས་ ག་ནི་ཡང་ ཐོ་བཀོད་མི་འབད། དེ་མ་ཚད་ མངའ་ཁོངས་ཐད་ཀར་ཐོ་བཀོད་འབད་ནི་འདི་ འགོ་ཐོག་སྡེབ་ཚན་གྱི་དོན་ལུ་རྐྱངམ་ཅིག་ ཉར་ཚགས་འབད་ཡོདཔ་ལས་ `NFT_DOMAIN` འདི་ ཁྱོད་ཀྱི་མིང་རྟགས་འགོད་མི་གིས་ ཚད་འཛིན་འབད་མི་ `name.dataspace` མངའ་ཁོངས་ཅིག་ལུ་ གཞི་སྒྲིག་འབད། རིམ་སྒྲིག་འབད་ཡོད་པའི་ དབང་འཛིན་འདི་ དེ་གི་སྒེར་གྱི་ལྡེ་མིག་ མ་སྟོན་པར་ བཏོན་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ རྩིས་ཐོ་གཞན་ཅིག་ སྤོ་བཤུད་ཀྱི་འགྲོ་ཡུལ་སྦེ་ གདམ་ཁ་རྐྱབ།

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` དབྱེ་རྟགས་འདི་ NFT གི་ ཡིག་ཐོག་རྣམ་པའི་ཆ་ཤས་ཨིན། ID ནང་ `name.dataspace` མངའ་ཁོངས་ཆ་ཚང་ བཞག།

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

ཟུར་གནས་གནད་སྡུད གནས་གོང་འདི་ JSON ཨིན། ཁ་ལྡེ་མིག་ཅིག་བཙུགས་ནི་ ཡང་ན་ ཨེབ་ཐོ་བཀོད་དེ་ཚབ་མ་བཙུགས། འདི་གིས་ NFT ཐོ་བཀོད་ཡོངས་ཀྱི་ཚབ་མ་བཙུགསཔ་ཨིན།

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. བདག་དབང་སྤོ་བཤུད་ {#_5-transfer-ownership}

ཚད་ལྡན་གྱི་ I105 རྩིས་ཐོའི་ཨའི་ཌི་གཉིས་ཆ་ར་བཀྲམ་སྤེལ་འབད། མིང་གཞན་འདི་ `--from` ཡང་ན་ `--to` སྦེ་ལག་ལེན་མ་འཐབ་པའི་ཧེ་མ་ བསལ་དགོཔ་ཨིན།

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

Taira གུ་ འབྲི་ནིའི་ཚོང་འབྲེལ་རེ་རེ་གིས་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན། ཐོ་བཀོད་དང་ སྤོ་བཤུད་ བཏོན་གཏང་ནི་ དེ་ལས་ ཟུར་གནས་གནད་སྡུད་དུས་མཐུན་བཟོ་ནི་ཚུ་ ད་ལྟོ་ལག་ལེན་འཐབ་དོ་ཡོད་པའི་ ལག་བསྟར་མཉེན་ཆས་ཀྱིས་ ཞིབ་དཔྱད་འབདཝ་ཨིན་ (སྔོན་སྒྲིག་ཆོག་ཐམ་གྱི་ཁྱབ་ཁོངས་ནང་ `CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, དང་ `CanModifyNftMetadata`)། ཁྱོད་ཀྱི་རྩིས་ཐོ་གིས་ བདག་དབང་འཛིན་མི་ མངའ་ཁོངས་ཅིག་ ཡང་ན་ ཆོག་ཐམ་གནང་བ་འདི་ཚུ་ འཛིན་ཏེ་ཡོད་པའི་ མངའ་ཁོངས་ཅིག་ ལག་ལེན་འཐབ།

:::

གན་རྒྱ་བདག་དབང་ཡོད་པའི་ལཱ་གི་རྒྱུན་རིམ་ཚུ་གི་དོན་ལུ་ Kotodama ཡིག་དཔར་རྐྱབ་ཡོད་པའི་ NFT ཧོསིཊི་འབོད་བརྡ་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན། གཤམ་གསལ་འདི་ ཡིག་ཆ་བརྟག་དཔྱད་ཀྱི་ IVM ཡིག་ཆ་བརྟག་དཔྱད་ཀྱིས་ བསྡུ་སྒྲིག་འབད་དེ་ ལག་ལེན་འཐབ་ཡོད་པའི་ མི་ཚེའི་འཁོར་རིམ་བརྟག་དཔྱད་ཀྱི་ བརྡ་མཚོན་ངོ་མ་འདི་ཨིན།

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
    }
}
```

གཏན་བཟོས་ I105 གནས་གོང་གཉིས་འདི་ ཡར་རྒྱུག་ལས་འགུལ་གྱི་བརྟག་དཔྱད་གནས་སྡུད་ཨིན། བརྟག་དཔྱད་རྒྱུད་ལམ་གྱིས་ ལག་ལེན་འཐབ་མ་འགོ་བཙུགས་པའི་ཧེ་མ་ འགྲོ་ཡུལ་འདི་ཐོ་བཀོད་འབདཝ་ཨིན། དེ་ཚུ་ CLI ལམ་སྟོན་ནང་གི་ `CURRENT_OWNER` དང་ `NEW_OWNER` མེན། ཞུ་ཡིག་གན་རྒྱ་གི་དོན་ལུ་ དེའི་ཚད་ལྡན་རྩིས་ཐོ་ངོ་མ་ཚུ་བཙུགས་ཞིནམ་ལས་ [སྤྱང་གྲུང་གན་རྒྱ་ཚུ](./smart-contracts.md) བརྒྱུད་དེ་ བསྡུ་སྒྲིག་ བརྟག་དཔྱད་ བཀྲམ་སྤེལ་ དང་འབོད་བརྡ་འབད་དགོ། བསྐྱར་ཞིབ་མ་འབད་བའི་ བཱའིཊི་ཨང་རྟགས འདི་ Taira ལུ་མ་བཙུགས། གན་རྒྱ་ལག་ལེན་འཐབ་མི་འདི་ད་ལྟོ་ཡང་ ལག་བསྟར་མཉེན་ཆས དབང་ཆ བརྒྱུད་དགོཔ་ཨིནམ་དྲན་དགོ།

## བརྟག་དཔྱད་འབད་ {#verify}

NFT འདི་ ཀྲིག་ཀྲི་སྦེ་ཀློག་ཞིནམ་ལས་ འདི་གི་ཇོ་བདག་དེ་ བསྒྱུར་བཅོས་འབད་ཡོདཔ་དང་དེའི་དོན་གནད་ཚུ་ ལྕོགས་གྲུབ་ཅན་ཅིག་སྦེ་ར་ བཞག་སྟེ་ཡོད་ཟེར་ གསལ་སྟོན་འབདཝ་ཨིན།

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI གིས་ NFT ཐོ་ཡིག་ རང་དངོས་ གསལ་སྟོནམ་ཨིན། བདེན་ཁུངས་ཅན་གྱི་ མི་འགྱུར་བའི་ཆ་རྐྱེན་ཚུ་ `id`, `owned_by`, དང་ `content` ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `name$domain` གིས་ དབྱེ་དཔྱད་པ་ལ་ལོ་ཅིག་ནང་ ཡོངས་ཁྱབ་གནད་སྡུད་ས་སྒོ་ལུ་ སྔོན་སྒྲིག་འབད་ཚུགས་ དེ་འབདཝ་ད་ བཞེས་སྒོ་འབད་ནིའི་ཀི་དེབ་དང་ གློག་རིམ་ཨའི་ཌི་ཚུ་གིས་ གསལ་ཏོག་ཏོ་ `name$domain.dataspace` འབྲི་ཤོག་འདི་ལག་ལེན་འཐབ་དགོ།
- འདི་བཟུམ་སྦེ་ NFT ID གི་ ཐོ་བཀོད་ལོག་ལྟབ་སྦེ་འབད་ནི་དེ་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན། ས་གནས་ཀྱི་དྲ་ལམ་གསརཔ་ཅིག་ལག་ལེན་འཐབ་ ཡང་ན་ དམིགས་བསལ་ཡིག་རྒྱུན་གྱི་དོན་ལུ་ གནས་བརྟན་གསརཔ་ ID གདམ་ཁ་རྐྱབས།
- ཟུར་གནས་གནད་སྡུད ཨིན་པུཊའདི་ JSON ཚད་ལྡན་ནང་ཐོ་བཀོད་འབད་ནི་ཨིན། JSON གི་ཚིག་ཡིག་མ་བཀོད་པའི་ བཀའ་སྤྱོད་སྐོགས ཡིག་རྒྱུན འདི་ ཟུར་གནས་གནད་སྡུད གནས་གོང་ མིན་མེད་ཨིན།
- ད་ལྟོའི་ཇོ་བདག་ མེན་པའི་ རྩིས་ཐོ་གཞན་ཅིག་གིས་ མིང་རྟགས་བཀོད་མི་ སྤོ་བཤུད་ཅིག་ལུ་ NFT གི་མངའ་ཁོངས་ལུ་ བདག་དབང་ ཡང་ན་ ངེས་བདེན་གྱི་ `CanTransferNft` ཆོག་ཐམ་གནང་བ་ཅིག་ དགོཔ་ཨིན། `--from` བསྒྱུར་རུང་ མིང་རྟགས་འགོད་མི་ མི་འགྱུར།
- སྤོ་བཤུད་ཀྱིས་ `owned_by` རྐྱངམ་ཅིག་ བསྒྱུརཝ་ཨིན། ཟུར་གནས་གནད་སྡུད་དུས་མཐུན་བཟོ་ནི་དང་ ཐོ་བཀོད་བཏོན་གཏང་ནི་འདི་ མངའ་ཁོངས་ཀྱི་ཇོ་བདག་ ཡང་ན་ NFT དེ་གི་དོན་ལུ་ `CanModifyNftMetadata` ཡང་ན་ `CanUnregisterNft` འཛིན་མི་ རྩིས་ཐོ་ཅིག་ལུ་ ལུསཔ་ཨིན། ཇོ་བདག་གསརཔ་གིས་ དེ་ ཡང་ཅིག་ ཕར་ སྤོ་བཤུད་འབད་ཚུགས།
- Taira གིས་ NFT ནང་ཁྲལ་སྟོངམ་ལོག་གཏང་ཚུགས། ཁྱོད་ཀྱིས་ `items: []` ལུ་ NFT གི་བཀོད་རྒྱ་ཚུ་མ་ཐོབ་པའི་ཁུངས་ཅིག་སྦེ་ལག་ལེན་འཐབ་མ་བཅུག།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [NFT འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs) ལུ་འབདཝ་ཨིན།
- [Kotodama NFT མགྲོན་སྐྱོང་གློག་འཕྲུལ-ལས་རིམ་འབོད བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ཕྲང་བདེན་ Kotodama NFT སྲོལ་རྒྱུན་འཁོར་གྱི་བརྟག་དཔྱད་གནས་སྡུད་ཐོ་བཀོད་ནང་ — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་གི་ Kotodama ཡིག་ཆའི་དཔེ་ཚུ་གི་ བརྟག་དཔྱད་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/dz/blockchain/nfts.md)
- [ཟུར་གནས་གནད་སྡུད](/dz/blockchain/metadata.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
