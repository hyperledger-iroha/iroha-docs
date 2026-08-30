---
translation_locale: uz
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal bilan ishlaydi {#running-iroha-on-bare-metal}

Ushbu ish oqimini Docker Compose orqali emas, balki hostida to'g'ridan-to'g'ri tengdoshlarni ishga tushirishni istasangiz foydalaning. Hozirgi manba daraxtida Kagami generatorlari mavjud bo'lib, ular moslashtirilgan genesis, tengdoshlar konfiguratsiyasi, mijozlar konfiguratsiyasi va boshlash / tugatish skriptlarini yozadi.

## 1. Ikkilamchilarni yaratish {#_1-build-the-binaries}

Iroha ish maydonidan:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Bu quyidagilarni hosil qiladi:

- `target/release/iroha3d` tengdoshlari uchun
- CLI uchun `target/release/iroha`
- `target/release/kagami` kalit, genesis va localnet ishlab chiqarish uchun

## 2. Mahalliy tarmoq yaratish {#_2-generate-a-local-network}

To'rt tengli Iroha 3 lokal tarmog'ini yaratish:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Ishlab chiqarish direktoriyasida `genesis.json`, `genesis.signed.nrt`, tengdoshi `config.toml` fayllari, `client.toml`, yordamchi skriptlar va ushbu to'plam uchun aniq buyruqlar mavjud bo'lgan `README.md` hosil qilingan direktoriyasi mavjud.

## 3. Tengdoshlar bilan ishlashni boshlash {#_3-start-peers}

Yaratilgan bir martalik lokalnet uchun yaratilgan skriptdan foydalaning:

```bash
./localnet/start.sh
```

Agar siz har bir tengdoshni systemd kabi jarayon boshqaruvchisiga ulashingiz kerak bo'lsa, har bir tengdoshi uchun `./localnet/README.md` da qayd etilgan ishga tushirish buyruqidan foydalaning. Har bir tengdoshining `config.toml`, xususiy kalitini, saqlash direktoriyasini va portlarini alohida saqlang.

## 4. Tarmoqni boshqarish {#_4-operate-the-network}

&amp; amp; hosil qilingan mijoz konfiguratsiyasidan foydalanish:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Ishlab chiqarilgan localnetni toʻxtatish:

```bash
./localnet/stop.sh
```

## 5. Ishlab chiqarish ma'lumotlari {#_5-production-notes}

- Mahsulot uchun yangi xususiy kalitlarni ishlab chiqarish va ularni omborga tashqarida saqlash.
- Har bir tengdoshning xuddi shu imzolangan genesis muomalasi, topologiya, ishonchli tengdoshlar va tasdiqlovchi PoPs bo'yicha kelishi kerak.
- Tinglovchiga faqat boshqa mashinalardan ega bo'lmasligi kerak bo'lganda uylanuvchi-lokal interfeyslarga murojaatlarni bog'lash.
- Torii ta'siri, bazaviy auth, TLS va tezlikni cheklash uchun orqaga o'tish proksi yoki firewalldan foydalaning.
- Genesis yoki konsensus topologiyasining o'zgarishlarini bitta tengdosh fayl tahrirlari emas, balki muvofiqlashtirilgan migratsiyalar sifatida ko'rib chiqing.

Konteynerizatsiya qilingan mahalliy rivojlanish uchun [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose ish oqimini ishlating.
