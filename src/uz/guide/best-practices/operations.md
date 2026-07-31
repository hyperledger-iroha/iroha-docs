---
translation_locale: uz
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operatsiyalar {#operations}

Operatsiyaviy tayyorlik tarmog'ini tekshirish, o'zgartirish, qo'llab-quvvatlash va tiklash mumkinligini tasdiqlovchi hostlarga tasodifan kirishdan tashqari anglatadi.

## Ko'rib chiqish imkoniyati {#observability}

- Telemetriya profillarini qasddan faollashtiring. `extended` dan `/metrics` kerak bo'lganda va `full` dan Sumeragi operator yo'nalishlaridan iborat batafsil ma'lumotlarga muhtoj sinovlarda foydalaning.
- Dashboard qabul qilingan o'sish, rad etilgan o'sishi, qo'yilgan kechikish vaqti, navbat chuqurligi, navbat to'ldirilishi, ko'rinish o'zgarishlari, konsensus xabarlari tushirilgan va saqlash bosimi.
- Status fotosuratlarini, metriklar tarqatuvlarini, jurnallarni va joylashtirish konfiguratsiyasini bir xil hodisa yoki ma'lumotlar artifakti to'plamida saqlash.
- O'z navbatida o'sish, kutilmagan rad etish ko'tarilishi, blokning balandligi to'xtab qolishi, nuqtai nazar o'zgarishi va tengdoshlar sog'lig'idagi o'zgarishlar haqida ogohlantirish.

[Ishlab chiqarish va ma'lumotlar ](/uz/guide/advanced/metrics.md) ni ko'ring.

## Yo'llanmalar {#runbooks}

- Tengdoshlarni qayta ishga tushirish, Torii pasayishi, kalitni buzish, ruxsat etish xatolari, to'lov sponsorining kamayishi, to'xtatilgan navbatlar va tarmoq partitsiyasi alomatlari uchun ish daftarlarini yozing.
- Yozish operatsiyalaridan oldin faqat o'qish uchun aniq tekshiruvlarni, ayniqsa tengdoshlar ro'yxatidan o'tish, ruxsat berish va parametrlar o'zgarishi uchun kiriting.
- Xavfsizlik kontaktlari va kuchaytirish qoidalari shaxsiy operatsion ma'lumotlarni o'z ichiga olgan hujjatlar repolaridan tashqarida saqlansin.
- Har bir hodisa, repetitsiya yoki katta yangilanishdan so'ng kitoblarni ko'rib chiqing.

Qarang [Operatsiyaviy xavfsizlik](/uz/guide/security/operational-security.md).

## Noto'g'rilik va tiklanish {#backups-and-recovery}

- Tarqatish uchun zarur bo'lgan tiklash nuqtasiga ko'ra tengdoshlari saqlashni qo'llab-quvvatlash. Ishlab chiqarish bo'lmagan uy egalari uchun tiklashlarni tasdiqlang.
- Imzolangan genesisni saqlash, metadatalarni chiqarish, tengdoshlar konfiguratsiyasi va kalitlarni saqlab qolish yozuvlarini qayta tiklash mumkin bo'lsa ham, agar tasdiqlash host mavjud bo'lmasa ham.
- Qayta tiklash jarayoni paydo bo'lganidan qayta tiklanadimi, fotosuratdan tiklanadimi yoki muvaffaqiyatsiz tengdoshni yangi kimlik bilan almashtiradimi-yo'qligini hujjatlashtiring.
- Ishlab chiqarish hodisasi paytida hech qachon birinchi marta tiklash tartib-taomillarini sinab ko'rmang.

## Oʻzgarishlarni boshqarish {#change-management}

- Zaryaddagi konfiguratsiya o'zgarishlarini qayta ko'rib chiqish, parvozdan oldin o'qish, ruxsat berish va o'zgartirishdan keyin tekshirishni talab qiladigan bitimlar sifatida qabul qiling.
- Tengdoshlar bilan ikkilamchi yangilanishlarni muvofiqlik rejasi va qaytish qarori punkti bilan ishga tushiring.
- Agar migratsiya rejasi buni talab qilmasa, tengdoshlari topologiyasini, konsensus vaqtini va dastur ish yukini bir xil saqlash oynasida o'zgartirishdan qoching.
- Operativ o'zgarishlar uchun muomala hashlari va blok balandliklari qayd etilsin.

Koʻring [Issiq qayta yuklash](/uz/guide/advanced/hot-reload.md) va [Qo'shish matrisi](/uz/reference/compatibility-matrix.md).

## Imkoniyatni qayta ko'rib chiqish {#capacity-reviews}

- Valitatorlar soni, asbob-uskunalar, tarmoq joylashuvi, ish yuklari aralashmasi yoki konsensus parametrlari o'zgarganda yukni qayta tekshiring.
- Qisqa, eng yaxshi holatda o'tkazib yuborilgan namunaga tayanishning o'rniga issiqlikni, barqaror holatni va kutilayotgan yuqori yukni o'lchash.
- Qabul qilingan o'tkazib yuborishni belgilangan o'tkazish va navbat chuqurligi bilan taqqoslang. Agar taqdim etilgan TPS belgilangan TPS dan ortiq bo'lsa va navbatlar ko'paysa, tarmoq o'zining barqaror qamrovidan o'tdi.
