---
translation_locale: uz
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tengdoshlarni boshqarish {#peer-management}

Agar siz tilga oid yo'l-yo'riqlarga amal qilgan bo'lsangiz, endi odamlar qo'shilmoqchi bo'lgan yaxshi faoliyat ko'rsatadigan tarmog'ingiz mavjud.

## Ommaviy blokchain {#public-blockchain}

Ochiq tarmoqda tengdoshlarni qabul qilish hali ham zanjir siyosati qarori hisoblanadi. Bir nod to'g'ri dasturiy ta'minotni ishga tushirib, Torii bilan bog'lanishi mumkin, ammo u faqat tarmoq o'z tengdoshini tan olganidan so'ng konsensusga qo'shilishi mumkin.

## Xususiy blokchain {#private-blockchain}

Bank sharoitida har kimning o'z xohishi bo'yicha qo'shilishi xavfsizlik xavfi hisoblanadi. Xavfsizlik uchun xususiy Iroha ishga tushirishlar odatda ochiq kashfiyotga tayanishning o'rniga tengdosh topologiyasini konfiguratsiya va paydo bo'lishda pin qiladi.

### Tengdoshlarni ro'yxatga olish {#registering-peers}

Tarmoqga tengdosh qo'shish uchun u qo'lda ro'yxatdan o'tkazilishi kerak. Keling, bu jarayonni yakunlash uchun qanday qadamlar qo'yilishi kerakligini muhokama qilaylik.

#### 1. Foydalanuvchiga ruxsatnomalar berish {#_1-grant-the-user-permissions}

Tengdoshlarni ro'yxatdan o'tkazadigan hisobda tegishli `Permission` bo'lishi kerak. Bu `Role` orqali yoki to'g'ridan-to'g'ri ruxsat berish sifatida beriladi.

Bir vaqtning o'zida tengdoshlarni boshqaradigan hisobda rol qo'shing. Tengdoshlarni boshqacha tarzda boshqarmaydigan hisobda bir martalik ro'yxatdan o'tish uchun to'g'ridan-to'g'ri ruxsat berishdan foydalaning.

::: info

Dastlabki ijrochi `CanManagePeers` ruxsatnoma belgisini ro'yxatdan o'tish va ro'yxatga olmagan tengdoshlar uchun ishlatadi.

:::

[ bo'limida ](/uz/blockchain/permissions.md) ruxsatnomalar va rollarni batafsil muhokama qilamiz.

#### 2. Tengdoshlar bilan muloqot qiling {#_2-set-up-a-peer}

Yangi tengdoshga ruxsatnoma berilganidan so'ng, u o'rnatilishi kerak.

Torii bu maqsadda nod parametrlari va qobiliyat oxirgi nuqtalarini ochib beradi. ushbu qiymatlarni avtomatik ravishda muzokara qilmaydi: operatorlar timeouts, partiya o'lchamlari va boshqa konsensusga bog'liq sozlamalarning tarmoq bilan mosligini tekshirishlari kerak.

Bu jarayonni soddalashtirish uchun siz tarmoq boshqaruvchisidan `config.toml` ning tahrirlangan versiyasini so'rashingiz mumkin, bu esa tengdoshlari xususiy kalitlari kabi imtiyozli ma'lumotlarni istisno qiladi.

#### 3. Ko'rsatmalarni taqdim etish {#_3-submit-the-instruction}

O'zingizning tengdoshingiz ish boshlaganidan so'ng, ro'yxatga o'tish uchun tengdoshlar ko'rsatmalarini taqdim etishingiz kerak. Tengdoshlar qo'l urish jarayonidan o'tadilar va tarmoq bilan suhbatlashishni boshlaydi.

::: tip

Tengdoshlarni ro'yxatdan o'tkazish bo'yicha yo'l-yo'riqni taqdim etish yangi tengdoshlar jarayonini boshlashni anglatmaydi (va amalga oshirolmaydi).

:::

### Ro'yxatdan o'tmagan tengdoshlar {#unregistering-peers}

O'z tengdoshlariga ro'yxatdan o'tmaslik haqida nima deyish mumkin? xavfsizlik sabablaridan ko'ra, bu jarayon bir tomonlama. Tarmoq tengdoshlari olib tashlanmoqchi bo'lganligi to'g'risida kelishuvga erishadi, ammo tengdoshlarning o'zi hech kim bilan nima uchun gaplashayotganini bilmaydi.

Aksariyat holatlarda, agar siz tengdoshni ro'yxatdan chiqarishni istasangiz, bu bizanslik xato bo'lgani uchun shunday qilishingiz kerak. Ushbu tengdoshning "ro'zg'orlanishi" netdagi zararli aktyorning hayotini og'irlashtiradi.
