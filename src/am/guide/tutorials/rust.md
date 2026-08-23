---
translation_locale: am
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust ትግበራው በዋናው የሥራ ቦታ ውስጥ የሚገኝ ሲሆን ከ Iroha 3 ኮድ መሠረት ጋር ለመስራት በጣም ቀጥተኛ መንገድ ሆኖ ይቆያል።

## ምን ማግኘት ትችላለህ? {#what-you-get}

የቅድመ-መንገድ መዝገብ በአሁኑ ጊዜ የሚከተሉትን ያጋልጣል:

- የ `iroha` Rust ደንበኛ ሳጥን
- `iroha` CLI በጣም የተሟላ የማጣቀሻ ደንበኛ ሆኖ
- በ SDK ንብርብሮች ጥቅም ላይ የዋሉት የተጋራ የመረጃ ሞዴል ፣ ምስጢራዊ መረጃ እና Norito ሳጥኖች

## የሚመከር የመነሻ ነጥብ {#recommended-starting-point}

ለፕሮጀክቱ ወቅታዊ ሁኔታ CLI እና የስራ ቦታው እራሱን በመጥቀስ ይጀምሩ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

የተረጋገጠ ነባሪ የደንበኛ ውቅር ጋር የማጣቀሻ ደንበኛው ይሂዱ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira ንባብ ብቻ ይሞክሩ {#try-taira-read-only}

ከዚሁ የስራ ቦታ ቼክ አውታር የህዝብ Taira የምርመራ ረዳት ይሞክሩ:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

ለመንገድ ደረጃ ምርመራዎች Torii JSON API ን በቀጥታ ይጠቀሙ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

እርስዎ `taira.client.toml` ከፈጠሩ በኋላ, ተመሳሳይ ባነሪ በ Taira ላይ የተፈረሙ የካናሪ ትዕዛዞችን ማስኬድ ይችላል. እነዚህ በተለመደው የአሃድ ሙከራዎች ተለይተው እንዲቆዩ ያድርጉ ምክንያቱም እነሱ የቧንቧ-ተደገፈ አካውንት እና የቀጥታ የሙከራ አውታረ መረብ ተደራሽነት ያስፈልጋቸዋል.

## Rust የደንበኛ ሳጥን በመጠቀም {#using-the-rust-client-crate}

በአውታረ መረብዎ ውስጥ ጥቅም ላይ የዋለውን Iroha Git ስሪት ይጫኑ:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

የ Rust ወለሎች በተግባር እንዴት ጥቅም ላይ እንደሚውሉ በጣም የተሟላ ምሳሌዎች ከፈለጉ የሚከተሉትን ይፈትሹ:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

በሪጀር የሚተዳደሩ የኤስኮር ስራ ፍሰቶች ለማግኘት [የአገር ውስጥ ንብረት ኤስኮር ](/am/blockchain/escrow.md#rust-sdk) ይመልከቱ። የ Rust የውሂብ ሞዴል በአሁኑ ጊዜ ለገበያ ኤስኮው ፣ ለአጠቃላይ ሀብት መቆለፊያዎች ፣ ለማይታወቁ ኤስኮዎች ፣ ለጥያቄዎች እና ለዝግጅቶች በጣም የተሟላ ዓይነት ሽፋን አለው ።

አንድ አካባቢያዊ CLI እርዳታ ቅጽበታዊ ገጽ እይታ ጋር መልሶ ማግኘት ይችላሉ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ማስታወሻዎች {#notes}

- CLI በአሁኑ ጊዜ ከራስ ወዳድ የሳጥን ሰነዶች የተሻለ ሽፋን ይሰጣል ።
- ለኦፕሬተር አሠራር ፍሰቶች CLI ሰነድ በጣም ወቅታዊ ምንጭ ነው ።
