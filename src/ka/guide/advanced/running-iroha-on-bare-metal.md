---
translation_locale: ka
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გაშვება Iroha Bare Metal- ზე {#running-iroha-on-bare-metal}

გამოიყენეთ ეს სამუშაო ნაკადი, როდესაც გსურთ გაუშვათ თანატოლები უშუალოდ მასპინძლებზე და არა Docker Compose. ამჟამინდელი წყარო ხე უზრუნველყოფს Kagami გენერატორებს, რომლებიც წერენ შედარებულ გენეზიას, თანატოლების კონფიგურაციას, კლიენტის კონფიგურის დაწყებას / შეჩერების სკრიპტებს.

## 1. შექმენით ბინარები {#_1-build-the-binaries}

Iroha სამუშაო სივრცედან:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ამან გამოიწვია:

- `target/release/iroha3d` პერ დეიმონისთვის
- `target/release/iroha` CLI-ისათვის
- `target/release/kagami` საკვანძოების, გენეზის და ლოკალური ქსელის წარმოებისთვის.

## 2. შექმენით ადგილობრივი ქსელი {#_2-generate-a-local-network}

გენერირება ოთხი peer Iroha 3 localnet:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

გამოსასვლელი დირექტორი შეიცავს გენერირებულ `genesis.json`, `genesis.signed.nrt`, peer `config.toml` ფაილებს, `client.toml`, დამხმარე სკრიპტებს და გენერაციულ `README.md` ზუსტი ბრძანებების ამ ბუნდისთვის.

## 3. დაიწყე თანატოლები {#_3-start-peers}

გენერირებული ერთჯერადი ადგილობრივი ქსელისათვის, გამოიყენეთ გენერაციული სკრიპტი:

```bash
./localnet/start.sh
```

თუ თქვენ უნდა გაერთოთ თითოეული პაროლი პროცესის მენეჯერში, როგორიცაა systemd, გამოიყენეთ განწყობის ბრძანება, რომელიც დაფიქსირებულია `./localnet/README.md` თითოეული პაროლისთვის. ინახეთ თითოეული პარლის `config.toml`, პირადი გასაღები, შენახვის დირექტორი და პორტები ცალკე.

## 4. ქსელის მართვა {#_4-operate-the-network}

გამოიყენეთ შექმნილი კლიენტის კონფიგურაცია:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

შეაჩერეთ გენერირებული ადგილობრივი ქსელი:

```bash
./localnet/stop.sh
```

## 5. წარმოების შენიშვნები {#_5-production-notes}

- წარმოებისათვის ახალი კერძო გასაღები შექმნან და საცავის გარეთ შეინახონ.
- ყველა თანატოლს დაეთანხმები იმავე ხელმოწერილი გენეზიის ტრანზაქციაზე, ტოპოლოგიაზე, სანდო თანატოლებზე და დამტკიცებელზე PoPs.
- დააკავშიროთ მოსმენის მიმართვები მასპინძლის ადგილობრივ ინტერფეისებზე მხოლოდ მაშინ, როდესაც სხვა აპარატებიდან ვერ მივაღწევთ თანასწორს.
- გამოიყენეთ Torii ექსპოზიციის, ძირითადი auth-ის, TLS და სიჩქარის შეზღუდვის საწინააღმდეგო პროქსია ან ფაირვუარი.
- განიხილეთ ცვლილებები გენეზიის ან კონსენსუსის ტოპოლოგიაში, როგორც კოორდინირებული მიგრაციები და არა ცალკეული ფაილების რედაქტირება.

კონტეინერული ადგილობრივი განვითარებისთვის გამოიყენეთ [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose სამუშაო ნაკადი.
