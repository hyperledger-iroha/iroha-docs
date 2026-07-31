---
translation_locale: he
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# בראשית {#genesis}

בראשית מגדירה את מצב הרשת הראשוני. JSON מפורסם,
ו- Iroha 3 הערך צורב חותם Norito תיק עסקאות.

::: details מוניגר גנזיה מקובל

<<< @/snippets/genesis.json

:::

## קבצים {#files}

המלאי העליון שלח מוניגר מקובל ב `defaults/genesis.json`.
Kagami רשתות שנוצרו כותבים את הניתוח המוניסט והחתום שלהם
תיקון ההוצא:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

המוצר `README.md` בתיק הזה רשום את הקבצים המדויקים והשיגור
פקודות לפרופיל הנבחר.

## הגדרת השותפים {#peer-configuration}

עמיתים מצביעים על העסקה הנחתמה של גנזה `[genesis]` פרק
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

כל חברי הרשת חייבים להסכים על העסקה הנחתמה של גנזה
מפתח ציבורי של בראשית.

## חתימה על בראשית {#signing-genesis}

אם תדיר את המניפסט ידנית, תעודד ותחתום עליו לפני שתתחיל לעמיתים:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

עבור NPoS או Nexus פרופילים, כוללים את הטופולוגיה BLS הוכחות רכוש
הדרישה על ידי הפרופיל שנוצר. Kagami `localnet`, `wizard`, ופרופיל
פקודות הדור לנהל את הפרטים האלה באופן אוטומטי.

## חוזרת על בראשית {#recommitting-genesis}

עמיתים עושים גנזה רק כאשר האחסון שלו ריק.
רשת מקומית חד פעמית, לעצור את השותפים, להסיר את התיקון המדינה שלהם שנוצר,
ולהתחיל מגנזה חדשה חתומה. אל תחליף את הגנזה על רץ
רשת, אלא אם כן כל מבחין מתואם את אותו ההגירה.
