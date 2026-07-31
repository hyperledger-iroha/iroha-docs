---
translation_locale: uz
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filterlar {#filters}

O'zgarishlarni filtrlash va o'zgartirish sharoitlarini tarqatadi.
hodisa filtrlari `EventFilterBox`, ushbu tadbirlar oilalariga mos keladi:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Ish oqimlariga mos keladigan eng tor filtrdan foydalaning.
`DataEventFilter::Any` diagnostika uchun foydali, lekin ular har bir hodisani
qo'zg'atish yoki abonent bilan moslashish xarajatlarini to'lash.

## Maʼlumotlar hodisalarini filtrlash {#data-event-filters}

`DataEventFilter` ko'pchilik ma'lumotlarga mos keladi. Uning joriy variantlari quyidagilarni o'z ichiga oladi:

| Variant | Tadbirlar oilasi |
| --- | --- |
| `Any` | Har qanday ma'lumotlar hodisasi |
| `Peer` | Tengdoshlar hayotiy davridagi voqealar |
| `Domain` | Domenning hayot davri va metadata hodisalari |
| `Account` | Hisobot hayoti davri, metadotlar, aliaslar va kimlik hodisalari |
| `Asset` | Asset balans va metadata hodisalari |
| `AssetDefinition` | Assetni aniqlash hayot davri, siyosat va metadata hodisalari |
| `Nft` | NFT Hayot davri va metadata hodisalari |
| `Rwa` | Haqiqiy dunyodagi aktivlar hayotiy davridagi voqealar |
| `Trigger` | Trigger hayot davri va metadata hodisalari |
| `Role` | O'yinlar hayoti davridagi hodisalar |
| `Configuration` | Zilziladagi konfiguratsiya hodisalari |
| `Executor` | Ish vaqti ijrochiligi hodisalari |
| `Proof` | Dasturiy ta'minot davrida sodir bo'ladigan voqealar |
| `Confidential` | Maxfiy aktivlar hodisalari |
| `VerifyingKey` | Tekshirish kalitlari ro'yxatida sodir bo'lgan hodisalar |
| `RuntimeUpgrade` | Ish vaqti yangilanishi tadbirlari |
| `Soradns` | Resolver direktoriya boshqaruvi tadbirlari |
| `Sorafs` | SoraFS Gateway-ga muvofiqlik hodisalari |
| `SpaceDirectory` | Kosmik direktoriya manifest hayot davri hodisalari |
| `Escrow` | O ' rnatilgan natijador aktivlar eskorining hayotiy davrida sodir bo ' lgan oshkora voqealar |
| `Offline` | Oflayn to'lov tadbirlari |
| `Oracle` | Oracle feed hodisalari |
| `Social` | Virusli rag'batlantirish tadbirlari |
| `Bridge` | Koʻprik tadbirlari |
| `Governance` | Boshqaruv xususiyati yoqilgan boshqaruv tadbirlari |

Aksariyat beton filtrlari ham fakultativ ID matcher va hodisalarni belgilaydigan maska.
Misol uchun, aktiv filtrlari bitta aktiv yoki bir turdagi aktiv hodisalariga mos keladi;
o'chirgich filtrlari o'chirg'iga mos bo'lsa ID va qo'zg'atuvchi hodisalar to'plami.

## Pipeline filtrlari {#pipeline-filters}

Pipeline filtrlari blok, tranzaksiya, birlashtirish kabi jarayonlarga mos keladi;
va guvohlar hodisalari. ularni operativ obunalar, blok-processing uchun ishlatish
dashboardlar va tugatuvchilar, ular katta ma'lumotlar bo'yicha emas, balki quvur holatiga javob beradi
obyektlar.

## Trigger filtrlari {#trigger-filters}

Ishtirokchilar o ' z holatini `EventFilterBox`. Bundan tashqari , qoʻzgʻatuvchi harakat
do'konlar:

- ijro etilishi mumkin
- takrorlash siyosati
- vakolatli organ hisob raqami
- vaqtni qo'zg'atishning qayta urinish siyosati
- Metadatalar

O'chirib yuborish organi ijro etilishi kerak bo'lgan ruxsatnomalarga ega bo'lishi kerak.
Uzoq umr ko'rsatadigan tetikterlar uchun maxsus texnik hisoblarni afzal ko'rish.

## Soʻrov filtrlari {#query-filters}

So'rov filtrlari hodisa filtrlaridan ajralib turadi.
Predikat va selektorni qo'llab-quvvatlash. SDK
sozlash vositasi so'rov chiqish turiga mos keladi.

Shuningdek qarang:

- [Tadbirlar](/uz/blockchain/events.md)
- [Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#queries-and-events)
- [Ishtirokchilar](/uz/blockchain/triggers.md)
- [Savollar](/uz/blockchain/queries.md)
- [Soʻrov uchun maʼlumot](/uz/reference/queries.md)
