---
translation_locale: he
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: bb1044edb9d34264e36848ee773d4d313bfbfd91b45da2eeb831f7ef8920e9b4
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review+reviewed-delta
---
# יצירת מפתחות קריפטוגרפיים {#generating-cryptographic-keys}

יש להשתמש ב-`kagami keys` כדי ליצור חומר מפתחות ללקוחות, לצמתים ולמאמתים של Iroha 3.

## שימוש בסיסי {#basic-usage}

מתוך עותק העבודה של קוד המקור של Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

תיקיית האב חייבת להיות קיימת. היעד חייב לא להיות קיים: Kagami מסרב גם לתיקייה ריקה קיימת. הוא יוצר את היעד במצב הרשאות `0700`, בכפוף לבדיקות מערכת קבצים המגבילות גישה לבעלים, ודוחה קישורים סמליים. `kagami` כותב את `public.key` ואת `private.key` במצב הרשאות `0600` ואינו מדפיס חומר מפתחות. עם `--pop`, הוא כותב גם את `pop.hex`.

בפלטפורמות שבהן Kagami אינו יכול לאכוף את כללי מערכת הקבצים המגבילים את הגישה לבעלים בלבד, `--out-dir` מסרב לפעול באופן בטוח וסגור. קובץ המפתח הפרטי הוא יצוא לא מוצפן, ולא חותם חומרה או חותם ייצור שאינו ניתן ליצוא. יבאו אותו אל גבול המשמורת המאושר ומחקו את היצוא בהתאם לנוהל הפריסה.

## אלגוריתמים {#algorithms}

האלגוריתמים הנפוצים הם:

- `ed25519` לחשבונות לקוח ולזהויות זרימה.
- `secp256k1` כאשר חשבון לקוח זקוק לזהות secp256k1.
- `bls_normal` לכל זהות קונצנזוס של צומת או צומת.

בדקו אילו אלגוריתמים בדיוק נתמכים בגרסה שבניתם באמצעות:

```bash
cargo run --bin kagami -- keys --help
```

## מפתחות פיתוח דטרמיניסטיים {#deterministic-development-keys}

ליצירת נתוני בדיקה הניתנים לשחזור, העבירו seed בן 32 בתים המקודד כ־64 תווים הקסדצימליים. הקידומת האופציונלית `0x` מתקבלת:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

ה־seed הוא חומר של מפתח פרטי. השתמשו ב־seed דטרמיניסטי רק לפיתוח מקומי ולבדיקות. השמיטו את `--seed-hex` כדי ליצור מפתח ייצור מאקראיות של מערכת ההפעלה.

## מפתחות הסכמה BLS והוכחות החזקה {#bls-consensus-keys-and-proofs-of-possession}

זהויות הקונצנזוס של צמתים וצמתים ב־Iroha 3 משתמשות במפתחות BLS-normal. צרו מפתח BLS-normal והוכחת החזקה (PoP) באמצעות:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` תקף רק עם `bls_normal`; הוא מוסיף את `pop.hex` לספריית המשמורת. genesis חתום דורש PoP תואם לכל מאמת מצביע. בתצורת הצמתים, ציינו את ה־PoP של כל מאמת ב־`trusted_peers_pop`: צמתים מהימנים ללא PoP תקף מוחרגים מרשימת הקונצנזוס, ומפה ריקה אינה מניבה מאמתים כלל, ולכן צומת שהמפה שלו משמיטה את מאמתי ה־genesis מסרב לעלות. הריצו צומת לסנכרון בלבד עם `[sumeragi] role = "observer"`.

## פלט למשמורת {#custody-output}

`kagami keys` דורש את `--out-dir` ולעולם אינו כותב חומר של מפתח פרטי לפלט התקני. קראו את `public.key`, את `private.key` ואת `pop.hex` האופציונלי מתוך הספרייה שנוצרה. כל קובץ מכיל ערך קנוני אחד ואחריו שורה חדשה, ולכן אוטומציה מפורשת המבוססת על קבצים פשוטה לביצוע:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

לעזרה המלאה שנוצרה עבור Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
