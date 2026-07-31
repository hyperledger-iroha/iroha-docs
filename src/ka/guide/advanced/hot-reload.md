---
translation_locale: ka
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ცხელი გადატვირთვა Iroha Docker კონტეინერში. {#hot-reload-iroha-in-a-docker-container}

გამოიყენეთ ცხელი გადატვირთვა მხოლოდ ადგილობრივი დებუგინგისთვის. ნორმალური ადგილობრივი განვითარებისათვის, უმჯობესია აღადგინოთ სურათი ან განახორციელოთ წარმოქმნილი Docker Compose სტაკი ახალი Kagami ბუნდიდან.

## შეცვალეთ თანატოლების ორმაგი {#replace-the-peer-binary}

შექმენით Linux- ით თავსებადი daemon binary upstream სამუშაო სივრცედან:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

გადაწერეთ იგი მიმდინარე თანატოლების კონტეინერში, შემდეგ განახორციელეთ კონტეინერი:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

გამოიყენეთ `docker ps` კონტეინერის სახელწოდების დასამტკიცებლად. წარმოქმნილ სტაკში პარტნიორული კონტეინერები განისაზღვრება `./localnet/docker-compose.yml`.

## გენეზიის განახლება ერთჯერადი ქსელში {#recommit-genesis-in-a-disposable-network}

პარტნიორი იწყებს გენეზიას მხოლოდ მაშინ, როდესაც მისი შენახვა ცარიელია. ერთჯერადი Docker ქსელისთვის, შეაჩერეთ მასალა, ამოიღეთ გამომუშავებული მდგომარეობა, რეგენერაცია ან შეცვალეთ ხელმოწერილი გენეზის ბუნდი და დაიწყეთ ისევ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

არ შეცვალოთ გენეზი ქსელზე, რომლის მდგომარეობა უნდა იყოს შენარჩუნებული.

## გამოიყენეთ პერსონალური კონფიგურაცია {#use-custom-configuration}

ამჟამინდელი თანასწორობის კონფიგურაცია არის TOML. შეაერთეთ ან გადაწერეთ გენერირებული `config.toml`, `genesis.signed.nrt` და შესაბამისი საკვანძო ფაილები სურათის მიერ მოსალოდნელი კონტეინერის გზებში, შემდეგ განახორციელეთ თანასწორი. შეინარჩუნეთ გენერირებული ფაილები ერთად; სხვადასხვა Kagami რუნის ფაილების შერევა შეიძლება გამოიწვიოს დეზერიალიზაცია ან კონსენსუსის ჩავარდნა.
