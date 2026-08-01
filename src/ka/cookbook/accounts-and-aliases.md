---
translation_locale: ka
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ანგარიშები და ანალიზი {#accounts-and-aliases}

## შედეგები {#outcome}

მუშაობა უსაფრთხოდ დომენის გარეშე კანონიკური I105 ანგარიში IDs და ცალკე დაკავშირებული ადამიანის-საკითხი aliases, როგორიცაა `treasury@payments.universal`. თქვენ შეამოწმოთ Taira ანგარიშები, გამოიყოთ თქვენი საკუთარი კანონიკური ID და გადაჭრას aliases არ დაბნევის routing კონტექსტი იდენტობა.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- `taira.client.toml` [შეერთდით Taira](./connect-to-taira.md)-ზე თქვენი ანგარიშის შემოწმებისას.
- ანგარიში, რომელიც განთავსებულია Taira საბანქის ან ქსელის მართული ჩართვის გზით, სანამ მოლოდინი ექნება, რომ კონკრეტული ანგარიშის წაკითხვა წარმატებით დასრულდება.

## ნაბიჯები {#steps}

### 1. შეამოწმოს Taira-ის კანონიკური ანგარიშები {#_1-inspect-canonical-accounts-on-taira}

საჯარო ანგარიშების სია ყოველთვის ასახავს კანონიკურ I105 IDs. პირველადი ანალიზი არ არის ნებადართული და ცალკე მოყვანილია.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID `.id` მოქმედებს მკაცრი ანგარიშის ველებისთვის. არ დაუმატოთ მას დომენი. `.primary_alias` - ის საიდუმლო სახელი არის მომხმარებლის მიმართული ძებნის გასაღები, და არა სხვა კანონიკური იდენტობა.

### 2. გამოიყოთ და ნორმალიზეთ თქვენი Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

წაიკითხეთ მხოლოდ საჯარო გასაღები ადგილობრივი კონფიგურაციიდან. ერთი და იგივე საჯარო ღილაკი განსხვავებულად არის კოდირებული სხვადასხვა საჯარო ქსელის პროფილისთვის, ასე რომ აირჩიეთ `taira` მკაფიოდ

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

ნორმალიზებული მნიშვნელობა უნდა იყოს იდენტიფიცირებული `TAIRA_ACCOUNT_ID`. `[account].domain` პარამეტრი ფაილში TOML შეიძლება იყოს `wonderland.universal`, მაგრამ ეს მნიშვნელობა გავლენას ახდენს მხოლოდ მარშრუტის და alias კონტექსტზე.

### 3. წაიკითხეთ ანგარიში და მისი ქონებები {#_3-read-the-account-and-its-assets}

ანგარიშის განთავსების შემდეგ, დაუკავშირდით მას პირდაპირ და ჩამოთვალეთ შეზღუდული აქტივის გვერდი. URL - კოდირება I105 ღირებულება სანამ გამოიყენებთ მის გზას.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. შეამოწმეთ ანგარიშთან დაკავშირებული საიდუმლოები. {#_4-look-up-aliases-bound-to-the-account}

Reverse Resolver იღებს ერთ ზუსტ კანონიკურ ანგარიშს ID. საჯარო მონაცემთა სივრცეში რიგები შეიძლება წაიკითხოთ მოთხოვნის ხელმოწერის სათაურების გარეშე; შეზღუდული მონაცემთა სფეროებისთვის საჭიროა ავტორიზებული ხელმოწერილი მოთხოვნა.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` არის მოქმედი: ანგარიშს არ სჭირდება საიდუმლო სახელი. როდესაც არსებობს ვალდებულება, აღმოაჩინეთ მისი ზუსტი სრულად კვალიფიციური საიდუმლოს და შეადარეთ დაბრუნებული ანგარიში ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning ნებართვის საზღვარი

Taira საფანქანას შეუძლია უზრუნველყოს მოსარჩელის ანგარიში, მაგრამ ეს არ იძლევა ზოგად ანგარიშის რეგისტრაციის ან alias-მმართველობის უფლებამოსილებას. სხვა ანგარიშის დარეგისტრირებისთვის საჭიროა `CanRegisterAccount` აქტიური ვალიდატორის ქვეშ. ანგარიშის ანალიზი ჩვეულებრივ ასევე მოითხოვს აქტიურ SNS იჯარით და შესაბამისი ანალიზის ნებართვებით. გამოიყენეთ განკუთვნილი ინბორდინგის / ანალიზის დაგეგმვა, ან რეპეტიციაზე რეგისტრაცია გენერირებული ადგილობრივი ქსელის წინააღმდეგ.

:::

ადგილობრივ ქსელში, მას შემდეგ, რაც უსაფრთხო ხელმოწერის მომარაგების ნაბიჯმა ექსპორტირებულიყო ახალი კანონიკური `NEW_ACCOUNT_ID`, რეგისტრაციის ზედაპირი არის:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

დოკუმენტაციის ან აპლიკაციების საცავის გარეთ შესაბამისი კერძო გასაღების გენერირება და შენახვა. ID რეგისტრაციისას, რომლის კონტროლერის გასაღები აღმოფხვრილია, წარმოიქმნება შეუძლებელი ანგარიში.

## შემოწმება {#verify}

აჩვენეთ, რომ საჯარო გასაღები კონფიგურებულია. I105 კოდირება, და alias binding ყველა converge ერთი კანონიკური ანგარიში ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

შენახვა კანონიკური ანგარიში IDs. გამოიყენეთ კანონიკური IDs ხელმოწერებისთვის, ნებართვებისა და ტრანზაქციული ინსტრუქციებისათვის. გადაწყვიტეთ საიდუმლო სახელი აპლიკაციის საზღვარზე. შეინახეთ ოპერაციისთვის გამოყენებული კანონიკური მოთამაშე ID.

## პრობლემების აღმოფხვრა {#troubleshooting}

- პარსირების ან პრეფისის შეცდომა, როგორც წესი, ნიშნავს, რომ მისამართი იყო კოდირებული სხვა ქსელის პროფილისთვის. ნორმალიზება `--profile taira` და უარყოფითი შეუსაბამობები.
- ანგარიში `404` კრუნტის შემდეგ `202` შეიძლება იყოს გაფართოების დაგვიანება. გამოკითხეთ ანგარიში ან დაფინანსებული აქტივი, სანამ გადაწერას არ გაგზავნით.
- `total: 0` საპირისპირო გადამწყვეტიდან ნიშნავს, რომ არ არის დაკავშირებული ხილული alias; ეს არ არის ანგარიშის ძებნის შეცდომა.
- `401` ან `403` საიდუმლო მარშრუტიდან მიუთითებს შეზღუდული მონაცემთა სივრცეზე ან არასაკმარისი ზუსტი რეზოლუციის ნებართვა. არ გამოიყენოთ ფართო პრეფიქსების ძიება, როგორც უკუჩვენება.
- წაკითხადი `name@domain.dataspace` ღირებულება არ არის მიღებული ყველგან, სადაც კანონიკური I105 ID საჭიროა. ჯერ გადაწყვიტეთ იგი.
- თუ ადგილობრივი ანგარიშის რეგისტრაცია წარმატებით მიმდინარეობს, მაგრამ Taira უარყოფს მას, განსხვავება არის ავტორიზაცია. მიიღეთ `CanRegisterAccount`; არ შეცვალოთ ანგარიში ID ვალიდაციის გვერდისთვის.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [კანონიკური ანგარიშის მისამართის განხორციელება ჩაკეტილი კომიტეტზე ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [ანგარიშისა და alias-ის ტესტები Torii ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [ანგარიშები](/ka/blockchain/accounts.md)
- [მონაცემთა მოდელის საიდუმლოები](/ka/blockchain/data-model.md#aliases)
- [სახელწოდების კონვენციები](/ka/reference/naming.md)
- [ნებართვის ქაღალდები](/ka/reference/permissions.md)
