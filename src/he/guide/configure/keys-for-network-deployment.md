---
translation_locale: he
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# מפתחות לשימוש ברשתים {#keys-for-network-deployment}

כל רשת צריכה חומר מפתח נפרד עבור לקוחות, צמתים, חתימת גנזה, ו, עבור פרופילים של NPoS או Nexus, זהויות אישור BLS.

## היכן משתמשים במפתחות {#where-keys-are-used}

- מפתחות החתימה של הלקוח מאוחסרות ב `client.toml` תחת `[account]`.
- מפתחות הזהות של הצומת מאוחסנים בכל `config.toml` של צומת בתור `public_key` ו-`private_key`.
- גילוי צמתים משתמש במפתח הציבורי של כל צומת ב-`trusted_peers`.
- בדיקת BLS הוכחות רכוש מאוחסן ב- `trusted_peers_pop` לפרופילים של NPoS.
- חתימת בראשית משתמשת ב `[genesis].public_key` בהשוואה לצמתים ובפתח פרטי תואם בעת חתימה על המניפסט.

עבור השימוש המקומי או במבחן, תן Kagami ליצור את כל הקבצים האלה יחד:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
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

כל המאושרים חייבים להסכים על אותו עסקנת הגנז, טופולוגיה, מפתחות ציבוריים של צמתים מהימנים ו-validator PoPs. מפתח צומת אחד חסר או לא מתאים יכול למנוע את הרשת להתחיל או להגיע להסכמה.

עבור מינימום הפעלת סובלנות אשמה ביזנטנית, השתמש לפחות בארבעה צמתים. לכל צומת חייב להיות מפתח פרטי משלו, אבל כל קונפיגורציה של צמתים צריכה את אותה קבוצת הצומת שלות אמינה.

## חשבונות לקוחות {#client-accounts}

חשבון הלקוח ב־`client.toml` חייב כבר להתקיים בשרשרת. אפשר לרשום אותו באמצעות מניפסט ה־genesis או בעסקאות מאוחרות יותר. הימנעו משימוש בזהות החתימה של genesis כחשבון יישום רב־תכליתי; הרשאות genesis חלות רק במהלך סבב ה־genesis, ולקוחות ייצור צריכים להשתמש בחשבונות ובחותמים משלהם.
