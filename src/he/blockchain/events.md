---
translation_locale: he
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# אירועים {#events}

אירועים יוצרים כאשר דברים מסוימים מתרחשים בתוך blockchain, למשל חשבון חדש נוצר או בלוק נחויב. ישנם סוגים שונים של אירועים:

- אירועי שרשרת עיבוד העיבוד
- אירועי נתונים
- אירועים בזמן
- אירועי ביצוע טריגר

## אירועי שרשרת עיבוד העיבוד {#pipeline-events}

אירועי שרשרת העיבוד נפלטים ככל שעסקאות ובלוקים מתקדמים בשרשרת העיבוד. אירוע עסקה נושא את גיבוב העסקה, את גובה הבלוק, את מזהי הנתיב ומרחב הנתונים ואת המצב: `Queued`, `Expired`, `Approved` או `Rejected` יחד עם סיבת הדחייה. אירוע בלוק נושא את כותרת הבלוק ואת המצב: `Created`, `Approved`, `Rejected` יחד עם הסיבה, `Committed` או `Applied`.

### נסה את זה על Taira {#try-it-on-taira}

בדקו שזרם אירועי שרשרת עיבוד העיבוד הציבורי מחובר:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

כדי לקבל תמונת מצב שתוכלו לבדוק מבלי לשמור על זרם פתוח, קראו את העסקאות האחרונות של חוקרים:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

פתח את מסלול SSE בטרמינל כאשר אתה צריך אירועי חי:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

אם לא נשלח שום עסקאות בזמן שהזרם פתוח, הפקודה יכולה להישאר בשקט גם אם המסלול בריא.

## אירועים נתונים {#data-events}

אירועי נתונים יוצרים כאשר מתרחשים שינויים הקשורים לנתונים של הספרים הגדולים כגון צמתים, דומנים, חשבונות, נכסים, הגדרות נכסים, NFTs, טריגרים, תפקידים, קונפיגורת שרשרת, מצב המבצע, הוכחות, נכסים סודיים, גשרים או אובייקטים ספציפיים של SORA Nexus. סוגים אלה של אירועים משמשים ב-filters [ של אירועי נתונים ](./filters.md#data-event-filters).

## אירועים בזמן {#time-events}

אירועי זמן נפלטים כאשר תצוגת מצב המערכת מוכנה לטפל ב[טריגרים מבוססי זמן](./triggers.md#time-triggers).

## אירועים להוציא לפועל {#trigger-execution-events}

אירועי ביצוע התניע יוצרים כאשר ההוראה [`ExecuteTrigger`](./instructions.md#executetrigger) מבוצעת. אירועים של השלמת התניע מוצרים לאחר פעלת התניע מסיימת.
