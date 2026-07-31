---
translation_locale: uz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik kalitlarni yaratish {#generating-cryptographic-keys}

Foydalanish `kagami keys` mijoz, tengdosh va tasdiqlovchi kalit materiallarni yaratish uchun
Iroha 3.

## Asosiy foydalanish {#basic-usage}

O ' zbekiston Respublikasining Iroha manbai bo'yicha hisob-kitob:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON chiqish odatda nusxa olish eng oson TOML yoki avtomatlashtirish:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Qo'mondonlik ommaviy kalit va ochiq xususiy kalitni bosib chiqaradi.
kalit sirli material sifatida; ishlab chiqarilgan mahsulot kalitlarini o'z ichiga olmang.

## Algoritmlar {#algorithms}

Oddiy algoritmlar quyidagilardan iborat:

- `ed25519` mijoz hisobvaraqlari, oqim kimligi va ko'pgina rivojlanish uchun
  tarmoqlar.
- `secp256k1` agar sizga SECP256K1 hisob raqami kimligi kerak bo'lsa.
- `bls_normal` Buyraklar oʻrnatilganda BLS yordam berish.

Qurilishingiz tomonidan qo'llab-quvvatlanadigan aniq algoritmlarni quyidagi yordam bilan tekshiring:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik rivojlanish kalitlari {#deterministic-development-keys}

Reproduktib materiallar uchun urug'ni o'tkazib yuboring:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Urug'lar xususiy material bo'lib, ularni faqat mahalliy rivojlanish va sinov uchun ishlating.

## BLS O'z egaligi to'g'risidagi dalillar {#bls-proofs-of-possession}

NPOS va Nexus sertifikatlash profillari talab etiladi BLS tasdiqlovchi kalitlari va PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

O ' zbekiston Respublikasi JSON kiradi `pop_hex` qachon `--pop` Ushbu qiymatdan foydalanib,
ishlab chiqarilgan topologiya yoki `trusted_peers_pop` profil talab qilgan yozuvlar.

## Ishlab chiqarish formatlari {#output-formats}

Terminal tekshiruvi uchun andoza chiqishdan foydalaning, `--json` avtomatlashtirish uchun; va
`--compact` boshqa skriptda oddiy chiziqlarga yo'naltirilgan qiymatlar kerak bo'lganda:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

To'liq ishlab chiqarilgan Kagami yordam berish:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
