---
translation_locale: ka
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ცხელი გადატვირთვა Iroha Docker კონტეინერში. {#hot-reload-iroha-in-a-docker-container}

გამოიყენეთ ცხელი გადატვირთვა მხოლოდ ადგილობრივი დებუგინგისთვის. ნორმალური ადგილობრივი განვითარებისათვის, უმჯობესია აღადგინოთ სურათი ან განახორციელოთ წარმოქმნილი Docker Compose სტაკი ახალი Kagami ბუნდიდან.

## შეცვალეთ ქსელის კვანძი ორობითი ფაილი {#replace-the-peer-binary}

შექმენით Linux- ით თავსებადი daemon ორობითი ფაილი ძირითადი სამუშაო სივრცედან:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

გადაწერეთ იგი მიმდინარე ქსელის თანაბარი კონტეინერში, შემდეგ განახორციელეთ კონტეინერი:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

გამოიყენეთ `docker ps` კონტეინერის სახელის დასამტკიცებლად. გენერირებულ სტაკში ქსელის თანასწორ კონტეინერებს განსაზღვრავს `./docker-compose.yml`.

## რეკომენდირებული ბლოკჩეინის გენეზისი ერთჯერადი ქსელში {#recommit-genesis-in-a-disposable-network}

ქსელის კვანძები ახდენენ ბლოკჩეინის გენეზის დასრულებას მხოლოდ მაშინ, როდესაც მისი შენახვა ცარიელია. ერთჯერადი Docker ქსელისთვის, შეაჩერეთ სტაკი, ამოიღეთ გამომუშავებული მდგომარეობა, რეგენერირეთ ან შეცვალეთ ხელმოწერილი ბლოკჩეინ გენეზისის ნაკრები და დაიწყეთ ისევ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

არ შეცვალოთ ბლოკჩეინის გენეზისი ქსელზე, რომლის მდგომარეობა უნდა იყოს შენარჩუნებული.

## გამოიყენეთ პერსონალური კონფიგურაცია {#use-custom-configuration}

ქსელის კვანძის მიმდინარე კონფიგურაცია TOML ფორმატშია. გენერირებული `config.toml`, `genesis.signed.nrt` და შესაბამისი გასაღების ფაილები მიბმით დაამონტაჟეთ ან დააკოპირეთ გამოსახულების მიერ მოსალოდნელ კონტეინერის ბილიკებში, შემდეგ კი კვანძი ხელახლა გაუშვით. გენერირებული ფაილები ერთად შეინახეთ; Kagami-ს სხვადასხვა გაშვებებიდან ფაილების შერევამ შეიძლება დესერიალიზაციის ან კონსენსუსის შეცდომები გამოიწვიოს.
