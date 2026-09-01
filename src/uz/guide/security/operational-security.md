---
translation_locale: uz
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operatsion xavfsizlik {#operational-security}

Operatsion xavfsizlik odamlarni, mezbonlarni, login ma'lumotlarini va Iroha joylashtirilishi atrofidagi protseduralarni himoya qiladi. Reyestrda qabul qilingan holat o'zgarishlari qayd etiladi. Operatorlar o'z ish stantsiyalari, imzo kalitlari va hodisaga javob berish jarayonini alohida himoya qilishi kerak.

Pastdagi boshqaruv elementlaridan joylashtirish bazasi sifatida foydalaning. Ularni xavf ostidagi qiymat va tashkilotingizning talablariga mos ravishda sozlang.

## Amaliy ishlar uchun asosiy ko'rsatkichlarni belgilash {#establish-an-operational-baseline}

- Tasdiqlovchi xostlari, tugun identifikatorlari, hisob vakolatlari, imzolash qurilmalari, ochiq yakuniy nuqtalar va mas’ul shaxslar ro‘yxatini yuriting.
- Rivojlantirish, sinov va ishlab chiqarish uchun alohida autentifikatsiya ma'lumotlaridan foydalaning. Har bir kriptografik imzovchi, beriluvchi token va shaxsiy kalitni bitta muhitga biriktiring.
- Konfiguratsiya va joylashtirish avtomatlashtirishni ko‘rib chiqilishi mumkin bo‘lgan versiya nazoratida saqlang. Dasturiy ta’minot ishlash muhiti uchun maxfiy ma’lumotlarni tasdiqlangan maxfiy saqlash joyi yoki imzolash qurilmasidan kiriting.
- Chiqish artefaktlarining kutilayotgan kriptografik xeshlarini yoki imzolarini yozib oling. Ularni joylashtirishdan oldin tekshiring. Binar fayllarni, blokcheyn boshlang‘ich materialini, konfiguratsiyani yoki xizmat ta’riflarini kim almashtirishi mumkinligini cheklang.
- Operatsion tizim hisoblariga, Iroha ruxsatlariga va tarmoq boshqaruviga minimal imtiyozlarni qo‘llang. Har bir rolga faqat uning ishlashi uchun kerak bo‘lgan ruxsatni bering.
- Ishlab chiqarishga chiqarishdan oldin zaxira nusxasini, tiklashni, kalitni almashtirish va hamkasblarni tiklash protseduralarini sinab ko‘ring.

Asosiy chizmani belgilayotganda [Xavfsizlik printsiplari](./security-principles.md) va [Chiqarishga tayyorgarlik](../best-practices/release-readiness.md) ni ko‘rib chiqing.

## Kalitlar va kriptografik imzovchilarni himoya qilish {#protect-keys-and-signers}

- Shaxsiy kalitlarni, urug‘ materialini, olib yuruvchi tokenlarni, avtorizatsiya sarlavhalarini va tiklash sirlarini manba nazorati, vazifa izlovchilar, chat transkriptlari, skrinshotlar va jamoat hujjatlaridan tashqarida saqlang.
- Yuqori qiymatli avtorizatsiya prinsiplari uchun apparatura yordamida yoki izolyatsiyalangan imzolashdan foydalaning. Agar mijoz imzolashni topshirishi mumkin bo‘lsa, xom kalit materialini brauzerlar va umumiy maqsadli ilova jarayonlaridan tashqarida saqlang.
- Oddiy tranzaksiyalar, boshqaruv, joylashtirish va tiklash uchun alohida avtorizatsiya asoslarini ishlating.
- Maxfiy saqlash va uning zaxiralarini shifrlang. Jonli kalitga qo‘llanadigan xuddi shu kirish nazoratlarini shaxsiy kalit zaxiralariga ham qo‘llang.
- Sinovdan o'tkazilgan almashtirish yoki bekor qilish tartibini saqlang. Siyosat talab qilganda yoki kalita oshkor bo'lishi gumon qilinganda kalitni almashtiring.
- Tasdiqlovchilar a’zoligi, imtiyozli rollar yoki qimmat aktivlardagi o‘zgarishlar uchun mustaqil ko‘rib chiqish talab qiling.

Asosiy-ga oid ko‘rsatmalar uchun [Kriptografik Kalitlarni Yaratish](./generating-cryptographic-keys.md) va [Kryptografik Kalitlarni Saqlash](./storing-cryptographic-keys.md) ga qarang.

## Tugunlar va Operator Kirishini Mustahkamlash {#harden-nodes-and-operator-access}

- Hozirgi vaqtda yetkazib beruvchi tomonidan qo‘llab-quvvatlanadigan, yamalangan tizimlarda tugunlar va operator vositalarini ishga tushiring. Keraksiz xizmatlarni o‘chirib qo‘ying.
- Nomi keltirilgan operatorlarga faqat tekshiruvdan o'tgan, shifrlangan kanallar orqali ma'muriy kirish huquqini bering.
- Nodavlat interfeyslarni xususiy tarmoqda yoki [VPN](./vpn.md) da joylashtiring.
- Faqat joylashtirish tomonidan talab qilinadigan Torii, monitoring va ilova yo‘llarini oching.
- Har bir jamoat kirishini muhitga mos stavka cheklovlari va transport xavfsizligi bilan himoya qiling.
- Konfiguratsiya fayllari va xizmat kirish ma'lumotlarini cheklovchi fayl ruxsatlari bilan himoya qiling. Sirlarni buyruq satrlari, jarayonlar ro'yxati va shell tarixidan uzoqda saqlang.
- Xatar modeli mustaqil nazoratni talab qilganda, tasdiqlovchi, mijoz, monitoring va zaxira vazifalarini ajrating.
- Vaqtni ishonchli manbalardan sinxronlashtiring. Tekshiruv uchun yetarlicha tizim, xizmat va tarmoq jurnalini saqlang.

## Xavfsiz Brauzer va Administrator Ish Jarayonlari {#secure-browser-and-admin-workflows}

Veb interfeysidan foydalanuvchi operator uchun:

- Boshqariladigan ish stansiyasida ishlab chiqaruvchisi hali qo‘llab-quvvatlaydigan, to‘liq yangilangan brauzerdan foydalaning.
- Faqat kerakli kengaytmalar bilan maxsus operator profili yoki qurilmasidan foydalaning.
- So‘rovni tasdiqlashdan oldin uning kelib chiqishi va sertifikatini tekshiring.
- O‘xshash domenlar, kutilmagan yo‘naltirishlar va xom kalit materiallarini so‘rovlarni hodisa sifatida qabul qiling.
- Faol operator sessiyasidan aloqasi bo'lmagan saytlar va kengaytmalarni bloklang.
- Qisqa muddatli seanslardan foydalaning. Imtiyozli amallar uchun qayta autentifikatsiya talab qiling.
- Shifrlash imzotchisiga tranzaksiya tafsilotlarini ko'rsating. Operator tasdiqlashdan oldin vakolat hisobialini, tarmoqni, ko'rsatmalarni, aktivlarni va to'lovlarni tekshira olishi kerak.

Brauzer izolyatsiyasi ta'sirchanlikni kamaytiradi. Operatorlar hali ham tranzaksiyalarni ko'rib chiqishi va xavfsiz imzolashdan foydalanishi kerak.

## Nazorat qilish va javob berish {#monitor-and-respond}

Ushbu signallarni kuzating:

- tasdiqlovchi va tugun a’zoligi o‘zgarishlari
- takroriy ruxsatnoma xatolari yoki g‘ayrioddiy imtiyozli ko‘rsatmalar
- kutilmagan dasturiy ta'minot, sozlamalar yoki yo'nalish o'zgarishlari
- imzolash, so‘rov va tranzaksiya xatoliklari normal bazaviy ko‘rsatkichdan tashqarida
- resurs tugashi, kelishuvning to‘xtashi yoki kutilgan tarmoq tengdoshlarining yo‘qolishi
- firibgarlik qoidalariga mos keladigan aktiv, ruxsat va hisob o‘zgarishlari

Ta'sirlangan xostdan mustaqil kanalga ogohlantirishlarni yuboring. Tegishli jurnallarni, konfiguratsiya nuqtai nazaridagi ma'lumotlar ko'rinishlarini, blokcheyn jurnalidagi voqealarni va tranzaksiya kriptografik xeshlarini vaqt belgilari bilan saqlang. [Firibgarlikni nazorat qilish](./fraud-monitoring.md) va [Ijro va Mezonlar](../advanced/metrics.md) ga qarang.

## Qayta tiklash rejasi {#recovery-plan}

Ishlab chiqarishni ishga tushirishdan oldin tiklash rejasini tayyorlang. Tiklash rejasi quyidagilarni aniqlashi kerak:

- kim voqeani e'lon qilishi va muvofiqlashtirishi mumkin
- tasdiqlovchilar, infratuzilma operatorlari, ilova egalari va ta'sirlangan foydalanuvchilar bilan qanday bog'lanish
- qaysi vakolat hisoblari ruxsatlarni bekor qilishi, kalitlarni almashtirishi yoki tugunlar a’zoligini o‘zgartira olishi
- ishonchli binarlar, sozlamalar, blokcheyn genesis yozuvlari, zahiralar va kalit inventarlari saqlanadigan joy
- tiklangandan keyin tarmoq va bog‘liq dasturlarni qanday tasdiqlash

Hodisalar yuz berganda:

1. Ta'sirlangan xost, foydalanuvchi ma'lumotlari, yo'nalish yoki ruxsat asoschisini ajratib oling. Dalillarni saqlang.
2. Jurnallar va blokcheyn ledgeri havolalarini saqlang. Har bir tiklash harakatini yozib qo'ying.
3. Tasniflangan boshqaruv jarayoni orqali oshkor bo‘lgan credentiallar va ruxsatlarni bekor qiling yoki almashtiring.
4. Dasturiy ta'minot va konfiguratsiyani tekshirilgan artefaktlardan tiklang.
5. Tarmoq hamkorining aʼzolik, konsensus holati, ochiq marshrutlar, monitoring va ilova o‘qishlarini tasdiqlang. Ushbu tekshiruvlar o‘tganidan so‘nggina yozuvlarni davom ettiring.
6. Asosiy sababni hujjatlang. Nazoratlarni, avtomatlashtirishni va mashqlarni yangilang.

::: warning

Ortga qaytarib bo‘lmaydigan reyestr amalari uchun oldindan ko‘rib chiqilgan protseduralarga rioya qiling. Ta’sirlangan vakolat hisobi va aktivlar uchun mos keladigan tasdiqlarni talab qiling.

:::
