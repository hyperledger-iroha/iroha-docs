---
translation_locale: mn
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` эхлэнэ Iroha 3 Дундаг дамон.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **Үргэлт:** Файлын замыг
- **Нүүр хуудас** `-c`

Тэнд хүрэх зам [зохион байгуулалт](/mn/reference/peer-config/index.md) Хөгжлийн баримт.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **Үргэлт:** Файлын замыг

Женезисийн манифест рүү сонголттой зам JSON Энэ файлыг ашиглаж
эхлүүлэлтийг Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Байгууллагын уншиж, шинжилгээ хийх бүртгэлийг шалгах боломжтой. Байгууллагын асуудлыг шийдвэрлэхэд ашигтай байж болно.

- **Үргэлт:** галт тэрэг
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **Үргэлт:** Булийн `--terminal-colors=false` эсвэл
  `--terminal-colors=true`
- **Үндсэн дүрэм:** Автошилт үнэлгээний терминалын дэмжлэг
- **ENV:** `TERMINAL_COLORS`

Хөдөлмөрийг ашиглах эсэх ANSI- өнгөтэй үр дүн эсвэл үгүй.

Үүнээс өмнө Iroha түстүү гаралтай гарах боломжийг терминал нь дэмждэг эсэхийг тогтоодог
Эсвэл үгүй.

Өргөдлийн өнгийг тодорхой хүчингүй болгох:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **Үргэлт:** Хонгил

Даемон мессежүүдэд ашигладаг систем хэлг устгаарай.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **Үргэлт:** галт тэрэг

Сорог ашиглах боломжтой Nexus онцлог шинж чанар SoraFS, УИХ-ын гишүүн SoraNet гарын үсэг,
олон чиглэлээр тохиролцох урсгал.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **Үргэлт:** `auto`, `cpu`, эсвэл `gpu`

Үргэлт FASTPQ Сургууль гүйцэтгэх хэв маяг.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **Үргэлт:** `auto`, `cpu`, эсвэл `gpu`

Үргэлт FASTPQ Посейдон урсгалын хэлбэр.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **Үргэлт:** Хонгил

Үргэлж FASTPQ Телеметрийн төхөөрөмжийн ангиллын тэмдэг.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **Үргэлт:** Хонгил

Үргэлж FASTPQ Телеметрийн чипүүдийн гэр бүлийн тэмдэг.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **Үргэлт:** Хонгил

Үргэлж FASTPQ телеметри GPU-Тийм л тэмдэг.

```shell
irohad --fastpq-gpu-kind integrated
```
