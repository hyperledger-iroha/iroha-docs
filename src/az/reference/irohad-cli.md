---
translation_locale: az
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` bir Iroha 3 peer daemon başlayır.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- Tipi: Dosya yolu
- Alias: `-c`

[konfigurasiyasının ](/az/reference/peer-config/index.md) faylına yol.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipi: Dosya yolu

JSON faylına seçmə yolu. İstifadə Kagami tərəfindən istehsal olunan bir manifestlə startı təsdiq edərkən bunu istifadə edin.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Konfiqurasiyanın oxunması və təhlilini izləmək logunu təmin edir. Konfigurasiya problemlərinin həllində faydalı ola bilər.

- Tip: bayraq
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Tip: Boolean, ya `--terminal-colors=false` və ya `--terminal-colors=true`
- Default: Avtomatik aşkarlama terminalının dəstəyi
- ENV: `TERMINAL_COLORS`

ANSI rəngli çıxışı təmin etmək və ya etməmək.

Standart olaraq Iroha terminalın rəngli çıxışı dəstəklədiyini və ya etmədiyini müəyyənləşdirir.

Rəngləri açıq şəkildə söndürmək üçün:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Tipi: Dırnaqlar

Daemon mesajları üçün istifadə olunan sistem dilini ləğv edin.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Tip: bayraq

SoraFS üçün Sora Nexus xüsusiyyət profilinə, SoraNet əl sıxışına və çox zolaqlı konsensus axınlarına imkan verin.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Tip: `auto`, `cpu` və ya `gpu`

FASTPQ prover icra rejimini ləğv edin.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Tip: `auto`, `cpu` və ya `gpu`

FASTPQ Poseidon boru kəmərinin rejimini ləğv edin.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Tipi: Dırnaqlar

FASTPQ telemetriya cihazı sinfi etiketini ləğv etmək.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Tipi: Dırnaqlar

FASTPQ telemetri çip ailə etiketini ləğv edin.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Tipi: Dırnaqlar

FASTPQ telemetriyası növü GPU etiketini ləğv edin.

```shell
irohad --fastpq-gpu-kind integrated
```
