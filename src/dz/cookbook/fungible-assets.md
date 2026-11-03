---
translation_locale: dz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# འོག་གི་དངུལ་ཁང་ཚུ་ {#fungible-assets}

## གྲུབ་འབྲས་ {#outcome}

ད་ལྟོ་གཡོག་བཀོལ་དོ་ཡོད་པའི་ Taira གི་ རྒྱུ་དངོས་ངེས་ཚིག་ཚུ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་ཅིག་གུ་ བཏོན་སྤེལ་དང་ སྤོ་བཤུད་ མེདཔ་བཟོ་ནི་ དེ་ལས་ ལྷག་ལུས་བདེན་དཔྱད་ཀྱི་ བྱ་རིམ་ཆ་ཚང་ མཇུག་བསྡུ། ཐབས་རིམ་འདི་གིས་ སྔོན་སྦྱོར་མེད་པའི་ ཚད་ལྡན་ Base58 རྒྱུ་དངོས་ངེས་ཚིག་ ID ཚུ་དང་ མངའ་ཁོངས་མེད་པའི་ I105 རྩིས་ཐོ་ ID ཚུ་ དེ་ལས་ གསལ་ཏོག་ཏོ་གི་ འཐུས་སྤྲོད་ཐངས་ ལག་ལེན་འཐབ་ཨིན།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`, `jq`, Node.js 24, Python 3.11 ཡང་ན་ དེ་ལས་གསར་བའི་ཐོན་རིམ་ཅིག་ དེ་ལས་ ད་ལྟོའི་ `iroha` དང་ `kagami` CLIs།
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- འབྲི་ནིའི་ཚོང་འབྲེལ་གྱི་ ལམ་སྟོན་གྱི་དོན་ལུ་ [Iroha འགོ་བཙུགས་](/dz/get-started/launch-iroha.md) ནང་བཟུམ་སྦེ་ `kagami localnet generate --peers 4 --out-dir ./localnet` གིས་བཟོ་མི་ ས་གནས་དྲ་རྒྱ་ཅིག་ `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` ཁ་སྐོང་བརྐྱབ་སྟེ་ དགོཔ་ཨིན། དེ་གིས་ `./localnet/client.toml` དང་ `http://127.0.0.1:8080` གུ་ Torii བྱིནམ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira གི་འགྲེལ་བཤད་ཚུ་ ངོ་རྟགས་མ་བཙུགས་པར་བརྟག་དཔྱད་འབད་དགོ། {#_1-inspect-taira-definitions-without-a-signer}

རྒྱུ་དངོས་ངེས་ཚིག་ཚུ་ནང་ ནང་དོན་མི་མངོན་པའི་ Base58 ID དང་ བཀྲམ་སྟོན་མིང་ བཏོན་སྤེལ་ཆོག་ཚད་ཀྱི་སྲིད་བྱུས་ ཨང་གྲངས་ཚད་འཇལ་ གདམ་ཁ་ཅན་གྱི་མིང་གཞན་ ཇོ་བདག་ གདམ་ཁ་ཅན་གྱི་ བདག་དབང་མངའ་ཁོངས་ ཡང་ན་ གནད་སྡུད་ས་སྟོང་ ལྷག་ལུས་སྲིད་བྱུས་ དེ་ལས་ བསྡོམས་འབོར་ཚུ་ ཚུདཔ་ཨིན། ངེས་གཏན་ལྷག་ལུས་ནང་ཡང་ དེ་འཛིན་མི་རྩིས་ཐོ་དང་ གདམ་ཁ་ཅན་གྱི་ གནད་སྡུད་ས་སྟོང་ཁྱབ་ཚད་ ཚུདཔ་ཨིན།

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript གི་བཟོ་རྣམ་འདི་ `node taira-assets.mjs` ལུ་བཏོན་གཏང་། མི་མང་གི་རྒྱུ་དངོས་ IDs འདི་ Base58 གྱི་གོང་ཚད་ཚུ་རྐྱངམ་གཅིག་ཨིན། ཀློག་ཚུགས་པའི་གོང་ཚད་ དཔེར་ན་ `cookbook_credit#wonderland.universal` འདི་ IDs གི་གྲལ་ལས་གཅིག་ལུ་ གཞི་སྒྲིག་འབད་ཡོད་པའི་མིང་རྟགས་ཨིན།

### 2. ས་གནས་ཀྱི་དབང་འཛིན་དང་ འགྲོ་འགྲུལ་འབད་སའི་ས་གནས་ཚུ་ གྲ་སྒྲིག་འབད། {#_2-prepare-the-local-authority-and-destination}

བཟོ་བཏོན་འབད་ཡོད་པའི་ རིམ་སྒྲིག་ནང་གི་ མི་མང་ལྡེ་མིག་ལས་ ས་གནས་དབང་འཛིན་འདི་ བཏོན་ཞིནམ་ལས་ ལེན་མི་རྩིས་ཐོ་གསརཔ་ཅིག་གི་དོན་ལུ་ ལྡེ་མིག་ཆ་ཅིག་ བཟོ་སྟེ་ རྩིས་ཐོ་དེ་ ཐོ་བཀོད་འབད། སྒེར་གྱི་ལྡེ་མིག་ ག་ནི་ཡང་ གསལ་སྟོན་མི་འབད།

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. ཞབས་ཏོག་ལེན་མི་གི་བདག་དབང་ཡོད་པའི་ ཨང་གྲངས་ངེས་ཚིག་ ལག་ལེན་འཐབ {#_3-use-a-client-owned-numeric-definition}

འགོ་ཐོག་སྡེབ་ཚན་ (genesis) གྱི་ཕྱི་ཁར་ ངེས་ཚིག་ཅིག་ མིང་རྟགས་འགོད་མི་གིས་ བདག་དབང་འཛིན་མི་ `--domain` ཅིག་གི་འོག་ལུ་ ཐོ་བཀོད་འབདཝ་ཨིན། དེ་འབདཝ་ད་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱའི་ ཞབས་ཏོག་ལེན་མི་ལུ་ མངའ་ཁོངས་ ག་ནི་ཡང་ བདག་དབང་མེད། `--asset-definition-id` དང་གཅིག་ཁར་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་ནང་ ངེས་ཚིག་འདི་ ཧེ་མ་ལས་རང་ ཡོདཔ་ཨིན། འགོ་ཐོག་སྡེབ་ཚན་གྱིས་ དེ་ ཚད་འཇལ་ཚད་བཀག་མེད་པར་ ཐོ་བཀོད་འབད་དེ་ ཞབས་ཏོག་ལེན་མི་འདི་ དེ་གི་ཇོ་བདག་ བཟོ་སྟེ་ ཞབས་ཏོག་ལེན་མི་ལུ་ ཚན་ 1,000,000,000 བཏོན་སྤེལ་འབད་ཡོདཔ་ཨིན།

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

ID དེ་ Taira གུ་ ལོག་སྟེ་ ལག་ལེན་མ་འཐབ། མི་མང་དྲ་རྒྱ་གུ་ ཐོ་བཀོད་འབད་ནི་ལུ་ ཚད་ལྡན་ ID གསརཔ་ཅིག་དང་ ཁྱོད་ཀྱི་རྩིས་ཐོ་གིས་ བདག་དབང་འཛིན་མི་ བདག་དབང་མངའ་ཁོངས་ཅིག་ (`ledger asset definition register` ལུ་ `--domain` སྦེ་ བྱིན་མི་) མིང་གཞན་ ག་ཅི་ཨིན་རུང་ དེ་གི་དོན་ལུ་ `CanManageAssetDefinitionAlias` ཆོག་ཐམ་གནང་བ་ཅིག་ དེ་ལས་ འཐུས་སྤྲོད་ནིའི་ མ་དངུལ་ཚུ་ དགོཔ་ཨིན།

### 4. མུན་ཏོང་ཏོ་དང་ སྤོ་བཤུད་ དེ་ལས་འཚིག་ནི་ {#_4-mint-transfer-and-burn}

ཡིག་འབྲུ་བཀོད་ཐོ་བཀོད་ཡོངས་ཀྱིས་དབང་འཛིན་དེ་འཐུས་སྤྲོད་མི་སྦེ་ གསལ་ཏོག་ཏོ་སྦེ་གདམ་ཁ་འབདཝ་ཨིན། CLI གིས་ ངོ་རྟགས་མ་བཙུགས་པའི་ཧེ་མར་ སྟབས་བདེཝ་ཅིག་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་མ་འབད་བའི་ཧེ་མར་ དབྱེ་བ་འདི་བཏོན་འོང་།

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

མེ་བཏང་པའི་ཤུལ་ལས་ འབྱུང་ཁུངས་ལྷག་ལུས་ `1000000064.50` དང་ འགྲོ་ཡུལ་ལྷག་ལུས་ `25.50` དེ་ལས་ བསྡོམས་འབོར་ `1000000090.00` རེ་བ་བསྐྱེད།

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

Taira གུ་ འབྲི་ནིའི་ཚོང་འབྲེལ་རེ་རེ་གི་དོན་ལུ་ `--fee-payer authority` ལག་ལེན་འཐབ། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན། ཐོ་བཀོད་འབད་ནི་ལུ་ ངེས་ཚིག་གི་ `--domain` ལུ་ བདག་དབང་ དགོཔ་ཨིན། མིང་གཞན་ཅིག་ལུ་ཡང་ `CanManageAssetDefinitionAlias` དགོཔ་ཨིན། བཏོན་སྤེལ་འབད་ནི་ལུ་ ངེས་ཚིག་ལུ་ བདག་དབང་ ཡང་ན་ `CanMintAssetWithDefinition` ཡང་ན་ `CanMintAssetToAccount` འཛིན་ནི་ དགོཔ་ཨིན། སྤོ་བཤུད་དང་ མེདཔ་བཟོ་ནི་ལུ་ འབྱུང་ཁུངས་ལྷག་ལུས་གུ་ དབང་ཚད་ དགོཔ་ཨིན། བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གིས་ མ་དངུལ་བཙུགས་ཡོད་པའི་ རྩིས་ཐོ་ཅིག་ རང་བཞིན་གྱིས་ བཏོན་སྤེལ་པ་ མེན།

:::

## བརྟག་དཔྱད་འབད་ {#verify}

རྩི་འདམ་ ལྷག་ལུས གཉིས་ཆ་ར་ལྷག་ དེ་ལས ངེས་ཚིག འདི་ལྷག། ཀཝ་-གནས་སྟངས འདྲི་དཔྱད འདི་ཚུ་གྲུབ་འབྲས་ཀྱི་ཚད་གཞི་ཨིན་; ཕུལ་བ འབྱོར་རྟགས ཁོ་རང་གཅིག་པུ་དེ་མེན།

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

གློག་རིམ་བདེན་བཤད་ཚུ་གིས་ ཨང་གྲངས་གནས་གོང་ཚུ་ གཉིས་ལྡན་ཕོལོཊིང་པོའིནཊི་གནས་གོང་ཚུ་མེན་པར་ གཏན་བཟོས་ཚག་ཚག་སྦེ་ ག་བསྡུར་འབད་དགོཔ་དང་ ངེས་ཚིག་ཨའི་ཌི་དང་ རྩིས་ཐོ་ཡང་ བདེན་དཔྱད་འབད་དགོ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `#` ཡོད་པའི་ཨའི་ཌི་འདི་ མིང་གཞན་ཡང་ན་ ངེས་གཏན་ལྷག་ལུས་ཚིག་ཡིག་ཨིན་ དེ་ཡང་ ཚད་ལྡན་རྒྱུ་དངོས་ངེས་ཚིག་ཨའི་ཌི་མེན། `--definition` དང་ཅིག་ཁར་ Base58 གནས་གོང་གཙང་མ་འདི་ལག་ལེན་འཐབ། ཡང་ན་ `--definition-alias` དང་ཅིག་ཁར་ མཐུད་ཡོད་པའི་མིང་གཞན་ཅིག་སྤྲོད།
- `Scale` འཛོལ་བ་ཚུ་གིས་ ངེས་ཚིག་ཆོག་ཐམ་ལས་ འབོར་ཚད་ཅིག་ལུ་ དཔྱ་རྩིས་ཨང་གྲངས་མངམ་ཡོདཔ་སྦེ་སླབ་ཨིན།
- `Mintability` གིས་མ་བཏུབ་ཟེར་བ་ཅིན་ `Once`, `Not` ཡང་ན་ `Limited(n)` སྲིད་བྱུས་འདི་གིས་ཐིག་ཁྲམ་བཟོ་ནི་མེདཔ་སྦེ་བཟོཝ་ཨིན། ལོ་རྒྱུས་འདི་ལོག་སྟེ་བྲིས་མི་དགོ་། ངེས་ཚིག་དྲིས་ལམ་ནང་ལོག་འོང་མི་ སྲིད་བྱོས་དེ་ལག་ལེན་འཐབ་དགོ།
- རིམ་པ་ 2 གིས་ འགྲོ་ཡུལ་རྩིས་ཐོ་འདི་ གསལ་ཏོག་ཏོ་སྦེ་ ཐོ་བཀོད་འབདཝ་ལས་ རྩིས་ཐོ་ངོས་ལེན་གྱི་སྲིད་བྱུས་འདི་ `ExplicitOnly` ཨིན་རུང་ སྤོ་བཤུད་འདི་ ལཱ་འབདཝ་ཨིན། མིང་འདྲཝ་ཡོད་པའི་ CLI བསྲུང་སྐྱོབ་འདི་གིས་ རྩིས་ཐོ་ ཡང་ན་ ལྷག་ལུས་ ཐོ་བཀོད་མི་འབད། དེ་གིས་ བཀོད་རྒྱ་གཞན་ཅིག་ ཁ་སྐོང་བརྐྱབ་ནིའི་ཚབ་ལུ་ བར་ལམ་ལས་ བཀག་བཞགཔ་ཨིན།
- འཐུས་ཀྱི་བཀག་ཆ་འདི་ སྤྱིར་བཏང་བཀོད་རྒྱ་ མཐར་འཁྱོལ་མ་བྱུང་པའི་ཧེ་མ་ བྱུངམ་ཨིན། འཐུས་སྤྲོད་མི་ གདམ་ཁ་རྐྱབ་ཞིནམ་ལས་ CLI གི་ འཐུས་ཀྱི་གོང་ཚད་བཀོད་པ་ནང་ འཐུས་རྒྱུ་དངོས་དང་ མཐོ་ཤོས་ཚད་ ཞིབ་དཔྱད་འབད་དེ་ ལྷག་ལུས་དེ་ བདེན་དཔྱད་འབད།
- ས་གནས་དྲ་རྒྱ་གཅིག་པ་གུ་ ལོག་གཡོག་བཀོལ་བ་ཅིན་ ཧེ་མའི་ལྷག་ལུས་ཚུ་ལས་ འགོ་བཙུགསཔ་ཨིན། དེ་ལས་ `kagami keys` གིས་ ཧེ་མ་ལས་ཡོད་པའི་ `./cookbook-recipient` ངོས་ལེན་མི་འབད། བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་གསརཔ་ཅིག་ འགོ་བཙུགས་ཞིནམ་ལས་ སྣོད་ཐོ་དེ་ བཏོན་གཏང་། ཡང་ན་ གནས་གོང་ཆ་ཚང་ཚུ་གི་ཚབ་ལུ་ ལྷག་ལུས་ཀྱི་འགྱུར་བ་ཚུ་ ག་བསྡུར་འབད། Base58 ID གི་ཚབ་ལུ་ བཟོ་རྣམ་མ་ཚང་བའི་ གང་བྱུང་ཡིག་རྒྱུན་ཅིག་ ནམ་ཡང་ མ་བཙུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རྒྱུ་དངོས་ཚུ་གི་ཚེ་རིང་འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust རྒྱུ་དངོས་བཟོ་སྐྲུན་གྱི་དཔེ་བསྡུར་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
- [JavaScript དང་ TypeScript](/dz/guide/tutorials/javascript.md)
