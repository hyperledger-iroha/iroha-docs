---
translation_locale: uz
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarmoqni ishga tushirish {#network-deployment}

Iroha tarmog'iga muvofiqlashtirilgan tizim kabi munosabatda bo'ling. Tarmoq bloklarni boshlash va yakunlashni davom ettirishdan oldin, tasdiqlovchilar kelib chiqishi, topologiya, ishonchli tengdoshlar va konsensusga bog'liq konfiguratsiyalarga kelishib olishlari kerak.

## atrof-muhit bo'linishi {#environment-separation}

- Mahalliy rivojlanish, test tarmog'i bo'lish, bosqichlashtirish va ishlab chiqarish uchun alohida konfiguratsiya paketlarini saqlash.
- Har bir birdan chiqarib tashlanmaydigan muhit uchun yangi kalitlarni ishlab chiqarish. Taira ishlab chiqarishdagi asosiy material.
- Tengdosh konfig, mijoz konfig, imzolangan genesis, skriptlar va ishga tushirish notlarini versiyalashtirilgan chiqarilish artefakti sifatida birga saqlang.
- Xususiy kalitlarni omborlar va joylashtirish namunalaridan tashqarida saqlash.

[Tijtimoiy tarmoqlarni ishga tushirish uchun kalitlar ](/uz/guide/configure/keys-for-network-deployment.md)

## Ibtido va topologiya {#genesis-and-topology}

- Har bir tasdiqlovchi xuddi shu imzolangan genesis tranzaksiyasidan, ishonchli tengdoshlar to'plamidan, topologiyadan va tasdiqlashchining Profiliga kerak bo'lganda egalik guvohnomasidan foydalansin.
- Bizans xatolariga chidamli bo'lish uchun kamida to'rtta tasdiqlovchidan foydalaning.
- Kuchlilikni rejalashtirishda kuzatuvchilardan alohida tasdiqlovchilarni ajrating. kuzatuvchilar ovoz bermaydilar, taklif qilmaydilar yoki to'plamaydilar, ammo ular hali ham saqlash, blok sinxronizatsiyasini va tarmoq lentli kengligini iste'mol qiladilar.
- Bir tekis tahrirlar o'rniga, genesis, ijrochi va topologiya o'zgarishlarini muvofiqlashtirilgan migratsiyalar sifatida muomala qiling.

Qarang [Ibtido](/uz/reference/genesis.md), [ Tengdoshlar boshqaruvi](/uz/guide/configure/peer-management.md) va [ Ishlab chiqarish va metrikalar ](/uz/guide/advanced/metrics.md#node-count-and-quorum).

## Torii va tarmoqga kirish {#torii-and-network-access}

- Torii uy egasi yoki xususiy tarmoqdan tashqarida bo'lganda, qaytarib o'tish proxy yoki firewall ortida qo'ying.
- TLS ni tugatish va ularni ishga tushirish uchun zarur bo'lganda asosiy autentifikatsiya, tezlikni cheklash va so'rov o'lchamlarini nazorat qilish qo'llanilishini tugatish.
- Faqatgina atrof-muhit uchun zarur bo'lgan oxirgi nuqtalarni e'lon qilish. Operator va telemetriya yo'nalishlari faqat o'qishga mo'ljallangan ommaviy yo'nalishlardan ko'ra kamroq cheklanishi kerak.
- Tengdoshlar masofaviy trafikni to'g'ridan-to'g'ri qabul qilmasliklari kerak bo'lganda tinglovchining manzillarini uy egasi lokal interfeyslariga bog'lash.

Qarang [Torii Oxirgi nuqtalar](/uz/reference/torii-endpoints.md) va [ Virtual xususiy tarmoqlar ](/uz/guide/security/vpn.md).

## Konsens va quvvat {#consensus-and-capacity}

- Konsensus vaqtini sozlashdan oldin ishga tushirishni o'lchash. Kichik vaqtlar tarmoq, saqlash va ijro qatlamlari bilan birga bo'lgandagina kechikishni kamaytirishi mumkin.
- To'plamning qisqacha namunalari emas, balki navbat yo'nalishini kuzating. To'g'ri yuklanish paytida ortib boradigan navbat tarmoqni ortiqcha yuklangan deb anglatadi.
- Har bir ko'rsatkich uchun samarali Sumeragi parametrlari, telemetriya profili, validatorlar soni, tarmoq RTT, ish yukining shakli va asbob-uskuna to'g'risidagi tafsilotlarni qayd etish.
- Faqat kechikish, trafik va qarshi bosim signallarini taqqoslaganingizdan so'ng to'plamni ko'paytiring.

[Ishlab chiqarish va ma'lumotlar ](/uz/guide/advanced/metrics.md) ni ko'ring.

## Yolg'iz metall va jarayonlarni boshqarish {#bare-metal-and-process-management}

- Har bir tengdoshining `config.toml`, shaxsiy kalitining, saqlash direktoriyasining va portlarining alohida saqlang.
- systemd kabi jarayon menejerlarini aniq qayta ishga tushirish, ro'yxatdan o'tkazish va resurslar siyosati bilan ishlating.
- Sinov topologiyasini boshqarilgan xostlarga tarjima qilishda README hosil bo'lgan va Kagami lokalnet to'plamlaridan qo'yilgan buyruqlarni saqlash.

[Bars metalda Iroha ishlaydigan ](/uz/guide/advanced/running-iroha-on-bare-metal.md) ko'rish.
