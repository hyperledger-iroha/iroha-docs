---
translation_locale: ka
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ტრანზაქციების წარდგენა და შემოწმება {#submit-and-verify-transactions}

## შედეგები {#outcome}

წინასწარი ტრანზაქცია Taira, მიიღეთ ზუსტი საფასურის ფასის შეფასება, ხელი მოაწერეთ და წარადგინეთ იგი, ელოდოთ გამოყენებულ საბოლოო განხორციელებას და შემოწმეთ დასრულებული ტრანზაკცია კრიპტოგრაფიული ჰეშით.

## წინაპირობები {#prerequisites}

- დაფინანსებული `taira.client.toml`, `taira.tx-metadata.json` და `TAIRA_ACCOUNT_ID`, რომლებიც წარმოებულია [გაერთიანება Taira](./connect-to-taira.md)-ით.
- ამჟამინდელი `iroha` CLI და `jq`.
- ერთჯერადი Taira კრიპტოგრაფიული ხელმოწერა. არ გამოიყენოთ მისი გასაღები ან ამ ბრძანებებს დაწერეთ Minamoto

## ნაბიჯები {#steps}

### 1. API საბოლოო წერტილის, ნებართვის საფასურის და საფასურის ბალანსის წინასწარი გათვალისწინება {#_1-preflight-the-endpoint-authority-and-fee-balance}

წაიკითხეთ რიგის წერტილის დროში მონაცემების ნახვა ჯერ, შემდეგ დაამტკიცეთ, რომ ავტორიზაციის ხელმძღვანელის საფასურის ბალანსი ჩანს. წაიკითხეთ Base58 აქტივის განსაზღვრის ID კავშირის რეცეპტის მიერ წარმოქმნილი მეტამონაცემებიდან.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

შეწყვიტეთ, თუ ანგარიში ან საფასურის ბალანსი არ არის. ვალიდური ინსტრუქცია ვერ გაივლის საფასურის მიღებას, როდესაც მისი ავტორიზაციის ხელმძღვანელი ვერ გადაიხდის.

### 2. ერთი საფასურის შეფასება, ხელმოწერა და წარდგენა. {#_2-quote-sign-and-submit-once}

CLI გზავნის ზუსტ ხელმოწერილი დატვირთვას საფასურის ფასის შეფასებისათვის, აკავშირებს მიღებულ გადახდის განზრახვას ტრანზაქციაში, ხელს უწერს და წარუდგენს. JSON რეჟიმში ბრუნდება ტრანზაკციის კრიპტოგრაფიული ჰეში, ხელმოწერილია ტრანზექცია და მიღებული საფასურის შეფასება ერთად.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

არ გამოიყენოთ `--no-wait` ამ რეცეპტში. ბრძანება ელოდება დადასტურებას, სანამ წარმატებული ქვითრს დაწერს.

### 3. დაველოდოთ ტერმინალური დამუშავების კონვეიერის მდგომარეობას {#_3-wait-for-terminal-pipeline-state}

გამოიყენეთ ტიპირებული სტატუსის დამხმარე, იმის ნაცვლად რომ წარმატების დასკვნა HTTP მიღება ან რიგში შესვლა. `--wait`, უსაფრთხო მარშრუტის სფერო ავტომატურად არის შერჩეული და დეფოლტური სამიზნე არის გამოყენებული საბოლოო.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` და `Expired` ტერმინალური წარუმატებლობაა, არ არის განახლებადი წარმატების მდგომარეობა. შეადგინეთ მათი მიზეზი ტრანზაქციის შეცვლამდე ან აღდგენამდე.

### 4. წაიკითხეთ შენახული ოპერაცია. {#_4-read-the-stored-transaction}

დამუშავების კონვეიერის სტატუსი პასუხობს, დასრულებულია თუ არა დამუშავება. ტრანზაქციის მოთხოვნა ადასტურებს, რომ მიღებული ტრანზაკცია შენახულია იმავე კრიპტოგრაფიული ჰეშის ქვეშ.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Explorer დაკვირვების მეორე, მხოლოდ წაკითხვის ზედაპირია. ის შეიძლება მცირე ხნით ჩამორჩეს კონვეიერის საბოლოოობას.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

მდგომარეობის შეცვლის ინსტრუქციისთვის, დაასრულეთ იმ ობიექტის მოთხოვნით, რომელიც მუტირებული იყო. [მეტამონაცემები](./metadata.md), [ფუნქციური აქტივები](./fungible-assets.md) და [NFTs](./nfts.md) რეცეპტები მოიცავს ამ პოსტ-სახელმწიფო წაკითხვებს .

## შემოწმება {#verify}

შეამოწმეთ, რომ სამივე ჩანაწერი თანხმდება იმავე კრიპტოგრაფიულ ჰეშზე და რომ მკვლევარი აღარ აცხადებს გამოწვეული მდგომარეობის:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

შეინახეთ წარდგენის ქვითრი და საბოლოო სტატუსი, როგორც ტესტის მტკიცებულება. ისინი შეიცავს საჯარო ტრანზაქციის მასალას, არა ხელმოწერის გასაღებს.

## პრობლემების აღმოფხვრა {#troubleshooting}

- HTTP `202` ან რიგში მყოფი სტატუსი მხოლოდ დაშვების დამტკიცებას ადასტურებს. განაგრძეთ გამოკითხვა ტიპირებული სტატუსის გამოყენებამდე, უარყოფითი, ამოწურული ან შეზღუდული ვადა.
- თუ ჩაბარების დრო დასრულდა კრიპტოგრაფიული ჰეშის დაბრუნების შემდეგ, შეკითხვა ამ კრიფტოგრაფიულ ჰეშს კიდევ ერთი ტრანზაქციის შექმნამდე. ბრმა განახლება ქმნის ახალ ციტირებულ და ხელმოწერილ დატვირთვას.
- საფასურის ფასის შეფასება ხელმოწერამდე შეიძლება უარი თქვას. შეამოწმეთ `--fee-payer authority`, `gas_asset_id`, ავტორიზაციის დამფუძნებლის ბალანსი და ქსელის ჯაჭვის ID.
- `Rejected` ჩვეულებრივ მიუთითებს ინსტრუქციის ვალიდაციას, ნებართვებს, საფასურებს ან მოძველებულ მდგომარეობას. ეს არის საბოლოო მტკიცებულება წარუმატებელი შესრულების შესახებ და არ უნდა გადაეწეროს როგორც ტრანსპორტის ხელახალი მცდელობა.
- მკვლევარი `404` Applied-ის შემდეგ შეიძლება იყოს ინდექსირების დაგვიანება. გაეცადეთ კითხვა; არ გადაიტანოთ ოპერაცია.
- თუ პრივილეგირებული ინსტრუქცია მუშაობს გენერირებულ ლოკალურ ქსელში, მაგრამ Taira უარყოფს მას, მიიღეთ ზუსტი Taira ნებართვა ან სახელის სივრცის დანიშვნა. ადგილობრივი შედეგი არ იძლევა საჯარო ბლოკჩეინის ქსელის ავტორიზაციის პრინციპს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ტრანზაქციის წარდგენა და საფასურის კოტირების განხორციელება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ტრანზაქციის დადასტურების განხორციელება და ტესტირება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [ოპერაციები](/ka/blockchain/transactions.md)
- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
