---
translation_locale: he
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# זרם אירועים {#stream-events}

## תוצאה {#outcome}

צרכו אירועים חיים משרשרת העיבוד של Taira באמצעות אירועים שנשלחים מהשרת (SSE), התחברו מחדש עם השהיות הולכות וגדלות ומוגבלות, ורעננו את המצב השמור לאחר פתיחת הזרם החלופי. מכיוון שלנקודת הקצה אין סמן לשחזור אירועים, התייחסו לאירועים כהתראות ולא כהיסטוריה מלאה.

## תנאים מוקדמים {#prerequisites}

- `curl` לבדיקת תקינות בסיסית של הממשק הציבורי.
- Node.js 24 עבור הצרכן של JavaScript.
- לא נדרש חותם. `https://taira.sora.org/v1/events/sse` הוא זרם ציבורי לקריאה בלבד; מתכון זה אינו מבצע כתיבות ב־Minamoto או ב־Taira.

## שלבים {#steps}

### 1. אמתו את תגובת ה־SSE {#_1-confirm-the-sse-response}

בקשו את זרם האירועים עם חלופת JSON: Torii מזרים `text/event-stream` ומדווח על בקשה שנדחתה, למשל מסנן לא תקין, כשגיאת JSON. השביתו את אגירת הפלט של curl. הפקודה מסתיימת לאחר 20 שניות. Torii שולח הערת heartbeat לאחר 15 שניות ללא פעילות, ולכן קבלת הערות heartbeat בלבד במהלך תקופה שקטה היא תקינה.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

אל תשלחו `Last-Event-ID`. נקודת הקצה של SSE ב־Torii מפיצה זרם חי למנויים, והיא אינה יומן לשחזור אירועים ודוחה בקשות שחזור.

### 2. הוסיפו צרכן JavaScript עם סינון {#_2-add-a-filtered-javascript-consumer}

שמרו את הקוד הבא בשם `stream-taira.mjs`. הוא משתמש ישירות ב־Fetch כדי להציג את פורמט התעבורה ברשת. פרמטר השאילתה `filter` משתמש בדקדוק מסנני הטקסט של Torii כדי לבחור אירועי עסקה מאושרים, והמנתח צורך מסגרות SSE ללא סמן replay.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = 'tx_status = "Approved"'

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?limit=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', filter)
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

הריצו אותו עד שלפחות עסקה אחת מגיעה למצב `Approved` ב־Taira:

```bash
node ./stream-taira.mjs
```

הערות פעימת לב של SSE משאירות חיבורים שקטים פתוחים, אך אינן קובעות את הסדר בפנקס. השתמשו בגובהי בלוקים, בגיבובי עסקאות ובשאילתות על הפנקס כאשר הסדר או השלמות חשובים.

בקשת הסייר ל־25 הפריטים האחרונים היא כלי אבחון ציבורי בלבד. צרכן ייצור חייב להחליף או להרחיב את `reconcile()` בשאילתות על משאבי היישום השמורים שלו ובטווח התאוששות המספיק לנקודת הביקורת שלו. תמונת המצב המוגבלת לבדה אינה מוכיחה שלא הוחמצו אירועים.

`ToriiClient.streamEvents({ filter })` מתוך `@iroha/iroha-js` קורא את אותו זרם: העבירו `field('tx_status').eq('Approved')` או את מסנן הטקסט שלמעלה. הוא מחזיר את מסגרת הסיום `stream_error` לפני שהזרם מסתיים, ולכן כללי החיבור מחדש והתאמת המצב שלמעלה עדיין חלים.

## אימות {#verify}

בטרמינל אחד, הפעילו את צרכן ה-JavaScript. בטרמינל אחר, קראו את תמונת המצב הציבורית של העסקאות:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

לכל אירוע עסקה שמעניין אתכם, אתרו את גיבובו בתמונת המצב או בצעו עליו שאילתה ישירה. הדף המוגבל עשוי לא לכלול עסקאות ישנות יותר. לאחר מכן עצרו והפעילו מחדש את הצרכן: עליו להתחבר מחדש ללא מזהה אירוע, ולהדפיס אבחון עדכני לאחר פתיחת הזרם החלופי.

## פתרון בעיות {#troubleshooting}

- חיבור המקבל הערות פעימת לב אך ללא אירועי נתונים הוא תקין; ייתכן שפשוט אין פעילות במצב שרשרת העיבוד שנבחר.
- `400` עם הקוד `invalid_filter` פירושו שה־`filter` אינו בדקדוק הטקסט של Torii או שהוא מציין שדה שזרמי אירועים אינם תומכים בו. זרמי אירועים מסננים לפי `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` ו־`proof_envelope_hash`.
- אירוע `stream_error` מציין שהשרת זיהה עיכוב או מצב סיום אחר של הזרם. Torii שולח את האירוע הזה פעם אחת וסוגר את הזרם; פתחו זרם חלופי, ולאחר מכן בצעו התאמת מצב.
- שרת מתווך יכול לאגור SSE גם כש־Torii אינו עושה זאת. השביתו אגירת תגובות ודחיסה בשרת המתווך, ושמרו על `curl -N` בפקודות האבחון.
- לעולם אל תשחזרו פער שנוצר עקב ניתוק בהנחה שהאירוע הבא מגיע מיד אחרי הקודם. לנקודת הקצה אין סמן לשחזור; בצעו במקום זאת שאילתה על המצב הנוכחי של הפנקס.

## מקור ותיעוד קשור {#source-and-related-docs}

- [מתכון הזרמת אירועים ב־JavaScript בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [בדיקות אינטגרציה של SSE בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [דקדוק הטקסט של מסנני Torii ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [ניתוב האירועים ב־Torii בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [אירועים](/he/blockchain/events.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [שאילתת מצב ספר החשבונות](./query-ledger-state.md)
