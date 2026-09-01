---
translation_locale: uz
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Xavfsizlik va kirish {#security-and-access}

Iroha dagi xavfsizlik amaliyoti tor vakolat prinsipi, nazorat qilinadigan kalit saqlash, ochiq tarmoq taʼsirini va audit qilinadigan o‘zgarishlarga asoslangan bo‘lishi kerak.

## Kalitni saqlash {#key-custody}

- Ishlab chiqarish kalitlarini ishlab chiqarish darajasidagi entropiya bilan yarating va shaxsiy kalitlarni repozitoriyalar, muammo kuzatuvchi tizimlar, so'rovlar, chat yozuvlari va CI chiqishidan tashqarida saqlang.
- Mijozlar, tarmoq tengdoshlar, blokcheyn asosiy imzo, validatorlar, to‘lov homiylari va texnik hisoblar uchun alohida kalit materialidan foydalaning.
- Kalitlarni yozma jarayon bo‘yicha aylantiring va jonli hodisadan oldin tiklashni mashq qiling.
- Joylashtirish xavfi buni talab qilganda, yuqori qiymatga ega imzolash kalitlari uchun apparat yoki operatsion tizim tomonidan qo‘llab-quvvatlanadigan saqlashdan foydalaning.

[Kriptografik kalitlarni yaratish](/uz/guide/security/generating-cryptographic-keys.md) va [Kriptografik kalitlarni saqlash](/uz/guide/security/storing-cryptographic-keys.md) bo‘limlariga qarang.

## Ruxsatlar {#permissions}

- Ish oqimini qo‘llab-quvvatlaydigan eng kichik ruxsat tokeni yoki rolni bering.
- Xizmatlar, triggerlar, agentlar va avtomatlashtirish uchun bag‘ishlangan texnik hisoblarni afzal ko‘ring. Shaxsiy operator hisobingiz orqali uzoq muddat ishlaydigan avtomatlashtirishni bajarishdan saqlaning.
- Ishlab chiqarishga ishga tushirishdan oldin tarmoq tengdoshini boshqarish, metama'lumotlarni o'zgartirish, chiqarish, yo'q qilish, trigger ro'yxatdan o'tkazish, bajaruvchi o'zgarishlari va SORA/Nexus boshqaruv huquqlarini ko'rib chiqing.
- Ularni talab qilgan texnik xizmat oynasi yoki ko‘chirishdan so‘ng vaqtinchalik ruxsatlarni bekor qiling.

Buni [Ruxsatlar](/uz/blockchain/permissions.md) va [Ruxsat tokenlari](/uz/reference/permissions.md) ko‘ring.

## Tarmoqni namoyon qilish {#network-exposure}

- Atrof-muhitga muvofiq peer-to-peer, Torii, telemetriya va operator yo‘llarini cheklang. Jamoat o‘qish huquqi jamoat yozish yoki operator huquqini anglatmaydi.
- VPNs, firewall-lar, teskari proksi-lar, TLS yakunlanishi va tezlik cheklovlarini joylashtirish uchun mos bo'lgan joylarda ishlating.
- Oddiy autentifikatsiya ma’lumotlari, proksi tokenlari va uzatilgan sarlavhalarni repozitoriydagi konfiguratsiyaga kiritmang.
- Ruxsatsiz mijozlar cheklangan yo'nalishlarga kira olmasligini sinash.

Buni [Virtual Shaxsiy Tarmoqlar](/uz/guide/security/vpn.md) va [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md) ko‘ring.

## Firibgarlik va suiiste’molni nazorat qilish {#fraud-and-abuse-monitoring}

- Kutilmagan aktiv harakatlari, ruxsat berishlar, trigger o'zgarishlari, tarmoq hamkorlari o'zgarishlari va takroriy rad etilgan tranzaksiyalar uchun blockchain jurnal hodisalarini va operatsion signallarni kuzatib boring.
- Dalillarni tranzaksiya kriptografik xeshlarida, blok balandliklarida, voqea yozuvlarida, jurnallarda va holat snapshotslarida saqlang.
- Yo'nalish ogohlantirishlarini ta'sirlangan aktivlar yoki ish jarayonlari uchun javobgar bo'lgan xavfsizlik, operatsiyalar va biznes egalarga yuboradi.

Buni [Firibgarlikni kuzatish](/uz/guide/security/fraud-monitoring.md) ko‘ring.

## Agent va Avtomatlashtirish Qo'llanmalari {#agent-and-automation-guardrails}

- Avtomatlashtirishni faqat o‘qish huquqi bilan boshlang va yozish ruxsati prinsipi faqat ish jarayoni ko‘rib chiqilgandan keyin qo‘shilsin.
- Jonli tarmoq o'zgarishlari uchun aniq inson tasdig'ini talab qiling, agar avtomatlashtirish mo'ljallangan ishlab chiqarish xizmati sifatida joylashtirilmagan bo'lsa.
- Shaxsiy kalitlarni agent soʻrovlariga oshkor qilmang. Sirlarni muhit oʻzgaruvchilaridan, kalit jadvallari, apparat kriptografik imzo qurilmalari yoki e'tiborsiz konfiguratsiya fayllaridan yuklaydigan lokal koddan foydalaning.
- Maxfiy materialni oshkor qilmasdan auditlarni qo‘llab-quvvatlaydigan tarzda avtomatlashtirilgan qarorlarni qayd eting.
