---
translation_locale: ka
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` იწყება Iroha 3 პერ დეიმონი.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **ტიპი:** ფაილების გზა
- **ალიას:** `-c`

გზა, რომელიც მიდის [კონფიგურაცია](/ka/reference/peer-config/index.md) ფაილი.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **ტიპი:** ფაილების გზა

გენეზის მანიფესტამდე ავტორიზებული გზა JSON გამოიყენეთ ეს, როდესაც განთავსება
ადასტურებს სტარტაპს მანიფესტის მიმართ, რომელიც შექმნილია Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

აძლევს კონფიგურაციის წაკითხვისა და პარალიზების ტრეის ლოგებს. შეიძლება სასარგებლო იყოს კონფიგურიაციის პრობლემების აღმოფხვრისთვის.

- **ტიპი:** დროშა
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **ტიპი:** ბულური, ან `--terminal-colors=false` ან
  `--terminal-colors=true`
- **დეფოლტი:** ავტომატური აღმოჩენის ტერმინალის მხარდაჭერა
- **ENV:** `TERMINAL_COLORS`

გაძლევთ თუ არა ANSI- ფერადი გამოსავალი ან არა.

დეფოლტად, Iroha განსაზღვრავს, მხარს უჭერს თუ არა ტერმინალს ფერადი გამოსავალი
ან არა.

ფერების მკაფიოდ გამორთვა:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **ტიპი:** მავთულხლართები

ოპვრთნარაჲ ჟსთმვნაკაჟკა, კჲვრჲ ვ ნაოპაგყპნა ჱა გზავნილთა დეიმონ.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **ტიპი:** დროშა

სორას გააქტიურება Nexus თვისებების პროფილი SoraFS, დასახელება SoraNet ხელის შეხება და
მრავალმხრივი კონსენსუსის ნაკადები.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **ტიპი:** `auto`, `cpu`, ან `gpu`

გამორთვა FASTPQ პროვერის შესრულების რეჟიმი.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **ტიპი:** `auto`, `cpu`, ან `gpu`

გამორთვა FASTPQ პოსეიდონის ქაჟის რეჟიმი.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **ტიპი:** მავთულხლართები

შეზღუდვა FASTPQ ტელემეტრიული მოწყობილობის კლასის ეტიკეტი.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **ტიპი:** მავთულხლართები

შეზღუდვა FASTPQ ტელემეტრიული ჩიპების ოჯახის ეტიკეტი.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **ტიპი:** მავთულხლართები

შეზღუდვა FASTPQ ტელემეტრია GPU- ჟჲბჲპთნარა.

```shell
irohad --fastpq-gpu-kind integrated
```
