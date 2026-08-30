---
translation_locale: am
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ከ Iroha ባነሪዎች ጋር መሥራት {#working-with-iroha-binaries}

የ Iroha 3 ኦፕሬተር የሥራ ፍሰት በአራት ዋና ባናሪዎች ዙሪያ ይሽከረከራል-

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) የእኩዮችን ዳይሞን ለማስኬድ
- `iroha3d_taira` ለካኖኒካል Taira ማረጋገጫ ማስጀመሪያ
- [ለ CLI እና ለኦፕሬተር ትዕዛዞች `iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) ለቁልፎች ፣ ለጀኔዝስ ፣ ለአካባቢያዊ አውታረ መረቦች እና ለመገለጫዎች

## ምንጭን በመመርኮዝ መገንባት {#build-from-source}

ከስራ ቦታው ስርጭት:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ከዚያ በኋላ የተለቀቁ ባናሪዎች በ `target/release/` ይገኛሉ ።

የመቆጣጠሪያውን ወለል ለመመርመር:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## በቀጥታ ከመደብር ይሂዱ {#run-directly-from-the-repository}

ምንም ነገር በዓለም አቀፍ ደረጃ መጫን የማይፈልጉ ከሆነ `cargo run` ን ይጠቀሙ:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ምስል {#docker-image}

የስራ ቦታ አጠቃቀሞች `kagami localnet` እና `kagami docker` ለማመንጨት Docker Compose ከተረጋገጠው ኮድ ጋር የሚዛመዱ ፋይሎች። `hyperledger/iroha:dev` ምስሉ ከእነዚያ የተፈጠሩ ፋይሎች ጋር ጥቅም ላይ ሊውል ይችላል።

CLI በአንድ መያዣ ውስጥ ይጫኑ:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami በአንድ መያዣ ውስጥ ይሂዱ:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ለባልደረባ ጅምር, አንድ አካባቢያዊኔት ማመንጨት እና በመጀመሪያ ፋይል ያጠናቅቁ:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## የትኛውን ባናሪ መጠቀም አለብኝ? {#which-binary-should-i-use}

- ከህዝብ Taira ማረጋገጫ መለዋወጫ ውጭ እኩዮችን ሲጀምሩ ወይም ሲያስተዳድሩ `iroha3d` ይጠቀሙ ።
- `iroha3d_taira --sora` ን ለካኖኒካል Taira ማረጋገጫ ማስቀመጫ ብቻ ይጠቀሙ; የ Taira ሰንሰለት ፣ የማከማቻ እና የአሂድ ጊዜ-መፈራሪያ መገለጫን ያስገድዳል.
- መለያውን ለመጠየቅ፣ ግብይቶችን ለማቅረብ ወይም የኦፕሬተሩ መጨረሻ ነጥቦችን ለመፈተሽ በሚፈልጉበት ጊዜ `iroha` ይጠቀሙ።
- ቁልፎችን፣ የጄኔሲስ መገለጫዎችን፣ የመገለጫ ጥቅሎችን ወይም አካባቢያዊ ኔት ንብረቶችን በሚፈልጉበት ጊዜ `kagami` ይጠቀሙ።
