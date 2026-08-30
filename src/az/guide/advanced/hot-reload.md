---
translation_locale: az
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker konteynerində isti yenidən yüklənmə Iroha {#hot-reload-iroha-in-a-docker-container}

Yalnız yerli düzəliş üçün isti yenidən yükləyin. Normal yerli inkişaf üçün görüntüyü yenidən qurmağı və ya yaradılan Docker Compose yığınını yenilənmiş Kagami paketindən yenidən başlatmağı üstün tutun.

## Tərəfdaşlar Binary əvəz edin {#replace-the-peer-binary}

Linux-a uyğun bir daemon binarını yuxarı axın iş məkanından qurun:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Onu işləyən bir rəfiqə konteynerinə kopyalayın, sonra həmin konteyneri yenidən başlatın:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Konteynerin adını təsdiq etmək üçün `docker ps` istifadə edin. Yaradılmış yığında həmyaşıd konteynerləri `./docker-compose.yml` ilə təyin olunur.

## Genesis'i birbaşa istifadə edilə bilən şəbəkədə yenidən yükləyin {#recommit-genesis-in-a-disposable-network}

Bir həmyaşıd yalnız saxlama boş olduğu zaman genesis həyata keçirir.Birbaşa istifadə edilə bilən Docker şəbəkə üçün yığmağı dayandırın, yaranmış vəziyyətini çıxarın, imzalanan genesis paketini yeniləyin və ya əvəz edin və yenidən başlayın:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Vəziyyəti qorunması lazım olan bir şəbəkədə genesin yerini tutmayın.

## Xüsusi qurğulardan istifadə edin {#use-custom-configuration}

Hal-hazırda peer konfigurasiyası TOML dir. Yaradılan `config.toml`, `genesis.signed.nrt` və əlaqəli açar fayllarını görüntünün gözlədiyi konteyner yollarına bağlayın və ya kopyalayın, sonra peer yenidən başlatın. Yaradılan faylları bir yerdə saxlayın; müxtəlif Kagami işarələrindən fayllar qarışdırmaq deserializasiya və ya konsensus uğursuzluqlarına səbəb ola bilər.
