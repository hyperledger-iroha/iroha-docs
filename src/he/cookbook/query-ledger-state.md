---
translation_locale: he
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# רישומים של מצב ספר החשבונות {#query-ledger-state}

## התוצאה {#outcome}

קראו משאבי JSON של Taira והפיקו מהם את השדות הדרושים, ולאחר מכן השתמשו בשאילתות אוסף של Torii מתוך ה־CLI ומתוך ה־SDK של Rust, עם מסננים, מיון, הטלת שדות בצד השרת, מגבלות גודל עמוד והמשך באמצעות `next_cursor` אטום. כמו כן, לא תשתמשו בשאילתות חתומות בעלות טיפוס לקבלת רשימות, משום שהן אינן מסננות, ממיינות או מטילות שדות על רשימות.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Node.js 24, והזרם `iroha` CLI.
- גישה בקריאה בלבד Taira.
- עבור הדוגמאות של ה־CLI: תצורת לקוח עבור Taira או עבור רשת מקומית שנוצרה.
- לדוגמה Rust, פרויקט מחובר לאותו תיקון מקור Iroha כמו רשת המטרה.

## צעדים {#steps}

### דף דרך מקור ציבורי Taira {#_1-page-through-a-public-taira-resource}

נתיבי משאבים שימושיים ללוחות מחוונים ולבדיקות smoke. בקשו JSON, הגבילו כל דף, ולאחר אימות התגובה הפיקו רק את השדות שהיישום צריך.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  cursor = page.next_cursor
} while (cursor)
```

:::

ממשק ה־HTTP הזה מבצע עימוד באמצעות `limit` ו־`next_cursor` אטום; שלחו אותו בחזרה ללא שינוי בתור `cursor` עד שהוא `null`. `total` מופיע רק כאשר מבקשים `include_total=true`, שעלותו סריקה מלאה.

### 2. סינון אוסף באמצעות ה־CLI {#_2-filter-a-collection-with-the-cli}

ה־CLI שולח את המסנן, את הטלת השדות ואת גודל העמוד אל נקודת הקצה של האוסף ומדפיס עמוד אחד, `{items, next_cursor}`. הוסיפו `--all` כדי לעקוב אחר `next_cursor` עד שהוא `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

הסינון מתבצע לפני העימוד. כל אוסף מקבל רק את השדות שלו; שדה לא מוכר מחזיר `invalid_filter` במקום להתאים לאפס שורות.

### 3. לסדר לפי מפתח מטא נתונים יציבים {#_3-sort-by-a-stable-metadata-key}

מפתחות המיון של אוסף מקבלים שדות מוצהרים ו־`metadata.<key>`; הוסיפו `-` לפני מפתח כדי למיין בסדר יורד. שורות ללא המפתח ממוינות ראשונות בסדר עולה, ושוויונות מוכרעים לפי זהות השורה, ולכן השתמשו במפתח שמאוכלס באופן עקבי בכל האוסף.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` הוא הטלת שדות בצד השרת: `--select id,metadata` מחזיר רק את השדות האלה, ושדה לא מוכר מחזיר `invalid_select`. שאילתות חתומות בעלות טיפוס מחזירות תמיד פריטים שלמים, ולכן הפיקו את השדות הדרושים מהתוצאות שלהן בצד הלקוח באמצעות `jq` או JavaScript, כפי שמוצג לעיל.

### 4. תנו למשתתף Rust לעקוב אחרי מסמנים לא ברורים {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` קובע את גודל העמוד. האיטרטור ש־`list` מחזיר מבקש את העמוד הבא עם ה־`next_cursor` של השרת רק לאחר שהעמוד הנוכחי נצרך, ו־`take` מגביל את התוצאה הלוגית. כאן `client` הוא `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` הוא מיקום אטום בעימוד מבוסס מפתחות, הקשור לאוסף, לנתיב, למסנן ולמיון שלו. לעולם אל תנתחו אותו או תייצרו אותו באופן מלאכותי, ואל תשתמשו בו שוב עם מסנן או מיון אחרים; Torii דוחה זאת עם `invalid_cursor`. שורות שנוספו או הוסרו בין עמודים לעולם אינן גורמות לעמוד מאוחר יותר לחזור על שורות שאינן קשורות או לדלג עליהן.

## לאמת {#verify}

הגדרת הדומיין המדויקת צריכה להחזיר רק `universal.universal`. בדוק את התוצאה במקום לספור מוצא מצליח CLI לבד:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

עבור שאילתות יישום עם עימוד, בדקו גם שמזהים אינם חוזרים על פני עמודים, שהמגבלה הלוגית המבוקשת לעולם אינה נחרגת, ושסמן שנדחה מתחיל מחדש מנקודת ביקורת מתועדת.

## פתרון בעיות {#troubleshooting}

- חיפוש ייחודי לא מקבל מסנן, סורט, פגינציה או קבלת פרמטרים חוזרים. השתמש בקשירת רשימת המתאימה כאשר חוקים אלה נדרשים .
- `limit` הוא גודל העמוד, לא התוצאה הכוללת: לפחות 1 ולכל היותר `torii.app_api_max_list_limit` של הצומת (ברירת מחדל 500); ברירת המחדל של Torii היא 100. עקבו אחר `next_cursor`, השתמשו ב־`--all` או באיטרטור של ה־SDK כדי לקרוא עוד.
- `invalid_cursor` פירושו שהסמן פגום או שייך לאוסף, לנתיב, למסנן או למיון אחרים. הפעילו מחדש את השאילתה; אל תנסו לתקן את הערך האטום.
- מסנן סלקטיבי עשוי להחזיר עמוד קצר או ריק עם `next_cursor` שאינו null. המשיכו לעקוב אחריו עד שהוא `null`.
- `--filter` ופרמטר ה־HTTP `filter` מקבלים את דקדוק הטקסט של Torii, כגון `id = "universal.universal"` או `exists(metadata.tier)`. אובייקט פרדיקט ב־JSON אינו טקסט מסנן ונכשל כ־`filter` לא תקין.
- שאילתות רחבות ללא הגבלה מגדילות את עבודת הצמתים ואת צריכת הזיכרון של הלקוח. קבעו מגבלה לוגית וגודל עמוד שמתאימים לצרכן.
- `/v1/query` החתום אינו ה־API לרשימות. הוא מקבל שאילתות של פריט יחיד ומספר קטן של שאילתות איטרביליות ללא מסנן, ודוחה אחרות, כגון `FindDomains` או `FindAssetDefinitions`, עם `signed_query_shape_not_admitted`. נקודות הקצה של האוספים, פקודות `list` של ה־CLI וקוראי האוספים של ה־SDK חולקים דקדוק אחד למסננים, למיון ולסמנים.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [חוזה שאילתות האוספים של Torii ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [קריאות אוספים ואיטרטור הסמנים ב־Rust ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [קבלת שאילתות חתומות ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [שאילתות](/he/blockchain/queries.md)
- [רשיון השאילתות](/he/reference/queries.md)
- [JavaScript ו TypeScript ](/he/guide/tutorials/javascript.md)
