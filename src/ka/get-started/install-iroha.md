---
translation_locale: ka
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დამონტაჟება Iroha 3 {#install-iroha-3}

ეს გვერდი მოიცავს ამჟამინდელი ინსტალაციის სამუშაო პროცესს Iroha 3 ინსტრუმენტების ჯაჭვი
და ბინარული გამოყენებით upstream `hyperledger-iroha/iroha` სამუშაო სივრცე

## 1. წინაპირობები {#_1-prerequisites}

პირველი დააინსტალირეთ ეს:

- [rustup](https://www.rust-lang.org/tools/install), ასე რომ, pinned
  `rust-toolchain.toml` ინსტრუმენტების ჯაჭვი (`1.93.1`) დამონტაჟებულია ავტომატურად
- `git`
- ვარიანტულად, Docker და Docker Compose ადგილობრივი მრავალმხრივი სწრაფი დაწყებისათვის

## 2. კლონირება სამუშაო სივრცეში {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. ააშენეთ სამუშაო ადგილი {#_3-build-the-workspace}

აყალიბე ყველაფერი:

```bash
cargo build --workspace
```

უფრო მცირე ოპერატორზე ორიენტირებული ნაგებობისთვის, შეადგინეთ მხოლოდ ძირითადი ბინარები:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

შედეგად მიღებული ბინარები წერია: `target/debug/` ან `target/release/`.

## 4. შეამოწმეთ დამონტაჟებული ინსტრუმენტები {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

სამი ბინარი, რომელსაც ჩვეულებრივ იყენებთ:

- `irohad` პერ დეიმონისთვის
- `iroha` სამედიცინო CLI ხელმისაწვდომობა Torii და ოპერატორის საბოლოო წერტილები
- `kagami` გასაღები, გენეზიის მანიფესტები და ლოკალურ ქსელებში არსებული პროფილი

## 5. ვარიანტური Localnet და Docker გზა {#_5-optional-localnet-and-docker-path}

ამჟამინდელი წყაროს მიერ მხარდაჭერილი ადგილობრივი ქსელის ნაკადი წარმოიქმნება Kagami. წერია "პერ"
კონფიგურაცია, გენეზის არტეფაქტები, კლიენტის კონფიგურა, დამხმარე სცენარები და ვარიანტი
შეადგინეთ ფაილი, რომელიც შეესაბამება გამოწერილ კოდს:

- `kagami localnet` ადგილობრივი თანატოლების სკრიპტებისათვის
- `kagami docker` სამედიცინო Docker Compose გენერირებულია localnet დირექტორიდან

განაგრძეთ [გაშვება Iroha 3](/ka/get-started/launch-iroha.md).
