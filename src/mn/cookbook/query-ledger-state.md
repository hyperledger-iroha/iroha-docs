---
translation_locale: mn
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Блокчэйн бүртгэлийн төлөвийг лавлах {#query-ledger-state}

## Үр дүн {#outcome}

Taira-ийн JSON нөөцүүдийг уншиж, проекц хийгээд, дараа нь CLI болон Rust SDK-аас Torii-ийн цуглуулгын асуулгуудыг шүүлтүүр, эрэмбэлэлт, сервер талын проекц, хуудасны хязгаар болон тунгалаг бус `next_cursor` үргэлжлүүлэлттэйгээр ашиглана. Мөн та жагсаалтуудыг гарын үсэгтэй төрөлжсөн асуулгаар авахгүй байх болно, учир нь тэдгээр нь жагсаалтыг шүүдэггүй, эрэмбэлдэггүй, проекц хийдэггүй.

## Өмнөх шаардлагууд {#prerequisites}

- `curl`, `jq`, Node.js 24, ба одоогийн `iroha` CLI.
- Зөвхөн унших Taira хандалт.
- CLI жишээнүүдэд: Taira эсвэл үүсгэсэн локал сүлжээний клиентийн тохиргоо.
- Rust жишээний хувьд, зорьсон сүлжээтэй ижил Iroha эх үүсвэрийн шинэчлэлт дээр тогтсон төсөл.

## Алхамууд {#steps}

### 1. Нийтийн Taira нөөцөөр хуудаслах {#_1-page-through-a-public-taira-resource}

Нөөцийн маршрутууд нь самбарууд болон хурдан шалгалтуудад ашигтай. JSON-ийг асууж, хуудсыг бүрэн холбож, хариуг шалгасны дараа програмд зөвхөн шаардлагатай талбарыг төсөвлөөрэй.

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

Энэ HTTP гадаргуу `limit` болон тунгалаг бус `next_cursor`-оор хуудасладаг; түүнийг `null` болох хүртэл өөрчлөлгүйгээр `cursor` болгон буцааж илгээ. `total` нь зөвхөн `include_total=true`-г хүссэн үед гарч ирэх бөгөөд энэ нь бүрэн скан хийхийг шаарддаг.

### 2. CLI-ээр цуглуулгыг шүүх {#_2-filter-a-collection-with-the-cli}

CLI нь шүүлтүүр, проекц болон хуудасны хэмжээг цуглуулгын төгсгөл цэг рүү илгээж, нэг хуудас буюу `{items, next_cursor}`-г хэвлэдэг. `next_cursor`-ийг `null` болох хүртэл дагахын тулд `--all`-г нэм.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Шүүлт хуудаслахаас өмнө хийгддэг. Цуглуулга бүр зөвхөн өөрийн талбаруудыг хүлээн авдаг; үл мэдэгдэх талбар юуг ч тааруулахгүй байхын оронд `invalid_filter` буцаадаг.

### 3. Тогтвортой мета өгөгдлийн түлхүүрээр эрэмбэлнэ {#_3-sort-by-a-stable-metadata-key}

Цуглуулгын эрэмбэлэх түлхүүрүүд зарлагдсан талбарууд болон `metadata.<key>`-г хүлээн авдаг; буурах дарааллаар эрэмбэлэхийн тулд түлхүүрийн өмнө `-` тавь. Өсөх дарааллаар эрэмбэлэхэд тухайн түлхүүргүй мөрүүд эхэнд орох бөгөөд ижил утгатай мөрүүд мөрийн таних тэмдгийн дагуу эрэмбэлэгддэг тул цуглуулгын туршид тогтмол бөглөгдсөн түлхүүрийг ашигла.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` нь сервер талын проекц юм: `--select id,metadata` нь зөвхөн тэдгээр талбаруудыг буцааж, үл мэдэгдэх талбар `invalid_select` буцаадаг. Гарын үсэгтэй төрөлжсөн асуулгууд үргэлж бүтэн зүйлсийг буцаадаг тул тэдгээрийн үр дүнг дээрх шиг `jq` эсвэл JavaScript-ээр клиент талд проекц хий.

### 4. Rust давтагчийг бүдэг заагуудыг дагахыг зөвшөөр {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` нь хуудасны хэмжээг тогтоодог. `list`-ийн буцаасан итератор нь одоогийн хуудсыг бүрэн уншсаны дараа л серверийн `next_cursor`-оор дараагийн хуудсыг хүсдэг бөгөөд `take` нь логик үр дүнг хязгаарладаг. Энд `client` нь `iroha::blocking::Client` юм.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` нь өөрийн цуглуулга, зам, шүүлтүүр болон эрэмбэлэлтэд холбогдсон, тунгалаг бус түлхүүрийн олонлогийн (keyset) байрлал юм. Үүнийг хэзээ ч задлах эсвэл зохиож үүсгэх хэрэггүй бөгөөд өөр шүүлтүүр эсвэл эрэмбэлэлттэй дахин бүү ашигла; Torii үүнийг `invalid_cursor`-оор татгалздаг. Хуудсуудын хооронд нэмэгдсэн эсвэл устгагдсан мөрүүд хожмын хуудсанд хамааралгүй мөрүүдийг давтах эсвэл алгасахад хэзээ ч хүргэхгүй.

## Баталгаажуулах {#verify}

Тодорхой домэйн шүүлт нь зөвхөн `universal.universal`-ийг буцаах ёстой. Зөвхөн амжилттай CLI гарцыг тоолохын оронд үр дүнг шалгаарай:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Хуудасладаг аппликейшны асуулгуудын хувьд мөн ID-ууд хуудсуудын хооронд давтагдахгүй, хүссэн логик хязгаараас хэзээ ч хэтрэхгүй, мөн татгалзсан курсорын дараа баримтжуулсан шалгах цэгээс дахин эхэлдэг эсэхийг туршиж шалга.

## Алдааг олох болон засах {#troubleshooting}

- Ганц асуулт нь давталттай шүүлтүүр, эрэмбэлэлт, хуудаслах эсвэл татах параметрүүдийг хүлээн авдаггүй. Эдгээр хяналтууд хэрэгтэй бол холбогдох жагсаалтын асуултыг ашиглана уу.
- `limit` нь нийт үр дүн биш, хуудасны хэмжээ юм: хамгийн багадаа 1, хамгийн ихдээ зангилааны `torii.app_api_max_list_limit` (анхдагч нь 500); Torii-ийн анхдагч утга 100. Илүү ихийг уншихын тулд `next_cursor`, `--all` эсвэл SDK итераторыг дага.
- `invalid_cursor` нь курсор буруу бүтэцтэй, эсвэл өөр цуглуулга, зам, шүүлтүүр эсвэл эрэмбэлэлтэд хамаардаг гэсэн үг. Асуулгыг дахин эхлүүл; тунгалаг бус утгыг засах гэж бүү оролд.
- Нарийн сонголттой шүүлтүүр `null` биш `next_cursor`-тэй богино эсвэл хоосон хуудас буцааж болно. Түүнийг `null` болох хүртэл үргэлжлүүлэн дага.
- `--filter` болон HTTP-ийн `filter` параметр нь `id = "universal.universal"` эсвэл `exists(metadata.tier)` зэрэг Torii-ийн текст дүрэм зүйг хүлээн авдаг. JSON шалгуурын объект нь шүүлтүүрийн текст биш тул хүчингүй `filter` болж амжилтгүй болдог.
- Өргөн, хязгааргүй асуулгууд зангилаануудын ажил болон клиентийн санах ойн хэрэглээг нэмэгдүүлдэг. Хэрэглэгч талд тохирсон логик хязгаар болон хуудасны хэмжээг тогтоо.
- Гарын үсэгтэй `/v1/query` нь жагсаалтын API биш. Энэ нь ганц үр дүнтэй асуулгууд болон цөөн хэдэн шүүлтүүргүй давтагдах асуулгын эхлэлийг хүлээн авч, `FindDomains` эсвэл `FindAssetDefinitions` зэрэг бусдыг `signed_query_shape_not_admitted`-ээр татгалздаг. Цуглуулгын төгсгөл цэгүүд, CLI-ийн `list` командууд болон SDK-ийн цуглуулга уншигчид шүүлтүүр, эрэмбэлэлт, курсорын нэг ижил дүрэм зүйг хуваалцдаг.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Тогтоосон commit дахь Torii-ийн цуглуулгын асуулгын гэрээ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Тогтоосон commit дахь Rust-ийн цуглуулга унших функцууд болон курсорын итератор](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Тогтоосон commit дахь гарын үсэгтэй асуулгыг хүлээн авах дүрэм](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Асуултууд](/mn/blockchain/queries.md)
- [Асуулгын лавлагаа](/mn/reference/queries.md)
- [JavaScript ба TypeScript](/mn/guide/tutorials/javascript.md)
