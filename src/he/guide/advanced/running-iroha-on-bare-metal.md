---
translation_locale: he
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ריצה Iroha על מתכת חיה {#running-iroha-on-bare-metal}

השתמש בתהליך העבודה הזה כאשר אתה רוצה להפעיל עמיתים ישירות במארחים במקום
דרך Docker Compose. עץ המקור הנוכחי מספק Kagami גנרטורים ש
כותב את הגנזיס המתאימה, קונפיג'ים של עמיתים, קונפגיג' לקלינט וסריפטים התחלה/הפסקת.

## 1. לבנות את השניים {#_1-build-the-binaries}

מעלה הזרם Iroha שטח עבודה:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

זה מייצר:

- `target/release/irohad` עבור הדיימון של השותפים
- `target/release/iroha` עבור CLI
- `target/release/kagami` עבור מפתח, גנזה ודורת רשת מקומית

## 2. ליצור רשת מקומית {#_2-generate-a-local-network}

ליצור ארבעה שווים Iroha 3 רשת מקומית

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

תיבת ההוצא מכילה את `genesis.json`,
`genesis.signed.nrt`, עמיתים `config.toml` תיקים, `client.toml`, סריפים עוזרים,
ומוצא `README.md` עם פקודות מדויקות עבור החבילה.

## 3. התחילו לעמיתים {#_3-start-peers}

עבור רשת מקומית חד פעמית שנוצרה, השתמשו בסקריפט המוצא:

```bash
./localnet/start.sh
```

אם אתה צריך לחבר כל עמית לתוך מנהל תהליך כגון systemd, השתמש
הפקודה של השיגור נרשמה ב `./localnet/README.md` לכל עמיתי.
של עמיתים. `config.toml`, מפתח פרטי, תיק אחסון, ומחנות נפרדות.

## 4. לנהל את הרשת {#_4-operate-the-network}

השתמשו בהקנת הלקוח המוצא:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

עצור את הרשת המקומית המיוצרת עם:

```bash
./localnet/stop.sh
```

## 5. הערות הייצור {#_5-production-notes}

- ליצור מפתחות פרטיות חדשות לייצור ולהחזיק אותם מחוץ
  מחסן.
- לגרום לכל עמיתיכם להסכים על אותו עסקה חתומה, טופולוגיה,
  עמיתים אמינים, ומבחין PoPs.
- קשור כתובות האוזן לאינטרסים מקומיים של המארח רק כאשר השותף צריך
  לא ניתן להגיע ממכונות אחרות.
- השתמשו בפרוקסי הפוך או בקיר אש Torii חשיפה בסיסית, TLS, ושיעור
  הגבלת.
- לטפל בשינויים בגנז או בטופולוגיה של הסכמה כמגירה מתואמת, לא
  תיקונים קבצים חד משותפים.

עבור פיתוח מקומי במכולות, השתמש [שיגור Iroha 3](../../get-started/launch-iroha.md)
Docker Compose זרימת עבודה.
