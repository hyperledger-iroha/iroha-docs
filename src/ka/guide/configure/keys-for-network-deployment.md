---
translation_locale: ka
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ქსელის განთავსების გასაღები {#keys-for-network-deployment}

თითოეულ ქსელს სჭირდება კლიენტებისთვის, თანატოლებისათვის, გენეზის ხელმოწერისთვის და NPoS ან Nexus პროფილისთვის BLS ვალიდატორის იდენტობისთვის განსხვავებული საკვანძო მასალა.

## სადაც გამოიყენება გასაღები {#where-keys-are-used}

- მომხმარებლის ხელმოწერის გასაღები ინახება `client.toml` ქვეშ `[account]`.
- პარტნიორის იდენტობის გასაღები ინახება თითოეულ პარტნიორში `config.toml` როგორც `public_key` და `private_key`.
- პარტნიორების აღმოჩენა თითოეული პარტნიორის საჯარო გასაღების გამოყენებით `trusted_peers`.
- BLS ვალიდატორი NPoS-ის პროფილებისათვის საფლავის მტკიცებულებები შენახულია `trusted_peers_pop` -ში.
- გენეზიის ხელმოწერა იყენებს `[genesis].public_key` პარტნიორული კონფიგურაციაში და შესაბამისი პირადი გასაღები მანიფესტის ხელმოწერას.

ადგილობრივი ან ტესტის განთავსებისათვის, Kagami უნდა შექმნას ყველა ეს ფაილი ერთად:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

არსებული ქსელის ან პროფილისთვის, გამოიყენეთ გაიდებული ნაკადი:

```bash
cargo run --bin kagami -- wizard
```

## გენერირება ინდივიდუალური საკვანძო წყვილი {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## თანატოლების თანმიმდევრობა {#peer-consistency}

ყველა ვალიდატორმა უნდა შეთანხმდეს იმავე გენეზიის ტრანზაქციაზე, ტოპოლოგიაზე, საიმედო პერ-პუბლიკურ საკვებზე და ვალიდატორი PoPs. ერთი დაკარგული ან არათანაბარი პერ-კვავი შეიძლება ხელი შეუშალოს ქსელს დაიწყოს ან მიაღწიოს კონსენსუსს.

მინიმალური ბიზანტიური შეცდომების ტოლერანტული განთავსებისთვის, გამოიყენეთ მინიმუმ ოთხი თანატოლე. თითოეულ თანატოლს უნდა ჰქონდეს საკუთარი პირადი გასაღები, მაგრამ ყველა თანატოლის კონფიგურაციას სჭირდება იგივე სანდო თანატოლების ნაკრები.

## კლიენტთა ანგარიშები {#client-accounts}

კლიენტის ანგარიში `client.toml` უკვე უნდა არსებობდეს ჯაჭვზე. ის შეიძლება დარეგისტრირდეს გენეზის მანიფესტით ან მოგვიანებით ტრანზაქციით. ერიდეთ გამოყენებას გენეზიის ხელმოწერა იდენტობა, როგორც ხანგრძლივი აპლიკაციის ანგარიში; გენეზის პრივილეგიები მხოლოდ გენეზიის რაუნდის დროს ვრცელდება და წარმოების კლიენტებმა უნდა გამოიყენონ საკუთარი ანგარიშები და როლები.
