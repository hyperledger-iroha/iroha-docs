---
translation_locale: az
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal üzərində işləyir {#running-iroha-on-bare-metal}

Bu iş axını Docker Compose vasitəsilə deyil, birbaşa qonaqlarda həmyaşıdları işlətmək istədiyiniz zaman istifadə edin. Hal-hazırda mənbə ağacı Kagami generatorlarını təqdim edir ki, uyğunlaşdırılmış genesis, həmyaşıdalar quruluşu, müştəri quruluşu və start/stop skriptləri yazır.

## 1. İkiliklər qurun {#_1-build-the-binaries}

Iroha yuxarı axın iş sahəsindən:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Bu, aşağıdakıları meydana gətirir:

- `target/release/irohad` həmyaşıd daemon üçün
- `target/release/iroha` üçün CLI
- `target/release/kagami` açar, genesis və localnet istehsalı üçün

## 2. Yerli şəbəkə yaradın. {#_2-generate-a-local-network}

Dörd paylı Iroha 3 lokal şəbəkə yaratmaq:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Çıxış lüğətində `genesis.json`, `genesis.signed.nrt`, peer `config.toml` faylları, `client.toml`, köməkçi skriptləri və bu paket üçün dəqiq əmrlər ilə yaradılmış `README.md` var.

## 3. Tərəfdaşlara başlayın {#_3-start-peers}

Yaradılan birbaşa istifadə edilə bilən lokalnet üçün yaradılmış skripti istifadə edin:

```bash
./localnet/start.sh
```

Hər bir həmkarı proses menecerinə bağlamaq lazımdırsa, systemd, İndirmə əmrini istifadə edin. `./localnet/README.md` Hər bir qohum üçün saxlayın. `config.toml`, Şəxsi açar, saxlama dizaynı və portlar ayrıdır.

## 4. Şəbəkəni idarə etmək. {#_4-operate-the-network}

Yaradılan müştəri konfigundan istifadə edin:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Yaradılan localnet-i dayandır:

```bash
./localnet/stop.sh
```

## 5. İstehsalat qeydləri {#_5-production-notes}

- İstehsal üçün yeni xüsusi açarlar istehsal edin və onları anbarın xaricində saxlayın.
- Hər bir həmyaşıd eyni imzalanmış mənşəli əməliyyat, topologiya, etibarlı həmyaşındır və təsdiqçi PoPs haqqında razılığa gəlsin.
- Dinləyici yalnız digər maşınlardan əldə edilə bilmədiyi zaman host-lokal interfeyslərə ünvanlar bağlayın.
- Torii məruz qalması, əsas auth, TLS və dərəcə məhdudiyyəti üçün bir geri proxy və ya firewall istifadə edin.
- Başlanğıc və ya konsensus topologiyasına edilən dəyişiklikləri tək bir dosya düzəlişləri deyil, koordinasiya edilmiş miqrasiyalar kimi qəbul edin.

Konteynerləşdirilmiş yerli inkişaf üçün [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose iş axınından istifadə edin.
