---
translation_locale: uz
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiguratsiya muammolarini hal qilish {#troubleshooting-configuration-issues}

Ushbu boʻlimda muammolarni hal qilish uchun maslahatlar mavjud Iroha 3 Konfiguratsiya.
[kalitlarni tekshirgan](./overview.md#check-the-keys) birinchi navbatda, chunki u eng
O'zbekiston Respublikasining Iroha.

Agar siz boshdan kechirayotgan muammo bu erda tasvirlanmagan bo'lsa, biz bilan bog'laning
[Telegram](https://t.me/hyperledgeriroha).

## A-ning eski genesis Docker Compose o'rnatish {#outdated-genesis-on-a-docker-compose-setup}

Agar siz Docker Compose tahririda Iroha, siz uchrashishingiz mumkin
tengdosh konteynerlardan birining muammosi
`Failed to deserialize raw genesis block` Bu odatda tengdoshni anglatadi,
imzolangan genesis transaksiyasi va hosil qilingan konfiguratsiya ishlab chiqilgan
farq qiladi Iroha qayta ko'rib chiqish yoki profillar.

Muvaffaqiyatni quyidagi qadamlar bilan tekshirish:

1. Foydalanish `docker ps` Joriy konteynerlarni tekshirish uchun.
   yaratilgan profil, siz odatda ko'rasiz `hyperledger/iroha:dev`
   konteynerlar. Docker Compose profilda toʻrt nafar tengdosh mavjud
   konteynerlar, ammo siz ishlab chiqargan `docker-compose.yml` farq qilishi mumkin.

2. Yozuvlarni tekshiring va
   `Failed to deserialize raw genesis block` xato. Agar siz boshlagan
   Iroha daemon rejimida `docker compose up -d`, foydalanish
   `docker compose logs` buyruq.

Bunday muammoni hal qilishning usuli Iroha. Agar bu
asosiy demo va siz tengdoshlar ma'lumotlarini saqlab qolish kerak emas, o'xshash qayta tiklash
lokal tarmoq yoki Docker Compose bilan toʻplam Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Keyin eski konteyner holatini olib tashlang va qayta tiklangan konteynerdan qaytadan ishga tushiring
`genesis.signed.nrt`, tengdoshlar `config.toml` fayllar va `client.toml`.

Agar siz o ' rnini tiklashingiz kerak bo ' lsa Iroha misol ma'lumotlari, quyidagilarni bajaring:

1. Ikkinchisini ulash Iroha birinchi raqamdagi ma'lumotlarni nusxa oladigan tengdosh
   O'z tengdoshlari.
2. Yangi tengdosh ma'lumotlarni birinchi tengdosh bilan sinxronlashtirishini kuting.
3. Yangi tengdoshni faol qoldiring.
4. Birinchi tengdoshlari genesis va konfiguratsiya fayllarini faqat
   muvofiqlashtirilgan migratsiya.

::: info

Genesisni jonli o'rnatish uchun umumiy avtomatik qayta yozish yo'li mavjud emas
Bu birlashtirilgan migratsiya sifatida qabul qiling: eski davlatni saqlab qolish,
moslashtiriladi, va faqat validatorlarni yangi konfiguratsiyaga ko'chirish
operatorlar migratsiya rejasi haqida kelishib olishadi.

:::

## Xususiy va ommaviy kalitlarning ko'p hash formatlari {#multihash-format-of-private-and-public-keys}

Agar siz
[mijoz konfiguratsiyasi](/uz/guide/configure/client-configuration.md), siz
ko'rsatilgan kalitlar
[ko'p hash formatlari](https://github.com/multiformats/multihash).

Agar siz ilgari ko'p hash bilan ishlamagan bo'lsangiz,
o'ng tomondagi kalit bytlarning hexadecimal ifodalari mavjud emas
(bir byte uchun ikki ramz), balki kodlangan byte ASCII (yoki UTF-8),
va qoʻngʻiroq qilish `from_hex` ikkalada ham simli literalda `public_key` va
`private_key` tashabbus ko'rsatish.

Bundan tashqari, chaqirish `PrivateKey::try_from_str` to ' g'risida
Agar siz raqamni topsangiz
noto'g'ri kalitdagi bitlar, masalan 32 byt vs. 64, bu xato tug'diradi
xabar.

**Bu ikki tasavvur ham noto'g'ri.** Afsuski, xato xabarlari
bu kabi muvaffaqiyatsizliklarni bartaraf etishga yordam bermaydi.

**Qanday qilib tuzatish kerak**: foydalanish `hex_literal`. Bu , shuningdek , yomon qatorga aylanadi .
belgilar, aniq oltita o'nlik raqamlardan iborat ajoyib kichik jadvalga.

::: warning

Hatto `try_from_str` amalga oshirish ma'lum bir satrning
amal qiladi `PrivateKey` va agar yo'q bo'lsa, ogohlantiraman.

U ba'zi aniq xatolarni topadi, masalan, agar satrda haqiqiy bo'lmagan
Biroq, biz ko'plab asosiy formatlarni qo'llab-quvvatlashni maqsad qilganimiz sababli, bu juda ko'p narsa qila olmaydi.
Bu kalitning _to'g'ri_ maxfiy kalit _berilgan
hisob_ yoki, agar siz yo'l-yo'riq bermasangiz.

:::

These ko'plab nozik xatolardan, masalan:
to'g'ridan-to'g'ri simli literallardan deseriallashtirish yoki yangi
mazmunli joylarda kalit juftligi.
