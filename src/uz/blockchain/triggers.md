---
translation_locale: uz
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishtirokchilar {#triggers}

Ishtirokchilar hodisa filtrini bajarilishi mumkin bo'lgan harakat bilan bog'laydi.
qo'zg'atgichning filtrini; Iroha blokning bir qismi sifatida qoʻzgʻatuvchi harakatini baholash
o'ldirilgan.

## Qurilish {#structure}

Ro'yxatdan o'tgan `Trigger` tarkibida:

- `id`: a) `TriggerId` a qadoqlash `Name`
- `action`: bajarilishi mumkin bo'lgan, vakolat, filtr, takrorlash siyosati, qayta urinish siyosati;
  va metadatalar

Ushbu harakat quyidagilarni o'z ichiga oladi:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, yoki `IvmProved`
- `repeats`: `Indefinitely` yoki `Exactly(n)`
- `authority`: ijro etilishini chaqirayotgan hisob
- `filter`: bir `EventFilterBox`
- `retry_policy`: rejalashtirilgan vaqt qo'zg'atuvchilari uchun ko'rsatkichlarni qayta tiklash
- `metadata`: O'zboshimchalik bilan qo'zg'atish metadatalari

## Oʻzgarishlar filtrlari {#event-filters}

Trigger shartlari abonentlar bilan bir xil hodisa filtr modelini ishlatadi.
eng yuqori darajadagi hodisa filtrlari quyidagilarga mos keladi:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- ijro jarayonlarini qoʻzgʻatish
- tugallanish hodisalarini qoʻzgʻatadi

Ish oqimlariga mos keladigan eng tor filtrni afzal ko'rasiz.
diagnostika uchun, lekin ular blok ijro etish paytida ish ko'paytiradi.

Koʻring [Filterlar](/uz/blockchain/filters.md) amaldagi filtr oilalari uchun.

## Vaqtni qoʻzgʻatuvchilar {#time-triggers}

Vaqtni ishga tushiruvchilar vaqt hodisalari filtridan foydalanadi.
o'xshash vaqt sharti, Iroha qo'zg'atish harakatini qo'zgʻatish ostida amalga oshiradi
vaqtni qo'zg'atadigan o'chirgichlar qayta urinish siyosatini ishlatishi mumkin
quyida tasvirlangan.

## Takrorlash {#repetition}

`Repeats::Indefinitely` ro'yxatdan o'tmaguncha triggerni faollashtiradi.

`Repeats::Exactly(n)` qo'zg'atgich aniq sonda o'tkazib yuboradi.
hisob tugadi, agar xuddi shunday xatti-harakat kerak bo'lsa yangi qo'zg'atuvchini yozib oling
Yana bir bor.

## Ma'muriyat va ruxsatnomalar {#authority-and-permissions}

O'chirib yuborish huquqi ijro etilishini chaqirish uchun ishlatiladigan hisob hisoblanadi.
uzoq umr ko'rsatuvchi tetiklar uchun maxsus texnik hisob, shuning uchun zarur ruxsatnomalar
operatorning shaxsiy hisobidan aniq va alohida bo'lgan.

O'z navbatida, ushbu ko'rsatmalarning bajarilishi uchun ruxsatnomalar kerak bo'ladi.
kontrakt qo'ng'iroq. triggerni ro'yxatdan o'tkazadigan hisobda ham ruxsat kerak
aktiv ishga tushirish vaqtini tasdiqlash vositasida triggerlarni ro'yxatdan o'tkazish.

## Qayta sinab koʻrish siyosati {#retry-policy}

Vaqtni qo'zg'atuvchilar qayta urinish siyosatini tanlashi mumkin.

- `max_retries`: dastlabki muvaffaqiyatsizlikka uchraganidan so'ng yana necha marta urinishga ruxsat beriladi
  otish
- `retry_after_ms`: qancha davom etadi Iroha qayta sinovdan o'tishdan oldin kutadi

Qayta sinovdan o'tish uchun mablag' to'liq bo'lganda, qo'zg'atuvchi ro'yxatga olinmaydi.

## Savollar {#queries}

Ishtirokchi holatini tekshirish uchun joriy qoʻzgʻatuv soʻrovlaridan foydalaning:

- [`FindTriggers`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)

Shuningdek qarang:

- [O ' zgaruvchi misol](/uz/blockchain/trigger-examples.md)
- [Tadbirlar](/uz/blockchain/events.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
