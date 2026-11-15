---
translation_locale: ka
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ინტეგრაციის პრობლემების გადაჭრა {#troubleshooting-integration-issues}

ამ განყოფილებაში მოცემულია Iroha 3-ის ინტეგრაციის პრობლემების მოგვარების რჩევები. თუ პრობლემა არ არის აღწერილი აქ, დაუკავშირდით ჩვენ [ტელეგრამი](https://t.me/hyperledgeriroha).

## კლიენტი ვერ მიერთდება. {#client-cannot-connect}

შეამოწმეთ, რომ კლიენტის კონფიგურაცია მიუთითებს ქსელის პარის Torii მისამართზე:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI შემოწმების შემთხვევაში, გადასცეს იგივე ფაილი მკაფიოდ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

თუ ქსელის კვანძი Docker-ში ან Kubernetes-ში მუშაობს, გამოიყენეთ კლიენტის პროცესიდან მისაწვდომი ჰოსტის ან სერვისის მისამართი. კონტეინერში `127.0.0.1` ჰოსტის მანქანას არ აღნიშნავს.

საჯარო Taira გამოცდებისათვის დაიწყეთ API საბოლოო წერტილის გამოკვლევით, რომელსაც არ აქვს ხელმოწერა:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

იმ შემთხვევაში, თუ ეს ბრძანებები არ შეესაბამება `502`, TLS, DNS ან დროის გამოშვების შეცდომებს, მოასწორეთ ქსელის ხელმისაწვდომობა ან დაველოდოთ საჯარო ტესტნეტის საბოლოო წერტილს API ანგარიშის გასაღებების ან ტრანზაქციების დატვირთვების დებეგირებამდე.

## ტრანზაქციები უარყოფითია {#transactions-are-rejected}

ტრანზაქციის უმეტესობა გამოწვეულია იდენტობის ან ავტორიზაციის შეუსაბამობის გამო:

- მომხმარებლის კონფიგურაციაში არსებული ანგარიშის საჯარო გასაღები არ შეესაბამება ხელმოწერისთვის გამოყენებულ პირად გასაღებს
- ანგარიში არ არის რეგისტრირებული ბლოკჩეინ გენეზში ან წინა ტრანზაქციით.
- ანგარიშს არ აქვს ნებართვის ტოკი ან როლი, რომელიც შესრულების გარემოს ვალიდატორისთვის არის საჭირო
- დომენის ID-ს აკლია მონაცემთა სივრცით დაზუსტება, მაგალითად `domain.dataspace`

გამოიყენეთ `--output-format text` დაშვების დროს CLI ბრძანებები, რათა შეცდომები უფრო ადვილად წაიკითხოს:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## შეკითხვები უბრუნებს ცარიელ შედეგებს {#queries-return-empty-results}

ცარიელი შეკითხვის შედეგები ყოველთვის არ ნიშნავს, რომ შეკითხვა წარუმატებელი. შეამოწმეთ:

- ოპერაცია, რომელიც უნდა შექმნას ობიექტი დასრულდა.
- გამოკითხული დომენი, აქტივების განსაზღვრა ან ანგარიშის ID არის კანონიკური
- გვერდების დაფარვა ან ფილტრები არ გამორიცხავს მოსალოდნელი რიგის
- კლიენტი დაკავშირებულია განკუთვნილ ქსელზე და არა სხვა ლოკალურ ქსელში

დომენის შემოწმებისათვის, დაიწყეთ ყველაზე ფართო მოთხოვნით:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## მოვლენების ან ბლოკების ნაკადები ადრე შეწყდება {#event-or-block-streams-stop-early}

ბლოკისა და მოვლენების ნაკადის მაგალითები ეყრდნობა Torii სტრიმინგის API საბოლოო წერტილებს. შეამოწმეთ, თუ ქსელის კვანძები კვლავ მუშაობენ, შემდეგ გამოკვლევას დროით:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP ინტეგრაციებისთვის შეადარეთ თქვენი API-ის საბოლოო წერტილის გზები მიმდინარე [Torii API საბოლოო წერტილის რეფერენცია](/ka/reference/torii-endpoints.md) -თან.
