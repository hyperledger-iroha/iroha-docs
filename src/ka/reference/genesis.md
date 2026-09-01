---
translation_locale: ka
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ბლოკჩეინის გენეზისი რეფერენცია {#genesis-reference}

მიმდინარე Iroha 3 სამუშაო პროცესში `genesis.json` ტექნიკური მანიფესტი აღწერს პირველ ტრანზაქციებსა და პარამეტრებს, რომლებიც გამოიყენება ქსელის დაწყებისას.

ქსელის კვანძებს შორის გავრცელებული ხელმოწერილი არტეფაქტი არის Norito-ის კოდირებული `.nrt` ფაილი, რომელიც წარმოიქმნა `kagami genesis sign`.

## ძირითადი სფეროები {#main-fields}

ბლოკჩეინის გენეზისის ტექნიკური მანიფესტი შეიძლება განსაზღვროს:

- `chain` ჯაჭვის იდენტიფიკატორისთვის
- `executor` ავარიული აღმასრულებელი განახლების ბაიტკოდის გზაზე
- `ivm_dir` IVM ბიბლიოთეკებისათვის, რომლებიც გამოიყენება ტრიგერებისა და განახლებების დროს
- `consensus_mode` ტექნიკური მანიფესტში გამოცხადებული საწყისი რეჟიმისათვის.
- `transactions` პარამეტრების განახლებების, ინსტრუქციებისა და ტრიგერებისა და ტოპოლოგიის შედგენისათვის
- `crypto` საწყისი კრიპტოგრაფიული დროის მონაცემების ნახვისთვის.

`transactions` ტოპოლოგიის ჩანაწერებში შედის ქსელის პარული ID-ები და PoPs ერთობლივად:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## შექმნა ტექნიკური მანიფესტი {#generate-a-manifest}

გამოყენება Kagami შაბლონის შესაქმნელად:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

საჯარო SORA Nexus მონაცემთა სივრცეში, `npos` არის მოსალოდნელი კონსენსუსის რეჟიმი. სხვა Iroha 3 განთავსებებში შეიძლება გამოყენებულ იქნას ნებადართული ან NPoS მიზნების პროფილის მიხედვით.

## ხელს აწერეთ ტექნიკური მანიფესტი {#sign-the-manifest}

JSON-ის რედაქტირების და მოწმობის შემდეგ, დაიწერეთ იგი განთავსებადი `.nrt` ბლოკში:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` კითხულობს ბლოკჩეინის გენეზის საჯარო გასაღები ტექნიკური მანიფესტიდან და იყენებს კერძო გასაღებს მფლობელის მიერ განთავსებული, ერთი ბმულიანი რეგულარული ფაილიდან, რათა წარმოადგინოს განლაგებადი ხელმოწერილი ბლოკი ფაილს უნდა შეიცავდეს კანონიკური კერძო გასაღების მულტიჰეში, რომელსაც მოყვება ახალი ხაზი; Kagami უარყოფს სიმბოლურ ბმულებსა და რეჟიმებს, რომლებიც არ შეესაბამება `0600`. ნედლეული კერძო საკეტები არ არის მიღებული ბრძანების ხაზზე. შედეგად ის ფაილია, რომელიც ქსელის კვანძებმა თავიანთი კონფიგურაციიდან უნდა მოიხსენიონ.

## კონფიგურაცია `iroha3d` {#configure-iroha3d}

აჩვენეთ დეიმონს ხელმოწერილი ბლოკის გენეზისის ბლოკზე:

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

გენერატორის განხორციელებისა და ბრძანების დეტალებისათვის იხილეთ [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
