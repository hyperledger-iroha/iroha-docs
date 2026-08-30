---
translation_locale: ka
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ცხელი გადატვირთვა Iroha Docker კონტეინერში. {#hot-reload-iroha-in-a-docker-container}

გამოიყენეთ ცხელი გადატვირთვა მხოლოდ ადგილობრივი დებუგინგისთვის. ნორმალური ადგილობრივი განვითარებისათვის, უმჯობესია აღადგინოთ სურათი ან განახორციელოთ წარმოქმნილი Docker Compose სტაკი ახალი Kagami ბუნდიდან.

## შეცვალეთ თანატოლების ორმაგი {#replace-the-peer-binary}

შექმენით Linux- ით თავსებადი daemon binary upstream სამუშაო სივრცედან:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

გადაწერეთ იგი მიმდინარე თანატოლების კონტეინერში, შემდეგ განახორციელეთ კონტეინერი:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

გამოიყენეთ `docker ps` კონტეინერის სახელწოდების დასამტკიცებლად. წარმოქმნილ სტაკში პარტნიორული კონტეინერები განისაზღვრება `./docker-compose.yml`.

## გენეზიის განახლება ერთჯერადი ქსელში {#recommit-genesis-in-a-disposable-network}

პარტნიორი იწყებს გენეზიას მხოლოდ მაშინ, როდესაც მისი შენახვა ცარიელია. ერთჯერადი Docker ქსელისთვის, შეაჩერეთ მასალა, ამოიღეთ გამომუშავებული მდგომარეობა, რეგენერაცია ან შეცვალეთ ხელმოწერილი გენეზის ბუნდი და დაიწყეთ ისევ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

არ შეცვალოთ გენეზი ქსელზე, რომლის მდგომარეობა უნდა იყოს შენარჩუნებული.

## გამოიყენეთ პერსონალური კონფიგურაცია {#use-custom-configuration}

ამჟამინდელი პარტნიორის კონფიგურაცია არის TOML. შეაერთეთ ან აკოპირეთ გენერირებული `config.toml`, `genesis.signed.nrt` და შესაბამისი საკვანძო ფაილები კონტეინერის გზებში   image, შემდეგ restart peer. შეინარჩუნეთ გენერირებული ფაილები ერთად; სხვადასხვა Kagami run- დან ფაილების შერევა შეიძლება გამოიწვიოს deserialization ან კონსენსუსის ჩავარდნა.
