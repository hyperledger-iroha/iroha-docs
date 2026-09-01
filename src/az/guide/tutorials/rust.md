---
translation_locale: az
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Rust tətbiqi əsas iş sahəsində yerləşir və Iroha 3 kod bazası ilə işləməyin ən birbaşa yolu olaraq qalır.

## Nələr əldə edirsiniz {#what-you-get}

Yuxarı axın anbarı hazırda bu məlumatları göstərir:

- `iroha` Rust müştəri proqram təminatı paketi
- `iroha` CLI-i ən tam istinad müştəri olaraq
- paylaşılan məlumat modeli, kripto və Norito proqram paketləri SDK təbəqəsi tərəfindən istifadə olunur

## Tövsiyə olunan Başlanğıc Nöqtəsi {#recommended-starting-point}

Layihənin cari vəziyyəti üçün CLI istinadını və öz iş sahəsini istifadə edərək başlayın:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Yoxlanılmış standart müştəri konfiqurasiyası ilə referans müştərini işə salın:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Sına Taira Yalnız Oxuma {#try-taira-read-only}

Eyni iş sahəsindən çıxış edib, ictimai Taira diaqnostika köməkçisini sınayın:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Marşrut səviyyəsində yoxlamalar üçün, Torii'ın JSON API'sini birbaşa istifadə edin:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Siz `taira.client.toml` yaratdıqdan sonra, eyni ikilik fayl imzalanmış kanarya əmrlərini Taira-ə qarşı işlədə bilər. Bunları adi vahid testlərdən ayırın, çünki onlar testnet-də maliyyələşən hesab və canlı testnet mövcudluğu tələb edir.

## Rust Müştəri proqram təminat paketindən istifadə {#using-the-rust-client-crate}

Şəbəkəniz tərəfindən istifadə olunan Iroha Git dəyişiklikini bağlayın:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Əgər sizə Rust səthlərin praktikada necə istifadə olunduğuna dair ən tam nümunələr lazımdırsa, baxın:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Blokçeyn dəftər hesabı vasitəsilə idarə olunan kirayə iş axınları üçün baxın [Yerli Aktiv Depoziti](/az/blockchain/escrow.md#rust-sdk). Rust məlumat modeli hal-hazırda bazar kirayəsi, ümumi aktiv kilidləri, anonim kirayə, sorğular və hadisələr üçün ən tam növ əhatəsini təmin edir.

Siz lokal CLI kömək nöqtəsi-vaxt məlumat baxışını aşağıdakıla yenidən yarada bilərsiniz:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Qeydlər {#notes}

- CLI hazırda müstəqil proqram paketi sənədlərindən daha yaxşı əhatə təmin edir.
- Operator üslublu axınlar üçün CLI sənədləri ən aktual mənbədir.
