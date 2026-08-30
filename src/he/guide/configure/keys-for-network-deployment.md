---
translation_locale: he
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

עבור רשת או פרופיל קיים, השתמשו בזרם המובנה:

```bash
cargo run --bin kagami -- wizard
```

## ליצור זוגות מפתחות בודדות {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## עקביות בין השניים {#peer-consistency}

כל המאושרים חייבים להסכים על אותו עסקנת הגנז, טופולוגיה, מפתחות ציבוריים משותפים אמינים ו-validator PoPs. מפתח משותף אחד חסר או לא מתאים יכול למנוע את הרשת להתחיל או להגיע להסכמה.

עבור מינימום הפעלת סובלנות אשמה ביזנטנית, השתמש לפחות בארבעה עמיתים. לכל עמית חייב להיות מפתח פרטי משלו, אבל כל קונפיגורציה של עמיתים צריכה את אותה קבוצת עמיתות אמינה.

## חשבונות לקוחות {#client-accounts}

חשבון הלקוח ב `client.toml` חייב כבר להתקיים על שרשרת. הוא יכול להיות רשום על ידי מוניסט הגנזיס או על ידי עסקאות מאוחר יותר. להימנע משימוש זהות חתימה גנזיס כחשבון יישום מעמד רב; הזכויות ל-genesis חל רק במהלך הסיבוב של הגניזה, ולקוחות הייצור צריכים להשתמש בחשבון ובפקידים שלהם.
