---
translation_locale: uz
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

Iroha-da tugun — boshqa Iroha jarayonlari va mijoz ilovalari ulana oladigan Iroha jarayonining nusxasi. Bitta kompyuter bir nechta Iroha tuguniga mezbonlik qilishi mumkin. Tugunlar resurslari va imkoniyatlari jihatidan teng. Muhim istisno shuki, Iroha tarmog‘ini dastlab ishga tushirish bosqichida genezis blokini faqat bitta tugun bajaradi.

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

Tarmoq ishtirokchilarining muayyan qismi zararli bo‘lsa ham tizimning to‘g‘ri ishlay olish xususiyati. Iroha tugunlararo tarmog‘ida zararli tugunlar ulushi 33% gacha bo‘lganda ishlay oladi.

## Iroha komponentlari {#iroha-components}

Iroha funksiyalarini o‘z ichiga olgan Rust modullari.

### Sumeragi (Imperator) {#sumeragi-emperor}

Konsensus uchun javob beradigan Iroha moduli.

### Torii (Darvoza) {#torii-gate}

[Tugun](#peer) uchun kiruvchi so‘rovlarni boshqarish mantiqini o‘z ichiga olgan modul. U kiruvchi ko‘rsatmalar va HTTP so‘rovlarini qabul qiladi hamda yo‘naltiradi, shuningdek bajarish muhiti sozlamalarining yangilanishlarini boshqaradi.

### Kura (Ombor) {#kura-warehouse}

Kura diskda imzolangan bloklar, blok xeshlari, balandlik indekslari, tiklash bo‘laklari va yakunlash tarkibi metama’lumotlarini saqlaydi. Holatning oniy tasviri bo‘lmasa yoki mahalliy bloklar omboridan ortda qolsa, [Global holat ko‘rinishi](#world-state-view-wsv) Kura bloklaridan qayta quriladi. [Kura saqlovi](/uz/blockchain/world.md#kura-storage) bo‘limiga qarang.

### Kagami (Ustoz, namuna yoki ko‘zgu) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Ko‘p ishlatiladigan ma’lumotlar generatori. U kriptografik kalit juftliklari, genezis bloklari, hujjatlar va boshqa artefaktlarni yaratishi mumkin.

### Merkle daraxti (xesh daraxti) {#merkle-tree-hash-tree}

Har bir blok balandligidagi holatni tasdiqlash va tekshirish uchun ishlatiladigan ma’lumotlar tuzilmasi. Iroha-ning joriy amalga oshirilishi ikkilik daraxtdan foydalanadi. Batafsil ma’lumot uchun [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)-ga qarang.

### Aqlli shartnomalar {#smart-contracts}

Aqlli shartnomalar — muayyan shartlar bajarilganda ishga tushadigan blokcheyn dasturlari. Iroha-da aqlli shartnomalar [asosiy Iroha maxsus ko‘rsatmalari](#core-iroha-special-instructions) yordamida amalga oshiriladi.

### Qo‘zg‘atuvchilar {#triggers}

Muayyan blok yakunlanganda, belgilangan vaqtda (ayrim cheklovlar bilan) yoki boshqa hodisada Iroha maxsus ko‘rsatmasini chaqirish imkonini beradigan mexanizm. Qo‘zg‘atuvchilar haqida [batafsil ma’lumot](/uz/blockchain/triggers.md).

### Versiyalash {#versioning}

Har bir so‘rov tegishli API versiyasi bilan belgilanadi. Shu tufayli Iroha mijoz va tugun dasturlarining turli bajariluvchi versiyalari o‘zaro ishlay oladi hamda Iroha tarmog‘idagi dasturiy ta’minotni bosqichma-bosqich yangilash mumkin bo‘ladi.

### Hijiri (tugunlar obro‘si tizimi) {#hijiri-peer-reputation-system}

Iroha obro‘ tizimi yaxshi tarixga ega [tugunlar](#peer) bilan aloqani ustuvorlashtirish va zararli [tugunlar](#peer) yetkazishi mumkin bo‘lgan ziyonni kamaytirish imkonini beradi.

## Iroha modullari {#iroha-modules}

Iroha-ga maxsus funksiyalar qo‘shadigan uchinchi tomon kengaytmalari.

## Iroha maxsus ko‘rsatmalari (ISI) {#iroha-special-instructions-isi}

Iroha bilan birga taqdim etiladigan aqlli shartnomalar kutubxonasi. Ularni tranzaksiyalar yoki ro‘yxatdan o‘tgan hodisa tinglovchilari orqali chaqirish mumkin. ISI haqida [batafsil ma’lumot](/uz/blockchain/instructions.md).

#### Yordamchi Iroha maxsus ko‘rsatmalari {#utility-iroha-special-instructions}

Bu [ISI](#iroha-special-instructions-isi) to‘plamiga `If` kabi mantiqiy ko‘rsatmalar, `Notify` kabi kiritish-chiqarish amallari va `Sequence` kabi kompozitsiyalar kiradi. Ular asosan [maxsus ko‘rsatmalarni](#custom-iroha-special-instruction) tuzishda ishlatiladi.

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

Iroha tarmog‘ida bitta tugun tasodifiy tanlanib, unga keyingi blokni tuzish vakolati beriladi. [Vizantiya xatolariga chidamlilikni](#byzantine-fault-tolerance-bft) ta’minlaydigan tarmoqlarda bu vakolat [ko‘rinishni almashtirish](#view-change) orqali bekor qilinishi mumkin.
