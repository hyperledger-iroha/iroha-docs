---
translation_locale: uz
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` bir Iroha 3 tengdosh daemonni boshlaydi.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- Fayl turi: Fayl yoʻli
- Alias: `-c`

[ konfiguratsiyasi ](/uz/reference/peer-config/index.md) fayliga yo'l.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Fayl turi: Fayl yoʻli

Genesis manifest JSON fayliga bo'lgan tanlov yo'li. Ishlab chiqarish Kagami tomonidan ishlab chiqarilgan manifestga qarshi ishga tushishni tasdiqlaganda buni ishlating.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Konfiguratsiyalarni oʻqish va tahlil qilishning iz logini qoʻllaydi. Konfiguratsiya muammosini hal qilish uchun foydali bo'lishi mumkin.

- Tur: bayroq
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Tur: `--terminal-colors=false` yoki `--terminal-colors=true` bo'lgan boolian
- Andoza: avtomatik aniqlash terminalini qo'llab-quvvatlash
- ENV: `TERMINAL_COLORS`

ANSI rangli chiqarishni qo'llash yoki yo'qligini aniqlash.

Andoza ravishda Iroha terminal rangli chiqindilarni qo'llab-quvvatlaydi yoki yo'qligini aniqlaydi.

Ranglarni ochiqchasiga oʻchirish:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Tovush turi: simlar

Daemon xabarlari uchun ishlatiladigan tizim tilini bekor qiling.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Tur: bayroq

SoraFS uchun Sora Nexus xususiyatining profilini, SoraNet qo'lquvini va ko'p yo'nalishdagi konsensus oqimlarini o'rnating.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Tur: `auto`, `cpu` yoki `gpu`

FASTPQ provayderni o'tkazish rejimini bekor qiling.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Tur: `auto`, `cpu` yoki `gpu`

FASTPQ Poseidon quvurini o'chirib tashlang.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Tovush turi: simlar

FASTPQ telemetriya qurilmalari sinfidagi etiketani bekor qiling.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Tovush turi: simlar

FASTPQ telemetriya chiplar oilasi etiketini bekor qiling.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Tovush turi: simlar

FASTPQ telemetriyasi GPU turidagi etiketani bekor qiling.

```shell
irohad --fastpq-gpu-kind integrated
```
