---
translation_locale: ka
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გაერთიანება Taira {#connect-to-taira}

## შედეგები {#outcome}

დაადასტურეთ, რომ Taira ხელმისაწვდომია, გამოიყვანეთ კანონიკური ანგარიშის ID I105 ადგილობრივი კლიენტის კონფიგურაციიდან, დააფინანსეთ კრიპტოგრაფიული ხელმომწერი ტესტნეტით XOR და წარადგინეთ ერთი საფასურის კოტირებული კანარიური ტრანზაქცია. ეს რეცეპტი არასდროს გამოგზავნის წერილს Minamoto.

## წინაპირობები {#prerequisites}

- `curl`,`jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` და `kagami` ბინარები.
- Taira ჯაჭვით, API საბოლოო წერტილით, ანგარიშის პროფილით და სპეციალური ტესტნეტის გასაღებით შექმნილი `taira.client.toml`. მიჰყევით [შექმნას Taira კლიენტის კონფიგურაცია](/ka/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) და შეინახეთ ფაილი წყაროს კონტროლის გარეშე.
- ჩართვისთვის მზად `taira_faucet_claim.py` [ტესტნეტს XOR დაუკავშირდით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-დან, დაცულია კლიენტის კონფიგურაციის გვერდით.

## ნაბიჯები {#steps}

### 1. ცალკე სიცოცხლისუნარიანობა და მზადყოფნა {#_1-separate-liveness-from-readiness}

`/livez` არის მარტივი ტექსტის პროცესის სიცოცხლისუნარიანობის სონდი. `/status`, `/health` და `/readyz` დაბრუნება JSON. მიმდინარე კვანძს შეუძლია კანონიერად დაბრუნდეს `503` მზადყოფნის სონდებიდან, როდესაც საჭირო ქვესისტემა დაბლოკებულია.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

გამოიყენეთ `/livez` მხოლოდ იმისათვის, რომ გადაწყვიტოთ, პასუხობს თუ არა პროცესი. გამოიყენეთ `/readyz` სატრანსპორტო მოძრაობის შესასვლელად და შეამოწმეთ მისი JSON ბლოკერის დეტალები, სანამ `503` გათიშვით განიხილავთ.

### 2. საზოგადოებრივი დიაგნოსტიკის ჩატარება {#_2-run-the-public-diagnostics}

ეს შემოწმება არის მხოლოდ წაკითხვა და არ ატვირთავს კრიპტოგრაფიული ხელმოწერის კონფიგურაციას:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

არ გააგრძელოთ წერა, როდესაც ექიმი იუწყება მკაცრი DNS, TLS, ჯაჭვის ან API საბოლოო წერტილის უკმარისობა. შეჯერებული საჯარო რიგები გარდამავალია; დაელოდეთ და კიდევ ერთხელ სცადეთ შეზღუდული პოლიტიკით.

### 3. გამოიღეთ Taira ანგარიშის ID საიდუმლოების დაბეჭდვის გარეშე {#_3-derive-the-taira-account-id-without-printing-a-secret}

წაიკითხეთ მხოლოდ საჯარო გასაღები კონფიგურაციიდან, შემდეგ დააკოდირეთ იგი Taira I105 პროფილით. `[account].domain` ღირებულება უზრუნველყოფს მარშრუტის კონტექსტს; ის არ არის ანგარიშის ID- ის ნაწილი.

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

ტესტური მონეტების გამცემის პასუხი არის საფასურის აქტივების განსაზღვრის სიმართლის წყარო. შეინარჩუნეთ დაბრუნებული Base58 ID, იმის ნაცვლად, რომ სხვა ქსელიდან ან ძველი რეჟიმის ID- ს ასახავდეთ.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

ტესტური მონეტების გამცემს შეუძლია დაბრუნდეს `202 Accepted` სანამ ფინანსური ოპერაცია ხილული იქნება.

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

`gas_asset_id` არის ტრანზაქციის მეტამონაცემები. აშკარა `--fee-payer authority` შერჩევა ხელმოწერითაა დაკავებული, ხოლო CLI მიიღებს ზუსტ საფასურის ფასის შეფასებას მანამ, სანამ ის გაფორმდება.

## შემოწმება {#verify}

წარადგინეთ ლოგის ინსტრუქცია, შეინახეთ JSON ქვითრი და დაელოდეთ გამოყენებული საბოლოო. `--no-wait` გამოტოვება ასევე იწვევს პირველადი წარდგენის დადასტურების მოლოდინს; მკაფიო სტატუსის კითხვა ადასტურებს დამუშავების კონვეიერის საბოლოო მდგომარეობას.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

საბოლოო ბრძანება წარმატებულია მხოლოდ მას შემდეგ, რაც ტრანზაქცია მიაღწევს გათვალისწინებულ `Applied` ტერმინალის მდგომარეობას. ინახეთ კრიპტოგრაფიული ჰეში სატესტო მტკიცებულებაში; არასოდეს შეინახოთ პირადი გასაღები ან სრული კლიენტის კონფიგურაცია მასთან ერთად.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `/livez` უბრუნებს `406`, როდესაც ითხოვს JSON-ს, რადგან ეს API საბოლოო წერტილი არის `text/plain`. გამოაგზავნეთ `Accept: text/plain`, როგორც ზემოთ მოცემულია.
- `/health` ან `/readyz` შეიძლება დაუბრუნდეს `503` მანქანით წაკითხული ბლოკერით, მაშინაც კი, როდესაც `/livez` და `/status` მუშაობენ. დააყენეთ ან ელოდოთ ამ ბლოკერს; რეგენერაციის გასაღები არ შეცვლის კვანძის მზადყოფნას.
- გამცემის `502` პასუხი, დროის ამოწურვა ან სამუშაოს მტკიცებულების მოძველებული საყრდენი საჯარო სერვისის ხარვეზია. მიიღეთ ახალი თავსატეხი და მოგვიანებით კვლავ სცადეთ.
- I105 პრეფიქსის შეცდომა ნიშნავს, რომ საჯარო გასაღები არასწორი პროფილით იყო კოდირებული. განახორციელეთ `iroha tools address convert --profile taira`.
- საფასურის კოტირების უარყოფა ჩვეულებრივ ნიშნავს, რომ ავტორიზაციის პრინციპალი არ იყო დაფინანსებული, საფასური აქტივის მეტადატატი მოძველებულია ან კონკრეტული საფასურის გადამხდელი არ არის შერჩეული.
- რეგისტრაცია, გაცემა ან სახელების სივრცის მართვა კვლავ შეიძლება უარი თქვას ამ კანარის წარმატების შემდეგ. ეს ოპერაციები მოითხოვს ცალკე შესრულების გარემოს ნებართვებს; შეამოწმეთ ისინი წარმოქმნილ ლოკალურ ქსელში, როდესაც Taira წვდომა არ არის მინიჭებული.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Taira CLI დიაგნოსტიკა და კანარიური წყარო, ჩაკეტილი წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [გამოხატული საფასურის შერჩევა და CLI წარდგენის წყარო, ჩაკეტილი წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira ანგარიშისა და ტესტური მონეტების გამცემის სახელმძღვანელო](/ka/get-started/sora-nexus-dataspaces.md)
- [მომხმარებლის კონფიგურაცია](/ka/guide/configure/client-configuration.md)
- [ოპერაციები](/ka/blockchain/transactions.md)
