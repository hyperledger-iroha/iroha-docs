---
translation_locale: uz
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Jamoat kalitlari kriptografiyasi {#public-key-cryptography}

Jamoat kalitlari kriptografiyasida o'zaro bog'liq jamoatchilik va xususiy kalitdan foydalanadi. Jamoat kaliti baham ko'rish mumkin. Xususiy kalit hokimiyatning nazorati ostida qolishi kerak. Xavfsizlik qo'llab-quvvatlanadigan algoritmdan foydalanish, xavfsiz tasodifiylik bilan kalitlarni ishlab chiqarish va xususiy kalitni himoya qilishga bog'liq.

## Raqamli imzo {#digital-signatures}

Imzolovchi xususiy kalit bilan raqamli imzonani yaratadi. Tahqiqotchi imonni tegishli ommaviy kalit bilan tekshiradi.

Amalli imzo imzolangan baytlar o'zgartirilmaganligini va xususiy kalit egasi ularni tasdiqlaganini ko'rsatadi. Bu shaxsni o'zi aniqlamaydi. Kimlik ommaviy kalit yoki hisob boshqaruvchisining qanday ro'yxatdan o'tkazilganligi va boshqarilayotganidan bog'liq.

Imzolar yaxlitlik va vakolat berilganini tasdiqlaydi. Ular imzolangan tarkibni shifrlamaydi.

## Ochiq kalitning shafrlanishi {#public-key-encryption}

Ba'zi ochiq kalit sxemalari ma'lumotni qabul qiluvchining ochiq kaliti uchun shifrlaydi. Qabul qiluvchi ma'lumotning shifrini tegishli xususiy kalit bilan ochadi. Shifrlash va imzolash alohida operatsiyalar bo'lib, turli kalitlar yoki algoritmlardan foydalanishi mumkin.

Iroha tranzaksiya imzolash ommaviy kitob ma'lumotlarini maxfiylashtirmaydi. Faydali yuk tarkibi maxfiy bo'lishi kerak bo'lganda, ishga tushirishning tasdiqlangan maxfiylik mexanizmidan foydalaning.

## Xizmatchi tomonidan kalitlar {#keys-on-the-client-side}

Har bir tranzaksiya konfiguratsiya qilingan hisob-kitob boshqaruvchisi siyosatiga muvofiq bo'lishi kerak. Oddiy hisobda bitta imzolash kalitidan foydalanish mumkin. Boshqaruvli hisobda yanada murakkab nazoratchi siyosatidan foydalanish mumkin .

Mijoz dasturiy ta'minoti xususiy kalitlarni va boshqa boshqaruv materiallarini himoya qilishi kerak. Ochiq matnli mijoz konfiguratsiyasi faqat mahalliy ishlab chiqish va nazorat qilinadigan sinovlar uchun mos. Ishlab chiqarish integratsiyalari sirlar menejeri, apparat bilan himoyalangan kalit saqlash joyi, ajratilgan imzolash xizmati yoki boshqa auditdan o'tgan imzolash chegarasidan foydalanishi kerak.

alohida muhit va maqsadlar uchun alohida kalitlardan foydalaning. Bir kalitni qayta ishlatish ushbu qo'llanmalarni bog'laydi va ta'sirini oshiradi.

Qarang [Generating Cryptographic Keys](./generating-cryptographic-keys.md), [Storing Cryptographic keys](./storing-cryptographic-keys.md) va [Operatsion xavfsizlik](./operational-security.md).
