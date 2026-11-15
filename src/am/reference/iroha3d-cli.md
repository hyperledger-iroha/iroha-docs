---
translation_locale: am
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` መደበኛው Iroha 3 የአውታረ መረብ አቻ ዴሞን ነው። የጭነት ፓኬጁ `irohad` የሚል ስያሜ ተሰጥቶታል፣ ስለዚህ ሁለትዮሽውን ከምንጭ-ኮድ የሚሰራ ቅጂ ከሚከተለው ጋር ይጥራሉ -

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

ለህዝብ Taira የሙከራ መረብ፣ የተለቀቀው ምስል `iroha3d_taira` ይጠቀማል። ተመሳሳዩን ይቀበላል CLI ነገር ግን በተጨማሪ ነጠላ ፕሮቶኮል-ደረጃውን ያስፈጽማል Taira ሰንሰለት፣ አረጋጋጭ፣ ማከማቻ እና የአሂድ ጊዜ ፈራሚ መገለጫ። እንደዚህ አይነት የሶፍትዌር ማስፈጸሚያ አካባቢ ምስክርነቶችን ሳይከፍቱ የ Taira ውቅረትን ያረጋግጡ

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

ኦፕሬተሩ እሴቶቹን የሞላበትን ቀኖናዊ የTaira መገለጫ ይጠቀሙ፤ በማከማቻው ያለው አብነት አሁንም የስምሪት ጊዜያዊ እሴቶችን ይዟል። በTaira ላይ ሲሞክሩ በአጠቃላይ የSORA Nexus ወይም በእውነተኛ ሥራ አካባቢ የSoraFS ቅንብሮች አይተኩት።

## `--config` {#arg-config}

- አይነት የፋይል መንገድ
- ተለዋጭ ስም `-c`

ወደ [የአውታረ መረብ አቻ ውቅር](/am/reference/peer-config/index.md) የሚወስደው መንገድ።

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- አይነት የፋይል መንገድ

አማራጭ የብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት JSON ለስምምነት ማረጋገጫ ጥቅም ላይ ይውላል።

## `--check-config` {#arg-check-config}

የተፈታውን ውቅር እና የሚገኘውን የብሎክቼይን ጀነሲስ ቁሳቁስ ያረጋግጡ፣ ከዚያ ያለ አስገዳጅ የአውታረ መረብ ሶኬቶች ይውጡ።

## `--json` {#arg-json}

- **አይነት፦** ባንዲራ
- **የሚፈልገው፦** `--check-config`

ከ`Ready` ወይም `Pending` መስመር ይልቅ የዚህን ግንባታና ውቅር ተኳኋኝነት እሴቶች እንደ አንድ Norito JSON ነገር ያትሙ።

## `--check-storage` {#arg-check-storage}

- **አይነት፦** ባንዲራ
- **የሚጋጨው ከ፦** `--check-config`

በዚህ ግንባታ ዲኮደሮች የቆመውን ኖድ የKura ማከማቻና አዲሱን ቅጽበታዊ ቅጂ በንባብ ብቻ ይመርምሩ፣ ውጤቱን እንደ አንድ Norito JSON ነገር ያትሙ፣ ሲከሽፍም ዜሮ ባልሆነ የመውጫ ኮድ ይውጡ። ምርመራው የKura ማከማቻ-ሥር መቆለፊያን ይይዛል፣ ስለዚህ እየሠራ ያለ ኖድ የያዘውን ማከማቻ አይቀበልም። ማከማቻውን ፈጽሞ አይለውጥም፣ በሥራ ጊዜ ብቻ ያሉ ሚስጥሮችንም አይከፍትም።

## `--check-replay` {#arg-check-replay}

- **አይነት፦** ባንዲራ
- **የሚጋጨው ከ፦** `--check-config`፣ `--check-storage`

በዚህ ግንባታ የቆመውን ኖድ የማከማቻ ቅጂ እንደገና ያስፈጽሙ፣ ውጤቱንም እንደ አንድ Norito JSON ነገር ያትሙ። ትዕዛዙ ብሎኮቹን ወደ ጊዜያዊ ማውጫ ይቀዳል፣ በዚያ አዲሱን ቅጽበታዊ ቅጂ ይመልሳል ወይም የተፈረመውን genesis እንደገና ያስፈጽማል፣ ከዚያ በኋላ ያለውን እያንዳንዱን ብሎክ እንደገና ያስፈጽማል። ብሎክ የተረጋገጠውን ውጤት ካልደገመ ወይም የሚያስፈልግ የብሎክ ይዘት ከጠፋ ዜሮ ባልሆነ ኮድ ይወጣል፤ በማከማቻው ላይ ፈጽሞ አይጽፍም፣ በሥራ ጊዜ ብቻ ያሉ ሚስጥሮችንም አይከፍትም።

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **አይነት፦** የመለያ ID
- **የሚፈልገው፦** `--check-config`

ከመስመር ውጭ በሚደረግ ማረጋገጥ ወቅት ትክክለኛው የተፈረመ genesis ከተፈጸመ በኋላ ይህ የተመዘገበ መለያ የSoraCloud ስምሪት ሥልጣንን እንዲያቆይ ይጠይቁ።

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **አይነት፦** ባንዲራ

በዚህ ጅምር ብቻ የኖዱ የመግባባት ቁልፎች ለዚህ ሰንሰለት ፈጽሞ እንዳልፈረሙ ያረጋግጡ። Sumeragi ለእያንዳንዱ ቁልፍ የደህንነት መዝገብ ያቆያል፤ መዝገቡ እንዳልጠፋ ማስረጃ እስኪያገኝ ድረስ ያለመዝገብ ምንም አይፈርምም። ይህን ባንዲራ አዲስ ቁልፍ ለመጀመሪያ ጊዜ ሲነሳ አንድ ጊዜ ብቻ ይስጡ፤ ውሂብ ከጠፋ በኋላ ፈጽሞ አይስጡት።

## `--trace-config` {#arg-trace-config}

- ዓይነት ባንዲራ
- አካባቢ `TRACE_CONFIG`

የማዋቀሪያ ንብርብሮች ሲነበቡ እና ሲተነተኑ የመከታተያ ምዝግብ ማስታወሻዎችን ያንቁ።

## `--config-blake3` {#arg-config-blake3}

- ዓይነት ባለ 64-አሃዝ ሄክሳዴሲማል BLAKE3 ክሪፕቶግራፊያዊ ዳይጀስት
- ያስፈልገዋል `--config`

ከቀረበው የክሪፕቶግራፊያዊ ዳይጀስት ጋር እንዲዛመድ የማዋቀሪያውን ፋይል ባይት ይጠይቁ። ከታማኝነት ጋር የተያያዘ ፋይል ጠፍጣፋ መሆን አለበት; `extends` ሊይዝ አይችልም።

## `--terminal-colors` {#arg-terminal-colors}

- ዓይነት ቡሊያን፣ እንደ `--terminal-colors=true` ወይም `--terminal-colors=false` ተላልፏል።
- ነባሪ የተርሚናል አቅም ማወቂያ
- አካባቢ `TERMINAL_COLORS`

ANSI ቀለም ያለው ውፅዓት ይቆጣጠሩ።

## `--language` {#arg-language}

- ዓይነት ሕብረቁምፊ

ለዴሞን መልዕክቶች ጥቅም ላይ የዋለውን የስርዓት ቋንቋ መሻር

## `--sora` {#arg-sora}

- ዓይነት ባንዲራ
- አካባቢ `IROHA_SORA_PROFILE`

ለSoraFS፣ ለSoraNet የግንኙነት መመሥረት ሂደት እና ለብዙ መስመር መግባባት የሚያገለግለውን የSORA Nexus መገለጫ ያንቁ። የTaira አስጀማሪ ሁልጊዜ በዚህ ባንዲራ ይጠራል።

## FastPQ ይሽራል {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` እና `--fastpq-poseidon-mode <MODE>` የሚቀበሉት `cpu` ወይም `gpu` ብቻ ነው። የተቀሩት አማራጮች የቴሌሜትሪ መለያዎችን ይሽራሉ

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

ለምሳሌ:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## የተፈጠረ እገዛ {#generated-help}

ከላይ ያለው የአማራጮች ማጠቃለያ በተወሰነው Iroha commit ያሉ የ`iroha3d` አርግመንት ትርጉሞችን ይከተላል። ለቼክአውትዎ ትክክለኛውን እርዳታ ለማየት ይህን ያስኪዱ:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
