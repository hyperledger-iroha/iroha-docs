---
translation_locale: uz
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Maxfiy soʻzlar xavfsizligi {#password-security}

Blockchain xavfsizligi sohasida parollarni himoya qilish juda muhimdir. Sizning ma'lumotlaringiz va ular ifodalaydigan hamma narsa ruxsatsiz kirish uchun himoyasiz qolishini ta'minlash uchun, keling, parol xavfsizligining nuanslarini chuqurroq o'rganamiz.

## Maxfiy soʻz kuchi {#password-strength}

Ehtimol, siz ilgari kuchli maxfiy so'zni qanday yaratish haqida tavsiyalar bilan uchrashgan bo'lasiz. Bular minimal maxfiy soʻz uzunligi, maxsus belgilarni qo'shish kabi maslahatlarni o'z ichiga olishi mumkin. Bunday tavsiyalar entropiyadan bog'liq bo'lgan maxfiy so ' zingizning kuchini oshirishga qaratilgan, ya'ni. maxfiy so'zning tasodifiyligi.

Xo'sh, kuchli parolni nima belgilaydi? Kuchli parol yuqori entropiyaga ega bo'lgan parol.

Maxfiy so'z entropiyasini hisoblash uchun biz Entropy formulasiga amal qilishimiz mumkin:

::: tip Entropiya formulasi

$L$  Parol uzunligi; paroldagi ramzlarning soni.\ $S$  Karakterlar to'plami; noyob bo'lishi mumkin bo'lgan ramzlar guruhining hajmi.\ $S^L$  Muqobil kombinatsiyalar soni.

$$Entropy=log_2(S^L)$$

Natijada olingan raqam - bu paroldagi entropiya bitlari soni. Nomur qanchalik yuqori bo'lsa, hasharotni buzish shunchalik qiyin.

Entropiya qiymatini bilgan holda, ushbu entropiyadan foydalangan so'z parolni o'chirib yuborish uchun zarur bo'lgan harakatlar miqdori quyidagi formuladan foydalanib olinishi mumkin:

$$S^L=2^Entropy$$

Maxfiy so'z entropiyasi qanchalik yuqori bo'lishi kerakligi to'g'risida universal javob yo'q. Moliyaviy tashkilotlar uchun `64` dan `127` bitlarigacha (`128` bitlari yoki undan ko'proq, odatda haddan tashqari o'ldirilgan deb hisoblanadi) oralig'ida saqlab qolish tavsiya etiladi. Shuni yodda tutingki, <abbr title="Graphics Processing Unit">GPU</abbr>lar doimiy ravishda rivojlanmoqda va parollarni buzish uchun zarur bo'lgan vaqt vaqt vaqt o'tishi bilan kamayadi.

:::

Entropiya formulasi bo'yicha, quyidagi ikkita misolni taqqoslaymiz:

  1. Zamonaviy ingliz alifbosining faqat kichik harflaridan foydalanadigan belgilar to'plami bo'lgan 16 xarakterli maxfiy so'z taxminan 43 sextillion ($43*10^21$) mumkin bo'lgan kombinatsiyalarni beradi.

$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. Karakterlar to'plami 96 ga ko'paytirilgan 16 ta belgili maxfiy so'z, katta harflar va maxsus ramzlarni o'z ichiga olgan bo'lib, mumkin bo'lgan kombinatsiyalarning sonini qo'rqinchli 52 million ($52*10^30$) ga yetkazadi va entropiyani sezilarli darajada yaxshilaydi.

$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Ko'rinib turganidek, harflar to'plamini faqat 26 dan 96 ta ramkaga ko'paytirish bilan ham zararli tomonni qo'llab-quvvatlash uchun kerak bo'lgan mumkin bo'lgan kombinatsiyalar soni $1.1933*10^9$ marta ko'paydi.

Bundan tashqari, maxfiy so'z uzunligini oshirish mumkin bo'lgan kombinatsiyalar sonini yanada oshiradi va shuning uchun maxfiy soʻz entropiyasi kuchaytiradi.

Biroq, murakkabliklar bilan kurashishning o'rniga biz parollarni boshqarish dasturidan foydalanishni maslahat beramiz [KeePassXC](https://keepassxc.org/) (Ko'proq ma'lumot olish uchun ko'ring) [Maxfiy soʻzlarni boshqarish dasturi qoʻshish](./storing-cryptographic-keys.md#adding-a-password-manager-program) va [Konfiguratsiyalash KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc))sizning maxfiy so'zlaringizni yaratish va xavfsiz saqlash uchun.

::: manzil

Ba'zi veb-saytlar maxfiy so'zlarning maksimal entropiyasini cheklaydi, ya'ni maximal parol uzunligini yoki qabul qilingan belgilarni yoki ikkalasi ham cheklaydi.

Bunday veb-saytlardan foydalanganingizda buni yodda tuting va parollaringizni muntazam ravishda yangilashni maqsad qiling.

:::

## Maxfiy soʻz himoyaga olinishi {#password-vulnerabilities}

Maxfiy so'zlar, odatda kuchli GPUs dan foydalanib, lug'atlar bilan birgalikda yoki barcha imkoniyatlar bo'yicha to'liq takrorlash orqali amalga oshiriladigan vahimali hujumlarning qurboniga aylanishi mumkin. Bunday urinishlarning oldini olish uchun tug'ilgan kun, manzil, telefon raqami va ijtimoiy xavfsizlik raqamlari kabi shaxsiy ma'lumotlardan mahrum bo'lgan o'ziga xos parol yarating.

Demak, zamonaviy parolni buzish qanchalik qiyin? Bu kimdan so'rasangizga bog'liq.

Bunday qurilma bilan [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)Bu ... [klasterni tashkil etish](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) uy-joylar 24 NVIDIA® GeForce RTX 4090 va 6 yillar NVIDIA® GeForce RTX 2080-yillar, ularning hammasi yugurmoqda [Hashtopolis](https://github.com/hashtopolis) dasturiy ta'minot, u faqat yarim oyda bir yil kerak bo'lgan parollarni buzadi.

Shunday bo'lsa-da, keling uni bitta RTX 4090, 300 gacha qayta ishlashga qodir <abbr title="Hashes per second">H/s</abbr> qo'llash [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) va 200 <abbr title="Hashes per second">H/s</abbr> qo'llash [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), ko'rsatilganidek [ushbu tweet](https://twitter.com/Chick3nman512/status/1580712040179826688).

O'tgan entropiyasi hisob-kitoblarimizning kengaytmasi sifatida keling, endi quyidagi rejalashtirilgan buzish vaqtlarini ko'rib chiqaylik:

  1. Ular bor $31,540,000$ Oddiy bo'sh yildagi ikki soniyalar. `NTLM`, tezlikda $300*10^9$ <abbr title="Hashes per second">H/s</abbr>, bu bitta talab qiladi RTX deyarli 4090 $4,608.83$ Zamonaviy ingliz alifbosining 26 harfi bo'lgan belgilar to'plami bilan 16 ta shriftli parolni buzish uchun yillar kerak edi.

  2. Agar `NTLM` o'rniga `bcrypt`dan foydalansak, shunda takrorlash tezligini $200*10^3$ <abbr title="Hashes per second">H/s</abbr> ga kamaytirish, shuningdek, belgilar to'plamini 96 ga ko'paytirish, shu jumladan katta harflar va maxsus ramzlarni qo'llasak, buzish vaqti taxminan $8,249,887,835,549,662,270.456$ yillargacha oshadi: Koinotning yoshi ancha o'sadi.

Shunday qilib, shunchaki yuqori entropiyani tanlash orqali parolni tushunib bo'lmaydigan raqamlarga ajratish uchun vaqt ko'paydi. Ha, jarayon bir nechta GPUs yordamida tezlashtirilishi mumkin, ammo bu usul [XKCD yondashuvi bilan taqqoslaganda oshib ketadi](https://xkcd.com/538/).

Shuni ta'kidlash kerakki, yuqori entropiyaga erishish uchun keng belgilar to'plami har doim ham zarur emas. Uni ko'p so'zli maxfiy so'zlar yoki, ayniqsa, uzoq jumlalar yordamida olish mumkin. [XKCD komikslar](https://xkcd.com/936/) bu tushunchani so'zlab bermoqda.

::: ogohlantirish

Parolingizni har qanday joyda yozib qo'ymang. Parolni tiklash iborasini xavfsiz saqlang. Agar ibora juda uzun bo'lsa, uni yozib olishingiz mumkin va keyinchalik uni o'qib, yozishingiz mumkinligini ta'minlashingiz mumkin. Iboraning jismoniy nusxasini xavfsiz joyda va / yoki konteynerda saqlash.

:::
