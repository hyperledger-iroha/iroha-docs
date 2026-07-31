---
translation_locale: ka
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ცხელი გადატვირთვა Iroha ა Docker კონტეინერი {#hot-reload-iroha-in-a-docker-container}

გამოიყენეთ ცხელი გადატვირთვა მხოლოდ ადგილობრივი დებუგინგისთვის. ნორმალური ადგილობრივი განვითარებისთვის, ურჩევნია
გამოსახულების აღდგენა ან შექმნილი სურათის განახლება Docker Compose საფარიდან
მწვანე Kagami ბუნდლი.

## შეცვალეთ თანატოლების ორმხრივი {#replace-the-peer-binary}

შექმენით Linux- ით თავსებადი დეიმონის ბინარი ზემოთ მოქცეული სამუშაო სივრცედან:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

გადაწერეთ იგი მიმდინარე პარტნიორის კონტეინერში, შემდეგ განახორციელეთ კონტეინერი:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

გამოყენება `docker ps` კონტეინერის სახელის დასამტკიცებლად. გენერირებულ სტაკში თანაბარი
კონტეინერები განისაზღვრება: `./localnet/docker-compose.yml`.

## გენეზიის განახლება ერთჯერადი ქსელში {#recommit-genesis-in-a-disposable-network}

პერე გენეზიას მხოლოდ მაშინ ახდენს, როდესაც მისი შენახვა ცარიელია. Docker
ქსელი, შეწყვიტოს stack, ამოიღონ წარმოქმნილი მდგომარეობა, რეგენერაცია ან შეცვალოს
გაფორმებული გენეზის ბუნდი და დაიწყეთ თავიდან:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

არ შეცვალოთ გენეზი ქსელში, რომლის მდგომარეობა უნდა იყოს შენარჩუნებული.

## გამოიყენეთ კონფიგურაცია {#use-custom-configuration}

ამჟამინდელი თანატოლების კონფიგურაცია არის TOML. დააკავშიროთ ან გააქტიურეთ გენერირებული
`config.toml`, `genesis.signed.nrt`, და დაკავშირებული ფაილები კონტეინერში
სურათის მიერ მოსალოდნელი გზები, შემდეგ restart peer. შეინახეთ გენერირებული ფაილები
ერთად; სხვადასხვა ფაილების შერევა Kagami გაშვება შეიძლება გამოიწვიოს დეზერიალიზაცია ან
კონსენსუსის წარუმატებლობა.
