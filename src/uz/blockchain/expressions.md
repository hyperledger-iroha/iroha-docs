---
translation_locale: uz
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iboralar, shartlar, mantiq {#expressions-conditionals-logic}

Hammasi [Iroha Maxsus ko'rsatmalar](./instructions.md) iboralar asosida ishlaydi.
Har bir ibora `EvaluatesTo`, ta'lim olishda ishlatiladigan
Siz hisobning nomini to'g'ridan-to'g'ri belgilashingiz mumkin bo'lsa, siz
hisob qaydnomasini ham koʻrsatish ID matematik yoki simli operatsiya orqali.
blokchaynda ham hisob qayd etilganligini tekshirib ko'rish mumkin.

Amalga oshiruvchi ifodani ishlatish `EvaluatesTo<bool>`, o'rnatishingiz mumkin
shartli logika va zanjirda yanada murakkab operatsiyalarni bajarish.
Misol uchun, `Mint` faqat ma'lum bir hisob qaydnomasi mavjud bo'lsa
ro'yxatdan o'tgan.

Esingizda bo'lsin, siz buni so'rovlar bilan birlashtirishingiz mumkin va shu sababli dasturlashingiz mumkin
Blockchain ajoyib narsalarni qilish uchun. Bu biz deb atalgan _aqlli
shartnomalar_, blokchainning ilg'or foydalanilishining belgilash xususiyati
texnologiya.
