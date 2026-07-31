---
translation_locale: dz
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# རྒྱུ་དངོས་ཚུ་ {#assets}

Iroha རྒྱུ་དངོས་འདི་རྩིས་ཁྲ་གིས་བཟུང་མི་ཨང་གྲངས་མཐུན་རྐྱེན། རྩིས་ཁྲའི་མཐུན་རྐྱབས་ཆ་མཉམ་གྱིས་ `AssetDefinition` ལུ་ཁ་བསྟན་ཏེ་ཡོདཔ་ད་ དོན་འགྲེལ་འདི་གིས་ འདི་བཟུམ་མའི་རྒྱུ་དངོས་ལུ་ མིང་བཏགས་ནི་དང་ ཨེབ་གཏང་འབད་ནི་དང་ བཏོན་ནི་ དེ་ལས་བགོ་བཤའ་བརྐྱབ་ནི་གི་ཐབས་ལམ་ཚུ་ གསལ་བཀོད་འབདཝ་ཨིན།

## རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ {#asset-definition}

`AssetDefinition` འདི་ནང་ལུ་:

- `id`: ཀ་ནོ་ནི་ཀཱན་གྱི་རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཁ་བྱང་།
- `name`: མི་གིས་ཀློག་ཚུགས་པའི་མཐོང་སྣོད་ཀྱི་མིང་།
- `description`: ཁ་ optional མི་གིས་ལྷག་ཚུགས་པའི་འགྲེལ་བཤད་
- `alias`: `<name>#<domain>.<dataspace>` ཡང་ན་ `<name>#<dataspace>` གི་བཟོ་རྣམ་ནང་ གདམ་ཁ་རྐྱབས་ཀྱི་མིང་།
- `spec`: ཨང་གྲངས་ཀྱི་ཕྲ་ཚད་དང་ བརྒྱ་ཆ་ཚུ་གི་དོན་ལུ་ བཀག་དམ་ཚུ་
- `mintable`: བརྟག་ཞིབ་འབད་ནིའི་ སྲིད་བྱུས་
- `logo`: གདམ་ཁ་རྐྱབས། `SoraFS` URI
- `metadata`: རང་འདོད་ཅན་གྱི་ལྡེ་མིག་གི་གོང་ཚད་ཀྱི་བརྡ་དོན་ཚུ་
- `balance_scope_policy`: དངུལ་རྐྱང་ཚུ་ ཡོངས་ཁྱབ་སྦེ་ཡོདཔ་ཨིན་ན་ ཡང་ན་ གནས་སྡུད་གནས་ཚད་ལུ་ ཐོ་ཕོག་སྟེ་ཡོད་མེད་
- `owned_by`: རྩིས་ཁྲ་དེ་ ཐོ་བཀོད་འབད་ཡོདཔ་དང་ ཡང་ན་ མིང་ཚིག་གི་བདག་འཛིན་འཐབ་ཡོདཔ་ཨིན།
- `total_quantity`: བསྐྱལ་མི་ཐོན་སྐྱེད་ཡོངས་བསྡོམས་
- `confidential_policy`: སྲིད་བྱུས་དེ་ ཉེན་སྐྱོབ་ཅན་གྱི་ རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ཨིན།

རྒྱུ་དངོས་ཚུ་ ངེས་གཏན་བཟོ་ནི། IDs འདི་ཡང་ ཀ་ནོ་ནི་ཀཱན་གྱི་ ཁ་གསལ་མེད་མི་ ཡི་གུ་ཚུ་ཨིན། ངེས་ཚིག་འདི་ ས་ཁོངས་དང་མིང་ནང་ལས་ བཟོ་སྐྲུན་འབད་བ་ཅིན་ Iroha འདི་གི་དོན་ལུ་ domain/name projection ཚུ་བཞག་ཚུགས། UX དང་དྲི་བ་ཚུ་ཨིན་རུང་ ཀན་ནོག་གི་ཡི་གུ་བཟོ་རྣམ་འདི་ ཡི་གུ་བཟོཝ་ཨིན།

## རྒྱུ་དངོས་གི་གནས་ཚད་ {#asset-balance}

`Asset` འདི་ནང་ལུ་:

- `id`: `AssetId` གིས་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་དང་ བདག་འཛིན་པའི་རྩིས་ཁྲ་ དེ་ལས་ གདམ་ཁ་རྐྱབས་ཀྱི་དངུལ་ཁང་གི་གནས་ཚད་ཚུ་ གཅིག་ཁར་བསྡོམས་ཏེ་འབདཝ་ཨིན།
- `value`: `Numeric`གི་མཐུན་རྐྱེན་

རྩིས་ཁྲ་བདག་འཛིན་དེ་ ཀན་ནོ་སི་དང་ ཌོ་เมนམེད་ཡོདཔ་ཨིན། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་འདི་ ཌེ་ཊའི་ས་ཁོངས་ནང་ ཁྱད་ཚད་ཅན་གྱི་ ཌོ་ମେན་ནང་ལུ་ བརྟག་དཔྱད་འབད་བཏུབ། དཔེ་འབད་བ་ཅིན་ `payments.universal`.

## བཟོ་སྐྲུན་འབད་ཚུགསཔ་ {#mintability}

རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་གིས་ mintability ཐབས་ལམ་འདི་ རྒྱབ་སྐྱོར་འབདཝ་ཨིན།

|ཐབས་ལམ་ |དོན་དག་ |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |ཁེ་སང་འདི་ འཕྲལ་འཕྲལ་ར་བཟོ་སྟེ་འཚིག་གཏང་ཚུགས་ཡོདཔ་ཨིན།|
|`Once` |གྲ་སྒྲིག་གི་བཀྲམ་སྤེལ་གྱི་རྟགས་མཚན་འདི་ ཚར་གཅིག་བཟོ་ཞིནམ་ད་ མེ་གཏང་ཚུགས།|
|`Not` |རྟག་བརྟན་བཀྲམ་སྤེལ་གྱི་རྟགས་མཚན་འདི་ མེ་གཏང་རུང་ ལོག་བཟོ་མི་ཚུགས། |
|`Limited(n)` |ལས་སྣ་གཞན་དག་པ་ཅིག་གི་དོན་ལུ་ མཆོང་རྡོག་བཟོ་ནི་དེ་ ཆ་འཇོག་འབད་ཡོདཔ་ཨིན།|

ཁྱོད་ཀྱིས་ `Infinitely` སྤྱིར་བཏང་དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་དང་ `Once` ཡང་ན་ `Limited(n)` གཞི་བཙུགས་འབད་ཡོད་པའི་མཁོ་ཆས་ཀྱི་དོན་ལུ་ལག་ལེན་འཐབ་དགོ། ཁྱོད་ཀྱིས་འགོ་དང་པ་གི་སྲིད་བྱུས་ཅིག་སྦེ་ `Not` ལག་ལེན་འཐབ་ནི་མི་འོང་། ག་དེམ་ཅིག་སྦེ་ དངུལ་རྐྱང་གི་མཁོ་ཆས་དེ་ ཧེ་མ་ལས་རང་ གཞི་བཙུགས་མ་འབད་བ་ཅིན་མ་གཏོགས་།

## བརྒྱ་ཆ་བསྡོམས་ཀྱི་གནས་ཚད་ {#balance-scope}

`balance_scope_policy` གིས་ བཀྲམ་སྤེལ་འབད་ཐངས་ཚུ་ ག་དེ་སྦེ་ བཏོན་དོ་ཡོདཔ་ཨིན་ནའི་ལམ་སྟོན་འབདཝ་ཨིན།

- `Global`: རྩིས་ཁྲ་དང་རྒྱུ་དངོས་ཚུ་གི་དོན་ལས་ དངུལ་རྐྱང་གི་ཆ་རྐྱང་གཅིག་
- `DataspaceRestricted`: དངུལ་རྐྱང་ཚུ་ གནད་སྡུད་གནས་སྟངས་དང་འཁྲིལ་ཏེ་ བཀྲམ་སྤེལ་འབདཝ་ཨིན།

ཌེ་ཊ་ས་པི་སི་ཚད་འཛིན་ཅན་གྱི་དངུལ་ཀྲམ་ཚུ་ ཕན་ཐོགས་ཡོདཔ་ད་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་དེ་ མང་ཤོས་ར་ Nexus ཌེ་ཀྲ་ས་པིསི་ནང་ལུ་ལག་ལེན་འཐབ་དོ་ཡོད་རུང་ དངུལ་ཀྲམ་དེ་ཚུ་སོ་སོ་སྦེ་བཞག་དགོཔ་ཨིན།

## Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

འ་ནི་ ཀློག་རྐྱང་གི་ཅ་ལ་ཚུ་གིས་ མི་མང་གི་ Taira testnetནང་ལུ་ རྒྱུ་དངོས་ངོ་མ་ཚུ་གི་འགྲེལ་བཤད་ཚུ་བཏོན་དོ་ཡོདཔ་ཨིན།

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

metadata འབག་འོང་མི་འགྲེལ་བཤད་ཚུ་འཚོལ་:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

དཔེ་གསུམ་ཆ་རང་ ཀློག་ཐེངསམ་ཨིན། Taira ལུ་ རྒྱུ་དངོས་ཚུ་བཟོ་བཀོད་འབད་ནི་དང་ མེ་ཤུགས་གཏང་ནི་ ཡང་ན་ བསྒྱུར་བཅོས་འབད་ནིའི་དོན་ལུ་, འབུབ་ཐོག་ལས་དངུལ་སྤྲོད་ཡོད་པའི་རྩིས་ཁྲ་ཅིག་ལག་ལེན་འཐབ་ནི་དང་ [ནང་ལུ་ ཉེན་སྲུང་ཅན་གྱི་རྒྱུན་འགྲུལ་དེ་ SORA Nexus Database](/dz/get-started/sora-nexus-dataspaces.md) ལུ་མཐུད་སྦྲེལ་འབདཝ་ཨིན།

དངུལ་ཕོགས་སྤྲོད་ནིའི་དོན་ལུ་ Taira རྒྱུ་དངོས་གི་དཔེ་དཔེར་ན། འབུབ་ལག་ལེན་འཐབ་མི་ལས་ ཐབ་རྐྱབས། [Testnet བཏོན་ཐོབ། XOR འབད་ནི་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) འདི་བཟུམ་སྦེ་ `taira_faucet_claim.py`, དེ་ལས་འགོ་དང་པ་ ཐབ་ཤིང་གི་རྒྱུ་དངོས་ལུ་ ཞུ་གཏད་འབད་ཞིནམ་ལས་ ལག་ལེན་གྱི་སྣུམ་གྱི་རྒྱུ་དངོས་སྦེ་ལག་ལེན་འཐབ་ནི།

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

འདི་ཡང་བལྟ་:

- [CLI ལམ་སྟོན་](/dz/get-started/operate-iroha-via-cli.md)
- [Rust སྟོན་ཐངས་](/dz/guide/tutorials/rust.md)
- [Python སྟོན་ཐངས་](/dz/guide/tutorials/python.md)
- [JavaScript/TypeScript སྦྱོང་བརྡར་](/dz/guide/tutorials/javascript.md)
- [གནད་སྡུད་ཀྱི་རྣམ་གཞག་](/dz/blockchain/data-model.md)
- [NFTs](/dz/blockchain/nfts.md)
