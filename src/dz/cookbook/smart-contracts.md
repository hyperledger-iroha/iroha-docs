---
translation_locale: dz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: human-reviewed
---
# རིག་རྩལ་ཅན་གྱི་ཆིངས་ཡིག་བཟོ་ནི་དང་ ལག་ལེན་འཐབ་ནི་ {#build-and-deploy-a-smart-contract}

## གྲུབ་འབྲས་ {#outcome}

Kotodama V1 ལས་འཆམ་དེ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ས་གནས་ཀྱི་ནང་འཁོད་ལུ་ མི་མང་གི་འཛུལ་སྒོ་འདི་ལག་ལེན་བསྟར་སྤྱོད་འབད་ཞིནམ་ལས་ དབྱེ་དཔྱད་ཅན་གྱི་ IVM ཅ་ཆས་ཚུ་ སྤོ་བཤུད་འབད་ཞིནམ་ལས་ སྤོ་བཤུབས་འབད་ཡོད་པའི་འཛུལ་སྒོ་དེ་ སིམ་ལེཊི་འབད་ཞིནམ་ལས་ གཞུང་གིས་གསལ་ཏོག་ཏོ་སྦེ་ སྙན་ཞུ་འབད་ཐོག་ལས་ སྤྲོད་པའི་འཐུས་དང་གཅིག་ཁར་ ཕུལ་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- Iroha ལས་ཁུངས་ནང་ལས་ བཏང་མི་ཡིག་ཚང་ `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust དང་ ཅ་ཅོ་གཟེར་ཁ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- ད་ལྟོའི་ `iroha` CLI མཉམ་འབྲེལ་འབད་ཡོད་པའི་ དངུལ་ཕོགས་སྤྲོད་མི་ Taira ཚོང་མགྲོན་པ་ཅིག་ལས་ [ འབྲེལ་བ་འཐབ་ནི་ Taira](./connect-to-taira.md).
- `IROHA_CONFIG` དང་ `IROHA_PRIVATE_KEY_FILE` ནང་ལུ་ ཆ་ཚང་འགྲུལ་ལམ། ལྡེ་མིག་ཡིག་སྣོད་འདི་ ཐབས་ལམ་`0600` དང་ཅིག་ཁར་ ཇོ་བདག་གིས་འཛིན་མི་ འབྲེལ་ལམ་རྐྱང་པའི་དུས་རྒྱུན་ཡིག་སྣོད་ཅིག་འོང་དགོ། བཀྲམ་སྤེལ་གྲོགས་རམ་པ་ལུ་ བསམ་བཞིན་དུ་ ནང་ཐིག་སྒེར་གྱི་ལྡེ་མིག་སྒྲུབ་བྱེད་མེདཔ་ཨིན།
- Taira ལས་འཛིན་གྱི་ ངོས་ལེན་འབད་ཐབས། གྲོས་ཆོད་ཀྱི་ལས་རིམ་ཨང་རྟགས་གུ་ ཐོ་བཀོད་འབད་དགོ་པ་ཅིན་ `CanRegisterSmartContractCode` དེ་ལས་ ཉེན་སྲུང་ཅན་གྱི་ལག་ལེན་འཐབ་ཐངས་ཚུ་གིས་ གཞུང་སྐྱོང་གི་འགན་ཁུར་དང་ ལག་ལེན་འཐབ་ཐངས་ཚུ་ དགོཔ་ཨིན། གལ་སྲིད་ Taira གིས་ ཐོབ་ཐངས་དེ་མ་བྱིན་པ་ཅིན་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་ལས་ འབྲེལ་བ་འཐབ་ཐངས་ནང་ལུ་ ལག་ལེན་འཐབ་ཐབས།

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## རིམ་པ་ཚུ་ {#steps}

### 1. ངོ་ཤེས་ཅན་གྱི་ Kotodama V1 གྱི་ཞལ་འཆེས་ཀྱི་འདྲ་བཤུས་ {#_1-copy-a-known-good-kotodama-v1-contract}

བཙུགས་ཡོད་པའི་ Iroha བརྟག་ཞིབ་ནང་ལུ་ལཱ་འབད་དེ་ བསྡུ་སྒྲིག་འབད་མི་གི་ཊུཔལ་ལོག་དཔེ་ཚད་འདྲ་བཤུས་རྐྱབ་སྟེ་ འབྱུང་ཁུངས་དང་ལག་ཆས་རིམ་སྒྲིག་འདི་ ཁས་བླངས་གཅིག་ཁར་སྡོད་དགོ།

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

འབྱུང་ཁུངས་ཆ་ཚང་འདི་ཆུང་ཀུ་ཨིནམ་དང་ ད་ལྟོའི་`seiyaku`/`kotoage` ཚིག་སྦྱོར་འདི་ལག་ལེན་འཐབ་ཨིན།

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama གིས་ Iroha བརྡ་དོན་འཕྲུལ་ཆས་དང་དེའི་ད་ལྟོའི་ ABI ལུ་དམིགས་གཏད་བསྐྱེདཔ་ཨིན། འདི་ WASM ཡང་ན་ EVM འབྱུང་ཁུངས་སྐད་ཡིག་མིན།

### 2. བཟོ་སྐྲུན་དང་བརྟག་དཔྱད་འབད་ {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

བཟོ་བསྐྲུན་འགོ་དང་པ་འདི་གིས་ ཅ་རྙིང་དང་ བདེན་བཤད་འབད་ཡོད་པའི་ ཟུར་འཁོར་ཚུ་ དཔར་བསྐྲུན་འབདཝ་ཨིན། གཉིས་པ་འདི་ ལྷག་རྐྱངམ་ཅིག་ `--verify` ཐབས་ལམ་ནང་གཡོག་བཀོལཝ་ཨིནམ་དང་ ད་ལྟོ་ཡོད་པའི་ཐོན་འབྲས་གང་རུང་ཅིག་གིས་ ད་ལྟོའི་འབྱུང་ཁུངས་དང་ ཏན་ཏན་སྦེ་མཐུན་སྒྲིག་མ་འབད་བ་ཅིན་ འཐུས་ཤོར་བྱུངམ་ཨིན། `.to` ཡིག་སྣོད་དང་ དེ་གི་གསལ་སྟོན་འདི་ བསྐྱར་ཞིབ་འབད་ཡོད་པའི་བཟོ་བསྐྲུན་ཨའུཊི་པུཊི་གཅིག་སྦེ་ བརྩི་འཇོག་འབད།

### 3. བའི་ཊི་ཀོཌ་འདི་ ས་གནས་ནང་ལུ་ལག་ལེན་འཐབ་དགོ། {#_3-run-the-bytecode-locally}

`compute`འདི་ མི་མང་གི་འཛུལ་སྒོ་ `kotoage`ཨིན། ཁྱོད་ཀྱིས་དེ་ `debug-call` ལག་ལེན་འཐབ་སྟེ་ལག་ལེན་འབད་དོ་ཡོདཔ་ད་ འདི་གིས་ ས་གནས་ཀྱི་བརྟག་དཔྱད་གནས་སྡུད་གྱི་ཐད་ཁར་ བཏང་མ་དགོ་པར་ ཡང་ན་ དངུལ་སྤྲོད་མ་དགོ་པར་ ལག་ལེན་འབདཝ་ཨིན།

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama ཧྲིལ་གྲངས་ཚུ་ JSON ཡིག་རྒྱུན་སྦེ་བཏོན་ཡོདཔ་ལས་ ཌི་ཀོཌི་འབད་ཡོད་པའི་ཊུཔལ་འདི་ `["3", "5"]` ཨིན།

### 4. རང་ལུགས་ཀྱི་རོགས་པ་བརྒྱུད་དེ་ བགོ་བཀྲམ་འབད་ {#_4-deploy-through-the-native-helper}

གྲོགས་རམ་པ་གིས་ བཱའིཊི་ཀོཌི་ཆ་ཤས་ཚུ་སྐྱེལ་བཙུགས་འབདཝ་ཨིན་ མིང་རྟགས་བཀོད་ཡོད་པའི་གསལ་བསྒྲགས་འདི་ཐོ་བཀོད་འབདཝ་ཨིན་ དེ་ལས་ `CommitContractDeployment` བཀོལ་སྤྱོད་གཅིག་བཙུགསཔ་ཨིན། འདི་གིས་ ཚོང་འབྲེལ་ག་ར་ལུ་ འཐུས་-ཚིག་བརྗོད་བཀལཝ་ཨིནམ་དང་ སེལ་འཐུ་འབད་ཡོད་པའི་ དངུལ་སྤྲོད་མི་ཡང་ན་ རླངས་རླུང་བཀག་ཆ་བསྒྱུར་བཅོས་འབད་མི་ ཚིག་བརྗོད་ཅིག་ ངོས་ལེན་མི་འབད།

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

`charge_limits` སྟོངམ་གྱི་ཞུ་བ་འདི་འདྲ་བཤུས་རྐྱབ་ཡོད་པའི་རྒྱུ་དངོས་ངོས་འཛིན་འབད་མི་ཅིག་མེན་: གྲོགས་རམ་པ་གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ ཐད་རི་བ་རི་ དངོས་ཡོད་ཚིག་བརྗོད་འདི་ངོས་ལེན་འབདཝ་ཨིན། ད་ལྟོའི་བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ལན་དང་གཅིག་ཁར་ ལོག་སྤྲོད་ཡོད་པའི་ གླ་ཆ་རྒྱུ་དངོས་འདི་ ག་བསྡུར་འབད། གན་རྒྱ་འབོད་བརྡ་ཚུ་གིས་ ཡིག་དཔར་རྐྱབས་ཡོད་པའི་ཐད་རི་བ་རི་ཚིག་བརྗོད་བརྒྱུད་དེ་རྐྱངམ་ཅིག་ འཐུས་སེལ་འཐུ་འདི་ངོས་ལེན་འབདཝ་ཨིན། `gas_asset_id` བརྗེ་སོར་མེ་ཊ་ཌེ་ཊ་འདི་ འགོ་དང་པ་བཏོན་པའི་གན་རྒྱ་གི་ཆ་ཤས་མེན།

### 5. བཏང་ཡོད་པའི་འཛུལ་སྒོ་འདི་ སི་མུལ་དང་འབོ་འབད། {#_5-simulate-and-call-the-deployed-entrypoint}

བརྟག་དཔྱད་འདི་གིས་ Torii གུ་མི་མང་འཛུལ་སྒོ་འདི་ བཙུགས་མ་དགོ་པར་ གཡོག་བཀོལཝ་ཨིན། འོག་གི་འབོད་བརྡ་འདི་ ཚོང་འབྲེལ་ཅིག་ཨིནམ་ལས་ གནང་བ་གཙོ་བོ་འཐུས་སྤྲོད་མི་འདི་ གསལ་ཏོག་ཏོ་སྦེ་སེལ་འཐུ་འབདཝ་ཨིན། བརྡ་བཀོད་གཉིས་ཆ་ར་གིས་ བརྗེ་སོར་ལག་ལེན་འཐབ་ནིའི་འགྲོ་སོང་ཚད་གཞི་ ༡,༥༠༠,༠༠༠ བསྡམ་བཞགཔ་ཨིན།

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## བརྟག་དཔྱད་འབད་ {#verify}

མིང་གཞན་འདི་སེལ་འཐུ་འབད་ཞིནམ་ལས་ ལོག་སྤྲོད་ཡོད་པའི་ཨང་རྟགས་ཧ་ཤི་གིས་ ཨོན་-ཅེན་མེ་ནིཕཊ་འདི་འབག་འོང་ དེ་ལས་ ཚད་ལྡན་ཁ་བྱང་གིས་ མི་མང་འཛུལ་སྒོ་གཅིགཔོ་འདི་ དཔེ་སྟོན་འབད།

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

མིང་གཞན འདི་ལོག་ཐོབ་པའི་ཁ་བྱང་ལུ་ སེལ འབད་ནི་ གསལ་སྟོན་ཡིག་ཆ འདི་ ལས་རིམ་ཨང་རྟགས བསྡུས་རྟགས གཅིག་པའི་འོག་ལུ་ལྷག་ཚུགས་ནི་ ས་གནས དང་ Torii ལད་ཟློས གཉིས་ཆ་ར་གིས་ `["3", "5"]` ལོག་བྱིན་ནི་དང་ ཕུལ འབད་མི་ ལས་རིམ་འབོད འདི་ `Applied` ལུ་ལྷོད་པའི་སྐབས་རྐྱངམ་ཅིག་ བཀྲམ་སྤེལ ཆ་ཚང་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `CanRegisterSmartContractCode` གྱི་འཛོལ་བ་ཚུ་གིས་ Taira ལས་འཛིན་གྱི་གྲོགས་རམ་ ཡང་ན་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ ལུ་ འགོ་ཐོག/འགོ་སྒྲིག བསྒྱུར་བཅོས་འབད་དགོཔ་ཨིན། སྤྱིར་བཏང་རྩིས་ཐོ་འདི་གིས་ རང་གིས་རང་ལུ་ཆོག་ཐམ་འདི་བྱིན་མ་ཚུགསཔ་ཨིན།
- སྲིད་སྐྱོང་འབད་ནི་དང་ ཡང་ན་ ཉེན་སྲུང་ཅན་གྱི་ལམ་ལུགས་ལུ་ རྒྱབ་སྐྱོར་འབད་མ་དགོ་པའི་དོན་ལས་ ལག་ལེན་འཐབ་ནིའི་དོན་ལས་ འབྲེལ་མཐུད་དེ་ཅིག་གིས་ དགོས་མཁོ་ཡོད་མི་ ངོས་ལེན་ཡིག་ཆ་ཚུ་ ངེས་བདེན་སྦེ་ བཏང་དགོཔ་ཨིན། ངོས་ལེན་གྱི་ཐོ་ཡིག་འདི་ མཉམ་སྒྲིག་འབད། རྩིས་རྩིས་ IDs བཟོ་མི་དགོ།
- གསལ་སྟོན་ཡིག་ཆ ཡང་ན་ ABI མ་མཐུན་པའི་དོན་དག་དེ་ བཱའིཊི་ཨང་རྟགས, གསལ་སྟོན་ཡིག་ཆ དང་ མཐུད་མཚམས ལག་བསྟར་མཉེན་ཆས འདི་ གཅིག་མཚུངས བཟོས་དངོས གསལ་བཀོད་མི་འབདཝ་ཨིན་མས། `--verify` ལུ་ གཏན་སྦྱར་ཡོད་པའི Git commit ལུ་སླར་གསོ་འབདཝ་ཨིན།
- `fee quote changed ... gas bound` ཟེར་མི་འདི་ ཞུ་བ་འབད་ཡོད་པའི་ཡིག་དཔར་རྐྱབ་ཡོད་པའི་དམིགས་ཡུལ་དང་ འཚོ་བའི་ཚིག་བརྗོད་འདི་ མོས་མཐུན་མེདཔ་ཨིན། མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་ཅིག་ལེགས་བཅོས་འབད་ནི་ལས་ ལོག་སྟེ་སྔོན་སྒྲིག་འབད།
- བཀྲམ་སྤེལ་གྲོགས་རམ་པ་གིས་ ཡོངས་འབྲེལ་མ་ཕུལ་བའི་ཧེ་མ་ གྲལ་ཐིག་ནང་ལྡེ་མིག་ཚུ་ གནང་བ་ཡོད་པའི་ལྡེ་མིག་-ཡིག་སྣོད་ཐབས་ལམ་ བརྡ་མཚོན་འབྲེལ་ལམ་ཚུ་ དེ་ལས་ འབྲེལ་མཐུད་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ བསྒྱུར་བཅོས་འབདཝ་ཨིན།
- མཐོང་སྣང་རྐྱངམ་ཅིག་གི་འཛུལ་སྒོའི་འཛོལ་བ་འདི་གིས་ `compute` འདི་ བརྡ་བཀོད་བཟའ་ཚང་འཛོལ་བ་བརྒྱུད་དེ་ འགྲུལ་ལམ་བཏང་ཡོདཔ་སྦེ་ཨིན། དཔེ་ཚད་འདི་གིས་ `kotoage` གསལ་བསྒྲགས་འབདཝ་ལས་ འབོད་བརྡ་བརྟག་དཔྱད་ཡང་ན་ ཕུལ་ནི་ལག་ལེན་འཐབ།
- གན་རྒྱ་ཁ་པར་ཚུ་ལུ་ རླངས་རྫས་ཚད་གཞི་ངེས་གཏན་དགོཔ་ཨིན། འགོ་ཐོག་བཏོན་པའི་འབོད་བརྡའི་གན་རྒྱ་འདི་གིས་ མཐོ་རིམ་རླངས་རྫས་ཡང་ན་ འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་ ངོས་ལེན་མི་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [Kotodama V1 བཀའ་རྒྱ་ལག་ལེན་འབད་ཐབས། པིན་ཌི་གི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) ལུ་ ཊུ་པལ་-ལོག་འབྱུང་ཁུངས་དཔེ་ཚད།
- [རང་བཞིན་གནས་སྟངས་ནང་ལུ་ གྲོགས་རམ་འབད་མི་ ཕབ་ལེན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [ཟད་འགྲོ་བཏང་བཞག་མི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs) ལུ་ སྦྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [མཁས་མཆོག་གི་འཆམ་ཁ་](/dz/blockchain/smart-contracts.md)
- [CLI གི་ཁ་བྱང་](/dz/get-started/operate-iroha-via-cli.md)
