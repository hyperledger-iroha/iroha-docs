---
translation_locale: ka
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# გაერთიანება Taira {#connect-to-taira}

## შედეგები {#outcome}

დაადასტურეთ, რომ Taira ხელმისაწვდომია, გამოიყვანეთ კანონიკური I105 ანგარიში ID ადგილობრივი კლიენტის კონფიგურაციიდან, დააფინანსეთ ხელმომწერი ტესტნეტით XOR და წარუდგინეთ ერთი საფასური კოტირებული კანარიური ტრანზაქცია. ეს რეცეპტი არასოდეს გამოგზავნის წერილს Minamoto.

## წინაპირობები {#prerequisites}

- `curl`,`jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` და `kagami` ბინარები.
- `taira.client.toml` შეიქმნა Taira ჯაჭვი, საბოლოო წერტილი, ანგარიშის პროფილი და სპეციალური ტესტნეტის გასაღები. დაიცავით [ შექმნათ Taira კლიენტის კონფიგურაცია](/ka/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) და შეინახეთ ფაილი წყარო კონტროლის გარეშე.
- ჩართვისთვის მზად `taira_faucet_claim.py` [Get Testnet XOR Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-ზე, დაცულია კლიენტის კონფიგურაციის გვერდით.

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

ეს შემოწმება არის მხოლოდ წაკითხვა და არ ატვირთავს ხელმოწერის კონფიგურაციას:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

არ გააგრძელოთ წერა, როდესაც ექიმი იუწყება მკაცრი DNS, TLS, ჯაჭვი ან საბოლოო წერტილის უკმარისობა. შეჯერებული საზოგადოებრივი რიგები გარდამავალია; დაელოდეთ და კიდევ ერთხელ სცადეთ შეზღუდული პოლიტიკით.

### 3. გამოიყოს Taira ანგარიში ID საიდუმლოების დაბეჭდვის გარეშე {#_3-derive-the-taira-account-id-without-printing-a-secret}

წაიკითხეთ მხოლოდ საჯარო გასაღები კონფიგურაციიდან, შემდეგ დააკოდირეთ იგი Taira I105 პროფილით. `[account].domain` ღირებულება უზრუნველყოფს მარშრუტირების კონტექსტს; ის არ შედის ანგარიშის ID.

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

გამოსავალი არის დომენის გარეშე კანონიკური I105 მისამართი. სახელები, როგორიცაა `wallet@payments.universal`, არის საიდუმლო და უნდა გადაწყდეს სანამ ისინი გამოიყენება მკაცრი ანგარიშის ველებში.

### 4. მოითხოვეთ მიმდინარე Taira საფასურის აქტივი {#_4-claim-the-current-taira-fee-asset}

საფუჩოს რეაგირება არის სიმართლის წყარო საფასურის აქტივების განსაზღვრისთვის. შეინახეთ დაბრუნებული Base58 ID იმის ნაცვლად, რომ სხვა ქსელიდან ან ძველი გამშვებიდან გადაწეროთ ID.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

შეამოწმეთ ბალანსი მაქსიმუმ ერთი წუთის განმავლობაში. კრუნტი შეიძლება დაბრუნდეს `202 Accepted` სანამ ფინანსური ოპერაცია ხილული იქნება.

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

`gas_asset_id` არის ტრანზაქციის მეტა მონაცემები. აშკარა `--fee-payer authority` შერჩევა ხელმოწერით არის დაკავებული, ხოლო CLI მიიღებს ზუსტ საფასურის კოტირებას სანამ ის გაფორმდება.

## შემოწმება {#verify}

წარადგინეთ ლოგის ინსტრუქცია, შეინახეთ JSON ქვითარი და დაელოდეთ გამოყენებული საბოლოო. `--no-wait` გამოშვებისას ასევე იწვევს პირველადი წარდგენის დაელოდოს დასტურება; აშკარა სტატუსის კითხვა ადასტურებს საბოლოო მილსადენი მდგომარეობას.

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

საბოლოო ბრძანება წარმატებულია მხოლოდ მას შემდეგ, რაც ტრანზაქცია მიაღწევს გათვალისწინებულ `Applied` ტერმინალის მდგომარეობას. შეინახეთ ჰეში სატესტო მტკიცებულებაში; არასოდეს ინახოთ კერძო გასაღები ან სრული კლიენტის კონფიგურაცია მასთან ერთად.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `/livez` დაბრუნებს `406`, როდესაც ითხოვს JSON, რადგან ეს საბოლოო წერტილი არის `text/plain`. გამოაგზავნეთ `Accept: text/plain` როგორც ზემოთ მოცემულია.
- `/health` ან `/readyz` შეიძლება დაუბრუნდეს `503` მანქანით წაკითხული ბლოკერით, მაშინაც კი, როდესაც `/livez` და `/status` მუშაობენ. დააყენეთ ან ელოდოთ ამ ბლოკერს; რეგენერაციის გასაღები არ შეცვლის კვანძის მზადყოფნას.
- ფანქარი `502`, დროგამოშვება ან მოძველებული სამუშაო მტკიცებულების ანკერი არის საჯარო მომსახურების ჩავარდნა. მოიტანე ახალი თავსატეხი და კიდევ ერთხელ სცადე მოგვიანებით.
- I105 პრეფიქსის შეცდომა ნიშნავს, რომ საჯარო გასაღები არასწორი პროფილით იყო კოდირებული. განახორციელეთ `iroha tools address convert --profile taira`.
- საფასურის კოტირების უარყოფა, როგორც წესი, ნიშნავს, რომ ორგანო არ იყო დაფინანსებული, საფასური აქტივების მეტადატატი მოძველებულია ან არ არის შერჩეული საფასურის მფარველი.
- რეგისტრაცია, მონტაჟი ან სახელების სივრცის მართვა კვლავ შეიძლება უარი თქვას ამ კანარის წარმატების შემდეგ. ეს ოპერაციები მოითხოვს ცალკე გამართულობის ნებართვებს; შეამოწმეთ ისინი გენერირებულ ადგილობრივ ქსელში, როდესაც Taira წვდომა არ არის მინიჭებული.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Taira CLI დიაგნოსტიკა და კანარიური წყარო ჩაკეტილი კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [გამოხატული საფასურის შერჩევა და CLI წარდგენის წყარო ჩაკეტილი ვალდებულების](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira საანგარიშო და საბაგირო სახელმძღვანელო](/ka/get-started/sora-nexus-dataspaces.md)
- [მომხმარებლის კონფიგურაცია](/ka/guide/configure/client-configuration.md)
- [ტრანზაქციები](/ka/blockchain/transactions.md)
