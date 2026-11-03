---
translation_locale: hy
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Գործունական ակտիվներ {#fungible-assets}

## Արդյունքը {#outcome}

Ստուգեք Taira-ի գործող ցանցի ակտիվների սահմանումները և ստեղծված տեղական ցանցում ամբողջությամբ անցեք թողարկման, փոխանցման, այրման և մնացորդի ստուգման հոսքը։ Բաղադրատոմսն օգտագործում է կանոնիկ, առանց նախածանցի Base58 ակտիվի սահմանման ID-ներ, առանց դոմենի I105 հաշվի ID-ներ և վճարի բացահայտ վճարում։

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի նոր տարբերակ, Node.js 24 և ընթացիկ CLIs՝ `iroha` և `kagami`։
- Կարդալ միայն Taira մուտք:
- Գրառումների համար՝ տեղական ցանց `kagami localnet generate --peers 4 --out-dir ./localnet` հրամանով, ինչպես [Iroha-ի գործարկում](/hy/get-started/launch-iroha.md) էջում, `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` հավելումով։ Այն տալիս է `./localnet/client.toml`-ը և Torii-ն `http://127.0.0.1:8080` հասցեում։

## Քայլեր {#steps}

### 1. Taira սահմանումները ստուգեք առանց ստորագրողի: {#_1-inspect-taira-definitions-without-a-signer}

Ակտիվների սահմանումները պարունակում են անթափանց Base58 ID, ցուցադրվող անուն, թողարկման քաղաքականություն, թվային մասշտաբ, ընտրովի կեղծանուն, սեփականատեր, ընտրովի սեփականատեր դոմեն կամ տվյալների տարածք, մնացորդի քաղաքականություն և ընդհանուր քանակ։ Կոնկրետ մնացորդը ներառում է նաև այն պահող հաշիվը և տվյալների տարածքի ընտրովի շրջանակը։

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Ստեղծված կազմաձևման հանրային բանալուց ստացեք տեղական լիազոր հաշիվը, ապա ստեղծեք բանալիների զույգ նոր ստացող հաշվի համար և գրանցեք այն։ Ոչ մի մասնավոր բանալի չի տպվում։

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Օգտագործեք հաճախորդին պատկանող թվային սահմանում {#_3-use-a-client-owned-numeric-definition}

Ծագման բլոկից դուրս սահմանումը գրանցվում է սեփականատեր `--domain`-ի ներքո, որը պատկանում է ստորագրողին, իսկ ստեղծված տեղական ցանցի հաճախորդին ոչ մի դոմեն չի պատկանում։ `--asset-definition-id`-ով ստեղծված տեղական ցանցն արդեն պարունակում է այս սահմանումը: ծագման բլոկն այն գրանցել է անսահմանափակ մասշտաբով, հաճախորդին դարձրել է դրա սեփականատերը և հաճախորդի համար թողարկել է 1,000,000,000 միավոր։

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Մի՛ օգտագործեք այդ ID-ն կրկին Taira-ում։ Հանրային ցանցում գրանցման համար անհրաժեշտ են նոր կանոնիկ ID, ձեր հաշվին պատկանող սեփականատեր դոմեն (որը `ledger asset definition register`-ին փոխանցվում է որպես `--domain`), ցանկացած կեղծանվան համար `CanManageAssetDefinitionAlias` թույլտվության շնորհում և վճարի ֆինանսավորում։

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

Հրկիզվելուց հետո ակնկալեք աղբյուրի մնացորդը `1000000064.50`, նպատակակետի հավասարումը `25.50` եւ ընդհանուր քանակությունը `1000000090.00`.

::: warning Թույլատրելիության սահման

Taira-ում յուրաքանչյուր գրառման համար օգտագործեք `--fee-payer authority`; CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։ Գրանցման համար պետք է լինել սահմանման `--domain`-ի սեփականատերը, իսկ կեղծանվան համար լրացուցիչ անհրաժեշտ է `CanManageAssetDefinitionAlias`։ Թողարկման համար պետք է լինել սահմանման սեփականատերը կամ ունենալ `CanMintAssetWithDefinition` կամ `CanMintAssetToAccount`; փոխանցման և այրման համար անհրաժեշտ է լիազորություն աղբյուրի մնացորդի նկատմամբ։ Faucet-ով ֆինանսավորված հաշիվն ավտոմատ կերպով թողարկող չէ։

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
- Քայլ 2-ը բացահայտորեն գրանցում է նպատակային հաշիվը, ուստի փոխանցումն աշխատում է նաև այն դեպքում, երբ հաշիվների ընդունման ռեժիմը `ExplicitOnly` է։ Նման անվամբ CLI պաշտպանիչը ոչ հաշիվ է գրանցում, ոչ էլ մնացորդ; լրացուցիչ հրահանգ ավելացնելու փոխարեն այն ընդհատում է գործողությունը։
- Վճարի մերժումը տեղի է ունենում մինչև հրահանգի սովորական հաջող կատարումը։ Ընտրեք վճարողին, CLI-ի վճարային առաջարկում ստուգեք վճարային ակտիվը և առավելագույն գումարը, ապա ստուգեք այդ մնացորդը։
- Նույն տեղական ցանցում կրկնակի գործարկումը սկսվում է նախորդ մնացորդներից, իսկ `kagami keys`-ը մերժում է արդեն գոյություն ունեցող `./cookbook-recipient`-ը։ Գործարկեք նոր ստեղծված տեղական ցանց և հեռացրեք այդ գրացուցակը, կամ բացարձակ արժեքների փոխարեն համեմատեք մնացորդների փոփոխությունները։ Երբեք Base58 ID-ն մի՛ փոխարինեք սխալ ձևավորված պատահական տողով։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Աշունների կյանքի շրջանի ինտեգրման փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs):
- [Rust ակտիվների կառուցման օրինակներ փակված commit դեպքում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Գործիքներ](/hy/blockchain/assets.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
- [JavaScript եւ TypeScript](/hy/guide/tutorials/javascript.md)
