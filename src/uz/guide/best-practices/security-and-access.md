---
translation_locale: uz
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xavfsizlik va kirish {#security-and-access}

xavfsizlik amaliyotlari Iroha cheklangan hokimiyatga asoslanishi kerak, nazorat qilinadi
kalitlarni saqlab qolish, aniq tarmoqlarga ega bo'lish va auditorlik qilish mumkin bo'lgan o'zgarishlar.

## Muvaffaqiyatli nazorat {#key-custody}

- Ishlab chiqarish darajasi entropiyasi bilan ishlab chiqarish kalitlarini yaratish va xususiy saqlash
  Repozitoriyadan tashqaridagi kalitlar, izlovchilar, iltimosnomalar, chat loglari va CI
  chiqindi.
- Mijozlar, tengdoshlar uchun alohida kalit materialdan foydalanish, genesis imzolash,
  tasdiqlovchilar, to'lov sponsorlari va texnik hisobotlar.
- Shartlarni yozma jarayonga ko'ra aylantirib, o'zlashtirishni mashq qiling
  jonli hodisa.
- Yuqori qiymatli saqlash uchun asbob-uskunalar bilan ta'minlangan yoki operatsion tizim tomonidan ta'minlanadigan saqlashdan foydalanish
  joylashtirish xavfi asoslanganida kalitlarni imzolash.

Koʻring
[Kriptografik kalitlarni yaratish](/uz/guide/security/generating-cryptographic-keys.md)
va
[Kriptografik kalitlarni saqlash](/uz/guide/security/storing-cryptographic-keys.md).

## Ruxsatnomalar {#permissions}

- Ish oqimini qo'llab-quvvatlaydigan eng kichik ruxsat belgisini yoki rolni berish.
- Xizmatlar, qo'zg'atuvchilar, agentlar uchun maxsus texnik hisobvaraqlarni afzal ko'rish
  avtomatiklashtirish. Uzoq muddatli avtomatlashtirishni shaxsiy
  operator hisob raqami.
- Tengdoshlarni boshqarish uchun ruxsatnomalarni qayta ko'rib chiqish, metadata mutatsiyasi, mining,
  yoqish, ishga tushirish ro'yxatidan o'tish, ijrochi o'zgarishlari va SORA/Nexus
  ishlab chiqarishni boshlashdan oldin boshqaruv.
- Ta'mirlash oynasidan yoki ko'chirishdan keyin vaqtincha ruxsatnomalarni bekor qilish
  bu ularni talab qildi.

Koʻring [Ruxsatnomalar](/uz/blockchain/permissions.md) va
[Ruxsat toʻgʻriligi](/uz/reference/permissions.md).

## Tarmoqdagi ta'sir {#network-exposure}

- Tengdoshlar bilan tengdoshlarni cheklash, Torii, telemetriya va operator yo'nalishlari
  Umumiy o'qishga kirish ommaviy yozishni yoki
  operatorga kirish.
- Foydalanish VPNs, yong'in devorlari, qaytarib yuboriladigan vositalar, TLS tugatish va stavkalar cheklovlari
  joylashtirish uchun zarur bo'lgan hollarda.
- Asosiy mualliflik ma'lumotlarini, proxy tokenlari va etkazib berilgan sarlavhalarni
  kafolatlangan konfig.
- Ruxsatsiz mijozlar cheklangan yo'nalishlarga yetib borolmasligini tekshirish.

Koʻring [Virtual xususiy tarmoqlar](/uz/guide/security/vpn.md) va
[Torii Keyingi nuqtalar](/uz/reference/torii-endpoints.md).

## Aldatish va suiiste'mollarni nazorat qilish {#fraud-and-abuse-monitoring}

- O'ylanmagan aktivlar uchun hisobda bo'lgan hodisalarni va operatsion signallarni kuzatish
  harakat, ruxsat berish, o'zgarishlarni qo'zg'atish, tengdoshlarning o'zgarishi va takrorlanuvchi
  rad etilgan operatsiyalar.
- Transaksiya hashlari, blok balandliklari, hodisalar to'plami bilan dalillarni saqlash.
  ro'yxatlar va holat fotosuratlari.
- Xavfsizlik, faoliyat va ishbilarmonlarga yo'nalishdagi ogohlantirishlar
  ta'sirlangan aktivlar yoki ish oqimlari uchun.

Koʻring [Aldatishlarni nazorat qilish](/uz/guide/security/fraud-monitoring.md).

## Agent va avtomatlashtirish qo'riqchi rails {#agent-and-automation-guardrails}

- Tek oʻqish uchun ruxsatnomalar bilan avtomatlashtirishni boshlash va faqat yozish huquqini qoʻshish
  ish oqimini qayta ko'rib chiqilgandan so'ng.
- jonli tarmoq mutatsiyalari uchun aniq inson tomonidan tasdiqlangan bo'lishi kerak,
  avtomatlashtirish - bu maqsadli ravishda ishga tushirilgan ishlab chiqarish xizmati.
- Xususiy kalitlarni agentlarga ko'rsatmang.
  muhit o'zgaruvchilari, kalitlar zanjirlari, apparat imzochilaridan yoki
  konfiguratsiya fayllarini e'tiborsiz qoldirgan.
- Dasturlarni avtomatlashtirish qarorlari tekshiruvlar bo'lmasdan amalga oshirilishini qo'llab-quvvatlaydigan tarzda
  maxfiy material.
