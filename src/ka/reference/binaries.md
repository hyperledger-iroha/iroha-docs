---
translation_locale: ka
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მუშაობა Iroha ბინარული {#working-with-iroha-binaries}

სააგენტო Iroha 3 ოპერატორის სამუშაო ნაკადი ბრუნდება სამი ძირითადი ბინარის გარშემო:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) პარტნიორების დეიმონის მართვისთვის
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) სამედიცინო CLI და ოპერატორის ბრძანებები
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) საკვანძოების, გენეზის, ლოკალურ ქსელებისა და პროფილებისთვის

## შენება წყაროდან {#build-from-source}

სამუშაო სივრცის ზემოთმავალი ფესვიდან:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

გათავისუფლების ბინარიები შემდეგ ხელმისაწვდომია `target/release/`.

საბრძოლო ზედაპირის ინსპექტირებისათვის:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## გაუშვით პირდაპირ საცავიდან {#run-directly-from-the-repository}

თუ არ გსურთ გლობალურად რაიმე დაინსტალიროთ, გამოიყენეთ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker სურათი {#docker-image}

სამუშაო სივრცის გამოყენება `kagami localnet` და `kagami docker` წარმოება
Docker Compose ფაილები, რომლებიც შეესაბამება ჩანახული კოდს. `hyperledger/iroha:dev`
გამოსახულება შეიძლება გამოყენებულ იქნას იმ გენერირებული ფაილებთან ერთად.

გაუშვით CLI კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

გაიქეცი. Kagami კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

პარტნიორული სტარტაპისთვის, შეიქმნას localnet და კომპოზი ფაილი ჯერ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## რომელი ორმაგი უნდა გამოვიყენო? {#which-binary-should-i-use}

- გამოყენება `irohad` როდესაც იწყებთ ან ოპერირებთ თანატოლებს.
- გამოყენება `iroha` როდესაც საჭიროა გამოკითხვა მთავარ წიგნში, ტრანზაქციების წარდგენა ან ოპერატორის საბოლოო წერტილების შემოწმება.
- გამოყენება `kagami` როდესაც გჭირდებათ გასაღები, გენეზიის მანიფესტები, პროფილის ბუნდები ან ადგილობრივი ქსელის აქტივები.
