---
translation_locale: az
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 quraşdır {#install-iroha-3}

Bu səhifə yuxarı axın `hyperledger-iroha/iroha` iş sahəsini istifadə edərək Iroha 3 alət dəsti və ikili faylların cari quraşdırma iş axışını əhatə edir.

## 1. Tələblər {#_1-prerequisites}

İlk olaraq bunları quraşdırın:

- [rustup](https://www.rust-lang.org/tools/install), buna görə də bərkidilmiş `rust-toolchain.toml` alət zənciri (`1.93.1`) avtomatik olaraq quraşdırılır
- `git`
- istəyə görə, yerli çoxnövlü sürətli başlatma üçün Docker və Docker Compose

## 2. İş sahəsini klonlayın {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. İş sahəsini qurun {#_3-build-the-workspace}

Hər şeyi qurun:

```bash
cargo build --workspace
```

Daha kiçik operator yönümlü bir quruluş üçün yalnız əsas ikilikləri tərtib edin:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Alınan ikili fayllar `target/debug/` və ya `target/release/` ünvanına yazılır.

## 4. Quraşdırılmış Alətləri Yoxlayın {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Siz adətən istifadə edəcəyiniz dörd ikilik bunlardır:

- standart şəbəkə iştirakçısı demonu üçün `iroha3d`
- `iroha3d_taira` tək protokol-standart Taira təsdiqedicisi başlatıcısı üçün
- `iroha` üçün CLI Torii və operator API son nöqtələrinə giriş
- `kagami` açarlar, blokçeyn genesis texniki göstərişləri və lokalnet profilləri üçün

## 5. İxtiyari Localnet və Docker Yolu {#_5-optional-localnet-and-docker-path}

Cari mənbə dəstəklənən lokalnet axını Kagami tərəfindən yaradılır. Bu, şəbəkə həmkarı konfiqurasiyalarını, blockchain genesis sənədlərini, müştəri konfiqurasiyasını, köməkçi skriptləri və çıxarılan kodla uyğunlaşan istəyə bağlı Compose faylını yazır:

- `kagami localnet` yerli yerli şəbəkə həmkarı skriptləri üçün
- `kagami docker` üçün Docker Compose localnet qovluğundan yaradıldı

[Başlat Iroha 3](/az/get-started/launch-iroha.md) ilə davam et.
