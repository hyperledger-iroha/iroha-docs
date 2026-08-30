---
translation_locale: am
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ለአንድ ነባር አውታረመረብ ወይም መገለጫ መመሪያ ፍሰት ይጠቀሙ:

```bash
cargo run --bin kagami -- wizard
```

## የግለሰብ ቁልፍ ባልና ሚስት ይፍጠሩ {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## የእኩዮች ተኳሃኝነት {#peer-consistency}

ሁሉም ማረጋገጫ ሰጪዎች በተመሳሳይ የጄኔሲስ ግብይት ፣ ቶፖሎጂ ፣ የታመኑ የእኩዮች በይፋ ቁልፎች እና የማረጋገጫ ሰጭ PoPs ላይ መግባባት አለባቸው። አንድ ነጠላ የጎደለው ወይም የማይጣጣም የእኩዮች ቁልፍ አውታረመረብ እንዳይጀምር ወይም ስምምነት ላይ እንዳይደርስ ሊያግደው ይችላል።

ለቢዛንታይን ስህተት መቻቻል ቢያንስ ለአራት እኩዮች ይጠቀሙ። እያንዳንዱ እኩያ የራሱ የሆነ የግል ቁልፍ ሊኖረው ይገባል ፣ ግን እያንዳንዱ የእኩያ ውቅር ተመሳሳይ የታመነ የእኩይ ስብስብ ይፈልጋል።

## የደንበኞች መለያዎች {#client-accounts}

በ `client.toml` ውስጥ ያለው የደንበኛ መለያ ቀድሞውኑ በመስመር ላይ መኖር አለበት ። በጄኔዚስ ማኒፌስት ወይም በኋላ ባለው ግብይት ሊመዘገብ ይችላል ። እንደ ረጅም ጊዜ የሚቆይ የመተግበሪያ መለያ ሆኖ የጄኔሲስ ፊርማ ማንነትን ከመጠቀም ይቆጠቡ; የጄኔሲስ መብቶች የሚተገበሩት በጀኔሲስ ዙር ወቅት ብቻ ሲሆን የምርት ደንበኞች የራሳቸውን ሂሳብ እና ሚና መጠቀም አለባቸው።
