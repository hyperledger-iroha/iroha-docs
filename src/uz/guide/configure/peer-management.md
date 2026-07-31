---
translation_locale: uz
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tengdoshlarni boshqarish {#peer-management}

Agar siz tilga oid yo'l-yo'riqlardan birortasiga amal qilgan bo'lsangiz,
yaxshi faoliyat ko'rsatuvchi tarmoq bo'lib, odamlar unga qo'shilishni xohlashadi.

## Umumiy blokchaina {#public-blockchain}

Ochiq tarmoqda tengdoshlarni qabul qilish hali ham zanjir siyosati qarori hisoblanadi.
toʻgʻri dasturni ishga tushirib , u bilan bogʻlanishi mumkin Torii, lekin u faqat ishtirok etadi
tarmoq o'z tengdoshlari kimligini tan olganidan so'ng konsensusda.

## Xususiy blokchain {#private-blockchain}

Bank sharoitida hammaga o'z xohishi bilan ishtirok etishga ruxsat berish xavfsizlikdir
Xavfsizlik uchun, xususiy Iroha oʻrnatishlarda odatda tengdoshlari topologiyasini
ochiq kashfiyotlarga tayanishning o'rniga konfiguratsiya va genesis.

### Tengdoshlarni ro'yxatga olish {#registering-peers}

Tarmoqga tengdoshni qo'shish uchun u qo'lda ro'yxatdan o'tkazilishi kerak.
bu jarayonni yakunlash uchun ko'rib chiqilishi kerak bo'lgan qadamlar.

#### 1. Foydalanuvchiga ruxsatnomalar berish {#_1-grant-the-user-permissions}

Tengdoshlarni ro'yxatga oluvchi hisobda tegishli `Permission`.
Ushbu imtiyoz `Role` yoki to'g'ridan-to'g'ri ruxsat berish sifatida.

Qaysi rolni berish kerakligini qanday hal qilish mumkin?
foydalanuvchi sifatida xizmat qilish kerak, bir xil boshqaruvchisi, bu ularning
tarmoqda tengdoshlarni uzoq muddatli saqlash mas'uliyati.
Parvardigor ro'yxatdan o'tgan shaxs ro'yxatga olmagan taqdirda ruxsat berish foydali bo'ladi
umumiy ravishda tengdoshlarni ro'yxatdan o'tkazish uchun mas'ul, lekin tarmoq boshqaruvchisi
yangi tengdoshni o'rnatish uchun vaqt sarflash kerak emas (yoki xohlaydi).

::: info

Andoza ijrochi `CanManagePeers` uchun ruxsatnoma belgisi
ro'yxatdan o'tkazuvchi va ro'yxatga olmaydigan tengdoshlar.

:::

We ruxsatnomalar va rollarni batafsilroq muhokama qilish
[alohida bob](/uz/blockchain/permissions.md).

#### 2. Tengdoshlar orttiring {#_2-set-up-a-peer}

Yangi tengdoshga ruxsatnoma berilganidan so'ng, u o'rnatilishi kerak.

Bog'ni qabul qilishdan oldin joriy tenglamchi konfiguratsiyasini so'rang. Torii ko'rsatkichlar
Ushbu maqsad uchun nod parametrlari va imkoniyatlarning oxirgi nuqtalari.
ushbu qiymatlarni avtomatik ravishda muzokara qilmaydilar: operatorlar bu vaqtni tekshirishlari kerak,
partiya o'lchamlari va boshqa konsensusga bog'liq sozlamalar tarmoq bilan mos keladi.

Bu jarayonni soddalashtirish uchun siz tarmoq boshqaruvchisidan
tahrirlangan versiyasi `config.toml`, imtiyozli ma'lumotlarni istisno qiladi,
masalan, tengdoshlarning xususiy kalitlari.

#### 3. Ko'rsatmalarni taqdim etish {#_3-submit-the-instruction}

_So ' ng_ tengdoshingiz ishlamoqda, siz _ro'yxatga olish_
O'rtalar qo'l bosib olish jarayonidan o'tadi va boshlaydi
tarmoq bilan suhbatlashing.

::: tip

Tengdoshlarni ro'yxatdan o'tkazish bo'yicha yo'l-yo'riq berish **yo'q** (va mumkin emas)
tezkor a _yangi tengdosh jarayonlari_.

:::

### Ro'yxatdan o'tmagan tengdoshlar {#unregistering-peers}

O'zaro ro'yxatdan o'tmagan tengdoshlar haqida nima deyish mumkin?
bir tomonlama. Tarmoq tengdoshni olib tashlamoqchi bo'lgan konsensusga erishadi,
lekin tengdoshning o'zi nima uchun hech kim u bilan gaplashmayotganini ko'p bilmaydi.

Aksariyat hollarda, agar siz tengdoshingizni ro'yxatdan chiqarishni istasangiz, shunday qilishingiz kerak
Chunki bu Bizansning aybi. Bu tengdoshni "hoshtlash" hayotga olib keladi
ko'proq tarmoqdagi zararli aktyor haqida.
