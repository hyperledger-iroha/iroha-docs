---
translation_locale: dz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# རིག་རྩལ་ཅན་གྱི་ཆིངས་ཡིག་བཟོ་ནི་དང་ ལག་ལེན་འཐབ་ནི་ {#build-and-deploy-a-smart-contract}

## གྲུབ་འབྲས་ {#outcome}

Kotodama V1 ཆིངས་ཡིག་ཅིག་ ཞིབ་དཔྱད་དང་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ དེ་གི་ མི་མང་མཐོང་སྣང་འདི་ ས་གནས་ནང་ གཡོག་བཀོལ། བདེན་དཔྱད་འབད་ཡོད་པའི་ IVM བཟོ་བསྐྲུན་ཐོན་དངོས་འདི་ གསལ་ཏོག་ཏོ་སྦེ་ གདམ་ཁ་རྐྱབ་ཡོད་པའི་ དབང་འཛིན་གྱིས་སྤྲོད་མི་ འཐུས་ཚུ་དང་གཅིག་ཁར་ བཀྲམ་སྤེལ་འབད་ཞིནམ་ལས་ བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ མཐོང་སྣང་འདི་ Torii བརྒྱུད་དེ་ ལྷག།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- Iroha ལས་ཁུངས་ནང་ལས་ བཏང་མི་ཡིག་ཚང་ `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust དང་ ཅ་ཅོ་གཟེར་ཁ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- ད་ལྟོའི་ `iroha` CLI དང་ `musubi` (འབྱུང་ཁུངས་ཀྱི་འདྲ་བཤུས་ནང་ `cargo run -p musubi --` སྦེ་ གཡོག་བཀོལ་མི་) དེ་ལས་ [Taira ལུ་མཐུད་སྦྲེལ་འབད་](./connect-to-taira.md) ལས་ མ་དངུལ་བཙུགས་ཡོད་པའི་ Taira ཞབས་ཏོག་ལེན་མི་ཅིག།
- `IROHA_CONFIG` ནང་ ཆ་ཚང་གི་འགྲུལ་ལམ་ཅིག། Musubi གི་ དྲ་རྒྱ་མཐུད་སྦྲེལ་གྱིས་ ཞབས་ཏོག་ལེན་མིའི་ཡིག་སྣོད་འདི་ལུ་ གཞི་བསྟུན་ཅིག་ གསོག་འཇོག་འབད་ཞིནམ་ལས་ དེ་གི་རྩིས་ཐོ་ལྡེ་མིག་གིས་ བཀྲམ་སྤེལ་ལུ་ མིང་རྟགས་བཀོདཔ་ཨིན།
- མིང་གཞན་གྱི་དབང་ཚད། ལག་བསྟར་པ་ (executor) གིས་ ཆིངས་ཡིག་གི་མིང་གཞན་ངེས་བདེན་ ཡང་ན་ དེ་གི་ གོང་རིམ་ཁྱབ་ཚད་ཀྱི་དོན་ལུ་ `CanManageAccountAlias` དགོཔ་ཨིན། གོང་རིམ་ཁྱབ་ཚད་འདི་ `name::domain.dataspace` གི་དོན་ལུ་ བདག་དབང་མངའ་ཁོངས་ ཡང་ན་ `name::dataspace` གི་དོན་ལུ་ གནད་སྡུད་ས་སྟོང་ཨིན། ཐོ་བཀོད་འབད་ཡོད་པའི་ རྩིས་ཐོ་ཚུ་ལུ་ ཀོཌ་ཐོ་བཀོད་ཀྱི་ ཆོག་ཐམ་སོ་སོ་ མི་དགོ། ཉེན་སྲུང་ཅན་གྱི་ མིང་གི་ས་ཁོངས་ཚུ་ལུ་ དྲ་རྒྱའི་ གཞུང་སྐྱོང་བྱ་རིམ་ཡང་ དགོཔ་ཨིན། དཔེ་ཚུ་གིས་ `cookbook_tuple::universal` ལག་ལེན་འཐབ་ཨིན། Taira གུ་ དེ་ ཁྱོད་ཀྱིས་ བདག་དབང་འཛིན་མི་ མངའ་ཁོངས་ཅིག་ནང་གི་ མིང་གཞན་ཅིག་གིས་ ཚབ་བཙུགས། ཡང་ན་ འགོ་ཐོག་སྡེབ་ཚན་གྱིས་ མིང་གཞན་གྱི་ཁྱབ་ཚད་ གནང་མི་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་ཅིག་གུ་ བཀྲམ་སྤེལ་འབད།

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## རིམ་པ་ཚུ་ {#steps}

### 1. ངོ་ཤེས་ཅན་གྱི་ Kotodama V1 གྱི་ཞལ་འཆེས་ཀྱི་འདྲ་བཤུས་ {#_1-copy-a-known-good-kotodama-v1-contract}

བཙུགས་ཡོད་པའི་ Iroha བརྟག་ཞིབ་ནང་ལུ་ལཱ་འབད་དེ་ བསྡུ་སྒྲིག་འབད་མི་གི་ཊུཔལ་ལོག་དཔེ་ཚད་འདྲ་བཤུས་རྐྱབ་སྟེ་ འབྱུང་ཁུངས་དང་ལག་ཆས་རིམ་སྒྲིག་འདི་ ཁས་བླངས་གཅིག་ཁར་སྡོད་དགོ།

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

འབྱུང་ཁུངས་ཆ་ཚང་འདི་ ཆུང་ཀུ་ཨིན། དེ་ནང་ སྒེར་གྱི་ རོགས་རམ་ `fn` གཅིག་དང་ འབོད་མི་ག་ར་ལུ་ གསལ་ཏོག་ཏོ་སྦེ་ ཆོག་ཐམ་བྱིན་མི་ མི་མང་གི་ ལྷག་ནི་རྐྱངམ་ཅིག་གི་ `view fn` གཅིག་ ཡོདཔ་ཨིན་:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama གིས་ Iroha བརྡ་དོན་འཕྲུལ་ཆས་དང་དེའི་ད་ལྟོའི་ ABI ལུ་དམིགས་གཏད་བསྐྱེདཔ་ཨིན། འདི་ WASM ཡང་ན་ EVM འབྱུང་ཁུངས་སྐད་ཡིག་མིན།

### 2. བཟོ་སྐྲུན་དང་བརྟག་དཔྱད་འབད་ {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

བཟོ་བསྐྲུན་འགོ་དང་པ་འདི་གིས་ ཅ་རྙིང་དང་ བདེན་བཤད་འབད་ཡོད་པའི་ ཟུར་འཁོར་ཚུ་ དཔར་བསྐྲུན་འབདཝ་ཨིན། གཉིས་པ་འདི་ ལྷག་རྐྱངམ་ཅིག་ `--verify` ཐབས་ལམ་ནང་གཡོག་བཀོལཝ་ཨིནམ་དང་ ད་ལྟོ་ཡོད་པའི་ཐོན་འབྲས་གང་རུང་ཅིག་གིས་ ད་ལྟོའི་འབྱུང་ཁུངས་དང་ ཏན་ཏན་སྦེ་མཐུན་སྒྲིག་མ་འབད་བ་ཅིན་ འཐུས་ཤོར་བྱུངམ་ཨིན། `.to` ཡིག་སྣོད་དང་ དེ་གི་གསལ་སྟོན་འདི་ བསྐྱར་ཞིབ་འབད་ཡོད་པའི་བཟོ་བསྐྲུན་ཨའུཊི་པུཊི་གཅིག་སྦེ་ བརྩི་འཇོག་འབད།

### 3. བའི་ཊི་ཀོཌ་འདི་ ས་གནས་ནང་ལུ་ལག་ལེན་འཐབ་དགོ། {#_3-run-the-bytecode-locally}

`compute` འདི་ མི་མང་གི་ ལྷག་ནི་རྐྱངམ་ཅིག་གི་ `view fn` ཅིག་ཨིན། དེ་ `debug-view` གིས་ གཡོག་བཀོལ། `debug-view` གིས་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ བཱའིཊི་ཀོཌ་འདི་ ས་གནས་ནང་ གདམ་ཁ་ཅན་གྱི་ བརྟག་དཔྱད་གནས་སྡུད་ཚུ་གུ་ ཚོང་འབྲེལ་ཕུལ་ནི་ ཡང་ན་ དེ་གི་དོན་ལུ་ འཐུས་སྤྲོད་ནི་ མེད་པར་ ལག་བསྟར་འབདཝ་ཨིན།

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama ཧྲིལ་གྲངས་ཚུ་ JSON ཡིག་རྒྱུན་སྦེ་བཏོན་ཡོདཔ་ལས་ ཌི་ཀོཌི་འབད་ཡོད་པའི་ཊུཔལ་འདི་ `["3", "5"]` ཨིན།

### 4. བདེན་དཔྱད་འབད་ཡོད་པའི་ བཟོ་བསྐྲུན་ཐོན་དངོས་འདི་ Musubi གིས་ བཀྲམ་སྤེལ་འབད {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` གིས་ ཆིངས་ཡིག་ཚུ་ བརྟག་ཞིབ་དང་ མཐོང་སྣང་ དེ་ལས་ འཛོལ་བ་སེལ་ནི་ཚུ་ འབདཝ་ཨིན་རུང་ དེ་ཚུ་ བཀྲམ་སྤེལ་མི་འབདཝ་ལས་ Taira གི་བཀྲམ་སྤེལ་ཚུ་ Musubi བརྒྱུད་དེ་ གཡོག་བཀོལཝ་ཨིན། དེ་གི་ བཀྲམ་སྤེལ་ཞབས་ཏོག་གིས་ བཱའིཊི་ཀོཌ་གི་ ཆ་ཤས་ཚུ་ སྐྱེལ་བཙུགས་འབད་ཞིནམ་ལས་ བདེན་དཔྱད་འབད་ཡོད་པའི་ གསལ་བཀོད་ཡིག་ཆ་འདི་ ཐོ་བཀོད་འབད་དེ་ `CommitContractDeployment` བཀོལ་སྤྱོད་གཅིག་ ཕུལཝ་ཨིན། དེ་གིས་ ཚོང་འབྲེལ་རེ་རེ་གི་ གོང་ཚད་བཀོདཔ་ཨིན། གདམ་ཁ་རྐྱབ་ཡོད་པའི་ འཐུས་སྤྲོད་མི་ རྒྱབ་སྐྱོར་པའི་ བསྐྱར་བཅོས་ཐོན་རིམ་ ཡང་ན་ gas ཚད་མཐའ་ བསྒྱུར་མི་ གོང་ཚད་བཀོད་པ་ཅིག་ ངོས་ལེན་མི་འབད། གཏན་བཟུང་ (locked) འབད་ཡོད་པའི་ ཐུམ་སྒྲིལ་བཟོ་བསྐྲུན་གྱིས་ དེ་གི་ ཀོཌ་དང་ ABI ཧེཤ་ཚུ་ ལོག་བཟོ་ཞིནམ་ལས་རྐྱངམ་ཅིག་ ཧེ་མ་ལས་བཟོ་ཡོད་པའི་ བཟོ་བསྐྲུན་ཐོན་དངོས་འདི་ བཀྲམ་སྤེལ་འབདཝ་ཨིན། Kagami གིས་ འཛིན་སྐྱོང་འཐབ་མི་ ས་གནས་དྲ་རྒྱ་གུ་ དེའི་ཚབ་ལུ་ `kagami contract deploy` གིས་ `./build/tuple_return_demo.to` འདི་ `--alias cookbook_tuple::universal --json` དང་གཅིག་ཁར་ བཀྲམ་སྤེལ་འབདཝ་ཨིན། དེ་གི་འབྱོར་རྟགས་འདི་ `.receipt` གི་འོག་ལུ་ ཡོདཔ་དང་ `kagami context show` གིས་ `IROHA_CONFIG` སྦེ་ ལག་ལེན་འཐབ་ནིའི་ ཞབས་ཏོག་ལེན་མིའི་རིམ་སྒྲིག་འདི་ གསལ་སྟོནམ་ཨིན།

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

མཐུད་སྦྲེལ་འདི་གིས་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། Musubi གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན། ལོག་བྱིན་མི་ འཐུས་བསྡུ་རྒྱུ་དངོས་འདི་ ད་ལྟོའི་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་སྲིད་བྱུས་ཀྱིས་ བཀྲམ་སྤེལ་འབད་མི་ རྒྱུ་དངོས་དང་ ག་བསྡུར་འབད། ཆིངས་ཡིག་ལུ་ འབོད་བརྡ་ཚུ་གིས་ འཐུས་ཀྱི་གདམ་ཁ་འདི་ དབྱེ་བ་བཀོད་ཡོད་པའི་ ད་ལྟོའི་གོང་ཚད་བཀོད་པ་ བརྒྱུད་དེ་རྐྱངམ་ཅིག་ ངོས་ལེན་འབདཝ་ཨིན། `gas_asset_id` ཚོང་འབྲེལ་ཟུར་གནས་གནད་སྡུད་འདི་ འགོ་ཐོག་ཐོན་རིམ་གྱི་ འབོད་བརྡའི་གན་རྒྱ་གི་ ཆ་ཤས་ མེན།

### 5. བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ མཐོང་སྣང་འདི་ ལྷག {#_5-read-the-deployed-view}

`contract view` གིས་ ལྷག་ནི་རྐྱངམ་ཅིག་གི་ འཛུལ་སྒོ་འདི་ ཚོང་འབྲེལ་ ཡང་ན་ འཐུས་ མེད་པར་ Torii གུ་ ལག་བསྟར་འབདཝ་ཨིན། མཐོང་སྣང་ལུ་ ཚོང་འབྲེལ་གྱི་ རྣམ་པ་ མེད། Torii གིས་ དེ་གི་ འབོད་བརྡའི་ལམ་ཚུ་གུ་ མཐོང་སྣང་སེལ་འཐུ་འབད་མི་ཅིག་ ངོས་ལེན་མི་འབད།

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## བརྟག་དཔྱད་འབད་ {#verify}

མིང་གཞན་འདི་ ཁ་གསལ་བཟོ་ཞིནམ་ལས་ བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ མཐོང་སྣང་གི་དོན་ལུ་ Torii གིས་ སྙན་ཞུ་འབད་མི་ ཀོཌ་ཧེཤ་གིས་ རྩིས་དེབ་གུ་ཡོད་པའི་ གསལ་བཀོད་ཡིག་ཆ་འདི་ ལེན། དེ་ལས་ ཚད་ལྡན་ཁ་བྱང་གིས་ མཐོང་སྣང་གཅིག་པ་དེ་ གཡོག་བཀོལ་:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

བཀྲམ་སྤེལ་གྱི་འབྱོར་རྟགས་ཀྱིས་ གསོག་འཇོག་འབད་ཡོད་པའི་ བཟོ་བསྐྲུན་ཐོན་དངོས་འདི་ བདེན་དཔྱད་འབད་ཚར་ཡོདཔ་སྦེ་ སྙན་ཞུ་འབད་དེ་ མིང་གཞན་འདི་ ལོག་བྱིན་མི་ཁ་བྱང་ལུ་ ཁ་གསལ་འགྱོཝ་དང་ གསལ་བཀོད་ཡིག་ཆ་འདི་ ཀོཌ་ཧེཤ་གཅིག་པའི་འོག་ལུ་ ལྷག་ཚུགསཔ་ དེ་ལས་ ས་གནས་དང་ Torii གི་ མཐོང་སྣང་ཚུ་གིས་ `["3", "5"]` ལོག་བྱིན་པའི་སྐབས་རྐྱངམ་ཅིག་ བཀྲམ་སྤེལ་འདི་ ཆ་ཚང་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` ཡང་ན་ ལག་བསྟར་པ་ (executor) གི་ `authority is not permitted to manage contract alias` ཟེར་མི་འདི་གིས་ རྩིས་ཐོ་དེ་གིས་ མིང་གཞན་དེ་ མཐུད་མི་ཆོག་ཟེར་ སྟོནམ་ཨིན། ཁྱོད་ཀྱིས་ བདག་དབང་འཛིན་མི་ མངའ་ཁོངས་ཅིག་ནང་གི་ མིང་གཞན་ཅིག་ ལག་ལེན་འཐབ། ཡང་ན་ མིང་གཞན་གྱི་ ཆོག་ཐམ་གནང་བ་ངེས་བདེན་ ཡང་ན་ དེ་གི་མངའ་ཁོངས་ ཡང་ན་ གནད་སྡུད་ས་སྟོང་གི་ ཆོག་ཐམ་གནང་བ་འདི་ ཁྱབ་ཚད་དེ་གི་ཇོ་བདག་ལས་ ལེན། ས་གནས་དྲ་རྒྱ་གུ་ དེ་ འགོ་ཐོག་སྡེབ་ཚན་ནང་ གནང་།
- ཉེན་སྲུང་ཅན་གྱི་ མིང་གི་ས་ཁོངས་ཀྱི་ བཀག་ཆ་ཅིག་གིས་ མིང་གཞན་གྱི་ མིང་གི་ས་ཁོངས་འདི་ གཞུང་སྐྱོང་གི་འོག་ལུ་ ཡོདཔ་སྦེ་ སྟོནམ་ཨིན། ཆ་འཇོག་འབད་མི་ཚུ་གི་ རྩིས་ཐོ་ ID ཚུ་ ཐོ་བཀོད་འབད་མི་འདི་ ཆ་འཇོག་གི་ སྒྲུབ་བྱེད་ མེན། མིང་གི་ས་ཁོངས་དེ་གི་དོན་ལུ་ དྲ་རྒྱའི་ གཞུང་སྐྱོང་བྱ་རིམ་ (`iroha app gov deploy propose`) ལག་ལེན་འཐབ། ཡང་ན་ དེ་གི་ཕྱི་ཁར་ཡོད་པའི་ མིང་གཞན་ཅིག་ གདམ་ཁ་རྐྱབ།
- གསལ་བཀོད་ཡིག་ཆ་ ཡང་ན་ ABI མ་མཐུན་པ་ཅིག་གིས་ བཱའིཊི་ཀོཌ་དང་ གསལ་བཀོད་ཡིག་ཆ་ དེ་ལས་ མཐུད་མཚམས་ཀྱི་ ལག་བསྟར་མཉེན་ཆས་ཚུ་གིས་ བཟོ་བསྐྲུན་ཐོན་དངོས་ གཅིག་པ་ འགྲེལ་བཤད་མི་འབདཝ་སྦེ་ སྟོནམ་ཨིན། གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་ ལོག་བཟོ་བསྐྲུན་འབད་ཞིནམ་ལས་ `--verify` དང་གཅིག་ཁར་ བཟོ་བསྐྲུན་འདི་ ལོག་གཡོག་བཀོལ།
- `fee quote changed ... gas bound` ཟེར་མི་འདི་ ཞུ་བ་འབད་ཡོད་པའི་ཡིག་དཔར་རྐྱབ་ཡོད་པའི་དམིགས་ཡུལ་དང་ འཚོ་བའི་ཚིག་བརྗོད་འདི་ མོས་མཐུན་མེདཔ་ཨིན། མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་ཅིག་ལེགས་བཅོས་འབད་ནི་ལས་ ལོག་སྟེ་སྔོན་སྒྲིག་འབད།
- བར་ཆད་བྱུང་ཡོད་པའི་ བཀྲམ་སྤེལ་ཅིག་གིས་ དེ་གི་ མིང་རྟགས་བཀོད་ཡོད་པའི་ འཆར་གཞི་འདི་ ཉིན་ཐོ་ནང་ བཞགཔ་ཨིན། འཆར་གཞི་གསརཔ་ཅིག་ལུ་ མིང་རྟགས་བཀོད་ནིའི་ཚབ་ལུ་ `musubi deploy --resume <JOURNAL>` གིས་ དེ་ སླར་གསོ་འབད།
- `is read-only and cannot be invoked as a transaction` ཡང་ན་ `is not a kotoage or lifecycle entrypoint` ཟེར་མི་འདི་གིས་ `compute` འདི་ འབོད་བརྡའི་བཀའ་རྒྱ་ཅིག་ལུ་ བཏང་ཡོདཔ་སྦེ་ སྟོནམ་ཨིན། དཔེ་འདི་གིས་ `view fn` གསལ་བསྒྲགས་འབདཝ་ལས་ ས་གནས་ནང་ `debug-view` དང་ Torii གུ་ `view` ལག་ལེན་འཐབ།
- གན་རྒྱ་ཁ་པར་ཚུ་ལུ་ རླངས་རྫས་ཚད་གཞི་ངེས་གཏན་དགོཔ་ཨིན། འགོ་ཐོག་བཏོན་པའི་འབོད་བརྡའི་གན་རྒྱ་འདི་གིས་ མཐོ་རིམ་རླངས་རྫས་ཡང་ན་ འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་ ངོས་ལེན་མི་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་གི་ Kotodama V1 བཀའ་རྒྱའི་ ལག་བསྟར་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko) ལུ་ ཊུ་པལ་-ལོག་འབྱུང་ཁུངས་དཔེ་ཚད།
- གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་གི་ [Musubi བཀྲམ་སྤེལ་བཀའ་རྒྱ་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) དང་ [རང་སོའི་ཆིངས་ཡིག་ བཀྲམ་སྤེལ་ཞབས་ཏོག་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [ཟད་འགྲོ་བཏང་བཞག་མི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs) ལུ་ སྦྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [མཁས་མཆོག་གི་འཆམ་ཁ་](/dz/blockchain/smart-contracts.md)
- [CLI གི་ཁ་བྱང་](/dz/get-started/operate-iroha-via-cli.md)
