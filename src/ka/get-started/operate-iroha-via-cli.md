---
translation_locale: ka
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ოპერირება Iroha 3 მეშვეობით CLI {#operate-iroha-3-via-cli}

სააგენტო `iroha` binary არის ბრძანების ხაზის კლიენტი Iroha 3. გამოიყენეთ იგი შეკითხვა
რეგისტრაციის ანგარიში, ტრანზაქციების წარდგენა და ოპერატორის საბოლოო წერტილების ინსპექტირება.

## 1. წინაპირობები {#_1-prerequisites}

პირველი დაიწყეთ ადგილობრივი ქსელი:

- [გაშვება Iroha 3](./launch-iroha.md)

ქვემოთ მოცემული მაგალითები ითვალისწინებს კლიენტის კონფიგურაციას, რომელიც გენერირებულია ადგილობრივი ქსელიდან
შეიქმნა [გაშვება Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. ძირითადი CLI დაყენება {#_2-basic-cli-setup}

ნაოპაგთ ოპვრთნარაჲ ოჲეაპა:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

სააგენტო CLI ორგანიზებულია ამ უმაღლესი დონის ბრძანების ჯგუფებად:

- `account` ანგარიშზე ორიენტირებული გასწორებებისათვის
- `tx` ტრანზაქციის დონეზე დამხმარე პირებისთვის
- `ledger` წაკითხვა და წერა
- `ops` ოპერატორის დიაგნოსტიკისთვის
- `app` აპლიკაციისთვის API დამხმარეები
- `contract` ხელშეკრულების განთავსებისა და გამოწვევებისათვის
- `tools` დიაგნოსტიკისა და დეველოპერული კომუნალური საშუალებებისათვის
- `taira` სამედიცინო Taira და Nexus- ორიენტირებული სამუშაო პროცესები

სააგენტო `ledger` ჯგუფი ასევე შეიცავს დომენის სპეციფიკური ტრანზაქციის დამხმარეებს, როგორიცაა
`ledger transaction`.

გამოყენება `--output-format text` ადამიანის მიერ წაკითხული ოპერატორის გამონადენი და `--machine`
მკაცრი ავტომატიზაციის რეჟიმისთვის.

## 3. სცადე საზოგადოება Taira სატესტო ქსელი {#_3-try-the-public-taira-testnet}

შეგიძლიათ სცადოთ მხოლოდ კითხვა. Taira შემოწმება ადგილობრივი თანასწორობის განხორციელებამდე ან შექმნის წინ
ამ ბრძანებებს იყენებენ საჯარო Torii JSON მარშრუტები და არ ხარჯავს testnet
XOR.

შეამოწმეთ Taira ჯანმრთელობა:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

საჯარო დომენების ჩამონათვალი `universal` მონაცემთა სივრცე:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

ჩამოთვალეთ რამდენიმე აქტივის განსაზღვრა და მათი მიმდინარე მიწოდება:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

თუ თქვენ გაქვთ მიმდინარე `iroha` ბინარული, გაუშვით Taira დიაგნოსტიკის დამხმარე:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

შექმნა `taira.client.toml` მხოლოდ მაშინ, როდესაც მზად ხართ გაეცნოთ ხელმოწერილი ბრძანებებს.
იხილეთ [შეხება SORA Nexus მონაცემთა ბაზები](/ka/get-started/sora-nexus-dataspaces.md)
კონფიგ, ნაჟავი და კანარიული ნაკადი. არ გაქცევა წერა ბრძანებები წინააღმდეგ
Taira მანამ, სანამ ანგარიში არ დაფინანსდება საბანქის გადასახადის აქტივით.

ნებისმიერი საფასურის გადახდისათვის Taira CLI მაგალითად, გადაარჩინეთ ქვაბის დამხმარე
[მიიღეთ Testnet XOR დაწვრილებით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
როგორც `taira_faucet_claim.py`, შემდეგ სარჩელის სატესტო ქსელი XOR პირველი:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

თუ საბაგირო საიდუმლო ან პრეტენზიის მარშრუტი დაბრუნდება `502`, ველოდოთ და კიდევ ერთხელ სცადეთ. ეს არის
საჯარო ტესტნეტის ხელმისაწვდომობის საკითხი, არ არის სიგნალი ანგარიშის გასაღების რეგენერაციისთვის.

მას შემდეგ, რაც ბალანსი ჩანს, მიაწერეთ საფასურის აქტივის მეტადატები და წერს:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. საბაზისო Ledger ბრძანებები {#_4-basic-ledger-commands}

ყველა დომენის ჩამონათვალი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციურ alias დაგეგმვა; `ledger
domain` ბრძანება არ აქვს `register` ჟჲბჲპაპთრვ.
`AliasSetupPlanRequestV1` განზრახვა `docs.universal` თქვენი SDK ან
დაწყების სერვისი, შემდეგ დაგეგმილი და გამოყენებული:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

განზრახვამ დამახინჯა მონაცემთა სივრცე ID, კანონიკური მფლობელის ანგარიში, იჯარის ვადა და
ამჟამინდელი ციტატის დაცვა. დამგეგმელი ადასტურებს რეალურ მდგომარეობას და ბრუნდება ზუსტი
ატომური `EnsureAlias` არ გადააქციოთ ხელით დაცვის ღირებულებები სხვაგან
ქსელი.

გადმოგზავნეთ მარტივი პინგის ტრანზაქცია:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

წაიკითხეთ ბოლო ბლოკი ან გამოიწერეთ ბლოკის მოვლენები:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. ოპერატორის ბრძანებები {#_5-operator-commands}

კონსენსუსის სტატუსი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

პერფაზული ლატენციის სნაპტშოტი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

ხელმისაწვდომობა, კოლექციონერი, RBC დაწესებულება; VRF გადაღება:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

ქსელზე კონსენსუსის პარამეტრები:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. სად წავიდეთ შემდეგ? {#_6-where-to-go-next}

- [SDK მასწავლებლები](/ka/guide/tutorials/)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md)
- [მუშაობა Iroha ბინარი](/ka/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

სრული მარკდაუნის დახმარების სურათის რეგენერაციისთვის წყაროდან გადახდის დროს, გაუშვით:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
