---
translation_locale: am
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: bb1044edb9d34264e36848ee773d4d313bfbfd91b45da2eeb831f7ef8920e9b4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ምስጠራ ቁልፎችን በማመንጨት ላይ {#generating-cryptographic-keys}

ለ`kagami keys` ደንበኛ፣ የአውታረ መረብ አቻ እና አረጋጋጭ ቁልፍ ቁሳቁስ ለማመንጨት Iroha 3 ይጠቀሙ።

## መሰረታዊ አጠቃቀም {#basic-usage}

ከ Iroha ምንጭ-ኮድ የስራ ቅጂ -

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

ወላጅ ማውጫው አስቀድሞ መኖር አለበት። የታለመው ማውጫ መኖር የለበትም፤ Kagami አስቀድሞ ያለ ባዶ ማውጫንም ይከለክላል። ለባለቤቱ ብቻ መዳረሻ የሚሰጡ የፋይል ስርዓት ፍተሻዎችን እያደረገ ዒላማውን በ`0700` ሁነታ ይፈጥራል፣ ተምሳሌታዊ አገናኞችንም ይከለክላል። `kagami`፣ `public.key` እና `private.key`ን በ`0600` ሁነታ ይጽፋል እንጂ የቁልፍ ቁሳቁሶችን አያትምም። ከ`--pop` ጋር `pop.hex`ንም ይጽፋል።

`--out-dir` Kagami እነዚህን የባለቤት-ብቻ የፋይል ስርዓት ህጎች ማስፈጸም በማይችሉባቸው መድረኮች ላይ በአስተማማኝ ሁኔታ ውድቅ ይሆናል። የግል-ቁልፍ ፋይሉ ያልተመሰጠረ ወደ ውጭ መላክ እንጂ ሀ ሃርድዌር ወይም ወደ ውጭ መላክ የማይችል የምርት ምስጠራ ፈራሚ። በተፈቀደው የጥበቃ ወሰን ውስጥ ያስገቡት እና በማሰማራቱ ሂደት መሰረት ወደ ውጭ መላክ ያስወግዱት።

## ስልተ ቀመሮች {#algorithms}

የተለመዱ ስልተ ቀመሮች የሚከተሉት ናቸው

- `ed25519` ለደንበኛ መለያዎች እና የዥረት ማንነቶች።
- `secp256k1` የደንበኛ መለያ የ SECP256K1 መታወቂያ ሲፈልግ።
- `bls_normal` ለእያንዳንዱ ኖድ ወይም የአውታረ መረብ አቻ ስምምነት ማንነት።

በግንባታዎ የሚደገፉትን ትክክለኛ ስልተ ቀመሮች ያረጋግጡ -

```bash
cargo run --bin kagami -- keys --help
```

## ዲተርሚኒስቲክ የእድገት ቁልፎች {#deterministic-development-keys}

ሊባዙ ለሚችሉ የሙከራ አብነቶች፣ ባለ 32-ባይት ዘር እንደ 64 ሄክሳዴሲማል ቁምፊዎች ይለፉ። አማራጭ `0x` ቅድመ ቅጥያ ተቀባይነት አለው -

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

ዘሩ የግል-ቁልፍ ቁሳቁስ ነው. ለአካባቢያዊ ልማት እና ሙከራዎች ብቻ ዲተርሚኒስቲክ ዘሮችን ይጠቀሙ። ከኦፕሬቲንግ ሲስተም የዘፈቀደነት የምርት ቁልፍ ለማመንጨት `--seed-hex`ን ይተዉት።

## BLS የጋራ መግባባት ቁልፎች እና የይዞታ ማረጋገጫዎች {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 ኖድ እና የአውታረ መረብ አቻ ስምምነት ማንነቶች BLS-መደበኛ ቁልፎችን ይጠቀማሉ። BLS-መደበኛ ቁልፍ እና የይዞታ ማረጋገጫ (PoP) በ

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` የሚሰራው በ `bls_normal` ብቻ ነው፤ `pop.hex`ን ወደ ጥበቃ ማውጫው ያክላል። የተፈረመ የብሎክቼይን ጀነሲስ ለእያንዳንዱ የድምጽ መስጫ አረጋጋጭ ተዛማጅ PoP ያስፈልገዋል። በአውታረ መረብ አቻ ውቅር ውስጥ የእያንዳንዱን አረጋጋጭ PoP በ`trusted_peers_pop` ውስጥ ይዘርዝሩ፦ ትክክለኛ PoP የሌላቸው የታመኑ አቻዎች ከጋራ ስምምነት ዝርዝሩ ይገለላሉ፣ ባዶ ካርታ ደግሞ ምንም አረጋጋጭ አይሰጥም፤ ስለዚህ ካርታው የጀነሲስ አረጋጋጮችን የሚተው ኖድ ለመጀመር እምቢ ይላል። ማመሳሰል ብቻ የሚያደርግ ኖድን በ`[sumeragi] role = "observer"` ያሂዱ።

## የማሳደጊያ መረጃ {#custody-output}

`kagami keys` `--out-dir` ያስፈልገዋል እና የግል ቁልፍ ቁሳቁሶችን ወደ መደበኛ ውፅዓት በጭራሽ አይጽፍም። `public.key`፣ `private.key` እና አማራጭ `pop.hex`ን ከ የመነጨ ማውጫ. እያንዳንዱ ፋይል አንድ ነጠላ ፕሮቶኮል-መደበኛ እሴት ይዟል እና አዲስ መስመር ይከተላል፣ ይህም በፋይል ላይ የተመሰረተ አውቶማቲክን ቀላል ያደርገዋል።

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

ለሙሉ የመነጨ Kagami እርዳታ -

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
