---
translation_locale: hy
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Հաշիվներ եւ անանուն անուններ {#accounts-and-aliases}

## Արդյունքը {#outcome}

Աշխատեք անվտանգ ՝ առանց տիրույթի I105 կանոնիկ հաշիվով IDs եւ առանձին կապված մարդկային ընթերցելի կեղծանուններով, ինչպիսիք են `treasury@payments.universal`: Դուք կվերսկսեք Taira հաշիվները, կստեղծեք ձեր սեփական կանոնիկ ID եւ կլուծեք կեղծանվանները ՝ չխառնելով երթեւեկման համատեքստը ինքնության հետ.

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- A `taira.client.toml` [Անձնական հաշիվը ստուգելիս կապվեք Taira](./connect-to-taira.md) հետ:
- Հաշիվ, որը տրամադրվում է Taira գետի կամ ցանցի կառավարվող ներբեռնման ուղու միջոցով' նախքան հաշվի հատուկ ընթերցումը հաջողելու ակնկալելը:

## Քայլեր {#steps}

### 1. Վերլուծել Taira-ի օրինական հաշվետվությունները: {#_1-inspect-canonical-accounts-on-taira}

Հանրային հաշիվների ցուցակում միշտ վերադարձվում է քանոնիկ I105 IDs: Գլխավոր անանունը ընտրանքային է եւ հաշվետուվում է առանձին:

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID `.id` համարը վավեր է խիստ հաշիվների դաշտերի համար: Մի ավելացրեք մի տիրույթ դրան: `.primary_alias` կեղծանունը օգտագործողի դեմ ուղղված որոնման բանալին է, այլ ոչ թե մեկ այլ կանոնական նույնականություն.

### 2. Պահանջեք եւ կարգավորեք ձեր Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

Կարդացեք միայն հանրային բանալին տեղական կոֆիգուրացիայից: Նույն հասարակական բանալին տարբեր կերպ է կոդավորվում հանրային ցանցի տարբեր պրոֆիլների համար, այնպես որ բացարձակ ընտրեք `taira`.

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

Նորմալացված արժեքը պետք է լինի նույնը, `TAIRA_ACCOUNT_ID`. Գլխավոր էջ `[account].domain` տեղադրվում է TOML ֆայլը կարող է լինել `wonderland.universal`, բայց այդ արժեքը ազդում է միայն երթուղային եւ alias համատեքստի վրա:

### 3. Կարդացեք հաշիվը եւ դրա ակտիվները {#_3-read-the-account-and-its-assets}

Հաշիվը տրամադրելուց հետո անմիջապես հարցրեք այն եւ ցուցադրեք սահմանված ակտիվի էջ: URL - կոդավորել I105 արժեքը, նախքան այն օգտագործելը ուղու մեջ:

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

### 4. Գտեք հաշիվի հետ կապված կեղծանունները {#_4-look-up-aliases-bound-to-the-account}

Վերադարձ լուծիչը ընդունում է մեկ ճշգրիտ կանոնիկ հաշիվ ID. Հանրային տվյալների տարածքի շարքերը կարող են ընթերցվել առանց պահանջի ստորագրության գլխավորությունների. սահմանափակված տվյալների տարածքները պահանջում են թույլատրված ստորագրված խնդրանք։

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

`total: 0` վավեր է. հաշիվը չի պահանջում գաղտնաբառ: Երբ պարտավորություն կա, լուծեք դրա ճշգրիտ լիարժեք որակավորված գաղտնաբառն եւ համեմատեք վերադարձված հաշիվը ID:

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

::: warning Թույլատրելիության սահման

Taira faucet- ը կարող է ապահովել իր դիմողի հաշիվը, բայց դա չի տրամադրում ընդհանուր հաշվառման գրանցման կամ alias- ի կառավարման լիազորություն: Մեկ այլ հաշվի գրանցումը պահանջում է `CanRegisterAccount` ակտիվ վավերացողի ներքո: Հաշվեի կեղծանունները սովորաբար պահանջում են նաեւ ակտիվ SNS վարձակալության պայմանագիր եւ համապատասխան կեղծանու թույլտվությունները: Օգտագործեք կառավարված ներկառուցման / կեղծանուի պլանավորիչը, կամ փորձեք գրանցումը ստեղծված տեղական ցանցի դեմ:

:::

Տեղական ցանցում, երբ անվտանգ ստորագրող մատակարարման քայլը արտահանում է նոր կանոնիկ `NEW_ACCOUNT_ID`, գրանցման մակերեսը հետեւյալն է'

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Ստեղծեք եւ պահեք համապատասխան գաղտնի բանալին փաստաթղթերի կամ դիմումների պահեստից դուրս: ID գրանցումը, որի վերահսկողության բանալին նետվել է, ստեղծում է անօգտագործելի հաշիվ.

## Փորձարկել {#verify}

Ապացուցեք, որ config հանրային բանալին, I105 կոդավորումը եւ կապող անանունները համընկնում են մեկ կանոնիկ հաշիվի վրա ID:

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

Կոնոնիկ հաշիվ IDs պահեք: Օգտագործեք կանոնիկ IDs ստորագրությունների, թույլտվությունների եւ գործարքների հրահանգների համար: Բացահայտեք գաղտնաբառը հավելվածի սահմանին: Պահպանեք գործողության համար օգտագործված կանոնիկական հաշիվը ID:

## Խնդիրների լուծում {#troubleshooting}

- Փորձարկման կամ նախադրյալի սխալը սովորաբար նշանակում է, որ հասցեն կոդավորվել է տարբեր ցանցային պրոֆիլի համար: Սովորեցրեք `--profile taira` եւ մերժեք անհամապատասխանությունները:
- `404` հաշիվը `202` ջրհեղեղից հետո կարող է լինել տարածման հետաձգում: Գնահատեք հաշիվը կամ ֆինանսավորված ակտիվը, նախքան գրառումը ուղարկելը:
- `total: 0` վերադարձ լուծիչից նշանակում է, որ ոչ մի տեսանելի անանուն չի կապված: Դա հաշիվի որոնման ձախողում չէ:
- `401` կամ `403` alias երթուղից ցույց է տալիս սահմանափակ տվյալների տարածք կամ բավարար ճշգրիտ լուծման թույլտվություն: Չօգտագործեք լայն նախապայման որոնումը որպես հետընթաց:
- Ընթերցելի `name@domain.dataspace` արժեքը չի ընդունվում ամենուր, որտեղ պահանջվում է քանոնիկ I105 ID: Նախ լուծեք այն.
- Եթե տեղական հաշիվի գրանցումը հաջողվում է, բայց Taira-ը մերժում է այն, ապա տարբերությունը թույլտվությունն է: Ստացեք `CanRegisterAccount`; չփոխեք հաշիվը ID ՝ հավաստագրումը շրջանցելու համար։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Կոնոնիկական հաշիվի հասցեների իրականացումը փակված հանձնաժողովում ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs):
- [Հաշվեի եւ alias Torii փորձարկումները փակված հանձնաժողովում](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs):
- [Հաշվարկներ](/hy/blockchain/accounts.md)
- [Տվյալների մոդելային կեղծանուններ](/hy/blockchain/data-model.md#aliases)
- [Անվանման կոնվենցիաներ](/hy/reference/naming.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
