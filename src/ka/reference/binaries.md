---
translation_locale: ka
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მუშაობა Iroha ბინარებით {#working-with-iroha-binaries}

Iroha 3 ოპერატორის სამუშაო ნაკადი ბრუნდება სამი ძირითადი ბინარის გარშემო:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) peer daemon-ის მართვისთვის
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) გასაღების, გენეზის, ლოკალურ ქსელებისა და პროფილისათვის

## შენება წყაროდან {#build-from-source}

სამუშაო სივრცის ფესვიდან:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

შემდეგ გათავისუფლების ბინარიები ხელმისაწვდომია `target/release/`.

საბრძოლო ზედაპირის ინსპექტირებისათვის:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## გაშვება პირდაპირ საცავიდან {#run-directly-from-the-repository}

თუ გლობალურად არ გსურთ რაიმე დამონტაჟება, გამოიყენეთ `cargo run`:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## რომელი ბინარი უნდა გამოვიყენო? {#which-binary-should-i-use}

- გამოიყენეთ `irohad` თქვენი თანატოლების დასაწყისში ან ექსპლუატაციისას.
- გამოიყენეთ `iroha` როდესაც საჭიროა გამოკითხვა მთავარ წიგნში, ტრანზაქციების წარდგენა ან ოპერატორის საბოლოო წერტილების შემოწმება.
- გამოიყენეთ `kagami` როდესაც გჭირდებათ გასაღები, გენეზიის მანიფესტები, პროფილის ბუნდები ან ლოკალური ქსელის აქტივები.
