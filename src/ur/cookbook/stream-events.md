---
translation_locale: ur
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# سلسلہ وار واقعات {#stream-events}

## نتیجہ {#outcome}

سرور سے بھیجے گئے واقعات (SSE) پر براہ راست Taira پائپ لائن ایونٹس کا استعمال کریں ، محدود بیک اپ کے ساتھ دوبارہ رابطہ قائم کریں ، اور متبادل سلسلہ کھولنے کے بعد دیرپا حالت کو تازہ کریں۔ چونکہ اینڈ پوائنٹ میں کوئی ری پلے کرسر نہیں ہے ، لہذا ایونٹس کو مکمل تاریخ کی بجائے اطلاعات کے طور پر دیکھیں۔

## لازمی شرائط {#prerequisites}

- `curl` ایک عوامی دھواں ٹیسٹ کے لئے.
- Node.js 24 کے لئے JavaScript صارف.
- کوئی دستخط کرنے کی ضرورت نہیں ہے۔ `https://taira.sora.org/v1/events/sse` ایک عوامی ، صرف پڑھنے والا سلسلہ ہے۔ یہ نسخہ کسی بھی طرح کا Minamoto یا Taira لکھتا ہے.

## قدم {#steps}

### SSE ردعمل کی تصدیق کریں۔ {#_1-confirm-the-sse-response}

Taira فی الحال اس راستے پر صرف اس وقت بات چیت کرتا ہے جب `Accept` ہیڈر میں ترجیحی ایونٹ اسٹریم اور JSON فال بیک دونوں شامل ہوں۔ curl بفرنگ کو غیر فعال کریں۔ کمانڈ 15 سیکنڈ کے بعد ختم ہوجاتی ہے۔ خاموش مدت کے دوران صرف دل کی دھڑکن کے تبصرے موزوں ہیں۔

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

نہ بھیجیں `Last-Event-ID`. Torii میں ہوں SSE endpoint ایک لائیو فین آؤٹ سٹریم ہے، ری پلے لاگ نہیں، اور ری پلے کی درخواستوں کو مسترد کرتا ہے.

### ایک فلٹرڈ JavaScript صارفین کو شامل کریں. {#_2-add-a-filtered-javascript-consumer}

مندرجہ ذیل کو `stream-taira.mjs` کے طور پر محفوظ کریں۔ یہ براہ راست Fetch کا استعمال کرتا ہے تاکہ درخواست Taira کی مطلوبہ مخلوط `Accept` ہیڈر بھیج سکے۔ موجودہ `FilterExpr` منظور شدہ ٹرانزیکشن ایونٹس کا انتخاب کرتا ہے ، اور تجزیہ کار ایک ری پلے کرسر کے بغیر SSE فریم استعمال کرتا ہے۔

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

Taira پر کم از کم ایک لین دین `Approved` تک پہنچنے تک اسے چلائیں۔

```bash
node ./stream-taira.mjs
```

SSE دل کی دھڑکن کے تبصرے غیر فعال کنکشن کو زندہ رکھتے ہیں لیکن لیجر آرڈرنگ قائم نہیں کرتے ہیں۔ جب حکم یا مکملیت کا معاملہ ہوتا ہے تو بلاک اونچائیوں ، ٹرانزیکشن ہیشز اور لیجر کے سوالات کا استعمال کریں۔

تازہ ترین 25 ایکسپلورر کی درخواست صرف عوامی تشخیص ہے۔ ایک پروڈکشن صارف کو `reconcile()` کو اپنی پائیدار ایپلیکیشن وسائل کے لئے استفسارات اور اس کے چیک پوائنٹ کے لئے کافی بڑی بازیابی کا پابند کرکے تبدیل یا بڑھانا ہوگا۔ محدود سنیپ شاٹ اکیلے ہی یہ ثابت نہیں کرسکتا ہے کہ کوئی واقعہ غائب نہیں ہوا۔

منسلک کمیٹ پر ، `ToriiClient.streamEvents()` صرف `Accept: text/event-stream` بھیجتا ہے۔ لائیو Taira اس تنگ ہیڈر کو `406` کے ساتھ مسترد کرتا ہے۔ اوپر خام Fetch فارم کا استعمال کریں جب تک کہ SDK اور عوامی اختتامی نقطہ ایک ہی میڈیا کی اقسام پر بات چیت نہ کرے۔

## تصدیق کریں {#verify}

ایک ٹرمینل میں، JavaScript صارف کو چلائیں۔ دوسرے میں، عوامی لین دین کا سنیپ شاٹ پڑھیں:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

ہر ٹرانزیکشن ایونٹ کے لئے آپ کو پرواہ ہے، اس کی ہیش شاٹ میں تلاش کریں یا اسے براہ راست استفسار کریں. حد بندی والے صفحے پرانے ٹرانزیکشنز کو خارج کر سکتے ہیں. پھر روک اور صارفین کو دوبارہ شروع کریں: اسے واقعہ ID کی فراہمی کے بغیر دوبارہ رابطہ کرنا ہوگا اور متبادل سلسلہ کھولنے کے بعد ایک نیا تشخیصی اشاعت شائع کرنا ہوگی۔

## خرابی کا سراغ لگانا {#troubleshooting}

- دل کی دھڑکن تبصرے کے ساتھ ایک کنکشن لیکن کوئی ڈیٹا واقعات صحت مند ہے؛ منتخب پائپ لائن کی حیثیت صرف خاموش ہو سکتا ہے.
- `406 Not Acceptable` پر براہ راست Taira عام طور پر صرف اشتہار کی درخواست کا مطلب ہے `text/event-stream`. اوپر دکھایا گیا بالکل اسی طرح `text/event-stream, application/json` بھیجیں۔
- `stream_error` واقعہ اس بات کی نشاندہی کرتا ہے کہ سرور نے تاخیر کا پتہ لگایا یا ایک اور ٹرمینل اسٹریم حالت۔ Torii اس واقعے کو ایک بار بھیجتا ہے اور سٹریم بند کر دیتا ہے۔ دوبارہ منسلک کرنے سے پہلے مطابقت پذیر کریں۔
- ایک پراکسی SSE کو بفر کر سکتا ہے یہاں تک کہ جب Torii نہیں کرتا ہے۔ پراکسی میں ردعمل کی بفرنگ اور کمپریشن کو غیر فعال کریں ، اور تشخیص میں `curl -N` کو برقرار رکھیں۔
- کبھی بھی اگلا واقعہ پچھلے واقعے کے بعد ہونے کا اندازہ لگا کر ڈس کنکشن خلا کو نہ پُر کریں۔ اینڈپوائنٹ میں کوئی ری پلے کرسر نہیں ہے۔ اس کے بجائے موجودہ لیجر کی حیثیت سے استفسار کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [JavaScript پنڈل commit پر سٹریمنگ ہدایت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE پنڈ commit پر انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr پینڈ کمیٹ پر تجزیہ کار](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii پنڈ commit پر واقعہ روٹنگ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [واقعات](/ur/blockchain/events.md)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
- [استفسار لیجر کی حالت](./query-ledger-state.md)
