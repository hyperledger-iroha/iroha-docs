---
translation_locale: uz
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Global holat {#world}

`World` — boshqa obyektlarni o‘z ichiga oladigan global obyekt. `World` quyidagilardan iborat:

- Iroha [sozlama parametrlari](/uz/guide/configure/client-configuration.md);
- ro‘yxatdan o‘tkazilgan tugunlar;
- ro‘yxatdan o‘tkazilgan domenlar;
- ro‘yxatdan o‘tkazilgan [qo‘zg‘atuvchilar](/uz/blockchain/triggers.md);
- ro‘yxatdan o‘tkazilgan [rollar](/uz/blockchain/permissions.md#permission-groups-roles);
- ro‘yxatdan o‘tkazilgan [ruxsat tokeni ta’riflari](/uz/blockchain/permissions.md#permission-tokens);
- barcha hisoblarning ruxsat tokenlari;
- [bajarish muhiti tekshiruvchilari zanjiri](/uz/blockchain/permissions.md#runtime-validators).

Domen, tugun yoki rol ro‘yxatdan o‘tkazilganda yoxud chiqarilganda, tegishli [ro‘yxatdan o‘tkazish/chiqarish ko‘rsatmasi](/uz/blockchain/instructions.md) `World` ni nishon qiladi.

## Global holat ko‘rinishi (WSV) {#world-state-view-wsv}

Global holat ko‘rinishi (WSV) — blokcheynning joriy holatini xotirada ifodalovchi tuzilma. U `World`, yakuniy yozilgan blok xeshlari, tranzaksiya indekslari va joriy davr uchun saylangan tugunlarni o‘z ichiga oladi. Bloklarning butun foydali yuklari o‘zgaruvchan WSV ma’lumoti sifatida takrorlanmaydi, balki Kura-dan taqdim etiladi.

WSV — so‘rovlar o‘qiydigan va blok bajarilishi o‘zgartiradigan holat; uning o‘zi barqaror haqiqat manbai emas. Barqaror tarix [Kura](#kura-storage) da saqlanadi. WSV-ni Kura bloklaridan qayta qurish yoki holatning oniy tasviridan yuklab, keyingi Kura bloklarini takrorlash orqali yangilash mumkin.

### WSV nimalarni kuzatadi {#what-the-wsv-tracks}

WSV `World` obyektidan kengroq. Amalda u quyidagilarni o‘z ichiga oladi:

- `World`: parametrlar, tugunlar, domenlar, hisoblar, aktivlar, NFTs, rollar, ruxsatlar, qo‘zg‘atuvchilar, ijrochi ma’lumotlari va boshqa ro‘yxatdan o‘tkazilgan ma’lumotlar modeli obyektlari;
- yakuniy yozilgan blok xeshlari va eng so‘nggi yakuniy balandlik;
- so‘rovlar va kvitansiyalar ishlatadigan tranzaksiyadan blokka indekslar;
- konsensus foydalanadigan joriy va avvalgi yakunlash topologiyasi
- yakuniy yozilgan bloklardan hosil qilingan, ma’lumotlar mavjudligi majburiyatlari, kvitansiya kursorlari, mahkamlash niyatlari va so‘rov proyeksiyasi belgilari kabi xotiradagi indekslar;
- bloklarni deterministik bajarish uchun zarur kriptografiya, boshqaruv, konveyer, kontent, hisob-kitob va Nexus sozlamalari kabi bajarish muhiti sozlamasining oniy tasvirlari.

So‘rovlar odatda bu tuzilmalar ustidagi faqat o‘qiladigan `StateView` ni oladi. Ko‘rinish so‘rov bajarilishi uchun izchil oniy tasvirdir; u WSV-ni bevosita o‘zgartirishga ruxsat bermaydi.

### WSV ning o'zgarishi {#how-the-wsv-changes}

WSV o‘zgarishlari yakuniy yozilishidan oldin bosqichlanadi. Blokni bajarish blok doirasidagi holat qoplamasini yaratadi, har bir qabul qilingan tranzaksiya esa ko‘rsatmalarini tranzaksiya doirasidagi qoplamada qo‘llaydi. Shu tranzaksiyalar chaqirgan ma’lumotlar qo‘zg‘atuvchilari ayni blok kontekstida ishlaydi. Vaqt qo‘zg‘atuvchilari blokdagi tranzaksiya ta’sirlaridan keyin baholanadi.

Konsensus blokni yakunlagach, tugun avval yakuniy blokni Kura navbatiga qo‘yadi. Navbatga qo‘yish muvaffaqiyatsiz bo‘lsa, WSV oldinga siljimaydi; konsensus sikli blok foydali yukini qayta urinadi yoki yana navbatga qo‘yadi. Blok Kura navbatiga qabul qilingach, Iroha bajarishdan keyingi blok ta’sirlarini qo‘llaydi, hosila indekslarni yangilaydi va bosqichlangan WSV o‘zgarishlarini holat ko‘rinishi qulfi ostida yakuniy yozadi. Shu tariqa o‘quvchilar qisman yozilgan blokni ko‘rmaydi.

Konsensus uchun muhim qoida: tugunlar ayni yakuniy bloklardan ayni WSV-ga kelishi shart. WSV ma’lumotini mahalliy bevosita tahrirlash ko‘rsatmalarni chetlab o‘tadi va tugunlar tekshirish yoki takrorlash vaqtida kelisha olmay qolishiga olib keladi.

### Ishga tushirish va takrorlash {#startup-and-replay}

Ishga tushishda Iroha avval Kura-ni tayyorlaydi va saqlangan blok balandligini aniqlaydi. Keyin holatning oniy tasvirini yuklashga urinadi. Tasvir bo‘lmasa yoki tiklanadigan xato sabab rad etilsa, Iroha dastlabki holatni yaratib, Kura-dagi yakuniy bloklarni takrorlaydi. Tasvir yaroqli, biroq Kura-dan ortda bo‘lsa, faqat yetishmayotgan balandliklar oralig‘i takrorlanadi.

Takrorlash har bir saqlangan blokni tekshiradi, shu balandlik uchun yakunlash tarkibini qayta yaratadi, blok ta’sirlarini WSV-ga qo‘llaydi va hosil bo‘lgan holatni yakuniy yozadi. Demak, Kura WSV-ni tiklash yo‘li, oniy tasvirlar esa butun zanjirni takrorlashdan saqlaydigan optimallashtirishdir.

## Kura saqlash {#kura-storage}

_Kura_ — Iroha-ning doimiy blok saqlovi. U imzolangan bloklar va tiklash metama’lumotini saqlaydi; WSV-ning ikkinchi o‘zgaruvchan nusxasini saqlamaydi.

Kura saqlovining ildizi [`kura.store_dir`](/uz/reference/peer-config/params.md#param-kura-store-dir) dir. Shu ildiz ichida blok ma’lumoti yo‘lak yoki segment bo‘yicha ajratiladi. Segmentning asosiy fayllari quyidagilar:

|Yoʻl |Maqsad|
| --- | --- |
|`blocks/<segment>/blocks.data` |Ketma-ket joylashgan, Norito kadrlaridagi imzolangan blok foydali yuklari. |
|`blocks/<segment>/blocks.index` |Blok balandligini `blocks.data` dagi baytlarga bog‘laydigan qat’iy o‘lchamli `(start, length)` yozuvlari. |
|`blocks/<segment>/blocks.hashes` |Tez qidirish va ishga tushirish tekshiruvi uchun balandlik bo‘yicha blok xeshlari. |
|`blocks/<segment>/blocks.count.norito` |Qancha blok indeksi yozuvidan xavfsiz foydalanish mumkinligini qayd etadigan barqaror yakunlash belgisi. |
|`blocks/<segment>/da_blocks/` |Disk budjeti siyosati eski tanalarni faol fayldan chiqarganda `blocks.data` tashqarisida saqlanadigan blok foydali yuklari. |
|`blocks/<segment>/pipeline/sidecars.norito` va `sidecars.index` |Blok balandligi bo‘yicha kalitlangan konveyerni tiklash yordamchi yozuvlari. |
|`blocks/<segment>/pipeline/roster_sidecars.norito` va `roster_sidecars.index` |Bloklarni sinxronlash va takrorlashda ishlatiladigan so‘nggi yakunlash tarkibi yordamchi yozuvlari. |
|`merge_ledger/<segment>.log` |Yakuniy yozilgan bloklarga mos birlashtirish reyestri yozuvlari. |
|`commit-rosters.norito` |So‘nggi bloklarning yakunlash sertifikatlari va tasdiqlovchi nazorat nuqtalari saqlanadi. |

Kura zanjir uchun xotirada ixcham vektor saqlaydi: har bir balandlikda blok xeshi va ixtiyoriy ravishda blok tanasi bo‘ladi. Genezis bloki keshda qoladi; genezisdan tashqari eng so‘nggi [`kura.blocks_in_memory`](/uz/reference/peer-config/params.md#param-kura-blocks-in-memory) ta blok tanasini xotirada saqlaydi. Eski blok tanalari xotiradan chiqarilib, kerak bo‘lganda Kura fayllaridan qayta yuklanadi.

Tayyorlash jarayonida `strict` rejimi blok foydali yuklaridan saqlangan bloklarni tekshiradi va kerak bo‘lsa xesh faylini qayta yozadi. `fast` rejimi saqlangan xesh/indeks metama’lumotidan boshlaydi va u nomuvofiq bo‘lsa qat’iy tayyorlashga qaytadi. Kura buzilgan oxirgi qismni aniqlasa, saqlovni so‘nggi tekshirilgan blokkacha qisqartiradi.

Kura yangi bloklarni fondagi yozuvchi orqali yozadi. Yozuvchi blok foydali yuklari, xeshlar va indeks yozuvlarini qo‘shadi, so‘ng sozlangan fsync siyosatiga muvofiq barqaror sanoq belgisini oldinga siljitadi. Disk budjetini ta’minlash faol bo‘lsa, Kura foydalanishdan chiqqan segmentlarni tozalashi yoki eski blok tanalarini `da_blocks/` ga chiqarishi, xesh va indeks yozuvlarini esa tekshirish hamda qidirish uchun saqlab qolishi mumkin.
