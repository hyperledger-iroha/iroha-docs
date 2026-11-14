---
translation_locale: uz
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 426adbea88da36cd92da17d8665c956a57b9d4cebfa0d2f35bc75469cccf84ee
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

- ma’lumotlar makonlari institutsional ma’lumot, vakolat, siyosat va ilovalar uchun muhitlarni beradi
- yo‘laklar shu muhitlarda marshrutlash va sertifikatlash sig‘imini beradi
- mustaqil imzolangan ma’lumotlar makoni ildizi o‘z State’i va mahalliy yakuniyligiga egalik qiladi

## Ma’lumotlar makonlari va bajarish ildizlari {#multi-dataspace-architecture}

Ma’lumotlar makoni katalog yozuvi muhit va uning identifikatorini belgilaydi. Faqat katalog yozuvi mustaqil bajarish ildizini o‘rnatmaydi. Ochiq yo‘laklar tranzaksiya to‘plamlarini global zanjirda bajarish uchun sertifikatlaydi; mustaqil imzolangan ma’lumotlar makoni ildizining o‘z State’i, qo‘mitasi va mahalliy yakuniyligi bor.

`DataSpaceCatalog` ma’lumotlar makonlarini, `LaneCatalog` esa yo‘laklarni belgilaydi. Har bir yo‘lak `dataspace_id` orqali aniq bitta ma’lumotlar makoniga havola qiladi; ma’lumotlar makoni bir nechta yo‘lakni o‘z ichiga olishi mumkin. `DataSpaceId` va `LaneId` alohida identifikatorlardir, yo‘lak taxallusi yana bir ma’lumotlar makonini yaratmaydi.

Bajarish vaqtida ma’lumotlar makoni raqamli `DataSpaceId` va katalog metadatasi bilan ifodalanadi. `DataSpaceId::UNIVERSAL` uchun `0` ajratilgan; standart katalogda `universal` ma’lumotlar makoni bor. Har bir sozlangan ma’lumotlar makonida quyidagilar mavjud:

- noyob raqamli identifikator;
- `universal` kabi noyob taxallus yoki ochiq ro‘yxatdan o‘tkazilgan institutsional nom
- operator interfeyslari uchun ixtiyoriy tavsif;
- uzatuvchi qo‘mitalar hajmini belgilashda ishlatiladigan nol bo‘lmagan `fault_tolerance` qiymati

Yo‘laklar shu ma’lumotlar makonlariga bog‘langan marshrutlash va sertifikatlash resurslaridir. Yo‘lak yozuvi `LaneId`, xizmat ko‘rsatiladigan `DataSpaceId`, taxallus, ko‘rinish (`public` yoki `restricted`), saqlash profili (`full_replica`, `commitment_only` yoki `split_replica`), isbot sxemasi hamda ixtiyoriy boshqaruv, hisob-kitob va rejalashtiruvchi metadatasini saqlaydi. Bajarish muhiti bu katalogdan har bir yo‘lakning saqlash tuzilmasini, jumladan Kura segment nomlari va deterministik kalit prefikslarini hosil qiladi.

Yo‘naltirish jarayoni quyidagicha:

1. Sozlama tekshirilgan `DataSpaceCatalog`, `LaneCatalog` va `LaneRoutingPolicy`ni yaratadi. SORA Nexus marshrutlashi majburiy. Bir nechta ma’lumotlar makoni, yo‘lak yoki nostandart marshrutlash SORA Nexus profili (`--sora`) va NPoSdan foydalanadi.
2. Tranzaksiya navbati tranzaksiya va commit qilingan holatdan `RoutingPlan`ni yechadi. Har bir koordinator yoki ishtirokchi marshruti yo‘lak ID si va ma’lumotlar makoni ID sini saqlaydi; Native AMX rejalari to‘liq ishtirokchilar to‘plamini saqlaydi.
3. Global bajarish uchun boshqaruv qatlamining to‘liq to‘plamlari va ma’lumotlar makonlari orasidagi koordinatorlar yo‘lak `0`dan foydalanadi. Aniq universal bo‘lmagan ko‘rsatma yoki kontrakt manzili maqsadlari hisob yoki ko‘rsatma yorlig‘i qoidalaridan oldin mos ma’lumotlar makoni va qo‘mitasi bor qabul qilingan belgilangan yo‘lakni tanlaydi. Boshqa ish commit qilingan aniq qoidalar va standart shardingga amal qiladi; aniq universal maqsadlar universal yo‘laklarda qoladi.
4. Har bir marshrut kataloglar va faol yo‘lak holatiga nisbatan tekshiriladi. Noma’lum ID lar va yo‘lak/ma’lumotlar makoni nomuvofiqligi rad etiladi; mavjud bo‘lmagan xususiy maqsad universal bajarishga o‘ta olmaydi. Bir nechta ma’lumotlar makoni maqsadi Native AMX rejasini hosil qilishi mumkin. `reject_cross_dataspace`ga teng `amx_policy` tranzaksiya metadatasi makonlararo rejalarni rad etadi. Faqat marshrutlash rejasi mustaqil ildizlar orasidagi hisob-kitobga vakolat bermaydi va uni tugatmaydi.
5. Sumeragi va telemetriya bu taqsimotni yo‘lak va ma’lumotlar makoni faolligi, navbatdagi ish va commitment suratlari sifatida ko‘rsatib turadi.

Shu sababli obyekt identifikatorlari muhim. Domen ID si ma’lumotlar makoni taxallusini, masalan `payments.universal`ni o‘z ichiga oladi, shunda domen doirasidagi yozishlar yo‘naltiriladi. Hisoblar kanonik va domensiz qoladi, shu bois bitta hisobni uning `AccountId`sini o‘zgartirmasdan turli ilova doiralariga bog‘lash mumkin. Aktiv ta’riflari domen/ma’lumotlar makoni proyeksiyasini saqlashi mumkin, bu aktiv amallariga to‘g‘ri ma’lumotlar makoni marshrutini meros qilib beradi.

SORA Nexus o‘zgartirishlarisiz tugun bitta yo‘lak va `universal` ma’lumotlar makonidan foydalanadi. Birga yetkazilgan SORA Nexus profili uni uch yo‘lakli katalog bilan almashtiradi: universal ochiq yo‘lak uchun `core`, boshqaruv trafigi uchun `governance`, zero-knowledge biriktirmalari va kontrakt joylashtirish trafigi uchun `zk`.

Birga yetkazilgan uchala yo‘lak ham ochiq va ayni `universal` ma’lumotlar makoniga havola qiladi. Ular ish sinflarini ajratadi:

| Ma’lumotlar makoni | Yo‘lak | Vazifasi |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Odatiy ochiq reyestr trafigi va standart marshrutlash. |
| `universal` | `governance` | Ochiq boshqaruv va SORA Parliament trafigi. |
| `universal` | `zk` | Ochiq zero-knowledge biriktirmalari va kontrakt joylashtirish trafigi. |

`DataSpaceId::UNIVERSAL == 0` — ajratilgan asosiy qiymat. Yuqoridagi `governance` va `zk` nomlari alohida ma’lumotlar makonlari emas, yo‘laklarni bildiradi. Turli institutsional chegaralar uchun aniq ma’lumotlar makoni yozuvlari kerak; mustaqil bajarish uchun qo‘shimcha ravishda mustaqil autentifikatsiyalangan ildiz zarur.

Bu munosabatlar belgilangan [profil konstruktorlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs), [yo‘lak amalga oshirilishi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs) va [mustaqil ildiz shartnomasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) bilan belgilanadi.

Sumeragi har doim ma'lumotlar mavjudligi va ishonchli etkazib berishdan foydalanadi. Ushbu yo'llar Iroha 3 konsensus protokolining bir qismi bo'lib, ishga tushirish profillari tomonidan o'chirib qo'yilmaydi.

Bajarish muhiti xatti-harakati sozlama fayllari va zanjirdagi parametrlardan olinadi. Muhit o‘zgaruvchilari ishlab chiqarish imkoniyatlarini yoqish vositasi emas.

## Keyingi oʻqing {#read-next}

- [SORA Nexus xizmatlari](/uz/blockchain/sora-nexus-services.md)
- [Iroha 3 ni ishga tushirish](/uz/get-started/launch-iroha.md)
- [Jahon, WSV va Kura saqlash](/uz/blockchain/world.md)
- [Genezis ma’lumotnomasi](/uz/reference/genesis.md)
- [Torii so‘nggi nuqtalari](/uz/reference/torii-endpoints.md)
