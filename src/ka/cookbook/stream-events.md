---
translation_locale: ka
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
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

მოითხოვეთ მოვლენების ნაკადი JSON სარეზერვო ვარიანტით: Torii ნაკადს `text/event-stream` ფორმატში გადასცემს, ხოლო უარყოფილ მოთხოვნას, მაგალითად არასწორ ფილტრს, JSON შეცდომის სახით აცნობებს. გამორთეთ curl-ის ბუფერიზაცია. ბრძანება 20 წამის შემდეგ სრულდება. Torii 15 წამიანი უმოქმედობის შემდეგ heartbeat კომენტარს აგზავნის, ამიტომ მშვიდ პერიოდში მხოლოდ heartbeat კომენტარების მიღება ნორმალურია.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

არ გაგზავნოთ `Last-Event-ID`. Torii-ს SSE საბოლოო წერტილი ცოცხალი განშტოებადი ნაკადია და არა ხელახლა დასაკრავი ჟურნალი, ამიტომ ის განმეორებით დაკვრის მოთხოვნებს უარყოფს.

### 2. დაამატეთ ფილტრირებული JavaScript მომხმარებელი. {#_2-add-a-filtered-javascript-consumer}

შემდეგი კოდი შეინახეთ როგორც `stream-taira.mjs`. ის პირდაპირ Fetch-ს იყენებს, რათა გადაცემის ფორმატი აჩვენოს. `filter` მოთხოვნის პარამეტრი დამტკიცებული ტრანზაქციების მოვლენების შესარჩევად Torii-ის ტექსტური ფილტრის გრამატიკას იყენებს, ხოლო პარსერი SSE ფრეიმებს წარსული მოვლენების ხელახალი მიღების კურსორის გარეშე ამუშავებს.

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

განახორციელეთ ის, სანამ Taira-ზე მინიმუმ ერთი ტრანზაქცია არ აღწევს `Approved`:

```bash
node ./stream-taira.mjs
```

SSE გულისცემის კომენტარები ინარჩუნებენ უქმე კავშირებს ცოცხლად, მაგრამ არ ქმნიან ბლოკჩეინის რეესტრის შეკვეთას. გამოიყენეთ ბლოკის სიმაღლეები, ტრანზაქციების კრიპტოგრაფიული ჰეშები და ბლოკჩეინ ლიდერების მოთხოვნები, როდესაც შეკვეთა ან სრულობა მნიშვნელოვანია.

ბოლო 25 ექსპლუატორის მოთხოვნა მხოლოდ საჯარო დიაგნოსტიკაა. წარმოების მომხმარებელმა უნდა შეცვალოს ან გაახანგრძლივოს `reconcile()` მისი მდგრადი გამოყენების რესურსებისა და საკმარისად დიდი აღდგენის ბინდის გამოძიებით მისი გამშვები პუნქტისთვის. მხოლოდ შეზღუდული წერტილის დროის მონაცემების ხედვა ვერ დაამტკიცებს, რომ არანაირი მოვლენა არ გამოტოვებულა.

`@iroha/iroha-js`-ის `ToriiClient.streamEvents({ filter })` იმავე ნაკადს კითხულობს: გადაეცით `field('tx_status').eq('Approved')` ან ზემოთ მოცემული ტექსტური ფილტრი. ნაკადის დასრულებამდე ის აბრუნებს დამასრულებელ `stream_error` ფრეიმს, ამიტომ ზემოთ აღწერილი ხელახალი დაკავშირებისა და შეჯერების წესები კვლავ მოქმედებს.

## შემოწმება {#verify}

ერთ ტერმინალში, განახორციელეთ მომხმარებელი JavaScript. მეორეში, წაიკითხეთ საჯარო ტრანზაქციის მონაცემთა პუნქტის დროის ნახვა:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

თითოეული ტრანზაქციის მოვლენისთვის, რომელიც გაინტერესებთ, მოძებნეთ მისი კრიპტოგრაფიული ჰეში დროის მონაცემთა ნახვაზე ან უშუალოდ გამოკითხეთ იგი. შეზღუდული გვერდი შეიძლება გამორიცხოს ძველი ტრანზაკციები. შემდეგ შეაჩერეთ და განახორციელეთ მომხმარებელი: ის უნდა გაერთიანდეს მოვლენის ID-ის მიწოდების გარეშე და უნდა დაიბეჭდოს ახალი დიაგნოსტიკა მას შემდეგ, რაც ჩანაცვლების ნაკადი გაიხსნება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- კავშირი, რომელსაც გულისცემის კომენტარები აქვს, მაგრამ მონაცემთა მოვლენები არა, გამართულია; შერჩეული კონვეიერის მდგომარეობა შეიძლება უბრალოდ უმოქმედო იყოს.
- `400` კოდით `invalid_filter` ნიშნავს, რომ `filter` არ შეესაბამება Torii-ის ტექსტურ გრამატიკას ან ასახელებს ველს, რომელსაც მოვლენების ნაკადები მხარს არ უჭერს. მოვლენების ნაკადები ფილტრავს `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` და `proof_envelope_hash` ველების მიხედვით.
- `stream_error` მოვლენა მიუთითებს, რომ სერვერმა აღმოაჩინა ჩამორჩენა ან ნაკადის სხვა დამასრულებელი მდგომარეობა. Torii ამ მოვლენას ერთხელ აგზავნის და ნაკადს ხურავს; გახსენით შემცვლელი ნაკადი, შემდეგ კი შეაჯერეთ მდგომარეობა.
- პროქსმა შეიძლება ბუფერი SSE მაშინაც კი, როდესაც Torii არ აკეთებს. გამორთეთ რეაგირების ბუფერინგი და კომპრესია პროქსში და შეინახეთ `curl -N` დიაგნოსტიკაში.
- არასოდეს შეავსოთ გათიშვის სივრცე, ვივარაუდოთ შემდეგი მოვლენა წინა მოვლენას მოჰყვება. API საბოლოო წერტილს არ აქვს განმეორებითი კურსორი; შეკითხვა მიმდინარე ბლოკჩეინ ლიდერის მდგომარეობის მაგივრად.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [JavaScript სტრიმინგის რეცეპტი ჩაკეტილი წყარო კოდის გადახედვისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Torii-ის ფილტრის ტექსტური გრამატიკა დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii მოვლენების მარშრუტირება ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [მოვლენები](/ka/blockchain/events.md)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
- [საკვანძო ბლოკჩეინების ლიდერის მდგომარეობა](./query-ledger-state.md)
