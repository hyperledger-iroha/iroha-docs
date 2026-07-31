---
translation_locale: uz
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xavfsizlik va kirish {#security-and-access}

Iroha dagi xavfsizlik amaliyotlari cheklangan vakolatga, nazorat qilinadigan kalitlar saqlanishiga, ochiq tarmoqlarga taalluqli bo'lishiga va audit qilinishi mumkin bo'lgan o'zgarishlarga asoslanishi kerak.

## Muvaffaqiyatli nazorat {#key-custody}

- Ishlab chiqarish darajasidagi entropiyaga ega bo'lgan ishlab chiqarish kalitlarini hosil qilish va shaxsiy kalitlarni omborlar tashqarisida saqlash, izlovchi, iltimosnomalar, suhbat loglari va CI mahsulotlarini chiqarish.
- Mijozlar, tengdoshlar, genesis imzolash, tasdiqlovchilar, to'lov sponsorlari va texnik hisobotlar uchun alohida kalit materiallardan foydalaning.
- Tugmalarni yozma jarayonga ko'ra aylantiring va jonli hodisalardan oldin tiklanish mashg'ulotlarini o'tkazing.
- Agar ishga tushirish xavfi asoslangan bo'lsa, yuqori qiymatli imzolash kalitlari uchun asbob-uskunalar bilan ta'minlangan yoki operatsion tizim tomonidan ta'minlanadigan saqlashdan foydalaning.

[Generating Cryptographic Keys](/uz/guide/security/generating-cryptographic-keys.md) va [Storing Cryptographic keys](/uz/guide/security/storing-cryptographic-keys.md)-ni ko'ring.

## Ruxsatlar {#permissions}

- Ish oqimini qo'llab-quvvatlaydigan eng kichik ruxsat belgisini yoki rolni bering.
- Xizmatlar, triggerlar, agentlar va avtomatlashtirish uchun maxsus texnik hisoblarni afzal ko'rish. Shaxsiy operator hisobidan uzoq muddatli avtomatlashtirishdan qoching.
- Ishlab chiqarish ishga tushirilishidan oldin tengdoshlarni boshqarish, metadata mutatsiyasi, qalinlashtirish, yoqish, qo'zg'atuvchi ro'yxatdan o'tkazish, ijrochi o'zgarishlari va SORA/Nexus boshqaruv uchun ruxsatnomalarni ko'rib chiqish.
- Ta'mirlash oynasidan keyin yoki ularni talab qilgan ko'chirishdan so'ng vaqtincha ruxsatlarni bekor qiling.

Qarang [Izohlar](/uz/blockchain/permissions.md) va [Izoh tokenlari](/uz/reference/permissions.md).

## Tarmoqdagi ta'sir {#network-exposure}

- Torii, telemetriya va operator yo'nalishlarini atrof-muhitga qarab cheklash. Umumiy o'qishga kirish umuman yozish yoki operatorga kirishni anglatmaydi.
- VPNs, yong'in devorlari, qaytarib yuboriladigan vositalar, TLS to'xtatish va joylashtirish uchun zarur bo'lganda stavka cheklovlaridan foydalanish.
- Asosiy mualliflik ma'lumotlarini, proxy tokenlari va etkazib berilgan sarlavhalarni o'rnatilmagan konfiguratsiyalardan saqlash.
- Ruxsatsiz mijozlar cheklangan yo'nalishlarga yetib borolmasligini tekshirish.

Qarang [Virtual xususiy tarmoqlar](/uz/guide/security/vpn.md) va [ Torii Oxirgi nuqtalari ](/uz/reference/torii-endpoints.md).

## Kamchiliklar va suiiste'mollarni nazorat qilish {#fraud-and-abuse-monitoring}

- O'ylanmagan aktivlar harakatlanishi, ruxsat berish, o'zgarishlarni qo'zg'atish, tengdoshlarning o'zgarishi va takror-takror rad etilgan operatsiyalarni kuzatish uchun katta kitob hodisalari va operatsion signallarni kuzatib boring.
- Transaksiya hashlari, blok balandliklari, hodisalar yozuvi, log va holat fotosuratlari bilan dalillarni saqlash.
- Ta'sirlangan aktivlar yoki ish oqimlari uchun javobgar bo'lgan xavfsizlik, operatsiya va biznes egalariga yo'nalishdagi ogohlantirishlar.

[Xaroba monitoringini ](/uz/guide/security/fraud-monitoring.md) ko'rish.

## Agent va avtomatlashtirish qo'riqchi rails {#agent-and-automation-guardrails}

- Faqat o'qish uchun ruxsatnomalar bilan avtomatlashtirishni boshlash va faqat ish oqimini ko'rib chiqilgandan so'ng yozish huquqini qo'shing.
- To'g'ridan-to'g'ri tarmoq mutatsiyalari uchun aniq insonning roziligini talab qilish, agar avtomatlashtirish niyat bilan ishga tushirilgan ishlab chiqarish xizmati bo'lmasa.
- Xususiy kalitlarni agent iltimoslariga oshkor qilmang. Mahalliy koddan foydalanib, atrof muhit o'zgaruvchilari, kalitlar zanjirlari, uskuna imzolari yoki e'tiborsiz qoldirilgan konfiguratsiya fayllaridan sirlarni yuklab oling.
- Yozuvlarni avtomatlashtirish qarorlari sirli materialni chiqarib tashlamasdan auditlarni qo'llab-quvvatlaydigan tarzda.
