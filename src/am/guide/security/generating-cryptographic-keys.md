---
translation_locale: am
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ምስጠራ ቁልፎችን ማመንጨት {#generating-cryptographic-keys}

ለ Iroha 3 የደንበኛ ፣ የእኩዮች እና የማረጋገጫ ቁልፍ ቁሳቁስ ለማመንጨት `kagami keys` ይጠቀሙ ።

## መሠረታዊ አጠቃቀም {#basic-usage}

ከ Iroha ምንጭ ካሻው:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ውፅዓት አብዛኛውን ጊዜ ወደ TOML ወይም አውቶሜሽን ለመቅዳት በጣም ቀላል ነው:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ትዕዛዙ የሕዝብ ቁልፍ እና የተጋለጠ የግል ቁልፍ ይደብቃል። የግል ቁልፉን እንደ ምስጢራዊ ቁሳቁስ ያዙ; የተፈጠሩትን የምርት ቁልፎች አያደራጁ ።

## ስልተ ቀመሮች {#algorithms}

የተለመዱ ስልተ ቀመሮች የሚከተሉት ናቸው:

- `ed25519` ለደንበኛ መለያዎች ፣ ለዥረት ማንነቶች እና ለአብዛኛዎቹ የልማት አውታረመረቦች።
- `secp256k1` የ secp256k1 መለያ መታወቂያ ሲያስፈልግህ.
- `bls_normal` በግንባታ አማካኝነት BLS ድጋፍን በሚያገኝበት ጊዜ ለቫሊደተር የጋራ ቁልፎች።

በግንባታዎ የሚደገፉትን ትክክለኛ ስልተ ቀመሮችን ይመልከቱ:

```bash
cargo run --bin kagami -- keys --help
```

## የዲተሪሚኒስት የልማት ቁልፎች {#deterministic-development-keys}

ለማዳበር የሚችሉ ማያ ገጾች አንድ ዘር ያቅርቡ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

ዘሮች የግል ቁልፍ ቁሳቁሶች ናቸው ለአካባቢያዊ ልማት እና ምርመራዎች ብቻ ይጠቀሙባቸው።

## BLS ባለቤትነት ማረጋገጫ {#bls-proofs-of-possession}

የ NPoS እና Nexus ማረጋገጫ መገለጫዎች የ BLS የማረጋገጫ ቁልፎችን እና PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

የ JSON ያካትታል `pop_hex` መቼ `--pop` ጥቅም ላይ ይውላል. ያንን ዋጋ ከተፈጠረው ቶፖሎጂ ጋር ወይም `trusted_peers_pop` መገለጫው የሚጠይቅባቸው ግቤቶች።

## የውጤት ቅርጸቶች {#output-formats}

ለደረጃ ምርመራ ነባሪ ውፅዓት ይጠቀሙ ፣ `--json` ለአውቶሜሽን እና `--compact` ሌላ ስክሪፕት ቀላል መስመር-ተኮር እሴቶች በሚፈልጉበት ጊዜ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

ሙሉ ለሙሉ የሚመነጭ Kagami ድጋፍ:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
