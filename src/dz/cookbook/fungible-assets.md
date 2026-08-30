---
translation_locale: dz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# འོག་གི་དངུལ་ཁང་ཚུ་ {#fungible-assets}

## གྲུབ་འབྲས་ {#outcome}

Taira རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་ཐད་ཀར་དུ་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ ཐོ་བཀོད་, མིན་ཏ་, བསྒྱུར་བཅོས་, འབོར་དང་ balans-verification flow མཇུག་བསྡུ་བཅུག། བཏང་ཐངས་འདི་ ཀ་ནོ་ནི་ཀཱོལ་མེད་པའི་ Base58 རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ IDs དང་ Domain-qualified aliases, domainless I105 account IDs དེ་ལས་ explicit fee payment ཚུ་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་དེ་གི་ཤུལ་ལས་, Node.js 24,དང་ current `iroha` CLI
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- ཡིག་འབྲུའི་ཐོག་ལས་འགྱོ་ནིའི་དོན་ལུ་ [Lunch Iroha](/dz/get-started/launch-iroha.md)ལས་ ས་གནས་ཀྱི་དྲ་རྒྱ་ཅིག་བཟོ་ཡོདཔ་ད་ `./localnet/client.toml` དང་ Torii ལུ་ `http://127.0.0.1:8080` འབད་ནི་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira གི་འགྲེལ་བཤད་ཚུ་ ངོ་རྟགས་མ་བཙུགས་པར་བརྟག་དཔྱད་འབད་དགོ། {#_1-inspect-taira-definitions-without-a-signer}

རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ནང་ལུ་ གསལ་ཏོག་ཏོ་སྦེ་མ་མཐོང་མི་ Base58 ID སྟོན་མཚན་དང་ mintability སྲིད་བྱུས་ དེ་ལས་གྲངས་རྩིས་ཐིག་ཚད་དང་ optional alias དང་ owner དང་ total quantity ཚུ་ཡོདཔ་ཨིན། དངོས་གྲུབ་ཅན་གྱི་ཆ་སྙོམས་ནང་ཡང་དེའི་བདག་འཛིན་པའི་རྩིས་ཁྲ་དང་ optional dataspace གི་ཁྱབ་ཚད་ཚུ་ཚུགསཔ།

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

ས་གནས་ཀྱི་དབང་འཛིན་དེ་ བཟོ་སྐྲུན་འབད་ཡོད་པའི་ གཞི་སྒྲིག་ནང་ཡོད་མི་ མི་མང་གི་ལྡེ་མིག་ནང་ལས་བཏོན་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་མི་རྩིས་གཞན་ཅིག་ལུ་ སྤྲོད་མི་སྦེ་ གདམ་ཁ་རྐྱབས་ཨིན། སྒེར་གྱི་ལྡེ་མིག་ཚུ་ ཨེབ་གཏང་མི་ཚུགས།

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

ས་གནས་ཀྱི་རྐྱངམ་ཅིག་ཨིན་ ID གཞི་རྟེན་ 58 གི་རྒྱུ་དངོས་གསལ་སྒྲགས་ཀྱི་ཁ་བྱང་ངོ་མ་ཨིན། མིང་མིང་འདི་ མི་གིས་ཀློག་བཏུབ་པའི་ `domain.dataspace` ཚད་འཇལ་ཐངས་ `2` ཨང་གྲངས་གཉིས་ཆ་ར་ལུ་ ཆ་མེད་གཏང་ཚུགསཔ་ཨིན། `--mint-once` གཞི་སྒྲིག་འབད་མི་འདི་ བཞག་ནི་ `Infinitely` སྲིད་བྱུས་ཚུ་

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

ཁྱོད་ཀྱིས་ ID འདི་ Taira ལུ་ ལོག་ལག་ལེན་འཐབ་ནི་མི་འོང་། མི་མང་གི་དྲ་ལམ་ནང་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ ཀ་ནོ་ནི་ཀ་གསར་པ་ཅིག་ དགོཔ་ཨིན། ID ཁྱོད་ཀྱི་ཞུ་ཡིག་ལུ་ བགོ་བཀྲམ་འབད་ཡོད་པའི་ ཌོ་เมན་/ཨའི་སིའི་མིང་། དངུལ་ཕོགས་དངུལ་རྐྱེན། དེ་ལས་ དུས་རྒྱུན་གྱི་ རྒྱུ་དངོས་ ཐོ་བཀོད་ཀྱི་ཆོག་ཐབས།

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

མེ་འཚིག་པའི་ཤུལ་ལུ་ གཞི་རྟེན་མཐུན་རྐྱེན་ཚུ་ བལྟ་དགོཔ་ཨིན། `64.50`, འོང་སའི་ས་ཆ་ཚུ་ `25.50`, གྱངས་ཁ་ཡོངས་བསྡོམས་ `90.00`.

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

Taira ལུ་ faucet-derived `taira.tx-metadata.json` བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ཡིག་སྣོད་རེ་རེའི་དོན་ལུ་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། ཐོ་བཀོད་དང་ minting སྒྲིག་འཇུག་དེ་ལུ་ active validator གི་ཆོག་ཐམ་ དགོཔ་ཨིན་; གནས་སྤོ་དང་ burn འདི་ source balance གྱི་དབང་ཤུགས་ དགོཔ་ཨིན། faucet དངུལ་རྐྱབས་རྩིས་འདི་ རང་བཞིན་གྱིས་ emitterམེན།

:::

## བརྟག་དཔྱད་འབད་ {#verify}

གྲོས་བསྡུར་གཉིས་ཆ་ར་ལུ་ བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ ངེས་ཚིག་འདི་ལྷག་སྟེ་ལྷབ་དགོ། གཞུང་གི་རྒྱབ་སྐྱོར་གྱི་དྲི་ཚུ་འདི་ གྲུབ་འབྲས་ཀྱི་རྟགས་མཚན་ཨིན། ངོ་སྤྲོད་ཡི་གུ་དེ་ རང་གིས་རང་ལུ་མ་ཡིན།

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

ལག་ལེན་གྱི་བཀོད་རྒྱ་ནང་ ཨང་གྲངས་ཀྱི་གོང་ཚད་ཚུ་ fixed-point decimals སྦེ་བསྡུར་འབད་དགོཔ་ཨིན་ དེ་ལས་ binary floating-point values ཚུ་མེན། དེ་མ་ཚད་ ID གི་འགྲེལ་བཤད་དང་རྩིས་ཁྲ་ཚུ་ཡང་ བརྟག་ཞིབ་འབད་དགོཔ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- གཅིག་ ID ནང་འཁོད་ནང་ལུ་ `#` འོག་གི་མིང་ ཡང་ན་ དངོས་གྲུབ་ཅན་གྱི་རྒྱ་ཁྱོན་ངོ་མ་ཨིན་མི་ ཅ་ཆས་ཀྱི་འགྲེལ་བཤད་འདི་ ཀན་ནི་ཀཱན་གྱི་མ་ཨིན། ID. Base58 གནས་གོང་འདི་ ལག་ལེན་འཐབ་ནི་ `--definition`, ཡང་ན་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་མིང་འདི་ `--definition-alias`.
- `Scale` གྱི་འཛོལ་བ་འདི་ དངོས་པོ་ཅིག་གིས་ ངེས་ཚིག་ནང་བཀོད་ཡོད་པའི་ ཨང་གྲངས་ལས་ལྷག་པའི་ ཨང་གྲངས་ཚུ་ཡོད་མི་འདི་ཨིན།
- `Mintability` གིས་མ་བཏུབ་ཟེར་བ་ཅིན་ `Once`, `Not` ཡང་ན་ `Limited(n)` སྲིད་བྱུས་འདི་གིས་ཐིག་ཁྲམ་བཟོ་ནི་མེདཔ་སྦེ་བཟོཝ་ཨིན། ལོ་རྒྱུས་འདི་ལོག་སྟེ་བྲིས་མི་དགོ་། ངེས་ཚིག་དྲིས་ལམ་ནང་ལོག་འོང་མི་ སྲིད་བྱོས་དེ་ལག་ལེན་འཐབ་དགོ།
- གྲལ་ཐིག་༢ གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ འགྲོ་འགྲུལ་གྱི་རྩིས་ཁྲ་ གདམ་ཁ་རྐྱབས་ཨིན། ག་དེམ་ཅིག་སྦེ་ རྒྱུ་དངོས་གི་སྣེ་ལེན་འདི་ `ExplicitOnly` ཨིནམ་ད་ འགྲོ་འགྲུལ་ཀྱི་ལྷག་ལུས་དེ་ ངོས་འཛིན་ཅན་གྱི་ཡིག་ཚང་གི་ཐོག་ལས་ བསྡུ་སྒྲིག་འབད། ལས་འགུལ་གྱི་མིང་འདི་ CLI བསྲུང་མི་གིས་རྩིས་ཁྲ་དང་ གཏན་འཁེལ་ཡིག་ཆ་ཚུ་ ཐོ་བཀོད་མ་འབད་བར་བཞག་དོ་ཡོདཔ་ད་ ཁོ་གིས་བཀོད་རྒྱ་གཞན་ཅིག་ ཁ་སྐོང་རྐྱབ་པའི་ཚབ་ལུ་ བཀག་གཏང་དོ་ཡོདཔ་ཨིན།
- ཟད་འགྲོ་བཏང་མ་དགོ་པའི་འཐུས་འདི་ སྤྱིར་བཏང་བཀོད་རྒྱ་ལུ་ གྲུབ་འབྲས་འབྱུང་བའི་ཧེ་མར་ འབྱུང་དོ་ཡོདཔ་ཨིན། སྐྱིན་འགྲུལ་སྤྲོད་མི་དེ་ གདམ་ཁ་རྐྱབས་ནི་ དེ་ལས་ འབྲེལ་བ་ཡོད་པའི་འཐུས་གི་རྩིས་ཐོ་ཚུ་ ལག་ལེན་འཐབ་སྟེ་ བསྐྱར་ཞིབ་འབད་ཚུགས།
- གནས་སྐབས་ཀྱི་གནས་སྟངས་འདི་ ཧེ་མ་ལས་ འགོ་བཙུགས་ཡོདཔ་ཨིན་པ་ཅིན་ localnet གསར་བཙུགས་འབད་ཞིནམ་ལས་ ཡང་ན་ གནས་སྟངས་དེ་ འཕྲོ་མཐུད་སྒྲིག་གཏང་དགོ། རྩ་འགེངས་ཏེ་ Base58 ID གི་ཚབ་ལུ་ སྟབས་མ་བདེཝ་ཅིག་རྩ་བ་རང་མ་བཟོ།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རྒྱུ་དངོས་ཚུ་གི་ཚེ་རིང་འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust རྒྱུ་དངོས་བཟོ་སྐྲུན་གྱི་དཔེ་བསྡུར་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [བརྡ་བཀོད་ཚུ་](/dz/blockchain/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
- [JavaScript དང་ TypeScript](/dz/guide/tutorials/javascript.md)
