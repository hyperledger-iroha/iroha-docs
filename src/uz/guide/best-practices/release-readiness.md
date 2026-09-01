---
translation_locale: uz
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Chiqarishga tayyorgarlik {#release-readiness}

Iroha ilovasini yoki tarmoq o'zgarishini ilgari surishdan oldin, tegishli xavfni ochib beradigan eng kichik muhitda xulq-atvorni isbotlang, so'ngra ulashilgan testnet va ishlab chiqarish darvozalari orqali ongli tarzda harakat qiling.

## Localnet Shlyuzi {#localnet-gate}

- Vaqtinchalik mahalliy tarmoqni ayni Iroha yo‘nalishi va amalda imkon qadar yaqin tasdiqlovchilar soni bilan ishga tushiring.
- Tranzaksiya tuzuvchilari, so'rovni tahlil qilish, rad etishni boshqarish va konfiguratsiyani yuklash uchun birlik testlarini ishga tushiring.
- Keyinchalik ilova foydalanadigan bir xil SDK yoki CLI shakl orqali eng kichik muvaffaqiyatli o‘qish va yozish yo‘llarini mashq qiling.
- Kutilayotgan tranzaksiya kriptografik xeshlarini, holatlarini, voqealarni va holat o‘qishlarini test artefaktlarida saqlang.

Buni [Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) va [SDK Darsliklar](/uz/guide/tutorials/) ko‘ring.

## Ulashilgan Testnet Darvoza {#shared-testnet-gate}

- API endpoint xatti-harakati, to‘lovlar, hisobni moliyalashtirish, kechikish va operatsion mashqlar uchun Taira yoki boshqa umumiy testnetdan foydalaning.
- Jonli testnet yozuvlarini ixtiyoriy qilganda, odatiy test ishlari tarmoq mavjudligiga bog‘liq bo‘lmaydi yoki testnet mablag‘larini sarflamaydi.
- Har bir jonli test tranzaksiyasini yuborishdan oldin imzolovchi mablag‘ini, to‘lov aktivining metadata ma’lumotlarini, ruxsat beruvchi asosiy huquqlarni va kutilayotgan holatni tekshiring.
- Terminal holatni kuting, so‘ng natijaviy holatni faqat o‘qish uchun so‘rov bilan tekshiring.

Buni [SORA 3 ustida qurish: Taira va Minamoto](/uz/get-started/sora-nexus-dataspaces.md) ko‘ring.

## Asosiy tarmoq yoki Ishlab chiqarish eshigi {#mainnet-or-production-gate}

- Ishlab chiqarish uchun alohida imzolovchilar, mablag‘lar, domenlar va konfiguratsiya yo‘llaridan foydalaning. Sinov tarmog‘i kalitlari yoki kran haqidagi taxminlarni ishlab chiqarishga ko‘chirmang.
- Zarur SDK o‘rtasidagi ssenariylarni [Moslik matritsasi](/uz/reference/compatibility-matrix.md) yordamida tasdiqlang. Joylashtirishda ishlatiladigan aniq CLI, tugun ikkilik fayli, konfiguratsiya va tarmoq relizini alohida mahkamlang va sinang.
- Chiqarish oynasidan oldin ruxsatlarni, to‘lov homiyligini, stavka cheklovlarini, monitoringni, zaxira holatini va qaytarish mezonlarini ko‘rib chiqing.
- Yuqori ta’sirga ega yozuvlar uchun yozma tranzaksiya yoki migratsiya rejasini talab qiling.

## Qaytarish va Tiklash {#rollback-and-recovery}

- Kod joylashtirish orqali qaysi o‘zgarishlarni bekor qilish mumkinligini, qaysi o‘zgarishlar zanjirda tranzaksiya talab qilishini va qaysi o‘zgarishlarni to‘g‘ridan-to‘g‘ri bekor qilib bo‘lmasligini aniqlang.
- Zanjir ustidagi ma'lumot o'zgarishlari uchun birinchi ishlab chiqarish yozuvidan oldin kompensatsion tranzaksiyalar yoki ko'chirish skriptlarini tayyorlang.
- Tarmoq o'zgarishlari uchun, chiqarilish vaqtida avvalgi ikkilik fayl, konfiguratsiya paketi, imzolanmış blokcheyn genesis va operatsion ishlash qo'llanmasini mavjud holda saqlang.
- Radd etish darajasi, navbat o‘sishi, kechikish yoki tarmoq hamkorining sog‘lig‘i kabi obyektiv signallarga asoslanib rolloutni to‘xtatish uchun qaror nuqtasini belgilang.

## Yakuni ro‘yxat {#final-checklist}

- Konfiguratsiya muhitga xos va faqat test uchun mo‘ljallangan maxfiy ma’lumotlarni o‘z ichiga olmaydi.
- Tranzaksiya takrorlash xulq-atvori idempotent yoki aniq chegaralangan.
- Ilova rad etish, muddati tugash, vaqt tugashi va API tugun mavjud emasligi xatolarini ajrata oladi.
- Monitoring oqim tezligi, kechikish, navbat chuqurligi, rad etishlar, ko‘rinish o‘zgarishlari va tegishli biznes voqealarini o‘z ichiga oladi.
- Operatorlar kutilgan nosozlik holatlari uchun ish qo'llanmalarga ega.
- Xavfsizlik tekshiruvi asosiy saqlash, ruxsatlar, tarmoqga ochiqlik va avtomatlashtirish ruxsat tamoyilini qamrab oldi.
