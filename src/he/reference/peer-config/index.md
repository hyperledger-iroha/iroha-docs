---
translation_locale: he
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגדרות Iroha {#configuring-iroha}

ההשפעה מקומית של השותפים מוגדרת TOML זה שונה ממסדרת קישור.
ההסדר השתנה [`SetParameter`](/he/blockchain/instructions.md#setparameter)
הוראות. התנהגות הייצור חייבת להיות מוצגת בקובץ הגדרות
או פרמטר על שרשרת; משתנים סביבתיים אינם שערות תכונות.

שימוש [`--config`](../irohad-cli#arg-config) CLI טענה לציין את הנתיב לקובץ ההסדרות.

## תבנית {#template}

תיאור מפורט של כל פרמטר, נא לציין: [פרמטרים](./params.md) תקשורת.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## יצירת קבצים קונפיגורציות {#composing-configuration-files}

TOML קבצים קונפיגירציה יש תוספת `extends` שדה, המכוון לשאר TOML זה יכול להיות מסלול אחד או
מסלולים מרובים:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha הוא יקרא בקירורסיבי את כל הקבצים המוגדרים ב `extends` "ואנו מכינים אותם בשורות, שם האחרים מתכתבים".
דוגמא, אם קריאה `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

The ההסדרות המוצאתה תהיה `chain` מ `a.toml`, `max_content_len` מ `b.toml`, ו `torii.address` מ
`config.toml` (תכילות) `b.toml`).

## פתרון בעיות {#troubleshooting}

תעשייה [`--trace-config`](../irohad-cli#arg-trace-config) CLI דגל כדי לראות עקבות של איך הקונפיגורציה נקראת וניתנת.
