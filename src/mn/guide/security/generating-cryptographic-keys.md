---
translation_locale: mn
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Криптограф түлхүүр үүсгэх {#generating-cryptographic-keys}

`kagami keys`-ийг ашиглан Iroha 3-ын клиент, peer болон validator-ийн түлхүүрийн материалыг үүсгэнэ.

## Анхан шатны хэрэглээ {#basic-usage}

Iroha эх кодын checkout сангаас:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON гаралтыг TOML эсвэл автоматжуулалт руу хуулах нь ихэвчлэн хамгийн хялбар:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Энэ команд нийтийн түлхүүр болон ил гарсан хувийн түлхүүрийг хэвлэнэ. Хувийн түлхүүрийг нууц материал гэж үз; үүсгэсэн үйлдвэрлэлийн түлхүүрийг репозиторт commit хийж болохгүй.

Дэмжигдсэн Unix платформ дээр аюулгүй локал экспорт хийх эсвэл хамгаалалттай хадгалалтад шилжүүлэхдээ хувийн түлхүүрийг хэвлэхийн оронд шинэ түлхүүрийн хосыг зөвхөн эзэмшигч нэвтрэх хоосон санд бич:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Эцэг сан урьдчилан байх ёстой. Зорилтот сан нь шинэ эсвэл одоогийн хэрэглэгчийн эзэмшилд, `0700` горимтой, симбол холбоосгүй, хоосон байх ёстой. `kagami` нь `public.key` болон `private.key` файлыг `0600` горимоор бичиж, хувийн түлхүүрийг хэвлэхгүй. `--pop` хэрэглэвэл `pop.hex` файлыг мөн бичнэ.

Kagami зөвхөн эзэмшигчид зориулсан файлын системийн эдгээр дүрмийг албадан хэрэгжүүлж чадахгүй платформ дээр `--out-dir` аюулгүйгээр алдаа гарган зогсоно. Хувийн түлхүүрийн файл нь шифрлээгүй экспорт бөгөөд аппаратын эсвэл экспортлох боломжгүй үйлдвэрлэлийн гарын үсэг зурагч биш. Үүнийг зөвшөөрөгдсөн хамгаалалттай хадгалалтад импортлоод, нэвтрүүлэлтийн журмын дагуу экспорт файлыг устга.

## Алгоритмууд {#algorithms}

Нийтлэг алгоритм нь:

- Клиент данс болон streaming identity-д `ed25519`.
- Клиент дансанд secp256k1 identity шаардлагатай үед `secp256k1`.
- Build нь BLS дэмжлэгийг идэвхжүүлсэн үед node эсвэл peer бүрийн consensus identity-д `bls_normal`.

Таны бүтээн байгуулалтад дэмжлэг үзүүлэх тод алгоритмыг шалгаарай:

```bash
cargo run --bin kagami -- keys --help
```

## Детерминистик хөгжүүлэлтийн түлхүүрүүд {#deterministic-development-keys}

Давтагдах fixture-д 64 арван зургаатын тэмдэгтээр кодолсон 32 байтын seed өг. Сонголттой `0x` угтварыг зөвшөөрнө:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

Seed нь хувийн түлхүүрийн материал. Детерминистик seed-ийг зөвхөн локал хөгжүүлэлт болон тестэд ашигла. Үйлдвэрлэлийн түлхүүрийг үйлдлийн системийн санамсаргүй эх үүсвэрээр үүсгэхийн тулд `--seed-hex`-ийг бүү өг.

## BLS консенсусын түлхүүр ба эзэмшлийн нотолгоо {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3-ын node болон peer-ийн consensus identity нь BLS-normal түлхүүр ашиглана. BLS-normal түлхүүр болон эзэмшлийн нотолгоо (PoP)-г ингэж үүсгэнэ:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` нь зөвхөн `bls_normal`-тай хүчинтэй. JSON гаралт `pop_hex`-ийг агуулна. Гарын үсэгтэй genesis нь санал өгөх validator бүрд тохирох PoP шаарддаг. Peer тохиргоонд хоосон биш `trusted_peers_pop` map нь validator-уудын дэд олонлогийг сонгоно; тэр хоосон биш map-д ороогүй итгэмжлэгдсэн peer-үүд observer байна. Map хоосон бол бүх BLS-normal итгэмжлэгдсэн peer bootstrap candidate олонлогт орно, харин санал өгөгчдийн PoPs-ийг гарын үсэгтэй genesis үргэлжлүүлэн нийлүүлнэ.

## Гаралтын форматууд {#output-formats}

Терминал дээр шалгахад үндсэн гаралтыг, автоматжуулалтад `--json`-ийг, өөр скриптэд мөр тус бүрийн энгийн утга хэрэгтэй үед `--compact`-ийг ашигла:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

бүрэн үүссэн Kagami тусламжийн хувьд:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
