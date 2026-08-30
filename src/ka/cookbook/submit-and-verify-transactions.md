---
translation_locale: ka
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ტრანზაქციების წარდგენა და შემოწმება {#submit-and-verify-transactions}

## შედეგები {#outcome}

წინასწარი Taira ტრანზაქცია, მიიღეთ ზუსტი საფასურის შეთავაზება, ხელი მოაწერეთ და წარუდგინეთ იგი, ელოდოთ გამოყენებულ საბოლოო განხორციელებას და ადასტურეთ ვალდებული ტრანზაკცია ჰაშით.

## წინაპირობები {#prerequisites}

- დაფინანსებული `taira.client.toml`, `taira.tx-metadata.json` და `TAIRA_ACCOUNT_ID`, რომლებიც წარმოებულია [დაკავშირდით Taira](./connect-to-taira.md).
- ამჟამინდელი `iroha` CLI და `jq`.
- ერთჯერადი Taira ხელმოწერა. არ გამოიყენოთ მისი გასაღები ან ეს ბრძანებები დაწერეთ Minamoto

## ნაბიჯები {#steps}

### 1. შეამოწმეთ საბოლოო წერტილი, უფლებამოსილება და საფასურის ბალანსი {#_1-preflight-the-endpoint-authority-and-fee-balance}

წაიკითხეთ რიგის სურათი ჯერ, შემდეგ დაამტკიცეთ, რომ ხელისუფლების საფასურის ბალანსი ჩანს. წაიკითხეთ Base58 აქტივის განსაზღვრა ID მიერთების რეცეპტით გენერირებული მეტა მონაცემებიდან.

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

შეწყვიტეთ, თუ ანგარიში ან საფასურის ბალანსი არ არის. ვალიდური ინსტრუქცია ვერ გაივლის საფასურის მიღებას, როდესაც მისი ორგანო ვერ გადაიხდის.

### 2. ერთი ციტატა, ხელმოწერა და წარდგენა. {#_2-quote-sign-and-submit-once}

CLI აგზავნის ზუსტ ხელმოწერილი სასარგებლო ტვირთს საფასურის შეთავაზებისათვის, აკავშირებს მიღებულ გადახდის განზრახვას ტრანზაქციაში, ხელს უწერს და წარუდგენს. JSON რეჟიმში ბრუნდება ტრანზაკციის ჰეში, ხელი მოწერილი ტრანზექცია და მიღებული კოტირება ერთად.

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

არ გამოიყენოთ `--no-wait` ამ რეცეპტში. ბრძანება ელოდება დადასტურებას, სანამ წარმატებული ქვითრის დაწერა.

### 3. დაველოდოთ ტერმინალის მილსადენის მდგომარეობას. {#_3-wait-for-terminal-pipeline-state}

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

### 4. წაიკითხეთ შენახული ტრანზაქცია {#_4-read-the-stored-transaction}

მილსადენის სტატუსი პასუხობს, დასრულდა თუ არა დამუშავება. ტრანზაქციის გამოკითხვა ადასტურებს, რომ მიღებული ტრანზაკცია შენახულია იმავე ჰეშის ქვეშ .

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

ეს არის მეორე, მხოლოდ წაკითხული სადამკვირვებლო ზედაპირი. მას შეუძლია ცოტა ხნით ჩამორჩეს მილსადენის საბოლოო შედეგებს.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

მდგომარეობის შეცვლის ინსტრუქციისათვის, დასრულდით იმ ობიექტის გამოკითხვით, რომელიც მოუტებულია. [ მეტა მონაცემები](./metadata.md), [სოკოვანი აქტივები](./fungible-assets.md) და [NFTs](./nfts.md) რეცეპტები შეიცავს მათ პოსტ-სახელმწიფო წაკითხვებს .

## შემოწმება {#verify}

შეამოწმეთ, თუ სამივე ჩანაწერი თანხმდება იმავე ჰეშზე და რომ მკვლევარი აღარ აცხადებს მოქმედ მდგომარეობას:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

შეინახეთ წარდგენის მიღება და საბოლოო მდგომარეობა, როგორც სატესტო მტკიცებულება. ისინი შეიცავს საჯარო გარიგების მასალას, არა ხელმოწერის გასაღებს.

## პრობლემების აღმოფხვრა {#troubleshooting}

- HTTP `202` ან რიგში მყოფი სტატუსი მხოლოდ დაშვების დამტკიცებას ადასტურებს. განაგრძეთ გამოკითხვა ტიპირებული სტატუსის გამოყენებამდე, უარყოფითი, ამოწურული ან შეზღუდული ვადა.
- თუ წარდგენის დრო დასრულდა hash-ის დაბრუნების შემდეგ, შეკითხეთ ეს hash-ი კიდევ ერთი ტრანზაქციის შექმნამდე. ბრმა განახლება ქმნის ახალ ციტირებულ და ხელმოწერილი სასარგებლო ტვირთს.
- ანაზღაურების შეთავაზება ხელმოწერამდე შეიძლება უარი თქვას. შეამოწმეთ `--fee-payer authority`, `gas_asset_id`, ორგანოს ბალანსი და ქსელის ჯაჭვი ID.
- `Rejected` ჩვეულებრივ მიუთითებს ინსტრუქციის ვალიდაციას, ნებართვებს, საფასურებს ან შეუსრულებელ მდგომარეობას. ეს არის დადებული მტკიცებულება წარუმატებელი შესრულების შესახებ და არ უნდა იყოს გადაკვალიფიცირებული როგორც ტრანსპორტის განმეორებითი ცდება.
- მკვლევარი `404` Applied-ის შემდეგ შეიძლება იყოს ინდექსირების დაგვიანება. გაეცადეთ კითხვა; არ გადაიტანოთ ოპერაცია.
- თუ პრივილეგირებული ინსტრუქცია მუშაობს გენერირებულ ლოკალურ ქსელში, მაგრამ Taira უარყოფს მას, მიიღეთ ზუსტი Taira ნებართვა ან მართული სახელის სივრცის მინიჭება. ლოკალური შედეგი არ აძლევს საჯარო ქსელის ავტორიტეტს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ტრანზაქციის წარდგენა და საფასურის კოტირების განხორციელება ჩაკეტილ ვალდებულებაზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ტრანზაქციის დადასტურების ტესტები ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [ტრანზაქციები](/ka/blockchain/transactions.md)
- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md)
