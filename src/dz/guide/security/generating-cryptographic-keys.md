---
translation_locale: dz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ཨེབ་ལྡེ་མིག་ཚུ་ བཟོ་སྐྲུན་འབདཝ་ཨིན། {#generating-cryptographic-keys}

`kagami keys` ལག་ལེན་འཐབ་སྟེ་ Iroha 3 གི་དོན་ལུ་ client, peer, and validator key ཐོན་སྐྱེད་འབད་ཚུགས།

## གཞི་རྟེན་ལག་ལེན་ {#basic-usage}

Iroha གི་ source checkout ནང་ལས་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ཕྱིར་བཏོན་འདི་ TOML ཡང་ན་ རང་བཞིན་བཟོ་བཀོད་ནང་ལུ་ ཨེབ་གཏང་འབད་ནི་དེ་འཇམ་ཤོས་ཨིན།

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

བཀའ་རྒྱ་འདི་གིས་ public key དང་ གསང་སྲུང་མེད་པའི་ private key གཉིས་ཀྱི་གྲུབ་འབྲས་བཏོནམ་ཨིན། private key འདི་ secret material སྦེ་བཞག་དགོ། བཟོ་སྐྲུན་གྱི་ production key ཚུ་ repository ནང་ commit འབད་ནི་མི་འོང་།

རྒྱབ་སྐྱོར་ཡོད་པའི་ Unix platform གུ་ secure local export ཡང་ན་ custody handoff འབདཝ་ད་ private key འདི་གྲུབ་འབྲས་ནང་མ་བཏོན་པར་ key pair གསརཔ་འདི་ owner-only གི་ directory སྟོངམ་ནང་བྲིས་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Parent directory འདི་ཧེ་མ་ལས་ཡོད་དགོ། Target directory འདི་གསརཔ་ ཡང་ན་ current user གྱི་བདག་དབང་ནང་ཡོད་མི་ mode `0700`, symbolic link མེད་མི་དང་ སྟོངམ་ཨིན་དགོ། `kagami` གིས་ `public.key` དང་ `private.key` འདི་ mode `0600` ནང་བྲིས་ཏེ་ private key འདི་གྲུབ་འབྲས་ནང་མི་བཏོན། `--pop` ཡོད་པ་ཅིན་ `pop.hex` ཡང་འབྲི་འོང་།

Kagami གིས་ owner-only filesystem rules ཚུ་ངེས་པར་ལག་ལེན་འཐབ་མ་ཚུགས་པའི་ platform གུ་ `--out-dir` འདི་ fail closed འབད་དེ་འཛོལ་བ་སྟོན་འོང་། private-key file འདི་ unencrypted export ཨིན་པ་ལས་ hardware signer ཡང་ན་ non-exportable production signer མེན། འདི་ approved custody boundary ནང་ནང་འདྲེན་འབད་ཞིནམ་ལས་ deployment procedure དང་འཁྲིལ་ཏེ་ export file འདི་བཏོན་གཏང་།

## ཨལ་ག་རི་ཏམ་ཚུ་ {#algorithms}

སྤྱིར་བཏང་གི་ ཨལ་ག་རི་ཏིམ་ཚུ་འདི་ཨིན།

- Client account དང་ streaming identity གི་དོན་ལུ་ `ed25519`།
- Client account ལུ་ secp256k1 identity དགོཔ་ད་ `secp256k1`།
- Build གིས་ BLS support འབད་མི་ད་ node ཡང་ན་ peer consensus identity རེ་རེའི་དོན་ལུ་ `bls_normal`།

ཁྱོད་ཀྱི་ build གིས་རྒྱབ་སྐྱོར་འབད་མི་ algorithm ངེས་ཏིག་ཚུ་འདི་གིས་བརྟག་དཔྱད་འབད་:

```bash
cargo run --bin kagami -- keys --help
```

## དངོས་གྲུབ་ཅན་གྱི་གོང་འཕེལ་གྱི་ལྡེ་མིག་ཚུ་ {#deterministic-development-keys}

Reproducible fixture གི་དོན་ལུ་ 32-byte seed འདི་ hexadecimal character 64 སྦེ་བཀོད་དེ་བྱིན། Optional `0x` prefix འདི་བཏུབ་ཨིན།

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

Seed འདི་ private-key material ཨིན། Deterministic seed འདི་ local development དང་ test གི་དོན་ལུ་རྐྱངམ་ཅིག་ལག་ལེན་འཐབ། Production key འདི་ operating-system randomness ལས་བཟོ་ནིའི་དོན་ལུ་ `--seed-hex` མ་བྱིན།

## BLS ངོས་ལེན་གྱི་ལྡེ་མིག་དང་ བདག་དབང་གི་ཁུངས་ཚུ་ {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node དང་ peer consensus identities གིས་ BLS-normal keys ལག་ལེན་འཐབ་ཨིན། BLS-normal key དང་ possessive proof (PoP) བཟོ་ནི་འདི་:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` འདི་ `bls_normal` དང་གཅིག་ཁར་རྐྱངམ་ཅིག་ཆ་གནས་ཡོད། JSON output ནང་ `pop_hex` ཡོད། Signed genesis གིས་ voting validator རེ་རེའི་དོན་ལུ་ matching PoP དགོ། Peer configuration ནང་ non-empty `trusted_peers_pop` map གིས་ validator subset གདམ་ཁ་རྐྱབ་ཨིན། དེ་ནང་མེད་པའི་ trusted peer ཚུ་ observer ཨིན། Map སྟོངམ་ཨིན་པ་ཅིན་ BLS-normal trusted peer ཆ་མཉམ་ bootstrap candidate set ནང་འཛུལ་འོང་། Voting PoPs ཚུ་ signed genesis གིས་རང་བྱིན་འོང་།

## ཐོན་སྐྱེད་བཟོ་རྣམ་ཚུ་ {#output-formats}

Terminal inspection གི་དོན་ལུ་ default output, automation གི་དོན་ལུ་ `--json`, script གཞན་ལུ་ line-oriented values དགོ་པ་ཅིན་ `--compact` ལག་ལེན་འཐབ་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

ཡོངས་ཁྱབ་ཐོན་སྐྱེད་འབད་ནིའི་དོན་ལུ་ Kagami གྲོགས་རམ་:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
