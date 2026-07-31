---
translation_locale: kk
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` бастайды Iroha 3 теңгерімдік демон.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- Түрі: Файл жолы
- `-c`

[konfiguration](/kk/reference/peer-config/index.md) файлына жол.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Түрі: Файл жолы

Жаратылыс манифесті JSON файлына еріксіз жол. Пайдалану Kagami тудырған манифестке қарсы іске қосылуды растаған кезде оны қолданыңыз.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Конфигурацияларды оқу мен талдау журналдарын бақылауға мүмкіндік береді.

- Түрі: желек
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Үлгі: Булеан, `--terminal-colors=false` немесе `--terminal-colors=true`
- Әдеттегісі: автоматты түрде анықталатын терминалды қолдау
- ENV: `TERMINAL_COLORS`

ANSI түсті шығаруды рұқсат етуі немесе бермеуі.

Әдетті түрде Iroha терминал түстерді шығаруды қолдайды ма, жоқ па екенін анықтайды.

Түстерді айқын өшіру үшін:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Түрі: Стринг

Демон хаттары үшін қолданылатын жүйе тілін өшіріңіз.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Түрі: желек

Сораны қосу Nexus ерекшелік профилі SoraFS, Атап айтқанда SoraNet қол алысу, және көп жолдық консенсус ағыны.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Түрі: `auto`, `cpu`, немесе `gpu`

FASTPQ провердің орындалу режимін бұзып тастаңыз.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Түрі: `auto`, `cpu`, немесе `gpu`

FASTPQ Посейдон құбыр жолы режимін бұзып тастаңыз.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Түрі: Стринг

FASTPQ телеметриялық құрылғылар класы таңбасын өшіру.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Түрі: Стринг

FASTPQ телеметриялық микросхемалардың отбасылық таңбасын өшіру.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Түрі: Стринг

FASTPQ телеметриясы GPU түріндегі этикетканы өшіру.

```shell
irohad --fastpq-gpu-kind integrated
```
