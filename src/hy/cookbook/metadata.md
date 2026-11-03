---
translation_locale: hy
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Մետադատա {#metadata}

## Արդյունքը {#outcome}

Կարդացեք մետատվյալները Taira-ում, վճարը բացահայտորեն վճարող գործարքով սահմանեք և ստուգեք հաշվի մետատվյալների մեկ արժեք, ապա նորից հեռացրեք այդ արժեքը։ Դուք ռեեստրի օբյեկտների մետատվյալները կպահեք գործարքի մետատվյալներից առանձին։

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- Ֆինանսավորված `taira.client.toml`՝ [Միացում Taira-ին](./connect-to-taira.md) էջից։
- Թիրախային հաշվի մետադատաների նկատմամբ լիազորություն: Օրինակն ուղղված է կազմաձևված լիազոր հաշվին. մեկ այլ հաշիվ պահանջում է հստակ թույլտվություն:

## Քայլեր {#steps}

### 1. Մետադատա կարդալ առանց ստորագրողի {#_1-read-metadata-without-a-signer}

Մետադատները ստուգված `Name` մինչեւ JSON քարտեզն են: Թթու քարտեզներ եւ դատարկ ֆիլտրված արտադրանքը վավեր արդյունքներ են.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Օգտագործեք մետադատա փոքր նկարագրական կամ ինդեքսավորման դաշտերի համար: Հեռացրեք մեծ օգտակար բեռնվածքները գրասենյակից եւ փոխարենը պահեք URI կամ SoraFS հղում:

### 2. Տեղեկացրեք նպատակային հաշիվը {#_2-derive-the-target-account}

Պարզապես կարդացեք Taira կոնֆիգից հրապարակային բանալին եւ այն փոխակերպեք I105 կանոնական դոմեյնազերծված ձեւով:

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

### 3. Սահմանեք մեկ JSON արժեք: {#_3-set-one-json-value}

Ստանդարտ մուտքից կարդացված JSON-ը դառնում է հաշվի `cookbook_profile` արժեքը։ Գործարքի մետատվյալները, որոնք կցվում են `--metadata <file>`-ով, գործարքի ծրարի վրա առանձին քարտեզ են և երբեք վճար չեն ընտրում: դա անում են `--fee-payer`-ը և CLI-ի ճշգրիտ վճարային առաջարկը, իսկ հաճախորդը մերժում է `gas_asset_id`, `gas_limit` կամ `fee_sponsor` բանալիներ պարունակող գործարքի մետատվյալները։

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով, ապա ներկայացնում է գործարքը և մինչև աշխատանքն ավարտելը սպասում է Applied վերջնականությանը։

::: warning Թույլատրելիության սահման

Ակտիվ կատարողը որոշում է, թե ով կարող է փոփոխել յուրաքանչյուր օբյեկտ։ Այլ հաշիվ թարմացնելու համար սովորաբար անհրաժեշտ է `CanModifyAccountMetadata`; դոմենները, ակտիվների սահմանումները, NFTs և գործարկիչներն ունեն իրենց սեփական, թիրախին հատուկ մետատվյալների թույլտվությունները։ Եթե Taira-ն չի տրամադրել անհրաժեշտ լիազորությունը, նույն հաշվի հրամանները գործարկեք `./localnet/client.toml`-ով և տեղադրեք ստեղծված տեղական ցանցի լիազոր հաշվի կանոնիկ I105 ID-ն։ Պահպանեք վճարողի բացահայտ տեղական ընտրությունը։

:::

### 4. Հեռացրեք բանալին {#_4-remove-the-key}

Նախ կարդացեք հաստատված արժեքը, ապա ներկայացրեք առանձին հեռացման գործարք:

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python հավելվածների համար համապատասխան տիպավորվող շինարարներն են `Instruction.set_account_key_value` եւ `Instruction.remove_account_key_value`; դրանք ներկայացրեք գործարքի մետադատայով եւ սպասող օգնականի հետ [Python ձեռնարկից ](/hy/guide/tutorials/python.md#shared-setup):

## Փորձարկել {#verify}

Սահմանված գործարքի ավարտից հետո `meta get`-ը պետք է վերադարձնի օբյեկտը `version: 1`-ով: Հեռացնելուց հետո ուղղակի որոնումը չպետք է վերադարձնի արժեք.

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Հատուկ հաշվառման ընթերցումը տարբերում է բացակայող մետադատա բանալին ցանցի կամ հաշիվի անբավարարությունից: Արտադրման կոդը պետք է ստուգի նաեւ ամբողջ JSON արժեքը այն սահմանելուց հետո:

## Խնդիրների լուծում {#troubleshooting}

- Ստանդարտ մուտքը պետք է պարունակում է մեկ գործող JSON արժեք: Strings- ը պետք է JSON մեջբերումներ ունենա. օբյեկտներն ու շարքերը պետք է լավ ձեւավորվեն:
- Մետադատա բանալիները `Name` արժեքներ են եւ վերլուծելուց հետո զգայուն են դեպքերի համար: Պահպանեք կայուն բանալիր բառապաշար, փոխարենը յուրաքանչյուր սխեմայի փոփոխության համար ստեղծեք տարբերակային բանալիներ:
- `--metadata` գործարքի մետամտածն է, այն չի սահմանում գլխավոր գրասենյակի օբյեկտի մետամատածն. Օգտագործեք կազմակերպության `meta set` ենթակառավարումը վերջինիս համար:
- Հաջողակ ներկայացումը, որին հաջորդում է հին ընթերցանությունը, կարող է լինել տարածման հետաձգություն: Սպասեք կիրառված վերջնականության եւ կրկին փորձեք հարցումը, նախքան նորից ուղարկելը:
- Թույլտվության մերժումը բացահայտում է թիրախային օբյեկտը եւ իրավասության սահմանը: Կրկին փորձեք տեղական կամ խնդրեք ճշգրիտ նշանը. Մի տեղափոխեք մասնավոր դիմման տվյալները հանրային մեթադատա դաշտ, որպեսզի խուսափեք մուտքի վերահսկողությունից:
- Երբեք գաղտնի բանալիները, անձնավորական կոճակները, մուտքի տոկենները կամ մեծ փաստաթղթերը չեն պահվում մետադատաներում:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Մետադատա հարցումների ինտեգրման փորձարկումներ փինացված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK գործարքի կառուցողները փակված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [Մետադատա եւ գլխավոր գրքի պահեստավորման տարբերակներ](/hy/guide/configure/metadata-and-store-assets.md)
- [Ուղարկման հղում](/hy/reference/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
