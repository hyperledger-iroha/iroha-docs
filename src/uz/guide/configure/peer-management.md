---
translation_locale: uz
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
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

Qanday qilib ro'l berish kerakligini hal qilish mumkin? Agar foydalanuvchi tarmoqdagi tengdoshlarni uzoq muddat davomida saqlab qolish mas'uliyatiga ega bo'lgan administrator sifatida xizmat qilmoqchi bo'lsa, rollar berish ma'noli. Bir martalik ruxsat berish, agar tengdoshni ro'yxatdan o'tkazgan tomon umuman tengdoshlarni ro'yxatga olish uchun mas'ul bo'lmasa, foydali bo'ladi, ammo tarmoq ma'muriyati yangi tengdosh tuzishga vaqt sarflamasligi (yoki xohlamasligi) kerak.

::: ma'lumot

Dastlabki ijrochi `CanManagePeers` ruxsatnoma tokenidan ro'yxatdan o'tish va ro'yxatga olmaydigan tengdoshlar uchun foydalanadi.

:::

[ bo'limida ](/uz/blockchain/permissions.md) ruxsatnomalar va rollarni batafsil muhokama qilamiz.

#### 2. Tengdoshlar bilan muloqot qiling {#_2-set-up-a-peer}

Yangi tengdoshga ruxsatnoma berilganidan so'ng, u o'rnatilishi kerak.

Bogʻni qabul qilishdan oldin joriy tenglamchi konfiguratsiyasini soʻrang. Torii bu maqsad uchun nod parametrlari va qo'llanma oxirgi nuqtalarini ochadi. Peer bootstrap ushbu qiymatlarni avtomatik ravishda muzokara qilmaydi: operatorlar vaqtni, partiya o'lchamlarini va va boshqa konsens bilan bog'liq sozlamalar tarmoqga mos keladi.

Bu jarayonni soddalashtirish uchun siz tarmoq boshqaruvchisidan `config.toml` ning tahrirlangan versiyasini so'rashingiz mumkin, bu esa tengdoshlari xususiy kalitlari kabi imtiyozli ma'lumotlarni istisno qiladi.

#### 3. Ko'rsatmalarni taqdim etish {#_3-submit-the-instruction}

O'zingizning tengdoshingiz ish boshlaganidan so'ng, ro'yxatga o'tish uchun tengdoshlar ko'rsatmalarini taqdim etishingiz kerak. Tengdoshlar qo'l urish jarayonidan o'tadilar va tarmoq bilan suhbatlashishni boshlaydi.

::: manzil

Tengdoshlarni ro'yxatdan o'tkazish bo'yicha yo'l-yo'riqni taqdim etish yangi tengdoshlar jarayonini boshlashni anglatmaydi (va amalga oshirolmaydi).

:::

### Ro'yxatdan o'tmagan tengdoshlar {#unregistering-peers}

O'z tengdoshlariga ro'yxatdan o'tmaslik haqida nima deyish mumkin? xavfsizlik sabablaridan ko'ra, bu jarayon bir tomonlama. Tarmoq tengdoshlari olib tashlanmoqchi bo'lganligi to'g'risida kelishuvga erishadi, ammo tengdoshlarning o'zi hech kim bilan nima uchun gaplashayotganini bilmaydi.

Aksariyat holatlarda, agar siz tengdoshni ro'yxatdan chiqarishni istasangiz, bu bizanslik xato bo'lgani uchun shunday qilishingiz kerak. Ushbu tengdoshning "ro'zg'orlanishi" netdagi zararli aktyorning hayotini og'irlashtiradi.
