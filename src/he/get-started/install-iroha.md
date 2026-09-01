---
translation_locale: he
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# להתקין Iroha 3 {#install-iroha-3}

דף זה מכסה את זרימת העבודה הנוכחית להתקנה של שרשרת הכלים Iroha 3 והשניות המשתמשות במרחב עבודה `hyperledger-iroha/iroha` מקדימה.

## 1. תנאים מוקדמים {#_1-prerequisites}

תקין את זה קודם:

- [rustup](https://www.rust-lang.org/tools/install), כך שרשרת הכלים `rust-toolchain.toml` המחוברת (`1.93.1`) מותקנת באופן אוטומטי
- `git`
- באופן אופציונלי, Docker ו Docker Compose עבור ההתחלה המהירה המקומית של מספר צמתים

## 2. מקלון את החלל העבודה {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. לבנות את מרחב העבודה {#_3-build-the-workspace}

לבנות הכל:

```bash
cargo build --workspace
```

עבור מבנה קטן יותר ממוקד על המפעיל, תרכיב רק את השולשאות העיקריות:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

השניים המוצאים נכתבים ל- `target/debug/` או `target/release/`.

## 4. לבדוק את הכלים המקימים {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ארבעת השניים שתשתמשו בהם בדרך כלל הם:

- `iroha3d` עבור דיימון סטנדרטי צומת
- `iroha3d_taira` למוצא ההסכם הקנוני Taira
- `iroha` עבור גישה ל- CLI ל- Torii ולנקודות הסיום של המפעיל
- `kagami` עבור מפתחות, פרופיל גנזיס ופרופילים של רשת מקומית.

## 5. רשת מקומית אופציונלית ודרך Docker {#_5-optional-localnet-and-docker-path}

זרימת ה-localnet הנוכחית בתמיכה במקור נוצרת על ידי Kagami. היא כותבת קונפיג'ים של צמתים, ארטיפקטים של גנזיס, קונפיגור לקלינט, תסריטים של עוזר, וקובץ Compose אופציונלי שמתאים לקוד המוצא:

- `kagami localnet` עבור כתבי צומתי מקומיים native
- `kagami docker` עבור Docker Compose שנוצר מפריט רשת מקומית.

המשך עם [שיגור Iroha 3](/he/get-started/launch-iroha.md).
