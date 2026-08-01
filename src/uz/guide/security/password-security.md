---
translation_locale: uz
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Maxfiy soʻzlar xavfsizligi {#password-security}

Maxfiy so'zlar operator konsollari, sirli do'konlar, ehtiyot qismlar va mahalliy kalit fayllarni himoya qilishi mumkin. Maxfiy so'z - bu faqat bitta nazorat. Agar mavjud bo'lsa, uni xavfsiz kalitlarni saqlash, kirish nazoratlari va ko'p omilli autentifikatsiya bilan birgalikda ishlating.

## O'ziga xos va yaratilgan maxfiy so'zlardan foydalanish {#use-unique-generated-passwords}

- Har bir hisobvaraq va muhit uchun boshqa parol yaratish.
- Uzoq tasodifiy so'zlarni yaratish va saqlash uchun maxfiy so'zlar menejeridan foydalanish.
- Ko'p so'zli maxfiy so'zni faqat uning so'zlari etarlicha katta ro'yxatdan tasodifan tanlanganida ishlating.
- Parollarga ismlar, sanalar, manzillar, iqtiboslar, klaviatura naqshlari va qayta ishlatilgan parchalarni kiritmang.
- Xizmat ushbu usulni qo'llab-quvvatlayotganda, inson tomonidan kiritiladigan maxfiy so'z o'rniga xizmat tomonidan yaratilgan token yoki kriptografik kalitdan foydalaning.

Uzoqlik va kutilmaganlik dekorativ o'rnini bosishdan ko'ra muhimroqdir. Bashoratli so'zga bitta belgi qo'shish natijani xavfsiz qilmaydi.

## Maxfiy soʻzlarga asoslangan hisob raqamlarini himoya qiling {#protect-password-based-accounts}

- Agar mavjud bo'lsa, phishingga qarshi ko'p omilli autentifikatsiyani qo'llash.
- Tez-tez tasdiqlanish muvaffaqiyatsizligiga nisbatan tarif cheklovlari, blokirovka siyosati va ogohlantirishlarni qo'llash.
- Maxfiy so'zlarni faqat tasdiqlangan, shifrlangan kanallar orqali yuboring.
- Parollar va tiklash kodlarini loglar, buyruq satrlari, manba repozitoriylari, konfiguratsiya fayllari, tiketlar va chatlarga kiritmang.
- Server tomonidagi parol tekshiruvchilarni tuzlangan, xotira qattiq parol hashing funksiyasi va ishga tushirish uchun mos parametrlar bilan saqlash.

## saqlash, qayta tiklash va almashtirish {#storage-recovery-and-replacement}

- Shriftlangan, sinovdan o'tgan nusxalar bilan tekshirilgan parol boshqaruvchisidan foydalaning.
- Qayta tiklash kodlarini ular qayta tiklagan qurilmadan alohida saqlash. O'chirish materiallari uchun himoyalangan offline qog'oz nusxasi mos bo'lishi mumkin.
- Maxfiy so'z boshqaruvchisining eksportlari va ehtiyot vositalariga kirishni cheklash.
- Shuni yodda tutish kerak bo'lgan parol, ruxsatsiz qayta foydalanish yoki o'rniga qo'yish zarur bo'lgan siyosat hodisasi bo'lganidan so'ng parolni almashtiring.
- Ishlab chiqarishni boshlashdan oldin hisobni qaytarish tartib-taomillarini sinovdan o'tkazish.

::: warning

Xususiy kalitni ochadigan maxfiy so'z bu kalitning ochiq nusxasini saqlay olmaydi. Agar xususiy kalitga ega bo'lishda gumon qilinsa, uni almashtirish yoki bekor qilish tartibiga rioya qiling.

:::

[Operatsion xavfsizlik](./operational-security.md) va [Qopishlama kriptografik kalitlari ](./storing-cryptographic-keys.md)
