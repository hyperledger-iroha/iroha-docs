---
translation_locale: ba
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` Iroha 3 тиҫтерҙәр демоны башлана.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- Тип: Файл юлы
- Исеме: `-c`

[ конфигурацияһы](/ba/reference/peer-config/index.md) файлына юлды.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Тип: Файл юлы

JSON файлына инеү юлын һайлағыҙ. был файлды ҡулланыу Kagami генерацияланған манифестҡа ҡаршы стартты раҫлағанда файҙаланығыҙ.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Конфигурацияларҙы уҡыу һәм анализлау журналдарын эҙләү мөмкинлеге бирә.

- Тип: флаг
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Тип: Буле, `--terminal-colors=false` йәки `--terminal-colors=true`
- Дефолт: терминалды автоматлаштырыу ярҙамсыһы
- ENV: `TERMINAL_COLORS`

ANSI төҫтәге сығыуҙы рөхсәт итергәме, юҡмы?

default, Iroha терминал төҫлө сығарыуҙы хуплаймы, юҡмы икәнен билдәләй.

Төҫтәрҙе асыҡтан-асыҡ һүндерергә:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Тип: Сылбыр

Демон хәбәрҙәре өсөн ҡулланылған система теленә өҫтөнлөк бирегеҙ.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Тип: флаг

SoraFS өсөн Sora Nexus функцияһы профиле, SoraNet ҡул һелкеү һәм күп юллы консенсус ағымдары булдырыу.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Тип: `auto`, `cpu` йәки `gpu`

FASTPQ проверканы үтәү режимын күсерә.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Тип: `auto`, `cpu` йәки `gpu`

FASTPQ Посейдон торбаһы режимын үтәгеҙ.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Тип: Сылбыр

FASTPQ телеметрия ҡоролмаһы класы этикетын юҡҡа сығарыу.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Тип: Сылбыр

FASTPQ телеметрия чиптар ғаиләһе билдәһен юҡҡа сығарыу.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Тип: Сылбыр

FASTPQ телеметрияһы GPU тибындағы тамғаны юҡҡа сығарыу.

```shell
irohad --fastpq-gpu-kind integrated
```
