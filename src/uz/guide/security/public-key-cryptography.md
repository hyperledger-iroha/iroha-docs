---
translation_locale: uz
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Jamoat kalitlari kriptografiyasi {#public-key-cryptography}

Ommaviy kalitning kriptografiyasi xavfsiz aloqa va ma'lumotlarni himoya qilish vositalarini ta'minlaydi, bu orqali onlayn tranzaksiyalar xavfsizligi, shifrlangan elektron pochta xabarlari va boshqalar kabi faoliyatni imkon beradi.

Ommaviy kalit kriptografiyasida onlayn tarmoqlar orqali ma'lumotlarni uzatishning juda xavfsiz usuli yaratish uchun bir juft kriptografik kalit - jamoatchilik kalit va xususiy kalit ishlatiladi.

Xususiy kalitdan ommaviy kalitni yaratish oson, ammo buning aksi qiyin, agar imkonsiz bo'lmasa ham. Bu narsalarni xavfsiz saqlaydi. Xususi kalitingizni xavf ostiga qo'ymagan holda ochiq kalitingizni erkin bo'lishingiz mumkin, bu esa xavfsiz qoladi.

## Kodlash va imzolar {#encryption-and-signatures}

Ommaviy kalitning kriptografiyasi shaxslarga faqat tegishli xususiy kalitga ega bo'lgan maqsadli qabul qiluvchisi tomonidan chifrlanishi mumkin bo'lgan shifrlangan xabarlar va ma'lumotlarni yuborishga imkon beradi. Boshqa so'zlar bilan aytganda, ommaviy kalit qulf sifatida ishlaydi va xususiy kalit kodlangan ma'lumotlarni ochadigan haqiqiy noyob kalit sifatida xizmat qiladi.

Ushbu shifrlash jarayoni nafaqat hissiy ma'lumotlarning maxfiyligi va maxfiyligini ta'minlaydi, balki jo'natuvchining haqiqiyligini ham tasdiqlaydi. Jo'natuvchining xususiy kaliti bilan jamoatchilik kaliti birlashtirilishi orqali raqamli imzo yaratiladi. Ushbu imzo yuboruvchining kimligini va o'tkazilgan ma'lumotlarning haqiqiyligini tasdiqlovchi raqamli tasdiqlash pochtasi sifatida xizmat qiladi. Sizning ommaviy kalitingiz bo'lgan har bir kishi tranzaksiyani boshlagan shaxs sizning xususiy kalitingizdan foydalanganini tekshirish mumkin.

## Xizmatchi tomonidan kalitlar {#keys-on-the-client-side}

Har bir tranzaksiya hisob raqami hokimiyati tomonidan imzolangan bo'lishi kerak. bu hokimiyat uchun xususiy kalit yoki nazoratchi material sir saqlanishi kerak, shuning uchun mijoz dasturiy ta'minoti xavfsiz saqlash va imzolash uchun javobgardir.

::: ogohlantirish

Barcha mijozlar har xil, lekin oddiy matnli mijoz konfiguratsiyasi faqat rivojlanish va nazorat qilinadigan test tarmoqlari uchun mos keladi. Mahsulot integratsiyalarida sirli menejer, apparat bilan qo'llab-quvvatlanadigan kalitlarni saqlash yoki boshqa audit qilingan imzolash chegaralaridan foydalanish kerak.

:::

Yangi hisobni ro'yxatga olish Ed25519 kalit juftligi kabi nazoratchi materialini yaratishni o'z ichiga oladi. va ommaviy qismini tarmoqga taqdim etish. Ushbu hisobdan keyingi operatsiyalar moslashtiriladigan xususiy kalit yoki konfiguratsiyalangan hisob boshqaruvchisi siyosati bilan imzolangan bo'lishi kerak.

Umumiy kalitning kriptografiyasi samarali ishlashi uchun, yangi kalitni aniqlashingiz kerak bo'lganda kalitlarni qayta ishlatishdan qoching. Buni amalga oshirishdan sizni hech narsa to'sqinlik qilmasa ham, jamoatchilik kalitlari ochiqdir, ya'ni agar hujumchi bir xil ommaviy kalitdan foydalanayotganini ko'rsa, ular xususiy kalitlar ham bir xil ekanligini bilib olishadi.

Xususiy kalitlar parollardan biroz farq qiladigan tamoyillarga ega bo'lsa-da, ularni iloji boricha ko'proq tasodifiy qilish tavsifi qo'llaniladi. Hech qachon ularni shafrlanmagan holda saqlash va hech qanday holatda hech kim bilan o'rtoqlash kerak emas.
