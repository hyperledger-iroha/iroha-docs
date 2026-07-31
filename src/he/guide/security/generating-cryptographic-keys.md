---
translation_locale: he
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# יצירת מפתחות קריפטוגרפיים {#generating-cryptographic-keys}

שימוש `kagami keys` כדי ליצור חומר מפתח ללקוח, עמיתי ומתוקן עבור
Iroha 3.

## שימוש בסיסי {#basic-usage}

מה- Iroha קבלה מקורות:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON תוצאת היא בדרך כלל הקלה ביותר להעתיק לתוך TOML או אוטומציה:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

הפקודה מדפסת מפתח ציבורי ומפתח פרטי חשוף.
מפתח כמידע סודי; אל תתחייב את מפתחות הייצור המוצרות.

## אלגוריתמים {#algorithms}

אלגוריתמים נפוצים הם:

- `ed25519` עבור חשבונות לקוחות, זהויות סטרימינג, ורוב ההתפתחות
  רשתות.
- `secp256k1` כאשר אתה זקוק לזהות חשבון SECP256K1.
- `bls_normal` עבור מפתחות הסכמה של מבקיע, כאשר הבניין מאפשר BLS תמיכה.

בדוק את האלגוריתמים המדויקים הנמונים בבנייתך עם:

```bash
cargo run --bin kagami -- keys --help
```

## מפתחות פיתוח דטרמיניסטיים {#deterministic-development-keys}

עבור ציוד שניתן להשיב, העביר את הזרע:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

זרעים הם חומר מפתח פרטי.

## BLS הוכחות רכוש {#bls-proofs-of-possession}

NPoS ו Nexus פרופילים של מבקרי אישור BLS מפתחות ההסכמה PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

ה- JSON כולל `pop_hex` כאשר `--pop` השתמשו בשווי זה עם
טופולוגיה שנוצרה או `trusted_peers_pop` רשומות הנדרשות על ידי הפרופיל.

## פורמטים יצירתיים {#output-formats}

השתמשו בכלי ההוצאת המקובלים לבדיקה של הטרמינל, `--json` עבור אוטומציה, ו
`--compact` כאשר תסריט אחר זקוק לערכים פשוטים המכוונים לקווים:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

עבור מוצרים מלאים Kagami עזרה:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
