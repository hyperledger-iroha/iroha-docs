---
translation_locale: dz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: human-reviewed
---
# ལག་ལེན་འཐབ་ནི་ Iroha 3 བརྒྱུད་ལས་ CLI {#operate-iroha-3-via-cli}

`iroha` ཌའི་ལོག་འདི་ Iroha 3 གི་བཀའ་ཤོག་གི་གྲལ་ཐིག་ ཞབས་ཏོག་ལེན་མིཨིན། འདི་ལག་ལེན་འཐབ་སྟེ་ མདོ་སྡེའི་གནས་སྟངས་འཚོལ་ནིའི་དོན་ལུ་དང་ བྱ་སྟབས་མ་བདེཝ་ཚུ་བཙུགས་ནི་དང་ ལས་འཛིན་གྱི་མཐའ་མཚམས་ཚུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་།

## ༡ སྔོན་འགོག་གི་གནས་སྟངས་ཚུ་ {#_1-prerequisites}

ཉེ་གནས་ཡོངས་འབྲེལ་འགོ་བཙུགས།

- [འགོ་འདྲེན་འཐབ་ Iroha 3](./launch-iroha.md)

འོག་གི་དཔེ་སྟོན་ཚུ་ནང་ [Iroha 3 འགོ་བཙུགས་ནི།](./launch-iroha.md) ལུ་བཟོ་མི་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ ཞབས་ཏོག་ལེན་མི སྒྲིག་གཞི་འདི་བཀོད་ནུག

```bash
./localnet/client.toml
```

## གཞི་རྟེན་ CLI གཞི་སྒྲིག་ {#_2-basic-cli-setup}

མཐོ་རིམ་གྲོགས་རམ་སྟོན།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI འདི་ མཐོ་ཤོས་གནས་ཚད་ཀྱི་བཀའ་བཀོད་སྡེ་ཚན་ཚུ་ནང་གོ་སྒྲིག་འབདཝ་ཨིན།

- རྩིས་ཐོ་ལུ་གཞི་བཞག་པའི་མགྱོགས་ཐབས་ཚུ་གི་དོན་ལུ་ `account`
- `tx` ཚོང་འབྲེལ་གནས་རིམ་གྱི་གྲོགས་རམ་འབད་མི་ཚུ་གི་དོན་ལུ་
- `ledger` རྩིས་ཐོ་གུ་ལྷག་ནི་དང་འབྲི་ནིའི་དོན་ལུ་
- བཀོལ་སྤྱོད་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ `ops`
- `app`གི་དོན་ལུ་ ཕན་ཐོགས་ཅན་གྱི་ལག་ལེན་ API ཆ་རོགས་འབད་མི་ཚུ་
- གན་རྒྱ་བཀྲམ་སྤེལ་དང་འབོད་བརྡ་ཚུ་གི་དོན་ལུ་ `contract`
- བརྟག་དཔྱད་དང་གོང་འཕེལ་གཏང་མིའི་མཐུན་རྐྱེན་ཚུ་གི་དོན་ལུ་ `tools`
- `taira`གི་དོན་ལུ་ ལཱ་འབད་ཐངས་ཚུ་ Taira དང་ Nexus ཕྱོགས་སྟོན་འབདཝ་ཨིན།

`ledger` སྡེ་ཚན་ནང་ལུ་ `ledger transaction` བཟུམ་གྱི་ མངའ་ཁོངས་དམིགས་བསལ་གྱི་ཚོང་འབྲེལ་གྲོགས་རམ་ཚུ་ཡང་ཡོདཔ་ཨིན།

མི་གིས་ལྷག་བཏུབ་པའི་བཀོལ་སྤྱོད་པ་ཨའུཊི་པུཊི་གི་དོན་ལུ་ `--output-format text` དང་ རང་བཞིན་ཐབས་ལམ་དམ་དམ་གྱི་དོན་ལུ་ `--machine` ལག་ལེན་འཐབ།

## མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་ Taira བརྟག་ཞིབ་འབད་ {#_3-try-the-public-taira-testnet}

ཁྱོད་ཀྱིས་ ས་གནས་ཀྱི་ འདྲ་མཉམ་ཅིག་མ་ལག་ལེན་འཐབ་པའི་ཧེ་མར་ ཀློག་རྐྱངམ་གཅིག་ལུ་ Taira བརྟག་ཞིབ་འབད་ཚུགས། འ་ནི་བཀའ་རྒྱ་ཚུ་གིས་ མི་མང་གི་ Torii JSON ལྕགས་ལམ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ བརྟག་དཔྱད་དྲ་རྒྱ XOR མ་ལག་ལེན་འཐབ་ཨིན།

Taira གནས་གོང་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` གནད་སྡུད་ས་སྒོ་ནང་ མི་མང་མངའ་ཁོངས་ཚུ་ཐོ་བཀོད་འབད།

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

`taira.client.toml` བཟོ་ནི་དེ་ཁྱོད་ཀྱིས་ཁ་ཐོ་བཀོད་འབད་ཡོད་པའི་བཀའ་རྒྱ་ཚུ་ བརྟག་དཔྱད་འབད་ནི་ལུ་ གྲ་སྒྲིག་འབད་བ་ཅིན་རྐྱངམ་གཅིག་ཨིན། ཁྱོད་ཀྱིས་ [ མཐུད་སྦྲེལ་འབད་ཞིནམ་ལས་ SORA Nexus ཌེ་ཊའི་པེསི་](/dz/get-started/sora-nexus-dataspaces.md) ལུ་  རིམ་སྒྲིག, བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག དང་ སྔོན་བརྟག བྱ་རིམ འཚོལ་ནིའི་དོན་ལུ་བལྟ་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ Taira གི་རྩིས་ཐོལ་ལུ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག གླ་ཡོན རྒྱུ་དངོས་ཚུ ལས་མ་དངུལ་ཚུན་ཚོད་ འབྲི བཀའ་རྒྱ་ཚུ འདི་མ་ལག་ལེན་འཐབ་ནི་མི་འོང་།

ཟད་འཐུས་སྤྲོད་མི་ Taira CLI གི་དཔེ་དཔེར་ན་, [ལས་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག རོགས་ལས་རིམ འདི་སླར་ལོག་འབདཝ་ཨིན། བརྟག་དཔྱད་དྲ་རྒྱ XOR ལུ་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ལུ་ `taira_faucet_claim.py`སྦེ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ དང་པ་ བརྟག་དཔྱད་དྲ་རྒྱ XOR ཐོབ་བརྗོད་བཀོད་དགོ།

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

གལ་སྲིད་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གྱི་མགུ་ཐོམ་ཡང་ན་ ཐོབ་བརྗོད་ལམ་ལུགས་ཀྱིས་ `502` སླར་ལོག་འབད་བ་ཅིན་ བསྒུག་སྟེ་ ལོག་སྟེ་འབད་རྩོལ་བསྐྱེད། དེ་ཡང་ མི་མང་བརྟག་དཔྱད་ནེཊ་ཐོབ་ཚུགས་པའི་གནད་དོན་ཨིན་ རྩིས་ཐོའི་ལྡེ་མིག་ཚུ་ ལོག་བཟོ་ནིའི་དོན་ལུ་ བརྡ་མཚོན་མེན།

ལྷག་ལུས་འདི་མཐོང་ཚར་བའི་ཤུལ་ལས་ འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་འབྲི་ནི་ལུ་མཉམ་སྦྲགས་འབད།

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. གཞི་རྟེན་རྩིས་དེབ་བཀའ་རྒྱ་ཚུ་ {#_4-basic-ledger-commands}

མངའ་ཁོངས་ཆ་མཉམ་ཐོ་བཀོད་འབད།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

སྤྱིར་བཏང་ས་ཁོངས་བཟོ་སྐྲུན་ནང་ལུ་ གསལ་བསྒྲགས་ཀྱི་མིང་གི་འཆར་གཞི་བཟོ། `ledger domain` བཀའ་རྒྱ་འདི་ནང་ `register` གི་འོག་བཀའ་རྒྱ་མེད་ཨིན། ཁྱོད་ཀྱིས་ `docs.universal`གི་དོན་ལུ་གསང་བ་མེད་པའི་ `AliasSetupPlanRequestV1` དམིགས་གཏད་ཅིག་ གྲ་སྒྲིག་འབད་ཞིནམ་ལས་ ཁྱོད་ཀྱི་ SDK ཡང་ན་ གློག་ཐག་ར་ཀར་གྱི་ ཞབས་ཏོག་དང་བསྟུན་ཏེ་ འཆར་གཞི་བཙུགས་ཏེ་ ལག་ལེན་འཐབ་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

དམིགས་ཡུལ་འདི་གིས་ གནད་སྡུད་ས་སྒོ་ཨའི་ཌི་དང་ ཚད་ལྡན་ཇོ་བདག་རྩིས་ཐོ་ གླ་ཁར་དུས་ཡུན་ དེ་ལས་ ད་ལྟོའི་ཚིག་བརྗོད་སྲུང་སྐྱོབ་ཚུ་ པིན་འབདཝ་ཨིན། འཆར་གཞི་བརྩམ་མི་འདི་གིས་ དངོས་ཡོད་གནས་སྟངས་བདེན་དཔྱད་འབད་དེ་ རྡུལ་ཕྲན་ `EnsureAlias` འཆར་གཞི་འདི་ ཕུལ་ནི་ལུ་ གཏན་གཏན་སྦེ་སླར་ལོག་འབདཝ་ཨིན། ཡོངས་འབྲེལ་གཞན་མི་ཅིག་ལས་ སྲུང་སྐྱོབ་གནས་གོང་ཚུ་ ལགཔ་གིས་འདྲ་བཤུས་མ་རྐྱབ།

པིང་ཚོང་འབྲེལ་འཇམ་ཏོང་ཏོ་ཅིག་གཏང་།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

འཕྲལ་གྱི་བཀག་ཆ་ཅིག་ལྷག་ནི་ཡང་ན་བཀག་ཆ་བྱུང་ལས་ཚུ་ལུ་མཁོ་མངགས་འབད།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## ལས་འཛིན་གྱི་བཀའ་རྒྱ་ཚུ་ {#_5-operator-commands}

མོས་མཐུན་བཀོལ་སྤྱོད་བརྡ་བཀོད་ཚུ་ལུ་ གནང་བ་ཐོ་བཀོད་འབད་ཡོད་པའི་ ལག་བསྟར་མཉེན་ཆས་ལྡེ་མིག་དགོཔ་ཨིན། `client.toml` ལས་ཕྱི་ཁར་བཞག་ཞིནམ་ལས་ ཇོ་བདག་རྐྱངམ་ཅིག་གི་ཡིག་སྣོད་འདི་གསལ་ཏོག་ཏོ་སྦེ་སྤྲོད།

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

མཐོ་ཤོས་དང་ལྡེ་མིག་བརྒྱབ་ཡོད་པའི་ཚོགས་མིའི་ལག་ཁྱེར་ཚུ།

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

འབྱུང་ཁུངས་བརྟག་ཞིབ་ལས་ མཱརཀ་ཌའོན་གྲོགས་རམ་པར་ཆས་ཆ་ཚང་ཅིག་ ལོག་བཟོ་ནིའི་དོན་ལུ་ གཡོག་བཀོལ།

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
