---
translation_locale: am
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
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

ነጠላ ፕሮቶኮል-ስታንዳርድ Taira መገለጫ በኦፕሬተር የተሰራውን ቅጽ ይጠቀሙ; ተመዝግቦ የገባው አብነት አሁንም የማሰማራት ቦታ ያዢዎችን ይዟል። በ Taira ላይ ሲሞክሩ አጠቃላይ Nexus ወይም የምርት SoraFS ቅንብሮችን አይተኩ።

## `--config` {#arg-config}

- አይነት የፋይል መንገድ
- ተለዋጭ ስም `-c`

ወደ [የአውታረ መረብ አቻ ውቅር](/am/reference/peer-config/index.md) የሚወስደው መንገድ።

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- አይነት የፋይል መንገድ

አማራጭ የብሎክቼይን ጀነሲስ ቴክኒካል ማኒፌስት JSON ለስምምነት ማረጋገጫ ጥቅም ላይ ይውላል።

## `--check-config` {#arg-check-config}

የተፈታውን ውቅር እና የሚገኘውን የብሎክቼይን ጀነሲስ ቁሳቁስ ያረጋግጡ፣ ከዚያ ያለ አስገዳጅ የአውታረ መረብ ሶኬቶች ይውጡ።

## የካጌሙሻ ብቃት ማኅተሞች {#kagemusha-qualification-seals}

እነዚህ የፋይል-መንገድ አማራጮች `--check-config` ያስፈልጋቸዋል እና አንድ ፕሮቶኮል-መደበኛ ማህተም ከመጻፍዎ በፊት ሙሉ የ Kagemusha መመዘኛን ያከናውናሉ -

- `--write-kagemusha-catalog-qualification-seal <PATH>` ካታሎጉን ብቁ ያደርገዋል።
- `--write-kagemusha-validator-qualification-seal <PATH>` ከተዋቀረው የተፈረመ የማስተዋወቂያ ቦታ ማስያዝ ላይ የአካባቢውን አረጋጋጭ ብቁ ያደርገዋል።

ሁለቱ የማኅተም አማራጮች እርስ በርስ ይጋጫሉ.

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

በ SoraFS፣ በ SoraNet የእጅ መጨባበጥ እና ባለብዙ መስመር መግባባት ጥቅም ላይ የዋለውን የሶራ Nexus መገለጫ አንቃ። የ Taira አስጀማሪው ሁል ጊዜ በዚህ ባንዲራ ይጠራል።

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

ከላይ ያለው የአማራጭ ማጠቃለያ አሁን ካለው `iroha3d` የክርክር ትርጓሜዎች አንጻር ተረጋግጧል። ተመዝግቦ የገባው የእገዛ ነጥብ-በጊዜ ውሂብ እይታ የመነሻ ሁኔታው በመጠባበቅ ላይ እያለ ሆን ተብሎ አልተሰራም። ለቼክ መውጫዎ ትክክለኛውን እገዛ ለመፈተሽ ያሂዱ -

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
