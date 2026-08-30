---
translation_locale: he
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגדרת הלקוח {#client-configuration}

לקוחות Iroha CLI ו SDK משתמשים בקונפיגירציה של TOML. האספנה שולחת את ההפסד הנוכחי ל `defaults/client.toml`; רשתות מקומיות שנוצרות כותבות גם קישור מתאים `client.toml` בתיקון ההוצאת שלהם.

::: details תבנית תיקון הלקוח

<<< @/snippets/client.template.toml

:::

## שדות הליבה {#core-fields}

לכל הפחות, קונפיגורציה של לקוח מזהה את שרשרת, נקודת סוף Torii ואת חשבון החתימה:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` בוחר את שרשרת העסקאות המוצעות אליהן.
- `torii_url` נקודות ב-peer Torii HTTP API.
- `[account].domain` משמשת על ידי קיצוצים CLI וקידוד בוחר כתובת; הקאנוניקלי `AccountId` עצמו הוא ללא תחום .
- `[account].public_key` ו `[account].private_key` חותמים על עסקאות.

החשבון חייב כבר להתקיים על שרשרת. עבור הרשת המקומית המקובלת זה מנוהל על ידי מוניסט הגנזיס הקבוצת.

::: info רגישות המקרה

שמות Iroha הם רגישים למקרה לאחר ניתוח קנוני. לדוגמה, `wonderland.universal`, `Wonderland.universal`, ו `looking_glass.universal` הם דומנים פשוטים נפרדים.

:::

## אימות בסיסי {#basic-authentication}

החלק בחופשי `[basic_auth]` מוסיף כותרת HTTP `Authorization` לבקשות הלקוח. עמיתים Iroha אינם מתרגמים את האישורים האלה ישירות; השתמש בהם כאשר Torii עומד מאחורי פרוקסי ההפוך כגון Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## הגדרות העסקאות {#transaction-settings}

התנהגותו של העסקה מותאמת בקטע `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` הוא תוחלת העסקה במילי שניות.
- `status_timeout_ms` שולטת כמה זמן הלקוח מחכה למצב העסקה.
- `nonce = true` מבקשת מהלקוח להוסיף סעיף כלשהו כדי שהמעשי חוזרים על עצמם יצרו חישובים שונים.

## קישור הגדרות {#connect-queue-settings}

לקוחות Iroha הנוכחיים יכולים גם להשתמש בקטע `[connect]` בחופשי למצב הזדר המקומי:

```toml
[connect]
queue_root = "./queue"
```

השתמש בזה כאשר זרימת עבודה זקוקה לאחסון קבוע בצד הלקוח.

## יצירת הגדרות {#generating-configurations}

עבור רשתות מקומיות חד פעמיות, מעדיפים Kagami כי הוא כותב קונפיג'ים מתאימים Iroha 3, גנזה, תסריטים, ו README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

השתמשו ב- `./localnet/client.toml` עם CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
