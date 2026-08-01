---
translation_locale: uz
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust dasturini amalga oshirish asosiy ish maydonida mavjud va Iroha 3 kod bazasida ishlashning eng to'g'ridan-to'g'ri usuli bo'lib qoladi.

## Qanaqasiga erishasiz {#what-you-get}

Hozirgi vaqtda yuqori darajadagi ma'muriyatda quyidagilar mavjud:

- `iroha` Rust mijoz qutisi
- `iroha` CLI ko'rsatkich mijozi sifatida eng to'liq
- SDK qatlamida foydalaniladigan umumiy ma'lumotlar modeli, kripto va Norito qutisi

## Tavsiya etilgan boshlang'ich nuqta {#recommended-starting-point}

Loyihaning hozirgi holati uchun CLI ko'rsatkich va ish maydonining o'zi bilan boshlash:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Referent mijozini belgilangan andoza mijoz konfiguratsiyasi bilan ishga tushiring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira Faqat o'qishga harakat qiling {#try-taira-read-only}

O'sha ish joyidagi kassaxonadan Taira diagnostika yordamchisini sinab ko'ring:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Yo'nalish darajasidagi tekshirishlar uchun Torii ning JSON API nomidan to'g'ridan-to'g'ri foydalaning:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` yaratgandan so'ng, xuddi shu binar Taira ga qarshi imzolangan kanari buyruqlarini ishga tushira oladi. Ularni odatdagi birlik sinovlaridan ajratib qo'ying, chunki ular kran mablag'i bilan ta'minlangan hisobni va jonli test tarmog'ining mavjudligini talab qiladi.

## Rust mijoz qutisini ishlatish {#using-the-rust-client-crate}

Tarmog'ingiz tomonidan ishlatiladigan Iroha Git-ning o'zgartirishini pinlash:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Agar Rust yuzalarining amalda qanday ishlatilishi haqida eng to'liq misollar kerak bo'lsa, quyidagilarni tekshiring:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Katta kitobda boshqariladigan depozit ish oqimlari uchun [Native Asset Escrow](/uz/blockchain/escrow.md#rust-sdk)-ni ko'ring. Rust ma'lumotlar modeli hozirda bozordagi depozit, umumiy aktivlar qulflari, anonim depozit, so'rovlar va voqealar uchun eng to'liq yozib olingan qoplamani o'z ichiga oladi.

Siz CLI yordamida mahalliy fotosuratni yangilashingiz mumkin:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Izohlar {#notes}

- CLI hozirda o'z-o'zidan bo'lgan quti hujjatlariga qaraganda yaxshiroq qamrovni ta'minlaydi.
- Operator uslubidagi oqimlar uchun CLI hujjatlari eng dolzarb manba hisoblanadi.
