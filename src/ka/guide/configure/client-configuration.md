---
translation_locale: ka
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# მომხმარებლის კონფიგურაცია {#client-configuration}

Iroha CLI და SDK კლიენტები იყენებენ TOML კონფიგურაციას. სათავსო გადმოსცემს მიმდინარე დეფოლტს `defaults/client.toml`; წარმოქმნილი ადგილობრივი ქსელები ასევე წერენ შეესაბამებელს `client.toml` თავიანთ გამოსასვლელ დირექტორში.

::: details მომხმარებლის კონფიგურაციის შაბლონი

<<< @/snippets/client.template.toml

:::

## ძირითადი ველები {#core-fields}

კლიენტის კონფიგურაცია, სულ მცირე, განსაზღვრავს ჯაჭვს, მის ქსელურ იდენტობას, Torii ბოლო წერტილს, ანგარიშის ქსელურ კონტექსტსა და ხელმოწერის გასაღებს:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ირჩევს ჯაჭვს, რომელშიც შედის წარმოდგენილი ოპერაციები.
- `network_id` არის გენეზისიდან მიღებული ქსელური იდენტობა, რომელსაც ყოველი ხელმოწერილი მოთხოვნა ებმის. დააკონფიგურირეთ ზუსტად ერთი: `network_id` ან `network_id_file`; კვანძი მნიშვნელობას `GET /v1/accounts/capabilities`-ზე აქვეყნებს.
- `torii_url` პუნქტები ქსელის კვანძზე Torii HTTP API.
- `[account].chain_discriminant` ირჩევს ქსელის I105 ანგარიშის პრეფიქსს. საჯარო ქსელებში მის ნაცვლად შეიძლება `[account].profile = "taira"` ან `"minamoto"` გამოიყენოთ. ამ ორი მიდგომიდან ერთი სავალდებულოა; თავად კანონიკური `AccountId` დომენს არ შეიცავს.
- `[account].public_key` და `[account].private_key` ტრანზაქციების ხელმოწერისთვის გამოიყენება; `private_key_file`-ს შეუძლია `private_key` ჩაანაცვლოს.

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

`iroha` CLI ლოკალური რიგის მდგომარეობისთვის არასავალდებულო `[connect]` სექციასაც კითხულობს. ხელახლა გამოყენებადი SDK კონფიგურაცია მას არ იღებს:

```toml
[connect]
queue_root = "./queue"
```

ეს გამოიყენეთ, როცა პროცესს კლიენტის მხარეს რიგის მდგრადი შენახვა სჭირდება. `connect.queue_root` ნაგულისხმევად არის `~/.iroha/connect`; ფარდობითი გზა აითვლება დირექტორიიდან, რომელიც კლიენტის TOML ფაილს შეიცავს.

## კონფიგურაციების შექმნა {#generating-configurations}

ერთჯერადი ადგილობრივი ქსელებისთვის, უპირატესობა აქვს Kagami, რადგან იგი წერს შედარებულ Iroha 3 კონფიგურაციას, ბლოკჩეინის გენეზისისს, სკრიპტებს და README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

გამოიყენეთ წარმოქმნილი `./localnet/client.toml` და CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
