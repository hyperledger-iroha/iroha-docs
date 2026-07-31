---
translation_locale: dz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ཨེབ་ལྡེ་མིག་ཚུ་ བཟོ་སྐྲུན་འབདཝ་ཨིན། {#generating-cryptographic-keys}

`kagami keys` ལག་ལེན་འཐབ་སྟེ་ Iroha 3 གི་དོན་ལུ་ client, peer, and validator key ཐོན་སྐྱེད་འབད་ཚུགས།

## གཞི་རྟེན་ལག་ལེན་ {#basic-usage}

Iroha ལས་ཁུངས་ཀྱི་དངུལ་ཁང་ནང་ལས་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ཕྱིར་བཏོན་འདི་ TOML ཡང་ན་ རང་བཞིན་བཟོ་བཀོད་ནང་ལུ་ ཨེབ་གཏང་འབད་ནི་དེ་འཇམ་ཤོས་ཨིན།

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

བཀའ་རྒྱ་འདི་གིས་ མི་མང་གི་ལྡེ་མིག་ཅིག་དང་ སྒེར་གྱི་ལྡེ་མིག་གཅིག་ གསལ་བཀོད་འབདཝ་ཨིན། སྒེར་གྱི་སྒོ་ཕྱེ་འདི་གསང་བའི་ཡིག་ཆ་ཅིག་སྦེ་ལག་ལེན་འཐབ་དགོ། བཟོ་སྐྲུན་ལྡེ་མིག་ཚུ་ བསྡུ་མ་ཚུགས།

## ཨལ་ག་རི་ཏམ་ཚུ་ {#algorithms}

སྤྱིར་བཏང་གི་ ཨལ་ག་རི་ཏིམ་ཚུ་འདི་ཨིན།

- `ed25519` བཟོ་མི་རྩིས་དང་ རྒྱང་བསྒྲགས་ངོ་རྟགས་ཚུ་ དེ་ལས་ གོང་འཕེལ་གྱི་དྲ་ལམ་མང་ཤོས་ཀྱི་དོན་ལུ་།
- `secp256k1` ཁྱོད་ཀྱིས་ secp256k1རྩིས་ཁྲ་གི་ངོ་རྟགས་དགོ་པའི་སྐབས་
- `bls_normal` ཚོད་ལྟ་འབད་ནིའི་མཐུན་རྐྱེན་གྱི་ལྡེ་མིག་ཚུ་གི་དོན་ལུ་ སྒྲིག་གཞི་འདི་གིས་ BLS རྒྱབ་སྐྱོར་འབད་ཚུགསཔ་བཟོཝ་ཨིན།

ཁྱོད་ཀྱིས་ བཟོ་སྐྲུན་འབད་མི་འདི་གིས་ རྒྱབ་སྐྱོར་འབད་མི་ ཨང་གྲངས་ཚུ་ བརྟག་ཞིབ་འབད་:

```bash
cargo run --bin kagami -- keys --help
```

## དངོས་གྲུབ་ཅན་གྱི་གོང་འཕེལ་གྱི་ལྡེ་མིག་ཚུ་ {#deterministic-development-keys}

སླར་ལོག་འབད་ཚུགས་པའི་ སྒྲིང་སྒྲི་ཚུ་གི་དོན་ལུ་ སོན་འདི་ བཏབ་དགོ།

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

སོན་འདི་ སྒེར་གྱི་ལྡེ་མིག་གི་ ཅ་ཆས་ཚུ་ཨིན། ས་གནས་ཀྱི་གོང་འཕེལ་དང་བརྟག་དཔྱད་ཚུ་གི་དོན་ལུ་རྐྱངམ་གཅིག་ ལག་ལེན་འཐབ་དགོ།

## BLS ལག་ལེན་གྱི་རྟགས་མཚན་ {#bls-proofs-of-possession}

NPoSདང་ Nexus ཝེ་ལི་ཌ་ཊར་གི་གནས་གོང་ཚུ་ནང་ལུ་ BLS ཝེ་ལད་ར་ལྡེ་མིག་ཚུ་དང་ PoPs འདི་:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON གིས་ `pop_hex` ཚུ་རྩིས་སྟོནམ་ཨིན། ཁྱོད་ཀྱིས་ `--pop` ལག་ལེན་འཐབ་པའི་སྐབས་ འདི་གི་གོང་ཚད་འདི་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ ཐོ་པོ་ሎጂདང་ ཡང་ན་ `trusted_peers_pop` ནང་དོན་ཚུ་དང་གཅིག་ཁར་ལག་ལེན་རྐྱབས་འོང་།

## ཐོན་སྐྱེད་བཟོ་རྣམ་ཚུ་ {#output-formats}

ཐིམ་ཕུག་བརྟག་དཔྱད་གི་དོན་ལུ་ default output ལག་ལེན་འཐབ་། `--json` རང་ལུགས་བཟོ་ནིའི་དོན་ལུ་དང་ `--compact` འདི་ script གཞན་ཅིག་གིས་ line oriented values དགོཔ་ཨིན་པ་ཅིན་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

ཡོངས་ཁྱབ་ཐོན་སྐྱེད་འབད་ནིའི་དོན་ལུ་ Kagami གྲོགས་རམ་:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
