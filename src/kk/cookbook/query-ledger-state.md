---
translation_locale: kk
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Сұрақтар тізімі: {#query-ledger-state}

## Нәтижесі {#outcome}

Taira JSON ресурстарын оқып, жобалаңыз, содан кейін сүзгілер, логикалық беттерлеу, сұрыптау, әкелу өлшемдері және алдымен ғана курсордың жалғасуымен түрленіп жазылған Iroha сұрауларды қолданыңыз. Сондай-ақ сервер жіберілген `--select` туплесін бағалауға дейін таңдаушы проекцияға тәуелді болудан аулақ боласыз.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Node.js 24, және ағымдағы `iroha` CLI.
- Тек оқуға арналған Taira қатынасы.
- Қолтаңбаланған типті сұрау салу үлгілері үшін Taira клиентін баптау немесе құрылған жергілікті желі.
- Rust мысалы үшін, жоба мақсатты желімен бірдей Iroha көзді қайта қарауға тіркелді.

## Қадамдар {#steps}

### 1. Taira жалпыға ортақ ресурс арқылы бет {#_1-page-through-a-public-taira-resource}

Ресурс бағыттары панельдер мен түтінді тексеру үшін пайдалы. JSON сұраңыз, әрбір бетті байлаңыз және жауапты тексергеннен кейін қолданбаға қажетті өрістерді ғана көрсетуіңіз керек.

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

Бұл HTTP бетіне `limit` және `offset` қолданылады. Маршрут арзан санақ режимімен жүргенде, қалдырылған немесе шектелген `total` белгісін қалыпты түрде қарау керек.

### 2. CLI түрленген сұранысты сүзгілеу және топтамалау {#_2-filter-and-batch-a-typed-cli-query}

CLI түрлендірілген қайталанатын сұрауды сериалдастырады және серверді жалғастыру курсорларын ішкі түрде бақылайды. Бұл жерде логикалық нәтиже бір жолмен шектеледі, ал `--fetch-size 1` қайту-қайту үшін алынған ең көп партияны басқарады.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Пагинизациядан бұрын сүзгілеу жүргізіледі. Сұраныс-белгілі түрленген предикаттарды қолданыңыз; шот немесе активтің предикатасы домен үшін қауіпсіз қайта пайдаланылмайды.

### 3. Тұрақты метадеректер кілті бойынша сұрыптау {#_3-sort-by-a-stable-metadata-key}

Типті сұрауларды сұрыптау бір метамәдени кілті бойынша лексикографиялық болып табылады. Бұл кілті жоқ элементтер орындалу уақытының анықталған тәртібіне сәйкес келеді, сондықтан жинақ бойынша жүйелі түрде толтырылған кілтті қолданыңыз.

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

Тексерілген CLI `--select` JSON талдап, селектор туплесін қайтарады, бірақ қазіргі жеңіл сұраныс DSL серверде бұл селекторды бағаламайды. SDK түрлендіруді мақсатты орындау уақыты оны қолдағаннан кейін ғана қолдану немесе жоғарыда көрсетілгендей `jq` немесе JavaScript арқылы расталған нәтижелі клиент жағын жобалау.

### 4. Rust итераторының мөлдірсіз курсорларды орындауына рұқсат етіңіз. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` логикалық нәтижелер жиынтығын шектейді. `FetchSize` әрбір сервер партиясын бақылайды. Қайтарылған итератор сервер тудырған курсорды қолдана отырып, жалғастыру сұрақтарын ашықты түрде жібереді.

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

`ForwardCursor` - билікпен байланысты, процеске негізделген және тек алға қарай бағытталады. Оны ешқашан талдамаңыз, синтездеңіз, билік арасында үлестіріңіз немесе оны Torii жағдайларында тасымалданатын резюме белгісі ретінде сақтаңыз. Егер ол аяқталса, бастапқы сұрау салуды қолданба деңгейіндегі қасақана тексеру пунктімен қайта бастаңыз.

## Тексеру {#verify}

Дұрыс домен сүзгісі тек `wonderland.universal` ғана қайтарылуы керек. Нәтижесін тек табысты CLI шығуды есептегеннен гөрі тексеріңіз:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Парақталған қолданбалық сұраулар үшін IDs парақтарында қайталанбайтынын, сұратылған логикалық шекті ешқашан ашпайтынын және мерзімі өткен курсордан кейін қайта басталуын тексеріңіз.

## Қиындықтарды шешу {#troubleshooting}

- Жалғызбасты сұраныс қайталанатын сүзгілерді, сұрыптауды, беттерделуді немесе алу параметрлерін қабылдамайды. Бұл бақылау қажет болған кезде тиісті тізім сұранысын қолданыңыз.
- `fetch_size` - жалпы нәтиже шегі емес, нөлдік партия нұсқасы. Ағымдағы әдеттілік `100` болып табылады, ал орындау уақыты максималдан жоғары мәндерді қабылдамайды.
- Беймәлім, мерзімі өткен немесе шетелдік курсор қасақана қайта қолданылмайды. Сұрау салуды қайта бастаңыз; ашық емес мәнді жөндеуге тырыспаңыз.
- Метадеректерді сұрыптау жалпы өрістік сұрыптау емес. Егер әрбір элементте таңдалған кілті болмаса, жоғалған кілттің ретін құжаттаңыз немесе басқа стратегияны таңдаңыз.
- CLI параметрлері `--select`, бірақ ағымдағы сервер жеңіл селектор туплін бағаламайды. Сервер жағындағы селектордың қолдауы іске қосылған жұмыс уақыты үшін тексерілмесе, клиент жағында проекция қолдану.
- Шексіз кең сұраныстар әріптестер жұмысы, клиенттің есте сақтау қабілеті және курсордың өмірлік тәуекелін арттырады. Тұтынушыға сәйкес келетін логикалық шекті және әкелу өлшемін белгілеңіз.
- Қоғамдық JSON ресурс параметрлері мен қол қойылған түрленген сұрау салу параметрлері өзара байланысты, бірақ алмастырмалы сым пішімі емес. Түрленген сұрау салу конверттері үшін SDK немесе CLI артықшылығы бар.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Пиннеленген commit-де курсормен қамтамасыз етілген бағдарлау интеграциясына тесттер](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Сұраныс жасаушы және таңдаушы мінез-құлқы тырналған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Сұрау салу параметрлері және курсор үлгісі тіктелген commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Сұрақтар](/kk/blockchain/queries.md)
- [Сұраныс анықтамасы](/kk/reference/queries.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
