---
translation_locale: az
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
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

Siz `taira.client.toml` yaratdıqdan sonra, eyni ikilik fayl `iroha taira account` ilə hesabı qoşa və maliyyələşdirə, həmçinin Taira-ya qarşı adi imzalanmış reyestr əmrlərini göndərə bilər. Bunları adi vahid testlərdən ayırın, çünki onlar testnet-də maliyyələşən hesab və canlı testnet mövcudluğu tələb edir.

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

Reyestr tərəfindən idarə olunan eskrou iş axınları üçün [Yerli Aktiv Depoziti](/az/blockchain/escrow.md#rust-sdk) bölməsinə baxın. Rust məlumat modeli hal-hazırda bazar eskrousu, ümumi aktiv kilidləri, şərti eskrou, sorğular və hadisələr üçün ən tam tipli əhatəni təmin edir.

Siz lokal CLI kömək nöqtəsi-vaxt məlumat baxışını aşağıdakıla yenidən yarada bilərsiniz:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Qeydlər {#notes}

- CLI hazırda müstəqil proqram paketi sənədlərindən daha yaxşı əhatə təmin edir.
- Operator üslublu axınlar üçün CLI sənədləri ən aktual mənbədir.
