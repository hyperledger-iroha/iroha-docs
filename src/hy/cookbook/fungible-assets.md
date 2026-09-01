---
translation_locale: hy
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Գործունական ակտիվներ {#fungible-assets}

## Արդյունքը {#outcome}

Ստուգեք կենդանի Taira ակտիվների սահմանումները եւ լրացրեք գրանցման, դրամապանակի, փոխանցման, այրման եւ մնացորդի ստուգման հոսքը ստեղծված տեղական ցանցում: բաղադրատոմսը օգտագործում է կանոնական չփոխարինված Base58 ակտիվի սահմանումը IDs, տիրույթի համար հավասարեցված կեղծանունները, տիրույթ չունեցող I105 հաշիվը IDs եւ բացարձակ վճարման վճարը։

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ, Node.js 24, եւ հոսքը `iroha` CLI
- Կարդալ միայն Taira մուտք:
- Գրելու ընթացքի համար ստեղծված տեղական ցանցը [Առաջարկում Iroha](/hy/get-started/launch-iroha.md), `./localnet/client.toml` եւ Torii հետ `http://127.0.0.1:8080`:

## Քայլեր {#steps}

### 1. Taira սահմանումները ստուգեք առանց ստորագրողի: {#_1-inspect-taira-definitions-without-a-signer}

Աշունների սահմանումները պարունակում են անբացատրելի Base58 ID, ցուցադրման անուն, mintability քաղաքականություն, թվային մասշտաբ, ընտրանքային alias, սեփականատեր եւ ընդհանուր քանակ. կոնկրետ մնացորդը նաեւ ներառում է իր տիրապետող հաշվին եւ ընտրանքական տվյալների տարածքի շրջանակը:

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Գործարկեք JavaScript ձեւը `node taira-assets.mjs`: Հանրային ակտիվները IDs միայն Base58 արժեքներ են, ընթերցելի արժեք, ինչպիսիք են `cookbook_credit#wonderland.universal`-ն անանուն է, որը լուծվում է դրանցից մեկի համար IDs.

### 2. Պատրաստեք տեղական լիազոր հաշիվը եւ նպատակակետը {#_2-prepare-the-local-authority-and-destination}

Տեղական լիազոր հաշիվը հանեք ստեղծված կոնֆիգում գտնվող հանրային բանալից եւ ընտրեք այլ գրանցված հաշիվ ՝ որպես ստացողի: Ոչ մի մասնավոր բանալին չի տպագրվում:

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Գրանցեք թվային սահմանումը {#_3-register-a-numeric-definition}

Այս տեղական-միայն ID հավատարիմ է Base58 ակտիվի սահմանման անվավեր հասցեն: Անանունը մատակարարում է մարդկային ընթերցելի `domain.dataspace` արտացոլումը: Scale `2` թույլ է տալիս երկու մասնավոր թվեր. բաց թողնելով `--mint-once` ՝ պահպանվում է նախնական `Infinitely` քաղաքականությունը:

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Մի օգտագործեք ID-ը կրկին Taira: Հանրային ցանցում գրանցումը պահանջում է նոր կանոնիկ ID, ձեր դիմման համար հատկացված դոմեյն/անուն անուն, վճարային ֆինանսավորում եւ վազքի ժամանակի ակտիվների գրանցման թույլտվություն.

### 4. Մինետ, փոխանցում եւ այրումը {#_4-mint-transfer-and-burn}

Բոլոր գրելու հրամանները բացարձակապես ընտրում են լիազոր հաշիվը որպես վճարման վճարող: CLI -ը նշում է ճշգրիտ գործարքը նախքան ստորագրումը եւ սպասվում է անկանխատեսելիորեն:

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Հրկիզվելուց հետո ակնկալեք աղբյուրի մնացորդը `64.50`, նպատակակետի հավասարումը `25.50` եւ ընդհանուր քանակությունը `90.00`.

::: warning Թույլատրելիության սահման

Taira-ում միացրեք faucet ստացված `taira.tx-metadata.json` եւ օգտագործեք `--fee-payer authority` յուրաքանչյուր գրման համար: Գրանցումը եւ մետաղադրելը պահանջում են ակտիվ վավերացնողի թույլտվությունները; փոխանցումը եւ այրումը պահանջում են աղբյուրի մնացորդի լիազորություն: Ջրհեղից ֆինանսավորվող հաշիվը ավտոմատ կերպով չի հանդիսանում թողնող.

:::

## Փորձարկել {#verify}

Կարդացեք երկու կոնկրետ մնացորդները, ապա՝ սահմանումը։ Հաջողության չափանիշը գործողությունից հետո վիճակի այս query-ներն են, ոչ թե միայն ուղարկման ստացականը։

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Գործարկման պնդումները պետք է համեմատեն թվային արժեքները որպես ֆիքսված կետի տասնամյակներ, այլ ոչ թե բինար թողվող կետերի արժեքներ, եւ պետք է ստուգեն ID սահմանումը, ինչպես նաեւ հաշիվը:

## Խնդիրների լուծում {#troubleshooting}

- ID պարունակող `#` կեղծանուն է կամ կոնկրետ մնացորդ բառացի, եւ ոչ թե կանոնական ակտիվի սահմանում ID: Օգտագործեք բաց Base58 արժեքը `--definition` կամ անցեք կապված կեղծանվան ՝ `--definition-alias`:
- `Scale` սխալները նշանակում են, որ մի քանակություն ունի ավելի շատ մասնավոր թվեր, քան սահմանումը թույլ է տալիս:
- `Mintability` մերժումը նշանակում է, որ `Once`, `Not` կամ `Limited(n)` քաղաքականությունը սպառել է կամ արգելել է մետաղադրույքը: Մի՛ վերանորոգեք պատմությունը: Օգտագործեք սահմանման հարցում վերադարձված քաղաքականությունը:
- Քայլ 2-ը միտումնավոր ընտրում է գրանցված destination account։ Եթե asset admission-ը `ExplicitOnly` է, փոխանցումից առաջ authorized flow-ով ստեղծեք destination balance-ը։ Նման անունով CLI guard-ը account կամ balance չի գրանցում. այլ instruction ավելացնելու փոխարեն այն ընդհատում է գործողությունը։
- Հարկի մերժումը տեղի է ունենում նախքան սովորական հրահանգների հաջողությունը: Ընտրեք վճարողը, օգտագործեք ցանցի վճարային ակտիվի մետադատները եւ ստուգեք դրա մնացորդը:
- Եթե ֆիքսված տեղական սահմանումը արդեն գոյություն ունի ավելի վաղ վազումից, մեկնարկեք նոր ստեղծված տեղական ցանց կամ շարունակեք դրա առկա վիճակը: Երբեք չփոխարինեք Base58 ID սխալ ձեւավորված պատահական շղթան։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Աշունների կյանքի շրջանի ինտեգրման փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs):
- [Rust ակտիվների կառուցման օրինակներ փակված commit դեպքում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Գործիքներ](/hy/blockchain/assets.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
- [JavaScript եւ TypeScript](/hy/guide/tutorials/javascript.md)
