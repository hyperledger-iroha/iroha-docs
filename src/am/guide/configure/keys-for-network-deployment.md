---
translation_locale: am
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የአውታረ መረብ አተገባበር ቁልፎች {#keys-for-network-deployment}

እያንዳንዱ አውታረመረብ ለደንበኞች ፣ ለአቻዎች ፣ ለጄኔሲስ ፊርማ እና ለ NPoS ወይም Nexus መገለጫዎች የተለየ ቁልፍ ቁሳቁስ ይፈልጋል ፣ BLS ማረጋገጫ ማንነት ።

## ቁልፎችን የሚጠቀሙባቸው ቦታዎች {#where-keys-are-used}

- የደንበኛው ፊርማ ቁልፎች በ `client.toml` ውስጥ `[account]` ስር ይቀመጣሉ ።
- የእኩዮች መታወቂያ ቁልፎች በእያንዳንዱ እኩያ `config.toml` ውስጥ እንደ `public_key` እና `private_key` ይቀመጣሉ ።
- የእኩዮች ግኝት በእያንዳንዱ እኩያ `trusted_peers` ውስጥ የሕዝብ ቁልፍን ይጠቀማል.
- BLS ማረጋገጫ ባለቤትነት ማስረጃዎች ለ NPoS መገለጫዎች በ `trusted_peers_pop` ውስጥ ይቀመጣሉ.
- የዘፍጥረት ፊርማ በማኒፊስት ሲፈርም `[genesis].public_key` በባልደረባ ውቅር እና የሚዛመደው የግል ቁልፍ ይጠቀማል.

ለአካባቢያዊ ወይም የሙከራ ትግበራዎች, Kagami እነዚህን ፋይሎች ሁሉ በአንድ ላይ ያመነጫል:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ለአንድ ነባር አውታረመረብ ወይም መገለጫ መመሪያ ፍሰት ይጠቀሙ:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## የግለሰብ ቁልፍ ባልና ሚስት ይፍጠሩ {#generate-individual-key-pairs}

ለግል ቁልፍ ቁሳቁስ `kagami keys` ይጠቀሙ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ለ BLS ማረጋገጫ ቁሳቁስ የባለቤትነት ማስረጃን ያካትቱ

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--seed` መጠቀም የሚቻለው ለትራንስፎርሜሽን መሣሪያዎች ብቻ ነው። ለምርቱ ማሰማራት አዲስ ቁልፎችን ያመነጩ እና የግል ቁልፎቹን ከማከማቻው ውጭ ያስቀምጡ ።

## የእኩዮች ተኳሃኝነት {#peer-consistency}

ሁሉም ማረጋገጫ ሰጪዎች በተመሳሳይ የጄኔሲስ ግብይት ፣ ቶፖሎጂ ፣ የታመኑ የእኩዮች በይፋ ቁልፎች እና የማረጋገጫ ሰጭ PoPs ላይ መግባባት አለባቸው። አንድ ነጠላ የጎደለው ወይም የማይጣጣም የእኩዮች ቁልፍ አውታረመረብ እንዳይጀምር ወይም ስምምነት ላይ እንዳይደርስ ሊያግደው ይችላል።

ለቢዛንታይን ስህተት መቻቻል ቢያንስ ለአራት እኩዮች ይጠቀሙ። እያንዳንዱ እኩያ የራሱ የሆነ የግል ቁልፍ ሊኖረው ይገባል ፣ ግን እያንዳንዱ የእኩያ ውቅር ተመሳሳይ የታመነ የእኩይ ስብስብ ይፈልጋል።

## የደንበኞች መለያዎች {#client-accounts}

በ `client.toml` ውስጥ ያለው የደንበኛ መለያ ቀድሞውኑ በመስመር ላይ መኖር አለበት ። በጄኔዚስ ማኒፌስት ወይም በኋላ ባለው ግብይት ሊመዘገብ ይችላል ። እንደ ረጅም ጊዜ የሚቆይ የመተግበሪያ መለያ ሆኖ የጄኔሲስ ፊርማ ማንነትን ከመጠቀም ይቆጠቡ; የጄኔሲስ መብቶች የሚተገበሩት በጀኔሲስ ዙር ወቅት ብቻ ሲሆን የምርት ደንበኞች የራሳቸውን ሂሳብ እና ሚና መጠቀም አለባቸው።
