---
translation_locale: uz
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Operatsiya xavfsizligi {#operational-security}

Operatsiyaviy xavfsizlik Iroha ishga tushirilishi atrofidagi odamlarni, uy egalarini, ma'lumotlar va tartib-taomillarni himoya qiladi. Boshliq hujjatlari davlat o'zgarishlarini qabul qiladi. Operatorlar o'z ish stansiyalarini, imzolash kalitlarini va hodisalarga javob berish jarayonini alohida xavfsizlashtirishlari kerak.

Quyida keltirilgan nazoratlarni ishga tushirish uchun asos sifatida ishlating. Ularni xavf ostida bo'lgan qiymatga va tashkilotingiz talablariga moslashtiring.

## Ishlab chiqarish asosini belgilash {#establish-an-operational-baseline}

- Validatorlar xostlari, tengdoshlari kimligi, hisoblar hokimiyati, imzolash qurilmalari, ommaviy oxirgi nuqtalar va mas'ul odamlar ro'yxatini yuritish.
- Ishlab chiqish, sinov va ishlab chiqarish uchun alohida ma'lumotlardan foydalaning. Har bir imzolovchiga, olib yuruvchi token va xususiy kalitni bitta muhitga ajrating.
- Konfiguratsiya va joylashtirish avtomatlashtirilishini tekshirish mumkin bo'lgan versiya nazoratida saqlang. Sirlarni ish vaqtida tasdiqlangan sirlar ombori yoki imzolash qurilmasidan kiriting.
- Bo'shatish artifektlarining kutilayotgan hashlari yoki imzolarini yozib oling. Uni ishga tushirishdan oldin tekshirib ko'ring. Ikkilamchilarni, genesis materialini, konfiguratsiyani yoki xizmat tavsiflarini kim almashtirishi mumkinligini cheklang.
- Operatsiya tizimlari hisobvaraqlariga, Iroha ruxsatnomalarga va tarmoq boshqaruviga eng kam imtiyoz qo'llash. Har bir rolga faqat uning ishi uchun zarur bo'lgan vakolatni bering.
- Ishlab chiqarishni boshlashdan oldin ehtiyot qismlarni sinovdan o'tkazish, tiklash, kalitni almashtirish va tengdoshlarni tiklash tartib-taomillari.

[Bazar chizig'ini belgilashda xavfsizlik prinsiplarini](./security-principles.md) va [Bo'shashishga tayyorlik ko'rish ](../best-practices/release-readiness.md)-ni qayta ko'rib chiqish.

## Ochiqlamalar va imzolarni himoya qiling {#protect-keys-and-signers}

- Xususiy kalitlar, urug' materiallari, tashuvchi tokenlari, ruxsatnoma boshliqlari va tiklash sirlarini manba nazoratidan tashlab qo'ying, izlovchilarni chiqarish, suhbat transkriptlari, ekran ko'rgazmalari va ommaviy hujjatlar.
- Yuqori qiymatli organlar uchun asbob-uskuna qo'llab-quvvatlangan yoki alohida imzolardan foydalaning. Mijoz imzolarni delegatsiya qilishi mumkin bo'lganda, xomashyoni brauzerlar va umumiy maqsadli dastur jarayonlaridan tashqarida saqlang.
- Oddiy operatsiyalar, boshqaruv, ishga tushirish va tiklanish uchun alohida vakolatlardan foydalaning.
- Maxfiy saqlash va uning ehtiyot qismlarini shifrlash. Xususiy kalitning ehtiyot qismlariga jonli kalit bilan bir xil kirish nazoratlarini qo'llash.
- Tekshirilgan almashtirish yoki bekor qilish tartibini saqlab qoling. Siyosat talab qilganda yoki ta'sirga duchor bo'lganda kalitni almashtiring.
- Validator a'zoligiga, imtiyozli vazifaga yoki yuqori qiymatli aktivlarga o'zgarishlar bo'yicha mustaqil tekshiruvni talab qilish.

[Kiltga oid yo'l-yo'riq uchun ](./generating-cryptographic-keys.md) va [Storing Cryptographic Keys](./storing-cryptographic-keys.md)ni ko'rish.

## Harden nodlari va operatorning kirish huquqi {#harden-nodes-and-operator-access}

- Foydalanuvchi tomonidan qo'llab-quvvatlanadigan, tuzatilgan tizimlarda nodlar va operator vositalarini ishga tushiring. Zaruriy bo'lmagan xizmatlarni o'chirib tashlang.
- O'z nomi bilan operatorlarga faqat tekshirilgan, shifrlangan kanallar orqali ma'muriy kirish huquqini berish.
- Umumiy interfeyslarni xususiy tarmoqga yoki [VPN](./vpn.md)ga qo'yish.
- Faqat Torii, monitoring va qo'llanma yo'nalishlarini ko'rsatish uchun joylashtirish talab etiladi.
- Har qanday ommaviy kirish joylarini atrof-muhitga mos tarif cheklovlari va transport xavfsizligi bilan himoya qilish.
- Konfiguratsiya fayllari va xizmat ma'lumotlarini cheklovchi fayl ruxsatnomalari bilan himoya qiling. Buyruq satrlaridan, jarayon ro'yxatidan va shell tarixidan sirlarni saqlang.
- Tavakkalchilik modeli mustaqil nazoratni talab qilganda, sertifikatlovchi, mijoz, kuzatuv va yedeklash vazifalarini alohida o'tkazish.
- Ishonchli manbalardan vaqtni sinxronlashtiring. Tekshirish uchun etarlicha tizim, xizmat va tarmoq loglarini saqlang.

## Browser va admin ish oqimlarini xavfsizlashtirish {#secure-browser-and-admin-workflows}

Veb interfeysidan foydalanuvchi operator uchun:

- Hozirda ishlab chiqaruvchi tomonidan qo'llab-quvvatlanadigan, to'liq yangilangan brauzerdan boshqariladigan ish stantsiyasida foydalaning.
- Faqat kerakli kengaytmalar bilan operatorning maxsus profilini yoki qurilmasini ishlating.
- So'rovni qabul qilishdan oldin kelib chiqishi va sertifikatini tekshirish.
- O'xshash domenlar, kutilmagan qayta yo'naltirishlar va asosiy xomashyo uchun so'rovlarni hodisalar deb hisoblang.
- Aktiv operator seansidan bog'liq bo'lmagan saytlar va kengaytmalarni bloklash.
- Qisqa muddatli seanslardan foydalaning. Maxsus harakatlar uchun qayta tasdiqlashni talab qiling.
- Transaksiya tafsilotlarini imzochiga ko'rsating. Operator ruxsat berishdan oldin vakolat, tarmoq, yo'l-yo'riq, aktivlar va to'lovlarni tekshirish imkoniyatiga ega bo'lishi kerak.

Browserning izolyatsiyasi ta'sirini kamaytiradi. Operatorlar hali ham tranzaksiyalarni ko'rib chiqishlari va xavfsiz imzolashdan foydalanishlari kerak.

## Nazorat qilish va javob berish {#monitor-and-respond}

Ushbu signallarni kuzatib boring:

- Validator va tengdoshlar a'zoligi o'zgarishi
- takrorlangan ruxsat etish xatolari yoki odatiy holdagi imtiyozli ko'rsatmalar
- kutilmagan dasturiy ta'minot, konfiguratsiya yoki yo'nalish o'zgarishlari
- Oddiy boshlang'ich chizig'idan tashqarida imzolash, so'rov berish va tranzaksiyalar muvaffaqiyatsiz tugadi
- resurslar to'liqligi, konsensusni to'xtatish yoki kutilayotgan tengdoshlarni yo'qotish
- mol-mulk, ruxsatnoma va hisobda aldov qoidalariga mos keladigan o'zgarishlar

Ogohlantirishlarni ta'sirlangan xostdan mustaqil kanalga yuboring. Tegishli jurnallar, konfiguratsiya fotosuratlari, katta kitob hodisalari va tranzaksiya hashlarini vaqt belgilari bilan saqlang. [Fraud Monitoring](./fraud-monitoring.md) va [Performance and Metrics](../advanced/metrics.md) ko'ring.

## Qayta tiklash rejasi {#recovery-plan}

Ishlab chiqarish boshlang'ichidan oldin tiklash rejasini tayyorlash.

- hodisani bildirishi va muvofiqlashtirishi mumkin bo'lgan shaxs
- sertifikatlashtiruvchilar, infratuzilma operatorlari, dastur egalari va zarar ko'rgan foydalanuvchilar bilan qanday bog'lanish mumkinligi
- qaysi organlar ruxsatnomalarni bekor qilishlari, kalitlarni almashtirishlari yoki tengdoshlarning a'zoligini o'zgartirishlari mumkin
- Ishonchli ikkilamchiliklar, konfiguratsiyalar, genesis yozuvlari, ehtiyot qismlar va kalit inventarlar saqlanadigan joy
- tiklanishdan keyin tarmoq va bog'liq dasturlarni qanday tasdiqlash kerak

Agar hodisa yuz bersa:

1. Ta'sir ko'rgan xost, hisob ma'lumoti, yo'nalish yoki vakolatni ajrating. Dalillarni saqlab qoling.
2. Yozuvlarni saqlab qoling, har bir tiklash harakatini yozib oling.
3. Ruxsat etilgan ma'lumotnomalar va ruxsatnomalarni tasdiqlangan boshqaruv jarayoni orqali bekor qilish yoki almashtirish.
4. Tekshirilgan asbob-uskunalardan dasturiy ta'minotni va konfiguratsiyani tiklash.
5. Peerlar a'zoligini, konsensus holatini, ommaviy yo'nalishlarni, monitoringni va ilova o'qishlarini tasdiqlang. Faqat shu tekshiruvlar muvaffaqiyatli o'tgandan keyin yozishni davom ettiring.
6. Asosiy sababni hujjatlashtirish. Boshqaruv, avtomatlashtirish va mashg'ulotlarni yangilash.

::: warning

Qaytarib bo'lmaydigan ledger amallari uchun oldindan ko'rib chiqilgan tartiblarga rioya qiling. Ta'sirlangan vakolat va aktivlarga mos tasdiqlarni talab qiling.

:::
