---
translation_locale: he
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama חבילות {#musubi-kotodama-packages}

Musubi הוא מנהל החבילה עבור Kotodama זה נותן
פיתוחי זרימת עבודה כמו Cargo לחלוק Kotodama תפקידים
תוך שמירה על זהות החבילה קשורה SORA ו Iroha חלל שמות במקום
טבלה של שמות ראשונים גלובליים.

שימוש Musubi כאשר אתה צריך:

- לפרסם שימושי מחדש Kotodama ספריות מקור
- קישור תלות מקור עברה מדויקות `Musubi.lock`
- לשחזר את מקור ההסתמכות מהסוד המובטח SoraFS מחויבות ארכיון
- לחבר חלל שמות של חבילת ל- dapp שם כינוי חוזים באותו
  חלל שמות
- לבחון, לפרסם, להוריד או לחשוף חבילות באמצעות רישום שרשרת

## שמות החבילה {#package-names}

שימוש במגבילות קאנוניקה:

```text
namespace/package
```

השתמשת בהישגים מדויקים לשחרר:

```text
namespace/package@version
```

אין מוביל. `@` לפני חלל שמות. `@` הפרידוח מוגבל.
עבור המשקף הגרסה.

החלק של חלל שמות מתאים לתקופה המשמשת על ידי Kotodama חוזה Dapp
שם כינוי:

| איד החבילה                | צורה של פרופיל חוזה קשור |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

חלל שמות יש או `<dataspace>` או `<domain>.<dataspace>` צורה. כאשר
החבילה יש קישור Dapp, Musubi בדיקות שכל חוזה קשור
משתמש באותו קישור במרחב שמות כמו החבילת.

## מפורסם {#manifest}

החבילה מתחילה עם `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

תלונות עשויות להשתמש גרסאות מדויקות, דרישות טיפול, tilde
דרישות, כרטיסים פראי כגון `1.*`, או רשימות השוואות כגון
`>=1.0.0,<2.0.0`.

`Musubi.lock` רשום את הגרף המעבר הנבחר מהשרשרת
כל קשר נעול מאחסן את הקנוניקה של החבילה,
דרישה, SoraFS מאכלת מוניגרס, האש ארכיון מקור, ספירת בייטים, קבוצה
מספר, פונקציות שנשלחו, תוכנית ארכיון מקור דטרמיסטית, ו
כינויים של תלות.
קובץ נעול.

## זרימת עבודה מקומית {#local-workflow}

מעלה הזרם Iroha שורש חלל עבודה, פועל Musubi דרך מטען:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

שימוש `install --offline` כדי לכתוב תיק נעילה לא פתר עבור גרסה מדויקת
תלות ללא חיפוש קשר. `install --locked` ב CI ל
דחוף מסמך מנעול מזדיין.

`build` קישורים מקורות תלות מאובנים על ידי כתיבת מחדש של שיחות כגון
`math::add()` לתחום הפנימי Kotodama שמות פונקציות.
קורות לתפקוד שלא ייצרו על ידי התלות. Musubi ספריות v1
הם תפקוד בלבד: מקורות תלונות המכילים הצהרות מדינה,
תפעילים, בלוקים קוטובא, קבועים או פריטים חוזרים אחרים שאינם מתפקדים
הם נדחו.

## קבלת מקור ארכיונים {#fetching-source-archives}

Musubi יכול להביא מקורות תלות חסרים בזמן פתרון או מאוחר יותר
דרך הפקודות הקטנות של הקש:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

קבלת שער חי משתמשת באחד או יותר SoraFS ספציפיות של ספק שער:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

קבצים של מטען מועיל של ספקית ומספקי שער נפרדים זה מזה.
אם חסרים יותר מפסקה אחת נעולה,
ספק שער עם `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, או
`manifest=<64-hex SoraFS manifest digest>`.

שער `base-url` ו `privacy-url` הערכים חייבים להשתמש `https://` בדפוק.
שער בדיקות מקומיים יכולים להשתמש `http://localhost`, `http://127.0.0.1`, או
`http://[::1]` רק עם `--gateway-allow-insecure-localhost`. זרם
סימנים הם אישורים של זמן ההפעלה ולא נכתבים `Musubi.lock`.

## פרסום {#publishing}

`pack` מחושב את הדטרמיניסטי BLAKE3-256 האש של הארכיון המקור ועוד
בייט מקור ומספר הקבצים. כאשר `--car-out`, `--sorafs-manifest-out`, או
`--source-plan-out` הוא מספק, זה גם בונה את ההגדרה SoraFS
CAR מטען, SoraFS מפורסם, ו Musubi תוכנית ארכיון מקור מאותו
קבוצת הקבצים המקוריות.

השתמשו בטיפול יבש לפני הפרסום:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

בלי `--dry-run`, `publish` כותב פריטים מקובלים תחת
`.musubi/dist/<namespace>/<name>/<version>/`, באופן אופציונלי מעלה את
מוניגר וטען מועיל דרך Torii אני... SoraFS נקודת הסיום של עמודי אחסון עם
`--upload`, רשום את המוצר SoraFS סימן, ומגיש
`PublishMusubiRelease` דרך המערכת Iroha לקוח.

הפרסומים המפורסמים חייבים לכלול:

- ארכיון מקור קנוני שאינו ריק
- תוכנית ארכיון מקור דטרמיסטית
- לפחות אחד שנשלח Kotodama תפקוד
- רישומי תלות שאינם בוחרים שחרור נמשך
- קישור dapp, אם קיים, ששמות החוזה שלו תואמים את החבילה
  חלל שמות

## שאלות רישום ותיקוד החיים {#registry-queries-and-lifecycle}

חפש ולבדוק את הרישום עם:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

ינקינג מסתיר שחרור מההחלטה החדשה, אבל שומר על קבצים נעולים קיימים
ניתן להשיב:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi הוא מונע את השם העולמי על ידי `namespace/package` ה-
השם הקנוני של החבילה. פרסום לתוך חלל שמות חייב להיות מורשה על ידי
אותו מודל בעלות או רשות מחויבת שנשתמשו בו Kotodama
חלל שמות dapp. הכינויים הקצרים הגלובליים המודפנים נפרדים מהקופסה
בעלות: `SetMusubiShortAlias` דורש את `CanSetMusubiShortAlias`
אישור, וההסגר המטרה חייב כבר להיות לפחות אחד פעיל
שחרור.

## Iroha שטחים {#iroha-surfaces}

Musubi משמשים מעמד ראשון Iroha הוראות ושאלות:

| פני השטח                      | מטרה                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | לפרסם את הפסקה ללא שינוי.              |
| `YankMusubiRelease`          | ציין שחרור קיים כמשתוק.                |
| `SetMusubiShortAlias`        | קבלו שם גולמי קצר לקורט עם תעודת זהות של חבילה. |
| `AssertMusubiReleaseExists`  | דורש גרסה של חבילה קונקרטית כדי להתקיים.       |
| `FindMusubiReleaseByRef`     | תביא את השחרור על פי תיק המסגרת המדויק.        |
| `FindMusubiPackageVersions`  | רשימה של גרסאות עבור תעודת זהות החבילה.                    |
| `FindMusubiPackageReleases`  | רשום סיכומים של פרסום עבור תעודת זהות חבילת.           |
| `SearchMusubiPackages`       | חיפש סיכומים של חבילות לפי חלל שמות וטקסט.    |
| `FindMusubiShortAliasByName` | לפתור שמה קצר.                     |

Torii מגלה את Musubi HTTP משפחת מסלול תחת `/v1/musubi/*`.
פונה לסוכן MCP כלים נחשפים כ `iroha.musubi.*` פרופיל.
[Torii נקודות סוף](/he/reference/torii-endpoints.md) ו
[רשיון בקשה](/he/reference/queries.md) עבור הרחבה API מפה.
