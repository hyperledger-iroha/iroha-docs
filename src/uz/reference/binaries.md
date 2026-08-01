---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ikkilamchilar bilan ishlash {#working-with-iroha-binaries}

Iroha 3 operatorning ish oqimi uchta asosiy ikkilamchi bo'yicha aylanadi:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) tengdoshlar daemonini ishlatish uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) uchun CLI va operator qo'mondonlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) kalitlar, genesis, lokal tarmoqlar va profillar uchun

## Manbaiga asoslanib quring {#build-from-source}

Yuqori oqimdagi ish maydonining ildizidan:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Bo'shash binarlari keyinchalik `target/release/` da mavjud bo'ladi.

Boshqaruv yuzasini tekshirish uchun:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repozitoriyadan toʻgʻridan-toʻgʻri ishga tushirish {#run-directly-from-the-repository}

Agar siz global ravishda biron bir narsani o'rnatishni istamasangiz, `cargo run` dan foydalaning:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Rasm {#docker-image}

Yuqori oqimdagi ish maydonida `kagami localnet` va `kagami docker` kodga mos bo'lgan Docker Compose fayllarini hosil qilish uchun ishlatiladi. `hyperledger/iroha:dev` tasviridan ushbu hosil qilingan fayllar bilan foydalanish mumkin.

CLI ni konteynerda ishga tushiring:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami konteynerda ishlatilsin:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Tengdoshlarni ishga tushirish uchun lokalnetni yaratish va birinchi navbatda faylni yozish:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Qaysi binarydan foydalanishim kerak? {#which-binary-should-i-use}

- Tengdoshlaringiz bilan ishlashni boshlaganingizda `irohad` dan foydalaning.
- `iroha` dan foydalanib, katta daftarni so'rovlash, tranzaksiyalarni taqdim etish yoki operator oxirgi nuqtalarini tekshirish kerak bo'lganda foydalaning.
- `kagami` kalitlar, genesis manifestlari, profil to'plamlari yoki localnet aktivlariga muhtoj bo'lganda ishlating.
