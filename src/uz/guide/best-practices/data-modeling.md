---
translation_locale: uz
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ma'lumotlar modeli {#data-modeling}

Ledger ma'lumotlari mulkdorlik, o'tkazish xatti-harakatlari, ruxsat cheklovlari va so'rovlar uslublariga asoslangan bo'lishi kerak. Auditing va deterministik ijroni qo'llab-quvvatlaydigan eng kichik zanjirdagi ifoda tanlang.

## Domenlar va hisob raqamlari {#domains-and-accounts}

- Ma'muriy va siyosat chegaralarini ifodalash uchun domenlardan foydalaning. Domen nomlarini barqaror saqlang, chunki ular hisob va aktiv identifikatorlarida paydo bo'ladi.
- Birgina hisobda bog'liq bo'lmagan mas'uliyatlarni ortiqcha yuklashdan qoching. Foydalanuvchilar, xizmatlar, triggerlar, operatorlar va to'lov sponsorlari uchun alohida hisoblardan foydalaning.
- Konfiguratsiya va sinovlarda kanonik hisob va domen identifikatorlaridan foydalaning. Iroha nomlari kanonik tahlildan so'ng holatga mos keladi.
- Sinov va ishlab chiqarish identifikatsiyalarini ismlar, domenlar va konfiguratsiya fayl yo'nalishlari bo'yicha ko'rinishda alohida saqlang.

Qarang [Domainlar](/uz/blockchain/domains.md), [Hisobotlar](/uz/blockchain/accounts.md) va [Name](/uz/reference/naming.md).

## Moddiy mablag'lar va NFTs {#assets-and-nfts}

- Fungible balanslar va o'tkazilishi mumkin bo'lgan miqdorlar uchun raqamli aktivlardan foydalaning.
- Yolg'iz egalikdagi yozuvlar uchun NFTs yoki domenga oid ob'ektlardan foydalaning.
- Faqat metadatalarda qiymatga ega bo'lgan holatni kodlashdan qoching. Assetlar va NFTs o'zlarining hayot davrida sodir bo'ladigan voqealarni, semantikani o'tkazishni va metadatalarga tegishli bo'lmagan ruxsatnomalarni tekshiradi.
- Aktivni ilovalarga qo'yishdan oldin aniqlik, ta'minot siyosati, emitentning javobgarligi va yoqish/quruvchi organlarini belgilash.

Koʻring [Moddiy aktivlar](/uz/blockchain/assets.md), [NFTs](/uz/blockchain/nfts.md), va [RWAs](/uz/blockchain/rwas.md).

## Metadatalar {#metadata}

- Katalog ob'ektlarining kompakt atributlari uchun metadatalardan foydalanish, masalan, etiketlar, integratsiya IDs, siyosat bayroqlari, hashlar, URIs yoki tarkibga doir ma'lumotlarga murojaat qilish.
- Metadata kalitlarini barqaror va hujjatli saqlang. Mijozlarga bog'liq bo'lganidan keyin kalit nomini o'zgartirish migratsiya muammosi yaratadi.
- Katta hujjatlarni, loglarni, xususiy foydalanuvchi ma'lumotlarini yoki yuqori churnli ilovalar holatini to'g'ridan-to'g'ri metadatalarga saqlamang.
- Metama'lumotlar zanjirdan tashqari ma'lumotlarga ishora qilganda, tarkib hash, URI, SoraFS yo'li, manifest referensiya yoki kompakt majburiyat kabi tekshirish mumkin bo'lgan ma'lumotni saqlang.

[Metadata va Ledger saqlash variantlarini](/uz/guide/configure/metadata-and-store-assets.md) va [Metadatalarni](/uz/blockchain/metadata.md) ko'ring.

## Model bo'yicha ruxsatnomalar {#permissions-by-model}

- Amalga oshirish qulayliklari bilan emas, balki biznes operatsiyalari bilan bog'liq dizayn vazifalari. O'yin yoki xizmat nomidan nomlangan vazifa keng texnik qobiliyat nomidan nomlanadigan lavozimdan ko'ra audit qilish osonroqdir.
- Ish oqimini qondiradigan eng kichik ob'ektga ruxsatnoma belgisini ko'rsatish.
- Mining, yonish, tengdoshlarni boshqarish, ijrochi o'zgarishlari, qo'zg'atuvchilarni boshqarish va metadata mutatsiyasi uchun ruxsatnomalarni yuqori ta'sirli ruxsatnomalar sifatida qabul qiling.
- Vaqtinchalik ruxsatnomalar uchun aniq bekor qilish va aylanish tartib-taomillarini qo'shing.

Qarang [Izohlar](/uz/blockchain/permissions.md) va [Izoh tokenlari](/uz/reference/permissions.md).

## Soʻrov shakli {#query-shape}

- Ilova ko'pincha kerak bo'lgan so'rovlarni qo'llab-quvvatlaydigan identifikatorlar va metadata kalitlarini tanlang.
- Katta natijalar to'plamini sahifalashtiring va odatdagi harakatlar uchun cheklanmagan kitob bo'ylab skanerlarni talab qiladigan foydalanuvchi interfeyslaridan qoching.
- Xatcho'pdan tashqaridagi indekslarni katta ma'lumotlar va hodisalardan qayta tiklanishi mumkin bo'lgan holda saqlang, ular kritik dastur xatti-harakati uchun ishlatiladi.
