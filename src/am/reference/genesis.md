---
translation_locale: am
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blockchain ጀነሲስ ማጣቀሻ {#genesis-reference}

አሁን ባለው Iroha 3 የስራ ሂደት፣ `genesis.json` ቴክኒካል ማኒፌስት አውታረ መረቡ ሲጀምር የሚተገበሩትን የመጀመሪያዎቹን ግብይቶች እና መለኪያዎች ይገልጻል።

ለኔትወርክ እኩዮች የተሰራጨው የተፈረመው አርቲፋክት በ`kagami genesis sign` የተሰራው Norito የተመሰጠረ `.nrt` ፋይል ነው።

## ዋና መስኮች {#main-fields}

የብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት የሚከተሉትን ሊገልጽ ይችላል -

- `chain` ለሰንሰለት መለያ
- `executor` ለአማራጭ አስፈፃሚ የማሻሻያ ባይት ኮድ መንገድ
- `ivm_dir` ቀስቅሴዎች እና ማሻሻያዎች ጥቅም ላይ ለሚውሉ IVM ቤተ-መጻሕፍት
- `consensus_mode` በቴክኒካዊ ማኒፌስት ለማስታወቂያው የመጀመሪያ ሁነታ
- `transactions` ለታዘዙ የመለኪያ ዝመናዎች፣ መመሪያዎች፣ ቀስቅሴዎች እና ቶፖሎጂ
- `crypto` ለመጀመሪያው የ crypto ነጥብ-በጊዜ ውሂብ እይታ

በ`transactions` ውስጥ፣ የቶፖሎጂ ግቤቶች የአውታረ መረብ አቻ መታወቂያዎችን እና PoPs ን አንድ ላይ ያጣምራሉ -

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ቴክኒካዊ ማኒስት ይፍጠሩ {#generate-a-manifest}

አብነት ለማመንጨት Kagami ን ይጠቀሙ -

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

ለህዝብ SORA Nexus የውሂብ ቦታ፣ `npos` የሚጠበቀው የጋራ መግባባት ሁነታ ነው። ሌሎች Iroha 3 ማሰማራቶች እንደ ዒላማው መገለጫ የተፈቀደ ወይም NPoS ሊጠቀሙ ይችላሉ።

## ቴክኒካዊ ማኒፌስት ይፈርሙ {#sign-the-manifest}

JSON ን ካረትዑ እና ካረጋገጡ በኋላ ሊሰማራ በሚችል `.nrt` ብሎክ ውስጥ ይግቡ -

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` የብሎክቼይን ጀነሲስ የህዝብ ቁልፍን ከቴክኒካል ማኒፌስት ያነባል እና ሊሰማራ የሚችል የተፈረመውን ብሎክ ለማዘጋጀት በባለቤቱ ከተያዘው ነጠላ-ማገናኛ መደበኛ ፋይል የግል ቁልፍን ይጠቀማል።. ፋይሉ አንድ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የግል-ቁልፍ መልቲሃሽ እና አዲስ መስመር መያዝ አለበት; . Kagami ከ `0600` ሌላ ምሳሌያዊ አገናኞችን እና ሁነታዎችን ውድቅ ያደርጋል። ጥሬ የግል ቁልፎች በትእዛዝ መስመሩ ላይ ተቀባይነት የላቸውም. ውጤቱም የአውታረ መረብ እኩዮች ከማዋቀራቸው መጥቀስ ያለባቸው ፋይል ነው።

## አዋቅር `iroha3d` {#configure-iroha3d}

ዴሞኑን በተፈረመው የብሎክቼይን ጀነሲስ ብሎክ ላይ ያመልክቱ -

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

ለጄነሬተር ትግበራ እና የትእዛዝ ዝርዝሮች፣ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md) የሚለውን ይመልከቱ።
