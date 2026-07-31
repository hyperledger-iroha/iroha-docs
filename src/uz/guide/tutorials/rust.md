---
translation_locale: uz
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

O ' zbekiston Respublikasi Rust amalga oshirish asosiy ish joyida yashaydi va eng to'g'ridan-to'g'ri
bilan ishlashning usuli Iroha 3 kodga asoslangan.

## Qanaqasiga erishasiz {#what-you-get}

Hozirgi vaqtda yuqori darajadagi ma'muriyat quyidagilarni aniqlaydi:

- ko'rsatilgan `iroha` Rust mijoz qutisi
- ko'rsatilgan `iroha` CLI eng to'liq ma'lumotnoma mijozi sifatida
- umumiy ma'lumotlar modeli, kripto va Norito O'zbekiston Respublikasi SDK qatlam

## Tavsiya etilgan boshlang'ich nuqta {#recommended-starting-point}

Loyihaning hozirgi holati uchun ma'lumotdan boshlang CLI va
ish o'rinlari:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Referent mijozini default mijoz konfiguratsiyasi bilan ishga tushiring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Sinang . Taira Faqat oʻqish {#try-taira-read-only}

Shu ish joyidagi kassaxonadan, jamoatchilikni sinab ko'ring Taira diagnostika yordamchisi:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Yo'nalish darajasidagi tekshirishlar uchun foydalanish Torii" JSON API bevosita:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Sen yaratgandan so'ng `taira.client.toml`, bir xil ikkilamchi imzolangan kanariyani ishlatishi mumkin
qarshi buyruqlar Taira. Bularni odatdagi birlik sinovlaridan ajrating , chunki
ular kran mablag'i bilan ta'minlangan hisobvaraq va jonli testnet mavjudligini talab qiladi.

## O ' zbekiston Respublikasining Rust Mijozlar qutisi {#using-the-rust-client-crate}

O'rnatish Iroha Tarmogʻingiz tomonidan ishlatiladigan Git- reviziyasi:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Agar sizga qanday qilib Rust yuzalarda ishlatiladi
mashq qilish, tekshirish:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Katta hisobda boshqariladigan depozit ish oqimlari uchun ko'ring
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#rust-sdk). O ' zbekiston Respublikasi Rust ma'lumotlar modeli
hozirda bozordagi depozit uchun eng to'liq turdagi qoplamani, umumiy
aktivlar qulflari, anonim depozitlar, so'rovlar va hodisalar.

Mahalliy odamni qayta tiklay olasiz CLI quyidagilar bilan yordam koʻrsatish:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Izohlar {#notes}

- O ' zbekiston Respublikasi CLI Hozirgi kunda o'z-o'zidan iborat qutis hujjatlaridan yaxshiroq qamrab olinadi.
- Operator uslubidagi oqimlar uchun CLI hujjatlarning eng zamonaviy manbai hisoblanadi.
