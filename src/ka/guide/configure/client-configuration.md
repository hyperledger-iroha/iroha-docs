---
translation_locale: ka
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მომხმარებლის კონფიგურაცია {#client-configuration}

Iroha CLI და SDK კლიენტები იყენებენ TOML კონფიგურაციას. სათავსო გადმოსცემს მიმდინარე დეფოლტს `defaults/client.toml`; წარმოქმნილი ადგილობრივი ქსელები ასევე წერენ შეესაბამებელს `client.toml` თავიანთ გამოსასვლელ დირექტორში.

::: details მომხმარებლის კონფიგურაციის შაბლონი

<<< @/snippets/client.template.toml

:::

## ძირითადი ველები {#core-fields}

მინიმუმ, კლიენტის კონფიგურაციაში იდენტიფიცირებულია ჯაჭვი, Torii API საბოლოო წერტილი და ხელმოწერის ანგარიში:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ირჩევს ჯაჭვს, რომელშიც შედის წარმოდგენილი ოპერაციები.
- `torii_url` პუნქტები ქსელის კვანძზე Torii HTTP API.
- `[account].domain` გამოიყენება CLI მოკლე გზებითა და მისამართის სელექტორის კოდირებით; კანონიკური `AccountId` თავად არის დომენის გარეშე.
- `[account].public_key` და `[account].private_key` ხელმოწერითი ოპერაციები.

ანგარიში უკვე უნდა არსებობდეს ჯაჭვზე. დეფოლტური ადგილობრივი ქსელისათვის ეს ხორციელდება ბუნდლირებული ბლოკჩეინის გენეზისის ტექნიკური მანიფესტით.

::: info საქმის მგრძნობელობა

Iroha სახელები არის შემთხვევისადმი მგრძნობიარე კანონიკური პარსირების შემდეგ. მაგალითად, `wonderland.universal`, `Wonderland.universal` და `looking_glass.universal` არიან განსხვავებული დომენის ლიტერალები.

:::

## ძირითადი ავთენტიფიკაცია {#basic-authentication}

ვარიანტული `[basic_auth]` განყოფილება ემატება HTTP `Authorization` სათაურს კლიენტის მოთხოვნებს. Iroha ქსელის კვანძეები არ ინტერპრეტებენ ამ სანებართვო პირობებს პირდაპირ; გამოიყენეთ ისინი მაშინ, როდესაც Torii დგას უკანა მხრიდან რევერს პროქსის, როგორიცაა Nginx .

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## ოპერაციების პარამეტრები {#transaction-settings}

ტრანზაქციის ქცევა კონფიგურირებულია `[transaction]` განყოფილებით:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` არის ტრანზაქციის ხანგრძლივობა მილიწამებში.
- `status_timeout_ms` აკონტროლებს, თუ რამდენი ხანია კლიენტი ელოდება ოპერაციის სტატუსს.
- `nonce = true` კლიენტს nonce-ის დამატებას სთხოვს, რათა განმეორებითმა ტრანზაქციებმა განსხვავებული ჰეშები წარმოქმნას.

## შეაერთეთ რიგის პარამეტრები {#connect-queue-settings}

მიმდინარე Iroha კლიენტებს ასევე შეუძლიათ გამოიყენონ ადგილობრივი რიგის მდგომარეობისთვის ვარიანტიანი `[connect]` განყოფილება:

```toml
[connect]
queue_root = "./queue"
```

გამოიყენეთ ეს, როდესაც სამუშაო პროცესს სჭირდება მდგრადი კლიენტის მხრიდან რიგის შენახვა.

## კონფიგურაციების შექმნა {#generating-configurations}

ერთჯერადი ადგილობრივი ქსელებისთვის, უპირატესობა აქვს Kagami, რადგან იგი წერს შედარებულ Iroha 3 კონფიგურაციას, ბლოკჩეინის გენეზისისს, სკრიპტებს და README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

გამოიყენეთ წარმოქმნილი `./localnet/client.toml` და CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
