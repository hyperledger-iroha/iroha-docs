---
translation_locale: uz
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Jamoat va Shaxsiy Blokcheynlar {#public-and-private-blockchains}

Iroha turli konfiguratsiyalarda ishlay oladi. O'z tarmog'ingizning administratori sifatida, qaysi ijrochi va ruxsat siyosati tranzaksiya qabul qilinishini belgilashini o'zingiz hal qilasiz.

Umumiy profillar shaxsiy ruxsatli tarmoqlar va ko'proq ochiq ochiq tarmoqlari hisoblanadi. Ikkalasi ham alohida tugun binarlari orqali emas, balki blokcheyn boshlang'ich holati va ijrochi siyosati orqali sozlanadi.

Quyida biz ushbu ikki foydalanish holatidagi asosiy farqlarni bayon qilamiz.

## Ruxsatlar {#permissions}

Ommaviy blokcheynda, aksariyat hisoblar bir xil ruxsatlar to'plamiga ega. Maxfiy blokcheynda, har bir hisob faqat o'zining aniq ruxsatlarini oladi.

::: info

Batafsil ma'lumot uchun [ruxsatlar bo‘yicha maxsus bo‘lim](/uz/blockchain/permissions.md) ga murojaat qiling.

:::

## tarmoq tengdoshlari {#peers}

Ommaviy blokcheynda, tarmoqdagi peerlarni qabul qilish zanjir siyosatining bir qismidir. Shaxsiy blokcheynda esa, ishga tushirishlar odatda ishonchli tarmoq peerlar to‘plamini konfiguratsiya va blokcheyn asosida belgilaydi.

::: info

Qo'shimcha ma'lumot uchun [tarmoq tengdoshlarini boshqarish](peer-management.md) ga murojaat qiling.

:::

## Hisob qaydlarini ro‘yxatdan o‘tkazish {#registering-accounts}

Qanday qilib o'rnatishga qaror qilishingizga qarab [blokcheyn dastlabki blok (`genesis.json`)](genesis.md), Hisob qaydnomasi roʻyxatdan oʻtkazish jarayoni ikki yoʻldan birida kechishi mumkin. Nima uchun shunday ekanligini tushunish uchun avvalo ruxsat haqida gaplashaylik.

Tanlangan ijrochi qaysi ruxsat tekshiruvlari qo‘llanilishini belgilaydi. Siz boshlang‘ich blockchainda odatiy [ruxsat tokenlari](/uz/blockchain/permissions.md) ruxsatini berishingiz mumkin, bu shaxsiy, administrator tomonidan boshqariladigan tarmoqni yoki yanada ochiq tarmoqni shakllantirishga imkon beradi. Bu ruxsatlar faol bo‘lganidan so‘ng, hisoblarni ro‘yxatdan o‘tkazish jarayoni boshqacha bo‘ladi.

Jamoat va shaxsiy ro‘yxatga olish siyosatlari odatda farq qiladi:

- Ommaviy ro‘yxatdan o‘tish siyosati har qanday mos keluvchi foydalanuvchidan hisob qaydnomalarini qabul qiladi[^1]. Foydalanuvchiga mos mijoz, qo‘llab-quvvatlanadigan algoritm uchun maxfiy kalit va siyosat tomonidan qabul qilingan ro‘yxatdan o‘tish so‘rovi kerak bo‘ladi.

- Shaxsiy ro‘yxatdan o‘tkazish siyosati bitta hisob qaydnomasiga yoki bitta aqlli shartnomaga ro‘yxatdan o‘tkazishni yuborishga ruxsat berishi mumkin. Maxsus siyosat ro‘yxatdan o‘tkazishni vaqt oynasi bilan cheklashi mumkin. Shuningdek, u yuboruvchidan token sarflashni talab qilishi mumkin, bu tokenning zaxirasi cheklangan, chunki hech qanday avtorizatsiya asoschisi undan ko‘proq chiqarish huquqiga ega emas.

- Standart xususiy tarmoq naqshida, mavjud hisob har bir yangi hisob uchun ro'yxatdan o'tishni yuboradi.

Standart ruxsat tekshiruvchilari odatiy xususiy blokcheyn ishlatish holatini qamrab oladi.

::: info

Jamoat va xususiy rejimlar bajaruvchi va blokcheyn boshlanish siyosati tanlovlaridir. Ikkalasi ham bir xil tugun binar faylidan foydalanadi. Ochiq tarmoqni ishga tushirishdan oldin tanlangan bajaruvchi va blokcheyn boshlanish ruxsatlarini ko‘rib chiqing.

:::

`Register<Account>` ko‘rsatmalari haqida batafsil ma’lumot olish uchun [ko'rsatmalar](/uz/blockchain/instructions.md#un-register) bo‘limiga murojaat qiling.

[^1]: `Register<Account>` kanonik, domen-siz `AccountId` uchun blokcheyn reyestri holatini yaratadi; domen yo'naltirish va aliaslar alohida boshqariladi.
