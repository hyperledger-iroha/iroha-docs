---
translation_locale: uz
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Firibgarlikni nazorat qilish {#fraud-monitoring}

Iroha joylashtirilishida firibgarlikni kuzatish — reyestr hodisalari, so‘rovlar, ruxsatlar va ilova kontekstiga tayangan operatsion nazoratdir. Iroha nimalar yuborilgani, qabul qilingani, rad etilgani va yakuniy ravishda yozilganini qayd etadi. Kuzatuv tizimingiz biznes jarayoningiz uchun qaysi andozalar shubhali ekanini belgilaydi va bunday holatlarni tekshiruvchilarga yoki avtomatik javob nazoratlariga yo‘naltiradi.

Firibgarlikni kuzatishni validatorga joylashtirilgan mantiq sifatida emas, alohida xizmat sifatida ko‘rib chiqing. Xizmat reyestrdagi faoliyatga obuna bo‘lishi, uni off-chain xavf konteksti bilan boyitishi, dalillarni saqlashi va javob tranzaksiyalarini faqat aniq ruxsatlarga ega hisoblar orqali yuborishi kerak.

## Monitoring modeli {#monitoring-model}

Foydali monitoring dasturiy ta'minotini qayta ishlash ish jarayoni to'rtta bosqichga ega:

1. Torii voqea oqimlari, so‘rovlar va metrikalardan reyestr va operator signallarini yig‘ing.
2. Voqealarni mijoz holati, qarama-qarshi tomon ro‘yxatlari, ilova sessiyasi identifikatorlari, kutilayotgan chegaralar va ish IDlari kabi off-chain kontekst bilan boyiting.
3. Shubhali xatti-harakatlarni aniqlash uchun deterministik qoidalar, ko‘rib chiquvchi navbatlari yoki xavf baholashidan foydalaning.
4. Boshqaruv jarayoningiz bunga imkon berganda, operatorlarni ogohlantirish, ilova tomonidagi ish jarayonlarini to‘xtatish, keraksiz ruxsatlarni bekor qilish yoki kompensatsion operatsiyalarni yuborish orqali javob bering.

Har bir tasdiqlovchi ayni qarorni takrorlashi shart bo‘lmasa, siyosat qarorlarini konsensusdan tashqarida saqlang. Bajarish muhiti ruxsatlar va tranzaksiya yaroqliligini tekshirishi kerak. Firibgarlik monitoringi xavfni tushuntirishi, dalillarni saqlashi va operatorlarga tez harakat qilishda yordam berishi lozim.

## To'plash uchun signallar {#signals-to-collect}

Tor obunalar bilan boshlang va faqat tekshiruv uchun kengroq oqimlarni qo'shing:

|Signal|Manba|Foydalanish|
| --- | --- | --- |
|Tranzaksiya holati|dasturiy ta'minot ishlov berish ish oqimi voqealari|Takroriy rad etishlarni, muvaffaqiyatsiz avtorizatsiya urinishlarini va g‘ayrioddiy topshirish shakllarini aniqlang|
|Hisob yuritish muddati va metadata|Ma'lumot voqealari va hisob so'rovlari|Yangi hisoblarni, taxallus o‘zgarishlarini, shaxsiyat yangilanishlarini va kutilmagan metadata tahrirlarini aniqlang|
|Aktivlar balanslari va o'tkazmalar|Mol-mulk ma'lumotlari voqealari va mol-mulk so'rovlari|Yu yuqori qiymatli harakatlarni, tez tarqalishni, balans oqimlarini va g‘ayrioddiy shaxslarni aniqlang|
|Rollar va ruxsatlar|Rol va ruxsat so'rovlari, rol ma'lumotlari voqealari|Imtiyozlarni ko‘tarishni, favqulodda ruxsatlarni va eskirgan yuqori xavfli kirishni aniqlash|
|Tetik va shartnoma o‘zgarishlari|Trigger, shartnoma va ijrochi hodisalari|Yangi avtomatlashtirishni, o'zgartirilgan bajarish yo'llarini va shubhali yangilanish faoliyatini aniqlang|
|Konfiguratsiya va tarmoq tengdosh o'zgarishlari|Konfiguratsiya va tarmoq tengdosh voqealari|Tekshirish, tarmoq yoki operator ko‘rinishini ta’sir qiluvchi boshqaruv o‘zgarishlarini aniqlang|
|Operator salomatligi| `/metrics` va Sumeragi holat yo‘llari |Shubhali foydalanuvchi xatti-harakatlarini tugun ortiqcha yuklanishi, navbat bosimi yoki tarmoq xatolaridan ajrating|

Qoidal faqat hisoblar, aktivlar, rollar yoki konfiguratsiya o‘zgarishlariga ehtiyoj sezganda, butun tadbir oqimini qayta ishlashdan qochish uchun [tadbir filtrlari](/uz/blockchain/filters.md) dan foydalaning. Davriy moslashtirish uchun, monitor ishlamay qolganidan keyin tiklanishi uchun oqimni sahifalangan [so'rovlar](/uz/blockchain/queries.md) bilan birlashtiring.

## Aniqlash qoidalari {#detection-rules}

Umumiy qoida oilalariga quyidagilar kiradi:

|Qoidalar oilasi|Misol shart|Odatdagi javob|
| --- | --- | --- |
|Tezlik|Hisob qisqa vaqt ichida kutilgan miqdor yoki hisobdan ko'proq pul o'tkazadi|Sharhlovchilarni ogohlantiring va ushbu hisob uchun ilova tomonidagi yechib olishlarni to'xtating|
|Tarqalish|Vositachim hisobdan ko‘plab yangi ko‘rilgan hisoblarga mablag‘larni yuboradi|Qo‘shimcha o‘tkazmalarni ruxsat berishdan oldin qo‘l bilan tasdiqlashni talab qil|
|Balansni kamaytirish|Hisob balansining katta qismi kalit, taxallus yoki metadata o‘zgarganidan qisqa vaqt o‘tib ketadi|Hisob egasini qo'lga kiritish imkoniyatini oshirish|
|Imtiyoz oshirish|Oʻzgartirish oynasi tashqarisida yuqori xavfli ruxsat yoki rol beriladi|Operatorlarni ogohlantiring va grant tranzaksiyasini ko'rib chiqing|
|Takroriy rad etilishlarning oshishi|Bir imzolovchi yoki mijoz takrorlangan rad etilgan tranzaksiyalarni ishlab chiqaradi|Kredential suiiste'moli, integratsiya xatolari yoki sinovlarni tekshiring|
|Avtomatlashtirish o'zgarishi|Bir trigger, shartnoma yoki ijrochi bilan bog‘liq obyekt kutilmaganda o‘zgaradi|O'zgarish ko'rib chiqilmaguncha bog'liq ish jarayonlarini to'xtating|
|Boshqaruvga sezgir o‘zgarish|tarmoq hamkori, konfiguratsiya yoki dastur ijro muhitining holati tasdiqlangan chiptasiz o‘zgaradi|Boshqaruv yozuvlari va hodisa jarayoni bilan solishtiring|

Qoidalar ular talab qiladigan dalillar, baholaydigan vaqt oynasi, amalga oshiradigan harakatlari va yopishi mumkin bo‘lgan shaxs yoki tizim haqida aniq bo‘lishi kerak hollat. Mijozning xavfi, aktiv turi yoki yurisdiktsiyaga bog‘liq bo‘lgan chegaralar sizning monitoring xizmatining sozlamalarida bo‘lishi kerak, tasodifiy skriptlarda emas.

## Javob nazorati {#response-controls}

Ogohlantirishlarni yoqishdan oldin javob choralarini rejalashtiring. Yuqori darajadagi firibgarlik holati aniqlashdan to cheklashgacha hujjatlashtirilgan yo'lga ega bo‘lishi kerak:

- ta'sirlangan domen yoki aktiv ta'rifi uchun mas'ul bo'lgan xavfsizlik, operatsiyalar va biznes egalariga xabar bering
- aniqlash qoidasi ishlatgan hodisa kursori, blok xeshi, tranzaksiya xeshi, vakolat hisobi, foydali yuk va so‘rov oniy nusxasini saqlang
- blockchain ledgeridan tashqaridagi ilova tomonidagi harakatlarni to‘xtatish, masalan, chekaut, pul yechib olish, imzolash, ko‘prik yoki moliyaviy tranzaksiya hisob-kitob ishlari
- voqeaga javob berish rejasi tomonidan endi asoslanmaydigan rollar yoki ruxsatlarni bekor qilish
- faol boshqaruv siyosati va ruxsat modeli ularga ruxsat berganidagina keyingi reyestr tranzaksiyalarini yuboring
- kalitlarni aylantiring agar dalillar imzolovchining buzilganligini ko‘rsatganda

Monitoring xizmatiga keng yozish huquqini bermang. Javob choralarini bajarishga yetarli eng kam ruxsatlar to‘plamiga ega maxsus texnik hisobdan foydalaning. Aktivlarni o‘tkazishi, ruxsatlarni yoki tasdiqlovchilarga oid konfiguratsiyani o‘zgartirishi mumkin bo‘lgan har qanday ish jarayonida inson tasdig‘i saqlansin.

## Dalillar va saqlash {#evidence-and-retention}

Monitoring dalillarini tasdiqlovchi ma'lumotlar katalogidan alohida bo‘lgan faqat qo‘shishga mo‘ljallangan tizimda saqlang. Har bir ogohlantirish quyidagilarni o‘z ichiga olishi kerak:

- voqealar oqimi nomi va kursor
- blok balandligi yoki mavjud bo'lsa blok kriptografik xeshi
- tranzaksiya kriptografik xash va vakolat hisobi
- ta’sirlangan hisob, domen, aktiv, rol, tetiklovchi yoki konfiguratsiya ID si
- xom voqea yuklamasi yoki uning kanonikli kriptografik xeshi
- xabarnomani boyitish uchun foydalanilgan punkt-vaqt ma'lumotlari ko'rinishlarini so'rov qilish
- qoidaning nomi, versiyasi, chegarasi, ball, va sharhlovchi qarori

Tarmoqning maʼlumotlarni boshqarish siyosati aniq ruxsat bermasa, sezgir tergov yozuvlarini jamoat blokcheyn reestri metamaʼlumotlari sifatida saqlamang. Agar sizga ulanishingiz kerak bo‘lsa zanjirdan tashqari holatni zanjirli holatga o'tkazishda, shaxsiy tafsilotlarni oshkor qilmaydigan holat identifikatori, imzolangan guvohnoma yoki kriptografik xesh kriptografik majburiyat qiymatini afzal ko'ring.

## Ishga tushirish ro'yxati {#implementation-checklist}

- `/metrics` va operator marshrutlari uchun kerakli telemetriya profilini yoqing.
- Siz kuzatayotgan obyektlar uchun tor filtrlarga ega bo‘lgan Torii voqea oqimlariga obuna bo‘ling.
- Kuzatuvchi bo‘shliqlarsiz davom eta olishi uchun voqea kursorlarini saqlang.
- Oqimlarni muntazam jadval bo‘yicha sahifalangan so‘rovlar bilan uyg‘unlashtiring.
- Xavf chegaralari va ruxsat berilgan ro‘yxatlarni versiya nazoratidagi konfiguratsiyada saqlang.
- Avtomatlashtirilgan harakatlarni yoqishdan oldin test ogohlantirish qoidalarini tarixiy bloklarga nisbatan sinab ko‘ring.
- Javob choralari uchun maxsus texnik hisoblardan foydalaning.
- Vazifa va ruxsat berish huquqlarini takroriy jadval bo‘yicha ko‘rib chiqing.
- Hodisaga javob berish jarayoniga firibgarlikni kuzatish ogohlantirishlarini kiriting.

## Tegishli sahifalar {#related-pages}

- [Tadbirlar](/uz/blockchain/events.md)
- [Filtrlar](/uz/blockchain/filters.md)
- [So'rovlar](/uz/blockchain/queries.md)
- [Ruxsatlar](/uz/blockchain/permissions.md)
- [Ijro etish va o‘lchovlar](/uz/guide/advanced/metrics.md)
- [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md)
- [Operatsion Xavfsizlik](/uz/guide/security/operational-security.md)
