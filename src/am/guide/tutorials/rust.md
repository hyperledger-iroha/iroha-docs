---
translation_locale: am
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

የ Rust አተገባበር በዋናው የሥራ ቦታ ውስጥ የሚኖር ሲሆን በጣም ቀጥተኛ ሆኖ ይቆያል
ጋር ለመስራት መንገድ Iroha 3 የኮድ መሰረት።

## ምን ያገኛሉ? {#what-you-get}

የቅድመ ፍሰት መዝገብ በአሁኑ ጊዜ የሚከተሉትን ያጋልጣል:

- የ `iroha` Rust የደንበኛው ሳጥን
- የ `iroha` CLI በጣም የተሟላ የማጣቀሻ ደንበኛ ሆኖ
- የተጋራ የውሂብ ሞዴል ፣ ምስጠራ እና Norito በኤሌክትሮኒክ አገልግሎት የሚውሉ ሳጥኖች SDK ሽፋን

## የሚመከር የመነሻ ነጥብ {#recommended-starting-point}

ለፕሮጀክቱ ወቅታዊ ሁኔታ በመጥቀስ ይጀምሩ CLI እና
የስራ ቦታው ራሱ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

የተረጋገጠ ነባሪ ደንበኛ ውቅር ጋር የማጣቀሻ ደንበኛው ይሂዱ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## ይሞክሩ Taira የንባብ ብቻ {#try-taira-read-only}

በተመሳሳይ የሥራ ቦታ ካሲኖ, የሕዝብ ይሞክሩ Taira የምርመራ ረዳት:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

የመንገድ ደረጃ ፍተሻዎች ሲደረጉ Torii ነው JSON API በቀጥታ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

ከፈጠርክ በኋላ `taira.client.toml`, ተመሳሳይ ባይናሪ ፊርማ ካናሪ ማስኬድ ይችላሉ
የጦርነቱ ትዕዛዝ Taira. እነዚህ መደበኛ የአሃድ ሙከራዎች የተለየ ያድርጉ ምክንያቱም
ከፋይኔት የተደገፈ ሂሳብ እና የቀጥታ የሙከራ ኔትወርክ መኖር ያስፈልጋቸዋል።

## በመጠቀም Rust የደንበኛ ሳጥን {#using-the-rust-client-crate}

አጣጥፉ Iroha በአውታረ መረብዎ የተጠቀመው የጊት ማሻሻያ:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

እንዴት እንደሚቻል በጣም የተሟላ ምሳሌዎች ከፈለጉ Rust ወለሎች ጥቅም ላይ ይውላሉ
ልምምድ፣ ምርመራ:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

በመቁጠሪያ መቆጣጠሪያ ውስጥ የሚተዳደሩ የስራ ፍሰቶች ተመልከት
[የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#rust-sdk). የ Rust የመረጃ ሞዴል
በአሁኑ ጊዜ ለገበያ ቦታ ኤስኮር ፣ አጠቃላይ
የንብረት መቆለፊያዎች፣ የማይታወቁ ዋስትናዎች፣ መጠይቆች እና ክስተቶች።

የአካባቢውን ሰው መልሶ ማቋቋም ትችላለህ CLI የሚከተሉትን ረዳት ቅጽበታዊ ገጽ እይታዎች:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ማስታወሻዎች {#notes}

- የ CLI በአሁኑ ጊዜ ከራስ-የተቋቋሙ የሳጥን ሰነዶች የተሻለ ሽፋን ይሰጣል ።
- ለኦፕሬተር አይነት ፍሰቶች, CLI ሰነዶች በጣም ወቅታዊ ምንጭ ናቸው.
