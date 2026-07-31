---
translation_locale: ka
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ოპერირება Iroha 3-ის მეშვეობით CLI {#operate-iroha-3-via-cli}

`iroha` ბინარი არის ბრძანების ხაზის კლიენტი Iroha 3. გამოიყენეთ იგი, რათა გამოკითხოთ რეგისტრაციის მდგომარეობა, წარადგინოთ ტრანზაქციები და შეამოწმოთ ოპერატორის საბოლოო პუნქტები.

## 1. წინასწარი პირობები {#_1-prerequisites}

პირველ რიგში დაიწყეთ ადგილობრივი ქსელი:

- [გაშვება Iroha 3](./launch-iroha.md)

ქვემოთ მოცემული მაგალითები წარმოადგენს კლიენტის კონფიგურაციას, რომელიც შექმნილია localnet-ისგან [Launch Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. ძირითადი CLI კონფიგურაცია {#_2-basic-cli-setup}

მაჩვენეთ უმაღლესი დონის დახმარება:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI არის ორგანიზებული შემდეგ უმაღლეს დონეზე მმართველი ჯგუფებად:

- `account` ანგარიშზე ორიენტირებული გასწორებისათვის
- `tx` ტრანზაქციის დონეზე დამხმარე პირებისთვის
- `ledger` ბუღალტრზე წაკითხვისა და წერისათვის
- `ops` ოპერატორის დიაგნოსტიკისთვის
- `app` აპლიკაციისთვის API დამხმარეებისთვის
- `contract` ხელშეკრულების განხორციელებისა და გამოწვევებისათვის
- `tools` დიაგნოსტიკური და დეველოპერული კომუნალური საშუალებებისათვის
- `taira` Taira და Nexus ორიენტირებული სამუშაო პროცესებისათვის

`ledger` ჯგუფში ასევე შედის დომენის სპეციფიკური ტრანზაქციების დამხმარეები, როგორიცაა `ledger transaction`.

გამოიყენეთ `--output-format text` ოპერატორის მიერ ადამიანისათვის წაკითხული გამონადენი და `--machine` მკაცრი ავტომატიზაციის რეჟიმისთვის.

## 3. შეამოწმეთ საჯარო Taira ტესტნეტი {#_3-try-the-public-taira-testnet}

თქვენ შეგიძლიათ სცადოთ მხოლოდ წაკითხვის Taira შემოწმება, სანამ აწარმოებთ ადგილობრივ თანატოლს ან შექმნით ხელმოწერას. ეს ბრძანებები იყენებენ საჯარო Torii JSON მარშრუტებს და არ ხარჯავენ ტესტნეტს XOR.

შეამოწმეთ Taira ჯანმრთელობა:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

საჯარო დომენების ჩამონათვალი `universal` მონაცემთა სივრცეში:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

ჩამოთვალეთ რამდენიმე აქტივების განსაზღვრა და მათი მიმდინარე მიწოდება:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

თუ თქვენ გაქვთ მიმდინარე `iroha` ბინარი, ჩართეთ Taira დიაგნოსტიკის დამხმარე:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

შეიქმნას `taira.client.toml` მხოლოდ მაშინ, როდესაც მზად ხართ გაეცნოთ ხელმოწერილი ბრძანებები. იხილეთ [SORA Nexus მონაცემთა პალატებთან დაკავშირება ](/ka/get-started/sora-nexus-dataspaces.md) კონფიგურაციისთვის, ონკანისა და კანარიის ნაკადისათვის. არ განახორციელოთ წერის ბრძანებები Taira-ის წინააღმდეგ სანამ ანგარიში არ დაფინანსდება ონკანის საფასურის აქტივით.

ნებისმიერი საფასურის გადახდისას Taira CLI მაგალითისთვის, შეინახეთ საბანქის დამხმარე ფუნქცია [შეიძინეთ Testnet XOR Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, შემდეგ კი მოითხოვეთ testnet XOR ჯერ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

თუ საპირფარეშო პაზლი ან სარჩელის მარშრუტი ბრუნდება `502`, დაელოდეთ და კიდევ ერთხელ შეეცადეთ. ეს არის საჯარო ტესტნეტის ხელმისაწვდომობის პრობლემა, არა სიგნალი ანგარიშის გასაღების რეგენერაციისათვის.

მას შემდეგ, რაც ბალანსი ჩანს, მიაწერეთ საფასურის აქტივის მეტადატატი და წერს:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. ძირითადი Ledger ბრძანებები {#_4-basic-ledger-commands}

ჩამოთვალეთ ყველა დომენი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციულ ალექსანდრე პლანერას; `ledger domain` ბრძანებას არ აქვს `register` ქვებრძანება. მომზადეთ საიდუმლოების გარეშე `AliasSetupPlanRequestV1` განზრახვა `docs.universal` თქვენი SDK ან გაერთიანების სერვისით, შემდეგ დაგეგმეთ და გამოიყენეთ იგი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

განზრახვის პინები მონაცემთა სივრცე ID, კანონიკური მფლობელის ანგარიში, იჯარის ვადები და მიმდინარე ციტატის დაცვა. გეგმადამცემი ადასტურებს ცოცხალ მდგომარეობას და უბრუნებს ზუსტ ატომურ `EnsureAlias` გეგმას წარსადგენად. არ გადაწეროთ სხვა ქსელიდან დაცვის მნიშვნელობები.

გადმოაგზავნეთ მარტივი პინგის ტრანზაქცია:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

წაიკითხეთ ბლოკი ახლახანს ან გამოიწერეთ ბლოკის მოვლენები:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. ოპერატორის ბრძანებები {#_5-operator-commands}

კონსენსუსის მდგომარეობა:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

პერფაზული ლატენციის სნაპტშოტი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

ხელმისაწვდომობა, კოლექტორი, RBC ჩამონათვალი და VRF სწრაფი სურათი:

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
- [Iroha ბინარებთან მუშაობა](/ka/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

სრული მარკდაუნის დახმარების სურათის რეგენერაციისთვის წყაროდან ამოღებული ჩანართი, გაუშვით:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
