---
translation_locale: he
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# אירועים {#events}

אירועים נחשפים כאשר דברים מסוימים מתרחשים בתוך blockchain, למשל
חשבון חדש נוצר או בלוק נחויב. ישנם סוגים שונים
של אירועים:

- אירועי צינור
- אירועים נתונים
- אירועים בזמן
- תפעיל אירועים ביצוע

## אירועי צינור {#pipeline-events}

אירועי צינור משוחררים כאשר עסקים מועברים, מבצעים או
מאורע של צינור מכיל את המידע הבא:
סוג של יחידה שגרמה אירוע (המעשה או הבלוק), ההש שלה
והסטטוס. `Validating` (העמימות מתמשכת),
`Rejected`, או `Committed`. אם יחידה נדחה, הסיבה
דחייה מסופקת.

### נסה את זה. Taira {#try-it-on-taira}

בדוק אם זרם אירועים של צינור ציבורי מתוכנן:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

לצילום מהיר אתה יכול לבחון בלי לשמור על זרם פתוח, לקרוא לאחרונה
עסקאות חוקר:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

פתח את SSE מסלול בטרמינל כאשר אתה צריך אירועים חי:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

אם לא נשלח שום עסקאות בזמן שהזרם פתוח, הפקודה יכולה להישאר
שקט למרות שהדרך בריאה.

## אירועים נתונים {#data-events}

אירועים נתונים יוצרים כאשר יש שינוי הקשור לנתונים
כמו שווים, תחומים, חשבונות, נכסים, הגדרות נכסים, NFTs, תפעילים,
תפקידים, קונפיגירציה על שרשרת, מצב המבצע, ראיות, נכסים סודיים,
גשרים, או SORA/Nexus-אובייקטים ספציפיים.
[פילטר אירועי נתונים](./filters.md#data-event-filters).

## אירועים בזמן {#time-events}

אירועי הזמן משדרים כאשר התפיסה על המצב העולמי מוכנה להתמודד
[תפעילים זמן](./triggers.md#time-triggers).

## אירועי ההוצאה להורג {#trigger-execution-events}

אירועי ביצוע ההפעלה המניע יוצרים כאשר
[`ExecuteTrigger`](./instructions.md#executetrigger) ההוראה
אירועים של סיום ההדק נחשפים לאחר פעולה ההדק
מסתיים.
