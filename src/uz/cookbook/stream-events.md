---
translation_locale: uz
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# O'yin-kulgilar {#stream-events}

## Natija {#outcome}

Server tomonidan jo'natilgan hodisalar (SSE) ustidan jonli Taira quvur tadbirlarini iste'mol qiling, chegaralashtirilgan qaytarib olish bilan qayta ulaning va almashtirish oqimi ochilgandan so'ng chidamli holatni yangilash. Oxirgi nuqtada takrorlash kursorlari bo'lmaganligi sababli hodisalarni to'liq tarix emas, balki bildirishnomalar sifatida qabul qiling.

## Oldingi shartlar {#prerequisites}

- `curl` ommaviy tutun sinovlari uchun.
- Node.js 24 uchun JavaScript iste'molchi.
- Imzo talab qilinmaydi. `https://taira.sora.org/v1/events/sse` ochiq, faqat o'qiladigan oqimdir; bu retseptda Minamoto yoki Taira yozuvlar mavjud emas

## qadamlar {#steps}

### 1. SSE javobini tasdiqlang {#_1-confirm-the-sse-response}

Taira hozirda ushbu yo'nalishni faqat `Accept` sarlavhasida eng afzal bo'lgan voqea oqimi va JSON to'siq ham mavjud bo'lsa muzokara qiladi. curl bufferingni o'chirib qo'ying. Buyruq 15 soniyadan so'ng tugadi; tinch davrda faqat yurak urishi fikrlarini qabul qilish haqiqiydir.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Joʻnatmang `Last-Event-ID`. Torii Bu ... SSE oxirgi nuqta - bu jonli fan-out stream, takrorlash logini emas va takrorlash talablarini rad etadi.

### 2. Filtrlangan JavaScript iste'molchini qo'shing {#_2-add-a-filtered-javascript-consumer}

Quyidagilarni `stream-taira.mjs` sifatida saqlang. U Fetch-dan to'g'ridan-to'g'ri foydalanadi, shunda so'rov Taira ning kerakli aralash `Accept` boshliqini yuborishi mumkin. Joriy `FilterExpr` tasdiqlangan tranzaksiya hodisalarini tanlaydi va parser qayta ijro etish kursorisiz SSE ramkalarni iste'mol qiladi.

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

Uni Taira-da kamida bitta tranzaksiya `Approved` ga yetguncha yuriting:

```bash
node ./stream-taira.mjs
```

SSE yurak urishidagi sharhlar bepul aloqalarni tirik qoldiradi, lekin bu kitobning tartibini o'rnatmaydi. Buyruq yoki to'liqlik muhim bo'lganda blok balandliklari, muomala hashlari va katta yozuv so'rovlaridan foydalaning.

So'nggi 25 tadqiqotchi so'rovi faqat ommaviy diagnostika hisoblanadi. Mahsulot iste'molchisi `reconcile()` ni o'zining chidamli dastur resurslari uchun so'rovlar bilan almashtirishi yoki uzaytirishi kerak va uni nazorat punkti uchun etarlicha katta tiklash to'g'risida bog'liq bo'lishi kerak. Faqatgina cheklangan fotosurat hech qanday hodisa o'tmaganligini isbotlay olmaydi.

`ToriiClient.streamEvents()` faqat `Accept: text/event-stream`ni jo'natadi; jonli Taira o'sha torroq boshliqni `406` bilan rad etadi. SDK va ommaviy oxirgi nuqta bir xil media turlarini muzokara qilmaguncha, yuqoridagi xom Fetch shaklini ishlating.

## Tekshirish {#verify}

Bir terminalda JavaScript iste'molchini ishga tushiring. Boshqa terminalda esa, ommaviy tranzaksiya fotosuratini o'qing:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Har bir tranzaksiya hodisasi uchun siz g'amxo'rlik qilishingiz mumkin, uning hashini darhol fotosuratda toping yoki uni to'g'ridan-to'g'ri so'rang. va iste'molchini qayta ishga tushirish: u hodisa ID bilan ta'minlanmasdan qayta ulanishi kerak va almashtirish oqimi ochilgandan so'ng yangi diagnostika bosib chiqarish kerak.

## Muammolarni hal qilish {#troubleshooting}

- Qalb urishidagi sharhlar bilan bog'lanish, lekin ma'lumotlar bo'lmagan hodisalar sog'lom; tanlangan quvurning holati shunchaki xotirjam bo'lishi mumkin.
- `406 Not Acceptable` jonli Taira odatda faqat e'lon qilingan talabni anglatadi `text/event-stream`. Joʻnatish `text/event-stream, application/json` yuqorida ko'rsatilganidek.
- `stream_error` hodisasi server kechikish yoki boshqa terminal oqimi holatini aniqlaganligini ko'rsatadi. Torii ushbu hodisani bir marta yuboradi va oqimni yopadi; qayta ulanishdan oldin uyg'unlashtiring.
- Torii yo'q bo'lsa ham, proksi bufferingini SSE ushlab turishi mumkin. Proxy-da javob buffering va siqishni o'chirib qo'ying va diagnostikada `curl -N` saqlang.
- Hech qachon keyingi hodisani oldingi hodisaning orqasidan ketayotganini tasavvur qilib, uzluksiz bo'shliqni to'ldirish. Oxirgi nuqtada takrorlash kursorlari yo'q; o'rniga joriy katta kitob holatini so'rang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [JavaScript to'g'ri yozib qo'yilgan commit-da streaming retseptasi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE o'rnatilgan qo'yilganda integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr parser o'rnatilgan commit-da ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii o'rnatilgan commit-da hodisa yo'nalishi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [O'zgarishlar](/uz/blockchain/events.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [So'rovlar daftarining holati](./query-ledger-state.md)
