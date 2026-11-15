---
translation_locale: ka
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# გაშვება Iroha ფიზიკურ სერვერზე- ზე {#running-iroha-on-bare-metal}

გამოიყენეთ ეს სამუშაო ნაკადი, როდესაც გსურთ ქსელის პარების მართვა უშუალოდ მასპინძლებზე და არა Docker Compose. ამჟამინდელი წყარო ხე უზრუნველყოფს Kagami გენერატორებს, რომლებიც წერენ შესაბამის ბლოკჩეინის წარმოქმნას, ქსელის პარის კონფიგურაციას, კლიენტის კონფიგირებას და სტარტ / შეწყვეტის სკრიპტებს.

## 1. შექმენით ბინარები {#_1-build-the-binaries}

Iroha სამუშაო სივრცედან:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ამან გამოიწვია:

- `target/release/iroha3d` ქსელის კვანძული დეიმონისათვის
- `target/release/iroha` CLI-ისათვის
- `target/release/kagami` საკვანძოების, ბლოკჩეინის გენეზის და ლოკალური ქსელის წარმოებისთვის

## 2. შექმენით ადგილობრივი ქსელი {#_2-generate-a-local-network}

შექმენით Iroha 3-ის ოთხკვანძიანი ლოკალური ქსელი:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

გამოსავალი დირექტორია შეიცავს გენერირებულ `genesis.json`-ს, `genesis.signed.nrt`-ს, `genesis.expected_hash`-ს, თითოეული ვალიდატორისთვის ერთ `peerN.toml`-ს, `client.toml`-ს, `start.sh` და `stop.sh` სკრიპტებს და გენერირებულ `README.md`-ს ამ ნაკრების ზუსტი ბრძანებებით.

## 3. დაიწყეთ ქსელის კვანძები {#_3-start-peers}

გენერირებული ერთჯერადი ადგილობრივი ქსელისათვის, გამოიყენეთ გენერაციული სკრიპტი:

```bash
./localnet/start.sh
```

თუ თითოეული კვანძის პროცესების მენეჯერში ჩართვა გჭირდებათ, მაგალითად systemd-ში, მიჰყევით `./localnet/start.sh`-ში მოცემულ თითოეული კვანძის ბრძანებას: გაუშვით `iroha3d --config <bundle>/peerN.toml` დირექტორიიდან `<bundle>/state/peerN` და `--sumeragi-assert-fresh-key` გადაეცით მხოლოდ ამ კვანძის პირველი გაშვებისას. თითოეული კვანძის `peerN.toml`, პირადი გასაღები, საცავის დირექტორია და პორტები ცალკე შეინახეთ.

## 4. ქსელის მართვა {#_4-operate-the-network}

გამოიყენეთ შექმნილი კლიენტის კონფიგურაცია:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

შეაჩერეთ გენერირებული ადგილობრივი ქსელი:

```bash
./localnet/stop.sh
```

## 5. წარმოების შენიშვნები {#_5-production-notes}

- წარმოებისათვის ახალი კერძო გასაღები შექმნან და საცავის გარეთ შეინახონ.
- ყველა ქსელის კვანძე შეთანხმდეს იმავე ხელმოწერილი ბლოკჩეინის გენეზისის ტრანზაქციაზე, ტოპოლოგიაზე, საიმედო ქსელის კვანძებლებზე და დამტკიცებელზე PoPs.
- დააკავშიროთ მოსმენის მისამართები ჰოსტი-ლოკალური ინტერფეისებზე მხოლოდ მაშინ, როდესაც ქსელის კვანძი სხვა აპარატებიდან არ უნდა იყოს ხელმისაწვდომი.
- გამოიყენეთ Torii ექსპოზიციის, ძირითადი auth-ის, TLS და სიჩქარის შეზღუდვის საწინააღმდეგო პროქსია ან ფაირვუარი.
- ბლოკჩეინის წარმოშობის ან კონსენსუსის ტოპოლოგიის ცვლილებებს შეხედეთ კოორდინირებულ მიგრაციებად და არა ერთპიროვნული ფაილების რედაქტირებით.

კონტეინერული ადგილობრივი განვითარებისათვის გამოიყენეთ [გაშვება Iroha 3](../../get-started/launch-iroha.md) Docker Compose სამუშაო ნაკადი.
