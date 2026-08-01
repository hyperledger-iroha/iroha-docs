---
translation_locale: uz
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha tushuntirilgan {#iroha-explained}

Iroha 3 - birinchi chiqarilgan Hyperledger Iroha platformasi. Xuddi shu markaz o'z-o'zini uyushtirgan tarmoqlarni va SORA Nexus ma'lumotlar maydonlari va ko'p yo'nalishdagi yo'naltirish uchun ijro etish modelini qo'llab-quvvatlaydi.

## Asosiy qurilish bloklari {#core-building-blocks}

- `irohad` tengdoshlarni boshqaradi
- Torii mijoz va operator darvozasi hisoblanadi
- Sumeragi konsensusni o'zlashtiradi
- Norito - bu [kanonik ikkilamchi format ](/uz/reference/norito.md)
- IVM portativ aqlli kontraktlar va byte kodini o'tkazadi
- Kotodama yuqori darajadagi `.ko` shartnomalarni IVM `.to` bytekodga yig'adi.
- Kagami kalitlarni, genesisni, profillarni va lokal tarmoqlarni tayyorlaydi
- SORA Nexus xizmat samolyotlari qo'shish Soracloud, Inrou, SoraNet, SoraFS, va SoraDNS dasturlarni xosting qilish, maxfiylik transporti, saqlash va nomlash uchun

## Ijro qilish modeli {#execution-model}

Dunyo holatidagi har qanday o'zgarish hali ham tranzaksiyalar orqali sodir bo'ladi. Tranzaksiyalar ko'rsatmalarni yoki IVM byte kodini o'z ichiga oladi va Torii mijozlar ularni taqdim etishning asosiy usuli yoki ularning ta'sirlarini kuzatishdir.

- Nexus ma'lumotli konfiguratsiyalar ko'p yo'nalishlarni belgilashi mumkin
- ma'lumotlar maydonlari ish yuklarini izolyatsiya qiladi va bir xil katta kitob modelining bir qismi bo'lib qoladi
- yoʻnalish siyosati qaysi yoʻnalishda va maʼlumotlar maydonida ish sinfini boshqarishni hal qiladi .

## Ko'p ma'lumotlar maydoni me'moriyligi {#multi-dataspace-architecture}

Ma'lumotlar maydoni - bu yo'nalish va nomlar maydonining chegaralari, alohida blokchaina emas. Ish vaqti hali ham bitta `World`, bir muomala modeli va bir kelishuv quvurini o'z ichiga oladi. Nexus nodga yo'nalishlar bo'ylab qanday ajratish ishlashini va ushbu yo'nalishda xizmat qiladigan ma'lumotlar maydonlarini qanday nomlash kerakligini aytib beradigan kataloglarni qo'shadi.

Ish paytida ma'lumotlar maydoni raqamli `DataSpaceId` va katalog metama'lumotlar bilan tasvirlanadi. `DataSpaceId::UNIVERSAL` `0` sifatida qo'yiladi; andoza katalogda `universal` ma'lumot maydoni mavjud. Har bir konfiguratsiya qilingan ma'lumotni maydonida:

- yagona raqamli ID
- `universal`, `governance` yoki `zk` kabi noyob aliaslar
- operator yuzalari bo'yicha tanlovli tavsif
- Relay qo'mitalarini o'lchash uchun ishlatiladigan noldan tashqari qiymat `fault_tolerance`

Yo'nalishlar - bu ma'lumotlar maydonlariga bog'liq bo'lgan ijro va saqlash yo'llaridir. `LaneId`, ko'rsatkichlari `DataSpaceId` u alias, ko'rinishi (`public` yoki `restricted`), saqlash profili (`full_replica`, `commitment_only`, yoki `split_replica`), dalil sxemasi va fakultativ boshqaruv, hisob-kitob va jadvallashtirish metadatalari. Ish vaqti ushbu katalogdan bir yo'nalishdagi saqlash geometriyasini keltirib chiqaradi, shu jumladan: Kura segmentlar nomi va deterministik kalit prefikslari.

Yoʻnalish yoʻli quyidagicha:

1. Konfiguratsiya tasdiqlangan `DataSpaceCatalog`, `LaneCatalog` va `LaneRoutingPolicy` yo'nalishlarini yaratadi. Ko'p yo'nalishlar, ko'p ma'lumotlar maydonlari yoki andoza bo'lmagan yo'naltirishni talab qiladi `nexus.enabled = true`.
2. Transaksiya navbatida faol yoʻnalish routeridan `RoutingDecision` yo'lni o'z ichiga olgan ID va ma'lumotlar maydoni ID.
3. Yo'naltirishning aniq qoidalari vakolat/hisob yoki ko'rsatma etiketi bo'yicha moslashishi mumkin. To'g'rilashuv qoidasi bo'lmaganda, router ma'lumotlar maydonini domen IDs, aktivlar ta'rifining proyeksiyalarini, ma'lumot maydonida o'rnatilgan ruxsatnomalarni, hisob-kitob yo'nalishlarini yoki hokimiyatning bog'langan hisob maydonidan olishadi.
4. Xalos qilingan yo'l har ikki katalogga qarshi tekshiriladi. Noma'lum yo'nalishlar, noma'lum ma'lumotlar maydonlari va yo'nalish / ma'lumot maydonlarining mos kelmasligi deterministik yo'naltirish xatosi hisoblanadi. Agar bir bitim ikki xil ma'lumotlar maydonining maqsadlariga yozsa, u ziddiyatli yo'l sifatida rad etiladi; DVP/PVP o'zaro ma'lumot maydonidagi to'lov universal koordinator yo'li orqali yo'lga tushiriladi.
5. Sumeragi va telemetriya topshiriqni yo'nalish va ma'lumotlar maydonidagi faoliyat, orqaga chiqish va majburiyatlarni ko'rish uchun fotosuratlar sifatida saqlashadi.

Shuning uchun ob'ekt identifikatorlari muhimdir. Domenlar ID da ma'lumotlar maydonining aliasini o'z ichiga oladi, masalan `payments.universal`, shuning uchun domen miqyosidagi yozishlarni yo'naltirish mumkin. Hisobotlar kanonik va domensiz bo'lib qolmoqda, shuning uchun bir xil hisobni `AccountId` ni o'zgartirmasdan turli dasturlar maydonlariga bog'lab qo'yish mumkin. Asset ta'riflari domen/ma'lumotlar maydoni proyeksiyasini olib borishi mumkin, bu esa aktiv operatsiyalariga to'g'ri ma'lumotlar maydonining yo'nalishini meros qilib olish imkonini beradi.

Nexus o'rnatilmagan holda, nod bitta yo'nalish va `universal` ma'lumotlar maydonidan foydalanadi. SORA profilini uch yo'nalishli katalog bilan almashtiradi: `core` universal jamoat yo'nalishi uchun, `governance` boshqaruv trafiklari uchun va `zk` nol bilim bilan bog'liqlik va shartnomalarni ishga tushirish trafiklari uchun.

Ushbu uchta andoza ish yuklari sinflarini ajratish uchun mavjud:

|Maʼlumotlar maydoni |Lane |Nima uchun u bor ?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal` |`core` |Oddiy ommaviy hisob raqamlari harakati va qaytish yo'nalishi uchun belgilangan andoza ma'lumotlar maydoni (`DataSpaceId::UNIVERSAL == 0`) |
|`governance` |`governance` |Boshqaruv va parlament harakatlari uchun cheklangan yo'l, shuning uchun nazorat-tasha faoliyati umumiy qo'llanma yozish bilan aralashmaydi. |
|`zk` |`zk` |Zero bilimli isbotlar, ilovalar va shartnomalarni ishga tushirish yo'nalishi uchun cheklangan yo'l, isbot-og'ir ish oqimlarini odatdagi yozishlardan ajratib turadi. |

Faqat `universal` qo'riqlangan boshlang'ich liniya hisoblanadi. `governance` va `zk` SORA profil variantlari paketli katalog va yo'naltirish siyosatida kodlangan; operatorlar turli ma'lumotlar maydonining chegaralariga muhtoj bo'lganda boshqa katalogni belgilashlari mumkin.

Sumeragi har doim ma'lumotlar mavjudligi va ishonchli etkazib berishdan foydalanadi. Ushbu yo'llar Iroha 3 konsensus protokolining bir qismi bo'lib, ishga tushirish profillari tomonidan o'chirib qo'yilmaydi.

Ish vaqti xatti-harakatlari konfiguratsiya fayllaridan va zanjirdagi parametrlardan kelib chiqadi. Tabiatni o'zgaruvchilar ishlab chiqarish xususiyatlari darvozalari emas.

## Keyingi oʻqing {#read-next}

- [SORA Nexus xizmatlari](/uz/blockchain/sora-nexus-services.md)
- [Iroha 3](/uz/get-started/launch-iroha.md) ishga tushirish
- [Jahon, WSV va Kura saqlash](/uz/blockchain/world.md)
- [Ibtido ko'rsatkichi](/uz/reference/genesis.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
