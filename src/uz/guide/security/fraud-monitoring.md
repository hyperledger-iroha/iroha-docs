---
translation_locale: uz
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kamchiliklarni nazorat qilish {#fraud-monitoring}

Iroha ishga tushirilishi uchun firibgarlikni kuzatish - bu katta kitob voqealari, so'rovlar, ruxsatnomalar va dastur kontekstida qurilgan operatsion nazoratdir. Iroha taqdim etilgan, qabul qilingan, rad etilgan va amalga oshirilgan narsalarni qayd etadi . Monitoring tizimingiz sizning biznes jarayoningiz uchun qaysi modellar shubhali bo'lishini hal qiladi va bu holatlarni tahlilchilarga yoki avtomatlashtirilgan javob nazoratlariga yuboradi.

Xizmatni tasdiqlash uchun to'g'ridan-to'g'ri yo'l qo'yilmagan logikadan ko'ra alohida xizmat sifatida qabul qiling. Xizmat katta ma'lumotlar ro'yxatiga obuna bo'lishi, uni zanjirdan tashqaridagi tavakkalchilik kontekstiga boyitishi, dalillarni saqlab qolishi va faqat ochiq ruxsatnomalarga ega hisob raqamlar orqali javob berish tranzaksiyalarini taqdim etish kerak.

## Monitoring modeli {#monitoring-model}

Foydali monitoring tizimining to'rt bosqichidan iborat:

1. Torii hodisa oqimlari, so'rovlar va ma'lumotlardan katta daftar va operator signallarini yig'ish.
2. O'yin-kulgilarni xaridorlar holati, qarshi tomonlar ro'yxatlari, ariza seansining identifikatorlari, kutilayotgan cheklovlar va holat IDs kabi zaxiralardan tashqari kontekst bilan boyitish.
3. Deterministik qoidalar, sharhchilar navbatlari yoki xavf-xatarni belgilash orqali shubhali xatti-harakatlarni aniqlash.
4. Operatorlarni ogohlantirib, dastur tarafidagi ish oqimlarini to'xtatish, zaruriy bo'lmagan ruxsatnomalarni bekor qilish yoki boshqaruv jarayoni sizga imkon berganida kompensatsiya tranzaksiyalarini taqdim etish orqali javob bering.

Siyosat qarorlarini konsensusdan tashqarida saqlang, agar har bir tasdiqlovchi bir xil qarorni takrorlashi shart bo'lmasa. Ish vaqti bilan tasdiqlash ruxsatnomalar va tranzaksiyalarning haqiqiyligini qo'llab-quvvatlashi kerak. Xatolarni nazorat qilish xavfni tushuntirish, dalillarni saqlash va operatorlarga tezkor harakat qilishga yordam berishlari kerak.

## To'plash uchun signallar {#signals-to-collect}

Kichik obunalar bilan boshlang va faqat tekshirish uchun kengroq oqimlarni qo'shing:

|Signal |Manba: |Foydalanish |
| --- | --- | --- |
|Transaksiya holati |Pipeline hodisalari |Takrorlanayotgan rad etishlarni, muvaffaqiyatsizlikka uchragan ruxsat berishga urinishlarni va odatiy bo'lmagan topshiriqlarni aniqlash. |
|Hisobot hayoti davri va metadatalar |Maʼlumotlar hodisalari va hisoblar soʻrovlari |Yangi hisoblarni , alias o'zgarishlarini , shaxsni yangilash va kutilmagan metadata tahrirlarini aniqlash |
|Asset balanslari va transferlar |Aktiv maʼlumotlari hodisalari va aktivlar soʻrovlari |Yuqori qiymatli harakatlarni aniqlash, tezlik bilan ventilatorni o'chirib tashlash, muvozanat oqimlari va odatiy hollarga ega bo'lmagan to'lovlarni aniqlash |
|O ' rinlar va ruxsatnomalar |Roli va ruxsatnoma so'rovlari, rola ma'lumotlari hodisalari |Maxsus imtiyozlarni kuchaytirish, favqulodda yordamlarni aniqlash va yuqori tavakkalchilikli kirishning keskinligi |
|Trigger va shartnoma o ' zgarishi |Trigger, kontrakt va ijrochi hodisalari |Yangi avtomatlashtirish, o'zgargan ijro yo'nalishlari va shubhali yangilanish faoliyati aniqlang |
|Konfiguratsiya va tengdoshlar oʻzgarishi |Konfiguratsiya va tengdoshlar tadbirlari |Validatsiyalash , tarmoqlashtirish yoki operatorning koʻrinishini taʼsir etuvchi boshqaruv oʻzgarishlarini aniqlash |
|Operatorning sogʻligi |`/metrics` va Sumeragi holati yo'nalishlari |Foydalanuvchilarning shubhali xatti-harakatlarini nodning ortiqcha yuklanishi , navbatdagi bosim yoki tarmoq xatolaridan ajratish |

Foydalanish [hodisa filtrlari](/uz/blockchain/filters.md) qoidaga faqat hisoblar, aktivlar, rollar yoki konfiguratsiya o'zgarishlari kerak bo'lganda, butun hodisalarni qayta ishlashdan qo'rqish. Vaqti-vaqti bilan kelishish uchun oqishni sahifalar bilan birlashtiring [savollar](/uz/blockchain/queries.md) so'ng monitor o'z vaqtida tiklanishi mumkin.

## Qidiruv qoidalari {#detection-rules}

Umumiy qoidalar oilalari quyidagilarni o'z ichiga oladi:

|Qoidalar oilasi |Misol uchun shart |Oddiy javob |
| --- | --- | --- |
|Tezlik |Hisobvaraq koʻp vaqt ichida kutilayotgan miqdordan ortiq mablagʻni oʻtkazadi |Ogohlantirish tekshiruvchilari va ushbu hisob uchun ariza tarafidagi mablag ' larni toʻxtatish |
|Oʻchirish |Toʻlovlar bitta hisobdan koʻpgina yangi hisobvaraqlarga oʻtadi . |Qoʻshimcha oʻtkazib berishga ruxsat berishdan oldin qoʻllanma tasdiqlashni talab qiling |
|O ' lchash bilan taqqoslash |Hisobot balansining katta qismi kalit, alias yoki metadata o'zgarishidan ko'p o'tmay qoladi. |Muhokamalarni imkon qadar koʻpaytirish |
|Imtiyozlarni kuchaytirish |Yuqori tavakkalchilikli ruxsatnoma yoki rol o ' zgarish oynasidan tashqarida beriladi |Operatorlarni ogohlantirib , grant operatsiyasini koʻrib chiqish |
|Tanqid boʻlib chiqdi |Bir imzochi yoki mijoz qayta-qayta rad etilgan bitimlarni amalga oshiradi |Sertifikatlarni suiiste'mol qilish, integratsiya xatolari yoki tekshiruvdan o'tish uchun tekshirish |
|Avtomatsiya oʻzgarishi |Trigger , kontrakt yoki ijrochi bilan bogʻliq obʼekt kutilmagan tarzda oʻzgaradi |Oʻzgarish qayta koʻrib chiqilguniga qadar bogʻliq ish oqimlarini toʻxtatish |
|Boshqaruvga taalluqli oʻzgarishlar |Tengdoshlar, konfiguratsiya yoki ishga tushirish vaqti holati oʻzgarishi tasdiqlangan chiptasiz sodir boʻladi |Boshqaruv rejimi va hodisalar jarayoni bilan taqqoslash |

Qoidalar ular uchun zarur bo'lgan dalillar, ularni baholash vaqti, ular qanday chora ko'rishlari va ishni tugatishi mumkin bo'lgan shaxs yoki tizim haqida aniq bo'lishi kerak. Mijoz tavakkalchiligiga, aktiv turiga yoki yurisdiksiyaga bog'liq bo'lgan chegaralar ad hoc skriptlarda emas, balki monitoring xizmati konfiguratsiyasida mavjud.

## Javoblarni nazorat qilish {#response-controls}

Ogohlantirishlarni qo'llashdan oldin javob berish choralarini loyihalashtirish. Yuqori jiddiylikdagi firibgarlik ishi aniqlanishidan to cheklovgacha hujjatlashtirilgan yo'nalishga ega bo'lishi kerak:

- tegishli domen yoki aktivni belgilash uchun mas'ul bo'lgan xavfsizlik, operatsiya va biznes egalarini xabardor qilish
- aniqlanish qoidasi tomonidan ishlatiladigan hodisa kursorini, blok hashini, transaksiya hashini, vakolatni, foydali yukni va so'rov fotosuratini saqlash
- dasturiy ta'minot ro'yxatidan tashqarida bo'lgan dastur tarafidagi harakatlarni to'xtatish, masalan, checkout, withdrawal, signing, bridge yoki settlement ish oqimlari
- hodisalarga qarshi kurashish rejasi bilan endi asoslanmagan rollar yoki ruxsatnomalarni bekor qilish;
- aktiv boshqaruv siyosati va ruxsatnoma modeli ularga yo'l qo'ygan hollarda, faqat kuzatuv daftaridagi operatsiyalarni taqdim etish
- dalillarga koʻra imzochi kelishmovchilikka duchor boʻlganda kalitlarni aylantirish

Monitoring xizmatiga keng yozma kirish huquqini bermaslik kerak. javob harakatlari uchun zarur bo'lgan eng kichik ruxsatnomalar to'plami bilan maxsus texnik hisobdan foydalaning. Insonning roziligi aktivlarni ko'chirish, ruxsatnomalarni o'zgartirish yoki validatorga qaratilgan konfiguratsiyani o'zgartirishi mumkin bo'lgan har qanday ish oqimining bir qismi bo'lishi kerak.

## Dalillar va saqlanish {#evidence-and-retention}

Monitoring ma'lumotlarini validator ma'lumotlar direktoriyasidan alohida bo'lgan faqat qo'shimcha tizimda saqlash. Har bir ogohlantirish quyidagilarni o'z ichiga oladi:

- hodisalar oqimi nomi va kursor
- blok balandligi yoki mavjud bo'lganda blok hash
- Transaksiya hash va vakolatlari
- Ta'sirlangan hisobvaraq, domen, aktiv, vazifa, qo'zg'atuvchi yoki konfiguratsiya ID
- xom hodisa payload yoki uning kanonik hash
- Ogohlantirishni boyitish uchun ishlatiladigan soʻrov darrovlari
- Qoida nomi, versiyasi, chegara, ball va sharhlovchining qarori

Agar siz tarmoqning ma'lumotlarni boshqarish siyosati aniq ruxsat bermaganicha, o'ziga xos tekshiruv notlarini ommaviy metadata sifatida saqlashingiz kerak emas. Agar siz zaxira tashqaridagi holatni zaxira bo'lgan holat bilan bog'lashingiz kerak bo'lsa, shaxsiy ma'lumotni oshkor etmaydigan holat identifikatorini, imzolangan guvohnomani yoki hash majburiyatini afzal ko'ring.

## Amalga oshirishni tekshirish ro'yxati {#implementation-checklist}

- `/metrics` va operator yo'nalishlari uchun zarur bo'lgan telemetriya profilini qo'llash.
- Siz kuzatayotgan ob'ektlar uchun tor filtrlar bilan Torii hodisa oqimlariga obuna bo'ling.
- Monitor bo'shliqsiz qayta tiklanishi uchun hodisalar kursorlarini saqlang.
- O'tkazib yuborilgan so'rovlarni muntazam jadvalga qo'shing.
- Xavflar darajasini saqlang va ro'yxatlarni versiya nazoratli konfiguratsiyalarda qo'yish mumkin.
- Avtomatik harakatlarni qo'llashdan oldin tarixiy bloklarga qarshi ogohlantirish qoidalarini sinab ko'ring.
- Javob chora-tadbirlari uchun maxsus texnik hisobotlardan foydalaning.
- Tekshiruv roli va ruxsatnomalarni qayta tiklanuvchi jadvalga ko'ra berish.
- Hujjatlarga javob berish jarayoniga firibgarlik monitoringini ogohlantirishlarni kiritish.

## Bogʻliq sahifalar {#related-pages}

- [O'zgarishlar](/uz/blockchain/events.md)
- [Filterlar](/uz/blockchain/filters.md)
- [So'rovlar](/uz/blockchain/queries.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ishlab chiqarish va ko'rsatkichlar](/uz/guide/advanced/metrics.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Operatsiyaviy xavfsizlik](/uz/guide/security/operational-security.md)
