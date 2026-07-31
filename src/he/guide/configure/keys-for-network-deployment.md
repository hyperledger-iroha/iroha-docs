---
translation_locale: he
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מפתחות לשימוש ברשת {#keys-for-network-deployment}

כל רשת צריכה חומר מפתח נפרד עבור לקוחות, עמיתים, חתימת גנזיס,
ו, עבור NPoS או Nexus פרופילים, BLS זהויות מבקשות.

## היכן משתמשים במפתחות {#where-keys-are-used}

- מפתחות החתימה של הלקוח נשמרות `client.toml` תחת `[account]`.
- מפתחות זהות עמיתים מאוחסנים בכל עמית `config.toml` כמו `public_key` ו
  `private_key`.
- גילוי עמידים משתמש במפתח הציבורי של כל עמידה `trusted_peers`.
- BLS בדיקת הוכחות רכוש מאוחסנות `trusted_peers_pop` עבור NPoS
  פרופילים.
- חתימה בראשית משתמשת `[genesis].public_key` ב- peer config ו
  תואמת מפתח פרטי בעת חתימה על המניפסט.

עבור הפעלות מקומיות או בדיקות, Kagami ליצור את כל הקבצים האלה ביחד:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

עבור רשת או פרופיל קיים, השתמשו בזרם הובא:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## ליצור זוגות מפתחות בודדות {#generate-individual-key-pairs}

שימוש `kagami keys` עבור חומר מפתח עצמאי:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

עבור BLS חומר אישור, כולל הוכחה לבעס:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

שימוש `--seed` רק עבור ציוד פיתוח שניתן לשחזר.
הפעלת, יצירת מפתחות חדשות וחסוך מפתחות פרטיות מחוץ למלאי.

## עקביות בין השניים {#peer-consistency}

כל המאשרים חייבים להסכים על אותו עסקאות גנז, טופולוגיה,
מפתחות ציבוריות משותפות, ומבחינת PoPs. מפתח משותף אחד חסר או לא מתאים יכול
למנוע את התחילתו של הרשת או להגיע להסכמה.

עבור מינימום של פגישות ביזנטיות סובלנות, להשתמש לפחות ארבעה עמינים.
שווים חייבים להיות מפתח פרטי משלה, אבל כל תיקון שווים צריך את אותו
סגור משותפים אמינים.

## חשבונות לקוחות {#client-accounts}

חשבון הלקוח ב `client.toml` זה כבר חייב להיות קיים על שרשרת.
רשום במניפסט הגנזה או על ידי עסקאות מאוחר יותר.
גינזיס חתימה זהות כחשבון יישום ארוך-חיים; זכויות גינזיс
יישמשו רק במהלך סיבוב ההתחלה, ולקוחות הייצור צריכים להשתמש
חשבונות ותפקידים.
