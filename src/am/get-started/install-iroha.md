---
translation_locale: am
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 መጫን {#install-iroha-3}

ይህ ገጽ የ Iroha 3 የመሳሪያ ሰንሰለት እና በሁለትዮሽ ክፍሎች የአሁኑን የመጫኛ የሥራ ፍሰት የሚሸፍን ሲሆን ይህም የ `hyperledger-iroha/iroha` የስራ ቦታውን ይጠቀማል።

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

መጀመሪያ እነዚህን ይጫኑ:

- [rustup](https://www.rust-lang.org/tools/install)፣ ስለዚህ የተጣራው `rust-toolchain.toml` የመሳሪያ ሰንሰለት (`1.93.1`) በራስ-ሰር ይጫናል።
- `git`
- በአማራጭ, Docker እና Docker Compose ለአካባቢያዊ ባለብዙ እኩዮች ፈጣን ጅምር

## 2. የስራ ቦታውን ክሎን ማድረግ {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. የስራ ቦታውን መገንባት {#_3-build-the-workspace}

ሁሉንም ነገር መገንባት:

```bash
cargo build --workspace
```

ለአነስተኛ የኦፕሬተር-ተኮር ግንባታ, ዋናዎቹን ሁለትዮሽ ብቻ ያጠናቅቁ:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

የተገኙት ባናሪዎች በ `target/debug/` ወይም `target/release/` ላይ ይጻፉ።

## 4. የተጫኑትን መሣሪያዎች አረጋግጡ። {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

አብዛኛውን ጊዜ የሚጠቀሙባቸው አራት ባናሪዎች የሚከተሉት ናቸው

- `iroha3d` ለአንድ መደበኛ የእኩዮች ዳሞን
- `iroha3d_taira` ለካኖኒካል Taira ማረጋገጫ ማስጀመሪያ
- `iroha` ለ CLI ተደራሽነት ወደ Torii እና ለአስተናጋጅ መጨረሻ ነጥብ
- `kagami` ለቁልፎች፣ የመነሻ መገለጫዎችና ለአካባቢያዊ አውታረመረብ መገለጫ

## 5. አማራጭ Localnet እና Docker መንገድ። {#_5-optional-localnet-and-docker-path}

የአሁኑ ምንጭ የተደገፈ የሎካልኔት ፍሰት በ Kagami የሚመነጨ ነው። እሱ የእኩዮችን ውቅር ፣ የመነሻ ቅርፃ ቅርጾችን ፣ የደንበኞችን ውቅር ፣ ረዳት ስክሪፕቶችን እና ከተመረጠው ኮድ ጋር የሚዛመድ አማራጭ የኮምፖዝ ፋይል ይጽፋል:

- `kagami localnet` ለአፍ መፍቻ አካባቢያዊ የእኩዮች ስክሪፕቶች
- `kagami docker` ለ Docker Compose ከ localnet ማውጫ የተፈጠረ

[መጀመር ይቀጥሉ Iroha 3](/am/get-started/launch-iroha.md).
