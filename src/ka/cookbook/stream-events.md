---
translation_locale: ka
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მოვლენების გადაცემა {#stream-events}

## შედეგები {#outcome}

გამოიყენეთ პირდაპირი Taira მილსადენის მოვლენები სერვერის მიერ გაგზავნილ მოვლენებზე (SSE), დაუკავშირდით შეზღუდული backoff-ით და განახორციელეთ გამძლე მდგომარეობა ჩანაცვლების ნაკადის გახსნის შემდეგ. რადგან საბოლოო წერტილში არ არის გათამაშების კურსორი, მოვლენები განიხილეთ როგორც შეტყობინებები და არა სრული ისტორია.

## წინაპირობები {#prerequisites}

- `curl` საჯარო სიგარეტის ტესტისთვის.
- Node.js 24 JavaScript მომხმარებლისთვის.
- არ არის საჭირო ხელმოწერა. `https://taira.sora.org/v1/events/sse` არის საჯარო, მხოლოდ წაკითხვის ნაკადი; ეს რეცეპტი არ ასრულებს არც Minamoto ან Taira წერას.

## ნაბიჯები {#steps}

### 1. დაადასტურეთ SSE პასუხი {#_1-confirm-the-sse-response}

Taira ამჟამად ილაპარაკებს ამ მარშრუტზე მხოლოდ მაშინ, როდესაც `Accept` სათაურში შედის როგორც სასურველი მოვლენების ნაკადი, ასევე JSON ჩამორთმევა. გამორთეთ curl ბუფერინგი. ბრძანება დასრულდება 15 წამის შემდეგ; მოქმედებს მხოლოდ გულისცემის კომენტარების მიღება მშვიდი პერიოდის განმავლობაში.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

არ გამოგზავნოთ `Last-Event-ID`. Torii-ს SSE საბოლოო წერტილი არის პირდაპირი თაყვანისმცემლის ნაკადი, და არა განმეორებითი ჟურნალის ჩანაწერი და უარყოფს განმეორებით მოთხოვნა.

### 2. დაამატეთ ფილტრირებული JavaScript მომხმარებელი. {#_2-add-a-filtered-javascript-consumer}

შეინახეთ შემდეგი, როგორც `stream-taira.mjs`. იგი იყენებს Fetch პირდაპირ, ასე რომ მოთხოვნა შეუძლია გამოგზავნოს Taira საჭიროა შერეული `Accept` სათაური. მიმდინარე `FilterExpr` ირჩევს დამტკიცებულ ტრანზაქციულ მოვლენებს და პარსერი მოიხმარს: SSE ჩარჩოები, რომელთაც არ გააჩნიათ რეპლეი კურსორი.

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

განახორციელეთ ის, სანამ Taira-ზე მინიმუმ ერთი ტრანზაქცია არ აღწევს `Approved`:

```bash
node ./stream-taira.mjs
```

SSE გულისცემის კომენტარები ინარჩუნებს უქმე კავშირებს ცოცხლად, მაგრამ არ ადგენს ლიდერის შეკვეთა. გამოიყენეთ ბლოკის სიმაღლეები, ტრანზაქციის ჰეშები და ლიდერის გამოკითხვები, როდესაც შეკვეთა ან სრულობა მნიშვნელოვანია.

ბოლო 25 ექსპლუატორის მოთხოვნა მხოლოდ საჯარო დიაგნოსტიკაა. წარმოების მომხმარებელმა უნდა შეცვალოს ან გაახანგრძლივოს `reconcile()` მისი მდგრადი გამოყენების რესურსების გამოკითხვით და საკმარისად დიდი აღდგენითი ბინდი მის გამშვებ პუნქტისთვის. მარტო შეზღუდული სურათი არ შეიძლება დაამტკიცოს, რომ არანაირი მოვლენა არ გაუსწორდა.

ჩაკეტილი კომიტეტზე, `ToriiClient.streamEvents()` მხოლოდ `Accept: text/event-stream` აგზავნის; ცოცხალი Taira უარყოფს უფრო ვიწრო სათაურს `406`. გამოიყენეთ ნედლეული Fetch ფორმა ზემოთ სანამ SDK და საზოგადოებრივი საბოლოო წერტილი მოლაპარაკება იმავე მედია ტიპების.

## შემოწმება {#verify}

ერთ ტერმინალში განახორციელეთ JavaScript მომხმარებელი. მეორეში წაიკითხეთ საჯარო ტრანზაქციის გადაღება:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

თითოეული ტრანზაქციის მოვლენისთვის, რომელიც გაინტერესებთ, იპოვეთ მისი ჰეში სნოპშოტში ან გამოკითხეთ იგი პირდაპირ. შეზღუდული გვერდი შეიძლება გამორიცხოს ძველი ტრანზაკციები. შემდეგ შეაჩერეთ და განაახლოს მომხმარებელი: ის უნდა დაუკავშირდეს მოვლენის მიწოდების გარეშე ID და უნდა დაიბეჭდოს ახალი დიაგნოსტიკა შეცვლის ნაკადის გახსნის შემდეგ.

## პრობლემების აღმოფხვრა {#troubleshooting}

- კავშირი გულისცემის კომენტარებთან, მაგრამ მონაცემების არანაირი მოვლენებით არის ჯანსაღი; შერჩეული მილსადენის სტატუსი შეიძლება უბრალოდ იყოს მდუმარე.
- `406 Not Acceptable` პირდაპირ ეთერში Taira ჩვეულებრივ ნიშნავს რეკლამირებულ მოთხოვნას მხოლოდ `text/event-stream`. გამოგზავნეთ `text/event-stream, application/json` ზუსტად როგორც ზემოთ მოცემულია.
- `stream_error` მოვლენა მიუთითებს, რომ სერვერმა აღმოაჩინა დაგვიანება ან სხვა ტერმინალური ნაკადის მდგომარეობა. Torii ერთჯერად გამოგზავნის ამ მოვლენას და ჩაკეტავს ნაკადს; შეთანხმება, სანამ კვლავ გაერთიანდება.
- პროქსმა შეიძლება ბუფერი SSE მაშინაც კი, როდესაც Torii არ აკეთებს. გამორთეთ რეაგირების ბუფერინგი და კომპრესია პროქსში და შეინახეთ `curl -N` დიაგნოსტიკაში.
- არასოდეს შეავსოთ გათიშვის სივრცე, ვივარაუდოთ, რომ შემდეგი მოვლენა წინა მოვლენას მოჰყვება. საბოლოო წერტილში არ არის განმეორებითი კურსორი; მაგივრად გამოკითხეთ მიმდინარე ლეჯერის მდგომარეობა.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [JavaScript სტრიმინგის რეცეპტი ჩაკეტილი კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ინტეგრაციის ტესტები ჩაკეტილი კომპიუტერზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr პარსერი ჩაკეტილი კომიტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii ღონისძიების მარშრუტი ჩაკეტილი კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [მოვლენები](/ka/blockchain/events.md)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md)
- [გამოკითხვის ლიდერის მდგომარეობა](./query-ledger-state.md)
