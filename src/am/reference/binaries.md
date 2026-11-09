---
translation_locale: am
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ከ Iroha ሁለትዮሽ ጋር በመስራት ላይ {#working-with-iroha-binaries}

የ Iroha 3 ኦፕሬተር የስራ ፍሰት በአራት ዋና ዋና ሁለትዮሽ ዙሪያ ያጠነጠነ ነው -

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) የአውታረ መረብ አቻ ዴሞንን ለማስኬድ
- `iroha3d_taira` ለነጠላ ፕሮቶኮል-ስታንዳርድ Taira አረጋጋጭ አስጀማሪ
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) ለ CLI እና የኦፕሬተር ትዕዛዞች
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) ለቁልፎች፣ Blockchain Genesis፣ Localnets እና መገለጫዎች

## ከምንጩ ይገንቡ {#build-from-source}

ከላይ ካለው የስራ ቦታ ሥር -

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

የመልቀቂያ ሁለትዮሽ በ `target/release/` ውስጥ ይገኛሉ።

የትእዛዝ ወለልን ለመመርመር -

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## በቀጥታ ከማከማቻው ያሂዱ {#run-directly-from-the-repository}

በአለምአቀፍ ደረጃ ምንም ነገር መጫን ካልፈለጉ `cargo run` ይጠቀሙ -

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ምስል {#docker-image}

ከአንድ የምንጭ ኮድ ስሪት በተገነቡ ሁለትዮሽ ፋይሎች አራት አረጋጋጭ አንጓዎችን በDocker ለማስኬድ የ[አስጀምር Iroha 3](/am/get-started/launch-iroha.md) መመሪያን ይከተሉ።

## የትኛውን ሁለትዮሽ መጠቀም አለብኝ? {#which-binary-should-i-use}

- ከህዝብ Taira አረጋጋጭ ልቀት ውጭ የአውታረ መረብ እኩዮችን ሲጀምሩ ወይም ሲሰሩ `iroha3d` ይጠቀሙ።
- `iroha3d_taira --sora`ን ለአንድ ፕሮቶኮል-ስታንዳርድ Taira አረጋጋጭ ማሰማራት ብቻ ይጠቀሙ። የ Taira ሰንሰለት፣ ማከማቻ እና የአሂድ ጊዜ ፈራሚ መገለጫን ያስፈጽማል።
- የብሎክቼይን መዝገብን መጠየቅ፣ ግብይቶችን ማስገባት ወይም ኦፕሬተርን API የመጨረሻ ነጥቦችን መመርመር ሲፈልጉ `iroha` ይጠቀሙ።
- ቁልፎች፣ የጀነሲስ ማኒፌስቶች፣ የመገለጫ ጥቅሎች ወይም የ localnet ንብረቶች ሲያስፈልጉ `kagami`ን ይጠቀሙ።
