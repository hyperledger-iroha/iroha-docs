---
translation_locale: uz
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Savollar {#queries}

Garchi blokchainning holati to'g'risida ko'p ma'lumotlarni, biz ilgari ko'rsatganimizdek, voqealar bo'yicha abonent va filtr yordamida qiziqarli hodisalarga cheklash mumkin bo'lsa-da, ba'zan siz yanada bevosita yondashishingiz kerak. So'rovlarni kiriting.

So'rovlar Iroha tengdoshlariga yuborilganda, hozirgi dunyo holatining tafsilotlari bilan javobni keltirib chiqaradigan kichik ko'rsatmalarga o'xshash ob'ektlardir.

Bu to'g'ridan-to'g'ri tarmoqda mavjud bo'lgan yagona ma'lumot emas, lekin barcha tarmoqlarda mavjud bo'lishi kafolatlangan yagona ma'lumotlar.

Iroha ning har bir ishga tushirilishi uchun boshqa ma'lumotlar mavjud bo'lishi mumkin. Masalan, telemetriya ma'lumotlarining mavjudligi tarmoq boshqaruvchilariga bog'liq. Ishni bajarish uchun uni ishlatishning o'rniga ishlash quvvatini taqsimlash yoki yo'qligi butunlay ularning qaroridir. haqiqiy ish. Boshqa tomondan, ba'zi funktsiyalar har doim kerak bo'ladi, masalan, hisob raqamingizga kirish huquqi.

So'rovlarning natijalari bir vaqtning o'zida [](#sorting), [paginated](#pagination) va [filtered](#filters) peer-side bilan tartibga solinadi. Sorting metadata kalitlarida lexikografik ravishda amalga oshiriladi. Filtrlash turli xil tamoyillarga ko'ra amalga oshirilishi mumkin, domenga mos (shaxsiy IP manzil filtrlari maskasi) dan `begins_with` kabi sub-satrning usullariga qadar mantiqiy operatsiyalarni qo'shish.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Taira umumiy manbalar uchun faqat o'qiladigan so'rov yordamchilarini JSON orqali ochib beradi. SDK kodlashdan oldin sahifalashtirish va javoblarni boshqarish mashg'ulotlari uchun ulardan foydalaning:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Ilova diagnostikasi uchun ushbu tutun tekshiruvlarini imzolangan tranzaksiya sinovlaridan ajratib qo'ying. Faqat o'qishga mo'ljallangan so'rov muvaffaqiyatsizligi odatda imzolashchining o'rnatilishini ko'rsatishdan oldin oxirgi nuqtalar mavjudligiga, tarmoqlarga erishish imkoniyatiga yoki yo'nalish moslashtirilishiga ishora qiladi.

## Soʻrovni yaratish {#create-a-query}

SDK yoki CLI fayllaridan tiklangan so'rovlarni yaratish vositalaridan foydalaning. Misol uchun, joriy ma'lumotlar modeli `FindAccounts` ni ro'yxatga olish hisob raqamlari uchun aniqlaydi:

```rust
let query = FindAccounts;
```

Mana Alisning mol-mulkini topgan so'rovning misoli:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Sahifalar {#pagination}

Bitta so'rov va kichik takrorlanadigan so'rovlar uchun siz `client.request` dan foydalanib, so'rovni yuborishingiz va natijani bir marta olishingiz mumkin.

Biroq, `FindAccounts`, `FindAssets` yoki `FindBlocks` kabi keng takrorlanadigan so'rovlar katta natija setlarini qaytarishi mumkin. Tengdoshlar va mijozlarga yukni kamaytirish uchun sahifalashdan foydalanish.

`Pagination`ni yaratish uchun siz `client.request_with_pagination(query, pagination)` raqamiga qo'ng'iroq qilishingiz kerak, u yerda `pagination` quyidagicha qurilgan:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filterlar {#filters}

So'rovni yaratganingizda filtrdan faqat belgilangan filterga mos bo'lgan natijalarni qaytarish uchun foydalanishingiz mumkin.

Filterlar so'rovga mos. Misol uchun, hisob so'rovlari hisobning identifikatsiyasi yoki metama'lumotlar orqali tortilishi mumkin, aktiv so'rovlarini esa aktiv ta'riflanishi, egasi hisobi yoki domen proyeksiyasi orqali tortilishlari mumkin. Iloji bo'lsa, SDK ning yozib olingan so'rov qurilmalaridan foydalaning, shunda filtr turi so'rov chiqariladigan turi bilan mos keladi.

## Sortlash {#sorting}

Iroha so'rovni qurishda tartiblash uchun kalitni taqdim etsangiz, [ metadata](/uz/blockchain/metadata.md) bilan obʼektlarni leksikografik ravishda tartibga solishi mumkin. Oddiy foydalanuv holatlari hisoblar uchun `registered-on` metadata kirimi boʻlishi kerak.

Sortlash faqat [ metadatalarga ega bo'lgan entitetlar uchun qo'llaniladi ](/uz/blockchain/metadata.md), chunki so'rov natijalarini sinchkovlik qilish uchun metadata kalitidan foydalanish kerak.

Sortlashni sahifalashtirish va filtrlar bilan birlashtirishingiz mumkin. Shuni yodda tutingki, sortlash tanlov xususiyati bo'lib, sahifalashtirishdagi so'rovlarning aksariyati unga muhtoj emas.

## Ma'lumotnoma {#reference}

Ular haqida batafsil ma'lumot olish uchun [ mavjud so'rovlar ro'yxatini ](/uz/reference/queries.md) tekshiring.
