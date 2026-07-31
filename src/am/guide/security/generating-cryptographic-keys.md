---
translation_locale: am
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የምስጠራ ቁልፎችን መፍጠር {#generating-cryptographic-keys}

አጠቃቀም `kagami keys` ለደንበኛ ፣ ለባልደረባ እና ለማረጋገጫ ቁልፍ ቁሳቁሶችን ለመፍጠር
Iroha 3.

## መሠረታዊ አጠቃቀም {#basic-usage}

ከ Iroha ምንጭ ክፍያ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ውፅዓት አብዛኛውን ጊዜ ወደ መቅዳት በጣም ቀላል ነው TOML ወይም አውቶሜሽን:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

አመራሩ የሕዝብ ቁልፍ እና የተጋለጠ የግል ቁልፍ ይደብቃል.
ቁልፍ እንደ ምስጢራዊ ቁሳቁስ; የተፈጠሩትን የምርት ቁልፎች አያካትቱ ።

## ስልተ ቀመሮች {#algorithms}

የተለመዱ ስልተ ቀመሮች የሚከተሉት ናቸው

- `ed25519` ለደንበኛ መለያዎች ፣ ለዥረት ማንነቶች እና ለአብዛኛው ልማት
  አውታረ መረቦች.
- `secp256k1` የ SECP256K1 መለያ መታወቂያ ሲያስፈልግህ።
- `bls_normal` የግንባታ ሲፈቅድ ለቫልዲተር ስምምነት ቁልፎች BLS ድጋፍ።

በህንፃዎ የሚደገፉትን ትክክለኛ ስልተ ቀመሮችን ይመልከቱ:

```bash
cargo run --bin kagami -- keys --help
```

## የመወሰን ልማት ቁልፎች {#deterministic-development-keys}

ለተባዙ ማያያዣዎች አንድ ዘርን ያቅርቡ

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

ዘር የግል ቁልፍ ቁሳቁሶች ናቸው፤ ለአካባቢያዊ ልማትና ምርመራ ብቻ ይጠቀሙባቸው።

## BLS ባለቤትነት ማስረጃ {#bls-proofs-of-possession}

NPOS እና Nexus የማረጋገጫ መገለጫዎች ያስፈልጋሉ BLS የማረጋገጫ ቁልፎች እና PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

የ JSON ያካትታል `pop_hex` መቼ `--pop` ይህን እሴት በ
የተፈጠረ ቶፖሎጂ ወይም `trusted_peers_pop` መገለጫው የሚጠይቀው መረጃ።

## የውጤት ቅርጸቶች {#output-formats}

ለደረጃ ምርመራ ነባሪ ውፅዓት ይጠቀሙ፣ `--json` ለኦቶሜሽን እና
`--compact` ሌላ ስክሪፕት ቀላል መስመር-ተኮር እሴቶች ሲያስፈልግ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

ሙሉ በሙሉ የሚመነጩ Kagami እርዳታ

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
