---
translation_locale: az
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Bare Metal-də Iroha işlətmək {#running-iroha-on-bare-metal}

Bu iş axınından istifadə edin, əgər şəbəkə yoldaşlarını Docker Compose vasitəsilə deyil, birbaşa hostlarda işlətmək istəyirsinizsə. Mövcud mənbə ağacı Kagami generatorları təqdim edir ki, bunlar uyğun blockchain genesis, şəbəkə yoldaşı konfiqurasiyaları, müştəri konfiqurasiyası və başlatmaq/dayandırmaq skriptlərini yaradır.

## 1. İkilik faylları qurun {#_1-build-the-binaries}

Yuxarı axın Iroha iş sahəsindən:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Bu nəticə verir:

- `target/release/iroha3d` şəbəkə həmkarı daemon üçün
- `target/release/iroha` üçün CLI
- `target/release/kagami` açar, blokçeyn başlanğıcı və localnet yaradılması üçün

## 2. Lokal Şəbəkə Yarat {#_2-generate-a-local-network}

Dörd iştirakçıdan ibarət Iroha 3 yerli şəbəkəsi yaradın:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

Çıxış qovluğu yaradılmış `genesis.json`, `genesis.signed.nrt`, `genesis.expected_hash` fayllarını, hər təsdiqləyici üçün bir `peerN.toml`, `client.toml`, `start.sh` və `stop.sh` skriptlərini və həmin paket üçün dəqiq əmrləri olan yaradılmış `README.md` faylını ehtiva edir.

## 3. Şəbəkə tərəfdaşlarını başlat {#_3-start-peers}

Yaradılmış birdəfəlik yerli şəbəkə üçün, yaradılmış skriptdən istifadə edin:

```bash
./localnet/start.sh
```

Əgər hər bir şəbəkə yoldaşını systemd kimi bir proses menecerinə qoşmaq lazımdırsa, `./localnet/start.sh` faylındakı hər şəbəkə yoldaşı üçün əmrə əməl edin: `<bundle>/state/peerN` qovluğundan `iroha3d --config <bundle>/peerN.toml` işə salın və `--sumeragi-assert-fresh-key` parametrini yalnız həmin şəbəkə yoldaşının ilk işə salınmasında ötürün. Hər bir şəbəkə yoldaşının `peerN.toml` faylını, şəxsi açarını, yaddaş qovluğunu və portlarını ayrı saxlayın.

## 4. Şəbəkəni İşlədin {#_4-operate-the-network}

Yaradılmış müştəri konfiqurasiyasından istifadə edin:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Yerinə yetirilmiş localnet-i dayandırmaq üçün:

```bash
./localnet/stop.sh
```

## 5. İstehsal Qeydləri {#_5-production-notes}

- İstehsalat üçün yeni şəxsi açarlar yaradın və onları deposun xaricində saxlayın.
- Hər bir şəbəkə iştirakıçısını eyni imzalanmış blokçeyn başlanğıc əməliyyatı, topologiya, etibarlı şəbəkə iştirakçıları və təsdiqləyici PoPs üzərində razılaşdırmaq.
- Dinləyici ünvanları yalnız şəbəkə yoldaşı digər maşınlardan əlçatmaz olmalıdırsa, host-lokal interfeyslərə bağlayın.
- Torii açıqlanması, əsas autentifikasiya, TLS və sürət məhdudiyyəti üçün tərs proxy və ya firewall istifadə edin.
- Blokçeyn başlanğıcını və ya konsensus topologiyasını dəyişiklikləri tək-şəbəkə həmkarı fayl redaktələri deyil, koordinasiyalı miqrasiyalar kimi qəbul edin.

Qablaşdırılmış yerli inkişaf üçün [Başlat Iroha 3](../../get-started/launch-iroha.md) Docker Compose iş axınından istifadə edin.
