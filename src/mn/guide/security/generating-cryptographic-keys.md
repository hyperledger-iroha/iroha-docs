---
translation_locale: mn
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Криптографийн түлхүүр бий болгох {#generating-cryptographic-keys}

`kagami keys` нь Iroha 3-ийн үйлчлүүлэгч, ижил төстэй болон баталгаажуулагчны гол материалыг үүсгэхэд ашиглана.

## Анхан шатны хэрэглээ {#basic-usage}

Iroha эх үүсвэрийн сангаас:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON үр дүнг TOML эсвэл автоматжуулах нь ихэнхдээ хамгийн хялбар байдаг:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Тус команд нь олон нийтийн ач холбогдол, нээлттэй хувийн ач холбогдол хэвлүүлж байна. Хувийн ач холбогдол нууц материалын хувьд авч үзээрэй; бүтээгдсэн үйлдвэрлэлийн түлхүүрээс татгалзах хэрэггүй.

## Алгоритм {#algorithms}

Нийтлэг алгоритм нь:

- `ed25519` үйлчлүүлэгчдийн данс, дамжуулах тодруулгыг болон ихэнх хөгжлийн сүлжээний хувьд.
- `secp256k1` Хэрэв та Secp256k1 дансны тодруулгыг шаардагдах бол.
- `bls_normal` нь BLS дэмжлэгийг бүтээн байгуулалтаар ашиглах боломжтой бол баталгаажуулагчийн тохиролцооны товчлолтын .

Таны бүтээн байгуулалтад дэмжлэг үзүүлэх тод алгоритмыг шалгаарай:

```bash
cargo run --bin kagami -- keys --help
```

## Урьдчилсан хөгжлийн түлхүүр {#deterministic-development-keys}

Өрсөх боломжтой төхөөрөмжийн хувьд үр тариалах:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Үрсүүд нь хувийн ач холбогдолтой материал юм. Тэднийг зөвхөн орон нутгийн хөгжил, шинжилгээ хийхэд ашиглах болно.

## BLS Хуультай байдлын гэрчилгээ {#bls-proofs-of-possession}

NPoS болон Nexus баталгаажуулагчдын хувилбар нь BLS баталгаажуулах товчоо, PoPs-ийг шаарддаг:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON нь `pop_hex` -ийг тусгасан бөгөөд `--pop`-г ашигладаг. Тухайн үнэ цэнийг бүтээсэн топологи болон `trusted_peers_pop` -ийн үзүүлэлтийн дагуу хэрэглэж болно.

## Урьдчилгааны формат {#output-formats}

Утасны хяналт шалгалтын хувьд `--json`, автоматжуулахад `--compact` гэсэн үндсэн үр дүнг ашиглаж, өөр скрипт нь хэвийн шугамаар чиглэсэн үнэ цэнэ шаарддаг тохиолдолд:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

бүрэн үүссэн Kagami тусламжийн хувьд:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
