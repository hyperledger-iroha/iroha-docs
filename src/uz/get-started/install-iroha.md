---
translation_locale: uz
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻrnatish Iroha 3 {#install-iroha-3}

Ushbu sahifa joriy instalatsiya ish oqimini oʻz ichiga oladi Iroha 3 asbob-uskunalar zanjiri
va yuqori oqimdan foydalanuvchi ikkilamchi `hyperledger-iroha/iroha` ish joyi.

## 1. Kerak-sharoitlar {#_1-prerequisites}

Avval quyidagilarni oʻrnating:

- [rustup](https://www.rust-lang.org/tools/install), Shunday qilib,
  `rust-toolchain.toml` asbob-uskunalar zanjiri (`1.93.1`) avtomatik ravishda o ' rnatilgan
- `git`
- ixtiyoriy ravishda, Docker va Docker Compose mahalliy ko'p tenglamli tezkor ishga tushirish uchun

## 2. Ish joyini klonlash {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Ish joyini quring {#_3-build-the-workspace}

Hamma narsani quring:

```bash
cargo build --workspace
```

Kichikroq operatorga mo'ljallangan qurilish uchun faqat asosiy ikkilamchilarni yig'ish:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Natijada hosil boʻlgan ikkilamchilar quyidagicha yozilgan: `target/debug/` yoki `target/release/`.

## 4. Qurilgan vositalarni tekshirish {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Siz odatda ishlatadigan uchta ikkilamchi quyidagilardir:

- `irohad` tengdoshlar uchun
- `iroha` uchun CLI qo'llash Torii va operator oxirgi nuqtalari
- `kagami` kalitlar, genesis manifestlari va lokalnet profillari uchun

## 5. O'z navbatida lokalnet va Docker Yoʻl {#_5-optional-localnet-and-docker-path}

Hozirgi manba tomonidan qo'llab-quvvatlanadigan lokal tarmoq oqimi Kagami. U tengdoshlarni yozadi
konfig, genesis artefaktlari, mijoz konfig, yordamchi skriptlar va fakultativ
Checked-out kodga mos keladigan faylni yozish:

- `kagami localnet` mahalliy tengdoshlari nusxalari uchun
- `kagami docker` uchun Docker Compose lokalnet direktoriyasidan yaratilgan

davom eting [Uchratish Iroha 3](/uz/get-started/launch-iroha.md).
