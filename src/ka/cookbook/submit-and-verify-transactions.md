---
translation_locale: ka
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ტრანზაქციების წარდგენა და შემოწმება {#submit-and-verify-transactions}

## შედეგები {#outcome}

წინასწარი ტრანზაქცია Taira, მიიღეთ ზუსტი საფასურის ფასის შეფასება, ხელი მოაწერეთ და წარადგინეთ იგი, ელოდოთ გამოყენებულ საბოლოო განხორციელებას და შემოწმეთ დასრულებული ტრანზაკცია კრიპტოგრაფიული ჰეშით.

## წინაპირობები {#prerequisites}

- [Taira-სთან დაკავშირება](./connect-to-taira.md) გვერდის მიერ შექმნილი დაფინანსებული `taira.client.toml`, `taira-faucet-policy.json` და `TAIRA_ACCOUNT_ID`. ჩაწერები იყენებს `--fee-payer authority`-ს; CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში.
- ამჟამინდელი `iroha` CLI და `jq`.
- ერთჯერადი Taira კრიპტოგრაფიული ხელმოწერა. არ გამოიყენოთ მისი გასაღები ან ამ ბრძანებებს დაწერეთ Minamoto

## ნაბიჯები {#steps}

### 1. API საბოლოო წერტილის, ნებართვის საფასურის და საფასურის ბალანსის წინასწარი გათვალისწინება {#_1-preflight-the-endpoint-authority-and-fee-balance}

ჯერ წაიკითხეთ რიგის მდგომარეობის სნეპშოტი, შემდეგ დაადასტურეთ, რომ უფლებამოსილი ანგარიშის საფასურის ბალანსი ხილვადია. Base58 აქტივის განსაზღვრების ID წაიკითხეთ გამცემის პოლიტიკიდან, რომელიც დაკავშირების რეცეპტმა შეინახა.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

არ გამოიყენოთ `--no-wait` ამ რეცეპტში. ბრძანება ელოდება დადასტურებას, სანამ წარმატებული ქვითრს დაწერს.

### 3. დაველოდოთ ტერმინალური დამუშავების კონვეიერის მდგომარეობას {#_3-wait-for-terminal-pipeline-state}

გამოიყენეთ ტიპიზებული სტატუსის დამხმარე, ნაცვლად იმისა, რომ წარმატება HTTP მიღებიდან ან რიგში დაშვებიდან დაასკვნათ. `--wait`-ით CLI ზუსტ გლობალურ სტატუსს პერიოდულად ითხოვს და წარმატებით სრულდება მხოლოდ მდგომარეობით დადასტურებული `Applied` საბოლოობისას.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

შეამოწმეთ, რომ სამივე ჩანაწერი ერთსა და იმავე ჰეშზე თანხმდება და რომ ბლოკების მიმომხილველი აჩვენებს `Committed`-ს და არა `Rejected`-ს:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

შეინახეთ წარდგენის ქვითრი და საბოლოო სტატუსი, როგორც ტესტის მტკიცებულება. ისინი შეიცავს საჯარო ტრანზაქციის მასალას, არა ხელმოწერის გასაღებს.

## პრობლემების აღმოფხვრა {#troubleshooting}

- HTTP `202` ან რიგში მყოფი სტატუსი მხოლოდ დაშვების დამტკიცებას ადასტურებს. განაგრძეთ გამოკითხვა ტიპირებული სტატუსის გამოყენებამდე, უარყოფითი, ამოწურული ან შეზღუდული ვადა.
- თუ ჩაბარების დრო დასრულდა კრიპტოგრაფიული ჰეშის დაბრუნების შემდეგ, შეკითხვა ამ კრიფტოგრაფიულ ჰეშს კიდევ ერთი ტრანზაქციის შექმნამდე. ბრმა განახლება ქმნის ახალ ციტირებულ და ხელმოწერილ დატვირთვას.
- საფასურის შეფასება შეიძლება ხელმოწერამდე უარყოფილ იქნას. შეამოწმეთ `--fee-payer authority`, უფლებამოსილი ანგარიშის ბალანსი, კონფიგურირებული `chain` და `network_id` და ის, რომ `--metadata` არ შეიცავს საფასურის გასაღებს, მაგალითად `gas_asset_id`-ს.
- `Rejected` ჩვეულებრივ მიუთითებს ინსტრუქციის ვალიდაციას, ნებართვებს, საფასურებს ან მოძველებულ მდგომარეობას. ეს არის საბოლოო მტკიცებულება წარუმატებელი შესრულების შესახებ და არ უნდა გადაეწეროს როგორც ტრანსპორტის ხელახალი მცდელობა.
- მკვლევარი `404` Applied-ის შემდეგ შეიძლება იყოს ინდექსირების დაგვიანება. გაეცადეთ კითხვა; არ გადაიტანოთ ოპერაცია.
- თუ პრივილეგირებული ინსტრუქცია მუშაობს გენერირებულ ლოკალურ ქსელში, მაგრამ Taira უარყოფს მას, მიიღეთ ზუსტი Taira ნებართვა ან სახელის სივრცის დანიშვნა. ადგილობრივი შედეგი არ იძლევა საჯარო ბლოკჩეინის ქსელის ავტორიზაციის პრინციპს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ტრანზაქციის წარდგენა და საფასურის კოტირების განხორციელება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [ტრანზაქციის დადასტურების განხორციელება და ტესტირება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [ოპერაციები](/ka/blockchain/transactions.md)
- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
