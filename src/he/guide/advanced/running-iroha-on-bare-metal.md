---
translation_locale: he
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

ספריית הפלט מכילה את הקבצים שנוצרו `genesis.json`, ‏`genesis.signed.nrt`, ‏`genesis.expected_hash`, קובץ `peerN.toml` אחד לכל מאמת, `client.toml`, את התסריטים `start.sh` ו־`stop.sh`, וכן `README.md` שנוצר ובו פקודות מדויקות עבור חבילה זו.

## 3. התחילו לצוותים {#_3-start-peers}

עבור רשת מקומית חד פעמית שנוצרה, השתמשו בסקריפט שנוצר:

```bash
./localnet/start.sh
```

אם צריך לחבר כל צומת למנהל תהליכים כגון systemd, פעלו לפי הפקודה לכל צומת שב־`./localnet/start.sh`: הריצו את `iroha3d --config <bundle>/peerN.toml` מתוך `<bundle>/state/peerN`, והעבירו את `--sumeragi-assert-fresh-key` רק בהפעלה הראשונה של אותו צומת. שמרו בנפרד את `peerN.toml`, המפתח הפרטי, ספריית האחסון והיציאות של כל צומת.

## 4. לנהל את הרשת {#_4-operate-the-network}

השתמשו בהגדרת הלקוח המוצא:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
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
