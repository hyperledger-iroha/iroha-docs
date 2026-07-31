---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# bilan ishlash Iroha Ikkilamchi {#working-with-iroha-binaries}

O ' zbekiston Respublikasi Iroha 3 operator ish oqimi uchta asosiy ikkilamchi boʻyicha aylanadi:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) tengdoshlar daemonini boshqarganlik uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) uchun CLI va operator buyruqlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) kalitlar, genesis, lokal tarmoqlar va profillar uchun

## Manbaiga asoslanib quring {#build-from-source}

Yuqoridagi ish maydonining ildizidan:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Bo ' shish binarlari keyinchalik `target/release/`.

Qo'mondon yuzini tekshirish uchun:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repozitoriyadan toʻgʻridan-toʻgʻri ishga tushirish {#run-directly-from-the-repository}

Agar siz global ravishda biron bir narsani o'rnatishni istamasangiz, `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Rasm {#docker-image}

Yuqoridagi ish o'rinlari foydalanish `kagami localnet` va `kagami docker` ishlab chiqarish
Docker Compose cheklangan kodga mos keladigan fayllar. `hyperledger/iroha:dev`
tasvir hosil qilingan fayllar bilan ishlatilishi mumkin.

Ishlab boring CLI konteynerda:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Yugurish Kagami konteynerda:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Tengdoshlarni ishga tushirish uchun lokalnetni yarating va avval faylni yozing:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Qaysi ikkilamchini ishlatishim kerak? {#which-binary-should-i-use}

- Foydalanish `irohad` tengdoshlarni ishga tushirganingizda yoki boshqarayotganingizda.
- Foydalanish `iroha` katta kitobdan so'rov olish, tranzaksiyalarni taqdim etish yoki operator oxirgi nuqtalarini tekshirish kerak bo'lganda.
- Foydalanish `kagami` kalitlar, genesis manifestlari, profil to'plamlari yoki lokalnet aktivlari kerak bo'lganda.
