---
translation_locale: dz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: human-reviewed+reviewed-delta
---
# Docker ཆ་ཚན་ནང་ལུ་དྲོད་འབར་གྱི་བསྐྱར་བཅོས་འབད་ Iroha {#hot-reload-iroha-in-a-docker-container}

འཕྲལ་འཕྲལ་ལོག་བཙུགས་ནི་འདི་རང་སའི་རྐྱེན་སེལ་གྱི་དོན་ལུ་རྐྱངམ་ཅིག་ལག་ལེན་འཐབ། Docker ནང་གཞི་རྟེན་ཨང་རྟགས་ཀྱི་ཐོན་རིམ་གཅིག་ལས་བཟོ་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ལག་ལེན་འཐབ་སྟེ་ ངེས་དཔྱད་འབད་མི་བཞི་འགོ་བཙུགས་ནིའི་དོན་ལུ་ [འགོ་བཙུགས Iroha 3](/dz/get-started/launch-iroha.md) ལམ་སྟོན་ལུ་གཟིགས།

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

སྣོད་འཛིན་འཚོལ་ནིའི་དོན་ལུ་ `docker ps` ལག་ལེན་འཐབ། ལྟག་རྒྱབ་ཀྱི་ལས་རིམ་མ་བརྗེ་བའི་ཧེ་མ་ པར་གཟུགས་ནང་གི་འགྲུལ་ལམ་ཞིབ་དཔྱད་འབད།

## ཇི་ནེསི་འདི་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་དྲ་ལམ་ནང་ལུ་ ལོག་སྤྱོད་འབད། {#recommit-genesis-in-a-disposable-network}

འགོ་ཐོག་གི་བཀག་ཆ་གསརཔ་གི་དོན་ལུ་ མཉམ་རོགས་ཀྱི་གསོག་འཇོག་སྟོངམ་དགོ། ཡོངས་འབྲེལ་དེ་ཉིད་ལོག་འགོ་བཙུགས་ནིའི་དོན་ལུ་ `python3 poc.py down` དང་དེ་ལས་ `python3 poc.py up` ལག་ལེན་འཐབ། `state/` འདི་ Docker གི་གསོག་འཇོག་བཞི་དང་གཅིག་ཁར་བཞག།

## རང་བཞིན་གྱི་སྒྲིག་གཞི་ལག་ལེན་འཐབ་ {#use-custom-configuration}

ད་ལྟོའི་མཉམ་རོགས་རིམ་སྒྲིག་འདི་ TOML ཨིན། Kagami གིས་ བདེན་དཔྱད་འབད་མི་རེ་རེའི་དོན་ལུ་ `genesis.signed.nrt`, `genesis.public_key`, དང་ `genesis.expected_hash` ཡོད་པའི་ `peerN.toml` གཅིག་ བཟོ་བཏོན་འབདཝ་ཨིན། `kagami docker` ལས་ཐོན་མི་ Compose ཡིག་སྣོད་ཀྱིས་ དེ་ཚུ་ སྣོད་ཆས་ནང་ སྦྲེལ་བཙུགས་འབདཝ་ཨིན། ཡིག་སྣོད་ཚུ་ ལག་ཐོག་ལས་ འདྲ་བཤུས་མ་རྐྱབ་བར་ དེ་འདི་ ལོག་བཟོ་བཏོན་འབད་ཞིནམ་ལས་ མཉམ་རོགས་འདི་ ལོག་འགོ་བཙུགས། བཟོ་བཏོན་འབད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ གཅིག་ཁར་བཞག། Kagami གཡོག་བཀོལ་ཐེངས་སོ་སོ་ལས་ ཡིག་སྣོད་ཚུ་ བསྲེ་བ་ཅིན་ གནད་སྡུད་སླར་སྒྱུར་ ཡང་ན་ མོས་མཐུན་གྱི་འཐུས་ཤོར་ འབྱུང་ཚུགས།
