---
translation_locale: mn
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Өргөдлийн үйл явдлууд {#stream-events}

## Үр дүн {#outcome}

Серверээс илгээсэн событийг (SSE) ашиглан амьд Taira програм хангамжийн боловсруулалтын ажлын урсгалын событийг хэрэглэж, хязгаарлагдмал эргэн холболтоор дахин холбогдож, бат бөх төлөвийг шинэчилнэ солих урсгал нээгдсэний дараа. Учир нь API төгсгөлд дахин тоглуулах курсор байхгүй тул үйл явдлуудыг бүрэн түүхийн оронд мэдэгдэл гэж үзнэ үү.

## Өмнөх шаардлага {#prerequisites}

- `curl` нийтийн уушгины тест хийхэд.
- Node.js 24 JavaScript хэрэглэгчдэд.
- Шифрлэлийн гарын үсэг шаардлагагүй. `https://taira.sora.org/v1/events/sse` нь олон нийтийн, зөвхөн унших зориулалттай урсгал бөгөөд энэ жор нь ямар нэгэн Minamoto эсвэл Taira бичлэг хийдэггүй.

## Алхамууд {#steps}

### 1. SSE хариуг баталгаажуулна уу {#_1-confirm-the-sse-response}

Үйл явдлын урсгалыг JSON нөөц хувилбартайгаар хүс: Torii `text/event-stream`-ээр урсгал дамжуулж, хүчингүй шүүлтүүр зэрэг татгалзсан хүсэлтийг JSON алдаа болгон мэдээлдэг. curl-ийн буфержуулалтыг идэвхгүй болго. Команд 20 секундын дараа дуусна. Torii 15 секунд сул зогссоны дараа heartbeat тайлбар илгээдэг тул нам гүм үед зөвхөн heartbeat тайлбарууд хүлээн авах нь хүчинтэй.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID`-г бүү илгээ. Torii-ийн SSE төгсгөлийн цэг нь дахин тоглуулах лог бус, шууд олон хэрэглэгчид түгээдэг урсгал тул дахин тоглуулах хүсэлтийг татгалзана.

### 2. Шүүлтүүртэй JavaScript хэрэглэгчийг нэмнэ үү {#_2-add-a-filtered-javascript-consumer}

Дараахыг `stream-taira.mjs` нэрээр хадгал. Энэ нь сүлжээгээр дамжих форматыг харуулахын тулд Fetch-ийг шууд ашигладаг. `filter` асуулгын параметр нь батлагдсан гүйлгээний үйл явдлуудыг сонгохдоо Torii-ийн текст шүүлтүүрийн дүрэм зүйг ашигладаг бөгөөд задлагч нь SSE фреймүүдийг дахин тоглуулах курсоргүйгээр боловсруулдаг.

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

Яг нэг гүйлгээ Taira дээр `Approved` хүртэл ажиллуул:

```bash
node ./stream-taira.mjs
```

SSE зүрхний цохилтын тайлбарууд идэвхгүй холболтуудыг амьдруулахад тусалдаг боловч блокчэйн дэвтэрт дарааллыг тогтоодоггүй. Дараалал эсвэл бүрэн байдал нь чухал бол блокийн өндөр, гүйлгээний криптографийн хэшүүд болон блокчэйн дэвтэрийн лавлагааг ашиглана уу.

Хамгийн сүүлийн-25 судлаачийн хүсэлт нь зөвхөн нийтийн оношлогоо юм. Үйлдвэрлэлийн хэрэглэгч нь `reconcile()`-г өөрийн бат бөх програмын нөөцөд зориулсан асуулт эсвэл чекпойнтод хангалттай их хэмжээний сэргээх хязгаар бүхий зүйлээр сольж эсвэл өргөтгөх ёстой. Зөвхөн тодорхой цагийн хязгаарлагдмал өгөгдлийн харагдац нь ямар ч үйл явдлыг алдагдаагүй гэдгийг нотолж чадахгүй.

`@iroha/iroha-js`-ийн `ToriiClient.streamEvents({ filter })` нь ижил урсгалыг уншдаг: `field('tx_status').eq('Approved')` эсвэл дээрх текст шүүлтүүрийг дамжуул. Урсгал дуусахаас өмнө төгсгөлийн `stream_error` фреймийг гаргадаг тул дээрх дахин холбогдох болон тулгалтын дүрмүүд хүчинтэй хэвээр байна.

## Баталгаажуулах {#verify}

Нэг терминалд JavaScript consumer-ийг ажиллуулж, нөгөөд нь нийтийн гүйлгээний агшин зургийг уншина:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Таны сонирхож буй гүйлгээ бүрийн тохиолдолд түүний криптографийн хэшийг тухайн цаг мөчийн өгөгдлийн харагдацад олж эсвэл шууд асууж болно. Хязгаарлагдсан хуудас нь хуучин гүйлгээг орхиж болно. Дараа нь хэрэглэгчийг зогсоогоод дахин эхлүүл: энэ нь үйл явдлын ID өгөхгүйгээр дахин холбогдож, орлуулсан урсгал нээгдэхлээр шинэ оношлогооны мэдээлэл хэвлэх ёстой.

## Алдааг олох болон засах {#troubleshooting}

- Heartbeat тайлбар ирж байгаа боловч өгөгдлийн үйл явдалгүй холболт хэвийн; сонгосон боловсруулалтын төлөвт одоогоор үйл явдал байхгүй байж болно.
- `invalid_filter` кодтой `400` нь `filter` Torii-ийн текст дүрэм зүйд нийцэхгүй, эсвэл үйл явдлын урсгалын дэмждэггүй талбарыг нэрлэсэн гэсэн үг. Үйл явдлын урсгалууд `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` болон `proof_envelope_hash` талбараар шүүдэг.
- `stream_error` үйл явдал нь сервер хоцрогдол эсвэл урсгалыг дуусгах өөр нөхцөл илрүүлснийг илтгэнэ. Torii тэр үйл явдлыг нэг удаа илгээгээд урсгалыг хаадаг; орлох шинэ урсгал нээгээд, дараа нь тулгалт хий.
- Прокси нь Torii хийдэггүй үед ч SSE-г буферлэж болно. Прокси дахь хариу буферлэлт болон шахалтыг идэвхгүй болго, мөн `curl -N`-г оношилгоонд хадгалаарай.
- Дараагийн үйл явдал өмнөхийг дагаж болно гэж таамаглаж тасралтгүй завсрыг битгий бөглөөрэй. API төгсгөлд дахин тоглуулах заагч байхгүй; оронд нь одоогийн блокчэйн бүртгэлийн төлөвийг асуугаарай.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [JavaScript тогтсон эх кодын шинэчлэл дээр урсгалыг гаргах жор](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE тогтсон эх кодын хувилбарт интеграцийн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Тогтоосон commit дахь Torii-ийн шүүлтүүрийн текст дүрэм зүй](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii тогтсон эх кодын шинэчлэл дээр үүссэн үйл явдлын чиглүүлэлт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Арга хэмжээ](/mn/blockchain/events.md)
- [Torii API төгсгөлүүд](/mn/reference/torii-endpoints.md)
- [Блокчэйн бүртгэлийн төлөвийг асуух](./query-ledger-state.md)
