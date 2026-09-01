---
translation_locale: ba
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Һорау Леджер торошо {#query-ledger-state}

## Һөҙөмтә {#outcome}

Taira JSON ресурстарын уҡығыҙ һәм проектлағыҙ, һуңынан фильтрҙар, логик биттәрҙе бүлеү, сортировкалау, алып барыу үлсәмдәре һәм алға ғына курсор дауам итеү менән типләнгән Iroha һорауҙарын ҡулланығыҙ. Шулай уҡ сервер ебәрелгән `--select` туплеһын баһалағанға тиклем һайлаусы проекцияһына таянмаҫһығыҙ.

## Шарттар {#prerequisites}

- `curl`, `jq`, Node.js 24, һәм хәҙерге `iroha` CLI.
- Taira уҡырға ғына инеү мөмкинлеге.
- Ҡул ҡуйылған типланған һорау миҫалдары өсөн Taira йәки локаль селтәр өсөн клиент конфигурацияһы.
- Rust миҫалында, проект маҡсатлы селтәр менән бер үк Iroha сығанаҡ ревизияһына ҡуйылған.

## Аҙымдар {#steps}

### 1. Taira асыҡ ресурсы аша битегеҙ. {#_1-page-through-a-public-taira-resource}

Ресурс юлдары приборҙар һәм тәмәке тикшереү өсөн файҙалы. JSON һорағыҙ, һәр битте бәйләгеҙ һәм яуапты тикшергәндән һуң ҡушымтаға кәрәк булған майҙансыҡтарҙы ғына проекциялағыҙ.

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

Был HTTP өҫкө йөҙөндә `limit` һәм `offset` ҡулланыла. Маршрут арзаныраҡ иҫәпләү режимын ҡулланғанда ғәҙәттәгесә ситләштерелгән йәки сикләнгән `total` менән мөғәмәлә итегеҙ.

### 2. CLI тип яҙылған һорауҙы фильтрлау һәм партиялаштырыу. {#_2-filter-and-batch-a-typed-cli-query}

CLI типографик ҡабатлана торған һорауҙы сериаллаштыра һәм сервер дауам итеү курсорҙарын эске яҡтан күҙәтә. Бында логик һөҙөмтә бер рәт менән сикләнә, ә `--fetch-size 1` бер тапҡыр ҡайтыу буйынса алынған максималь партияны контролдә тота.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtering pagination-дан алда башҡарыла. Query-ға махсус typed predicates ҡулланығыҙ; account йәки asset өсөн predicate-ты domain өсөн хәүефһеҙ рәүештә ҡабат ҡулланып булмай.

### 3. Тотороҡло метамәғлүмәттәр асҡысы буйынса тәртипкә килтереү. {#_3-sort-by-a-stable-metadata-key}

Типланған һорауҙар сортылау бер метамәғлүмәт клавишаһы өҫтөндә лексикографик. Был клавишаһыҙ элементтар үтәү ваҡытының билдәләнгән тәртибен тота, шуға күрә тупланма буйлап эҙмә-эҙлекле тултырылған клавишаны ҡулланығыҙ.

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

Тикшерелгән CLI `--select` JSON параметрҙы анализлай һәм һайлап алыу туплын кире ебәрә, әммә ағымдағы еңел һорау DSL серверҙа был һайлаусыны баһаламай. Уның тирәләй проекция контракты төҙөмә әле. SDK тип яҙылған проекцияны тик маҡсатлы ваҡыт уны хуплағандан һуң ғына ҡулланығыҙ йәки юғарыла күрһәтелгәнсә, `jq` йәки JavaScript менән раҫланған һөҙөмтә клиенты яғында проекция итегеҙ.

### 4. Rust итераторға үтә күренмәле курсорҙарҙы үтәргә рөхсәт итегеҙ. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` логик һөҙөмтәләр йыйылмаһын сикләй. `FetchSize` һәр сервер партияларын контролдә тота. кире ҡайтарылған итератор сервер тыуҙырған курсорҙы ҡулланып үтә күренмәле рәүештә дауам итеү үтенестәрен ебәрә.

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

`ForwardCursor` - вәкәләтле иҫәп менән бәйләнгән, процестарҙа урындағы һәм бары тик алдау өсөн генә. Уны бер ҡасан да анализламағыҙ, синтезлағыҙ, вәкәләтле иҫәптәр араһында бүлегеҙ йәки уны Torii осраҡтарында портатив резюме токены булараҡ һаҡлағыҙ. Әгәр ул тамамланһа, төп һорауҙы маҡсатлы ҡулланыу кимәлендәге контроль пункты менән ҡайтанан башларға кәрәк.

## Тикшереү {#verify}

Тоғро домен фильтры бары тик `wonderland.universal` кире ҡайтарырға тейеш. Һөҙөмтәне тикшерегеҙ, ә уңышҡа ирешкән CLI сығыуын ғына иҫәпләмәгеҙ:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Страницалы ҡушымта һорауҙары өсөн, шулай уҡ тикшерегеҙ, IDs биттәре аша ҡабатланмай, һоралған логик сик бер ҡасан да үтәлмәй һәм документлаштырылған контролдә тотоу пунктынан курсорҙың ваҡыты бөткәндән һуң яңынан эшләй башлаясаҡ.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Берҙән-бер һорау ҡабатлана торған фильтр, сортлау, биттәрҙе бүлеү йәки алыу параметрҙарын ҡабул итмәй. Был контроллерҙар кәрәк булғанда тейешле исемлек һорауынан файҙаланығыҙ.
- `fetch_size` - дөйөм һөҙөмтә сиге түгел, ә нуль булмаған партия күрһәткесе. Хәҙерге ҡалыплы билдәһе `100`, һәм йүгереү ваҡыты уның максимумынан юғары булған ҡиммәттәрҙе кире ҡаға.
- Билдәһеҙ, иҫкергән йәки сит ил курсоры үҙ белдеге менән ҡабаттан ҡулланылмай. Һорауҙы яңынан башларға; үтә күренмәле баһаны ремонтларға тырышмағыҙ.
- Метамәғлүмәттәрҙе сортлау дөйөм майҙансыҡтарҙы сортлау түгел. Әгәр һәр пунктта һайланған асҡыс булмаһа, юғалған асҡыс тәртибен документлаштырығыҙ йәки икенсе стратегияны һайлағыҙ.
- CLI `--select` анализлай һәм күсерә, әммә ағымдағы сервер еңел һайлаусы туплын баһаламай. Сервер яғы селектор ярҙамы ҡулланылған эшләү ваҡыты өсөн раҫланмаһа, клиент яғында проекция ҡулланырға.
- Киң сикһеҙ һорауҙар пирҙары эше, клиент хәтерен һәм курсор ғүмере хәүефен арттыра. Кулланыусыға яраҡлы логик сикләү һәм сумма күләме билдәләгеҙ.
- Йәмәғәт JSON ресурс параметрҙары һәм ҡул ҡуйылған типланған һорау параметрҙары бәйле, әммә бер-береһен алмаштыра алған сериализация форматтары түгел. Типланған һорау конверттары өсөн SDK йәки CLI ҡулланығыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Ҡуйылған commit-та курсорға нигеҙләнгән pagination интеграция һынауҙары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Һорау төҙөүсе һәм һайлап алыусының ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs) тәртибе
- [Һорауҙар параметрҙары һәм курсор моделе ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs).
- [Һорауҙар](/ba/blockchain/queries.md)
- [Һорау буйынса һылтанма](/ba/reference/queries.md)
- [JavaScript һәм TypeScript](/ba/guide/tutorials/javascript.md)
