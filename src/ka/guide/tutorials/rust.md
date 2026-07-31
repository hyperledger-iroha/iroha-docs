---
translation_locale: ka
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust დანერგვა ცხოვრობს ძირითად სამუშაო სივრცეში და რჩება ყველაზე პირდაპირი გზა Iroha 3 კოდის ბაზასთან მუშაობისთვის.

## რა მიიღებთ {#what-you-get}

ამჟამად, ზემოაღნიშნული რეპოზიტორიის მონაცემებით:

- `iroha` Rust კლიენტის ყუთი
- `iroha` CLI როგორც ყველაზე სრულყოფილი რეფერენციური კლიენტი
- გაზიარებული მონაცემთა მოდელი, კრიპტო და Norito ყუთები, რომლებიც გამოიყენება SDK ფენის მიერ

## რეკომენდებული საწყისი წერტილი {#recommended-starting-point}

პროექტის ამჟამინდელი მდგომარეობისთვის, დაიწყეთ რეფერენციით CLI და თვით სამუშაო სივრცე:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

განახორციელეთ რეფერენციური კლიენტი ჩანთებული შეტყობინებით კლიენტის კონფიგურაციით:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## შეეცადეთ Taira მხოლოდ წაკითხვა {#try-taira-read-only}

ამავე სამუშაო სივრცედან, სცადეთ საჯარო დიაგნოსტიკის დამხმარე Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

მარშრუტის დონეზე შემოწმებისას გამოიყენეთ Torii JSON API პირდაპირ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

მას შემდეგ, რაც თქვენ შექმნით `taira.client.toml`, იმავე ბინარს შეუძლია გაუშვას ხელმოწერილი კანარი ბრძანებები Taira. შეინახეთ ისინი ცალკე ჩვეულებრივი ერთეული ტესტებისგან, რადგან მათ სჭირდებათ საბანკო ფინანსური ანგარიში და პირდაპირი ტესტნეტის ხელმისაწვდომობა.

## Rust კლიენტის ყუთის გამოყენებით {#using-the-rust-client-crate}

დააჭირეთ Iroha Git რევიზია, რომელიც გამოიყენება თქვენს ქსელში:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

თუ თქვენ გჭირდებათ ყველაზე სრულყოფილი მაგალითები, თუ როგორ გამოიყენება Rust ზედაპირები პრაქტიკაში, შეამოწმეთ:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

მთავარ წიგნში მართული საფინანსო სამუშაო პროცესების შესახებ იხილეთ [Native Asset Escrow](/ka/blockchain/escrow.md#rust-sdk). მონაცემთა მოდელს Rust ამჟამად აქვს ყველაზე სრულყოფილი ტიპური დაფარვა ბაზრის საფინანსოსთვის, ზოგადი აქტივების საკეტებისთვის, ანონიმურ საფინანსოში, გამოკითხვებსა და მოვლენებზე.

თქვენ შეგიძლიათ რეგენერაცია ადგილობრივი CLI დახმარების snapshot ერთად:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## შენიშვნები {#notes}

- CLI ამჟამად უკეთეს დაფარვას იძლევა, ვიდრე დამოუკიდებელი ყუთის დოკუმენტები.
- ოპერატორის სტილის ნაკადებისათვის, CLI დოკუმენტაცია ყველაზე აქტუალური წყაროა.
