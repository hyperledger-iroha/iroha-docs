---
translation_locale: dz
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: human-reviewed
---
# རྒྱུ་དངོས་ཚུ་ {#assets}

Iroha རྒྱུ་དངོས་འདི་རྩིས་ཐོ་གིས་བཟུང་མི་ཨང་གྲངས་མཐུན་རྐྱེན། རྩིས་ཐོའི་མཐུན་རྐྱབས་ཆ་མཉམ་གྱིས་ `AssetDefinition` ལུ་ཁ་བསྟན་ཏེ་ཡོདཔ་ད་ དོན་འགྲེལ་འདི་གིས་ འདི་བཟུམ་མའི་རྒྱུ་དངོས་ལུ་ མིང་བཏགས་ནི་དང་ ཨེབ་གཏང་འབད་ནི་དང་ བཏོན་ནི་ དེ་ལས་བགོ་བཤའ་བརྐྱབ་ནི་གི་ཐབས་ལམ་ཚུ་ གསལ་བཀོད་འབདཝ་ཨིན།

## རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ {#asset-definition}

`AssetDefinition` ནང་ལུ་ཡོདཔ་ཨིན།

- `id`: ཚད་ལྡན་གྱི་རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཁ་བྱང་།
- `name`: མི་གིས་ལྷག་ཚུགས་པའི་བཀྲམ་སྟོན་མིང་ཅིག
- `description`: གདམ་ཁ་ཅན་གྱི་མི་གིས་ལྷག་ཚུགས་པའི་འགྲེལ་བཤད།
- `alias`: གདམ་ཁ་ཅན་གྱི་མིང་གཞན་ `<name>#<domain>.<dataspace>` ཡང་ན་ `<name>#<dataspace>` འབྲི་ཤོག་ནང་།
- `spec`: ལྷག་ལུས་ཚུ་གི་དོན་ལུ་ ཨང་གྲངས་ཀྱི་གཏན་གཏན་དང་ བཀག་ཆ་ཚུ།
- `mintable`: བརྟག་ཞིབ་འབད་ནིའི་ སྲིད་བྱུས་
- `logo`: གདམ་ཁ་རྐྱབས། `SoraFS` URI
- `metadata`: གང་བྱུང་ལྡེ་མིག་གནས་གོང་མེ་ཊ་ཌེ་ཊ།
- `balance_scope_policy`: ལྷག་ལུས་ཚུ་ ཡོངས་ཁྱབ་ཡང་ན་ གནད་སྡུད་ས་སྟོང་ཚད་འཛིན་འབད་ཡོདཔ་ཨིན་ན་མེན་ན།
- `owned_by`: ཐོ་བཀོད་འབད་མི་ཡང་ན་ངེས་ཚིག་བདག་དབང་འབད་མི་རྩིས་ཐོ།
- `total_quantity`: བསྡོམས་རྩིས་བཏོན་པའི་གྲངས་ཚད།
- `confidential_policy`: ཉེན་སྲུང་འབད་ཡོད་པའི་རྒྱུ་དངོས་བཀོལ་སྤྱོད་ཀྱི་སྲིད་བྱུས།

རྒྱུ་དངོས་ཚུ་ ངེས་གཏན་བཟོ་ནི། IDs འདི་ཡང་ ཚད་ལྡན་གྱི་ ཁ་གསལ་མེད་མི་ ཡི་གུ་ཚུ་ཨིན། ངེས་ཚིག་འདི་ ས་ཁོངས་དང་མིང་ནང་ལས་ བཟོ་སྐྲུན་འབད་བ་ཅིན་ Iroha འདི་གི་དོན་ལུ་ མངའ་ཁོངས/མིང ཕྱིར་སྟོན ཚུ་བཞག་ཚུགས། UX དང་དྲི་བ་ཚུ་ཨིན་རུང་ ཀན་ནོག་གི་ཡི་གུ་བཟོ་རྣམ་འདི་ ཡི་གུ་བཟོཝ་ཨིན།

## རྒྱུ་དངོས་གི་གནས་ཚད་ {#asset-balance}

`Asset` འདི་ནང་ལུ་:

- `id`: `AssetId` ཅིག་, དེ་གིས་ རྒྱུ་དངོས་ངེས་ཚིག་དང་ བདག་དབང་རྩིས་ཐོ་ དེ་ལས་ གདམ་ཁའི་ལྷག་ལུས་ཁྱབ་ཁོངས་ཚུ་ མཉམ་སྡེབ་འབདཝ་ཨིན།
- `value`: a `Numeric` ལྷག་ལུས་

རྩིས་ཐོ་བདག་འཛིན་དེ་ ཀན་ནོ་སི་དང་ ཌོ་མེནམེད་ཡོདཔ་ཨིན། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་འདི་ ཌེ་ཊའི་ས་ཁོངས་ནང་ ཁྱད་ཚད་ཅན་གྱི་ ཌོ་མེན་ནང་ལུ་ བརྟག་དཔྱད་འབད་བཏུབ། དཔེ་འབད་བ་ཅིན་ `payments.universal`.

## བཟོ་སྐྲུན་འབད་ཚུགསཔ་ {#mintability}

རྒྱུ་དངོས་ངེས་ཚིག་འདི་དག་རྒྱུ་དངོས་སྤྲོད་པའི་སྲིད་བྱུས་ཐབས་ལམ་འདི་དག་ལ་རྒྱབ་སྐྱོར་བྱེད།

| ཐབས་ལམ་ | དོན་དག་ |
| ------------ | |
|`Infinitely` |ཁེ་སང་འདི་ འཕྲལ་འཕྲལ་ར་བཟོ་སྟེ་འཚིག་གཏང་ཚུགས་ཡོདཔ་ཨིན།|
| `Once` | གཏན་འཇགས་-བཀྲམ་སྤེལ་བརྡ་རྟགས། ཚར་གཅིག་བཏོན་ཞིནམ་ལས་ མེ་བཏང་ཚུགས། |
| `Not` | མེ་བཏང་བཏུབ་པའི་ གཏན་འཇགས་བཀྲམ་སྤེལ་གྱི་རྟགས་མཚན་ དེ་འབདཝ་ད་ ལོག་སྟེ་ བཏོན་མ་བཏུབ། |
| `Limited(n)` | སྲིད་བྱུས་འདི་གིས་ རྒྱུ་དངོས་སྡེ་ཚན་གསརཔ་ཚུ་ ཚད་འཛིན་ཅན་གྱི་ལག་ལེན་ཁ་སྐོང་ནང་ བཏོན་བཅུགཔ་ཨིན། |

སྤྱིར་བཏང་བསྒུལ་ཤུགས་རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ `Infinitely` དང་ གཏན་འཇགས་བཀྲམ་སྤེལ་ཡང་ན་ ཚད་འཛིན་བཀྲམ་སྤེལ་རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ `Once` ཡང་ན་ `Limited(n)` ལག་ལེན་འཐབ། རྒྱུ་དངོས་བཀྲམ་སྤེལ་འདི་ཧེ་མ་ལས་གཞི་བཙུགས་མ་འབད་ཚུན་ཚོད་ `Not` འདི་ འགོ་ཐོག་སྲིད་བྱུས་སྦེ་ལག་ལེན་མ་འཐབ།

## བརྒྱ་ཆ་བསྡོམས་ཀྱི་གནས་ཚད་ {#balance-scope}

`balance_scope_policy` གིས་ ལྷག་ལུས་ཚུ་ག་དེ་སྦེ་ བཱ་ཀེཊི་འབདཝ་ཨིན་ན་ ཚད་འཛིན་འབདཝ་ཨིན།

- `Global`: རྩིས་ཐོ་རེ་ལུ་ལྷག་ལུས་བཱ་ཀེཊ་གཅིག་དང་རྒྱུ་དངོས་ངེས་ཚིག
- `DataspaceRestricted`: ལྷག་ལུས་ཚུ་ གནད་སྡུད་ས་སྟོང་སྐབས་དོན་གྱིས་བར་བཅད་འབད་ཡོདཔ་ཨིན།

ཌེ་ཊ་ས་པི་སི་ཚད་འཛིན་ཅན་གྱི་དངུལ་ཀྲམ་ཚུ་ ཕན་ཐོགས་ཡོདཔ་ད་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་དེ་ མང་ཤོས་ར་ Nexus ཌེ་ཀྲ་ས་པིསི་ནང་ལུ་ལག་ལེན་འཐབ་དོ་ཡོད་རུང་ དངུལ་ཀྲམ་དེ་ཚུ་སོ་སོ་སྦེ་བཞག་དགོཔ་ཨིན།

## Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

འ་ནི་ ཀློག་རྐྱང་གི་ཅ་ལ་ཚུ་གིས་ མི་མང་གི་ Taira བརྟག་དཔྱད་དྲ་རྒྱནང་ལུ་ རྒྱུ་དངོས་ངོ་མ་ཚུ་གི་འགྲེལ་བཤད་ཚུ་བཏོན་དོ་ཡོདཔ་ཨིན།

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

ད་ལྟོའི་ Taira XOR འཐུས་མ་དངུལ་གྱི་འགྲེལ་བཤད་འཚོལ་བ།

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ཟུར་གནས་གནད་སྡུད འབག་འོང་མི་འགྲེལ་བཤད་ཚུ་འཚོལ་:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

དཔེ་གསུམ་པོ་འདི་ཀློག་ཡོད། Taira གུ་རྒྱུ་དངོས་ཚུ་ བཏོན་ནི་དང་ མེ་བཏང་ནི་ ཡང་ན་ སྤོ་བཤུད་འབད་ནི་ལུ་ བརྟག་དཔྱད་ནེཊ་གི་མ་དངུལ་རྒྱབ་སྐྱོར་རྩིས་ཐོ་དང་ [ ནང་ལུ་ ཉེན་སྲུང་འབད་ཡོད་པའི་རྒྱུན་འགྲུལ་འདི་ SORA Nexus གནད་སྡུད་ས་སྒོ་](/dz/get-started/sora-nexus-dataspaces.md) ལུ་མཐུད།

འཐུས་སྤྲོད་དགོ་པའི་ Taira རྒྱུ་དངོས དཔེ་ཅིག་གི་དོན་ལུ་ [Taira ལས་ བརྟག་དཔྱད་དྲ་རྒྱ XOR ལེན།](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ནང་གི་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག རོགས་ལས་རིམ འདི་ `taira_faucet_claim.py` སྦེ་བསྲུང་ཞིནམ་ལས་ དང་པ་རང་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག རྒྱུ་དངོས ལེན་ཏེ་ ཚོང་འབྲེལ ལག་བསྟར་ཟད་གྲོན རྒྱུ་དངོས སྦེ་ལག་ལེན་འཐབ།

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

དེ་ལས་ `ledger asset mint`, `ledger asset burn` དང་ `ledger asset transfer` གི་བཀའ་རྒྱ་ཚུ་ནང་ལུ་ `--metadata ./taira.tx-metadata.json` རྩིས་དགོ།

## ལམ་སྟོན་ཚུ་ {#instructions}

རྒྱུ་དངོས་ཚུ་ Iroha དམིགས་བསལ་གྱི་བཀོད་རྒྱ་དང་འཁྲིལ་ ཐོ་བཀོད་འབད་ནི་དང་བཟོ་ནི་ མེ་ཤི་གཏང་ནི་དང་ བསྒྱུར་བཅོས་འབད་ནི།

- [`Register` དང་ `Unregister`](/dz/blockchain/instructions.md#un-register)
- [`Mint` དང་ `Burn`](/dz/blockchain/instructions.md#mint-burn)
- [`Transfer`](/dz/blockchain/instructions.md#transfer)
- [`SetKeyValue` དང་ `RemoveKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue)

ད་དུང་གཟིགས།

- [CLI ལམ་སྟོན་](/dz/get-started/operate-iroha-via-cli.md)
- [Rust སྟོན་ཐངས་](/dz/guide/tutorials/rust.md)
- [Python སྟོན་ཐངས་](/dz/guide/tutorials/python.md)
- [JavaScript/TypeScript སྦྱོང་བརྡར་](/dz/guide/tutorials/javascript.md)
- [གནད་སྡུད་ཀྱི་རྣམ་གཞག་](/dz/blockchain/data-model.md)
- [NFTs](/dz/blockchain/nfts.md)
