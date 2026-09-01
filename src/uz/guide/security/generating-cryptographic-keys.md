---
translation_locale: uz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kriptografik Kalitlarni Yaratish {#generating-cryptographic-keys}

Iroha 3 uchun mijoz, tugun va tasdiqlovchi kalit materialini yaratishda `kagami keys` dan foydalaning.

## Asosiy ishlatish {#basic-usage}

Iroha manba-kodi ishlaydigan nusxasidan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ota katalogi allaqachon mavjud bo‘lishi kerak. Maqsad yangi bo‘lishi yoki joriy foydalanuvchi tomonidan allaqachon egalik qilinishi, rejim `0700`ga ega bo‘lishi, simbollik bog‘lanmalardan xoli bo‘lishi va bo‘sh bo‘lishi kerak. `kagami` `public.key` va `private.key` ni rejim `0600` bilan yozadi va kalit materialini chop etmaydi. `--pop` bilan u shuningdek `pop.hex` ni ham yozadi.

`--out-dir` egalar uchun mo‘ljallangan fayl tizimi qoidalarini Kagami amalga oshira olmagan platformalarda yopiq holatda ishlaydi. Maxfiy kalit fayli shifrlanmagan eksport faylidir, emas apparatli yoki eksport qilinmaydigan ishlab chiqarish kriptografik imzolagichi. Uni tasdiqlangan saqlash chegarasiga import qiling va tarqatish protsedurasiga muvofiq eksportni o‘chiring.

## Algoritmlar {#algorithms}

Eng keng tarqalgan algoritmlar:

- `ed25519` mijoz hisoblari va oqim identifikatorlari uchun.
- `secp256k1` mijoz hisob qaydnomasi secp256k1 identifikatorini talab qilganda.
- `bls_normal` har bir tugun yoki tarmoq hamkori konsensus identifikatori uchun.

Sizning qurilmangiz tomonidan qo‘llab-quvvatlanadigan aniq algoritmlarni quyidagida tekshiring:

```bash
cargo run --bin kagami -- keys --help
```

## Deterministik Rivojlanish Kalitlari {#deterministic-development-keys}

Takrorlanadigan test artefaktlari uchun 64 o'n oltilik belgilar sifatida kodlangan 32-baytli urug'ni kiriting. Ixtiyoriy `0x` prefiksi qabul qilinadi:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

Uchqun shaxsiy kalit materialidir. Faqat mahalliy rivojlantirish va testlar uchun deterministik uchqunlardan foydalaning. Ishlash tizimi tasodifiyligidan ishlab chiqarish kalitini yaratish uchun `--seed-hex` ni tashlab yuboring.

## BLS Konsensus Kalitlari va Egalik-Dalillari {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 tugun va tarmoq tengdoshining konsensus identifikatorlari BLS-normal kalitlardan foydalanadi. BLS-normal kalit va egalik isboti (PoP) yaratish:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` faqat `bls_normal` bilan amal qiladi; u saqlov katalogiga `pop.hex` ni qo‘shadi. Imzolangan boshlang‘ich holat har bir ovoz beruvchi tasdiqlovchi uchun mos PoP talab qiladi. Tugun konfiguratsiyasida bo‘sh bo‘lmagan `trusted_peers_pop` xaritasi tasdiqlovchilar to‘plamini tanlaydi; undan chiqarib tashlangan ishonchli tugunlar kuzatuvchidir. Xarita bo‘sh bo‘lsa, barcha BLS-normal ishonchli tugunlar dastlabki nomzodlar to‘plamiga kiradi, ammo ovoz beruvchilarning PoPs qiymatlarini baribir imzolangan boshlang‘ich holat belgilaydi.

## Hibs chiqarish {#custody-output}

`kagami keys` `--out-dir` ga muhtoj va hech qachon maxfiy kalit materialini standart chiqishga yozmaydi. `public.key`, `private.key` va ixtiyoriy `pop.hex` ni o'qing yaratilgan katalog. Har bir fayl bitta protokol-standart qiymatini o‘z ichiga oladi va undan keyin yangi qator keladi, bu esa faylga asoslangan avtomatlashtirishni oddiy qiladi:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

To‘liq yaratilgan Kagami yordam uchun:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
