---
translation_locale: uz
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishtirokchilar {#triggers}

Ishtirokchilar hodisa filtrini bajarilishi mumkin bo'lgan harakat bilan bog'laydi. Agar hodisa ishtirokchining filterga mos kelsa, Iroha blok ijroining bir qismi sifatida ishtirokchini baholashdir.

## Tashkilot {#structure}

Ro'yxatga olingan `Trigger` tarkibida quyidagilar mavjud:

- `id`: a `TriggerId` qadoqlanishi `Name`
- `action`: bajarilishi mumkin bo'lgan, vakolat, filtr, takrorlash siyosati, qayta urinish siyosati va metadatalar

Ushbu harakat quyidagilarni o'z ichiga oladi:

- `executable`: `Instructions`, `ContractCall`, `Ivm` yoki `IvmProved`;
- `repeats`: `Indefinitely` yoki `Exactly(n)`
- `authority`: ijro etilishi mumkin bo'lgan hisobvaraqni chaqirayotgan hisobot
- `filter`: bir `EventFilterBox`
- `retry_policy`: rejalashtirilgan vaqt qo'zg'atuvchilari uchun ko'rsatkichlarni o'rnatish;
- `metadata`: o'zboshimchalik bilan qo'zg'atadigan metadatalar

## Oʻzgarishlar filtrlari {#event-filters}

Trigger shartlari obunalar bilan bir xil hodisa filtr modelidan foydalanadi. Eng yuqori darajadagi hodisa filtrlari quyidagilarga mos keladi:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- ijro etish hodisalarini ishga tushirish
- tugallanish hodisalarini qoʻzgʻatadi

Ish oqimlariga mos keladigan eng tor filtrni afzal ko'rasiz. Keng filtrlar diagnostika uchun foydali, ammo ular bloklarni bajarish paytida ishni oshiradi.

Joriy filtrlar oilalari uchun [Filterlar](/uz/blockchain/filters.md)-ni ko'ring.

## Vaqtni qoʻzgʻatuvchilar {#time-triggers}

Vaqt qo'zg'atuvchilari vaqt hodisalari filtridan foydalanadi. Dunyo holati ko'rinishi moslashtirilgan vaqt holatga yetganda, Iroha qo'zgʻatuvchi amalni qo'zg 'atuvchining hokimiyati ostida amalga oshiradi. Vaqti qo'ng'atuvchilar quyida tasvirlangan qayta urinish siyosatini ishlatadigan qo'zg'.

## Takrorlash {#repetition}

`Repeats::Indefinitely` o'chirgich ro'yxatdan o'tgunga qadar faol saqlanadi.

`Repeats::Exactly(n)` qo'zg'atgich o'chirib ko'p marotaba qo'yadi. Hisob-kitob tugasa, agar aynan o'sha xatti-harakat kerak bo'lsa, yangi qo'zg'atuvchini yozing.

## Mamlakat va ruxsatnomalar {#authority-and-permissions}

O'chirib qo'yish huquqi ijro etilishini chaqirish uchun ishlatiladigan hisob hisoblanadi. Uzoq muddatli tetiklar uchun maxsus texnik hisobdan foydalaning, shunda kerakli ruxsatnomalar aniq va operatorning shaxsiy hisobidan ajratilgan bo'ladi.

Ma'muriyatga ijro etilishi mumkin bo'lgan ko'rsatmalar yoki shartnoma qo'ng'iroqlari uchun talab qilingan ruxsatlar kerak. Ishtirokchini ro'yxatdan o'tkazadigan hisobvaraqning faol ishga tushirish vaqtini tasdiqlash vositasi ostida ishtirokilarni ro'yxatga olish uchun ruxsatnoma ham kerak.

## Qayta sinab koʻrish siyosati {#retry-policy}

Vaqtni ishga tushiruvchilar qayta sinovdan o'tish siyosatini tanlashi mumkin.

- `max_retries`: dastlabki muvaffaqiyatsiz o'chirilgandan so'ng necha marta qayta urinishlarga ruxsat beriladi
- `retry_after_ms`: qayta sinovdan o'tish uchun Iroha qancha vaqt kutadi;

Qayta sinovdan o'tish uchun mablag' to'liq bo'lganda, qo'zg'atuvchi ro'yxatga olinmagan.

## Savollar {#queries}

Trigger holatini tekshirish uchun joriy trigger soʻrovlaridan foydalaning:

- [`FindTriggers`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)

Shuningdek qarang:

- [O'zgarishlarni qo'zg'atuvchi misol](/uz/blockchain/trigger-examples.md)
- [O'zgarishlar](/uz/blockchain/events.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
