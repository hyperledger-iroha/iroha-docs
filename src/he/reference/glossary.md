---
translation_locale: he
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# גלאסרי <!-- omit in toc --> {#glossary}

כאן אתה יכול למצוא הגדרות של כל Iroha- יחידות קשורות.

- [עמיתים](#peer)
- [נכסים](#asset)
- [סבלנות פגמים ביזנטנית (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha מרכיבים](#iroha-components)
  - [Sumeragi (קיסר)](#sumeragi-emperor)
  - [Torii (שער)](#torii-gate)
  - [Kura (מחסון)](#kura-warehouse)
  - [Kagami(מורה ומדגם ו/או מראה)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [עץ מרקל (עץ האש)](#merkle-tree-hash-tree)
  - [חוזים חכמים](#smart-contracts)
  - [תפעילים](#triggers)
  - [תרגום](#versioning)
  - [היג'ירי (מערכת המוניטין בין השותפים)](#hijiri-peer-reputation-system)
- [Iroha מודולים](#iroha-modules)
- [Iroha הוראות מיוחדות (ISI)](#iroha-special-instructions-isi)
  - [שימושיות Iroha הוראות מיוחדות](#utility-iroha-special-instructions)
  - [גרעין Iroha הוראות מיוחדות](#core-iroha-special-instructions)
  - [ספציפית לתחום Iroha הוראות מיוחדות](#domain-specific-iroha-special-instructions)
  - [מנהג Iroha הוראות מיוחדות](#custom-iroha-special-instruction)
- [Iroha שאלה](#iroha-query)
- [צפו בשינוי](#view-change)
- [תפיסת המדינה העולמית (WSV)](#world-state-view-wsv)
- [מנהיג](#leader)

## ספרי ה-blockchain {#blockchain-ledgers}

ספרי ה-blockchain הם מערכות שמירה דיגיטלית שמשתמשות ב-blockchain
טכנולוגיה לשמור על רישומים פיננסיים. אלה נקראים
ספרים ששימשו לרשומות פיננסיות כגון מחירים, חדשות ו
מידע על עסקאות.

בתקופת הביניים, ספרים גדולים היו פתוחים לציבור
אימות מדויק. הרעיון הזה מתבטא ב-blockchain מבוסס
מערכות שיכולות לבדוק את החשיבות של הנתונים המאוחסנים.

## עמיתים {#peer}

עמיתי Iroha משמעותו: Iroha אינסטנציה של התהליך Iroha תהליכים
ויישומים לקלינט יכולים להתחבר.
מכונה אחת יכולה להכיל מספר Iroha עמיתים.
עמיתים שווים לגבי משאביהם ויכולותיהם,
עם יוצא מן הכלל חשוב: רק אחד משותפיו רץ
בלוק הגנזה בשלב ההתחלה Iroha רשת.

שרשרת בלאק אחרות עשויות להתייחס לאותו מושג כמו קשר או מתוקן.

עמיתי יכול להיות תהליך במערכת המארח שלה.
זה יכול גם להיות מכיל Docker קונטינר וקופסת Kubernetes.

## נכסים {#asset}

בהקשר של blockchain, נכס הוא ייצוג של
אובייקט ב-blockchain.

מידע נוסף על נכסים זמין
[כאן.](/he/blockchain/assets.md).

### נכסים פונגביים {#fungible-assets}

נכסים כאלה ניתן להחליף בקלות עם נכסים אחרים של אותו סוג כי
הם ניתן להחליף.

לדוגמה, כל יחידות של אותה מטבע שווה ערך
ניתן להשתמש בהם לרכישת סחורות.
מראה, מלבד התעללות של כרטיסי בנק ומכספים.

### נכסים שאינם פוגנים {#non-fungible-assets}

נכסים שאינם פוגנים הם ייחודיים וערוניים בשל הספציפיות שלהם.
מאפיינים נדירים; הערך שלהם אינו ניתן להשוות עם נכסים אחרים.

- ערך הציור יכול להשתנות בהתאם לאמן, לתקופה שבה הוא היה
  צבע, והעניינים של הציבור בו.
- שתי בתים באותו רחוב עשויים להיות בעלי רמות שונות של תחזוקה.
- יצרני תכשיטים בדרך כלל מציעים מגוון של עיצובים שונים.

### נכסים שעלולים להימנע מהם {#mintable-assets}

נכס יכול להימכר אם ניתן להוציא יותר מאותו סוג.

### נכסים שאינם נדרשים {#non-mintable-assets}

אם הסכום הראשוני של נכס נקבע פעם אחת ולא משתנה, הוא
נחשבת לא ניתן לטיפול בה.

ה- [בלוק בראשית](/he/guide/configure/genesis.md) מצדיר את המידע הזה
ה- Iroha הגדרות.

## סבלנות פגמים ביזנטנית (BFT) {#byzantine-fault-tolerance-bft}

תכונה של יכולת לתפקד כראוי עם רשת המכילה
אחוז מסוים של שחקנים רשעים. Iroha הוא מסוגל לתפקד.
עם עד 33% של שחקנים רועיים ברשת הדמי-דמים שלה.

## Iroha מרכיבים {#iroha-components}

Rust מודולים המכילים Iroha תפקוד.

### Sumeragi (קיסר) {#sumeragi-emperor}

ה- Iroha מודול האחראי על הסכמה.

### Torii (שער) {#torii-gate}

מודול עם הגישה של התבקשות המגיעות ל [עמיתים](#peer). הוא נהג
לקבל, לקבל ולשלוח הוראות נכנסות; HTTP שאלות, כמו גם
כמו עדכונים לסטנדרטים של זמן הפעלה.

### Kura (מחסון) {#kura-warehouse}

אחסון בלוק קבוע. Kura חנויות חותמות בלוקים, בלאק האשיזים, גובה
אינדיקסים, סיידקרים לשחזור, ומטאטא נתונים על דיסק.
[תפיסת העולם על המצב](#world-state-view-wsv) הוא נבנה מחדש Kura בלוקים כאשר
תמונת רגע של המדינה אינה זמינה או מאחורי החנות המקומית.
[Kura אחסון](/he/blockchain/world.md#kura-storage).

### Kagami(מורה ומדגם ו/או מראה) {#kagami-teacher-and-exemplar-and-or-looking-glass}

גנרטור עבור נתונים בשימוש נפוץ. הוא יכול לייצר זוגות מפתחות קריפטוגרפיות,
בלוקי הגנזה, מסמכים וכו'.

### עץ מרקל (עץ האש) {#merkle-tree-hash-tree}

מבנה נתונים המשמש כדי לאמת ולבחון את המצב בכל בלוק
גובה. Iroha ההיישום הנוכחי הוא עץ בינארי.
[ויקיפדיה](https://en.wikipedia.org/wiki/Merkle_tree) לקבלת פרטים נוספים.

### חוזים חכמים {#smart-contracts}

חוזים חכמים הם תוכניות מבוססות בלוקצ'ין אשר פועלות כאשר קבוצה מסוימת
התנאים של Iroha חוזים חכמים מתבצעים באמצעות
[גרעין Iroha הוראות מיוחדות](#core-iroha-special-instructions).

### תפעילים {#triggers}

סוג של אירוע שמאפשר להזכיר Iroha הוראות מיוחדות
בלוק לקבוע, זמן (עם כמה caveats), וכו '
[כאן.](/he/blockchain/triggers.md).

### תרגום {#versioning}

כל בקשה מצוינת עם API גרסה אליו הוא שייך.
מאפשר שילוב של גרסאות בינאריות שונות של Iroha לקוח/שותף
תוכנה לתקשר, אשר בתורו מאפשרת עדכונים של תוכנה
Iroha רשת.

### היג'ירי (מערכת המוניטין בין השותפים) {#hijiri-peer-reputation-system}

Iroha מערכת המוניטין. [עמיתים](#peer)
שיש להם שיא טוב, ומפחיתים את הנזק שיכול להיגרם
רעה [עמיתים](#peer).

## Iroha מודולים {#iroha-modules}

הרחבות של צד שלישי ל Iroha שמספקת פונקציונליות מותאמות.

## Iroha הוראות מיוחדות (ISI) {#iroha-special-instructions-isi}

ספרייה של חוזים חכמים Iroha. ניתן להתייחס אליהן באמצעות
או עסקאות או מקשי אירוע רשומים. ISI
[כאן.](/he/blockchain/instructions.md).

#### שימושיות Iroha הוראות מיוחדות {#utility-iroha-special-instructions}

המجموعת הזו של [איסי](#iroha-special-instructions-isi) מכיל הגיוני
הוראות כמו `If`, קשור ל-I/O כמו `Notify` ומסגמות כמו
`Sequence`. הם משמשים בעיקר
[הוראות מותאמות](#custom-iroha-special-instruction).

### גרעין Iroha הוראות מיוחדות {#core-iroha-special-instructions}

[הוראות מיוחדות](#iroha-special-instructions-isi) עם כל
Iroha הפעלת. אלה כוללים כמה
[ספציפית לתחום](#domain-specific-iroha-special-instructions) כמו גם
[הוראות לשימוש](#utility-iroha-special-instructions).

### ספציפית לתחום Iroha הוראות מיוחדות {#domain-specific-iroha-special-instructions}

הוראות הקשורות לפעילויות ספציפיות לתחום: נכסים, חשבונות,
תחומים, ניהול עמיתים). אלה מספקים את הכלים הדרושים
שינויים [תפיסת העולם על המצב](#world-state-view-wsv) במבנה בטוח ו...
בדרך בטוחה.

### מנהג Iroha הוראות מיוחדות {#custom-iroha-special-instruction}

הוראות המוצגות ב [Iroha מודולים](#iroha-modules), על ידי לקוחות או 3rd
מפלגות. אלה יכולים להיבנות רק באמצעות
[ההוראות המרכזיות](#core-iroha-special-instructions). פורקינג
שינוי Iroha קוד המקור אינו מומלץ, כנחיות מיוחדות
לא הסכם על ידי [עמיתים](#peer) ב- Iroha הפעלת תיחשב כטעימות,
כך [עמיתים](#peer) פעלת אינסטנציה משנית תגרום לגילוי הגישה שלהם.

## Iroha שאלה {#iroha-query}

בקשה לקרוא את תפיסת המדינה העולמית מבלי לשנות את התפיסה הזאת.
שאלות [כאן.](/he/blockchain/queries.md).

## צפו בשינוי {#view-change}

תהליך שמתקיים במקרה של ניסיון נכשל בהסכמה.
בדרך כלל זה כרוך בבחירת [מנהיג](#leader).

## תפיסת המדינה העולמית (WSV) {#world-state-view-wsv}

ייצוג בזיכרון של מצב blockchain הנוכחי. WSV מכיל
ה- `World`, חשיבות בלוק מחויבות, אינדיקסים של עסקאות, טופולוגיית הסכמה,
מדדים נגזרים המשמשים בשאלות. הוא מעודכן רק באמצעות מחויבות
בלוקים וניתן לבנות מחדש [Kura](#kura-warehouse). תראו.
[תפיסת העולם על המצב](/he/blockchain/world.md#world-state-view-wsv).

## מנהיג {#leader}

ברשת אי-רוהא, חבר נבחר באופן אקראי וניתן לו את
הזכות ליצור את הבלוק הבא.
רשתות שמביעות
[תורלנס פגם ביזנטי](#byzantine-fault-tolerance-bft) דרך
[שינוי התצפית](#view-change).
