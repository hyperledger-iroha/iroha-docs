---
translation_locale: uz
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ma'lumotlarni modellashtirish {#data-modeling}

reyestr ma'lumotlari egalik, uzatish xatti-harakati, ruxsat chegaralari va so'rov naqshlari atrofida modellanishi kerak. Audit qilish va deterministik bajarilishni qo'llab-quvvatlay oladigan eng kichik on-chain ifodani tanlang.

## Domenlar va Hisoblar {#domains-and-accounts}

- Ma'muriy va siyosat chegaralarini ifodalash uchun domenlardan foydalaning. Domen nomlarini barqaror saqlang, chunki ular hisob va aktiv identifikatorlarida paydo bo'ladi.
- Bitta hisobni aloqasiz vazifalar bilan ortiqcha yuklamang. Foydalanuvchilar, xizmatlar, triggerlar, operatorlar va to‘lov homiylari uchun alohida hisoblardan foydalaning.
- Konfiguratsiya va testlarda kanonik hisob va domen identifikatorlaridan foydalaning. Kanonik tahlildan keyin Iroha nomlari katta-kichik harflarga sezgirdir.
- Test va ishlab chiqarish identifikatorlarini nomlarda, domenlarda va konfiguratsiya fayllari yo‘llarida ko‘rinadigan darajada farq qiladigan qilib saqlang.

Qarang [Domenlar](/uz/blockchain/domains.md), [Hisoblar](/uz/blockchain/accounts.md), va [Ismlash](/uz/reference/naming.md).

## Aktivlar va NFTs {#assets-and-nfts}

- Oʻzgartirilishi mumkin boʻlgan balanslar va uzatiladigan miqdorlar uchun raqamli aktivlardan foydalaning.
- Yagona egalik hujjatlari uchun NFTs yoki soha-specific obyektlardan foydalaning.
- Qiymatga ega bo‘lgan holatni faqat metadata ichida kodlamaslik kerak. Resurslar va NFTs metadata qilmaydigan hayot davri voqealarini, uzatish semantikasini va ruxsat tekshiruvlarini taqdim etadi.
- Aktivni ilovalarga taqdim etishdan oldin aniqlik, ta’minot siyosati, chiqaruvchi mas’uliyati va kuyirish/mintlash vakolatlari prinsipi bilan tanishtiring.

Qarang [Aktivlar](/uz/blockchain/assets.md), [NFTs](/uz/blockchain/nfts.md), va [RWAs](/uz/blockchain/rwas.md).

## Metama'lumot {#metadata}

- Blokcheyn ledjer obyektlarining ixcham atributlari uchun metadata-dan foydalaning, masalan, yorliqlar, integratsiya IDlari, siyosat bayroqlari, kriptografik xeshlar, URIs yoki kontentga yo'naltirilgan havolalar.
- Metama'lumotlar kalitlarini barqaror va hujjatlangan holda saqlang. Mijozlar ularga tayanib qolganidan keyin kalit nomlarini o'zgartirish migratsiya muammosini yaratadi.
- Katta hujjatlarni, jurnal yozuvlarini, foydalanuvchining shaxsiy ma’lumotlarini yoki tez-tez o‘zgaradigan ilova holatini metama’lumotlarga to‘g‘ridan-to‘g‘ri saqlamang.
- Metadata off-chain ma'lumotlarga ishora qilganda, tasdiqlanishi mumkin bo'lgan havolani saqlang, masalan, kontentning kriptografik xashi, URI, SoraFS yo'li, manifestga havola yoki kompakt kriptografik majburiyat qiymati.

Buni [Metama'lumotlar va reyestrni saqlash tanlovlari](/uz/guide/configure/metadata-and-store-assets.md) va [Metama'lumot](/uz/blockchain/metadata.md) ko‘ring.

## Model bo‘yicha ruxsatlar {#permissions-by-model}

- Rollarni biznes operatsiyalari atrofida shakllantiring, amalga oshirish qulayliklari atrofida emas. Bir ish yoki xizmat nomi bilan atalgan rol keng texnik imkoniyat nomi bilan atalgan roldan ko'ra osonroq tekshiriladi.
- Ruxsat tokenlarini ish jarayonini qondiradigan eng kichik obyektga cheklang.
- Berish, yo‘q qilish, tarmoq tengdoshlarini boshqarish, ijrochi o‘zgarishlari, triggerlarni boshqarish va metadata o‘zgartirish ruxsatlarini yuqori ta’sirga ega ruxsatlar sifatida ko‘ring.
- Vaqtinchalik ruxsatlar uchun aniq bekor qilish va aylantirish protseduralarini qo'shing.

Buni [Ruxsatlar](/uz/blockchain/permissions.md) va [Ruxsat tokenlari](/uz/reference/permissions.md) ko‘ring.

## So‘rov shakli {#query-shape}

- Ilovangiz eng ko‘p ehtiyoj sezadigan so‘rovlarni qo‘llab-quvvatlaydigan identifikatorlar va metadata kalitlarini tanlang.
- Keng natija toʻplamlarini sahifalash va oddiy harakatlar uchun butun reyestrni cheklovsiz skanerlashni talab qiladigan foydalanuvchi interfeyslaridan qoching.
- Muhim dastur xatti-harakatlari uchun ishlatilganda, reyestrdagi ma’lumotlar va hodisalardan tashqari indekslarni qayta tiklanadigan holatda saqlamang.
