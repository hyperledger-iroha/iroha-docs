---
translation_locale: he
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# גלוסרי <!-- omit in toc --> {#glossary}

כאן אתה יכול למצוא הגדרות של כל יחידות הקשורות Iroha.

- [עמיתים](#peer)
- [נכס](#asset)
- [סובלנות פגמים ביזנטית (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha מרכיבים](#iroha-components)
  - [Sumeragi (קיסר)](#sumeragi-emperor)
  - [Torii (שער) ](#torii-gate)
  - [Kura (מחסן) ](#kura-warehouse)
  - [Kagami(מורה ודוגמא ו/או מראה)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [עץ מרקל (עץ האש) ](#merkle-tree-hash-tree)
  - [חוזים חכמים](#smart-contracts)
  - [תפעילים](#triggers)
  - [תורגם](#versioning)
  - [היג'ירי (מערכת המוניטין של עמיתים) ](#hijiri-peer-reputation-system)
- [Iroha מודולים](#iroha-modules)
- [Iroha הוראות מיוחדות (ISI) ](#iroha-special-instructions-isi)
  - [שימוש Iroha הוראות מיוחדות](#utility-iroha-special-instructions)
  - [הליבה Iroha הוראות מיוחדות](#core-iroha-special-instructions)
  - [ספציפית לתחום Iroha הוראות מיוחדות](#domain-specific-iroha-special-instructions)
  - [מנהג Iroha הוראה מיוחדת](#custom-iroha-special-instruction)
- [Iroha שאלת](#iroha-query)
- [שינוי הצגה](#view-change)
- [תצפית המדינה העולמית (WSV) ](#world-state-view-wsv)
- [מנהיג](#leader)

## ספרי ה-blockchain {#blockchain-ledgers}

ספרי ה-blockchain הם מערכות רישום דיגיטליות שמשתמשות בטכנולוגיית blockchain כדי לשמור רשומות פיננסיות. אלה נקראים על שם ספרים ישנים שימשו עבור רשומות פיננסים כגון מחירים, חדשות ומידע עסקאות.

בימי הביניים, ספרים גדולים היו פתוחים לצפייה ציבורית ובדיקת מדויקת. הרעיון הזה משתקף במערכות המבוססות על blockchain שיכולות לבדוק את החשיבות של הנתונים המאוחסנים.

## משותפים {#peer}

משותף ב Iroha הוא אינסטנציה של תהליך Iroha שאליה ניתן להתחבר תהליכים אחרים ויישומים לקלינט Iroha. מכונה אחת יכולה לארח מספר משותפים Iroha. עמיתים שווים מבחינת משאביהם ויכולותיהם, עם יוצא מן הכלל חשוב: רק אחד מהעמיתים מפעיל את הבלוק הגנזית בשלב ההתחלה של הרשת Iroha .

שרשראות בלוק אחרות עשויות להתייחס לאותו מושג כמו קשר או מעודד.

משותף יכול להיות תהליך במערכת המארח שלה. הוא יכול גם להיות מכוסה בקונtejnר Docker ובקוד Kubernetes.

## נכסים {#asset}

בהקשר של blockchain, נכס הוא ייצוג של אובייקט בעל ערך על blockchain.

מידע נוסף על נכסים זמין [כאן ](/he/blockchain/assets.md).

### נכסים פונגיליים {#fungible-assets}

נכסים כאלה ניתן להחליף בקלות עם נכסים אחרים של אותו סוג מכיוון שהם משתנים.

לדוגמה, כל יחידות של אותה מטבע שווה ערך וניתן להשתמש בהם לרכישת סחורות. בדרך כלל, נכסים פוגביבים זהים במראה, מלבד התעללות של כרטיסי בנק ומכספים.

### נכסים שאינם פוגנים {#non-fungible-assets}

נכסים שאינם פוגלים הם ייחודיים וערוניים בשל המאפיינים הספציפיים שלהם ומדירותם; הערך שלהם אינו ניתן להשוות עם נכסים אחרים .

- הערך של ציור יכול להשתנות בהתאם לאמן, לתקופה שבה הוא צייר, והעניין הציבור בו.
- שתי בתים באותו רחוב עשויים להיות בעלי רמות שונות של תחזוקה.
- יצרני תכשיטים מציעים בדרך כלל מגוון של עיצובים שונים.

### נכסים שעלולים להימנע מהם {#mintable-assets}

נכס ניתן להפיק אם ניתן להוציא יותר מאותו סוג.

### נכסים שאינם ניתנים לחיסול {#non-mintable-assets}

אם הסכום הראשוני של נכס נקבע פעם אחת ואינו משתנה, הוא נחשב לא ניתן להפריד.

בלוק [Genesis](/he/guide/configure/genesis.md) קובע את המידע הזה עבור הקונפיגורציה של Iroha.

## סובלנות פגמים ביזנטית (BFT) {#byzantine-fault-tolerance-bft}

המאפיין של יכולת לתפקד כראוי עם רשת המכילה אחוז מסוים של שחקנים מזיקים. Iroha הוא מסוגל לתפקד עם עד 33% של שחקני מזיקים ברשת הדמיון שלו.

## Iroha מרכיבים {#iroha-components}

Rust מודולים המכילים פונקציונליות Iroha.

### Sumeragi (קיסר) {#sumeragi-emperor}

מודול Iroha האחראי על הסכמה.

### Torii (שער) {#torii-gate}

מודול עם ההיגיון לניהול בקשות נכנסות עבור [ peer](#peer). הוא משמש לקבלת, קבלת ומסלול הוראות נכנסות, ובקריאות HTTP, כמו גם עדכונים בסטנדרטים של זמן ההפעלה.

### Kura (סדרון) {#kura-warehouse}

אחסון בלוק קבוע. Kura חנויות בלוקים חתומים, בלאק האשיזים, אינדיקסים של גובה, סיידקרות התאוששות, ו- commit-roster metadata [תפיסת העולם על המצב](#world-state-view-wsv) הוא נבנה מחדש מ Kura בלוקים כאשר תמונה של מצב אינה זמינה או מאחורי חנות הבלוק המקומית. ראה [Kura אחסון](/he/blockchain/world.md#kura-storage).

### Kagami(מורה ודוגמא ו/או מראה) {#kagami-teacher-and-exemplar-and-or-looking-glass}

גנרטור עבור נתונים משמשים באופן נפוץ. הוא יכול ליצור זוגות מפתחות קריפטוגרפיות, בלוקי דגימה, מסמכים וכו'.

### עץ מרקל (עץ האש) {#merkle-tree-hash-tree}

מבנה נתונים המשמש לאמת ולבחון את המצב בגובה כל בלוק. יישום הנוכחי של Iroha הוא עץ בינארי. ראה [וויקיפדיה](https://en.wikipedia.org/wiki/Merkle_tree) לפרטים נוספים.

### חוזים חכמים {#smart-contracts}

חוזים חכמים הם תוכניות מבוססות ב-blockchain אשר פועלות כאשר קבוצה ספציפית של תנאים מופגשים. ב Iroha חוזים חוכמים מתבצעים באמצעות [core Iroha הוראות מיוחדות ](#core-iroha-special-instructions).

### תפעילים {#triggers}

סוג של אירוע המאפשר להזכיר הוראה מיוחדת Iroha בביצוע בלוק ספציפי, זמן (עם כמה caveats), וכו' מידע נוסף על גורמים לטיגור [כאן](/he/blockchain/triggers.md).

### תרגום {#versioning}

כל בקשה מסומנת עם הגרסה API שהיא שייכת אליה. היא מאפשרת שילוב של גרסאות בינאריות שונות של תוכנה קלינט/שחר Iroha לפעול זה בזה, מה שבטח מאפשר עדכונים לתוכנה ברשת Iroha.

### היג'ירי (מערכת המוניטין של עמיתים) {#hijiri-peer-reputation-system}

Iroha מערכת המוניטין היא מאפשרת לקבוע עדיפות [משותפים](#peer) שיש להם שיא טוב, ולהפחית את הנזק שיכול להיגרם על ידי [משותפים](#peer).

## Iroha מודולים {#iroha-modules}

הרחבות של צד שלישי ל- Iroha המספקות פונקציונליות מותאמות.

## Iroha הוראות מיוחדות (ISI) {#iroha-special-instructions-isi}

ספרייה של חוזים חכמים Iroha. ניתן לבקש את זה באמצעות עסקאות או מקשי אירועים רשומים. ISI [כאן.](/he/blockchain/instructions.md).

#### שימוש Iroha הוראות מיוחדות {#utility-iroha-special-instructions}

קבוצה זו של [isi](#iroha-special-instructions-isi) מכילה הוראות לוגיות כמו `If`, I/O קשורת כמו `Notify` ומרכיבים כמו `Sequence`. הם משמשים בעיקר כ- [הוראות מותאמות ](#custom-iroha-special-instruction).

### הנחיות המיוחדות Iroha {#core-iroha-special-instructions}

[הוראות מיוחדות ](#iroha-special-instructions-isi) המוצעות עם כל פיתוח Iroha. אלה כוללים כמה [תרחובות ספציפיות ](#domain-specific-iroha-special-instructions), כמו גם הוראות שימוש [ ](#utility-iroha-special-instructions).

### הוראות מיוחדות ספציפיות לתחום Iroha {#domain-specific-iroha-special-instructions}

הוראות הקשורות לפעילויות ספציפיות לתחום: נכסים, חשבונות, תחומים, ניהול עמיתים). אלה מספקים את הכלים הדרושים כדי לבצע שינויים בתצפית המדינה העולמית [ ](#world-state-view-wsv) באופן בטוח ובטוח.

### הוראות מיוחדות Iroha {#custom-iroha-special-instruction}

הוראות המוצעות ב- [Iroha מודולים](#iroha-modules), על ידי לקוחות או צדדים שלישיים. אלה יכולים להיות בנויים רק באמצעות [ההוראות המרכזיות](#core-iroha-special-instructions). פורק ושינוי של Iroha קוד המקור אינו מומלץ, כי הוראות מיוחדות לא הסכימו על ידי [משותפים](#peer) ב- Iroha השיגור יטופל כפגמים, כך [משותפים](#peer) אם אתה מפעיל אינסטנציה מוגדרת, גישה שלהם תיבטל.

## שאלה Iroha {#iroha-query}

בקשה לקרוא את תצפית המצב העולמי מבלי לשנות את התצפית. [כאן.](/he/blockchain/queries.md).

## תצפית שינוי {#view-change}

תהליך שמתקיים במקרה של ניסיון נכשל בהסכמה. בדרך כלל זה כרוך בבחירת מנהיג חדש [](#leader).

## תצפית המדינה העולמית (WSV) {#world-state-view-wsv}

ייצוג בזיכרון של מצב ה-blockchain הנוכחי. WSV מכיל את `World`, חשישים בלוק מחויבים, אינדיקסים של עסקאות, טופולוגיה של הסכמה ואינדיקסים נגזרים המשמשים בשאלות . הוא מעודכן רק באמצעות בלוקים מחויבים וניתן לבנות אותו מחדש מ- [Kura](#kura-warehouse). ראה [ World State View ](/he/blockchain/world.md#world-state-view-wsv).

## מנהיג {#leader}

ברשת Iroha, עמית נבחר באופן אקראי וניתן לו את הזכות המיוחדת ליצור את הבלוק הבא . זכות זו יכולה להיות מבוטלת ברשתות שמשיגו [טורלנס פגום ביזנטי](#byzantine-fault-tolerance-bft) דרך [שינוי תצפית](#view-change).
