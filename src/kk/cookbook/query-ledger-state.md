---
translation_locale: kk
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Блокчейн регистрінің күйін сұрау {#query-ledger-state}

## Нәтиже {#outcome}

Taira JSON ресурстарын оқып, проекциялаңыз, содан кейін CLI мен Rust SDK арқылы сүзгілер, сұрыптау, сервер жағындағы проекция, бет шектеулері және мөлдір емес `next_cursor` жалғасуымен Torii жинақ сұрауларын пайдаланыңыз. Сондай-ақ тізімдер үшін қол қойылған типтелген сұрауларды қолданбайсыз, себебі олар тізімдерді сүзбейді, сұрыптамайды және проекцияламайды.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Node.js 24, және ағымдағы `iroha` CLI.
- Тек оқу үшін Taira қолжетімділік.
- CLI мысалдары үшін Taira немесе жасалған жергілікті желіге арналған клиент конфигурациясы.
- Rust мысалы үшін, жобаны мақсатты желімен бірдей Iroha бастапқы нұсқасына бекітілген.

## Қадамдар {#steps}

### 1. Қоғамдық Taira ресурсты парақтап өтіңіз {#_1-page-through-a-public-taira-resource}

Ресурс жолдары бақылау тақталары мен жылдам тексерулер үшін пайдалы. JSON сұраңыз, әр бетті байлаңыз және қосымшаның жауапты тексергеннен кейін қажет ететін өрістерді ғана жобалаңыз.

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

Бұл HTTP беті `limit` және мөлдір емес `next_cursor` арқылы беттерге бөлінеді; ол `null` болғанша оны өзгертпестен `cursor` ретінде кері жіберіңіз. `total` тек `include_total=true` сұрағанда ғана пайда болады, ал бұл толық сканерлеуді қажет етеді.

### 2. Жинақты CLI арқылы сүзу {#_2-filter-a-collection-with-the-cli}

CLI сүзгіні, проекцияны және бет өлшемін жинақтың соңғы нүктесіне жіберіп, бір бетті, `{items, next_cursor}`, басып шығарады. `next_cursor` мәні `null` болғанша оны бақылау үшін `--all` қосыңыз.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Сүзу беттерге бөлуден бұрын орындалады. Әр жинақ тек өз өрістерін қабылдайды; белгісіз өріс ештеңеге сәйкес келмеудің орнына `invalid_filter` қайтарады.

### 3. Тұрақты метадеректер кілті бойынша сұрыптау {#_3-sort-by-a-stable-metadata-key}

Жинақты сұрыптау кілттері жарияланған өрістерді және `metadata.<key>` пішімін қабылдайды; кему ретімен сұрыптау үшін кілттің алдына `-` қойыңыз. Кілті жоқ жолдар өсу ретінде бірінші тұрады, ал тең мәндер жолдың сәйкестігі бойынша реттеледі, сондықтан бүкіл жинақта біркелкі толтырылған кілтті пайдаланыңыз.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` — сервер жағындағы проекция: `--select id,metadata` тек сол өрістерді қайтарады, ал белгісіз өріс `invalid_select` қайтарады. Қол қойылған типтелген сұраулар әрқашан толық элементтерді қайтарады, сондықтан олардың нәтижелерін жоғарыдағыдай `jq` немесе JavaScript арқылы клиент жағында проекциялаңыз.

### 4. Rust итераторының мөлдір емес курсорларды орындауына рұқсат ету {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` бет өлшемін орнатады. `list` қайтарған итератор келесі бетті сервердің `next_cursor` мәнімен тек ағымдағы бет толық өңделгеннен кейін сұрайды, ал `take` логикалық нәтижені шектейді. Мұнда `client` — `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` — өз жинағына, жолына, сүзгісіне және сұрыптауына байланған кілттер жиынындағы мөлдір емес позиция. Оны ешқашан талдамаңыз немесе қолдан жасамаңыз және басқа сүзгімен не сұрыптаумен қайта пайдаланбаңыз; Torii мұны `invalid_cursor` арқылы қабылдамайды. Беттер арасында қосылған немесе жойылған жолдар келесі бетте байланыссыз жолдардың қайталануына немесе өткізіп алынуына ешқашан әкелмейді.

## Растау {#verify}

Нақты домен сүзгісі тек `universal.universal` қайтаруы керек. Тек CLI сәтті шығуды санаудың орнына нәтиженi тексеріңіз:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Беттерге бөлінген қолданба сұраулары үшін ID-лердің беттер арасында қайталанбайтынын, сұралған логикалық шектен ешқашан аспайтынын және қабылданбаған курсордан кейін сұрау құжатталған бақылау нүктесінен қайта басталатынын да тексеріңіз.

## Ақауларды жою {#troubleshooting}

- Бірегей сұраныс итермелі сүзгі, сұрыптау, парақтау немесе алу параметрлерін қабылдамайды. Бұл басқару элементтері қажет болғанда сәйкес тізім сұранысын қолданыңыз.
- `limit` — жалпы нәтиже емес, бет өлшемі: кемінде 1 және ең көбі түйіннің `torii.app_api_max_list_limit` мәні (әдепкі бойынша 500); Torii-дің әдепкі мәні — 100. Көбірек оқу үшін `next_cursor`, `--all` немесе SDK итераторын пайдаланыңыз.
- `invalid_cursor` курсордың дұрыс құрылмағанын немесе басқа жинаққа, жолға, сүзгіге не сұрыптауға тиесілі екенін білдіреді. Сұрауды қайта бастаңыз; мөлдір емес мәнді түзетуге тырыспаңыз.
- Іріктеуші сүзгі бос емес `next_cursor` мәнімен қысқа немесе бос бетті қайтаруы мүмкін. Ол `null` болғанша оны бақылауды жалғастырыңыз.
- `--filter` және HTTP `filter` параметрі Torii мәтіндік грамматикасын қабылдайды, мысалы, `id = "universal.universal"` немесе `exists(metadata.tier)`. JSON предикат нысаны сүзгі мәтіні емес және жарамсыз `filter` ретінде сәтсіз аяқталады.
- Кең, шектелмеген сұраулар желі түйіндерінің жұмысын және клиент жадының жұмсалуын арттырады. Тұтынушыға сәйкес логикалық шекті және бет өлшемін орнатыңыз.
- Қол қойылған `/v1/query` — тізімдеу API-і емес. Ол дара сұрауларды және сүзгісіз итерацияланатын сұраулардың бірнеше бастамасын қабылдайды, ал басқаларын, мысалы, `FindDomains` немесе `FindAssetDefinitions` сұрауларын, `signed_query_shape_not_admitted` арқылы қабылдамайды. Жинақтардың соңғы нүктелері, CLI `list` командалары және SDK жинақ оқырмандары бір сүзгі, сұрыптау және курсор грамматикасын ортақ пайдаланады.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бекітілген бастапқы код нұсқасындағы Torii жинақ сұрауларының келісімшарты](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Бекітілген бастапқы код нұсқасындағы Rust жинақтарын оқу және курсор итераторы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Бекітілген бастапқы код нұсқасындағы қол қойылған сұрауларды қабылдау](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Сұраулар](/kk/blockchain/queries.md)
- [Сұрау сілтемесі](/kk/reference/queries.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
