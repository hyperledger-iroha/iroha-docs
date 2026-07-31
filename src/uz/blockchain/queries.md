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

Garchi blokchainning holati haqida ma'lumotlarning ko'p qismi
Biz ilgari ko'rsatganimizdek, tadbir abonentini va filtrni qo'llash orqali
hodisalar doirasini qiziqish ko'rsatadiganlarga cheklash, ba'zan siz kerak
to'g'ridan-to'g'ri yondashish. _savollar_.

So'rovlar kichik ko'rsatmalarga o'xshash ob'ektlar bo'lib, Iroha
tengdoshlar, hozirgi dunyoga oid nuqtai nazar bilan javob berishga harakat qiling.

Ushbu ma'lumotlar faqatgina Internetda mavjud bo'lmagan.
tarmog'i, lekin bu yagona ma'lumotlar turi _kafolatlangan_ to
barcha tarmoqlarda mavjud bo'lishi kerak.

Har bir ishga tushirish uchun Iroha, boshqa ma'lumotlar mavjud bo'lishi mumkin.
Masalan, telemetriya ma'lumotlarining mavjudligi tarmoqga bog'liq
Administratorlar. Bu butunlay ularning qarori, ular xohlaydi yoki yo'q
Ishni bajarish uchun uni ishlatishning o'rniga ishlanishni kuzatish uchun qayta ishlash quvvatini ajratish
Aksincha, ba'zi funktsiyalar har doim talab qilinadi, masalan,
hisobingizdagi balansga kirish.

So'rov natijalari quyidagicha bo'lishi mumkin: [sinflash](#sorting), [sahifalashtirilgan](#pagination)
va [filtrlangan](#filters) Bir vaqtning o'zida tengdoshlar tomonidan.
Metadata kalitlarida leksikografik ravishda filtrlash turli xil
Boshqacha qoidalar, domen-mahsulotga oid (individual) IP manzil filtrli maskalar)
sub-satrning usullari `begins_with` logik operatsiyalar yordamida birlashtirilgan.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Taira faqat oʻqish uchun soʻrov yordamchilarini koʻrsatadi JSON umumiy resurslar uchun.
oʻrganish uchun sahifalash va javoblarni boshqarish SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Ilova diagnostikasi uchun ushbu tutun tekshiruvlarini imzolangan bitimlardan ajratib turing
testlar. Faqat o'qiladigan so'rovning muvaffaqiyatsiz tugashi odatda oxirgi nuqtalarning mavjudligiga ishora qiladi,
tarmoqning mavjudligi yoki yo'nalish moslashuvchanligi bu imzochi o'rnatilishiga ishora qilishdan oldin.

## Soʻrov yaratish {#create-a-query}

&amp; amp; &amp; apos; Qichqirishni oʻrnatish SDK yoki CLI. Masalan, joriy ma'lumotlar
namunaviy ekspozitsiyalar `FindAccounts` ro'yxatga olish hisob raqamlari uchun:

```rust
let query = FindAccounts;
```

Bu yerda Alisaning mol-mulkini topgan so'rovning bir namunasi:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Sahifalar {#pagination}

Bir xil va kichik takrorlanadigan so'rovlar uchun siz foydalanishingiz mumkin `client.request`
so'rovni taqdim etish va natijani bir marta olish.

Biroq, keng takrorlanadigan so'rovlar: `FindAccounts`, `FindAssets`, yoki
`FindBlocks` katta natijalar to'plamini qaytarishi mumkin.
tengdosh va mijoz.

A `Pagination`, qo'ng'iroq qilishingiz kerak
`client.request_with_pagination(query, pagination)`, qaerda `pagination`
quyidagicha qurilgan:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filterlar {#filters}

So'rovni yaratganingizda, faqat natijalarni qaytarish uchun filtrdan foydalanishingiz mumkin
ko'rsatilgan filtrga mos keladigan.

Filterlar so'rovlarga mos. Misol uchun, hisob so'rovlari
Hisobvaraq identifikatsiyasi yoki metadatalar, aktiv so'rovlari esa aktiv bo'yicha tortilishi mumkin
belgilash, egalik hisoboti yoki domen proyeksiyasi. SDK&amp; apos; bosilgan soʻrov
iloji bo'lsa, filtr turi so'rov chiqariladigan turiga mos keladi.

## Sortlash {#sorting}

Iroha elementlarni [Metadatalar](/uz/blockchain/metadata.md)
lexikografik jihatdan , agar siz qurilish paytida ajratish uchun kalitni taqdim etsangiz
Oddiy foydalanuvchi holat hisob-kitoblar uchun `registered-on`
Metadata kiritiladigan ma'lumotlar, agar ularni sinflashsa, hisobni ko'rishingizga imkon beradi
ro'yxatdan o'tish tarixi.

Sortlash faqat
[Metadatalar](/uz/blockchain/metadata.md), Metadata kalitidan foydalanish
so'rov natijalarini tartibga soling.

Sortlashni sahifalashtirish va filtrlar bilan birlashtirishingiz mumkin.
bir tanlov xususiyati, ko'pginalash bilan so'rovlar kerak bo'lmaydi.

## Ma'lumotnoma {#reference}

Tekshiring [mavjud so'rovlar ro'yxati](/uz/reference/queries.md) ular haqida batafsil ma'lumot olish uchun.
