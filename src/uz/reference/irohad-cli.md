---
translation_locale: uz
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` boshlanadi Iroha 3 Tengdosh daimon.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **Tur:** Fayl yoʻli
- **Alias:** `-c`

Yoʻl [konfiguratsiya](/uz/reference/peer-config/index.md) fayl.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **Tur:** Fayl yoʻli

Genesis manifestiga bo'lgan fakultativ yo'l JSON Fayldan foydalaning.
boshlang ' ich bilan yaratilgan manifestni tasdiqlaydi Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Konfiguratsiyalarni o'qish va tahlil qilishning iz loglarini qo'llaydi.

- **Tur:** bayroq
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **Tur:** Bo'l, ham `--terminal-colors=false` yoki
  `--terminal-colors=true`
- **Dastlabki:** avtomatik aniqlash terminalini qo'llab-quvvatlash
- **ENV:** `TERMINAL_COLORS`

O ' z kuchini yo ' qotganligi ANSI- rangli chiqish yoki yo'q.

Ko'rsatilgan holda, Iroha terminal rangli chiqarishni qo'llab-quvvatlayapti yoki yo'qmi aniqlaydi
yoki yo'q.

Ranglarni aniq oʻchirish uchun:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **Tur:** Tovush

Daemon xabarlari uchun ishlatiladigan tizim tilini bekor qiling.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **Tur:** bayroq

Sora-ni qoʻllash Nexus uchun xususiyat profil SoraFS, ko'rsatilgan SoraNet qo'lni to'plash va
ko'p yo'nalishdagi konsensus oqimlari.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **Tur:** `auto`, `cpu`, yoki `gpu`

Oʻchirish FASTPQ Provor ijro etish usuli.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **Tur:** `auto`, `cpu`, yoki `gpu`

Oʻchirish FASTPQ Poseidon quvur usuli.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **Tur:** Tovush

O ' zgarish FASTPQ Telemetriya qurilmasi sinfidagi etiketasi.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **Tur:** Tovush

O ' zgarish FASTPQ telemetriya chiplar oilasi etiketi.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **Tur:** Tovush

O ' zgarish FASTPQ telemetriya GPU- O'sha kabi etiket.

```shell
irohad --fastpq-gpu-kind integrated
```
