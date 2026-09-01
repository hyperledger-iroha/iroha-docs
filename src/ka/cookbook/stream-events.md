---
translation_locale: ka
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მოვლენების გადაცემა {#stream-events}

## შედეგები {#outcome}

მიიღეთ Taira-ს დამუშავების ნაკადის ცოცხალი მოვლენები სერვერის მიერ გამოგზავნილი მოვლენების (SSE) საშუალებით, კავშირი შეზღუდული მზარდი დაყოვნებით აღადგინეთ და შემცვლელი ნაკადის გახსნის შემდეგ მდგრადი მდგომარეობა განაახლეთ. რადგან API-ის საბოლოო წერტილს განმეორებითი დაკვრის კურსორი არ აქვს, მოვლენები სრულ ისტორიად კი არა, შეტყობინებებად განიხილეთ.

## წინაპირობები {#prerequisites}

- `curl` საჯარო სიგარეტის ტესტისთვის.
- Node.js 24 JavaScript მომხმარებლისთვის.
- არ არის საჭირო კრიპტოგრაფიული ხელმოწერა. `https://taira.sora.org/v1/events/sse` არის საჯარო, მხოლოდ წაკითხვის ნაკადი; ეს რეცეპტი არ ასრულებს არც Minamoto ან Taira წერას.

## ნაბიჯები {#steps}

### 1. დაადასტურეთ SSE პასუხი {#_1-confirm-the-sse-response}

Taira ამჟამად ილაპარაკებს ამ მარშრუტზე მხოლოდ მაშინ, როდესაც `Accept` სათაურში შედის როგორც სასურველი მოვლენების ნაკადი, ასევე JSON ჩამორთმევა. გამორთეთ curl ბუფერინგი. ბრძანება დასრულდება 15 წამის შემდეგ; მოქმედებს მხოლოდ გულისცემის კომენტარების მიღება მშვიდი პერიოდის განმავლობაში.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

არ გაგზავნოთ `Last-Event-ID`. Torii-ს SSE საბოლოო წერტილი ცოცხალი განშტოებადი ნაკადია და არა ხელახლა დასაკრავი ჟურნალი, ამიტომ ის განმეორებით დაკვრის მოთხოვნებს უარყოფს.

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

SSE გულისცემის კომენტარები ინარჩუნებენ უქმე კავშირებს ცოცხლად, მაგრამ არ ქმნიან ბლოკჩეინის რეესტრის შეკვეთას. გამოიყენეთ ბლოკის სიმაღლეები, ტრანზაქციების კრიპტოგრაფიული ჰეშები და ბლოკჩეინ ლიდერების მოთხოვნები, როდესაც შეკვეთა ან სრულობა მნიშვნელოვანია.

ბოლო 25 ექსპლუატორის მოთხოვნა მხოლოდ საჯარო დიაგნოსტიკაა. წარმოების მომხმარებელმა უნდა შეცვალოს ან გაახანგრძლივოს `reconcile()` მისი მდგრადი გამოყენების რესურსებისა და საკმარისად დიდი აღდგენის ბინდის გამოძიებით მისი გამშვები პუნქტისთვის. მხოლოდ შეზღუდული წერტილის დროის მონაცემების ხედვა ვერ დაამტკიცებს, რომ არანაირი მოვლენა არ გამოტოვებულა.

საწყისი კოდის გადახედვისას, `ToriiClient.streamEvents()` გამოგზავნის მხოლოდ `Accept: text/event-stream`; ცოცხალი Taira უარყოფს, რომ უფრო ვიწრო სათაური `406`. გამოიყენეთ ნედლი Fetch ფორმა ზემოთ, სანამ SDK და საჯარო API საბოლოო წერტილი მოლაპარაკება იმავე ტიპის მედია.

## შემოწმება {#verify}

ერთ ტერმინალში, განახორციელეთ მომხმარებელი JavaScript. მეორეში, წაიკითხეთ საჯარო ტრანზაქციის მონაცემთა პუნქტის დროის ნახვა:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

თითოეული ტრანზაქციის მოვლენისთვის, რომელიც გაინტერესებთ, მოძებნეთ მისი კრიპტოგრაფიული ჰეში დროის მონაცემთა ნახვაზე ან უშუალოდ გამოკითხეთ იგი. შეზღუდული გვერდი შეიძლება გამორიცხოს ძველი ტრანზაკციები. შემდეგ შეაჩერეთ და განახორციელეთ მომხმარებელი: ის უნდა გაერთიანდეს მოვლენის ID-ის მიწოდების გარეშე და უნდა დაიბეჭდოს ახალი დიაგნოსტიკა მას შემდეგ, რაც ჩანაცვლების ნაკადი გაიხსნება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- კავშირი, რომელსაც გულისცემის კომენტარები აქვს, მაგრამ მონაცემთა მოვლენები არა, გამართულია; შერჩეული კონვეიერის მდგომარეობა შეიძლება უბრალოდ უმოქმედო იყოს.
- `406 Not Acceptable` პირდაპირ ეთერში Taira ჩვეულებრივ ნიშნავს რეკლამირებულ მოთხოვნას მხოლოდ `text/event-stream`. გამოგზავნეთ `text/event-stream, application/json` ზუსტად როგორც ზემოთ მოცემულია.
- `stream_error` მოვლენა მიუთითებს, რომ სერვერმა აღმოაჩინა დაგვიანება ან სხვა ტერმინალური ნაკადის მდგომარეობა. Torii ერთჯერად გამოგზავნის ამ მოვლენას და ჩაკეტავს ნაკადს; შეთანხმება, სანამ კვლავ გაერთიანდება.
- პროქსმა შეიძლება ბუფერი SSE მაშინაც კი, როდესაც Torii არ აკეთებს. გამორთეთ რეაგირების ბუფერინგი და კომპრესია პროქსში და შეინახეთ `curl -N` დიაგნოსტიკაში.
- არასოდეს შეავსოთ გათიშვის სივრცე, ვივარაუდოთ შემდეგი მოვლენა წინა მოვლენას მოჰყვება. API საბოლოო წერტილს არ აქვს განმეორებითი კურსორი; შეკითხვა მიმდინარე ბლოკჩეინ ლიდერის მდგომარეობის მაგივრად.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [JavaScript სტრიმინგის რეცეპტი ჩაკეტილი წყარო კოდის გადახედვისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr პარსერი ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii მოვლენების მარშრუტირება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [მოვლენები](/ka/blockchain/events.md)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
- [საკვანძო ბლოკჩეინების ლიდერის მდგომარეობა](./query-ledger-state.md)
