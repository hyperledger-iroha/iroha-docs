---
translation_locale: uz
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Eng yaxshi amaliyotlar {#best-practices}

Ushbu bo‘lim Iroha ilovalari va tarmoqlari uchun ishlab chiqarishga yo‘naltirilgan ko‘rsatmalarni to‘playdi. U amalga oshiradigan xususiyatga qarab emas, balki qilishingiz kerak bo‘lgan qarorga ko‘ra tashkil etilgan.

Uni umumiy testnet mashqi, ishlab chiqarishga chiqarish yoki yirik mijoz uchun relizdan oldin nazorat ro‘yxati sifatida ishlating.

## Kategoriyalar {#categories}

|Kategoriya|Diqqat|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Ilova ishlab chiqish](./application-development.md) |Mijoz konfiguratsiyasi, tranzaksiya yuborilishi, qayta urinuvlar, voqealar, so‘rovlar va agent yordamidagi rivojlantirish|
| [Ma'lumotlarni modellashtirish](./data-modeling.md)                     | Domenlar, hisoblar, aktivlar, NFTs, metadata, zanjir tashqari ma’lumotlar va nomlash konventsiyalari|
| [Tarmoq joylashtirish](./network-deployment.md)           |blokcheyn genesi, topologiya, tarmoq tengdosh kalitlari, Torii ochiqligi, konsensus sozlamalari va muhitni ajratish|
| [Operatsiyalar](./operations.md)                           |Kuzatish, ish qo'llanmalari, zaxira nusxalar, o'zgarishlarni boshqarish, quvvat tekshiruvlari va hodisalarni boshqarish|
| [Xavfsizlik va kirish](./security-and-access.md)         |Sir saqlash, ruxsatlar, texnik hisoblar, tarmoqga kirish va audit izlari|
| [Chiqarishga tayyorgarlik](./release-readiness.md)             |Localnet, Taira, Minamoto, moslik tekshiruvlari, jonli tarmoq xavfsizlik choralari va orqaga qaytarish rejalashtirish|

## Kesishuvchi Qoidalar {#cross-cutting-rules}

- Mahalliy rivojlanish, umumiy test tarmog'i va ishlab chiqarish konfiguratsiyasini alohida saqlang.
- Boshlang‘ich holat, tugunlar topologiyasi, bajaruvchi siyosati va kalit materialini boshqariladigan joylashtirish artefaktlari sifatida saqlang.
- Model bardoshli blockchain daftar holatini bilib qo'ying. Katta, shaxsiy yoki tez-tez o'zgaradigan ma'lumotlarni saqlash uchun metadata maydonidan foydalanmang.
- Rad etish, muddati o'tishi, qayta urinish va kechiktirilgan holatni boshqarishi mumkin bo'lgan idempotent ish jarayonlari orqali tranzaksiyalarni yuboring.
- Keng administrator kirish huquqidan ko'ra tor ruxsatlarni, bag'ishlangan texnik hisoblarni va aniq operatsion qo'llanmalarni afzal ko'ring.
- Avval xulq-atvorni birdan ishlatiladigan lokal tarmoqda sinab ko‘ring, keyin har qanday mainnet operatsiyasidan oldin Taira yoki boshqa ulashilgan testnetda mashq qiling.

## Tegishli manbalar {#related-references}

- [Sozlash va Boshqarish](/uz/guide/configure/overview.md)
- [Xavfsizlik](/uz/guide/security/)
- [Ijro etish va o‘lchovlar](/uz/guide/advanced/metrics.md)
- [Moslik Matrisi](/uz/reference/compatibility-matrix.md)
- [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md)
- [Ruxsatnoma Tokenlari](/uz/reference/permissions.md)
