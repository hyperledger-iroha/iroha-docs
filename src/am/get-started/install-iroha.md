---
translation_locale: am
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 ን ጫን {#install-iroha-3}

ይህ ገጽ የአሁኑን የመጫኛ የስራ ሂደት ለ Iroha 3 የመሳሪያ ሰንሰለት እና ሁለትዮሽ የላይኛውን `hyperledger-iroha/iroha` የስራ ቦታ ይሸፍናል።

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

መጀመሪያ እነዚህን ይጫኑ

- [rustup](https://www.rust-lang.org/tools/install)፣ ስለዚህ የተሰካው `rust-toolchain.toml` የመሳሪያ ሰንሰለት (`1.93.1`) በራስ-ሰር ይጫናል
- `git`
- እንደ አማራጭ፣ Docker እና Docker Compose ለአካባቢያዊ ባለብዙ አቻ ፈጣን ጅምር

## 2. የስራ ቦታውን መዝጋት {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. የስራ ቦታን ይገንቡ {#_3-build-the-workspace}

ሁሉንም ነገር ይገንቡ

```bash
cargo build --workspace
```

ለአነስተኛ ኦፕሬተር ላይ ያተኮረ ግንባታ፣ ዋናዎቹን ሁለትዮሽ ብቻ ያጠናቅሩ -

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

የተገኙት ሁለትዮሽ ወደ `target/debug/` ወይም `target/release/` ተጽፏል።

## 4. የተጫኑትን መሳሪያዎች ያረጋግጡ {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ብዙውን ጊዜ የሚጠቀሙባቸው አራት ሁለትዮሽ -

- `iroha3d` ለመደበኛ አውታረ መረብ አቻ ዴሞን
- `iroha3d_taira` ለነጠላ ፕሮቶኮል-ስታንዳርድ Taira አረጋጋጭ አስጀማሪ
- `iroha` ለ CLI መዳረሻ ወደ Torii እና ኦፕሬተር API የመጨረሻ ነጥቦች
- `kagami` ለቁልፎች፣ የብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት እና የሎካልኔት መገለጫዎች

## 5. አማራጭ Localnet እና Docker መንገድ {#_5-optional-localnet-and-docker-path}

የአሁኑ ምንጭ የተደገፈ የሎካልኔት ፍሰት የሚመነጨው በ Kagami ነው። የአውታረ መረብ አቻ ውቅሮችን፣ የብሎክቼይን ጀነሲስ አርቲፋክቶችን፣ የደንበኛ ውቅረትን፣ አጋዥ ስክሪፕቶችን እና ከተፈተሸው ኮድ ጋር የሚዛመድ አማራጭ የጽሁፍ ፋይል ይጽፋል -

- `kagami localnet` ለቤተኛ የአካባቢ አውታረ መረብ አቻ ስክሪፕቶች
- `kagami docker` Docker Compose ከ Localnet ማውጫ የመነጨ

በ [አስጀምር Iroha 3](/am/get-started/launch-iroha.md) ይቀጥሉ።
