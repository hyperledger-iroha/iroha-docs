---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ბლოკჩეინის გენეზისი რეფერენცია {#genesis-reference}

მიმდინარე Iroha 3 სამუშაო პროცესში `genesis.json` ტექნიკური მანიფესტი აღწერს პირველ ტრანზაქციებსა და პარამეტრებს, რომლებიც გამოიყენება ქსელის დაწყებისას.

ქსელის კვანძებს შორის გავრცელებული ხელმოწერილი არტეფაქტი არის Norito-ის კოდირებული `.nrt` ფაილი, რომელიც წარმოიქმნა `kagami genesis sign`.

## ძირითადი სფეროები {#main-fields}

ბლოკჩეინის გენეზისის ტექნიკური მანიფესტი შეიძლება განსაზღვროს:

- `chain` ჯაჭვის იდენტიფიკატორისთვის
- `chain_discriminant` — I105 ქსელის პრეფიქსისთვის, რომლითაც მანიფესტში ანგარიშის ლიტერალები კოდირდება
- `executor` ავარიული აღმასრულებელი განახლების ბაიტკოდის გზაზე
- `ivm_dir` IVM ბიბლიოთეკებისათვის, რომლებიც გამოიყენება ტრიგერებისა და განახლებების დროს
- `consensus_mode` ტექნიკური მანიფესტში გამოცხადებული საწყისი რეჟიმისათვის.
- `transactions` პარამეტრების განახლებების, ინსტრუქციებისა და ტრიგერებისა და ტოპოლოგიის შედგენისათვის
- `sumeragi_context` — Sumeragi-ის ხელმოწერილი სიმაღლის კონტექსტის პარამეტრებისთვის
- `crypto_admission_policy` — ჯაჭვის მიერ დაშვებული ზუსტი ხელმოწერისა და კონტროლერის ალგორითმებისთვის, რომლებიც `allowed_algorithms`-შია ჩამოთვლილი

`transactions` ტოპოლოგიის ჩანაწერებში შედის ქსელის პარული ID-ები და PoPs ერთობლივად:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## შექმნა ტექნიკური მანიფესტი {#generate-a-manifest}

შაბლონის შესაქმნელად გამოიყენეთ Kagami. ყოველი დაშვებული ალგორითმისთვის გაიმეორეთ `--allowed-signing` კანონიკური ზრდადი მიმდევრობით; Kagami გამოტოვებულ ალგორითმებს თავად არ ამატებს:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

საჯარო SORA Nexus მონაცემთა სივრცისთვის მოსალოდნელი კონსენსუსის რეჟიმია `npos`. სხვა Iroha 3 განთავსებებმა სამიზნე პროფილის მიხედვით შეიძლება ნებართვებზე დაფუძნებული რეჟიმი ან NPoS გამოიყენოს.

## ხელს აწერეთ ტექნიკური მანიფესტი {#sign-the-manifest}

JSON-ის რედაქტირების და მოწმობის შემდეგ, დაიწერეთ იგი განთავსებადი `.nrt` ბლოკში:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` კითხულობს ბლოკჩეინის გენეზის საჯარო გასაღები ტექნიკური მანიფესტიდან და იყენებს კერძო გასაღებს მფლობელის მიერ განთავსებული, ერთი ბმულიანი რეგულარული ფაილიდან, რათა წარმოადგინოს განლაგებადი ხელმოწერილი ბლოკი ფაილს უნდა შეიცავდეს კანონიკური კერძო გასაღების მულტიჰეში, რომელსაც მოყვება ახალი ხაზი; Kagami უარყოფს სიმბოლურ ბმულებსა და რეჟიმებს, რომლებიც არ შეესაბამება `0600`. ნედლეული კერძო საკეტები არ არის მიღებული ბრძანების ხაზზე. შედეგად ის ფაილია, რომელიც ქსელის კვანძებმა თავიანთი კონფიგურაციიდან უნდა მოიხსენიონ.

## კონფიგურაცია `iroha3d` {#configure-iroha3d}

დემონს მიუთითეთ ხელმოწერილი გენეზის ბლოკი და ფაილი, რომელიც მის მოსალოდნელ ჰეშს აფიქსირებს. ამ ფაილს `kagami genesis sign --expected-hash-out` წერს და კვანძი მას მოითხოვს პირველად და ხელახალი გაშვებისას:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## დაკავშირებული ინსტრუმენტები {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

გენერატორის განხორციელებისა და ბრძანების დეტალებისათვის იხილეთ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
