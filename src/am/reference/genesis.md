---
translation_locale: am
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የዘፍጥረት ዘገባ {#genesis-reference}

አሁን ባለው Iroha 3 የስራ ፍሰት ውስጥ `genesis.json` ማኒፌስት አውታረ መረቡ ሲጀምር የሚተገበሩትን የመጀመሪያዎቹ ግብይቶች እና መለኪያዎች ይገልጻል።

ለባልደረቦቹ የተሰራጨው የተፈረመ ጥንቅር Norito-የተመሰጠረ `.nrt` ፋይል ነው በ `kagami genesis sign` የተፈጠረ።

## ዋና መስኮች {#main-fields}

የጄኔሲስ መገለጫ የሚከተሉትን ሊገልጽ ይችላል፦

- ለሰንሰለት መታወቂያ `chain`
- `executor` ለ አማራጭ አስፈፃሚ ማሻሻያ ባይትኮድ መንገድ
- `ivm_dir` ለ IVM ቤተ-መጽሐፍት ተነሳሽነት እና ማሻሻያዎች ጥቅም ላይ የሚውሉ
- `consensus_mode` በጋዜጣው ውስጥ ለታወጀው የመጀመሪያ ሁኔታ
- `transactions` ለተዘረዘሩት መለኪያዎች ዝማኔዎች፣ መመሪያዎች፣ አስነሳሾች እና ቶፖሎጂ።
- `crypto` ለቀዳሚ የ ‹crypto› ቅጽበታዊ ምስል

በ `transactions` ውስጥ ፣ የቶፖሎጂ አቃፊዎች የእኩዮች መታወቂያዎችን እና PoPs አንድ ላይ ያገናኙ:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ማኒፌስት አዘጋጅ {#generate-a-manifest}

ሞዴል ለመፍጠር Kagami ይጠቀሙ:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

ለህዝብ SORA Nexus የውሂብ ቦታ, `npos` የሚጠበቀው የጋራ ስምምነት ሁነታ ነው. ሌሎች Iroha 3 ልውውጦች እንደ ግቡ መገለጫ ፈቃድ ወይም NPoS መጠቀም ይችላሉ.

## የምስክር ወረቀቱን ይፈርሙ {#sign-the-manifest}

JSON ን ካስተረዱ እና ከተረጋገጡ በኋላ ወደ ሊተገበር የሚችል `.nrt` ብሎክ ያስገቡት:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` ከጋዜጣው የህዝብ ቁልፍን ያነባል እና የተሰጠውን የግል ቁልፍ ፣ ዘር እና ስልተ ቀመር በመጠቀም ሊተገበር የሚችል የተፈረመ ብሎክን ይፈጥራል ። ውጤቱ እኩዮቻቸው ከመዋቅርዎ ሊያመለክቷቸው የሚገባ ፋይል ነው ።

## ቅርጸት `irohad` {#configure-irohad}

ዲያሞኑን በፈረመበት የጅነሲስ ብሎክ ላይ አኑሩ:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## ተዛማጅ መሣሪያዎች {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ለጀነሬተር ትግበራ እና ትዕዛዝ ዝርዝሮች [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) የሚለውን ይመልከቱ።
