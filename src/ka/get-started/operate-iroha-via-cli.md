---
translation_locale: ka
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ოპერირება Iroha 3-ის მეშვეობით CLI {#operate-iroha-3-via-cli}

`iroha` ბინარული ფაილი Iroha 3-ის ბრძანების ხაზის კლიენტია. გამოიყენეთ რეესტრის მდგომარეობის მოსათხოვნად, ტრანზაქციების გასაგზავნად და ოპერატორის ბოლო წერტილების შესამოწმებლად.

## 1. წინასწარი პირობები {#_1-prerequisites}

Iroha-ს წყაროს კოდის ასლიდან, დოკუმენტირებულ რევიზიაზე, დააგენერირეთ და გაუშვით ოთხკვანძიანი ლოკალური ქსელი:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

ქვემოთ მოცემული მაგალითები იყენებს მის მიერ გენერირებულ კლიენტის კონფიგურაციას, `./localnet/client.toml`.

## 2. ძირითადი CLI კონფიგურაცია {#_2-basic-cli-setup}

მაჩვენეთ უმაღლესი დონის დახმარება:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI არის ორგანიზებული შემდეგ უმაღლეს დონეზე მმართველი ჯგუფებად:

- `account` — ანგარიშების წასაკითხად და შესაცვლელად
- `explorer` — საერთო ფილტრებისა და გვერდებად დაყოფის მქონე მიმომხილველის ნაკადებისთვის
- `tx` — ტრანზაქციის მდგომარეობისა და დამხმარე ოპერაციებისთვის
- `ledger` ბლოკჩეინის რეესტრზე კითხულობს და წერს
- `trigger` — ტრიგერების წასაკითხად, ჩასაწერად და შესასრულებლად
- `ops` ოპერატორის დიაგნოსტიკისთვის
- `app` აპლიკაციისთვის API დამხმარეებისთვის
- `contract` — კონტრაქტის გამოძახებებისთვის, ხედებისა და ლოკალური გამართვისთვის; განათავსეთ `kagami contract deploy` ან `musubi deploy`-ით
- `tools` დიაგნოსტიკური და დეველოპერული კომუნალური საშუალებებისათვის
- `dataspace` — მონაცემთა სივრცის განსაზღვრების დასაგეგმად, გამოსაყენებლად და შესამოწმებლად
- `taira` — Taira დიაგნოსტიკისა და ანგარიშის ჩართვისთვის
- `offline` — ოფლაინ კოდირებისთვის, ანგარიშებისა და დიაგნოსტიკისთვის
- `soracloud` — Soracloud აპლიკაციის პლატფორმის დამხმარე საშუალებებისთვის
- `sccp` — SORA ჯაჭვთაშორისი პროტოკოლის წაკითხვის, გადარიცხვისა და მტკიცებულებებისთვის

ტრანზაქციის გამგზავნ ყოველ ბრძანებას სჭირდება აშკარად მითითებული საკომისიოს გადამხდელი, მაგალითად `--fee-payer authority`; CLI ხელმოწერამდე ზუსტ საკომისიოს ითვლის.

გამოიყენეთ `--output-format text` ოპერატორის მიერ ადამიანისათვის წაკითხული გამონადენი და `--machine` მკაცრი ავტომატიზაციის რეჟიმისთვის.

## 3. შეამოწმეთ საჯარო Taira ტესტნეტი {#_3-try-the-public-taira-testnet}

თქვენ შეგიძლიათ სცადოთ მხოლოდ წაკითხვის Taira შემოწმება ადგილობრივი ქსელის პარის ჩატარებამდე ან კრიპტოგრაფიული ხელმოწერის შექმნამდე. ეს ბრძანებები იყენებენ საჯარო Torii JSON მარშრუტებს და არ ხარჯავენ ტესტნეტს XOR.

შეამოწმეთ Taira სტატუსი:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

ჩამოთვალეთ დომენები, რომლებიც ხილულია არაავთენტიფიცირებული მკითხველისთვის:

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

`taira.client.toml` შექმენით მხოლოდ მაშინ, როცა ხელმოწერილი ბრძანებების შესამოწმებლად მზად ხართ. კონფიგურაციის, სატესტო ტოკენების მიღებისა და საწყისი შემოწმების პროცესისთვის იხილეთ [SORA Nexus-ის მონაცემთა სივრცეებთან დაკავშირება](/ka/get-started/sora-nexus-dataspaces.md). Taira-ზე ჩაწერის ბრძანებები არ გაუშვათ, სანამ ანგარიში სატესტო გამცემი სერვისიდან საკომისიო აქტივით არ დაფინანსდება.

Taira CLI-ის საკომისიოს მქონე ნებისმიერი მაგალითისთვის დააფინანსეთ ხელმომწერი გვერდზე [სატესტო XOR-ის მიღება Taira-ზე](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) აღწერილი მომზადების ეტაპიანი პროცესით, შემდეგ შეამოწმეთ ბალანსი:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

თუ სატესტო ტოკენების გამცემი მარშრუტი `502`-ს აბრუნებს, მოიცადეთ და ხელახლა სცადეთ. ეს საჯარო სატესტო ქსელის ხელმისაწვდომობის პრობლემაა და არა ანგარიშის გასაღებების ხელახლა გენერირების მიზეზი.

ბალანსის გამოჩენის შემდეგ ჩაწერები გაგზავნეთ `--fee-payer authority`-ით. CLI ხელმოწერამდე ზუსტ საკომისიოს Taira-ს საკომისიო აქტივში ითვლის:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. საბაზისო ბლოკჩეინის რეესტრი ბრძანებები {#_4-basic-ledger-commands}

ჩამოთვალეთ ყველა დომენი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციულ ალიასი პლანერას; `ledger domain` ბრძანებას არ აქვს `register` ქვებრძანება. მომზადეთ ალიასური `AliasSetupPlanRequestV1` განზრახვა `docs.universal` თქვენი SDK ან ინბორდინგის სერვისით, შემდეგ დაგეგმეთ და გამოიყენეთ იგი:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

განზრახვა აფიქსირებს მონაცემთა სივრცის ID-ს, კანონიკურ მფლობელ ანგარიშს, იჯარის ვადასა და მიმდინარე ფასის შემოწმების პირობას. დამგეგმავი მოქმედ მდგომარეობას ამოწმებს და დასაგზავნ ზუსტ ატომურ `EnsureAlias` გეგმას აბრუნებს. შემოწმების პირობების მნიშვნელობები სხვა ქსელიდან ხელით არ გადმოიტანოთ.

გადმოაგზავნეთ მარტივი პინგის ტრანზაქცია:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

წაიკითხეთ ბლოკი ახლახანს ან გამოიწერეთ ბლოკის მოვლენები:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. ოპერატორის ბრძანებები {#_5-operator-commands}

კონსენსუსის ოპერატორის ბრძანებებს დაშვებულ სიაში შეტანილი, შესრულების დროის გასაღები სჭირდება. ის `client.toml`-ში არ შეინახოთ; მხოლოდ მფლობელისთვის ხელმისაწვდომი ფაილი აბსოლუტური გზით გადასცით:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

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

დამტკიცებული კონსენსუსის არხები და ამ კვანძის ინსტანციის მდგომარეობა:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
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
- [Torii ბოლო წერტილები](/ka/reference/torii-endpoints.md)
- [Iroha ბინარებთან მუშაობა](/ka/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

კოდის სამუშაო ასლიდან სრული Markdown დახმარების ასლის დასაბეჭდად გაუშვით:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
