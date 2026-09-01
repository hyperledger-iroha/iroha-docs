---
translation_locale: ka
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` არის Iroha 3-ის ქსელის კვანძის სტანდარტული დემონი. Cargo პაკეტს `irohad` ეწოდება, ამიტომ წყაროს კოდის სამუშაო ასლიდან ბინარული ფაილი ასე გაუშვით:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

საჯარო Taira სატესტო ქსელისთვის გამოშვების გამოსახულება იყენებს `iroha3d_taira`-ს. ის იმავე CLI-ს იღებს, მაგრამ დამატებით კანონიკურ Taira ჯაჭვს, ვალიდატორის, საცავისა და შესრულების გარემოს ხელმომწერის პროფილს აღასრულებს. Taira-ს კონფიგურაცია შესრულების გარემოს ავტორიზაციის მონაცემების გახსნის გარეშე ასე შეამოწმეთ:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

გამოიყენეთ კანონიკური Taira პროფილის ოპერატორის მიერ გაცემული ფორმა; ჩაკეტილი შაბლონი კვლავ შეიცავს განთავსების ადგილმდებარეობის მფლობელებს. არ შეცვალოთ ზოგადი Nexus ან წარმოების SoraFS პარამეტრები, როდესაც შეამოწმებთ Taira.

## `--config` {#arg-config}

- ტიპი: ფაილის გზა
- ალიასი: `-c`

გზა [ქსელის კვანძული კონფიგურაცია](/ka/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- ტიპი: ფაილის გზა

არაკომპანიური ბლოკჩეინის გენეზის ტექნიკური მანიფესტი JSON, რომელიც გამოიყენება კონსენსუსის ვალიდაციისათვის.

## `--check-config` {#arg-check-config}

შეამოწმეთ გადაჭრილი კონფიგურაცია და ხელმისაწვდომი ბლოკჩეინის გენეზისის მასალა, შემდეგ გამოდით ქსელის სოქეტების გარეშე.

## კაგემუშას საკვალიფიკაციო სიგელები {#kagemusha-qualification-seals}

აღნიშნული ფაილების გზების ვარიანტები მოითხოვს `--check-config` და სრულ კაგემუშას კვალიფიკაციას ასრულებს კანონიკური ბეჭდვის დაწერამდე:

- `--write-kagemusha-catalog-qualification-seal <PATH>` კვალიფიცირებს კატალოგს.
- `--write-kagemusha-validator-qualification-seal <PATH>` კვალიფიცირებს ადგილობრივ ვალიდატორს კონფიგურირებული ხელმოწერილი აქციის რეზერვაციისათვის.

ორ საზღვრის ვარიანტს უპირისპირდება ერთმანეთი.

## `--trace-config` {#arg-trace-config}

- ტიპი: დროშა
- გარემო: `TRACE_CONFIG`

გააქტიურეთ ტრეის ლოგები კონფიგურაციის ფენების წაკითხვისა და ანალიზის დროს.

## `--config-blake3` {#arg-config-blake3}

- ტიპი: 64 ციფრიანი თექვსმეტობითი BLAKE3 კრიპტოგრაფიული დიჯესტი.
- მოთხოვნები: `--config`

მოითხოვეთ კონფიგურაციის ფაილის ბაიტების შეხება მიწოდებული კრიპტოგრაფიულ დიჯესტს. ინტეგრითი დამაკავშირებელი ფაილი უნდა იყოს დაბლა; მასში არ შეიძლება იყოს `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- ტიპი: ბულიანი, წარდგენილი როგორც `--terminal-colors=true` ან `--terminal-colors=false`
- ავარიული: ტერმინალის შესაძლებლობის გამოვლენა
- გარემო: `TERMINAL_COLORS`

კონტროლი ANSI ფერის გამონადენი.

## `--language` {#arg-language}

- ტიპი: ხაზი

დემონის შეტყობინებებისთვის გამოყენებული სისტემური ენის გადაფარვა.

## `--sora` {#arg-sora}

- ტიპი: დროშა
- გარემო: `IROHA_SORA_PROFILE`

გააქტიურეთ Sora Nexus პროფილი, რომელიც გამოიყენება SoraFS, ხელის შეხების SoraNet და მრავალგზის კონსენსუსი. Taira განმაწყობი ყოველთვის იწვევს ამ დროშით.

## FastPQ სათადარიგოები {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` და `--fastpq-poseidon-mode <MODE>` იღებენ მხოლოდ `cpu` ან `gpu`. დანარჩენი ვარიანტები უპირატესობას ანიჭებს ტელემეტრიის ეტიკეტებს:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

მაგალითად:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## გენერირებული დახმარება {#generated-help}

ზემოთ მოცემული ვარიანტის შეჯამება შემოწმებულია მიმდინარე `iroha3d` არგუმენტის განსაზღვრების მიხედვით. ჩართული დახმარების გენერირებული მონაცემთა პუნქტის დროში ნახვა მიზანმიმართულად არ არის წარმოდგენილი, სანამ მისი წარმოშობის სტატუსი მოქმედებს. თქვენი გადახდისთვის ზუსტი დახმარების შესამოწმებლად გაუშვით:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
