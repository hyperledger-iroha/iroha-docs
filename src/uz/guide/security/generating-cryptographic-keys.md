---
translation_locale: uz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Kriptografik kalitlarni yaratish {#generating-cryptographic-keys}

Iroha 3 uchun mijoz, peer va validator kalit materiallarini yaratishda `kagami keys` dan foydalaning.

## Asosiy foydalanish {#basic-usage}

Iroha manba kodining checkout katalogidan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON chiqarishni TOML yoki avtomatlashtirishga ko'pincha ko'paytirish eng oson bo'ladi:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Buyruq ochiq kalit va oshkor ko'rinishdagi xususiy kalitni chiqaradi. Xususiy kalitni maxfiy material deb hisoblang; yaratilgan ishlab chiqarish kalitlarini repozitoriyga commit qilmang.

Qo'llab-quvvatlanadigan Unix platformasida xavfsiz mahalliy eksport yoki saqlovchiga topshirish uchun xususiy kalitni chiqarish o'rniga yangi kalit juftini faqat egasi kira oladigan bo'sh katalogga yozing:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ota katalog oldindan mavjud bo'lishi kerak. Nishon katalog yangi yoki joriy foydalanuvchiga tegishli, `0700` rejimli, ramziy havolalarsiz va bo'sh bo'lishi kerak. `kagami` `public.key` va `private.key` fayllarini `0600` rejimida yozadi va xususiy kalitni chiqarmaydi. `--pop` bilan u `pop.hex` faylini ham yozadi.

Kagami faqat egaga tegishli fayl tizimi qoidalarini ta'minlay olmaydigan platformalarda `--out-dir` xavfsiz tarzda xato bilan yakunlanadi. Xususiy kalit fayli shifrlanmagan eksport bo'lib, apparat yoki eksport qilinmaydigan ishlab chiqarish imzochisi emas. Uni tasdiqlangan saqlash chegarasiga import qiling va eksport faylini joylashtirish tartibiga muvofiq olib tashlang.

## Algoritmlar {#algorithms}

Oddiy algoritmlar quyidagilardan iborat:

- `ed25519` mijozlar hisobvaraqlari va streaming identifikatsiyalari uchun.
- `secp256k1` agar mijoz hisob raqami uchun secp256k1 identifikatsiyasi kerak bo'lsa.
- build BLS qo'llab-quvvatlashini yoqsa, har bir node yoki peer konsensus identifikatori uchun `bls_normal`.

Qurilishingiz tomonidan qo'llab-quvvatlanadigan aniq algoritmlarni quyidagi yordam bilan tekshiring:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik rivojlanish kalitlari {#deterministic-development-keys}

Takrorlanadigan fixture-lar uchun 64 ta o'n oltilik belgi ko'rinishida kodlangan 32 baytli seed bering. Ixtiyoriy `0x` prefiksi qabul qilinadi:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

Seed xususiy kalit materialidir. Deterministik seed-lardan faqat mahalliy ishlab chiqish va sinovlarda foydalaning. Operatsion tizim tasodifiyligidan ishlab chiqarish kalitini yaratish uchun `--seed-hex` ni ko'rsatmang.

## BLS Konsensus kalitlari va mulkdorlik hujjati {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 nodlar va tengdoshlarning kelishuvli identifikatsiyalari BLS-normal kalitlaridan foydalanadi. BLS-normal kalit va egalik to'g'risidagi dalil (PoP) ni yaratish:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` faqat `bls_normal` bilan yaroqli. JSON chiqishi `pop_hex` ni o'z ichiga oladi. Imzolangan genesis har bir ovoz beruvchi validator uchun mos PoP talab qiladi. Peer konfiguratsiyasida bo'sh bo'lmagan `trusted_peers_pop` xaritasi validatorlar quyi to'plamini tanlaydi; shu bo'sh bo'lmagan xaritada ko'rsatilmagan ishonchli peer-lar kuzatuvchi bo'ladi. Xarita bo'sh bo'lsa, barcha BLS-normal ishonchli peer-lar bootstrap nomzodlari to'plamiga kiradi, ovoz beruvchilarning PoPs-i esa baribir imzolangan genesis orqali beriladi.

## Ishlab chiqarish formatlari {#output-formats}

Terminal tekshiruvi uchun andoza chiqish, avtomatlashtirish uchun `--json` va boshqa skriptda oddiy chiziqlarga yo'naltirilgan qiymatlar kerak bo'lganda `--compact` dan foydalaning:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

To'liq hosil bo'lgan Kagami yordam uchun:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
