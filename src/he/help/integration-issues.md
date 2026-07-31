---
translation_locale: he
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות אינטגרציה {#troubleshooting-integration-issues}

חלק זה מציע עצות פתרון בעיות Iroha 3 אינטגרציה.
מה שאתה חווה לא מתואר כאן,
התקשר אלינו באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## הלקוח לא יכול להתחבר {#client-cannot-connect}

בדוק אם הקונפיגציה של הלקוח מצביעה על קונפיגציות של השותפים Torii כתובת:

```toml
torii_url = "http://127.0.0.1:8080/"
```

עבור CLI בדיקות, להעביר את אותו תיק באופן מפורש:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

אם השותף יגיע Docker או Kubernetes, להשתמש בכתובת המארח או השירות
ניתן להגיע אליה מהתהליך של הלקוח. `127.0.0.1` בתוך מיכל לא
המכונה המארחת.

לציבור Taira בדיקות, מתחילים עם ס Sonda Endpoint לא חתומה:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

אם פקודות אלה נכשלים עם `502`, TLS, DNS, או שגיאות זמן, תיקון רשת
גישה או מחכה לנקודת הסיום הציבורית של טסטנץ לפני תיקון החירום
מפתחות או מטענים שימושיים של עסקאות.

## העסקים נדחו {#transactions-are-rejected}

רוב כישלונות העסקה נגרמים על ידי אימות או אי התאמה לאיתור:

- המפתח הציבורי של החשבון בנתון הלקוח לא מתאים למפתח הפרטי
  משמש לחתימה
- החשבון אינו רשום בהתחלה או בעקבות עסקאות קודמות.
- החשבון חסר את סימן הרשיון או תפקיד הנדרש על ידי זמן ההפעלה
  מבטיח
- תחום ID חסר את מיומנות השטח נתונים שלו, כגון:
  `domain.dataspace`

שימוש `--output-format text` בזמן תיקון CLI פקודות כך שגיאות יהיו קלות יותר
לקרוא:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## שאלונות מחזירים תוצאות ריקות {#queries-return-empty-results}

תוצאות חיפוש ריקות לא תמיד אומר שהחיפוש נכשל. לבדוק:

- העסקה שצריכה ליצור את האובייקט הושלמה.
- הדומיין, הגדרת הנכסים או החשבון שנשאלו ID הוא קנוני
- דף או פילטר לא שולחים את השורה הנציפית
- הלקוח מחובר לרשת המיועדת, ולא רשת מקומית אחרת

עבור בדיקות תחום, תתחיל עם השאלת הרחבה ביותר:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## הזרמים של אירועים או חסינות עוצרים מוקדם {#event-or-block-streams-stop-early}

דוגמאות של זרם בלוקים ופעילויות מבוססות על Torii נקודות קץ זרימה.
ה-peer עדיין פועל, ואז בדיקת עם זמן הפסקה:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

עבור HTTP אינטגרציות, להשוות את הנתיבים של נקודת הסיום שלך עם הזרם
[Torii נקודת ההסכם](/he/reference/torii-endpoints.md).
