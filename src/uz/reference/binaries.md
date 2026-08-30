---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ikkilamchilar bilan ishlash {#working-with-iroha-binaries}

Iroha 3 operatorning ish oqimi to'rtta asosiy ikkilamchi bo'yicha aylanadi:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) tengdoshlar daemonini ishlatish uchun
- `iroha3d_taira` kanonik Taira tasdiqlovchi ishga tushiruvchi uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) uchun CLI va operator qo'mondonlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) kalitlar, genesis, lokal tarmoqlar va profillar uchun

## Manbaiga asoslanib quring {#build-from-source}

Yuqori oqimdagi ish maydonining ildizidan:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Bo'shash binarlari keyinchalik `target/release/` da mavjud bo'ladi.

Boshqaruv yuzasini tekshirish uchun:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repozitoriyadan toʻgʻridan-toʻgʻri ishga tushirish {#run-directly-from-the-repository}

Agar siz global ravishda biron bir narsani o'rnatishni istamasangiz, `cargo run` dan foydalaning:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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

Tengdoshlarni ishga tushirish uchun lokalnetni yarating va avval faylni yozing:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Qaysi binarydan foydalanishim kerak? {#which-binary-should-i-use}

- Umumiy Taira tasdiqlovchidan tashqarida tengdoshlarni ishga tushirganingizda yoki ishlatganingizda `iroha3d` dan foydalaning.
- `iroha3d_taira --sora` ni faqat kanonik Taira validatorni ishga tushirish uchun ishlating; u Taira ning zanjir, saqlash va ish vaqti belgisi profilini o'z ichiga oladi.
- `iroha` dan foydalanib, katta daftarni so'rovlash, tranzaksiyalarni taqdim etish yoki operator oxirgi nuqtalarini tekshirish kerak bo'lganda foydalaning.
- `kagami` kalitlar, genesis manifestlari, profil to'plamlari yoki localnet aktivlariga muhtoj bo'lganda ishlating.
