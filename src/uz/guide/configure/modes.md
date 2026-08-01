---
translation_locale: uz
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Davlat va xususiy blokchainlar {#public-and-private-blockchains}

Iroha turli xil konfiguratsiyalarda ishlatilishi mumkin. O'zingizning tarmoqingiz boshqaruvchisi sifatida siz qaysi ijrochi va ruxsatnomalar siyosati tranzaksiya qabul qilinishini aniqlaydi.

Umumiy profillar xususiy ruxsatnomali tarmoqlar va ko'proq ochiq ommaviy tarmoqlardir. Ikkalasi ham alohida nod ikkilamchilari orqali emas, balki genesis holati va ijrochi siyosati orqali konfiguratsiya qilinadi.

Quyida ushbu ikkita foydalanish holatlarining asosiy farqlarini ko'rsatamiz.

## Ruxsatlar {#permissions}

Ommaviy blokchainda aksariyat hisobvaraqlar bir xil ruxsatlarga ega bo'ladi. Xususiy blokchainda har bir hisobvaraq faqat o'z aniq ruxsatlariga ega.

::: info

Ko'proq ma'lumot olish uchun [ ruxsatnomalar to'g'risidagi ](/uz/blockchain/permissions.md) bo'limga murojaat qiling.

:::

## Tengdoshlar {#peers}

Umumiy blokcheynda tengdoshlarni qabul qilish zanjir siyosatining bir qismi hisoblanadi. Xususiy blokcheyn uchun ishga tushirishlar odatda konfiguratsiya va kelib chiqishi bo'yicha ishonchli tengdoshni belgilaydi.

::: info

Ko'proq ma'lumot olish uchun [ tengdoshlar boshqaruvini](peer-management.md) ko'rib chiqing.

:::

## Hisobvaraqlarni ro'yxatga olish {#registering-accounts}

Qanday qilib o'rnatishga qaror qilishingizga qarab [genesis blok (`genesis.json`)](genesis.md), hisobni ro'yxatdan o'tkazish jarayoni ikkita yo'ldan biri bo'lishi mumkin. Nima sababini tushunish uchun, avval ruxsat haqida gaplashamiz.

Tanlangan ijrochi qaysi ruxsatnomalarni tekshirishni belgilaydi. Siz xususiy, boshqaruvchisi tomonidan boshqariladigan tarmoqni yoki ko'proq ochiq tarmoqni shakllantirish uchun andoza [ ruxsatnoma tokenlarini ](/uz/blockchain/permissions.md) ajratib berishingiz mumkin. Ushbu ruxsatnomalar faol bo'lganidan so'ng, hisoblarni ro'yxatdan o'tkazish jarayoni boshqacha.

Davlat va xususiy ro'yxatdan o'tish siyosati odatda farq qiladi:

- Umumiy ro'yxatdan o'tish siyosati har qanday qobiliyatli foydalanuvchidan hisob qaydnomasini qabul qiladi [^1]. Foydalanuvchiga mos mijoz, qo'llab-quvvatlanadigan algoritm uchun xususiy kalit va siyosat tomonidan qabul qilingan ro'yxatga olish so'rovi kerak.

- Xususiy ro'yxatdan o'tish siyosati bir hisob raqamiga yoki bitta aqlli shartnomaga ro'yxatga olishlarni taqdim etishga ruxsat berishi mumkin. G'ayratli siyosat ro'yxatni vaqt darvozasiga cheklashi mumkin. Shuningdek, u jo'natgan kishidan ta'minlangan tokeni sarflashni talab qilishi mumkin, chunki hech qanday hokimiyatda ko'proq mint qilish uchun ruxsat yo'q.

- Shaxsiy tarmoqlarning andoza namunasi bo'yicha mavjud hisobvaraq har bir yangi hisobvaraq uchun ro'yxatdan o'tadi.

Andoza ruxsatnomalarni tasdiqlovchilar odatiy xususiy blokcheyn foydalanish holatini qamrab oladi.

::: info

Umumiy va xususiy rejimlar ijrochi va genesis siyosati tanlovidir. Ikkalasi ham bir xil nod ikkilamchini ishlatadi. Ochiq tarmoqni ishga tushirishdan oldin tanlangan ijrochi va geniz huquqlarini ko'rib chiqing.

:::

[ yo'l-yo'riqlari](/uz/blockchain/instructions.md#un-register) bo'limini ko'rib chiqing `Register<Account>` qo'llanmasi haqida batafsil ma'lumot olish uchun.

[^1]: `Register<Account>` kanonik, domensiz `AccountId` uchun katta daftar holatini yaratadi; domen yo'nalishi va aliaslar alohida boshqariladi.
