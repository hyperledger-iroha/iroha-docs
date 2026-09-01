---
translation_locale: uz
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operatsiyalar {#operations}

Operatsion tayyorlik — tasdiqlovchi xostlariga favqulodda kirishga tayanmasdan tarmoqni kuzatish, o‘zgartirish, zaxiralash va tiklay olishdir.

## Kuzatiluvchanlik {#observability}

- Telemetriya profillarini ataylab yoqing. `/metrics` kerak bo'lganda `extended` ni va batafsil Sumeragi operator marshrutlarini talab qiladigan test ishlari davomida `full` ni ishlating.
- Dashboard qabul qilingan o'tkazuvchanlik, rad etilgan o'tkazuvchanlik, protokol yakunlanishi kechikishi, navbat chuqurligi, navbat to'yinganligi, ko'rinish o'zgarishlari, tushirilgan konsensus xabarlari va saqlash bosimi ko'rsatadi.
- Status nuqtai nazaridagi ma’lumotlar koʻrinishlari, metrikalarni yigʻish, loglar va joylashtirish konfiguratsiyasini bir xil hodisa yoki benchmark artefaktlar toʻplamida saqlang.
- Doimiy navbat o‘sishi, kutilmagan rad etish cho‘qqilari, blok balandligining to‘xtashi, ko‘rish-o‘zgartirish o‘zgarishlari va tarmoq tengdoshlarining salomatligi o‘zgarishlari haqida ogohlantirish.

Buni [Ijro va Mezonlar](/uz/guide/advanced/metrics.md) ko‘ring.

## Ish yuritish qo'llanmalari {#runbooks}

- Tarmoq tengdoshini qayta ishga tushirish, Torii pasayishi, kalit buzilishi, ruxsat xatolari, to'lov homiysi tugashi, tiqilib qolgan navbatlar va tarmoq bo'linishi simptomlari uchun ish kitoblarini yozing.
- Yozish operatsiyalaridan oldin aniq faqat-o‘qish tekshiruvlarini qo‘shing, ayniqsa tarmoq hamkori ro‘yxatdan o‘tishi, ruxsat berish va parametr o‘zgarishlari uchun.
- Agar shaxsiy operatsion ma'lumotlarni o'z ichiga olsa, favqulodda aloqa va eskalatsiya qoidalarini hujjatlar reposidan tashqarida saqlang.
- Har bir hodisa, mashq yoki katta yangilanishdan so'ng runbuklarni ko'rib chiqing.

Buni [Operatsion Xavfsizlik](/uz/guide/security/operational-security.md) ko‘ring.

## Zaxira nusxalar va tiklash {#backups-and-recovery}

- Tarmoq hamkasbi saqlashini joylashtirish talab qiladigan tiklash nuqtasiga ko‘ra zaxiralang. Tiklashlarni ishlab chiqarish bo‘lmagan mezonlarda tekshiring.
- Tasdiqlovchi xosti ishlamasa ham, imzolangan boshlang‘ich holat, reliz metama’lumotlari, tugun konfiguratsiyasi va kalit saqlovi qaydlarini tiklash mumkin bo‘lsin.
- Tiklash jarayoni boshlang‘ich holatdan qayta quradimi, oniy nusxani tiklaydimi yoki ishlamay qolgan tugunni yangi identifikator bilan almashtiradimi — hujjatlashtiring.
- Hech qachon tiklash tartiblarini birinchi marta ishlab chiqarish hodisasi paytida sinab ko‘rmang.

## Oʻzgarishlarni boshqarish {#change-management}

- Zanjir ustidagi sozlamalar o‘zgarishlarini ko‘rib chiqishni, oldindan o‘qishni, ruxsat berishni va o‘zgarishdan keyingi tekshiruvni talab qiladigan tranzaksiyalar sifatida ko‘ring.
- Tarmoq hamkasbi dasturiy ta'minotini yangilashni moslik rejasi va qaytarish qarori nuqtasi bilan amalga oshiring.
- Agar ko'chirish rejasi buni talab qilmasa, bir xil texnik xizmat oynasida tarmoq tengdoshlarining topologiyasini, konsensus vaqtini va ilova ish yukini o'zgartirishdan saqlaning.
- Operatsion o‘zgarishlar uchun tranzaksiya kriptografik xeshlarini va blok balandliklarini yozib qo‘ying.

Buni [Issiq Qayta Yuklash](/uz/guide/advanced/hot-reload.md) va [Moslik Matrisi](/uz/reference/compatibility-matrix.md) ko‘ring.

## Quvvatni ko'rib chiqish {#capacity-reviews}

- Validatorlar soni, apparat, tarmoq joylashuvi, yuk aralashmasi yoki konsensus parametrlari o'zgarganda yuk tekshiruvlarini qayta bajarish.
- Qisqa eng yaxshi holatdagi o'tkazuvchanlik namunasiga tayanish o'rniga, isitish, barqaror holat va kutilayotgan maksimal yukni o'lchang.
- Qabul qilingan o'tkazuvchanlikni yakunlangan o'tkazuvchanlik va navbat chuqurligi bilan solishtiring. Agar yuborilgan TPS yakunlangan TPS dan oshsa va navbatlar o'ssa, tarmoq barqaror ishlash chegarasidan oshgan bo'ladi.
