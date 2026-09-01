---
translation_locale: dz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: human-reviewed
---
# འོག་གི་དངུལ་ཁང་ཚུ་ {#fungible-assets}

## གྲུབ་འབྲས་ {#outcome}

Taira རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་ཐད་ཀར་དུ་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ ཐོ་བཀོད་, མིན་ཏ་, བསྒྱུར་བཅོས་, འབོར་དང་ ལྷག་དངུལ་བདེན་དཔྱད བྱ་རིམ མཇུག་བསྡུ་བཅུག། བཏང་ཐངས་འདི་ ཀ་ནོ་ནི་ཀཱོལ་མེད་པའི་ Base58 རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ IDs དང་ མངའ་ཁོངས་-ཤེས་ཚད་ཅན མིང་གཞན, མངའ་ཁོངས་མེད I105 རྩིས་ཐོ IDs དེ་ལས་ གསལ་པོ གླ་ཡོན དངུལ༌ཕོགས ཚུ་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་དེ་གི་ཤུལ་ལས་, Node.js 24,དང་ ད་ལྟོ་ `iroha` CLI
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- ཡིག་འབྲུའི་ཐོག་ལས་འགྱོ་ནིའི་དོན་ལུ་ [འགོ་བཙུགས Iroha](/dz/get-started/launch-iroha.md)ལས་ ས་གནས་ཀྱི་དྲ་རྒྱ་ཅིག་བཟོ་ཡོདཔ་ད་ `./localnet/client.toml` དང་ Torii ལུ་ `http://127.0.0.1:8080` འབད་ནི་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira གི་འགྲེལ་བཤད་ཚུ་ ངོ་རྟགས་མ་བཙུགས་པར་བརྟག་དཔྱད་འབད་དགོ། {#_1-inspect-taira-definitions-without-a-signer}

རྒྱུ་དངོས་ངེས་ཚིག་ཚུ་གིས་ མཐོང་མ་ཚུགས་པའི་ Base58 ID དང་ བཀྲམ་སྟོན་མིང་ མིན་ཊི་བི་ལི་ཊི་སྲིད་བྱུས་ ཨང་གྲངས་འཇལ་ཚད་ གདམ་ཁ་ཅན་གྱི་མིང་གཞན་ ཇོ་བདག་ དེ་ལས་ བསྡོམས་འབོར་ཚུ་འབག་འོང་། ངེས་གཏན་ལྷག་ལུས་འདི་ནང་ དེ་གི་བདག་པོ་རྩིས་ཐོ་དང་ གདམ་ཁའི་གནད་སྡུད་ས་སྟོང་གི་གོ་སྐབས་ཡང་ཚུདཔ་ཨིན།

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

བཟོ་བཏོན་འབད་ཡོད་པའི་རིམ་སྒྲིག་ནང་ མི་མང་ལྡེ་མིག་ལས་ ས་གནས་ཀྱི་དབང་འཛིན་འདི་ བཏོན་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་རྩིས་ཐོ་གཞན་མི་ཅིག་ ཐོབ་མི་སྦེ་ གདམ་ཁ་རྐྱབས། སྒེར་དོན་ལྡེ་མིག་དཔར་བསྐྲུན་མ་འབད་བས།

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### ཨང་གྲངས་ཀྱི་འགྲེལ་བཤད་བཀོད་ཐོ་བཀོད་འབདཝ་ཨིན། {#_3-register-a-numeric-definition}

འ་ནི་ཉེ་གནས་རྐྱངམ་ཅིག་གི་ཨའི་ཌི་འདི་ ནུས་ཅན་སྔོན་སྒྲིག་མེད་པའི་ Base58 རྒྱུ་དངོས་-ངེས་ཚིག་ཁ་བྱང་ཨིན། མིང་གཞན་འདི་གིས་ མི་གིས་ལྷག་ཚུགས་པའི་ `domain.dataspace` པར་བརྙན་འདི་བཀྲམ་སྤེལ་འབདཝ་ཨིན། ཚད་འཇལ་ `2` གིས་དཔྱ་རྩིས་ཨང་གྲངས་གཉིས་གནང་བ་བྱིནམ་ཨིན། `--mint-once` བཏོན་བཏང་མི་འདི་གིས་ སྔོན་སྒྲིག་ `Infinitely` སྲིད་བྱུས་འདི་བཞགཔ་ཨིན།

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

ཁྱོད་ཀྱིས་ ID འདི་ Taira ལུ་ ལོག་ལག་ལེན་འཐབ་ནི་མི་འོང་། མི་མང་གི་དྲ་ལམ་ནང་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ ཀ་ནོ་ནི་ཀ་གསར་པ་ཅིག་ དགོཔ་ཨིན། ID ཁྱོད་ཀྱི་ཞུ་ཡིག་ལུ་ བགོ་བཀྲམ་འབད་ཡོད་པའི་ ཌོ་མེན་/ཨའི་སིའི་མིང་། དངུལ་ཕོགས་དངུལ་རྐྱེན། དེ་ལས་ དུས་རྒྱུན་གྱི་ རྒྱུ་དངོས་ ཐོ་བཀོད་ཀྱི་ཆོག་ཐབས།

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

མེ་བཏང་པའི་ཤུལ་ལས་ འབྱུང་ཁུངས་ལྷག་ལུས་ `64.50` དང་ འགྲོ་ཡུལ་ལྷག་ལུས་ `25.50` དེ་ལས་ བསྡོམས་འབོར་ `90.00` རེ་བ་བསྐྱེད།

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

Taira ལུ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག-བཏོན་ཡོད `taira.tx-metadata.json` བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ཡིག་སྣོད་རེ་རེའི་དོན་ལུ་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། ཐོ་བཀོད་དང་ བཏོན་ནི སྒྲིག་འཇུག་དེ་ལུ་ ཤུགས་ལྡན བདེན་དཔྱད་པ གི་ཆོག་ཐམ་ དགོཔ་ཨིན་; གནས་སྤོ་དང་ མེདཔ་བཟོ འདི་ འབྱུང་ཁུངས ལྷག་ལུས གྱི་དབང་ཤུགས་ དགོཔ་ཨིན། བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག དངུལ་རྐྱབས་རྩིས་འདི་ རང་བཞིན་གྱིས་ གཏོང་བྱེདམེན།

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
- གྲལ་ཐིག་༢ གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ འགྲོ་འགྲུལ་གྱི་རྩིས་ཐོ་ གདམ་ཁ་རྐྱབས་ཨིན། ག་དེམ་ཅིག་སྦེ་ རྒྱུ་དངོས་གི་སྣེ་ལེན་འདི་ `ExplicitOnly` ཨིནམ་ད་ འགྲོ་འགྲུལ་ཀྱི་ལྷག་ལུས་དེ་ ངོས་འཛིན་ཅན་གྱི་ཡིག་ཚང་གི་ཐོག་ལས་ བསྡུ་སྒྲིག་འབད། ལས་འགུལ་གྱི་མིང་འདི་ CLI བསྲུང་མི་གིས་རྩིས་ཐོ་དང་ གཏན་འཁེལ་ཡིག་ཆ་ཚུ་ ཐོ་བཀོད་མ་འབད་བར་བཞག་དོ་ཡོདཔ་ད་ ཁོ་གིས་བཀོད་རྒྱ་གཞན་ཅིག་ ཁ་སྐོང་རྐྱབ་པའི་ཚབ་ལུ་ བཀག་གཏང་དོ་ཡོདཔ་ཨིན།
- སྤྱིར་བཏང་བཀོད་རྒྱ་མཐར་འཁྱོལ་མ་བྱུང་པའི་ཧེ་མ་ འཐུས་བཀག་ཆ་འབདཝ་ཨིན། དངུལ་སྤྲོད་མི་འདི་སེལ་འཐུ་འབད་ཞིནམ་ལས་ ཡོངས་འབྲེལ་གྱི་འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་ལག་ལེན་འཐབ་ཞིནམ་ལས་ དེ་གི་ལྷག་ལུས་བདེན་དཔྱད་འབད།
- གཏན་བཟོས་ས་གནས་ཀྱི་ངེས་ཚིག་འདི་ ཧེ་མའི་གཡོག་བཀོལ་ལས་ ཧེ་མ་ལས་རང་ཡོདཔ་ཨིན་པ་ཅིན་ གསརཔ་བཟོ་ཡོད་པའི་ས་གནས་ཀྱི་ཡོངས་འབྲེལ་འགོ་བཙུགས་ ཡང་ན་ ད་ལྟོ་ཡོད་པའི་གནས་སྟངས་དང་གཅིག་ཁར་འཕྲོ་མཐུད། གཞི་རྟེན་༥༨ ཨའི་ཌི་གི་དོན་ལུ་ རིམ་སྒྲིག་མ་བཏུབ་པའི་ གང་བྱུང་ཡིག་རྒྱུན་ཅིག་ ནམ་ཡང་ཚབ་མ་བཙུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རྒྱུ་དངོས་ཚུ་གི་ཚེ་རིང་འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust རྒྱུ་དངོས་བཟོ་སྐྲུན་གྱི་དཔེ་བསྡུར་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
- [JavaScript དང་ TypeScript](/dz/guide/tutorials/javascript.md)
