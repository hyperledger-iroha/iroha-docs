---
translation_locale: uz
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Yugurish Iroha Yolg'iz metallda {#running-iroha-on-bare-metal}

Ushbu ish oqimidan foydalansangiz , tengdoshlarni oʻz navbatida u yerdagi uy egalari bilan toʻgʻridan-toʻgʻri
orqali Docker Compose. Joriy manba daraxti Kagami ishlab chiqaruvchilar
moslashtirilgan genesis, tengdoshlar konfiguratsiyasi, mijoz konfiguratsiyasi va boshlang'ich / to'xtatish skriptlarini yozing.

## 1. Ikkilamchilarni yaratish {#_1-build-the-binaries}

Oʻsimlikdan Iroha ish joyi:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Bu quyidagilarni keltirib chiqaradi:

- `target/release/irohad` tengdoshlar uchun
- `target/release/iroha` uchun CLI
- `target/release/kagami` kalit, genesis va lokalnet ishlab chiqarish uchun

## 2. Mahalliy tarmoq yaratish {#_2-generate-a-local-network}

Toʻrt tengli hosil qilish Iroha 3 lokalnet:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ishlab chiqarish direktoriyasida hosil qilingan `genesis.json`,
`genesis.signed.nrt`, tengdoshlar `config.toml` fayllar, `client.toml`, yordamchi yozuvlar,
va ishlab chiqarilgan `README.md` bu to'plam uchun aniq buyruqlar bilan.

## 3. Tengdoshlar bilan ishlashni boshlash {#_3-start-peers}

Ishlab chiqarilgan bir martalik lokalnet uchun yaratilgan skriptdan foydalaning:

```bash
./localnet/start.sh
```

Agar siz har bir tengdoshni jarayon menejeriga ulashingiz kerak bo'lsa: systemd, qo ' llash
ishga tushirish buyruqi `./localnet/README.md` Har bir tengdoshi uchun.
tengdoshlarning `config.toml`, Xususiy kalit, saqlash direktoriyasi va portlar alohida.

## 4. Tarmoqni boshqarish {#_4-operate-the-network}

Oʻrnatilgan mijoz konfiguratsiyasidan foydalanish:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Ishlab chiqarilgan lokal tarmoqni toʻxtatish:

```bash
./localnet/stop.sh
```

## 5. Ishlab chiqarish bayonnomalari {#_5-production-notes}

- ishlab chiqarish uchun yangi xususiy kalitlar yaratish va ularni
  omborxona.
- Har bir tengdoshni xuddi shu imzolangan genesis muomalasi, topologiya,
  Ishonchli tengdoshlar va tasdiqlovchi PoPs.
- Tinglovchining manzillarini faqat tengdoshlari kerak boʻlganda uylanuvchi-lokal interfeyslarga bogʻlash
  boshqa mashinalardan yetib bo'lmaydi.
- Oʻzgartirish uchun orqa tom maʼnodagi proksi yoki yongʻin qoʻllanmasini ishlatish Torii mutanosiblik, asosiy ta'sir; TLS, va stavka
  cheklash.
- O'simlik yoki konsensus topologiyasining o'zgarishlarini koordinatsiyalangan migratsiyalar deb hisoblang,
  bitta faylni tahrirlash.

Konteynerlashtirilgan mahalliy rivojlanish uchun [Uchratish Iroha 3](../../get-started/launch-iroha.md)
Docker Compose ish oqimi.
