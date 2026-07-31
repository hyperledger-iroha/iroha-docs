---
translation_locale: am
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ጋር መሥራት Iroha የሁለትዮሽ {#working-with-iroha-binaries}

የ Iroha 3 የኦፕሬተር የሥራ ፍሰት በሦስት ዋና ባነሪዎች ዙሪያ ይሽከረከራል-

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) የእኩዮችን ዳይሞን ለማስተዳደር
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) ለ CLI እና የኦፕሬተር ትዕዛዞች
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) ቁልፎች፣ ጅማሬዎች፣ የቦታ መረብ እና መገለጫዎች

## ምንጭህን በመመርኮዝ ሥራ {#build-from-source}

ከስራ ቦታ ሥር:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ከዚያ በኋላ የሚለቀቁ ባናሪዎች በ `target/release/`.

የመቆጣጠሪያውን ወለል ለመመርመር:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## በቀጥታ ከመደብር ይሂዱ {#run-directly-from-the-repository}

በዓለም አቀፍ ደረጃ ማንኛውንም ነገር መጫን የማይፈልጉ ከሆነ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ምስል {#docker-image}

የስራ ቦታ አጠቃቀም `kagami localnet` እና `kagami docker` ለማመንጨት
Docker Compose ከተረጋገጠው ኮድ ጋር የሚዛመዱ ፋይሎች። `hyperledger/iroha:dev`
ምስሉ ከተፈጠሩት ፋይሎች ጋር ጥቅም ላይ ሊውል ይችላል።

አሂድ CLI በአንድ መያዣ ውስጥ:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

ሩጫ Kagami በአንድ መያዣ ውስጥ:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ለባልደረባ ጅምር, አንድ አካባቢያዊኔት ማመንጨት እና መጀመሪያ ፋይል ያጠናቅቁ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## የትኛውን ባነሪ መጠቀም አለብኝ? {#which-binary-should-i-use}

- አጠቃቀም `irohad` የእኩዮችን ሥራ ሲጀምሩ ወይም ሲያካሂዱ.
- አጠቃቀም `iroha` የመረጃ ቋቱን መጠየቅ፣ ግብይቶችን ማቅረብ ወይም የኦፕሬተሩ መጨረሻ ነጥቦችን መመርመር ሲያስፈልግህ።
- አጠቃቀም `kagami` ቁልፎችን፣ የጄኔሲስ ማኒፌስቶችን፣ የመገለጫ ጥቅሎችን ወይም የአካባቢ ኔት ሀብቶችን በሚፈልጉበት ጊዜ።
