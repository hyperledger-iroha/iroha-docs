---
translation_locale: uz
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: bb1044edb9d34264e36848ee773d4d313bfbfd91b45da2eeb831f7ef8920e9b4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Kriptografik Kalitlarni Yaratish {#generating-cryptographic-keys}

Iroha 3 uchun mijoz, tugun va tasdiqlovchi kalit materialini yaratishda `kagami keys` dan foydalaning.

## Asosiy ishlatish {#basic-usage}

Iroha manba-kodi ishlaydigan nusxasidan:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ota katalog oldindan mavjud bo‘lishi kerak. Maqsad mavjud bo‘lmasligi kerak: Kagami hatto mavjud bo‘sh katalogni ham rad etadi. U faqat egaga ruxsat beruvchi fayl tizimi tekshiruvlari ostida maqsadni `0700` rejimida yaratadi va ramziy havolalarni rad etadi. `kagami` `public.key` va `private.key`ni `0600` rejimida yozadi, kalit materialini chop etmaydi. `--pop` bilan u `pop.hex`ni ham yozadi.

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

`--pop` faqat `bls_normal` bilan amal qiladi; u saqlov katalogiga `pop.hex` ni qo‘shadi. Imzolangan boshlang‘ich holat har bir ovoz beruvchi tasdiqlovchi uchun mos PoP talab qiladi. Tugun konfiguratsiyasida har bir tasdiqlovchining PoP qiymatini `trusted_peers_pop` da ko‘rsating: haqiqiy PoP qiymatiga ega bo‘lmagan ishonchli tugunlar konsensus ro‘yxatidan chiqariladi, bo‘sh xarita esa birorta ham tasdiqlovchi bermaydi, shuning uchun xaritasida boshlang‘ich holat tasdiqlovchilari bo‘lmagan tugun ishga tushishni rad etadi. Faqat sinxronlash bilan shug‘ullanadigan tugunni `[sumeragi] role = "observer"` bilan ishga tushiring.

## Hibs chiqarish {#custody-output}

`kagami keys` `--out-dir` ga muhtoj va hech qachon maxfiy kalit materialini standart chiqishga yozmaydi. `public.key`, `private.key` va ixtiyoriy `pop.hex` ni o'qing yaratilgan katalog. Har bir fayl bitta protokol-standart qiymatini o‘z ichiga oladi va undan keyin yangi qator keladi, bu esa faylga asoslangan avtomatlashtirishni oddiy qiladi:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

To‘liq yaratilgan Kagami yordam uchun:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
