---
translation_locale: he
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# יצירת מפתחות קריפטוגרפיים {#generating-cryptographic-keys}

יש להשתמש ב-`kagami keys` כדי ליצור חומר מפתחות ללקוחות, לעמיתים ולמאמתים של Iroha 3.

## שימוש בסיסי {#basic-usage}

מתוך עותק עבודה של קוד המקור של Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

תוצאת JSON היא בדרך כלל הקלה ביותר להעתיק לתוך TOML או אוטומציה:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

הפקודה מדפיסה מפתח ציבורי ומפתח פרטי חשוף. יש להתייחס למפתח הפרטי כחומר סודי; אין להוסיף למאגר את מפתחות הייצור שנוצרו.

לייצוא מקומי מאובטח או להעברה למשמורת בפלטפורמת Unix נתמכת, יש לכתוב זוג מפתחות חדש לספרייה ריקה הנגישה לבעלים בלבד, במקום להדפיס את המפתח הפרטי:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

ספריית האב חייבת כבר להיות קיימת. ספריית היעד חייבת להיות חדשה או כבר בבעלות המשתמש הנוכחי, במצב `0700`, ללא קישורים סמליים וריקה. `kagami` כותב את `public.key` ואת `private.key` במצב `0600` ואינו מדפיס את המפתח הפרטי. עם `--pop`, הוא כותב גם את `pop.hex`.

`--out-dir` נכשל באופן בטוח בפלטפורמות שבהן Kagami אינו יכול לאכוף את כללי מערכת הקבצים המגבילים גישה לבעלים בלבד. קובץ המפתח הפרטי הוא ייצוא לא מוצפן, ולא חותם ייצור מוגן בחומרה או בלתי ניתן לייצוא. יש לייבא אותו אל גבול המשמורת המאושר ולהסיר את הייצוא בהתאם לנוהל הפריסה.

## אלגוריתמים {#algorithms}

אלגוריתמים נפוצים הם:

- `ed25519` עבור חשבונות לקוחות וזהויות זרימה.
- `secp256k1` כאשר חשבון לקוח דורש זהות secp256k1.
- `bls_normal` לזהות ההסכמה של כל צומת או עמית כאשר הבנייה מאפשרת תמיכה ב-BLS.

יש לבדוק את האלגוריתמים המדויקים שהבנייה שלך תומכת בהם באמצעות:

```bash
cargo run --bin kagami -- keys --help
```

## מפתחות פיתוח דטרמיניסטיים {#deterministic-development-keys}

לנתוני בדיקה הניתנים לשחזור, יש להעביר זרע של 32 בתים המקודד כ-64 תווים הקסדצימליים. מתקבלת גם קידומת `0x` אופציונלית:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

הזרע הוא חומר של מפתח פרטי. יש להשתמש בזרעים דטרמיניסטיים רק לפיתוח מקומי ולבדיקות. יש להשמיט את `--seed-hex` כדי ליצור מפתח ייצור מהאקראיות של מערכת ההפעלה.

## מפתחות הסכמה BLS והוכחות החזקה {#bls-consensus-keys-and-proofs-of-possession}

זהויות ההסכמה של צמתים ועמיתים ב-Iroha 3 משתמשות במפתחות BLS רגילים. ליצירת מפתח BLS רגיל והוכחת החזקה (PoP), יש להריץ:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` תקף רק עם `bls_normal`. פלט JSON כולל את `pop_hex`. ג'נסיס חתום דורש PoP תואם לכל מאמת שמצביע. בתצורת עמיתים, מפה לא ריקה של `trusted_peers_pop` בוחרת את תת-קבוצת המאמתים; עמיתים מהימנים שאינם נכללים במפה הלא ריקה הם משקיפים. אם המפה ריקה, כל העמיתים המהימנים בעלי מפתחות BLS רגילים נכנסים לקבוצת מועמדי האתחול, וה-PoPs של המאמתים המצביעים עדיין מסופקים בידי הג'נסיס החתום.

## פורמטי פלט {#output-formats}

השתמשו בהוצאת כפולה עבור ביקורת הטרמינל, `--json` עבור אוטומציה, ו `--compact` כאשר תסריט אחר זקוק לערכים פשוטים המכוונים לקווים:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

עבור סיוע מלא Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
