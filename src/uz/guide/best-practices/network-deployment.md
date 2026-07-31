---
translation_locale: uz
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarmoqni ishga tushirish {#network-deployment}

Kasallik Iroha muvofiqlashtirilgan tizim sifatida tarmoq.
genesis, topologiya, ishonchli tengdoshlar va konsensusga bog'liq konfiguratsiya
to'plamni boshlash va bloklarni yakunlashni davom ettirishdan oldin.

## atrof-muhit bo'linishi {#environment-separation}

- Mahalliy rivojlanish uchun alohida konfiguratsiya to'plamlarini, umumiy test tarmog'ini saqlash;
  dizaynlash va ishlab chiqarish.
- Har bir bir yaratib bo'lmaydigan muhit uchun yangi kalitlarni yaratish.
  lokal tarmoq yoki Taira ishlab chiqarishda asosiy material.
- Tengdoshlar konfig, mijoz konfig, imzolangan genesis, skriptlar va joylashtirishni saqlang
  qo'shilgan versiyalangan chiqarilish artefakti sifatida.
- Xususiy kalitlarni omborlar va joylashtirish namunalari tashqarisida saqlash.

Koʻring
[Tarmoqni ishga tushirishning kalitlari](/uz/guide/configure/keys-for-network-deployment.md).

## Ibtido va topologiya {#genesis-and-topology}

- Har bir tasdiqlovchiga bitta imzolangan genesis tranzaksiyasidan foydalanishga ruxsat bering.
  profilda egalik guvohnomasi
  ularni talab qiladi.
- Bizansning xatolarga chidamliligi uchun kamida to'rtta validatordan foydalaning
  ishga tushirish.
- Kamchiliklarni rejalashtirishda kuzatuvchilardan alohida tasdiqlovchilar.
  ovoz berish, taklif qilish yoki yig'ish, lekin ular hali ham saqlashni iste'mol qiladilar, blok sinxronizatsiyasini,
  va tarmoq bandwidti.
- Genesis, ijrochi va topologiya o'zgarishlarini muvofiqlashtirilgan migratsiyalar sifatida muomala qiling
  yagona tenglamchi tahrirlardan ko'ra.

Koʻring [Ibtido](/uz/reference/genesis.md),
[Tengdoshlarni boshqarish](/uz/guide/configure/peer-management.md), va
[Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md#node-count-and-quorum).

## Torii va tarmoqga kirish {#torii-and-network-access}

- Qoʻyish Torii tashqarida bo'lganda orqa tom ma'nodagi proxy yoki firewall ortida
  uy egasi yoki xususiy tarmoq.
- Toʻxtatish TLS va asosiy autentifikatsiya, stavkalarni cheklash va
  ishga tushirish uchun talab qilinganda, so'rov o'lchamli nazoratlar chegaralarda.
- Faqatgina atrof-muhit uchun zarur bo'lgan oxirgi nuqtalarni e'lon qilish.
  Telemetriya yo'nalishlari faqat o'qish uchun mo'ljallangan ommaviy yo'nalishlardan ko'ra kamroq bo'lishi kerak.
- Tengdoshlar kerak boʻlmagan holda tinglovchining manzillarini xost-lokal interfeyslarga bogʻlash
  to'g'ridan-to'g'ri masofani qabul qiling.

Koʻring [Torii Keyingi nuqtalar](/uz/reference/torii-endpoints.md) va
[Virtual xususiy tarmoqlar](/uz/guide/security/vpn.md).

## Konsens va quvvat {#consensus-and-capacity}

- Konsensus vaqtini sozlashdan oldin joylashtirishni o'lchash.
  tarmoq, saqlash va ijro qatlamlari bilan birga bo'lganda faqat kechiktirishni kamaytirish.
- Tartibning yo'nalishini kuzating, shunchaki o'tkazib yuborishning qisqa namunalari emas.
  doimiy yuklanish paytida o'sadi, bu tarmoq ortiqcha yuklanganligini anglatadi.
- Hisob-kitoblar Sumeragi parametrlar, telemetriya profili, tasdiqlovchilarning soni;
  tarmoq RTT, ish yukining shakli va har bir ma'lumotlar uchun asbob-uskunalar to'g'risida batafsil ma'lumot.
- Faqat latensiya, trafik va transportni taqqoslaganidan keyin to'plamning sonini oshirish
  orqaga surish signallari.

Koʻring [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md).

## Toʻq metallar va jarayonlarni boshqarish {#bare-metal-and-process-management}

- Har bir tengdoshning `config.toml`, Xususiy kalit, saqlash direktoriyasi va portlar
  alohida.
- Proses menejerlaridan foydalanish systemd aniq qayta ishga tushirish, ro'yxatdan o'tkazish va
  resurslar siyosati.
- O ' rnatilgan saqlanish README va buyruqlarni boshlash Kagami lokal tarmoqlar toʻplami
  sinov topologiyasini boshqaruvchi uy egalariga tarjima qilishda.

Koʻring
[Yugurish Iroha Yolg'iz metallda](/uz/guide/advanced/running-iroha-on-bare-metal.md).
