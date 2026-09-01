---
translation_locale: ka
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მეტამონაცემები {#metadata}

## შედეგები {#outcome}

წაიკითხეთ მეტამონაცემები Taira, დააყენეთ და შეამოწმეთ ერთი ანგარიშის მეტამონაცემების ღირებულება საფასურის გადახდის ტრანზაქციით და კვლავ ამოიღეთ ღირებულება. თქვენ შენარჩუნებთ ბლოკჩეინის რეესტრის ობიექტების მეტამონაცემებს განცალკევებულად ტრანზუქციის საფასურის მეტამონაცემებიდან.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- დაფინანსებული `taira.client.toml` და `taira.tx-metadata.json` საფასური [გაერთიანება Taira](./connect-to-taira.md).
- ავტორიზაციის პრინციპი სამიზნე ანგარიშის მეტამონაცემებზე. მაგალითი მიზნად ისახავს თვითონ კონფიგურირებულ ავტორიზაციულ პრინციპს; სხვა ანგარიში საჭიროებს ზუსტ ნებართვას.

## ნაბიჯები {#steps}

### 1. წაიკითხეთ მეტამონაცემები კრიპტოგრაფიული ხელმოწერის გარეშე. {#_1-read-metadata-without-a-signer}

მეტამონაცემები არის შემოწმებული `Name`-ებიდან JSON მნიშვნელობებზე ასახვა. ცარიელი ასახვები და ცარიელი გაფილტრული შედეგები დასაშვები შედეგებია.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

მეტამონაცემები მცირე აღწერითი ან ინდექსირების ველებისთვის გამოიყენეთ. დიდი დატვირთვები რეესტრის გარეთ მოათავსეთ და მათ ნაცვლად დიჯესტი, URI ან SoraFS მითითება შეინახეთ.

### 2. მიზნების ანგარიშის წარმოქმნა {#_2-derive-the-target-account}

წაიკითხეთ მხოლოდ საჯარო გასაღები Taira კონფიგურაციიდან და გადააქციეთ იგი კანონიკური დომენების გარეშე I105 ფორმაში.

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
```

### 3. დააყენეთ ერთი JSON ღირებულება {#_3-set-one-json-value}

JSON სტანდარტული შეყვანიდან ამოღებული ხდება ანგარიშის `cookbook_profile` ღირებულება. ამის საპირისპიროდ, `--metadata ./taira.tx-metadata.json` აერთიანებს საფასურის ველებს გარიგების მონაცემთა კონტეინერში. ორ რუკაზე განსხვავებული მიზნები და მიზნები აქვთ.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI საფასურის შეფასებებს საფასურს, ხელმოწერს, წარადგენს და ელოდება დეფოლუტურად. არ დაამატოთ `--no-wait`, როდესაც შემდეგი ოპერაცია დამოკიდებულია ამ ღირებულებაზე.

::: warning ნებართვის საზღვარი

აქტიური ვალიდატორი გადაწყვეტს, ვინ შეიძლება მოიტანოს თითოეული ობიექტი. სხვა ანგარიშის განახლება ჩვეულებრივ საჭიროებს `CanModifyAccountMetadata`; დომენები, აქტივების დეფინიციები, NFTs და ტრიგერებს აქვთ საკუთარი სამიზნე-სპეციფიკური მეტატალების ნებართვები. თუ Taira არ აძლევს საჭირო ავტორიზაციის პრინციპს, განახორციელეთ იგივე ანგარიშის ბრძანებები `./localnet/client.toml`-ით, შეცვალეთ გენერირებული ლოკალურ ქსელზე ავტორიზების პრინციპის კანონიკური ID I105 და გამოტოვეთ საფასური მეტამონაცემები ფაილი Taira. შეინახეთ მკაფიო ადგილობრივი მოსაკრებლის შერჩევა.

:::

### 4. ამოიღეთ გასაღები {#_4-remove-the-key}

ჯერ წაიკითხეთ დასრულებული ღირებულება, შემდეგ წარადგინეთ ცალკე გადატანა ოპერაცია.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python აპლიკაციებისათვის შესაბამისი ტიპირებული მშენებლები არის `Instruction.set_account_key_value` და `Instruction.remove_account_key_value`; წარუდგინეთ ისინი ტრანზაქციის მეტამონაცემებითა და ელოდებიან დამხმარე პირთან ერთად [Python მასწავლებელი](/ka/guide/tutorials/python.md#shared-setup).

## შემოწმება {#verify}

განსაზღვრული ოპერაციის შემდეგ `meta get` უნდა დაუბრუნოს ობიექტი `version: 1`. ამოღების შემდეგ, პირდაპირი ძებნა აღარ უნდა დაუბრუნდეს ღირებულებას:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

ცალკე ანგარიშის წაკითხვა ხსნის დაკარგულ მეტამონაცემთა გასაღებს ქსელის ან ანგარიშის უკმარისობისგან. წარმოების კოდმა ასევე უნდა შეამოწმოს მთელი JSON ღირებულება მას შემდეგ, რაც იგი დადგენილია.

## პრობლემების აღმოფხვრა {#troubleshooting}

- სტანდარტული შესასვლელი უნდა შეიცავდეს ერთ ვალიდურ JSON ღირებულებას. ძრავებს სჭირდებათ JSON ციტატები; ობიექტები და მასრები კარგად უნდა იყოს ჩამოყალიბებული .
- მეტამონაცემები საკვანძოები `Name` ღირებულებები და არის შემთხვევის მგრძნობიარე შემდეგ პარსინგი. შეინარჩუნეთ სტაბილური საკვანძირო ლექსიკონი ნაცვლად შექმნის ვერსირებული საკვები თითოეული სქემა ცვლილებისთვის .
- `--metadata` არის ტრანზაქციის მეტამონაცემები; ის არ ადგენს ბლოკჩეინის რეესტრის ობიექტის მეტამონაცემებს. გამოიყენეთ საწარმოს `meta set` ქვებრძანება ამ უკანასკნელისთვის.
- წარმატებული წარდგენა, რომელსაც ძველი კითხვა მოჰყვება, შეიძლება გახდეს გაფართოების დაგვიანება. დაელოდეთ გამოყენებული საბოლოო და შეეცადეთ მოთხოვნა, სანამ განახორციელებთ გადაგზავნას.
- ნებართვის უარყოფა იდენტიფიცირებს მიზნობრივ ობიექტს და ავტორიზაციის ძირითად საზღვარს. ადგილობრივად გაეცანით ან ითხოვეთ ზუსტ ტოკონს; არ გადაიტანოთ კერძო აპლიკაციის მონაცემები საჯარო მეტამონაცემთა ველში, რათა თავიდან აიცილოთ წვდომის კონტროლი.
- არასოდეს ინახოთ პირადი გასაღები, ნედლეული პერსონალური იდენტიფიკატორები, წვდომის ტოქნები ან დიდი დოკუმენტები მეტამონაცემებში.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [მეტამონაცემები შეკითხვის ინტეგრაციის ტესტები დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK ტრანზაქციის შემქმნელები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [მეტამონაცემები](/ka/blockchain/metadata.md)
- [მეტამონაცემებისა და ბლოკჩეინის რეესტრის შენახვის არჩევანი.](/ka/guide/configure/metadata-and-store-assets.md)
- [ინსტრუქციის მითითება](/ka/reference/instructions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
