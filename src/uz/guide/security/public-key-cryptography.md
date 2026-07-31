---
translation_locale: uz
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ochiq kalitning kriptografiyasi {#public-key-cryptography}

Jamoat kalitlari kriptografiyasi xavfsiz aloqa va ma'lumotlarni himoya qilish vositalarini ta'minlaydi, bu orqali onlayn tranzaksiyalar xavfsizligi, elektron pochta xabarlarining shafrlangan aloqasi va boshqalar kabi faoliyatni imkon beradi.

Jamoat kalitlari kriptografiyasida bir juft kriptografik kalit ishlatiladi _jamoatchilik_ kalit va a _xususiy_ Internet tarmoqlari orqali ma'lumotlarni uzatishning yuqori xavfsiz usuli yaratilishi.

Xususiy kalitdan ommaviy kalitni yaratish oson, ammo buning aksi qiyin, agar imkonsiz bo'lmasa ham. Bu narsalarni xavfsiz saqlaydi. Xususi kalitingizni xavf ostiga qo'ymagan holda ochiq kalitingizni erkin bo'lishingiz mumkin, bu esa xavfsiz qoladi.

## Kodlash va imzolar {#encryption-and-signatures}

Jamoat kalitining kriptografiyasi shaxslarga faqat tegishli xususiy kalitga ega bo'lgan maqsadli qabul qiluvchining tomonidan kashf etilishi mumkin bo'lgan shifrlangan xabarlar va ma'lumotlarni yuborishga imkon beradi. Boshqacha qilib aytganda, jamoat kalitini qulf sifatida ishlaydi, xususiy kalit esa o'ziga xos kalit sifatida xizmat qiladi.

Ushbu shifrlash jarayoni nafaqat o'ziga xos ma'lumotlarning maxfiyligi va maxfiyligini ta'minlaydi, balki jo'natuvchining haqiqiyligini ham tasdiqlaydi. _imzo_ Ushbu imzo elektron tasdiq belgi sifatida ishlaydi, bu esa jo'natuvchining kimligini va o'tkazilgan ma'lumotlarning haqiqiyligini tasdiqlaydi. _jamoatchilik_ Key tranzaksiyani boshlagan shaxs sizning _xususiy_ kalit.

## Mijoz tomonidagi kalitlar {#keys-on-the-client-side}

Har bir operatsiya hisobda bo'lgan organ tomonidan imzolangan bo'lishi kerak.
ushbu hokimiyat uchun nazoratchi materiallari maxfiy qolishi kerak, shuning uchun mijoz dasturi
xavfsiz saqlash va imzolash uchun mas'ul.

::: warning

Barcha mijozlar farq qiladi, lekin oddiy matn mijoz konfiguratsiyasi faqat mos
ishlab chiqarish integratsiyalari ishlab chiqish va nazorat qilingan sinov tarmoqlari uchun.
sirli boshqaruvchini, texnika bilan ta'minlangan kalitlarni saqlashni yoki boshqa audit qilingan imzolashni ishlatish
chegara.

:::

Registering yangi hisobda nazoratchi materiallari, masalan:
Ed25519 kalit juftligi, va ommaviy qismini tarmoqga taqdim etish.
ushbu hisobdan amalga oshiriladigan bitimlar moslashtirilgan xususiy kalit yoki
konfiguratsiya qilingan hisob qaydnomasi boshqaruvchisi siyosati.

Umumiy kalitning kriptografiyasi samarali ishlash uchun, yangi kalitni aniqlashingiz kerak bo'lganda kalitlardan qayta foydalanishdan qoching. _jamoatchilik_, bu shuni anglatadiki, agar hujumchi bir xil ommaviy kalitdan foydalanayotganini ko'rsasa, ular xususiy kalitlar ham bir xilligini biladilar.

Garchi _xususiy_ kalitlari parollardan biroz farq qiladigan tamoyillarga asoslanadi, maslahat*ularni imkon qadar tasodifiy qilish, hech qachon ularni kodlanmagan holda saqlash va hech qachon hech kim bilan bo'lishmaslik*dafo qiladi.
