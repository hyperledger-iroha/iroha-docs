---
translation_locale: ka
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ანგარიშები და ალიასი {#accounts-and-aliases}

## შედეგები {#outcome}

უსაფრთხოდ იმუშავეთ დომენის გარეშე კანონიკური I105 ანგარიშის ID-ებითა და ცალკე დაბმული ადამიანურად წაკითხავი საყვედურებით, როგორიცაა `treasury@payments.universal`. თქვენ შეამოწმებთ Taira ანგარიშებს, გამოიყვანთ თქვენი საკუთარი ერთიანი პროტოკოლური სტანდარტის ID- ს და გადაწყვეტთ საყვედრებს, არ ადანაშაულებთ რუტინგის კონტექსტს იდენტურობასთან.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- `taira.client.toml` [გაერთიანება Taira](./connect-to-taira.md) თქვენი ანგარიშის დათვალიერებისას.
- ანგარიში, რომელიც განთავსებულია Taira სატესტო ქსელის დაფინანსების სერვისის ან ქსელის გათვალისწინებული ჩართულობის გზით, სანამ მოლოდინი ექნება, რომ კონკრეტული ანგარიშის წაკითხვა წარმატებით დასრულდება.

## ნაბიჯები {#steps}

### 1. შეამოწმოს Taira კანონიკური ანგარიშები. {#_1-inspect-canonical-accounts-on-taira}

საჯარო ანგარიშების სია ყოველთვის იბრუნებს კანონიკურ I105 ID-ებს. პირველადი ალიასი არ არის ნებადართული და ცალკე მითითებულია.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id`-დან მიღებული ID მკაცრი ანგარიშის ველებისთვისაა ვარგისი. მას დომენი არ დაუმატოთ. `.primary_alias`-დან მიღებული ალიასი მომხმარებლისთვის განკუთვნილი საძიებო გასაღებია და არა კიდევ ერთი კანონიკური იდენტობა.

### 2. გამოიყოთ და ნორმალიზეთ თქვენი Taira I105 ID. {#_2-derive-and-normalize-your-taira-i105-id}

წაიკითხეთ მხოლოდ საჯარო გასაღები ადგილობრივი კონფიგურაციიდან. იგივე საჯარო ღილაკი კოდირებულია განსხვავებულად სხვადასხვა საჯარო ბლოკჩეინის ქსელის პროფილისთვის, ამიტომ აირჩიეთ `taira` მკაფიოდ.

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

ნორმალიზებული მნიშვნელობა უნდა იყოს იდენტიფიცირებული `TAIRA_ACCOUNT_ID`. `[account].domain` პარამეტრი ფაილში TOML შეიძლება იყოს `wonderland.universal`, მაგრამ ეს მნიშვნელობა გავლენას ახდენს მხოლოდ მარშრუტის და ალიასი კონტექსტზე.

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

### 4. შეამოწმეთ ანგარიშთან დაკავშირებული ალიასები. {#_4-look-up-aliases-bound-to-the-account}

უკუ რეზოლვერი ერთ ზუსტ კანონიკურ ანგარიშის ID-ს იღებს. საჯარო მონაცემთა სივრცის სტრიქონები მოთხოვნის ხელმოწერის სათაურების გარეშე იკითხება; შეზღუდული მონაცემთა სივრცე ავტორიზებულ, ხელმოწერილ მოთხოვნას მოითხოვს.

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

`total: 0` არის მოქმედი: ანგარიშს არ სჭირდება ალიასი სახელი. როდესაც არსებობს ვალდებულება, აღმოაჩინეთ მისი ზუსტი სრულად კვალიფიცირებული ალიასის და შეადარეთ დაბრუნებული ანგარიშის ID:

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

Taira ტესტური მონეტების გამცემს შეუძლია უზრუნველყოს მისი მოთხოვნის მქონე ანგარიში, მაგრამ ეს არ იძლევა ზოგად ანგარიშის რეგისტრაციის ან ალიასი-მმართველობის ავტორიზაციის პრინციპს. სხვა ანგარიშის დარეგისტრირებისთვის საჭიროა `CanRegisterAccount` აქტიური ვალიდატორით. ანგარიშის ალიასი ჩვეულებრივ ასევე მოითხოვს აქტიურ SNS იჯარით და შესაბამისი ალიასის ნებართვებით. გამოიყენეთ განკუთვნილი ინბორდინგის / ალიასის დაგეგმვა, ან რეპეტიციაზე რეგისტრაცია გენერირებული ადგილობრივი ქსელის წინააღმდეგ.

:::

ადგილობრივ ქსელში, როდესაც უსაფრთხო კრიპტოგრაფიული ხელმოწერის გასაღების უზრუნველყოფის ნაბიჯმა ექსპორტირებული აქვს ახალი კანონიკური `NEW_ACCOUNT_ID`, რეგისტრაციის ზედაპირი არის:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

გენერირება და შენახვა შეესაბამებელი პირადი გასაღები დოკუმენტაციის ან აპლიკაციების საცავის გარეთ. რეგისტრაცია ID, რომლის კონტროლერის გასაღები აღმოფხვრილია ქმნის შეუძლებელ ანგარიშს.

## შემოწმება {#verify}

დაადასტურეთ, რომ კონფიგურაციის საჯარო გასაღები, I105 კოდირება და ბინინგის ალტერნატივა ყველა კანონიკური ანგარიშის ID-ზე შედის:

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

შეინახეთ კანონიკური ანგარიშის ID. გამოიყენეთ კანონიკური ID ხელმოწერებისთვის, ნებართვებისა და ტრანზაქციული ინსტრუქციებისათვის. გადაწყვიტეთ ალიასი აპლიკაციის საზღვარზე. შეინარჩუნეთ ოპერაციისთვის გამოყენებული კანონიკური ანგარიში ID .

## პრობლემების აღმოფხვრა {#troubleshooting}

- პარსირების ან პრეფისის შეცდომა, როგორც წესი, ნიშნავს, რომ მისამართი იყო კოდირებული სხვა ქსელის პროფილისთვის. ნორმალიზება `--profile taira` და უარყოფითი შეუსაბამობები.
- ანგარიში `404` ტესტური მონეტების გამცემის შემდეგ `202` შეიძლება იყოს გავრცელების დაგვიანება. გამოკითხვა ანგარიშზე ან დაფინანსებულ აქტივზე, სანამ გადაწერას გაგზავნით.
- `total: 0` საპირისპირო გადამწყვეტიდან ნიშნავს, რომ არ არის დაკავშირებული ხილული ალიასი; ეს არ არის ანგარიშის ძებნის შეცდომა.
- `401` ან `403` ალიასი მარშრუტიდან მიუთითებს შეზღუდული მონაცემთა სივრცეზე ან არასაკმარისი ზუსტი რეზოლუციის ნებართვა. არ გამოიყენოთ ფართო პრეფიქსების ძიება, როგორც უკუჩვენება.
- წაკითხადი `name@domain.dataspace` მნიშვნელობა არ არის მიღებული ყველგან, სადაც საჭიროა ერთიანი პროტოკოლური სტანდარტული I105 ID. პირველი გადაწყვიტეთ იგი.
- თუ ადგილობრივი ანგარიშის რეგისტრაცია წარმატებით მიმდინარეობს, მაგრამ Taira უარყოფს მას, განსხვავება არის ავტორიზაცია. მიიღეთ `CanRegisterAccount`; არ შეცვალოთ ანგარიშის ვინაობა იმისათვის, რომ გარღვევდეთ ვალიდაცია.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [კანონიკური ანგარიშის მისამართის განხორციელება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [ანგარიშისა და ალიასი Torii ტესტები დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [ანგარიშები](/ka/blockchain/accounts.md)
- [მონაცემთა მოდელის ალიასები](/ka/blockchain/data-model.md#aliases)
- [კონვენციების დასახელება](/ka/reference/naming.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
