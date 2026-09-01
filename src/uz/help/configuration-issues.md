---
translation_locale: uz
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Konfiguratsiya muammolarini bartaraf etish {#troubleshooting-configuration-issues}

Ushbu bo‘lim Iroha 3 konfiguratsiyasi uchun nosozliklarni bartaraf etish bo‘yicha maslahatlarni taqdim etadi. Avvalo [tugmalarni tekshirdi](./overview.md#check-the-keys) qilganingizga ishonch hosil qiling, chunki bu Iroha dagi muammolarning eng keng tarqalgan manbasidir.

Agar siz duch kelayotgan muammo bu yerda tavsiflanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'laning.

## Eski blockchain genesis Docker Compose sozlamasida {#outdated-genesis-on-a-docker-compose-setup}

Iroha’ning Docker Compose versiyasidan foydalanganda tugun konteynerlaridan biri `Failed to deserialize raw genesis block` xatosi bilan ishga tushmasligi mumkin. Bu odatda tugun, imzolangan boshlang‘ich tranzaksiya va yaratilgan konfiguratsiya turli Iroha tahrirlari yoki profillaridan olinganini anglatadi.

Muammoni quyidagi qadamlar bilan tekshiring:

1. Joriy konteynerlarni `docker ps` bilan tekshiring. Yaratilgan profilga qarab, odatda `hyperledger/iroha:dev` konteynerlari ko‘rinadi. Standart Docker Compose profilida to‘rtta tugun konteyneri bor, ammo yaratilgan `docker-compose.yml` boshqacha bo‘lishi mumkin.

2. Loglarni tekshiring va `Failed to deserialize raw genesis block` xatosini qidiring. Agar siz Iroha ni daemon rejimida `docker compose up -d` bilan boshlagan bo'lsangiz, `docker compose logs` buyrug'idan foydalaning.

Bunday muammoni aniqlash usuli Iroha dan foydalanishga bog‘liq. Agar bu oddiy demo bo‘lsa va siz tarmoq tengdosh ma’lumotlarini saqlashingiz shart bo‘lmasa, mos keluvchi localnet yoki Docker Compose paketini Kagami bilan qayta yarating:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

So‘ng eski konteyner holatini olib tashlang va qayta ishlab chiqarilgan `genesis.signed.nrt`, tarmoq tengdosh `config.toml` fayllaridan va `client.toml` dan boshlang.

Agar siz Iroha instansiya maʼlumotlarini tiklamoqchi boʻlsangiz, quyidagilarni bajaring:

1. Birinchi (muvaffaqiyatsiz) tarmoq tengdoshidan ma’lumotlarni nusxalaydigan ikkinchi Iroha tarmoq tengdoshi bilan ulaning.
2. Yangi tarmoq hamkasbining birinchi tarmoq hamkasbi bilan ma’lumotlarni sinxronlashtirishini kuting.
3. Yangi tarmoq hamkasbini faol qoldiring.
4. Faqat muvofiqlashtirilgan migratsiya doirasida birinchi tarmoq ishtirokchisining blockchain boshlang‘ich va konfiguratsiya fayllarini yangilash.

::: info

Jonli tarmoqda blockchain boshlang'ich nusxasini almashtirish uchun umumiy avtomatik qayta yozish yo'li mavjud emas. Buni muvofiqlashtirilgan migratsiya sifatida ko'ring: eski holatni saqlang, mos keluvchi tarmoq hamkasblarini ishga tushiring va faqat operatorlar migratsiya rejasida kelishib olgachgina validatsiya qiluvchilarni yangi konfiguratsiyaga o'tkazing.

:::

## Shaxsiy va ochiq kalitlarining Multihash formati {#multihash-format-of-private-and-public-keys}

Agar siz [mijoz konfiguratsiyasi](/uz/guide/configure/client-configuration.md)ga qarasangiz, u yerda tugmalar [ko‘p-xash format](https://github.com/multiformats/multihash)da berilganligini payqasangiz bo‘ladi.

Agar ilgari multi-hash bilan ishlamagan bo'lsangiz, o'ng tomondagi qism kalit baytlarining olti o'nlik emasligi (har bir uchun ikki belgi) deb hisoblash tabiiydir bayt), balki baytlar ASCII (yoki UTF-8) sifatida kodlangan bo‘lib, va `public_key` va `private_key` instantsiyalarda string literalga `from_hex` ni chaqiring.

Shuningdek, satr literalida `PrivateKey::try_from_str` chaqirish faqat to‘g‘ri kalitni beradi, deb taxmin qilish tabiiydir. Shunday qilib, agar siz kalitdagi bitlar sonini noto‘g‘ri topsangiz, masalan 32 bayt o‘rniga 64, bu xato xabarini keltirib chiqaradi.

Ikkala taxmin ham noto‘g‘ri. Afsuski, xato xabarlari aynan shu turdagi nosozlikni aniqlashda yordam bermaydi.

Qanday tuzatish: `hex_literal` ni ishlating. Bu shuningdek, xunuk belgilar ketma-ketligini ochiq-oydin olti burchakli raqamlar bilan chiroyli kichik jadvalga aylantiradi.

::: warning

Hatto `try_from_str` ijrosi ham berilgan satrning haqiqiy `PrivateKey` ekanligini tekshira olmaydi va agar bo'lmasa, ogohlantira olmaydi.

U ba'zi aniq xatolarni ushlaydi, masalan, agar satr noto'g'ri belgi o'z ichiga olsa. Biroq, biz ko'p kalit formatlarini qo'llab-quvvatlashni maqsad qilganimiz uchun, u boshqa biror narsani qilolmaydi. Shuningdek, u kalit berilgan hisob uchun to'g'ri shaxsiy kalit ekanligini aytolmaydi, agar siz ko'rsatma yubormasangiz.

:::

Bunday nozik xatoliklardan, masalan, to'g'ridan-to'g'ri satr literalidan deserializatsiya qilish orqali yoki ma'nosi bo'lgan joylarda yangi kalit juftini yaratish orqali qochish mumkin.
