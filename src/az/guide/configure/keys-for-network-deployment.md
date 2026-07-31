---
translation_locale: az
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Şəbəkənin tətbiqi üçün açarlar {#keys-for-network-deployment}

Hər bir şəbəkəyə müştərilər, həmyaşıdlar, genesis imzalanması və NPoS və ya Nexus profillər üçün BLS təsdiqçi kimlikləri üçün ayrı-ayrı əsas materiallar lazımdır.

## Anahtarlardan istifadə edilən yerlər {#where-keys-are-used}

- Müştəri imzalanma açarları `client.toml` altında `[account]` saxlanılır.
- Tərəfdaş kimliyi açarları hər bir tərəfdaşda `config.toml` `public_key` və `private_key` olaraq saxlanılır.
- Peer Discovery hər bir peer ictimai açarını istifadə edir `trusted_peers`.
- BLS təsdiqçisi NPoS profilləri üçün mülkiyyət sübutları `trusted_peers_pop` ünvanında saxlanılır.
- Genesis imzalanması manifest imzalanarkən `[genesis].public_key` peer konfigində və uyğun xüsusi açarı istifadə edir.

Yerli və ya test tətbiqləri üçün Kagami bütün bu faylları bir araya gətirsin:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Mövcud şəbəkə və ya profil üçün idarə olunan axın istifadə edin:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## Ayrı-ayrı açar cütləri yaratın {#generate-individual-key-pairs}

Özəl açar material üçün `kagami keys` istifadə edin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

BLS təsdiqləyici material üçün mülkiyyət sübutunu əlavə edin:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--seed` yalnız təkrarlana bilən inkişaf cihazları üçün istifadə edin. İstehsalatda yerləşdirilmək üçün yeni açarlar istehsal edin və xüsusi açarlar anbardan kənarda saxlayın.

## Rəfiqələr arasında uyğunluq {#peer-consistency}

Bütün təsdiqçilər eyni genesis əməliyyatı, topologiyası, etibarlı paylaşılan ictimai açarları və təsdiqçi PoPs haqqında razılığa gəlməlidirlər. Yalnız bir çatışmayan və ya uyğun olmayan həmyaşıd açarı şəbəkənin qurulmasına və ya konsensus əldə etməsinə mane ola bilər.

Ən azı Bizansın səhv tolerantlığı üçün ən azı dörd həmyaşıddan istifadə edin. Hər bir həmyaşıdın öz xüsusi açarı olmalıdır, lakin hər bir həmyaşırı konfigurasiyasının eyni etibarlı həmyaşır dəstinə ehtiyac vardır.

## Müştərilərin hesabları {#client-accounts}

`client.toml` müştəri hesabı artıq zəncirdə olmalıdır. O, genesis manifest və ya sonrakı bir əməliyyat vasitəsilə qeydiyyatdan keçirilə bilər. Genesis imzalanma kimliyindən uzunmüddətli tətbiq hesabı kimi istifadə etməyin; genesis imtiyazları yalnız genesis mərhələsi zamanı tətbiq olunur və istehsal müştəriləri öz hesablarını və rollarını istifadə etməlidirlər.
