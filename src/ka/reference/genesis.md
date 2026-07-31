---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# იანესის რეფერენცია {#genesis-reference}

ამჟამად Iroha 3 სამუშაო მიმდინარეობა, `genesis.json` მანიფესტი აღწერს პირველ
ტრანზაქციები და პარამეტრები, რომლებიც გამოიყენება ქსელის დაწყებისას.

ხელმოწერილი არტეფაქტი, რომელიც გადანაწილდა თანატოლებს არის Norito-კოდირებული `.nrt` ფაილი
წარმოებული `kagami genesis sign`.

## ძირითადი სფეროები {#main-fields}

გენეზიის მანიფესტმა შეიძლება განსაზღვროს:

- `chain` ჯაჭვის იდენტიფიკატორისათვის
- `executor` ავარიული აღმასრულებლის განახლება ბაიტკოდის გზაზე
- `ivm_dir` სამედიცინო IVM ტრიგერებისა და განახლებების მიერ გამოყენებული ბიბლიოთეკები
- `consensus_mode` საწყისი რეჟიმისათვის, რომელიც გამოცხადებულია მანიფესტში
- `transactions` პარამეტრების განახლებების, ინსტრუქციების, გამშვებებისა და ტოპოლოგიის რეჟიმისთვის
- `crypto` საწყისი კრიპტოვალუტის გადაღებისთვის

შიდა `transactions`, ტოპოლოგიის ჩანაწერები წყვილი თანაბარი ID და PoPs ერთად:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## გამოიმუშავეთ მანიფესტი {#generate-a-manifest}

გამოყენება Kagami მოდელი შექმნა:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

საზოგადოებისთვის SORA Nexus მონაცემთა სივრცე, `npos` არის მოსალოდნელი კონსენსუსის რეჟიმი.
სხვა Iroha 3 განთავსებებში შეიძლება გამოყენებულ იქნას ნებადართული ან NPoS მიზნების მიხედვით
პროფილი.

## ხელი მოაწერეთ მანიფესტს {#sign-the-manifest}

მას შემდეგ, რაც რედაქტირება და დამტკიცება JSON, დაწერეთ იგი განთავსებად `.nrt` ბლოკი:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` გენეზიის საჯარო გასაღები მანიფესტიდან და გამოყენებები
მიწოდებული კერძო გასაღები, თესლი და ალგორითმი განთავსებადი ხელმოწერილის წარმოებისათვის
ბლოკი. შედეგია ის ფაილი, რომელსაც თანატოლებმა უნდა მოიხსენიონ თავიანთი კონფიგურაციიდან.

## კონფიგურაცია `irohad` {#configure-irohad}

აწევით დეიმონს გაფორმებულ გენეზის ბლოკს:

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

გენერატორის განხორციელებისა და ბრძანების დეტალებისთვის იხილეთ
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
