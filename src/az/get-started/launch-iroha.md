---
translation_locale: az
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İndirmə Iroha 3 {#launch-iroha-3}

Bu səhifə Iroha 3 üçün mövcud yerli şəbəkə axınından yuxarı axın anbarından işləmə sahəsi aktivləri istifadə edərək keçirilir.

## 1. Yerli bir çox rəfiqə şəbəkəsi yaradın {#_1-generate-a-local-multi-peer-network}

Hələlik Kagami kodu ilə dörd nömrəli lokal şəbəkə yaratmaq:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Çıxış direktoru uyğunlaşdırılmış həmyaşıd konfiqurasiyaları, `genesis.json`, `genesis.signed.nrt`, `client.toml` və köməkçi skriptləri ehtiva edir.

Yerli duman sınağı üçün istehsal olunan həmyaşıdları birbaşa başlatın:

```bash
./localnet/start.sh
```

Konteynerləşdirilmiş bir icra üçün eyni localnet dizaynından Compose istehsal edin:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

Default generated stack exposes:

- Peer P2P limanları `1337` ilə `1340`
- Torii HTTP limanları `8080` ilə `8083`
- `./localnet/client.toml` ünvanında hazır bir müştəri konfiqurasiyası

## 2. Şəbəkənin işləndiyini yoxlayın. {#_2-verify-that-the-network-is-up}

Birinci rəqibdə status son nöqtəsini yoxlayın:

```bash
curl http://127.0.0.1:8080/status
```

Standart sağlamlıq yoxlamalarında da istifadə olunur:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Dərhal CLI paketli müştəri konfiqurasiyasına yönəldilə bilər:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Profil Nexus {#_3-nexus-profile}

Repozitor həmçinin SORA Nexus istiqamətində konfiqurasiya profilinə `defaults/nexus/` daxil edilir.

Nexus profili olan bir yerli həmyaşıd işlətmək üçün:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Bu profilə CLI daxil olmaq üçün `defaults/nexus/client.toml` istifadə edin.

## 4. Yerli şəbəkəni dayandırın {#_4-stop-the-local-network}

Yerli istehsal olunan localnet üçün:

```bash
./localnet/stop.sh
```

İstehsal olunmuş Compose yığın üçün:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Şəbəkə işlədikdən sonra [ ilə davam edin Iroha 3 vasitəsilə CLI](/az/get-started/operate-iroha-via-cli.md) istifadə edin.
