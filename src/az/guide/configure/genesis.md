---
translation_locale: az
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# blokçeyn genesis {#genesis}

blokçeyn genesis ilkin zəncir vəziyyətini müəyyən edir. Redaktə edilə bilən mənbə JSON texniki manifestdir və Iroha 3 node imzalanmış Norito əməliyyat faylını istifadə edir.

::: details Defolt blockchain genesis texniki manifesti

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Əsas mənbə deposu standart mənbə şablonunu `defaults/genesis.template.json` yolunda təqdim edir. Şablon natamamdır; `kagami genesis materialize` onu manifestə çevirənədək yoxlanıla, imzalana və ya qovşaq tərəfindən istifadə oluna bilməz. Kagami ilə yaradılan şəbəkələr öz manifestini və imzalanmış əməliyyatını çıxış qovluğuna yazır:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Həmin kataloqda yaradılan `README.md` seçilmiş profil üçün dəqiq faylları və işə salma əmrlərini qeyd edir.

## şəbəkə tərəfdaşının Konfiqurasiyası {#peer-configuration}

Həmyaşıd qovşaqlar `config.toml` faylının `[genesis]` bölməsində imzalanmış genezis əməliyyatını göstərir və onun gözlənilən həşini ayrıca faylda sabitləyir:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Şəbəkədəki bütün həmyaşıd qovşaqlar eyni imzalanmış genezis əməliyyatını və genezisin açıq açarını qəbul etməlidir. Gözlənilən həş faylı həm ilk, həm də təkrar işə salınmada tələb olunur; onu `kagami genesis sign --expected-hash-out` yazır.

## Blokçeyn başlanğıcının imzalanması {#signing-genesis}

Əgər texniki sənədi əl ilə redaktə edirsinizsə, şəbəkə tərəfdaşlarını başlatmazdan əvvəl onu yoxlayın və imzalayın:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` sahibi-ələ keçirilmiş rejim-`0600`, tək-bağlantılı adi fayl olmalıdır və bir tək protokol-standart özəl açar çoxhashı və sonuncu yeni sətiri ehtiva etməlidir. Kagami simvolik bağlantıları rədd edir və heç vaxt kommanda sətrində xam blokçeyn başlanğıc özəl açarını qəbul etmir.

NPoS və ya SORA Nexus profilləri üçün yaradılmış profilin tələb etdiyi topologiyanı və BLS sahiblik sübutlarını daxil edin. Kagami-nin `localnet generate`, `wizard` və `sora-network generate` əmrləri bu detalları avtomatik idarə edir.

## Blok zəncirinin başlanğıcını yenidən təsdiqləmək {#recommitting-genesis}

Yeni şəbəkə öz imzalanmış başlanğıc bloku ilə işə başlayır. Müvəqqəti yerli şəbəkədə başqa başlanğıc blokunu sınamaq üçün qovşaqları dayandırın, onların yaradılmış vəziyyət qovluğunu silin və yeni imzalanmış başlanğıc bloku ilə işə başlayın. İşləyən şəbəkə başlanğıc blokunun əvəzlənməsini heç vaxt yeniləmə mexanizmi kimi istifadə etməməlidir. Protokol təriflərində dəyişikliklər idarəetmə qaydaları ilə təsdiqlənən seçim keçidləri və seçilmiş təriflərə və öhdəliklərə uyğunluğun yoxlanmasını tələb edir.
