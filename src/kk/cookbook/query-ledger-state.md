---
translation_locale: kk
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Блокчейн регистрінің күйін сұрау {#query-ledger-state}

## Нәтиже {#outcome}

Оқып, Taira JSON ресурстарын проекция жасап, содан кейін сүзгілер, логикалық парақтау, сұрыптау, алу көлемдері және тек алға бағытталған курсор жалғастыруымен типтелген Iroha сұрауларды қолданыңыз. Сондай-ақ, сервер жіберілген `--select` кортежді бағалағанға дейін селектор проекциясына сенбеу керек.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Node.js 24, және ағымдағы `iroha` CLI.
- Тек оқу үшін Taira қолжетімділік.
- Қол қойылған терілген-сұрау мысалдары үшін, Taira немесе жасалған жергілікті желіге арналған клиент конфигурациясы.
- Rust мысалы үшін, жобаны мақсатты желімен бірдей Iroha бастапқы нұсқасына бекітілген.

## Қадамдар {#steps}

### 1. Қоғамдық Taira ресурсты парақтап өтіңіз {#_1-page-through-a-public-taira-resource}

Ресурс жолдары бақылау тақталары мен жылдам тексерулер үшін пайдалы. JSON сұраңыз, әр бетті байлаңыз және қосымшаның жауапты тексергеннен кейін қажет ететін өрістерді ғана жобалаңыз.

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

Бұл HTTP беті `limit` және `offset` пайдаланады. Жоғалдырылған немесе шектелген `total` маршрут арзанырақ санау режимін пайдаланғанда қалыпты деп есептелсін.

### 2. CLI типтелген сұрауды сүзгіден өткізіп, топтастыру {#_2-filter-and-batch-a-typed-cli-query}

CLI типтелген итерациялық сұрауды сериализациялайды және ішкі жағында сервердің жалғастыру курсорларын бақылайды. Мұнда логикалық нәтиже бір жолмен шектелген, ал `--fetch-size 1` әрбір айналымдағы ең көп пакет мөлшерін басқарады.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Сүзу беттілеуден бұрын жүзеге асады. Сұрауға тән типтелген болжамдарды қолданыңыз; есептік жазба немесе активке арналған болжамды домен үшін қауіпсіз қайта қолдануға болмайды.

### 3. Тұрақты метадеректер кілті бойынша сұрыптау {#_3-sort-by-a-stable-metadata-key}

Терілген сұрау сұрыптауы бір метадеректер кілті бойынша лексикографиялық түрде жүреді. Сол кілті жоқ элементтер бағдарламалық қамтамасыз ету орындау ортасының анықтаған тәртібін ұстанады, сондықтан жиынтық бойынша біркелкі толтырылатын кілтті пайдаланыңыз.

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

Тексерілген CLI `--select` JSON парсинг жасап, селектор кортежін жібереді, бірақ ағымдағы жеңіл сұрау DSL сол селекторды серверде бағаламайды. Оған әлі проекция келісімшартын құрмаңыз. Т typed SDK проекцияны тек мақсатты бағдарламалық қамтамасыз ету орындау ортасы оны қолдағаннан кейін пайдаланыңыз немесе тексерілген нәтижені клиент жағында жоғарыдағыдай `jq` немесе JavaScript көмегімен жобалаңыз.

### 4. Rust итераторының мөлдір емес курсорларды орындауына рұқсат ету {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` логикалық нәтиже жиынтығын шектейді. `FetchSize` әрбір сервер пакетіне бақылау жасайды. Қайтарылған итератор сервер шығарған курсорды пайдаланып жалғасу сұрауларын ашық түрде жібереді.

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

`ForwardCursor` билікке бағынатын, процесс-ішілік және тек алға бағытталған. Оны ешқашан талдамаңыз, синтездемеңіз, авторизациялау субъектілері арасында бөліспеңіз немесе оны Torii мысалдары арасында тасымалданатын түйіндеме белгісі ретінде сақтамаңыз. Егер ол мерзімі өткен болса, бастапқы сұрауды мақсатты қолданба деңгейіндегі бақылау нүктесімен қайта бастаңыз.

## Растау {#verify}

Нақты домен сүзгісі тек `wonderland.universal` қайтаруы керек. Тек CLI сәтті шығуды санаудың орнына нәтиженi тексеріңіз:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Беттерге бөлінген қолданба сұраулары үшін, сондай-ақ идентификаторлардың беттер арасында қайталанбауын, сұралған логикалық шектен аспауын және мерзімі өткен курсордан кейін қайта сұрағанда құжатталған бақылау нүктесінен қайта басталатынын тексеріңіз.

## Ақауларды жою {#troubleshooting}

- Бірегей сұраныс итермелі сүзгі, сұрыптау, парақтау немесе алу параметрлерін қабылдамайды. Бұл басқару элементтері қажет болғанда сәйкес тізім сұранысын қолданыңыз.
- `fetch_size` бұл нөлге тең емес пакет көрсеткіші, жалпы нәтиже шегі емес. Ағымдағы әдепкі мәні `100`, және бағдарламалық орындау ортасы оның максималды мәнінен жоғары мәндерді қабылдамайды.
- Белгісіз, мерзімі өтті немесе шетелдік көрсеткіш әдейі қайта пайдалануға жарамсыз. Сұрауды қайта бастаңыз; мөлдір емес мәнді түзетуге тырыспаңыз.
- Метадеректерді сұрыптау жалпы өріс бойынша сұрыптау емес. Егер әрбір элемент таңдалған кілтті ұстамаса, жоқ кілт бойынша тәртіпті құжаттаңыз немесе басқа стратегияны таңдаңыз.
- CLI `--select` талдайды және бағыттайды, бірақ ағымдағы сервер жеңіл селектор қосындысын бағаламайды. Орнатылған бағдарламалық қамтамасыз ету орындалу ортасы үшін сервер жақтағы селектор қолдауы расталғанша клиент жақтағы проекцияны қолданыңыз.
- Кең ауқымды шектелмеген сұраулар желідегі әріптес жұмысы, клиенттің жадысы және курсордың өмір сүру уақыты тәуекелін арттырады. Логикалық шектеу мен тұтынушыға сәйкес алынатын мөлшерді орнатыңыз.
- Қоғамдық JSON ресурс параметрлері мен қол қойылған типтелген-сұраныс параметрлері байланысты, бірақ алмастырылатын сериализация форматтары емес. Типтелген сұраныс деректер контейнерлері үшін SDK немесе CLI қолданған дұрыс.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Пинделген бастапқы код ревизиясында курсорға негізделген беттілеуді интеграциялау тесттері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Бекітілген көз-код нұсқасындағы сұрау құрастырушы мен селектордың әрекеті](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Сұрау параметрлері және курсор моделі бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Сұраулар](/kk/blockchain/queries.md)
- [Сұрау сілтемесі](/kk/reference/queries.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
