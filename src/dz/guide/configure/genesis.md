---
translation_locale: dz
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# འོད་ཁམས། {#genesis}

ཨེབ་གོང་འདི་ འགོ་ཐོག་གི་ ལྕགས་ཀྱུའི་གནས་སྟངས་ལུ་འགྲེལ་བཤད་འབདཝ་ཨིན། བསྒྱུར་བཅོས་འབད་ཚུགས་པའི་འབྱུང་ཁུངས་འདི་ JSON ཌའི་ལོག་ཅིག་ཨིནམ་ད་ Iroha 3 མཚམས་སྦྱོར་འདི་གིས་ Norito ཌའི་ཡིག་སྣོད་ལག་ལེན་འཐབ་ཨིན།

::: details སྔོན་སྒྲིག་གི་འབྱུང་ཁུངས།

<<< @/snippets/genesis.json

:::

## ཡིག་སྣོད་ཚུ་ {#files}

`defaults/genesis.json` ལུ་ གཞི་སྒྲིག་འབད་ཡོད་པའི་ཁ་བྱང་འདི་ Upstream Repository གིས་བཏང་དོ་ཡོདཔ་ཨིན། Kagami བཟོ་སྐྲུན་འབད་མི་ Networksགིས་ output directory ནང་ རང་སོའི་ manifest དང་ Signed Transaction འདི་འབྲི་དོ་ཡོདཔ་ཨིན།

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

འདི་ནང་ལུ་ ཐོན་སྐྱེད་འབད་མི་ `README.md` གིས་ གདམ་འཐུ་འབད་ཡོད་པའི་ཡིག་གཟུགས་ཀྱི་དོན་ལུ་ འབྲི་ཤོག་ཚུ་དང་ འགོ་བཙུགས་ནིའི་བཀའ་རྒྱ་ཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན།

## འདྲན་འདྲ་གི་སྒྲིག་གཞི། {#peer-configuration}

`config.toml` གི་ས་ཆ་ནང་ `[genesis]` ལུ་མིང་རྟགས་བཀོད་ཡོད་པའི་ genesis transaction གྱི་མཉམ་རོགས་ཚུ་:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

མཉམ་འབྲེལ་ཚོགས་པ་ག་ར་གིས་ genesis transaction དང་ genesis public key ལུ་ གྲོས་བསྟུན་འབད་དགོཔ་ཨིན།

## འཐོག་མ་ཡི་གུ་གི་རྟགས་བཀོད་ {#signing-genesis}

ཁྱོད་ཀྱིས་ ལག་པའི་ཐོག་ལས་ བརྡ་འགྲེལཔ་ཅིག་ བསྒྱུར་བཅོས་འབད་བ་ཅིན་ གྲྭ་ཚང་ཚུ་ འགོ་བཙུགས་པའི་ཧེ་མར་ ཆ་འཇོག་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS ཡང་ན་ Nexus འདྲ་བཤུས་ཚུ་གི་དོན་ལུ་ Topologyདང་ BLS Proof of Possession འདི་བཟོ་སྐྲུན་འབད་ཡོད་པའི་འདྲ་བཤུས་ཀྱི་དོན་ལས་ དགོཔ་ཨིན། Kagami `localnet`, `wizard` དེ་ལས་འདྲ་བཤུས་བཟོ་སྐྲུན་གྱི་བཀའ་རྒྱ་ཚུ་གིས་ གནད་སྡུད་ཚུ་ རང་བཞིན་གྱིས་ལག་ལེན་འཐབ་འོང་།

## འཐོག་མ་ཡི་དེབ་འདི་ ལོག་བཙུགས་ནི་ {#recommitting-genesis}

གྲྭ་ཚང་ཅིག་གིས་ genesis བཏུབ་ནི་དེ་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་ localnetནང་ལུ་ genesis གསརཔ་ཅིག་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ རྭ་ཚང་ཚུ་ བཀག་གཏང་ནི་དང་ ཁོང་རའི་བྱུང་ཡོད་པའི་ state directory འདི་བཏོན་ཏེ་ signing genesis གསོ་བ་ལས་འགོ་བཙུགསཔ་ཨིན། ཁྱབ་སྤེལ་འབད་ཡོད་པའི་ net ལུ་ genesis བསྒྱུར་བཅོས་མ་འབད་ ག་དེམ་ཅིག་སྦེ་ validator ཆ་མཉམ་ཀྱིས་ migration དེ་བཟུམ་སྦེ་རང་ འབྲེལ་བ་འཐབ་མ་ཚུགསཔ་ཨིན།
