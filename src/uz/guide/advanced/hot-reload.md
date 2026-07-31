---
translation_locale: uz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Issiq qayta yuklash Iroha a Docker Konteyner {#hot-reload-iroha-in-a-docker-container}

Faqat mahalliy xatolar uchun issiq qayta yuklashdan foydalaning.
tasvirni qayta tiklash yoki yaratilgan rasmni qayta ishga tushirish Docker Compose a-dan toʻplangan
yangi Kagami to'plam.

## Tengdoshlar ikkilamchiligini almashtirish {#replace-the-peer-binary}

Yuqori oqimdagi ish maydonidan Linux-ga mos boʻlgan daemonlar binarini yaratish:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Uni ishlayotgan tengdoshlari konteynerlariga nusxa ko'chirib, so'ngra konteynerni qayta ishga tushiring:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Foydalanish `docker ps` Konteyner nomini tasdiqlash uchun.
konteynerlar quyidagicha aniqlanadi: `./localnet/docker-compose.yml`.

## Bir martalik tarmog'da "Genesis" ni qayta ishga tushiring {#recommit-genesis-in-a-disposable-network}

Bir tengdosh genesis faqat uning ombor bo'sh bo'lganda amalga oshiradi. Docker
tarmoq, to'plamni to'xtatish, hosil bo'lgan holatni olib tashlash, regeneratsiya qilish yoki almashtirish
imzolangan genesis to'plami, va yana boshlash:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

O'z holatini saqlab qolish kerak bo'lgan tarmoqda genesisni almashtirmang.

## Oʻzlashtirilgan konfiguratsiyadan foydalanish {#use-custom-configuration}

Joriy tengdoshlar konfiguratsiyasi TOML. Ishlab chiqarilganni bogʻlash yoki nusxa olish
`config.toml`, `genesis.signed.nrt`, va konteynerga tegishli kalit fayllar
Rasmdan kutilayotgan yo'llar, so'ngra tengdoshni qayta ishga tushiring.
birgalikda; turli xil fayllarni aralashtirish Kagami o'tish deserializatsiyani yoki
konsensus muvaffaqiyatsiz tug'ilishi.
