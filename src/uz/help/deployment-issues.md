---
translation_locale: uz
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishlab chiqarish muammolarini hal qilish {#troubleshooting-deployment-issues}

Ushbu boʻlimda muammolarni hal qilish uchun maslahatlar mavjud Iroha 3 ishga tushirish. Agar muammoni
siz boshdan kechirayotgan voqealar bu yerda tasvirlanmagan.
biz bilan bog'laning [Telegram](https://t.me/hyperledgeriroha).

## Yaratilgan asarlar bilan boshlash {#start-with-generated-artifacts}

Mahalliy va sinov dasturlari uchun Kagami oʻrniga
qo'lda yozilgan tengdosh fayllaridan:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ishlab chiqarilgan direktoriyada tengdoshlari, genesis materiallari, boshlang
skriptlar va a README uchun Iroha 3 qurilish liniyasi.

## Tengdoshlar boshlanmaydi {#peer-does-not-start}

Avval ushbu moddalarni tekshirib koʻring:

- `irohad --config <path>` tengdoshning o'zidagi nuqtalar TOML fayl.
- `public_key` va `private_key` tengdoshlar konfigida bir xil kalitga tegishli
  Bir juftlik.
- `genesis.public_key` genesis transaksiyasini imzolash uchun ishlatilgan kalitga mos keladi.
- identifikatsiyalash vositasi BLS-Normal kalitlar va `trusted_peers_pop`
  mahalliy kalit va ishonchli tengdoshlar uchun egalik guvohnomasini o'z ichiga oladi.
- portlar uchun Torii va P2P boshqa jarayon bilan bog'liq emas.
- ko'rsatilgan Kura do'kon direktoriyasi bir xil zanjirga tegishli bo'lib,
  turli tarmoq profillari.

Daemon birdan koʻproq oʻqiganida konfiguratsiya izlashidan foydalaning TOML qatlam:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker va kompozitsiya {#docker-and-compose}

Joriy tarkibdan yaratish Kagami lokalnet natijasi, shuning uchun buyruq liniyasi
argumentlar va konfiguratsiya fayllari cheklangan kod bilan mos keladi:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Agar kompozitni ishga tushirish boshlansa va keyin to'xtasa, daemon loglarini tekshirib ko'ring:

- mos kelmagan `chain`
- bir tengdosh boshqa genesis muomalasi yoki manifestdan foydalangan holda
- reklama qilingan P2P konteynerlar tarmog'ida ishlaydigan manzillar
- genesis qayta tiklanganidan keyin mahalliy hajmni qayta ishlatish

Yangi genesisni sinab ko'rganingizda eski genesisni olib tashlang. Kura qayta ishga tushirishdan oldin hajmlar
Eski bloklarni yangi genesis bilan saqlash o'yinni muvaffaqiyatsiz qoldiradi.

## Kubernetes {#kubernetes}

Kubernetes uchun har bir tasdiqlovchiga davlatli infratuzilma sifatida qarash:

- har bir tengdoshga barqaror identifikatsiya kalitini va barqaror doimiy hajmni berish
- oshkor qilish P2P klaster ichida boshqa tengdoshlar hal qilishi mumkin bo'lgan manzillar
- ko'chirish uchun o'zgarmas konfiguratsiya sifatida konfig va genesis fayllarini mount
- barcha genesis yoki topologiya o'zgarishlarini avtomatik ravishda emas, balki bila turib amalga oshirish
  konfiguratsiya xaritasi yangilanishi

Agar pod takror-takror qayta ishga tushirilgan bo'lsa, poddagi ko'rsatilgan konfiguratsiyani
kutilmoqda [`peer.template.toml`](/uz/reference/peer-config/index.md#template) va
tengdoshi eski o'yinlarni takrorlayotgani yoki yo'qligini tekshirish Kura ma'lumotlar.

## Sora profili {#sora-profile}

Iroha 3 foydalanadigan joylashtirish Nexus, SoraFS, yoki ko'p yo'nalishdagi oqimlar boshlanishi kerak
Sora profilini o'z ichiga olgan demon:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Xuddi shu tarmoqdagi tasdiqlovchilardan muntazam ravishda bir xil profildan foydalaning.
