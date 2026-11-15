---
translation_locale: uz
translation_source: /blockchain/consensus.md
translation_source_hash: ebdf564d607b96f7f186637044d80b2f1bb7c9fbe6080a061d27d02ec6f8cf62
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Konsensus {#consensus}

Tranzaksiyalar Sumeragi ularni blok sifatida taklif qilishidan oldin navbatga tushadi. Validatorlar taklifni mustaqil tekshiradi va bajaradi, so‘ng faqat o‘zlari qayta hosil qila oladigan holat o‘tishini imzolaydi. Talab etilgan validatorlar kvorumi natijaga rozi bo‘lgach va mos foydali yuk mavjud bo‘lgach, blok yakuniy ravishda yoziladi.

Iroha 3 tarmoqlarining barchasi imzolangan RS16 ma’lumotlar mavjudligi manifestlari va bo‘laklaridan, shuningdek sertifikatlangan tanani tiklash mexanizmidan foydalanadi. Ma’lumotlar mavjudligi — ixtiyoriy telemetriya emas, konsensus talabidir.

## Sumeragi {#sumeragi}

Sumeragi — Iroha-ning Vizantiya xatolariga chidamli konsensus mexanizmi. U tranzaksiyalarni navbatdan oladi, tasdiqlovchi tugunlarni bir xil tartiblangan blok bo‘yicha kelishtiradi va yetarli tasdiqlovchi ayni natijani qayta hosil qilib, yakunlash sertifikatini imzolagandan keyingina blokni yakunlaydi.

### Taklif va yakunlash jarayoni {#proposal-and-commit-path}

Sumeragi reyestrni bir vaqtning o‘zida bitta blok balandligiga oldinga suradi. Har bir balandlikda bitta validator joriy view uchun taklifchi bo‘ladi. U navbatdan mos tranzaksiyalarni oladi, nomzod blok yaratadi va taklifni faol validatorlar to‘plamiga e’lon qiladi. Ishsiz zanjirlar bo‘sh blok yaratmaydi.

Sumeragi ruxsatli joylashtirishda ham, nominatsiyalangan ulush isboti (NPoS) asosidagi joylashtirishda ham bir xil konveyerdan foydalanadi:

1. Tasdiqlovchi navbatdagi tranzaksiyalar blokini taklif qiladi.
2. Tasdiqlovchilar tranzaksiyalarni bir xil global holatga nisbatan bajarib, taklifni tekshiradi.
3. Tasdiqlovchilar joriy balandlik va ko‘rinish uchun ovozlar hamda kvorum sertifikatlarini almashadi.
4. Yakunlash kvorumiga erishilgach, tugunlar blokni yakuniy yozadi va global holatini yangilaydi.

Tasdiqlovchilar faqat mahalliy ravishda qayta hosil qila oladigan ma’lumotni imzolaydi. Ovoz berishdan oldin tasdiqlovchi taklif kutilgan zanjir, balandlik va ko‘rinishga tegishli ekanini; tranzaksiya imzolari va chegaralari yaroqliligini; yo‘lak bo‘yicha yo‘naltirish va ijrochi tekshiruvi deterministikligini tekshiradi. Mahalliy natija farq qilsa, tasdiqlovchi taklifga ovoz bermay, uni rad etadi.

Ovozlar kichik, imzolangan konsensus xabarlaridir. Ular taklif qilingan blok, balandlik, ko‘rinish va tasdiqlovchi kimligini bog‘laydi. Tekshirilgan imzolar tayyorlash va yakunlash kvorum sertifikatlarini hosil qiladi. Yakunlash sertifikati yetarli tasdiqlovchi ayni blok bo‘yicha bir xil natijaga erishganining barqaror dalilidir. Odatda A to‘plamidagi tasdiqlovchilar o‘z tayyorlash va yakunlash ovozlarini raundning proksi-quyrug‘iga yuboradi; u aynan kerakli miqdordagi teng ovozlarni jamlaydi va sertifikatni tarqatadi. Sertifikat kechiksa, B to‘plamidagi tasdiqlovchilar ham proksi-quyruqqa ovoz beradi; so‘nggi chora sifatida har bir tasdiqlovchi o‘z ovozini hammaga tarqatadi va istalgan tasdiqlovchi sertifikatni jamlashi mumkin.

### Kvorum va kuzatuvchilar {#quorum-and-observers}

Birinchi reliz protokoli faqat 4 dan 31 gacha validatordan iborat, aniq `3f + 1` ovoz beruvchi qo‘mitani qabul qiladi. Shu sababli to‘g‘ri sonlar 4, 7, 10 va shu tartibda 31 gacha bo‘ladi. `n = 3f + 1` uchun Vizantiya xatolari chegarasi `f`, commit kvorumi esa `2f + 1`. Genesis yaratish va ishga tushirish tekshiruvi boshqa qo‘mita tuzilmalarini rad etadi. Har bir PrepareQC, CommitQC va TimeoutCert aniq `q = n - f` teng validator ovozini saqlaydi; bundan ortiq imzolovchilar to‘plami rad etiladi.

Kuzatuvchi tugunlar yakunlangan bloklarni sinxronlashtirishi mumkin, ammo taklif bermaydi, ovoz bermaydi va yakunlash kvorumiga kiritilmaydi. Ishlab chiqarish muhitida mahalliy so‘rovlar, indekslash, kuzatuv yoki mintaqaviy blok nusxalari kerak bo‘lsa, kuzatuvchilardan foydalaning.

### Oʻzgarishlar va tiklanish koʻrinishi {#view-changes-and-recovery}

Ko‘rinish — Sumeragi-ning muayyan taklifchi va vaqt jadvali bilan bir balandlikni yakunlashga urinishi. Taklif, foydali yuk, ovozlar yoki olg‘a siljish kechiksa, ritm boshqaruvchisi balandlikni keyingi ko‘rinishga o‘tkazishi mumkin. Ko‘rinish almashishi yakunlangan blokni qayta yozmaydi; u validatorlarning hali yakunlanmagan balandlikni tugatish usulini o‘zgartiradi va tugunlar zid bloklarni yakunlamasligi uchun eng yuqori ma’lum kvorum yoki tayyorlash dalilini olib o‘tadi.

Foydali yukni tiklash yakuniylik qaroridan alohida. Tugun butun blok foydali yukini olishdan oldin kvorum yoki yakunlash sertifikatini olishi mumkin. Bunday holatda u imzolangan RS16 foydali yuk bo‘laklarini yoki sertifikatlangan butun tanani so‘raydi, tiklangan baytlarni e’lon qilingan xeshlarga nisbatan tekshiradi va shundan keyingina blokni global holat hamda Kura-ga qo‘llaydi.

### Konsensus rejimlari {#consensus-modes}

Tanlangan rejim validatorlar to‘plami qanday shakllanishi va ishlashini boshqaradi. U imzolangan genesisda [`consensus_mode`](/uz/reference/genesis.md) orqali e’lon qilinadi va har bir balandlik kontekstida o‘zgarmas saqlanadi. Mahalliy `[sumeragi]` sozlamasi tugun rolini, imzolash materiallari saqlanishini, xavfsizlik yozuvi yo‘llarini va hujjatlashtirilgan vaqt cheklovi hamda sinxronizatsiya o‘zgartirishlarini tanlaydi. Blok va tranzaksiya chegaralari, konsensus rejimi va sur’ati imzolangan genesis va commit qilingan holatdan keladi. Validatorlarga bir xil imzolangan genesis, topologiya, ishonchli tengdosh ma’lumotlari va amaldagi Sumeragi parametrlari kerak.

| Rejim | Eng mos muhit | Tasdiqlovchilar tarkibi | Ishlatishdagi asosiy talab |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Ruxsatli | Xususiy, konsorsium va operator boshqaradigan tarmoqlar | Tasdiqlovchilar joylashtirishda kelishilgan ishonchli tugunlar topologiyasidan olinadi | Barcha tasdiqlovchilarda bir xil imzolangan genezis, ishonchli tugunlar, tugun kalitlari va Sumeragi parametrlarini saqlang. |
| NPoS | Validatsiya nominatsiya va stake siyosatiga amal qiladigan ochiq yoki SORA Nexus uchun yo‘naltirilgan tarmoqlar | Validatorlar NPoS profili bilan, odatda epochlar bo‘yicha tanlanadi va ularga BLS kalitlari hamda egalik isbotlari kerak | Tarmoq bo‘ylab stake suratlari, imzolangan epoch va saylov kirishlari, validatorlarning PoPs egalik isbotlari va o‘zgarmas blok sur’atini muvofiq saqlang |

::: tip Ruxsat etilgan rejim

Validatorlar ro‘yxati aniq operatsion tanlov bo‘lsa, ruxsatli rejimdan foydalaning. A’zolik faqat boshqaruv yoki administratorning ongli amali bilan o‘zgartirilgani sababli, bu o‘zi joylashtiriladigan Iroha tarmoqlari uchun odatiy boshlang‘ich nuqtadir. Muhim qoida: har bir validatorda genezis, ishonchli tugunlar, BLS egalik isbotlari va Sumeragi parametrlari aynan bir xil bo‘lishi shart. Topologiyasi yoki imzolangan genezisi farq qiladigan hatto bitta tugun ham tarmoqning bloklarni yakunlashiga to‘sqinlik qilishi mumkin.

:::

::: tip NPOS rejimi

Joylashtirish profili tasdiqlovchilar ishtiroki nominatsiya va ulush holati bilan boshqarilishini nazarda tutsa, NPoS rejimidan foydalaning. Ommaviy SORA Nexus joylashtirishlari NPoS dan foydalanadi; ularning yaratilgan profillari ishga tushirish uchun zarur bo‘lgan BLS asosidagi tasdiqlovchi identifikatorlari, egalik isbotlari, davr sozlamalari va Sumeragi NPoS parametrlarini o‘z ichiga oladi. Davr almashishi belgilangan blok balandliklarida faol tasdiqlovchilar tarkibini almashtirishi mumkin, shu sababli operatorlar konsensus holatini ham, keyingi tarkibni shakllantiradigan ulush yoki nominatsiya holatini ham kuzatishi kerak.

:::

## Ko‘p yo‘lakli konsensus {#multilane-consensus}

Ma’lumotlar makonlari ma’lumot, vakolat, siyosat va ilovalar uchun muhitlarni belgilaydi. Ularning yo‘laklari tarqatish va sertifikatlash sig‘imini oshiradi. Kataloglar alohida: `nexus.dataspace_catalog` ma’lumotlar makonlarini, `nexus.lane_catalog` esa har biri bitta ma’lumotlar makoniga havola qiluvchi yo‘laklarni belgilaydi. Bir nechta yo‘lak bitta ma’lumotlar makonini bo‘lishishi mumkin.

Ochiq global bajarishda yo‘lak `0`ni global Sumeragi nusxasi tartiblaydi. Boshqa har bir faol yo‘lak avlodi o‘zining belgilangan qo‘mitasi va konsensus parametrlari bilan ayni Sumeragi yadrosining alohida nusxasini ishlatadi. Uning sertifikatlangan blokida qabul qilinishi commit qilingan global tayanchga nisbatan tekshirilgan, tartiblangan tranzaksiyalar to‘plami bo‘ladi. Yo‘lak sertifikatlanishi global State’ni o‘zgartirmaydi.

Global zanjir har bir yo‘lakdan keyingi uzluksiz sertifikatlangan bloklarni birlashtiradi. Hosil bo‘lgan global blokni bajarish bu tranzaksiyalarni kanonik tartibda qo‘llaydi va global CommitQC shu bajarishni yakuniy qiladi. Shuning uchun faqat yo‘lak sertifikati tranzaksiya global State’ni o‘zgartirganini da’vo qilish uchun yetarli emas. Tiklash va bajarish davomida yo‘lak identifikatori, avlodi, tayanchning yangiligi, manba saqlanishi va uzluksiz birlashtirish chegaralari tekshiriladi.

Commit qilingan `sumeragi_lane_policy` belgilangan yo‘laklar, marshrutlar, qo‘mitalar va avtomatik kengayishni boshqaradi. Faqat sozlama katalogi konsensus yo‘lagini faollashtirmaydi. Aniq ma’lumotlar makoni maqsadlari qabul qilingan mos yo‘lakka yechilishi kerak; mavjud bo‘lmagan xususiy marshrut universal ish sifatida bajarilmay, rad etiladi. Katalog va faollashtirish o‘tishlari davom etishi uchun boshqaruv qatlamining to‘liq to‘plamlari yo‘lak `0` orqali yo‘naltiriladi.

Mustaqil imzolangan ma’lumotlar makoni ildizi o‘z State’i va mahalliy yakuniyligiga ega alohida bajarish chegarasidir. Ma’lumotlar makoni katalog yozuvini ro‘yxatdan o‘tkazish bu ildizni yaratmaydi. Ildizlar orasidagi atomiklik alohida AMX protokolidan foydalanadi. Belgilangan nomzodda bu yo‘lning pul amallari va butun tarmoq bo‘yicha malaka tekshiruvi hali ochiq.

Belgilangan [yo‘lak amalga oshirilishi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs), [yo‘lak shartnomasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md), [mustaqil ma’lumotlar makoni shartnomasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) va [malaka holati](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md)ga qarang.

## Ma’lumotlarning mavjudligi va foydali yukni tiklash {#data-availability-and-payload-recovery}

Sumeragi V1 global foydali yuk mavjudligini imzolangan RS16 `PayloadManifest` va `PayloadChunk` xabarlari bilan ta’minlaydi. Yetakchi imzolangan manifestni va har bir imzolangan qatorni qo‘mitaning boshqa barcha a’zolariga hamda keyingi qo‘mitaga qo‘shilayotgan a’zolarga yuboradi. Validator faqat kanonik blok tanasini qayta tiklab, manifest va bo‘lak xeshlarini tekshirib, tanani mustahkam saqlab va deterministik validatsiyani tugatgach Prepare ovozini bera oladi. Qatorlari yetishmayotgan tengdosh ularni `PayloadRequest` orqali so‘raydi. Tengdosh blok tanasini olishdan oldin yakuniylikni bilib qolsa, sertifikatlangan tanani tiklash va blok sinxronizatsiyasi chegaralangan tiklash yo‘lini beradi.

Har bir yo‘lak nusxasi mavjudlik va sertifikatning o‘z autentifikatsiyalangan kontekstidan foydalanadi. Global birlashtirish tekshiruvlari uning sertifikatlangan to‘plami va asl foydali yukini kutilgan avlod va tayanchga bog‘laydi. Tengdosh global yakuniylikni faqat mos global foydali yuk va yaroqli CommitQC mahalliy mavjud bo‘lganda qo‘llaydi.

Alohida RBC so‘nggi nuqtasi o‘rniga autentifikatsiyalangan operator interfeyslaridan foydalaning:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` vakolatli balandlik, ko‘rinish, bosqich, sertifikatlar va ishlash holatini ko‘rsatadi.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` tranzaksiyalar navbatiga tushayotgan bosim, NPoS saylov holati va yo‘lak boshqaruvi manifesti holatini ko‘rsatadi; bu ma’lumotlar vakolatning ishonchli manbasi emas.
- Har bir instansiya uchun alohida bo‘lgan `sumeragi_fetch_requests_total` (`kind="body"` yetishmayotgan tanalar uchun, `kind="sync"` quvib yetish uchun), `sumeragi_view_changes_total`, `sumeragi_round_stage` va `sumeragi_dropped_total` kabi Prometheus seriyalari `lane` yorlig‘ini olib yuradi hamda yetishmayotgan tanani tiklash, ko‘rinish almashinuvlari va chegaralangan navbatdan tashlab yuborishlarni ajratib ko‘rsatadi; [Unumdorlik va ko‘rsatkichlar](/uz/guide/advanced/metrics.md) bo‘limiga qarang.

Yo‘lak blok omborlari birlashtirish va tiklash uchun kerakli sertifikatlangan to‘plamlar hamda manba yozuvlarini saqlaydi. Ularning hayotiy davri yo‘lakning commit qilingan avlodiga amal qiladi; ombor katalogi nomi yangi yo‘lak yoki bajarish ildiziga vakolat bermaydi.
