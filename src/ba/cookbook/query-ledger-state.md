---
translation_locale: ba
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Һорау Леджер торошо {#query-ledger-state}

## Һөҙөмтә {#outcome}

Taira JSON ресурстарын уҡығыҙ һәм проекциялағыҙ, һуңынан CLI һәм Rust SDK аша фильтрҙар, сортлау, сервер яғындағы проекция, бит сиктәре һәм үтә күренмәҫ `next_cursor` дауамы менән Torii коллекция һорауҙарын ҡулланығыҙ. Шулай уҡ исемлектәрҙе ҡул ҡуйылған типлы һорауҙар аша алмаясаҡһығыҙ, сөнки улар исемлектәрҙе фильтрламай, сортламай һәм проекцияламай.

## Шарттар {#prerequisites}

- `curl`, `jq`, Node.js 24, һәм хәҙерге `iroha` CLI.
- Taira уҡырға ғына инеү мөмкинлеге.
- CLI миҫалдары өсөн Taira йәки генерацияланған локаль селтәр өсөн клиент конфигурацияһы.
- Rust миҫалында, проект маҡсатлы селтәр менән бер үк Iroha сығанаҡ ревизияһына ҡуйылған.

## Аҙымдар {#steps}

### 1. Taira асыҡ ресурсы аша битегеҙ. {#_1-page-through-a-public-taira-resource}

Ресурс юлдары приборҙар һәм тәмәке тикшереү өсөн файҙалы. JSON һорағыҙ, һәр битте бәйләгеҙ һәм яуапты тикшергәндән һуң ҡушымтаға кәрәк булған майҙансыҡтарҙы ғына проекциялағыҙ.

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

Был HTTP интерфейсы `limit` һәм үтә күренмәҫ `next_cursor` менән биттәргә бүлә; уны `null` булғансы үҙгәртмәйенсә `cursor` итеп кире ебәрегеҙ. `total` тик `include_total=true` һораһағыҙ ғына күренә, ә был бөтә яҙмаларҙы тулыһынса ҡарап сығыуҙы талап итә.

### 2. CLI менән коллекцияны фильтрлағыҙ {#_2-filter-a-collection-with-the-cli}

CLI фильтрҙы, проекцияны һәм бит үлсәмен коллекцияның API нөктәһенә ебәрә һәм бер битте, `{items, next_cursor}`, баҫтыра. `next_cursor`-ҙы `null` булғансы эҙләп барыу өсөн `--all` өҫтәгеҙ.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Фильтрлау биттәргә бүлеүгә тиклем башҡарыла. Һәр коллекция үҙ яландарын ғына ҡабул итә; билдәһеҙ ялан бер нәмәгә лә тап килмәү урынына `invalid_filter` ҡайтара.

### 3. Тотороҡло метамәғлүмәттәр асҡысы буйынса тәртипкә килтереү. {#_3-sort-by-a-stable-metadata-key}

Коллекцияны сортлау асҡыстары иғлан ителгән яландарҙы һәм `metadata.<key>`-ты ҡабул итә; кәмеү тәртибе өсөн асҡыс алдына `-` ҡуйығыҙ. Был асҡысы булмаған рәттәр үҫеү тәртибендә беренсе килә, ә тигеҙ ҡиммәттәр рәттең идентификаторы буйынса урынлаша, шуға күрә коллекция буйынса эҙмә-эҙлекле тултырылған асҡысты ҡулланығыҙ.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` — сервер яғындағы проекция: `--select id,metadata` тик шул яландарҙы ҡайтара, ә билдәһеҙ ялан `invalid_select` ҡайтара. Ҡул ҡуйылған типлы һорауҙар һәр саҡ тулы элементтарҙы ҡайтара, шуға күрә уларҙың һөҙөмтәләрен юғарылағы кеүек `jq` йәки JavaScript менән клиент яғында проекциялағыҙ.

### 4. Rust итераторға үтә күренмәле курсорҙарҙы үтәргә рөхсәт итегеҙ. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` бит үлсәмен билдәләй. `list` ҡайтарған итератор киләһе битте серверҙың `next_cursor`-ы менән ағымдағы бит тулыһынса уҡылғандан һуң ғына һорай, ә `take` логик һөҙөмтәне сикләй. Бында `client` — `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` — үҙенең коллекцияһына, маршрутына, фильтрына һәм сортлауына бәйләнгән үтә күренмәҫ асҡыстар йыйылмаһы позицияһы. Уны бер ҡасан да анализламағыҙ һәм яһамағыҙ, башҡа фильтр йәки сортлау менән ҡабат ҡулланмағыҙ; Torii быны `invalid_cursor` менән кире ҡаға. Биттәр араһында өҫтәлгән йәки бөтөрөлгән рәттәр бер ҡасан да һуңғыраҡ биттә бәйләнешһеҙ рәттәрҙең ҡабатланыуына йәки төшөп ҡалыуына килтермәй.

## Тикшереү {#verify}

Тоғро домен фильтры бары тик `universal.universal` кире ҡайтарырға тейеш. Һөҙөмтәне тикшерегеҙ, ә уңышҡа ирешкән CLI сығыуын ғына иҫәпләмәгеҙ:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Биттәргә бүленгән ҡушымта һорауҙары өсөн шулай уҡ ID-ларҙың биттәр араһында ҡабатланмауын, һоралған логик сиктең бер ҡасан да артмауын һәм кире ҡағылған курсорҙан һуң һорау документлаштырылған контроль нөктәһенән яңынан башланыуын тикшерегеҙ.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Берҙән-бер һорау ҡабатлана торған фильтр, сортлау, биттәрҙе бүлеү йәки алыу параметрҙарын ҡабул итмәй. Был контроллерҙар кәрәк булғанда тейешле исемлек һорауынан файҙаланығыҙ.
- `limit` — дөйөм һөҙөмтә түгел, ә бит үлсәме: кәмендә 1 һәм иң күбе узелдың `torii.app_api_max_list_limit` ҡиммәте (ғәҙәттә 500); Torii-ҙың ғәҙәттәге ҡиммәте — 100. Күберәк уҡыу өсөн `next_cursor`, `--all` йәки SDK итераторы буйынса барығыҙ.
- `invalid_cursor` курсорҙың дөрөҫ формалаштырылмағанын йәки башҡа коллекцияға, маршрутҡа, фильтрға йәки сортлауға ҡарағанын аңлата. Һорауҙы яңынан башлағыҙ; үтә күренмәҫ ҡиммәтте төҙәтергә тырышмағыҙ.
- Һайлаусан фильтр `null` булмаған `next_cursor` менән ҡыҫҡа йәки буш бит ҡайтарырға мөмкин. Ул `null` булғансы уның буйынса барыуҙы дауам итегеҙ.
- `--filter` һәм HTTP `filter` параметры Torii-ҙың текст грамматикаһын ҡабул итә, мәҫәлән, `id = "universal.universal"` йәки `exists(metadata.tier)`. JSON предикат объекты фильтр тексты түгел һәм дөрөҫ булмаған `filter` булараҡ уңышһыҙлыҡҡа осрай.
- Киң, сикләнмәгән һорауҙар узелдарҙың эшен һәм клиент хәтерен арттыра. Ҡулланыусыға яраҡлы логик сик һәм бит үлсәмен ҡуйығыҙ.
- Ҡул ҡуйылған `/v1/query` — исемлектәр API-һы түгел. Ул берлек һорауҙарҙы һәм итерацион һорауҙарҙың фильтрһыҙ бер нисә башланғысын ҡабул итә, ә башҡаларын, мәҫәлән, `FindDomains` йәки `FindAssetDefinitions`-ты, `signed_query_shape_not_admitted` менән кире ҡаға. Коллекция API нөктәләре, CLI `list` командалары һәм SDK коллекция уҡыусылары бер үк фильтр, сортлау һәм курсор грамматикаһын ҡуллана.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Ҡуйылған commit-тағы Torii коллекция һорауҙары контракты](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Ҡуйылған commit-тағы Rust коллекция уҡыуҙары һәм курсор итераторы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Ҡуйылған commit-тағы ҡултамғалы һорауҙарҙы ҡабул итеү ҡағиҙәләре](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Һорауҙар](/ba/blockchain/queries.md)
- [Һорау буйынса һылтанма](/ba/reference/queries.md)
- [JavaScript һәм TypeScript](/ba/guide/tutorials/javascript.md)
