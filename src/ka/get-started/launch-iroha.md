---
translation_locale: ka
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გაშვება Iroha 3 {#launch-iroha-3}

ეს გვერდი გადის მიმდინარე ადგილობრივი ქსელის ნაკადში Iroha 3 გამოყენებით სამუშაო სივრცის დეფოლტური აქტივები ზემოთ განლაგებული რეპროდუქციისგან.

## 1. შექმნას ადგილობრივი მრავალმხრივი ქსელი {#_1-generate-a-local-multi-peer-network}

გენერირება ოთხი peer localnet მოქმედი Kagami კოდიდან:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

გამოშვების დირექტორი შეიცავს შესაბამის პარტნიორთა კონფიგურაციებს, `genesis.json`, `genesis.signed.nrt`, `client.toml` და დამხმარე სკრიპტები.

ადგილობრივი სიგარეტის ტესტისთვის, დაუწყეთ წარმოქმნილი თანატოლების პირდაპირი:

```bash
./localnet/start.sh
```

კონტეინერიზებული განხორციელებისათვის, შეიქმნას Compose იმავე localnet დირექტორიდან:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

გათვალისწინებით გენერირებული სტეიკი აჩვენებს:

- პარტნიორი P2P პორტები `1337` - `1340`
- Torii HTTP პორტები `8080` - `8083`
- მზა კლიენტის კონფიგურაცია `./localnet/client.toml`

## 2. შეამოწმეთ, არის თუ არა ქსელი მოქმედი {#_2-verify-that-the-network-is-up}

შეამოწმეთ სტატუსის საბოლოო წერტილი პირველ პარტნიორზე:

```bash
curl http://127.0.0.1:8080/status
```

სტატისტიკური ჯანმრთელობის შემოწმებისას ასევე გამოიყენება:

```bash
curl http://127.0.0.1:8080/status/blocks
```

თქვენ შეგიძლიათ დაუყოვნებლივ მიუთითოთ CLI შეკრული კლიენტის კონფიგურაციის:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus პროფილი {#_3-nexus-profile}

რეპოზიტორი ასევე გზავნის SORA Nexus ორიენტირებულ კონფიგურაციის პროფილი `defaults/nexus/` ქვეშ.

Nexus პროფილის მქონე მშობლიური პარტნიორის ჩასატარებლად:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

გამოიყენეთ `defaults/nexus/client.toml` ამ პროფილისთვის CLI წვდომისათვის.

## 4. შეაჩერეთ ადგილობრივი ქსელი {#_4-stop-the-local-network}

ადგილობრივი გენერირებული ლოკალური ქსელისათვის:

```bash
./localnet/stop.sh
```

წარმოქმნილი კომპოსის სტაკისთვის:

```bash
docker compose -f ./docker-compose.yml down
```

შემდეგ, რაც ქსელი მუშაობს, განაგრძეთ [Operate Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md).
