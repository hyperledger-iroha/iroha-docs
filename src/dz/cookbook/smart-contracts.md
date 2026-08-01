---
translation_locale: dz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# རིག་རྩལ་ཅན་གྱི་ཆིངས་ཡིག་བཟོ་ནི་དང་ ལག་ལེན་འཐབ་ནི་ {#build-and-deploy-a-smart-contract}

## གྲུབ་འབྲས་ {#outcome}

Kotodama V1 ལས་འཆམ་དེ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ས་གནས་ཀྱི་ནང་འཁོད་ལུ་ མི་མང་གི་འཛུལ་སྒོ་འདི་ལག་ལེན་བསྟར་སྤྱོད་འབད་ཞིནམ་ལས་ དབྱེ་དཔྱད་ཅན་གྱི་ IVM ཅ་ཆས་ཚུ་ སྤོ་བཤུད་འབད་ཞིནམ་ལས་ སྤོ་བཤུབས་འབད་ཡོད་པའི་འཛུལ་སྒོ་དེ་ སིམ་ལེཊི་འབད་ཞིནམ་ལས་ གཞུང་གིས་གསལ་ཏོག་ཏོ་སྦེ་ སྙན་ཞུ་འབད་ཐོག་ལས་ སྤྲོད་པའི་འཐུས་དང་གཅིག་ཁར་ ཕུལ་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- Iroha ལས་ཁུངས་ནང་ལས་ བཏང་མི་ཡིག་ཚང་ `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust དང་ ཅ་ཅོ་གཟེར་ཁ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- ད་ལྟོའི་ `iroha` CLI མཉམ་འབྲེལ་འབད་ཡོད་པའི་ དངུལ་ཕོགས་སྤྲོད་མི་ Taira ཚོང་མགྲོན་པ་ཅིག་ལས་ [ འབྲེལ་བ་འཐབ་ནི་ Taira](./connect-to-taira.md).
- `IROHA_CONFIG` དང་ `IROHA_PRIVATE_KEY_FILE` ནང་གི་རྩ་བ་མེད་པའི་ལམ་ཚུ་ཨིན། ལྡེ་མིག་ཡིག་སྣོད་འདི་ ཇོ་བདག་གིས་ལག་ལེན་འབད་ཡོད་པའི་ ལེན་རྐྱང་ལྡེ་མིག་ཅིག་ཨིན་པའི་ ཕུངམ་ཅིག་ཨིནམ་ད་ ཐབས་ལམ་དེ་ `0600` ཨིན། ལག་ལེན་འཐབ་ནིའི་རོགས་འདི་གིས་ དམིགས་བསལ་གྱི་ སྒེར་སྡེའི་ལྡེ་མིག་ནང་ གྲོས་བསྡུར་ག་ནི་ཡང་མེདཔ་ཨིན།
- Taira ལས་འཛིན་གྱི་ ངོས་ལེན་འབད་ཐབས། གྲོས་ཆོད་ཀྱི་ཀོ་བིཌ་གུ་ ཐོ་བཀོད་འབད་དགོ་པ་ཅིན་ `CanRegisterSmartContractCode` དེ་ལས་ ཉེན་སྲུང་ཅན་གྱི་ལག་ལེན་འཐབ་ཐངས་ཚུ་གིས་ གཞུང་སྐྱོང་གི་འགན་ཁུར་དང་ ལག་ལེན་འཐབ་ཐངས་ཚུ་ དགོཔ་ཨིན། གལ་སྲིད་ Taira གིས་ ཐོབ་ཐངས་དེ་མ་བྱིན་པ་ཅིན་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་ལས་ འབྲེལ་བ་འཐབ་ཐངས་ནང་ལུ་ ལག་ལེན་འཐབ་ཐབས།

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

སྒྲིག་གཞི་ནང་ ལཱ་འབད་ཐབས། Iroha checkout དང་ compiler གི་ tuple-return sample འདི་ཡང་ source དང་ toolchain འདི་རང་ commit འབད་ནི་ལུ་ བཞག་སྟེ་ཡོདཔ་ཨིན།

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

འབྱུང་ཁུངས་ཡོངས་བསྡོམས་འདི་ཆུང་ཀུ་ཅིག་ཨིནམ་ལས་ ད་ལྟོའི་ `seiyaku`/`kotoage` ཚིག་ཡིག་འདི་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

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

Kotodama གིས་ Iroha Virtual Machineདང་དེ་གི་གནས་སྐབས་ཀྱི་ ABI ལུ་ དམིགས་གཏད་བསྐྱེད་དོ་ཡོདཔ་ཨིན། འདི་ WASM ཡང་ན་ EVM གཞི་རྟེན་སྐད་ཡིག་མེདཔ།

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

ཨང་དང་པ་བཟོ་སྐྲུན་གྱིས་ བཟོ་བཀོད་དང་ བདེན་ཁུངས་ཅན་ sidecars གསལ་སྟོན་འབདཝ་ཨིན། གཉིས་པ་འདི་ལྷག་ཐངས་རྐྱངམ་ཅིག་གི་ `--verify` ཐབས་ལམ་ནང་ལུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ ད་ལྟོའི་ཐོན་སྐྱེད་ཅིག་གིས་ གནས་སྐབས་ཀྱི་འབྱུང་ཁུངས་དང་གཅིག་ཁར་མ་མཐུན་པ་ཅིན་ རྩ་འགེངས་ཨིན། `.to` ཤོག་སྒྲིལ་དང་ འདི་ནང་གི་ manifest འདི་བསྐྱར་ཞིབ་འབད་ཡོད་པའི་བཟོ་སྐྲུན་གྱི་ཐོན་སྐྱེད་ཅིག་སྦེ་ལག་ལེན་འབད་འོང་།

### 3. བའི་ཊི་ཀོཌ་འདི་ ས་གནས་ནང་ལུ་ལག་ལེན་འཐབ་དགོ། {#_3-run-the-bytecode-locally}

`compute`འདི་ མི་མང་གི་འཛུལ་སྒོ་ `kotoage`ཨིན། ཁྱོད་ཀྱིས་དེ་ `debug-call` ལག་ལེན་འཐབ་སྟེ་ལག་ལེན་འབད་དོ་ཡོདཔ་ད་ འདི་གིས་ ས་གནས་ཀྱི་ མཐུད་སྦྲེལ་གྱི་ཐད་ཁར་ བཏང་མ་དགོ་པར་ ཡང་ན་ དངུལ་སྤྲོད་མ་དགོ་པར་ ལག་ལེན་འབདཝ་ཨིན།

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama integers འདི་ JSON stringsསྦེ་སྟོན་དོ་ཡོདཔ་ད་ འདི་འབདཝ་ལས་ decoded tupleའདི་ `["3", "5"]`ཨིན།

### 4. རང་ལུགས་ཀྱི་རོགས་པ་བརྒྱུད་དེ་ བགོ་བཀྲམ་འབད་ {#_4-deploy-through-the-native-helper}

རྒྱབ་སྐྱོར་འདི་གིས་ བའི་ཊི་ཀོཌ་གི་ སྦྲག་ཚུ་ ཕུལ་དོ་ཡོདཔ་ད་ ཨེབ་གཏང་འབད་ཡོད་པའི་ འགྲེམ་སྟོན་འདི་ ཐོ་བཀོད་འབད་དེ་ `CommitContractDeployment` ལས་འགུལ་གཅིག་བཙུགས་ཏེ་ཡོདཔ་ཨིན། དེ་གིས་ཚོང་འབྲེལ་རེ་ལུ་འཐུས་སྤྲོད་ནི་ དེ་ལས་གདམ་ཁ་ཅན་གྱི་ དངུལ་ཕོགས་སྤྲོད་མི་ ཡང་ན་ གློག་སྣུམ་བཅའ་མར་བསྒྱུར་བཅོས་འབད་མི་ གྲོས་འདེབས་ཅིག་ ཆ་མེད་བཏང་ཚུགས།

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

སྟོངམ་ `charge_limits` ཞུ་བ་འདི་ རྒྱུ་དངོས་ངོ་རྟགས་བཟོ་མི་ཅིག་ཨིན། གྲོགས་རམ་कर्ताའདི་གིས་ ཐོ་བཀོད་མ་རྐྱབ་པའི་ཧེ་མར་ འོག་ཐོག་གི་རིན་གོང་ཚུ་ངོས་ལེན་འབདཝ་ཨིན། བསྐྱལ་བའི་ཁྲལ་གྱི་རྒྱུ་དངོས་དེ་ ད་ལྟོའི་ཐབ་ལན་དང་བསྡུར་འབད། ཞལ་འདེབས་ནང་འབོ་མི་ཚུ་ལུ་ legacy `gas_asset_id` metadata མཉམ་འབྲེལ་མ་གཏང་།

### 5. བཏང་ཡོད་པའི་འཛུལ་སྒོ་འདི་ སི་མུལ་དང་འབོ་འབད། {#_5-simulate-and-call-the-deployed-entrypoint}

སི་མུལ་འདི་ Torii ལུ་ མི་མང་གི་འཛུལ་སྒོ་ནང་ལས་ བཏང་མ་དགོ་པར་ལག་ལེན་འཐབ་ཨིན། འ་ནི་ཨེབ་ཐག་འདི་ ཚོང་འབྲེལ་ཨིནམ་ལས་ འདི་གིས་དབང་འཛིན་གྱི་འཐུས་སྤྲོད་མི་དེ་ གསལ་ཏོག་ཏོ་སྦེ་གདམ་ཁ་འབདཝ་ཨིན། བཀའ་རྒྱ་གཉིས་ཆ་ར་གིས་སྣུམ་༡,༥༠༠,༠༠༠ གི་ཐོ་བཀོད་མཚམས་ལུ་བཅའ་མར་གཏོགས་ཡོདཔ་ཨིན།

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

མིང་རྟགས་འདི་སེལ་འཐུ་འབད་ དེ་ལས་ལོག་འོང་མི་ code hash ཟེར་མི་ཐོག་ལས་ chain manifest འདི་འཚོལ་ཞིནམ་ལས་ canonical address གྱི་ཐོག་ལས་ public entry point དེ་བཟུམ་སྦེ་ simulate འབད་:

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

བགོ་བཀྲམ་འདི་མཇུག་བསྡུ་ནི་དེ་རྐྱངམ་གཅིག་ཨིན། མིང་རྟགས་དེ་ལོག་འོང་མིའི་ཁ་བྱང་ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ད་ བརྡ་བཀོད་འདི་ code hash, local and Torii simulation return `["3", "5"]` གི་འོག་ལུ་ ཀློག་ཚུགསཔ་ཨིན། དེ་ལས་ བཏང་མི་འབོ་མི་འདི་ `Applied` ལུ་ལྷོད་ཡོདཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `CanRegisterSmartContractCode` གྱི་འཛོལ་བ་ཚུ་གིས་ Taira ལས་འཛིན་གྱི་གྲོགས་རམ་ ཡང་ན་ localnet ལུ་ genesis/bootstrap བསྒྱུར་བཅོས་འབད་དགོཔ་ཨིན། རང་ལུགས་ཀྱི་རྩིས་ཁྲ་འདི་ གནད་དོན་འདི་གི་ཤུལ་ལས་ རང་གིས་རང་ལུ་ཆོག་ཐམ་བྱིན་མི་ཚུགས།
- སྲིད་སྐྱོང་འབད་ནི་དང་ ཡང་ན་ ཉེན་སྲུང་ཅན་གྱི་ལམ་ལུགས་ལུ་ རྒྱབ་སྐྱོར་འབད་མ་དགོ་པའི་དོན་ལས་ ལག་ལེན་འཐབ་ནིའི་དོན་ལས་ འབྲེལ་མཐུད་དེ་ཅིག་གིས་ དགོས་མཁོ་ཡོད་མི་ ངོས་ལེན་ཡིག་ཆ་ཚུ་ ངེས་བདེན་སྦེ་ བཏང་དགོཔ་ཨིན། ངོས་ལེན་གྱི་ཐོ་ཡིག་འདི་ མཉམ་སྒྲིག་འབད། རྩིས་རྩིས་ IDs བཟོ་མི་དགོ།
- manifest ཡང་ན་ ABI མ་མཐུན་པའི་དོན་ལས་ bytecode, manifest དང་ node runtime འདི་ same artifact གསལ་བཀོད་མི་འབདཝ་ཨིན། `--verify` ལུ་ pinned commit ལུ་སླར་གསོ་འབད་འོང་།
- `fee quote changed ... gas bound` གིས་ དགོས་མཁོ་ཅན་གྱི་ ཐོ་བཀོད་ intent དང་ live quote ངོས་ལེན་མེད་ཟེར་ཞུཝ་ཨིན། བསྐྱར་གསོ་འབད་ཞིནམ་ལས་ རྟགས་མཚན་རྟགས་བཀོད་མི་ཅ་ཆས་ཅིག་ལུ་འགྱུར་བཅོས་མ་འབད་བར་བཞག་དགོ།
- deploy helper གིས་ inline key དང་ permissive key-file mode དེ་ལས་ symlink ཚུ་དང་འབྲེལ་མཐུད་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ མང་ཤོས་ཅིག་ལུ་མ་བཙུགས་པའི་ཧེ་མ་ rejectའབདཝ་ཨིན།
- མཐོང་ཐངས་རྐྱངམ་ཅིག་གི་འཛུལ་སྒོ་གི་འཛོལ་བ་འདི་གིས་འབད་བ་ཅིན་ `compute` འདི་བཀའ་བཀོད་གྱི་བཟའ་ཚན་དེ་ནང་ལས་ བཏོན་བཏང་ཡོདཔ་ཨིན། འ་ནི་དཔེ་སྟོན་ནང་ལུ་ `kotoage` གིས་ གསལ་སྟོན་འབདཝ་ཨིན་ དེ་འབདཝ་ལས་ call simulation ཡང་ན་ submit ལག་ལེན་འཐབ་འོང་།
- གྲོས་ཆོད་ནང་འབོ་པའི་དོན་ལས་ བསྣུམ་སྣུམ་གྱི་ཐོ་བཀོད་ཡངས་ཚད་ཅིག་ དགོཔ་ཨིན། མཐོ་ཤོས་གནས་ཚད་ཀྱི་ རྒྱུན་འཛིན་འབད་ཡོད་པའི་སྣུམ་དང་ ཡང་ན་འཐུས་དངུལ་རྩིས་གི་ metadata འདི་མ་བཏུབ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [Kotodama V1 བཀའ་རྒྱ་ལག་ལེན་འབད་ཐབས། པིན་ཌི་གི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [ཨེབ་གཏང་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) ལུ་ Tuple-return source sample
- [རང་བཞིན་གནས་སྟངས་ནང་ལུ་ གྲོགས་རམ་འབད་མི་ ཕབ་ལེན་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [ཟད་འགྲོ་བཏང་བཞག་མི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs) ལུ་ སྦྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [མཁས་མཆོག་གི་འཆམ་ཁ་](/dz/blockchain/smart-contracts.md)
- [CLI གི་ཁ་བྱང་](/dz/get-started/operate-iroha-via-cli.md)
