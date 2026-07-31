---
translation_locale: he
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגדרת Iroha {#configuring-iroha}

הקונפיגורציה המקומית של השותפים מוגדרת בקבצים TOML. זה שונה מהקונפיגוריית שרשרת שנשנה באמצעות הוראות [`SetParameter`](/he/blockchain/instructions.md#setparameter). התנהגות הייצור חייבת להיות מוצגת בקובץ קונפיגורציות או בפרמטר ברשת; משתנים סביבתיים אינם שערים תכונות .

השתמשו ב[ `--config`](../irohad-cli#arg-config) CLI כדי לציין את הנתיב לקובץ ההסדרות .

## תבנית {#template}

עבור תיאור מפורט של כל פרמטר, אנא ראה את התייחסות [פרמטרים ](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## מאפיין קבצים קונפיגורציות {#composing-configuration-files}

בקבצים הקונפיגורציות TOML יש שדה נוסף `extends`, המכוון לקבצים אחרים TOML. זה יכול להיות מסלול אחד או מרובים:

::: קבוצת קוד

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha יקרא בקירורסיבי את כל הקבצים המתוארים ב- `extends` ויסדר אותם בשכבות, בהן האחרונים כותבים את הקודמים ברמה של פרמטרים. למשל, אם קריאה `config.toml`:

::: קבוצת קוד

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

הקונפיגורציה הנוצרת תהיה `chain` מ- `a.toml`, `max_content_len` מ- `b.toml`, ו `torii.address` מ- `config.toml` (תכבות `b.toml`).

## פתרון בעיות {#troubleshooting}

העבר את דגל [`--trace-config`](../irohad-cli#arg-trace-config) CLI כדי לראות עקבות של האופן שבו הקונפיגורציה נקראת ונתקשת.
