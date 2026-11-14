---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: 75848623e735abc80326f9ebda6f74ab438b67eaeddeacdd4d8c5509856a999e
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha Binarlar bilan ishlash {#working-with-iroha-binaries}

Iroha 3 operator ish jarayoni to'rtta asosiy ikkilik atrofida aylanadi:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad) tugun daemonini ishga tushirish uchun
- `iroha3d_taira` kanonik Taira tasdiqlovchi tugunini ishga tushirish uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli) uchun CLI va operator buyruqlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) kalitlar, blokcheyn genesis, lokal tarmoqlar va profillar uchun

## Manbadan yarating {#build-from-source}

Yuqori oqim ish maydoni ildizidan:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Chiqarish binary fayllari shundan so‘ng `target/release/` da mavjud bo‘ladi.

Buyruq sirtini tekshirish uchun:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## To'g'ridan-to'g'ri repozitoriyadan ishga tushiring {#run-directly-from-the-repository}

Agar hech narsani global tarzda o‘rnatishni xohlamasangiz, `cargo run` dan foydalaning:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Rasm {#docker-image}

Asosiy ish maydoni tekshirilayotgan kodga mos Docker Compose fayllarini yaratish uchun `kagami localnet generate` va `kagami docker`dan foydalanadi. `hyperledger/iroha:dev` tasvirini shu yaratilgan fayllar bilan ishlatish mumkin.

Konteynerda CLI ni ishga tushiring:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Konteynerda Kagami ni ishga tushiring:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Tarmoq peerini ishga tushirish uchun avval localnet va Compose faylini yarating:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Qaysi ikkilikni ishlatishim kerak? {#which-binary-should-i-use}

- Ochiq Taira tasdiqlovchi relizidan tashqaridagi tugunlarni ishga tushirish yoki boshqarish uchun `iroha3d` dan foydalaning.
- `iroha3d_taira --sora` dan faqat kanonik Taira tasdiqlovchi tugunini joylashtirishda foydalaning; u Taira zanjiri, saqlash va bajarish muhiti imzolovchisi profilini majburiy qo‘llaydi.
- Reyestrga so‘rov berish, tranzaksiyalar yuborish yoki operator endpointlarini tekshirish zarur bo‘lsa, `iroha`dan foydalaning.
- Kalitlar, boshlang‘ich holat manifestlari, profil to‘plamlari yoki mahalliy tarmoq resurslari kerak bo‘lsa, `kagami` dan foydalaning.
