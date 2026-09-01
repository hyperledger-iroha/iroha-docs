---
translation_locale: he
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# רישומים של מצב ספר החשבונות {#query-ledger-state}

## התוצאה {#outcome}

קראו משאבי JSON של Taira והפיקו מהם את השדות הדרושים, ולאחר מכן השתמשו בשאילתות Iroha בעלות טיפוס עם מסננים, עימוד לוגי, מיון, גדלי אחזור והמשך באמצעות סמן הנע קדימה בלבד. כמו כן, אל תסתמכו על projection של selector לפני שהשרת תומך בהערכת ה־tuple המועבר ב־`--select`.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Node.js 24, והזרם `iroha` CLI.
- גישה בקריאה בלבד Taira.
- עבור דוגמאות של שאילתת טפסת חתומה, קונפיגציה לקלינט עבור Taira או רשת מקומית שנוצרה.
- לדוגמה Rust, פרויקט מחובר לאותו תיקון מקור Iroha כמו רשת המטרה.

## צעדים {#steps}

### דף דרך מקור ציבורי Taira {#_1-page-through-a-public-taira-resource}

נתיבי משאבים שימושיים ללוחות מחוונים ולבדיקות smoke. בקשו JSON, הגבילו כל דף, ולאחר אימות התגובה הפיקו רק את השדות שהיישום צריך.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
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
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

זה... HTTP שימוש על פני השטח `limit` ו `offset`. לטיפול בהעלמה או הגבול `total` כרגיל כאשר הנתיב משתמש במצב ספור זול יותר.

### 2. לנתח ולצבת בקשה מדבקת CLI {#_2-filter-and-batch-a-typed-cli-query}

ה CLI מסדרת בקשה חוזרת טפסת ומעקבת לקורסורים של המשך הסרבר פנימית. כאן התוצאה ההגיונית מוגבלת לשורה אחת, בעוד `--fetch-size 1` שולחת את המפלגה המקסימלית שנלקחה בכל נסיעה הלוואה וחזרה.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

הסינון מתבצע לפני העימוד. השתמשו ב-predicates בעלי טיפוסים הייחודיים לשאילתה; לא ניתן להשתמש מחדש בבטחה ב-predicate של חשבון או נכס עבור domain.

### 3. לסדר לפי מפתח מטא נתונים יציבים {#_3-sort-by-a-stable-metadata-key}

סורטינג שאילתת טופס הוא לקסיקוגרפי על מפתח מטא נתונים אחד. פריטים ללא המפתח הזה עוקבים אחר הסדר מוגדר של זמן ההפעלה, אז השתמשו במפתח מלא באופן עקבי בכל הקולקציה.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

ה-CLI הכלול במאגר מנתח את ה-JSON של `--select` ומעביר את tuple ה-selector, אך ה-DSL הקל הנוכחי לשאילתות אינו מעריך את ה-selector בשרת. אל תבנו סביבו עדיין חוזה projection. השתמשו ב-projection בעל טיפוסים של SDK רק לאחר שה-runtime היעד תומך בו, או בצעו projection בצד הלקוח על התוצאה המאומתת באמצעות `jq` או JavaScript, כפי שמוצג לעיל.

### 4. תנו למשתתף Rust לעקוב אחרי מסמנים לא ברורים {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` מגביל את קבוצת התוצאות ההגיוניות. `FetchSize` שולח כל חבץ של שרת. המשתקף הובא שולח בקשות המשך בצורה גלויה באמצעות הקורסר שנוצר על ידי השליח.

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` קשור ל-authority, מקומי לתהליך ומתקדם קדימה בלבד. לעולם אל תנתחו אותו, תיצרו אותו באופן מלאכותי, תשתפו אותו בין authorities או תשמרו אותו כ-resume token נייד בין מופעי Torii. אם תוקפו פג, הפעילו מחדש את השאילתה המקורית עם checkpoint מכוון ברמת היישום.

## לאמת {#verify}

הגדרת הדומיין המדויקת צריכה להחזיר רק `wonderland.universal`. בדוק את התוצאה במקום לספור מוצא מצליח CLI לבד:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

עבור שאילתות יישום בעלות עמודים, גם לבדוק כי IDs לא חוזרים על פני עמודים, הגבול הגיוני המבוקש אף פעם אינו מוגבל, והניסיון מחדש לאחר קורסר שעלה תקופה מתחיל מחדש מנקודת בדיקת מסומנת.

## פתרון בעיות {#troubleshooting}

- חיפוש ייחודי לא מקבל מסנן, סורט, פגינציה או קבלת פרמטרים חוזרים. השתמש בקשירת רשימת המתאימה כאשר חוקים אלה נדרשים .
- `fetch_size` הוא רמז של כיסוי שאינו אפס, לא הגבול הכולל לתוצאה. ההגדרה המקובלת הנוכחית היא `100`, והזמן הפועל מכחיש ערכים מעל מקסימום שלה.
- cursor לא מוכר, שפג תוקפו או ששייך לגורם אחר אינו ניתן לשימוש חוזר במכוון. הפעילו מחדש את השאילתה; אל תנסו לתקן את הערך האטום.
- מסדרת מטא-נתונים אינה מסדרת שדה כללית. אם בכל פריט לא יש את המפתח הנבחר, תעדו את סדר המפתח החסר או בחרו אסטרטגיה אחרת.
- ה- CLI חותך ומעביר `--select`, אך המשרת הנוכחי אינו מעריך את תוספת הסלקטור הקלה. ליישם תחזית בצד הלקוח אלא אם כן תמיכה בסלקטור בצד המשרת היא מאובטחת עבור זמן ההפעלה המוצץ.
- בקשות רחבות ללא גבולות מגבירות את עבודת הצמתים, זיכרון הלקוח, ואת הסיכון לחיים של הקורסר.
- הפרמטרים של משאבי JSON הציבוריים והפרמטרים החתומים של שאילתות מטיפוס מוגדר קשורים זה לזה, אך אינם פורמטי סריאליזציה הניתנים להחלפה. העדיפו את SDK או CLI עבור מעטפות של שאילתות מטיפוס מוגדר.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של עמודי דף תומכים בקורסר ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [ההתנהגות של בונה בקשת ובוחן ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [פרמטרים של בקשה ומודל קורסר ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [שאילתות](/he/blockchain/queries.md)
- [רשיון השאילתות](/he/reference/queries.md)
- [JavaScript ו TypeScript ](/he/guide/tutorials/javascript.md)
