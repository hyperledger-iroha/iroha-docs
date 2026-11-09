---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Binarlar bilan ishlash {#working-with-iroha-binaries}

Iroha 3 operator ish jarayoni to'rtta asosiy ikkilik atrofida aylanadi:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) tugun daemonini ishga tushirish uchun
- `iroha3d_taira` kanonik Taira tasdiqlovchi tugunini ishga tushirish uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) uchun CLI va operator buyruqlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) kalitlar, blokcheyn genesis, lokal tarmoqlar va profillar uchun

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

Docker’da bir xil manba versiyasidan yigʻilgan bajariladigan fayllar bilan toʻrtta validatorni ishga tushirish uchun [Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) qoʻllanmasiga amal qiling.

## Qaysi ikkilikni ishlatishim kerak? {#which-binary-should-i-use}

- Ochiq Taira tasdiqlovchi relizidan tashqaridagi tugunlarni ishga tushirish yoki boshqarish uchun `iroha3d` dan foydalaning.
- `iroha3d_taira --sora` dan faqat kanonik Taira tasdiqlovchi tugunini joylashtirishda foydalaning; u Taira zanjiri, saqlash va bajarish muhiti imzolovchisi profilini majburiy qo‘llaydi.
- `iroha` dan blockchain daftarini so‘rash, tranzaksiyalarni yuborish yoki operator API tugunlarini tekshirish kerak bo‘lganda foydalaning.
- Kalitlar, boshlang‘ich holat manifestlari, profil to‘plamlari yoki mahalliy tarmoq resurslari kerak bo‘lsa, `kagami` dan foydalaning.
