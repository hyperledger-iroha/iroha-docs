---
translation_locale: he
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ייצור מפתחות קריפטוגרפיים {#generating-cryptographic-keys}

להשתמש ב- `kagami keys` כדי ליצור חומר מפתח לקלינט, עמיתי ומתוקן ל- Iroha 3.

## שימוש בסיסי {#basic-usage}

מהמחאה המקורית של Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

תוצאת JSON היא בדרך כלל הקלה ביותר להעתיק לתוך TOML או אוטומציה:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

הפקודה מדפסת מפתח ציבורי ומפתח פרטי חשוף. התייחסו למפתח פרטי כחומר סודי; אל תתחייב את המפתחות הייצור המיוצרים.

## אלגוריתמים {#algorithms}

אלגוריתמים נפוצים הם:

- `ed25519` עבור חשבונות לקוחות, זהויות שידור, ורוב רשתות פיתוח.
- `secp256k1` כאשר אתה צריך זהות חשבון secp256k1.
- `bls_normal` עבור מפתחות ההסכמה של המאשר כאשר הבניין מאפשר תמיכה BLS.

בדוק את האלגוריתמים המדויקים שתומכים בבנייתך עם:

```bash
cargo run --bin kagami -- keys --help
```

## מפתחות התפתחות דטרמיניסטית {#deterministic-development-keys}

עבור ציוד שניתן להשיב, העביר את הזרע:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

זרעים הם חומר מפתח פרטי, השתמש בהם רק לפיתוח מקומי ובדיקות.

## BLS הוכחות בעלות {#bls-proofs-of-possession}

פרופילים של NPoS ו- Nexus מתוארים דורשים BLS מפתחות מתוארים ו- PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON כולל `pop_hex` כאשר משתמשים ב- `--pop`. השתמשו בשווי זה עם הטופולוגיה המורכבת או את הכניסים של `trusted_peers_pop` הנדרשים על ידי הפרופיל.

## פורמטים מוצרים {#output-formats}

השתמשו בהוצאת כפולה עבור ביקורת הטרמינל, `--json` עבור אוטומציה, ו `--compact` כאשר תסריט אחר זקוק לערכים פשוטים המכוונים לקווים:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

עבור סיוע מלא Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
