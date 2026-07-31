---
translation_locale: uz
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Maxfiy soʻz xavfsizligi {#password-security}

Blockchain xavfsizligi sohasida parollarni himoya qilish juda muhimdir. Sizning ma'lumotlaringiz va ular ifodalaydigan hamma narsa ruxsatsiz kirish uchun himoyasiz qolishini ta'minlash uchun, keling parol xavfsizligining nuanslariga chuqurroq intilaylik.

## Maxfiy soʻz kuch {#password-strength}

Ehtimol, siz ilgari qanday qilib _kuchli_ Shartnoma. Bular minimal shartnoma uzunligi, maxsus belgilarni qo'shish va boshqalar kabi maslahatlarni o'z ichiga olishi mumkin. Bunday tavsiyalar sizning shartnomangizning entropiyasiga bog'liq bo'lgan kuchini oshirishga qaratilgan, ya'ni shartnomaning tasodifiyligini anglatadi.

Shunday qilib, a ni nima belgilaydi _kuchli maxfiy soʻz_? Kuchli soʻz - bu _yuqori entropiya_.

Maxfiy so'z entropiyasini hisoblash uchun **Entropiya formulasi**:

::: tip Entropiya formulasi

$L$  Maxfiy so'z uzunligi; maxfiy so'zda simvollar soni.\
$S$  Karakterlar to'plami; noyob mumkin bo'lgan ramzlarning hajmi.\
$S^L$  Muqobil kombinatsiyalar soni.

$$Entropy=log_2(S^L)$$

Natijada raqam - bu paroldagi entropiya bitlarining soni.

Entropiya qiymatini bilgan holda, ushbu entropiya bilan parolni o'rnatish uchun zarur bo'lgan harakatlar miqdori quyidagi formuladan foydalanib olinishi mumkin:

$$S^L=2^Entropy$$

Maxfiy so'zlarning entropiyasi qanchalik yuqori bo'lishi kerakligi haqida universal javob yo'q. Moliyaviy tashkilotlar uchun o'z parollarining entropiyasini `64` to `127` bitlar (`128` ko'p bitlar yoki undan ortiq bo'lsa, odatda o'tkirlik deb hisoblanadi). <abbr title="Graphics Processing Unit">GPU</abbr>s doimiy ravishda rivojlanmoqda va parollarni buzish uchun kerak bo'lgan vaqt vaqt vaqt o'tishi bilan kamayadi.

:::

Following entropik formula, keling, quyidagi ikkita misolni taqqoslaylik:

  1. Zamonaviy ingliz alifbosining kichik harflaridan iborat bo'lgan harflar to'plami bilan 16 xarakterli parol taxminan 43 sextillion ($43*10^21$) mumkin bo'lgan kombinatsiyalar.

    $$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. O'n olti belgili maxfiy so'z 96 ga ko'paytirilgan, katta harflar va maxsus ramzlarni o'z ichiga olgan bo'lib, mumkin bo'lgan kombinatsiyalarning sonini 52 millionga yetkazadi ($52*10^30$), entropiyani sezilarli darajada yaxshilaydi.

    $$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Ko'rinib turganidek, hatto harflar to'plamini 26 dan 96 ta ramkaga kengaytirsak ham, zararli tarafni qo'llab-quvvatlash uchun kerak bo'lgan mumkin bo'lgan kombinatsiyalar soni $1.1933*10^9$ Vaqtlar.

Bundan tashqari, maxfiy so'z uzunligini oshirish mumkin bo'lgan kombinatsiyalar sonini yanada oshiradi va shuning uchun maxfiy soʻz entropiyasini kuchaytiradi.

Biroq, murakkabliklar bilan kurashishning o'rniga biz parollarni boshqarish dasturidan foydalanishni maslahat beramiz [KeePassXC](https://keepassxc.org/) (Ko'proq ma'lumot olish uchun ko'ring) _[Maxfiy soʻz boshqaruvchisi dasturini qoʻshish](./storing-cryptographic-keys.md#adding-a-password-manager-program)_ va _[Konfigurarlash KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc)_)sizning maxfiy so'zlaringizni yaratish va xavfsiz saqlash uchun.

::: tip

Ba'zi veb-saytlar maximum mumkin bo'lgan parol entropiyasini cheklaydi, ya'ni maksimal parol uzunligini yoki qabul qilingan belgilarni yoki ikkalasi ham cheklaydi.

Bunday veb-saytlardan foydalanganingizda buni yodda tuting va parollaringizni muntazam ravishda yangilashga intiling.

:::

## Maxfiy soʻz himoyasi {#password-vulnerabilities}

Maxfiy so'zlar kuchli hujumlarga duchor bo'lishi mumkin GPUs Ushbu harakatlarni barbod qilish uchun tug'ilgan kunlar, manzillar, telefon raqamlari yoki ijtimoiy xavfsizlik raqamlari kabi shaxsiy ma'lumotlardan mahrum bo'lgan noyob parol yaratish. Hujumchilarga osonlikcha taxmin qilinadigan izlar berishdan qoching.

Zamonaviy parolni buzish qanchalik qiyin? Bu kimdan so'rasangiz, shu bilan bog'liq.

Bunday qurilma bilan [Kevin Mitnik](https://en.wikipedia.org/wiki/Kevin_Mitnick)" [klasterni oʻrnatish](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) uy-joylar 24 NVIDIA® GeForce RTX 4090 va 6 yillar NVIDIA® GeForce RTX 2080-yillar, ularning hammasi yuguradi [Hashtopolis](https://github.com/hashtopolis) dasturiy ta'minot, u faqat yarim oyda bir yil vaqt kerak bo'lgan parollarni buzadi.

Biroq, keling uni bitta RTX 4090, 300 gacha qayta ishlashga qodir <abbr title="Hashes per second">H/s</abbr> qo'llash [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) va 200 <abbr title="Hashes per second">H/s</abbr> qo'llash [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), ko'rsatilganidek [ushbu tweet](https://twitter.com/Chick3nman512/status/1580712040179826688).

O'tgan entropiyasi hisob-kitoblarimizning kengaytmasi sifatida keling, endi quyidagi prognoz qilingan parchalanish vaqtlarini ko'rib chiqaylik:

  1. Ular bor $31,540,000$ Oddiy bo'sh yilda ikki soniya. `NTLM`, tezlikda $300*10^9$ <abbr title="Hashes per second">H/s</abbr>, bu bitta talab qiladi RTX taxminan 4090 $4,608.83$ Zamonaviy ingliz alifbosining 26 harfi bo'lgan belgilar to'plamida 16 ta shriftli parolni buzish uchun yillar kerak edi.

  2. Agar `NTLM` biz foydalanamiz `bcrypt`, Shuning uchun takrorlash tezligini $200*10^3$ <abbr title="Hashes per second">H/s</abbr>, 96-ga o'rnatilgan belgilarni kengaytirgan holda, katta harflar va maxsus ramzlarni o'z ichiga olgan holda, crack vaqti taxminan $8,249,887,835,549,662,270.456$ yillar, koinotning yoshiga ancha kattaroq.

Shunday qilib, shunchaki yuqori entropiyani tanlab olish parolni tushunarli bo'lmagan raqamlarga ajratish uchun vaqtni oshiradi. GPUs, Biroq, ushbu usul [XKCD yo'nalish](https://xkcd.com/538/).

Yuqori entropiyaga erishish uchun keng belgilar to'plami har doim ham zarur emasligini e'tiborga olish muhimdir. [XKCD komikslar](https://xkcd.com/936/) bu tushunchani so'zlab beradi.

::: warning

Parolingizni har qanday joyda yozib qo'ymang. Parolni tiklash iborasini xavfsiz saqlang. Agar ibora juda uzun bo'lsa, uni yozib olishingiz mumkin va keyinroq o'qib bosishingiz mumkinligini ta'minlashingiz mumkin. Iboraning jismoniy nusxasini xavfsiz joyda va / yoki konteynerda saqlash.

:::
