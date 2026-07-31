---
translation_locale: he
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama חבילות {#musubi-kotodama-packages}

Musubi הוא מנהל החבילה עבור חבילות מקור של Kotodama. זה נותן למפתחים זרימת עבודה דומה ל- Cargo לחלוק פונקציות Kotodama מורכבות תוך שמירה על זהותו של החבילה קשורה לאזורים של שמות SORA ו Iroha במקום טבלה של שמות ראשונים עולמית.

השתמשו Musubi כאשר אתם צריכים:

- לפרסם ספרות מקור Kotodama שניתן להשתמש בהן שוב
- קישור תלות מקורות מעבר מדויקות ב `Musubi.lock`
- לשחזר את מקור ההסתמכות על מחויבויות ארכיון SoraFS מבוקשות
- קישור חלל שמות של חבילה ל- dapp פרופיל חוזים באותו החלל
- לבחון, לפרסם, להוריד או לחשוף חבילות דרך רישום שרשרת

## שמות החבילה {#package-names}

שימוש באותיות חבילת קאנוניקה:

```text
namespace/package
```

השתמשת בהתייחסות לשחרור מדויקות:

```text
namespace/package@version
```

אין פיקוד `@` לפני חלל שמות. מפריד `@` מיועד לסוף הגרסה.

קטע חלל שמות תואם את הסופיקס המשמש על ידי Kotodama דפ חוזים כינויים:

|איד החבילה |צורת פרופיל חוזים קשורים |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

למקומות שמות יש גם צורה `<dataspace>` או `<domain>.<dataspace>`. כאשר בקבוצת יש קישור dapp, Musubi בודק שכל שם חוזר מקושר משתמש באותו סופיקס במקום שמות כמו הקבוצת.

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

תלות יכולות להשתמש בגרסאות מדויקות, דרישות טיפול, דרישת טילד, כרטיסים פראי כגון `1.*`, או רשימות משוואות כמו `>=1.0.0,<2.0.0`.

`Musubi.lock` רשום את הגרף העברתי הנבחר מהרשם על שרשרת. כל nodo מנעול מאחסן את הקנוניקה של החבילה שלו ref, הדרישה שנבחרת, SoraFS דיגסט המניפסט, האש הארכיון המקור, ספירת בייטים, ספירת קבצים, פונקציות הוצאת, תוכנית ארכיון מקור דטרמיסטית, ושמות תלות. כינויים קצרים מתפתחים לפני שהם נכנסים לקובץ המנעולים.

## זרימת עבודה מקומית {#local-workflow}

מהשורש של חלל העבודה Iroha מעלה, להפעיל את Musubi דרך Cargo:

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

השתמש `install --offline` כדי לכתוב קובץ נעילה לא פתור עבור תלונות גרסה מדויקת ללא שאלת קשר. השתמש `install --locked` ב CI כדי לדחות קובץ נדל"ן מיושן.

`build` מקושרת את מקורות ההסתמכות המובטלים על ידי כתיבת מחדש של שיחות כגון `math::add()` לשמות פונקציות פנימיות דeterministic Kotodama. היא דוחה שיחות לתפקידים שההסתמכות לא יצאת. ספריות Musubi v1 הן פונקציות בלבד: מקורות תלות המכילים הצהרות מדינה, גורמים, בלוקים קוטובא, קונסטנטיות או פריטים חוזים אחרים שאינם פונקציות נדחלו.

## קבלת מקור ארכיונים {#fetching-source-archives}

Musubi יכול להשיג מקורות תלות חסרים בזמן פתרון או מאוחר יותר באמצעות הפקודות הקטנות של הקש:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

קביעת שער חי משתמשת בתכונות אחת או יותר של ספק השער SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

הקבצים של המטען הפועל של ספקית ומספקי שער הם עצמאיים זה לזה עבור מבצע אחד. אם חסרים יותר מפקט אחד מנעול, קבעו את כל ספק השער עם `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` או `manifest=<64-hex SoraFS manifest digest>`.

כניסה `base-url` ו `privacy-url` הערכים חייבים להשתמש `https://` בדפוס מקומי. שערות בדיקת מקומיות יכולות להשתמש `http://localhost`, `http://127.0.0.1`, או `http://[::1]` רק עם `--gateway-allow-insecure-localhost`. סימני הזרם הם תעודות אישור runtime ולא נכתבו לתוך `Musubi.lock`.

## פרסום {#publishing}

`pack` מחשב את הדטרמיניסטית BLAKE3-256 האש של הארכיון המקור ועוד בייט המקור ואת ספירת הקובץ. `--car-out`, `--sorafs-manifest-out`, או `--source-plan-out` הוא מספק, זה גם בונה את הדטרמיניסטית SoraFS CAR מטען מועיל, SoraFS מפורסם, ו Musubi תוכנית ארכיון מקור מאותו קבוצה של קבצים מקור.

השתמשו בטיפול יבש לפני הפרסום:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

בלי `--dry-run`, `publish` כותב פריטים מקובלים תחת `.musubi/dist/<namespace>/<name>/<version>/`, באופן אופציונלי מעלה את המניפסט ואת המטען הפועל דרך Torii זה... SoraFS נקודת הסיום של עמודי אחסון עם `--upload`, רשום את המוצר SoraFS חותם, ומגיש `PublishMusubiRelease` דרך ההסדר Iroha לקוח.

הפרסומים המפורסמים חייבים לכלול:

- ארכיון מקור קנוני שאינו ריק.
- תוכנית ארכיון מקור דeterministic
- לפחות פונקציה Kotodama אחת שנשלחה
- רישומי תלות שאינם מצביעים על שחרורים מושכים
- קישור dapp, אם קיים, ששמות החוזה שלו תואמים את חלל שמות החבילה.

## שאלות רישום וסייקל חיים {#registry-queries-and-lifecycle}

לחפש ולבדוק את רישום עם:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

ינקינג מסתיר שחרור ממבטא חדש, אך מחזיק בקבצים נעולים קיימים חוזרים על עצמם:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi נמנע מקפיצה של שמות גלובליים על ידי הכנת `namespace/package` את שם החבילה הקנוני. פרסום לתוך חלל שמות חייב להיות מורשה על-ידי אותו בעל או מודל רשיונות מחויבים המשמש עבור החלל שמות dapp זה Kotodama. כינויים קצרים גלובליים מאורגנים נפרדים מהחברה בעלת החבילה: `SetMusubiShortAlias` דורש את רשיון `CanSetMusubiShortAlias`, והחבילה המטרה חייבת כבר להיות בעלת לפחות שחרור פעיל.

## Iroha שטחים {#iroha-surfaces}

Musubi משתמש בהוראות ושאילות מדרגה ראשונה Iroha:

|פני השטח.|מטרה|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |לפרסם פרסום חבילת בלתי משתנה. |
|`YankMusubiRelease` |חישוב שחרור קיים כמשוך. |
|`SetMusubiShortAlias` |לחבר זיהוי חבילה ארוך עולמי. |
|`AssertMusubiReleaseExists` |נדרש גרסה קונקרטית של חבילה כדי להתקיים. |
|`FindMusubiReleaseByRef` |תביא את ההפרש על פי רשימת החבילה המדויקת. |
|`FindMusubiPackageVersions` |רשימה של גרסאות עבור זיהוי חבילת. |
|`FindMusubiPackageReleases` |רשימת סיכומים של פרסום עבור תעודת זיהוי חבילה. |
|`SearchMusubiPackages` |חיפוש סיכומים של חבילות לפי מקום שמות וטקסט. |
|`FindMusubiShortAliasByName` |לפתור כינוי קצר. |

Torii מגלה את Musubi HTTP משפחת המסלול תחת `/v1/musubi/`. פונה לסוכן MCP כלים נחשפים כ `iroha.musubi.` כינויים. [Torii נקודות קצה](/he/reference/torii-endpoints.md) ו [קישור בקשה](/he/reference/queries.md) עבור הרחבה API מפה.
