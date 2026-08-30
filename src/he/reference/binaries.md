---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עבודה עם Iroha בינאריים {#working-with-iroha-binaries}

זרימת העבודה של המפעיל Iroha 3 מסתובבת סביב ארבעה בינרים עיקריים:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) לניהול דיימון משותף
- `iroha3d_taira` למוצא ההסכם הקנוני Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) עבור פקודות CLI ושל המפעיל
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) עבור מפתחות, גנזיס, רשתות מקומיות ופרופילים

## בנייה ממקור {#build-from-source}

מהשורש של חלל העבודה העליון:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

משני השחרור זמינים לאחר מכן ב `target/release/`.

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

מרחב העבודה העליון משתמש `kagami localnet` ו `kagami docker` כדי ליצור קבצים Docker Compose שמתאימים לקוד המוצא. תמונת `hyperledger/iroha:dev` יכולה לשמש עם הקבצים המובנים אלה.

תפעילו את CLI בקופסא:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

להפעיל Kagami בקופסא:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

עבור ההתחלתה של השותפים, ליצור רשת מקומית ולהרכיב את הקובץ קודם:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## איזה בינארי אני צריך להשתמש? {#which-binary-should-i-use}

- השתמש `iroha3d` כאשר אתה מתחיל או מפעיל עמיתים מחוץ לשחרור האישור הציבורי Taira.
- השתמש `iroha3d_taira --sora` רק לשימוש ב-validator Taira קנוני; זה מכיל את הפרופיל של שרשרת, אחסון ומחתרת זמן הפעלה של Taira.
- השתמש `iroha` כאשר אתה צריך לדרוש את הספר הגדול, להגיש עסקאות או לבחון נקודות הסיום של המפעיל .
- השתמש `kagami` כאשר אתה זקוק למפתחות, מוניסטים גנזיס, קבוצות פרופילים או נכסים של רשת מקומית.
