---
translation_locale: uz
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Oqim Tadbirlar {#stream-events}

## Natija {#outcome}

Server tomonidan yuborilgan voqealar (SSE) orqali jonli Taira dasturiy ta'minot ishlash ish jarayoni voqealarini iste'mol qiling, cheklangan oraliqda qayta ulaning va barqaror holatni yangilang almashinish oqimi ochilgandan keyin. Chunki API endpointida qayta ijro kursor mavjud emas, voqealarni to‘liq tarix sifatida emas, bildirishnomalar sifatida qabul qiling.

## Oldindan shartlar {#prerequisites}

- `curl` ommaviy tutun sinovi uchun.
- Node.js JavaScript iste'molchi uchun 24.
- Imzolovchi talab qilinmaydi. `https://taira.sora.org/v1/events/sse` — ochiq, faqat o‘qiladigan oqim; bu retsept Minamoto yoki Taira’ga hech narsa yozmaydi.

## Qadamlar {#steps}

### 1. SSE javobini tasdiqlang {#_1-confirm-the-sse-response}

Taira hozirgi vaqtda ushbu marshrut bo‘ylab faqat `Accept` sarlavhasi ham afzal ko‘rilgan voqea oqimini, ham JSON zaxira variantini o‘z ichiga olganida muzokaralar qiladi. curl keshini o‘chirib qo‘ying. Buyruq 15 soniyadan so‘ng tugaydi; jim davrda faqat yurak urishi sharhlarini qabul qilish to‘g‘ri hisoblanadi.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID`ni yubormang. Torii ning SSE API endpointi jonli fan-out oqimi bo‘lib, qayta o‘ynash logi emas va qayta o‘ynash so‘rovlarini rad etadi.

### 2. Filtrlashgan JavaScript iste'molchisini qo'shish {#_2-add-a-filtered-javascript-consumer}

Quyidagini `stream-taira.mjs` sifatida saqlang. Bu bevosita Fetch-dan foydalanadi, shuning uchun so‘rov Taira talab qilinadigan aralash `Accept` sarlavhasini yuborishi mumkin. Joriy `FilterExpr` tasdiqlangan tranzaksiya voqealarini tanlaydi va parser SSE kadrlarni qayta ijro kursorisiz ishlatadi.

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

Uni kamida bitta tranzaksiya `Approved` ga Taira da yetmaguncha ishlating:

```bash
node ./stream-taira.mjs
```

SSE yurak urishi izohlari bo'sh ulanishlarni faol holda saqlaydi, lekin reyestrning tartibini o'rnatmaydi. Tartib yoki to'liqlik muhim bo'lganda blok balandliklari, tranzaksiya kriptografik xeshlarini va reyestr so'rovlarini ishlating.

Oxirgi 25 ta yozuvni explorer orqali so‘rash faqat ochiq diagnostikadir. Ishlab chiqarish iste’molchisi `reconcile()` ni o‘zining doimiy ilova resurslariga so‘rovlar bilan almashtirishi yoki kengaytirishi va nazorat nuqtasi uchun yetarli tiklash chegarasini belgilashi kerak. Cheklangan oniy nusxaning o‘zi hech bir hodisa o‘tkazib yuborilmaganini isbotlay olmaydi.

Belgilangan manba-kod reviziyasida, `ToriiClient.streamEvents()` faqat `Accept: text/event-stream` ni yuboradi; jonli Taira bu torroq sarlavhani `406` bilan rad etadi. SDK va jamoat API endpointlari bir xil media turlarini kelishib olishguncha yuqoridagi xom Fetch formasidan foydalaning.

## Tekshirish {#verify}

Bir terminalda JavaScript iste’molchisini ishga tushiring. Boshqasida ochiq tranzaksiyalar oniy nusxasini o‘qing:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Sizga kerak bo‘lgan har bir tranzaksiya hodisasining xeshini oniy nusxadan toping yoki uni bevosita so‘rang. Cheklangan sahifada eski tranzaksiyalar bo‘lmasligi mumkin. Keyin iste’molchini to‘xtatib qayta ishga tushiring: u hodisa identifikatorini bermasdan qayta ulanishi va yangi oqim ochilgach yangilangan diagnostikani chiqarishi kerak.

## Muammolarni bartaraf etish {#troubleshooting}

- Ma’lumot hodisalarisiz faqat heartbeat izohlari kelayotgan ulanish ham sog‘lom; tanlangan konveyer holati shunchaki tinch bo‘lishi mumkin.
- `406 Not Acceptable` jonli Taira da odatda talablari faqat `text/event-stream` e’lon qilinishini anglatadi. `text/event-stream, application/json`ni yuqorida ko‘rsatilganidek aniq yuboring.
- A `stream_error` voqea server kechikishni yoki boshqa terminal oqim sharoitini aniqlaganini bildiradi. Torii ushbu voqeani bir marta yuboradi va oqimni yopadi; qayta ulanishdan oldin muvofiqlashtiring.
- Vekil Torii qilmasa ham SSE ni keshga olishi mumkin. Vekilda javobni keshga olish va siqishni o‘chirib qo‘ying, va `curl -N` diagnostikada saqlansin.
- Aloqani uzilish bo'shligini keyingi hodisa oldingisini kuzatadi deb taxmin qilgan holda to'ldirmang. API endpointda qayta o'ynash kursor yo'q; buning o'rniga joriy blokcheyn ledger holatini so'rang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [JavaScript pinlangan source-code revisiyasi bo‘yicha streaming retsepti](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE pinlangan manba-kod versiyasidagi integratsiya testlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr pinlangan manba-kod reviziyasida parser](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii pinlangan manba-kod versiyasida voqeani yo'naltirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [Tadbirlar](/uz/blockchain/events.md)
- [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md)
- [Reyestr holatini so‘rash](./query-ledger-state.md)
