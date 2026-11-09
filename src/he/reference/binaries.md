---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עבודה עם Iroha בינאריים {#working-with-iroha-binaries}

זרימת העבודה של המפעיל Iroha 3 מסתובבת סביב ארבעה בינרים עיקריים:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) לניהול דיימון צומת
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

במדריך [השקה Iroha 3](/he/get-started/launch-iroha.md) מוסבר כיצד לבנות ולהפעיל ארבעה מאמתים ב־Docker באמצעות קבצים בינאריים מאותה גרסת מקור.

## איזה בינארי אני צריך להשתמש? {#which-binary-should-i-use}

- השתמש `iroha3d` כאשר אתה מתחיל או מפעיל צמתים מחוץ לשחרור האישור הציבורי Taira.
- השתמש `iroha3d_taira --sora` רק לשימוש ב-validator Taira קנוני; זה מכיל את הפרופיל של שרשרת, אחסון ומחתרת זמן הפעלה של Taira.
- השתמש `iroha` כאשר אתה צריך לדרוש את הספר הגדול, להגיש עסקאות או לבחון נקודות הסיום של המפעיל .
- השתמשו ב־`kagami` כאשר דרושים מפתחות, מניפסטים של genesis, חבילות פרופיל או ארטיפקטים של רשת מקומית.
