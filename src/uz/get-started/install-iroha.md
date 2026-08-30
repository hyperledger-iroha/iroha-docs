---
translation_locale: uz
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 o'rnatish {#install-iroha-3}

Ushbu sahifa Iroha 3 asbob-uskunalar zanjirining joriy o'rnatish ish oqimini va `hyperledger-iroha/iroha` yuqori tomondan ishlaydigan ish maydonidan foydalanuvchi binariylarni qamrab oladi.

## 1. Oldindan ko'rsatilgan shartlar {#_1-prerequisites}

Avval bularni oʻrnating:

- [rustup](https://www.rust-lang.org/tools/install), shuning uchun o'rnatilgan `rust-toolchain.toml` asboblar zanjirini (`1.93.1`) avtomatik ravishda o'rnatadi
- `git`
- Docker va Docker Compose lokal ko'p tenglamli tezkor ishga tushirish uchun;

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

Kichikroq operatorga mo'ljallangan qurilish uchun, faqat asosiy ikkilamchilarni yig'ish:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Natijada hosil bo'ladigan ikkilamchilar `target/debug/` yoki `target/release/` raqamiga yoziladi.

## 4. O'rnatilgan vositalarni tekshirish {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Siz odatda foydalanadigan toʻrtta ikkilamchi quyidagilar:

- `iroha3d` standart tengdoshlari uchun
- `iroha3d_taira` kanonik Taira tasdiqlovchi ishga tushiruvchi uchun
- `iroha` uchun CLI qo'llash Torii va operator oxirgi nuqtalari
- `kagami` kalitlar, genesis manifestlari va localnet profillari uchun

## 5. O'rinli Localnet va Docker yo'l {#_5-optional-localnet-and-docker-path}

Hozirgi manba tomonidan qo'llab-quvvatlanadigan lokalnet oqimi Kagami tomonidan yaratilgan. U tengdoshlari konfiguratsiyasi, genesis artefaktlari, mijoz konfiguratsiyasi, yordamchi skriptlar va checked-out kodga mos bo'lgan tanlovli Compose faylini yozadi:

- `kagami localnet` mahalliy tengdoshlari uchun skriptlar
- `kagami docker` uchun Docker Compose lokalnet ko'rsatkichidan hosil qilingan

[Lancing Iroha 3](/uz/get-started/launch-iroha.md) bilan davom eting.
