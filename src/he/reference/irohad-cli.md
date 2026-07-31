---
translation_locale: he
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` מתחיל Iroha 3 דיימון משותף.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **סוג:** מסלול קבצים
- **שם שמה:** `-c`

כביש ל [קונפיגציה](/he/reference/peer-config/index.md) תיק.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **סוג:** מסלול קבצים

דרך אופציונלית למניפסט הגנזה JSON תיק. השתמש בזה כאשר ההפעלה
מסדיר את ההתחלתה על-ידי מוניסט שנוצר על ידי Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

מאפשרת רישומי מעקב של קריאת ההסדרות ונתח. יכול להיות שימושי לתיקון בעיות בהסדרות.

- **סוג:** דגל
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **סוג:** או בולית `--terminal-colors=false` או
  `--terminal-colors=true`
- **כדוגמא:** תמיכה בטרמינל זיהוי אוטו
- **ENV:** `TERMINAL_COLORS`

האם לאפשר ANSI-הוצאת צבעית או לא.

לפי ההגדרה, Iroha קובע אם הטרמינל תומך בהוצאת צבע
או שלא.

לאפשר באופן מפורש את הצבעים:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **סוג:** חוטים

תעלמו את שפת המערכת המשמשת עבור הודעות דיימון.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **סוג:** דגל

תפעיל את הסורה Nexus פרופיל תכונות SoraFS, ה- SoraNet מחזקת יד, ו
זרימות הסכמה מרובות דרכים.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **סוג:** `auto`, `cpu`, או `gpu`

חיקוי FASTPQ מצב ההוצאה להורג של הסבר.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **סוג:** `auto`, `cpu`, או `gpu`

חיקוי FASTPQ מצב שרת פוזידון.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **סוג:** חוטים

תעלמו את FASTPQ תווית כיתה של מכשיר טלמטריה.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **סוג:** חוטים

תעלמו את FASTPQ תווית משפחת שבטים טלמטריה.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **סוג:** חוטים

תעלמו את FASTPQ טלמטריה GPU- סוג של תווית.

```shell
irohad --fastpq-gpu-kind integrated
```
