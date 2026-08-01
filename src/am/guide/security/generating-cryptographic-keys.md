---
translation_locale: am
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ምስጠራ ቁልፎችን ማመንጨት {#generating-cryptographic-keys}

ለ Iroha 3 የclient፣ peer እና validator ቁልፍ ቁሳቁስ ለማመንጨት `kagami keys` ይጠቀሙ።

## መሠረታዊ አጠቃቀም {#basic-usage}

ከ Iroha ምንጭ ኮድ checkout ማውጫ፦

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ውፅዓት አብዛኛውን ጊዜ ወደ TOML ወይም አውቶሜሽን ለመቅዳት በጣም ቀላል ነው:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ትዕዛዙ የሕዝብ ቁልፍን እና በግልጽ የታየ የግል ቁልፍን ያትማል። የግል ቁልፉን እንደ ሚስጥራዊ ቁሳቁስ ይያዙ፤ የተመነጩ የምርት ቁልፎችን ወደ repository commit አያድርጉ።

በሚደገፍ Unix መድረክ ላይ ለደህንነቱ የተጠበቀ local export ወይም custody handoff፣ የግል ቁልፉን ከማተም ይልቅ አዲሱን ቁልፍ ጥንድ ባለቤቱ ብቻ ሊደርስበት በሚችል ባዶ ማውጫ ውስጥ ይጻፉ፦

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

የወላጅ ማውጫው ቀድሞ መኖር አለበት። ዒላማው አዲስ ወይም ቀድሞውኑ የአሁኑ ተጠቃሚ ንብረት፣ በ`0700` mode፣ ያለ symbolic link እና ባዶ መሆን አለበት። `kagami` `public.key` እና `private.key`ን በ`0600` mode ይጽፋል እና የግል ቁልፉን አያትምም። `--pop` ሲጠቀሙ `pop.hex`ንም ይጽፋል።

Kagami እነዚህን የባለቤት-ብቻ የፋይል ስርዓት ደንቦች ማስገደድ በማይችልበት መድረክ `--out-dir` በደህንነት ስህተት ይቋረጣል። የግል ቁልፍ ፋይሉ ያልተመሰጠረ export ነው፤ hardware signer ወይም non-exportable የምርት signer አይደለም። ወደ ተፈቀደ custody boundary ያስገቡት እና export ፋይሉን በdeployment አሰራር መሠረት ያስወግዱ።

## ስልተ ቀመሮች {#algorithms}

የተለመዱ ስልተ ቀመሮች የሚከተሉት ናቸው:

- `ed25519` ለደንበኛ መለያዎች እና የዥረት ማንነት።
- `secp256k1` አንድ የደንበኛ መለያ secp256k1 ማንነት የሚጠይቅ ከሆነ.
- build BLS ድጋፍን ሲያነቃ፣ ለእያንዳንዱ node ወይም peer consensus identity `bls_normal`።

በግንባታዎ የሚደገፉትን ትክክለኛ ስልተ ቀመሮችን ይመልከቱ:

```bash
cargo run --bin kagami -- keys --help
```

## የዲተሪሚኒስት የልማት ቁልፎች {#deterministic-development-keys}

ሊደገሙ ለሚችሉ fixture-ዎች፣ በ64 hexadecimal ቁምፊዎች የተመሰጠረ 32-byte seed ይስጡ። አማራጭ `0x` prefix ተቀባይነት አለው፦

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

Seed የግል ቁልፍ ቁሳቁስ ነው። Deterministic seed-ዎችን ለlocal development እና ለtest ብቻ ይጠቀሙ። የምርት ቁልፍን ከoperating-system randomness ለማመንጨት `--seed-hex`ን አያቅርቡ።

## BLS የስምምነት ቁልፎች እና ባለቤትነት ማስረጃዎች {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node እና peer consensus identities BLS - መደበኛ ቁልፎችን ይጠቀማሉ። የሚከተለውን የ BLS- መደበኛ ቁልፍ እና ባለቤትነት ማረጋገጫ (PoP) ያመነጩ:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` የሚሰራው ከ`bls_normal` ጋር ብቻ ነው። JSON ውጤት `pop_hex`ን ያካትታል። Signed genesis ለእያንዳንዱ ድምፅ ሰጪ validator ተዛማጅ PoP ይጠይቃል። በpeer configuration ውስጥ ባዶ ያልሆነ `trusted_peers_pop` map የvalidator ንዑስ ስብስብን ይመርጣል፤ በዚያ ባዶ ባልሆነ map ውስጥ ያልተካተቱ trusted peer-ዎች observer ናቸው። Map-ው ባዶ ከሆነ ሁሉም BLS-normal trusted peer-ዎች ወደ bootstrap candidate set ይገባሉ፤ የመራጮች PoPs ግን አሁንም በsigned genesis ይቀርባል።

## የውጤት ቅርጸቶች {#output-formats}

ለደረጃ ምርመራ ነባሪ ውፅዓት ይጠቀሙ ፣ `--json` ለአውቶሜሽን እና `--compact` ሌላ ስክሪፕት ቀላል መስመር-ተኮር እሴቶች በሚፈልጉበት ጊዜ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

ሙሉ ለሙሉ የሚመነጭ Kagami ድጋፍ:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
