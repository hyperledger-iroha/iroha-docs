---
translation_locale: he
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama חבילות {#musubi-kotodama-packages}

Musubi הוא מנהל חבילה לשחרור ראשון עבור חבילות מקור Kotodama. זה פותר גרף של תלות מדויק על שרשרת, מזדהה את SoraFS ארכיונים מקוריים, מסדרים ומבחנים את חלל העבודה הנבחר, בונים ארכיונים קנוניים CAR, ומפרסמים שידורים בלתי משתנים דרך Iroha.

השתמשו Musubi כאשר אתם צריכים:

- לפרסם ספריות פונקציות Kotodama שניתן להשתמש בהן מחדש
- צבעו גרף מעבר מדויק ב `Musubi.lock`
- לשחזר את מקור ההסתמכות על מחויבויות ארכיון SoraFS הסופיות
- בניית ומבחן חלל עבודה אחד או מספר חבילות
- לבחון, לפרסם, למשוך, לשמור או לחשוף חבילות באמצעות רישום שרשרת.

## שמות החבילה {#package-names}

בוחרים חבילות קנוניים משתמשים:

```text
namespace/package
```

מזהים שחרור מדויקים מוסיפים גרסה:

```text
namespace/package@version
```

אין `@` מוביל לפני חלל שמות. החלל שמות הוא בין אם שורש חלל נתונים כגון `universal` או חלל נתוני מוסמך לתחום כמו `dex.universal`. הספר הגדול מחבר את חלל המנים המבצעי לחלק נתונים מקומי יציב אחד לפני שניתן לדרוש חבילה.

## מוניפסט וארכיב נעול {#manifest-and-lockfile}

חבילה משתמשת בספרה הראשונה סגורה. `Musubi.toml` המוניסטור חייב להכריז `manifest-version = 1`, Kotodama עיתון `"1"`, ו IVM ABI גרסה `1`; אין מסמך חלופי או ABI מצב.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

תלות יכולות להשתמש גרסאות מדויקות, דרישות טיפול או טילד, כרטיסי חיצוניים כגון `1.*`, וקבוצות משוואות נפרדות מקומה כמו `>=1.0.0,<2.0.0`. מפתח שולחן התלות הוא שם השלט של ההובלה המקומי; `package` הוא תמיד סלקטר הרישום הקנוני.

`Musubi.lock` מחבר את הגרף לגרף מדויק של הגנזה-מוצא `NetworkId` ומצלמה רישום סופית. הוא רשום את שורשי החלל העבודה הנבחרים ונקודות השחרור הבלתי משתנות. כולל שחרור, מקור, אינטרס, ארכיון, ABI, והתחייבויות של קצה תלות מדויק. גרפיות מקבילות מותרות כאשר הגרף המפתר דורש אותם.

## הגדרת Taira SoraFS {#configure-taira-sorafs-fetching}

Taira הוא הרשת המבחנת הציבורית עבור זרימת העבודה זו. התחל עם תיקון הלקוח של Taira עם זהות שרשרת ורשת מסובכת, ואז הוסף את קשרי הבאת מזוהה ספציפיים למספק למטה. חומר חתימה לחשבון ומפתחות המפעיל של ספקית חייבים להישאר בקבצים של זמן ההפעלה של הבעלים בלבד.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

גלה את ספקי Taira המוקדמים מהשורש הציבורי של הרשתות הטסטים:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

קטלוג הספק מספק את זהויות הספק והנקודות הסיום המפורסמות. לקבלת אישור מפעיל התאמה מהספק הנבחר. זמן ההפעלה משתמש במפתח הזה כדי לבקש סימני זרם מוגבלים; סימנים הם לא ארגומנטים CLI או תוכן קובץ נעילה.

לא להשתמש ב- Taira סימן אישור URL כמו `url`. ההסמכים המוקדמים שהועברו SoraFS האחסון פוסק. `https://taira-validator-{1,2,3,4}.sora.org` נקודות קץ מקבלות רישום פין, בעוד קריאת הארכיון משתמשת במסמכים של ספקית המוגנת HTTPS מקור.

## זרימת עבודה מקומית {#local-workflow}

מתוך שורש החלל העבודה Iroha מעלה, ליצור או להכניס את תיק המשלוח ולהפעיל Musubi דרך Cargo:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` פותרת את גרף הרישום הסופי, עדכונים `Musubi.lock` כאשר זה מותר, וממלא את הקש המקומי הבלתי משתנה SoraFS מיקומים. `check`, `build`, `test`, ו `package` לבצע את אותם בדיקות גרף ומחסון לפני העבודה שלהם.

השתמש `--locked` כדי לדחות כל שינוי בקובץ מנעולים. השתמש ב `--offline` רק כאשר אינדיקס הרישום וכל הארכיון הנדרש כבר מוחזקים. `--frozen` משלב את שני המגבלות הללו. מקובץ מקוון נכשל; Musubi אף פעם לא כותב קובץ בלתי פתור.

מקורות תלות קשורים על ידי כתיבת מחדש של שיחות מוסמכות כגון `math::add()` לשמות פנימיים דטרמיסטיים Kotodama. שיחת תלות לתפקיד לא הוצא החוצה נדחתה. ספריות ייבואות חושפות פונקציות; מטרות מקומיות `[[contract]]` ו `[[test]]` נשארו מטרות חבילת מפורשות.

## אימות וריפוי מאחסון {#cache-verification-and-repair}

פקודות המזמון הציבורי פועלות על ארכיונים בלתי משתנים, מחויבים לרשום:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` קווארנטיין מושחת צאצאים אמינים ומחזיר את הארכיונים המדויקים כאשר ראיות מתפקדת סופית מאפשרות זאת. Musubi דוחה מוטציה חיה שאינה ריקה של ניתוק. השתמש ב `--dry-run` לבחון את המועמדים הסווגים.

## ארגזות ופרסום {#packaging-and-publishing}

בדוק את קבוצת הקובץ החיובי הנקי לפני כתיבת ארכיון, ואז לבנות את החבילה הקנונית:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` כותב `target/package/<namespace>-<name>-<version>.car`. ה- CAR קשור למניפסט החבילה הקנוני, למניפסת השחרור הסמנטי, למנעול אימות מדויק, לעץ המקור, לחיזוק הפנים, ו SoraFS התחייבות לאריכיון. אין `pack`, `--car-out`, `--sorafs-manifest-out`, או `--source-plan-out` פקודות בשחרור הראשון CLI.

פרסום הוא זרימת עבודה של רשת חתומה, שניתן להפעיל מחדש. ה- `client.toml` הנבחר חייב להכיל את קשרי ההפקה `[musubi.publication]`, כמו גם את האקאונט והקונפיגורציה של הרשת Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

השתמש `--detach` כדי לחזור לאחר שזומן הפעולה והגבול של כניסה הזרעים הם יציבים. המשך פעילות יציבה עם `publish --resume <operation-id> --config client.toml`. הנתיב הצמוד יותר `--recover <operation-id>` רק חוזר מחדש אין פרסום `--dry-run` או ההפעלה הציבורית הגנרית fallback; להפעיל `package --list` ו `package` עבור טיסה מקומית.

## שאלות רישום וסייקל חיים {#registry-queries-and-lifecycle}

לחפש ולבדוק את הרישום הסופית עם אותו הגדרת הלקוח Taira:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

ינקינג מסרבת שחרור בלתי משתנה מתוך החלטות חדשות בזמן שמנעולים מדויקים קיימים נשארים ניתן לשחזר. קרא תחילה את התיקון הנוכחי של yank, ולאחר מכן הגיש מוטציה להשוות ולתקן:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

השתמש `unyank` עם אותו קובץ, גרסה, ושינוי בקריאה טהורה כדי להפוך את המצב הזה. תפקידי הבעלים של הקובץ ושומרן שליטה לפרסם, yank, מטאדאטה, ובאפשרויות מיקום ארכיון. ל- Global aliases יש רישום מחיר משלהם, היסטוריית ריטרג'ט, ושינויים בהשוואה והיצירה; הם לא קיצורות בבעלות החבילה.

## Iroha שטחים {#iroha-surfaces}

Musubi משתמש בהוראות ושאלות שפורסמו לראשונה V1:

|פני השטח.|מטרה.|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |לחבר חלל שמות למרחב נתונים של הבית שלו. |
|`RegisterMusubiArchiveV1` |רשום מחויבות ארכיון מקור מאושרת בלתי משתנה. |
|`AddMusubiArchiveLocationV1` |הוספת או חידוש מיקום ארכיון מוכשר SoraFS. |
|`PublishMusubiReleaseV1` |תדרוש או עדכן חבילה ותפרסם שחרור בלתי משתנה אחד. |
|`SetMusubiReleaseYankV1` |להשוות ולתקן את המצב של שחרור מדויק.|
|`InviteMusubiPackageMaintainerV1` |להתחיל את זרימת ההזמנה למפקידים במפורש. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |רישום או ריטג את שם כינוי גלובלי נשלט. |
|`AssertMusubiReleaseDigestV1` |תדגיש את ההשפעה המדויקת של השחרור.|
|`FindMusubiExactPackageV1` |תקרא את החבילה המדויקת אחת וההסגורים שלה. |
|`FindMusubiExactReleaseV1` |קרא תמונה אחת מדויקת של השחרור.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |פתרון או רשימה של מועמדים לשחרור סופיים. |
|`FindMusubiArchiveLocationsV1` |קראו את מקומות הארכיון הסופיים הנמכרים על ידי ספק. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |קרא את המטרה הנוכחית או ההיסטוריה הבלתי משתנה שלה. |

Torii חושף את משפחת המסלול של האפליקציה `/v1/musubi/`. MCP כלים משתמשים במזומן `iroha.musubi.queries.` ו `iroha.musubi.instructions.*` שמות. [Torii נקודות סוף](/he/reference/torii-endpoints.md) ו... [קישור בקשה](/he/reference/queries.md) עבור הרחבה API מפה.
