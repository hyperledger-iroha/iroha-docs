---
translation_locale: dz
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གཞི་བཙུགས་འབད་ Iroha 3 {#install-iroha-3}

འ་ནི་ཤོག་ལེབ་འདི་ Iroha 3 ལག་ཆས་ཀྱི་ཐིག་ཁྲམ་དང་ ཌའི་ལོག་ཚུ་གི་དོན་ལུ་ ད་ལྟོའི་བཙུགས་ནིའི་ལཱ་རྒྱུན་ལམ་ལུ་གཞི་བསྟུན་འབད་དོ་ཡོདཔ་ད་ འདི་གིས་ Upstream `hyperledger-iroha/iroha` ལཱ་ས་ལག་ལེན་འཐབ་ཨིན།

## ༡ སྔོན་འགོག་གི་གནས་སྟངས་ཚུ་ {#_1-prerequisites}

དང་པ་འདི་སེལ་འཐུ་འབད།

- [rustup](https://www.rust-lang.org/tools/install) འདི་འབདཝ་ལས་ མཐུད་སྦྲེལ་འབད་ཡོད་པའི་ `rust-toolchain.toml` ལག་ཆས་སྤོག་ (`1.93.1`) འདི་ རང་བཞིན་གྱིས་བཙུགས་འབདཝ་ཨིན།
- `git`
- གདམ་ཁ་རྐྱབ་པ་ཅིན་ Docker དང་ Docker Compose གི་དོན་ལུ་ ས་གནས་ཀྱི་ multi-peer quickstart

## 2. ལས་ཁང་གི་ས་སྒོ་ཚུ་ clone ചെയ്യുക {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## ལཱ་གི་ས་སྒོ་དེ་ བཟོ་དགོ {#_3-build-the-workspace}

འདི་ཚུ་ག་ར་བཟོ་:

```bash
cargo build --workspace
```

operator-focused བཟོ་སྐྲུན་གྱི་དོན་ལུ་ མང་ཤོས་ཀྱི་པིན་་རི་ཚུ་རྐྱངམ་ཅིག་ བསྡུ་སྒྲིག་འབད་:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

འབྱུང་ཁུངས་ཀྱི་འགྱུར་ལྡེ་ཚུ་ `target/debug/` ཡང་ན་ `target/release/` ལུ་བྲིས་ནུག

## 4. གཞི་བཙུགས་འབད་མི་ ལག་ཆས་ཚུ་ བརྟག་ཞིབ་འབད་ {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ཁྱོད་ཀྱིས་ སྤྱིར་བཏང་སྦེ་ལག་ལེན་འཐབ་མི་ ཌའི་ལོག་གྲངས་༤ འདི་ཚུ་ཨིན།

- `iroha3d` ཚད་ལྡན་པི་རཌ་མཱོན་གི་དོན་ལུ་
- `iroha3d_taira` ཚད་ལྡན་ Taira བདེན་ཁུངས་སྐྱེལ་འཕྲུལ་ཆས་གཏང་ཐངས་ཀྱི་དོན་ལུ་
- `iroha`གི་དོན་ལུ་ CLI རྒྱུན་འགྲུལ་འཐབ་མི་ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ Torii དང་ ལས་འཛིན་གྱི་མཐའན་མཇུག་གི་སྒོ་ཚུ་
- `kagami` ལྡེ་མིག་ཚུ་དང་ འབྱུང་ཁུངས་ཀྱི་ཐོ་ཡིག་ དེ་ལས་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ཚུ་གི་དོན་ལུ་

## 5. གདམ་ཁ་རྐྱབ་མི་ Localnet དང་ Docker Path {#_5-optional-localnet-and-docker-path}

ད་ལྟོའི་ source-backed localnet flow འདི་ Kagami གིས་བཟོཝ་ཨིན། འདི་གིས་ peer config, genesis artifacts, client config, helper scripts དེ་ལས་ checked-out code དང་འདྲ་མཉམ་འབད་མི་ compose ཌའི་ལོག་ཡིག་སྣོད་འདི་འབྲི་འོང་།

- `kagami localnet` རང་ལུགས་ཀྱི་ ས་གནས་ཀྱི་ འདྲ་མཉམ་ཡིག་འབྲུ་ཚུ་གི་དོན་ལུ་
- `kagami docker` གི་དོན་ལུ་ Docker Compose འདི་ localnet ཐོ་བཀོད་ནང་ལས་ ཐོན་ཡོདཔ་ཨིན།

[འགོ་བཙུགསཔ་ད་ Iroha 3](/dz/get-started/launch-iroha.md).
