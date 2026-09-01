---
translation_locale: hy
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Query անել գրանցամատյանի վիճակը {#query-ledger-state}

## Արդյունքը {#outcome}

Կարդացեք եւ նախագծեք Taira JSON ռեսուրսները, այնուհետեւ օգտագործեք տիպված Iroha հարցումները ֆիլտրերով, տրամաբանական էջավորմամբ, կարգավորումով, վերցնելու չափերով եւ միայն առաջընթացային կուրսորի շարունակությամբ: Դուք նաեւ խուսափում եք կախված լինելու ընտրողի արտացոլման վրա, նախքան սերվերը գնահատելու է փոխանցված `--select` tuple- ը.

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Node.js 24, եւ ընթացիկ `iroha` CLI.
- Կարդալ միայն Taira մուտք:
- ստորագրված տիպավորված հարցումների օրինակների համար Taira կամ ստեղծված տեղական ցանցի հաճախորդի կարգավորումը:
- Rust օրինակում, նախագիծը կապված է նույն Iroha աղբյուրի վերանայման հետ, ինչ նպատակային ցանցը:

## Քայլեր {#steps}

### 1. Գլխավոր էջ Taira հանրային ռեսուրս {#_1-page-through-a-public-taira-resource}

Resource երթուղիները օգտակար են դաշբորդների եւ ծխի ստուգումների համար: Խնդրեք JSON, կապեք յուրաքանչյուր էջը, եւ նախագծեք միայն այն դաշտերը, որոնք պահանջվում են ծրագրի կողմից պատասխանը ստուգելուց հետո։

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
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
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

Այս HTTP մակերեւույթը օգտագործում է `limit` եւ `offset`: Հաշվի առնելով, որ երթուղին օգտագործում է ավելի էժան հաշվարկային ռեժիմ, բաց թողնված կամ սահմանված `total` կետը պետք է դիտարկվի որպես սովորական:

### 2. Ֆիլտրեք եւ խմբացրեք CLI տիպված հարցումը {#_2-filter-and-batch-a-typed-cli-query}

CLI-ը սերիալացնում է տիպված կրկնվող հարցումը եւ հետեւում է սերվերի շարունակականության կուրսորներին ներքին: Այստեղ տրամաբանական արդյունքը սահմանափակվում է մեկ շարքով, մինչդեռ `--fetch-size 1` -ն վերահսկում է ամեն մի երթեւեկության ընթացքում բերված առավելագույն խմբաքանակը:

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Ֆիլտրումը տեղի է ունենում էջավորման առաջ: Օգտագործեք հարցման հատուկ տիպված նախադասություններ. հաշիվի կամ ակտիվի նախադասություն չի կարող անվտանգ վերաօգտագործվել դոմենի համար:

### 3. Սորտաժել կայուն մեթադատա բանալինով {#_3-sort-by-a-stable-metadata-key}

Տիպված հարցման կարգավորումը բառապաշարային է մեկ մետադատա բանալի վրա: Առանց այդ բանալին պարունակվող տարրերը հետեւում են վազման ժամանակի սահմանված կարգավորմանը, այնպես որ օգտագործեք մի բանալին, որը համահունչ է հավաքածուի ամբողջությամբ:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

Փաստագրված CLI-ը վերլուծում է `--select` JSON եւ փոխանցում է ընտրողի թուպլին, բայց ներկայիս թեթեւ հարցումը DSL չի գնահատում այն ընտրողը սերվերում: Դեռեւս դրա շուրջ մի նախագծման պայմանագիր չեն կառուցում. Օգտագործեք SDK տիպված նախագծումը միայն այն բանից հետո, երբ թիրախային վազման ժամանակը աջակցում է դրան, կամ վավերացված արդյունքի հաճախորդի կողմը ներկայացրեք `jq` կամ JavaScript ՝ ինչպես նշված է վերեւում:

### 4. Թող Rust վերարտադրողը հետեւի անչափանցիկ կուրսորներին: {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` սահմանափակում է տրամաբանական արդյունքների հավաքածուն: `FetchSize` վերահսկում է յուրաքանչյուր սերվերի խմբաքանակ. վերադարձված վերարտադրողը թափանցիկորեն ուղարկում է շարունակման խնդրանքներ ՝ օգտագործելով սերվերի կողմից ստեղծված դասիչը:

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` -ը լիազորությունների վրա է հիմնված, գործընթացային տեղական եւ միայն հետագա: Երբեք մի վերլուծեք այն, սինթեզիրացրեք այն, կիսեք այն լիազոր հաշիվների միջեւ կամ պահպանեք այն որպես բեռնունակ վերարտադրման տոքեր Torii դեպքերում: Եթե այն ավարտվում է, վերսկսեք սկզբնական հարցումը ծրագրային մակարդակի դիտավորյալ ստուգման կետով:

## Փորձարկել {#verify}

Դոմենի ճշգրիտ ֆիլտրը պետք է վերադարձնի միայն `wonderland.universal` ։ Փորձեք ստուգել արդյունքը, այլ ոչ թե հաշվարկել հաջողված CLI ելք միայն.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Պահանջվող հավելվածների հարցումների համար նաեւ ստուգեք, որ IDs չի կրկնվում տարբեր էջերում, պահանջված տրամաբանական սահմանը երբեք չի գերազանցվում, եւ ժամկետն անցած պրոցեսորից հետո կրկին սկսվում է փաստաթղթավորված վերահսկողության կետից:

## Խնդիրների լուծում {#troubleshooting}

- Միավոր հարցումը չի ընդունում կրկնվող ֆիլտրի, կարգավորման, էջայնացման կամ վերցնելու պարամետրերը: Օգտագործեք համապատասխան ցուցակի հարցումը, երբ այդ վերահսկողությունները անհրաժեշտ են:
- `fetch_size` ոչ զրոյական խմբաքանակի հուշում է, այլ ոչ թե ընդհանուր արդյունքի սահմանը: Ներկայիս կանխորոշումը `100` է, եւ վազման ժամանակը մերժում է առավելագույնից բարձր արժեքները:
- Անհայտ, ժամկետով անցած կամ օտար կուրսորը դիտավորյալ չի կարող կրկնակի օգտագործվել: Վերագործարկեք հարցումը. Մի փորձեք վերականգնել անչափահաս արժեքը:
- Մետադատայի դասակարգումը ընդհանուր դաշտային դասակարգում չէ: Եթե յուրաքանչյուր կետ չի պարունակում ընտրված բանալին, փաստաթղթագրեք բացակայում է բանալին կարգը կամ ընտրեք այլ ռազմավարություն:
- CLI-ը վերլուծում եւ փոխանցում է `--select`, բայց ներկայիս սերվերը չի գնահատում թեթեւ ընտրիչի թուպլին: կիրառեք հաճախորդի կողմից նախագծումը, քանի դեռ սերվերի կողմից ընտրողի աջակցությունը հաստատված չէ տեղակայված վազման ժամանակի համար:
- Տարածաշրջանային անսահմանափակ հարցումները մեծացնում են հանգույցների աշխատանքը, հաճախորդի հիշողությունը եւ կուրսորի կյանքի ռիսկը: Սահմանեք տրամաբանական սահման եւ գնել չափը համապատասխան սպառողի համար.
- Հանրային JSON ռեսուրսային պարամետրերը եւ ստորագրված տիպավորված հարցման պարամետրները կապված են, բայց չեն փոխանակելի ցանցային ձևաչափեր: Տիպավորված հարցումների փաթեթների համար նախընտրեք SDK կամ CLI:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Cursor-backed pagination ինտեգրման փորձարկումները pinned commit- ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Հարցման ստեղծողի եւ ընտրողի վարքագիծը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Հարցման պարամետրերը եւ կուրսորի մոդելը փինված commit- ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs):
- [Հարցումներ](/hy/blockchain/queries.md)
- [Հարցման հղում](/hy/reference/queries.md)
- [JavaScript եւ TypeScript](/hy/guide/tutorials/javascript.md)
