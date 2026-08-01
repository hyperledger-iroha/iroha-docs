---
translation_locale: az
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Kriptografik açarların yaradılması {#generating-cryptographic-keys}

Iroha 3 üçün müştəri, peer və validator açar materialı yaratmaq məqsədilə `kagami keys` istifadə edin.

## Əsas istifadə {#basic-usage}

Iroha mənbə kodunun checkout qovluğundan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON çıxışı ümumiyyətlə TOML və ya avtomatlaşdırma şəklində əks etdirmək ən asandır:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Komanda açıq açarı və üzə çıxarılmış şəxsi açarı çap edir. Şəxsi açara məxfi material kimi yanaşın; yaradılmış istehsal açarlarını repozitoriyaya commit etməyin.

Dəstəklənən Unix platformasında təhlükəsiz yerli ixrac və ya mühafizə təhvili üçün şəxsi açarı çap etmək əvəzinə yeni açar cütünü yalnız sahibin giriş edə bildiyi boş kataloqa yazın:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ana kataloq əvvəlcədən mövcud olmalıdır. Hədəf kataloq yeni olmalı və ya artıq cari istifadəçiyə məxsus olmalı, `0700` rejimində, simvolik keçidsiz və boş olmalıdır. `kagami` `public.key` və `private.key` fayllarını `0600` rejimində yazır və şəxsi açarı çap etmir. `--pop` ilə əlavə olaraq `pop.hex` yazılır.

Kagami yalnız sahibə aid bu fayl sistemi qaydalarını tətbiq edə bilməyən platformalarda `--out-dir` əmri təhlükəsiz şəkildə uğursuz olur. Şəxsi açar faylı şifrələnməmiş ixracdır; aparat imzalayanı və ya ixrac olunmayan istehsal imzalayanı deyil. Onu təsdiqlənmiş mühafizə sərhədinə idxal edin və yerləşdirmə proseduruna uyğun olaraq ixrac faylını silin.

## Algoritmlər {#algorithms}

Ümumi alqoritmlər:

- `ed25519` müştəri hesabları və axın şəxsiyyətləri üçün.
- `secp256k1` bir müştəri hesabı secp256k1 şəxsiyyət tələb edərkən.
- build BLS dəstəyini aktivləşdirirsə, hər bir node və ya peer konsensus kimliyi üçün `bls_normal`.

İnşaatınız tərəfindən dəstəklənən dəqiq alqoritmləri yoxlayın:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik inkişaf açarları {#deterministic-development-keys}

Təkrarlana bilən fixture-lər üçün 64 onaltılıq simvol kimi kodlaşdırılmış 32 baytlıq seed verin. İxtiyari `0x` prefiksi qəbul edilir:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

Seed şəxsi açar materialıdır. Deterministik seed-ləri yalnız yerli inkişaf və sınaqlar üçün istifadə edin. Əməliyyat sisteminin təsadüfilik mənbəyindən istehsal açarı yaratmaq üçün `--seed-hex` parametrini verməyin.

## BLS Konsensus açarları və mülkiyyət sübutları {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node və peer konsensus kimlikləri BLS-normal açarlardan istifadə edir. BLS-normal açarı və mülkiyyət sübutunu (PoP) yaratın:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` yalnız `bls_normal` ilə etibarlıdır. JSON çıxışına `pop_hex` daxildir. İmzalanmış genesis hər səs verən validator üçün uyğun PoP tələb edir. Peer konfiqurasiyasında boş olmayan `trusted_peers_pop` xəritəsi validator alt çoxluğunu seçir; həmin boş olmayan xəritədə göstərilməyən etibarlı peer-lər müşahidəçi olur. Xəritə boşdursa, bütün BLS-normal etibarlı peer-lər bootstrap namizədləri çoxluğuna daxil olur, səs verənlərin PoPs-i isə yenə imzalanmış genesis tərəfindən verilir.

## Çıxış formatları {#output-formats}

Terminal yoxlaması üçün standart çıxış, avtomatlaşdırma üçün `--json` və başqa bir skriptə düz xətti istiqamətli dəyərlər lazım olduqda `--compact` istifadə edin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Tam istehsal olunan Kagami yardımı üçün:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
