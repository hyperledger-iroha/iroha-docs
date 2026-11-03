---
translation_locale: hy
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: c1aee0c29332bd7c883500e72a1ec7812aebfca13b673e6681788cf4bc5ecbf1
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Հաշիվներ եւ անանուն անուններ {#accounts-and-aliases}

## Արդյունքը {#outcome}

Աշխատեք անվտանգ ՝ առանց տիրույթի I105 կանոնիկ հաշիվով IDs եւ առանձին կապված մարդկային ընթերցելի կեղծանուններով, ինչպիսիք են `treasury@payments.universal`: Դուք կվերսկսեք Taira հաշիվները, կստեղծեք ձեր սեփական կանոնիկ ID եւ կլուծեք կեղծանվանները ՝ չխառնելով երթեւեկման համատեքստը ինքնության հետ.

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- A `taira.client.toml` [Անձնական հաշիվը ստուգելիս կապվեք Taira](./connect-to-taira.md) հետ:
- Հաշիվ, որը տրամադրվում է Taira գետի կամ ցանցի կառավարվող ներբեռնման ուղու միջոցով' նախքան հաշվի հատուկ ընթերցումը հաջողելու ակնկալելը:

## Քայլեր {#steps}

### 1. Ստուգեք Taira-ի կանոնական հաշիվները {#_1-inspect-canonical-accounts-on-taira}

Հաշիվների հանրային ցուցակը միշտ վերադարձնում է կանոնիկ I105 ID-ներ։ Հիմնական կեղծանունն ընտրովի է; այն տեսնելու համար պահանջեք `aliases` դաշտը։

```bash
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/accounts \
  --data-urlencode 'limit=5' \
  --data-urlencode 'select=id,aliases' \
  | jq -r '.items[]
    | [.id, (first(.aliases[]? | select(.is_primary) | .alias) // "-")]
    | @tsv'
```

ID `.id` համարը վավեր է խիստ հաշիվների դաշտերի համար: Մի ավելացրեք մի տիրույթ դրան: `.aliases[].alias` կեղծանունը օգտագործողի դեմ ուղղված որոնման բանալին է, այլ ոչ թե մեկ այլ կանոնական նույնականություն.

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

Նորմալացված արժեքը պետք է նույնական լինի `TAIRA_ACCOUNT_ID`-ին։ `[account].profile` կարգավորումն ընտրում է միայն I105 ցանցի նախածանցը; դոմենները պատկանում են կեղծանուններին, երբեք՝ հաշվի ID-ին։

### 3. Կարդացեք հաշիվը եւ դրա ակտիվները {#_3-read-the-account-and-its-assets}

Հաշիվը տրամադրելուց հետո անմիջապես կատարեք հարցում այն եւ ցուցադրեք սահմանված ակտիվի էջ: URL - կոդավորել I105 արժեքը, նախքան այն օգտագործելը ուղու մեջ:

```bash
iroha --config ./taira.client.toml account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10&include_total=true" \
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

Taira-ի faucet-ը կարող է նախապատրաստել իր հայցողի հաշիվը, սակայն դա չի տալիս հաշիվների գրանցման կամ կեղծանունների կառավարման ընդհանուր լիազորություն։ Այլ հաշիվ գրանցելու համար ակտիվ կատարողի ներքո անհրաժեշտ է `CanRegisterAccount`։ Հաշիվների կեղծանունները սովորաբար պահանջում են նաև ակտիվ SNS վարձակալություն և կեղծանունների համապատասխան թույլտվություններ։ Օգտագործեք կառավարվող միացման/կեղծանունների պլանավորիչը կամ գրանցումը նախապես փորձարկեք ստեղծված տեղական ցանցում։

:::

Տեղական ցանցում, երբ անվտանգ ստորագրող մատակարարման քայլը արտահանում է նոր կանոնիկ `NEW_ACCOUNT_ID`, գրանցման մակերեսը հետեւյալն է'

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml account get \
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
- `404` հաշիվը `202` faucet հետո կարող է լինել տարածման հետաձգում: Գնահատեք հաշիվը կամ ֆինանսավորված ակտիվը, նախքան գրառումը ուղարկելը:
- `total: 0` վերադարձ լուծիչից նշանակում է, որ ոչ մի տեսանելի անանուն չի կապված: Դա հաշիվի որոնման ձախողում չէ:
- `401` կամ `403` alias երթուղից ցույց է տալիս սահմանափակ տվյալների տարածք կամ բավարար ճշգրիտ լուծման թույլտվություն: Չօգտագործեք լայն նախապայման որոնումը որպես հետընթաց:
- Ընթերցելի `name@domain.dataspace` արժեքը չի ընդունվում ամենուր, որտեղ պահանջվում է քանոնիկ I105 ID: Նախ լուծեք այն.
- Եթե տեղական հաշիվի գրանցումը հաջողվում է, բայց Taira-ը մերժում է այն, ապա տարբերությունը թույլտվությունն է: Ստացեք `CanRegisterAccount`; չփոխեք հաշիվը ID ՝ հավաստագրումը շրջանցելու համար։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Կոնոնիկական հաշիվի հասցեների իրականացումը փակված commit-ում ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/account/address.rs):
- [Torii-ի հաշիվների վերջնակետի արագ ստուգման թեստերը](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/tests/accounts_endpoints.rs) և [կեղծանունների երթուղիների թեստերը](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/tests/lib_tests/part_2.rs) ամրագրված commit-ում
- [Հաշվարկներ](/hy/blockchain/accounts.md)
- [Տվյալների մոդելային կեղծանուններ](/hy/blockchain/data-model.md#aliases)
- [Անվանման կոնվենցիաներ](/hy/reference/naming.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
