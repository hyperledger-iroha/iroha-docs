---
translation_locale: am
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ከ Iroha ባነሪዎች ጋር መሥራት {#working-with-iroha-binaries}

የ Iroha 3 ኦፕሬተር የስራ ፍሰት በሦስት ዋና ባናሪዎች ዙሪያ ይሽከረከራል።

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) የእኩዮችን ዳይሞን ለማስኬድ
- [ለ CLI እና ለኦፕሬተር ትዕዛዞች `iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli)
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) ለቁልፎች ፣ ለጀኔዝስ ፣ ለአካባቢያዊ አውታረ መረቦች እና ለመገለጫዎች

## ምንጭን በመመርኮዝ መገንባት {#build-from-source}

ከስራ ቦታው ስርጭት:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ከዚያ በኋላ የተለቀቁ ባናሪዎች በ `target/release/` ይገኛሉ ።

የመቆጣጠሪያውን ወለል ለመመርመር:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## በቀጥታ ከመደብር ይሂዱ {#run-directly-from-the-repository}

ምንም ነገር በዓለም አቀፍ ደረጃ መጫን የማይፈልጉ ከሆነ `cargo run` ን ይጠቀሙ:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## የትኛውን ባናሪ መጠቀም አለብኝ? {#which-binary-should-i-use}

- የእኩዮቻችሁን ሥራ ሲጀምሩ ወይም ሲያከናውኑ `irohad` ይጠቀሙ።
- መለያውን ለመጠየቅ፣ ግብይቶችን ለማቅረብ ወይም የኦፕሬተሩ መጨረሻ ነጥቦችን ለመፈተሽ በሚፈልጉበት ጊዜ `iroha` ይጠቀሙ።
- ቁልፎችን፣ የጄኔሲስ መገለጫዎችን፣ የመገለጫ ጥቅሎችን ወይም አካባቢያዊ ኔት ንብረቶችን በሚፈልጉበት ጊዜ `kagami` ይጠቀሙ።
