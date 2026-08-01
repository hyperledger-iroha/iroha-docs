---
translation_locale: he
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# אירועים {#events}

אירועים יוצרים כאשר דברים מסוימים מתרחשים בתוך blockchain, למשל חשבון חדש נוצר או בלוק נחויב. ישנם סוגים שונים של אירועים:

- אירועי צינור
- אירועי נתונים
- אירועים בזמן
- תפעיל אירועים ביצועים

## אירועי צינור {#pipeline-events}

אירועי צינור משוחררים כאשר עסקים מועברים, מבצעים או מחויבים לבלאק. אירועי הצינור מכילים את המידע הבא: סוג האנטיטי שגרמה לאירוע (עסקה או בלוק), ה-hash שלו ומצבו. הסטטוס יכול להיות `Validating` (עובדה בתהליך), `Rejected`, או `Committed`. אם יחידה נדחה, יש להציג את הסיבה לדחות.

### נסה את זה על Taira {#try-it-on-taira}

בדוק אם הזרם של אירועי צינור ציבורי מונע:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

כדי לקבל תמונה שנייה שתוכלו לבדוק מבלי לשמור על זרם פתוח, קראו את העסקאות האחרונות של חוקרים:

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

אירועי נתונים יוצרים כאשר מתרחשים שינויים הקשורים לנתונים של הספרים הגדולים כגון עמיתים, דומנים, חשבונות, נכסים, הגדרות נכסים, NFTs, תפעילים, תפקידים, קונפיגורת שרשרת, מצב המבצע, הוכחות, נכסים סודיים, גשרים או אובייקטים ספציפיים של SORA/Nexus. סוגים אלה של אירועים משמשים ב-filters [ של אירועי נתונים ](./filters.md#data-event-filters).

## אירועים בזמן {#time-events}

אירועים בזמן נחשפים כאשר תצפית המצב העולמי מוכנה להתמודד עם גורמים מפעילים זמן [ ](./triggers.md#time-triggers).

## אירועים להוציא לפועל {#trigger-execution-events}

אירועי ביצוע התניע יוצרים כאשר ההוראה [`ExecuteTrigger`](./instructions.md#executetrigger) מבוצעת. אירועים של השלמת התניע מוצרים לאחר פעלת התניע מסיימת.
