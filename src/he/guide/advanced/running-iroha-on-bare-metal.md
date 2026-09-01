---
translation_locale: he
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פועלים Iroha על מתכת עירומה {#running-iroha-on-bare-metal}

השתמש בזרם העבודה הזה כאשר אתה רוצה להפעיל צמתים ישירות במארחים במקום דרך Docker Compose. עץ המקור הנוכחי מספק Kagami גנרטורים שכתבים תואמת בראשית, קונפיגיות צמתים, הקונפיגית לקלינט, ו- start/stop סקרפטים.

## 1. לבנות את השניים {#_1-build-the-binaries}

מרחב העבודה Iroha מעלה המים:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

זה מייצר:

- `target/release/iroha3d` עבור הדיימון הצומת
- `target/release/iroha` עבור CLI
- `target/release/kagami` עבור ייצור המפתחות, גנזיס ומערכת רשת מקומית

## 2. ליצור רשת מקומית {#_2-generate-a-local-network}

ליצור רשת מקומית של ארבעה צמתים Iroha 3:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

קובץ ההוצא מכיל את הקבצים המופעלים `genesis.json`, `genesis.signed.nrt`, קבצים צמתים `config.toml`, `client.toml`, תסריטים עוזרים, ו- `README.md` עם פקודות מדויקות עבור חבורת זו.

## 3. התחילו לצוותים {#_3-start-peers}

עבור רשת מקומית חד פעמית שנוצרה, השתמשו בסקריפט שנוצר:

```bash
./localnet/start.sh
```

אם צריך לחבר כל צומת למנהל תהליכים כגון systemd, השתמשו עבור כל צומת בפקודת ההפעלה המתועדת ב-`./localnet/README.md`. שמרו בנפרד את `config.toml`, המפתח הפרטי, ספריית האחסון והיציאות של כל צומת.

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
- לגרום לכל הצמתים שלכם להסכים על אותו עסקאות בראשית חתומה, טופולוגיה, צומתי אמון, ומבחין PoPs.
- קשור את האוזן לראיונות מקומיים של המארח רק כאשר הצומת לא צריך להיות נגיש ממכונות אחרות.
- השתמשו ב-reverse proxy או firewall עבור חשיפה Torii, auth בסיסי, TLS, ומגבלת שיעור.
- לטפל בשינויים בגנזה או בטופולוגיה של הסכמה כמגירה מתואמת, ולא בעריכות קבצים חד צמתים.

עבור פיתוח מקומי במכולות, השתמשו בתהליך העבודה [Lunch Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
