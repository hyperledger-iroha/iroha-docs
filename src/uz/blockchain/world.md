---
translation_locale: uz
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Dunyo {#world}

`World` boshqa entitetlarni o'z ichiga olgan global entitetdir. `World`
quyidagilardan iborat bo'ladi:

- Iroha [konfiguratsiya parametrlari](/uz/guide/configure/client-configuration.md)
- ro'yxatga olingan tengdoshlar
- ro'yxatdan o'tgan domenlar
- ro'yxatga olingan [qo'zg'atuvchilar](/uz/blockchain/triggers.md)
- ro'yxatga olingan
  [vazifalar](/uz/blockchain/permissions.md#permission-groups-roles)
- ro'yxatga olingan
  [ruxsatnoma belgisi taʼriflari](/uz/blockchain/permissions.md#permission-tokens)
- barcha hisobvaraqlar uchun ruxsatnoma tokenlari
- [ishga tushirish vaqtini tasdiqlovchilar zanjiri](/uz/blockchain/permissions.md#runtime-validators)

Domenlar, tengdoshlar yoki rollar ro'yxatdan o'tgan yoki ro'yxatga olinmagan bo'lsa, `World`
ro'yxatdan chiqarishning maqsadi
[ko'rsatma](/uz/blockchain/instructions.md).

## Jahon holatiga qarash (WSV) {#world-state-view-wsv}

World State View - hozirgi blokcheynning xotira tarkibidagi tasviri
davlat. `World`, qo'shilgan blok hashlari, muomala indekslari,
va hozirgi davr uchun tanlangan tengdoshlar. to'liq blok foydali yuklari xizmat ko'rsatadi
Kura o'zgaruvchan sifatida takrorlanmasdan WSV ma'lumotlar.

O ' zbekiston Respublikasi WSV so'rovlar o'qiladigan va blok ijro etilishi mutatsiya qiladi.
haqiqatning doimiy manbai emas.
[Kura](#kura-storage), va WSV qayta tiklanishi mumkin Kura bloklar yoki yuklangan
holatdagi fotosuratdan keyin yangi o'ynash orqali ushlab olinadi Kura bloklar.

### Nima uchun? WSV Izlar {#what-the-wsv-tracks}

O ' zbekiston Respublikasi WSV kengroq bo'ladi `World` amalda quyidagilarni o'z ichiga oladi:

- ko'rsatilgan `World`: parametrlar, tengdoshlar, domenlar, hisobotlar, aktivlar; NFTs, vazifalar,
  ruxsatnomalar, qo'zg'atuvchilar, ijrochi ma'lumotlari va boshqa ro'yxatga olingan ma'lumotlar modeli
  ob'ektlar
- belgilangan blok hashlari va oxirgi belgilangan balandlik
- so'rovlar va tushumlar uchun ishlatiladigan tranzaksiyalardan bloklarga ko'rsatkichlar
- konsensus asosida foydalaniladigan joriy va avvalgi commit topologiyasi
- Ma'lumotlar mavjudligi kabi majburiyatli bloklardan olingan xotira indekslari
  majburiyatlar, qabul kursorlari, pin niyatlari va so'rov proyeksiyasi markerlari
- Deterministik bloklarni bajarish uchun zarur bo'lgan ishga tushirish vaqti konfiguratsiyasi fotosuratlari;
  Kriptografiya, boshqaruv, gaz quvurlari, tarkib, hisob-kitoblar va Nexus
  moslamalar

So'rovlar odatda faqat o'qish uchun beriladi `StateView` Ushbu tuzilmalar ustidan.
koʻrinish soʻrovni bajarish uchun mos oʻchiruvchi fotosuratdir; u toʻgʻridan-toʻgʻri ruxsat bermaydi
mutatsiya WSV.

### Qanday qilib WSV Oʻzgarishlar {#how-the-wsv-changes}

WSV o'zgarishlar amalga oshirilishidan oldin bosqichma-bosqich amalga oshiriladi.
bloklar ko'lami davlat qoplama, va har bir qabul qilingan tranzaksiya o'z
Transaksiyalarga ko'ra o'rnatilgan bo'shliqdagi yo'l-yo'riqlar.
Transaksiyalar bir xil blok kontekstida o'tkaziladi.
blok uchun muomala ta'siri.

Konsensus blokni amalga oshirganidan so'ng, tengdosh birinchi navbatda majburiyatli blokni o'z ichiga oladi
yo'nalishi Kura. Agar ushbu navbatdagi qadam muvaffaqiyatsiz tugasa, WSV rivojlanmagan va
konsensus bo'g'i blokning foydali yukini qayta sinab ko'radi yoki sozlaydi.
qabul qilingan Kura navbatda, Iroha ijrodan keyingi blok effektlarini qo'llaniladi;
O'tkazilgan indekslarni yangilash va bosqichma-bosqich WSV a bo'yicha o'zgarishlar
Bu o'quvchilarni qisman
blok.

Konsensus-kritik qoida shundaki , tengdoshlar bir xil WSV bilan
O'sha o'xshash aloqador bloklar. WSV ma'lumotlarni o'tkazib yuborish yo'l-yo'riqlari va
tengdoshlar tasdiqlash yoki takrorlash paytida kelishmovchiliklarga olib keladi.

### Boshlang va takrorlang {#startup-and-replay}

Boshlang'ichda Iroha boshlovchi Kura birinchi va saqlangan blok balandligini o'rganadi.
Keyin u holat fotosuratini yuklashga harakat qiladi. Agar fotosurat mavjud bo'lmasa yoki
tezkor fotosurat qayta tiklanishi mumkin deb rad etiladi; Iroha boshlang'ich holatni yaratadi va
o'z vaqtida amalga oshirilgan bloklarni Kura. Agar fotosurat haqiqiy boʻlsa , lekin u orqada Kura,
faqat yo'qolgan balandlik doirasi takrorlanadi.

Takrorlash har bir saqlangan blokni tasdiqlaydi, ushbu blok uchun commit ro'yxatini rekonstruksiya qiladi
balandligi, blok effektlarini WSV, va natijada
Davlat. Bu Kura o'zgarish yo'li WSV, Oʻz navbatida ,
butun zanjirni takrorlamaslik uchun optimallashtirish.

## Kura saqlash {#kura-storage}

_Kura_ bo ' lmoqda Iroha U imzolangan bloklarni saqlaydi va
o'zgaruvchan ikkinchi nusxasini saqlamaydi WSV.

Kura saqlash [`kura.store_dir`](/uz/reference/peer-config/params.md#param-kura-store-dir).
Ushbu ildiz ichida blok ma'lumotlari yo'nalish yoki segmentlarga bo'linadi.
segment uchun quyidagilar:

| Yoʻl | Maqsad |
| --- | --- |
| `blocks/<segment>/blocks.data` | Qoʻshma Norito- ramkalashtirilgan imzolangan blok yuklari. |
| `blocks/<segment>/blocks.index` | O'rnatilgan o'lcham `(start, length)` Xaritani blok balandligi bytelarga kiritilgan `blocks.data`. |
| `blocks/<segment>/blocks.hashes` | Tez qidirish va ishga tushirishni tasdiqlash uchun hashlarni balandligi bo'yicha bloklang. |
| `blocks/<segment>/blocks.count.norito` | Kuchli commit marker, qancha blok indekslari kirishlaridan foydalanish xavfsizligini qayd etadi. |
| `blocks/<segment>/da_blocks/` | Yovuzlashtirilgan blokning foydali yuklari tashqarida saqlanadi `blocks.data` disk-budjetni qo'llab-quvvatlash eski jasadlarni issiq fayldan olib tashlaganida. |
| `blocks/<segment>/pipeline/sidecars.norito` va `sidecars.index` | Pipeline-ni tiklash bo'yicha yo'nalishdagi avtoulovlar blokning balandligiga ko'ra. |
| `blocks/<segment>/pipeline/roster_sidecars.norito` va `roster_sidecars.index` | Blok sinxronizatsiyasi va takrorlashda ishlatiladigan so'nggi commit-roster yon mashinalari. |
| `merge_ledger/<segment>.log` | Qo'shma bloklar bilan to'g'rilashuv daftaridagi kirishnomalar. |
| `commit-rosters.norito` | So'nggi bloklar uchun qo'lga kiritilgan majburiyat sertifikatlari va tasdiqlash punktlari. |

Kura zanjir uchun xotira ichida kompakt vektorni saqlaydi: har bir balandlikda
blok hash va, variant bo'lsa, blok tanasi.
va eng so'nggi [`kura.blocks_in_memory`](/uz/reference/peer-config/params.md#param-kura-blocks-in-memory)
genesis bo'lmagan bloklar o'z tanasini xotirada saqlaydi.
xotiralaridan tushdi va qayta yuklandi Kura zarur bo'lganda fayllar.

Ishlab chiqarish paytida, `strict` Modda blokdan saqlangan bloklarni tasdiqlaydi
fayllarni yuklaydi va kerak bo'lsa hash faylini qayta yozadi. `fast` saqlash rejimidan boshlanadi
hash/indeks meta-ma'lumotlar va agar ushbu metamadani
muvofiq emas. Kura buzilgan quyruqni aniqlaydi, u saqlashni
oxirgi tasdiqlangan blok.

Kura yangi bloklarni orqa fon yozuvchisi orqali yozadi. Yozuvchi blokni qo'shadi
faydali yuklamalar, hashlar va indeks yozuvlari, so'ngra chidamli hisoblash markerni oldinga
disk-budjetni qo'llab-quvvatlashda
faol, Kura oʻtkazib yuborishi yoki eski bloklar jasadlarini olib tashlashi mumkin
`da_blocks/` hashlar va indeks yozuvlarini tasdiqlash uchun saqlab qolish
va qidirish.
