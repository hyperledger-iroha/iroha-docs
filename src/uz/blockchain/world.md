---
translation_locale: uz
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Dunyo {#world}

`World` - boshqa subyektlarni o'z ichiga olgan global entitetdir. `World` quyidagilardan iborat:

- Iroha [konfiguratsiya parametrlari ](/uz/guide/configure/client-configuration.md)
- ro'yxatdan o'tgan tengdoshlar
- ro'yxatdan o'tgan domenlar
- ro'yxatdan o'tgan [triggerlar ](/uz/blockchain/triggers.md)
- ro'yxatdan o'tgan [xillar ](/uz/blockchain/permissions.md#permission-groups-roles)
- ro'yxatdan o'tgan [permit tokenlari tavsiflari](/uz/blockchain/permissions.md#permission-tokens)
- barcha hisob raqamlari uchun ruxsatnoma belgisi
- [ishga tushirish vaqtini tasdiqlovchilar zanjiri](/uz/blockchain/permissions.md#runtime-validators)

Domenlar, tengdoshlar yoki rollar ro'yxatdan o'tkazilgan yoki ro'yxatga olinmagan bo'lsa, `World` [ yo'l-yo'riqining (ro'yxatdan tashqari) maqsadi hisoblanadi ](/uz/blockchain/instructions.md).

## Jahon holati ko'rinishi (WSV) {#world-state-view-wsv}

World State View - bu joriy blokcheyn holatining xotira tarkibiga kiradi. U `World`, o'zgaruvchan WSV ma'lumotlar sifatida takrorlanmasdan, hozirgi davr uchun tanlangan bag'ishlangan blok hashlari, tranzaksiya indekslari va tengdoshlarini o'z ichiga oladi. To'liq blok faydali yuklar Kura dan xizmat ko'rsatadi.

O ' zbekiston Respublikasining WSV bu so'rovlar o'qiladigan va blok ijro etiladigan holatdir. Bu haqiqatning doimiy manbai emas. O ' z vaqtida saqlanadigan tarix [Kura](#kura-storage), va WSV qayta tiklanishi mumkin Kura bloklar yoki holat sur'atdan yuklangan va so'ngra yangi o'ynash bilan ushlab Kura bloklar.

### WSV izlari nima {#what-the-wsv-tracks}

WSV ob'ekti `World` ob'ektidan kengroq bo'lib, amaliyotda quyidagilarni o'z ichiga oladi:

- `World`: parametrlar, tengdoshlar, domenlar, hisobotlar, aktivlar, NFTs, rollar, ruxsatnomalar, qo'zg'atuvchilar, ijrochi ma'lumotlari va boshqa ro'yxatdan o'tgan ma'lumotlar modeli ob'ektlar
- belgilangan blok hashlari va so'nggi belgilangan balandlik
- so'rovlar va tushumlar uchun ishlatiladigan tranzaksiya-blok indekslari
- konsensus asosida foydalaniladigan joriy va avvalgi commit topologiyasi
- Ma'lumotlar mavjudligi majburiyatlari, qabul kursorlari, pin niyati va so'rovlar proyeksiyasi markerlari kabi o'rnatilgan bloklardan olingan xotira indekslari;
- Deterministik bloklarni bajarish uchun zarur bo'lgan ishga tushirish vaqti konfiguratsiyasi fotosuratlari, masalan, kriptografiya, boshqaruv, quvurlar, tarkib, hisob-kitob va Nexus sozlamalari

So'rovlar odatda ushbu tuzilmalar ustida faqat o'qish uchun `StateView` olishadi. Ko'rinish so'rovni bajarish uchun tutarli fotosuratdir; bu WSV ning to'g'ridan-to'g'ri mutatsiyasiga yo'l qo'ymaydi.

### WSV ning o'zgarishi {#how-the-wsv-changes}

WSV o'zgarishlar amalga oshirilishidan oldin bosqichma-bosqich amalga oshiriladi. Blok ijro etilishi blok miqyosidagi davlat qoplamasini yaratadi va har bir qabul qilingan tranzaksiya o'z yo'l-yo'riqlarini tranzaksiya miqyosidagi qoplamalarda qo'llaniladi. Ushbu tranzaksiyalar bitta blok kontekstida ishlaydigan ma'lumotlarni ishga tushiradi. Vaqt triggerlari blok uchun tranzaksiya ta'sirlaridan keyin baholanadi.

Konsensus blokni qo'llab-quvvatlagandan so'ng, tengdosh birinchi navbatda Kura da aloqador blokni orqaga suradi. Agar bu orqaga chiqish jarayoni muvaffaqiyatsiz tugasa, WSV ilgari surilmaydi va konsensus bo'g'i blokning foydali yukini qayta sinab ko'radi yoki orqaga chiqaradi. Blok Kura safida qabul qilinayotganda, Iroha ijrodan keyingi blok effektlarini qo'llaniladi, hosil bo'lgan indekslarni yangilaydi va bosqichma-bosqich WSV o'zgarishlarni holat ko'rinishi qulfining ostida amalga oshiradi. Bu o'quvchilarni qisman belgilangan blokni kuzatib borishdan saqlaydi.

Konsensus-kritik qoida shundaki, tengdoshlar bir xil WSV bloklardan o'xshashga erishishlari kerak. WSV ma'lumotlarni chetlab o'tish ko'rsatmalariga lokal tahrirlash to'g'ridan-to'g'ri amalga oshiriladi va tengdoshlarning tasdiqlash yoki takrorlash paytida rozi bo'lmasligi mumkin.

### Dasturni boshlash va qayta ijro etish {#startup-and-replay}

Boshlang'ichda Iroha birinchi navbatda Kura ni initialize qiladi va saqlangan blok balandligini o'rganadi. So'ngra u holat fotosuratini yuklashga harakat qiladi. Agar hech qanday fotosurat mavjud bo'lmasa yoki fotosurat tiklanishi mumkin deb rad etilgan bo'lsa, Iroha dastlabki holatni yaratadi va Kura dan belgilangan bloklarni takrorlaydi. Agar fotosurat haqiqiy bo'lsa, ammo Kura ortida bo'lsa , faqat yo'qolgan balandlik doirasi qayta o'ynatiladi.

Takrorlash har bir saqlangan blokni tasdiqlaydi, ushbu balandlik uchun commit ro'yxatini rekonstruksiya qiladi, blok effektlarini WSV ga qo'llaniladi va natijali holatni amalga oshiradi. Bu Kura WSV uchun tiklanish yo'li bo'lishini anglatadi, oyna rasmlar esa butun zanjirni takrorlashni oldini oladigan optimallashtirishdir.

## Kura saqlash {#kura-storage}

Kura Iroha ning doimiy blok saqlashidir. U imzolangan bloklar va tiklanish metadatalarini saqlaydi. WSV ning ikkinchi o'zgaruvchan nusxasini saqlamaydi.

Kura saqlash [`kura.store_dir`](/uz/reference/peer-config/params.md#param-kura-store-dir) nomiga ildiz otadi. Bu ildiz ichida blok ma'lumotlari yo'nalish yoki segmentlarga bo'linadi.

|Yoʻl |Maqsad|
| --- | --- |
|`blocks/<segment>/blocks.data` |Qo'shma Norito ramkalar bilan imzolangan blok fayzli yuklar. |
|`blocks/<segment>/blocks.index` |O'rnatilgan o'lchamdagi `(start, length)` xaritadan blok balandligi bo'yicha `blocks.data` bytlarga kiritiladi. |
|`blocks/<segment>/blocks.hashes` |Tez qidirish va ishga tushirishni tasdiqlash uchun hashlarni balandlikka qarab bloklang. |
|`blocks/<segment>/blocks.count.norito` |Uzoq muddatli commit markeri, qancha blok indekslari kirishlaridan foydalanish xavfsizligini qayd etadi. |
|`blocks/<segment>/da_blocks/` |Disk-budjet qo'llab-quvvatlash eski jismlarni issiq fayldan olib chiqib ketganda `blocks.data` tashqarida saqlangan blok foydali yuklar chiqariladi. |
|`blocks/<segment>/pipeline/sidecars.norito` va `sidecars.index` |Quvurni qayta tiklash bo'yicha yo'nalishdagi avtoulovlar blokning balandligiga ko'ra. |
|`blocks/<segment>/pipeline/roster_sidecars.norito` va `roster_sidecars.index` |Blok sinxronizatsiyasi va takrorlashda ishlatiladigan so'nggi commit-roster bo'laklari. |
|`merge_ledger/<segment>.log` |Qo'shilgan bloklar bilan to'g'rilash bo'lgan qo'shilish daftaridagi kirishnomalar. |
|`commit-rosters.norito` |So'nggi bloklar uchun commit sertifikatlari va validator nazorat punktlari saqlanadi. |

Kura zanjir uchun kompakt xotira vektorini saqlaydi: har bir balandlikda blok hash va, tanlov bo'yicha, blok tanasi mavjud. Genesis bloki saqlanib qoladi, eng so'nggi [ `kura.blocks_in_memory`](/uz/reference/peer-config/params.md#param-kura-blocks-in-memory) genesis bo'lmagan bloklar o'z tanalarini xotiraga saqlashadi. Keksa bloklar xotirasidan tashlanadi va kerak bo'lganda Kura fayllaridan qayta yuklanadi.

O'rnatish jarayonida `strict` rejimi blok fayllaridan saqlangan bloklarni tasdiqlaydi va kerak bo'lganda hash faylini qayta yozadi. `fast` rejimi saqlangan hash / indeks metadatalaridan boshlanadi va agar ushbu metadata mos kelmasa, qat'iy o'rnatishga qaytadi. Agar Kura buzilgan quyruqni aniqlasa, uni so'nggi tasdiqlangan blokga qadar saqlashni o'zgartiradi.

Kura yangi bloklarni orqa fon yozuvchisi orqali yozadi. Yozuvchi blok fayl yuklamalari, hashlar va indeks kirishlarini qo'shadi, so'ngra konfiguratsiya qilingan fsync siyosatiga ko'ra chidamli sanish markerini ilgari suradi. Disk-budjetni qo'llash faol bo'lganda, Kura iste'mol qilingan segmentlarni tozalashi yoki eski blok organlarini `da_blocks/` ga chiqarib tashlashi mumkin, shu bilan birga hashlar va indeks yozuvlarini tasdiqlash va qidirish uchun taqdim etadi.
