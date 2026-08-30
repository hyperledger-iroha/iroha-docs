---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გენეზისის მითითება {#genesis-reference}

მიმდინარეობაში Iroha 3 სამუშაო პროცესი, ა `genesis.json` manifest აღწერს პირველს
ტრანზაქციები და პარამეტრები, რომლებიც გამოყენებული იქნება ქსელის დაწყებისას.

თანატოლებზე დარიგებული ხელმოწერილი არტეფაქტი არის ა Norito- დაშიფრული `.nrt` ფაილი
მიერ წარმოებული `kagami genesis sign`.

## მთავარი სფეროები {#main-fields}

გენეზის მანიფესტს შეუძლია განსაზღვროს:

- `chain` ჯაჭვის იდენტიფიკატორისთვის
- `executor` არასავალდებულო შემსრულებლის განახლების ბაიტიკოდის გზისთვის
- `ivm_dir` ამისთვის IVM ბიბლიოთეკები, რომლებიც გამოიყენება ტრიგერებისა და განახლებების მიერ
- `consensus_mode` მანიფესტის მიერ რეკლამირებული საწყისი რეჟიმისთვის
- `transactions` შეკვეთილი პარამეტრების განახლებისთვის, ინსტრუქციებისთვის, ტრიგერებისა და ტოპოლოგიისთვის
- `crypto` საწყისი კრიპტო სნეპშოტისთვის

ფარგლებში `transactions`, ტოპოლოგიის ჩანაწერები წყვილის თანატოლების ID და PoPs ერთად:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## შექმენით მანიფესტი {#generate-a-manifest}

გამოყენება Kagami შაბლონის შესაქმნელად:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

საზოგადოებისთვის SORA Nexus მონაცემთა სივრცე, `npos` არის მოსალოდნელი კონსენსუსის რეჟიმი.
სხვა Iroha 3 განლაგებამ შეიძლება გამოიყენოს ნებადართული ან NPoS, მიზნიდან გამომდინარე
პროფილი.

## მოაწერეთ ხელი მანიფესტს {#sign-the-manifest}

რედაქტირებისა და დადასტურების შემდეგ JSON, მოაწერეთ იგი განლაგებულ ფორმატში `.nrt` ბლოკი:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` კითხულობს გენეზის საჯარო გასაღებს manifest-დან და იყენებს
პირადი გასაღები მფლობელის მიერ დაცული, ერთი ბმული რეგულარული ფაილიდან, რათა შეიქმნას
განლაგებული ხელმოწერილი ბლოკი.ფაილი უნდა შეიცავდეს ერთ კანონიკურ პირად გასაღებს
multihash მოჰყვება ახალი ხაზი; Kagami უარყოფს სიმბოლურ ბმულებს და არეგულირებს სხვას
ვიდრე `0600`. დაუმუშავებელი პირადი გასაღებები არ მიიღება ბრძანების ხაზზე.შედეგი
არის ფაილი, რომელსაც თანატოლებმა უნდა მიმართონ თავიანთი კონფიგურაციიდან.

## კონფიგურაცია `iroha3d` {#configure-iroha3d}

მიუთითეთ დემონი ხელმოწერილი გენეზის ბლოკზე:

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
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
