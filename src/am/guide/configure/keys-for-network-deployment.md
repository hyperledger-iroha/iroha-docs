---
translation_locale: am
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የአውታረ መረብ አተገባበር ቁልፎች {#keys-for-network-deployment}

እያንዳንዱ አውታረመረብ ለደንበኞች፣ ለአቻዎች፣ ለጄኔስ ፊርማ፣
እና ለ NPoS ወይም Nexus መገለጫዎች፣ BLS የማረጋገጫ ማንነት።

## ቁልፎችን የሚጠቀሙባቸው ቦታዎች {#where-keys-are-used}

- የደንበኛው ፊርማ ቁልፎች ውስጥ ይቀመጣሉ `client.toml` ስር `[account]`.
- የእኩዮች ማንነት ቁልፎች በእያንዳንዱ እኩያ ውስጥ ይቀመጣሉ `config.toml` እንደ `public_key` እና
  `private_key`.
- የእኩዮች ግኝት የእያንዳንዱን እኩያ የህዝብ ቁልፍ ይጠቀማል `trusted_peers`.
- BLS ማረጋገጫ ባለቤትነት ማስረጃዎች በ `trusted_peers_pop` ለ NPOS
  መገለጫዎች።
- የዘፍጥረት ፊርማ `[genesis].public_key` በባልደረባዎች መለያ እና
  ሰነዱን በሚፈርሙበት ጊዜ የግል ቁልፍ ጋር የሚጣጣም ነው።

ለአካባቢያዊ ወይም ለሙከራ አተገባበር Kagami እነዚህን ፋይሎች በሙሉ በአንድነት ያመነጩ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

አሁን ላለው አውታረመረብ ወይም መገለጫ የሚመራውን ፍሰት ይጠቀሙ

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## የግለሰብ ቁልፍ ጥንዶች ይፍጠሩ {#generate-individual-key-pairs}

አጠቃቀም `kagami keys` ለነጠላ ቁልፍ ቁሳቁስ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ለ BLS የማረጋገጫ ቁሳቁስ ፣ የንብረት ማስረጃ ያካትታል-

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

አጠቃቀም `--seed` ለትራፊክ ማሻሻያ መሣሪያዎች ብቻ
ማሰማራት፣ አዲስ ቁልፎችን መፍጠር እና የግል ቁልፎቹን ከማከማቻው ውጭ ማስቀመጥ።

## የእኩዮች ተኳሃኝነት {#peer-consistency}

ሁሉም ማረጋገጫ ሰጪዎች በተመሳሳይ ጅምር ግብይት ፣ ቶፖሎጂ ፣ የታመነ
የጋራ የህዝብ ቁልፎች እና ማረጋገጫ PoPs. አንድ ነጠላ የጎደለው ወይም የማይጣጣም የእኩዮች ቁልፍ
አውታረ መረቡ እንዳይጀምር ወይም ስምምነት ላይ እንዳይደርስ ማድረግ።

የቢዛንታይን ስህተት-ተቻችለሽ አነስተኛ አገልግሎት ለመስጠት ቢያንስ አራት እኩዮችን ይጠቀሙ።
እኩዮች የራሳቸው የግል ቁልፍ ሊኖራቸው ይገባል ፣ ግን እያንዳንዱ የእኩዮች ውቅር ተመሳሳይ ነው
የታመነ የእኩዮች ስብስብ።

## የደንበኞች ሂሳቦች {#client-accounts}

የደንበኛው መለያ `client.toml` ይህ ቀድሞውኑ በሰንሰለት ላይ መኖር አለበት.
በጄኔሲስ ማኒፌስት ወይም በኋላ ላይ በተደረገ ግብይት የተመዘገቡ።
የጄኔሲስ ፊርማ ማንነት እንደ ረጅም ዕድሜ ያለው ማመልከቻ መለያ; የጄኔዚስ መብቶች
በጄኔሲስ ዙር ወቅት ብቻ ይተገበራሉ ፣ እና የምርት ደንበኞች የራሳቸውን መጠቀም አለባቸው
ሂሳቦች እና ሚናዎች።
