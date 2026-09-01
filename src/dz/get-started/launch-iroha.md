---
translation_locale: dz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: human-reviewed
---
# གློག་ཤུགས་གཏང་ཐབས། Iroha 3 {#launch-iroha-3}

ཤོག་ལེབ་འདི་གིས་ ཡར་འཕེལ་གྱི་མཛོད་ཁང་ལས་ སྔོན་སྒྲིག་ལཱ་གི་ས་སྒོ་རྒྱུ་དངོས་ཚུ་ལག་ལེན་འཐབ་སྟེ་ Iroha 3 གི་དོན་ལུ་ ད་ལྟོའི་ཉེ་གནས་ཡོངས་འབྲེལ་རྒྱུན་རིམ་བརྒྱུད་དེ་འགྱོཝ་ཨིན།

## 1. ས་གནས་ཀྱི་ མང་ཤོས་ཅིག་གི་དྲ་ལམ་བཟོ་ནི། {#_1-generate-a-local-multi-peer-network}

ད་ལྟོའི་ Kagami ཀོ་ཌ་ལས་ མཉམ་རོགས་བཞི་ལྡན་གྱི་ས་གནས་དྲ་རྒྱ་བཟོ།

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ཐོན་འབྲས་སྣོད་ཐོ་ནང་ མཐུན་སྒྲིག་འབད་མི་ མཉམ་རོགས་རིམ་སྒྲིག་ `genesis.json` `genesis.signed.nrt` `client.toml` དང་ གྲོགས་རམ་ཡིག་ཚུགས་ཚུ་ཡོདཔ་ཨིན།

ས་གནས་ཀྱི་ཐ་མག་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཆ་རོགས་ཚུ་ཐད་ཀར་དུ་འགོ་བཙུགས།

```bash
./localnet/start.sh
```

ཀོན་ཊེ་ནར་འབད་ཡོད་པའི་གཡོག་བཀོལ་ནིའི་དོན་ལུ་ ལོ་ཀཱལ་ནེཊི་སྣོད་ཐོ་གཅིག་ལས་ ཀམ་པོསི་འདི་ བཟོ་བཏོན་འབད།

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

སྔོན་སྒྲིག་བཟོ་བཏོན་འབད་ཡོད་པའི་བང་རིམ་འདི་གིས་ གསལ་སྟོན་འབདཝ་ཨིན།

- མཉམ་རོགས་ P2P འདྲེན་ལམ་ `1337` ལས་ `1340`
- Torii HTTP གྱི་སྒོ་ར་སྒོ་ཚུ་ `8080` ལས་ `8083`
- `./localnet/client.toml` ལུ་ གྲ་སྒྲིག་འབད་ཡོད་པའི་ མཁོ་སྤྲོད་རིམ་སྒྲིག་ཅིག

## 2. གློག་ཐག་ར་བ་འདི་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་ བརྟག་དཔྱད་འབད་ {#_2-verify-that-the-network-is-up}

འདྲ་མཉམ་དང་པ་གུ་གནས་ཚད་མཇུག་སྣོད་ཞིབ་དཔྱད་འབད།

```bash
curl http://127.0.0.1:8080/status
```

སྔོན་སྒྲིག་གསོ་བའི་བརྟག་དཔྱད་ཚུ་གིས་ཡང་ལག་ལེན་འཐབ་ཨིན།

```bash
curl http://127.0.0.1:8080/status/blocks
```

ཁྱོད་ཀྱིས་དེ་འཕྲོ་ལས་ CLI བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ ཞབས་ཏོག་ལེན་མི རིམ་སྒྲིག ལུ་བཏོན་ཚུགས།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus དཔྱད་ཡིག་ {#_3-nexus-profile}

མཛོད་ཁང་འདི་གིས་ `defaults/nexus/` གི་འོག་ལུ་ SORA Nexus གཞི་བཞག་པའི་རིམ་སྒྲིག་གསལ་སྡུད་ཡང་བཏངམ་ཨིན།

Nexus གི་ཡིག་གཟུགས་དང་གཅིག་ཁར་ རང་ལུགས་ཀྱི་ འདྲ་མཉམ་ཅིག་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

`defaults/nexus/client.toml` ལག་ལེན་འཐབ་ནི་དེ་ CLI ཌའི་ལོག་གི་ཁ་བྱང་ཨིན།

## 4. ས་གནས་ཀྱི་དྲ་རྒྱ་འདི་ བཀག་གཏང་། {#_4-stop-the-local-network}

ས་གནས་ཀྱི་བཟོ་བཏོན་འབད་ཡོད་པའི་ལོ་ཀཱལ་ནེཊི་གི་དོན་ལུ་:

```bash
./localnet/stop.sh
```

བཟོ་བཏོན་འབད་ཡོད་པའི་ ཀམ་པོསི་བརྩེགས་ཕུང་གི་དོན་ལུ་:

```bash
docker compose -f ./docker-compose.yml down
```

འབྲེལ་བ་འཐབ་པའི་ཤུལ་ལས་ [ལས་འགོ་བཙུགས་ཏེ་ Iroha 3 བརྒྱུད་དེ་འབད་ CLI](/dz/get-started/operate-iroha-via-cli.md).
