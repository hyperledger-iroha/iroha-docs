---
translation_locale: uz
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glosar <!-- omit in toc --> {#glossary}

Bu yerda Iroha bilan bog'liq bo'lgan barcha entitetlarning ta'riflarini topishingiz mumkin.

- [O'rtog'i](#peer)
- [Moddiyyat](#asset)
- [Bizansning xato tolerantligi (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha tarkibiy qismlar](#iroha-components)
  - [Sumeragi (Imperador)](#sumeragi-emperor)
  - [Torii (Gate) ](#torii-gate)
  - [Kura (Oxiraxona) ](#kura-warehouse)
  - [Kagami(O'qituvchi va namunachi va/yoki ko'zguvch) ](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle daraxti (hash daraxti) ](#merkle-tree-hash-tree)
  - [Aqlli shartnomalar](#smart-contracts)
  - [Ishtirokchilar](#triggers)
  - [](#versioning) versiyasi
  - [Hijiri (qarshilarning obro'si tizimi) ](#hijiri-peer-reputation-system)
- [Iroha Modullar](#iroha-modules)
- [Iroha Maxsus ko'rsatmalar (ISI)](#iroha-special-instructions-isi)
  - [Foydalanuvchi Iroha Maxsus ko'rsatmalar](#utility-iroha-special-instructions)
  - [Asosiy Iroha Maxsus yo'l-yo'riqlar](#core-iroha-special-instructions)
  - [Domenga oid Iroha Maxsus ko'rsatmalar](#domain-specific-iroha-special-instructions)
  - [Bo'yicha Iroha Maxsus ko'rsatma](#custom-iroha-special-instruction)
- [Iroha So'rovnoma](#iroha-query)
- [Ko'rinish o'zgarishi](#view-change)
- [Jahon holati ko'rinishi (WSV) ](#world-state-view-wsv)
- [Lider](#leader)

## Blockchain daftarlari {#blockchain-ledgers}

Blockchain daftarlari - moliyaviy yozuvlarni saqlash uchun blokchayn texnologiyasidan foydalangan raqamli yozuvlarni yuritish tizimidir. Bular narxlar, yangiliklar va tranzaksiya ma'lumotlari kabi moliyaviy yozuvlar uchun ishlatilgan qadimgi kitoblardan nomlanadi.

O'rta asrlar davrida katta kitoblar ommaviy ko'rish va aniqlikni tekshirish uchun ochiq edi. Bu fikr blockchainga asoslangan tizimlarda aks ettirilgan bo'lib, ular saqlangan ma'lumotlarning haqiqiyligini tekshiradi.

## Tengdoshlar {#peer}

Bir tengdosh Iroha nazarda tutadi Iroha boshqa protsessual instansiyaga Iroha jarayonlar va mijoz dasturlari bir-biri bilan bog'lanishi mumkin. Iroha tengdoshlar o'z resurslari va qobiliyatlari bo'yicha tengdir, muhim istisno bilan: tengdoshlaridan faqat biri genesis blokni ishga tushirish bosqichida boshqaradi Iroha tarmoq.

Boshqa blokchainlar nod yoki validator bilan bir xil kontseptsiyaga ishora qilishi mumkin.

Bir tengdosh o'z uy tizimida jarayon bo'lishi mumkin. U Docker konteyner va Kubernetes podda ham mavjud bo'ladi.

## Assetlar {#asset}

Blockchains kontekstida aktiv - bu blokchaindagi qimmatli ob'ektning tasviri.

Aktivlar to'g'risidagi qo'shimcha ma'lumot [da ](/uz/blockchain/assets.md) mavjud.

### O'zgaruvchan aktivlar {#fungible-assets}

Bunday aktivlar bir xil turdagi boshqa aktivlarga osonlikcha almashtiriladi, chunki ular o'zaro almashtirilishi mumkin.

Misol uchun, bir xil valyutaning barcha birliklari qiymati teng bo'lib, tovarlarni sotib olish uchun ishlatilishi mumkin. Odatda, fungible aktivlar banknota va tangalarning eskirishidan tashqari ko'rinishda bir xil.

### O'zgaruvchan bo'lmagan aktivlar {#non-fungible-assets}

O'zgaruvchan bo'lmagan aktivlar o'z xususiyatlari va kamchiliklari sababli noyob va qimmatli; ularning qiymati boshqa aktivlar bilan taqqoslanmaydi.

- Ressamning qiymati rassom, uning bo'yilgan davri va jamoatchilikning bunga qiziqishiga qarab farq qilishi mumkin.
- Bir ko'chada joylashgan ikkita uyda har xil ta'mirlash darajasi bo'lishi mumkin.
- Zargarlik ishlab chiqaruvchilari odatda turli xil dizaynlarni taklif qilishadi.

### Xizmatga olinishi mumkin bo'lgan aktivlar {#mintable-assets}

Agar bir xil turdagi ko'proq aktsiyalar chiqarilishi mumkin bo'lsa, aktiv ishlab chiqariladi.

### Ishlab chiqarilmaydigan aktivlar {#non-mintable-assets}

Agar aktivning boshlang'ich miqdori bir marta aniqlansa va o'zgarmasa, u iste'mol qilinmaydigan deb hisoblanadi.

[Genesis blokida ](/uz/guide/configure/genesis.md) ushbu ma'lumotlarni Iroha konfiguratsiyasi uchun belgilaydi.

## Bizansdagi xatolarga chidamlilik (BFT) {#byzantine-fault-tolerance-bft}

Ma'lum bir foiz zararli aktyorlarni o'z ichiga olgan tarmoq bilan to'g'ri ishlashi mumkin bo'lgan xususiyat Iroha o'zining tengdosh-tashkilot tarmog'ida 33% gacha zararli aktyorlar bilan ishlashga qodir.

## Iroha Komponentlar {#iroha-components}

Rust funktsiyasini o'z ichiga olgan Iroha modullari.

### Sumeragi (Imperator) {#sumeragi-emperor}

Iroha modul konsensus uchun javobgardir.

### Torii (Ochiq) {#torii-gate}

[ peer](#peer) uchun kelib tushgan so'rovlarni boshqarish mantiqasini o'z ichiga olgan modul. U kelib tushadigan yo'l-yo'riqlarni qabul qilish, qabul qilish va yo'naltirish uchun ishlatiladi, shuningdek HTTP so'rovlari, shuningdek, ishga tushirish vaqti konfiguratsiya yangilanishlari.

### Kura (Oxiraxona) {#kura-warehouse}

Kura diskdagi imzolangan bloklarni, blok hashlarini, balandlik indekslarini, tiklash bo'laklari va commit-roster metadatalarini saqlaydi. [World State View](#world-state-view-wsv) davlat fotosuratlari mavjud bo'lmaganida yoki mahalliy bloklar do'konining orqasida bo'lganda Kura bloklardan qayta quriladi. Ko'rish [Kura saqlash ](/uz/blockchain/world.md#kura-storage).

### Kagami(O'qituvchi va namunachi va/yoki ko'z o'rinchasi) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Odatda ishlatiladigan ma'lumotlar uchun generator. U kriptografik kalit juftliklarini, genesis bloklarini, hujjatlarni va boshqalar ishlab chiqarishi mumkin.

### Merkle daraxti (hash daraxi) {#merkle-tree-hash-tree}

Har bir blok balandligida holatni tasdiqlash va tekshirish uchun ishlatiladigan ma'lumotlar tuzilmasi. Iroha ning hozirgi amalga oshirilishi ikkilamchi daraxtdir. Ko'proq batafsillik uchun [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)-ga qarang.

### Aqlli shartnomalar {#smart-contracts}

Aqlli shartnomalar - bu blokchainga asoslangan dasturlar bo'lib, muayyan shart-sharoitlarga javob berganda ishlatiladi. Iroha da aqlli kontraktlar [core Iroha maxsus ko'rsatma](#core-iroha-special-instructions) yordamida amalga oshiriladi.

### Ishtirokchilar {#triggers}

Iroha maxsus yo'l-yo'riqlarini muayyan blok qo'yishi, vaqt (ba'zi ehtiyotkorliklar bilan) va boshqalar bo'yicha chaqirish imkonini beradigan hodisa turi. Ishtirokchilar haqida ko'proq ma'lumot [da](/uz/blockchain/triggers.md).

### Tarjima qilish {#versioning}

Har bir so'rov u tegishli bo'lgan API versiyasi bilan belgilab qo'yilgan. Bu Iroha mijoz / tengdosh dasturiy ta'minotining turli xil ikkilamchi versiyalarining kombinatsiyasini o'zaro ishlashga imkon beradi, bu esa Iroha tarmog'ida dasturni yangilashlarga imkon beradi.

### Hijiri (o'rtog'lar orasida obro'ni saqlaydigan tizim) {#hijiri-peer-reputation-system}

Iroha Bu aloqalarni ustuvorlashtirish imkonini beradi . [tengdoshlar](#peer) yaxshi yo'l-yo'riqlarga ega bo'lgan va zararli ta'sirlarni kamaytiruvchi [tengdoshlar](#peer).

## Iroha Modullar {#iroha-modules}

Iroha uchun o'zlashtirilgan funktsiyalarni taqdim etuvchi uchinchi tomonlar kengaytmalari.

## Iroha Maxsus ko'rsatmalar (ISI) {#iroha-special-instructions-isi}

Ma'lum kontraktlar kutubxonasi Iroha. Bularni ham savdo-sotiq orqali, ham ro'yxatdan o'tgan tadbir tinglovchilari orqali murojaat qilish mumkin. ISI [bu yerda](/uz/blockchain/instructions.md).

#### Foydalanuvchi Iroha Maxsus ko'rsatmalar {#utility-iroha-special-instructions}

Ushbu [isi](#iroha-special-instructions-isi) setida `If` kabi mantiqiy ko'rsatmalar, `Notify` kabi tegishli I/O va `Sequence` kabi kompozitsiyalar mavjud. Ular asosan [ning maxsus ko'rsatmalari sifatida ishlatiladi ](#custom-iroha-special-instruction).

### Asosiy Iroha Maxsus ko'rsatmalar {#core-iroha-special-instructions}

[Maxsus ko'rsatmalar](#iroha-special-instructions-isi) bilan ta'minlangan Iroha qo'llab-quvvatlash; shu jumladan, ayrim [domen bo'yicha](#domain-specific-iroha-special-instructions) va [foydalanish ko'rsatmalari](#utility-iroha-special-instructions).

### Viloyatga oid Iroha maxsus ko'rsatmalar {#domain-specific-iroha-special-instructions}

Hududga doir faoliyat bilan bog'liq ko'rsatmalar: aktivlar, hisobotlar, domenlar, tengdoshlarni boshqarish). Bular [ Jahon holati ko'rinishini ](#world-state-view-wsv) xavfsiz va xavfsiz tarzda o'zgartirish uchun zarur vositalarni ta'minlaydi.

### Oddiy Iroha Maxsus ko'rsatma {#custom-iroha-special-instruction}

O ' zbekiston Respublikasining [Iroha Modullar](#iroha-modules), mijozlar yoki uchinchi tomonlar tomonidan qurilishi mumkin. [Asosiy ko'rsatmalar](#core-iroha-special-instructions). Forking va o'zgartirish Iroha manba kodi tavsiya etilmaydi, chunki maxsus ko'rsatmalar bilan kelishilmagan [tengdoshlar](#peer) bo ' yicha Iroha ishga tushirish xatolar sifatida ko'rib chiqiladi, shuning uchun: [tengdoshlar](#peer) o'zgartirilgan instansiyani ishga tushirish ularning kirish huquqi bekor qilinadi.

## Iroha So'rov {#iroha-query}

Jahon holati ko'rinishini o'qish uchun iltimos ushbu ko'rinishni o'zgartirmasdan. [ so'rovlar haqida ko'proq ma'lumot olish uchun bu yerda ](/uz/blockchain/queries.md).

## Oʻzgarish koʻrinishi {#view-change}

Konsensusga erishishga urinish muvaffaqiyatsiz bo'lgan taqdirda o'tkaziladigan jarayon. Odatda bu yangi [Lider](#leader) tanlovi bilan bog'liq.

## Jahon holati ko'rinishi (WSV) {#world-state-view-wsv}

Hozirgi blokcheyn holatini xotira ichida ifodalash. WSV tarkibida `World`, qo'shilgan blok hashlari, tranzaksiya indekslari, konsensus topologiyasi va so'rovlarda ishlatiladigan ma'lumotlar indekslari. Bu faqat belgilangan bloklar orqali yangilanadi va qayta tiklanishi mumkin [Kura](#kura-warehouse). Koʻring [Dunyoga qarash](/uz/blockchain/world.md#world-state-view-wsv).

## Lider {#leader}

Bir iroha tarmog'ida tengdoshi tasodifiy tanlanadi va keyingi blokni shakllantirishning maxsus imtiyozi beriladi. Bu imtiyoz [ Byzant fayl-torelance ](#byzantine-fault-tolerance-bft) ga ega bo'lgan tarmoqlarda [ ko'rinish o'zgaruvchisi](#view-change) orqali bekor qilinishi mumkin.
