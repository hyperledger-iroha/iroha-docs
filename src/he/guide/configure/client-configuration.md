---
translation_locale: he
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגדרת הלקוח {#client-configuration}

Iroha CLI ו SDK הלקוחות משתמשים TOML האספנה שולחת את
הפסד הנוכחי ב `defaults/client.toml`; רשתות מקומיות שנוצרו גם כותבים
התאמה `client.toml` לקובץ ההוצא שלהם.

::: details דפוס קונפיגירציה של לקוח

<<< @/snippets/client.template.toml

:::

## שדות הליבה {#core-fields}

לכל הפחות, תיקון לקלינט מזהה את שרשרת, Torii נקודת סוף, ו
חשבון חתימה:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` בוחרים את שרשרת העסקים שהוגשו.
- `torii_url` נקודות בשוויון Torii HTTP API.
- `[account].domain` הוא משמש על ידי CLI קיצוצים וקובעת סלקטור כתובות;
  הקנוניקה `AccountId` היא עצמה חסרת תחום.
- `[account].public_key` ו `[account].private_key` לחתום על עסקאות.

החשבון חייב כבר להתקיים על שרשרת. עבור הרשת המקומית המקובלת זה
הוחלט על ידי מוניפסט הגנזיס המזומן.

::: info רגישות במקרה

Iroha שמות הם רגישים למקרים לאחר ניתוח קנוני.
`wonderland.universal`, `Wonderland.universal`, ו
`looking_glass.universal` הם דומנים מפרדים.

:::

## אימות בסיסי {#basic-authentication}

בחופשי `[basic_auth]` הפרק מוסיף: HTTP `Authorization` כותרת ל
בקשות של הלקוח. Iroha עמיתים אינם מתרגמים את תעודות האישור הללו ישירות; שימוש
הם כאשר Torii הוא עומד מאחורי סגן הפוך כמו Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## הגדרות העסקאות {#transaction-settings}

התנהגות העסקה היא מותאמת עם `[transaction]` סעיף:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` הוא חיי העסקה במילי שניות.
- `status_timeout_ms` פיקוח כמה זמן הלקוח מחכה למסחר
  מצב.
- `nonce = true` מבקש מהלקוח לכלול סכום כזה של עסקאות חוזרות
  להפיק חשישים שונים.

## קישור הגדרות {#connect-queue-settings}

זרם Iroha הלקוחות יכולים גם להשתמש בחופשי `[connect]` פרק מקומי
מצב השורה:

```toml
[connect]
queue_root = "./queue"
```

השתמש בזה כאשר זרימת עבודה זקוקה לאחסון קבוע בצד הלקוח.

## יצירת הגדרות {#generating-configurations}

עבור רשתות מקומיות חד פעמיות, מעדיפים Kagami כי זה כותב מתאים Iroha
3 קונפיגס, גנזיס, תסריטים, README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

השתמשו במוצר `./localnet/client.toml` עם CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
