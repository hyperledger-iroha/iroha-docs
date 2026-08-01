---
translation_locale: ka
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` იწყებს Iroha 3 peer daemon.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- ტიპი: ფაილების გზა
- ანალიზი: `-c`

გზა [ კონფიგურაციის ](/ka/reference/peer-config/index.md) ფაილამდე.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- ტიპი: ფაილების გზა

ვარიანტი გზა გენეზიის მანიფესტის JSON ფაილზე. გამოიყენეთ ეს, როდესაც განთავსება ადასტურებს სტარტაპს Kagami მიერ შექმნილი მანიფეტის წინააღმდეგ.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

აძლევს კონფიგურაციის წაკითხვისა და პარალიზების ტრეის ლოგებს. შეიძლება გამოსადეგი იყოს კონფიგურიაციის პრობლემების აღმოფხვრისთვის.

- ტიპი: დროშა
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- ტიპი: ბულიანი, ან `--terminal-colors=false` ან `--terminal-colors=true`
- ავტომატური აღმოჩენის ტერმინალის მხარდაჭერა;
- ENV: `TERMINAL_COLORS`

გაძლევთ თუ არა ANSI ფერის გამონადენი;

ჩვეულებრივ, Iroha განსაზღვრავს, მხარს უჭერს თუ არა ტერმინალს ფერადი გამონადენი.

ფერების მკაფიოდ გამორთვა:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- ტიპი: ძრავი

ჲბარევთ ჟსტემაჟკთ თვლაპაკა, ნაოპაგთლ ჟვ ჱა დეიმონჲ გზავნილები.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- ტიპი: დროშა

ჩართეთ Sora Nexus თვისების პროფილი SoraFS, SoraNet ხელის შეხება და მრავალგზის კონსენსუსის ნაკადები.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- ტიპი: `auto`, `cpu`, ან `gpu`

FASTPQ პროვერის შესრულების რეჟიმი გადალახეთ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- ტიპი: `auto`, `cpu`, ან `gpu`

FASTPQ პოსეიდონის მილსადენის რეჟიმის გადალახვა.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- ტიპი: ძრავი

შეზღუდვა FASTPQ ტელემეტრიული მოწყობილობის კლასის ეტიკეტით.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- ტიპი: ძრავი

შეზღუდვა FASTPQ ტელემეტრიული ჩიპების ოჯახის ეტიკეტით.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- ტიპი: ძრავი

შეზღუდვა FASTPQ ტელემეტრიის GPU ტიპის ეტიკეტით.

```shell
irohad --fastpq-gpu-kind integrated
```
