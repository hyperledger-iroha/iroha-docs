---
translation_locale: hy
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Մետադատա {#metadata}

## Արդյունքը {#outcome}

Կարդացեք Taira մետադատները, սահմանեք եւ ստուգեք մեկ հաշիվի մետադատների արժեքը' բացարձակ վճարովի գործարքի միջոցով, եւ կրկին հեռացրեք արժեքը: Դուք պահելու եք գրասենյակի օբյեկտի մեթադատները առանձին գործարքի վճարային մետադատարից:

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- Ֆինանսավորված `taira.client.toml` եւ `taira.tx-metadata.json` գումարը [ Կապակցեք Taira ](./connect-to-taira.md):
- Թիրախային հաշվի մետադատաների նկատմամբ լիազորություն: Օրինակն ուղղված է կազմաձևված լիազոր հաշվին. մեկ այլ հաշիվ պահանջում է հստակ թույլտվություն:

## Քայլեր {#steps}

### 1. Մետադատա կարդալ առանց ստորագրողի {#_1-read-metadata-without-a-signer}

Մետադատները ստուգված `Name` մինչեւ JSON քարտեզն են: Թթու քարտեզներ եւ դատարկ ֆիլտրված արտադրանքը վավեր արդյունքներ են.

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

JSON ստանդարտ մուտքից ընթերցվածը դառնում է հաշիվի `cookbook_profile` արժեքը: Ընդհակառակը, `--metadata ./taira.tx-metadata.json`-ը վճարային դաշտեր է միացնում գործարքի փաթեթին: Երկու քարտեզները ունեն տարբեր նպատակներ եւ նպատակներ.

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

CLI- ը նշում է վճարը, ստորագրում է, ներկայացնում է եւ սպասում է անշարժ կարգով: Մի ավելացրեք `--no-wait`, երբ հաջորդ գործողությունը կախված է այս արժեքից:

::: warning Թույլատրելիության սահման

Ակտիվ հավաստիացնողը որոշում է, թե ով կարող է փոխել յուրաքանչյուր օբյեկտ: Մեկ այլ հաշիվ թարմացնելը սովորաբար պահանջում է `CanModifyAccountMetadata`; դոմեյնները, ակտիվների սահմանումները, NFTs, եւ գործարկիչները ունեն իրենց սեփական նպատակային հատուկ մետադատա թույլտվությունները: Եթե Taira-ը չի տրամադրել պահանջվող լիազոր հաշիվը, գործարկեք նույն հաշիվի հրամանները `./localnet/client.toml`-ով, փոխարինեք առաջադրված տեղական ցանցի լիազոր հաշվի կանոնիկ I105-ը ID, եւ բաց թողնեք վճարային մետադատա ֆայլը Taira: Պահպանեք պարզ տեղական վճարատու ընտրությունը։

:::

### 4. Հեռացրեք բանալին {#_4-remove-the-key}

Նախ կարդացեք հաստատված արժեքը, ապա ներկայացրեք առանձին հեռացման գործարք:

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

Python հավելվածների համար համապատասխան տիպավորվող շինարարներն են `Instruction.set_account_key_value` եւ `Instruction.remove_account_key_value`; դրանք ներկայացրեք գործարքի մետադատայով եւ սպասող օգնականի հետ [Python ձեռնարկից ](/hy/guide/tutorials/python.md#shared-setup):

## Փորձարկել {#verify}

Սահմանված գործարքի ավարտից հետո `meta get`-ը պետք է վերադարձնի օբյեկտը `version: 1`-ով: Հեռացնելուց հետո ուղղակի որոնումը չպետք է վերադարձնի արժեք.

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

Հատուկ հաշվառման ընթերցումը տարբերում է բացակայող մետադատա բանալին ցանցի կամ հաշիվի անբավարարությունից: Արտադրման կոդը պետք է ստուգի նաեւ ամբողջ JSON արժեքը այն սահմանելուց հետո:

## Խնդիրների լուծում {#troubleshooting}

- Ստանդարտ մուտքը պետք է պարունակում է մեկ գործող JSON արժեք: Strings- ը պետք է JSON մեջբերումներ ունենա. օբյեկտներն ու շարքերը պետք է լավ ձեւավորվեն:
- Մետադատա բանալիները `Name` արժեքներ են եւ վերլուծելուց հետո զգայուն են դեպքերի համար: Պահպանեք կայուն բանալիր բառապաշար, փոխարենը յուրաքանչյուր սխեմայի փոփոխության համար ստեղծեք տարբերակային բանալիներ:
- `--metadata` գործարքի մետամտածն է, այն չի սահմանում գլխավոր գրասենյակի օբյեկտի մետամատածն. Օգտագործեք կազմակերպության `meta set` ենթակառավարումը վերջինիս համար:
- Հաջողակ ներկայացումը, որին հաջորդում է հին ընթերցանությունը, կարող է լինել տարածման հետաձգություն: Սպասեք կիրառված վերջնականության եւ կրկին փորձեք հարցումը, նախքան նորից ուղարկելը:
- Թույլտվության մերժումը բացահայտում է թիրախային օբյեկտը եւ իրավասության սահմանը: Կրկին փորձեք տեղական կամ խնդրեք ճշգրիտ նշանը. Մի տեղափոխեք մասնավոր դիմման տվյալները հանրային մեթադատա դաշտ, որպեսզի խուսափեք մուտքի վերահսկողությունից:
- Երբեք գաղտնի բանալիները, անձնավորական կոճակները, մուտքի տոկենները կամ մեծ փաստաթղթերը չեն պահվում մետադատաներում:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Մետադատա հարցումների ինտեգրման փորձարկումներ փինացված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK գործարքի կառուցողները փակված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [Մետադատա եւ գլխավոր գրքի պահեստավորման տարբերակներ](/hy/guide/configure/metadata-and-store-assets.md)
- [Ուղարկման հղում](/hy/reference/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
