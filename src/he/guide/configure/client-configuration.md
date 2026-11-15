---
translation_locale: he
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# הגדרת הלקוח {#client-configuration}

לקוחות Iroha CLI ו SDK משתמשים בקונפיגירציה של TOML. האספנה שולחת את ההפסד הנוכחי ל `defaults/client.toml`; רשתות מקומיות שנוצרות כותבות גם קישור מתאים `client.toml` בתיקון ההוצאת שלהם.

::: details תבנית תיקון הלקוח

<<< @/snippets/client.template.toml

:::

## שדות הליבה {#core-fields}

לכל הפחות, תצורת לקוח מזהה את השרשרת, את זהות הרשת שלה, את נקודת הקצה של Torii, את הקשר הרשת של החשבון ואת מפתח החתימה:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` בוחר את שרשרת העסקאות המוצעות אליהן.
- `network_id` הוא זהות הרשת הנגזרת מה־genesis, שאליה נקשרת כל בקשה חתומה. הגדירו בדיוק אחד מבין `network_id` ו־`network_id_file`; צומת מפרסם את הערך ב־`GET /v1/accounts/capabilities`.
- `torii_url` מצביע על ה־API של Torii בצומת, הזמין דרך HTTP.
- `[account].chain_discriminant` בוחר את קידומת חשבונות I105 של הרשת. ברשתות הציבוריות אפשר להשתמש במקום זאת ב־`[account].profile = "taira"` או ב־`"minamoto"`. אחד מהשניים נדרש, וה־`AccountId` הקנוני עצמו נטול דומיין.
- `[account].public_key` ו־`[account].private_key` משמשים לחתימה על עסקאות; `private_key_file` יכול להחליף את `private_key`.

החשבון חייב כבר להתקיים בשרשרת. ברשת המקומית המוגדרת כברירת מחדל, מניפסט ה־genesis המצורף מטפל בכך.

::: info רגישות המקרה

שמות Iroha הם רגישים למקרה לאחר ניתוח קנוני. לדוגמה, `wonderland.universal`, `Wonderland.universal`, ו `looking_glass.universal` הם דומנים פשוטים נפרדים.

:::

## אימות בסיסי {#basic-authentication}

הסעיף האופציונלי `[basic_auth]` מוסיף כותרת HTTP מסוג `Authorization` לבקשות הלקוח. צומתי Iroha אינם מפרשים את פרטי ההזדהות האלה ישירות; השתמשו בהם כאשר Torii נמצא מאחורי proxy הפוך כגון Nginx.

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

ה־CLI של `iroha` קורא גם מקטע `[connect]` אופציונלי למצב תור מקומי. תצורת ה־SDK לשימוש חוזר אינה מקבלת אותו:

```toml
[connect]
queue_root = "./queue"
```

השתמשו בכך כשתהליך עבודה זקוק לאחסון תור עמיד בצד הלקוח. ברירת המחדל של `connect.queue_root` היא `~/.iroha/connect`, ונתיב יחסי נפתר מתוך התיקייה המכילה את קובץ ה־TOML של הלקוח.

## יצירת הגדרות {#generating-configurations}

עבור רשתות מקומיות חד פעמיות, מעדיפים Kagami כי הוא כותב קונפיג'ים מתאימים Iroha 3, גנזה, תסריטים, ו README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

השתמשו ב- `./localnet/client.toml` עם CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
