---
translation_locale: uz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker konteynerida issiq qayta yuklash Iroha {#hot-reload-iroha-in-a-docker-container}

Faqat mahalliy debug qilish uchun issiq qayta yuklashdan foydalaning. Oddiy lokal rivojlanish uchun rasmni qayta qurish yoki hosil qilingan Docker Compose to'plamini yangi Kagami paketidan qayta ishga tushirishni afzal ko'ring.

## Tengdoshlar binary oʻrniga {#replace-the-peer-binary}

Yuqori oqimdagi ish maydonidan Linux-ga mos boʻlgan daemon ikkilamchiini yaratish:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Uni ishlayotgan tengdosh konteynerga nusxa ko'chirib, keyin konteynerni qayta ishga tushiring:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Konteyner nomini tasdiqlash uchun `docker ps` dan foydalaning. Ishlab chiqarilgan to'plamda tengdoshlari `./localnet/docker-compose.yml` bilan belgilanadi.

## Bir martalik tarmog'da Genesisni qayta ishga tushiring {#recommit-genesis-in-a-disposable-network}

Bir tengdoshi genesisni faqat uning saqlanishi bo'sh bo'lganda amalga oshiradi. bir martalik Docker tarmog'i uchun to'plamni to'xtatish, hosil qilingan holatni olib tashlash, imzolangan genesis paketini qayta tiklash yoki almashtirish va yana boshlash:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

O'z holatini saqlab qolish kerak bo'lgan tarmoqda genesis o'rniga olmang.

## Andoza sozlash {#use-custom-configuration}

Joriy tenglamchi konfiguratsiyasi TOML hisoblanadi. Ishlab chiqarilgan `config.toml`, `genesis.signed.nrt` va tegishli kalit fayllarni rasm kutib turgan konteyner yo'nalishlariga bog'lash yoki nusxa olish, so'ngra tenglamchini qayta ishga tushiring. Ishlab chiqarilgan fayllarni birlashtiring; turli xil Kagami ishlardan fayllarni aralashtirish deserializatsiya yoki konsensus muvaffaqiyatsizligiga olib kelishi mumkin.
