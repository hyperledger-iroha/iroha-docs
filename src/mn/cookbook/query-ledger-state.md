---
translation_locale: mn
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Сонирхуулалт "Леджер"-ийн байдал {#query-ledger-state}

## Үр дүн {#outcome}

Судалгаа, зураг төсөл Taira JSON нөөц, дараа нь ашигласан Iroha филтр, логик хуудасчлалт, ангилал, олох хэмжээ, зөвхөн илтгэх курсорын үргэлжлэлтэй асуултууд. Түүнчлэн сервер дамжуулсан мэдээллийг үнэлэхээс өмнө сонгогчдын проекцинд итгэхээс зайлсхийх болно `--select` -Түбл.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Node.js 24, одоогийн `iroha` CLI.
- Зөвхөн уншдаг Taira хангамж.
- Гарын үсэг зурсан хайлтын жишээний хувьд Taira эсвэл үүсгэсэн орон нутгийн сүлжээний үйлчлүүлэгч тохируулалт.
- Rust жишээний хувьд төсөл нь зорилтот сүлжээтэй ижил Iroha эх үүсвэрийн шинэчилсэн найруулгад холбогдсон байна.

## Хадгалт {#steps}

### 1. Taira олон нийтийн нөөцээр хуудсан {#_1-page-through-a-public-taira-resource}

Ресурсын замыг дашборд болон дулааны шалгалт хийхэд ашигладаг. JSON -ийг асууж, бүх хуудсыг байлгаж, хариуг шалгасны дараа зөвхөн хэрэглээнд шаардлагатай талбайдыг дэлгэцүүлээрэй.

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

Энэ HTTP гадаргуу нь `limit` болон `offset`-ийг ашигладаг. Замын хөдөлгөөнд арзон тооны хэв маяг хэрэглэдэг бол орхигдсон эсвэл хязгаарлагдсан `total`-ыг хэвийн байдлаар авч үзнэ.

### 2. CLI дуудлагаг ангижруулж, цуврал болго {#_2-filter-and-batch-a-typed-cli-query}

CLI нь түрүүлсэн эргэлтийн асуултыг цуглуулж, серверийн үргэлжлүүлэлтийн курсоруудыг дотооддоо дагадаг. Энд логикийн үр дүн нь нэг шугамд хязгаарлагдмал бөгөөд `--fetch-size 1` нь эргэн ирэх тутамд авсан хамгийн их багцг удирдаж байна .

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Сэтгэгдэл нь хуудасчлалын өмнө явагдана. Судалгааны тодорхой хэлбэртэй predicates ашиглах; бүртгэл эсвэл хөрөнгийн predicate-ийг доменийн хувьд аюулгүй дахин ашиглаж чадахгүй.

### 3. тогтвортой метабарааны түлхүүрээр ангилах {#_3-sort-by-a-stable-metadata-key}

Тавигдсан хайлтын ангилал нь нэг метабарааны түлхүүр дээр лексикографик байдаг. Энэ түлхэггүй элементууд гүйлтийн цагийн тодорхойлолтыг дагадаг, тиймээс цуглуулгын дагуу тогтмол дүүрсэн түлхлийг ашиглана.

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

Тавигдсан CLI нь `--select` JSON-ийг шалгаж, сонгогч туплиг шилжүүлнэ. Гэхдээ одоогийн хөнгөн заалтад DSL энэ сонгогчийг серверийн дээр үнэлдэггүй байна. SDK төслийг зөвхөн зорилтот гүйлгээний цаг хугацааг дэмжсэн дараа ашиглах, эсвэл одоогоор баталгаажуулсан үр дүнгийн үйлчлүүлэгч талыг `jq` эсвэл JavaScript-ээр зураг төсөллөх.

### 4. Rust итератор нь үл ил тод курсордыг дагаж мөрдөх ёстой {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` нь логикийн үр дүнгийн багтыг хязгаарладаг. `FetchSize` нь серверийн бүрэлдэхүүнийг удирдаж байна. Буцаасан итератор нь серверээс үүсгэсэн курсоор дамжуулан үргэлжлүүлэлтийн хүсэлтийг илгээдэг

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

`ForwardCursor` нь эрх мэдэлд хамааралтай, үйл явцын орон нутгийн болон цаашид л явагддаг. Үүнийг хэзээ ч шинжилгээ хийх, синтезлах, байгууллагуудын хооронд хуваалцах, эсвэл Torii тохиолдлын дунд нэвтрүүлэгтэй сурталчилгааны токен болгон хэвээр үлдээх хэрэггүй. Хэрэв энэ хугацаа дууссан бол анхны асуултыг зориулалтаар хэрэглэлийн түвшний хяналтын цэгээр дахин эхлүүлээрэй.

## Бүртгэнэ {#verify}

Тодорхой доменийн филтр нь зөвхөн `wonderland.universal` -ийг буцааж өгөх ёстой. Зөвхөн амжилттай CLI гарахын оронд үр дүнг шалгах:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Үүнд IDs нь олон хуудас дээр давтагдахгүй, хүссэн логикийн хязгаарыг хэзээ ч хэтрүүлэхгүй гэдгийг шинжилгээ хийх бөгөөд мөрийн хугацаа дууссан дараа дахин туршиж үзэх нь баримтаттай хяналтын цэгээс эхэлдэг.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- Нэг удаагийн хайлт нь эргэлт хийх филтр, төрөлжүүлэх, хуудасчлах эсвэл олох параметрүүдийг хүлээн зөвшөөрдөггүй. Эдгээр удирдлагууд шаардлагатай бол холбогдох жагсаалтын хайрыг ашигла.
- `fetch_size` нь нөлөөгүй цуврал нээлт, нийт үр дүнгийн хязгаар биш юм. Одоогийн урьдчилсан хэлбэр нь `100` бөгөөд гүйлтийн хугацаа нь хамгийн их түвшинээс дээш хэмжээнүүдийг үгүйсгэнэ.
- Мэддэггүй, дууссан эсвэл гадаад курсор нь санаачлан дахин ашиглах боломжгүй. Судалгааг дахин эхлүүлээрэй; ил тод үнэлгээний засварыг хийх оролдлого бүү хий.
- Metadata-ын ангилал нь ерөнхий талбайны ангилал биш юм. Хэрэв бүх элемент сонгогдсон түлхүүртэй биш бол гатуурсан түлхүүдийн дараалалтыг бичиж, эсвэл өөр стратеги сонгох.
- CLI нь `--select` -ийг шалгаж, шилжүүлнэ. Гэхдээ одоогийн сервер нь хөнгөн сонгогч туплиг үнэлдэггүй. Серверийн талын сонгогчдын дэмжлэг ашиглах цаг хугацаатай холбоотойгоор баталгаажуулахгүй бол үйлчлүүлэгч тал дахь проекцийг хэрэглэж болно.
- Хөдөлмөрийн өргөн хүрээтэй хязгааргүй асуултууд нь хамтын ажил, үйлчлүүлэгчдийн дурсамж, курсорын амьдралын эрсдлийг нэмэгдүүлж байна. Хэрэглэгчдэд тохиромжтой логик хязгаарыг байлгах.
- Олон нийтийн JSON нөөцийн параметр болон гарын үсэг зурсан хайлтын параметр нь хамааралтай боловч хоорондоо солилцох утасны формат биш юм. Тайлагдсан хайлтын хуудас дээр SDK эсвэл CLI-ийг сонгоно.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Cursor-д дэмжлэг үзүүлсэн pagination интеграцийн туршилтууд pinned commit дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Хэрэглэлийн бүтээн байгуулагч болон сонгогчдын зан үйл нь pinned commit дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Хэрэглэлийн параметр болон курсорын загварыг тавигдсан commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Судалгаа](/mn/blockchain/queries.md)
- [Судалгааны сэнс ](/mn/reference/queries.md)
- [JavaScript болон TypeScript](/mn/guide/tutorials/javascript.md)
