---
translation_locale: ka
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ოპერირება Iroha 3-ის მეშვეობით CLI {#operate-iroha-3-via-cli}

`iroha` ბინარი არის ბრძანების ხაზის კლიენტი Iroha 3. გამოიყენეთ იგი, რათა გამოკითხოთ ბლოკჩეინის რეესტრი- ის მდგომარეობა, წარადგინოთ ტრანზაქციები და შეამოწმოთ ოპერატორის ბოლო წერტილები API.

## 1. წინასწარი პირობები {#_1-prerequisites}

პირველ რიგში დაიწყეთ ადგილობრივი ქსელი:

- [გაშვება Iroha 3](./launch-iroha.md)

ქვემოთ მოცემული მაგალითები წარმოადგენს კლიენტის კონფიგურაციას, რომელიც შეიქმნა [გაშვება Iroha 3](./launch-iroha.md) -ში შექმნილი ლოკალურ ქსელიდან:

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
- `ledger` ბლოკჩეინის რეესტრზე კითხულობს და წერს
- `ops` ოპერატორის დიაგნოსტიკისთვის
- `app` აპლიკაციისთვის API დამხმარეებისთვის
- `contract` ხელშეკრულების განხორციელებისა და ტექნიკური ინვოკაციებისთვის.
- `tools` დიაგნოსტიკური და დეველოპერული კომუნალური საშუალებებისათვის
- `taira` Taira და Nexus ორიენტირებული სამუშაო პროცესებისათვის

`ledger` ჯგუფში ასევე შედის დომენის სპეციფიკური ტრანზაქციების დამხმარეები, როგორიცაა `ledger transaction`.

გამოიყენეთ `--output-format text` ოპერატორის მიერ ადამიანისათვის წაკითხული გამონადენი და `--machine` მკაცრი ავტომატიზაციის რეჟიმისთვის.

## 3. შეამოწმეთ საჯარო Taira ტესტნეტი {#_3-try-the-public-taira-testnet}

თქვენ შეგიძლიათ სცადოთ მხოლოდ წაკითხვის Taira შემოწმება ადგილობრივი ქსელის პარის ჩატარებამდე ან კრიპტოგრაფიული ხელმოწერის შექმნამდე. ეს ბრძანებები იყენებენ საჯარო Torii JSON მარშრუტებს და არ ხარჯავენ ტესტნეტს XOR.

შეამოწმეთ Taira სტატუსი:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
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

`taira.client.toml` მხოლოდ ხელმოწერილი ბრძანებების გამოსაცდელად შექმენით. კონფიგურაციის, ტესტური მონეტების გამცემისა და კანარის ნაკადისთვის იხილეთ [SORA Nexus-ის მონაცემთა სივრცეებთან დაკავშირება](/ka/get-started/sora-nexus-dataspaces.md). სანამ გამცემი ანგარიშს საკომისიო აქტივით არ დააფინანსებს, Taira-ზე ჩაწერის ბრძანებები არ გაუშვათ.

ნებისმიერი საფასურის გადახდისას Taira CLI მაგალითისთვის, შეინახეთ ტესტური მონეტების გამცემის დამხმარე [ტესტნეტს XOR დაუკავშირდით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, შემდეგ კი მოითხოვეთ ტესტის ქსელი XOR ჯერ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

თუ ტესტური მონეტების გამცემის თავსატეხი ან სარჩელის მარშრუტი `502` დაბრუნდება, ელოდეთ და კიდევ ერთხელ შეეცადეთ. ეს არის საჯარო ტესტნეტის ხელმისაწვდომობის საკითხი, არ არის სიგნალი ანგარიშის გასაღებების რეგენერაციისათვის.

მას შემდეგ, რაც ბალანსი ჩანს, მიაწერეთ საფასურის აქტივის მეტადატატი და წერს:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. საბაზისო ბლოკჩეინის რეესტრი ბრძანებები {#_4-basic-ledger-commands}

ჩამოთვალეთ ყველა დომენი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციულ ალიასი პლანერას; `ledger domain` ბრძანებას არ აქვს `register` ქვებრძანება. მომზადეთ ალიასური `AliasSetupPlanRequestV1` განზრახვა `docs.universal` თქვენი SDK ან ინბორდინგის სერვისით, შემდეგ დაგეგმეთ და გამოიყენეთ იგი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

განზრახვა ამაგრებს მონაცემთა სივრცე ID, კანონიკური მფლობელის ანგარიში, იჯარის ვადით და მიმდინარე საფასური-საკმაყოფილო ფასები დაცვა. დაგეგმავი ადასტურებს ცოცხალი მდგომარეობა და დაბრუნდება ზუსტი ატომური `EnsureAlias` გეგმა წარადგინოს. არ ხელით ასლი დაცვის მნიშვნელობები სხვა ქსელიდან.

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

კონსენსუსის ოპერატორის ბრძანებებს სჭირდება ნებადართული შესრულების გარემოს გასაღები. შეინახეთ იგი `client.toml` და გადაიტანეთ ფაილი მხოლოდ მფლობელისთვის:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

არა ავტორიტეტული რიგები, დამუშავების კონვეიერები, არჩევნების და შესრულების სფეროს დიაგნოსტიკა:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

ყველაზე მაღალი და ჩაკეტილი კონსენსუსის კვორუმის სერტიფიკატები:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
```

ქსელზე კონსენსუსის პარამეტრები:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. სად წავიდეთ შემდეგ? {#_6-where-to-go-next}

- [SDK მასწავლებლები](/ka/guide/tutorials/)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
- [Iroha ბინარებთან მუშაობა](/ka/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

წყაროს კოდის სამუშაო ასლიდან Markdown დახმარების სრული სურათის თავიდან შესაქმნელად გაუშვით:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
