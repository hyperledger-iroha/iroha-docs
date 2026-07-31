---
translation_locale: uz
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Eng yaxshi amaliyotlar {#best-practices}

Ushbu bo'limda ishlab chiqarishga yo'naltirilgan Iroha talabnomalar
va tarmoqlari. Bu siz qabul qilishingiz kerak bo'lgan qaror bilan tashkil etiladi,
uni amalga oshiradigan xususiyat.

Ularni testnetni o'rganishdan oldin tekshiruv ro'yxati sifatida ishlating.
ishga tushirish yoki katta mijozlarni ozod qilish.

## Kategoriyalar {#categories}

| Kategoriya                                                | Eʼtiborni qaratish                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Ilovalar ishlab chiqish](./application-development.md) | Mijoz konfiguratsiyasi, tranzaksiyalarni taqdim etish, qayta urinish, voqealar, so'rovlar va agent yordamida ishlab chiqish |
| [Ma'lumotlar modeli](./data-modeling.md)                     | Domenlar, hisobotlar, aktivlar, NFTs, Metadotlar, zanjirdan tashqari ma'lumotlar va nomlash konvensiyalari                      |
| [Tarmoqni ishga tushirish](./network-deployment.md)           | Ibtido, topologiya, tengdosh kalitlar, Torii ta'siri, konsensus sozlamalari va atrof muhitni ajratish           |
| [Operatsiyalar](./operations.md)                           | Ko'rib chiqilishi, ishga tushirish daftarlari, ehtiyot qismlar, o'zgarishlarni boshqarish, quvvatni tekshirish va hodisalarni hal qilish            |
| [Xavfsizlik va kirish](./security-and-access.md)         | Maxfiy boshqaruv, ruxsatnomalar, texnik hisobotlar, tarmoqga kirish va audit yo'llari                     |
| [Boʻshashga tayyorlik](./release-readiness.md)             | Mahalliy tarmoq, Taira, Minamoto, muvofiqlik tekshiruvlari, jonli tarmoqlarni himoya qilish va qaytish rejalashtirish        |

## O'zaro kesish qoidalari {#cross-cutting-rules}

- Mahalliy rivojlanishni, test tarmog'ini va ishlab chiqarish konfiguratsiyasini saqlash
  alohida.
- Genesis, tengdosh topologiyasi, ijrochi siyosati va asosiy materiallarni
  nazorat qilinadigan joylashtirish artefakti.
- Modeldan uzoq muddatli hisob qaydnomasi holatini qasddan ishlatmang
  Katta, xususiy yoki yuqori darajadagi ma'lumotlar uchun to'siqxona.
- Ish jarayonlari orqali oʻzaro aloqalarni oʻtkazish
  rad etish, muddati tugaydi, qayta urinish va kechiktirilgan holat.
- Kichik ruxsatnomalar, maxsus texnik hisobotlar va aniq ruxsatlarni afzal ko'rish
  keng boshqaruvchining kirish usuli bo'yicha operatsion ishga tushirish daftarlari.
- Avval bir yoqilg'i mahalliy tarmoqda xulq-atvorni isbotlang, so'ngra mashq qiling
  Taira yoki boshqa umumiy test tarmog'i har qanday asosiy tarmoqni ishlatishdan oldin.

## Bogʻliq maʼlumotlar {#related-references}

- [Konfiguratsiya va boshqaruv](/uz/guide/configure/overview.md)
- [Xavfsizlik](/uz/guide/security/)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
- [Qo'shish matrisi](/uz/reference/compatibility-matrix.md)
- [Torii Keyingi nuqtalar](/uz/reference/torii-endpoints.md)
- [Ruxsat toʻgʻriligi](/uz/reference/permissions.md)
