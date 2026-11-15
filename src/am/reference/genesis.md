---
translation_locale: am
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# blockchain ጀነሲስ ማጣቀሻ {#genesis-reference}

አሁን ባለው Iroha 3 የስራ ሂደት፣ `genesis.json` ቴክኒካል ማኒፌስት አውታረ መረቡ ሲጀምር የሚተገበሩትን የመጀመሪያዎቹን ግብይቶች እና መለኪያዎች ይገልጻል።

ለኔትወርክ እኩዮች የተሰራጨው የተፈረመው አርቲፋክት በ`kagami genesis sign` የተሰራው Norito የተመሰጠረ `.nrt` ፋይል ነው።

## ዋና መስኮች {#main-fields}

የብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት የሚከተሉትን ሊገልጽ ይችላል -

- `chain` ለሰንሰለት መለያ
- በማኒፌስቱ የመለያ ጽሑፍ እሴቶችን ለመቀየር ለሚያገለግለው I105 የአውታረ መረብ ቅድመ ቅጥያ `chain_discriminant`
- `executor` ለአማራጭ አስፈፃሚ የማሻሻያ ባይት ኮድ መንገድ
- `ivm_dir` ቀስቅሴዎች እና ማሻሻያዎች ጥቅም ላይ ለሚውሉ IVM ቤተ-መጻሕፍት
- `consensus_mode` በቴክኒካዊ ማኒፌስት ለማስታወቂያው የመጀመሪያ ሁነታ
- `wire_protocol_version` ለመጀመሪያው ልቀት የጋራ ስምምነት የማስተላለፊያ ፕሮቶኮል ስሪት
- `consensus_fingerprint` ለጋራ ስምምነት መለኪያዎች አማራጭ የተተየበ የጣት አሻራ፤ JSON ማኒፌስቶች ይህንን በግልጽ ይገልጻሉ
- `transactions` ለታዘዙ የመለኪያ ዝመናዎች፣ መመሪያዎች፣ ቀስቅሴዎች እና ቶፖሎጂ
- ለተፈረሙ የSumeragi ከፍታ አውድ መለኪያዎች `sumeragi_context`
- ሰንሰለቱ ለሚቀበላቸው፣ በ`allowed_algorithms` ለተዘረዘሩ ትክክለኛ የፊርማና የተቆጣጣሪ አልጎሪዝሞች `crypto_admission_policy`

በ`transactions` ውስጥ፣ የቶፖሎጂ ግቤቶች የአውታረ መረብ አቻ መታወቂያዎችን እና PoPs ን አንድ ላይ ያጣምራሉ -

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ቴክኒካዊ ማኒስት ይፍጠሩ {#generate-a-manifest}

አብነት ለማመንጨት Kagami ይጠቀሙ። ለእያንዳንዱ የተፈቀደ አልጎሪዝም `--allowed-signing`ን በእየጨመረ ቀኖናዊ ቅደም ተከተል ይድገሙ፤ Kagami የተተዉ አልጎሪዝሞችን በራሱ አይሞላም:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

ለክፍቱ የSORA Nexus ውሂብ ቦታ የሚጠበቀው የመግባባት ሁነታ `npos` ነው። ሌሎች Iroha 3 ጭነቶች እንደ ዒላማ መገለጫው በፈቃድ የሚሠራ ሁነታ ወይም NPoS ሊጠቀሙ ይችላሉ።

## ቴክኒካዊ ማኒፌስት ይፈርሙ {#sign-the-manifest}

JSON ን ካረትዑ እና ካረጋገጡ በኋላ ሊሰማራ በሚችል `.nrt` ብሎክ ውስጥ ይግቡ -

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` ሊሰማራ የሚችል የተፈረመ ብሎክ ለማዘጋጀት በባለቤቱ ከተያዘው ነጠላ-ማገናኛ መደበኛ ፋይል ውስጥ ካለው የግል ቁልፍ የጀነሲስ ቁልፍ ጥንዱን ያመነጫል። ከታተመው የጀነሲስ ይፋዊ ቁልፍ ጋር እንዲዛመድ ለመጠየቅ `--expected-public-key` ያስተላልፉ። ፋይሉ አንድ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የግል-ቁልፍ መልቲሃሽ እና ከዚያ አዲስ መስመር መያዝ አለበት፤ Kagami ምሳሌያዊ አገናኞችን እና ከ`0600` ሌላ ሁነታዎችን ውድቅ ያደርጋል። ጥሬ የግል ቁልፎች በትእዛዝ መስመሩ ላይ ተቀባይነት የላቸውም። ውጤቱም የአውታረ መረብ አቻዎች ከውቅራቸው መጥቀስ ያለባቸው ፋይል ነው።

## አዋቅር `iroha3d` {#configure-iroha3d}

ለዴሞኑ የተፈረመውን የgenesis ብሎክ እና የሚጠበቀውን ሃሽ የሚይዘውን ፋይል ይጠቁሙ። `kagami genesis sign --expected-hash-out` ያንን ፋይል ይጽፋል፣ ኖዱም በመጀመሪያ ጅምርና በዳግም ጅምር ይፈልገዋል:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## ተዛማጅ መሣሪያዎች {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

ለጄነሬተር ትግበራ እና የትእዛዝ ዝርዝሮች፣ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) የሚለውን ይመልከቱ።
