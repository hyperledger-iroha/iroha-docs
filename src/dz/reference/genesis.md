---
translation_locale: dz
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# འཕེལ་ཚུའི་ཡིག་ཆ་ {#genesis-reference}

ད་ལྟོའི་ Iroha 3 སྒྲིག་ལམ་ནང་ལུ་ `genesis.json` གི་གསལ་སྒྲགས་ནང་ འབྲེལ་མཐུད་འགོ་བཙུགས་པའི་སྐབས་ལུ་ ལག་ལེན་དང་ ཐབས་ལམ་ཚུ་ འགོ་དང་པ་བཀོད་འོང་།

འདྲ་མཉམ་ཚུ་ལུ་ བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ ཡིག་སྣོད་དེ་ Norito ལུ་ཨེན་ཀོ་ཌེ་འབད་མི་ `.nrt` ཌའི་ལོག་ཅིག་ཨིནམ་ལས་ `kagami genesis sign` གིས་ བཟོ་ཡོདཔ་ཨིན།

## མང་ཤོས་ཀྱི་ ས་ཁོངས་ཚུ་ {#main-fields}

genesis manifest གིས་ འ་ནི་ཚུ་ གསལ་སྟོན་འབད་ཚུགས།

- `chain` སྐུད་ཀྱི་རྟགས་མཚན་གི་དོན་ལུ་
- `executor` གདམ་ཁ་རྐྱབས་ཅན་གྱི་ལག་ལེན་པ་གིས་ བའི་ཊི་ཀོཌ་མཐར་འཁྱོལ་བའི་ལམ་
- `ivm_dir` ཕྱིར་འབུད་དང་ ཡར་དྲག་གཏང་ཐོག་ལས་ལག་ལེན་འཐབ་མི་ IVM དཔེ་མཛོད་ཚུ་གི་དོན་ལུ་།
- `consensus_mode` ཌའི་ལོག་ནང་ གསལ་བསྒྲགས་འབད་མི་ འགོ་ཐོག་གི་གནས་སྟངས་གི་དོན་ལུ་
- `transactions` ཚད་གཞིའི་གནས་གོང་ཚུ་ གསར་གཏོད་འབད་ནི་དང་ ལམ་སྟོན་ཚུ་ བཏོན་གཏང་ཐངས་དང་ ཐོ་བཀོད་འབད་ཐངས་ཚུ་
- `crypto` འགོ་དང་པ་གི་ crypto snapshot གི་དོན་ལུ་

`transactions` གི་ནང་འཁོད་ལུ་ topology ནང་ཐོ་བཀོད་ཚུ་ peer ids དང་ PoPs ལུ་བསྡོམས་འབད་:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## འགྲེམ་ཐོག་ཚོགས་སྟོན་ཅིག་བཟོ་ {#generate-a-manifest}

ཐིག་ཁྲམ་བཟོ་ནིའི་དོན་ལུ་ Kagami ལག་ལེན་འཐབ་:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

མི་མང་གི་ SORA Nexus ཌེ་ཊ་ས་པི་གི་དོན་ལུ་ `npos` འདི་ གྲོས་བསྟུན་འབད་ནིའི་ ཐབས་ལམ་ཅིག་ཨིན། གཞན་མི་ Iroha 3 ལག་ལེན་འཐབ་ཐངས་ཚུ་ནང་ དམིགས་གཏད་ཀྱི་ཡིག་གཟུགས་དང་འཁྲིལ་ཏེ་ ངོས་ལེན་ཅན་གྱི་ ཡང་ན་ NPoS ལག་ལེན་འཐབ་ཚུགས།

## ཐོ་བཀོད་འབད་ {#sign-the-manifest}

JSON བསྒྱུར་བཅོས་དང་བདེན་འཛིན་གྲུབ་པའི་ཤུལ་ལས་ ལག་ལེན་འཐབ་ཚུགས་མི་ `.nrt` སྦྲག་ནང་རྟགས་བཀོད་འབད་:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` གིས་ manifestལས་ genesis public key བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ གཞི་བཙུགས་འབད་ཚུགས་མི་ Signed block བཟོ་སྐྲུན་འབད་ནིའི་དོན་ལུ་ གྲོང་གསེབ་ key, seed དང་ algorithm ལག་ལེན་འཐབ་ཨིན། གྲུབ་འབྲས་འདི་ རང་སོའི་ config ལས་ འབྲེལ་བ་འཐབ་དགོཔ་ཨིན་པའི་ فایلཨིན།

## གཞི་སྒྲིག་འབད་ `irohad` {#configure-irohad}

Daemon གིས་བཀོད་ཡོད་པའི་ genesis block ལུ་ལྟེ་གནས:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## འབྲེལ་ཡོད་ལག་ཆས་ཚུ་ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ཇི་ནེ་རེ་ཊར་ལག་ལེན་དང་བཀའ་བཀོད་གྱི་དོན་ལས་ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) ལུ་བལྟ་དགོ།
