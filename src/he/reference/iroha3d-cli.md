---
translation_locale: he
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` הוא הדיימון הסטנדרטי Iroha 3 של הצמתים. חבילת המטען נקראת `irohad`, אז הזמינו את הבינרי ממבחר מקור עם:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

עבור רשת הבדיקה הציבורית Taira, תמונת הגרסה משתמשת ב־`iroha3d_taira`. היא מקבלת את אותו CLI ומכילה גם את השרשרת הקנונית של Taira, את קבוצת המאמתים, את הגדרות האחסון ואת מפתחות החתימה בזמן ריצה. אמתו את תצורת Taira בלי לחשוף את פרטי ההזדהות של זמן הריצה באופן הבא:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

השתמשו בגרסת פרופיל Taira הקנוני שהמפעיל הכין לפריסה; התבנית שבמאגר עדיין מכילה מצייני מקום לפריסה. אל תחליפו אותה בהגדרות כלליות של SORA Nexus או בהגדרות SoraFS לסביבת ייצור בעת בדיקה מול Taira.

## `--config` {#arg-config}

- סוג: מסלול הקובץ
- פרופיל: `-c`

הנתיב ל[קובץ התצורה של הצומת](/he/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- סוג: מסלול הקובץ

מניפסט genesis אופציונלי ב־JSON המשמש לאתחול הקונצנזוס.

## `--check-config` {#arg-check-config}

תאמינו את ההסדרת המפתחת ואת חומר הגנזיה הזמין, ולאחר מכן תוצאו ללא קישורים של רשת.

## `--json` {#arg-json}

- **טיפוס:** דגל
- **מחייב:** `--check-config`

הדפסת ערכי התאימות של הבנייה והתצורה האלה כאובייקט Norito JSON אחד במקום שורת `Ready` או `Pending`.

## `--check-storage` {#arg-check-storage}

- **טיפוס:** דגל
- **מתנגש עם:** `--check-config`

בדיקת מאגר Kura ותמונת המצב העדכנית ביותר של הצומת העצור בקריאה בלבד, באמצעות המפענחים של הבנייה הזאת; הדפסת התוצאה כאובייקט Norito JSON אחד ויציאה בקוד שאינו אפס במקרה כשל. הבדיקה נוטלת את נעילת שורש מאגר Kura, ולכן מסרבת למאגר שבבעלות צומת פועל. היא לעולם אינה משנה את המאגר ואינה פותחת סודות המיועדים לזמן ריצה בלבד.

## `--check-replay` {#arg-check-replay}

- **טיפוס:** דגל
- **מתנגש עם:** `--check-config`, `--check-storage`

הרצה חוזרת של עותק מאגר הצומת העצור באמצעות הבנייה הזאת והדפסת התוצאה כאובייקט Norito JSON אחד. הפקודה מעתיקה את הבלוקים לתיקייה זמנית, משחזרת שם את תמונת המצב העדכנית ביותר או מבצעת מחדש את ה־genesis החתום, ומבצעת מחדש כל בלוק מאוחר יותר. היא יוצאת בקוד שאינו אפס כאשר בלוק אינו משחזר את התוצאה המאושרת שלו או כשגוף בלוק נדרש חסר, ולעולם אינה כותבת למאגר או פותחת סודות המיועדים לזמן ריצה בלבד.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **טיפוס:** מזהה חשבון
- **מחייב:** `--check-config`

במהלך אימות לא מקוון, דרישה שהחשבון הרשום הזה ישמור על סמכות הפריסה של SoraCloud לאחר ביצוע ה־genesis החתום המדויק.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **טיפוס:** דגל

הצהרה, באתחול הזה בלבד, שמפתחות הקונצנזוס של הצומת מעולם לא חתמו עבור השרשרת הזאת. Sumeragi שומר רשומת בטיחות לכל מפתח ואינו חותם על דבר בלעדיה עד שיש לו הוכחה שהרשומה לא אבדה. העבירו את הדגל פעם אחת, באתחול הראשון של מפתח חדש, ולעולם לא לאחר אובדן נתונים.

## `--trace-config` {#arg-trace-config}

- סוג: דגל
- סביבה: `TRACE_CONFIG`

תפעיל רישומי מעקב בזמן שכבות הקונפיגורציה נלקשות ומנתחיות.

## `--config-blake3` {#arg-config-blake3}

- סוג: 64 ספרות BLAKE3 תפיסה כפולה.
- דרישות: `--config`

נדרש את בייטים של קבוצת ההסדרות כדי להתאים לתאריך הנתון. קובץ מחויב לאיכות חייב להיות שטוח; הוא לא יכול להכיל `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- סוג: בוליין, מפרסם כ- `--terminal-colors=true` או `--terminal-colors=false`
- כפולה: זיהוי יכולת הטרמינל
- סביבה: `TERMINAL_COLORS`

פיתוח צבע ANSI.

## `--language` {#arg-language}

- סוג: חוט

תעלמו את שפת המערכת המשמשת עבור הודעות של דיימון.

## `--sora` {#arg-sora}

- סוג: דגל
- סביבה: `IROHA_SORA_PROFILE`

הפעלת פרופיל SORA Nexus המשמש את SoraFS, את לחיצת היד של SoraNet ואת הקונצנזוס מרובה הנתיבים. משגר Taira מופעל תמיד עם הדגל הזה.

## FastPQ פוטנציאל {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` ו`--fastpq-poseidon-mode <MODE>` מקבלים רק `cpu` או `gpu`. האפשרויות הנותרות מעבירות את תווית הטלמטריה:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

לדוגמה:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## עזרה שנוצרה {#generated-help}

סיכום האפשרויות לעיל תואם להגדרות הארגומנטים של `iroha3d` ב־commit המקובע של Iroha. כדי לבדוק את העזרה המדויקת של העותק המקומי שלכם, הריצו:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
