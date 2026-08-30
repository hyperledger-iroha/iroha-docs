---
translation_locale: az
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 quraşdırma {#install-iroha-3}

Bu səhifə Iroha 3 vasitələr silsiləsi və yuxarıda `hyperledger-iroha/iroha` iş məkanından istifadə edən ikililər üçün hazırkı quraşdırma iş axını əhatə edir.

## 1. Əvvəlki şərtlər {#_1-prerequisites}

Əvvəlcə bunları quraşdır:

- [rustup](https://www.rust-lang.org/tools/install), belə ki, bağlanmış `rust-toolchain.toml` alət zənciri (`1.93.1`) avtomatik olaraq quraşdırılır.
- `git`
- Docker və Docker Compose yerli bir çox cüt sürətli start üçün seçilir.

## 2. İş sahəsini klonlaşdırın. {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. İş məkanını qurun {#_3-build-the-workspace}

Hər şeyi qur:

```bash
cargo build --workspace
```

Daha kiçik operator mərkəzləşdirilmiş bir quruluş üçün yalnız əsas ikililəri tərtib edin:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Nəticədə əldə edilən ikililər `target/debug/` və ya `target/release/` ünvanına yazılır.

## 4. Qurulmuş vasitələri yoxlayın. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Ümumiyyətlə istifadə edəcəyiniz dörd ikili:

- `iroha3d` standart peer daemon üçün
- `iroha3d_taira` canoniki Taira təsdiqləyici fırlatıcısı üçün
- Torii və operatorun son nöqtələrinə giriş üçün CLI `iroha`
- `kagami` açarlar, genesis manifestları və localnet profilləri üçün

## 5. Yerli şəbəkə və Docker yolun seçim yolu {#_5-optional-localnet-and-docker-path}

Mövcud mənbə dəstəklənən localnet axını Kagami tərəfindən yaradılır. O, həmyaşıd konfiqurasiyaları, genesis artefaktları, müştəri konfiqurasiyası, köməkçi skriptləri və yoxlanılan kodla uyğunlaşan bir komposi faylı yazır:

- `kagami localnet` yerli yerli rəfiqə yazıları üçün
- `kagami docker` üçün Docker Compose localnet dizaynından əldə edilmişdir

[Lunch Iroha 3](/az/get-started/launch-iroha.md) ilə davam edin.
