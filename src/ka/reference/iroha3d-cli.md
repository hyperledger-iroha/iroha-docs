---
translation_locale: ka
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` არის სტანდარტული Iroha 3 peer daemon. სატვირთო პაკეტის სახელია `irohad`, ასე რომ მოითხოვეთ ბინარი წყარო checkout-დან:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

საჯარო Taira ტესტნეტისთვის, გათავისუფლების სურათში გამოიყენება `iroha3d_taira`. იგი იღებს იგივე CLI. იგი ასევე ახორციელებს კანონიკური Taira ჯაჭვი, ვალიდატორების ნაკრები, შენახვის პარამეტრები და გამშვები დროის ხელმოწერის გასაღები. შეამოწმეთ Taira კონფიგურაცია ისე, რომ არ გახსნათ გამშვები დროის საკრედიტაციო ნომრები, როგორიცაა:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

ოპერატორის მიერ გამოყენებამდე უნდა იყოს წარმოდგენილი კანონიკური Taira პროფილი. ჩანახული შაბლონი შეიცავს მაგალითის პარამეტრებს. ოპერატორმა უნდა შეცვალოს ყველა მაგალითის პარამეტრი. არ გამოიყენოთ ზოგადი Nexus ან წარმოების SoraFS პარამეტრები, როდესაც შეამოწმებთ Taira-ს.

## `--config` {#arg-config}

- ტიპი: ფაილის გზა
- ანალიზი: `-c`

გზა [ peer კონფიგურაციაზე ](/ka/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- ტიპი: ფაილის გზა

ნებაყოფლობითი გენეზის მანიფესტი JSON, რომელიც გამოიყენება კონსენსუსის ვალიდაციისთვის.

## `--check-config` {#arg-check-config}

შეამოწმეთ განსაზღვრული კონფიგურაცია და ხელმისაწვდომი გენეზიის მასალა, შემდეგ გამოდით ქსელის სოკეტების გარეშე.

## კაგემუშას საკვალიფიკაციო სიგელები {#kagemusha-qualification-seals}

ამ ფაილი-path ვარიანტებს მოითხოვს `--check-config` და სრულად განახორციელოს Kagemusha კვალიფიკაცია, სანამ წერია კანონიკური საფურცელი:

- `--write-kagemusha-catalog-qualification-seal <PATH>` კვალიფიცირებს კატალოგს.
- `--write-kagemusha-validator-qualification-seal <PATH>` კვალიფიცირებს ადგილობრივ ვალიდატორს კონფიგურირებული ხელმოწერილი რეზერვაციის შესახებ.

ორ საზღვრის ვარიანტს უპირისპირდება ერთმანეთი.

## `--trace-config` {#arg-trace-config}

- ტიპი: დროშა
- გარემო: `TRACE_CONFIG`

გააქტიურეთ ტრეის ლოგები კონფიგურაციის ფენების წაკითხვისა და ანალიზის დროს.

## `--config-blake3` {#arg-config-blake3}

- ტიპი: 64 ციფრიანი hexadecimal BLAKE3 digest
- მოთხოვნები: `--config`

მოითხოვეთ კონფიგურაციის ფაილის ბითები შეესაბამება მიწოდებულ დიჟესს. ინტეგრეთით დაკავებული ფაილი უნდა იყოს დაბლა; მასში არ შეიძლება იყოს `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- ტიპი: ბულიანი, წარდგენილი როგორც `--terminal-colors=true` ან `--terminal-colors=false`
- ავარიული: ტერმინალის შესაძლებლობის გამოვლენა
- გარემო: `TERMINAL_COLORS`

კონტროლი ANSI ფერის გამონადენი.

## `--language` {#arg-language}

- ტიპი: ხაზი

ჲბარევთ ჟსტემაჟკთ თვლაპაკა, ნაოპაგთლ ჟვ ჱა დეიმონჲ გზავნილები.

## `--sora` {#arg-sora}

- ტიპი: დროშა
- გარემო: `IROHA_SORA_PROFILE`

ჩართეთ Sora Nexus პროფილი. ამ პროფილის კონფიგურაციაში შედის SoraFS, SoraNet ხელის გადაჭიმვა და მრავალსარხიანი კონსენსუსი. მუდამ მოიხსენიეთ Taira გამშვები ამ დროშით.

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

ქვემოთ მოცემული სრული გამოსავალი წარმოიქმნება ჩაკეტილი Iroha წყარო კომიტეტიდან.

<<< @/snippets/iroha3d-help.md
