---
translation_locale: uz
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Boʻshash uchun tayyorlik {#release-readiness}

Iroha dasturini yoki tarmoq o'zgarishini targ'ib qilishdan oldin, tegishli tavakkalchilikni ko'rsatishi mumkin bo'lgan eng kichik muhitda xatti-harakatni isbotlang, so'ngra birgalikda sinov tarmog'i va ishlab chiqarish darvozalari orqali bila turib harakatlang.

## Yerli tarmoq darvozalari {#localnet-gate}

- O'sha Iroha yo'nalish va eng yaqin amaliy validatorlar soni bilan bir martalik mahalliy tarmoqni ishga tushirish.
- Transaction builderlari uchun birlik sinovlarini o'tkazing, so'rovlarni tahlil qilish, rad etishni boshqarish va konfiguratsiya yuklash.
- Ilova keyinchalik ishlatadigan SDK yoki CLI shakli orqali eng kichik muvaffaqiyatli o'qish va yozish yo'llarini mashq qiling.
- Tekshiruv artefaktlarida kutilayotgan tranzaksiya hashlari, statuslari, hodisalar va holat o'qishlarini ushlab turing.

Koʻring [Ishga tushish Iroha 3](/uz/get-started/launch-iroha.md) va [SDK Dasturlar](/uz/guide/tutorials/).

## Bajarilgan testnet darvozalari {#shared-testnet-gate}

- Taira yoki boshqa qo'shma testnetdan oxirgi nuqtalarning xatti-harakatlari, to'lovlar, hisob mablag'lari, kechikish va operatsion repetitsiyalar uchun foydalanish.
- Testnet-ni jonli saqlab qoling, shuning uchun odatdagi testlar tarmoq mavjudligiga yoki testnet mablag'larini sarflashga bog'liq emas.
- Har bir jonli test operatsiyasini taqdim etishdan oldin imzochi mablag'larini, to'lov aktivlari metadatalarini, vakolatlarga ruxsatnomalarni va kutilayotgan holatni tekshirish.
- Terminal holatini kuting, so'ngra natijali holatni faqat o'qish uchun so'rov bilan tasdiqlang.

Qarang [SORA 3-da qurilgan: Taira va Minamoto](/uz/get-started/sora-nexus-dataspaces.md).

## Mainnet yoki ishlab chiqarish darvozalari {#mainnet-or-production-gate}

- O'ziga xos ishlab chiqarish imzolari, moliyalashtirish, domenlar va konfiguratsiya yo'llaridan foydalaning. testnet kalitlarini yoki kranni qo'llab-quvvatlamang.
- SDK, CLI, tengdosh va tarmoq moslashuvchanligini [ Moslashuvchanlik matrisi](/uz/reference/compatibility-matrix.md) bilan tasdiqlash.
- Tekshiruv ruxsatnomalari, to'lovlarni qo'llab-quvvatlash, stavkalar chegaralari, monitoring, ehtiyot saqlash holati va chiqarilish oynasidan oldin tiklanish mezonlari.
- Yuqori ta'sirli qog'ozlar uchun yozma bitim yoki migratsiya rejasi talab etiladi.

## Orqaga qaytish va tiklanish {#rollback-and-recovery}

- Kodni ishga tushirish orqali qaysi o'zgarishlarni qaytarib olish mumkinligini, ular uchun zanjirdagi bitimlar kerak bo'lganini va ularni to'g'ridan-to'g'ri bekor qilolmaydiganlarini aniqlang.
- Zaryaddagi ma'lumotlar o'zgarishi uchun birinchi ishlab chiqarish yozishdan oldin kompensatsiya tranzaksiyalari yoki migratsiya skriptlarini tayyorlang.
- Tarmoq o'zgarishlari uchun avvalgi ikkilamchi, konfiguratsiya to'plami, imzolangan genesis va operatsion ishga tushirish daftarini chiqarishda saqlang.
- Ruxsatni rad etish darajasi, navbat o'sishi, kechikish yoki tengdoshlar sog'lig'i kabi ob'ektiv signallarga asoslanib ishga tushirishni bekor qilish uchun qaror nuqtasini belgilash.

## So'nggi tekshiruv ro'yxati {#final-checklist}

- Konfiguratsiya atrof-muhitga mos va faqat sinov uchun sirlarni o'z ichiga olmaydi.
- Transaksiyalarni qayta sinab ko'rish xatti-harakati idempotent yoki ochiqchasiga cheklangan.
- Ilova rad etish, muddati o'tishi, vaqt uzilishi va oxirgi nuqtalar mavjudligi xatolarini ajratib ko'rish mumkin.
- Monitoring o'tkazib berish, kechikish, navbat chuqurligi, rad etishlar, ko'rinishda o'zgarishlar va tegishli biznes hodisalarini qamrab oladi.
- Operatorlar kutilayotgan xato rejimlari uchun yo'lboshxonalarga ega.
- Xavfsizlik tekshiruvi kalitlarni saqlash, ruxsatnomalar, tarmoqlarga egalik qilish va avtomatlashtirish vakolatlarini qamrab oldi.
