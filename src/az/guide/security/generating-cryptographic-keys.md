---
translation_locale: az
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: b6e3bd79c50ea326930ac978350ea4beac8294b6f045ac0084aada257754ffa1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Kriptoqrafik Açarların Yaradılması {#generating-cryptographic-keys}

`kagami keys` istifadə edərək Iroha 3 üçün müştəri, şəbəkə həmkarı və doğrulayıcı açar materialını yaradın.

## Əsas İstifadə {#basic-usage}

İş nüsxəsi Iroha mənbə kodundan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Üst qovluq əvvəlcədən mövcud olmalıdır. Hədəf mövcud olmamalıdır: Kagami hətta mövcud boş qovluğu da rədd edir. O, yalnız sahibin girişini təmin edən fayl sistemi yoxlamaları ilə hədəfi `0700` rejimində yaradır və simvolik keçidləri rədd edir. `kagami` `public.key` və `private.key` fayllarını `0600` rejimində yazır və açar materialını ekrana çıxarmır. `--pop` ilə əlavə olaraq `pop.hex` yazır.

`--out-dir` platformalarda bağlı olur Kagami bu yalnız sahibi üçün olan fayl sistemi qaydalarını tətbiq edə bilmir. Şəxsi açar faylı şifrlənməmiş ixracdır, hardware və ya ixrac edilməyən istehsal kriptoqrafik imzalayıcı deyil. Təsdiqlənmiş qoruma sərhədinə idxal edin və ixracı yerləşdirmə proseduruna uyğun olaraq silin.

## Alqoritmlər {#algorithms}

Ümumi alqoritmlər bunlardır:

- `ed25519` müştəri hesabları və axın kimlikləri üçün.
- `secp256k1` müştəri hesabı secp256k1 identifikatoruna ehtiyac duyduqda.
- `bls_normal` hər bir node və ya şəbəkə həmkarı konsensus şəxsiyyəti üçün.

Dəstək olunan dəqiq alqoritmləri yoxlamaq üçün bu əmrdən istifadə edin:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik İnkişaf Açarları {#deterministic-development-keys}

Təkrar istehsal edilə bilən test artefaktları üçün, 64 onaltılı simvol kimi kodlanmış 32 baytlıq toxum verin. İstəyə bağlı olaraq `0x` prefiksi qəbul edilir:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

Toxum şəxsi açar materialıdır. Yalnız yerli inkişaf və testlər üçün deterministik toxumlardan istifadə edin. Əməliyyat sistemi təsadüfi dəyərlərindən istehsal açarı yaratmaq üçün `--seed-hex` çıxarın.

## BLS Konsensus Açarları və Sahiblik Sübutları {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 düyün və şəbəkə tərəfdaşının konsensus şəxsiyyətləri BLS-normal açarlardan istifadə edir. BLS-normal açar və mülkiyyətin təsdiqi (PoP) yaradın:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` yalnız `bls_normal` ilə etibarlıdır; o, mühafizə kataloquna `pop.hex` əlavə edir. İmzalanmış blockchain genesis hər bir səs verən təsdiqləyici üçün uyğun PoP tələb edir. Şəbəkə şəbəkə həmkarı konfiqurasiyasında, boş olmayan `trusted_peers_pop` xəritə təsdiqləyici alt dəstini seçir; həmin boş olmayan xəritədən çıxarılan etibarlı şəbəkə həmkarları müşahidəçilərdir. Əgər xəritə boşdursa, bütün BLS-normal etibarlı şəbəkə həmkarları başlanğıc namizəd dəstinə daxil olur, seçici PoPs isə hələ də imzalanmış blokçeyn başlanğıcı tərəfindən təmin edilir.

## Mühafizə çıxışı {#custody-output}

`kagami keys` `--out-dir` tələb edir və heç vaxt şəxsi açar materialını standart çıxışa yazmır. `public.key`, `private.key` və istəyə bağlı `pop.hex` oxuyun yaradılmış kataloq. Hər fayl bir protokol-standart dəyəri ehtiva edir və sonra yeni sətir gəlir, bu isə fayl əsaslı avtomatlaşdırmanı açıq şəkildə sadə edir:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

Tam yaradılmış Kagami üçün kömək:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
