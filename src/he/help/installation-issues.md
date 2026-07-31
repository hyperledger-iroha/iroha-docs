---
translation_locale: he
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות ההתקנה {#troubleshooting-installation-issues}

חלק זה מציע עצות פתרון בעיות Iroha 3 ההתקנה.
הבעיה שאתם חווים אינה מתוארת כאן,
התקשר אלינו באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## בדיקות מהירות {#quick-checks}

רוב כישלונות ההתקנה מגיעים מאחד מארבע מקומות:

- א Rust שרשרת הכלים ישנה יותר מהגרסה שמוקדמת על ידי חלל העבודה העליון
- `cargo` או `rustc` פתרון למתקן אחר מאשר `rustup`
- כלים לבניית מערכת חסרים, כגון קומפיילר C, `pkg-config`, או CMake
- חתיכות מובנות או יצירות בנייה מקומיות לאחר שינוי המקור
  תיקונים

מה- Iroha בדיקת המקור, תתחיל עם:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

אם `cargo metadata` כשל, לתקן את שרשרת הכלים המקומית לפני הפעלת
`pnpm refresh:iroha --source /path/to/iroha`, כי ההשפקה יכולה להתקשר
Kagami כדי ליצור את התכנית הנוכחית של דגם הנתונים.

## פתרון בעיות Rust שרשרת כלים {#troubleshooting-rust-toolchain}

לפעמים, הדברים לא הולכים כמתוכנן. `rust` על
מערכת לפני זמן מה, אבל לא עדכנו. בעיה דומה יכולה להתרחש
Python: XKCD יש דוגמה מפורסמת של מה זה יכול להיראות כמו:

<div class="flex justify-center">

![Python פתרון בעיות סביבה קומיקס](/img/install-troubles.png)

</div>

### תבדוק Rust גרסה {#check-rust-version}

לטובת שמירה על בריאותך ואת הבריאות שלנו, לוודא שאתה
יש לך את הגרסה הנכונה של `cargo` משותף עם הגרסה הנכונה של `rustc`.
המרחב הנוכחי של העבודה למעלה מפרסם `rust-version = "1.92"` ופינים את
ערוץ שרשרת הכלים `rust-toolchain.toml`. כדי להראות את הגרסאות, לעשות

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ואז...

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

אם יש לך גרסאות גבוהות יותר, אתה בסדר.
יכול להפעיל את הפקודה הבאה כדי לעדכן אותו:

```bash
$ rustup toolchain update stable
```

### בדוק אתר ההתקנה {#check-installation-location}

אם אתה מקבל מספר גרסה נמוכה יותר **ו** עדכנת את שרשרת הכלים וזה
לא עבד... בואו רק נאמר שזה בעיה נפוצה, אבל אין לה
פתרון משותף.

ראשית, אתה צריך לקבוע איפה הגרסה שאתה רוצה להשתמש היא
מותקן:

```bash
$ rustup which rustc
$ rustup which cargo
```

ההתקנות של המשתמשים של שרשראות הכלים הן _בדרך כלל_ ב
`~/.rustup/toolchains/stable-*/bin/`. אם זה המצב, אתה צריך להיות
יכול לרוץ

```bash
$ rustup toolchain update stable
```

וזה אמור לפתור את הבעיות שלך.

### בדוק את ההגדרות Rust גרסה {#check-the-default-rust-version}

אפשרות נוספת היא שיש לך את העדכון `stable` שרשרת כלי, אבל זה
לא הוגדר כמתקבע.

```bash
$ rustup default stable
```

זה יכול לקרות אם אתה מקין `nightly` גרסה, או להגדיר
Rust גרסה, אבל שכחתי לפתור אותה.

### בדוק אם יש עוד Rust גרסאות {#check-if-there-are-other-rust-versions}

אם נמשיך במתקן בעיות בבור הארנב, נוכל לקבל קלינה
שם כינוי:

```bash
$ type rustc
$ type cargo
```

אם אלה מצביעים למקומות אחרים מאשר זה שראיתם בעת הריצה
`rustup which *`, אז יש לך בעיה.
רק...

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

כי יש לוגיקה פנימית שיכולה לשבור, לא משנה איך אתה
תארגן מחדש את הכינוי של הכדורים.

הפתרון הפשוט ביותר הוא להסיר את הגרסאות שאינך משתמש בהן.

זה קל יותר. _אמר_ מאשר _הושלם_, עם זאת, מכיוון שזה כרוך בעקבות כל
גרסאות של rustup ישנן רק
שתיים: גרסה של מנהל חבילות המערכת ואחת שהוסבת
המיקום המקורי בתיקוי הבית שלך כאשר פעלת את הפקודה
בהתחלה של הדרכה זו. עבור הראשון, פנה את (לינוקס)
מדריך ההפצה (`apt remove rust`). עבור האחרונים, תפעילו:

```bash
$ rustup toolchain list
```

ואז, לכל `<toolchain>` (ללא קווי הזווית כמובן):

```bash
$ rustup remove <toolchain>
```

לאחר מכן, לוודא כי

```bash
$ cargo --help
```

תוצאה של שגיאה של פקודה לא נמצאת, כלומר שאין לך פעיל Rust
שרשרת הכלים התקנה.

```bash
$ rustup toolchain install stable
```

## פתרון בעיות Python שרשרת כלים {#troubleshooting-python-toolchain}

כאשר אתה מקין את Python חבילת גלגלים באמצעות צינור במהלך [Python הגדרת הלקוח](/he/guide/tutorials/python.md), ייתכן שתפגוש טעות כמו:
"אירוזה_פיטון...*.whl לא גלגל תומך על הפלטפורמה הזאת".

שגיאה זו אומרת כי pip ישנה, אז אתה צריך לעדכן אותו.
ראשית כל, מומלץ לבדוק את OS עדכונים ולבצע שיפור מערכת.

אם זה לא עובד, אתה יכול לנסות לעדכן `pip` עבור תיק המשתמשים שלך.

`python -m pip install --upgrade pip`

תוודא ש `pip` זה מותקן בתיקון הבית שלך. `whereis pip` ובדוק אם `/home/username/.local/bin/pip` אם לא, עדכן את קליפתך. `PATH` משתנה.

אם הבעיה ממשיכה, בבקשה [התקשר אלינו](/he/help/) ולדווח על התוצאות.

```
python --version
python3 --version
pip --version
pip3 --version
```
