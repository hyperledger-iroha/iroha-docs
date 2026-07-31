---
translation_locale: ka
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გაშვება Iroha 3 {#launch-iroha-3}

ეს გვერდი გადის მიმდინარე ადგილობრივი ქსელის ნაკადი Iroha 3 გამოყენებით
სამუშაო სივრცის დეფოლტური აქტივები ზემოაღნიშნული რეპოზიტორიიდან.

## 1. შეიქმნას ადგილობრივი მრავალმხრივი ქსელი {#_1-generate-a-local-multi-peer-network}

გენერირება ოთხი peer ადგილობრივი ქსელი მდინარე Kagami კოდი:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

გამოსავალი დირექტორი შეიცავს შედარებით თანატოლური კონფიგურაციები, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, და დამხმარე სცენარები.

ადგილობრივი მოწევის ტესტისთვის, დაუწყეთ წარმოქმნილი თანატოლები პირდაპირ:

```bash
./localnet/start.sh
```

კონტეინერული run-ისთვის, შექმენით Compose იმავე localnet დირექტორიდან:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

გათვალისწინებით წარმოქმნილი სტეიკი ასახავს:

- პარტნიორი P2P პორტები `1337` დაწვრილებით `1340`
- Torii HTTP პორტები `8080` დაწვრილებით `8083`
- მზა კლიენტის კონფიგურაცია `./localnet/client.toml`

## 2. შეამოწმეთ, რომ ქსელი გაყვანილია {#_2-verify-that-the-network-is-up}

შეამოწმეთ სტატუსის ბოლო წერტილი პირველი თანაბარი:

```bash
curl http://127.0.0.1:8080/status
```

ავტომატური საავადმყოფოების ჯანმრთელობის კონტროლი ასევე გამოიყენება:

```bash
curl http://127.0.0.1:8080/status/blocks
```

შეგიძლიათ დაუყოვნებლივ მიუთითოთ CLI ბუნდული კლიენტის კონფიგურაციაზე:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus პროფილი {#_3-nexus-profile}

რეპროდუქციული საწყობი ასევე გადმოსცემს SORA Nexus-გარემონტებული კონფიგურაციის პროფილი ქვემოთ
`defaults/nexus/`.

რომ ჩატარდეს მშობლიური თანატოლები ერთად Nexus პროფილი:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

გამოყენება `defaults/nexus/client.toml` სამედიცინო CLI ამ პროფილის მიღება.

## 4. შეწყვიტეთ ადგილობრივი ქსელი {#_4-stop-the-local-network}

ადგილობრივი გენერირებული ლოკალური ქსელისათვის:

```bash
./localnet/stop.sh
```

წარმოქმნილი კომპოსის სტაკისთვის:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

ქსელის მუშაობის შემდეგ, განაგრძეთ
[ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md).
