---
translation_locale: dz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གློག་ཤུགས་གཏང་ཐབས། Iroha 3 {#launch-iroha-3}

འ་ནི་ཤོག་ལེབ་འདི་ Iroha 3 གི་དོན་ལུ་ ད་ལྟོའི་གནས་སྐབས་ཀྱི་ ས་གནས་ཁ་ཐུག་གི་ཐོ་བཀོད་ལམ་བརྒྱུད་དེ་འགྱོ་དོ་ཡོདཔ་ད་ སྔོན་སྒྲིག་ལཱ་ས་ཁོངས་ རྒྱུ་དངོས་ཚུ་ Upstream སྒྲིག་མཛོད་ནང་ལས་ལག་ལེན་འཐབ་སྟེ་ཨིན།

## 1. ས་གནས་ཀྱི་ མང་ཤོས་ཅིག་གི་དྲ་ལམ་བཟོ་ནི། {#_1-generate-a-local-multi-peer-network}

ད་ལྟོའི་ Kagami ཀོ་ཌ་ནང་ལས་ ཌོག་ཊར་༤ གི་ localnet བཟོ་:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ཕྱིར་བཏོན་པའི་ཐོ་ཡིག་ནང་ལུ་ ཕན་ཁྱད་ཅན་གྱི་མཉམ་འབྲེལ་སྒྲིག་གཞི་ཚུ་ `genesis.json`, `genesis.signed.nrt`, `client.toml`དང་ རྒྱབ་སྐྱོར་ཡིག་འབྲུ་ཚུ་ཡོདཔ་ཨིན།

ས་གནས་ཀྱི་དུ་པ་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལས་ རང་བཞིན་གྱི་མེ་ཏོག་ཚུ་ ཐད་ཀར་དུ་འགོ་འདྲེན་འཐབ་དགོ།

```bash
./localnet/start.sh
```

containerized runགི་དོན་ལུ་ localnet directoryནང་ལས་ Compose བཟོ་དགོ།

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

རང་བཞིན་གྱིས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ Stack གིས་:

- འདྲན་འདྲ་ P2P གི་སྒོ་ར་སྒོ་ `1337` ལས་ `1340`
- Torii HTTP གྱི་སྒོ་ར་སྒོ་ཚུ་ `8080` ལས་ `8083`
- ཁྱོད་ཀྱིས་ `./localnet/client.toml` ལུ་ གྲ་སྒྲིག་འབད་ཚར་བའི་ client config བཟོ་ཚུགས།

## 2. གློག་ཐག་ར་བ་འདི་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་ བརྟག་དཔྱད་འབད་ {#_2-verify-that-the-network-is-up}

གནས་སྟངས་མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ཐོག་ལུ་ བརྟག་ཞིབ་འབད་:

```bash
curl http://127.0.0.1:8080/status
```

ནད་གཞི་བརྟག་དཔྱད་ཚུ་ནང་ལུ་ཡང་:

```bash
curl http://127.0.0.1:8080/status/blocks
```

ཁྱོད་ཀྱིས་དེ་འཕྲོ་ལས་ CLI བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ client config ལུ་བཏོན་ཚུགས།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus དཔྱད་ཡིག་ {#_3-nexus-profile}

སྒྲིག་གཞི་འདི་ SORA Nexus ཕྱོགས་སྟོན་འབད་ཡོད་པའི་སྒྲིག་གཞི་བཟོ་ནིའི་ཐོ་ཡིག་ཡང་ `defaults/nexus/` ལུ་བཏང་ཡོདཔ་ཨིན།

Nexus གི་ཡིག་གཟུགས་དང་གཅིག་ཁར་ རང་ལུགས་ཀྱི་ འདྲ་མཉམ་ཅིག་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

`defaults/nexus/client.toml` ལག་ལེན་འཐབ་ནི་དེ་ CLI ཌའི་ལོག་གི་ཁ་བྱང་ཨིན།

## 4. ས་གནས་ཀྱི་དྲ་རྒྱ་འདི་ བཀག་གཏང་། {#_4-stop-the-local-network}

རང་ལུགས་ཀྱི་ localnet གི་དོན་ལུ་:

```bash
./localnet/stop.sh
```

བཟོ་སྐྲུན་འབད་ཡོད་པའི་ Compose Stack གི་དོན་ལུ་:

```bash
docker compose -f ./docker-compose.yml down
```

འབྲེལ་བ་འཐབ་པའི་ཤུལ་ལས་ [ལས་འགོ་བཙུགས་ཏེ་ Iroha 3 བརྒྱུད་དེ་འབད་ CLI](/dz/get-started/operate-iroha-via-cli.md).
