---
translation_locale: he
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מפתחות לשימוש ברשתים {#keys-for-network-deployment}

כל רשת צריכה חומר מפתח נפרד עבור לקוחות, עמיתים, חתימת גנזה, ו, עבור פרופילים של NPoS או Nexus, זהויות אישור BLS.

## היכן משתמשים במפתחות {#where-keys-are-used}

- מפתחות החתימה של הלקוח מאוחסרות ב `client.toml` תחת `[account]`.
- מפתחות זהות עמידה מאוחסנים בכל עמידה `config.toml` כמו `public_key` ו `private_key`.
- גילוי עמידים משתמש במפתח ציבורי של כל עמידה ב `trusted_peers`.
- בדיקת BLS הוכחות רכוש מאוחסן ב- `trusted_peers_pop` לפרופילים של NPoS.
- חתימת בראשית משתמשת ב `[genesis].public_key` בהשוואה לעמיתים ובפתח פרטי תואם בעת חתימה על המניפסט.

עבור השימוש המקומי או במבחן, תן Kagami ליצור את כל הקבצים האלה יחד:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

עבור רשת או פרופיל קיים, השתמשו בזרם המובנה:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## ליצור זוגות מפתחות בודדות {#generate-individual-key-pairs}

להשתמש `kagami keys` עבור חומר מפתח עצמאי:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

עבור חומר מעודד BLS, לכלול הוכחה לבעסויות:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

השתמש `--seed` רק עבור ציוד פיתוח שניתן לשחזר. לשימוש הייצור, ליצור מפתחות חדשות ולשמור מפתחות פרטיות מחוץ למלאי האחסון.

## עקביות בין השניים {#peer-consistency}

כל המאושרים חייבים להסכים על אותו עסקנת הגנז, טופולוגיה, מפתחות ציבוריים משותפים אמינים ו-validator PoPs. מפתח משותף אחד חסר או לא מתאים יכול למנוע את הרשת להתחיל או להגיע להסכמה.

עבור מינימום הפעלת סובלנות אשמה ביזנטנית, השתמש לפחות בארבעה עמיתים. לכל עמית חייב להיות מפתח פרטי משלו, אבל כל קונפיגורציה של עמיתים צריכה את אותה קבוצת עמיתות אמינה.

## חשבונות לקוחות {#client-accounts}

חשבון הלקוח ב `client.toml` חייב כבר להתקיים על שרשרת. הוא יכול להיות רשום על ידי מוניסט הגנזיס או על ידי עסקאות מאוחר יותר. להימנע משימוש זהות חתימה גנזיס כחשבון יישום מעמד רב; הזכויות ל-genesis חל רק במהלך הסיבוב של הגניזה, ולקוחות הייצור צריכים להשתמש בחשבון ובפקידים שלהם.
