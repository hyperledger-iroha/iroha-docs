---
translation_locale: dz
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: human-reviewed
---
# Iroha ཌའི་ལོག་ཚུ་དང་གཅིག་ཁར་ལཱ་འབད་ {#working-with-iroha-binaries}

Iroha 3 ཨོ་པེ་རེ་ཊར་གྱི་ལཱ་རྒྱུན་ལམ་འདི་ གཞི་རྟེན་གཉིསཔ་༤ གི་མཐའ་འཁོར་ལུ་འགྱོ་དོ་ཡོདཔ་ཨིན།

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) ཡོངས་འབྲེལ་གྱི་མཉམ་རོགས་ཌེ་མཱོན་གཡོག་བཀོལ་ནིའི་དོན་ལུ་ཨིན།
- `iroha3d_taira` ཚད་ལྡན་ Taira བདེན་ཁུངས་སྐྱེལ་འཕྲུལ་ཆས་གཏང་ཐངས་ཀྱི་དོན་ལུ་
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)གི་དོན་ལུ་ CLI དང་ ལས་འཛིན་གྱི་བཀའ་རྒྱ་ཚུ་
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) གི་ལྡེ་མིག་ཚུ་དང་ གཞི་རྟེན་འབྱུང་ཁུངས། ས་གནས་ཀྱི་དྲ་ཚིགས་དང་ ཡིག་གཟུགས་ཚུ་གི་དོན་ལུ་

## གཞི་རྟེན་ནང་ལས་ བཟོ་སྐྲུན་འབད་ {#build-from-source}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ ས་ཁོངས་ཀྱི་རྩ་ལས་:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

དེ་ལས་ བཏོན་གཏང་གཉིས་ལྡན་ཚུ་ `target/release/` ནང་ལུ་འཐོབ་ཚུགས།

བརྡ་བཀོད་ཁ་ཐོག་བརྟག་དཔྱད་འབད་ནི་ལུ་:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## ཟུར་བཞག་ཁང་ནང་ལས་ ཐད་ཀར་དུ་འཐུ་འབད། {#run-directly-from-the-repository}

ཁྱོད་ཀྱིས་ འཛམ་གླིང་ནང་ ག་ཅི་ཡང་ གཞི་བཙུགས་འབད་མ་དགོ་པ་ཅིན་ `cargo run` ལག་ལེན་འཐབ།

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker པར་འདི་ {#docker-image}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་འདི་ `kagami localnet` དང་ `kagami docker`ཚུ་ལག་ལེན་འཐབ་ཐོག་ལས་ Docker Compose ཡིག་སྣོད་ཚུ་ བཟོ་སྐྲུན་འབད་དོ་ཡོདཔ་ད་ ཡིག་སྣོད་དེ་ ཐོ་བཀོད་འབད་ཚར་མི་ ལས་རིམ་ཨང་རྟགས དང་གཅིག་ཁར་ མཐོངམ་ཨིན། པར་བརྙན་ `hyperledger/iroha:dev` འདི་ཡང་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་དང་གཅིག་ཁར་ ལག་ལེན་འཐབ་ཚུགས།

CLI ཆ་ཚན་ནང་འབད།

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami སྦ་སྣོད་ནང་འབད།

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

མཉམ་རོགས་འགོ་བཙུགས་ནིའི་དོན་ལུ་ ལོ་ཀཱལ་ནེཊི་ཅིག་བཟོ་བཏོན་འབད་ཞིནམ་ལས་ དང་པ་རང་ ཡིག་སྣོད་བརྩམས།

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## ང་གིས་ ལག་ལེན་འཐབ་དགོ་པའི་ སྦིན་རི་གང་ཡོདཔ་ཨིན་ན? {#which-binary-should-i-use}

- ཁྱོད་ཀྱིས་ `iroha3d` ལག་ལེན་འཐབ་ད་ ཡང་ན་ མི་མང་གི་ Taira བདེན་དཔྱད་པ གསར་བཏོན་ གྱི་ཕྱི་ཁར་ དངོས་པོ་ཚུ་འགོ་བཙུགས་ནི་དང་ལག་ལེན་འཐབ་ནི་ཨིན།
- Taira སྒྲིང་སྒྲི་ལག་ལེན་གྱི་དོན་ལུ་རྐྱངམ་ཅིག་ `iroha3d_taira --sora` ལག་ལེན་འཐབ་ཨིན། འདི་གིས་ Taira གི་ཐིག་ཁྲམ་, གསོག་འཇོག་དང་ ལག་བསྟར་མཉེན་ཆས-མིང་རྟགས་འགོད་མི གསལ་སྡུད འདི་བཙུག་འོང་།
- ཁྱོད་ཀྱིས་ རྩིས་ཐོ་འདྲི་དཔྱད་འབད་དགོཔ་དང་ ཚོང་འབྲེལ་ཚུ་བཙུགས་དགོཔ་ ཡང་ན་ བཀོལ་སྤྱོད་པའི་མཇུག་སྣོད་ཚུ་བརྟག་ཞིབ་འབད་དགོཔ་ད་ `iroha` ལག་ལེན་འཐབ།
- ཁྱོད་ལུ་ལྡེ་མིག་དང་ རིགས་མཚན་གསལ་སྟོན་ གསལ་སྡུད་བང་སྒྲིག་ ཡང་ན་ ལོ་ཀཱལ་ནེཊི་རྒྱུ་དངོས་ཚུ་དགོ་པའི་སྐབས་ `kagami` ལག་ལེན་འཐབ།
