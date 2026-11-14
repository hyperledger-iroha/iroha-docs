---
translation_locale: uz
translation_source: /reference/glossary.md
translation_source_hash: 4d3a8e3aa88291edbaac5b52039d2aad160d89fb83c085c21030a531c93258f4
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta+reviewed-first-release-source-amendment
---
# Atamalar lug‘ati <!-- omit in toc --> {#glossary}

Bu yerda Iroha bilan bog‘liq tushuncha va obyektlarning ta’riflari berilgan.

- [Tugun](#peer)
- [Aktiv](#asset)
- [Vizantiya xatolariga chidamlilik (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha komponentlari](#iroha-components)
  - [Sumeragi (Imperator)](#sumeragi-emperor)
  - [Torii (darvoza)](#torii-gate)
  - [Kura (Ombor)](#kura-warehouse)
  - [Kagami (Ustoz, namuna yoki ko‘zgu)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle daraxti (xesh daraxti)](#merkle-tree-hash-tree)
  - [Aqlli shartnomalar](#smart-contracts)
  - [Qo‘zg‘atuvchilar](#triggers)
  - [Versiyalash](#versioning)
  - [Hijiri (tugunlar obro‘si tizimi)](#hijiri-peer-reputation-system)
- [Iroha modullari](#iroha-modules)
- [Iroha maxsus ko‘rsatmalari (ISI)](#iroha-special-instructions-isi)
  - [Yordamchi Iroha maxsus ko‘rsatmalari](#utility-iroha-special-instructions)
  - [Asosiy Iroha maxsus ko‘rsatmalari](#core-iroha-special-instructions)
  - [Muayyan sohaga xos Iroha maxsus ko‘rsatmalari](#domain-specific-iroha-special-instructions)
  - [Maxsus Iroha ko‘rsatmasi](#custom-iroha-special-instruction)
- [Iroha so‘rovi](#iroha-query)
- [Ko‘rinishni almashtirish](#view-change)
- [Global holat ko‘rinishi (WSV)](#world-state-view-wsv)
- [Yetakchi](#leader)

## Blokcheyn reyestrlari {#blockchain-ledgers}

Blokcheyn reyestrlari — moliyaviy yozuvlarni saqlash uchun blokcheyn texnologiyasidan foydalanadigan raqamli hisob tizimlari. Ularning nomi narx, axborot va tranzaksiya ma’lumoti kabi moliyaviy qaydlar yuritilgan an’anaviy hisob daftarlaridan kelib chiqqan.

O‘rta asrlarda hisob daftarlari jamoatchilik ko‘rishi va yozuvlar to‘g‘riligini tekshirishi uchun ochiq bo‘lgan. Saqlangan ma’lumotning yaroqliligini tekshirish imkonini beradigan blokcheyn tizimlari shu g‘oyani davom ettiradi.

## Tugun {#peer}

Tarmoq tuguni — boshqa tugunlar va mijoz ilovalaridan ulanishlarni qabul qiladigan Iroha tugun jarayoni. Bitta mashinada sozlamalari va saqlash joylari alohida bo‘lgan bir nechta tugun ishlashi mumkin. Bo‘sh holatdan konsensusni boshlayotgan har bir tugun tarmoqning imzolangan genezisining haqiqiyligini tekshiradi va uni qo‘llaydi; haqiqiyligi tasdiqlangan holat nusxalaridan tiklangan tugunlar esa o‘sha holatdan ishni davom ettiradi.

Boshqa blokcheynlarda ayni tushuncha tugun yoki tasdiqlovchi deb atalishi mumkin.

Tugun mezbon tizimdagi jarayon bo‘lishi, Docker konteynerida yoki Kubernetes podida ishlashi mumkin.

## Aktiv {#asset}

Blokcheyn kontekstida aktiv — qimmatli obyektning blokcheyndagi ifodasidir.

Aktivlar haqida batafsil ma’lumot [Aktivlar](/uz/blockchain/assets.md) bo‘limida berilgan.

### O‘zaro almashtiriladigan aktivlar {#fungible-assets}

Bunday aktivlarning birliklari bir-biriga teng bo‘lgani uchun ularni ayni turdagi boshqa birliklarga erkin almashtirish mumkin.

Masalan, bir valyutaning barcha birliklari teng qiymatga ega va tovar xaridida ishlatilishi mumkin. Banknota yoki tanganing eskirishini hisobga olmaganda, o‘zaro almashtiriladigan aktivlar odatda bir xil ko‘rinadi.

### O‘zaro almashtirilmaydigan aktivlar {#non-fungible-assets}

O‘zaro almashtirilmaydigan aktivlar o‘ziga xos xususiyatlari va noyobligi sababli qimmatli; ularning qiymatini boshqa aktivniki bilan bevosita tenglashtirib bo‘lmaydi.

- Rasmning qiymati rassom, yaratilgan davr va jamoatchilik qiziqishiga qarab farq qilishi mumkin.
- Bir ko‘chadagi ikki uyning ta’mir holati turlicha bo‘lishi mumkin.
- Zargarlik buyumlari ishlab chiqaruvchilari odatda turli dizaynlarni taklif qiladi.

### Qo‘shimcha chiqariladigan aktivlar {#mintable-assets}

Bir xil turdagi qo‘shimcha birliklarni chiqarish mumkin bo‘lsa, aktiv qo‘shimcha chiqariladigan hisoblanadi.

### Qo‘shimcha chiqarilmaydigan aktivlar {#non-mintable-assets}

Aktivning boshlang‘ich miqdori bir marta belgilanib, keyin o‘zgarmasa, u qo‘shimcha chiqarilmaydigan hisoblanadi.

[Genezis bloki](/uz/guide/configure/genesis.md) bu ma’lumotni Iroha sozlamasida belgilaydi.

## Bizansdagi xatolarga chidamlilik (BFT) {#byzantine-fault-tolerance-bft}

Tarmoq ishtirokchilarining muayyan qismi zararli bo‘lsa ham tizimning to‘g‘ri ishlay olish xususiyati. Sumeragi qo‘mitasi aynan `3f + 1` ta validatordan iborat bo‘lib, `f` tagacha Vizantiya xatoli validatorga, ya’ni qo‘mitaning uchdan biridan kamiga bardosh beradi.

## Iroha komponentlari {#iroha-components}

Iroha funksiyalarini o‘z ichiga olgan Rust modullari.

### Sumeragi (Imperator) {#sumeragi-emperor}

Konsensus uchun javob beradigan Iroha moduli.

### Torii (Darvoza) {#torii-gate}

[Tengdosh](#peer)ga keluvchi so‘rovlarni qayta ishlash mantig‘i joylashgan modul. U keluvchi ko‘rsatmalar, HTTP so‘rovlari va operator sozlamasi tekshiruvini olish, qabul qilish va yo‘naltirish uchun ishlatiladi.

### Kura (Ombor) {#kura-warehouse}

Kura diskda imzolangan bloklar, blok xeshlari, balandlik indekslari, tiklash bo‘laklari va yakunlash tarkibi metama’lumotlarini saqlaydi. Holatning oniy tasviri bo‘lmasa yoki mahalliy bloklar omboridan ortda qolsa, [Global holat ko‘rinishi](#world-state-view-wsv) Kura bloklaridan qayta quriladi. [Kura saqlovi](/uz/blockchain/world.md#kura-storage) bo‘limiga qarang.

### Kagami (Ustoz, namuna yoki ko‘zgu) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Ko‘p ishlatiladigan ma’lumotlar generatori. U kriptografik kalit juftliklari, genezis bloklari, hujjatlar va boshqa artefaktlarni yaratishi mumkin.

### Merkle daraxti (xesh daraxti) {#merkle-tree-hash-tree}

Har bir blok balandligidagi holatni tasdiqlash va tekshirish uchun ishlatiladigan ma’lumotlar tuzilmasi. Iroha-ning joriy amalga oshirilishi ikkilik daraxtdan foydalanadi. Batafsil ma’lumot uchun [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)-ga qarang.

### Aqlli shartnomalar {#smart-contracts}

Aqlli shartnomalar — muayyan shartlar bajarilganda ishga tushadigan blokcheyn dasturlari. Iroha 3 da aqlli shartnomalar Kotodama tilida yoziladi va IVM baytkodiga (`.to`) kompilyatsiya qilinadi; shartnoma holatni mezbon chaqiruvlari orqali [Iroha maxsus ko‘rsatmalari](#core-iroha-special-instructions)ni berib o‘zgartiradi.

### Qo‘zg‘atuvchilar {#triggers}

Muayyan blok yakunlanganda, belgilangan vaqtda (ayrim cheklovlar bilan) yoki boshqa hodisada Iroha maxsus ko‘rsatmasini chaqirish imkonini beradigan mexanizm. Qo‘zg‘atuvchilar haqida [batafsil ma’lumot](/uz/blockchain/triggers.md).

### Versiyalash {#versioning}

Iroha 3 ning birinchi chiqarilishi blokni uzatish formatining bitta kanonik versiyasini qo‘llab-quvvatlaydi. `/v1/api/version` oxirgi nuqtasi genezis qo‘llanganidan keyin `SignedBlock::WIRE_VERSION` qiymatini qaytaradi, ungacha esa xizmat mavjud emasligi haqidagi javobni beradi. Bu qo‘llab-quvvatlanadigan uzatish formatini bildiradi; u turli protokol tuzilmalari o‘rtasidagi moslikni kelishmaydi va tarmoqni yangilashga ruxsat bermaydi.

### Hijiri (tugunlar obro‘si tizimi) {#hijiri-peer-reputation-system}

Iroha’ning tugunlar va hisoblar uchun obro‘ tizimi. Uning konsensusga tegishli parametrlari Hijiri komissiya siyosati va hisob xavfi yozuvlarini saqlaydi, boshqariladigan kuzatuvchi reyestrlari esa hisobning xavf ballini o‘zgartiradigan hisob attestatsiyalarini beradi.

## Iroha modullari {#iroha-modules}

Iroha-ga maxsus funksiyalar qo‘shadigan uchinchi tomon kengaytmalari.

## Iroha maxsus ko‘rsatmalari (ISI) {#iroha-special-instructions-isi}

Iroha bilan birga taqdim etiladigan aqlli shartnomalar kutubxonasi. Ularni tranzaksiyalar yoki ro‘yxatdan o‘tgan hodisa tinglovchilari orqali chaqirish mumkin. ISI haqida [batafsil ma’lumot](/uz/blockchain/instructions.md).

#### Yordamchi Iroha maxsus ko‘rsatmalari {#utility-iroha-special-instructions}

Bu [isi](#iroha-special-instructions-isi) to‘plamiga `Log`, `ExecuteTrigger`, `SetParameter` va `Upgrade` kabi domenga xos obyektni o‘zgartirmaydigan ko‘rsatmalar kiradi. Iroha 3 da `If`, `Notify` yoki `Sequence` ko‘rsatmalari yo‘q.

### Asosiy Iroha maxsus ko‘rsatmalari {#core-iroha-special-instructions}

Har bir Iroha joylashtirishi bilan birga beriladigan [maxsus ko‘rsatmalar](#iroha-special-instructions-isi). Ularga ayrim [muayyan sohaga xos](#domain-specific-iroha-special-instructions) va [yordamchi ko‘rsatmalar](#utility-iroha-special-instructions) kiradi.

### Muayyan sohaga xos Iroha maxsus ko‘rsatmalari {#domain-specific-iroha-special-instructions}

Muayyan obyekt sohasidagi amallarga — aktivlar, hisoblar, domenlar va tugunlarni boshqarishga — oid ko‘rsatmalar. Ular [global holat ko‘rinishini](#world-state-view-wsv) xavfsiz o‘zgartirish uchun zarur vositalarni taqdim etadi.

### Maxsus Iroha ko‘rsatmasi {#custom-iroha-special-instruction}

[Iroha modullari](#iroha-modules), mijozlar yoki uchinchi tomonlar taqdim etadigan ko‘rsatmalar faqat [asosiy ko‘rsatmalar](#core-iroha-special-instructions) yordamida tuzilishi mumkin. Iroha manba kodini tarmoqlantirib o‘zgartirish tavsiya etilmaydi: Iroha joylashtirishidagi [tugunlar](#peer) kelishmagan maxsus ko‘rsatmalar xato deb baholanadi va o‘zgartirilgan nusxani ishlatayotgan [tugunlar](#peer) tarmoqdan chiqariladi.

## Iroha so‘rovi {#iroha-query}

Global holat ko‘rinishini o‘zgartirmasdan undan ma’lumot o‘qish so‘rovi. So‘rovlar haqida [batafsil ma’lumot](/uz/blockchain/queries.md).

## Ko‘rinishni almashtirish {#view-change}

Konsensusga erishish urinishi muvaffaqiyatsiz bo‘lganda bajariladigan jarayon. Odatda u yangi [yetakchini](#leader) tanlashni o‘z ichiga oladi.

## Global holat ko‘rinishi (WSV) {#world-state-view-wsv}

Joriy blokcheyn holatining xotiradagi ifodasi. WSV tarkibiga `World`, yakunlangan blok xeshlari, tranzaksiya indekslari, konsensus topologiyasi va so‘rovlar ishlatadigan hosila indekslar kiradi. U faqat yakunlangan bloklar orqali yangilanadi va [Kura](#kura-warehouse) dan qayta tiklanishi mumkin. [Global holat ko‘rinishi](/uz/blockchain/world.md#world-state-view-wsv) bo‘limiga qarang.

## Yetakchi {#leader}

Har bir blok balandligi va ko‘rinish uchun Sumeragi blok taklif qiluvchini qo‘mita tarkibi, haqiqiyligi tasdiqlangan yetakchi tanlash urug‘i va tasdiqlab yozilgan o‘tkazib yuborilgan yetakchilar tarixidan deterministik tarzda aniqlaydi. [Ko‘rinish almashishi](#view-change) paytida navbat o‘sha [Vizantiya xatolariga chidamlilik](#byzantine-fault-tolerance-bft) qoidalari bo‘yicha qo‘mitaning keyingi munosib a’zosiga o‘tadi.
