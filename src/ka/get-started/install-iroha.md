---
translation_locale: ka
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დამონტაჟება Iroha 3 {#install-iroha-3}

აღნიშნული გვერდი მოიცავს Iroha 3 ინსტრუმენტების ჯაჭვისა და ბინარების ამჟამინდელი დამონტაჟების სამუშაო პროცესს, რომლებიც იყენებენ `hyperledger-iroha/iroha` სამუშაო სივრცეს ზემოთ.

## 1. წინასწარი პირობები {#_1-prerequisites}

ჯერ დააინსტალირეთ ეს:

- [rustup](https://www.rust-lang.org/tools/install), ასე რომ ჩაკეტილი `rust-toolchain.toml` ინსტრუმენტების ჯაჭვი (`1.93.1`) დამონტაჟებულია ავტომატურად
- `git`
- სასურველია Docker და Docker Compose ადგილობრივი მრავალმხრივი სწრაფი გაშვებისათვის.

## 2. კლონირება სამუშაო სივრცეში {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. შექმენით სამუშაო ადგილი {#_3-build-the-workspace}

აშენეთ ყველაფერი:

```bash
cargo build --workspace
```

უფრო მცირე ოპერატორზე ორიენტირებული ნაგებობისთვის, შეადგინეთ მხოლოდ ძირითადი ბინარული:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

მოპოვებული ბინარიები იწერება `target/debug/` ან `target/release/`-ზე.

## 4. შემოწმეთ დამონტაჟებული ინსტრუმენტები. {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

სამი ბინარი, რომელსაც თქვენ ჩვეულებრივ იყენებთ:

- `irohad` პერ დეიმონისთვის
- `iroha` CLI წვდომისა და ოპერატორის საბოლოო წერტილებისთვის Torii
- `kagami` გასაღების, გენეზის მანიფესტებისა და ადგილობრივი ქსელის პროფილებისთვის

## 5. ვარიანტული Localnet და Docker გზა {#_5-optional-localnet-and-docker-path}

მიმდინარე წყაროზე მხარდაჭერილი ლოკალური ქსელის ნაკადი იწარმოება Kagami. იგი წერს თანატოლების კონფიგურაციას, გენეზის არტეფაქტებს, კლიენტის კონფიგურს, დამხმარე სკრიპტებს და ვარიანტულ ფაილს Compose, რომელიც შეესაბამება ამოწმებულ კოდს:

- `kagami localnet` მშობლიური ადგილობრივი თანატოლების სკრიპტებისათვის
- `kagami docker` Docker Compose-ისთვის, რომელიც წარმოიქმნა ლოკალურ ქსელის დირექტორიდან

გაგრძელება [გაშვების Iroha 3](/ka/get-started/launch-iroha.md).
