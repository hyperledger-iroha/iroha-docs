---
translation_locale: uz
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Xavfsizlik prinsiplari {#security-principles}

Iroha reyestri imzolangan ko'rsatmalarni tekshiradi va ruxsatlarni qo'llaydi. U xususiy kalitlar, xostlar, ilovalar, operator ish stansiyalari yoki boshqaruv tartib-taomillarini himoya qilmaydi. Joylashtirish ushbu tizimlarni himoya qilishi kerak.

Iroha tarmog'ini loyihalash va ishlatishda ushbu prinsiplarni qo'llang.

## Vakolatni xavfsizlik chegarasi sifatida ko'ring {#treat-authority-as-a-security-boundary}

- Xususiy kalitni nazorat qiluvchi shaxs yoki jarayon ushbu kalitga berilgan vakolat bilan ishlashi mumkin.
- Har bir muhit va operatsion rolga alohida vakolat bering.
- Ishlab chiqarish va tiklash kalitlarini odatdagi ishlab chiqish va sinov hisob ma'lumotlaridan ajratib turing.
- Har bir vakolat kimga tegishli ekanini, uning imzolovchisi qayerda saqlanishini va uni qanday almashtirish yoki bekor qilish mumkinligini yozib oling.

[Ochiq kalit kriptografiyasini](./public-key-cryptography.md) va [Storing Cryptographic Keys-ni ](./storing-cryptographic-keys.md) ko'ring.

## Eng kam imtiyozlardan foydalaning {#apply-least-privilege}

- Rol uchun zarur bo'lgan Iroha ruxsatlari, xostga kirish va tarmoqqa kirish huquqlarinigina bering.
- Odatiy tranzaksiyalarni imzolashni boshqaruv, joylashtirish va tiklash vakolatlaridan ajrating.
- Validatorlar a'zoligi, imtiyozli ruxsatlar yoki yuqori qiymatli aktivlarga ta'sir qilishi mumkin bo'lgan o'zgarishlar uchun mustaqil tasdiq talab qiling.
- Rol o'zgarganidan keyin kirish huquqini qayta ko'rib chiqing va endi kerak bo'lmagan kirishni olib tashlang.

## Himoya qatlamlaridan foydalaning {#use-layers-of-protection}

- Imzolovchilarni, ilovalarni, operatsion tizimlarni, tarmoqlarni va jismoniy kirishni himoya qiling. Bitta nazorat vositasiga tayanmang.
- Joylashtirish uchun zarur bo'lgan Torii, tengdosh, monitoring va ilova yo'nalishlarinigina oching.
- Ma'muriy kirish va maxfiy ma'lumotlar uchun autentifikatsiya qilingan va shifrlangan kanallardan foydalaning.
- Tizimlarni xavfsizlik yamoqlari bilan yangilangan holda saqlang va joylashtirish foydalanmaydigan xizmatlarni o'chiring.
- Sirlarni manba nazoratidan, buyruq liniyalaridan, loglardan, chiptalardan, chat va ommaviy hujjatlardan chetda saqlang.

## Joylashtirishlarni ko'rib chiqiladigan qiling {#make-deployments-reviewable}

- Maxfiy bo'lmagan konfiguratsiya va joylashtirish avtomatizatsiyasini versiya nazoratida saqlang.
- Binarlar, konfiguratsiya, genezis materiallari, validatorlar a'zoligi, ruxsatlar va ommaviy yo'nalishlardagi o'zgarishlarni ko'rib chiqing.
- Joylashtirishdan oldin reliz artefaktlarini tekshiring. Tasdiqlangan versiyalar va xeshlarni yozib oling.
- Ishlab chiqarishda ishlaydigan binar va konfiguratsiyaning aynan o'sha kombinatsiyasini sinab ko'ring.
- Tarmoqning deterministik xatti-harakatini saqlang. Hardver tezlashtirish tengdoshlarga ko'rinadigan natijalarni o'zgartirmasligi kerak.

## Dalillarni kuzatish va saqlab qolish {#monitor-and-preserve-evidence}

- Tengdoshlarning holatini, konsensus jarayonini, ruxsat o'zgarishlarini, imtiyozli ko'rsatmalarni, autentifikatsiya xatolarini va kutilmagan konfiguratsiya o'zgarishlarini kuzating.
- Muhim ogohlantirishlarni ta'sirlangan xostga bog'liq bo'lmagan tizimga yuboring.
- Tegishli jurnallarni, reyestr havolalarini, konfiguratsiya oniy nusxalarini va tranzaksiya xeshlarini ishonchli vaqt belgilari bilan saqlang.
- Yo'qolgan monitoring ma'lumotlarini tekshiruvni talab qiladigan operatsion muammo sifatida ko'rib chiqing.

## Ishga tushirishdan oldin tiklanishga tayyorlaning {#prepare-recovery-before-launch}

- Hodisani kim e'lon qilishi va tiklash choralarini kim tasdiqlashi mumkinligini aniqlang.
- Zaxiralash, qayta tiklash, kalitni almashtirish, ruxsatni bekor qilish va tengdoshni tiklash tartib-taomillarini sinang.
- Ishonchli reliz artefaktlari, konfiguratsiya, genezis yozuvlari va inventarlarni hodisa paytida foydalanish uchun tayyor saqlang.
- Avval o'qish va monitoringni tiklang. Tiklangan tarmoq va unga bog'liq ilovalar tekshiruvlaridan o'tgandan keyingina yozishlarni davom ettiring.
- Har bir hodisani ko'rib chiqing va nazorat, avtomatlashtirish va mashg'ulotlarni yangilang.

::: warning

Reyestr amallari qaytarib bo'lmas bo'lishi mumkin. Tiklash yoki boshqaruv tranzaksiyasini yuborishdan oldin oldindan ko'rib chiqilgan tartib-taomillarga amal qiling va talab etilgan tasdiqlarni oling.

:::

[Operatsiyaviy xavfsizlik](./operational-security.md) va [Relizga tayyorlik](../best-practices/release-readiness.md) bilan davom eting.
