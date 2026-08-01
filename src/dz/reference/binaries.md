---
translation_locale: dz
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ཌའི་ལོག་ཚུ་དང་གཅིག་ཁར་ལཱ་འབད་ {#working-with-iroha-binaries}

Iroha 3 ཨོ་པེ་རེ་ཊར་གྱི་ལཱ་རྒྱུན་ལམ་འདི་ གཞི་རྟེན་གཉིསཔ་གསུམ་གྱི་མཐའ་འཁོར་ལུ་འགྱོ་དོ་ཡོདཔ་ཨིན།

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) འདྲན་འདྲ་གི་ Daemon གི་དོན་ལུ་
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli)གི་དོན་ལུ་ CLI དང་ ལས་འཛིན་གྱི་བཀའ་རྒྱ་ཚུ་
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) གི་ལྡེ་མིག་ཚུ་དང་ གཞི་རྟེན་འབྱུང་ཁུངས། ས་གནས་ཀྱི་དྲ་ཚིགས་དང་ ཡིག་གཟུགས་ཚུ་གི་དོན་ལུ་

## གཞི་རྟེན་ནང་ལས་ བཟོ་སྐྲུན་འབད་ {#build-from-source}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ ས་ཁོངས་ཀྱི་རྩ་ལས་:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

བཙོག་གྲོལ་གྱི་ལྡེ་མིག་ཚུ་ `target/release/` ལུ་བཙུགསཔ་ཨིན།

ཚད་འཛིན་གྱི་ས་ཁོངས་ནང་ལུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## ཟུར་བཞག་ཁང་ནང་ལས་ ཐད་ཀར་དུ་འཐུ་འབད། {#run-directly-from-the-repository}

ཁྱོད་ཀྱིས་གང་རུང་ཅིག་ འཛམ་གླིང་ནང་བཙུགས་མ་དགོ་པ་ཅིན་ `cargo run` ལག་ལེན་འཐབ་:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker པར་འདི་ {#docker-image}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་འདི་ `kagami localnet` དང་ `kagami docker`ཚུ་ལག་ལེན་འཐབ་ཐོག་ལས་ Docker Compose ཡིག་སྣོད་ཚུ་ བཟོ་སྐྲུན་འབད་དོ་ཡོདཔ་ད་ ཡིག་སྣོད་དེ་ ཐོ་བཀོད་འབད་ཚར་མི་ code དང་གཅིག་ཁར་ མཐོངམ་ཨིན། པར་བརྙན་ `hyperledger/iroha:dev` འདི་ཡང་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་དང་གཅིག་ཁར་ ལག་ལེན་འཐབ་ཚུགས།

CLI སྦ་སྒོར་ནང་འབད།

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami སྦ་སྣོད་ནང་འབད།

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

འདྲན་འདྲ་འགོ་འདྲེན་འཐབ་ནིའི་དོན་ལུ་ localnet བཟོ་ཞིནམ་ལས་ དང་པ་ཡིག་སྣོད་འདི་ Compose:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ང་གིས་ ལག་ལེན་འཐབ་དགོ་པའི་ སྦིན་རི་གང་ཡོདཔ་ཨིན་ན? {#which-binary-should-i-use}

- ཁྱོད་ཀྱིས་མཉམ་རུབ་ཚུ་འགོ་བཙུགས་ནི་དང་ ལག་ལེན་འཐབ་པའི་སྐབས་ `irohad` ལག་ལེན་འཐབ་དགོ།
- ཁྱོད་ཀྱིས་ `iroha` ལག་ལེན་འཐབ་ནི་དེ་ ཁྱོད་ཀྱིས་ མདོ་ཆེན་ཡིག་ཚང་ནང་ དྲི་བ་ཞུ་དགོ་པའི་སྐབས་དང་ ཚོང་འབྲེལ་བཙུགས་དགོ་པའི་སྐབས་ ཡང་ན་ ལས་འཛིན་གྱི་མཐའ་མཇུག་གི་སྒོ་ཚུ་ བརྟག་ཞིབ་འབད་དགོ་པའི་སྐབས་ཨིན།
- `kagami` ལག་ལེན་འཐབ་ད་ ཁྱོད་ལུ་ལྡེ་མིག་ཚུ་ དགོས་མཁོ་ཡོདཔ་དང་ genesis manifests, profile bundles ཡང་ན་ localnet assets.
