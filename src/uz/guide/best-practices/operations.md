---
translation_locale: uz
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operatsiyalar {#operations}

Operatsiyaviy tayyorlik tarmog'ini kuzatish, o'zgartirish mumkinligini anglatadi;
sertifikatlash vositasida o'rnatilgan va tasdiqlovchiga tasodifan kirishdan foydalanmasdan tiklangan
uy egalari.

## Ko'rib chiqish imkoniyati {#observability}

- Telemetriya profillarini qasddan o'chirib qo'ying. `extended` qachon `/metrics`
  zarur va `full` tafsilotlarni talab qiladigan sinovlar davomida Sumeragi
  operator yo'nalishlari.
- Ish stoli qabul qilingan o'tkazib berish, rad etilgan o'tkaziladigan o'tkazish, belgilangan kechikish vaqti, navbat
  chuqurlik, navbat to'ldirilishi, ko'rinish o'zgarishlari, konsensus xabarlari tushirilgan va
  saqlash bosimi.
- Status fotosuratlari, metrikalar, loglar va joylashtirishni saqlash
  bir xil hodisa yoki ma'lumotlar to'plamida konfiguratsiya.
- Qayta o'sish, kutilmagan rad etish ko'tarilishlari haqida ogohlantirish
  balandlik, ko'rinish o'zgarishi va tengdoshlarning sog'lig'i o'zgaradi.

Koʻring [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md).

## Dastlabkilar {#runbooks}

- Tengdoshlarni qayta boshlash uchun yozuvlar yozish, Torii degradatsiya, asosiy kompromisslar;
  ruxsat etish xatolari, to'lov sponsorining kamayishi, to'xtatilgan navbatlar va tarmoq
  bo'linish alomatlari.
- Yozish operatsiyalaridan oldin faqat o'qish uchun aniq tekshiruvlarni, ayniqsa
  tengdoshlar ro'yxatidan o'tish, ruxsat berish va parametrlarni o'zgartirish.
- Hushturma kontaktlari va kuchaytirish qoidalariga rioya qiling , agar
  ular xususiy operatsion ma'lumotlarni o'z ichiga oladi.
- Har bir hodisa, repetitsiya yoki katta yangilanishdan so'ng kitoblarni tekshiring.

Koʻring [Operatsiya xavfsizligi](/uz/guide/security/operational-security.md).

## Noto'g'rilik va tiklanish {#backups-and-recovery}

- O'z navbatida, o'zaro saqlashni qo'llab-quvvatlash
  Ishlab chiqarish bo'lmagan xostlarda tiklashlarni tasdiqlash.
- Imzolangan genesisni saqlang, metadatalarni oching, tengdoshlar bilan bog'lanish va kalitlarni saqlash
  Agar tasdiqlovchi host mavjud bo'lmasa ham, qayta tiklanishi mumkin bo'lgan rekordlar.
- Tiklanish jarayoni genesisdan tiklanadimi yoki yo'qmi hujjatlashtiradi.
  yoki muvaffaqiyatsizlikka uchragan tengdoshni yangi kimlik bilan almashtiradi.
- Hech qachon ishlab chiqarish paytida birinchi marta qayta tiklash tartib-taomillarini sinovdan o'tkazmang
  hodisa.

## Oʻzgarishlarni boshqarish {#change-management}

- Xatcho'pdagi konfiguratsiya o'zgarishlarini qayta ko'rib chiqish kerak bo'lgan bitimlar sifatida qabul qilish;
  parvozdan oldin o'qish, ruxsat berish va o'zgarishdan keyingi tekshirish.
- Kompatibilitet rejasini va qaytish bilan tengdoshlari uchun ikkilamchi yangilanishlar joriy etish
  qaror chiqarish joyi.
- Tengdosh topologiyasini, konsensus vaqtini va dastur ish yukini o'zgartirishdan qoching
  bir xil ta'mirlash oynasida, agar migratsiya rejasi buni talab qilmasa.
- Operativ o'zgarishlar uchun tranzaksiya hashlari va blok balandliklari qayd etilsin.

Koʻring [Issiq qayta yuklash](/uz/guide/advanced/hot-reload.md) va
[Qo'shish matrisi](/uz/reference/compatibility-matrix.md).

## Ishlab chiqarish quvvati tekshiruvi {#capacity-reviews}

- Validatorlar soni, asbob-uskunalar, tarmoq joylashuvi,
  ish yuklari aralashmasi yoki konsensus parametrlari o'zgaradi.
- Issiqlikni, doimiy holatni va kutilayotgan yuqori yukni o'lchashdan ko'ra
  eng yaxshi holatdagi qisqa o'tkazib berish namunasida.
- Qabul qilingan o'tkazib yuborishni belgilangan o'tkaziladigan va navbat chuqurligi bilan taqqoslang.
  taqdim etilgan TPS majburiyatdan oshadi TPS va navbatlar ko'payadi, tarmoq o'tgan
  uning barqaror qamrovini.
