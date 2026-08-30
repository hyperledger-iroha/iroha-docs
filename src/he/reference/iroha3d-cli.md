---
translation_locale: he
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` הוא הדיימון הסטנדרטי Iroha 3 של השותפים. חבילת המטען נקראת `irohad`, אז הזמינו את הבינרי ממבחר מקור עם:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

עבור רשת הבדיקה הציבורית Taira, תמונת השחרור משתמשת ב- `iroha3d_taira`. הוא מקבל את אותו CLI. זה גם מכיל את שרשרת הקנוניקה Taira, קבוצת מבטיחות, הגדרות אחסון, ומפתחות חתימה של זמן הפעלה. אישור קונפיגורת Taira מבלי לפתוח תעודות אישורי זמן הפעלה כמו זו:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

המפעיל חייב להציג את הפרופיל הקנוני Taira לפני השימוש. הטמבל הנבדק מכיל הגדרות דוגמה. המפעיל חייב להחליף כל הגדרת דוגמה. לא להשתמש בהגדרות גנריות Nexus או הייצור SoraFS בעת ניסוי נגד Taira.

## `--config` {#arg-config}

- סוג: מסלול הקובץ
- פרופיל: `-c`

נתיב לקונפיגוריית השותפים [ ](/he/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- סוג: מסלול הקובץ

מוניסט הגנזיס אופציונלי JSON המשמש לאישור הסכמה.

## `--check-config` {#arg-check-config}

תאמינו את ההסדרת המפתחת ואת חומר הגנזיה הזמין, ולאחר מכן תוצאו ללא קישורים של רשת.

## סימני אישור Kagemusha {#kagemusha-qualification-seals}

אפשרויות הנתיב הקובץ אלה דורשות `--check-config` ולפעול אישור קגמושה מלא לפני כתיבת חותם קנוני:

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

ההוצאת המלאה בהמשך נוצרת מהשילוב מקור Iroha שמוקבע.

<<< @/snippets/iroha3d-help.md
