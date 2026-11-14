---
translation_locale: am
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# blockchain ጀነሲስ {#genesis}

Blockchain ጀነሲስ የመጀመሪያውን ሰንሰለት ሁኔታ ይገልጻል። ሊስተካከል የሚችል ምንጭ JSON ቴክኒካል ማኒፌስት ነው፣ እና Iroha 3 ኖድ የተፈረመ Norito የግብይት ፋይል ይጠቀማል።

::: details ነባሪ blockchain ጀነሲስ ቴክኒካዊ አንጸባራቂ

<<< @/snippets/genesis.json

:::

## ፋይሎች {#files}

ዋናው ማከማቻ በ`defaults/genesis.template.json` መደበኛ የምንጭ አብነት ያቀርባል። አብነት ያልተሟላ ነው፤ `kagami genesis materialize` ወደ ማኒፌስት እስኪቀይረው ድረስ ሊረጋገጥ፣ ሊፈረም ወይም በኖድ ሊጠቀም አይችልም። Kagami የፈጠራቸው አውታረ መረቦች የራሳቸውን ማኒፌስትና የተፈረመ ግብይት በውጤት ማውጫው ይጽፋሉ:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

በዚያ ማውጫ ውስጥ ያለው የመነጨው `README.md` ትክክለኛውን ፋይሎች ይመዘግባል እና ለተመረጠው መገለጫ ትዕዛዞችን ያስጀምራል።

## የአውታረ መረብ አቻ ውቅር {#peer-configuration}

አቻዎች በ`config.toml` ውስጥ ባለው `[genesis]` ክፍል የተፈረመውን የgenesis ግብይት ይጠቅሳሉ፣ የሚጠበቀውን ሃሽም በተለየ ፋይል ያስቀምጣሉ:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

በአውታረ መረቡ ያሉ ሁሉም አቻዎች በተፈረመው የgenesis ግብይትና በgenesis ይፋዊ ቁልፍ መስማማት አለባቸው። የሚጠበቀው ሃሽ ፋይል በመጀመሪያ ጅምርና በዳግም ጅምር ያስፈልጋል፤ `kagami genesis sign --expected-hash-out` ይጽፈዋል።

## የብሎክቼይን ጀነሲስ መፈረም {#signing-genesis}

የቴክኒክ ማኒፌስት እራስዎ ካስተካከሉ የአውታረ መረብ እኩዮችን ከመጀመርዎ በፊት ያረጋግጡ እና ይፈርሙ -

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` በባለቤት የተያዘ ሁነታ-`0600`፣ ነጠላ-አገናኝ መደበኛ ፋይል አንድ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የግል-ቁልፍ መልቲሃሽ እና የመጨረሻውን አዲስ መስመር የያዘ መሆን አለበት።. Kagami ምሳሌያዊ አገናኞችን አይቀበልም እና በትእዛዝ መስመሩ ላይ ጥሬ የብሎክቼይን ጀነሲስ የግል ቁልፍን በጭራሽ አይቀበልም።.

ለNPoS ወይም SORA Nexus መገለጫዎች በተፈጠረው መገለጫ የሚፈለጉ አወቃቀርና የBLS ባለቤትነት ማስረጃዎችን ያካትቱ። የKagami `localnet generate`፣ `wizard` እና `sora-network generate` ትዕዛዞች እነዚህን ዝርዝሮች በራሳቸው ያስተናግዳሉ።

## የብሎክቼይን ጀነሲስ እንደገና መፈጸም {#recommitting-genesis}

አዲስ አውታረ መረብ ከራሱ የተፈረመ ጄኔሲስ ይጀምራል። በጊዜያዊ የአካባቢ አውታረ መረብ ውስጥ ሌላ ጄኔሲስ ለመፈተሽ፣ አቻዎቹን ያቁሙ፣ የፈጠሩትን የሁኔታ ማውጫ ይሰርዙ እና ከአዲሱ የተፈረመ ጄኔሲስ ያስጀምሩ። እየሠራ ያለ አውታረ መረብ እንደ ማሻሻያ ዘዴ ጄኔሲሱን ፈጽሞ መተካት የለበትም። የፕሮቶኮል ትርጓሜዎችን ለመለወጥ በአስተዳደር ደንቦች የሚመሩ የምርጫ ሽግግሮች እና ለተመረጡት ትርጓሜዎችና ግዴታዎች የብቃት ማረጋገጫ ያስፈልጋሉ።
