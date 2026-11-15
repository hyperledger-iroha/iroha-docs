---
translation_locale: uz
translation_source: /help/configuration-issues.md
translation_source_hash: cfd86e847651e71d40e8857c0531f9721ef94ea3c65bd80b6f6951081488f39d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Konfiguratsiya muammolarini bartaraf etish {#troubleshooting-configuration-issues}

Ushbu bo‘lim Iroha 3 konfiguratsiyasi uchun nosozliklarni bartaraf etish bo‘yicha maslahatlarni taqdim etadi. Avvalo [tugmalarni tekshirdi](./overview.md#check-the-keys) qilganingizga ishonch hosil qiling, chunki bu Iroha dagi muammolarning eng keng tarqalgan manbasidir.

Agar siz duch kelayotgan muammo bu yerda tavsiflanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'laning.

## Eski blockchain genesis Docker Compose sozlamasida {#outdated-genesis-on-a-docker-compose-setup}

Iroha’ning Docker Compose versiyasidan foydalanganda tugun konteynerlaridan biri `Failed to deserialize raw genesis block` xatosi bilan ishga tushmasligi mumkin. Bu odatda tugun, imzolangan boshlang‘ich tranzaksiya va yaratilgan konfiguratsiya turli Iroha tahrirlari yoki profillaridan olinganini anglatadi.

Validator jurnallarini koʻrish uchun toʻplam katalogida `python3 poc.py logs` buyrugʻini bajaring. Docker’da bir xil manba versiyasidan yigʻilgan bajariladigan fayllar bilan toʻrtta validatorni ishga tushirish uchun [Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) qoʻllanmasiga amal qiling.

Oʻsha tarmoqni qayta ishga tushirish uchun avval `python3 poc.py down`, keyin `python3 poc.py up` buyrugʻini bajaring. `state/` katalogini tarmoqning toʻrtta Docker jildi bilan birga saqlang.

::: info

Jonli tarmoqda blockchain boshlang'ich nusxasini almashtirish uchun umumiy avtomatik qayta yozish yo'li mavjud emas. Buni muvofiqlashtirilgan migratsiya sifatida ko'ring: eski holatni saqlang, mos keluvchi tarmoq hamkasblarini ishga tushiring va faqat operatorlar migratsiya rejasida kelishib olgachgina validatsiya qiluvchilarni yangi konfiguratsiyaga o'tkazing.

:::

## Shaxsiy va ochiq kalitlarining Multihash formati {#multihash-format-of-private-and-public-keys}

Agar siz [mijoz konfiguratsiyasi](/uz/guide/configure/client-configuration.md)ga qarasangiz, u yerda tugmalar [ko‘p-xash format](https://github.com/multiformats/multihash)da berilganligini payqasangiz bo‘ladi.

Agar ilgari multi-hash bilan ishlamagan bo'lsangiz, o'ng tomondagi qism kalit baytlarining olti o'nlik emasligi (har bir uchun ikki belgi) deb hisoblash tabiiydir bayt), balki baytlar ASCII (yoki UTF-8) sifatida kodlangan bo‘lib, va `public_key` va `private_key` instantsiyalarda string literalga `from_hex` ni chaqiring.

Shuningdek, satr literalini `str::parse::<PrivateKey>()` bilan tahlil qilish faqat to‘g‘ri kalitni beradi, deb taxmin qilish tabiiydir. Shunday qilib, agar siz kalitdagi bitlar sonini noto‘g‘ri ko‘rsatsangiz, masalan 32 bayt o‘rniga 64, bu xato xabarini keltirib chiqaradi, deb kutish mumkin.

Ikkala taxmin ham noto‘g‘ri. Afsuski, xato xabarlari aynan shu turdagi nosozlikni aniqlashda yordam bermaydi.

Qanday tuzatish: `hex_literal` ni ishlating. Bu shuningdek, xunuk belgilar ketma-ketligini ochiq-oydin olti burchakli raqamlar bilan chiroyli kichik jadvalga aylantiradi.

::: warning

Hatto `FromStr` ijrosi ham berilgan satrning haqiqiy `PrivateKey` ekanligini tekshira olmaydi va agar bo'lmasa, ogohlantira olmaydi.

U ba'zi aniq xatolarni ushlaydi, masalan, agar satr noto'g'ri belgi o'z ichiga olsa. Biroq, biz ko'p kalit formatlarini qo'llab-quvvatlashni maqsad qilganimiz uchun, u boshqa biror narsani qilolmaydi. Shuningdek, u kalit berilgan hisob uchun to'g'ri shaxsiy kalit ekanligini aytolmaydi, agar siz ko'rsatma yubormasangiz.

:::

Bunday nozik xatoliklardan, masalan, to'g'ridan-to'g'ri satr literalidan deserializatsiya qilish orqali yoki ma'nosi bo'lgan joylarda yangi kalit juftini yaratish orqali qochish mumkin.
