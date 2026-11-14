---
translation_locale: he
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: c42adbe41e322c93509279f1f558d4450431de90c596f37eb3999754d4387f78
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review+reviewed-delta
---
# מפתחות לשימוש ברשתים {#keys-for-network-deployment}

כל רשת זקוקה לחומר מפתחות נפרד ללקוחות, לחתימת genesis ולזהויות מאמתים מסוג BLS-normal עם הוכחות החזקה.

## היכן משתמשים במפתחות {#where-keys-are-used}

- מפתחות החתימה של הלקוח מאוחסרות ב `client.toml` תחת `[account]`.
- מפתחות הזהות של הצומת מאוחסנים בכל `config.toml` של צומת בתור `public_key` ו-`private_key`.
- גילוי צמתים משתמש במפתח הציבורי של כל צומת ב-`trusted_peers`.
- הוכחות ההחזקה של מאמתי BLS נשמרות ב־`trusted_peers_pop` עבור כל מאמת, יהא מצב הקונצנזוס אשר יהא.
- חתימת בראשית משתמשת ב `[genesis].public_key` בהשוואה לצמתים ובפתח פרטי תואם בעת חתימה על המניפסט.

עבור השימוש המקומי או במבחן, תן Kagami ליצור את כל הקבצים האלה יחד:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

עבור רשת או פרופיל קיים, השתמשו בזרם המובנה:

```bash
cargo run --bin kagami -- wizard
```

## ליצור זוגות מפתחות בודדות {#generate-individual-key-pairs}

השתמשו ב־`kagami keys` לחומר מפתחות עצמאי:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

עבור חומר של מאמת BLS, כללו הוכחת החזקה:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

השתמשו ב־`--seed-hex` רק עם סוד הקסדצימלי באורך מדויק של 32 בתים עבור נתוני בדיקה לפיתוח הניתנים לשחזור. בפריסת ייצור השמיטו אותו כדי ש־Kagami ישתמש באקראיות של מערכת ההפעלה, ואז העבירו את יצוא המפתח הפרטי הלא מוצפן אל גבול המשמורת המאושר. הפקודה לעולם אינה מדפיסה מפתחות פרטיים.

## עקביות בין צמתים {#peer-consistency}

כל המאמתים צריכים להשתמש באותה עסקת בראשית, באותה טופולוגיה, באותם מפתחות ציבוריים של העמיתים המהימנים ובאותן הוכחות החזקה של המאמתים (PoPs). אפילו מפתח אחד שחסר או אינו תואם עלול למנוע מהרשת לעלות או להגיע להסכמה.

עבור מינימום הפעלת סובלנות אשמה ביזנטנית, השתמש לפחות בארבעה צמתים. לכל צומת חייב להיות מפתח פרטי משלו, אבל כל קונפיגורציה של צמתים צריכה את אותה קבוצת הצומת שלות אמינה.

## חשבונות לקוחות {#client-accounts}

חשבון הלקוח ב־`client.toml` חייב כבר להתקיים בשרשרת. אפשר לרשום אותו באמצעות מניפסט ה־genesis או בעסקאות מאוחרות יותר. הימנעו משימוש בזהות החתימה של genesis כחשבון יישום רב־תכליתי; הרשאות genesis חלות רק במהלך סבב ה־genesis, ולקוחות ייצור צריכים להשתמש בחשבונות ובחותמים משלהם.
