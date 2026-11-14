---
translation_locale: dz
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: human-reviewed+reviewed-delta
---
# Rust {#rust}

Rust ལག་ལེན་འཐབ་མི་འདི་ ལཱ་གི་ས་སྒོ་ངོ་མ་ནང་ལུ་སྡོད་ཡོདཔ་དང་ Iroha 3 གསང་ཡིག་གཞི་རྟེན་དང་གཅིག་ཁར་ལཱ་འབད་ནི་གི་ཐད་ཀར་གྱི་ཐབས་ལམ་ཅིག་སྦེ་ལུསཔ་ཨིན།

## ཁྱོད་ཀྱིས་ག་ཅི་ཐོབ་དོ་ {#what-you-get}

ཡར་རྒྱུག་མཛོད་ཁང་གིས་ད་ལྟོ་གསལ་སྟོན་འབདཝ་ཨིན།

- `iroha` Rust བཟའ་སྤྱོད་ཀྱི་རསཊ་ཆ་ཚན་
- `iroha` CLI འདི་ གཞི་བསྟུན་མཁོ་སྤྲོད་པ་ ཆ་ཚང་ཤོས་སྦེ་ཨིན།
- གྲལ་ཐིག་ SDK གིས་ལག་ལེན་འཐབ་མི་ ཌའི་ཊ་གི་མེ་ལོང་དང་ ཀི་པེ་ཀྲོ་དང་ Norito རསཊ་ཆ་ཚན་ཚུ་

## གྲོས་འཆར་ཅན་གྱི་ འགོ་བཙུགས་སྒོ་ {#recommended-starting-point}

ལས་འགུལ་གྱི་ད་ལྟོའི་གནས་སྟངས་ཤེས་ནིའི་དོན་ལུ་ ཟུར་བརྟེན CLI དང་ ལཱ་གི་ས་སྒོ དེ་རང་ལས་འགོ་བཙུགས།

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

བརྟག་ཞིབ་འབད་ཡོད་པའི་སྔོན་སྒྲིག་མཉེན་ཆས་རིམ་སྒྲིག་དང་གཅིག་ཁར་ གཞི་བསྟུན་མཉེན་ཆས་འདི་གཡོག་བཀོལ།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## Taira ཀློག་རྐྱབས་ཅིག་ལུ་ བརྟག་དཔྱད་འབད་ {#try-taira-read-only}

ལཱ་གི་ས་ཁོངས་དེ་ནང་ལས་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་ མི་མང་གི་བརྟག་དཔྱད་གྲོགས་རམ་ Taira འདི་ལག་ལེན་འཐབ་དགོ།

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

ཕྲང་ལམ་གྱི་གནས་ཚད་བརྟག་དཔྱད་འབདཝ་ད་ Torii གི་ JSON API ཐད་ཀར་དུ་ལག་ལེན་འཐབ་:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

ཁྱོད་ཀྱིས་ `taira.client.toml` བཟོ་ཚར་ཞིནམ་ལས་ ཨང་རྟགས་གཉིས་ལྡན་ལས་རིམ་གཅིག་པ་དེ་གིས་ `iroha taira account` གིས་ རྩིས་ཐོ་ཅིག་ ནང་འཛུལ་འབད་དེ་ མ་དངུལ་བཙུགས་ཚུགས་པ་མ་ཚད་ Taira ལུ་ སྤྱིར་བཏང་མིང་རྟགས་བཀོད་པའི་ རྩིས་དེབ་བཀའ་རྒྱ་ཚུ་ ཕུལ་ཚུགས། འདི་ཚུ་ སྤྱིར་བཏང་ཆ་ཕྲན་བརྟག་དཔྱད་ཚུ་ལས་ སོ་སོར་སྦེ་བཞག་དགོ་ ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ འདི་ཚུ་ལུ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གིས་ མ་དངུལ་བཙུགས་པའི་ རྩིས་ཐོ་དང་ ཐད་ཀར་བརྟག་དཔྱད་དྲ་རྒྱ་ཐོབ་ཚུགས་པ་ དགོཔ་ཨིན།

## Rust མགྲོན་པོའི་ རསཊ་ཆ་ཚན ལག་ལེན་འཐབ་ནི་ {#using-the-rust-client-crate}

ཁྱོད་རའི་ཡོངས་འབྲེལ་གྱིས་ལག་ལེན་འཐབ་མི་ Iroha Git བསྐྱར་ཞིབ་འདི་པིན་འབད།

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

ཁྱོད་ཀྱིས་ Rust ས་ཁུདཔ་ཚུ་ ལག་ལེན་ནང་ལུ་ ག་དེ་སྦེ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན་ན་ཀྱི་ དཔེ་ཆ་དག་པ་ཅིག་དགོ་པ་ཅིན་ ལྟ་རྟོག་འབད་:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

རྩིས་དེབ་ཀྱིས་ འཛིན་སྐྱོང་འབད་མི་ བར་གཏོགས་བདག་ཉར་གྱི་ལཱ་རྒྱུན་ཚུ་གི་དོན་ལུ་ [རང་སའི་རྒྱུ་དངོས་བཅོལ་ཉར](/dz/blockchain/escrow.md#rust-sdk) ལུ་བལྟ་དགོ། ད་ལྟོའི་སྐབས་ Rust གནད་སྡུད་རྣམ་གཞག་ནང་ལུ་ ཚོང་རའི་བར་གཏོགས་བདག་ཉར་དང་ སྤྱིར་བཏང་རྒྱུ་དངོས་ཀྱི་བཀག་སྡོམ་ ཆ་རྐྱེན་ཅན་གྱི་བར་གཏོགས་བདག་ཉར་ དྲི་བཀོད་ དེ་ལས་ བྱུང་རྐྱེན་ཚུ་གི་དོན་ལུ་ དབྱེ་བ་ཅན་གྱི་ཁྱབ་ཚད་ ཆ་ཚང་ཤོས་ཡོདཔ་ཨིན།

ཁྱོད་ཀྱིས་ ཉེ་གནས་ CLI གྲོགས་རམ་གྱི་ས་ཚིགས་དུས་ཚོད་ནང་གནད་སྡུད་མཐོང་སྣང་འདི་དང་གཅིག་ཁར་ བསྐྱར་བཟོ་འབད་ཚུགས།

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## གྲོས་འདེབས་ཚུ་ {#notes}

- CLI གིས་ ད་རེས་ རང་སོའི་རསཊ་ཆ་ཚན་ཡིག་སྣོད་ལས་ལྷག་པའི་ ཉེན་སྲུང་ལེགས་ཤོམ་སྦེ་བྱིན་དོ་ཡོདཔ་ཨིན།
- ལས་འཛིན་གྱི་རྣམ་ཐངས་ཀྱི་བྱ་རིམའི་དོན་ལུ་ CLI ཡིག་ཆ་འདི་ ད་ལྟོའི་གནས་ཚད་ངོ་མ་ཨིན།
