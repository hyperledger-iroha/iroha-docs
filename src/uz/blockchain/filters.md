---
translation_locale: uz
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filterlar {#filters}

Filtrlar hodisalar oqimi va trigger shartlarini toraytiradi. Joriy yuqori darajadagi hodisa filtri `EventFilterBox` bo‘lib, quyidagi hodisalar oilalariga mos keladi:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Ish jarayoniga mos eng tor filtrdan foydalaning. `DataEventFilter::Any` kabi keng filtrlar diagnostika uchun foydali, ammo har bir hodisa trigger yoki obunachiga moslash xarajatini keltirib chiqaradi.

## Maʼlumotlar hodisasi filtrlari {#data-event-filters}

`DataEventFilter` reyestr ma’lumotlari hodisalariga mos keladi. Uning joriy variantlari quyidagilarni o‘z ichiga oladi:

| Variant | Hodisalar oilasi |
| --- | --- |
| `Any` | Istalgan ma’lumot hodisasi |
| `Peer` | Tugun hayot davri hodisalari |
| `Domain` | Domen hayot davri va metama’lumot hodisalari |
| `Account` | Hisob hayot davri, metama’lumot, taxallus va identifikatsiya hodisalari |
| `Asset` | Aktiv qoldig‘i va metama’lumot hodisalari |
| `AssetDefinition` | Aktiv ta’rifi hayot davri, siyosati va metama’lumot hodisalari |
| `Nft` | NFT hayot davri va metama’lumot hodisalari |
| `Rwa` | Haqiqiy dunyo aktivlari hayot davri hodisalari |
| `Trigger` | Trigger hayot davri va metama’lumot hodisalari |
| `Role` | Rol hayot davri hodisalari |
| `Configuration` | Zanjirdagi sozlama hodisalari |
| `Executor` | Bajarish muhiti ijrochisi hodisalari |
| `Proof` | Isbotni tekshirish hayot davri hodisalari |
| `Confidential` | Maxfiy aktiv hodisalari |
| `VerifyingKey` | Tekshiruv kalitlari reyestri hodisalari |
| `RuntimeUpgrade` | Bajarish muhitini yangilash hodisalari |
| `Soradns` | Yechuvchi katalogini boshqarish hodisalari |
| `Sorafs` | SoraFS darvozasi muvofiqlik hodisalari |
| `SpaceDirectory` | Makon katalogi manifesti hayot davri hodisalari |
| `Escrow` | Oshkora mahalliy aktiv eskrousi hayot davri hodisalari |
| `Offline` | Oflayn hisob-kitob hodisalari |
| `Oracle` | Orakul ma’lumot oqimi hodisalari |
| `Social` | Virusli rag‘bat hodisalari |
| `Bridge` | Ko‘prik hodisalari |
| `Governance` | Boshqaruv xususiyati yoqilgandagi boshqaruv hodisalari |

Aniq filtrlarning aksariyati ixtiyoriy identifikator moslagichi va hodisalar majmuasi niqobini ham qabul qiladi. Masalan, aktiv filtri bitta aktiv yoki aktiv hodisalari sinfiga, qo‘zg‘atuvchi filtri esa qo‘zg‘atuvchi identifikatori va hodisalar majmuasiga mos kelishi mumkin.

## Konveyer filtrlari {#pipeline-filters}

Konveyer filtrlari blok, tranzaksiya, birlashtirish va guvoh hodisalari kabi qayta ishlash hodisalariga mos keladi. Ulardan operatsion obunalar, blokni qayta ishlash boshqaruv panellari va reyestr ma’lumoti obyektlari o‘rniga konveyer holatiga javob beradigan triggerlar uchun foydalaning.

## Qo‘zg‘atuvchi filtrlari {#trigger-filters}

Triggerlar o‘z shartini `EventFilterBox` sifatida saqlaydi. Trigger amali quyidagilarni ham saqlaydi:

- bajariladigan amal
- takrorlash siyosati
- vakolat hisobi
- vaqt triggeri uchun ixtiyoriy qayta urinish siyosati
- metama’lumot

Qo‘zg‘atuvchi vakolati bajariladigan amal talab qilgan ruxsatlarga ega bo‘lishi shart. Uzoq muddat ishlaydigan qo‘zg‘atuvchilar uchun alohida texnik hisoblardan foydalaning.

## Soʻrov filtrlari {#query-filters}

So‘rov filtrlari hodisa filtrlaridan alohida. Takrorlanadigan so‘rovlar predikat va selektorlarni qo‘llashi mumkin. Filtr kirishi so‘rov natijasi turiga mos kelishi uchun SDK dagi so‘rovga xos tiplashtirilgan filtrlardan foydalaning.

Shuningdek qarang:

- [Hodisalar](/uz/blockchain/events.md)
- [Mahalliy aktiv eskrousi ](/uz/blockchain/escrow.md#queries-and-events)
- [Triggerlar](/uz/blockchain/triggers.md)
- [So'rovlar](/uz/blockchain/queries.md)
- [So‘rovlar ma’lumotnomasi](/uz/reference/queries.md)
