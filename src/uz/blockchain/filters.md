---
translation_locale: uz
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filterlar {#filters}

Hadisalar oqimlari va qo'zg'atish shartlarini torlaydi. Hozirgi eng yuqori darajadagi hodisa filtrlari `EventFilterBox`, ushbu hodisalar oilalariga mos keladi:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Ish oqimlariga mos keladigan eng tor filtrdan foydalaning. `DataEventFilter::Any` kabi keng filtrlar diagnostika qilish uchun foydali, ammo ular har bir hodisani qo'zg'atish yoki obunachi bilan bog'lanish xarajatlarini to'laydilar.

## Maʼlumotlar hodisasi filtrlari {#data-event-filters}

`DataEventFilter` katta kitob ma'lumotlari hodisalariga mos keladi. Uning hozirgi variantlarida quyidagilar mavjud:

|Variant |Tadbirlar oilasi |
| --- | --- |
|`Any` |Har qanday ma ' lumotlar hodisasi |
|`Peer` |Tengdoshlar hayotiy davridagi voqealar |
|`Domain` |Domenning hayot davri va metadata hodisalari |
|`Account` |Hisobot hayoti davri, metama'lumotlar, aliaslar va kimlik hodisalari |
|`Asset` |Asset balansi va metadata hodisalari |
|`AssetDefinition` |Asset ta'rifining hayotiy davri, siyosat va metadata hodisalari |
|`Nft` |NFT hayotiy davr va metadata hodisalari |
|`Rwa` |Haqiqiy dunyodagi aktivlar hayoti davridagi hodisalar |
|`Trigger` |Hayot davri va metadotlar hodisalarini qoʻzgʻatish |
|`Role` |Rollar hayotiy davridagi hodisalar |
|`Configuration` |Zilziladagi konfiguratsiya hodisalari |
|`Executor` |Ishga tushirish vaqtini ijro etuvchi hodisalar |
|`Proof` |Dasturiy taʼminot davrida sodir boʻladigan voqealar |
|`Confidential` |Maxfiy aktivlar hodisalari |
|`VerifyingKey` |Verifikatsiya kalitlari roʻyxatida sodir boʻladigan voqealar |
|`RuntimeUpgrade` |Ish vaqti yangilanishi tadbirlari |
|`Soradns` |Katalog boshqaruv tadbirlarini hal etish |
|`Sorafs` |SoraFS darvozalarga rioya qilish hodisalari |
|`SpaceDirectory` |Kosmos direktoriyasi hayot davri hodisalarini oshkor qiladi |
|`Escrow` |Asosiy aktivlar eskorining hayot davri hodisalarining shaffofligi |
|`Offline` |Offline hisob-kitob tadbirlari |
|`Oracle` |Oracle feed hodisalari |
|`Social` |Virusli ragʻbatlantirish tadbirlari |
|`Bridge` |Koʻprik tadbirlari |
|`Governance` |Boshqaruv xususiyati qoʻllanilganda boshqaruv tadbirlari |

Aksariyat beton filtrlari ID moslashtiruvchi va hodisalar to'plami maskasiga ham ruxsat beradi. Masalan, aktiv filtrlari bitta aktiv yoki bir turdagi aktiv voqealariga mos kelishi mumkin, trigger filtrlari esa trigger ID va trigger tadbirlari to'plamiga mos kelishi kerak .

## Pipeline filtrlari {#pipeline-filters}

Pipeline filtrlari blok, tranzaksiya, birlashtirish va guvoh hodisalari kabi qayta ishlash voqealariga mos keladi. Ularni operatsion ob'ektlar, blokni qayta ishlash dashboardlari va katta ma'lumotlar ob'ektlaridan ko'ra pipeline holatiga munosabatda bo'lgan qo'zg'atuvchilarga ishlating.

## Trigger filtrlari {#trigger-filters}

Triggerlar o'z holatini `EventFilterBox` sifatida saqlashadi.

- ijro etilishi mumkin
- takrorlash siyosati
- ma'muriyat hisob raqami
- vaqtni qo'zg'atishning qayta sinovdan o'tkazish tartibi
- Metadatalar

O'chirgichga o'rnatilgan ruxsatnomalar mavjud bo'lishi kerak. Uzoq umr ko'rsatadigan tetikterlar uchun maxsus texnik hisoblarni afzal ko'rish kerak.

## Soʻrov filtrlari {#query-filters}

So'rov filtrlari hodisa filtrlaridan ajralib turadi. O'zgaruvchan so'rovlar predikat va selektorni qo'llab-quvvatlashi mumkin. SDK dan so'rovga moslashtirilgan filterlardan foydalaning, shunda filtr kirish so'rov chiqariladigan turi bilan mos keladi.

Shuningdek qarang:

- [O'zgarishlar](/uz/blockchain/events.md)
- [Native Asset Escrow ](/uz/blockchain/escrow.md#queries-and-events)
- [Ishtirokchilar](/uz/blockchain/triggers.md)
- [So'rovlar](/uz/blockchain/queries.md)
- [So'rov uchun ma'lumot](/uz/reference/queries.md)
