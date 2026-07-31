---
translation_locale: uz
translation_source: /blockchain/consensus.md
translation_source_hash: a4c59672f20f0a3363fdd098852a7e0e8159fa082e88825d6346731733ecdcb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Konsensus {#consensus}

Transaksiyalar oldin navbatga kiradi Sumeragi ularni blokda taklif qiladi.
Validatorlar taklifni mustaqil ravishda tasdiqlaydi va amalga oshiradi, so'ngra faqat imzolaydi
bir blok zarur bo'lgan
tasdiqlovchi quorum ushbu natija bilan rozi bo'ladi va moslashtiriladigan yuk mavjud.

Hammasi Iroha 3 tarmoqlar ma'lumotlar mavjudligi va ishonchli etkazib berish yo'nalishlaridan foydalanadi.
Ular konsensus talablari, tanlov bo'yicha joylashtirish xususiyatlari emas.

## Sumeragi {#sumeragi}

Sumeragi bo ' lmoqda Iroha Bizansning xatolarga chidamli konsensus motori.
navbatdan o'tgan tranzaksiyalar, tasdiqlovchi tengdoshlar bir xil tartib bo'yicha kelishgan
blok, va faqat yetarli miqdordagi tasdiqlovchilarga ega bo'lganidan keyin ushbu blokni yakunlaydi
aynan shu natijani keltirib chiqargan va majburiyat sertifikatini imzolagan.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Tartib va majburiyat yo'li {#proposal-and-commit-path}

Sumeragi kitobni bir vaqtning o'zida bir blok balandlikda oldinga ko'taradi.
bir tasdiqlovchi joriy nuqtai nazarning taklifchisi sifatida ish ko'rsatadi.
navbatdan amalga oshiriladigan to'lovlar, nomzod blokini yaratadi va e'lon qiladi
faol tasdiqlovchi to'plamning taklifi.

Xuddi shunday Sumeragi ruxsat etilgan va nomlangan gaz quvurlarida ishlatiladi
Ishlab chiqarishga asoslangan (NPoS) joylashtirish:

1. Validador navbatdagi bitimlarni bloklashni taklif qiladi.
2. Validatorlar taklifni amalga oshirish orqali
   bir xil jahon davlati.
3. Validatorlar joriy balandlik uchun ovoz va quorum sertifikatlarini almashtirishadi
   va ko'rinish.
4. Komitment quorumga erishilgandan so'ng, tengdoshlar blokni amalga oshiradilar va yangilash
   ularning jahon holati.

Validatorlar faqat mahalliy ravishda qayta tiklashi mumkin bo'lgan ma'lumotlarni imzolaydilar.
tasdiqlovchi taklif kutilayotgan zanjir, balandlik va
ko'rish; amalga oshirish imzolari va cheklovlari haqiqiy bo'lishi; yo'nalish yo'nalishi va
ijrochi tasdiqlash deterministik; va foydalanish yukini bajarish hosil
Agar mahalliy natija farq qilsa, validator
taklifni rad etib, unga ovoz berishning o'rniga rad etadi.

Ovozlar kichik imzolangan konsensus xabarlari. Ular taklif qilingan blokga ishora qiladi,
balandligi, ko'rinishi va tasdiqlovchi kimligini.
Quorum sertifikatiga yoki commit sertifikatlariga ovoz beradi.
bir xil natija uchun etarlicha tasdiqlovchilarning e'tiborini jalb qilganligi to'g'risidagi mustahkam dalil
blok.

### Quorum, yig'uvchilar va kuzatuvchilar {#quorum-collectors-and-observers}

Ovozlarni tasdiqlovchilarning soni `n` Bizansning xatolar byudjetini belgilaydi.
kamida to'rtta tasdiqlovchi tarmoqlar, byudjet `f = floor((n - 1) / 3)`
va komissiya quorum `2f + 1`. Birdan uchta tasdiqlovchi uchun barcha tasdiqlovchilar
rivojlanish uchun foydali bo'lgan, ammo amaliy yo'q
offline slack.

To'plamchilar bir fanout optimallashtirish. har bir tasdiqlovchi yuborish o'rniga har
har bir boshqa tasdiqlovchiga ovoz berish, Sumeragi bir yoki bir nechta to'plamchilarni tanlashi mumkin
Ko'pchilik ovozlarni yig'adi, quorumning rivojlanishini e'lon qiladi va
ovoz berish trafikining ko'pligi
orqali `GET /v1/sumeragi/collectors`; ko'rsatilgan CLI- Bu
`ops sumeragi telemetry` "Snapshot"da joriy to'plamchilar sonining ma'lumoti keltirilgan.

Kuzatuvchi tengdoshlar o'zlarining bloklarini sinxronlashtirishi mumkin, lekin ular taklif qilmaydi:
ovoz berish, ovozlarni to'plash yoki komitet quorumga qarab hisoblash.
joylashtirish uchun mahalliy so'rovlar quvvati, indekslash, kuzatish yoki mintaqaviy blok kerak
ovoz berish tasdiqlovchilarining sonini ko'paytirmasdan takrorlash.

### Oʻzgarishlarni koʻrish va tiklash {#view-changes-and-recovery}

Ko'rinish Sumeragi muayyan taklifchi bilan bitta balandlikni yakunlashga urinish
Agar taklif, foydali yuklama, ovoz berish yoki amalga oshirish muvaffaqiyatsizlikka uchrasa,
Pacemaker balandlikni keyinchalik ko'rinishga o'tkazib yuborishi mumkin. Ko'rinish o'zgarishi
O'z navbatida, bu o'zgartirilgan blokni amalga oshiradi.
balandligi, eng yuqori ma'lum quorumni o'tkazadi yoki tengdoshlar uchun dalillarni taqdim etadi
to'qnashuvchi bloklarni yakuniylashtirmang.

Faydali yukni tiklash yakuniylik qarori bilan alohida hisoblanadi.
blokning to'liq yukini olishdan oldin quorum yoki majburiyat sertifikatini berish.
holatda, tengdoshlar ishonchli etkazib berishdan foydalanadi (RBC) yoki blok sinxronizatsiyasini tiklash uchun
payload, uni reklama qilingan hashlarga qarshi tekshiradi va faqat keyin
jahon davlatiga blok va Kura.

### Konsens usuli {#consensus-modes}

Tanlangan rejimda validator setining shakllantirilishi va ishlatilishini nazorat qiladi.
genesis orqali e'lon qilinadi [`consensus_mode`](/uz/reference/genesis.md)
va tengdoshlar konfiguratsiyasi orqali `sumeragi.consensus_mode`. Uni
tarmoq bo'ylab holat: validatorlar bir xil imzolangan genesis, topologiya,
ishonchli tengdoshlar ma'lumotlari va samarali Sumeragi parametrlar.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

| Modus         | Eng yaxshi mos                                                                               | Tasdiqlovchi moslamasi                                                                                                      | Operatsiyaviy e'tibor                                                                                          |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Ruxsat | Xususiy, konsorsium va operator boshqaradigan tarmoqlar                                     | Valitatorlar ishga tushirish bilan kelishilgan ishonchli tengdosh topologiyasidan kelib chiqadi                                            | Barcha tasdiqlovchilarni bir xil imzolangan genesis, ishonchli tengdoshlar, tengdosh kalitlari va Sumeragi parametrlar          |
| NPOS         | Davlat Nexus-ma'lumotlarni tasdiqlash nomzod va ulush siyosatini o'z ichiga olgan yo'naltirilgan tarmoqlar | Validatorlar NPoS profilidan foydalanib tanlanadi, odatda davrlar bo'ylab va BLS kalitlar va mulkdorlik hujjati | O'yindagi fotosuratlar, davr parametrlari, tasdiqlovchi saqlang PoPs, va tarmoq bo'ylab moslashtirilgan NPoS fazasi vaqtlari |

::: tip Ruxsat etilgan rejim

Validator ro'yxati aniq operatsion bo'lganda ruxsat etilgan rejimdan foydalaning
Bu o'z-o'zini uyushtirish uchun odatdagi boshlang'ich nuqta. Iroha tarmoqlar
chunki a'zolik o'zgarishlari bila turib boshqaruv yoki boshqaruvchi tomonidan amalga oshiriladi
muhim operatsion qoida shundaki, har bir tasdiqlovchi
genesis haqida bir xil nuqtai nazar, ishonchli tengdoshlar, BLS O'z egasining hujjati va
Sumeragi parametrlar. Boshqa topologiya yoki imzolangan genesisga ega bo'lgan yagona tengdosh
tarmog'i majburiyatni o'z zimmasiga olishiga to'sqinlik qilishi mumkin.

:::

::: tip NPOS rejimi

Ishlab chiqarish profilida validator ishtirokini kutganda NPoS rejimidan foydalanish
ko'rsatkichlar nomzod va stavka davlat tomonidan boshqariladi. SORA Nexus joylashtirish
NPoS-dan foydalanish va ularning yaratilgan profillari quyidagilarni o'z ichiga oladi: BLS tasdiqlovchi
kimlik, egalik hujjati, davr o'rnatish va Sumeragi NPOS
Epoch o'zgarishlari faol tasdiqlovchini almashtirishi mumkin
belgilangan balandliklarda o'rnatilgan, shuning uchun operatorlar konsensus sog'lig'ini va
Keyingi ro'yxatni ta'minlaydigan o'yin yoki nomzodlik holati.

:::

## Ko'p tarmoqli konsensus {#multilane-consensus}

Iroha koʻp yoʻnalishdagi konsensus yoʻli amalga oshiriladi Nexus yo'nalish va
ma'lumotlar maydonining konfiguratsiyasi. Bu alohida konsensus instansiyasini ishga tushirmaydi
har bir yo'nalish uchun. Sumeragi hali ham bitta buyurtma qilingan blok oqimini yakunlaydi; yo'nalishlar
Transaksiyalarning yo'nalishi, rejalashtirilishi, hisoblanishi va saqlanishini tasvirlash
o'sha daryo ichida.

Ish vaqti konfiguratsiyasi uchta yo'nalish holatini yaratadi:

- `lane_catalog`: konfiguratsiya qilingan yo'llar, har biri raqamli `LaneId`,
  alias, ma'lumotlar maydoni, ko'rinishi, saqlash profili, isbot sxemasi va
  Metadatalar.
- `dataspace_catalog`: har biri raqamli ma'lumotlar maydonlari
  `DataSpaceId` va relay qo'mitasi uchun ishlatiladigan xatolarga chidamlilik qiymati
  o'lchash.
- `routing_policy`: andoza yo'nalish / ma'lumotlar maydonining juftligi va tartibga solinadigan yo'naltirish
  hisoblar yoki ko'rsatma yo'nalishlariga mos keladigan qoidalar.

Transaksiya navbatga kirganida, yo'nalish yo'riqchisi uni
`RoutingDecision { lane_id, dataspace_id }`. Bir yo'nalish rejimida bu
doimo yo'l `0` va universal ma'lumotlar maydoni. Nexus modda, konfiguratsiya qilingan
router ma'lumotlar maydonida ko'rsatilgan qoidalarni qo'llaydi, hisob-kitob yo'nalishi, hisob qoidalarini;
yo'nalish qoidalari va oxir-oqibat andoza yo'nalishi.
va ma'lumotlar maydonlari ularning kataloglarida mavjud bo'lishi kerak, va yo'nalish
hal qilingan ma'lumotlar maydonchasi; aks holda tranzaksiya amalga oshirilishdan oldin rad etiladi
navbatda turishdi.

Chegara ushbu yoʻnaltirish qarorini tranzaksiya hash bilan saqlaydi
keyinchalik bosqichlarda uni qayta xulosa qilish shart emas.
yo'nalish metadatalari ikki usulda:

- U tranzaksiyalarni yo'nalish bo'yicha o'zaro o'tkazadi, shuning uchun bitta yo'nalishda
  blok faqatgina uning bitimlari birinchi navbatda navbatda bo'lganligi uchun.
- U har bir yo'nalishdagi tranzaksiyalarni amalga oshirish bo'yicha birlikni qo'llaniladi (TEU) cheklovlari.
  yo'nalishning konfiguratsiyalangan quvvatidan ortiq bo'lganlar kechiktirilgan va to'xtatilgan;
  faqat yo'nalish uchun birinchi ortiqcha vaznli bitim qabul qilinishi mumkin
  tiriklikni oldini olish uchun.

Ishonchli etkazib berish paytida, Sumeragi taklif qilingan foydali yukni yo'nalish bo'yicha yig'adi
To'liq hisoblangan ma'lumotlar:
qismlar, foydali yuk bytlari va TEU. Komitment bo'lganidan so'ng, ushbu to'plamlar yo'nalishga aylanadi
va ma'lumotlar maydonidagi majburiyatlarni ko'rsatadigan tezkor tasvirlar Sumeragi holat. Agar
blokda yo'nalish to'lovlari kiritiladi, blokni qayta ishlash ham yo'nalishni yaratadi
blok sarlavhasini bog'laydigan hisob-kitob majburiyatlari va relay zarflari,
O'zlashtirish sertifikati, ma'lumotlar mavjudligi majburiyati hash, hisob-kitobni tasdiqlash;
va yo'nalishdagi foydali yuk hajmi.

## Ishonchli etkazib berish (RBC) {#reliable-broadcast-rbc}

Ishonchli etkazib berish (RBC) deb hisoblanadi . Sumeragi yukni tarqatish va qayta tiklash
yo'nalishi. Bu tasdiqlovchilar va kuzatuvchilarga tegishli bo'lgan blok tanasini olishda yordam beradi
taklif yoki majburiyat guvohnomasiga, ayniqsa `BlockCreated`
xabar, blok sinxronizatsiya yangilanishi yoki to'g'ridan-to'g'ri yuk o'tkazish kechiktirilgan yoki yo'qolgan.

RBC taklif qiluvchi tomonidan yangi loyihalar ko'rib chiqiladi. RBC a uchun sessiya
blok balandligi, ko'rinish va foydali yuk hash, so'ngra foydali yuk qismlarini yuboradi
topologiya o'rnatish. Tengdoshlar qismlarni kuzatib olish, tiklangan yukni tasdiqlash
reklama qilingan hashga qarshi va almashtirish `READY` va `DELIVER` signallar
bir marta yetarlicha validatorlar bir xil faydali yukni kuzatgan.
tomonidan TTL, bo'lak, to'qima, ko'tarilgan-qolish va saqlanayotgan-qo'riqlanish cheklovlari shunday
tiklash trafik cheksiz o'sishi mumkin emas.

RBC bu alohida konsensus qarori emas va u majburiyatning o'rniga
blok hali ham faqat tengdoshi amaldagi majburiyatga ega bo'lganda yakunlanadi
sertifikat va mahalliy ravishda moslashtirilgan yuk. RBC majburiy ta'minot
mavjudligi dalillari va foydali yukni tiklash, ammo amalga oshirilgan yutuqlar
sertifikatni qo'llab-quvvatlash va mahalliy yuk tashish. Agar sertifikat oldin kelsa
payload, tengdosh payload qayta tiklashi mumkin orqali RBC yoki blok sinxronizatsiya va
so'ngra o'zingizga qasd qilinglar.

Operatsiyaviy jihatdan, RBC yo'qolgan yukni aniqlashda foydali bo'ladi va
ma'lumotlarning mavjudligi bo'yicha muammolar:

- `iroha --output-format text ops sumeragi telemetry` yig'ilgan ko'rsatkichlar
  mavjudlik ovozlari, joriy to'lovchilar soni va kutilayotgan RBC yig'ilishlar.
- `GET /v1/sumeragi/rbc` va `GET /v1/sumeragi/rbc/sessions` batafsil ko'rsatilgan
  yig'ilgan va faol seans ma'lumotlari Torii, shu jumladan qisqacha rivojlanish,
  tayyorlik, yetkazib berish holati va yo'nalish yoki ma'lumotlar maydonining orqaga tushishi; qarang
  [Torii yakuniy nuqtalar](/uz/reference/torii-endpoints.md).
- Prometheus signallari: `sumeragi_rbc_store_pressure`,
  `sumeragi_rbc_backpressure_deferrals_total`, va yo'nalishi uchun yoki
  ma'lumotlar maydonida RBC Backlog o'lchash tarmoq yo'qotish ajratish yordam beradi, qism
  qayta tiklash va saqlash bosimi; qarang
  [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md).

Kura saqlash uchun hosil bo'lgan yo'nalish konfiguratsiyasini ishlatadi.
deterministik saqlash nomlarini oladi: `blocks/lane_000_core` va
`merge_ledger/lane_000_core_merge.log`; yo'nalishning hayot davri o'zgarishi mumkin
O'sha segmentlarni global
Blok buyurtmasi.
