---
translation_locale: ar
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# أحداث البث {#stream-events}

## نتيجة {#outcome}

استهلك أحداث سير عمل معالجة البرامج Taira الحية عبر أحداث مرسلة من الخادم (SSE)، أعد الاتصال مع تراجع محدود، وقم بتحديث الحالة الدائمة بعد فتح تدفق الاستبدال. لأنه لا توجد مؤشر إعادة تشغيل لنقطة نهاية API، اعتبر الأحداث كإشعارات بدلاً من تاريخ كامل.

## المتطلبات الأساسية {#prerequisites}

- `curl` لاختبار دخان عام.
- Node.js 24 للمستهلك JavaScript.
- لا يلزم وجود موقع تشفير. `https://taira.sora.org/v1/events/sse` هو تدفق عام للقراءة فقط؛ هذه الوصفة لا تقوم بأي عمليات كتابة لـ Minamoto أو Taira.

## خطوات {#steps}

### 1. تأكيد الاستجابة SSE {#_1-confirm-the-sse-response}

Taira يتفاوض حاليًا على هذا المسار فقط عندما يتضمن رأس `Accept` كل من تدفق الحدث المفضل وبديل JSON. قم بإلغاء تخزين curl. ينتهي الأمر بعد 15 ثانية؛ استقبال تعليقات القلب النابض فقط خلال فترة هادئة يعتبر صحيحًا.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

لا ترسل `Last-Event-ID`. Torii’s SSE API النقطة النهائية هي تدفق مباشر متعدد الاتجاهات، وليست سجل إعادة تشغيل، وترفض طلبات إعادة التشغيل.

### 2. أضف مستهلك JavaScript مُصفّى {#_2-add-a-filtered-javascript-consumer}

احفظ ما يلي باسم `stream-taira.mjs`. إنه يستخدم Fetch مباشرة بحيث يمكن للطلب إرسال رأس `Accept` المختلط المطلوب من Taira. يختار `FilterExpr` الحالي أحداث المعاملات المعتمدة، ويستهلك المحلل إطارات SSE بدون مؤشر إعادة التشغيل.

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

استمر في تشغيله حتى تصل معاملة واحدة على الأقل إلى `Approved` في Taira:

```bash
node ./stream-taira.mjs
```

SSE تعليقات نبضات القلب تبقي الاتصالات الخاملة على قيد الحياة لكنها لا تؤسس ترتيب دفتر الأستاذ للبلوكتشين. استخدم ارتفاعات الكتل، وهاشات التشفير للمعاملات، واستعلامات دفتر الأستاذ للبلوكتشين عندما يكون الترتيب أو الاكتمال مهمًا.

طلب المستكشف الأحدث-25 هو مجرد تشخيص عام. يجب على المستهلك الإنتاجي استبدال أو توسيع `reconcile()` باستعلامات لموارده التطبيقية الدائمة وحدود الاسترداد الكافية لنقطة التحقق الخاصة به. عرض البيانات المحدد لنقطة زمنية معينة بمفرده لا يمكن أن يثبت أنه لم يتم تفويت أي أحداث.

في نسخة الشيفرة المصدرية المثبتة، يرسل `ToriiClient.streamEvents()` فقط `Accept: text/event-stream`؛ يرفض Taira المباشر ذلك العنوان الفرعي الأضيق باستخدام `406`. استخدم نموذج Fetch الخام أعلاه حتى تتفاوض SDK و API العامة على نفس أنواع الوسائط.

## تحقق {#verify}

في طرفية واحدة، شغّل المستهلك JavaScript. في أخرى، اقرأ عرض بيانات النقطة الزمنية للمعاملات العامة:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

لكل حدث معاملة تهتم به، حدد تجزئته التشفيرية في عرض البيانات عند نقطة زمنية محددة أو استعلم عنها مباشرة. يمكن للصفحة المحدودة أن تتجاهل المعاملات الأقدم. ثم توقف وأعد تشغيل المستهلك: يجب أن يعيد الاتصال دون توفير معرف حدث ويجب أن يطبع تشخيصًا جديدًا بعد فتح تدفق الاستبدال.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- الاتصال مع تعليقات نبض القلب ولكن بدون أحداث بيانات صحي؛ قد يكون وضع سير عمل معالجة البرنامج المحدد هادئًا ببساطة.
- `406 Not Acceptable` على الهواء Taira عادةً يعني أن الطلب المعلن كان فقط `text/event-stream`. أرسل `text/event-stream, application/json` بالضبط كما هو موضح أعلاه.
- يشير حدث `stream_error` إلى أن الخادم اكتشف تأخراً أو حالة أخرى في تدفق الطرف. يقوم Torii بإرسال هذا الحدث مرة واحدة ويغلق التدفق؛ يجب التسوية قبل إعادة الاتصال.
- يمكن للوكيل تخزين مؤقت لـ SSE حتى عندما لا يقوم Torii بذلك. قم بإيقاف تخزين الاستجابة المؤقت وضغطها في الوكيل، وحافظ على `curl -N` في التشخيصات.
- لا تملأ فجوة الانفصال أبداً بافتراض أن الحدث التالي يتبع الحدث السابق. لا يمتلك الطرف النهائي API مؤشر إعادة التشغيل؛ بدلاً من ذلك، استعلم عن حالة دفتر الحسابات الحالي في البلوكشين.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [JavaScript بث الوصفة في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE اختبارات التكامل عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr محلّل الأكواد في نسخة رمز المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii توجيه الحدث عند مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [الأحداث](/ar/blockchain/events.md)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md)
- [استعلام حالة دفتر الحسابات في البلوكشين](./query-ledger-state.md)
