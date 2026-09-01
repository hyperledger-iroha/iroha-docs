---
translation_locale: uz
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Rust amalga oshirilishi asosiy ish maydonida joylashgan va Iroha 3 kod bazasi bilan ishlashning eng toʻgʻridan-toʻgʻri usuli bo‘lib qoladi.

## Nimani olasiz {#what-you-get}

Hozirgi vaqtda yuqori darajadagi repozitoriy quyidagilarni ko'rsatmoqda:

- `iroha` Rust mijoz dasturiy ta'minot paketi
- `iroha` CLI ni eng to‘liq ma’lumot manbai sifatida mijoz sifatida
- umumiy ma'lumot modeli, kripto va Norito dasturiy paketlar SDK qatlam tomonidan ishlatiladi

## Tavsiya etilgan boshlang‘ich nuqtasi {#recommended-starting-point}

Loyihaning joriy holati uchun, CLI havolasidan va ish maydonchasidan boshlang:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Nazoratga olingan standart mijoz konfiguratsiyasi bilan referens mijozini ishga tushiring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Urining Taira Faqat O'qish Uchun {#try-taira-read-only}

Xuddi shu ish maydoni checkoutidan, jamoat Taira diagnostika yordamchisidan foydalanib ko‘ring:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Marshrut darajasidagi tekshiruvlar uchun, Torii'ning JSON API'ni to‘g‘ridan-to‘g‘ri ishlating:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` yaratganingizdan so‘ng, xuddi shu ikkilik fayl imzolangan kanari buyruqlarini Taira ga qarshi ishga tushirishi mumkin. Ularni odatiy birlik testlaridan alohida saqlang, chunki ular testnet bilan moliyalashtirilgan hisob va jonli testnet mavjudligini talab qiladi.

## Rust Mijoz dasturiy ta'minot paketidan foydalanish {#using-the-rust-client-crate}

Tarmog’ingiz tomonidan foydalanilgan Iroha Git versiyasini belgilash:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Agar siz Rust sirtlarining amaliyotda qanday ishlatilishining eng to‘liq misollarini ko‘rmoqchi bo‘lsangiz, quyidagilarni tekshiring:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Blokcheyn ledger eskrou ish oqimlari tomonidan boshqariladiganlar uchun, [Mahalliy Aktiv Depoziti](/uz/blockchain/escrow.md#rust-sdk) ga qarang. Hozirda Rust maʼlumot modeli bozor eskroulari, umumiy aktivlar qulflari, anonim eskrou, so‘rovlar va voqealar uchun eng to‘liq tiplangan qamrovga ega.

Siz lokal CLI yordam nuqtasi-vaqt maʼlumotlar ko‘rinishini quyidagicha qayta yaratishingiz mumkin:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Eslatmalar {#notes}

- CLI hozirda mustaqil dasturiy ta'minot paketining hujjatlaridan ko'ra yaxshiroq qamrovni taqdim etadi.
- Operator uslubidagi oqimlar uchun, CLI hujjat eng so‘nggi manba hisoblanadi.
