---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עבודה עם Iroha דנימונים {#working-with-iroha-binaries}

ה- Iroha 3 זרימת העבודה של המפעיל מסתובבת סביב שלושה בינרים עיקריים:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) לנהל דיימון עמית
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) עבור CLI פקודות המפעילה
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) עבור מפתחות, גנזיס, רשתות מקומיות ופרופילים

## לבנות ממקור {#build-from-source}

מהשורש של חלל העבודה למעלה:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

משני השחרור הם אז זמינים ב `target/release/`.

כדי לבדוק את שטח הפיקוד:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## תפעיל ישר מהמחסן {#run-directly-from-the-repository}

אם אתה לא רוצה להתקין משהו גלובלי, השתמש `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker תמונה {#docker-image}

המרחב של העבודה למעלה משמש `kagami localnet` ו `kagami docker` להפיק
Docker Compose הקבצים שמתאימים לקוד הנבדק. `hyperledger/iroha:dev`
תמונה יכולה להיות בשימוש עם הקבצים שנוצרו.

תפעיל את CLI במכל:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

לרוץ. Kagami במכל:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

כדי להפעיל את הדוגמאות, ליצור רשת מקומית ולהרכיב קובץ קודם:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## איזה משך שני אני צריך להשתמש בו? {#which-binary-should-i-use}

- שימוש `irohad` כאשר אתם מתחילים או מפעילים חברים.
- שימוש `iroha` כאשר אתה צריך לשאול את הספר הגדול, להגיש עסקאות או לבחון נקודות הסיום של המפעיל.
- שימוש `kagami` כאשר אתה זקוק למפתחות, מוניפסטים של הגנזה, קבוצות פרופילים או נכסים מקומיים.
