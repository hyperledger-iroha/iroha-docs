---
translation_locale: uz
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Tafsir qilingan {#iroha-explained}

Iroha 3 birinchi chiqarilgan Hyperledger Iroha platformasi. Xuddi bir yulduz
o'zini-o'zi uyushtirilgan tarmoqlarni qo'llab-quvvatlaydi va SORA Nexus ma'lumotlar uchun ijro etish modeli
bo'sh joylar va ko'p yo'nalishdagi yo'nalishlar.

## Asosiy qurilish bloklari {#core-building-blocks}

- **`irohad`** tengdoshlarni boshqaradi
- **Torii** mijoz va operator darvozasi
- **Sumeragi** konsensusni hal qiladi
- **Norito** bu [kanonik ikkilamchi format](/uz/reference/norito.md)
- **IVM** portativ aqlli kontraktlar va byte kodini ishga tushiradi
- **Kotodama** yuqori darajadagi `.ko` shartnomalar IVM `.to` Byte kodlari
- **Kagami** kalitlar, genesis, profillar va lokal tarmoqlarni tayyorlaydi
- **SORA Nexus xizmat samolyotlari** qoʻshish Soracloud, Inrou, SoraNet, SoraFS, va
  SoraDNS ilovalar xosting, maxfiylik transporti, saqlash va nomlash uchun

## Ijro qilish modeli {#execution-model}

Dunyo holatidagi har qanday o'zgarish hali ham bitimlar orqali sodir bo'ladi.
Transaksiyalar yo'l-yo'riqlarni o'z ichiga oladi yoki IVM bytekod va Torii asosiy yo'l
mijozlar ularni taqdim etadi yoki ularning ta'sirini kuzatadi.

- Nexus-Shuning o'zida ko'p yo'nalishlarni belgilash mumkin.
- ma'lumotlar maydonlari ish yuklarini alohida ta'minlaydi va bir xil kitob modelining bir qismi bo'lib qoladi
- yoʻnalish siyosati qaysi yoʻnalishda va maʼlumotlar maydonida ish sinfini boshqarishni hal qiladi

## Ko'p ma'lumotlar maydoni me'mori {#multi-dataspace-architecture}

Ma'lumotlar maydoni - bu yo'nalish va nomlar maydonining chegarasi, alohida blokchaina emas.
Ish vaqti hali ham bitta `World`, bir bitim modeli va bitta konsensus
quvurlari. Nexus boʻlimni qanday ishlashini aytadigan kataloglarni qoʻshadi
yo'llar bo'ylab va qanday qilib ushbu yo'llar xizmat ko'rsatadigan ma'lumotlar maydonlarini nomlash.

Ish paytida ma'lumotlar maydoni raqamli `DataSpaceId` va
Katalog metadatalari. `DataSpaceId::UNIVERSAL` O ' z kuchini `0`; ko'rsatkich
katalogda `universal` ma'lumotlar maydonchasi. Har bir konfiguratsiya qilingan ma'lumotni maydonchasida:

- noyob raqam ID
- o'ziga xos alias sifatida: `universal`, `governance`, yoki `zk`
- operator yuzalari bo'yicha fakultativ tavsif
- nol bo'lmagan `fault_tolerance` Relay qo'mitalarini o'lchash uchun ishlatiladigan qiymat

Dalolatlar - bu ma'lumotlar maydonlariga bog'liq bo'lgan ijro va saqlash yo'nalishlari.
yo'nalish kirish a `LaneId`, ko'rsatilgan `DataSpaceId` bu bir alias sifatida xizmat qiladi,
ko'rinishi (`public` yoki `restricted`), saqlash profili (`full_replica`,
`commitment_only`, yoki `split_replica`), isbot tizimi va fakultativ
Boshqaruv, hisob-kitob va rejalashtirish metadatalari.
Ushbu katalogdan yo'nalishdagi saqlash geometriyasi, shu jumladan Kura segment nomlari
va deterministik kalit prefikslar.

Yoʻnalish yoʻli:

1. Konfiguratsiya tasdiqlangan `DataSpaceCatalog`, `LaneCatalog`, va
   `LaneRoutingPolicy`. Ko'p yo'llar, ko'p ma'lumotlar maydonlari yoki andoza bo'lmagan
   yoʻnalish talab etiladi `nexus.enabled = true`.
2. Transaksiya navbatida faol yoʻnalish routeridan
   `RoutingDecision` yo'nalishdagi ID va ma'lumotlar maydoni ID.
3. Yo'nalishning aniq qoidalari vakolat/hisobga yoki ko'rsatmalarga qarab moslashishi mumkin
   Etiketa. moslash qoidasi bo'lmaganda, router ma'lumotlar maydonini
   domen IDs, Asset-definition proyeksiyalari, ma'lumotlar maydonidan foydalanish uchun ruxsatnomalar;
   to'lovlar bo'yicha yo'nalishlar yoki organning bog'liq hisob raqamlari.
4. Xalos qilingan yo'nalish ikkala katalogga ham mos keladi.
   noma'lum ma'lumotlar maydonlari va yo'nalish / ma'lumot maydonining mos kelmasligi deterministik
   yoʻnaltirish xatosi. Agar bir operatsiya ikki xil maʼlumotlar maydonida yozsa
   maqsadlar, u zid yo'l sifatida rad etiladi; o'zaro ma'lumotlar maydoni DVP/PVP
   to'lov universal koordinator yo'nalishi orqali amalga oshiriladi.
5. Sumeragi va telemetriya vazifani yoʻnalish va maʼlumotlar maydoni sifatida koʻrinishda saqlaydi
   faoliyat, orqaga chiqish va majburiyatlarni ko'rish.

Shu sababli ob'ekt identifikatorlari muhimdir.
o'zlarining ID, misol uchun `payments.universal`, Shunday qilib, domen miqyosida yozish mumkin
hisoblar kanonik va domensiz qoladi, shuning uchun bir xil hisob
o'zgarmasdan turli xil qo'llanma maydonlariga bog'lanishi mumkin
`AccountId`. Asset ta'riflari domen/ma'lumotlar maydonining proyeksiyasini olib borishi mumkin,
bu esa aktiv operatsiyalariga to'g'ri ma'lumotlar maydonining yo'nalishini meros qilib olish imkonini beradi.

Yo'q Nexus o'tkazib yuborilsa, nod bitta yo'ldan foydalanadi va `universal`
Ma'lumotlar maydoni. SORA profil uni uch yo'nalishli bilan almashtiradi
katalog: `core` universal ommaviy yo'nalish uchun, `governance` boshqaruv uchun
harakatlanish va `zk` nol ma'lumotlar bilan bog'lanish va shartnoma asosida ishga tushirish uchun
trafik.

Ushbu uchta andoza ish yuklari sinflarini ajratish uchun mavjud:

| Ma'lumotlar maydoni    | Yoʻl         | Nima uchun u bor                                                                                                                                       |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       | Dastlabki ma'lumotlar maydoni (`DataSpaceId::UNIVERSAL == 0`) odatdagi ommaviy hisob raqamlari trafikini va ortga qaytish yo'nalishini ta'minlash uchun.                                 |
| `governance` | `governance` | Boshqaruv va parlament harakati uchun cheklangan yo'l, shuning uchun nazorat-tasha faoliyati umumiy qo'llanma yozish bilan aralashtirilmaydi.                      |
| `zk`         | `zk`         | Zero bilimli dalillar, ilovalar va shartnomalarni ishga tushirish yo'nalishi uchun cheklangan yo'nalish, aniqlovchi yuksak ish oqimlarini odatdagi yozishdan ajratib turadi. |

Faqat `universal` - bu qo'riqlangan boshlang'ich chiziq. `governance` va `zk` bo'lgan SORA
paketli katalog va yo'nalish siyosatida kodlangan profil tanlash;
operatorlar boshqa ma'lumotlar maydonini talab qilganda boshqa katalogni belgilashlari mumkin
chegaralar.

Sumeragi har doim ma'lumotlar mavjudligi va ishonchli etkazib berishdan foydalanadi.
ko'rsatkichlarning bir qismi Iroha 3 konsensus protokolini ishga tushirish orqali o'chirib bo'lmaydi
profil.

Ish vaqti xatti-harakati konfiguratsiya fayllaridan va zanjirdagi parametrlardan kelib chiqadi.
Tabiat o'zgaruvchilari ishlab chiqarish xususiyatlari darvozalari emas.

## Keyingi oʻqing {#read-next}

- [SORA Nexus xizmat ko'rsatish](/uz/blockchain/sora-nexus-services.md)
- [Uchratish Iroha 3](/uz/get-started/launch-iroha.md)
- [Dunyo, WSV, va Kura saqlash](/uz/blockchain/world.md)
- [Ibtidoga oid ma'lumot](/uz/reference/genesis.md)
- [Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md)
