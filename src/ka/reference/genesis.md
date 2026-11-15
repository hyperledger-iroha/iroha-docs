---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
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
- `wire_protocol_version` — პირველი გამოშვების კონსენსუსის გადაცემის პროტოკოლის ვერსიისთვის
- `consensus_fingerprint` — კონსენსუსის პარამეტრების არასავალდებულო ტიპიზებული ანაბეჭდისთვის, რომელსაც JSON მანიფესტები აშკარად უთითებს
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
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

საჯარო SORA Nexus მონაცემთა სივრცისთვის მოსალოდნელი კონსენსუსის რეჟიმია `npos`. სხვა Iroha 3 განთავსებებმა სამიზნე პროფილის მიხედვით შეიძლება ნებართვებზე დაფუძნებული რეჟიმი ან NPoS გამოიყენოს.

## ხელს აწერეთ ტექნიკური მანიფესტი {#sign-the-manifest}

JSON-ის რედაქტირების და მოწმობის შემდეგ, დაიწერეთ იგი განთავსებადი `.nrt` ბლოკში:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` გენეზისის გასაღებების წყვილს მფლობელის მიერ შენახულ, ერთბმულიან ჩვეულებრივ ფაილში არსებული კერძო გასაღებიდან გამოიყვანს და განსათავსებელ ხელმოწერილ ბლოკს ქმნის. გადაეცით `--expected-public-key`, რათა მოითხოვოთ მისი დამთხვევა გამოქვეყნებულ გენეზისის საჯარო გასაღებთან. ფაილი უნდა შეიცავდეს ერთ კანონიკურ კერძო გასაღების მულტიჰეშს, რომელსაც ახალი ხაზი მოსდევს; Kagami უარყოფს სიმბოლურ ბმულებს და `0600`-ისგან განსხვავებულ რეჟიმებს. ნედლი კერძო გასაღებები ბრძანების ხაზზე არ მიიღება. შედეგი არის ფაილი, რომელსაც კვანძები თავიანთი კონფიგურაციიდან უნდა მიმართავდნენ.

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
