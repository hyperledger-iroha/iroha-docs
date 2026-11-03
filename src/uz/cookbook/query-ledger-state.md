---
translation_locale: uz
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Reyestr holatini so‘rash {#query-ledger-state}

## Natija {#outcome}

Taira JSON resurslarini o‘qing va proyeksiya qiling, so‘ng CLI va Rust SDK orqali filtrlar, saralash, server tomonidagi proyeksiya, sahifa chegaralari va shaffof bo‘lmagan `next_cursor` davomi bilan Torii to‘plam so‘rovlaridan foydalaning. Shuningdek, ro‘yxatlarni imzolangan turlangan so‘rovlar orqali olmaysiz, chunki ular ro‘yxatlarni filtrlamaydi, saralamaydi va proyeksiya qilmaydi.

## Oldingi talablar {#prerequisites}

- `curl`, `jq`, Node.js 24, va joriy `iroha` CLI.
- Taira’ga faqat o‘qish huquqi bilan kirish.
- CLI misollari uchun Taira yoki yaratilgan mahalliy tarmoq uchun mijoz sozlamasi.
- Rust misolida, maqsad tarmog‘i bilan bir xil Iroha manbaaviy versiyaga bog‘langan loyiha.

## Qadamlar {#steps}

### 1. Ommaviy Taira manbani ko'zdan kechirish {#_1-page-through-a-public-taira-resource}

Resurs marshrutlari dashboardlar va shuningdek tezkor tekshiruvlar uchun foydalidir. JSON ni so'rang, har bir sahifaga bog'lang va javobni tekshirgandan so'ng faqatgina ilova uchun kerak bo'lgan maydonlarni loyihalang.

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

Bu HTTP interfeysi `limit` va shaffof bo‘lmagan `next_cursor` bilan sahifalaydi; uni `null` bo‘lguncha o‘zgartirmasdan `cursor` sifatida qaytarib yuboring. `total` faqat `include_total=true` ni so‘raganingizda paydo bo‘ladi va bu to‘liq skanerlashni talab qiladi.

### 2. CLI yordamida to‘plamni filtrlash {#_2-filter-a-collection-with-the-cli}

CLI filtr, proyeksiya va sahifa hajmini to‘plamning so‘nggi nuqtasiga yuboradi va bitta sahifani, `{items, next_cursor}` ni chiqaradi. `next_cursor` ni `null` bo‘lguncha kuzatish uchun `--all` ni qo‘shing.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Filtrlash sahifalashdan oldin sodir bo‘ladi. Har bir to‘plam faqat o‘z maydonlarini qabul qiladi; noma’lum maydon hech narsaga mos kelmaslik o‘rniga `invalid_filter` qaytaradi.

### 3. Barqaror metadata kaliti bo‘yicha saralash {#_3-sort-by-a-stable-metadata-key}

To‘plamni saralash kalitlari e’lon qilingan maydonlarni va `metadata.<key>` ni qabul qiladi; kamayish tartibi uchun kalit oldiga `-` qo‘ying. O‘sish tartibida kalitga ega bo‘lmagan qatorlar birinchi keladi, teng qiymatlar esa qator identifikatori bo‘yicha tartiblanadi, shuning uchun butun to‘plamda izchil to‘ldirilgan kalitdan foydalaning.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` — server tomonidagi proyeksiya: `--select id,metadata` faqat shu maydonlarni qaytaradi, noma’lum maydon esa `invalid_select` qaytaradi. Imzolangan turlangan so‘rovlar har doim to‘liq elementlarni qaytaradi, shuning uchun ularning natijalarini yuqoridagidek mijoz tomonida `jq` yoki JavaScript bilan proyeksiya qiling.

### 4. Rust iteratordan shaffof bo‘lmagan kursorlarni kuzatishini ruxsat bering {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` sahifa hajmini belgilaydi. `list` qaytargan iterator keyingi sahifani serverning `next_cursor` qiymati bilan faqat joriy sahifa to‘liq o‘qilgandan keyin so‘raydi, `take` esa mantiqiy natijani cheklaydi. Bu yerda `client` — `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` — o‘z to‘plami, yo‘li, filtri va saralashiga bog‘langan, kalitlar to‘plami bo‘yicha shaffof bo‘lmagan pozitsiya. Uni hech qachon tahlil qilmang yoki o‘zingiz yasamang va boshqa filtr yoki saralash bilan qayta ishlatmang; Torii buni `invalid_cursor` bilan rad etadi. Sahifalar orasida qo‘shilgan yoki o‘chirilgan qatorlar keyingi sahifada aloqasiz qatorlarning takrorlanishiga yoki tushib qolishiga hech qachon sabab bo‘lmaydi.

## Tekshirish {#verify}

Aniq domen filtri faqat `universal.universal` ni qaytarishi kerak. Faqat muvaffaqiyatli CLI chiqishini hisoblash o‘rniga natijani tekshiring:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Sahifalangan ilova so‘rovlari uchun ID-lar sahifalar bo‘ylab takrorlanmasligini, so‘ralgan mantiqiy chegaradan hech qachon oshib ketilmasligini va rad etilgan kursor hujjatlashtirilgan nazorat nuqtasidan qayta boshlanishini ham sinab ko‘ring.

## Muammolarni bartaraf etish {#troubleshooting}

- Yagona so'rov iterable filtr, tartiblash, sahifalash yoki olish parametrlarini qabul qilmaydi. Ushbu boshqaruvlar kerak bo'lganda mos keluvchi ro'yxat so'rovidan foydalaning.
- `limit` — umumiy natija emas, sahifa hajmi: kamida 1 va ko‘pi bilan tugunning `torii.app_api_max_list_limit` qiymati (standart 500); Torii standarti 100. Ko‘proq o‘qish uchun `next_cursor`, `--all` yoki SDK iteratoriga amal qiling.
- `invalid_cursor` kursor noto‘g‘ri shakllanganini yoki boshqa to‘plam, yo‘l, filtr yoki saralashga tegishli ekanini anglatadi. So‘rovni qayta boshlang; shaffof bo‘lmagan qiymatni tuzatishga urinmang.
- Kam qatorga mos keladigan filtr `null` bo‘lmagan `next_cursor` bilan qisqa yoki bo‘sh sahifa qaytarishi mumkin. U `null` bo‘lguncha unga amal qilishda davom eting.
- `--filter` va HTTP `filter` parametri Torii-ning matnli grammatikasini qabul qiladi, masalan `id = "universal.universal"` yoki `exists(metadata.tier)`. JSON predikat obyekti filtr matni emas va yaroqsiz `filter` sifatida xato beradi.
- Keng, chegaralanmagan so‘rovlar tugun ishini va mijoz xotirasi sarfini oshiradi. Mantiqiy chegara va iste’molchiga mos sahifa hajmini belgilang.
- Imzolangan `/v1/query` ro‘yxat olish API-si emas. U yakka so‘rovlarni va filtrlanmagan bir nechta iteratsiyali boshlang‘ich so‘rovlarni qabul qiladi, boshqalarini, masalan `FindDomains` yoki `FindAssetDefinitions` ni, `signed_query_shape_not_admitted` bilan rad etadi. To‘plamlarning so‘nggi nuqtalari, CLI `list` buyruqlari va SDK to‘plam o‘quvchilari yagona filtr, saralash va kursor grammatikasidan foydalanadi.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi Torii to‘plam so‘rovlari kelishuvi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Mahkamlangan commitdagi Rust to‘plam o‘qishlari va kursor iteratori](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Mahkamlangan commitdagi imzolangan so‘rovlarni qabul qilish](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [So'rovlar](/uz/blockchain/queries.md)
- [So‘rov havolasi](/uz/reference/queries.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
