---
translation_locale: he
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות אינטגרציה {#troubleshooting-integration-issues}

חלק זה מציע עצות פתרון בעיות לאינטגרציה של Iroha 3. אם הבעיה שאתם חווים אינה מתוארת כאן, צור איתנו קשר באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## הלקוח לא יכול להתחבר {#client-cannot-connect}

בדוק אם הקונפיגציה של הלקוח מצביעה לכתובת Torii של הדוגמא:

```toml
torii_url = "http://127.0.0.1:8080/"
```

עבור בדיקות CLI, העבירו את אותו תיק במפורש:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

אם הדוגמא פועלת ב Docker או Kubernetes, השתמשו במארח או כתובת שירות שניתן להגיע אליה מתהליך הלקוח. `127.0.0.1` בתוך מיכל אינו המכונה המארחת.

בדיקות ציבוריות Taira, תתחילו עם ס Sonda Endpoint לא חתומה:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

אם פקודות אלה נכשלות עם `502`, ‏TLS, ‏DNS או שגיאות timeout, תקנו את הגישה לרשת או המתינו לנקודת הקצה של רשת הבדיקה הציבורית לפני איתור תקלות במפתחות חשבון או במטעני עסקאות.

## עסקים נדחו. {#transactions-are-rejected}

רוב כישלונות העסקה נגרמים על ידי אימות או חוסר התאמה באישור:

- המפתח הציבורי של החשבון בקונפיגור הלקוח אינו מתאים למפתח הפרטי המשמש לחתימה.
- החשבון אינו רשום בהתחלה או על ידי עסקאות קודמות.
- החשבון חסר את סימן הרשיון או תפקיד הנדרש על-ידי מבדיקת זמן הפעלה.
- תחום ID חסר את מיומנות החלל הנתונים שלו, כמו `domain.dataspace`

השתמש `--output-format text` בעת תיקון הפקודות CLI כדי שגיאות יהיו קלות יותר לקרוא:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## שאילתות מחזירות תוצאות ריקות {#queries-return-empty-results}

תוצאות חיפוש ריקות לא תמיד פירושו כי החיפוש נכשל. לבדוק:

- העסקה שהייתה אמורה ליצור את האובייקט נחברה.
- האתר הנדרש, הגדרה של נכס או חשבון ID הוא קנוני.
- עמודי דף או פילטר לא שולחים את השורה הנציפית
- הלקוח מחובר לרשת המיועדת, לא רשת מקומית אחרת

עבור בדיקות domain, התחילו בשאילתה הרחבה ביותר:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## הזרמים של אירועים או מחסומים עוצרים מוקדם. {#event-or-block-streams-stop-early}

דוגמאות של זרם בלוקים ואירועים מבוססות על נקודות קץ של זרם Torii. בדוק אם הדוגמא עדיין פועלת, ולאחר מכן לבדוק עם זמן:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

עבור אינטגרציות HTTP, השווא את דרכי הנקודה הסופית שלך עם הדו"ח הנוכחי [Torii של נקודת הסיום ](/he/reference/torii-endpoints.md).
