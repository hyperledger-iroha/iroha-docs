---
translation_locale: dz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker སྦ་སྒོར་ནང་ལུ་དྲོད་འབར་གྱི་བསྐྱར་བཅོས་འབད་ Iroha {#hot-reload-iroha-in-a-docker-container}

ས་གནས་ཀྱི་དཀའ་ངལ་སེལ་ནིའི་དོན་ལུ་རྐྱངམ་ཅིག་ ཧོཊ་ཨར་ལེཌ ལག་ལེན་འཐབ་ཨིན། རང་བཞིན་གྱི་ ས་གནས་གོང་འཕེལ་གྱི་དོན་ལུ་ པར་འདི་བསྐྱར་བཟོ་ནི་དང་ ཡང་ན་ གསར་འགྱུར་གྱི་ Kagami སྦ་སྒོར་ནང་ལས་ ཐོན་སྐྱེད་འབད་མི་ Docker Compose ལྕགས་ཟམ་དེ་ ལོག་འགོ་བཙུགས་ནི་འདི་ གདམ་ཁ་རྐྱབ་ཨིན།

## འདྲན་འདྲ་ཉིས་ལྡང་གི་ཚབ་ལུ་ {#replace-the-peer-binary}

ཌའི་མཱོན་པིན་རི་ཅིག་བཟོ་ནི་འདི་ Linux ལུ་མཐུན་ལྡནམ་ཨིན། ལས་རིམ་གོང་འཕེལ་ལས་ཀ་ནང་ལས་:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

འདི་ལག་ལེན་འཐབ་མི་ འདྲན་འདྲ་རྫ་ནང་ལུ་ ཨེབ་གཏང་འབད་ཞིནམ་ལས་ རྫ་དེ་སླར་ལོག་འབད་ནི་:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

སྦ་སྒོར་གྱི་མིང་འདི་ངོས་འཛིན་འབད་ནིའི་དོན་ལུ་ `docker ps` ལག་ལེན་འཐབ་ཨིན། བཟོ་སྐྲུན་འབད་ཡོད་པའི་ཐིག་ཁྲམ་ནང་ལུ་ གྲྭ་ཚང་གི་སྦ་སྒོའི་མིང་འདི་ `./docker-compose.yml` གིས་གསལ་སྟོན་འབདཝ་ཨིན།

## ཇི་ནེསི་འདི་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་དྲ་ལམ་ནང་ལུ་ ལོག་སྤྱོད་འབད། {#recommit-genesis-in-a-disposable-network}

གྲྭ་ཚང་ཅིག་གིས་ genesis བཏོན་དོ་ཡོདཔ་ད་ འདི་ནང་ལུ་བཞག་སའི་ས་ཆ་འདི་སྟོངམ་སྦེ་ཡོད་མི་འདི་མ་གཏོགས་ཨིན། ཁྱོད་ཀྱིས་ Docker སྒྲིག་ལམ་གཅིག་སྦེ་ ལག་ལེན་འཐབ་མ་དགོ་པའི་དོན་ལུ་, stack འདི་མཚམས་འཇོག་འབད་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་གནས་སྟངས་དེ་བཏོན་གཏང་། ཟུར་རྟགས་བཀོད་མི་ genesis སྦ་སྒོར་དེ་ སླར་ལོག་སླར་གསོ་འབད་ནི་དང་འགོ་བཙུགས:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

གནས་སྟངས་དེ་ བསྲུང་སྐྱོབ་འབད་དགོ་པའི་ ネットワークནང་ལུ་ འབྱུང་ཁུངས་ཀྱི་ཚབ་མ་བཟོ།

## རང་བཞིན་གྱི་སྒྲིག་གཞི་ལག་ལེན་འཐབ་ {#use-custom-configuration}

ད་ལྟོའི་ཅོག་འཐདཔ་བཟོ་རྣམ་འདི་ TOML ཨིན། བཟོ་སྐྲུན་འབད་ཡོད་པའི་ `config.toml`, `genesis.signed.nrt` དང་འབྲེལ་བའི་ལྡེ་མིག་ཡིག་སྣོད་ཚུ་ འདྲ་པར་དེ་གིས་རེ་བ་བསྐྱེད་མི་ container paths ལུ་སྦྲེལ་འབད་ཞིནམ་ལས་ peer འདི་སླར་ལོག་འབད་ནི་ཨིན། བཟོ་སྐྲུན་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ གཅིག་ཁར་བཞག་; Kagami རྒྱུན་ལས་སོ་སོར་ལས་ ཡིག་སྣོད་ཚུ་རྫོགསཔ་ད་ ཨེབ་གཏང་འབད་ནི་དང་ ཡང་ན་ མནོ་བསམ་གཏང་ཐངས་མ་མཐུན་པའི་ དཀའ་ངལ་འབྱུང་ཚུགས།
