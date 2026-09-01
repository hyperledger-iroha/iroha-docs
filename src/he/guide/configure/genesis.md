---
translation_locale: he
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# רֵאשִׁית {#genesis}

בראשית מגדיר את מצב השרשרת הראשוני.המקור הניתן לעריכה הוא א JSON לְהַפְגִין, ו- Iroha 3 צומת צורך סימן Norito קובץ עסקה.

::: details מניפסט בראשית ברירת המחדל

<<< @/snippets/genesis.json

:::

## קבצים {#files}

המאגר במעלה הזרם שולח מניפסט ברירת מחדל ב `defaults/genesis.json`. Kagami רשתות שנוצרו כותבות את המניפסט שלהן ועסקאות חתומות אליהן ספריית הפלט:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

הנוצר `README.md` בספרייה זו מתעד את הקבצים המדויקים והשקה פקודות עבור הפרופיל שנבחר.

## תצורת צמתים {#peer-configuration}

צמתים מצביעים על עסקת בראשית החתומה ב- `[genesis]` סעיף של `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

כל הצמתים ברשת חייבים להסכים על עסקת הבראשית החתומה ועל מפתח ציבורי בראשית.

## חותם בראשית {#signing-genesis}

אם אתה עורך מניפסט באופן ידני, אמת וחתום אותו לפני שמתחילים צמתים:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` חייב להיות מצב של בעלים-`0600`, קישור יחיד קובץ רגיל המכיל multihash אחד עם מפתח פרטי קנוני וסופי קו חדש. Kagami דוחה קישורים סמליים ולעולם לא מקבל הודעה פרטית גולמית מקש בשורת הפקודה.

עבור NPoS או Nexus פרופילים, כוללים את הטופולוגיה ו BLS הוכחות החזקה נדרש על ידי הפרופיל שנוצר. Kagami `localnet`, `wizard`, ופרופיל פקודות הדור מטפלות בפרטים אלו באופן אוטומטי.

## מתחייבים מחדש בראשית {#recommitting-genesis}

צומת מבצע בראשית רק כאשר האחסון שלו ריק.כדי לבדוק בראשית חדשה ב רשת מקומית חד פעמית, עצור את הצמתים, הסר את ספריית המצב שנוצרה שלהם, ולהתחיל מהבראשית החתום החדשה.אל תחליף בראשית בריצה רשת אלא אם כל מאמת מתאם את אותה הגירה.
