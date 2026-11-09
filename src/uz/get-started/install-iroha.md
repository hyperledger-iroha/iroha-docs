---
translation_locale: uz
translation_source: /get-started/install-iroha.md
translation_source_hash: f7f68228d219cc1c0ea5af128ba5dc956640df8a3d264ed3a4862447b3348a7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 ni o'rnatish {#install-iroha-3}

Ushbu sahifa Iroha 3 asboblar toʻplami va baytlar fayllarini yuqori darajadagi `hyperledger-iroha/iroha` ish maydoni orqali hozirgi oʻrnatish ish jarayonini qamrab oladi.

Bevosita xostga o‘rnatish uchun quyidagi Rust ko‘rsatmalariga amal qiling. Docker bilan to‘rtta validatorni ishga tushirish uchun [Iroha 3 ni ishga tushirish](/uz/get-started/launch-iroha.md) qo‘llanmasidan boshlang.

## 1. Oldindan talablar {#_1-prerequisites}

Avval bularni o‘rnating:

- [rustup](https://www.rust-lang.org/tools/install), shuning uchun biriktirilgan `rust-toolchain.toml` asboblar to'plami (`1.93.1`) avtomatik ravishda o'rnatiladi
- `git`
- ixtiyoriy ravishda, mahalliy ko‘p ulanuvchi tezkor boshlash uchun Docker va Docker Compose

## 2. Ish joyini klonlash {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Ish joyini qurish {#_3-build-the-workspace}

Hammamizni qur:

```bash
cargo build --workspace
```

Kichikroq operatorga yo'naltirilgan qurilish uchun, faqat asosiy binar fayllarni kompilyatsiya qiling:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Hosil bo'lgan ikkilik fayllar `target/debug/` yoki `target/release/` ga yoziladi.

## 4. O‘rnatilgan Asboblarni Tekshiring {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Siz odatda ishlatasiz to'rtta ikkilik fayllar quyidagilar:

- `iroha3d` standart tarmoq tengdosh daemon uchun
- `iroha3d_taira` kanonik Taira tasdiqlovchi tugunini ishga tushirish uchun
- `iroha` Torii va operator API endpointlariga CLI kirish uchun
- `kagami` kalitlar, blokcheyn genesis manifestlari va localnet profillari uchun

## 5. Ixtiyoriy Localnet va Docker Yo‘l {#_5-optional-localnet-and-docker-path}

Hozirgi manba bilan qo‘llab-quvvatlanadigan localnet oqimi Kagami tomonidan yaratiladi. U tarmoq hamkasblari konfiguratsiyalarini, blokcheyn genesis fayllarini, mijoz konfiguratsiyasini, yordamchi skriptlarni va tekshirilgan kodga mos keladigan ixtiyoriy Compose faylini yozadi:

- `kagami localnet` mahalliy tarmoq tengdosh skriptlari uchun
- Docker Compose uchun `kagami docker` localnet papkasidan yaratilgan

[Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) bilan davom eting.
