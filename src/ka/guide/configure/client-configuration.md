---
translation_locale: ka
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კლიენტის კონფიგურაცია {#client-configuration}

Iroha CLI და SDK კლიენტების გამოყენება TOML კონფიგურაცია. საცავში გადმოცემა
ამჟამინდელი გათვალისწინებით `defaults/client.toml`; წარმოქმნილი ადგილობრივი ქსელები ასევე წერენ
შედარება `client.toml` მათი გამომავალი დირექტორიაში.

::: details კლიენტის კონფიგურაციის შაბლონი

<<< @/snippets/client.template.toml

:::

## ძირითადი ველები {#core-fields}

მინიმუმ, კლიენტის კონფიგურაცია იდენტიფიცირებს ჯაჭვას, Torii საბოლოო წერტილი და
ხელმოწერის ანგარიში:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ირჩევს ჯაჭვს, რომელშიც შედის წარმოდგენილი ოპერაციები.
- `torii_url` ქულები თანაბრად Torii HTTP API.
- `[account].domain` გამოიყენება CLI მოკლე გზები და მისამართის სელექტორის კოდირება;
  კანონიკური `AccountId` თვითონ უქვეყნოა.
- `[account].public_key` და `[account].private_key` ხელი მოაწეროს ტრანზაქციებს.

ანგარიში უნდა არსებობდეს უკვე ქსელში.
ნაგებობილი გენეზისის მანიფესტით.

::: info საქმის მგრძნობელობა

Iroha სახელები კანონიკური პარსირების შემდეგ შემთხვევებზე მგრძნობიარეა. მაგალითად,
`wonderland.universal`, `Wonderland.universal`, და
`looking_glass.universal` ეს არის განსხვავებული დომენის ლიტერალები.

:::

## ძირითადი ავთენტიფიკაცია {#basic-authentication}

ვარიანტი `[basic_auth]` განყოფილება დამატებს HTTP `Authorization` სათაური
კლიენტების მოთხოვნები. Iroha თანატოლები არ ინტერპრეტებენ ამ სერთიფიკატებს პირდაპირ; გამოყენება
ისინი, როდესაც Torii დგას უკანა მხრივ პროქსის, როგორიცაა Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## ტრანზაქციის პარამეტრები {#transaction-settings}

ტრანზაქციის ქცევა კონფიგურირებულია `[transaction]` განყოფილება:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` არის ტრანზაქციის სიცოცხლე მილიწამებში.
- `status_timeout_ms` აკონტროლებს, თუ რამდენ ხანს ელოდება კლიენტი ტრანზაქციას
  სტატუსი.
- `nonce = true` სთხოვს კლიენტს, რომ ჩართოს ნონსი ასე განმეორებული ოპერაციები
  წარმოქმნის სხვადასხვა ჰეშის.

## შეაერთეთ რიგის პარამეტრები {#connect-queue-settings}

მიმდინარე Iroha კლიენტებს შეუძლიათ გამოიყენონ ვარიანტი `[connect]` ადგილობრივი განყოფილება
რიგის მდგომარეობა:

```toml
[connect]
queue_root = "./queue"
```

გამოიყენეთ ეს, როდესაც სამუშაო პროცესს სჭირდება მდგრადი კლიენტის მხრიდან რიგის შენახვა.

## კონფიგურაციების შექმნა {#generating-configurations}

ერთჯერადი ადგილობრივი ქსელებისათვის სასურველია Kagami თორემ წერია შედარება Iroha
3 კონფიგ, გენეზი, სცენარები და a README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

გამოიყენეთ გენერირებული `./localnet/client.toml` და CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
