---
translation_locale: dz
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust ལག་ལེན་དེ་ ལཱ་གི་ས་ཁོངས་ངོ་མ་ནང་ལུ་སྡོད་ཡོདཔ་ལས་ Iroha 3 code base དང་གཅིག་ཁར་ལཱ་འབད་ནི་གི་ ཐབས་ལམ་ངོ་མ་ཅིག་སྦེ་ར་ བཞག་ཡོདཔ་ཨིན།

## ཁྱོད་ཀྱིས་ག་ཅི་ཐོབ་དོ་ {#what-you-get}

ད་ལྟོའི་བར་ནའི་ཐོ་ཡིག་འདི་ནང་ལུ་:

- `iroha` Rust བཟའ་སྤྱོད་ཀྱི་སྒྲོམ་
- `iroha` CLI གིས་ ཉམས་མྱོང་ཅན་གྱི་ངོ་སྤྲོད་འབད་མི་འདི་ཨིན།
- གྲལ་ཐིག་ SDK གིས་ལག་ལེན་འཐབ་མི་ ཌའི་ཊ་གི་མེ་ལོང་དང་ ཀི་པེ་ཀྲོ་དང་ Norito སྒྲོམ་ཚུ་

## གྲོས་འཆར་ཅན་གྱི་ འགོ་བཙུགས་སྒོ་ {#recommended-starting-point}

ལས་འགུལ་གྱི་གནས་སྟངས་ཀྱི་དོན་ལུ་ CLI དང་ ལཱ་གི་ས་ཁོངས་དེ་ནང་ལས་འགོ་བཙུགས་ཏེ་:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Reference client འདི་ checked-in default client config དང་གཅིག་ཁར་ལག་ལེན་འཐབ་དགོ།

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
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
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

ཁྱོད་ཀྱིས་ `taira.client.toml` བཟོ་ཚར་ཞིནམ་ལས་ དེ་བཟུམ་སྦེ་ བའི་ནརི་འདི་གིས་ Taira ལུ་རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ ཀ་ནཱར་གྱི་བཀའ་རྒྱ་ཚུ་ལག་ལེན་འཐབ་ཚུགས། འདི་ཚུ་བརྟག་དཔྱད་འབད་མི་སྡེ་ཚན་ཚུ་ལས་སོ་སོར་སྦེ་བཞག་དགོ་ ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ འདི་ཚུ་གིས་ ཐབ་ཤིང་གིས་དངུལ་སྤྲོད་མི་རྩིས་དང་ འགྲུལ་འཕྲིན་བརྟག་དཔྱད་འབད་ཐངས་ཚུ་ དགོཔ་ཨིན་མས།

## Rust Client Crate ལག་ལེན་འཐབ་ནི་ {#using-the-rust-client-crate}

ཁྱོད་ཀྱི་དྲ་ལམ་གིས་ལག་ལེན་འཐབ་མི་ Iroha Git བསྐྱར་ཞིབ་འདི་ཨེབ་གཏང་འབད་:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

ཁྱོད་ཀྱིས་ Rust ས་ཁུདཔ་ཚུ་ ལག་ལེན་ནང་ལུ་ ག་དེ་སྦེ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན་ན་ཀྱི་ དཔེ་ཆ་དག་པ་ཅིག་དགོ་པ་ཅིན་ ལྟ་རྟོག་འབད་:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

དཔེ་དེབ་ནང་ འཛིན་སྐྱོང་འཐབ་མི་ གཏན་འཁེལ་གྱི་ལཱ་རྒྱུན་ལས་ཚུ་གི་དོན་ལུ་ [Native Asset Escrow](/dz/blockchain/escrow.md#rust-sdk) ལུ་བལྟ་དགོ། ད་ལྟོའི་སྐབས་ Rust ཌའི་ཊ་གི་རྣམ་གཞག་ནང་ལུ་ ཚོང་འབྲེལ་གྱི་ གཏན་འཁོགས་དང་ སྤྱིར་བཏང་ རྒྱུ་དངོས་ཀྱི་ ལྕགས་ཟམ་ དེ་ལས་ རྣམ་རྟོག་མེད་པའི་ གཏན་འཁོབ་ དེ་ལས་ དྲི་བཀོད་ དེ་ལས་བྱུང་རྐྱེན་ཚུ་གི་དོན་ལུ་ ཡོངས་ཁྱབ་སྦེ་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།

ཁྱོད་ཀྱིས་ lokal CLI help snapshot འདི་སླར་ལོག་འབད་ཚུགས།

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## གྲོས་འདེབས་ཚུ་ {#notes}

- CLI གིས་ ད་རེས་ རང་སོའི་སྒྲོམ་ཡིག་སྣོད་ལས་ལྷག་པའི་ ཉེན་སྲུང་ལེགས་ཤོམ་སྦེ་བྱིན་དོ་ཡོདཔ་ཨིན།
- ལས་འཛིན་གྱི་རྣམ་ཐངས་ཀྱི་རྒྱུགས་ཆུའི་དོན་ལུ་ CLI ཡིག་ཆ་འདི་ ད་ལྟོའི་གནས་ཚད་ངོ་མ་ཨིན།
