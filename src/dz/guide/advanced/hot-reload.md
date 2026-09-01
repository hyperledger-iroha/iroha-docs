---
translation_locale: dz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: human-reviewed
---
# Docker ཆ་ཚན་ནང་ལུ་དྲོད་འབར་གྱི་བསྐྱར་བཅོས་འབད་ Iroha {#hot-reload-iroha-in-a-docker-container}

ས་གནས་ཀྱི་དཀའ་ངལ་སེལ་ནིའི་དོན་ལུ་རྐྱངམ་ཅིག་ ཧོཊ་ཨར་ལེཌ ལག་ལེན་འཐབ་ཨིན། རང་བཞིན་གྱི་ ས་གནས་གོང་འཕེལ་གྱི་དོན་ལུ་ པར་འདི་བསྐྱར་བཟོ་ནི་དང་ ཡང་ན་ གསར་འགྱུར་གྱི་ Kagami ཆ་ཚན་ནང་ལས་ ཐོན་སྐྱེད་འབད་མི་ Docker Compose ལྕགས་ཟམ་དེ་ ལོག་འགོ་བཙུགས་ནི་འདི་ གདམ་ཁ་རྐྱབ་ཨིན།

## མཐུད་མཚམས་ཉིས་ལྡང་གི་ཚབ་ལུ་ {#replace-the-peer-binary}

ཡར་འཕེལ་གྱི་ལཱ་གི་ས་སྒོ་ལས་ ལི་ནགསི་མཐུན་སྒྲིག་ཅན་གྱི་ཌེ་མཱོན་གཉིས་ལྡན་ཅིག་བཟོ་བསྐྲུན་འབད།

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

གཡོག་བཀོལ་བའི་མཉམ་རོགས་ཀྱི་དོས་ནང་ལུ་འདྲ་བཤུས་རྐྱབས་ཞིནམ་ལས་ དོས་དེ་ལོག་སྟེ་འགོ་བཙུགས།

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

དོས་ཁང་གི་མིང་ངེས་དཔྱད་འབད་ནི་ལུ་ `docker ps` ལག་ལེན་འཐབ། བཟོ་བཏོན་འབད་ཡོད་པའི་བང་རིམ་ནང་ལུ་ མཉམ་རོགས་ཀྱི་དོས་ཚུ་ `./docker-compose.yml` གིས་ངེས་འཛིན་འབད་ཡོདཔ་ཨིན།

## ཇི་ནེསི་འདི་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་དྲ་ལམ་ནང་ལུ་ ལོག་སྤྱོད་འབད། {#recommit-genesis-in-a-disposable-network}

མཉམ་རོགས གི གསོག་འཇོག སྟོངམ་ཨིན་པའི་སྐབས་རྐྱངམ་གཅིག འགོ་ཐོག གཏན་འཁེལ འབདཝ་ཨིན། ཚར་གཅིག་སྤྱོད་ནི Docker དྲ་རྒྱ གི་དོན་ལུ བང་བསྒྲིག མཚམས་འཇོག་འབད་ བཟོ་སྐྲུན་འབད་ཡོད གནས་སྟངས བཏོན་ མིང་རྟགས་བཀོད་ཡོད འགོ་ཐོག ཆ་ཚན ལོག་བཟོ་ཡང་ན་ཚབ་བཙུགས་ཏེ་ ལོག་འགོ་བཙུགས།

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

གནས་སྟངས་ཉམས་སྲུང་འབད་དགོ་པའི་ཡོངས་འབྲེལ་གུ་རིགས་མཚན་ཚབ་མ་བཙུགས།

## རང་བཞིན་གྱི་སྒྲིག་གཞི་ལག་ལེན་འཐབ་ {#use-custom-configuration}

ད་ལྟོའི་ཅོག་འཐདཔ་བཟོ་རྣམ་འདི་ TOML ཨིན། བཟོ་སྐྲུན་འབད་ཡོད་པའི་ `config.toml`, `genesis.signed.nrt` དང་འབྲེལ་བའི་ལྡེ་མིག་ཡིག་སྣོད་ཚུ་ འདྲ་པར་དེ་གིས་རེ་བ་བསྐྱེད་མི་ སྣོད ཡིག་ལམ་ཚུ ལུ་སྦྲེལ་འབད་ཞིནམ་ལས་ མཉམ་རོགས འདི་སླར་ལོག་འབད་ནི་ཨིན། བཟོ་སྐྲུན་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ གཅིག་ཁར་བཞག་; Kagami རྒྱུན་ལས་སོ་སོར་ལས་ ཡིག་སྣོད་ཚུ་རྫོགསཔ་ད་ ཨེབ་གཏང་འབད་ནི་དང་ ཡང་ན་ མནོ་བསམ་གཏང་ཐངས་མ་མཐུན་པའི་ དཀའ་ངལ་འབྱུང་ཚུགས།
