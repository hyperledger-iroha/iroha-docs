---
translation_locale: uz
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Kriptografik kalitlarni saqlash {#storing-cryptographic-keys}

Xususiy kalit o'zi tegishli vakolatga ruxsat etilgan har qanday amalni tasdiqlashi mumkin. Xususiy kalitni hech qachon ulashmang. Seed materialini, tiklash sirlarini, bearer tokenlarni va eksport qilingan kalit fayllarini bir xil ehtiyotkorlik bilan himoya qiling.

Ishlab chiqarishni boshlashdan oldin kalitlarni saqlash modelini tanlang. Model xavf ostidagi qiymatga, hisob boshqaruvchisi siyosatiga va joylashtirishning tiklash jarayoniga mos kelishi kerak.

## Qo'riqlash chegaralarini aniqlang {#define-the-custody-boundary}

- Har bir vakolat, ochiq kalit, algoritm, muhit, maqsad, saqlovchi, saqlash joyi, zaxira nusxa va almashtirish tartibi inventarini yuriting.
- Ishlab chiqish, sinov, ishlab chiqarish, odatiy tranzaksiyalar, boshqaruv, joylashtirish va tiklash uchun alohida kalitlardan foydalaning.
- Odamlar va jarayonlarga faqat ularning vazifasi uchun zarur kalitlarga kirish huquqini bering.
- Xavf modeli talab qilsa, yuqori qiymatli yoki boshqaruv imzolari uchun mustaqil tasdiq talab qiling.
- Imzolovchi qaysi tarmoq va vakolatlardan foydalanishi mumkinligini qayd etish. Imzolash xizmati ushbu doiradan tashqaridagi arizalarni rad qilishi kerak.

## O'rinli saqlash usulini tanlang {#choose-an-appropriate-storage-method}

Mahalliy ishlab chiqish, nazorat qilinadigan sinovlar yoki xavfsiz saqlovchiga topshirish uchun kalit ruxsatlari cheklangan faylga eksport qilinishi mumkin. Qo'llab-quvvatlanadigan Unix platformasida `kagami` bilan yangi kalit katalogini yarating:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ota katalog mavjud bo'lishi kerak. Nishon katalog yangi yoki joriy foydalanuvchiga tegishli, `0700` rejimli, ramziy havolalarsiz va bo'sh bo'lishi kerak. Kagami `public.key` va `private.key` fayllarini `0600` rejimida yozadi; `--pop` `pop.hex` faylini ham yozadi. Kagami faqat egaga tegishli fayl tizimi qoidalarini ta'minlay olmaydigan platformalarda buyruq xato bilan yakunlanadi.

Xususiy kalit fayli shifrlanmagan eksportdir. Uni manba nazorati, ulashilgan jildlar, jurnallar, chiptalar, chat va build artefaktlaridan tashqarida saqlang. Ishlab chiqarish kalitini tasdiqlangan saqlash chegarasiga import qiling, so'ng eksport faylini joylashtirish tartibiga muvofiq olib tashlang. Ishlab chiqish kalitini ishlab chiqarishda qayta ishlatmang.

Ishlab chiqarish uchun quyidagilar kabi audit qilingan saqlash chegarasini afzal ko'ring:

- asbob-uskunalar xavfsizligi moduli yoki uskunalarga asoslangan kalit do'kon
- operatsion tizim yoki mobil kalit do'kon
- alohida imzolash xizmati
- kaliti faqat ruxsat etilgan ish yuklariga chiqarilgan sirli menejer

Tanlangan integratsiya ushbu xususiyatni qo'llab-quvvatlagan taqdirda kalit materialni eksport qilinmaydigan qilib saqlang. Qo'riqlash tizimi Iroha organi tomonidan talab etiladigan algoritm va imzolash operatsiyasini qo'llab - quvvatlayotganini tasdiqlang.

Saqlangan holatdagi shifrlash faqat saqlangan nusxani himoya qiladi. Ruxsatsiz jarayon yoki operator shifri ochilgan baytlarni olgach, u kalitni himoya qilmaydi. Hostni mustahkamlang, bajarilish vaqtidagi kirishni cheklang va imzolash faoliyatini kuzating.

## Imzolash ish jarayonlarini himoya qiling {#protect-signing-workflows}

- Operatorning nomi bilan identifikatsiyalash, kuchli tasdiqlanish va imzolash tizimlariga auditli kirish.
- Xom kalitlarni buyruq satri argumentlari, shell tarixi, muhit dump-lari, jarayon ro'yxatlari, crash hisobotlari va dastur loglaridan tashqarida saqlang.
- Imzolovchini faqat zarur amal uchun qulfdan chiqaring. Ishlatgandan keyin sessiyani yoping yoki muddati tugashini ta'minlang.
- Ruxsatdan oldin vakolat, tarmoq, ko'rsatmalar, aktivlar va to'lovlarni ko'rsatish.
- Maxsus imtiyozli yoki yuqori qiymatli bitimlar uchun aniq tasdiqlash talab etiladi.
- Moslashtirilgan mijoz integratsiyasi imzolashni topshira olsa, xom xususiy kalitlarni brauzer sahifalari va umumiy maqsadli dastur jarayonlaridan tashqarida saqlang.

Oddiy matnli mijoz konfiguratsiyasi faqat mahalliy ishlab chiqish va nazorat qilinadigan sinovlar uchun mos. Ishlab chiqarish integratsiyasi imzolarni tasdiqlangan saqlash chegarasi orqali olishi kerak. Standart Iroha CLI xususiy kalitni mijoz konfiguratsiyasidan o'qiydi va umumiy tashqi imzolovchi adapterini taqdim etmaydi. Moslashtirilgan mijozlar tranzaksiya payload heshini tuzib, tashqi imzolovchi yaratgan imzoni biriktirishi mumkin.

## Kalitlarni zaxiralang va tiklang {#back-up-and-recover-keys}

- Faqat tiklash siyosati zaxira nusxani talab qiladigan kalitlarni zaxiralang.
- Zaxira nusxalarni shifrlang va faol imzolovchidan alohida saqlang.
- Zaxira nusxaga faol kalitdagi kabi kirish va tasdiqlash nazoratlarini qo'llang.
- Vazifalarni ajratish talab qilinsa, tiklash hisob ma'lumotlarini mustaqil saqlov ostida tuting.
- Ishlab chiqarish kalit materialini oshkor qilmasdan tiklashni sinang.
- Har bir zaxira nusxani yaratish, unga kirish, tiklash va yo'q qilishni qayd eting hamda ko'rib chiqing.

Iroha maxfiy kaliti bilan bog'liq bo'lmagan portfeli mnemonik formatini ifodalashi mumkin deb taxmin qilmang. Faqat tanlangan saqlash tizimi tomonidan qo'llab-quvvatlanadigan va sinovdan o'tkazilgan tiklash formatidan foydalaning.

## Oshkor bo'lgan yoki foydalanishdan chiqarilgan kalitlarni almashtiring {#replace-exposed-or-retired-keys}

Hodisa yuz berishidan oldin almashtirishga tayyorlaning. Tartib quyidagilarni belgilashi kerak:

1. kalitni kim oshkor bo'lgan yoki foydalanishdan chiqarilgan deb e'lon qilishi mumkinligi
2. ta'sirlangan imzolovchi qanday ajratib qo'yilishi
3. yangi kalit qanday yaratilishi va tasdiqlangan saqlovga joylashtirilishi
4. hisob uchun vakolatli boshqaruvchini almashtirish yoki ijtimoiy tiklash yangi kanonik `AccountId` ni qanday yaratishi va bog'liq holatni qanday ko'chirishi
5. node yoki peer uchun vakolatli on-chain konsensus kalitini aylantirish yoki o'chirish BLS PoP, faollashtirish va ustma-ust ishlash siyosati, mahalliy kalit konfiguratsiyasi, `trusted_peers_pop` va joylashtirish topologiyasi bilan qanday muvofiqlashtirilishi
6. bog'liq konfiguratsiyalar, ilovalar va operatorlar yangi `AccountId`, ochiq kalit yoki peer identifikatorini qanday qabul qilishi
7. eski kalit vakolati qanday olib tashlanishi va uning nusxalari qanday arxivlanishi yoki yo'q qilinishi
8. undan keyin tarmoq va bog'liq ilovalar qanday tekshirilishi

::: warning

Shifrlash yoki yangi parol nusxalangan xususiy kalitni yana xavfsiz qila olmaydi. Oshkor bo'lganidan shubhalansangiz, kalitdan foydalanishni to'xtating va tasdiqlangan almashtirish yoki bekor qilish tartibiga rioya qiling.

:::

[Generating Cryptographic Keys](./generating-cryptographic-keys.md), [Operatsion xavfsizlik](./operational-security.md) va [Xavfsizlik tamoyillari](./security-principles.md)-ni ko'ring.
