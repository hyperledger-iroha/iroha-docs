---
translation_locale: uz
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# So‘rovlar {#queries}

Hodisa obunalari va filtrlar blokcheyn holatidagi o‘zgarishlarni kuzata oladi. Joriy holatni bevosita ko‘rish kerak bo‘lsa, so‘rovdan foydalaning.

So‘rovlar ko‘rsatmalarga o‘xshash kichik obyektlardir. Tugunning joriy global holat ko‘rinishidan ma’lumot olish uchun so‘rovni Iroha tuguniga yuboring.

Tarmoq boshqa ma’lumotlarni ham taqdim etishi mumkin. So‘raladigan global holat ma’lumoti — har bir Iroha tarmog‘ida mavjudligi kafolatlangan yagona ma’lumot turi.

Har bir Iroha joylashtirishida boshqa ma’lumotlar ham mavjud bo‘lishi mumkin. Masalan, telemetriya ma’lumotlarini taqdim etish tarmoq ma’murlariga bog‘liq: hisoblash quvvatini asosiy ishga emas, uni kuzatishga ajratish-ajratmaslikni ular hal qiladi. Hisob balansini ko‘rish kabi ayrim imkoniyatlar esa doim talab qilinadi.

So‘rov natijalarini tugun tomonida bir vaqtning o‘zida [tartiblash](#sorting), [sahifalash](#pagination) va [filtrlash](#filters) mumkin. Tartiblash metama’lumot kalitlari bo‘yicha leksikografik bajariladi. Filtrlash domen uchun maxsus mezonlardan, masalan IP manzil niqobidan, mantiqiy amallar bilan birlashtirilgan `begins_with` kabi quyi satr usullarigacha turli tamoyillarga asoslanishi mumkin.

## Taira-da sinab ko‘rish {#try-it-on-taira}

Taira odatiy resurslar uchun JSON orqali faqat o‘qiladigan so‘rov yordamchilarini taqdim etadi. SDK-ni ulashdan avval sahifalash va javoblarni qayta ishlashni mashq qilish uchun ulardan foydalaning:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Ilovani tekshirishda bu tezkor sinovlarni imzolangan tranzaksiya sinovlaridan alohida tuting. Faqat o‘qiladigan so‘rovning xatosi odatda imzolovchi sozlamasidan avval so‘nggi nuqta mavjudligi, tarmoqqa ulanish yoki yo‘nalish mosligi muammosini ko‘rsatadi.

## Soʻrovni yaratish {#create-a-query}

SDK yoki CLI-ning tiplashtirilgan so‘rov quruvchilaridan foydalaning. Masalan, joriy ma’lumotlar modeli hisoblarni ro‘yxatlash uchun `FindAccounts` ni taqdim etadi:

```rust
let query = FindAccounts;
```

Quyida Alice aktivlarini topadigan so‘rov misoli keltirilgan:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Sahifalash {#pagination}

Bitta natijali va kichik takrorlanuvchi so‘rovlarni `client.request` orqali yuborib, natijani bir martada olish mumkin.

Biroq `FindAccounts`, `FindAssets` yoki `FindBlocks` kabi keng takrorlanuvchi so‘rovlar katta natija majmuasini qaytarishi mumkin. Tugun va mijoz yukini kamaytirish uchun sahifalashdan foydalaning.

`Pagination` yaratish uchun `client.request_with_pagination(query, pagination)` ni chaqiring; `pagination` quyidagicha tuziladi:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtrlar {#filters}

So‘rov yaratishda faqat belgilangan filtrga mos natijalarni qaytarish uchun filtrdan foydalanish mumkin.

Filtrlar so‘rovga xosdir. Masalan, hisob so‘rovlarini hisob identifikatori yoki metama’lumot bo‘yicha, aktiv so‘rovlarini esa aktiv ta’rifi, egasi bo‘lgan hisob yoki domen proyeksiyasi bo‘yicha toraytirish mumkin. Filtr turi so‘rov natijasi turiga mos bo‘lishi uchun imkon qadar SDK-ning tiplashtirilgan so‘rov quruvchilaridan foydalaning.

## Tartiblash {#sorting}

So‘rov tuzilayotganda tartiblash kaliti berilsa, Iroha obyektlarni [metama’lumot](/uz/blockchain/metadata.md) bo‘yicha leksikografik tartiblashi mumkin. Odatdagi misolda hisoblarda `registered-on` metama’lumot yozuvi bo‘ladi; u bo‘yicha tartiblash hisoblarni ro‘yxatdan o‘tkazish tarixini ko‘rsatadi.

Tartiblash faqat [metama’lumotga ega obyektlarga](/uz/blockchain/metadata.md) qo‘llanadi, chunki so‘rov natijalari metama’lumot kaliti bo‘yicha tartiblanadi.

Tartiblashni sahifalash va filtrlar bilan birlashtirish mumkin. Tartiblash ixtiyoriy imkoniyatdir; sahifalanadigan so‘rovlarning aksariyatiga u kerak bo‘lmaydi.

## Ma’lumotnoma {#reference}

Batafsil ma’lumot uchun [mavjud so‘rovlar ro‘yxatiga](/uz/reference/queries.md) qarang.
