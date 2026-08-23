---
translation_locale: ka
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მეტა მონაცემები {#metadata}

## შედეგები {#outcome}

წაიკითხეთ მეტა მონაცემები Taira, დააყენეთ და შეამოწმეთ ერთი ანგარიშის მეტა მონაცემების ღირებულება საფასურის გადახდის ტრანზაქციით, და კვლავ ამოიღეთ ღირებულება. თქვენ ინახავთ ლიდერ-ობიექტის მეტა მიცემებს განცალკევებულად ტრანზაკციის გადასახადის მეტა მიწოდებებზე.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- დაფინანსებული `taira.client.toml` და `taira.tx-metadata.json` [დაკავშირდით Taira](./connect-to-taira.md).
- ავტორიტეტი მიზნობრივი ანგარიშის მეტა მონაცემებზე. მაგალითი მიზნად ისახავს თვითონ კონფიგურირებულ ავტორიტეტს; სხვა ანგარიშისთვის საჭიროა ზუსტი ნებართვა .

## ნაბიჯები {#steps}

### 1. წაიკითხეთ მეტა მონაცემები ხელმოწერის გარეშე. {#_1-read-metadata-without-a-signer}

მეტა მონაცემები არის შეამოწმებული `Name` to JSON რუკა. ცარიელი რუკები და ცარიელი ფილტრირებული გამოსავალი არის მოქმედი შედეგები.

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

გამოიყენეთ მეტა მონაცემები პატარა აღწერილობის ან ინდექსირების ველებისთვის. დიდი სასარგებლო ტვირთების გამოტანა ლიდერში და შეინახეთ დიგესტი, URI ან SoraFS რეფერენცია ამის ნაცვლად.

### 2. მიზნების ანგარიშის წარმოქმნა {#_2-derive-the-target-account}

წაიკითხეთ მხოლოდ საჯარო გასაღები Taira კონფიგურაციიდან და გადააქციეთ იგი კანონიკური დომენის გარეშე I105 ფორმაში.

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

### 3. დააყენეთ ერთი JSON მნიშვნელობა {#_3-set-one-json-value}

JSON წაკითხული სტანდარტული შეყვანიდან ხდება ანგარიშის `cookbook_profile` ღირებულება. ამის საპირისპიროდ, `--metadata ./taira.tx-metadata.json` აერთიანებს საფასურის ველებს გარიგების კონვერტზე. ორ რუკაზე განსხვავებული მიზნები და მიზნებია.

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

CLI ციტატებს საფასურს, ხელმოწერს, წარადგენს და ელოდება დეფოლუტურად. არ დაამატოთ `--no-wait`, როდესაც შემდეგი ოპერაცია დამოკიდებულია ამ ღირებულებაზე.

::: warning ნებართვის საზღვარი

აქტიური ვალიდატორი გადაწყვეტს, ვინ შეიძლება მოიტანოს თითოეული ობიექტი. სხვა ანგარიშის განახლება ჩვეულებრივ საჭიროებს `CanModifyAccountMetadata`; დომენები, აქტივების დეფინიციები, NFTs და ტრიგერებს აქვთ საკუთარი სამიზნე-სპეციფიკური მეტატალების ნებართვები. თუ Taira არ მიანიჭა საჭირო უფლებამოსილება, განახორციელეთ იგივე ანგარიშის ბრძანებები `./localnet/client.toml`-ით, შეცვალეთ გენერირებული ლოკალური ქსელის ორგანოს კანონიკური I105 ID, და გამოტოვეთ საფასურის მეტატალოგიური ფაილი Taira. შეინახეთ მკაფიო ადგილობრივი გადასახადის გადამხდელი არჩევანი.

:::

### 4. ამოიღეთ გასაღები {#_4-remove-the-key}

პირველ რიგში, წაიკითხეთ ვალდებული ღირებულება და შემდეგ წარადგინეთ ცალკე გადატანა.

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

Python აპლიკაციებისათვის შესაბამისი ტიპირებული კონსტრუქტორები არის `Instruction.set_account_key_value` და `Instruction.remove_account_key_value`; წარადგინეთ ისინი ტრანზაქციის მეტადატასთან ერთად და ელოდე დამხმარე [Python სახელმძღვანელოდან ](/ka/guide/tutorials/python.md#shared-setup).

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

ცალკე ანგარიშის წაკითხვა ხსნის დაკარგულ მეტა მონაცემთა გასაღებს ქსელის ან ანგარიშის უკმარისობისგან. წარმოების კოდმა ასევე უნდა შეამოწმოს მთელი JSON ღირებულება მას შემდეგ, რაც იგი დადგენილია.

## პრობლემების აღმოფხვრა {#troubleshooting}

- სტანდარტული შესასვლელი უნდა შეიცავდეს ერთ ვალიდურ JSON ღირებულებას. ძრავებს სჭირდებათ JSON ციტატები; ობიექტები და მასრები კარგად უნდა იყოს ჩამოყალიბებული .
- Metadata საკვანძოები `Name` ღირებულებები და არის შემთხვევის მგრძნობიარე შემდეგ parsing. შეინარჩუნეთ სტაბილური საკვანძირო ლექსიკონი ნაცვლად შექმნის ვერსირებული საკვები თითოეული სქემა ცვლილებისთვის .
- `--metadata` არის ტრანზაქციული მეტა მონაცემები; იგი არ განსაზღვრავს ლიდერ-ობიექტის მეტა მონაცემებს. გამოიყენეთ საწარმოს `meta set` ქვებრძანება ამ ბოლოისთვის.
- წარმატებული წარდგენა, რომელსაც ძველი კითხვა მოჰყვება, შეიძლება გახდეს გაფართოების დაგვიანება. დაელოდეთ გამოყენებული საბოლოო და შეეცადეთ გამოკითხვა, სანამ განახორციელებთ გადაგზავნას.
- ნებართვის უარყოფა იდენტიფიცირებს მიზნობრივ ობიექტს და უფლებამოსილების საზღვარს. ადგილობრივად გაეცანით ან ითხოვეთ ზუსტ ტოქონს; არ გადაიტანოთ კერძო განაცხადის მონაცემები საჯარო მეტატალუროვან ველში, რათა თავიდან იქნას აცილებული წვდომის კონტროლი.
- არასოდეს ინახოთ პირადი გასაღები, ნედლეული პერსონალური იდენტიფიკატორები, წვდომის ტოქნები ან დიდი დოკუმენტები მეტადატაში.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Metadata შეკითხვის ინტეგრაციის ტესტები pinned commit-ზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK ტრანზაქციის მშენებლები ჩაკეტილი ვალდებულების ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [მეტა მონაცემები და ლიდერის შენახვის არჩევანი](/ka/guide/configure/metadata-and-store-assets.md)
- [ინსტრუქციის მითითება](/ka/reference/instructions.md)
- [ნებართვის ქაღალდები](/ka/reference/permissions.md)
