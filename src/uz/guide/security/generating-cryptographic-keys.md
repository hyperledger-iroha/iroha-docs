---
translation_locale: uz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik kalitlarni yaratish {#generating-cryptographic-keys}

Iroha 3 uchun mijoz, tengdosh va tasdiqlovchi kalit materiallarini yaratish uchun `kagami keys` dan foydalaning.

## Asosiy foydalanish {#basic-usage}

Iroha manbai hisobidan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON chiqarishni TOML yoki avtomatlashtirishga ko'pincha ko'paytirish eng oson bo'ladi:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Buyruq ommaviy kalit va ochiq xususiy kalitni bosib chiqaradi. Xususiy kalitga maxfiy material kabi munosabatda bo'ling; hosil qilingan ishlab chiqarish kalitlarini o'tkazmang.

## Algoritmlar {#algorithms}

Oddiy algoritmlar quyidagilardan iborat:

- `ed25519` mijoz hisobvaraqlari, oqim kimliklari va ko'pgina rivojlanish tarmoqlari uchun.
- `secp256k1` agar sizga secp256k1 hisob raqami kimligi kerak bo'lganda.
- BLS qo'llab-quvvatlanishini qo'lga kiritgan holda, validator konsensus kalitlari uchun `bls_normal` .

Qurilishingiz tomonidan qo'llab-quvvatlanadigan aniq algoritmlarni quyidagi yordam bilan tekshiring:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik rivojlanish kalitlari {#deterministic-development-keys}

Ko'payishi mumkin bo'lgan qurilmalar uchun urug'ni o'tkazib yuborish:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Urug'lar xususiy material bo'lib, ularni faqat mahalliy rivojlanish va sinovlar uchun ishlating.

## BLS Mulkka egalik qilish hujjati {#bls-proofs-of-possession}

NPoS va Nexus tasdiqlovchi profillar uchun BLS tasdiqlash kalitlari va PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON `pop_hex` ni o'z ichiga oladi, agar `--pop` ishlatilgan bo'lsa. Ushbu qiymatdan profil talab qilgan topologiya yoki `trusted_peers_pop` yozuvlar bilan foydalaning.

## Ishlab chiqarish formatlari {#output-formats}

Terminal tekshiruvi uchun andoza chiqish, avtomatlashtirish uchun `--json` va boshqa skriptda oddiy chiziqlarga yo'naltirilgan qiymatlar kerak bo'lganda `--compact` dan foydalaning:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

To'liq hosil bo'lgan Kagami yordam uchun:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
