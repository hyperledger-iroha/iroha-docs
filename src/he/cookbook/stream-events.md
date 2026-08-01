---
translation_locale: he
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הזרם של אירועים {#stream-events}

## התוצאה {#outcome}

לצרוך אירועי צינור חי Taira מעל אירועים ששלחו על ידי השרת (SSE), להתחבר מחדש עם backup מוגבל, ולהחדש את מצב קבוע לאחר שזרם החלפה פתוחה. מכיוון שבנקודת הסיום אין כורסר חזרה, לטפל באירועים כמו הודעות ולא היסטורית מלאה.

## תנאים מוקדמים {#prerequisites}

- `curl` למבחן עשן ציבורי.
- Node.js 24 עבור הצרכן של JavaScript.
- לא נדרש חותם. `https://taira.sora.org/v1/events/sse` הוא זרם ציבורי, קריאה בלבד; המתכון הזה אינו מבצע שום Minamoto או Taira כתיבים.

## צעדים {#steps}

### 1. אישר את תגובת SSE {#_1-confirm-the-sse-response}

Taira משא ומתן כרגע על מסלול זה רק כאשר הכותרת של `Accept` כוללת את זרם האירועים המועדף על עצמו ואת ההפסקות של JSON. תבטיל את הגדרת ה- curl. הפקודה מסתיימת לאחר 15 שניות; קבלת תגובות בקצב הלב בלבד במהלך תקופה שקטה היא בתוקף .

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

לא לשלוח `Last-Event-ID`. Torii זה... SSE נקודת סוף היא זרם חי של מעריצים, לא רלוג שיחזור, ומסרבת בקשות שיחזור.

### 2. להוסיף צרכן JavaScript מסנן. {#_2-add-a-filtered-javascript-consumer}

שמור את הדברים הבאים כ `stream-taira.mjs`. הוא משתמש ב-Fetch ישירות כדי שהבקשה תוכל לשלוח Taira הוא נדרש מעורב `Accept` כותרת. הזרם `FilterExpr` בוחן את אירועי העסקה המאושרים, והמחקור צורב SSE צבעות ללא כורסור שידור.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = {
  op: 'eq',
  args: ['tx_status', 'Approved'],
}

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?page=1&per_page=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', JSON.stringify(filter))
  const response = await fetch(url, {
    headers: { Accept: 'text/event-stream, application/json' },
    signal: shutdown.signal,
  })
  if (!response.ok) {
    throw new Error(
      `SSE request failed: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  if (
    !response.headers.get('content-type')?.startsWith('text/event-stream')
  ) {
    throw new Error('Taira did not negotiate an event-stream response')
  }
  if (!response.body) throw new Error('SSE response has no body')

  // Establish the replacement stream first. Events that arrive while the
  // durable-state query runs remain buffered on this live response.
  try {
    await reconcile()
  } catch (error) {
    console.error(error)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (!shutdown.signal.aborted) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    for (;;) {
      const boundary = buffer.match(/\r?\n\r?\n/)
      if (!boundary || boundary.index === undefined) break
      const block = buffer.slice(0, boundary.index)
      buffer = buffer.slice(boundary.index + boundary[0].length)

      let event = 'message'
      const dataLines = []
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith(':')) continue
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (line.startsWith('data:'))
          dataLines.push(line.slice(5).trimStart())
      }
      if (dataLines.length === 0) continue
      const rawData = dataLines.join('\n')
      let data
      try {
        data = JSON.parse(rawData)
      } catch {
        data = rawData
      }
      yield { event, data }
    }
  }
}

async function follow() {
  let backoffMs = 250

  while (!shutdown.signal.aborted) {
    try {
      for await (const event of streamOnce()) {
        if (event.event === 'stream_error') {
          throw new Error(
            `server closed stream: ${JSON.stringify(event.data)}`,
          )
        }

        console.log(event)
        backoffMs = 250
      }
    } catch (error) {
      if (shutdown.signal.aborted) break
      console.error(error)
    }

    // The disconnected interval cannot be replayed. Back off, then establish
    // a new stream; streamOnce refreshes state after the response is open.
    await delay(backoffMs)
    backoffMs = Math.min(backoffMs * 2, 10_000)
  }
}

await follow()
```

להפעיל אותו עד שמסחר אחד לפחות יגיע `Approved` על Taira:

```bash
node ./stream-taira.mjs
```

SSE תגובות דופק הלב לשמור על חיבורים חסרי תועלת בחיים, אבל לא לקבוע סדר של ספריה. להשתמש גובה בלוק, השיס העסקאות, ושאלות ספריה כאשר הסדר או השלמות חשובים.

בקשה האחרונה של 25 חוקרים היא רק אבחון ציבורי. צרכן ייצור חייב להחליף או להרחיב `reconcile()` עם חקירות עבור משאבי היישום המתמשכים שלו וקבילת התאוששות גדולה מספיק עבור נקודת הביקור שלה. תמונת הזריקה המוגבלת לבדה לא יכולה להוכיח כי אף אירוע לא נעלמה.

ב-Pinned commit, `ToriiClient.streamEvents()` שולח רק `Accept: text/event-stream`; חי Taira דוחה את הכותרת הנמוכה יותר עם `406`. השתמש בצילום Fetch הגורם למעלה עד ש SDK והנקודת סוף ציבורית יוועדו על אותם סוגים של מדיה.

## לאמת {#verify}

בטרמינל אחד, להפעיל את הצרכן JavaScript.

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

עבור כל אירוע עסקאות שאתה מעוניין בו, למצוא את האש שלה בתצלום או לשאול אותו ישירות. ולהתחיל מחדש את הצרכן: הוא חייב להתחבר שוב מבלי לספק אירוע ID ולדפיס אבחון חדש לאחר שזרימת החלפה נפתחה.

## פתרון בעיות {#troubleshooting}

- קישור עם הערות של דופק הלב אבל אין אירועים נתונים הוא בריא; מצב הצינור הנבחר עשוי פשוט להיות שקט.
- `406 Not Acceptable` בשידור חי Taira פירושו בדרך כלל את בקשה המפורסמת רק `text/event-stream`. לשלוח `text/event-stream, application/json` בדיוק כפי שנראה למעלה.
- אירוע `stream_error` מצביע על כך שהשרת זיהה עיכוב או מצב זרם טרמינל אחר. Torii שולח את האירוע הזה פעם אחת ומסגר את הזרם; מקושר לפני חיבור מחדש.
- פרוקסי יכול להזיז את SSE גם כאשר Torii לא. תבטל את ההזיזת והתחפיסה של התגובה בפרוקסי, ותשמור על `curl -N` בדיאгностиקה.
- לעולם אל תמלא פער בהפסקת חיבור על ידי הנחה כי האירוע הבא עוקב אחרי הקודם. בנקודת הסיום אין קורסר שיחזור; במקום זאת, תשאלו את מצב הספר הגדול הנוכחי.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [JavaScript טקסט זרימה ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [ניסויים של אינטגרציה SSE בביצוע ההתחייבויות הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [המנתח Torii FilterExpr בקיומו הוסתר](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [סיבוב אירוע Torii ב- commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [אירועים](/he/blockchain/events.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [מצב ספריה המשאלות](./query-ledger-state.md)
