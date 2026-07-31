---
translation_locale: mn
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Криптографийн түлхүүр үүсгэх {#generating-cryptographic-keys}

Хэрэглээ `kagami keys` үйлчлүүлэгч, ижил төстэй болон баталгаажуулагчийн гол материалыг
Iroha 3.

## Анхан шатны хэрэглээ {#basic-usage}

Үүнээс Iroha эх үүсвэрийн төлбөр:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON үр дүн нь ихэнхдээ хамгийн хялбар TOML эсвэл автоматжуулалт:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Тус команд нь нийтийн ачкыг болон хувийн ачкыг хэвлүүлж байна.
нөөц нь нууц материалын хувьд; үйлдвэрлэлийн нөөцийг үүсгэсэнгүй байх.

## Алгоритм {#algorithms}

Нийтлэг алгоритм нь:

- `ed25519` үйлчлүүлэгчдийн бүртгэл, дамжуулах тодруулгыг болон ихэнх хөгжлийг
  сүлжээ.
- `secp256k1` Secp256K1 дансны тодорхойлолт хэрэгтэй үед.
- `bls_normal` Барилгын хувьд хүчин чадалтай BLS дэмжлэг.

Таны бүтээн байгуулалтад дэмжлэг үзүүлэх тод алгоритмүүдийг:

```bash
cargo run --bin kagami -- keys --help
```

## Урьдчилсан хөгжлийн ач холбогдол {#deterministic-development-keys}

Өргөдгөж болно гэсэн төхөөрөмжийн хувьд үр тариал:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Үрсүүд нь хувийн ач холбогдолтой материал бөгөөд зөвхөн орон нутгийн хөгжил, шинжилгээ хийхэд ашиглана.

## BLS Хуультай байдлын гэрчилгээ {#bls-proofs-of-possession}

НПОС болон Nexus баталгаажуулагчдын хувилбар шаарддаг BLS баталгаажуулагчны түлхүүр, PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Хөдөлмөрийн JSON хамаарна `pop_hex` хэзээ `--pop` Энэ үнэлгээг
үүсгэсэн топологи, эсвэл `trusted_peers_pop` Профилийн шаардлага хангасан бүртгэл.

## Уул уурхайн бүтэц {#output-formats}

Үндсэн өгөгдлийг терминалын хяналт шалгалтаар ашиглах, `--json` автоматжуулалт,
`--compact` өөр скрипт нь тодорхой шугам чиглэсэн үнэ цэнэ шаарддаг тохиолдолд:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Бүх үйлдвэрлэгдэх Kagami тусламж:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
