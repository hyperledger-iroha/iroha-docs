---
translation_locale: uz
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Eng yaxshi amaliyotlar {#best-practices}

Ushbu bo'lim Iroha dasturlari va tarmoqlar uchun ishlab chiqarishga yo'naltirilgan ko'rsatkichlarni to'playdi. Bu siz qabul qilishingiz kerak bo'lgan qarorga emas, uni amalga oshirish uchun sodir bo'ladigan xususiyatga qarab tashkil etiladi.

O'zaro testnet mashg'ulotidan oldin, ishlab chiqarish ishga tushirishdan yoki katta mijozlarni ozod qilishdan oldin uni tekshiruv ro'yxati sifatida ishlating.

## Kategoriyalar {#categories}

|Kategoriya |Eʼtibor bering .|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Ilovalar rivojlanishi](./application-development.md) |Mijoz konfiguratsiyasi, tranzaksiyalarni taqdim etish, qayta urinish, voqealar, so'rovlar va agent yordamida ishlab chiqish |
| [Ma'lumotlar modeli ](./data-modeling.md) |Domenlar, hisobotlar, aktivlar, NFTs, metadotlar, zanjirdan tashqari ma'lumotlar va nomlash konvensiyalari |
| [Tarmoqni ishga tushirish](./network-deployment.md) |Ibtido, topologiya, tengdosh kalitlar, Torii ekspozitsiyasi, konsensus sozlamalari va atrof-muhit ajratish |
| [Operatsiyalar](./operations.md) |kuzatish, ishga tushirish daftarlari, ehtiyot qismlar, o'zgarishlarni boshqarish, quvvatni tekshirish va hodisalarni hal qilish |
| [Xavfsizlik va kirish ](./security-and-access.md) |Maxfiy ishlarni amalga oshirish, ruxsatnomalar, texnik hisobotlar, tarmoqga kirish va audit yo'llari |
| [Bo'shash uchun tayyorlik ](./release-readiness.md) |Localnet, Taira, Minamoto, moslashuvchanlik tekshiruvlari, jonli tarmoqlarni himoya qilish va qaytish rejalashtirish |

## O'rtacha kesish qoidalari {#cross-cutting-rules}

- Mahalliy rivojlanish, umumiy test tarmog'i va ishlab chiqarish konfiguratsiyasini alohida saqlang.
- Genesis, tengdoshlari topologiyasi, ijrochi siyosati va asosiy materiallarni nazorat qilingan joylashtirish artefaktlari sifatida ko'rib chiqish.
- Modeldan ko'rinib turibdiki, uzoq muddatli katta ma'lumotlar uchun metadatalarni to'plam sifatida ishlatmang.
- Ruxsatnomalarni rad etish, muddati o'tish, qayta urinish va kechiktirilgan holatni hal qilish mumkin bo'lgan idempotent ish oqimlari orqali taqdim eting.
- Yengil ruxsatnomalar, maxsus texnik hisobotlar va aniq operatsion ishga tushirish daftarlari keng boshqaruvchining kirishidan ko'ra afzalroq.
- Avval bir marta ishlatiladigan mahalliy tarmoqda xatti-harakatni isbotlang, so'ngra asosiy tarmoqlarni ishlatishdan oldin Taira yoki boshqa umumiy test tarmog'ida mashg'ul qiling.

## Bogʻliq maʼlumotlar {#related-references}

- [Konfiguratsiya va boshqaruv](/uz/guide/configure/overview.md)
- [Xavfsizlik](/uz/guide/security/)
- [Ishlab chiqarish va ko'rsatkichlar](/uz/guide/advanced/metrics.md)
- [Qo'shish matrisi](/uz/reference/compatibility-matrix.md)
- [Torii Oxirgi nuqtalar](/uz/reference/torii-endpoints.md)
- [Ruxsat belgisi ](/uz/reference/permissions.md)
