---
translation_locale: ka
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# იანესისი {#genesis}

ჟენესისი განსაზღვრავს საწყის ჯაჭვის მდგომარეობას. JSON მანიფესტი,
და Iroha 3 კვანძები მოხმარებს ხელმოწერას Norito ტრანზაქციის ფაილი.

::: details დეფოლტური გენეზის მანიფესტი

<<< @/snippets/genesis.json

:::

## ფაილები {#files}

აღმავალი რეპოზიტორიის გადმოცემა დეფოლტური მანიფესტი `defaults/genesis.json`.
Kagami-გენერირებული ქსელები წერენ თავიანთ მანიფესტსა და ხელმოწერილ ტრანზაქციას
გამოდის დირექტორი:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

წარმოქმნილი `README.md` ამ დირექტორში აღნიშნულია ზუსტი ფაილები და გაშვება
ბრძანებები შერჩეული პროფილისთვის.

## თანატოლების კონფიგურაცია {#peer-configuration}

პარტნიორები მიუთითებენ ხელმოწერილი გენეზიის ტრანზაქციაზე `[genesis]` განყოფილება
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ქსელის ყველა თანატოლმა უნდა შეთანხმდეს გაფორმებული გენეზისის ტრანზაქციაზე და
გენეზიის საჯარო გასაღები.

## გათვალისწინება იანესის {#signing-genesis}

თუ მანიფესტი ხელით დაამატებთ, გაადასტურეთ და მოაწერეთ ხელმოწერა თანასწორების დაწყებამდე:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS-ისათვის ან Nexus პროფილები, მოიცავს ტოპოლოგიას და BLS ქონების მტკიცებულებები
მოთხოვნილება წარმოქმნილი პროფილის მიხედვით. Kagami `localnet`, `wizard`, და პროფილი
გენერაციის ბრძანებები ამ დეტალებს ავტომატურად მართავს.

## იანესის აღდგენა {#recommitting-genesis}

პარტნიორი მხოლოდ მაშინ იწყებს გენეზიას, როდესაც მისი შენახვა ცარიელია.
ერთჯერადი ადგილობრივი ქსელი, შეაჩერეთ თანატოლები, ამოიღეთ მათი შექმნილი სახელმწიფო დირექტორი,
და დაიწყეთ ახალი ხელმოწერილი გენეზიდან. არ შეცვალოთ გენეზის
ქსელი, თუ ყველა ვალიდატორი არ აკოორდინებს ერთსა და იმავე მიგრაციას.
