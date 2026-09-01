---
translation_locale: uz
translation_source: /blockchain/consensus.md
translation_source_hash: fdc9a35ac2e43acda076104063b5a364feb5060a70473b51cf016b8adb1306d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Konsensus {#consensus}

Tranzaksiyalar Sumeragi ularni blok sifatida taklif qilishidan oldin navbatga tushadi. Validatorlar taklifni mustaqil tekshiradi va bajaradi, so‘ng faqat o‘zlari qayta hosil qila oladigan holat o‘tishini imzolaydi. Talab etilgan validatorlar kvorumi natijaga rozi bo‘lgach va mos foydali yuk mavjud bo‘lgach, blok yakuniy ravishda yoziladi.

Iroha 3 tarmoqlarining barchasi imzolangan RS16 ma’lumotlar mavjudligi manifestlari va bo‘laklaridan, shuningdek sertifikatlangan tanani tiklash mexanizmidan foydalanadi. Ma’lumotlar mavjudligi — ixtiyoriy telemetriya emas, konsensus talabidir.

## Sumeragi {#sumeragi}

Sumeragi — Iroha-ning Vizantiya xatolariga chidamli konsensus mexanizmi. U tranzaksiyalarni navbatdan oladi, tasdiqlovchi tugunlarni bir xil tartiblangan blok bo‘yicha kelishtiradi va yetarli tasdiqlovchi ayni natijani qayta hosil qilib, yakunlash sertifikatini imzolagandan keyingina blokni yakunlaydi.

### Taklif va yakunlash jarayoni {#proposal-and-commit-path}

Sumeragi reyestrni har safar bitta blok balandligiga oldinga siljitadi. Har bir balandlikda bitta tasdiqlovchi joriy ko‘rinish uchun taklifchi vazifasini bajaradi. Taklifchi mos tranzaksiyalarni navbatdan oladi, nomzod blokni tuzadi va taklifni faol tasdiqlovchilar tarkibiga e’lon qiladi.

Sumeragi ruxsatli joylashtirishda ham, nominatsiyalangan ulush isboti (NPoS) asosidagi joylashtirishda ham bir xil konveyerdan foydalanadi:

1. Tasdiqlovchi navbatdagi tranzaksiyalar blokini taklif qiladi.
2. Tasdiqlovchilar tranzaksiyalarni bir xil global holatga nisbatan bajarib, taklifni tekshiradi.
3. Tasdiqlovchilar joriy balandlik va ko‘rinish uchun ovozlar hamda kvorum sertifikatlarini almashadi.
4. Yakunlash kvorumiga erishilgach, tugunlar blokni yakuniy yozadi va global holatini yangilaydi.

Tasdiqlovchilar faqat mahalliy ravishda qayta hosil qila oladigan ma’lumotni imzolaydi. Ovoz berishdan oldin tasdiqlovchi taklif kutilgan zanjir, balandlik va ko‘rinishga tegishli ekanini; tranzaksiya imzolari va chegaralari yaroqliligini; yo‘lak bo‘yicha yo‘naltirish va ijrochi tekshiruvi deterministikligini tekshiradi. Mahalliy natija farq qilsa, tasdiqlovchi taklifga ovoz bermay, uni rad etadi.

Ovozlar kichik, imzolangan konsensus xabarlaridir. Ular taklif qilingan blok, balandlik, ko‘rinish va tasdiqlovchi kimligini bog‘laydi. Birlashtirilgan imzolar tayyorlash va yakunlash kvorum sertifikatlarini hosil qiladi. Yakunlash sertifikati yetarli tasdiqlovchi ayni blok bo‘yicha bir xil natijaga erishganining ixcham dalilidir. Har bir tasdiqlovchi o‘z tayyorlash va yakunlash ovozlarini butun qo‘mitaga yuboradi; istalgan tasdiqlovchi kerakli tengdosh ovozlarini jamlab, hosil bo‘lgan sertifikatni tarqatishi mumkin.

### Kvorum va kuzatuvchilar {#quorum-and-observers}

Birinchi reliz protokoli 4 tadan 31 tagacha validatorli, aynan `3f + 1` o‘lchamdagi ovoz beruvchi qo‘mitalarnigina qabul qiladi. Demak, yaroqli o‘lchamlar 4, 7, 10 va shu tartibda 31 gacha davom etadi. `n = 3f + 1` bo‘lganda Vizantiya xatolari chegarasi `f`, qo‘mita kvorumi esa `2f + 1` bo‘ladi. Genezis yaratish va ishga tushirish tekshiruvi boshqa qo‘mita tuzilishini rad etadi.

Kuzatuvchi tugunlar yakunlangan bloklarni sinxronlashtirishi mumkin, ammo taklif bermaydi, ovoz bermaydi va yakunlash kvorumiga kiritilmaydi. Ishlab chiqarish muhitida mahalliy so‘rovlar, indekslash, kuzatuv yoki mintaqaviy blok nusxalari kerak bo‘lsa, kuzatuvchilardan foydalaning.

### Oʻzgarishlar va tiklanish koʻrinishi {#view-changes-and-recovery}

Ko‘rinish — Sumeragi-ning muayyan taklifchi va vaqt jadvali bilan bir balandlikni yakunlashga urinishi. Taklif, foydali yuk, ovozlar yoki olg‘a siljish kechiksa, ritm boshqaruvchisi balandlikni keyingi ko‘rinishga o‘tkazishi mumkin. Ko‘rinish almashishi yakunlangan blokni qayta yozmaydi; u validatorlarning hali yakunlanmagan balandlikni tugatish usulini o‘zgartiradi va tugunlar zid bloklarni yakunlamasligi uchun eng yuqori ma’lum kvorum yoki tayyorlash dalilini olib o‘tadi.

Foydali yukni tiklash yakuniylik qaroridan alohida. Tugun butun blok foydali yukini olishdan oldin kvorum yoki yakunlash sertifikatini olishi mumkin. Bunday holatda u imzolangan RS16 foydali yuk bo‘laklarini yoki sertifikatlangan butun tanani so‘raydi, tiklangan baytlarni e’lon qilingan xeshlarga nisbatan tekshiradi va shundan keyingina blokni global holat hamda Kura-ga qo‘llaydi.

### Konsensus rejimlari {#consensus-modes}

Tanlangan rejim validatorlar to‘plami qanday tuzilishi va ishlashini belgilaydi. U imzolangan genezisda [`consensus_mode`](/uz/reference/genesis.md) orqali e’lon qilinadi va har bir balandlik kontekstiga qat’iy biriktiriladi. Mahalliy `[sumeragi]` sozlamasi faqat tugun rolini hamda blok, navbat, bajarish muhiti, saqlash va kalit siyosatining chekli chegaralarini tanlaydi; u rejim yoki blok sur’atini almashtira olmaydi. Validatorlarda ayni imzolangan genezis, topologiya, ishonchli tugun ma’lumoti va amaldagi Sumeragi parametrlari bo‘lishi shart.

| Rejim | Eng mos muhit | Tasdiqlovchilar tarkibi | Ishlatishdagi asosiy talab |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Ruxsatli | Xususiy, konsorsium va operator boshqaradigan tarmoqlar | Tasdiqlovchilar joylashtirishda kelishilgan ishonchli tugunlar topologiyasidan olinadi | Barcha tasdiqlovchilarda bir xil imzolangan genezis, ishonchli tugunlar, tugun kalitlari va Sumeragi parametrlarini saqlang. |
| NPoS | Tasdiqlash nominatsiya va ulush siyosatiga amal qiladigan ommaviy yoki Nexus yo‘nalishidagi tarmoqlar | Tasdiqlovchilar NPoS profili bo‘yicha, odatda davrlar kesimida tanlanadi; ular uchun BLS kalitlari va egalik isbotlari (PoPs) talab etiladi | Ulush oniy tasvirlari, imzolangan davr va saylov kirishlari, tasdiqlovchilarning egalik isbotlari hamda o‘zgarmas blok sur’atini tarmoq bo‘ylab muvofiq saqlang. |

::: tip Ruxsat etilgan rejim

Validatorlar ro‘yxati aniq operatsion tanlov bo‘lsa, ruxsatli rejimdan foydalaning. A’zolik faqat boshqaruv yoki administratorning ongli amali bilan o‘zgartirilgani sababli, bu o‘zi joylashtiriladigan Iroha tarmoqlari uchun odatiy boshlang‘ich nuqtadir. Muhim qoida: har bir validatorda genezis, ishonchli tugunlar, BLS egalik isbotlari va Sumeragi parametrlari aynan bir xil bo‘lishi shart. Topologiyasi yoki imzolangan genezisi farq qiladigan hatto bitta tugun ham tarmoqning bloklarni yakunlashiga to‘sqinlik qilishi mumkin.

:::

::: tip NPOS rejimi

Joylashtirish profili tasdiqlovchilar ishtiroki nominatsiya va ulush holati bilan boshqarilishini nazarda tutsa, NPoS rejimidan foydalaning. Ommaviy SORA Nexus joylashtirishlari NPoS dan foydalanadi; ularning yaratilgan profillari ishga tushirish uchun zarur bo‘lgan BLS asosidagi tasdiqlovchi identifikatorlari, egalik isbotlari, davr sozlamalari va Sumeragi NPoS parametrlarini o‘z ichiga oladi. Davr almashishi belgilangan blok balandliklarida faol tasdiqlovchilar tarkibini almashtirishi mumkin, shu sababli operatorlar konsensus holatini ham, keyingi tarkibni shakllantiradigan ulush yoki nominatsiya holatini ham kuzatishi kerak.

:::

## Ko‘p yo‘lakli konsensus {#multilane-consensus}

Iroha-ning ko‘p yo‘lakli konsensusi Nexus yo‘lagi va ma’lumotlar makoni sozlamalari orqali ishlaydi; u har bir yo‘lak uchun alohida konsensus nusxasini ishga tushirmaydi. Sumeragi hanuz yagona tartiblangan blok oqimini yakunlaydi, yo‘laklar esa shu oqim ichida tranzaksiyalar qanday yo‘naltirilishi, rejalashtirilishi, hisobga olinishi va saqlanishini tavsiflaydi.

Bajarish muhiti sozlamasi yo‘lak holatining uchta qismini o‘z ichiga oladi:

- `nexus.lane_catalog`: har biriga raqamli `LaneId`, taxallus, ma’lumotlar makoni, ko‘rinuvchanlik, saqlash profili, isbot sxemasi va metama’lumot berilgan sozlangan yo‘laklar.
- `nexus.dataspace_catalog`: har biriga raqamli `DataSpaceId` va uzatish qo‘mitasi hajmini aniqlashda ishlatiladigan xatoga chidamlilik qiymati berilgan sozlangan ma’lumotlar makonlari.
- `nexus.routing_policy`: standart yo‘lak/ma’lumotlar makoni jufti va hisoblar yoki ko‘rsatma yo‘llariga moslasha oladigan tartibli yo‘naltirish qoidalari.

Tranzaksiya navbatga kirayotganda yo‘naltiruvchi unga bitta `RoutingDecision { lane_id, dataspace_id }` qiymatini tayinlaydi. Bir yo‘lakli rejimda bu har doim `0`-yo‘lak va universal ma’lumotlar makonidir. Nexus rejimida sozlangan yo‘naltiruvchi ma’lumotlar makoni bo‘yicha aniq qoidalar, hisob-kitob yo‘lagi, hisob qoidalari, ochiq yo‘lak qoidalari va nihoyat standart yo‘lakni qo‘llaydi. Aniqlangan yo‘lak va ma’lumotlar makoni o‘z kataloglarida mavjud, yo‘lak esa shu ma’lumotlar makoniga bog‘langan bo‘lishi shart; aks holda tranzaksiya navbatga kirishidan oldin rad etiladi.

Bu yo‘naltirish qarori tranzaksiya xeshi bilan saqlanadi, shuning uchun keyingi bosqichlarda uni qayta aniqlash shart emas. Keyin blok taklifini tuzish yo‘lak metama’lumotidan ikki usulda foydalanadi:

- Tranzaksiyalar yo‘laklar bo‘yicha navbatma-navbat olinadi, shuning uchun bir yo‘lak tranzaksiyalari oldinroq navbatga tushgani sababli blokni egallab olmaydi.
- Har bir yo‘lak uchun tranzaksiyani bajarish birligi (TEU) chegaralari qo‘llanadi. Yo‘lakning sozlangan sig‘imidan oshiradigan tranzaksiyalar kechiktirilib qayta navbatga qo‘yiladi; faqat yo‘lakdagi birinchi me’yordan og‘ir tranzaksiya cheksiz tiqilib qolishning oldini olish uchun qabul qilinishi mumkin.

Nomzod blokni tayyorlashda Sumeragi taklif qilingan foydali yukni yo‘lak va ma’lumotlar makoni bo‘yicha jamlaydi hamda yo‘lakka xos ma’lumotlar mavjudligi identifikatorlarini hosil qiladi. Qayd etiladigan jami qiymatlar tranzaksiyalar soni, bo‘laklar, foydali yuk baytlari va TEU ni o‘z ichiga oladi. Blok yakunlangach, bu qiymatlar autentifikatsiyalangan Sumeragi diagnostikasida ko‘rsatiladigan yo‘lak va ma’lumotlar makoni majburiyati oniy tasvirlariga aylanadi. Blokda yo‘lak hisob-kitobi tasdiqnomalari bo‘lsa, blokni qayta ishlash blok sarlavhasi, yakunlash sertifikati, ma’lumotlar mavjudligi majburiyati xeshi, hisob-kitob isboti va yo‘lak foydali yuki hajmini bog‘laydigan yo‘lak hisob-kitobi majburiyatlari hamda uzatish qadoqlarini ham yaratadi.

## Ma’lumotlarning mavjudligi va foydali yukni tiklash {#data-availability-and-payload-recovery}

Sumeragi v2 global foydali yuk mavjudligini imzolangan RS16 `PayloadManifest` va `PayloadChunk` xabarlari orqali ta’minlaydi. Yetakchi imzolangan manifestni butun qo‘mitaga yuboradi va dastlab deterministik bo‘laklarni A guruhiga tarqatadi. Tasdiqlovchi kanonik tanani qayta tiklab, manifest va bo‘lak xeshlarini tekshirib, tanani barqaror saqlab hamda deterministik blok tekshiruvini tugatgandan keyingina tayyorlash ovozini berishi mumkin. Tezkor yo‘l uzilsa, tiklash bo‘laklarni B guruhiga ham yetkazadi. Tugun tanani olishidan oldin yakuniylikni bilib qolgan holatda, sertifikatlangan tanani tiklash va bloklarni sinxronlash tengdoshlar orqali tiklash yo‘lini ta’minlaydi.

Ko‘p yo‘lakli bajarish har bir yo‘lak subyekti uchun deterministik foydali yuk egaligi xeshi va yo‘lakka mahalliy RBC nusxasi xeshini ham hosil qiladi. Bu identifikatorlar yo‘lak takliflari va sertifikatlarini umumiy foydali yuk kontekstiga bog‘laydi; ular alohida global konsensus seansi emas. Blok faqat tugunda yaroqli yakunlash sertifikati va unga mos foydali yuk mahalliy mavjud bo‘lgandagina yakunlanadi.

Alohida RBC so‘nggi nuqtasi o‘rniga autentifikatsiyalangan operator interfeyslaridan foydalaning:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` vakolatli balandlik, ko‘rinish, bosqich, sertifikatlar va ishlash holatini ko‘rsatadi.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` vakolatli bo‘lmagan navbat, konveyer, NPoS, yo‘lak va ma’lumotlar makoni diagnostikasini, jumladan yo‘lak foydali yuki egaligini ko‘rsatadi.
- `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` va `sumeragi_da_gate_satisfied_total` kabi Prometheus signallari yo‘qolgan blok tanasini tiklash, ma’lumotlar mavjudligi darvozalari va xabarlarni qayta ishlashni ajratib ko‘rsatadi; [Unumdorlik va ko‘rsatkichlar](/uz/guide/advanced/metrics.md) bo‘limiga qarang.

Kura saqlash tuzilishi uchun hosil qilingan yo‘lak sozlamasidan foydalanadi. Har bir yo‘lak `blocks/lane_000_core` va `merge_ledger/lane_000_core_merge.log` kabi deterministik saqlash nomlarini oladi; yo‘lak hayot davri o‘zgarishlari global blok tartibini o‘zgartirmasdan bu segmentlarni yaratishi, muomaladan chiqarishi yoki qayta nomlashi mumkin.
