---
translation_locale: uz
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Boʻshashga tayyorlik {#release-readiness}

O'zbekiston Respublikasi Iroha dastur yoki tarmoq o'zgarishi, xatti-harakatni isbotlash
tegishli tavakkalchilikni ko'rsatishi mumkin bo'lgan eng kichik muhitda, keyin
umumiy test tarmog'i va ishlab chiqarish darvozalari orqali bila turib.

## Mahalliy tarmoq darvozalari {#localnet-gate}

- Bir martalik mahalliy tarmoqni ishga tushirish Iroha yo'nalish va
  eng yaqin amaliy validatorlar soni.
- Transaksiyalarni yaratish uchun birlik sinovlarini o'tkazish, so'rovlarni tahlil qilish, rad etish
  boshqarish va yuklashni konfiguratsiya qilish.
- Eng kichik muvaffaqiyatli o'qish va yozish yo'llarini mashq qiling
  SDK yoki CLI ilova keyinchalik ishlatiladigan shakl.
- Tavsiya hashlari, holatlar, hodisalar va holatni olish
  sinov san'atlari.

Koʻring [Uchratish Iroha 3](/uz/get-started/launch-iroha.md) va
[SDK Darslar](/uz/guide/tutorials/).

## O'zaro testnet darvozalari {#shared-testnet-gate}

- Foydalanish Taira yoki oxirgi nuqta xulq-atvorini, to'lovlarni, hisobni ko'rsatish uchun boshqa umumiy testnet
  moliyalashtirish, kechikish va operatsion repetitsiyalar.
- Testnet-ni jonli saqlang Opt-in yozadi , shuning uchun odatdagi testlar
  tarmoq mavjudligi yoki testnet mablag'larini sarflash.
- imzochi mablag'larini, to'lov aktivlari metadatalarini, hokimiyat ruxsatlarini tekshirish va
  har bir jonli test operatsiyasini taqdim etishdan oldin kutilayotgan holat.
- Terminal holatini kuting, so'ngra natijali holatni
  Faqat o'qish uchun so'rov.

Koʻring
[Oʻzlashtiring SORA 3: Taira va Minamoto](/uz/get-started/sora-nexus-dataspaces.md).

## Asosiy tarmoq yoki ishlab chiqarish darvozalari {#mainnet-or-production-gate}

- O'ziga xos ishlab chiqarish imzolari, moliyalashtirish, domenlar va konfiguratsiya yo'nalishlaridan foydalaning.
  testnet kalitlari yoki faucet taxminlarini targ'ib qilmaydi.
- Tasdiqlash SDK, CLI, tengdoshlar va tarmoqlar bilan moslashuvchanlik
  [Qo'shish matrisi](/uz/reference/compatibility-matrix.md).
- Tekshirish ruxsatnomalari, to'lovlarni qo'llab-quvvatlash, stavkalar chegaralari, monitoring, ehtiyot qismlar
  Status va ozod qilish oynasidan oldin qaytish mezonlari.
- Yuqori ta'sirli yozuvlar uchun yozma bitim yoki migratsiya rejasi talab etiladi.

## Orqaga qaytish va tiklanish {#rollback-and-recovery}

- Qaysi o'zgarishlarni kodni ishga tushirish orqali qaytarib olish mumkinligini belgilash
  zanjir bo'yicha amalga oshiriladigan va to'g'ridan-to'g'ri bekor qilinmaydigan bitim.
- Xatcho'pdagi ma'lumotlar o'zgarishi uchun kompensatsiyaviy operatsiyalar yoki migratsiyalarni tayyorlang
  dastlabki ishlab chiqarishdan oldin skriptlar yozish.
- Tarmoq o'zgarishlari uchun oldingi ikkilamchi, konfiguratsiya to'plamini saqlang, imzolang
  genesis va ishga tushirish paytida mavjud bo'lgan operatsion qo'llanma.
- Obyektiv signallarga asoslanib ishga tushirishni bekor qilish uchun qaror chiqarishni belgilash
  Masalan, rad etish darajasi, navbatning o'sishi, kechikish yoki tengdoshlar sog'lig'i.

## Yakuniy tekshiruv ro'yxati {#final-checklist}

- Konfiguratsiya atrof-muhitga mos va faqat sinovlarni o'z ichiga olmaydi
  sirlar.
- Transaksiyalarni qayta sinab ko'rish xatti-harakati idempotent yoki aniq cheklangan.
- Talabnoma rad etish, muddati tugagani, muddat va oxirgi nuqtani farqlashi mumkin
  mavjudlik xatolari.
- Monitoring o'tkazib berish, kechikish, navbat chuqurligi, rad etishlar, ko'rinishni qamrab oladi
  o'zgarishlar va tegishli biznes tadbirlari.
- Operatorlar kutilayotgan xato rejimlarini ko'rsatish uchun yozuv daftarlariga ega.
- Xavfsizlik tekshiruvi kalitlarni saqlash, ruxsatnomalar, tarmoqlarga doir ta'sirni qamrab olgan va
  avtomatlashtirish organi.
