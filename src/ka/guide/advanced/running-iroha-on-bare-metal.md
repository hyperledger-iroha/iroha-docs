---
translation_locale: ka
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# სირბილი Iroha ნაცრისფერი ლითონი {#running-iroha-on-bare-metal}

გამოიყენეთ ეს სამუშაო ნაკადი, როდესაც გსურთ გაუშვათ თანატოლები პირდაპირ მასპინძლებზე ნაცვლად
მეშვეობით Docker Compose. ამჟამინდელი წყარო ხე უზრუნველყოფს Kagami გენერატორები, რომლებიც
დაწერეთ შედარებითი გენეზი, თანატოლების კონფიგურაცია, კლიენტის კონფიგურა და სტარტ/სტოპის სკრიპტები.

## 1. ააშენეთ ბინარები {#_1-build-the-binaries}

ზემოდან. Iroha სამუშაო ადგილი:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ამან გამოიწვია:

- `target/release/irohad` პერ დეიმონისთვის
- `target/release/iroha` სამინისტრო CLI
- `target/release/kagami` საკვანძოების, გენეზის და ადგილობრივი ქსელის წარმოებისთვის

## 2. შექმნას ადგილობრივი ქსელი {#_2-generate-a-local-network}

გენერირეთ ოთხი პარის Iroha 3 ადგილობრივი ქსელი:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

გამომავალი დირექტორი შეიცავს წარმოქმნილ `genesis.json`,
`genesis.signed.nrt`, პარტნიორი `config.toml` ფაილები, `client.toml`, დამხმარე სცენარები,
და წარმოქმნილი `README.md` ზუსტი ბრძანებები ამ ბუნდლისთვის.

## 3. დაიწყეთ თანატოლების მოვლა {#_3-start-peers}

გენერირებული ერთჯერადი ადგილობრივი ქსელისათვის გამოიყენეთ გენერაციული სკრიპტი:

```bash
./localnet/start.sh
```

თუ თქვენ უნდა მიაწოდოთ თითოეული პარტნიორი პროცესის მენეჯერში, როგორიცაა systemd, გამოყენება
გაშვების ბრძანება `./localnet/README.md` თითოეული თანატოლისთვის. შეინახეთ თითოეული
თანატოლების `config.toml`, კერძო გასაღები, შენახვის დირექტორი და პორტები ცალკე.

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

- წარმოება ახალი კერძო გასაღები და მათი შენახვა გარეთ
  საცავში.
- ყველა თანამოაზრე უნდა შეთანხმდეს იმავე ხელმოწერილი გენეზის ტრანზაქციაზე, ტოპოლოგიაზე,
  საიმედო თანატოლები და დამტკიცებელი PoPs.
- დააკავშიროთ მსმენელის მისამართები მასპინძლის ადგილობრივ ინტერფეისებს მხოლოდ მაშინ, როდესაც თანატოლმა უნდა
  არ არის ხელმისაწვდომი სხვა აპარატებიდან.
- გამოიყენეთ საპირისპირო პროქსია ან ფაირვუალი Torii ექსპოზიცია, საბაზისო ავტი, TLS, და განაკვეთი
  შეზღუდვა.
- გენეზის ან კონსენსუსის ტოპოლოგიის ცვლილებებს შეხედეთ კოორდინირებულ მიგრაციებად, არა
  ცალკეული ფაილების რედაქტირება.

კონტეინერული ადგილობრივი განვითარებისათვის გამოიყენეთ [გაშვება Iroha 3](../../get-started/launch-iroha.md)
Docker Compose სამუშაო მიმდინარეობა.
