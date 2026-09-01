---
translation_locale: am
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

የ Rust አተገባበር በዋናው የስራ ቦታ ላይ ይኖራል እና ከ Iroha 3 ኮድ ቤዝ ጋር ለመስራት በጣም ቀጥተኛ መንገድ ሆኖ ይቆያል።

## ምን አገኛችሁ {#what-you-get}

የላይኛው ማከማቻ በአሁኑ ጊዜ የሚከተሉትን ያጋልጣል -

- የ `iroha` Rust የደንበኛ ሶፍትዌር ጥቅል
- `iroha` CLI በጣም የተሟላ የማጣቀሻ ደንበኛ
- በ SDK ንብርብር ጥቅም ላይ የሚውለው የተጋራ የውሂብ ሞዴል፣ ክሪፕቶ እና Norito የሶፍትዌር ፓኬጆች

## የሚመከር መነሻ ነጥብ {#recommended-starting-point}

ለፕሮጀክቱ ወቅታዊ ሁኔታ በማጣቀሻው CLI እና በስራ ቦታው ይጀምሩ -

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

የማጣቀሻ ደንበኛውን በተመዘገበው ነባሪ የደንበኛ ውቅር ያሂዱ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## ይሞክሩ Taira ተነባቢ-ብቻ {#try-taira-read-only}

ከተመሳሳዩ የስራ ቦታ ቼክ መውጣት፣ ይፋዊ Taira የምርመራ አጋዥን ይሞክሩ -

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

ለመንገድ ደረጃ ቼኮች፣ Torii ን JSON API በቀጥታ ይጠቀሙ -

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml`ን ከፈጠሩ በኋላ፣ ያው ሁለትዮሽ የተፈረሙ የካናሪ ትዕዛዞችን በ Taira ላይ ማሄድ ይችላል። እነዚያን ከተራ አሃድ ፈተናዎች ይለዩ ምክንያቱም በቴስትኔት የተደገፈ መለያ እና የቀጥታ የቴስትኔት መገኘት ስለሚያስፈልጋቸው ነው።

## የ Rust የደንበኛ ሶፍትዌር ጥቅልን በመጠቀም {#using-the-rust-client-crate}

በአውታረ መረብዎ የሚጠቀመውን Iroha Git ክለሳ ይሰኩት

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

የ Rust ንጣፎች በተግባር እንዴት ጥቅም ላይ እንደሚውሉ በጣም የተሟላ ምሳሌዎችን ከፈለጉ -

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

በብሎክቼይን መዝገብ escrow የስራ ፍሰቶች ለሚተዳደር፣ [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#rust-sdk) ይመልከቱ። የ Rust የውሂብ ሞዴል በአሁኑ ጊዜ ለገበያ ቦታ escrow፣ አጠቃላይ የንብረት መቆለፊያዎች፣ ማንነታቸው ያልታወቀ escrow፣ መጠይቆች እና ክስተቶች በጣም የተሟላ የተተየበ ሽፋን አለው።

የአካባቢያዊ CLI የእገዛ ነጥብ-በጊዜ ውሂብ እይታን በሚከተሉት መልኩ ማደስ ይችላሉ -

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ማስታወሻዎች {#notes}

- CLI በአሁኑ ጊዜ ከገለልተኛ የሶፍትዌር ጥቅል ሰነዶች የተሻለ ሽፋን ይሰጣል።
- ለኦፕሬተር-ስታይል ፍሰቶች፣ የ CLI ሰነድ በጣም የአሁኑ ምንጭ ነው።
