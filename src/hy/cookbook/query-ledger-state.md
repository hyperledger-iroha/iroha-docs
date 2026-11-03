---
translation_locale: hy
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Query անել գրանցամատյանի վիճակը {#query-ledger-state}

## Արդյունքը {#outcome}

Կարդացեք և պրոյեկտեք Taira-ի JSON ռեսուրսները, ապա CLI-ից և Rust SDK-ից օգտագործեք Torii-ի հավաքածուների հարցումները՝ ֆիլտրերով, դասավորմամբ, սերվերային պրոյեկցիայով, էջի սահմանաչափերով և անթափանց `next_cursor` շարունակմամբ։ Դուք նաև ցուցակների համար չեք օգտագործի ստորագրված տիպավորված հարցումները, որոնք դրանք չեն ֆիլտրում, չեն դասավորում և չեն պրոյեկտում։

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Node.js 24, եւ ընթացիկ `iroha` CLI.
- Կարդալ միայն Taira մուտք:
- CLI-ի օրինակների համար՝ հաճախորդի կազմաձևում Taira-ի կամ ստեղծված տեղական ցանցի համար։
- Rust օրինակում, նախագիծը կապված է նույն Iroha աղբյուրի վերանայման հետ, ինչ նպատակային ցանցը:

## Քայլեր {#steps}

### 1. Գլխավոր էջ Taira հանրային ռեսուրս {#_1-page-through-a-public-taira-resource}

Resource երթուղիները օգտակար են դաշբորդների եւ ծխի ստուգումների համար: Խնդրեք JSON, կապեք յուրաքանչյուր էջը, եւ նախագծեք միայն այն դաշտերը, որոնք պահանջվում են ծրագրի կողմից պատասխանը ստուգելուց հետո։

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  cursor = page.next_cursor
} while (cursor)
```

:::

Այս HTTP մակերեսը էջավորում է `limit`-ով և անթափանց `next_cursor`-ով; այն անփոփոխ հետ ուղարկեք որպես `cursor`, մինչև այն դառնա `null`։ `total`-ը հայտնվում է միայն այն դեպքում, երբ պահանջում եք `include_total=true`, ինչը պահանջում է ամբողջական սկանավորում։

### 2. Ֆիլտրեք հավաքածուն CLI-ով {#_2-filter-a-collection-with-the-cli}

CLI-ն ֆիլտրը, պրոյեկցիան և էջի չափն ուղարկում է հավաքածուի վերջնակետին և տպում մեկ էջ՝ `{items, next_cursor}`։ Ավելացրեք `--all`՝ `next_cursor`-ին հետևելու համար, մինչև այն դառնա `null`։

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Ֆիլտրումը տեղի է ունենում մինչև էջավորումը։ Յուրաքանչյուր հավաքածու ընդունում է միայն իր սեփական դաշտերը; անհայտ դաշտը ոչնչի հետ չհամընկնելու փոխարեն վերադարձնում է `invalid_filter`։

### 3. Սորտաժել կայուն մեթադատա բանալինով {#_3-sort-by-a-stable-metadata-key}

Հավաքածուի դասավորման բանալիներն ընդունում են հայտարարված դաշտերը և `metadata.<key>`; նվազման կարգի համար բանալուց առաջ դրեք `-`։ Բանալի չունեցող տողերն աճման կարգում դասավորվում են առաջինը, իսկ հավասար արժեքների դեպքում կարգը որոշում է տողի ինքնությունը, ուստի օգտագործեք բանալի, որը հետևողականորեն լրացված է ամբողջ հավաքածուում։

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select`-ը սերվերային պրոյեկցիա է: `--select id,metadata`-ն վերադարձնում է միայն այդ դաշտերը, իսկ անհայտ դաշտը վերադարձնում է `invalid_select`։ Ստորագրված տիպավորված հարցումները միշտ վերադարձնում են ամբողջական տարրեր, ուստի դրանց արդյունքները պրոյեկտեք հաճախորդի կողմում `jq`-ով կամ JavaScript-ով, ինչպես վերևում։

### 4. Թող Rust վերարտադրողը հետեւի անչափանցիկ կուրսորներին: {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit`-ը սահմանում է էջի չափը։ `list`-ի վերադարձրած իտերատորը հաջորդ էջը սերվերի `next_cursor`-ով պահանջում է միայն ընթացիկ էջն սպառելուց հետո, իսկ `take`-ը սահմանափակում է տրամաբանական արդյունքը։ Այստեղ `client`-ը `iroha::blocking::Client` է։

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor`-ը բանալիների հավաքածուի անթափանց դիրք է, որը կապված է իր հավաքածուին, ուղուն, ֆիլտրին և դասավորմանը։ Երբեք մի՛ վերլուծեք կամ մի՛ ստեղծեք այն ձեռքով և մի՛ օգտագործեք այն այլ ֆիլտրով կամ դասավորմամբ; Torii-ն դա մերժում է `invalid_cursor`-ով։ Էջերի միջև ավելացված կամ հեռացված տողերը երբեք չեն ստիպում հաջորդ էջին կրկնել կամ բաց թողնել անկապ տողեր։

## Փորձարկել {#verify}

Դոմենի ճշգրիտ ֆիլտրը պետք է վերադարձնի միայն `universal.universal` ։ Փորձեք ստուգել արդյունքը, այլ ոչ թե հաշվարկել հաջողված CLI ելք միայն.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Էջավորված հավելվածային հարցումների համար ստուգեք նաև, որ ID-ները չեն կրկնվում էջերի միջև, պահանջված տրամաբանական սահմանը երբեք չի գերազանցվում, և մերժված կուրսորից հետո հարցումը վերսկսվում է փաստաթղթավորված ստուգման կետից։

## Խնդիրների լուծում {#troubleshooting}

- Միավոր հարցումը չի ընդունում կրկնվող ֆիլտրի, կարգավորման, էջայնացման կամ վերցնելու պարամետրերը: Օգտագործեք համապատասխան ցուցակի հարցումը, երբ այդ վերահսկողությունները անհրաժեշտ են:
- `limit`-ը էջի չափն է, ոչ թե ընդհանուր արդյունքը: առնվազն 1 և առավելագույնը հանգույցի `torii.app_api_max_list_limit` (լռելյայն 500); Torii-ի լռելյայն արժեքը 100 է։ Ավելին կարդալու համար հետևեք `next_cursor`-ին, `--all`-ին կամ SDK-ի իտերատորին։
- `invalid_cursor`-ը նշանակում է, որ կուրսորը սխալ է ձևավորված կամ պատկանում է այլ հավաքածուի, ուղու, ֆիլտրի կամ դասավորման։ Վերսկսեք հարցումը; մի՛ փորձեք ուղղել անթափանց արժեքը։
- Ընտրողական ֆիլտրը կարող է վերադարձնել կարճ կամ դատարկ էջ ոչ դատարկ `next_cursor`-ով։ Շարունակեք հետևել դրան, մինչև այն դառնա `null`։
- `--filter`-ը և HTTP `filter` պարամետրն ընդունում են Torii-ի տեքստային քերականությունը, օրինակ՝ `id = "universal.universal"` կամ `exists(metadata.tier)`։ JSON պրեդիկատի օբյեկտը ֆիլտրի տեքստ չէ և ձախողվում է որպես անվավեր `filter`։
- Լայն, անսահմանափակ հարցումները մեծացնում են հանգույցների աշխատանքը և հաճախորդի հիշողության օգտագործումը։ Սահմանեք սպառողին համապատասխան տրամաբանական սահման և էջի չափ։
- Ստորագրված `/v1/query`-ն ցուցակագրման API չէ։ Այն ընդունում է եզակի հարցումներ և առանց ֆիլտրի իտերացվող հարցումների մի քանի մեկնարկ, իսկ մյուսները, օրինակ՝ `FindDomains`-ը կամ `FindAssetDefinitions`-ը, մերժում է `signed_query_shape_not_admitted`-ով։ Հավաքածուների վերջնակետերը, CLI-ի `list` հրամանները և SDK-ի հավաքածուների ընթերցիչները օգտագործում են ֆիլտրի, դասավորման և կուրսորի նույն քերականությունը։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Torii-ի հավաքածուների հարցումների պայմանագիրը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Rust-ի հավաքածուների ընթերցումները և կուրսորի իտերատորը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Ստորագրված հարցումների ընդունումը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Հարցումներ](/hy/blockchain/queries.md)
- [Հարցման հղում](/hy/reference/queries.md)
- [JavaScript եւ TypeScript](/hy/guide/tutorials/javascript.md)
