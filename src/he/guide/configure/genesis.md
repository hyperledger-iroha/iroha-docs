---
translation_locale: he
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# רֵאשִׁית {#genesis}

בראשית מגדיר את מצב השרשרת הראשוני.המקור הניתן לעריכה הוא א JSON לְהַפְגִין, ו- Iroha 3 צומת צורך סימן Norito קובץ עסקה.

::: details תבנית המקור של בראשית המוגדרת כברירת מחדל (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## קבצים {#files}

מאגר המקור מספק תבנית ברירת מחדל ב־`defaults/genesis.template.json`. תבנית היא מסמך לא שלם שאי אפשר לאמת, לחתום עליו או להשתמש בו בצומת עד ש־`kagami genesis materialize` הופך אותו למניפסט. רשתות שנוצרו ב־Kagami כותבות את המניפסט ואת העסקה החתומה שלהן לתיקיית הפלט:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

הנוצר `README.md` בספרייה זו מתעד את הקבצים המדויקים והשקה פקודות עבור הפרופיל שנבחר.

## תצורת צמתים {#peer-configuration}

העמיתים מפנים לעסקת ה־genesis החתומה במקטע `[genesis]` של `config.toml`, ומקבעים את הגיבוב הצפוי שלה בקובץ נפרד:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

כל העמיתים ברשת חייבים להסכים על עסקת ה־genesis החתומה ועל המפתח הציבורי של ה־genesis. כל הפעלה, ראשונית או מחודשת, זקוקה לגיבוב הצפוי: הגדירו בדיוק אחד מהשניים, `expected_hash_file` או `expected_hash` המוטבע. ‏`kagami genesis sign --expected-hash-out` כותב את הקובץ.

## חותם בראשית {#signing-genesis}

אם אתה עורך מניפסט באופן ידני, אמת וחתום אותו לפני שמתחילים צמתים:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` חייב להיות מצב של בעלים-`0600`, קישור יחיד קובץ רגיל המכיל multihash אחד עם מפתח פרטי קנוני וסופי קו חדש. Kagami דוחה קישורים סמליים ולעולם לא מקבל הודעה פרטית גולמית מקש בשורת הפקודה.

כל genesis חתום, בין אם מבוסס הרשאות ובין אם NPoS, חייב לכלול טופולוגיית מאמתים מדויקת של `3f + 1` עם הוכחת החזקה של BLS לכל מאמת. פקודות Kagami ‏`localnet generate`, ‏`wizard` ו־`sora-network generate` מטפלות בפרטים האלה אוטומטית.

## מתחייבים מחדש בראשית {#recommitting-genesis}

רשת חדשה מתחילה מנתוני הראשית החתומים שלה. כדי לבדוק נתוני ראשית אחרים ברשת מקומית חד־פעמית, עצרו את העמיתים, הסירו את ספריית המצב שנוצרה עבורם והתחילו מנתוני הראשית החתומים החדשים. רשת פועלת לעולם אינה רשאית להחליף את נתוני הראשית כמנגנון שדרוג. שינויים בהגדרות הפרוטוקול מחייבים מעברי בחירה הנשלטים בידי הממשל והסמכה עבור ההגדרות וההתחייבויות שנבחרו.
