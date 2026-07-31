---
translation_locale: he
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות ההתקנה {#troubleshooting-installation-issues}

חלק זה מציע עצות פתרון בעיות להתקנת Iroha 3. אם הבעיה שאתה חווה אינה מתוארת כאן, צור איתנו קשר באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## בדיקות מהירות {#quick-checks}

רוב כישלונות ההתקנה מגיעים מאחד מארבעה מקומות:

- שרשרת כלים Rust מבוגרת יותר מהגרסה המונעת על ידי חלל העבודה מעלה
- `cargo` או `rustc` מתפתחים במתקן אחר מאשר `rustup`
- כלים לבניית מערכת חסרים, כגון קומפילר C, `pkg-config`, או CMake
- חתיכות מובילות או יצירות בנייה מקומיות לאחר שינוי תיקונים מקוריים

מנקודת הקבלה המקורית Iroha, תתחיל עם:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

אם `cargo metadata` נכשל, תיקנו את שרשרת הכלים המקומית לפני הפעלת `pnpm refresh:iroha --source /path/to/iroha`, כי העדכון יכול להזמין Kagami כדי ליצור את התוכנית הנוכחית של מודל הנתונים.

## פתרון בעיות Rust שרשרת כלים {#troubleshooting-rust-toolchain}

לפעמים, הדברים לא הולכים כמתוכנן. במיוחד אם היה לך `rust` על המערכת שלך לפני זמן מה, אבל לא העדכון. בעיה דומה יכולה להתרחש ב Python: XKCD יש דוגמה מפורסמת של איך זה יכול להיראות:

<div class="flex justify-center">

![Python סביבה פתרון בעיות קומיקס](/img/install-troubles.png)

</div>

### בדוק את הגרסה Rust {#check-rust-version}

לטובת שמירה על בריאותך ואת הבריאות שלנו, לוודא שיש לך את הגרסה הנכונה של `cargo` משותפת עם הגרסה הנכון של `rustc`. חלל העבודה המודרני למעלה מפרסם `rust-version = "1.92"` ומדביקים את ערוץ שרשרת הכלים ב `rust-toolchain.toml` כדי להראות את הגרסאות, לעשות

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ואז...

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

אם יש לך גרסאות גבוהות יותר, אתה בסדר. אם יש לך הגרסאות נמוכות יותר, אתה יכול לנהל את הפקודה הבאה כדי לעדכן אותו:

```bash
$ rustup toolchain update stable
```

### בדוק אתר ההתקנה {#check-installation-location}

אם אתה מקבל מספר גרסה נמוך יותר ואתה מעדכן את שרשרת הכלים וזה לא עבד... בואו פשוט נאמר שזה בעיה נפוצה, אבל אין לו פתרון נפוץ.

ראשית, אתה צריך לקבוע איפה הגרסה שאתה רוצה להשתמש בה מותקן:

```bash
$ rustup which rustc
$ rustup which cargo
```

ההתקנות של המשתמש של שרשראות הכלים בדרך כלל ב `~/.rustup/toolchains/stable-*/bin/`.

```bash
$ rustup toolchain update stable
```

וזה אמור לפתור את הבעיות שלך.

### בדוק את הגרסה המקובלת של Rust {#check-the-default-rust-version}

אפשרות נוספת היא שיש לך את שרשרת הכלים `stable` מעודכנת, אבל היא לא מוגדרת כדוגמנית.

```bash
$ rustup default stable
```

זה יכול לקרות אם אתה מותקן גרסה של `nightly`, או להגדיר גרסה ספציפית של Rust, אבל שכחת לנתק אותו.

### בדוק אם יש גרסאות אחרות Rust {#check-if-there-are-other-rust-versions}

אם נמשיך לפתור בעיות בבור הארנב, נוכל להשתמש בשמות כדורים:

```bash
$ type rustc
$ type cargo
```

אם אלה מצביעים על מקומות אחרים מאשר זה שראית בעת הפעלת `rustup which *`, אז יש לך בעיה.

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

כי יש לוגיקה פנימית שיכולה לשבור, לא משנה איך אתה מסדר מחדש את הכינוי שלך.

הפתרון הפשוט ביותר הוא להסיר את הגרסאות שאינך משתמש בהן.

עם זאת, זה קל יותר לומר מאשר לעשות, מכיוון שזה כרוך בעקבות כל הגרסאות של rustup המוסדות והזמינים לך. בדרך כלל, יש רק שתי: הגרסה של מנהל חבילות המערכת ואחת שהתקינה במיקום סטנדרטי בתיקוי הבית שלך כאשר פעלת את הפקודה בהתחלה של הדרכה זו. עבור הראשונה, ראה את מדריך ההפצה (לינוקס) שלך, (`apt remove rust`). עבור השנייה, תפעילו:

```bash
$ rustup toolchain list
```

ואז, עבור כל `<toolchain>` (ללא קווי הזווית כמובן):

```bash
$ rustup remove <toolchain>
```

לאחר מכן, לוודא כי

```bash
$ cargo --help
```

תוצאה של שגיאה של פקודה לא נמצאת, כלומר שאין לך שרשרת כלים פעילה Rust מותאמת.

```bash
$ rustup toolchain install stable
```

## פתרון בעיות Python שרשרת כלים {#troubleshooting-python-toolchain}

כאשר אתה מקין את Python חבילת גלגלים באמצעות צינור במהלך [Python הגדרת הלקוח](/he/guide/tutorials/python.md), אתה עלול לעמוד בטעות כמו: "אירוזה_פיטון...*.whl הוא לא גלגל תומך על פלטפורמה זו".

שגיאה זו פירושה כי pip ישן, אז אתה צריך לעדכן אותו. ראשית כל, מומלץ לבדוק את OS שלך על עדכונים ולעשות שיפור מערכת.

אם זה לא עובד, אתה יכול לנסות לעדכן `pip` עבור תיבת המשתמשים שלך.

`python -m pip install --upgrade pip`

לוודא כי `pip` הוא מותקן במגוון הבית שלך. כדי לעשות זאת, לנהל `whereis pip` ולבדוק אם `/home/username/.local/bin/pip` נמצא בין הדרכים. אם לא, עדכן את משתנה של הצ'ל שלך `PATH`.

אם הבעיה ממשיכה, אנא צור קשר [ איתנו ](/he/help/) ותדווח על התוצרות.

```
python --version
python3 --version
pip --version
pip3 --version
```
