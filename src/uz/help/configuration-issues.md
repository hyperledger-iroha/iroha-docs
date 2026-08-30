---
translation_locale: uz
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiguratsiya muammolarini hal qilish {#troubleshooting-configuration-issues}

Ushbu boʻlimda muammolarni hal qilish uchun maslahatlar mavjud Iroha 3 Konfiguratsiya. [kalitlarni tekshirgan .](./overview.md#check-the-keys) birinchidan, bu muammolarning eng keng tarqalgan manbai bo'lganligi sababli Iroha.

Agar siz boshdan kechirayotgan muammo bu erda tasvirlanmagan bo'lsa, [Telegram ](https://t.me/hyperledgeriroha) orqali biz bilan bog'laning.

## Docker Compose sozlash usulidagi eskirgan genesis {#outdated-genesis-on-a-docker-compose-setup}

Agar siz Docker Compose tahririda Iroha, siz tengdoshlari konteynerlaridan biri bilan muvaffaqiyatsizlikka uchrashishingiz mumkin `Failed to deserialize raw genesis block` xato. Bu odatda tengdosh, imzolangan genesis tranzaksiyasi va hosil qilingan konfiguratsiya turli xil Iroha qayta ko'rib chiqish yoki profillar.

Muvaffaqiyatni quyidagi qadamlar bilan tekshirish:

1. Joriy konteynerlarni tekshirish uchun `docker ps` dan foydalaning. Yaratilgan profilga qarab, siz odatda `hyperledger/iroha:dev` konteynerlarini ko'rasiz. Andoza Docker Compose profilida to'rtta tengdosh konteyner mavjud, garchi sizning yaratilgan `docker-compose.yml` tarkibingiz farq qilishi mumkin.

2. Loglarni tekshiring va `Failed to deserialize raw genesis block` xatosi uchun qidiring. Agar siz Iroha ni daemon rejimida `docker compose up -d` bilan boshlagan bo'lsangiz, `docker compose logs` buyruqidan foydalaning.

Bunday muammoni hal qilish usuli Iroha dan foydalanishga bog'liq. Agar bu asosiy demo bo'lsa va siz tengdoshlar ma'lumotlarini saqlab qolishingiz shart emas bo'lsa, Kagami bilan mos localnet yoki Docker Compose paketini qayta tiklang:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

So'ngra eski konteyner holatini olib tashlang va qayta tiklangan `genesis.signed.nrt`, `config.toml` va `client.toml` fayllaridan qaytadan ishga tushiring.

Agar Iroha instansiyasi ma'lumotlarini tiklash kerak bo'lsa, quyidagilarni bajaring:

1. Ikkinchi Iroha tenglamasini u birinchi (maslahatli) tenglamadan olingan ma'lumotlarni nusxa ko'rsatadi.
2. Yangi tengdosh ma'lumotlarni birinchi tengdosh bilan sinxronizatsiya qilishini kuting.
3. Yangi tengdoshni faol qoldiring.
4. Birinchi tengdoshning genesis va konfiguratsiya fayllarini faqat muvofiqlashtirilgan migratsiya qismi sifatida yangilang.

::: info

To'g'ridan-to'g'ri tarmoqda genesisni almashtirish uchun umumiy avtomatik qayta yozish yo'li mavjud emas. Buni muvofiqlashtirilgan migratsiya sifatida ko'rib chiqing: eski holatni saqlab qoling, moslashuvchan tengdoshlarni keltiring va validatorlarni faqat operatorlar migratsiya rejasi haqida kelishib olgach yangi konfiguratsiyaga o'tkazish kerak.

:::

## Maxfiy va ommaviy kalitlarning ko'p hash formatlari {#multihash-format-of-private-and-public-keys}

Agar siz [ mijoz konfiguratsiyasini](/uz/guide/configure/client-configuration.md) ko'rsangiz, u erda kalitlar [ ko'p hash formatida berilganligini ko'rasiz ](https://github.com/multiformats/multihash).

Agar siz ilgari ko'p hash bilan ishlamagan bo'lsangiz, o'ng tomon kalit bytlarning (baytga ikkita ramz) hexadecimal ifoda emasligini (yoki ASCII yoki UTF-8 sifatida kodlangan bytlar) tasavvur qilish tabiiydir; `public_key` va `private_key` nusxalari bo'yicha har ikki qatorda `from_hex` chaqirib qo'ying.

Bundan tashqari, `PrivateKey::try_from_str` so'rash faqat to'g'ri kalitni beradi deb taxmin qilish tabiiy. Shunday qilib, agar siz kalitdagi bitlar sonini noto'g'ridan ko'rsangiz, masalan, 32 bytes vs 64.

Ikkala tasavvur ham noto'g'ri. Afsuski, xato xabarlari bunday xatolarni bartaraf etishda yordam bermaydi.

Qanday tuzatish kerak: `hex_literal` dan foydalaning. Bu, shuningdek, chiroyli belgilar qatorini oltita o'nlik raqamlardan iborat yaxshi kichik jadvalga aylantiradi.

::: warning

Hatto `try_from_str` implementatsiyasi ham ma'lum bir satrning haqiqiy `PrivateKey` bo'lishini tekshirib ko'ra olmaydi va agar yo'q bo'lsa ogohlantirmaydi.

U ba'zi aniq xatolarni topadi, masalan, agar satrda haqiqiy bo'lmagan ramz mavjud bo'lsa. Biroq, biz ko'plab kalit formatlarini qo'llab-quvvatlashni maqsad qilganimiz sababli, u boshqa ko'p narsani qila olmaydi. Agar siz ko'rsatma taqdim etmasangiz, ma'lum hisob uchun kalit to'g'ri xususiy kalitmi yoki yo'qmi bilmaydi.

:::

Bunday nozik xatolarga yo'l qo'ymaslik mumkin, masalan, to'g'ridan-to'g'ri simli literallardan deseriallashtirish yoki ma'noga ega bo'lgan joylarda yangi kalitlar juftligini yaratish.
