---
translation_locale: uz
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Triggerlar {#triggers}

Trigger hodisa filtrini bajariladigan amal bilan bog‘laydi. Hodisa trigger filtriga mos kelganda Iroha trigger amalini blok bajarilishining bir qismi sifatida baholaydi.

## Tuzilishi {#structure}

Ro‘yxatdan o‘tgan `Trigger` quyidagilarni o‘z ichiga oladi:

- `id`: `Name` ni o‘rab turuvchi `TriggerId`;
- `action`: bajariladigan amal, vakolat, filtr, takrorlash siyosati, qayta urinish siyosati va metama’lumot.

Ushbu harakat quyidagilarni o'z ichiga oladi:

- `executable`: `Instructions`, `ContractCall`, `Ivm` yoki `IvmProved`;
- `repeats`: `Indefinitely` yoki `Exactly(n)`
- `authority`: bajariladigan amalni chaqiradigan hisob;
- `filter`: `EventFilterBox`;
- `retry_policy`: rejalashtirilgan vaqt triggerlari uchun ixtiyoriy qayta urinish xatti-harakati;
- `metadata`: triggerning ixtiyoriy metama’lumoti.

## Hodisa filtrlari {#event-filters}

Qo‘zg‘atuvchi shartlari obunalar bilan bir xil hodisa filtri modelidan foydalanadi. Yuqori darajadagi hodisa filtri quyidagilarga mos kelishi mumkin:

- konveyer hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- triggerni bajarish hodisalari
- trigger tugashi hodisalari

Ish jarayoniga mos eng tor filtrni tanlang. Keng filtrlar diagnostika uchun foydali, ammo blok bajarilishi paytidagi ishni oshiradi.

Joriy filtr oilalari uchun [Filtrlar](/uz/blockchain/filters.md) bo‘limiga qarang.

## Vaqt triggerlari {#time-triggers}

Vaqt triggerlari vaqt hodisasi filtridan foydalanadi. Global holat ko‘rinishi mos vaqt shartiga yetganda Iroha trigger amalini trigger vakolati ostida bajaradi. Quyida bayon qilingan qayta urinish siyosatidan aynan vaqt triggerlari foydalanishi mumkin.

## Takrorlash {#repetition}

`Repeats::Indefinitely` qo‘zg‘atuvchini ro‘yxatdan chiqarilguncha faol saqlaydi.

`Repeats::Exactly(n)` triggerning qat’iy miqdorda ishga tushishiga ruxsat beradi. Sanoq tugagach ayni xatti-harakat yana kerak bo‘lsa, yangi trigger ro‘yxatdan o‘tkazing.

## Vakolat va ruxsatlar {#authority-and-permissions}

Trigger vakolati bajariladigan amalni chaqiradigan hisobdir. Uzoq muddatli triggerlar uchun alohida texnik hisobdan foydalaning, shunda kerakli ruxsatlar aniq va operatorning shaxsiy hisobidan ajratilgan bo‘ladi.

Vakolat bajariladigan ko‘rsatmalar yoki shartnoma chaqiruvi talab qiladigan ruxsatlarga ega bo‘lishi kerak. Triggerni ro‘yxatdan o‘tkazadigan hisobga faol bajarish muhiti tekshiruvchisi ostida triggerlarni ro‘yxatdan o‘tkazish ruxsati ham kerak.

## Qayta sinab koʻrish siyosati {#retry-policy}

Vaqt triggerlari qayta urinish siyosatini tanlashi mumkin. Bu siyosat quyidagilarni belgilaydi:

- `max_retries`: dastlabki muvaffaqiyatsiz ishga tushishdan keyin nechta qayta urinishga ruxsat berilishi;
- `retry_after_ms`: qayta urinishga ruxsat berilguncha Iroha qancha kutishi.

Qayta urinish budjeti tugagach, trigger ro‘yxatdan chiqariladi.

## So'rovlar {#queries}

Qo‘zg‘atuvchi holatini tekshirish uchun joriy so‘rovlardan foydalaning:

- [`FindTriggers`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/uz/reference/queries.md#triggers-contracts-transactions-and-blocks)

Shuningdek qarang:

- [Hodisa triggeri misoli](/uz/blockchain/trigger-examples.md)
- [Hodisalar](/uz/blockchain/events.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
