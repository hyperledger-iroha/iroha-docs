---
translation_locale: az
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İsti Yükləmə Iroha bir Docker Konteynerdə {#hot-reload-iroha-in-a-docker-container}

Yalnız yerli ayırdetmədə isti yükləmədən istifadə edin. Normal yerli inkişaf üçün şəkli yenidən qurmağı və ya yaradılmış Docker Compose yığını yeni Kagami paketindən yenidən başladmağı üstün tutun.

## Şəbəkə həmkarı Binary-i əvəz edin {#replace-the-peer-binary}

Yuxarı axın iş sahəsindən Linux-uyğun daemon binar faylı yaradın:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Bunu işləyən şəbəkə həmkarı konteynerinə kopyalayın, sonra həmin konteyneri yenidən başladın:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

`docker ps` konteyner adını təsdiqləmək üçün istifadə edin. Yaradılmış stekdə şəbəkə yoldaşı konteynerləri `./docker-compose.yml` ilə müəyyən edilir.

## Təklif olunmayan Şəbəkədə blok zənciri başlanğıcını yenidən öhdəsinə götürmək {#recommit-genesis-in-a-disposable-network}

Şəbəkə həmkarı blokçeyn başlanğıcını yalnız yaddaşı boş olduqda yekunlaşdırır. İstifadə edilə bilən Docker şəbəkəsi üçün, yığını dayandırın, yaradılmış vəziyyəti silin, imzalanmış blokçeyn başlanğıc paketini yenidən yaradın və ya əvəz edin və yenidən başlayın:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Vəziyyəti qorunmalı olan şəbəkədə blockchain başlanğıcını əvəz etməyin.

## Fərdi Konfiqurasiyadan İstifadə Et {#use-custom-configuration}

Cari şəbəkə həmkarı konfiqurasiyası TOML dir. Yaradılmış `config.toml`, `genesis.signed.nrt` və əlaqəli açar faylları konteynerdə gözlənilən yollarına bind mount edin və ya kopyalayın. şəkil, sonra isə şəbəkə həmkarını yenidən başladın. Yaradılmış faylları birlikdə saxlayın; müxtəlif Kagami işlərindən olan faylların qarışdırılması deserializasiya və ya konsensus uğursuzluqlarına səbəb ola bilər.
