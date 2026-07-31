---
translation_locale: he
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` מתחיל דיימון משותף Iroha 3.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- סוג: מסלול קבצים
- פרופיל: `-c`

נתיב לקובץ הגדרת [ ](/he/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- סוג: מסלול קבצים

נתיב אופטיונלי לקובץ מוניסט הגנזיס JSON. השתמש בזה כאשר השימוש מאשר את ההתחלה נגד מוניסט שנוצר על ידי Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

מאפשר רישומי מעקב של קריאת ההסדרות והפרשנות. עשוי להיות שימושי לתיקון בעיות בהסדרות.

- סוג: דגל
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- סוג: בולין, או `--terminal-colors=false` או `--terminal-colors=true`
- כדוגמא: תמיכה בטרמינל לזהות אוטומטית.
- ENV: `TERMINAL_COLORS`

אם אפשר להפעיל את ההוצאת בצבע ANSI או לא.

לפי ההגדרה, Iroha קובע אם הטרמינל תומך בתוצא צבעוני או לא.

כדי להפעיל באופן מפורש צבעים:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- סוג: חוטים

תעלמו את שפת המערכת המשמשת עבור הודעות של דיימון.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- סוג: דגל

להפעיל את פרופיל תכונות Sora Nexus עבור SoraFS, לחיצת ידיים של SoraNet וזרזות הסכמה רב-סלולים.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- סוג: `auto`, `cpu`, או `gpu`

מעביר את מצב ההפעלה של FASTPQ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- סוג: `auto`, `cpu`, או `gpu`

מעביר FASTPQ מצב צינור פוסיידון.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- סוג: חוטים

תעלמו את התווית כיתה מכשיר טלמטריה FASTPQ.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- סוג: חוטים

תעלמו את תווית משפחת שבטים טלמטריה FASTPQ.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- סוג: חוטים

לאבד את התווית הטלמטריה FASTPQ של סוג GPU.

```shell
irohad --fastpq-gpu-kind integrated
```
