---
translation_locale: uz
translation_source: /guide/configure/modes.md
translation_source_hash: 141e640a596b419627c21dd4b22690f6ef97efe6ad2fc21ea5f806d0e262227f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Davlat va xususiy blokchainlar {#public-and-private-blockchains}

Iroha turli xil konfiguratsiyalarda ishlatilishi mumkin. O'zingizning tarmoqingiz boshqaruvchisi sifatida siz qaysi ijrochi va ruxsatnomalar siyosati tranzaksiya qabul qilinishini aniqlaydi.

Umumiy profillar xususiy ruxsatnomali tarmoqlar va ko'proq ochiq ommaviy tarmoqlardir. Ikkalasi ham alohida nod ikkilamchilari orqali emas, balki genesis holati va ijrochi siyosati orqali konfiguratsiya qilinadi.

Quyida ushbu ikkita foydalanish holatlarining asosiy farqlarini ko'rsatamiz.

## Ruxsatlar {#permissions}

Umumiy blokchainda aksariyat hisobvaraqlar bir xil ruxsatlarga ega bo'ladi. Xususiy blokchainda esa, agar tegishli ruxsat berilmagan bo'lsa, ularga berilgan vakolatdan tashqarida ko'pgina hisobvaraqlar hech narsa qila olmaydi deb hisoblanadi.

::: ma'lumot

Ko'proq ma'lumot olish uchun [ ruxsatnomalar to'g'risidagi ](/uz/blockchain/permissions.md) bo'limga murojaat qiling.

:::

## Tengdoshlar {#peers}

Umumiy blokcheynda tengdoshlarni qabul qilish zanjir siyosatining bir qismi hisoblanadi. Xususiy blokcheyn uchun ishga tushirishlar odatda konfiguratsiya va kelib chiqishi bo'yicha ishonchli tengdoshni belgilaydi.

::: ma'lumot

Ko'proq ma'lumot olish uchun [ tengdoshlar boshqaruvini](peer-management.md) ko'rib chiqing.

:::

## Hisobvaraqlarni ro'yxatga olish {#registering-accounts}

Qanday qilib o'rnatishga qaror qilishingizga qarab [genesis blok (`genesis.json`)](genesis.md), hisobni ro'yxatdan o'tkazish jarayoni ikkita yo'ldan biri bo'lishi mumkin. Nima sababini tushunish uchun, avval ruxsat haqida gaplashamiz.

Tanlangan ijrochi qaysi ruxsatnomalarni tekshirishni belgilaydi. Siz xususiy, boshqaruvchisi tomonidan boshqariladigan tarmoqni yoki ko'proq ochiq tarmoqni shakllantirish uchun andoza [ ruxsatnoma tokenlarini ](/uz/blockchain/permissions.md) ajratib berishingiz mumkin. Ushbu ruxsatnomalar faol bo'lganidan so'ng, hisoblarni ro'yxatdan o'tkazish jarayoni boshqacha.

Hisobvaraqlarni ro'yxatdan o'tkazish bo'yicha davlat va xususiy blokchainning quyidagi farqlari mavjud:

- Umumiy blokcheynda har kim hisob qaydnomasini ro'yxatdan o'tkaza oladi[^1]. Shunday qilib, nazariy jihatdan sizga kerak bo'lgan yagona narsa - bu mos mijoz, qo'llab-quvvatlanadigan algoritm uchun xususiy kalitni ishlab chiqarish usuli va ro'yxatga olishni qabul qiladigan ruxsat berish siyosati.

- Xususiy blokchainda hisob qaydnomasini tuzish uchun har qanday jarayon mavjud bo'lishi mumkin: ro'yxatga olish yo'l-yo'riqlari ma'lum bir hisob orqali yoki boshqa tafsilotlarni so'ragan aqlli shartnoma tomonidan taqdim etilishi mumkin. Xususiy blokcheynda yangi hisoblarni ro'yxatdan o'tkazish faqat ma'lum sanalarda mumkin bo'lishi yoki o'zgartirilmaydigan token bilan cheklanganligi mumkin.

- Oddiy xususiy blokcheynda, ya'ni hisoblarni ro'yxatdan o'tkazish uchun hech qanday noyob jarayonlar bo'lmagan blokcheynida boshqa hisob qayd etish uchun sizga hisob kerak.

Andoza ruxsatnomalarni tasdiqlovchilar odatiy xususiy blokcheyn foydalanish holatini qamrab oladi.

::: ma'lumot

Ochiq tarmoqni ishga tushirishdan oldin siz jo'natgan ijrochi va genesis ruxsatlarini ko'rib chiqish.

:::

[ yo'l-yo'riqlari](/uz/blockchain/instructions.md#un-register) bo'limini ko'rib chiqing `Register<Account>` qo'llanmasi haqida batafsil ma'lumot olish uchun.

[^1]: `Register<Account>` kanonik, domensiz `AccountId` uchun katta daftar holatini yaratadi; domen yo'nalishi va aliaslar alohida boshqariladi.
