---
translation_locale: uz
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Bare Metal-da Iroha ni ishga tushirish {#running-iroha-on-bare-metal}

Ushbu ish jarayonini tarmoq hamkorlarini to'g'ridan-to'g'ri mezonlarda ishlatmoqchi bo'lganingizda ishlating, Docker Compose orqali emas. Joriy manba daraxti mos keladigan blokcheyn boshlang‘ich fayli, tarmoq hamkorlari konfiguratsiyasi, mijoz konfiguratsiyasi va ishga tushirish/to‘xtatish skriptlarini yozadigan Kagami generatorlarini taqdim etadi.

## 1. Binarlarni yaratish {#_1-build-the-binaries}

Upstream Iroha ish maydonidan:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Bu quyidagilarni hosil qiladi:

- `target/release/iroha3d` tarmoq tengdosh daemon uchun
- `target/release/iroha` uchun CLI
- `target/release/kagami` kalit, blokcheyn genesi va localnet yaratish uchun

## 2. Mahalliy Tarmoq Yaratish {#_2-generate-a-local-network}

To‘rtta tugundan iborat Iroha 3 mahalliy tarmog‘ini yarating:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Chiqish katalogida yaratilgan `genesis.json`, `genesis.signed.nrt`, tarmoq ho‘kizi `config.toml` fayllari, `client.toml`, yordamchi skriptlar va o‘sha paket uchun aniq buyruqlar bilan yaratilgan `README.md` mavjud.

## 3. Tarmoq tengdoshlari ishga tushiriladi {#_3-start-peers}

Yaratilgan disposable localnet uchun, yaratilgan skriptdan foydalaning:

```bash
./localnet/start.sh
```

Agar siz har bir tarmoq ishtirokchisini systemd kabi jarayon boshqaruvchisiga ulashingiz kerak bo'lsa, har bir tarmoq ishtirokchisi uchun `./localnet/README.md` da yozilgan ishga tushirish buyrug'idan foydalaning. Har bir tarmoq ishtirokchisining `config.toml`, shaxsiy kaliti, saqlash katalogi va portlarini alohida saqlang.

## 4. Tarmoqni boshqarish {#_4-operate-the-network}

Yaratilgan mijoz konfiguratsiyasidan foydalaning:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Yaratilgan localnetni to'xtatish uchun:

```bash
./localnet/stop.sh
```

## 5. Ishlab chiqarish yozuvlari {#_5-production-notes}

- Ishlab chiqarish uchun yangi shaxsiy kalitlarni yarating va ularni repozitoriyadan tashqarida saqlang.
- Har bir tugun ayni imzolangan boshlang‘ich tranzaksiya, topologiya, ishonchli tugunlar va tasdiqlovchilarning PoPs qiymatlaridan foydalanishini ta’minlang.
- Tarmoq hamkori boshqa mashinalardan yetib bo‘lmasligi kerak bo‘lgan holda, tinglovchi manzillarni faqat host-local interfeyslariga bog‘lang.
- Torii ochiqligi, asosiy autentifikatsiya, TLS va tezlik chegaralash uchun teskari proksi yoki firewalldan foydalaning.
- Boshlang‘ich holat yoki konsensus topologiyasi o‘zgarishlarini bitta tugun faylini tahrirlash emas, muvofiqlashtirilgan ko‘chirish deb qarang.

Konteynerlashtirilgan mahalliy rivojlanish uchun, [Ishga tushurish Iroha 3](../../get-started/launch-iroha.md) Docker Compose ish oqimini ishlating.
