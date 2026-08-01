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

Transaksiyalar Sumeragi ularni blokda taklif qilishdan oldin navbatga kiradi. Validatorlar taklifni mustaqil ravishda tasdiqlaydilar va ijro etadilar, so'ngra ular takrorlashi mumkin bo'lgan davlat o'tishini imzolaydilar. Bloq ushbu natija yuzasidan talab qilingan validator quorum rozi bo'lgandan keyin va moslashadigan foydali yuk mavjud bo'lganidan so'ng majburiyatini oladi.

Iroha 3 tarmoqlarining hammasi ma'lumotlar mavjudligi va ishonchli etkazib berish yo'nalishlaridan foydalanadi. Ular konsensus talablari bo'lib, fakultativ joylashtirish xususiyatlari emas.

## Sumeragi {#sumeragi}

Sumeragi - bu Iroha ning Bizans xatolarga chidamli konsensus dvigati. U navbatdan tranzaksiyalarni oladi, tasdiqlovchi tengdoshlari bir xil buyurtma qilingan blok haqida kelishib olishi kerak va ushbu blokni faqat etarlicha tasdiqlovchilar o'sha natijani takrorlaganidan so'ng yakunlaydi va majburiyat sertifikatini imzoladi.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Tartib va majburiyat yo'li {#proposal-and-commit-path}

Sumeragi katta kitobni bir vaqtning o'zida bitta blok balandligida oldinga ko'taradi. Har bir balandlikda bitta tasdiqlovchi joriy ko'rinish uchun taklif qiluvchi sifatida ishlaydi. Taqdim etuvchi navbatdan qobiliyatli tranzaksiyalarni olib tashlaydi, nomzod blokini quradi va taklifni faol tasdiqlovchi setga e'lon qiladi.

Shunga o'xshab Sumeragi quvurni ruxsat berilgan va nomlashtirilgan qo'shilish guvohnomasi (NPoS) joylashtirishda ham ishlatiladi:

1. Validador navbatdagi bitimlarni bloklashni taklif qiladi.
2. Validatorlar taklifni bir xil jahon davlatiga qarshi bitimlarni amalga oshirish orqali tasdiqlaydilar.
3. Validatorlar hozirgi balandlik va ko'rinish uchun ovozlar va quorum sertifikatlarini almashadilar.
4. Komit quorumga erishilgandan so'ng, tengdoshlar blokni amalga oshiradilar va o'zlarining jahon holatini yangilashadi.

Validatorlar faqat mahalliy ravishda qayta tiklashi mumkin bo'lgan ma'lumotlarni imzolaydilar. Ovoz berishdan oldin, validator taklif kutilayotgan zanjirga, balandlikka va ko'rinishga tegishliligini tekshiradi; bitim imzolari va cheklovlari to'g'ri ekanligini; yo'nalish yo'nalishi va ijrochi tasdiqlanishi deterministikligini tekshiradi. Agar mahalliy natija farq qilsa, tasdiqlovchi taklifni ovoz berishning o'rniga rad etadi.

Ovozlar kichik imzolangan konsensus xabarlaridir. Ular taklif qilingan blok, balandlik, ko'rinish va tasdiqlovchi kimligini bildiradi. Kolektorlar ushbu ovozlarni quorum sertifikatiga yoki commit sertifikatiga yig'adilar. Sertifikat bitta blok uchun etarli miqdordagi tasdiqlovchilarning bir xil natijani kuzatganining mustahkam isbotidir.

### Quorum, yig'uvchilar va kuzatuvchilar {#quorum-collectors-and-observers}

Ovozlarni tasdiqlovchilarning soni `n` Bizans xatolar byudjetini belgilaydi. Hech bo'lmaganda to'rtta validatorga ega tarmoqlar uchun byudjet `f = floor((n - 1) / 3)` va qo'shimcha quorum `2f + 1` hisoblanadi. Birdan uchta ta'kidlovchi uchun barcha ta'kidlovchilar o'zlashtirilishi kerak, bu rivojlanish uchun foydali bo'lsa-da, offline bo'sh vaqtga ega emas.

Kollektorlar - bu optimallashtirish. Har bir tasdiqlovchi har bir ovozni har bir boshqa tasdiqlovchiga yuborish o'rniga, Sumeragi balandlik uchun bitta yoki bir nechta to'plamchilarni tanlashi mumkin. To'plamchilar ovozlarni yig'ishadilar, quorum taraqqiyotini e'lon qilishadi va takrorlangan ovoz trafikining miqdorini kamaytiradilar. Ta'sirchan to'plam sozlamalari `GET /v1/sumeragi/collectors` orqali aniqlanadi; CLI ning `ops sumeragi telemetry` rasmga ko'rinishi joriy to'plamoqchi sanasini bildiradi.

Ko'zlovchilar tengdoshlari o'rnatilgan bloklarni sinxronlashtirishi mumkin, ammo ular taklif qilmaydilar, ovoz bermaydilar, ovozlar to'plamaydilar yoki qo'mita quorumida hisoblanmaydilar. Oʻz navbatida . O'rnatish uchun mahalliy so'rov qobiliyati, indekslash, kuzatish kerak bo'lganda kuzatuvchilardan foydalanish yoki ovoz berish tasdiqlovchilarining sonini ko'paytirmasdan mintaqaviy bloklarni takrorlash.

### Oʻzgarishlar va tiklanish koʻrinishi {#view-changes-and-recovery}

Ko'rinish Sumeragi ning muayyan taklif va vaqt rejasi bilan bir balandlikni yakunlashga urinishidir. Agar taklif, foydali yuklanish, ovoz berish yoki muvaffaqiyat qozongan bo'lsa, pacemaker balandlikni keyinchalik ko'rinishga ko'chira oladi. Ko'rinishni o'zgartirish belgilangan blokni qayta yozmaydi. Bu tasdiqlovchilar o'zlashtirilmagan balandlikni tugatishga harakat qilish usulini o'zgartirib, eng yuqori ma'lum quorumni olib boradi yoki dalillarni taqdim etadi, shunda tengdoshlar ziddiyatli bloklarni yakunlamaydi.

Faydali yukni tiklash yakuniylik qaroridan ajralib turadi. Tengdosh blokning to'liq fayzli yukini olishdan oldin quorum yoki commit sertifikatini olishi mumkin. Bunday holda tengdosh payli yukni qaytarish uchun ishonchli etkazib berish (RBC) yoki blok sinxronizatsiyasidan foydalanadi, uni reklama qilingan hashlarga qarab tekshiradi, va faqatgina keyin blokni jahon davlatiga va Kura ga qo'llaniladi.

### Konsens usuli {#consensus-modes}

Tanlangan rejim validator setining qanday shakllantirilishini va ishlatilishini nazorat qiladi. U [ `consensus_mode`](/uz/reference/genesis.md) orqali boshlanishda va `sumeragi.consensus_mode` orqali tenglashuv konfiguratsiyasi bilan e'lon qilinadi. Uni tarmoq bo'ylab holat sifatida ko'ring: validatorlar bir xil imzolangan genesis, topologiya, ishonchli tengdosh ma'lumotlar va samarali Sumeragi parametrlariga muhtoj.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

|Modus |Eng yaxshi mos keladi .|Tasdiqlovchi moslamasi |Operativ eʼtibor |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Ruxsat berilgan .|Xususiy, konsorsium va operator tomonidan boshqariladigan tarmoqlar |Valitatorlar ishga tushirilishi bilan kelishilgan ishonchli tengdosh topologiyasidan kelib chiqadi |Barcha tasdiqlovchilarni bir xil imzolangan genesis, ishonchli tengdoshlar, tengdosh kalitlari va Sumeragi parametrlarida saqlang. |
|NPOS | Umumiy yoki Nexus-tashkilot va ulush siyosati bilan tasdiqlangan yo'nalishdagi tarmoqlar |Validatorlar NPoS profilidan ko'ra tanlanadi, odatda davrlar bo'ylab va BLS kalitlari hamda egalik guvohnomasi talab qilinadi |O'yin o'yinlari fotosuratlarini, davr parametrlarini, validatorni PoPs va NPoS bosqich vaqtlarni tarmoq bo'ylab moslashtiring |

::: tip Ruxsat etilgan rejim

Validator ro'yxati aniq operatsion tanlov bo'lganda ruxsat etilgan rejimdan foydalaning. Bu o'z-o'zini uyushtirayotgan Iroha tarmoqlar uchun odatdagi boshlang'ich nuqta, chunki a'zolik o'zgarishlari bila turib boshqaruv yoki boshqaruvchi harakatlari hisoblanadi. Muhim operatsion qoida shundaki, har bir tasdiqlovchi genesis, ishonchli tengdoshlar, BLS Mulkdan dalolat beruvchi hujjatlar va Sumeragi parametrlari haqida bir xil nuqtai nazarga ega bo'lishi kerak.

:::

::: tip NPOS rejimi

O'rnatish profilida validator ishtirokining nomzod va ulush holatiga bog'liq bo'lishi kutilayotganda NPoS rejimidan foydalaning. Umumiy SORA Nexus o'rnatishlarda NPoSdan foydalanish, ularning hosil qilingan profillarida BLS validator identifikatsiyalari, egalik guvohnomasi, davr sozlamalari, va Sumeragi ishga tushirishda zarur bo'lgan NPoS parametrlari. Epoch o'zgarishlari aniqlangan balandlikda o'rnatilgan faol tasdiqlovchini almashtirishi mumkin, shuning uchun operatorlar konsensus sog'lig'ini ham, keyingi ro'yxatni ta'minlaydigan ulush yoki nomzodlik holatini ham kuzatishlari kerak.

:::

## Ko'p tarmoqli konsensus {#multilane-consensus}

Iroha ning ko'p yo'nalishdagi konsensus yo'li Nexus yo'nalishi va ma'lumotlar maydonining konfiguratsiyasi orqali amalga oshiriladi. U har bir yo'nalishda alohida konsensus instansiyasini boshlaydi. Sumeragi hali ham bitta buyurtma qilingan blok oqimini yakunlaydi; yo'llar ushbu oqim ichida qanday tranzaksiyalar yo'nalishini, rejalashtirilishini, hisobga olinishini va saqlashini tasvirlaydi.

Ish vaqti konfiguratsiyasi uchta yo'nalish holatiga ega:

- `lane_catalog`: har biri raqamli `LaneId`, alias, ma'lumotlar maydoni, ko'rinishi, saqlash profili, isbot sxemasi va metadatalar bilan konfiguratsiya qilingan yo'llar.
- `dataspace_catalog`: konfiguratsiya qilingan ma'lumotlar maydonlari, ularning har biri `DataSpaceId` raqamli va relay qo'mitasi o'lchami uchun ishlatiladigan xatolarga chidamlilik qiymati bilan belgilanadi.
- `routing_policy`: andoza yo'nalish / ma'lumotlar maydonining juftligi va hisoblar yoki ko'rsatma yo'llariga mos keladigan routing qoidalari.

Transaksiya navbatga kirganda, yo'nalish yo'riqchisi uni bir `RoutingDecision { lane_id, dataspace_id }`. Bir yo'nalish rejimida bu har doim yo'nalishda bo'ladi `0` va universal ma'lumotlar maydoni. Nexus rejimda, konfiguratsiyalangan router ma'lumotlar maydonida ko'rsatilgan qoidalarni qo'llaniladi, to'lov yo'nalishi, hisob qoidalari, aniq yo'nalish qoidalari; va oxir-oqibat andoza yo'l. Yechilgan yo'nalish va ma'lumot maydonlari ularning kataloglarida mavjud bo'lishi kerak, va yo'nalish hal qilingan ma'lumotlar maydonida bog'langan bo'lishi kerak; aks holda bitim navbatdan oldin rad etiladi.

Quyida ushbu yo'nalish qarori tranzaksiya hash bilan saqlanadi, shunda keyingi bosqichlarda uni yana tugallash shart emas. Keyinchalik loyiha qurilishi yo'nalishidagi metadatalardan ikkita usul bilan foydalanadi:

- U tranzaksiyalarni yo'nalish bo'yicha o'tkazib yuboradi, shuning uchun bitta yo'nalishda blok ustidan hukmronlik qilinmaydi, chunki uning tranzaksiyalari birinchi navbatda navbatda o'tkazildi.
- U yo'nalish uchun tranzaksiyalarni amalga oshirish birligi (TEU) chegaralarini qo'llaniladi. Yo'nalishning konfiguratsiyalangan quvvatidan oshadigan tranzaksiyalar kechiktirilgan va navbatdan o'tkaziladi, faqat yo'nalishda birinchi ortiqcha og'irlikdagi tranzaksiya hayot to'siqini oldini olish uchun qabul qilinishi mumkin.

Ishonchli etkazib berish paytida Sumeragi taklif qilingan foydali yukni yo'nalish va ma'lumotlar maydonlari bo'yicha yig'adi. Yo'lga qo'yilgan to'plamlarga tranzaksiyalar soni, eshittirish qismlari, foydali yuk bytlari va TEU kiradi. Qo'shilishdan so'ng, ushbu to'plamalar Sumeragi holati orqali ko'rsatilgan yo'nalishda va ma'lumot maydonida majburiyat snapshotlariga aylanadi. Agar blokda yo'nalish bo'yicha hisob-kitoblar to'plami mavjud bo'lsa, blokni qayta ishlash shuningdek blok sarlavhasini bog'laydigan yo'nalishlar bo'yicha kelishuv majburiyatlari va relay zarflarini yaratadi, commit sertifikatini, ma'lumotlar mavjudligi bo'yicha majburiyatlar hashini, kelishuv hujjatini va yo'nalishda foydali yuk miqdori.

## Ishonchli etkazib berish (RBC) {#reliable-broadcast-rbc}

Ishonchli etkazib berish (RBC) - bu Sumeragi ning foydali yukni tarqatish va tiklash yo'li. U validatorlar va kuzatuvchilarga taklifga tegishli bo'lgan blok korpusi yoki sertifikatni olishda yordam beradi, ayniqsa `BlockCreated` xabar, blok sinxronizatsiya yangilanishi yoki to'g'ridan-to'g'ri foydalanish yukini o'tkazish kechiktirilgan yoki yo'qolganda .

RBC foydali yuk darajasida ishlaydi. taklif qiluvchi blok balandligi, ko'rinishi va foydali yuk hash uchun RBC seansini e'lon qiladi, so'ngra commit topologiyasi bo'ylab foydali yuk qismlarini yuboradi. Tengdoshlar qismlarning qabul qilinishini kuzatib boradilar, tiklangan foydali yukni reklama qilingan hash bilan tasdiqlaydilar va `READY` va `DELIVER` signallarini almashishadi, agar etarlicha tasdiqlashchilar bir xil foydali yukni kuzatganida. Sessiyalar TTL, chunk, fanout, pending-stash va persistent-store cheklovlari bilan chegaralangan, shuning uchun tiklanish trafikining cheksiz o'sishi mumkin emas.

RBC alohida konsensus qarori emas va u commit sertifikatining o'rnini bosmaydi. Bir blok hali ham faqat tengdoshi haqiqiy commit sertifikatga ega bo'lganida va mahalliy ravishda moslashtirilgan foydali yuklarga ega bo'lsa yakunlanadi. RBC majburiy mavjudlik guvohnomasini va foydali yukni tiklashga hissa qo'shadi, o'z vaqtida amalga oshirish yutuqlari esa commit sertifikatidan tashqari mahalliy payloaddan kelib chiqadi. Agar sertifikat payloaddan oldin kelsa, tengdoshi payloadni RBC yoki blok sinxronizatsiyasi orqali qaytarib olishi va keyin commit qilishi mumkin.

Operatsiyaviy jihatdan RBC yo'qolgan foydali yukni va ma'lumotlar mavjudligini aniqlash uchun foydali:

- `iroha --output-format text ops sumeragi telemetry` yig'ilgan mavjudlik ovozlarini, joriy to'lovchilar sonini va RBC o'tkazilayotgan majlislarni ko'rsatadi.
- `GET /v1/sumeragi/rbc` va `GET /v1/sumeragi/rbc/sessions` Torii bo'yicha batafsil yig'ilgan va faol seans ma'lumotlarini, shu jumladan qismlarning taraqqiyotini, tayyorligini, yetkazib berish holatini va yo'nalish yoki ma'lumotlar maydonining orqaga tushishini ko'rsatadi; qarang [Torii oxirgi nuqtalari ](/uz/reference/torii-endpoints.md).
- Prometheus signallari `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` va har bir yo'nalish yoki har bir ma'lumotlar maydonida RBC orqa tomoni o'lchash ko'rsatkichlari tarmoq yo'qotishi, qismlarni tiklash va saqlash bosimini ajratishga yordam beradi; qarang [ Ishlab chiqarish va metrikalar](/uz/guide/advanced/metrics.md).

Kura saqlash layoti uchun kelib chiqadigan yo'nalish konfiguratsiyasidan foydalanadi. Har bir yo'nalishda `blocks/lane_000_core` va `merge_ledger/lane_000_core_merge.log` kabi deterministik saqlash nomlari mavjud; yo'nalishlar hayot davomiyligi o'zgarishlari ushbu segmentlarni global blok tartibini o'zgartirmasdan ta'minlashi, olib tashlashi yoki qayta belgilashi mumkin.
