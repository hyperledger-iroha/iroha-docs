---
translation_locale: ka
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მუშაობა Iroha ბინარებით {#working-with-iroha-binaries}

Iroha 3 ოპერატორის სამუშაო მიმდინარეობა ოთხი ძირითადი ბინარის ირგვლივ ბრუნავს:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) peer daemon-ის მართვისთვის
- `iroha3d_taira` კანონიკური Taira ვალიდატორის გამშვები აპარატისთვის
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) გასაღების, გენეზის, ლოკალურ ქსელებისა და პროფილისათვის

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

აღმავალი სამუშაო სივრცე იყენებს `kagami localnet` და `kagami docker` წარმოქმნის Docker Compose ფაილები, რომლებიც შეესაბამება ამოწმებულ კოდს. `hyperledger/iroha:dev` გამოსახულება შეიძლება გამოყენებულ იქნას იმ გენერირებული ფაილებთან ერთად.

გაუშვით CLI კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

გაშვება Kagami კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

პარტნიორის სტარტაპისთვის, შეიქმნას localnet და შეადგინოს ფაილი ჯერ:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## რომელი ბინარი უნდა გამოვიყენო? {#which-binary-should-i-use}

- გამოიყენეთ `iroha3d` როდესაც იწყებთ ან ოპერირებთ პარტნიორებს საჯარო Taira ვალიდატორის გამოშვების გარეთ.
- გამოიყენეთ `iroha3d_taira --sora` მხოლოდ კანონიკური Taira ვალიდატორის განთავსებისათვის; იგი აამოქმედებს Taira ჯაჭვის, შენახვის და გამშვები დროის ხელმოწერის პროფილის გამოყენებას.
- გამოიყენეთ `iroha` როდესაც საჭიროა გამოკითხვა მთავარ წიგნში, ტრანზაქციების წარდგენა ან ოპერატორის საბოლოო წერტილების შემოწმება.
- გამოიყენეთ `kagami` როდესაც გჭირდებათ გასაღები, გენეზიის მანიფესტები, პროფილის ბუნდები ან ლოკალური ქსელის აქტივები.
