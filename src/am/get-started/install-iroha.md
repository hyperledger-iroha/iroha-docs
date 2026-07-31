---
translation_locale: am
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# መጫን Iroha 3 {#install-iroha-3}

ይህ ገጽ የአሁኑን የስራ ፍሰት ይሸፍናል Iroha 3 የመሳሪያ ሰንሰለት
እና የላይኛው ዥረት የሚጠቀሙ ባናሪዎች `hyperledger-iroha/iroha` የሥራ ቦታ።

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

በመጀመሪያ እነዚህን ይጫኑ:

- [rustup](https://www.rust-lang.org/tools/install), ስለዚህ የተጣራው
  `rust-toolchain.toml` የመሳሪያ ሰንሰለት (`1.93.1`) በራስ-ሰር ይጫናል
- `git`
- አማራጭ፣ Docker እና Docker Compose ለአካባቢያዊ ባለብዙ እኩዮች ፈጣን ጅምር

## 2. የስራ ቦታውን አጽዳ {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. የሥራ ቦታውን መገንባት {#_3-build-the-workspace}

ሁሉንም ነገር መገንባት:

```bash
cargo build --workspace
```

ለአነስተኛ ኦፕሬተር-ተኮር ግንባታ, ዋናዎቹን ባናሪዎችን ብቻ ያጠናቅቁ:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

የተገኙት ባናሪዎች `target/debug/` ወይም `target/release/`.

## 4. የተጫኑትን መሳሪያዎች ማረጋገጥ {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

አብዛኛውን ጊዜ የሚጠቀሙባቸው ሦስት ባናሪዎች የሚከተሉት ናቸው

- `irohad` ለባልደረባ ዳሚን
- `iroha` ለ CLI መዳረሻ Torii እና የኦፕሬተር መጨረሻ ነጥቦች
- `kagami` ቁልፎች፣ የጄኔሲስ ማኒፌስት እና የአካባቢ ኔት መገለጫዎች

## 5. አማራጭ የአካባቢ ኔትወርክ እና Docker መንገድ {#_5-optional-localnet-and-docker-path}

የአሁኑ ምንጭ-ተደገፈ localnet ፍሰት Kagami. እኩዮችን ይጽፋል
ውቅር፣ የዘፍጥረት ቅርሶች፣ የደንበኛ ውቅር፣ ረዳት ስክሪፕቶች እና አማራጭ
ከተሰረዘው ኮድ ጋር የሚዛመድ ፋይል ይፃፉ:

- `kagami localnet` ለአፍ መፍቻ አካባቢያዊ የእኩዮች ስክሪፕቶች
- `kagami docker` ለ Docker Compose ከ localnet ማውጫ የተፈጠረ

ይቀጥሉ [ማስጀመሪያ Iroha 3](/am/get-started/launch-iroha.md).
