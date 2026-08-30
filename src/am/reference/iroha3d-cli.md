---
translation_locale: am
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` መደበኛ ነው Iroha 3 peer daemon. የ Cargo ፓኬጅ ስም ነው `irohad`, ስለዚህ ከ ምንጭ ቼክ አወጣጥ ላይ በሁለትዮሽ መጠየቅ ጋር:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

ለህዝብ Taira የሙከራ አውታረመረብ፣ የመልቀቂያ ምስሉ `iroha3d_taira` ይጠቀማል። ተመሳሳይ CLI ይቀበላል ። በተጨማሪም የካኖኒካል Taira ሰንሰለት ፣ የማረጋገጫ ስብስብ ፣ የማከማቻ ቅንብሮች እና የሂደት ጊዜ ፊርማ ቁልፎችን ያስገድዳል ። የ Taira ውቅርን እንደነዚህ ያሉ የአሂድ ጊዜ ማረጋገጫዎችን ሳይከፍቱ ያረጋግጡ:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

ኦፕሬተሩ ከመጠቀምዎ በፊት የካኖኒክ Taira መገለጫን ማቅረብ አለበት ። የተቀበለው አብነት ምሳሌ ቅንብሮች አሉት. ኦፕሬተሩ እያንዳንዱን ምሳሌ ቅንብር መተካት አለበት ። ከ Taira ጋር በሚፈተንበት ጊዜ የጄኔሪክ Nexus ወይም የምርት SoraFS ቅንጅቶችን አይጠቀሙ።

## `--config` {#arg-config}

- አይነት: የፋይል መንገድ
- ስያሜ: `-c`

ወደ [ peer configuration ](/am/reference/peer-config/index.md) የሚወስደው መንገድ።

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- አይነት: የፋይል መንገድ

ለስምምነት ማረጋገጫ ጥቅም ላይ የዋለው አማራጭ የመግቢያ መግለጫ JSON።

## `--check-config` {#arg-check-config}

የተፈታውን ውቅር እና የሚገኝ የጄኔሲስ ቁሳቁስ ያረጋግጡ, ከዚያም አውታረ መረብ ሶኬቶችን ሳይያያዙ መውጣት.

## የካጌሙሻ ማረጋገጫ ማህተሞች {#kagemusha-qualification-seals}

እነዚህ የፋይል-መንገድ አማራጮች `--check-config` ይጠይቃሉ እና ቀኖናዊ ማህተም ከመጻፍዎ በፊት ሙሉ የካጌሙሻ ማረጋገጫ ያካሂዳሉ:

- `--write-kagemusha-catalog-qualification-seal <PATH>` ካታሎጉን ያመቻቻል.
- `--write-kagemusha-validator-qualification-seal <PATH>` የአካባቢውን ማረጋገጫ ሰጪው ከተዋቀረው የተፈረመ የማስተዋወቂያ ማስያዣ ጋር ይመሳሰላል ።

ሁለቱ የፍተሻ አማራጮች እርስ በእርሳቸው ይጋጫሉ።

## `--trace-config` {#arg-trace-config}

- አይነት: ባንዲራ
- አካባቢ: `TRACE_CONFIG`

የኮንፊግሬሽን ንብርብሮች በሚነበቡበትና በሚመረመሩበት ጊዜ የመከታተያ መዝገቦችን ማግበር።

## `--config-blake3` {#arg-config-blake3}

- አይነት: 64-digit hexadecimal BLAKE3 digest
- መስፈርቶች: `--config`

የቅንብሪ ፋይል ባይቶች ከተቀረበው ዳይጀስት ጋር እንዲዛመዱ ይጠይቁ። የአንፃራዊነት የተገደበ ፋይል ጠፍጣፋ መሆን አለበት ፣ `extends` ሊኖረው አይችልም ።

## `--terminal-colors` {#arg-terminal-colors}

- አይነት: `--terminal-colors=true` ወይም `--terminal-colors=false` ተብሎ የተላለፈ ቡሊን
- ነባሪ: የደረጃ አቅም ማረጋገጫ
- አካባቢ: `TERMINAL_COLORS`

የቁጥጥር ANSI ቀለም ያለው ውፅዓት.

## `--language` {#arg-language}

- አይነት: ገመድ

ለዴይሞን መልዕክቶች ጥቅም ላይ የዋለውን የስርዓት ቋንቋ አስወግድ።

## `--sora` {#arg-sora}

- አይነት: ባንዲራ
- አካባቢ: `IROHA_SORA_PROFILE`

የሶራ Nexus መገለጫን አክቲቭ አድርግ። ይህ መገለጫ SoraFS, የ SoraNet እጅ መንሻ, እና ባለብዙ መስመሮች ስምምነት ያቀርባል. ሁልጊዜ ይህን ባንዲራ ጋር Taira ተኳሽ ይደውሉ.

## FastPQ አሻራዎች {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` እና `--fastpq-poseidon-mode <MODE>` መቀበል ብቻ `cpu` ወይም `gpu`. ቀሪዎቹ አማራጮች የቴሌሜትሪ መለያዎችን ይተካሉ

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

ለምሳሌ፡-

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## የተፈጠረ እርዳታ {#generated-help}

ከዚህ በታች ያለው የተሟላ ውፅዓት ከታሸገ Iroha ምንጭ ኮሚቴ የተገኘ ነው ።

<<< @/snippets/iroha3d-help.md
