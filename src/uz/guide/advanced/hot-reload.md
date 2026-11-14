---
translation_locale: uz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: d4fd88de377b9c88e0293ed07f307ad38c3f8b05ed898fd051c5bfb738d66681
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Issiq Qayta Yuklash Iroha bir Docker konteynerda {#hot-reload-iroha-in-a-docker-container}

Faqat mahalliy nosozlikni tuzatishda hot reload-dan foydalaning. Oddiy mahalliy rivojlantirish uchun esa, tasvirni qayta qurish yoki yaratilgan Docker Compose stekni yangi Kagami paketidan qayta ishga tushirishni afzal ko‘ring.

## Tarmoq qo‘shnisi Binary ni almashtiring {#replace-the-peer-binary}

Yuqori oqim ish maydonchasidan Linux-ga mos daemon ikkilik faylini tuzing:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Uni ishlayotgan tugun konteyneriga ko‘chiring, so‘ng o‘sha konteynerni qayta ishga tushiring:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

`docker ps` dan konteyner nomini tasdiqlash uchun foydalaning. Yaratilgan stekda tarmoq tengdoshlari konteynerlari `./docker-compose.yml` tomonidan aniqlanadi.

## Bir martalik Tarmoqda blockchain asosini qayta majbur qilish {#recommit-genesis-in-a-disposable-network}

Tarmoq uzviyosi blockchain genesisini faqat saqlash joyi bo'sh bo'lganda yakunlaydi. Bir martalik Docker tarmoq uchun stakni to'xtating, yaratilgan holatni o'chiring, imzolangan blockchain genesis paketini qayta yarating yoki almashtiring va yana ishga tushiring:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Holati saqlanishi kerak bo‘lgan tarmoqda blokcheyn genizisini almashtirmang.

## Maxsus Sozlamalardan Foydalaning {#use-custom-configuration}

Joriy tugun konfiguratsiyasi TOML formatida. Yaratilgan `config.toml`, `genesis.signed.nrt` va tegishli kalit fayllarini tasvir kutgan konteyner yo‘llariga ulang yoki ko‘chiring, keyin tugunni qayta ishga tushiring. Yaratilgan fayllarni birga saqlang; turli Kagami ishlaridagi fayllarni aralashtirish deserializatsiya yoki konsensus xatolariga olib kelishi mumkin.
