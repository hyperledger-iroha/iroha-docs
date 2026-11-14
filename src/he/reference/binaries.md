---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: 75848623e735abc80326f9ebda6f74ab438b67eaeddeacdd4d8c5509856a999e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# עבודה עם Iroha בינאריים {#working-with-iroha-binaries}

זרימת העבודה של המפעיל Iroha 3 מסתובבת סביב ארבעה בינרים עיקריים:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad) לניהול דיימון צומת
- `iroha3d_taira` למוצא ההסכם הקנוני Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli) עבור פקודות CLI ושל המפעיל
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) עבור מפתחות, גנזיס, רשתות מקומיות ופרופילים

## בנייה ממקור {#build-from-source}

מהשורש של חלל העבודה העליון:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

קובצי ההפעלה של גרסת ההפצה זמינים לאחר מכן תחת `target/release/`.

כדי לבדוק את פני השטח של הפקודה:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## להפעיל ישירות מהמחסן {#run-directly-from-the-repository}

אם אתה לא רוצה להתקין משהו באופן גלובלי, השתמש `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker תמונה {#docker-image}

סביבת העבודה של מאגר המקור משתמשת ב־`kagami localnet generate` וב־`kagami docker` ליצירת קובצי Docker Compose התואמים לקוד בעותק המקומי. אפשר להשתמש בדמות `hyperledger/iroha:dev` עם הקבצים שנוצרו.

תפעילו את CLI בקופסא:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

להפעיל Kagami בקופסא:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

עבור ההתחלתה של הצמתים, ליצור רשת מקומית ולהרכיב את הקובץ קודם:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## איזה בינארי אני צריך להשתמש? {#which-binary-should-i-use}

- השתמש `iroha3d` כאשר אתה מתחיל או מפעיל צמתים מחוץ לשחרור האישור הציבורי Taira.
- השתמשו ב־`iroha3d_taira --sora` רק לפריסה קנונית של מאמת Taira; הוא אוכף את פרופיל השרשרת, האחסון והחותם בזמן הריצה של Taira.
- השתמש `iroha` כאשר אתה צריך לדרוש את הספר הגדול, להגיש עסקאות או לבחון נקודות הסיום של המפעיל .
- השתמשו ב־`kagami` כאשר דרושים מפתחות, מניפסטים של genesis, חבילות פרופיל או ארטיפקטים של רשת מקומית.
