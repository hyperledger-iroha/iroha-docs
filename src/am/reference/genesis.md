---
translation_locale: am
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የዘፍጥረት ማጣቀሻ {#genesis-reference}

አሁን ባለው ሁኔታ Iroha 3 የስራ ሂደት፣ ሀ `genesis.json` አንጸባራቂ የመጀመሪያውን ይገልፃል።
አውታረ መረቡ ሲጀምር የሚተገበሩ ግብይቶች እና ግቤቶች።

ለእኩዮች የተሰራጨው የተፈረመበት ቅርስ ሀ Norito- ኮድ የተደረገ `.nrt` ፋይል
በ `kagami genesis sign`.

## ዋና መስኮች {#main-fields}

የዘፍጥረት መግለጫ የሚከተሉትን ሊገልጽ ይችላል-

- `chain` ለ ሰንሰለት መለያ
- `executor` ለአማራጭ አስፈፃሚ የባይቴኮድ መንገድ አሻሽል።
- `ivm_dir` ለ IVM ቀስቅሴዎች እና ማሻሻያዎች የሚጠቀሙባቸው ቤተ-መጻሕፍት
- `consensus_mode` በአንጸባራቂው ለተዋወቀው የመጀመሪያ ሁነታ
- `transactions` ለታዘዙ የመለኪያ ማሻሻያዎች፣ መመሪያዎች፣ ቀስቅሴዎች እና ቶፖሎጂ
- `crypto` ለመጀመሪያው crypto ቅጽበታዊ ገጽ እይታ

ውስጥ `transactions`, ቶፖሎጂ ግቤቶች ጥንድ አቻ መታወቂያ እና PoPs አንድ ላየ፥

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## አንጸባራቂ ይፍጠሩ {#generate-a-manifest}

ተጠቀም Kagami አብነት ለመፍጠር፡-

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

ለህዝብ SORA Nexus የመረጃ ቦታ፣ `npos` የሚጠበቀው የጋራ ስምምነት ሁነታ ነው.
ሌላ Iroha 3 በዒላማው ላይ በመመስረት ማሰማራት የተፈቀደ ወይም NPoS ሊጠቀሙ ይችላሉ።
መገለጫ.

## መግለጫውን ይፈርሙ {#sign-the-manifest}

አርትዖት ካደረጉ እና ካረጋገጡ በኋላ JSON, ወደ ማሰማራት ይፈርሙ `.nrt` አግድ

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` የዘፍጥረት ህዝባዊ ቁልፍን ከማንፀባረቂያው ያነባል እና ይጠቀማል
የግል ቁልፉን በባለቤትነት ከተያዘ፣ ነጠላ አገናኝ መደበኛ ፋይል ለማምረት
ሊሰራ የሚችል የተፈረመ እገዳ.ፋይሉ አንድ ቀኖናዊ የግል ቁልፍ መያዝ አለበት።
መልቲሃሽ በአዲስ መስመር ተከትሎ; Kagami ተምሳሌታዊ አገናኞችን እና ሌሎች ሁነታዎችን ውድቅ ያደርጋል
ከ `0600`. ጥሬ የግል ቁልፎች በትእዛዝ መስመር ላይ ተቀባይነት የላቸውም።ውጤቱ
አቻዎች ከውቅራቸው መጥቀስ ያለባቸው ፋይል ነው።

## አዋቅር `iroha3d` {#configure-iroha3d}

ዲሞንን በተፈረመው የዘረመል እገዳ ላይ ያመልክቱ፡-

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## ተዛማጅ መሳሪያዎች {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ለጄነሬተር አተገባበር እና የትዕዛዝ ዝርዝሮች, ይመልከቱ
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
