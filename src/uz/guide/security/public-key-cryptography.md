---
translation_locale: uz
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ommaviy Kalitli Kriptografiya {#public-key-cryptography}

Ommaviy kalitli kriptografiya bog'langan ommaviy kalit va shaxsiy kalitdan foydalanadi. Ommaviy kalitni bo'lishish mumkin. Shaxsiy kalit esa vakolatli shaxsning nazoratida qolishi kerak. Xavfsizlik qo'llab-quvvatlangan algoritmdan foydalanish, kalitlarni xavfsiz tasodifiylik bilan yaratish va shaxsiy kalitni himoya qilishga bog'liq.

## Raqamli imzolar {#digital-signatures}

Imzolovchi xususiy kalit bilan raqamli imzo yaratadi. Tekshiruvchi esa mos jamoa kalit bilan imzoni tekshiradi.

Yaroqli imzo imzolangan baytlar o'zgartirilmaganini va xususiy kalit egasi ularni tasdiqlaganini ko'rsatadi. U o'z-o'zidan biror kishini aniqlamaydi. Shaxsiyat omili ochiq kaliti yoki hisobni boshqaruvchi qanday ro‘yxatdan o‘tganligi va boshqarilganligiga bog‘liq.

Imzolar yaxlitlik va ruxsat dalillarini taqdim etadi. Ular imzolanadigan mazmunni shifrlamaydi.

## Ommaviy kalit bilan shifrlash {#public-key-encryption}

Ba'zi ochiq kalitli sxemalar ma'lumotlarni qabul qiluvchining ochiq kaliti uchun shifrlaydi. Qabul qiluvchi ushbu ma'lumotlarni mos keluvchi shaxsiy kalit bilan deshifrlaydi. Shifrlash va imzolar alohida operatsiyalar bo'lib, turli kalitlar yoki algoritmlardan foydalanishi mumkin.

Iroha tranzaksiya imzolash ommaviy blokcheyn rejistri ma'lumotlarini maxfiy qilmaydi. Ma'lumot tarkibi maxfiy bo'lishi kerak bo'lganda, joylashtirishning tasdiqlangan maxfiylik mexanizmidan foydalaning.

## Mijoz tomonidagi tugmalar {#keys-on-the-client-side}

Har bir tranzaksiya sozlangan hisob-nazorat siyosatiga javob berishi kerak. Oddiy hisob bitta imzo kalitidan foydalanishi mumkin. Boshqariladigan hisob yanada murakkab nazorat siyosatidan foydalanishi mumkin.

Mijoz dasturi shaxsiy kalitlar va boshqa boshqaruvchi materialni himoya qilishi kerak. Oddiy matnli mijoz konfiguratsiyasi faqat lokal rivojlantirish va nazorat qilinadigan sinovlar uchun mos keladi. Ishlab chiqarish integratsiyalari maxfiy menejer, apparat qo‘llab-quvvatlangan kalit saqlash, izolyatsiyalangan imzolash xizmati yoki boshqa auditdan o‘tkazilgan imzolash chegarasidan foydalanishi kerak.

Turli muhitlar va maqsadlar uchun alohida kalitlardan foydalaning. Bir xil kalitni qayta ishlatish ushbu foydalanishlarni bog‘laydi va ta’sirchanlik xavfini oshiradi.

[Kriptografik kalitlarni yaratish](./generating-cryptographic-keys.md), [Kriptografik kalitlarni saqlash](./storing-cryptographic-keys.md) va [Operatsion xavfsizlik](./operational-security.md) bo‘limlariga qarang.
