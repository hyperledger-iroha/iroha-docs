---
translation_locale: my
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အဖြစ်အပျက်များကို Stream {#stream-events}

## ရလဒ် {#outcome}

Taira pipeline events ကို server-sent events (SSE) ပေါ်မှာ တိုက်ရိုက်သုံးစွဲခြင်း၊ bounded backoff ဖြင့် ပြန်လည်ဆက်သွယ်ခြင်းနှင့် replacement stream ဖွင့်ပြီးနောက် ရေရှည်တည်တံ့သောအခြေအနေကို refresh လုပ်ခြင်း။ endpoint တွင် replay cursor မရှိတာကြောင့်ဖြစ်ရပ်များကိုအပြည့်အဝသမိုင်းမဟုတ်ဘဲ အသိပေးချက်များအဖြစ် မှတ်ယူပါ။

## လိုအပ်ချက်များ {#prerequisites}

- အများပြည်သူ မီးခိုးစမ်းသပ်မှုအတွက် `curl`.
- Node.js 24 အတွက် JavaScript စားသုံးသူ။
- `https://taira.sora.org/v1/events/sse` သည် အများပြည်သူ၊ ဖတ်နိုင်သော ရေစီးကြောင်းတစ်ခုဖြစ်သည်။ ဤနည်းပြချက်သည် Minamoto သို့မဟုတ် Taira ရေးသားခြင်းမရှိပါ။

## ခြေလှမ်း {#steps}

### 1. SSE တုံ့ပြန်မှုကို အတည်ပြုပါ။ {#_1-confirm-the-sse-response}

Taira သည် `Accept` ခေါင်းစဉ်တွင် အကြိုက်ဆုံးဖြစ်ရပ်စီးကြောင်းနှင့် JSON ကျော့ပြန်မှု နှစ်ခုစလုံးပါဝင်ပါကသာ ယခုလမ်းကြောင်းကို ညှိနှိုင်းသည်။ curl ဘူဖာကိုပိတ်ပါ။ အမိန့်သည် ၁၅ စက္ကန့်အကြာတွင် အဆုံးသတ်သည်; ငြိမ်သက်သောကာလအတွင်း နှလုံးခုန်ချက် မှတ်ချက်များကိုသာ လက်ခံခြင်းသည် သက်ဝင်သည်။

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

မပို့ပါနဲ့ `Last-Event-ID`. Torii ဒါက SSE endpoint က live fan-out stream တစ်ခုဖြစ်ပြီး replay log မဟုတ်ဘဲ replay request တွေကို ပယ်ချပါတယ်။

### 2. filtered JavaScript စားသုံးသူကိုထည့်ပါ။ {#_2-add-a-filtered-javascript-consumer}

အောက်ပါအတိုင်း `stream-taira.mjs` အဖြစ် သိမ်းထားပါ။ ၎င်းသည် Fetch ကို တိုက်ရိုက်အသုံးပြု၍ တောင်းဆိုချက်သည် Taira ၏လိုအပ်သော Mixed `Accept` ခေါင်းစဉ်ကိုပို့နိုင်သည်။ လက်ရှိ `FilterExpr` သည်အတည်ပြုသော ငွေလဲလှယ်မှုဖြစ်ရပ်များကိုရွေးချယ်ပြီး ဆန်းစစ်သူသည် ပြန်လည်ဖြည့်စွက်ခြင်းခလုတ်မရှိဘဲ SSE ဘောင်များကိုသုံးစွဲသည်။

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

Taira တွင် အနည်းဆုံး ငွေပေးချေမှုတစ်ခု `Approved` ကိုရောက်ရှိသည်အထိ ၎င်းကို Run:

```bash
node ./stream-taira.mjs
```

SSE နှလုံးခုန်ချက် မှတ်ချက်တွေက အလွတ်ချိတ်ဆက်မှုတွေကို အသက်ရှင်စေပေမဲ့ Ledger မှာယူမှုကို မတည်ဆောက်ဘူး။ စီစဉ်မှု (သို့) ပြီးပြည့်စုံမှု အရေးပါတဲ့အခါ ဘလော့အမြင့်တွေ၊ ငွေပေးချေမှု ဟက်ရှ်တွေနဲ့ Ledger မေးမြန်းမှုတွေ သုံးပါ။

နောက်ဆုံး ၂၅ စူးစမ်းရှာဖွေသူတောင်းဆိုချက်သည် အများပြည်သူရဲ့ ရောဂါစစ်ဆေးမှုတစ်ခုသာဖြစ်သည်။ ထုတ်ကုန်သုံးစွဲသူသည် `reconcile()` ကို ၎င်း၏ ရေရှည်တည်တံ့သော အသုံးစရိတ်အရင်းအမြစ်များအတွက် မေးမြန်းမှုများနှင့် စစ်ဆေးရေးဂိတ်အတွက် လုံလောက်စွာကြီးမားသော ပြန်လည်ထူထောင်ခြင်းဖြင့် ဖြန့်ဖြူးရန်လိုအပ်သည်။ ကန့်သတ်ထားတဲ့ snapshot တစ်ခုတည်းက မည်သည့်ဖြစ်ရပ်မှ လွတ်မြောက်ခြင်းမရှိကြောင်း သက်သေပြနိုင်ခြင်းမဟုတ်ပါ။

pinned commit မှာ `ToriiClient.streamEvents()` ကသာ `Accept: text/event-stream` ကိုပို့ပေးတယ်။ live Taira ကတော့ `406` နဲ့ ကျဉ်းမြောင်းတဲ့ ခေါင်းစဉ်ကို ပယ်ချပါတယ်။ SDK နှင့် အများပြည်သူအဆုံးသတ်မှတ်ချက်က တူညီတဲ့ မီဒီယာအမျိုးအစားတွေကို ညှိနှိုင်းမချင်း အထက်ပါ raw Fetch ပုံစံကိုအသုံးပြုပါ။

## စစ်ဆေးပါ {#verify}

terminal တစ်ခုမှာ JavaScript သုံးစွဲသူကို run လုပ်ပါ။ နောက်တစ်ခုမှာ အများပြည်သူ ငွေပေးချေမှု snapshot ကိုဖတ်ပါ။

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

သင် ဂရုစိုက်တဲ့ ငွေပေးချေမှုဖြစ်ရပ်တိုင်းအတွက် snapshot မှာ hash ကိုရှာဖွေပါ (သို့) တိုက်ရိုက်မေးမြန်းပါ။ ကန့်သတ်ထားတဲ့ စာမျက်နှာက ပိုမိုဟောင်းသော ငွေလဲလှယ်မှုကို လျစ်လျူရှုနိုင်သည်။ ထို့နောက်ရပ်ပါ။ နောက်ပြီး စားသုံးသူကို ပြန်လည်စတင်ပေးပါက ID အဖြစ်အပျက်တစ်ခု မဖြည့်ဘဲ ပြန်လည်ဆက်သွယ်ရပြီး အစားထိုးစီးကြောင်းဖွင့်ပြီးနောက် ရောဂါစစ်ဆေးမှုအသစ်တစ်ခုကို ပုံနှိပ်ရပါမယ်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- နှလုံးခုန်ချက် မှတ်ချက်တွေနဲ့ ဆက်နွယ်မှုတစ်ခုရှိပေမဲ့ ဒေတာဖြစ်ရပ်တွေမရှိတာ ကျန်းမာတယ်။ ရွေးချယ်ထားတဲ့ pipeline အခြေအနေက တိတ်ဆိတ်နေလောက်တယ်။
- `406 Not Acceptable` တိုက်ရိုက် Taira ပုံမှန်ဆိုလိုတာက ကြော်ငြာထားတဲ့ တောင်းဆိုချက်ကိုပဲ ဆိုလိုတာပါ။ `text/event-stream`. ပို့ပေးပါ။ `text/event-stream, application/json` အထက်က ပြထားသလိုပါပဲ။
- `stream_error` ဖြစ်ရပ်က ဆာဗာက နောက်ဆုတ်မှု (သို့) အခြား terminal stream အခြေအနေတစ်ခုကို ရှာဖွေတွေ့ရှိထားတာကို ညွှန်ပြတယ်။ Torii သည် ဒီအဖြစ်အပျက်ကို တစ်ကြိမ်ပို့ပြီး စီးကြောင်းကိုပိတ်လိုက်တယ်၊ ပြန်လည်ဆက်သွယ်ခြင်းမတိုင်ခင် ငြိမ်းအောင်လုပ်ပါ။
- Torii မလုပ်တဲ့အခါမှာတောင် Proxy က SSE ကို buffer လုပ်နိုင်တယ်။ Proxy ထဲက တုံ့ပြန်မှု buffering နဲ့ compression တွေကို Disable လုပ်ပြီး `curl -N` ကို diagnostics မှာ ထားပါ။
- နောက်ဖြစ်ရပ်က ယခင်ဖြစ်ရပ်နောက်ဆက်သွားမယ်လို့ ယူဆခြင်းဖြင့် ချိတ်ဆက်မှု ကွာဟချက်ကို ဘယ်တော့မှ မဖြည့်ပါ။ အဆုံးအသတ်မှတ်တိုင်မှာ ပြန်လည်ပြသရေး ညွှန်ကြားချက်မရှိဘဲ လက်ရှိစာအုပ်အခြေအနေကို မေးမြန်းပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [JavaScript ချိတ်ဆက်ထားသော commit မှာ streaming recipe ကို](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ချိတ်ဆက်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs) တွင် ပေါင်းစပ်မှု စမ်းသပ်မှုများ။
- [Torii FilterExpr parser at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii event routing at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [မေးမြန်းချက်စာအုပ်အခြေအနေ ](./query-ledger-state.md)
