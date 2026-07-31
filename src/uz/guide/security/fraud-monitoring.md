---
translation_locale: uz
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aldatishlarni nazorat qilish {#fraud-monitoring}

A) Oʻzbekiston Respublikasining Iroha ishga tushirish - bu atrofida qurilgan operatsion nazorat
Katakchilik hodisalari, so'rovlar, ruxsatnomalar va dastur konteksti. Iroha qanday ro'yxatga olish
taqdim etilgan, qabul qilingan, rad etilgan va amalga oshirilgan.
Sizning biznes jarayoningiz uchun qanday namunalar shubhali va ushbu holatlarni yoʻlga qoʻyish
tekshiruvchilarga yoki avtomatik javob nazoratchilariga.

Ayniqsa, aldamlik monitoringini o'ziga xos xizmat sifatida qabul qiling.
Xizmatda katta ma'lumotlar to'plami faoliyati qayd etilishi, uni boyitishi kerak
Xatcho'pdan tashqaridagi tavakkalchilik kontekstida, dalillar mavjud bo'lib qolishi va faqat javob berish tranzaksiyalarini taqdim etish
aniq ruxsatnomalarga ega bo'lgan hisoblar orqali.

## Nazorat modeli {#monitoring-model}

Foydali monitoring tizimida to'rt bosqich mavjud:

1. **Toʻplash** ko'rsatkichlar va operator signallari Torii hodisalar oqimi, so'rovlar,
   va metrikalar.
2. **Boylashtirish** mijozning holati kabi zanjirdan tashqari kontekstdagi hodisalar,
   kontraktlar ro'yxatlari, ariza seansini identifikatsiyalash belgilari, kutilayotgan cheklovlar va
   holat IDs.
3. **Koʻrish** deterministik qoidalar, sharhchi navbatlari bilan shubhali xulq-atvor yoki
   tavakkal qilish.
4. **Javob bering** operatorlarni ogohlantirib, dasturlar bo'yicha ish oqimlarini to'xtatish orqali;
   zaruriy ruxsatnomalarni bekor qilish yoki kompensatsiya to'lovlarini taqdim etish
   Agar sizning boshqaruv jarayoningiz imkon bersa.

Har bir tasdiqlovchi o'z qarorini qayta ko'rib chiqish kerak bo'lmasa , siyosat qarorlarini konsensusdan tashqarida saqlash
Ish vaqti tasdiqlash uchun ruxsatnomalar va tranzaksiyalarni qo'llash kerak
haqiqiyligi. Xilashchilikni nazorat qilish xavfni tushuntirish, dalillarni saqlash va yordam berish kerak
operatorlar tez harakat qiladi.

## To'plash uchun signallar {#signals-to-collect}

Kichik obunalar bilan boshlang va faqat tekshirish uchun kengroq oqimlarni qo'shing:

| Signal | Manba | Foydalanish |
| --- | --- | --- |
| Transaksiya holati | Pipeline hodisalari | Takrorlanayotgan rad etishlarni, muvaffaqiyatsizlikka uchragan ruxsat berish urinishlarini va odatiy bo'lmagan taqdim etish usullarini aniqlash |
| Hisobvaraqning hayot davri va metadotlar | Ma'lumotlar hodisalari va hisobot so'rovlari | Yangi hisoblarni, alias o'zgarishlarini, shaxsni yangilash va kutilmagan metadata tahrirlarini aniqlash |
| Aktivlar saldi va o'tkazmalar | Aktiv ma'lumotlari hodisalari va aktiv so'rovlari | Yuqori qiymatli harakatlarni, tezda ventilatsiya o'tishini, muvozanat oqimlarini va odatiy hollarga ega bo'lmagan to'qnashuvlarni aniqlash |
| Oʻrinlar va ruxsatnomalar | Roli va ruxsatnoma so'rovlari, roli ma'lumotlari hodisalari | Maxsus imtiyozlarning kuchayishi, favqulodda yordamlar va yuqori xavfli kirishlarni aniqlash |
| Trigger va shartnoma o'zgarishlari | Trigger, kontrakt va ijrochi hodisalari | Yangi avtomatlashtirish, o'zgargan ijro yo'nalishlari va shubhali yangilanish faoliyatini aniqlash |
| Konfiguratsiya va tengdoshlar o'zgarishi | Konfiguratsiya va tengdoshlar hodisalari | Validatsiya, tarmoqlashtirish yoki operatorning ko'rinishini ta'sir qiladigan boshqaruv o'zgarishlarini aniqlash |
| Operatorning sog'ligi | `/metrics` va Sumeragi holati yo'nalishlari | Foydalanuvchilarning shubhali xatti-harakatlarini nodlar ortiqcha yuklanishidan, navbat bosimidan yoki tarmoq xatolaridan ajratish |

Foydalanish [hodisa filtrlari](/uz/blockchain/filters.md) butun hodisani qayta ishlashdan qochish uchun
Qoida faqat hisoblar, aktivlar, rollar yoki konfiguratsiya o'zgarishlariga muhtoj bo'lganda oqim.
Vaqti-vaqti bilan uzviylash uchun oqishni sahifalar bilan birlashtiring
[savollar](/uz/blockchain/queries.md) so'ng monitor o'z vaqtida tiklanishi mumkin.

## Qidiruv qoidalari {#detection-rules}

Umumiy qoidalar oilalariga quyidagilar kiradi:

| Qoidalar oilasi | Misol shartlari | Oddiy javob |
| --- | --- | --- |
| Tezlik | Hisobvaraqda ko'p miqdordagi mablag'lar o'tkaziladi | Ogohlantirish tekshiruvchilari va ushbu hisobvaraq uchun ariza tomoni bo'yicha pul olishlarni to'xtatish |
| Fan-out | Toʻlovlar bitta hisobdan koʻpgina yangi hisoblarga oʻtadi | Qo'shimcha o'tkazib yuborishga ruxsat berishdan oldin qo'l tomonidan tasdiqlanishni talab qilish |
| Tovar bilan taqqoslash | Konti balansining katta qismi kalit, alias yoki metadata o'zgarishidan keyin tez orada qoladi | Muhokamalarni imkon qadar ko'proq o'tkazish |
| Imtiyozlarning ortib borishi | O'zgarish oynasidan tashqarida yuqori tavakkalchilikli ruxsatnoma yoki rol beriladi | Operatorlarni ogohlantirish va grant operatsiyasini ko'rib chiqish |
| Ruxsatdan voz kechish | Bir imzochi yoki mijoz qayta-qayta rad etilgan bitimlarni amalga oshiradi | Ma'lumotlarni suiiste'mol qilish, integratsiya xatolari yoki tekshiruvlar uchun tekshirish |
| Avtomatlashtirish oʻzgarishi | Qo'zg'atuvchi, shartnoma yoki ijrochi bilan bog'liq ob'ekt kutilmagan tarzda o'zgaradi | Oʻzgarish qayta koʻrib chiqilguniga qadar ish oqimlarini toʻxtatish |
| Boshqaruvga taalluqli o'zgarishlar | Tengdoshlar, konfiguratsiya yoki ish vaqti holati o'zgarishi tasdiqlangan chiptasiz sodir bo'ladi | Boshqaruv rejimi va hodisalar jarayoni bilan taqqoslash |

Qoidalar ular uchun zarur bo'lgan dalillar, ular kerak bo'lgan vaqt
baholash, ular amalga oshiradigan harakatlar va shaxs yoki tizimni yopish mumkin bo'lgan
mijozning tavakkalchiligiga, aktiv turiga yoki yurisdiksiyaga bog'liq bo'lgan chegaralar
monitoring xizmati konfiguratsiyasida bo'lish, ad hoc skriptlarda emas.

## Javoblarni nazorat qilish {#response-controls}

Ogohlantirishlarni qo'llashdan oldin javob choralarini ishlab chiqish.
aniqlanishdan saqlashgacha yo'nalishning hujjatlashtirilgan yo'li bo'lishi kerak:

- xavfsizlik, operatsion va biznes egalarini xabardor qiladi
  Ta'sirlangan domen yoki aktivning ta'rifi
- hodisa kursorini, blok hashini, tranzaksiya hashini, vakolatni, foydali yukni saqlab qolish
  va aniqlash qoidasi bilan ishlatiladigan soʻrov darslari
- talabnomalar bo'yicha hisobdan tashqari harakatlarni to'xtatish, masalan, checkout;
  Chiqarish, imzolash, ko'prik yoki kelishuv ish oqimlari
- hodisa tufayli asoslanmagan ro'yxat yoki ruxsatnomalarni bekor qilish
  javob rejalari
- aktiv boshqaruv siyosati amalga oshirilganda faqat keyingi hisob raqamlari bo'yicha operatsiyalarni taqdim etadi
  va ruxsatnoma modeli ularga imkon beradi
- dalillarga koʻra , imzochi kelishmovchilikka duch kelganida kalitlarni aylantiring .

Monitoring xizmatiga keng yozish imkoniyatini bermaslik.
javob uchun zarur bo'lgan eng kichik ruxsatnomalar to'plami bilan texnik hisob
insonning roziligi har qanday
aktivlarni ko'chirish, ruxsatnomalarni o'zgartirish yoki validatorga qarashni o'zgartirishi mumkin bo'lgan ish oqimi
konfiguratsiya.

## Isbotlar va saqlash {#evidence-and-retention}

Monitoring ma'lumotlarini faqat qo'shimcha tizimda saqlash
valitator ma'lumotlar direktoriyasi. Har bir ogohlantirish quyidagilarni o'z ichiga olishi kerak:

- hodisalar oqimi nomi va kursor
- blok balandligi yoki mavjud bo'lganda blok hash
- Transaksiya hash va vakolat
- Ta'sirlangan hisob, domen, aktiv, rol, qo'zg'atuvchi yoki konfiguratsiya ID
- xom hodisa payload yoki uning kanonik hash
- ogohlantirishni boyitish uchun ishlatiladigan soʻrov darslari
- Qoida nomi, versiyasi, chegara, ball va sharhlovchi qarori

Xavfsiz tekshiruv notlarini ommaviy katta ma'lumotlar sifatida saqlash kerak emas,
tarmoqning ma'lumotlarni boshqarish siyosati aniq ruxsat beradi.
zanjirdan tashqari holatda zanjirga o'xshash holatda bo'lish, holat identifikatorini afzal ko'rish, imzolangan guvohnoma;
yoki shaxsiy ma'lumotlarni oshkor etmaydigan hash majburiyati.

## Amalga oshirishni nazorat qilish ro'yxati {#implementation-checklist}

- Telemetriya profilini ishga tushirish `/metrics` va operator yo'nalishlari.
- Foydalaning Torii Siz oʻrganayotgan obʼektlar uchun tor filtrlar bilan hodisa oqimlari
  monitor.
- O'zgarishlar kursorlarini saqlang, shunda monitor bo'shliqsiz qayta tiklanishi mumkin.
- Oddiy jadvalda sahifalar bilan o'tkazilgan so'rovlarni uyg'otish.
- Xavflar darajasini saqlang va ro'yxatlarni versiya nazoratli konfiguratsiyalarda qo'yishga ruxsat bering.
- Avtomatik harakatlarni qo'llashdan oldin tarixiy bloklarga qarshi ogohlantirish qoidalarini sinovdan o'tkazish.
- Javob chora-tadbirlari uchun maxsus texnik hisobotlardan foydalanish.
- Tekshirish roli va ruxsat berishlarni takrorlanadigan jadvalga ko'ra amalga oshirish.
- Hujjatlarga javob berish jarayoniga firibgarlikni nazorat qilish ogohlantirishlarini kiritish.

## Bogʻliq sahifalar {#related-pages}

- [Tadbirlar](/uz/blockchain/events.md)
- [Filterlar](/uz/blockchain/filters.md)
- [Savollar](/uz/blockchain/queries.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
- [Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md)
- [Operatsiya xavfsizligi](/uz/guide/security/operational-security.md)
