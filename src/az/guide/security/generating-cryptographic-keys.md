---
translation_locale: az
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik açarların yaradılması {#generating-cryptographic-keys}

Iroha 3 üçün müştəri, həmyaşıd və təsdiqçi açarı materialını yaratmaq üçün `kagami keys` istifadə edin.

## Əsas istifadə {#basic-usage}

Iroha mənbəyə baxışdan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON çıxışı ümumiyyətlə TOML və ya avtomatlaşdırma şəklində əks etdirmək ən asandır:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Komanda ictimai açar və gizli açar çap edir. Xüsusi açarı gizli material kimi qəbul edin; istehsal edilən açarları ödənməyin.

## Algoritmlər {#algorithms}

Ümumi alqoritmlər:

- `ed25519` müştəri hesabları, axın kimlikləri və inkişaf şəbəkələrinin əksəriyyəti üçün.
- `secp256k1` Secp256k1 hesabı kimliyi lazım olduqda.
- BLS dəstəyi quraşdırma imkanı verildiyi zaman təsdiqçi konsensus açarları üçün `bls_normal`.

İnşaatınız tərəfindən dəstəklənən dəqiq alqoritmləri yoxlayın:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik inkişaf açarları {#deterministic-development-keys}

Təkrarlana bilən qurğular üçün bir toxum keçin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Toxumlar xüsusi açar materialdır.Onları yalnız yerli inkişaf və test üçün istifadə edin.

## BLS Mülkiyyətə dair sübut {#bls-proofs-of-possession}

NPoS və Nexus təsdiqçi profillərinə BLS təsdiqçi açarları və PoPs lazımdır:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON `pop_hex` istifadə edildikdə `--pop` daxildir. Bu dəyərdən profil tərəfindən tələb olunan topologiya və ya `trusted_peers_pop` girişləri ilə istifadə edin.

## Çıxış formatları {#output-formats}

Terminal yoxlaması üçün standart çıxış, avtomatlaşdırma üçün `--json` və başqa bir skriptə düz xətti istiqamətli dəyərlər lazım olduqda `--compact` istifadə edin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Tam istehsal olunmuş Kagami yardımı üçün:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
