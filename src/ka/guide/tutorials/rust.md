---
translation_locale: ka
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

სააგენტო Rust განხორციელება ცხოვრობს ძირითად სამუშაო სივრცეში და რჩება ყველაზე პირდაპირი
მუშაობის გზა Iroha 3 კოდის ბაზა.

## რა მიიღებთ {#what-you-get}

ამჟამად ზემოაღნიშნული რეპოზიტორიის მონაცემები ასახავს:

- დასახელება `iroha` Rust მომხმარებლის ყუთი
- დასახელება `iroha` CLI როგორც ყველაზე სრულყოფილი სათაური კლიენტი
- საერთო მონაცემთა მოდელი, კრიპტო და Norito კოლოფები, რომლებიც გამოიყენება SDK ფენა

## რეკომენდებული საწყისი ადგილი {#recommended-starting-point}

პროექტის ამჟამინდელი მდგომარეობის შესახებ, დაიწყეთ რეფერენციით CLI და
სამუშაო სივრცე თავად:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

ჩართეთ რეფერენციური კლიენტი ჩანახული დეფოლტური კლიენტის კონფიგურაციით:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## სცადე. Taira მხოლოდ წაკითხვა {#try-taira-read-only}

ამავე სამუშაო სივრცედან, შეეცადეთ საზოგადოებას Taira დიაგნოსტიკის დამხმარე:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

რუტის დონეზე შემოწმებისათვის გამოიყენეთ Torii ეს არის JSON API პირდაპირ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

როცა შენ შექმნი `taira.client.toml`, იგივე ბინარი შეუძლია გაუშვას ხელმოწერილი კანარი
ბრძანებები წინააღმდეგ Taira. შეინახეთ ისინი ცალკე ჩვეულებრივი ერთეული ტესტებისგან, რადგან
ისინი მოითხოვენ საბანქის ფინანსური ანგარიშს და პირდაპირი ტესტნეტის ხელმისაწვდომობას.

## გამოყენებით Rust მომხმარებლის კარადა {#using-the-rust-client-crate}

დაწკაპეთ Iroha თქვენი ქსელის მიერ გამოყენებული Git რევიზიონი:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

თუ თქვენ გჭირდებათ ყველაზე სრულყოფილი მაგალითები, თუ როგორ Rust ზედაპირები გამოიყენება
პრაქტიკა, ინსპექტირება:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

საფინანსო ანგარიშსწორების სამუშაო პროცესები, იხილეთ
[ნაციონალური აქტივების გადახდა](/ka/blockchain/escrow.md#rust-sdk). სააგენტო Rust მონაცემთა მოდელი
ამჟამად აქვს ყველაზე სრულყოფილი ტიპირებული დაფარვა ბაზრის საფინანსო ფასი, ზოგადი
ქონების ჩაკეტვა, ანონიმური საფარდებელი, გამოკითხვები და მოვლენები.

შეგიძლიათ რეგენერაცია ადგილობრივი CLI სასარგებლო სურათი:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## შენიშვნები {#notes}

- სააგენტო CLI ამჟამად უკეთეს დაფარვას იძლევა, ვიდრე დამოუკიდებელი ყუთის დოკუმენტები.
- ოპერატორის ტიპის ნაკადებისათვის, CLI დოკუმენტაცია არის ყველაზე აქტუალური წყარო.
