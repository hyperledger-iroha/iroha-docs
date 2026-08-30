---
translation_locale: ka
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
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
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

მოპოვებული ბინარიები იწერება `target/debug/` ან `target/release/`-ზე.

## 4. შემოწმეთ დამონტაჟებული ინსტრუმენტები. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ოთხი ბინარი, რომელიც ჩვეულებრივ გამოიყენებთ:

- `iroha3d` სტანდარტული თანატოლური დეიმონისათვის
- `iroha3d_taira` კანონიკური Taira ვალიდატორის გამშვები აპარატისთვის
- `iroha` CLI წვდომისა და ოპერატორის საბოლოო წერტილებისთვის Torii
- `kagami` გასაღების, გენეზის მანიფესტებისა და ადგილობრივი ქსელის პროფილებისთვის

## 5. ვარიანტული Localnet და Docker გზა {#_5-optional-localnet-and-docker-path}

მიმდინარე წყაროზე მხარდაჭერილი ლოკალური ქსელის ნაკადი იწარმოება Kagami. იგი წერს თანატოლების კონფიგურაციას, გენეზის არტეფაქტებს, კლიენტის კონფიგურს, დამხმარე სკრიპტებს და ვარიანტულ ფაილს Compose, რომელიც შეესაბამება ამოწმებულ კოდს:

- `kagami localnet` მშობლიური ადგილობრივი თანატოლების სკრიპტებისათვის
- `kagami docker` Docker Compose-ისთვის, რომელიც წარმოიქმნა ლოკალურ ქსელის დირექტორიდან

გაგრძელება [გაშვების Iroha 3](/ka/get-started/launch-iroha.md).
