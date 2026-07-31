---
translation_locale: ka
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კრიპტოგრაფიული გასაღების გენერაცია {#generating-cryptographic-keys}

გამოიყენეთ `kagami keys` კლიენტის, პარტნიორის და ვალიდატორის საკვანძო მასალის შესაქმნელად Iroha 3.

## ძირითადი გამოყენება {#basic-usage}

Iroha წყაროს გადახდისგან:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON გამომუშავება, როგორც წესი, ყველაზე ადვილია TOML ან ავტომატიზაციაში ჩაწეროს:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ბრძანება იბეჭდება საჯარო გასაღები და გამოფენილი კერძო გასაღები. განიხილეთ პირადი გასაღები, როგორც საიდუმლო მასალა; არ ჩართოთ გენერირებული წარმოების გასაღებები.

## ალგორითმები {#algorithms}

საერთო ალგორითმები არიან:

- `ed25519` კლიენტების ანგარიშებისთვის, სტრიმინგის იდენტობისთვის და განვითარების ქსელების უმეტესობისთვის.
- `secp256k1` როდესაც თქვენ გჭირდებათ secp256k1 ანგარიშის ვინაობა.
- `bls_normal` დამტკიცების კონსენსუსის გასაღებისთვის, როდესაც შენაძენი საშუალებას იძლევა BLS მხარდაჭერას.

შეამოწმეთ ზუსტი ალგორითმები, რომლებიც მხარდაჭერილნი არიან თქვენი მშენებლობით:

```bash
cargo run --bin kagami -- keys --help
```

## დეტერმინისტური განვითარების გასაღები {#deterministic-development-keys}

რეპროდუქციული მოწყობილობებისათვის, გადაიტანეთ თესლი:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

ნაყოფი არის კერძო გასაღები მასალა. გამოიყენეთ ისინი მხოლოდ ადგილობრივი განვითარებისა და ტესტებისათვის.

## BLS საფლავის მტკიცებულება {#bls-proofs-of-possession}

NPoS და Nexus დამტკიცების პროფილისთვის საჭიროა BLS დამტკიცების გასაღები და PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON მოიცავს `pop_hex`, როდესაც გამოიყენება `--pop`. გამოიყენეთ ეს მნიშვნელობა წარმოქმნილი ტოპოლოგიის ან პროფილის მიერ მოთხოვნილი `trusted_peers_pop` მითითებით.

## გამოშვების ფორმატები {#output-formats}

ტერმინალის ინსპექტირებისთვის გამოიყენეთ გათვალისწინებული გამოსავალი `--json` ავტომატიზაციისთვის და `--compact` მაშინ, როდესაც სხვა სცენარს სჭირდება უბრალო ხაზზე ორიენტირებული მნიშვნელობები:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

სრულად წარმოქმნილი Kagami დახმარებისათვის:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
