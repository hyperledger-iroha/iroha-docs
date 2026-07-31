---
translation_locale: am
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` አንድ ይጀምራል Iroha 3 የእኩዮች ዳሚን.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **አይነት:** የፋይል መንገድ
- **ስያሜ:** `-c`

ወደ ጎዳና [ውቅር](/am/reference/peer-config/index.md) መዝገብ።

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **አይነት:** የፋይል መንገድ

ወደ ጀኔዝ መገለጫ አማራጭ መንገድ JSON ፋይል: ይህን መጠቀም
በመተግበሪያው የተፈጠረውን ማኒፌስት በመቃወም ማስጀመር ይረጋገጣል Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

ውቅርን ማንበብ እና ማሰስ የክትትል መዝገቦችን ያስችለዋል. ለዋናነት ችግር መፍታት ጠቃሚ ሊሆን ይችላል.

- **አይነት:** ባንዲራ
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **አይነት:** ቡሊያን፣ ወይ `--terminal-colors=false` ወይም
  `--terminal-colors=true`
- **ነባሪ:** በራስ-ማስተዋል ተርሚናል ድጋፍ
- **ENV:** `TERMINAL_COLORS`

እንዲቻል ማድረግ ANSI-ቀለም ያለው ውፅዓት ወይም አይደለም.

በነባሪነት, Iroha ተርሚናሉ ቀለም ያለው ውፅዓት የሚደግፍ መሆኑን ይወስናል
ወይም አይደለም.

ቀለሞችን በግልጽ ለማሰናከል:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **አይነት:** ገመድ

ለዴይሞን መልዕክቶች ጥቅም ላይ የዋለውን የስርዓት ቋንቋ አስወግድ.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **አይነት:** ባንዲራ

ሶራውን አክቲቭ አድርግ Nexus ለ ባህሪ መገለጫ SoraFS, የ SoraNet የእጅ መጨናነቅ እና
ባለብዙ መስመሮች የጋራ ስምምነት ፍሰቶች።

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **አይነት:** `auto`, `cpu`, ወይም `gpu`

አሻራ FASTPQ የአፈፃፀም ሁነታ።

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **አይነት:** `auto`, `cpu`, ወይም `gpu`

አሻራ FASTPQ የፖዚዶን ቧንቧ ሁነታ።

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **አይነት:** ገመድ

የ FASTPQ የቴሌሜትሪ መሳሪያ ክፍል መለያ።

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **አይነት:** ገመድ

የ FASTPQ የቴሌሜትሪ ቺፕ ቤተሰብ መለያ።

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **አይነት:** ገመድ

የ FASTPQ ቴሌሜትሪ GPU-እንደ አንድ ዓይነት መለያ።

```shell
irohad --fastpq-gpu-kind integrated
```
