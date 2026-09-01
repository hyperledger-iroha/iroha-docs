---
translation_locale: uz
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Reyestr holatini so‘rash {#query-ledger-state}

## Natija {#outcome}

O'qing va Taira JSON resurslarini proyeksiya qiling, so'ngra filtrlar, mantiqiy sahifalash, saralash, olish hajmlari va faqat oldinga kursor davomiyligi bilan yozilgan Iroha so'rovlaridan foydalaning. Shuningdek, siz server oldinga yuborilgan `--select` tupleni baholashdan oldin selektor proyeksiyasiga tayanishni oldini olasiz.

## Oldingi talablar {#prerequisites}

- `curl`, `jq`, Node.js 24, va joriy `iroha` CLI.
- Taira’ga faqat o‘qish huquqi bilan kirish.
- Imzolangan typed-query misollari uchun, Taira uchun mijoz konfiguratsiyasi yoki yaratilgan mahalliy tarmoq.
- Rust misolida, maqsad tarmog‘i bilan bir xil Iroha manbaaviy versiyaga bog‘langan loyiha.

## Qadamlar {#steps}

### 1. Ommaviy Taira manbani ko'zdan kechirish {#_1-page-through-a-public-taira-resource}

Resurs marshrutlari dashboardlar va shuningdek tezkor tekshiruvlar uchun foydalidir. JSON ni so'rang, har bir sahifaga bog'lang va javobni tekshirgandan so'ng faqatgina ilova uchun kerak bo'lgan maydonlarni loyihalang.

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

Bu HTTP sirt `limit` va `offset` dan foydalanadi. Agar yo'nalish arzonroq hisoblash rejimidan foydalansa, tashlab ketilgan yoki cheklangan `total` ni normal deb hisoblang.

### 2. Typlangan CLI so‘rovni filtrlash va guruhlash {#_2-filter-and-batch-a-typed-cli-query}

CLI tiplangan iteratsiya qilinadigan so‘rovni serializatsiya qiladi va ichki tarzda server davomiy kursorlarini kuzatadi. Bu yerda mantiqiy natija bitta qatorda cheklangan, shu bilan birga `--fetch-size 1` har bir safar ishlov berishda olinadigan maksimal paketni nazorat qiladi.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtrlash sahifalashdan oldin sodir bo‘ladi. So‘rovga xos typeli predikatlarni ishlating; hisob yoki aktiv uchun predikat domen uchun xavfsiz ravishda qayta ishlatilolmaydi.

### 3. Barqaror metadata kaliti bo‘yicha saralash {#_3-sort-by-a-stable-metadata-key}

Turlangan so‘rov bitta metama’lumot kaliti bo‘yicha leksikografik saralanadi. Bu kalitga ega bo‘lmagan elementlar bajarish muhiti belgilagan tartibda keladi, shuning uchun butun to‘plamda izchil to‘ldirilgan kalitdan foydalaning.

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

Ro‘yxatdan o‘tgan CLI `--select` JSON ni tahlil qiladi va tanlov tuple'ini uzatadi, lekin joriy yengil vaznli so‘rov DSL ushbu tanlovni serverda baholamaydi. Hali uning atrofida proyeksiya shartnomasini tuzmang. Typed SDK proyeksiyani faqat maqsad dasturiy ta'minot ijro muhiti uni qo‘llab-quvvatlagandan so‘ng ishlating, yoki yuqorida aytilganidek, tasdiqlangan natijani mijoz tomonida `jq` yoki JavaScript bilan proyeksiya qiling.

### 4. Rust iteratordan shaffof bo‘lmagan kursorlarni kuzatishini ruxsat bering {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` mantiqiy natija to'plamini chegaralaydi. `FetchSize` har bir server paketini nazorat qiladi. Qaytarilgan iterator server tomonidan yaratilgan kursor yordamida davom ettirish so‘rovlarini shaffof tarzda yuboradi.

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

A `ForwardCursor` vakolatga bog‘liq, jarayon-ga xos va faqat oldinga qarab ishlaydi. Hech qachon uni pars qilma, sintez qilma, vakolat egasi o‘rtasida ulashma yoki uni portable rezyume token sifatida Torii instansiyalari bo‘ylab saqlama. Agar muddati tugasa, asl so‘rovni maqsadli ilova darajasidagi nazorat nuqtasi bilan qayta boshlang.

## Tekshirish {#verify}

Aniq domen filtri faqat `wonderland.universal` ni qaytarishi kerak. Faqat muvaffaqiyatli CLI chiqishini hisoblash o‘rniga natijani tekshiring:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Sahifalangan ilova so'rovlari uchun, IDlar sahifalar bo'ylab takrorlanmasligini, so'ralgan mantiqiy chegaradan oshmasligini va muddati o'tgan kursorni qayta urinish belgilangan nazorat nuqtasidan qayta boshlanishini ham sinab ko'ring.

## Muammolarni bartaraf etish {#troubleshooting}

- Yagona so'rov iterable filtr, tartiblash, sahifalash yoki olish parametrlarini qabul qilmaydi. Ushbu boshqaruvlar kerak bo'lganda mos keluvchi ro'yxat so'rovidan foydalaning.
- `fetch_size` — natijalarning umumiy chegarasi emas, balki nol bo‘lmagan to‘plam hajmi ko‘rsatmasi. Joriy standart qiymat `100`; bajarish muhiti o‘z maksimumidan katta qiymatlarni rad etadi.
- Noma'lum, muddati o'tgan yoki xorijiy kursor ataylab qayta ishlatilmaydi. So‘rovni qayta boshlang; shaffof bo‘lmagan qiymatni tuzatishga urinmang.
- Metama'lumotlarni tartiblash umumiy maydon bo'yicha tartiblash emas. Agar har bir element tanlangan kalitni olib yurmasa, yetishmayotgan kalit buyurtmasini hujjatlashtiring yoki boshqa strategiyani tanlang.
- CLI `--select` ni tahlil qiladi va uzatadi, lekin joriy server yengil vaznli selektor juftligini baholamaydi. O‘rnatilgan dasturiy ta’minot ish muhiti uchun server tomonidan selektor qo‘llab-quvvatlanishi tasdiqlanmaguncha, mijoz tomonidagi proyeksiyani qo‘llang.
- Keng, chegaralanmagan so‘rovlar tugun ishini, mijoz xotirasi sarfini va kursor umrini oshiradi. Mantiqiy chegara va iste’molchiga mos olish hajmini belgilang.
- Jamoat JSON resurs parametrlar va imzolanmış tipli so'rov parametrlar bog'liq, lekin o'zaro almashtiriladigan serialization formatlari emas. Tipli so'rov ma'lumot konteynerlari uchun SDK yoki CLI ni afzal ko'ring.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Kursorga asoslangan sahifalash integratsion testlari ilg‘or manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [So'rov quruvchisi va tanlovchi xatti-harakati pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [So'rov parametrlari va kursor modeli belgilangan manba-kod tahririda](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [So'rovlar](/uz/blockchain/queries.md)
- [So‘rov havolasi](/uz/reference/queries.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
