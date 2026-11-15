---
translation_locale: dz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: human-reviewed+reviewed-delta
---
# ལག་ལེན་འཐབ་ནི་ Iroha 3 བརྒྱུད་ལས་ CLI {#operate-iroha-3-via-cli}

`iroha` ཌའི་ལོག་འདི་ Iroha 3 གི་བཀའ་ཤོག་གི་གྲལ་ཐིག་ ཞབས་ཏོག་ལེན་མིཨིན། འདི་ལག་ལེན་འཐབ་སྟེ་ མདོ་སྡེའི་གནས་སྟངས་འཚོལ་ནིའི་དོན་ལུ་དང་ བྱ་སྟབས་མ་བདེཝ་ཚུ་བཙུགས་ནི་དང་ ལས་འཛིན་གྱི་མཐའ་མཚམས་ཚུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་།

## ༡ སྔོན་འགོག་གི་གནས་སྟངས་ཚུ་ {#_1-prerequisites}

ཡིག་ཆ་ནང་བཀོད་པའི་འབྱུང་ཁུངས་ཐོན་རིམ་ཀྱི་ Iroha འབྱུང་ཁུངས་འདྲ་བཤུས་ལས་ མཐུད་གྲོགས་བཞི་ཡོད་པའི་ ཉེ་གནས་ཡོངས་འབྲེལ་ཅིག་ བཟོ་སྟེ་ འགོ་བཙུགས་:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

འོག་གི་དཔེ་ཚུ་གིས་ དེ་གིས་བཟོ་བཏོན་འབད་མི་ མཁོ་མངགས་པའི་རིམ་སྒྲིག་ `./localnet/client.toml` ལག་ལེན་འཐབ་ཨིན།

## གཞི་རྟེན་ CLI གཞི་སྒྲིག་ {#_2-basic-cli-setup}

མཐོ་རིམ་གྲོགས་རམ་སྟོན།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI འདི་ མཐོ་ཤོས་གནས་ཚད་ཀྱི་བཀའ་བཀོད་སྡེ་ཚན་ཚུ་ནང་གོ་སྒྲིག་འབདཝ་ཨིན།

- རྩིས་ཐོའི་ཀློག་ལེན་དང་འགྱུར་བ་ཚུའི་དོན་ལུ་ `account`།
- མཉམ་སྤྱོད་ཚགས་མ་དང་ཤོག་ལེབ་དབྱེ་བ་ཅན་གྱི་འཚོལ་ཞིབ་གནད་སྡུད་རྒྱུན་དོན་ལུ་ `explorer`།
- ཚོང་འབྲེལ་གནས་སྟངས་དང་ཚོང་འབྲེལ་ལས་རོགས་ཀྱི་དོན་ལུ་ `tx`།
- `ledger` རྩིས་ཐོ་གུ་ལྷག་ནི་དང་འབྲི་ནིའི་དོན་ལུ་
- འགོ་སློང་ཀློག་ལེན་ འབྲི་བཀོད་དང་ལག་བསྟར་དོན་ལུ་ `trigger`།
- བཀོལ་སྤྱོད་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ `ops`
- `app`གི་དོན་ལུ་ ཕན་ཐོགས་ཅན་གྱི་ལག་ལེན་ API ཆ་རོགས་འབད་མི་ཚུ་
- གན་རྒྱ་འབོ་བ་ མཐོང་རྣམ་ དང་ཉེ་གནས་སྐྱོན་སེལ་དོན་ལུ་ `contract`། `kagami contract deploy` ཡང་ན་ `musubi deploy` གིས་བཀྲམ་སྤེལ་འབད།
- བརྟག་དཔྱད་དང་གོང་འཕེལ་གཏང་མིའི་མཐུན་རྐྱེན་ཚུ་གི་དོན་ལུ་ `tools`
- གནད་སྡུད་ས་སྟོང་ངེས་ཚིག་གི་འཆར་གཞི་བཟོ་ནི་ སྦྱོར་ནི་དང་བལྟ་ཞིབ་དོན་ལུ་ `dataspace`།
- Taira བརྟག་དཔྱད་དང་རྩིས་ཐོ་འགོ་བཙུགས་ཐོ་བཀོད་དོན་ལུ་ `taira`།
- དྲ་མེད་ཨང་བཀོད་པ་ སྙན་ཞུ་དང་བརྟག་དཔྱད་དོན་ལུ་ `offline`།
- Soracloud གློག་རིམ་མ་ལག་གི་ལས་རོགས་ཚུའི་དོན་ལུ་ `soracloud`།
- SORA སྡེབ་ཐག་ཕན་ཚུན་གནད་སྤྱོད་ཀྱི་ཀློག་ལེན་ སྤོ་བཤུད་དང་བདེན་ཁུངས་དོན་ལུ་ `sccp`།

ཚོང་འབྲེལ་ཕུལ་མི་བརྡ་བཀོད་རེ་རེ་ལུ་ `--fee-payer authority` བཟུམ་གྱི་ གླ་ཡོན་སྤྲོད་མི་གསལ་ཏོག་ཏོ་བཀོད་དགོ། CLI གིས་མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་གླ་ཡོན་ཏག་ཏག་སྟོནམ་ཨིན།

མི་གིས་ལྷག་བཏུབ་པའི་བཀོལ་སྤྱོད་པ་ཨའུཊི་པུཊི་གི་དོན་ལུ་ `--output-format text` དང་ རང་བཞིན་ཐབས་ལམ་དམ་དམ་གྱི་དོན་ལུ་ `--machine` ལག་ལེན་འཐབ།

## མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་ Taira བརྟག་ཞིབ་འབད་ {#_3-try-the-public-taira-testnet}

ཁྱོད་ཀྱིས་ ས་གནས་ཀྱི་ འདྲ་མཉམ་ཅིག་མ་ལག་ལེན་འཐབ་པའི་ཧེ་མར་ ཀློག་རྐྱངམ་གཅིག་ལུ་ Taira བརྟག་ཞིབ་འབད་ཚུགས། འ་ནི་བཀའ་རྒྱ་ཚུ་གིས་ མི་མང་གི་ Torii JSON ལྕགས་ལམ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ བརྟག་དཔྱད་དྲ་རྒྱ XOR མ་ལག་ལེན་འཐབ་ཨིན།

Taira གནས་གོང་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

ངོ་སྤྲོད་བདེན་དཔྱད་མ་འབད་བའི་ ལྷག་མི་ལུ་ མཐོང་ཚུགས་པའི་ མངའ་ཁོངས་ཚུའི་ཐོ་སྟོན་:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

རྒྱུ་དངོས་ངེས་ཚིག་དག་པ་ཅིག་དང་ དེ་ཚུ་གི་ད་ལྟོའི་བཀྲམ་སྤེལ་ཐོ་བཀོད་འབད།

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

ཁྱོད་ཀྱིས་ད་ལྟོའི་ `iroha` ཌའི་ལོག་ལག་ལེན་འཐབ་པ་ཅིན་, Taira དོ་དཔྱད་གྲོགས་རམ་འདི་ལག་ལེན་འཐབ་དགོ།

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

མིང་རྟགས་ཅན་གྱི་བརྡ་བཀོད་ཚུ་བརྟག་ཞིབ་འབད་ནི་ལུ་གྲ་སྒྲིག་ཡོད་པའི་སྐབས་རྐྱངམ་ཅིག་ `taira.client.toml` བཟོ། རིམ་སྒྲིག་ བརྟག་དཔྱད་དངུལ་བྱིན་པའི་ཞབས་ཏོག་ དང་འགོ་ཐོག་བརྟག་ཞིབ་ཀྱི་ལས་རིམ་དོན་ལུ་ [SORA Nexus གནད་སྡུད་ས་སྟོང་ཚུ་ལུ་མཐུད་ནི](/dz/get-started/sora-nexus-dataspaces.md) ལུ་བལྟ། རྩིས་ཐོ་ནང་བརྟག་དཔྱད་དངུལ་བྱིན་པའི་ཞབས་ཏོག་ལས་གླ་ཡོན་རྒྱུ་དངོས་མ་བཙུགས་ཚུན་ Taira གུ་འབྲི་བཀོད་བརྡ་བཀོད་གཡོག་མ་བཀོལ།

Taira CLI གི་གླ་ཡོན་སྤྲོད་དགོ་པའི་དཔེ་ག་ཅི་ཨིན་རུང་ [Taira གུ་བརྟག་དཔྱད་དྲ་ལམ་གྱི་ XOR ལེན་ནི](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ནང་གི་གྲ་སྒྲིག་འབད་པའི་བརྟག་དཔྱད་དངུལ་བྱིན་པའི་ལས་རིམ་ཐོག་ལས་མིང་རྟགས་བཀོད་མི་ལུ་མ་དངུལ་བཙུགས། དེ་ལས་ལྷག་ལུས་ཞིབ་དཔྱད་འབད།

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

བརྟག་དཔྱད་དངུལ་བྱིན་པའི་ལམ་ཅིག་གིས་ `502` ལོག་བྱིན་ན་ བསྒུག་སྟེ་ལོག་འབད་བལྟ། འདི་མི་མང་བརྟག་དཔྱད་དྲ་ལམ་གྱི་ཐོབ་ཚུགས་དཀའ་ངལ་ཨིན། རྩིས་ཐོའི་ལྡེ་མིག་ལོག་བཟོ་དགོ་པའི་བརྡ་མེན།

ལྷག་ལུས་མཐོང་ཚུགས་པའི་ཤུལ་ལས་ `--fee-payer authority` དང་མཉམ་དུ་འབྲི་བཀོད་ཕུལ། CLI གིས་མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་གླ་ཡོན་རྒྱུ་དངོས་ནང་གླ་ཡོན་ཏག་ཏག་སྟོནམ་ཨིན།

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. གཞི་རྟེན་རྩིས་དེབ་བཀའ་རྒྱ་ཚུ་ {#_4-basic-ledger-commands}

མངའ་ཁོངས་ཆ་མཉམ་ཐོ་བཀོད་འབད།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

སྤྱིར་བཏང་ས་ཁོངས་བཟོ་སྐྲུན་ནང་ལུ་ གསལ་བསྒྲགས་ཀྱི་མིང་གི་འཆར་གཞི་བཟོ། `ledger domain` བཀའ་རྒྱ་འདི་ནང་ `register` གི་འོག་བཀའ་རྒྱ་མེད་ཨིན། ཁྱོད་ཀྱིས་ `docs.universal`གི་དོན་ལུ་གསང་བ་མེད་པའི་ `AliasSetupPlanRequestV1` དམིགས་གཏད་ཅིག་ གྲ་སྒྲིག་འབད་ཞིནམ་ལས་ ཁྱོད་ཀྱི་ SDK ཡང་ན་ གློག་ཐག་ར་ཀར་གྱི་ ཞབས་ཏོག་དང་བསྟུན་ཏེ་ འཆར་གཞི་བཙུགས་ཏེ་ ལག་ལེན་འཐབ་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

དམིགས་དོན་གྱིས་ གནད་སྡུད་ས་སྟོང་ངོ་རྟགས་ ཚད་ལྡན་ཇོ་བདག་རྩིས་ཐོ་ གླ་སྤྱོད་དུས་ཡུན་ དང་ད་ལྟོའི་གོང་ཚད་སྲུང་སྐྱོབ་ཚུ་གཏན་འཁེལ་བཟོཝ་ཨིན། འཆར་གཞི་བཟོ་མི་གིས་དངོས་སྤྱོད་གནས་སྟངས་བདེན་དཔྱད་འབད་དེ་ ཕུལ་དགོ་པའི་ཆ་ཚང་ལག་བསྟར་ `EnsureAlias` འཆར་གཞི་ཏག་ཏག་ལོག་བྱིནམ་ཨིན། དྲ་ལམ་གཞན་ཅིག་ལས་སྲུང་སྐྱོབ་གནས་གོང་ཚུ་ལག་ཐོག་འདྲ་བཤུས་མ་འབད།

པིང་ཚོང་འབྲེལ་འཇམ་ཏོང་ཏོ་ཅིག་གཏང་།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

འཕྲལ་གྱི་བཀག་ཆ་ཅིག་ལྷག་ནི་ཡང་ན་བཀག་ཆ་བྱུང་ལས་ཚུ་ལུ་མཁོ་མངགས་འབད།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## ལས་འཛིན་གྱི་བཀའ་རྒྱ་ཚུ་ {#_5-operator-commands}

མོས་མཐུན་ལག་ལེན་པའི་བརྡ་བཀོད་ཚུ་ལུ་ ཆོག་ཐོ་ནང་ཡོད་པའི་ལག་བསྟར་དུས་ཀྱི་ལྡེ་མིག་དགོ། འདི་ `client.toml` ནང་མ་བཙུགས་པར་ ཇོ་བདག་རྐྱངམ་ཅིག་གིས་སྤྱོད་ཚུགས་པའི་ཡིག་སྣོད་འདི་དེའི་ལམ་ཆ་ཚང་གིས་སྤྲོད།

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

དབང་ཚད་མེད་པའི་བང་རིམ་དང་ མདོང་ལམ་ བཙག་འཐུ་ དེ་ལས་ ལམ་ཐིག་བརྟག་དཔྱད།

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

གཏན་འཁེལ་མོས་མཐུན་རྒྱུན་ལམ་ཚུ་དང་ མཐུད་གནས་འདིའི་ལག་བསྟར་ཚན་པའི་གནས་སྟངས།

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

རིམ་སྒྲིག་ཐོག་མོས་མཐུན་ཚད་གཞི།

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## དྲུག་པ་: ད་ག་ཏེ་འགྱོ་ནི་ཨིན་ན་ {#_6-where-to-go-next}

- [SDK སྦྱོང་བརྡར་](/dz/guide/tutorials/)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
- [Iroha ཌའི་ལོག་ཚུ་དང་གཅིག་ཁར་ལཱ་འབད་ ](/dz/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

འབྱུང་ཁུངས་ཕྱིར་བཏོན་ལས་ Markdown རོགས་རམ་གྱི་གནས་སྟངས་འདྲ་བཤུས་ཆ་ཚང་པར་སྟོན་འབད་ནི་ལུ་ འདི་གཡོག་བཀོལ།

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
