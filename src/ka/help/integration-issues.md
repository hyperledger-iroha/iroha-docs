---
translation_locale: ka
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ინტეგრაციის პრობლემების გადაჭრა {#troubleshooting-integration-issues}

ამ განყოფილებაში მოცემულია პრობლემების აღმოფხვრის რჩევები Iroha 3 ინტეგრაცია.
რაც თქვენ განიცდით, აქ არ არის აღწერილი.
დაგვიკავშირდით მეშვეობით [ტელეგრამი](https://t.me/hyperledgeriroha).

## კლიენტი ვერ შედის {#client-cannot-connect}

შეამოწმეთ, რომ კლიენტის კონფიგურაცია მიუთითებს პარტნიორის Torii მისამართი:

```toml
torii_url = "http://127.0.0.1:8080/"
```

სამედიცინო CLI შეამოწმება, იგივე ფაილი გამორჩეულია:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

თუ პარტნიორები შედიან Docker ან Kubernetes, გამოიყენეთ მასპინძელი ან სერვისის მისამართი, რომელიც
არის ხელმისაწვდომი კლიენტის პროცესიდან. `127.0.0.1` კონტეინერში არ არის
მასპინძელი მანქანა.

საზოგადოებისთვის Taira ტესტები იწყება ხელმოუწერელი საბოლოო წერტილის სონდით:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

თუ ეს ბრძანებები ვერ შეასრულებს `502`, TLS, DNS, ან Timeout შეცდომები, ქსელის გამოსწორება
ხელმისაწვდომობა ან ელოდება საჯარო ტესტნეტის საბოლოო წერტილს ანგარიშის დებეგირებამდე
გასაღები ან ტრანზაქციული სასარგებლო ტვირთები.

## ტრანზაქციები უარყოფითია {#transactions-are-rejected}

ტრანზაქციების უმეტესობა გამოწვეულია იდენტობის ან ავტორიზაციის შეუსაბამობიდან:

- საჯარო გასაღები კლიენტის კონფიგურაციაში არ შეესაბამება პირად გასაღებს
  გამოყენებული ხელმოწერისთვის
- ანგარიში არ არის რეგისტრირებული გენეზიის ან წინა ტრანზაქციის შედეგად
- ანგარიშს არ აქვს ნებართვის ნიშანი ან როლი, რომელიც საჭიროა გამშვები დროისათვის
  დამტკიცებელი
- დომენი ID არ აქვს მონაცემთა სივრცის კვალიფიკაცია, მაგალითად:
  `domain.dataspace`

გამოყენება `--output-format text` დებეგირების დროს CLI ბრძანებები, რათა შეცდომები უფრო მარტივია
წაკითხვა:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## შეკითხვები უბრუნებს ცარიელ შედეგებს {#queries-return-empty-results}

ცარიელი შეკითხვის შედეგები ყოველთვის არ ნიშნავს, რომ შეკითხვა წარუმატებელია. შეამოწმეთ:

- განხორციელდა ოპერაცია, რომელიც უნდა შექმნას ობიექტი
- გამოკითხული დომენი, აქტივების განსაზღვრა ან ანგარიში ID არის კანონიკური
- გვერდის დაფარვა ან ფილტრები არ გამორიცხავს მოსალოდნელი რიგის
- კლიენტი დაკავშირებულია განკუთვნილ ქსელზე და არა სხვა ლოკალურ ქსელში

დომენის შემოწმებისთვის, დაიწყეთ ყველაზე ფართო გამოკითხვით:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## მოვლენების ან ბლოკების ნაკადები ადრე შეწყდება {#event-or-block-streams-stop-early}

ბლოკისა და მოვლენების ნაკადის მაგალითები ეყრდნობა Torii გადაცემის ბოლო წერტილები.
peer ჯერ კიდევ მუშაობს, შემდეგ ტესტი დროით:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

სამედიცინო HTTP ინტეგრაციები, შეადარეთ თქვენი საბოლოო პუნქტების გზები მიმდინარე
[Torii საბოლოო წერტილის რეფერენცია](/ka/reference/torii-endpoints.md).
