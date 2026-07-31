---
translation_locale: uz
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glossar <!-- omit in toc --> {#glossary}

Bu yerda siz barcha belgilarni topishingiz mumkin Iroha- bog'liq entitetlar.

- [Tengdoshlar](#peer)
- [Assetlar](#asset)
- [Bizansning xatolarga chidamliligi (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Komponentlar](#iroha-components)
  - [Sumeragi (Imperator)](#sumeragi-emperor)
  - [Torii (Kegit)](#torii-gate)
  - [Kura (Oxiraxona)](#kura-warehouse)
  - [Kagami(O'qituvchi va namunachi va/yoki ko'rinish)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle daraxti (shash daraxti)](#merkle-tree-hash-tree)
  - [Aqlli shartnomalar](#smart-contracts)
  - [Ishtirokchilar](#triggers)
  - [Tarjima qilish](#versioning)
  - [Hijiri (o'rtog'lar bilan tanishuv tizimi)](#hijiri-peer-reputation-system)
- [Iroha Modullar](#iroha-modules)
- [Iroha Maxsus ko'rsatmalar (ISI)](#iroha-special-instructions-isi)
  - [Foydalanuvchi Iroha Maxsus ko'rsatmalar](#utility-iroha-special-instructions)
  - [Asosiy Iroha Maxsus ko'rsatmalar](#core-iroha-special-instructions)
  - [Domenga mos Iroha Maxsus ko'rsatmalar](#domain-specific-iroha-special-instructions)
  - [Oddiy Iroha Maxsus ko'rsatma](#custom-iroha-special-instruction)
- [Iroha Savol](#iroha-query)
- [Koʻrish oʻzgarishi](#view-change)
- [Dunyo davlatlari nuqtai nazari (WSV)](#world-state-view-wsv)
- [Lider](#leader)

## Blokchayn daftarlari {#blockchain-ledgers}

Blockchain daftarlari - bu blockchaindan foydalangan raqamli yozuvlarni saqlash tizimlari
Moliyaviy hisoblarni saqlash uchun texnologiya.
narxlar, yangiliklar va
Transaksiya ma'lumotlari.

O'rta asrlarda katta kitoblar ommaviy ko'rish uchun ochilgan va
to'g'rilikni tekshirish. Bu fikr blokchaina asoslangan
saqlangan ma'lumotlarning haqiqiyligini tekshirishga qodir bo'lgan tizimlar.

## Tengdoshlar {#peer}

Bir tengdosh Iroha nazarda tutadi Iroha boshqa protsessual instansiyaga Iroha jarayonlar
va mijoz ilovalari ulanish mumkin.
Bir mashinada bir nechta mashinalar mavjud Iroha tengdoshlar.
Tengdoshlar o'z resurslari va qobiliyatlariga nisbatan teng,
Muhim istisno bilan: tengdoshlari faqat bittasi uchraydi
boshlang'ich bosqichida genesis blok Iroha tarmoq.

Boshqa blokchainlar nod yoki validator bilan bir xil kontseptsiyaga ishora qilishi mumkin.

Tengdosh o'z uy tizimida jarayon bo'lishi mumkin.
Shuningdek, u Docker konteyner va Kubernetes kapsulasi.

## Assetlar {#asset}

Blockchains kontekstida aktiv qimmatli
blokchayndagi ob'ekt.

Aktivlar to'g'risida qo'shimcha ma'lumotlar mavjud
[bu yerda](/uz/blockchain/assets.md).

### O'zgaruvchan aktivlar {#fungible-assets}

Bunday aktivlarni o'sha turdagi boshqa aktivlarga osonlikcha almashtirish mumkin, chunki
ular o'zaro almashinuvchan.

Misol uchun, bir xil valyutaning barcha birliklari qiymati teng va
O'z navbatida, fungible aktivlar tovarlarni sotib olish uchun ishlatiladi.
ko'rinishidan tashqari, pul va tangalarning eskirishi.

### O'zgaruvchan bo'lmagan aktivlar {#non-fungible-assets}

O'zgaruvchan bo'lmagan aktivlar o'z xususiyatlari tufayli noyob va qimmatli
xususiyatlari va kamchiliklari; ularning qiymati boshqa aktivlar bilan taqqoslanmaydi.

- Ressomning qiymati rassom, uning davridan kelib chiqqan holda farq qilishi mumkin
  bo'yilgan va jamoatchilikning bunga qiziqishi.
- Bir ko'chada joylashgan ikkita uyda turli darajada ta'mirlanish mumkin.
- Zargarlik ishlab chiqaruvchilari odatda turli xil dizaynlarni taklif qilishadi.

### Xizmatga olinadigan aktivlar {#mintable-assets}

Agar bir xil turdagi ko'proq aktsiyalar chiqarilishi mumkin bo'lsa, aktiv ishlab chiqariladi.

### O'zgartirilmaydigan aktivlar {#non-mintable-assets}

Agar aktivning boshlang'ich miqdori bir marta aniqlansa va o'zgarmasa, u
yo'qligi mumkin deb hisoblanadi.

O ' zbekiston Respublikasi [Ibtido bloklari](/uz/guide/configure/genesis.md) ushbu ma'lumotni
ko'rsatilgan Iroha konfiguratsiya.

## Bizansning xatolarga chidamliligi (BFT) {#byzantine-fault-tolerance-bft}

O'z ichiga o'rnatilgan tarmoq bilan to'g'ri ishlashi mumkin bo'lgan xususiyat
zararli aktyorlarning muayyan foizi. Iroha ishlashi mumkin
o'z tengdoshlar tarmog'ida 33% gacha zararli aktyorlar bilan.

## Iroha Komponentlar {#iroha-components}

Rust tarkibidagi modullar Iroha funktsionalligi.

### Sumeragi (Imperator) {#sumeragi-emperor}

O ' zbekiston Respublikasi Iroha konsensus uchun mas'ul modul.

### Torii (Kegit) {#torii-gate}

Modul kelib tushgan so'rovni boshqarish mantiqiy [tengdoshlar](#peer). U
kelib tushgan yo'l-yo'riqlarni qabul qilish, qabul qilish va yo'naltirish; HTTP savollar, shuningdek
ishga tushirish vaqti konfiguratsiyasini yangilash sifatida.

### Kura (Oxiraxona) {#kura-warehouse}

Barqaror blok saqlash. Kura do'konlar imzolangan bloklar, blok hashlari, balandlik
indekslar, tiklash bo'yiga va diskdagi commit-roster metadata.
[Dunyoga qarash](#world-state-view-wsv) qayta qurilgan Kura bloklar a
davlat fotosuratlari mavjud emas yoki mahalliy blok do'konining orqasida.
[Kura saqlash](/uz/blockchain/world.md#kura-storage).

### Kagami(O'qituvchi va namunachi va/yoki ko'rinish) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Odatda ishlatiladigan ma'lumotlar uchun generator.
genesis bloklari, hujjatlar va boshqalar.

### Merkle daraxti (shash daraxti) {#merkle-tree-hash-tree}

Har bir blokdagi holatni tasdiqlash va tekshirish uchun ishlatiladigan ma'lumotlar tuzilmasi
balandligi. Iroha Hozirgi joriy qilish ikkilamchi daraxt.
[Vikipediya](https://en.wikipedia.org/wiki/Merkle_tree) ko'proq ma'lumot olish uchun.

### Aqlli shartnomalar {#smart-contracts}

Aqlli shartnomalar - bu blokchainaga asoslangan dasturlar boʻlib, ular muayyan setda ishlatiladi
talablari bajarilgan. Iroha aqlli shartnomalar
[yulduz Iroha maxsus ko'rsatmalar](#core-iroha-special-instructions).

### Ishtirokchilar {#triggers}

O ' zgarishi Iroha maxsus ta'lim
blok qo'yish, vaqt (ba'zi ogohlantirishlar bilan) va boshqalar
[bu yerda](/uz/blockchain/triggers.md).

### Tarjima qilish {#versioning}

Har bir so'rov quyidagi belgilar bilan belgilangani API to'plamga tegishli bo'lgan versiyasi.
turli xil ikkilik versiyalarining kombinatsiyasiga imkon beradi Iroha mijoz/qarshi
dasturiy ta'minotni o'zaro ishlash uchun, bu esa o'z navbatida
Iroha tarmoq.

### Hijiri (o'rtog'lar bilan tanishuv tizimi) {#hijiri-peer-reputation-system}

Iroha Bu aloqalarni birinchi o'ringa qo ' yish imkonini beradi . [tengdoshlar](#peer)
yaxshi yo'nalishlarga ega bo'lgan va zararni kamaytiradigan
yovuzlik [tengdoshlar](#peer).

## Iroha Modullar {#iroha-modules}

uchinchi tomonlar kengaytmalari Iroha maxsus funktsiyalarni ta'minlaydi.

## Iroha Maxsus ko'rsatmalar (ISI) {#iroha-special-instructions-isi}

Ma'lum kontraktlar kutubxonasi Iroha. Bular orqali ilova qilinishi mumkin
Transaksiyalar yoki ro'yxatdan o'tgan tadbir tinglovchilari. ISI
[bu yerda](/uz/blockchain/instructions.md).

#### Foydalanuvchi Iroha Maxsus ko'rsatmalar {#utility-iroha-special-instructions}

Ushbu set [boshqa](#iroha-special-instructions-isi) mantiqiy
quyidagi koʻrsatmalar `If`, I/O bilan bog'liq `Notify` va kompozitsiyalar
`Sequence`. Ular asosan
[maxsus ko'rsatmalar](#custom-iroha-special-instruction).

### Asosiy Iroha Maxsus ko'rsatmalar {#core-iroha-special-instructions}

[Maxsus ko'rsatmalar](#iroha-special-instructions-isi) har bir
Iroha Bulardan ba'zilari
[domenga oid](#domain-specific-iroha-special-instructions) va
[foydalanish ko'rsatmalari](#utility-iroha-special-instructions).

### Domenga mos Iroha Maxsus ko'rsatmalar {#domain-specific-iroha-special-instructions}

Domaga oid faoliyat bilan bog'liq ko'rsatmalar: aktivlar, hisob-kitoblar,
Bular o'zaro hamkorlikni rivojlantirish uchun zarur vositalarni taqdim etadi.
Oʻzgarishlar [Dunyoga qarash](#world-state-view-wsv) Xavfsiz va
xavfsiz tarzda.

### Oddiy Iroha Maxsus ko'rsatma {#custom-iroha-special-instruction}

Ushbu ko'rsatma [Iroha Modullar](#iroha-modules), mijozlar yoki uchinchi
partiyalar. Bular faqat
[Asosiy ko'rsatmalar](#core-iroha-special-instructions). Forking va
tahririda Iroha manba kodi tavsiya etilmaydi, maxsus ko'rsatmalar sifatida
bilan kelishilmagan [tengdoshlar](#peer) bir Iroha ishga tushirilish xatolar sifatida ko'rib chiqiladi,
shunday qilib [tengdoshlar](#peer) o'zgartirilgan instansiyani ishga tushirish ularning kirish huquqini bekor qiladi.

## Iroha Savol {#iroha-query}

Jahon holati ko'rinishini o'qish uchun iltimos, ushbu ko'rinishni o'zgartirmasdan.
savollar [bu yerda](/uz/blockchain/queries.md).

## Koʻrish oʻzgarishi {#view-change}

Konsensusga erishish muvaffaqiyatsiz bo'lgan taqdirda amalga oshiriladigan jarayon.
Odatda bu yangi prezidentni saylashni oʻz ichiga oladi . [Lider](#leader).

## Dunyo davlatlari nuqtai nazari (WSV) {#world-state-view-wsv}

Hozirgi blokchainning xotira holati. WSV tarkibida
ko'rsatilgan `World`, qo'shilgan blok hashlari, tranzaksiya indekslari, konsensus topologiyasi,
va so'rovlarda ishlatiladigan chizilgan indekslar.
bloklar va qayta tiklanishi mumkin [Kura](#kura-warehouse). Koʻring
[Dunyoga qarash](/uz/blockchain/world.md#world-state-view-wsv).

## Lider {#leader}

Iroha tarmog'ida tengdoshlar tasodifiy tanlanadi va maxsus
Keyingi blokni tashkil etish huquqi.
amalga oshiruvchi tarmoqlar
[Bizansning xatolar to'lovlari](#byzantine-fault-tolerance-bft) orqali
[koʻrinish oʻzgarishi](#view-change).
