---
translation_locale: am
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` አንድ Iroha 3 የእኩዮች ዳይሞን ይጀምራል.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- አይነት: የፋይል መንገድ
- ስያሜ: `-c`

ወደ [ ውቅር ፋይል ](/am/reference/peer-config/index.md) የሚወስደው መንገድ።

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- አይነት: የፋይል መንገድ

ወደ ጅምር ማኒፌስት JSON ፋይል አማራጭ መንገድ። ትግበራው በ Kagami ከተፈጠረ ማኒፌስ ጋር በመነሳት ማስጀመሪያውን ሲያረጋግጥ ይህን ይጠቀሙ ።

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

ቅንብሮች ማንበብ እና ማጣሪያ ትረካ መዝገቦችን ያስችለዋል. ለቅንብሮች ችግር መፍታት ጠቃሚ ሊሆን ይችላል.

- አይነት: ባንዲራ
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- አይነት: ቦሌን `--terminal-colors=false` ወይም `--terminal-colors=true`
- ነባሪ: በራስ-ማስተዋል ተርሚናል ድጋፍ
- ENV: `TERMINAL_COLORS`

ANSI ቀለም ያለው ውፅዓት እንዲፈቀድ ወይም እንዳይፈቅድ።

በነባሪነት Iroha ተርሚናሉ ቀለም ያለው ውፅዓት ይደግፋል ወይም አይደግፍም የሚለውን ይወስናል።

ቀለሞችን በግልጽ ለማሰናከል:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- ዓይነት: ገመድ

ለዴይሞን መልዕክቶች ጥቅም ላይ የዋለውን የስርዓት ቋንቋ አስወግድ።

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- አይነት: ባንዲራ

ለ SoraFS የሶራ Nexus ባህሪ መገለጫ ፣ ለ SoraNet እጅ መንካት እና ለበርካታ መስመሮች የጋራ ስምምነት ፍሰቶች ያስችላል።

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- አይነት: `auto`, `cpu`, ወይም `gpu`

FASTPQ የፕሮግራም አፈፃፀም ሁነታውን አሻግሩ።

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- አይነት: `auto`, `cpu`, ወይም `gpu`

FASTPQ የፖሲዶን የቧንቧ መስመር ሁነታ አሻሽል.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- ዓይነት: ገመድ

የ FASTPQ የቴሌሜትሪ መሳሪያ ክፍል መለያውን ይተው።

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- ዓይነት: ገመድ

FASTPQ የቴሌሜትሪ ቺፕ ቤተሰብ መለያውን ይተው።

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- ዓይነት: ገመድ

የ FASTPQ ቴሌሜትሪ GPU ዓይነት መለያን ይተው።

```shell
irohad --fastpq-gpu-kind integrated
```
