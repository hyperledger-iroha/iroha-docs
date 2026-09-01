---
translation_locale: he
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

על המפעיל ליצור את פרופיל Taira הקנוני לפני השימוש. התבנית השמורה במאגר כוללת הגדרות לדוגמה, ועל המפעיל להחליף כל אחת מהן. אל תשתמשו בהגדרות כלליות של Nexus או בהגדרות ייצור של SoraFS בעת בדיקה מול Taira.

## `--config` {#arg-config}

- סוג: מסלול הקובץ
- פרופיל: `-c`

נתיב לקונפיגוריית הצמתים [ ](/he/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- סוג: מסלול הקובץ

מניפסט genesis אופציונלי ב־JSON המשמש לאתחול הקונצנזוס.

## `--check-config` {#arg-check-config}

תאמינו את ההסדרת המפתחת ואת חומר הגנזיה הזמין, ולאחר מכן תוצאו ללא קישורים של רשת.

## סימני אישור Kagemusha {#kagemusha-qualification-seals}

אפשרויות נתיב הקובץ האלה דורשות `--check-config` ומבצעות הסמכת Kagemusha מלאה לפני כתיבת חותם קנוני:

- `--write-kagemusha-catalog-qualification-seal <PATH>` מספקת את ההסדר.
- `--write-kagemusha-validator-qualification-seal <PATH>` מספקת אישור לאישור מקומי על ההזמנה של קידום חתומה המוגדרת.

שתי אפשרויות הסיסום מתנגדות זה לזה.

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

תפעיל את הפרופיל של Sora Nexus. הפרופיל הזה מסדר את SoraFS, את מחיצת הידיים של SoraNet, והסכמה בין שוליים. תמיד להזכיר את המוצא Taira עם דגל זה.

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

סיכום האפשרויות שלעיל מאומת מול הגדרות הארגומנטים הנוכחיות של `iroha3d`. תמונת המצב של העזרה שנוצרה ונשמרה במאגר אינה מוצגת בכוונה כל עוד מצב המקור שלה ממתין. כדי להציג את העזרה המדויקת עבור עותק קוד המקור שלך, הריצו:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
