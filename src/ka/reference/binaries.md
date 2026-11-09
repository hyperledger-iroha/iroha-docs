---
translation_locale: ka
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მუშაობა Iroha ბინარებით {#working-with-iroha-binaries}

Iroha 3 ოპერატორის სამუშაო მიმდინარეობა ოთხი ძირითადი ბინარის ირგვლივ ბრუნავს:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) ქსელის კვანძის დემონის გასაშვებად
- `iroha3d_taira` ერთპიროვნული პროტოკოლური სტანდარტის Taira ვალიდატორის გამშვებ აპარატისთვის
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) სამედიცინო CLI და ოპერატორის ბრძანებები
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) საკვანძოების, ბლოკჩეინის წარმოქმნის, ლოკალურ ქსელებისა და პროფილებისთვის

## შენება წყაროდან {#build-from-source}

სამუშაო სივრცის ფესვიდან:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

შემდეგ გათავისუფლების ბინარიები ხელმისაწვდომია `target/release/`.

საბრძოლო ზედაპირის ინსპექტირებისათვის:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## გაშვება პირდაპირ საცავიდან {#run-directly-from-the-repository}

თუ გლობალურად არ გსურთ რაიმე დამონტაჟება, გამოიყენეთ `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ფოტო {#docker-image}

Docker-ში ერთი და იმავე რევიზიის ბინარული ფაილებით ოთხი ვალიდატორის ასაწყობად და გასაშვებად მიჰყევით სახელმძღვანელოს [გაშვება Iroha 3](/ka/get-started/launch-iroha.md).

## რომელი ბინარი უნდა გამოვიყენო? {#which-binary-should-i-use}

- გამოიყენეთ `iroha3d` როდესაც აწყობთ ან ოპერირებთ ქსელის კვანძებს საჯარო Taira ვალიდატორის გამოშვების გარეთ.
- გამოიყენეთ `iroha3d_taira --sora` მხოლოდ ერთი პროტოკოლური სტანდარტის Taira ვალიდატორის განთავსებისათვის; იგი აამოქმედებს Taira ჯაჭვის, შენახვის და გამშვები დროის ხელმომწერის პროფილს.
- გამოიყენეთ `iroha` როდესაც თქვენ უნდა გამოკითხოთ ბლოკჩეინის რეესტრი, წარადგინოთ ტრანზაქციები ან შეამოწმოთ ოპერატორის API საბოლოო წერტილები.
- გამოიყენეთ `kagami`, როდესაც გასაღებები, გენეზისის მანიფესტები, პროფილების პაკეტები ან ლოკალური ქსელის აქტივები გჭირდებათ.
