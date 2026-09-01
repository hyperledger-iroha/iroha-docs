---
translation_locale: az
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Şəbəkə Yerləşdirilməsi üçün Açarlar {#keys-for-network-deployment}

Hər bir şəbəkə müştərilər, şəbəkə həmkarları, blokçeyn başlanğıc imzası və NPoS və ya Nexus profilləri üçün BLS təsdiqləyici kimlikləri üçün ayrı açar materialına ehtiyac duyur.

## Açarların istifadə olunduğu yerlər {#where-keys-are-used}

- Müştəri imza açarları `[account]` altında `client.toml` yerləşdirilir.
- şəbəkə həmrəylik kimlik açarları hər bir şəbəkə həmrəyində `config.toml` olaraq `public_key` və `private_key` şəklində saxlanılır.
- şəbəkə həmkarının aşkarlanması hər bir şəbəkə həmkarının açıq açarından `trusted_peers` istifadə edir.
- BLS təsdiqedici Mülkiyyətin Sübutları NPoS profilləri üçün `trusted_peers_pop` daxilində saxlanılır.
- Blockchain başlanğıc imzalama texniki manifest imzalanarkən şəbəkə həmkarı konfiqurasiyasında `[genesis].public_key` və uyğun şəxsi açardan istifadə edir.

Yerli və ya test yerləşdirmələri üçün, bütün bu faylları birlikdə yaratmaq üçün Kagami-ə icazə verin:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Mövcud şəbəkə və ya profil üçün istiqamətləndirilmiş prosesi istifadə edin:

```bash
cargo run --bin kagami -- wizard
```

## Fərdi Açar Cütlüklər Yarat {#generate-individual-key-pairs}

Müstəqil açar materialı üçün `kagami keys`-dən istifadə edin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

BLS yoxlayıcı materialı üçün Sahiblik Sübutunu daxil edin:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--seed-hex`-dən yalnız təkrarlana bilən inkişaf fişlərini təmin etmək üçün dəqiq 32-baytlıq onaltılıq gizli açarla istifadə edin. İstehsal yerləşdirilməsi üçün onu çıxarın ki, Kagami əməliyyat sistemi təsadüfiliyini istifadə etsin, sonra şifrəsiz özəl açarın ixracını təsdiqlənmiş saxlanma həddinə köçürün. Əmr heç vaxt şəxsi açarları çap etmir.

## şəbəkə həmkar Uyğunluğu {#peer-consistency}

Bütün təsdiqçilər eyni blokçeyn başlanğıc əməliyyatı, topologiya, etibarlı şəbəkə qonşu açarları və təsdiqçi PoPs üzrə razılaşmalıdırlar. Tək bir itkin və ya uyğun olmayan şəbəkə qonşu açarı şəbəkənin başlamasına və ya konsensusa çatmasına mane ola bilər.

Minimum Bizans-yanlışlıq-davamlı yerləşdirmə üçün ən azı dörd şəbəkə yoldaşından istifadə edin. Hər bir şəbəkə yoldaşının öz xüsusi açarı olmalıdır, lakin hər bir şəbəkə yoldaşı konfiqurasiyası eyni etibarlı şəbəkə yoldaşları dəstinə ehtiyac duyur.

## Müştəri Hesabları {#client-accounts}

`client.toml` müştəri hesabı artıq zəncirdə mövcud olmalıdır. O, blokçeyn başlanğıc texniki manifesti ilə və ya daha sonra edilən bir əməliyyatla qeydiyyata alınabilir. Blockchain genesis imza şəxsiyyətindən uzunmüddətli tətbiq hesabı kimi istifadə etməkdən çəkinin; blockchain genesis imtiyazları yalnız blockchain genesis raundu zamanı tətbiq olunur və istehsal müştəriləri öz hesablarından və rollarından istifadə etməlidir.
