---
translation_locale: ka
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# იანესისი {#genesis}

გენეზიში განისაზღვრება საწყისი ჯაჭვის მდგომარეობა. რედაქტირებადი წყარო არის JSON მანიფესტი, ხოლო Iroha 3 კვანძი მოიხმარს ხელმოწერილი Norito ტრანზაქციის ფაილს.

::: details დეფოლტური გენეზიის მანიფესტი

<<< @/snippets/genesis.json

:::

## ფაილები {#files}

`defaults/genesis.json`. Kagami-ის მიერ შექმნილი ქსელები საგამოშვო დირექტორში საკუთარ დირექტორიან და ხელმოწერილი ტრანზაქციას წერენ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ამ დირექტორში გენერირებული `README.md` აღნიშნავს კონკრეტულ ფაილებს და ამოქმედების ბრძანებებს შერჩეული პროფილისთვის.

## თანატოლების კონფიგურაცია {#peer-configuration}

`config.toml`-ის `[genesis]` განყოფილებაში ხელმოწერილი გენეზის ტრანზაქციაზე თანატოლები მიუთითებენ:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ქსელის ყველა თანატოლმა უნდა შეთანხმდეს გაფორმებული გენეზის ტრანზაქციაზე და გენეზიის საჯარო გასაღები.

## იანესის ხელმოწერა {#signing-genesis}

თუ მანიფესტი ხელით რედაქტირებთ, შეამოწმეთ და მოაწერეთ ხელმოწერა თანატოლების დაწყებამდე:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS ან Nexus პროფილისთვის, შეიყვანეთ ტოპოლოგია და BLS წარმოქმნილი პროფილისთვის საჭირო მფლობელობის მტკიცებულებები. Kagami `localnet`, `wizard` და პროფილის წარმოების ბრძანებები ამ დეტალებს ავტომატურად მართავენ.

## იანესის აღდგენა {#recommitting-genesis}

გენეზიის განხორციელება ხდება მხოლოდ მაშინ, როდესაც მისი შენახვა ცარიელია. ახალი გენეზის გამოსამოწმებლად ერთჯერადი ლოკალურ ქსელში, შეაჩერეთ პარები, ამოიღეთ მათი შექმნილი სახელმწიფო დირექტორი და დაიწყეთ ახალი ხელმოწერილი გენეზიდან. არ შეცვალოთ გენეზა მიმდინარე ქსელზე, თუ ყველა ვალიდატორი არ აკოორდინებს იგივე მიგრაციას.
