---
translation_locale: uz
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Query Ledger davlat {#query-ledger-state}

## Natija {#outcome}

O'qish va ko'rsatish Taira JSON resurslar, so'ngra foydalanish bosilgan Iroha filtrlar bilan so'rovlar, mantiqiy sahifalashtirish, sinflash, olib chiqish o'lchamlari va faqat oldinga ko'tarilgan kursorni davom ettirish. Shuningdek , server yuborilgan ma'lumotni baholashdan oldin selektor proyeksiyasiga tayanishdan qochasiz . `--select` To'plang.

## Oldingi shartlar {#prerequisites}

- `curl`, `jq`, Node.js 24, va joriy `iroha` CLI.
- Faqat o'qish uchun Taira kirish.
- Imzolangan tizilgan so'rovlar namunalari uchun Taira uchun mijoz konfiguratsiyasi yoki hosil qilingan mahalliy tarmoq.
- Rust misolida maqsadli tarmoq bilan bir xil Iroha manba tekshiruviga bog'liq loyiha.

## qadamlar {#steps}

### 1. Umumiy Taira resursidan sahifa {#_1-page-through-a-public-taira-resource}

Resource yo'nalishlari dashboardlar va tutun tekshiruvlari uchun foydali. JSON so'rang, har bir sahifani bog'lang va javobni tekshirishdan keyin ilovaga kerak bo'lgan maydonlarni faqat ko'rsating.

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

Ushbu HTTP yuzasida `limit` va `offset` ishlatiladi. Yo'nalishda arzonroq hisob-kitob rejimidan foydalangan bo'lsa, chetda qoldirilgan yoki chegaralashgan `total` ni normal tarzda ko'rib chiqish kerak.

### 2. CLI so'rovini filtrlash va to'plash {#_2-filter-and-batch-a-typed-cli-query}

CLI tizilgan takrorlanadigan so'rovni seriallashtiradi va serverning davom ettirish kursorlarini ichki ravishda kuzatib boradi. Bu erda mantiqiy natija bitta satr bilan cheklanadi, ammo `--fetch-size 1` har bir qaytarib olish uchun maksimal partiyani nazorat qiladi.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtrlash sahifalashtirishdan oldin sodir bo'ladi. So'rovga mos tiplangan predikatlardan foydalaning; hisob yoki aktiv uchun predikat domen uchun xavfsiz qayta ishlatilishi mumkin emas.

### 3. O'zgarmas metadata kalitini ko'rib chiqing {#_3-sort-by-a-stable-metadata-key}

Tiplangan so'rovni sinash bir metadata kalitining leksikografik bo'lib o'tadi. Ushbu kalitsiz elementlar ishga tushirish vaqtining belgilangan tartibiga mos keladi, shuning uchun to'plamda qat'iy ravishda to'plangan kalitdan foydalaning .

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

Checked-in CLI parses `--select` JSON va tanlovchi tuple yuboradi, lekin joriy engil so'rov DSL serverda bu tanlagich baholanmaydi. Bu atrofida hozircha proyektsiya shartnomasini qurmang Faqat maqsadli ish vaqti uni qo'llab-quvvatlaganidan so'ng SDK tizilgan proyeksiyadan foydalaning yoki yuqorida aytib o'tilganlarga ko'ra, tasdiqlangan natijalar mijoz tomonini `jq` yoki JavaScript bilan proyekt qiling.

### 4. Rust iteratorini shaffof bo'lmagan kursorlarga ergashtirsin. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` mantiqiy natijalar to'plamini cheklaydi. `FetchSize` har bir server partiyasini boshqaradi. Qaytarib berilgan iterator server tomonidan yaratilgan kursordan foydalanib davom ettirish so'rovlarini shaffof ravishda yuboradi.

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

`ForwardCursor` vakolatga bog'liq, jarayon-lokal va faqat oldinga ko'ra ishlatiladi. Uni hech qachon tahlil qilmang, sintez qilmang, uni hokimiyatlar o'rtasida bo'lishmang yoki uni Torii holatlarida ko'rinadigan qayta tiklash belgisi sifatida saqlang. Agar u muddati tugagach, dastlabki so'rovni maqsadli dastur darajasidagi nazorat punkti bilan qayta ishga tushiring.

## Tekshirish {#verify}

To'g'ri domen filtrini faqat `wonderland.universal` qaytarish kerak. Faqatgina muvaffaqiyatli CLI chiqishni hisoblab chiqishdan ko'ra natijani tekshirib ko'ring:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Sahifalashtirilgan dastur so'rovlari uchun IDs sahifalar bo'ylab takrorlanmasligini, talab qilingan mantiqiy chegara hech qachon o'tkazib yuborilmasligini va muddati tugagandan keyin kursorni qayta ishga tushirishni tekshirish.

## Muammolarni hal qilish {#troubleshooting}

- Bir xil so'rov takrorlanadigan filtr, sinflash, sahifalashtirish yoki olish parametrlarini qabul qilmaydi. Ushbu nazoratlar zarur bo'lganda tegishli ro'yxat so'rovidan foydalaning.
- `fetch_size` to'liq natija chegarasi emas, balki nol bo'lmagan partiya ko'rsatkichidir. Joriy andoza `100` hisoblanadi va ish vaqti o'z maksimalidan yuqori qiymatlarni rad etadi.
- Noma'lum, o'tkazib yuborilgan yoki chet el kursoridan qasddan qayta foydalanish mumkin emas. So'rovni qaytadan boshlash; shaffof bo'lmagan qiymatni tuzatishga urinmang.
- Metadatalarni sinchkovlik qilish umumiy maydonni sinchkovlashtirish emas. Agar har bir elementda tanlangan kalit mavjud bo'lmasa, yo'qolgan kalit tartibini hujjatlashtiring yoki boshqa strategiyani tanlang.
- CLI `--select`ni tahlil qiladi va etkazib beradi, ammo joriy server yengil tanlovchi tupleni baholamaydi. Server tarafidagi tanlovchi qo'llab-quvvatlanishi ishga tushirilgan ish vaqti uchun tasdiqlangan bo'lmasa, mijoz tomoni proyeksiyasini qo'llash.
- Keng cheklanmagan so'rovlar tengdoshlarning ishini, mijoz xotirasini va kursorning umrbod xavfini oshiradi. Iste'molchiga mos bo'lgan mantiqiy chegara va olish hajmini belgilash.
- Umumiy JSON resurs parametrlari va imzolangan tiklangan so'rov parametrlari bir-biri bilan bog'liq, ammo almashtiriladigan sim formatlari emas. Tiklangan so'rovi qopqog'lari uchun SDK yoki CLI ni afzal ko'ring.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Kursor tomonidan qo'llab-quvvatlanadigan sahifalashtirish integratsiyasi testlari pinned commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs)
- [Query builder va selektor xatti-harakatlari pinned commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Query parametrlari va kursor modeli pined commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs)
- [So'rovlar](/uz/blockchain/queries.md)
- [So'rov uchun ma'lumot](/uz/reference/queries.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
