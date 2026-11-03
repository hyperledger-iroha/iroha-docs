---
translation_locale: ka
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# გაერთიანება Taira {#connect-to-taira}

## შედეგები {#outcome}

დაადასტურეთ, რომ Taira ხელმისაწვდომია, გამოიყვანეთ კანონიკური ანგარიშის ID I105 ადგილობრივი კლიენტის კონფიგურაციიდან, დააფინანსეთ კრიპტოგრაფიული ხელმომწერი ტესტნეტით XOR და წარადგინეთ ერთი საფასურის კოტირებული კანარიური ტრანზაქცია. ეს რეცეპტი არასდროს გამოგზავნის წერილს Minamoto.

## წინაპირობები {#prerequisites}

- `curl`,`jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` და `kagami` ბინარები.
- `taira.client.toml`, რომელიც შექმნილია Taira-ს ჯაჭვით, ზუსტი `network_id`-ით, API-ის საბოლოო წერტილით, ანგარიშის პროფილით და სპეციალური ტესტნეტის გასაღებით. მიჰყევით ინსტრუქციას [Taira კლიენტის კონფიგურაციის შექმნა](/ka/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) და ფაილი ვერსიების კონტროლის სისტემის გარეთ შეინახეთ.
- ჩაწერადი სამუშაო დირექტორია გამცემის ჟურნალისთვის: `iroha taira account faucet prepare` ქმნის `./taira-faucet`-ს მხოლოდ მფლობელისთვის ხელმისაწვდომი უფლებებით და უარს ამბობს არსებული დირექტორიის ჩანაცვლებაზე.

## ნაბიჯები {#steps}

### 1. ცალკე სიცოცხლისუნარიანობა და მზადყოფნა {#_1-separate-liveness-from-readiness}

`/livez`, `/health` და `/readyz` უბრალო ტექსტით მპასუხე შემოწმებებია; `/status` JSON-ს აბრუნებს. მომუშავე კვანძს შეუძლია სრულიად კანონზომიერად დააბრუნოს `503` `/readyz`-დან, როდესაც კონსენსუსში დაშვება ან სხვა აუცილებელი ქვესისტემა მიუწვდომელია.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` გამოიყენეთ მხოლოდ იმის დასადგენად, პასუხობს თუ არა პროცესი. ტრაფიკის დასაშვებად გამოიყენეთ `/readyz`. მისი `503` არის `service_unavailable` შეცდომის კონვერტი ბლოკერის დეტალების გარეშე, ამიტომ, სანამ მას გათიშვად მიიჩნევთ, გაუშვით ქვემოთ მოცემული დიაგნოსტიკა.

### 2. საზოგადოებრივი დიაგნოსტიკის ჩატარება {#_2-run-the-public-diagnostics}

ეს შემოწმება არის მხოლოდ წაკითხვა და არ ატვირთავს კრიპტოგრაფიული ხელმოწერის კონფიგურაციას:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

არ გააგრძელოთ წერა, როდესაც ექიმი იუწყება მკაცრი DNS, TLS, ჯაჭვის ან API საბოლოო წერტილის უკმარისობა. შეჯერებული საჯარო რიგები გარდამავალია; დაელოდეთ და კიდევ ერთხელ სცადეთ შეზღუდული პოლიტიკით.

### 3. გამოიღეთ Taira ანგარიშის ID საიდუმლოების დაბეჭდვის გარეშე {#_3-derive-the-taira-account-id-without-printing-a-secret}

კონფიგურაციიდან წაიკითხეთ მხოლოდ საჯარო გასაღები, შემდეგ კი დააკოდირეთ ის Taira-ს I105 პროფილით. ანგარიშის ID დომენს არ შეიცავს; `[account].profile` მხოლოდ მის ქსელის პრეფიქსს ირჩევს.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

გამოშვება არის დომენის გარეშე კანონიკური I105 მისამართი. სახელები, როგორიცაა `wallet@payments.universal`, არის ალიასები და უნდა გადაწყდეს სანამ ისინი გამოიყენება მკაცრი ანგარიშის ველებში.

### 4. მოითხოვეთ მიმდინარე Taira საფასურის აქტივი {#_4-claim-the-current-taira-fee-asset}

გამცემის პოლიტიკა ასახელებს საფასურის აქტივის მიმდინარე განსაზღვრებას. შეინარჩუნეთ მისი Base58 ID, ნაცვლად იმისა, რომ ID სხვა ქსელიდან ან ძველი გაშვებიდან დააკოპიროთ. პოლიტიკა ხელმოუწერელი აღმოჩენის მონაცემებია, ამიტომ ავტომატიზაციამ ყოველ პასუხს კი არ უნდა ენდოს, არამედ წინასწარ დააფიქსიროს მოსალოდნელი გამომცემი, აქტივის განსაზღვრება და თანხა.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` ხსნის სამუშაოს მტკიცებულების ამოცანას და ინახავს ზუსტ ხელმოწერილ ტრანზაქციას; `submit` მას ერთხელ აგზავნის და ბრუნდება მას შემდეგ, რაც ტრანზაქცია გამოიყენება. თუ `submit` აბრუნებს `Pending`-ს ან დრო ამოიწურება, ახალი განაცხადის მომზადების ნაცვლად გაუშვით `taira account faucet resume` იმავე კონფიგურაციითა და ჟურნალით. შემდეგ ბალანსი პერიოდულად შეამოწმეთ არაუმეტეს ერთი წუთის განმავლობაში.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

Taira-ზე ყოველი ჩაწერისთვის გამოიყენეთ `--fee-payer authority`. არჩევანი ხელმოწერითაა მიბმული, ხოლო CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში.

## შემოწმება {#verify}

წარადგინეთ ლოგის ინსტრუქცია, შეინახეთ JSON ქვითრი და დაელოდეთ გამოყენებული საბოლოო. `--no-wait` გამოტოვება ასევე იწვევს პირველადი წარდგენის დადასტურების მოლოდინს; მკაფიო სტატუსის კითხვა ადასტურებს დამუშავების კონვეიერის საბოლოო მდგომარეობას.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

საბოლოო ბრძანება წარმატებით სრულდება მხოლოდ მას შემდეგ, რაც ზუსტი გლობალური სტატუსი მდგომარეობით დადასტურებულ `Applied` საბოლოობას აჩვენებს. ჰეში შეინახეთ სატესტო მტკიცებულებებში; მასთან ერთად არასოდეს შეინახოთ პირადი გასაღები ან კლიენტის სრული კონფიგურაცია.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `/livez`, `/health` და `/readyz` აბრუნებს `406`-ს, როდესაც მხოლოდ JSON-ს ითხოვთ, რადგან ისინი `text/plain`-ით პასუხობენ. გაგზავნეთ ზემოთ ნაჩვენები `Accept` სათაურები.
- `/readyz`-მა შეიძლება დააბრუნოს `503` `service_unavailable` შეცდომის კონვერტით მაშინაც კი, როდესაც `/livez` და `/status` მუშაობს. დაელოდეთ მზადყოფნას ან გაუშვით `iroha taira doctor`; გასაღებების ხელახლა გენერირება კვანძის მზადყოფნას არ შეცვლის.
- გამცემის `502` ან დროის ამოწურვა `submit`-ის დროს განაცხადის შედეგს უცნობს ტოვებს: ახალი განაცხადის მომზადების ნაცვლად გაუშვით `taira account faucet resume` იმავე კონფიგურაციითა და ჟურნალით. სამუშაოს მტკიცებულების მოძველებული საყრდენი `prepare`-ს ჩაშლის; თავიდან მოამზადეთ ახალ ჟურნალის დირექტორიაში.
- I105 პრეფიქსის შეცდომა ნიშნავს, რომ საჯარო გასაღები არასწორი პროფილით იყო კოდირებული. განახორციელეთ `iroha tools address convert --profile taira`.
- საფასურის შეფასების უარყოფა, როგორც წესი, ნიშნავს, რომ უფლებამოსილი ანგარიში არ არის დაფინანსებული ან კონფიგურირებული `network_id` Taira-ს არ ეკუთვნის. გამოტოვებული `--fee-payer` ან `--metadata`-ში საფასურის გასაღები, მაგალითად `gas_asset_id`, შეფასებამდე ლოკალურად იწვევს შეცდომას.
- რეგისტრაცია, გაცემა ან სახელების სივრცის მართვა კვლავ შეიძლება უარი თქვას ამ კანარის წარმატების შემდეგ. ეს ოპერაციები მოითხოვს ცალკე შესრულების გარემოს ნებართვებს; შეამოწმეთ ისინი წარმოქმნილ ლოკალურ ქსელში, როდესაც Taira წვდომა არ არის მინიჭებული.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Taira CLI-ის დიაგნოსტიკისა და კანარის შემოწმებების წყარო კოდი](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) და [გამცემის ბრძანებები](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) დამაგრებული წყარო კოდის რევიზიისას
- [გამოხატული საფასურის შერჩევა და CLI წარდგენის წყარო, ჩაკეტილი წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira ანგარიშისა და ტესტური მონეტების გამცემის სახელმძღვანელო](/ka/get-started/sora-nexus-dataspaces.md)
- [მომხმარებლის კონფიგურაცია](/ka/guide/configure/client-configuration.md)
- [ოპერაციები](/ka/blockchain/transactions.md)
