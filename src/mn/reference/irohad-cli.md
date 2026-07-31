---
translation_locale: mn
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` нь Iroha 3 зэрэглэлийн даймон эхэлнэ.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- Үргэлт: Файлын замаар
- Нэрлэг: `-c`

[ конфигурацын ](/mn/reference/peer-config/index.md) файлын чиглэл.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Үргэлт: Файлын замаар

JSON файлын эх үүсвэрийн манифест рүү сонголттой замыг ашиглах. Хөдөлгөөн нь Kagami үүсгэсэн манифестээс эхлэлийг баталгаажуулахдаа үүнийг хэрэглэх.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Энэ нь конфигурацийг уншиж, шинжилгээ хийх заалтын тэмдэглэлийг ашиглаж болно.

- Үргэлт: далбаа
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Үргэлт: Булейн, `--terminal-colors=false` эсвэл `--terminal-colors=true`
- Урьдчилсан хэлбэр: Автошигварын дэглэмийн дэмжлэг
- ENV: `TERMINAL_COLORS`

ANSI өнгөтэй гарах боломжийг олгох эсэх.

Үндсэн хуулийн дагуу Iroha нь төмөрлөгийн үр дүнг дэмждэг эсэхийг тодорхойлдог.

Өргөдлийн өнгийг тодорхой хүчингүй болгох:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Үргэлж:

Даемон мессежүүдэд ашигладаг системийн хэлийг татан буулгаарай.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Үргэлт: далбаа

SoraFS-ийн Sora Nexus хувилбарын хувилбар, SoraNet -ийн гарын үсэг хээлт болон олон замаар тохиролцох урсгалыг идэвхжүүлэх.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Үргэлт: `auto`, `cpu`, эсвэл `gpu`

FASTPQ проверын гүйцэтгэх хэлбэрийг давтаарай.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Үргэлт: `auto`, `cpu`, эсвэл `gpu`

FASTPQ Посейдон төмөрөгний хэлбэрээр зайлуулах.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Үргэлж:

FASTPQ телеметрийн төхөөрөмжийн ангиллын тэмдэглэлийг давтаарай.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Үргэлж:

FASTPQ телеметрийн чипүүдийн гэр бүлгийн тэмдэгтийг давтаарай.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Үргэлж:

FASTPQ телеметрийн GPU хэлбэрээр тэмдэглэгдэх хэсгийг давхруулна.

```shell
irohad --fastpq-gpu-kind integrated
```
