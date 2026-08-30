---
translation_locale: uz
translation_source: /help/deployment-issues.md
translation_source_hash: 5c7d26b39d4ddf4e7e164f7bef79c9e1659db51587fb0dde9cf3f1dc0e3b057b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻrnatish muammolarini hal qilish {#troubleshooting-deployment-issues}

Ushbu bo'limda Iroha 3 ishga tushirishlar uchun muammolarni hal qilish maslahatlari mavjud. Agar siz duch kelayotgan muammo bu erda tasvirlanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'lanishingiz mumkin.

## Yaratilgan asarlar bilan boshlang . {#start-with-generated-artifacts}

Mahalliy va sinov dasturlari uchun Kagami tomonidan yaratilgan artefaktlar qo'lda yozilgan tengdoshlari fayllaridan ko'ra afzalroq:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaratilgan direktoriyada tengdoshlari, genesis materiallari, boshlang'ich skriptlar va README qurilish liniyasi uchun Iroha 3 mavjud.

## Tengdoshlar boshlang'ich emas {#peer-does-not-start}

Avvalambor , ushbu narsalarni tekshirib koʻring:

- `iroha3d --config <path>` ko'rsatkichlar tengdoshning o'zi TOML faylida.
- `public_key` va `private_key` tengdoshlari konfiguratsiyasida bir xil kalit juftligidan iborat.
- `genesis.public_key` genesis tranzaksiyasini imzolash uchun ishlatilgan kalitga mos keladi.
- validator tengi identifikatsiyalari BLS-Normal kalitlardan foydalanadi, va `trusted_peers_pop` mahalliy kalit va ishonchli tengi uchun egalik to'g'risidagi hujjatni o'z ichiga oladi.
- Torii va P2P uchun portlar allaqachon boshqa jarayon bilan bog'liq emas.
- Kura do'kon direktoriyasi bir xil zanjirga tegishli bo'lib, boshqa tarmoq profilidan nusxa olingan emas.

Daemon birdan ko'proq TOML qatlamni o'qiganida konfiguratsiya izlashidan foydalaning:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker va tarkib {#docker-and-compose}

Generate Hozirgi Kagami lokalnet chiqishidan qo'shish, shunda buyruq satridagi argumentlar va konfiguratsiya fayllari checked-out kodga mos keladi:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Agar kompozitni ishga tushirish boshlansa va keyin to'xtasa, daemonlar jurnallarini tekshirib ko'ring:

- mos kelmagan `chain`
- bitta tengdoshi boshqacha genesis transaksiyasi yoki manifestidan foydalangan holda
- reklama qilingan P2P manzillari faqat konteynerlar tarmog'ida ishlaydi
- genesis qayta tiklanganidan so'ng mahalliy hajmni qayta ishlatish

Yangi genesisni sinovdan o'tkazganingizda, to'plamni qayta boshlashdan oldin eski Kura hajmlarni olib tashlang. Eski bloklarni yangi genesis bilan saqlash o'yinni muvaffaqiyatsiz qoldiradi.

## Kubernetes {#kubernetes}

Kubernetes uchun har bir validatorni davlatli infratuzilma sifatida qabul qiling:

- har bir tengdoshga barqaror identifikatsiya kalitini va barqaror doimiy hajmni berish
- P2P boshqa tengdoshlar klaster ichidan hal qilishlari mumkin bo'lgan manzillarni ochish
- konfiguratsiya va genesis fayllarini ishga tushirish uchun oʻzgarmas konfiguratsiya sifatida mount qilish
- barcha genesis yoki topologiya o'zgarishlarini avtomatik ravishda konfiguratsiya xaritasi yangilanishi sifatida emas, balki bila turib joriy etish

Agar pod takror-takror qayta ishga tushirilsa, poddagi o'rnatilgan konfiguratsiyani kutilayotgan [`peer.template.toml`](/uz/reference/peer-config/index.md#template) bilan taqqoslang va tengdoshi eski Kura ma'lumotlarni takrorlayapti yoki yo'qmi tekshirib ko'ring.

## Sora profili {#sora-profile}

Nexus, SoraFS yoki ko'p yo'nalishdagi oqimlardan foydalanuvchi Iroha 3 ishga tushirishlar Sora profilini qo'llab-quvvatlagan holda daemonni boshlash kerak:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Bir xil tarmoqdagi tasdiqlovchilarda bir xil profildan muntazam foydalanish.
