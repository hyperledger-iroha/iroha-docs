---
translation_locale: dz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ལག་ལེན་འཐབ་ནི་ Iroha 3 བརྒྱུད་ལས་ CLI {#operate-iroha-3-via-cli}

`iroha` ཌའི་ལོག་འདི་ Iroha 3 གི་བཀའ་ཤོག་གི་གྲལ་ཐིག་ clientཨིན། འདི་ལག་ལེན་འཐབ་སྟེ་ མདོ་སྡེའི་གནས་སྟངས་འཚོལ་ནིའི་དོན་ལུ་དང་ བྱ་སྟབས་མ་བདེཝ་ཚུ་བཙུགས་ནི་དང་ ལས་འཛིན་གྱི་མཐའ་མཚམས་ཚུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་།

## ༡ སྔོན་འགོག་གི་གནས་སྟངས་ཚུ་ {#_1-prerequisites}

དང་པ་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ གཞི་བཙུགས་འབདཝ་ཨིན།

- [འགོ་འདྲེན་འཐབ་ Iroha 3](./launch-iroha.md)

འོག་གི་དཔེ་སྟོན་ཚུ་ནང་ [Launch Iroha 3](./launch-iroha.md) ལུ་བཟོ་མི་ localnetལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ client སྒྲིག་གཞི་འདི་བཀོད་ནུག

```bash
./localnet/client.toml
```

## གཞི་རྟེན་ CLI གཞི་སྒྲིག་ {#_2-basic-cli-setup}

དྲག་ཤོས་གི་རོགས་རམ་བཏོན་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI འདི་ མཐོ་ཤོས་གནས་ཚད་ཀྱི་བཀའ་བཀོད་སྡེ་ཚན་ཚུ་ནང་གོ་སྒྲིག་འབདཝ་ཨིན།

- `account` དངུལ་རྩིས་ཁ་ཐུག་གི་ བསྡོམས་ཐབས་ཀྱི་དོན་ལུ་
- `tx` ཚོང་འབྲེལ་གྱི་གནས་ཚད་ནང་ གྲོགས་རམ་འབད་མི་ཚུ་གི་དོན་ལུ་
- `ledger` ཤོག་སྒྲིལ་ལུ་འབྲི་ལྷག་གི་དོན་ལུ་
- ལས་འཛིན་གྱི་བརྟག་དཔྱད་གི་དོན་ལུ་ `ops`
- `app`གི་དོན་ལུ་ ཕན་ཐོགས་ཅན་གྱི་ལག་ལེན་ API ཆ་རོགས་འབད་མི་ཚུ་
- `contract` ལས་བྱེདཔ་ཚུ་གི་དོན་ལུ་ ལག་ལེན་དང་འབོ་ནི་གི་དོན་ལས་
- `tools` བརྟག་དཔྱད་དང་བཟོ་སྐྲུན་གྱི་ལག་ཆས་ཚུ་གི་དོན་ལུ་
- `taira`གི་དོན་ལུ་ ལཱ་འབད་ཐངས་ཚུ་ Taira དང་ Nexus ཕྱོགས་སྟོན་འབདཝ་ཨིན།

`ledger`སྡེ་ཚན་ནང་ཡང་ ཌོ་མན་སི་ཊི་ཀཱོན་གི་ཐད་ལུ་ དངུལ་འབྲེལ་མཐུན་རྐྱེན་གྱི་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ཡོདཔ་ཨིན་ དཔེར་ན་ `ledger transaction`.

མི་གིས་བཀླག་ཚུགས་པའི་ ལས་འཛིན་གྱི་ཐོན་ཐངས་གི་དོན་ལུ་ `--output-format text`དང་ སྒྲིང་སྒྲི་བཟོ་སྐྲུན་ལམ་ལུགས་ཀྱི་དོན་ལུ་ `--machine` ལག་ལེན་འཐབ་ཨིན།

## མི་མང་གི་བརྟག་དཔྱད་དྲ་ལམ་ Taira བརྟག་ཞིབ་འབད་ {#_3-try-the-public-taira-testnet}

ཁྱོད་ཀྱིས་ ས་གནས་ཀྱི་ འདྲ་མཉམ་ཅིག་མ་ལག་ལེན་འཐབ་པའི་ཧེ་མར་ ཀློག་རྐྱངམ་གཅིག་ལུ་ Taira བརྟག་ཞིབ་འབད་ཚུགས། འ་ནི་བཀའ་རྒྱ་ཚུ་གིས་ མི་མང་གི་ Torii JSON ལྕགས་ལམ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ testnet XOR མ་ལག་ལེན་འཐབ་ཨིན།

Taira གནས་གོང་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` ཌེ་ཊ་ས་པི་ནང་ལུ་ མི་མང་གི་མིང་ཐོ་ཚུ་:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚུ་དང་ ཁོང་རའི་གནས་སྐབས་ཀྱི་ གྲོང་གསེབ་ཚུ་བཀོད་ཐོ་:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

ཁྱོད་ཀྱིས་ད་ལྟོའི་ `iroha` ཌའི་ལོག་ལག་ལེན་འཐབ་པ་ཅིན་, Taira དོ་དཔྱད་གྲོགས་རམ་འདི་ལག་ལེན་འཐབ་དགོ།

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml` བཟོ་ནི་དེ་ཁྱོད་ཀྱིས་ཁ་ཐོ་བཀོད་འབད་ཡོད་པའི་བཀའ་རྒྱ་ཚུ་ བརྟག་དཔྱད་འབད་ནི་ལུ་ གྲ་སྒྲིག་འབད་བ་ཅིན་རྐྱངམ་གཅིག་ཨིན། ཁྱོད་ཀྱིས་ [ མཐུད་སྦྲེལ་འབད་ཞིནམ་ལས་ SORA Nexus ཌེ་ཊའི་པེསི་](/dz/get-started/sora-nexus-dataspaces.md) ལུ་  config, faucet དང་ canary flow འཚོལ་ནིའི་དོན་ལུ་བལྟ་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ Taira གི་རྩིས་ཁྲལ་ལུ་ faucet fee assets ལས་མ་དངུལ་ཚུན་ཚོད་ write commands འདི་མ་ལག་ལེན་འཐབ་ནི་མི་འོང་།

ཟད་འཐུས་སྤྲོད་མི་ Taira CLI གི་དཔེ་དཔེར་ན་, [ལས་ faucet helper འདི་སླར་ལོག་འབདཝ་ཨིན། Testnet XOR ལུ་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ལུ་ `taira_faucet_claim.py`སྦེ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ དང་པ་ testnet XOR ཐོབ་བརྗོད་བཀོད་དགོ།

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

འབུབ་གི་ puzzle ཡང་ན་ claim route འདི་ `502` སླར་ལོག་འོང་པ་ཅིན་སྒུག་སྟེ་བསྐྱར་ བརྟག་དཔྱད་འབད་དགོ་ དེ་རྩིས་ཀྱི་ལྡེ་མིག་ཚུ་སླར་གསོ་འབད་ནི་ལུ་ བརྡ་སྟོན་མེན་མི་ མི་མང་གི་ testnet ཐོབ་ཐངས་ཀྱི་དཀའ་ངལ་ཨིན།

ཟད་འགྲོ་འདི་མཐོངམ་ཚར་ཞིནམ་ལས་ འཐུས་དངུལ་གྱི་རྩིས་ཁྲ་ཚུ་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ དེ་སྦེ་བྲིས་ནུག

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. གཞི་རྟེན་ Ledger བཀའ་རྒྱ་ཚུ་ {#_4-basic-ledger-commands}

ཌོ་མེ་ནའི་ཆ་མཉམ་ཐོ་འགོད་འབད་:

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

ཌེ་ཊ་ས་པི་ ID དང་ ཀན་ནོག་གི་ཇོ་བདག་གི་རྩིས་ཁྲི། རིན་བསྡུར་གྱི་དུས་ཡུན་དང་ ད་ལྟོའི་བཅའ་ཡིག་སྲུང་། འཆར་འགོད་པ་གིས་གནས་སྟངས་ངོ་མ་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ བཏང་དགོ་པའི་རང་བདེན་ཅན་གྱི་ཨེ་མ་གི་འཆར་གཞི་ `EnsureAlias` སླར་ལོག་འབདཝ་ཨིན། གཞན་མི་དྲ་ལམ་ནང་ལས་ སྲུང་སྐྱོབ་ཀྱི་གོང་ཚད་ཚུ་ལག་པར་མ་འདྲ་བཤུས་འབད།

སྦྲགས་ཐིག་གི་ཞལ་འདེབས་གཅིག་བཏང་།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

འཕྲལ་ཁམས་ཅིག་ཁར་ བཀྲམ་སྤེལ་འབད་མི་འདི་ ཀློག་ཐེངསམ་ ཡང་ན་ བཀྲམ་སྟོན་འབད་ནིའི་དོན་ལས་ ཐོ་བཀོད་འབད་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## ལས་འཛིན་གྱི་བཀའ་རྒྱ་ཚུ་ {#_5-operator-commands}

གྲོས་བསྟུན་གྱི་གནས་གོང་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

འོག་གི་གནས་ཚད་ཚུ་ནང་ལུ་ བརྟག་ཞིབ་འབད་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

གྲུབ་འབྲས་ཚུ་: RBC དང་ VRF གི་གློག་བརྙན་ཚུ་

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

ལྕགས་ཐག་ནང་ལུ་ གྲོས་བསྟུན་གྱི་ཚད་གཞི་ཚུ་:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## དྲུག་པ་: ད་ག་ཏེ་འགྱོ་ནི་ཨིན་ན་ {#_6-where-to-go-next}

- [SDK སྦྱོང་བརྡར་](/dz/guide/tutorials/)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
- [Iroha ཌའི་ལོག་ཚུ་དང་གཅིག་ཁར་ལཱ་འབད་ ](/dz/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

གཞི་རྟེན་དངུལ་ཁང་ནང་ལས་ Markdown གྲོགས་རམ་ snapshot ཡོངས་འབྲེལ་སླར་ལོག་འབད་ནིའི་དོན་ལུ་:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
