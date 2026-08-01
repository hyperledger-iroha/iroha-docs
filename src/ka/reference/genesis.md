---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# იანესის რეფერენცია {#genesis-reference}

მიმდინარე Iroha 3 სამუშაო პროცესში, `genesis.json` მანიფესტი აღწერს პირველ ტრანზაქციებსა და პარამეტრებს, რომლებიც გამოყენებული იქნება ქსელის დაწყებისას.

ხელმოწერილი არტეფაქტი, რომელიც თანამოაზრეებს გადაეცემა, არის Norito-ის კოდირებული `.nrt` ფაილი, რომელსაც `kagami genesis sign` აწარმოებდა.

## ძირითადი სფეროები {#main-fields}

გენეზიის მანიფესტმა შეიძლება განსაზღვროს:

- `chain` ჯაჭვის იდენტიფიკატორისთვის
- `executor` ავარიული აღმასრულებელი განახლების ბაიტკოდის გზაზე
- `ivm_dir` IVM ბიბლიოთეკებისათვის, რომლებიც გამოიყენება ტრიგერებისა და განახლებების დროს
- `consensus_mode` საწყისი რეჟიმისათვის, რომელიც გამოცხადებულია მანიფესტში
- `transactions` პარამეტრების განახლებების, ინსტრუქციებისა და ტრიგერებისა და ტოპოლოგიის შედგენისათვის
- `crypto` პირველადი კრიპტოვალუტის გადაღებისთვის

`transactions` ტოპოლოგიის ჩანაწერებში შედის პარული ID-ები და PoPs ერთად:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## გამოიმუშავეთ მანიფესტი {#generate-a-manifest}

გამოყენება Kagami შაბლონის შესაქმნელად:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

საჯარო SORA Nexus მონაცემთა სივრცეში, `npos` არის მოსალოდნელი კონსენსუსის რეჟიმი. სხვა Iroha 3 განთავსებებში შეიძლება გამოყენებულ იქნას ნებადართული ან NPoS მიზნების პროფილის მიხედვით.

## ხელი მოაწერეთ მანიფესტს {#sign-the-manifest}

JSON-ის რედაქტირების და მოწმობის შემდეგ, დაიწერეთ იგი განთავსებადი `.nrt` ბლოკში:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` კითხულობს გენეზიის საჯარო გასაღებს მანიფესიდან და იყენებს მიწოდებულ კერძო გასაღებს, მარცვლას და ალგორითმს განთავსებადი ხელმოწერილი ბლოკის წარმოქმნისათვის. შედეგად არის ფაილი, რომელსაც თანატოლებმა უნდა მოიხსენიონ მათი კონფიგურაციიდან.

## კონფიგურაცია `irohad` {#configure-irohad}

ეწევით დემონს გაფორმებულ გენეზის ბლოკზე:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## დაკავშირებული ინსტრუმენტები {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

გენერატორის დანერგვისა და ბრძანების დეტალებისთვის იხილეთ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
