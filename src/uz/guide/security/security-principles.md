---
translation_locale: uz
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Xavfsizlik printsiplari {#security-principles}

Bir Iroha blokcheyn ledgeri imzolangan ko‘rsatmalarni tasdiqlaydi va ruxsatlarni qo‘llaydi. U shaxsiy kalitlar, serverlar, ilovalar, operator ish stantsiyalari yoki boshqaruv protseduralarini himoya qilmaydi. Joylashtirish ushbu tizimlarni himoya qilishi kerak.

Bu tamoyillardan Iroha tarmog'ini loyihalash va ishlatishda foydalaning.

## Vakolat hisobini Xavfsizlik Chegarasi sifatida ko'rib chiqing {#treat-authority-as-a-security-boundary}

- Shaxs yoki jarayon xususiy kalitni nazorat qiladigan bo'lsa, o'sha kalitga tayinlangan vakolat hisobi bilan harakat qilishi mumkin.
- Har bir muhit va operatsion rolga alohida ruxsat beruvchi shaxs bering.
- Ishlab chiqarish kalitlarini va tiklash kalitlarini odatiy rivojlantirish va test hisob ma'lumotlaridan alohida saqlang.
- Har bir vakolat hisobi kimga tegishli, uning imzolovchisi qayerda saqlanadi va uni qanday almashtirish yoki bekor qilish mumkinligini yozib qo‘ying.

[Ochiq kalitli kriptografiya](./public-key-cryptography.md) va [Kriptografik kalitlarni saqlash](./storing-cryptographic-keys.md) bo‘limlariga qarang.

## Eng kam imtiyozlarni qo'llang {#apply-least-privilege}

- Faqat rol uchun kerak bo‘lgan Iroha ruxsatnomalarini, xostga kirish va tarmoqga kirishni berish.
- Oddiy operatsiyalarni imzolashni boshqaruv, joylashtirish va tiklash vakolati prinsiplaridan ajrating.
- Validador a'zoligi, imtiyozli ruxsatlar yoki yuqori qiymatli aktivlarga ta'sir qilishi mumkin bo'lgan o'zgarishlar uchun mustaqil tasdiq talab qilinadi.
- Vazifalar o‘zgargandan keyin kirish huquqlarini ko‘rib chiqing va endi kerak bo‘lmagan kirish huquqlarini olib tashlang.

## Himoya qatlamlaridan foydalaning {#use-layers-of-protection}

- Imzolovchilarni, ilovalarni, operatsion tizimlarni, tarmoqlarni va jismoniy kirishni himoya qiling. Bir nazoratga tayanmang.
- Faqat joylashtirish uchun talab qilinadigan Torii, tarmoq hamkori, monitoring va ilova marshrutlarini oching.
- Ma'muriy kirish va sezgir ma'lumotlar uchun tasdiqlangan va shifrlangan kanallardan foydalaning.
- Tizimlarni yangilab turish va ishga tushirilmaydigan xizmatlarni o‘chirib qo‘yish.
- Sirlarni manba nazorati, buyruq satrlari, jurnallar, chiptalar, chat va ommaviy hujjatlardan chetda saqlang.

## Joylashtirishlarni ko‘rib chiqiladigan qilish {#make-deployments-reviewable}

- Sir emas bo‘lgan konfiguratsiya va joylashtirish avtomatlashtirilishini versiya nazoratida saqlang.
- Binar fayllar, konfiguratsiya, boshlang‘ich holat materiali, tasdiqlovchilar a’zoligi, ruxsatlar va ochiq yo‘nalishlardagi o‘zgarishlarni ko‘rib chiqing.
- Chiqish artefaktlarini joylashtirishdan oldin tasdiqlang. Tasdiqlangan versiyalar va kriptografik xeshlarni yozib oling.
- Ishlab chiqarishda ishlaydigan aniq ikkilik va konfiguratsiya kombinatsiyasini sinab ko'ring.
- Tarmoqning deterministik xulq-atvorini saqlang. Uskuna tezlashtirishi tengdosh ko‘rinadigan natijalarni o‘zgartirmasligi kerak.

## Dalillarni Kuzatish va Saqlash {#monitor-and-preserve-evidence}

- Tarmoq hamkasblarining sog'lig'ini, konsensus jarayonini, ruxsat o'zgarishlarini, imtiyozli ko'rsatmalarni, autentifikatsiya xatolarini va kutilmagan konfiguratsiya o'zgarishlarini kuzatib boring.
- Muhim bildirishnomalarni ta'sirlangan xostga bog'liq bo'lmagan tizimga yuboring.
- Tegishli jurnallarni, blokcheyn hisob daftari havolalarini, konfiguratsiya vaqt nuqtasi ma’lumotlar ko‘rinishlarini va tranzaksiya kriptografik xeshlarini ishonchli vaqt tamg‘alari bilan saqlang.
- Yo‘qolgan monitoring ma’lumotlarini tekshiruvni talab qiladigan operatsion muammo sifatida ko‘ring.

## Ishga tushirishdan oldin tiklashni tayyorlang {#prepare-recovery-before-launch}

- Hodisani kim e'lon qilishi mumkinligini va tiklash choralarini kim tasdiqlashi mumkinligini aniqlang.
- Zaxira nusxasini sinash, tiklash, kalitni almashtirish, ruxsatni bekor qilish va tarmoq hamkorini tiklash tartiblarini bajarish.
- Ishonchli chiqarilgan artefaktlar, konfiguratsiya, blokcheyn boshlang‘ich yozuvlari va inventarizatsiyalarni hodisa paytida mavjud saqlang.
- Avvalo o‘qish va monitoringni tiklang. Faqat tiklangan tarmoq va bog‘liq ilovalar tekshiruvdan o‘tgandan keyingina yozishni davom ettiring.
- Har bir hodisani ko‘rib chiqing va nazorat, avtomatlashtirish va mashqlarni yangilang.

::: warning

reyestrdagi harakatlar qaytarib bo'lmas bo'lishi mumkin. Tiklash yoki boshqaruv tranzaksiyasini yuborishdan oldin oldindan ko'rib chiqilgan protseduralar va kerakli tasdiqlarni ishlating.

:::

[Operatsion Xavfsizlik](./operational-security.md) va [Chiqarishga tayyorgarlik](../best-practices/release-readiness.md) bilan davom eting.
