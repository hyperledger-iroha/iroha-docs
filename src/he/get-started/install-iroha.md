---
translation_locale: he
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תקין Iroha 3 {#install-iroha-3}

דף זה מכסה את זרימת העבודה הנוכחית של התקנת Iroha 3 שרשרת כלים
ובלוגים בינאריים שמשתמשים בזרם העליון `hyperledger-iroha/iroha` מקום עבודה.

## 1. תנאים מוקדמים {#_1-prerequisites}

תקין את זה קודם:

- [rustup](https://www.rust-lang.org/tools/install), אז המעטה
  `rust-toolchain.toml` שרשרת הכלים (`1.93.1`) מתקין באופן אוטומטי
- `git`
- בחירה, Docker ו Docker Compose עבור ההתחלה המהירה המקומית

## 2. קלון את חלל העבודה {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. לבנות את מקום העבודה {#_3-build-the-workspace}

לבנות הכל:

```bash
cargo build --workspace
```

עבור מבנה קטן יותר ממוקד על המפעיל, תרכיב רק את השולשאות העיקריות:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

השבדים המוצאים נכתבים ל: `target/debug/` או `target/release/`.

## 4. לבדוק את הכלים המוסמכים {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

שלושת השולשנים שתשתמשו בהם בדרך כלל הם:

- `irohad` עבור הדיימון של השותפים
- `iroha` עבור CLI גישה Torii נקודות הסיום של המפעיל
- `kagami` עבור מפתחות, מגניפי גנזה ופרופילים של רשת מקומית

## 5. רשת מקומית אופציונלית Docker דרך {#_5-optional-localnet-and-docker-path}

זרימת הרשת המקומית הנוכחית הנמכנת במקור נוצרת Kagami. זה כותב עמיתי
קונפיגס, ארטיפקטים של הגנזה, קונפיגור לקלינט, תסריטים עוזרים
תורגם קבוצה שמתאימה לקוד הנבדק:

- `kagami localnet` עבור כתבי עמיתי מקומיים
- `kagami docker` עבור Docker Compose נבנתה מפריט לוקלינט

המשך עם [שיגור Iroha 3](/he/get-started/launch-iroha.md).
