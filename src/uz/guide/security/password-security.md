---
translation_locale: uz
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Parol xavfsizligi {#password-security}

Parollar operator konsollari, maxfiy omborlar, zaxiralar va mahalliy kalit fayllarini himoya qilishi mumkin. Parol faqat bitta nazorat vositasidir. Uni xavfsiz kalit saqlash, kirish nazoratlari va mavjud bo'lganda ko'p faktorli autentifikatsiya bilan birga ishlating.

## Noyob, ishlab chiqilgan parollardan foydalaning {#use-unique-generated-passwords}

- Har bir hisob va muhit uchun alohida parol hosil qiling.
- Uzoq tasodifiy parollarni yaratish va saqlash uchun parol menejeridan foydalaning.
- Ko‘p so‘zli parol jumlasini faqat uning so‘zlari yetarlicha katta ro‘yxatdan tasodifiy tanlangan bo‘lsa ishlating.
- Parollardan ismlar, sanalar, manzillar, iqtiboslar, klaviatura naqshlari va qayta ishlatilgan bo‘laklarni chiqarib tashlang.
- Xizmat ushbu usulni qo‘llab-quvvatlaganda inson tomonidan kiritilgan parol o‘rniga xizmat tomonidan yaratilgan token yoki kriptografik kalitdan foydalaning.

Uzoqlik va oldindan aytib bo'lmaslik bezakli almashtirishlardan ko'ra muhimroqdir. Bashorat qilinadigan so'zga bitta belgi qo'shish natijani xavfsiz qilmaydi.

## Parolga asoslangan hisoblarni himoya qiling {#protect-password-based-accounts}

- Mavjud bo‘lgan joylarda fishingga chidamli ko‘p bosqichli autentifikatsiyani yoqing.
- Takroriy autentifikatsiya muvaffaqiyatsizliklariga nisbatan stavka cheklovlari, bloklash siyosati va ogohlantirishlarni qo‘llang.
- Faqat tasdiqlangan, shifrlangan kanallar orqali parollarni yuboring.
- Parollar va tiklash kodlarini jurnallar, buyruq satrlari, manba omborlari, konfiguratsiya fayllari, chiptalar va chatlardan uzoqda saqlang.
- Server tomonlama parol tekshiruvchilarini tuzlangan, xotira talab qiladigan parol xesh funksiyasi va joylashtirishga mos parametrlar bilan saqlang.

## Saqlash, Qayta Tiklash va Almashtirish {#storage-recovery-and-replacement}

- Shifrlangan, sinovdan o'tgan zahiralar bilan tekshirilgan parol menejeridan foydalaning.
- Qayta tiklash kodlarini ularni tiklaydigan qurilmadan alohida saqlang. Himoyalangan oflayn qog'oz nusxasi tiklash materiali uchun mos bo'lishi mumkin.
- Parol menejeri eksportlari va zaxira media fayllariga kirishni cheklang.
- Shubhali oshkor bo‘lish, ruxsatsiz qayta ishlatish yoki almashtirishni talab qiladigan siyosat voqeasidan so‘ng parolni o‘zgartiring.
- Ishga tushirishdan oldin test hisobini tiklash protseduralarini sinab ko‘ring.

::: warning

Shaxsiy kalitni ochuvchi parol, ochiq ko‘rinishda bo‘lgan kalitning nusxasini xavfsiz qilolmaydi. Agar shaxsiy kalitning oshkor bo‘lgani gumon qilinsa, joylashtirishning kalitni almashtirish yoki bekor qilish tartibiga rioya qiling.

:::

Buni [Operatsion Xavfsizlik](./operational-security.md) va [Kryptografik Kalitlarni Saqlash](./storing-cryptographic-keys.md) ko‘ring.
