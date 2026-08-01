---
translation_locale: az
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust tətbiqi əsas iş məkanında yaşayır və Iroha 3 kod bazası ilə işləmək üçün ən birbaşa yol olaraq qalır.

## Nə əldə edəcəksən {#what-you-get}

Hazırda yuxarı axın repositoriyası aşağıdakıları açıqlayır:

- `iroha` Rust müştəri qutusu
- `iroha` CLI ən tam istinad müştəri olaraq
- SDK qatı tərəfindən istifadə olunan paylaşılan məlumat modeli, kripto və Norito qutuları

## Tələb olunan başlanğıc nöqtəsi {#recommended-starting-point}

Layihənin hazırkı vəziyyəti üçün CLI və iş sahəsinin özü ilə başlayın:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Referensiyalı müştərini verilişi olan standart müştəri konfiqurasiyası ilə icra edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira Yalnız oxumaq üçün cəhd edin {#try-taira-read-only}

Eyni iş məkanında yoxlama vasitəsilə Taira diaqnostik köməkçisini sınayın:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Marşrut səviyyəsində yoxlamalar üçün Torii'nın JSON API ünvanını birbaşa istifadə edin:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` yaratdıqdan sonra, eyni ikili Taira ilə imzalanmış kanary əmrlərini icra edə bilər. Bunları adi vahid testlərdən ayırın, çünki faucet maliyyələşdirilmiş hesab və canlı test şəbəkəsinin mövcudluğu tələb olunur.

## Rust müştəri qutusunun istifadəsi {#using-the-rust-client-crate}

Şəbəkənizdə istifadə olunan Iroha Git tənzimləməsini bağlayın:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Rust səthlərinin praktikada necə istifadə edildiyinə dair ən tam nümunələr lazımdırsa, yoxlayın:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Kitabda idarə olunan escrow iş axınları üçün [Native Asset Escrow](/az/blockchain/escrow.md#rust-sdk)-ə baxın. Rust məlumat modeli hazırda bazar escrow, ümumi aktivlər qapanələri, anonim escrow, sorğu və hadisələr üçün ən tam tiplənmiş əhatə dairəsinə malikdir.

Yerli CLI kömək snapshot bərpa edə bilərsiniz:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Qeydlər {#notes}

- CLI hazırda müstəqil qutu sənədlərinə nisbətən daha yaxşı bir əhatə təmin edir.
- Operator üslubunda axınlar üçün ən aktual mənbə CLI sənədləşmədir.
