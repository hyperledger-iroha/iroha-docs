---
translation_locale: dz
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: human-reviewed
---
# གཞི་བཙུགས་འབད་ Iroha 3 {#install-iroha-3}

ཤོག་ལེབ་འདི་གིས་ ཡར་འཕར་ `hyperledger-iroha/iroha` ལཱ་གི་ས་སྒོ་ལག་ལེན་འཐབ་སྟེ་ Iroha 3 ལག་ཆས་རིམ་སྒྲིག་དང་གཉིས་ལྡན་ཚུ་གི་དོན་ལུ་ ད་ལྟོའི་གཞི་བཙུགས་ལཱ་གི་རྒྱུན་རིམ་འདི་ཁྱབ་ཚུགསཔ་ཨིན།

## ༡ སྔོན་འགོག་གི་གནས་སྟངས་ཚུ་ {#_1-prerequisites}

དང་པོ་འདི་དག་བཙུགས།

- [rustup](https://www.rust-lang.org/tools/install) འདི་འབདཝ་ལས་ མཐུད་སྦྲེལ་འབད་ཡོད་པའི་ `rust-toolchain.toml` ལག་ཆས་སྤོག་ (`1.93.1`) འདི་ རང་བཞིན་གྱིས་བཙུགས་འབདཝ་ཨིན།
- `git`
- གདམ་ཁ་རྐྱབ་པ་ཅིན་ Docker དང་ Docker Compose གི་དོན་ལུ་ ས་གནས་ཀྱི་ སྣ་མང་ཆ་མཉམ་པ མགྱོགས་འགོ

## 2. ལས་ཁང་གི་བར་སྟོང་ངོ་བཤུས་རྐྱབས་ {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## ལཱ་གི་ས་སྒོ་དེ་ བཟོ་དགོ {#_3-build-the-workspace}

ག་ར་བཟོ་བསྐྲུན་འབད།

```bash
cargo build --workspace
```

བཀོལ་སྤྱོད་པ་ལུ་དམིགས་གཏད་བསྐྱེད་མི་བཟོ་བསྐྲུན་ཆུང་བ་ཅིག་གི་དོན་ལུ་ གཉིས་ལྡན་ངོ་མ་ཚུ་རྐྱངམ་ཅིག་བསྡུ་སྒྲིག་འབད།

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

གྲུབ་འབྲས་གཉིས་ལྡན་ཚུ་ `target/debug/` ཡང་ན་ `target/release/` ལུ་བྲིས་ཡོདཔ་ཨིན།

## 4. གཞི་བཙུགས་འབད་མི་ ལག་ཆས་ཚུ་ བརྟག་ཞིབ་འབད་ {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ཁྱོད་ཀྱིས་སྤྱིར་བཏང་ལག་ལེན་འཐབ་ནི་ཨིན་པའི་གཉིས་ལྡན་བཞི་ནི།

- ཚད་ལྡན་མཉམ་རོགས་ཌེ་མཱོན་གྱི་དོན་ལུ་ `iroha3d`
- `iroha3d_taira` ཚད་ལྡན་ Taira བདེན་ཁུངས་སྐྱེལ་འཕྲུལ་ཆས་གཏང་ཐངས་ཀྱི་དོན་ལུ་
- `iroha`གི་དོན་ལུ་ CLI རྒྱུན་འགྲུལ་འཐབ་མི་ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ Torii དང་ ལས་འཛིན་གྱི་མཐའན་མཇུག་གི་སྒོ་ཚུ་
- ལྡེ་མིག་དང་ རིགས་མཚན་གསལ་སྟོན་ དེ་ལས་ ལོ་ཀཱལ་ནེཊི་གསལ་སྡུད་ཚུ་གི་དོན་ལུ་ `kagami`

## 5. གདམ་ཁ་ཅན་གྱི་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ དང་ Docker འགྲུལ་ལམ་ {#_5-optional-localnet-and-docker-path}

ད་ལྟོའི་འབྱུང་ཁུངས་རྒྱབ་སྐྱོར་འབད་མི་ ལོ་ཀཱལ་ནེཊི་རྒྱུན་རིམ་འདི་ Kagami གིས་བཟོ་བཏོན་འབད་ཡོདཔ་ཨིན། འདི་གིས་ ཡོངས་འབྲེལ་གྱི་མཉམ་རོགས་རིམ་སྒྲིག་དང་ བཀག་ཆ་རིགས་མཚན་གྱི་ཅ་ཆས་ མཁོ་སྤྲོད་འབད་མི་རིམ་སྒྲིག་ གྲོགས་རམ་ཡིག་ཚུགས་ཚུ་ དེ་ལས་ བརྟག་ཞིབ་འབད་ཡོད་པའི་ཨང་རྟགས་དང་མཐུན་སྒྲིག་འབད་མི་ གདམ་ཁ་ཅན་གྱི་རྩོམ་སྒྲིག་ཡིག་སྣོད་ཚུ་བྲིསཝ་ཨིན།

- `kagami localnet` ས་གནས་ཀྱི་ཉེ་གནས་མཉམ་རོགས་ཡིག་གཟུགས་ཚུ་གི་དོན་ལུ་
- `kagami docker` གི་དོན་ལུ་ Docker Compose འདི་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ ཐོ་བཀོད་ནང་ལས་ ཐོན་ཡོདཔ་ཨིན།

[འགོ་བཙུགསཔ་ད་ Iroha 3](/dz/get-started/launch-iroha.md).
