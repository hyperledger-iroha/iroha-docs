---
translation_locale: ka
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კრიპტოგრაფიული გასაღები {#generating-cryptographic-keys}

გამოყენება `kagami keys` მომხმარებლის, თანასწორობისა და დამტკიცების საკვანძო მასალის წარმოქმნა
Iroha 3.

## ძირითადი გამოყენება {#basic-usage}

სააგენტოდან Iroha წყაროდან გადახდის ვადა:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON გამონადენი, როგორც წესი, ყველაზე ადვილია ჩაწეროს TOML ან ავტომატიზაცია:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

კაპიტალმა წამოიღო საჯარო გასაღები და გამოფენილი პირადი გასაღები.
საიდუმლო მასალად; არ აიღოს წარმოებული საწარმოო გასაღები.

## ალგორითმები {#algorithms}

საერთო ალგორითმები:

- `ed25519` კლიენტის ანგარიშებისთვის, სტრიმინგის იდენტობისთვის და უმეტეს განვითარებისათვის
  ქსელები.
- `secp256k1` როდესაც სეკპ256K1 ანგარიშის იდენტობა გჭირდებათ.
- `bls_normal` დამტკიცების კონსენსუსის გასაღები, როდესაც build- ის საშუალებას აძლევს BLS მხარდაჭერა

შეამოწმეთ ზუსტი ალგორითმები, რომლებიც მხარდაჭერილნი არიან თქვენი მშენებლობით:

```bash
cargo run --bin kagami -- keys --help
```

## დეტერმინისტური განვითარების გასაღები {#deterministic-development-keys}

რეპროდუქციული მოწყობილობებისათვის, გადაიტანეთ თესლი:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

ჟვდაა კერძო საკვანძო მასალა. გამოიყენეთ ისინი მხოლოდ ადგილობრივი განვითარებისა და ტესტებისათვის.

## BLS ქონების მტკიცებულებები {#bls-proofs-of-possession}

NPOS და Nexus დამტკიცების პროფილის მოთხოვნა BLS დამტკიცების გასაღები და PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

სააგენტო JSON მოიცავს `pop_hex` როდესაც `--pop` გამოიყენეთ ეს მნიშვნელობა
წარმოქმნილი ტოპოლოგია ან `trusted_peers_pop` პროფილის მიერ მოთხოვნილი მითითებები.

## გამოსავალი ფორმატები {#output-formats}

გამოიყენეთ გამონაკლისი გამოსავალი ტერმინალის ინსპექტირებისთვის, `--json` ავტომატიზაციისათვის და
`--compact` როდესაც სხვა სცენარს სჭირდება უბრალო ხაზზე ორიენტირებული მნიშვნელობები:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

სრული წარმოებისათვის Kagami დახმარება:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
