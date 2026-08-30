---
translation_locale: az
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Mövcud şəbəkə və ya profil üçün idarə olunan axın istifadə edin:

```bash
cargo run --bin kagami -- wizard
```

## Ayrı-ayrı açar cütləri yaratın {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Rəfiqələr arasında uyğunluq {#peer-consistency}

Bütün təsdiqçilər eyni genesis əməliyyatı, topologiyası, etibarlı paylaşılan ictimai açarları və təsdiqçi PoPs haqqında razılığa gəlməlidirlər. Yalnız bir çatışmayan və ya uyğun olmayan həmyaşıd açarı şəbəkənin qurulmasına və ya konsensus əldə etməsinə mane ola bilər.

Ən azı Bizansın səhv tolerantlığı üçün ən azı dörd həmyaşıddan istifadə edin. Hər bir həmyaşıdın öz xüsusi açarı olmalıdır, lakin hər bir həmyaşırı konfigurasiyasının eyni etibarlı həmyaşır dəstinə ehtiyac vardır.

## Müştərilərin hesabları {#client-accounts}

`client.toml` müştəri hesabı artıq zəncirdə olmalıdır. O, genesis manifest və ya sonrakı bir əməliyyat vasitəsilə qeydiyyatdan keçirilə bilər. Genesis imzalanma kimliyindən uzunmüddətli tətbiq hesabı kimi istifadə etməyin; genesis imtiyazları yalnız genesis mərhələsi zamanı tətbiq olunur və istehsal müştəriləri öz hesablarını və rollarını istifadə etməlidirlər.
