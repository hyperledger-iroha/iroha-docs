---
translation_locale: ar
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# أحداث التدفق {#stream-events}

## النتيجة {#outcome}

استهلاك أحداث خط أنابيب Taira على الهواء البيئي عبر الأحداث المرسلة من الخادم (SSE) ، وإعادة الاتصال مع الاحتفاظ بالخلف المحدود، وتحديث الحالة الدائمة بعد فتح تيار الاستبدال. نظرًا لأن نقطة النهاية لا تحتوي على مؤشر إعادة تشغيل، تعامل الأحداث كإشعارات بدلاً من تاريخ كامل.

## الشروط المسبقة {#prerequisites}

- `curl` لاختبار الدخان العام.
- Node.js 24 بالنسبة لمستهلك JavaScript.
- لا يلزم التوقيع. `https://taira.sora.org/v1/events/sse` هو سلسلة عامة، القراءة فقط؛ هذه الوصفة لا تقوم بتنفيذ أي Minamoto أو Taira الكتابات.

## الخطوات {#steps}

### 1 - تأكيد استجابة SSE {#_1-confirm-the-sse-response}

Taira في الوقت الحالي يتفاوض على هذه المسار فقط عندما `Accept` يحتوي الرأس على كل من سلسلة الأحداث المفضلة و JSON التراجع، تعطيل curl القيادة تنتهي بعد 15 ثانية؛ تتلقى فقط تعليقات نبضات القلب خلال فترة هادئة صالحة.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

لا ترسل `Last-Event-ID`. Torii- نعم . SSE النقطة النهائية هي تدفق المروحة المباشرة، وليس سجل إعادة التشغيل، ورفض طلبات إعادة اللعب.

### إضافة مستهلك مرشح JavaScript {#_2-add-a-filtered-javascript-consumer}

حفظ ما يلي باسم `stream-taira.mjs`. تستخدم Fetch مباشرة حتى يتمكن الطلب من إرسال عنوان `Accept` المختلط المطلوب لـ Taira. تختار الحالي `FilterExpr` أحداث المعاملة المعتمدة، ويستهلك المحلل الإطارات SSE دون جهاز إعادة التعبير.

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

قم بتشغيله حتى يصل معاملة واحدة على الأقل إلى `Approved` في Taira:

```bash
node ./stream-taira.mjs
```

SSE تعليقات النبضات القلبية تبقي الاتصالات الباطلة على قيد الحياة ولكن لا تثبت ترتيب الكتيب. استخدم ارتفاعات الكتل ، وتحديدات المعاملات ، ومسائل الكتيب عندما يتعلق الأمر بالنظام أو الكمال.

آخر طلب 25 مستكشف هو مجرد تشخيص عام. يجب على المستهلك الإنتاجية استبدال أو تمديد `reconcile()` باستعلامات لموارد التطبيقات المستدامة الخاصة به وتعويض كبير بما فيه الكفاية لنقطة التفتيش الخاصة به. لا يمكن أن تثبت الصورة الفورية المحددة وحدها أنه لم يتم تفوت أي أحداث.

عند الإجراءات المثبتة، `ToriiClient.streamEvents()` يرسل فقط `Accept: text/event-stream`؛ يرفض Taira مباشر هذا العنوان الضيق مع `406`. استخدم نموذج Fetch الخام أعلاه حتى يتفاوض SDK والنقطة النهائية العامة على نفس أنواع الوسائط .

## التحقق {#verify}

في إحدى المحطات، قم بتشغيل المستهلك JavaScript في محطة أخرى، وقراءة لقطة صفقة عامة:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

لكل حدث من المعاملات التي تهتم بها، تحديد تعريفها في اللقطة أو استفساره مباشرة. الصفحة المحدودة يمكن أن تفرغ المعاملات القديمة. ثم توقف وإعادة تشغيل المستهلك: يجب أن يربط مرة أخرى دون توفير حدث ID ويجب طباعة تشخيص جديد بعد فتح سلسلة الاستبدال.

## حل المشاكل {#troubleshooting}

- اتصال مع تعليقات نبض القلب ولكن لا توجد أحداث البيانات صحية؛ قد تكون حالة خط الأنابيب المحدد ببساطة هادئة.
- `406 Not Acceptable` على الهاتف المباشر Taira عادة ما تعني الطلب الذي يتم الإعلان عنه فقط `text/event-stream`. أرسل `text/event-stream, application/json` بالضبط كما هو موضح أعلاه.
- يشير حدث `stream_error` إلى أن الخادم اكتشف تأخراً أو حالة أخرى في التدفق النهائي. يقوم Torii بإرسال هذا الحدث مرة واحدة وإغلاق التدفق؛ استند قبل إعادة الاتصال.
- يمكن أن يقوم بروكسي بتخزين SSE حتى عندما لا يفعل Torii. قم بحل التخزين والضغوط للرد في البروكسي، وابق `curl -N` في التشخيص.
- لا تملأ أبدًا فجوة إزالة الاتصال عن طريق افتراض أن الحدث التالي يتبع الحدث السابق. النقطة النهائية ليس لديها مؤشر إعادة تشغيل ؛ استفسار حالة الكتيب الكبرى الحالية بدلاً من ذلك.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [JavaScript وصفة التدفق على الخطوط المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [اختبارات الاندماج SSE في المشاركة المحمولة ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr المحلل في الالتزام المثبت](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii توجيه الأحداث في الالتزام المتعلق](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [الأحداث](/ar/blockchain/events.md)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
- [حالة السؤال في دفتر التسجيل](./query-ledger-state.md)
