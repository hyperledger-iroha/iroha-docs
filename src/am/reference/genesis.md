---
translation_locale: am
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የዘፍጥረት ዘገባ {#genesis-reference}

በወቅቱ Iroha 3 የስራ ፍሰት `genesis.json` መገለጫው የመጀመሪያውን ይገልጻል
አውታረመረብ ሲጀመር የሚተገበሩ ግብይቶችና መለኪያዎች።

ለባልደረቦቹ የተሰራጨው ፊርማ የተሰየመ ጥንታዊ ዕቃ Norito-የተከፈተ `.nrt` መዝገብ
በ `kagami genesis sign`.

## ዋና መስኮች {#main-fields}

የጄኔሲስ ማኒፌስት የሚከተሉትን ሊገልጽ ይችላል-

- `chain` ለሰንሰለት መታወቂያ
- `executor` ለ አማራጭ አስፈፃሚ ማሻሻያ ባይትኮድ መንገድ
- `ivm_dir` ለ IVM በማስነሳት እና በማዘመን የሚጠቀሙባቸው ቤተ-መጻሕፍት
- `consensus_mode` በማኒፌስት የታወጀውን የመጀመሪያ ሁኔታ
- `transactions` ለተዘረዘሩ ፓራሜትር ዝመናዎች፣ መመሪያዎች፣ አስነሳሾች እና ቶፖሎጂ
- `crypto` ለቀዳሚ የክሪፕቶ ፎቶግራፍ

በውስጡ `transactions`, የቶፖሎጂ ግቤቶች እኩዮች መታወቂያዎች እና PoPs በጋራ:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## አንድ ማሳያ ያዘጋጁ {#generate-a-manifest}

አጠቃቀም Kagami አብነት ለመፍጠር:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

ለሕዝብ SORA Nexus የመረጃ ቦታ፣ `npos` የሚጠበቀው የጋራ ስምምነት ሁነታ ነው።
ሌሎች Iroha 3 ተልዕኮዎች በዒላማው ላይ በመመርኮዝ የተፈቀደውን ወይም NPoS መጠቀም ይችላሉ
መገለጫ።

## የምስክር ወረቀቱን ይፈርሙ {#sign-the-manifest}

አርትዖት እና ማረጋገጫ በኋላ JSON, ወደሚተገበርበት `.nrt` ማገጃ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` የጄኔሲስ የሕዝብ ቁልፍ ከፕሮጀክቱ እና አጠቃቀሞች
የተሰጠው የግል ቁልፍ፣ ዘር እና ስልተ ቀመር ተሰማርቶ የሚሰራውን ፊርማ ለማምረት
ውጤቱ እኩዮች ከቅንጅታቸው ሊያመለክቷቸው የሚገባው ፋይል ነው።

## አወቃቀር `irohad` {#configure-irohad}

ዲያሞኑን በፊርማ የተጻፈውን የጅነሲስ ብሎክ ላይ አኑሩ:

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

ለጀነሬተር ትግበራ እና ትዕዛዝ ዝርዝሮች, ተመልከት
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
