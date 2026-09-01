---
translation_locale: he
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מילון מונחים <!-- omit in toc --> {#glossary}

כאן תוכלו למצוא הגדרות של ישויות ומונחים הקשורים ל־Iroha.

- [עמית](#peer)
- [נכס](#asset)
- [סובלנות פגמים ביזנטית (BFT) ](#byzantine-fault-tolerance-bft)
- [רכיבי Iroha](#iroha-components)
  - [Sumeragi (קיסר)](#sumeragi-emperor)
  - [Torii (שער) ](#torii-gate)
  - [Kura (מחסן) ](#kura-warehouse)
  - [Kagami (מורה, דוגמה ו/או מראה)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [עץ Merkle (עץ גיבוב)](#merkle-tree-hash-tree)
  - [חוזים חכמים](#smart-contracts)
  - [Triggers](#triggers)
  - [ניהול גרסאות](#versioning)
  - [Hijiri (מערכת המוניטין של עמיתים)](#hijiri-peer-reputation-system)
- [מודולי Iroha](#iroha-modules)
- [הוראות מיוחדות של Iroha ‏(ISI)](#iroha-special-instructions-isi)
  - [הוראות מיוחדות מסייעות של Iroha](#utility-iroha-special-instructions)
  - [הוראות מיוחדות ליבה של Iroha](#core-iroha-special-instructions)
  - [הוראות מיוחדות תלויות־תחום של Iroha](#domain-specific-iroha-special-instructions)
  - [הוראה מיוחדת מותאמת אישית של Iroha](#custom-iroha-special-instruction)
- [שאילתת Iroha](#iroha-query)
- [החלפת תצוגה](#view-change)
- [תצוגת מצב העולם (WSV)](#world-state-view-wsv)
- [מנהיג](#leader)

## ספר החשבונות של הבלוקצ'יין {#blockchain-ledgers}

ספרי חשבונות של blockchain הם מערכות דיגיטליות לניהול רשומות, המשתמשות בטכנולוגיית blockchain לשמירת מידע פיננסי. שמם נגזר מספרי החשבונות המסורתיים ששימשו לרישום מחירים, חדשות ופרטי עסקאות.

בימי הביניים היו ספרי חשבונות פתוחים לעיון הציבור ולאימות דיוקם. רעיון זה משתקף במערכות מבוססות blockchain, היכולות לבדוק את תקינות הנתונים השמורים.

## עמית {#peer}

עמית ב־Iroha הוא מופע של תהליך Iroha שאליו יכולים להתחבר תהליכי Iroha אחרים ויישומי לקוח. מכונה אחת יכולה לארח כמה עמיתי Iroha. העמיתים שווים במשאביהם וביכולותיהם, למעט חריג חשוב: בשלב ה־bootstrap של רשת Iroha רק אחד העמיתים מריץ את בלוק Genesis.

רשתות blockchain אחרות עשויות לכנות אותו מושג node או validator.

עמית יכול לפעול כתהליך במערכת המארחת. הוא יכול גם לפעול בתוך קונטיינר Docker או pod של Kubernetes.

## נכסים {#asset}

בהקשר של blockchain, נכס הוא ייצוג בשרשרת של אובייקט בעל ערך.

מידע נוסף על נכסים זמין [כאן](/he/blockchain/assets.md).

### נכסים בני־חליפין {#fungible-assets}

אפשר להחליף נכסים כאלה בקלות בנכסים אחרים מאותו סוג משום שהם שקולים זה לזה.

לדוגמה, כל היחידות של אותו מטבע שוות בערכן ואפשר להשתמש בהן לרכישת מוצרים. בדרך כלל נכסים בני־חליפין זהים במראם, למעט הבלאי של שטרות ומטבעות.

### נכסים שאינם בני־חליפין {#non-fungible-assets}

נכסים שאינם בני־חליפין הם ייחודיים ובעלי ערך בזכות מאפייניהם המסוימים ונדירותם; אי אפשר להשוות את ערכם ישירות לנכסים אחרים.

- הערך של ציור יכול להשתנות בהתאם לאמן, לתקופה שבה הוא צייר, והעניין הציבור בו.
- שני בתים באותו רחוב עשויים להיות במצבי תחזוקה שונים.
- יצרני תכשיטים מציעים בדרך כלל מגוון של עיצובים שונים.

### נכסים הניתנים להנפקה {#mintable-assets}

נכס ניתן להנפקה אם אפשר להנפיק כמות נוספת מאותו סוג.

### נכסים שאינם ניתנים להנפקה {#non-mintable-assets}

אם הכמות הראשונית של נכס נקבעת פעם אחת ואינה משתנה, הוא נחשב לנכס שאינו ניתן להנפקה.

בלוק [Genesis](/he/guide/configure/genesis.md) קובע את המידע הזה עבור הקונפיגורציה של Iroha.

## סובלנות פגמים ביזנטית (BFT) {#byzantine-fault-tolerance-bft}

היכולת לפעול כראוי ברשת הכוללת שיעור מסוים של גורמים זדוניים. Iroha מסוגל לפעול כאשר עד 33% מהגורמים ברשת peer-to-peer שלו זדוניים.

## רכיבי Iroha {#iroha-components}

מודולי Rust המכילים את הפונקציונליות של Iroha.

### Sumeragi (קיסר) {#sumeragi-emperor}

מודול Iroha האחראי לקונצנזוס.

### Torii (שער) {#torii-gate}

מודול המכיל את לוגיקת הטיפול בבקשות נכנסות עבור [העמית](#peer). הוא מקבל ומנתב הוראות ושאילתות HTTP נכנסות, וכן עדכוני תצורה של סביבת הריצה.

### Kura (מחסן) {#kura-warehouse}

אחסון מתמשך לבלוקים. Kura שומר בדיסק בלוקים חתומים, גיבובי בלוקים, אינדקסי גובה, קובצי sidecar לשחזור ומטא־נתונים של רשימת commit. [תצוגת מצב העולם](#world-state-view-wsv) נבנית מחדש מבלוקי Kura כאשר תמונת מצב אינה זמינה או מפגרת אחרי מאגר הבלוקים המקומי. ראו [אחסון Kura](/he/blockchain/world.md#kura-storage).

### Kagami (מורה, דוגמה ו/או מראה) {#kagami-teacher-and-exemplar-and-or-looking-glass}

מחולל לנתונים נפוצים. הוא יכול ליצור זוגות מפתחות קריפטוגרפיים, בלוקי Genesis, תיעוד ועוד.

### עץ Merkle (עץ גיבוב) {#merkle-tree-hash-tree}

מבנה נתונים המשמש לאימות המצב בכל גובה בלוק. המימוש הנוכחי של Iroha הוא עץ בינארי. לפרטים נוספים ראו [ויקיפדיה](https://en.wikipedia.org/wiki/Merkle_tree).

### חוזים חכמים {#smart-contracts}

חוזים חכמים הם תוכניות מבוססות blockchain הפועלות כאשר מתקיימת קבוצת תנאים מסוימת. ב־Iroha חוזים חכמים ממומשים באמצעות [הוראות הליבה המיוחדות של Iroha](#core-iroha-special-instructions).

### טריגרים {#triggers}

סוג אירוע המאפשר להפעיל הוראה מיוחדת של Iroha בעת commit של בלוק מסוים, בזמן מסוים, בכפוף לכמה הסתייגויות, ועוד. מידע נוסף על טריגרים זמין [כאן](/he/blockchain/triggers.md).

### ניהול גרסאות {#versioning}

כל בקשה מסומנת בגרסת ה־API שאליה היא שייכת. כך גרסאות בינאריות שונות של תוכנת לקוח/עמית של Iroha יכולות לפעול זו עם זו, ואפשר לשדרג תוכנה ברשת Iroha.

### Hijiri (מערכת המוניטין של עמיתים) {#hijiri-peer-reputation-system}

מערכת המוניטין של Iroha. היא מאפשרת להעדיף תקשורת עם [עמיתים](#peer) בעלי היסטוריה טובה ולהפחית את הנזק שעלולים לגרום [עמיתים](#peer) זדוניים.

## מודולי Iroha {#iroha-modules}

הרחבות צד שלישי ל־Iroha המספקות פונקציונליות מותאמת אישית.

## הוראות מיוחדות של Iroha ‏(ISI) {#iroha-special-instructions-isi}

ספרייה של חוזים חכמים המסופקת עם Iroha. אפשר להפעיל אותם באמצעות עסקאות או מאזיני אירועים רשומים. מידע נוסף על ISI זמין [כאן](/he/blockchain/instructions.md).

#### הוראות מיוחדות מסייעות של Iroha {#utility-iroha-special-instructions}

קבוצה זו של [ISI](#iroha-special-instructions-isi) כוללת הוראות לוגיות כגון `If`, הוראות I/O כגון `Notify` והרכבות כגון `Sequence`. הן משמשות בעיקר בתוך [הוראות מותאמות אישית](#custom-iroha-special-instruction).

### הוראות מיוחדות ליבה של Iroha {#core-iroha-special-instructions}

[הוראות מיוחדות](#iroha-special-instructions-isi) המסופקות בכל פריסת Iroha. הן כוללות הוראות [תלויות־תחום](#domain-specific-iroha-special-instructions) וכן [הוראות מסייעות](#utility-iroha-special-instructions).

### הוראות מיוחדות תלויות־תחום של Iroha {#domain-specific-iroha-special-instructions}

הוראות הקשורות לפעילויות תלויות־תחום: נכסים, חשבונות, domains וניהול peers. הן מספקות את הכלים הדרושים לשינוי [תצוגת מצב העולם](#world-state-view-wsv) באופן מאובטח ובטוח.

### הוראה מיוחדת מותאמת אישית של Iroha {#custom-iroha-special-instruction}

הוראות המסופקות ב[מודולי Iroha](#iroha-modules) בידי לקוחות או צדדים שלישיים. אפשר לבנות אותן רק באמצעות [הוראות הליבה](#core-iroha-special-instructions). לא מומלץ לבצע fork ולשנות את קוד המקור של Iroha: הוראות מיוחדות שלא הוסכמו בידי [העמיתים](#peer) בפריסת Iroha ייחשבו לתקלות, ולכן גישתם של [עמיתים](#peer) המריצים מופע ששונה תבוטל.

## שאילתת Iroha {#iroha-query}

בקשה לקרוא את תצוגת מצב העולם בלי לשנות אותה. מידע נוסף על שאילתות זמין [כאן](/he/blockchain/queries.md).

## החלפת תצוגה {#view-change}

תהליך המתרחש כאשר ניסיון להגיע לקונצנזוס נכשל. בדרך כלל הוא כולל בחירת [מנהיג](#leader) חדש.

## תצוגת מצב העולם (WSV) {#world-state-view-wsv}

ייצוג בזיכרון של מצב ה־blockchain הנוכחי. ה־WSV מכיל את `World`, גיבובים של בלוקים שעברו commit, אינדקסי עסקאות, טופולוגיית קונצנזוס ואינדקסים נגזרים המשמשים שאילתות. הוא מתעדכן רק באמצעות בלוקים שעברו commit, ואפשר לבנות אותו מחדש מתוך [Kura](#kura-warehouse). ראו [תצוגת מצב העולם](/he/blockchain/world.md#world-state-view-wsv).

## מנהיג {#leader}

ברשת Iroha נבחר צומת עמית באקראי ומקבל הרשאה מיוחדת ליצור את הבלוק הבא. ברשתות המשיגות [עמידות לתקלות ביזנטיות](#byzantine-fault-tolerance-bft), אפשר לבטל הרשאה זו באמצעות [שינוי תצוגה](#view-change).
