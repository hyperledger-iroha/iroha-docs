---
translation_locale: he
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פועלים Iroha על מתכת עירומה {#running-iroha-on-bare-metal}

השתמש בזרם העבודה הזה כאשר אתה רוצה להפעיל עמיתים ישירות במארחים במקום דרך Docker Compose. עץ המקור הנוכחי מספק Kagami גנרטורים שכתבים תואמת בראשית, קונפיגיות עמיתים, הקונפיגית לקלינט, ו- start/stop סקרפטים.

## 1. לבנות את השניים {#_1-build-the-binaries}

מרחב העבודה Iroha מעלה המים:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

זה מייצר:

- `target/release/irohad` עבור הדיימון השותף
- `target/release/iroha` עבור CLI
- `target/release/kagami` עבור ייצור המפתחות, גנזיס ומערכת רשת מקומית

## 2. ליצור רשת מקומית {#_2-generate-a-local-network}

ליצור רשת מקומית של ארבעה עמיתים Iroha 3:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

קובץ ההוצא מכיל את הקבצים המופעלים `genesis.json`, `genesis.signed.nrt`, קבצים משותפים `config.toml`, `client.toml`, תסריטים עוזרים, ו- `README.md` עם פקודות מדויקות עבור חבורת זו.

## 3. התחילו לצוותים {#_3-start-peers}

עבור רשת מקומית חד פעמית שנוצרה, השתמשו בסקריפט שנוצר:

```bash
./localnet/start.sh
```

אם אתה צריך לחבר את כל הדירוג לתוך מנהל תהליך כגון systemd, השתמש בפקודה ההפעלה המוקדמת ב `./localnet/README.md` עבור כל דירוג. שמרו על הדירוג של `config.toml`, מפתח פרטי, תיווך אחסון ומזרים בנפרד.

## 4. לנהל את הרשת {#_4-operate-the-network}

השתמשו בהגדרת הלקוח המוצא:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

עצור את הרשת המקומית המיוצרת עם:

```bash
./localnet/stop.sh
```

## 5. הערות ייצור {#_5-production-notes}

- ליצור מפתחות פרטיות חדשות לייצור ולשמור אותן מחוץ למחסון.
- לגרום לכל עמיתיכם להסכים על אותו עסקאות בראשית חתומה, טופולוגיה, עמיתי אמון, ומבחין PoPs.
- קשור את האוזן לראיונות מקומיים של המארח רק כאשר השותף לא צריך להיות נגיש ממכונות אחרות.
- השתמשו ב-reverse proxy או firewall עבור חשיפה Torii, auth בסיסי, TLS, ומגבלת שיעור.
- לטפל בשינויים בגנזה או בטופולוגיה של הסכמה כמגירה מתואמת, ולא בעריכות קבצים חד משותפות.

עבור פיתוח מקומי במכולות, השתמשו בתהליך העבודה [Lunch Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
