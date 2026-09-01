---
translation_locale: uz
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iboralar, shartlar, mantiq {#expressions-conditionals-logic}

Barcha [Iroha maxsus ko‘rsatmalari](./instructions.md) ifodalar ustida ishlaydi. Har bir ifodada ko‘rsatmani bajarishda ishlatiladigan `EvaluatesTo` bor. Hisob nomini bevosita ko‘rsatish bilan birga, hisob identifikatorini matematik yoki satr amali orqali ham belgilash mumkin. Hisob blokcheynda ro‘yxatdan o‘tkazilganini ham tekshirish mumkin.

`EvaluatesTo<bool>` ni amalga oshiradigan ifodalar yordamida shartli mantiq tuzish va zanjirda murakkabroq amallarni bajarish mumkin. Masalan, `Mint` ko‘rsatmasini faqat muayyan hisob ro‘yxatdan o‘tkazilgan bo‘lsa yuborish mumkin.

Buni so‘rovlar bilan birlashtirib, blokcheynni murakkab ishlarni bajarishga dasturlash mumkin. Bu _aqlli shartnomalar_ deb ataladi va blokcheyn texnologiyasidan ilg‘or foydalanishning asosiy xususiyatidir.
