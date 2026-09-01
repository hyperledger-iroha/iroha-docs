---
translation_locale: he
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
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

חבילה משתמשת במפרט הסגור של הגרסה הראשונה. המניפסט `Musubi.toml` חייב להצהיר על `manifest-version = 1`, על מהדורת Kotodama `"1"` ועל IVM ABI גרסה `1`; אין מצב חלופי למניפסט או ל־ABI.

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

תלויות יכולות להשתמש בגרסאות מדויקות, בדרישות caret או tilde, בתווים כלליים כגון `1.*` ובקבוצות תנאים מופרדות בפסיקים כגון `>=1.0.0,<2.0.0`. מפתח טבלת התלויות הוא כינוי הייבוא המקומי של ההורה; `package` הוא תמיד בורר המרשם הקנוני.

`Musubi.lock` קושר את הגרף ל־`NetworkId` המדויק הנגזר מ־Genesis ולתמונת מצב סופית של המרשם. הוא מתעד את שורשי סביבת העבודה שנבחרו ואת צומתי ההפצה הבלתי משתנים, כולל התחייבויות מדויקות להפצה, לקוד המקור, לממשק, לארכיון, ל־ABI ולקצוות התלויות. גרסאות מקבילות מותרות כאשר הגרף שנפתר דורש אותן.

## הגדרת Taira SoraFS {#configure-taira-sorafs-fetching}

Taira הוא הרשת המבחנת הציבורית לזרם העבודה הזה. להתחיל Taira קונפיגורציה של לקלינט עם שרשרת הקשורה והאידנטיות הרשת המוצא מההסוג המקובל, לאחר מכן הוסף את קישורים של כניסה מאושרת ספציפיות למספק למטה. Taira הגדרת מחדש יכולה לשנות את `NetworkId`; לעדכן את זה מפרופיל ההפעלה הנחתם במקום להסיק אותו מהשרשרת יציבה UUID. חומר חתימה לחשבון ומפתחות המפעיל של ספקית חייבים להישאר בקבצים של זמן ההפעלה של הבעלים בלבד.

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

מקורות תלות קשורים על ידי כתיבת מחדש של קריאות מוסמכות כגון `math::add()` לשמות פנימיים דטרמיסטיים Kotodama. קריאת תלות לתפקיד לא הוצא החוצה נדחתה. ספריות ייבואות חושפות פונקציות; מטרות מקומיות `[[contract]]` ו `[[test]]` נשארו מטרות חבילת מפורשות.

## אימות וריפוי מקש {#cache-verification-and-repair}

פקודות המזמון הציבורי פועלות על ארכיונים בלתי משתנים, commit לרשום:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` מעביר להסגר צאצאים מהימנים שנפגמו ומביא מחדש את הארכיונים המדויקים כאשר ראיות סופיות של הספק מתירות זאת. הגיזום נכשל בכוונה באופן סגור עבור שינוי חי שאינו ריק; השתמשו ב־`--dry-run` כדי לבדוק את המועמדים שסווגו.

## ארגזות ופרסום {#packaging-and-publishing}

בדקו את קבוצת הקבצים המדויקת שתיארז לפני כתיבת הארכיון, ולאחר מכן בנו את החבילה הקנונית:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` כותב את `target/package/<namespace>-<name>-<version>.car`. קובץ ה־CAR קושר את מניפסט החבילה הקנוני, מניפסט ההפצה הסמנטי, קובץ הנעילה המדויק לאימות, עץ קוד המקור, תקציר הממשק והתחייבות הארכיון של SoraFS. ב־CLI של הגרסה הראשונה אין פקודות נפרדות `pack`, ‏`--car-out`, ‏`--sorafs-manifest-out` או `--source-plan-out`.

הפרסום הוא תהליך רשת חתום שניתן לחדש. קובץ ה־`client.toml` שנבחר חייב לכלול את הקישורים הנדרשים של `[musubi.publication]`, וכן את תצורת החשבון ורשת Taira. ארזו בדיוק חבר אחד בסביבת העבודה:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

השתמשו ב-`--detach` כדי לחזור לאחר שיומן הפעולה וגבול קליטת ה-seed נשמרו באופן עמיד. המשיכו פעולה עמידה באמצעות `publish --resume <operation-id> --config client.toml`. הנתיב המצומצם יותר `--recover <operation-id>` משחזר רק sidecars חסרי-שינוי שחסרים ביומן נקי מלפני הקליטה. אין `--dry-run` לפרסום ואין נתיב חלופי כללי להעלאה ציבורית; הריצו `package --list` ו-`package` לבדיקה מקדימה מקומית.

## שאילתות רישום וסייקל חיים {#registry-queries-and-lifecycle}

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

Musubi משתמש בהוראות ושאילתות שפורסמו לראשונה V1:

|פני השטח.|מטרה.|
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |לחבר חלל שמות למרחב נתונים של הבית שלו. |
|`RegisterMusubiArchiveV1` |רשום מחויבות ארכיון מקור מאושרת בלתי משתנה. |
|`AddMusubiArchiveLocationV1` |הוספת או חידוש מיקום ארכיון מוכשר SoraFS. |
|`PublishMusubiReleaseV1` |תדרוש או עדכן חבילה ותפרסם שחרור בלתי משתנה אחד. |
|`SetMusubiReleaseYankV1` |להשוות ולתקן את המצב של שחרור מדויק.|
|`InviteMusubiPackageMaintainerV1` |להתחיל את זרימת ההזמנה למפקידים במפורש. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |רישום או ריטג את שם כינוי גלובלי נשלט. |
|`AssertMusubiReleaseDigestV1` |מאמת את תקציר ההפצה המדויק.|
|`FindMusubiExactPackageV1` |קורא רשומת חבילה מדויקת אחת ואת הגרסאות הנוכחיות שלה. |
|`FindMusubiExactReleaseV1` |קורא תמונת מצב מדויקת אחת של הפצה.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |פתרון או רשימה של מועמדים לשחרור סופיים. |
|`FindMusubiArchiveLocationsV1` |קראו את מקומות הארכיון הסופיים הנמכרים על ידי ספק. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |קרא את המטרה הנוכחית או ההיסטוריה הבלתי משתנה שלה. |

Torii חושף את משפחת נתיבי היישום תחת `/v1/musubi/*`. כלי MCP משתמשים בשמות הנוכחיים `iroha.musubi.queries.*` ו-`iroha.musubi.instructions.*`. ראו [נקודות הקצה של Torii](/he/reference/torii-endpoints.md) ואת [מדריך השאילתות](/he/reference/queries.md) למפת ה-API הרחבה יותר.
