---
translation_locale: ka
translation_source: /get-started/install-iroha.md
translation_source_hash: cef11a7036dcb5257647edf0c48ea1b9c144822e029df936b422998f46187b41
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# დამონტაჟება Iroha 3 {#install-iroha-3}

აღნიშნული გვერდი მოიცავს Iroha 3 ინსტრუმენტების ჯაჭვისა და ბინარების ამჟამინდელი დამონტაჟების სამუშაო პროცესს, რომლებიც იყენებენ `hyperledger-iroha/iroha` სამუშაო სივრცეს ზემოთ.

პირდაპირ ჰოსტზე დასაყენებლად მიჰყევით ქვემოთ მოცემულ Rust-ის ინსტრუქციას. Docker-ის საშუალებით ოთხი ვალიდატორის გასაშვებად დაიწყეთ სახელმძღვანელოთი [Iroha 3-ის გაშვება](/ka/get-started/launch-iroha.md).

## 1. წინასწარი პირობები {#_1-prerequisites}

ჯერ დააინსტალირეთ ეს:

- [rustup](https://www.rust-lang.org/tools/install), ასე რომ ჩაკეტილი `rust-toolchain.toml` ინსტრუმენტის ჯაჭვი (`1.93.1`) დამონტაჟებულია ავტომატურად.
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

- `iroha3d` ქსელის კვანძის სტანდარტული დემონისთვის
- `iroha3d_taira` ერთპიროვნული პროტოკოლური სტანდარტის Taira ვალიდატორის გამშვებ აპარატისთვის
- `iroha` სამედიცინო CLI ხელმისაწვდომობა Torii და ოპერატორი API საბოლოო წერტილები
- `kagami` გასაღების, ბლოკჩეინის წარმოშობის ტექნიკური მანიფესტებისა და ლოკალური ქსელის პროფილისთვის

## 5. ვარიანტული Localnet და Docker გზა {#_5-optional-localnet-and-docker-path}

მიმდინარე წყაროზე მხარდაჭერილი ადგილობრივი ქსელის ნაკადი გენერირებულია Kagami. იგი წერს ქსელის კვანძების კონფიგურაციას, ბლოკჩეინის წარმოქმნის არტეფაქტებს, კლიენტის კონფიგურს, დამხმარე სკრიპტებს და ვარიანტულ ფაილს Compose, რომელიც შეესაბამება ამოწმებულ კოდს:

- `kagami localnet up` — მართვადი ლოკალური ქსელისთვის, რომელსაც Kagami უშვებს და ზედამხედველობს
- `kagami localnet generate` — ნატიური ლოკალური კვანძების სკრიპტებისთვის
- `kagami docker` Docker Compose-ისთვის, რომელიც წარმოიქმნა ლოკალურ ქსელის დირექტორიდან

გაგრძელება [გაშვება Iroha 3](/ka/get-started/launch-iroha.md).
