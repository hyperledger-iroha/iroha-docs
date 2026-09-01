---
translation_locale: uz
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha haqida {#iroha-explained}

Iroha 3 — Hyperledger Iroha platformasining birinchi relizi. Ayni yadro mustaqil joylashtiriladigan tarmoqlarni hamda ma’lumotlar makonlari va ko‘p yo‘lakli yo‘naltirish uchun SORA Nexus bajarish modelini qo‘llab-quvvatlaydi.

## Asosiy qurilish bloklari {#core-building-blocks}

- **`iroha3d`** tugunlarni boshqaradi
- **Torii** mijoz va operator darvozasi hisoblanadi
- **Sumeragi** konsensusni boshqaradi
- **Norito** — [kanonik ikkilik format](/uz/reference/norito.md)
- **IVM** ko‘chma aqlli shartnomalar va baytkodni bajaradi
- **Kotodama** yuqori darajadagi `.ko` shartnomalarni IVM `.to` baytkodiga kompilyatsiya qiladi
- **Kagami** kalitlar, genezis, profillar va mahalliy tarmoqlarni tayyorlaydi
- **SORA Nexus xizmat qatlamlari** ilovalarni joylashtirish, maxfiylikni saqlovchi uzatish, saqlash va nomlarni aniqlash uchun Soracloud, Inrou, SoraNet, SoraFS va SoraDNS xizmatlarini qo‘shadi.

## Bajarish modeli {#execution-model}

Global holatdagi har bir o‘zgarish tranzaksiya orqali amalga oshadi. Tranzaksiyalar ko‘rsatmalar yoki IVM baytkodini olib yuradi; Torii mijozlar ularni yuborishi yoki ta’sirini kuzatishining asosiy yo‘lidir.

- Nexus ni hisobga oladigan sozlamalar bir nechta yo‘lakni belgilashi mumkin;
- ma’lumotlar makonlari ish yuklarini ajratadi, ammo ular ayni reyestr modelining qismi bo‘lib qoladi;
- yo‘naltirish siyosati muayyan ish turini qaysi yo‘lak va ma’lumotlar makoni bajarishini belgilaydi.

## Ko‘p ma’lumotlar makonli arxitektura {#multi-dataspace-architecture}

Ma’lumotlar makoni — yo‘naltirish va nomlar makoni chegarasi, alohida blokcheyn emas. Bajarish muhitida hanuz bitta `World`, bitta tranzaksiya modeli va bitta konsensus konveyeri mavjud. Nexus tugunga ishni yo‘laklar bo‘yicha qanday ajratish va bu yo‘laklar xizmat qiladigan ma’lumotlar makonlarini qanday nomlashni ko‘rsatadigan kataloglarni qo‘shadi.

Bajarish vaqtida ma’lumotlar makoni raqamli `DataSpaceId` va katalog metama’lumotlari bilan ifodalanadi. `DataSpaceId::UNIVERSAL` uchun `0` ajratilgan; standart katalog `universal` ma’lumotlar makonini o‘z ichiga oladi. Har bir sozlangan ma’lumotlar makonida quyidagilar bor:

- noyob raqamli identifikator;
- `universal`, `governance` yoki `zk` kabi noyob taxallus;
- operator interfeyslari uchun ixtiyoriy tavsif;
- uzatuvchi qo‘mitalar hajmini belgilashda ishlatiladigan nol bo‘lmagan `fault_tolerance` qiymati

Yo‘laklar — shu ma’lumotlar makonlariga bog‘langan bajarish va saqlash yo‘llaridir. Har bir yozuv `LaneId`, xizmat ko‘rsatiladigan `DataSpaceId`, taxallus, ko‘rinish (`public` yoki `restricted`), saqlash profili (`full_replica`, `commitment_only` yoki `split_replica`), isbot sxemasi hamda ixtiyoriy boshqaruv, hisob-kitob va rejalashtirish metama’lumotlarini o‘z ichiga oladi. Bajarish muhiti shu katalogdan har bir yo‘lak uchun Kura bo‘lagi nomlari va deterministik kalit prefikslarini ham qamrab oladigan saqlash tuzilishini hosil qiladi.

Yo‘naltirish jarayoni quyidagicha:

1. Sozlama tekshirilgan `DataSpaceCatalog`, `LaneCatalog` va `LaneRoutingPolicy` ni tuzadi. Bir nechta yo‘lak, bir nechta ma’lumotlar makoni yoki nostandart yo‘naltirish uchun `nexus.enabled = true` talab qilinadi.
2. Tranzaksiyalar navbati faol yo‘lak yo‘naltiruvchisidan yo‘lak identifikatori va ma’lumotlar makoni identifikatorini o‘z ichiga olgan `RoutingDecision` ni so‘raydi.
3. Aniq yo‘naltirish qoidalari vakolat/hisob yoki ko‘rsatma yorlig‘iga mos kelishi mumkin. Mos qoida bo‘lmasa, yo‘naltiruvchi ma’lumotlar makonini domen identifikatorlari, aktiv ta’rifi proyeksiyalari, makon doirasidagi ruxsatlar, hisob-kitob qismlari yoki vakolat hisobining bog‘langan doirasidan hosil qilishi mumkin.
4. Aniqlangan yo‘nalish ikkala katalogga nisbatan tekshiriladi. Noma’lum yo‘lak, noma’lum ma’lumotlar makoni va yo‘lak/makon mos kelmasligi deterministik yo‘naltirish xatosidir. Tranzaksiya ikki xil ma’lumotlar makonidagi nishonga yozsa, ziddiyatli yo‘nalish sifatida rad etiladi; makonlararo DVP/PVP hisob-kitobi universal muvofiqlashtiruvchi yo‘lak orqali yo‘naltiriladi.
5. Sumeragi va telemetriya tayinlovni yo‘lak hamda ma’lumotlar makoni faoliyati, navbat qoldig‘i va majburiyat oniy tasvirlari sifatida ko‘rsatadi.

Shu sababli obyekt identifikatorlari muhim. Domen identifikatori `payments.universal` singari ma’lumotlar makoni taxallusini o‘z ichiga oladi, shuning uchun domen doirasidagi yozishlar yo‘naltirilishi mumkin. Hisoblar kanonik va domensiz qoladi; ayni hisobni `AccountId` ni o‘zgartirmasdan turli ilova doiralariga bog‘lash mumkin. Aktiv ta’riflari domen/ma’lumotlar makoni proyeksiyasini saqlashi mumkin, natijada aktiv amallari kerakli ma’lumotlar makoni yo‘nalishini meros qilib oladi.

Nexus o‘zgartirishlarisiz tugun bitta yo‘lak va `universal` ma’lumotlar makonidan foydalanadi. To‘plamdagi SORA profili buning o‘rniga uch yo‘lakli katalogni beradi: universal ochiq yo‘lak uchun `core`, boshqaruv trafigi uchun `governance`, nol bilim ilovalari va shartnoma joylashtirish trafigi uchun `zk`.

Ushbu uchta andoza ish yuklari sinflarini ajratish uchun mavjud:

| Ma’lumotlar makoni | Yo‘lak | Vazifasi |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Odatiy ochiq reyestr trafigi va zaxira yo‘naltirish uchun ajratilgan standart makon (`DataSpaceId::UNIVERSAL == 0`) |
| `governance` | `governance` | Boshqaruv va parlament trafigi uchun cheklangan yo‘lak; boshqaruv qatlami faoliyatini umumiy ilova yozuvlaridan ajratadi. |
| `zk` | `zk` | Nol bilim isbotlari, ilovalar va shartnoma joylashtirish uchun cheklangan yo‘lak; isbotga boy jarayonlarni odatiy yozuvlardan ajratadi. |

Faqat `universal` ajratilgan asosiy makondir. `governance` va `zk` to‘plamdagi katalog va yo‘naltirish siyosatida kodlangan SORA profil tanlovlaridir; operatorlar boshqa ma’lumotlar makoni chegaralari kerak bo‘lsa, boshqa katalog belgilashi mumkin.

Sumeragi har doim ma'lumotlar mavjudligi va ishonchli etkazib berishdan foydalanadi. Ushbu yo'llar Iroha 3 konsensus protokolining bir qismi bo'lib, ishga tushirish profillari tomonidan o'chirib qo'yilmaydi.

Bajarish muhiti xatti-harakati sozlama fayllari va zanjirdagi parametrlardan olinadi. Muhit o‘zgaruvchilari ishlab chiqarish imkoniyatlarini yoqish vositasi emas.

## Keyingi oʻqing {#read-next}

- [SORA Nexus xizmatlari](/uz/blockchain/sora-nexus-services.md)
- [Iroha 3 ni ishga tushirish](/uz/get-started/launch-iroha.md)
- [Jahon, WSV va Kura saqlash](/uz/blockchain/world.md)
- [Genezis ma’lumotnomasi](/uz/reference/genesis.md)
- [Torii so‘nggi nuqtalari](/uz/reference/torii-endpoints.md)
