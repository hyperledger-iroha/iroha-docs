---
translation_locale: mn
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Блокчэйн бүртгэлийн төлөвийг лавлах {#query-ledger-state}

## Үр дүн {#outcome}

Аруулагч ба төсөөлөгч Taira JSON нөөцүүдийг уншиж, дараа нь шүүлтүүр, логик хуудаслах, эрэмбэлэлт, татан авах хэмжээ, зөвхөн урд чиглэлийн курсор үргэлжлүүлэлттэй бичсэн Iroha асуулгуудыг ашиглана. Мөн сервер дамжуулсан `--select` хоёртын хувийг үнэлэхээс өмнө сонгогч төсөөлөгчид найдахгүй байх болно.

## Өмнөх шаардлагууд {#prerequisites}

- `curl`, `jq`, Node.js 24, ба одоогийн `iroha` CLI.
- Зөвхөн унших Taira хандалт.
- Гарын үсэг зурсан бичвэр хайлтын жишээний хувьд, Taira эсвэл үүссэн локал сүлжээний клиент тохиргоо.
- Rust жишээний хувьд, зорьсон сүлжээтэй ижил Iroha эх үүсвэрийн шинэчлэлт дээр тогтсон төсөл.

## Алхамууд {#steps}

### 1. Нийтийн Taira нөөцөөр хуудаслах {#_1-page-through-a-public-taira-resource}

Нөөцийн маршрутууд нь самбарууд болон хурдан шалгалтуудад ашигтай. JSON-ийг асууж, хуудсыг бүрэн холбож, хариуг шалгасны дараа програмд зөвхөн шаардлагатай талбарыг төсөвлөөрэй.

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

Энэ HTTP гадаргуу нь `limit` ба `offset`-ийг ашигладаг. Зам хямд тооллын горимыг ашиглах үед орхигдсон эсвэл хязгаарлагдсан `total`-ийг энгийн гэж үзээрэй.

### 2. CLI асуулгыг шүүж, багцлах {#_2-filter-and-batch-a-typed-cli-query}

CLI нь төрөлжсөн давталттай асуулгыг дараалалд оруулж серверийн үргэлжлүүлэх курсоруудыг дотор нь дагадаг. Энд логик үр дүн нь нэг мөрөөр хязгаарлагдсан бол `--fetch-size 1` нь нэг тойрогт авсан хамгийн их багцыг хянадаг.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Шүүлтүүрийг хуудаслахын өмнө хийнэ. Тодорхой асуултад зориулсан төрөлжсөн өгөгдөл шалгуурийг ашигла; данс эсвэл хөрөнгийн шалгуурыг домайндаа аюулгүйгээр дахин ашиглах боломжгүй.

### 3. Тогтвортой мета өгөгдлийн түлхүүрээр эрэмбэлнэ {#_3-sort-by-a-stable-metadata-key}

Татагдсан асуулгын эрэмбэлэлт нь нэг мета өгөгдлийн түлхүүрийн хувьд үсгээр эрэмбэлэгддэг. Тухайн түлхүүргүй зүйлс нь програм хангамжийн гүйцэтгэлийн орчны тодорхойлсон эрэмбэлэлтийг дагадаг, тиймээс цуглуулгын туршид тогтмол бөглөгддөг түлхүүрийг ашигла.

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

Бүртгэлтэй CLI нь `--select` JSON-г тайлбарлаж, сонгогчийн оюуланг илгээдэг боловч одоогийн хөнгөн жинтэй асуулга DSL дээр тэр сонгогчийг серверт үнэлдэггүй. Түрүүнд үүнд проекцийн гэрээ байгуулаарай гэж болохгүй. Зорилтот програм хангамжийн гүйцэтгэх орчин үүнийг дэмжсэний дараа л хэвлэж бичсэн SDK төсөөллийг хэрэглэ, эсвэл баталгаажуулсан үр дүнг клиент талд дээрхтэй адил `jq` эсвэл JavaScript-оор төсөөл.

### 4. Rust давтагчийг бүдэг заагуудыг дагахыг зөвшөөр {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` нь логик үр дүнгийн багцыг хязгаарлана. `FetchSize` нь сервер бүрийн багцыг удирддаг. Буцаж ирсэн итератор нь серверээс үүсгэсэн курсорыг ашиглан үргэлжлэх хүсэлтүүдийг ил тод илгээдэг.

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

`ForwardCursor` нь эрх мэдэлд хамааралтай, процесс-дотроо хэрэглэгдэх, зөвхөн урагш чиглэлтэй байдаг. Хэзээ ч үүнийг задлан шинжлэж, нийлэгжүүлж, эрх олголтын эрх бүхий этгээдүүдийн хооронд хуваалцаж, эсвэл Torii тохиолдлуудад зөөвөрлөх боломжтой резюмэ токен байдлаар хадгалах ёсгүй. Хэрэв хугацаа нь дуусвал, анхны асуултыг санаатайгаар програмын түвшний чекпойнттойгоор дахин эхлүүлнэ.

## Баталгаажуулах {#verify}

Тодорхой домэйн шүүлт нь зөвхөн `wonderland.universal`-ийг буцаах ёстой. Зөвхөн амжилттай CLI гарцыг тоолохын оронд үр дүнг шалгаарай:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Хуудасласан програмын хүсэлтүүдийн хувьд мөн ID-үүд хуудсуудын хооронд давтагддаггүй, хүссэн логик хязгаар хэзээ ч давдаггүй, мөн хугацаа дууссан курсороос дахин оролдоход баримтжуулсан шалгах цэгээс дахин эхэлдэг эсэхийг шалгах хэрэгтэй.

## Алдааг олох болон засах {#troubleshooting}

- Ганц асуулт нь давталттай шүүлтүүр, эрэмбэлэлт, хуудаслах эсвэл татах параметрүүдийг хүлээн авдаггүй. Эдгээр хяналтууд хэрэгтэй бол холбогдох жагсаалтын асуултыг ашиглана уу.
- `fetch_size` нь нийт үр дүнгийн хязгаараа биш, тэгээс ялгаатай багцын дохио юм. Одоогийн анхдагч утга нь `100` бөгөөд програм хангамжийн гүйцэтгэх орчин нь дээд утгаас давсан утгыг хүлээж авахгүй.
- Тодорхойгүй, хугацаа нь дууссан эсвэл гадаад курсор санаатайгаар дахин ашиглагддаггүй. Асуултыг дахин эхлүүл; тунгалаг бус утгыг засах гэж оролдох хэрэггүй.
- Метадатын ангилалт нь ерөнхий талбарын ангилалт биш юм. Хэрэв бүх зүйл сонгосон түлхүүрийг агуулдаггүй бол дутагдсан түлхүүрийн дарааллыг баримтлах эсвэл өөр стратеги сонгох хэрэгтэй.
- CLI нь `--select`-г задлан илгээдэг боловч одоогийн сервер нь хөнгөн сонгогчийн түүврийг үнэлдэггүй. Сервер талын сонгогчийн дэмжлэгийг суулгасан программын гүйцэтгэлийн орчинд баталгаажуулсан тохиолдолд клиент талын проекцыг хэрэглэ.
- Өргөн тэлсэн хязгааргүй асуултууд сүлжээний түншийн ажил, клиентийн санах ой, курсорын амьдралын хугацааны эрсдэлийг нэмэгдүүлдэг. Логик хязгаар тогтоож, хэрэглэгчид тохирсон авах хэмжээ (fetch size)-ийг тохируул.
- Олон нийтийн JSON нөөцийн параметрүүд ба гарын үсэгтэй төрөлжсөн асуулгын параметрүүд нь хоорондоо холбоотой боловч солих боломжгүй сериалчлалын форматууд юм. Төрөлжсөн асуулгын өгөгдлийн саванд SDK эсвэл CLI-ийг илүүд үзнэ үү.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Савлагчийн арын хуудаслах интеграцийн туршилтууд ба тогтсон эх кодын хувилбар](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Бүртгэсэн эх кодын засвар дээрх асуулга үүсгэгч ба сонгогчийн зан байдал](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Бүртгэсэн эх кодын засвар дээрх асуулгын параметрүүд ба курсорын загвар](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Асуултууд](/mn/blockchain/queries.md)
- [Асуулгын лавлагаа](/mn/reference/queries.md)
- [JavaScript ба TypeScript](/mn/guide/tutorials/javascript.md)
