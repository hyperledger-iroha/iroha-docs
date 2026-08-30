---
translation_locale: dz
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Bare Metal ལུ་ Iroha འགྲུལ་བསྐྱོད་འབདཝ་ཨིན། {#running-iroha-on-bare-metal}

ཁྱོད་ཀྱིས་ Docker Compose གྱི་ཚབ་ལུ་ གྲྭ་ཚང་ཚུ་ host གི་ནང་ལུ་ཐད་ཀར་དུ་ལག་ལེན་འཐབ་དགོ་པའི་སྐབས་ འ་ནི་ལཱ་རྒྱུན་ལམ་འདི་ལག་ལེན་འཐབ་ཨིན། ད་ལྟོའི་འབྱུང་ཁུངས་ཤིང་འདི་གིས་ Kagami བཟོ་སྐྲུན་འབད་མི་ཚུ་བཀོད་དོ་ཡོདཔ་ད་ འདི་གིས་མཐུན་རྐྱེན་འབྱུང་ཁུངས། གྲྭ་ཚང་བཟོ་ཐབས། སྲིད་འཛིན་བཟོ་ཐབས། དེ་ལས་ start/stop scripts འདི་ཡང་བཀོད་འོང་།

## ༡ ཌའི་ལོག་ཚུ་བཟོ་ནི། {#_1-build-the-binaries}

Iroha ལས་འགུལ་གྱི་ས་ཁོངས་ནང་ལས་:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

འདི་གིས་:

- `target/release/iroha3d` འདྲན་འདྲ་གི་ daemonགི་དོན་ལུ་
- `target/release/iroha` གྱི་དོན་ལུ་ CLI
- `target/release/kagami` key, genesis དང་ localnet བཟོ་སྐྲུན་འབད་ནིའི་དོན་ལུ་

## 2. ས་གནས་ཀྱི་དྲ་ལམ་བཟོ་ནི། {#_2-generate-a-local-network}

ཌའི་ལོག་གི་ས་སྒོ་ནང་ Iroha 3 བཞི་ལྡེ་མིག་ཅིག་བཟོ་ནི།

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

ཕྱིར་ཐོན་པའི་ཐོ་ཡིག་ནང་ལུ་ ཐོན་སྐྱེད་འབད་མི་ `genesis.json`, `genesis.signed.nrt`, peer`config.toml` files, `client.toml`, helper scripts དེ་ལས་ ཐོན་སྐྱེད་འབད་ཡོད་མི་ `README.md` འདི་གི་དོན་ལུ་གཏན་འབེབ་བཀའ་བཀོད་ཚུ་ཡོདཔ་ཨིན།

## ༣. དོ་འགྲན་འབད་མི་འགོ་ཚུགས། {#_3-start-peers}

བཟོ་སྐྲུན་འབད་བཏུབ་པའི་ localnet གི་དོན་ལུ་, བཟོ་སྐྲན་འབད་མི་ script འདི་ལག་ལེན་འཐབ་དགོ།

```bash
./localnet/start.sh
```

ཁྱོད་ཀྱིས་ རེ་རེ་ཆ་མཉམ་འདི་ systemd བཟུམ་ཅིག་སྦེ་ བྱ་རིམ་འཛིན་སྐྱོང་ནང་བཙུགས་དགོ་པ་ཅིན་ རེ་རེ་གཅིག་གི་དོན་ལུ་ `./localnet/README.md` ལུ་ཐོ་བཀོད་འབད་ཡོད་པའི་ འགོ་བཙུགས་ནིའི་བཀའ་རྒྱ་ལག་ལེན་འཐབ་ཨིན། རེ་རེ་རེ་རེའི་ `config.toml` དང་ སྒེར་གྱི་ལྡེ་མིག་ དེ་ལས་ ཐོ་བཀོད་ཡིག་སྣོད་དང་སྒོ་ར་ཚུ་སོ་སོ་སྦེ་བཞག་དགོ།

## 4.དྲ་རྒྱ་འདི་ལག་ལེན་འཐབ་དགོ། {#_4-operate-the-network}

བཟོ་སྐྲུན་འབད་མི་ client config ལག་ལེན་འཐབ་:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

བཟོ་སྐྲུན་འབད་ཡོད་པའི་ localnet འདི་སེལ་འཐུ་འབད།

```bash
./localnet/stop.sh
```

## 5. བཟོ་སྐྲུན་གྱི་ཐོ་ཚུ་ {#_5-production-notes}

- བཟོ་སྐྲུན་གྱི་དོན་ལུ་ སྒེར་གྱི་ལྡེ་མིག་གསརཔ་ཚུ་བཟོ་སྟེ་ བཙུགས་ཞིནམ་ལས་ ནང་འདྲེན་ཁང་གི་ཕྱི་ཁར་བཞག་དགོ།
- འདྲན་འདྲ་མཉམ་པ་ཆ་མཉམ་ལུ་ ཡི་གུ་བཀོད་མི་ འབྱུང་ཁུངས། ཚོང་འབྲེལ་གྱི་ཐད་ཁར་ གྲོས་བསྟུན་འབད་བཅུགཔ་ཨིན། ཐོ་བཀོད་དང་ཡིད་རྟོན་རུང་བའི་འདྲན་འདྲ་ཚུ་ དེ་ལས་ བདེན་ཁུངས་བཀལ་མི་འདི་ PoPs
- གློག་ཀླད་གོ་མི་གིས་ host-local interfaces ལུ་ bond address བྱིན་དོ་ཡོདཔ་ད་ peer འདི་གཞན་འཕྲུལ་ཆས་ཚུ་ལས་ བཏོན་མ་ཚུགསཔ་སྦེ་མཐོང་འོང་།
- Torii ཚོར་སྣང་, གཞི་རྟེན་ auth, TLS དང་ རེ་རེ་ཚད་འཛིན་གི་དོན་ལུ་ རྒྱབ་ལོག་བརྡ་ཚབ་ ཡང་ན་ ཉེན་སྲུང་གི་ལྕགས་རི་ལག་ལེན་འཐབ་ནི།
- འབྱུང་ཁུངས། ཡང་ན་ གྲོས་བསྟུན་ཀྱི་ གནས་གོང་ནང་ལུ་ བསྒྱུར་བཅོས་ཚུ་ གཅིག་ལས་གཅིག་འབད་མི་ ཡིག་སྣོད་བཟོ་བཀོད་མེན་པར་ མཉམ་འབྲེལ་ཅན་གྱི་ གནས་སྤོ་འགྲུལ་ཅིག་སྦེ་འབད་དགོ།

containerized ས་གནས་གོང་འཕེལ་གྱི་དོན་ལུ་ [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose ཀྱི་ལཱ་རྒྱུན་ལམ་ལག་ལེན་འཐབ་དགོ།
