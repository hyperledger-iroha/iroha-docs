---
translation_locale: dz
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Genesis གཞི་བསྟུན། {#genesis-reference}

ད་ལྟའྱི་ནང་། Iroha 3 ལཱ་གི་རྒྱུན་རིམ།, a `genesis.json` མངོན་གསལ་གྱིས་དང་པ་འདི་འགྲེལ་བཤད་རྐྱབ་ཨིན།
ཡོངས་འབྲེལ་འགོ་བཙུགས་པའི་སྐབས་འཇུག་སྤྱོད་འབད་ནི་ཨིན་མི་ ཚོང་འབྲེལ་དང་ཚད་བཟུང་ཚུ།

མཉམ་རོགས་ཚུ་ལུ་བཀྲམ་སྤེལ་འབད་མི་ མིང་རྟགས་བཀོད་ཡོད་པའི་ ཅ་རྙིང་འདི་ ༡ ཨིན། Norito-ཨིན་ཀོ་ཌིཌི། `.nrt` ཡིག༌སྣོད༌
བཟོ་སྐྲུན་འབད་མི། `kagami genesis sign`.

## ས་སྒོ་གཙོ་བོ། {#main-fields}

རིགས་མཚན་གསལ་སྟོན་འདི་གིས་ ངེས་ཚིག་འགྲེལ་ཚུགས།

- `chain` རིམ་སྒྲིག་ངོས་འཛིན་འབད་མི་གི་དོན་ལུ།
- `executor` གདམ་ཁ་ཅན་གྱི་ལག་ལེན་འཐབ་མི་ཡར་བསྐྱེད་བཱའིཊི་ཀོཌི་འགྲུལ་ལམ་གྱི་དོན་ལུ་
- `ivm_dir` དོན་ལུ་ IVM ཊི་གར་དང་ཡར་བསྐྱེད་ཚུ་གིས་ལག་ལེན་འཐབ་མི་དཔེ་མཛོད་ཚུ།
- `consensus_mode` གསལ་སྟོན་གྱིས་ཁྱབ་བསྒྲགས་འབད་མི་འགོ་ཐོག་ཐབས་ལམ་གྱི་དོན་ལུ་
- `transactions` བཀོད་སྒྲིག་འབད་ཡོད་པའི་ཚད་བཟུང་དུས་མཐུན་བཟོ་ནི་དང་ བཀོད་རྒྱ་ འབྱུང་བྱེད་ཚུ་ དེ་ལས་ ཊོ་པོ་ལོ་ཇི་ཚུ་གི་དོན་ལུ་
- `crypto` འགོ་ཐོག་ཀིརིཔ་ཊོ་པར་ལེན་གྱི་དོན་ལུ་

ནང་འཁོད `transactions`, ཊོ་པོ་ལོ་ཇི་ཐོ་བཀོད་ཚུ་ ཆ་རོགས་ཨའི་ཌི་ཚུ་དང་ PoPs གཅིག༌ཁར:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## གསལ་སྟོན་ཅིག་བཟོ་བཏོན་འབད། {#generate-a-manifest}

ལག་ལེན་འཐབ་ནི Kagami ཊེམ་པེལེཊི་ཅིག་བཟོ་བཏོན་འབད་ནི་ལུ་:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

མི་མང་གི་དོན་ལུ། SORA Nexus གནད་སྡུད་ས་སྟོང་, `npos` འདི་ རེ་བ་བསྐྱེད་པའི་མོས་མཐུན་ཐབས་ལམ་ཨིན།
གཞན Iroha 3 བཀྲམ་སྤེལ་ཚུ་གིས་ དམིགས་གཏད་ལུ་གཞི་བཞག་སྟེ་ གནང་བ་ཡོད་མི་ཡང་ན་ ཨེན་པི་ཨོ་ཨེསི་ལག་ལེན་འཐབ་བཏུབ།
གདོང་ཤོག།

## ཁས་བླངས་གསལ་བསྒྲགས་ལུ་མིང་རྟགས་བཀོད། {#sign-the-manifest}

ཞུན་དག་དང་བདེན་དཔྱད་འབད་བའི་ཤུལ་ལས་ . JSON, བཀྲམ་སྤེལ་འབད་བཏུབ་མི་ཅིག་ནང་མིང་རྟགས་བཀོད། `.nrt` དུམ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` གསལ་སྟོན་ལས་ རིགས་མཚན་མི་མང་ལྡེ་མིག་ལྷག་ཞིནམ་ལས་ ལག་ལེན་འཐབ་ཨིན།
ཇོ་བདག་གིས་འཛིན་མི་ འབྲེལ་ལམ་རྐྱང་པའི་དུས་རྒྱུན་ཡིག་སྣོད་ལས་ སྒེར་གྱི་ལྡེ་མིག་འདི་ བཟོ་བསྐྲུན་འབད་ནི་ལུ་
deployable མིང་རྟགས་བཀོད་ཡོད་པའི་སྡེབ།ཡིག་སྣོད་འདི་ནང་ ཀེ་ནོ་ནིཀ་སྒེར་གྱི་ལྡེ་མིག་གཅིག་འོང་དགོ།
multihash དེ་གི་ཤུལ་ལས་ གྲལ་ཐིག་གསརཔ་ཅིག་; Kagami བརྡ་མཚོན་འབྲེལ་ལམ་དང་ཐབས་ལམ་གཞན་མི་ཚུ་ བཀག་ཆ་འབདཝ་ཨིན།
འགྲན་བསྡུར་ `0600`. བརྡ་བཀོད་གྲལ་ཐིག་གུ་ སྒེར་དོན་ལྡེ་མིག་སྔོ་མ་ཚུ་ ངོས་ལེན་མི་འབད།གྲུབ་འབྲས།
འདི་ མཉམ་རོགས་ཀྱིས་ ཁོང་རའི་རིམ་སྒྲིག་ལས་ གཞི་བསྟུན་འབད་དགོ་པའི་ཡིག་སྣོད་འདི་ཨིན།

## རིམ་སྒྲིག་འབད། `iroha3d` {#configure-iroha3d}

མིང་རྟགས་བཀོད་ཡོད་པའི་རིགས་མཚན་སྡེབ་ཚན་ནང་ལུ་ ཌེ་མཱོན་འདི་སྟོན།

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## འབྲེལ་ཡོད་ལག་ཆ། {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

བཟོ་བསྐྲུན་པ་ལག་ལེན་འཐབ་ནི་དང་བརྡ་བཀོད་ཁ་གསལ་གྱི་དོན་ལུ་ བལྟ།
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
