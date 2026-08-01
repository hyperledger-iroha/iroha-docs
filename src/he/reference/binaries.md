---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עבודה עם Iroha בינאריים {#working-with-iroha-binaries}

זרימת העבודה של המפעיל Iroha 3 מסתובבת סביב שלושה בינרים עיקריים:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) לניהול דיימון משותף
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) עבור פקודות CLI ושל המפעיל
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) עבור מפתחות, גנזיס, רשתות מקומיות ופרופילים

## בנייה ממקור {#build-from-source}

מהשורש של חלל העבודה העליון:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

משני השחרור זמינים לאחר מכן ב `target/release/`.

כדי לבדוק את פני השטח של הפקודה:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## להפעיל ישירות מהמחסן {#run-directly-from-the-repository}

אם אתה לא רוצה להתקין משהו באופן גלובלי, השתמש `cargo run`:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## איזה בינארי אני צריך להשתמש? {#which-binary-should-i-use}

- השתמש `irohad` כאשר אתה מתחיל או מפעיל עמיתיך.
- השתמש `iroha` כאשר אתה צריך לדרוש את הספר הגדול, להגיש עסקאות או לבחון נקודות הסיום של המפעיל .
- השתמש `kagami` כאשר אתה זקוק למפתחות, מוניסטים גנזיס, קבוצות פרופילים או נכסים של רשת מקומית.
