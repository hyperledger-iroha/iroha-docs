---
translation_locale: he
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# אירועים {#events}

אירועים יוצרים כאשר דברים מסוימים מתרחשים בתוך blockchain, למשל חשבון חדש נוצר או בלוק נחויב. ישנם סוגים שונים של אירועים:

- אירועי שרשרת עיבוד העיבוד
- אירועי נתונים
- אירועים בזמן
- אירועי ביצוע טריגר

## אירועי שרשרת עיבוד העיבוד {#pipeline-events}

אירועי שרשרת עיבוד העיבוד נפלטים כאשר עסקאות נשלחות, מתבצעות או נרשמות בבלוק. אירוע כזה מכיל את סוג הישות שגרמה לאירוע (עסקה או בלוק), את ה־hash שלה ואת מצבה. המצב יכול להיות `Validating` (האימות מתבצע), `Rejected` או `Committed`. אם הישות נדחתה, מצורפת גם סיבת הדחייה.

### נסה את זה על Taira {#try-it-on-taira}

בדקו שזרם אירועי שרשרת עיבוד העיבוד הציבורי מחובר:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

כדי לקבל תמונת מצב שתוכלו לבדוק מבלי לשמור על זרם פתוח, קראו את העסקאות האחרונות של חוקרים:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

פתח את מסלול SSE בטרמינל כאשר אתה צריך אירועי חי:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

אם לא נשלח שום עסקאות בזמן שהזרם פתוח, הפקודה יכולה להישאר בשקט גם אם המסלול בריא.

## אירועים נתונים {#data-events}

אירועי נתונים יוצרים כאשר מתרחשים שינויים הקשורים לנתונים של הספרים הגדולים כגון צמתים, דומנים, חשבונות, נכסים, הגדרות נכסים, NFTs, טריגרים, תפקידים, קונפיגורת שרשרת, מצב המבצע, הוכחות, נכסים סודיים, גשרים או אובייקטים ספציפיים של SORA/Nexus. סוגים אלה של אירועים משמשים ב-filters [ של אירועי נתונים ](./filters.md#data-event-filters).

## אירועים בזמן {#time-events}

אירועים בזמן נחשפים כאשר תצפית המצב העולמי מוכנה להתמודד עם גורמים מפעילים זמן [ ](./triggers.md#time-triggers).

## אירועים להוציא לפועל {#trigger-execution-events}

אירועי ביצוע התניע יוצרים כאשר ההוראה [`ExecuteTrigger`](./instructions.md#executetrigger) מבוצעת. אירועים של השלמת התניע מוצרים לאחר פעלת התניע מסיימת.
