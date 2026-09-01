---
translation_locale: az
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 işə salın {#launch-iroha-3}

Bu səhifə yuxarı axın deposundan standart iş sahəsi aktivlərindən istifadə edərək Iroha 3 üçün mövcud lokal şəbəkə axını üzrə keçid edir.

## 1. Yerli Çoxqovşaqlı Şəbəkə Yaradın {#_1-generate-a-local-multi-peer-network}

Cari Kagami kodundan dörd qonşulu yerli şəbəkə yaradın:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Çıxış qovluğu uyğun şəbəkə həmkar konfiqurasiyalarını, `genesis.json`, `genesis.signed.nrt`, `client.toml` və köməkçi skriptləri ehtiva edir.

Yerli test üçün yaranmış şəbəkə tərəfdaşlarını birbaşa işə salın:

```bash
./localnet/start.sh
```

Konteynerləşdirilmiş iş üçün, eyni localnet qovluğundan Compose yaradın:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Əsas yaradılan yığın aşağıdakıları göstərir:

- şəbəkə tərəfdaşı P2P portları `1337` dən `1340` ə
- Torii HTTP portları `8080`-dən `8083`-ə
- `./localnet/client.toml` ünvanında hazır müştəri konfiqurasiyası

## 2. Şəbəkənin işlədiyini yoxlayın {#_2-verify-that-the-network-is-up}

Birinci şəbəkə qoşulmasında API son nöqtənin vəziyyətini yoxlayın:

```bash
curl http://127.0.0.1:8080/status
```

Varsayılan sağlamlıq yoxlamaları həmçinin istifadə edir:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Siz dərhal CLI-i paketlənmiş müştəri konfiqurasiyasına yönəldə bilərsiniz:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Profil {#_3-nexus-profile}

Depo həmçinin `defaults/nexus/` altında SORA Nexus-yönümlü konfiqurasiya profilini göndərir.

Yerel şəbəkə iştirakçısını Nexus profili ilə işə salmaq üçün:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

O profilə CLI giriş üçün `defaults/nexus/client.toml` istifadə edin.

## 4. Lokal Şəbəkəni Dayandırın {#_4-stop-the-local-network}

Yerli şəbəkə üçün yerli yaradılmış:

```bash
./localnet/stop.sh
```

Yaradılmış Compose yığını üçün:

```bash
docker compose -f ./docker-compose.yml down
```

Şəbəkə işlədikdən sonra [Iroha 3-i CLI vasitəsilə işlədin](/az/get-started/operate-iroha-via-cli.md) ilə davam edin.
