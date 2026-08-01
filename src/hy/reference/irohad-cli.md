---
translation_locale: hy
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` սկսում է մի Iroha 3 զուգընկեր Daemon.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- Տիպը. Ֆայլերի ուղին
- Անանուններ: `-c`

Ճանապարհ դեպի [կոնֆիգուրացիայի ֆայլը ](/hy/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Տիպը. Ֆայլերի ուղին

Ընտրական ուղին գեներեզի մանիֆես JSON ֆայլում: Օգտագործեք սա, երբ տեղադրումը հաստատում է մեկնարկը Kagami կողմից ստեղծված մանիֆեսիոնայի հետ:

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Թույլ է տալիս հետեւել կոնֆիգուրացիայի ընթերցման եւ վերլուծության օրագրերը: Դա կարող է օգտակար լինել կոնֆիגուրացիայի խնդիրների լուծման համար.

- Տիպ: դրոշ
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Տիպ. Բուլյան կամ `--terminal-colors=false` կամ `--terminal-colors=true`
- Նախադրյալ՝ ինքնաբերաբար հայտնաբերելու վերջակետի աջակցություն
- ENV: `TERMINAL_COLORS`

Կամ թույլ տալ ANSI գույնով արտադրանքը, թե ոչ:

Պաշտոնապես Iroha որոշում է, թե արդյոք տերմինալը աջակցում է գունավոր արտադրանքին, թե՞ ոչ:

Բացարձակապես անջատելու համար գույները.

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Տիպ: Սարսեր

Հաշվի առեք դեյմոնային հաղորդագրությունների համար օգտագործվող համակարգի լեզուն:

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Տիպ: դրոշ

Սեղմեք Sora Nexus առանձնահատկությունների պրոֆիլը SoraFS, SoraNet ձեռքի սեղմումը եւ բազմակողմանի համաձայնության հոսքերը:

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Տիպ. `auto`, `cpu`, կամ `gpu`

Հաշվարկել FASTPQ պրովեր կատարման ռեժիմը:

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Տիպ. `auto`, `cpu`, կամ `gpu`

Հաշվարկել FASTPQ Պոզեյդոնի հոսանքի ռեժիմը:

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Տիպ: Սարսեր

Հաշվի առնելով FASTPQ հեռահամաչափության սարքի դասի տեքստը:

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Տիպ: Սարսեր

Հաշվարկել FASTPQ հեռահամաչափության սխեճերի ընտանիքը:

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Տիպ: Սարսեր

FASTPQ հեռաչափության GPU տեսակի տեքստը վերացրեք:

```shell
irohad --fastpq-gpu-kind integrated
```
