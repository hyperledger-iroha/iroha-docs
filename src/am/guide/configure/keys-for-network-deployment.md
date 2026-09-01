---
translation_locale: am
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ለአውታረመረብ ማሰማራት ቁልፎች {#keys-for-network-deployment}

እያንዳንዱ አውታረ መረብ ለደንበኞች፣ ለአውታረ መረብ እኩዮች፣ ለብሎክቼይን ጀነሲስ ፊርማ እና ለNPoS ወይም Nexus መገለጫዎች፣ BLS አረጋጋጭ ማንነቶች የተለየ ቁልፍ ቁሳቁስ ያስፈልገዋል።

## ቁልፎች ጥቅም ላይ የሚውሉባቸው ቦታዎች {#where-keys-are-used}

- የደንበኛ ፊርማ ቁልፎች በ`client.toml` በ`[account]` ስር ተቀምጠዋል።
- የአውታረ መረብ አቻ መለያ ቁልፎች በእያንዳንዱ የአውታረ መረብ አቻ `config.toml` እንደ `public_key` እና `private_key` ተከማችተዋል።
- የአውታረ መረብ አቻ ግኝት የእያንዳንዱን የአውታረ መረብ አቻ የህዝብ ቁልፍ በ`trusted_peers` ይጠቀማል።
- BLS አረጋጋጭ የይዞታ ማረጋገጫዎች በ `trusted_peers_pop` ውስጥ ለNPoS መገለጫዎች ተከማችተዋል።
- የብሎክቼይን ጀነሲስ ፊርማ ቴክኒካል ማኒፌስት ሲፈርሙ `[genesis].public_key` በኔትወርክ አቻ ውቅር እና ተዛማጅ የግል ቁልፍን ይጠቀማል።

ለአካባቢያዊ ወይም ለሙከራ ማሰማራት፣ Kagami እነዚህን ሁሉ ፋይሎች አንድ ላይ ያመነጩ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ለነባር አውታረ መረብ ወይም መገለጫ፣ የሚመራውን ፍሰት ይጠቀሙ -

```bash
cargo run --bin kagami -- wizard
```

## የግለሰብ ቁልፍ ጥንዶችን ይፍጠሩ {#generate-individual-key-pairs}

ለግል ቁልፍ ቁሳቁስ `kagami keys` ይጠቀሙ -

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

ለ BLS አረጋጋጭ ቁሳቁስ፣ የይዞታ ማረጋገጫ ያካትቱ -

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--seed-hex`ን በትክክለኛው ባለ 32-ባይት ሄክሳዴሲማል ሚስጥር ብቻ ይጠቀሙ ሊደገሙ ለሚችሉ የልማት ሙከራ ውሂቦች። ለምርት ማሰማራት፣ Kagami የክወና ስርዓት ዘፈቀደነትን እንዲጠቀም ይተዉት፣ ከዚያ ያልተመሰጠረውን የግል ቁልፍ ወደ ውጭ መላክ ወደ ተፈቀደው የጥበቃ ወሰን ያንቀሳቅሱት። ትዕዛዙ የግል ቁልፎችን በጭራሽ አያትምም።

## የአውታረ መረብ አቻ ወጥነት {#peer-consistency}

ሁሉም አረጋጋጮች በተመሳሳዩ የብሎክቼይን ጀነሲስ ግብይት፣ ቶፖሎጂ፣ የታመኑ የአውታረ መረብ አቻ የህዝብ ቁልፎች እና አረጋጋጭ PoPs ላይ መስማማት አለባቸው። አንድ የጎደለ ወይም ያልተዛመደ የአውታረ መረብ አቻ ቁልፍ አውታረ መረቡ እንዳይጀምር ወይም መግባባት ላይ እንዳይደርስ ይከለክላል።

ለቢያንስ የባይዛንታይን ስህተትን የሚቋቋም ማሰማራት፣ ቢያንስ አራት የአውታረ መረብ እኩዮችን ይጠቀሙ። እያንዳንዱ የአውታረ መረብ አቻ የራሱ የግል ቁልፍ ሊኖረው ይገባል፣ ነገር ግን እያንዳንዱ የአውታረ መረብ አቻ ውቅር ተመሳሳይ የታመነ የአውታረ መረብ አቻ ስብስብ ያስፈልገዋል።

## የደንበኛ መለያዎች {#client-accounts}

በ `client.toml` ውስጥ ያለው የደንበኛ መለያ አስቀድሞ በሰንሰለት ላይ መኖር አለበት። በብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት ወይም በኋላ ግብይት ሊመዘገብ ይችላል። የብሎክቼይን ጀነሲስ ፊርማ ማንነትን እንደ ረጅም ጊዜ የመተግበሪያ መለያ ከመጠቀም ይቆጠቡ; የብሎክቼይን ጀነሲስ ልዩ መብቶች የሚተገበሩት በብሎክቼይን ጀነሲስ ዙር ብቻ ነው፣ እና የምርት ደንበኞች የራሳቸውን መለያዎች እና ሚናዎች መጠቀም አለባቸው።
