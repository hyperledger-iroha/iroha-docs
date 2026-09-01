---
translation_locale: uz
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kryptografik Kalitlarni Saqlash {#storing-cryptographic-keys}

Shaxsiy kalit uning avtorizatsiya qiluvchisi uchun ruxsat berilgan har bir amalni bajarishga vakolat berishi mumkin. Hech qachon shaxsiy kalitni ulashmang. Urug‘lik materiallari, tiklash sirlarini, egasi tokenlarini va eksport qilingan kalit fayllarini bir xil ehtiyotkorlik bilan himoya qiling.

Ishlab chiqarishni boshlashdan oldin saqlash dizaynini tanlang. Dizayn xavf ostidagi qiymat, hisobni boshqarish siyosati va joylashtirishning tiklash jarayoni bilan mos kelishi kerak.

## Qamoq chegarasini aniqlang {#define-the-custody-boundary}

- Har bir ruxsat etilgan shaxs, ochiq kalit, algoritm, muhit, maqsad, mas'ul shaxs, saqlash joyi, zahiralash va almashtirish tartibini inventarizatsiya qiling.
- Rivojlanish, test, ishlab chiqarish, kundalik tranzaksiyalar, boshqaruv, joylashtirish va tiklash uchun alohida kalitlardan foydalaning.
- Odamlar va jarayonlarga faqat ularning roli talab qiladigan kalitlarga kirish huquqini bering.
- Xavf modeli talab qilganda yuqori qiymatli yoki boshqaruv imzolash uchun mustaqil tasdiq talab qilinsin.
- Imzolovchi qaysi tarmoq va avtorizatsiya shaxsini ishlatishi mumkinligini qayd eting. Imzolash xizmati shu doiradan tashqari bo‘lgan so‘rovlarni rad etishi kerak.

## Mos Keladigan Saqlash Usulini Tanlang {#choose-an-appropriate-storage-method}

Mahalliy rivojlanish, nazorat qilinadigan testlar yoki xavfsiz saqlash topshirig‘i uchun kalit ruxsatlari cheklangan faylga eksport qilinishi mumkin. Qo‘llab-quvvatlanadigan Unix platformasida yangi kalit katalogini `kagami` bilan yarating:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ota papka mavjud bo‘lishi kerak. Maqsad yangi bo‘lishi yoki hozirgi foydalanuvchi tomonidan allaqachon egalik qilinishi kerak, rejim `0700`, simvolik havolalardan xoli va bo‘sh bo‘lishi kerak. Kagami yozadi `public.key` va `private.key` bilan `0600` rejimida; `--pop` shuningdek `pop.hex` yozadi. Bu buyruq Kagami egalik qiluvchi fayl tizimi qoidalarini majburlay olmaydigan platformalarda bajarilmaydi.

Shaxsiy kalit fayli shifrlanmagan eksport hisoblanadi. Uni manba nazorati, umumiy papkalar, loglar, chiptalar, chat va qurilish artefaktlaridan uzoqda saqlang. Ishlab chiqarish kalitini uning tasdiqlangan saqlash chegarasiga import qiling, so‘ngra eksportni joylashtirish protsedurasiga muvofiq olib tashlang. Ishlab chiqarishda rivojlantirish kalitidan qayta foydalanmang.

Ishlab chiqarishda, quyidagilar kabi auditi o‘tkazilgan saqlash chegarasini afzal ko‘ring:

- apparat xavfsizlik moduli yoki apparat tomonidan qoʻllab-quvvatlanadigan kalit saqlash joyi
- operatsion tizim yoki mobil kalitxona
- yolg‘iz imzolash xizmati
- faqat ruxsat berilgan ish yuklamasiga kalitni chiqaradigan maxfiy boshqaruvchi

Tanlangan integratsiya ushbu xususiyatni qo‘llab-quvvatlaganda, kalit materialini eksport qilib bo‘lmaydigan qilib saqlang. Saqlash tizimi Iroha vakolat hisobasi talab qiladigan algoritm va imzolash operatsiyasini qo‘llab-quvvatlashini tasdiqlang.

Dam olayotganda shifrlash saqlangan nusxani himoya qiladi. U ruxsatsiz jarayon yoki operator deshifrlangan baytlarni olganidan keyin kalitni himoya qilmaydi. Mezbonni mustahkamlang, dasturiy ta'minot ishga tushirish muhitiga kirishni cheklang va imzolash faoliyatini kuzating.

## Imzolash Ish Jarayonlarini Himoya Qilish {#protect-signing-workflows}

- Imzolash tizimlariga kirishda nomlangan operator shaxsini aniqlash, kuchli autentifikatsiya va tekshirilgan kirishni ishlating.
- Xom kalitlarni buyruq satri argumentlaridan, shell tarixidan, muhitisni chiqarishlardan, jarayon ro‘yxatlaridan, xatolik hisobotlaridan va ilova yozuvlaridan uzoq tuting.
- Faqat kerakli operatsiya uchun kriptografik imzolchining blokirovkasini oching. Foydalanishdan so‘ng sessiyani yoping yoki muddati o‘tsin.
- Tasdiqlashdan oldin vakolatli shaxsni, tarmoqni, ko'rsatmalarni, aktivlarni va to'lovlarni ko'rsating.
- Imtiyozli yoki yuqori qiymatli tranzaksiyalar uchun aniq tasdiqni talab qiling.
- Agar maxsus mijoz integratsiyasi imzolashni topshirishi mumkin bo'lsa, xom shaxsiy kalitlarni brauzer sahifalari va umumiy maqsadli dastur jarayonlaridan tashqarida saqlang.

Oddiy matnli mijoz konfiguratsiyasi faqat mahalliy rivojlantirish va nazorat qilinadigan testlar uchun mos keladi. Ishlab chiqarish integratsiyasi imzolarni tasdiqlangan saqlash chegarasi orqali olishi kerak. Aksiya Iroha CLI mijoz konfiguratsiyasidan shaxsiy kalitni o‘qiydi va umumiy tashqi kriptografik imzolash-xizmati adapterini taqdim etmaydi. Maxsus mijozlar tranzaksiya yuklamasining kriptografik xeshini yaratishi va tashqi imzolovchi tomonidan ishlab chiqarilgan imzoni qo‘shishi mumkin.

## Kalitlarni Zaxiralash va Tiklash {#back-up-and-recover-keys}

- Faqat tiklash siyosati zaxira qilishni talab qiladigan kalitlarni zaxiralang.
- Zaxira nusxalarni shifrlang va ularni jonli imzolovchidan alohida saqlang.
- Zaxira nusxaga ham jonli kalitga qo‘llaniladigan kirish va tasdiqlash nazoratlarini qo‘llang.
- Majburiy vazifalar ajratilganida tiklash kredensiallarini mustaqil nazorat ostida saqlang.
- Ishlab chiqarish kalit materialini ochmasdan testni tiklash.
- Har bir zahira nusxasini yaratish, unga kirish, tiklash va yo‘q qilishni yozib boring va ko‘rib chiqing.

Aloqasi bo‘lmagan hamyon mnemonik formatining Iroha shaxsiy kalitini ifodalashi mumkin deb o‘ylamang. Faqat tanlangan saqlash tizimi tomonidan qo‘llab-quvvatlangan va sinovdan o‘tkazilgan tiklash formatidan foydalaning.

## Ochiq yoki ishlatilmayotgan kalitlarni almashtirish {#replace-exposed-or-retired-keys}

Voqea sodir bo‘lishidan oldin zaxirani tayyorlang. Jarayon quyidagilarni aniqlashi kerak:

1. kalitni oshkor qilingan yoki xizmatdan chiqarilgan deb kim e'lon qilishi mumkin
2. ta’sirlangan imzolovchi qanday ajratilgan
3. yangi kalit qanday yaratiladi va tasdiqlangan saqlovga joylashtiriladi
4. hisob uchun, qanday ruxsat etilgan boshqaruvchi almashtirish yoki ijtimoiy tiklash almashtirish kanonik `AccountId` yaratadi va bog‘langan holatni ko‘chiradi
5. tugun yoki tarmoq hamkori uchun, qanday qilib ruxsat berilgan zanjir ustidagi konsensus kalitining aylantirilishi yoki o‘chirilishi BLS PoP, faollashtirish va qamrov siyosati, mahalliy kalit konfiguratsiyasi, `trusted_peers_pop` va joylashtirish topologiyasi bilan muvofiqlashtiriladi
6. qanday bog‘liq konfiguratsiyalar, ilovalar va operatorlar yangi `AccountId`, ochiq kalit yoki tarmoq hamkori identifikatsiyasini qabul qiladi
7. qanday qilib eski kalitning ruxsatnoma prinsipi olib tashlanadi va uning nusxalari arxivlanadi yoki yo‘q qilinadi
8. tarmoq va unga bog‘liq ilovalar keyinchalik qanday tasdiqlanishi

::: warning

Shifrlash yoki yangi parol nusxalangan xususiy kalitni yana xavfsiz qilmaydi. Agar oshkor bo‘lish gumon qilinsa, kalitni ishlatishni to‘xtating va tasdiqlangan almashtirish yoki bekor qilish tartibiga rioya qiling.

:::

Qarang [Kriptografik Kalitlarni Yaratish](./generating-cryptographic-keys.md), [Operatsion xavfsizlik](./operational-security.md), va [Xavfsizlik printsiplari](./security-principles.md).
