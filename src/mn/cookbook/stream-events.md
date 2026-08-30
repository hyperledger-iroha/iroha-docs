---
translation_locale: mn
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Товчруулах үйл явдлууд {#stream-events}

## Үр дүн {#outcome}

SSE серверээр илгээсэн үйл явдлуудыг дамжуулан амьд Taira урсгалын үйл явдлыг хэрэглэж, хязгаарлагдмал буцалтгүйгээр дахин холбож, нөхөн сэргээх урсгал нээлттэй болсноос хойш тогтвортой байдлыг шинэчлэгдэнэ.

## Урьдчилсан шаардлага {#prerequisites}

- `curl` олон нийтийн цахилгаан согтууруулах шинжилгээ хийх.
- Node.js 24 нь JavaScript хэрэглэгчийн хувьд байна.
- `https://taira.sora.org/v1/events/sse` нь нийтийн, зөвхөн унших урсгал юм; энэ рецепт нь Minamoto эсвэл Taira бичдэггүй.

## Хадгалт {#steps}

### 1. SSE хариуг батлах {#_1-confirm-the-sse-response}

Taira одоогоор энэ чиглэлийг зөвхөн `Accept` толгой нь сонгогдсон үйл явдлын урсгал болон JSON дутагдал хоёрыг багтаасан тохиолдолд хэлэлцэх юм. curl буферээ зогсоож, команд 15 секундээс хойш дуусдаг; чимээгүй хугацаанд зөвхөн зүрхний цохилт үзэгдэл хүлээн авах хүчинтэй байна.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Та нар явуулахгүй. `Last-Event-ID`. Torii Энэ бол SSE төгсгөлийн цэг бол шууд фан-аут урсгал, дахин тоглох бүртгэл биш бөгөөд дахин тоглох хүсэлтийг үгүйсгэнэ.

### 2. JavaScript хэрэглэгчийн ангиллыг нэмнэ. {#_2-add-a-filtered-javascript-consumer}

Дараах зүйлийг `stream-taira.mjs` гэж хадгалах. Энэ нь Fetch-ийг шууд ашигладаг тул хүсэлт Taira -ийн шаардлагыг нэгтгэсэн `Accept` толгойг ирүүлнэ. Одоогийн `FilterExpr` нь зөвшөөрөлтэй гүйлгээний үйл явдлыг сонгон шалгаруулж, шинжилгээний систем нь дахин тоглоомын курсоргүйгээр SSE зургийг хэрэглэдэг.

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

Taira дээр хамгийн багадаа нэг гүйлгээ `Approved` хүргэнэ хүртэл гүйцэтгэх:

```bash
node ./stream-taira.mjs
```

SSE зүрхний цохилт сэтгэгдэл нь зайлшгүй холбогдлыг амьд хадгалдаг боловч томоохон бүртгэлийн захиргааны тогтолцоог тогтоодоггүй. Томоохон бичигт орсон үед блок өндөр, гүйлгээ хэшүүд болон томоохойн асуултууд ашиглана.

Хамгийн сүүлийн 25 хайгуулын хүсэлт нь зөвхөн олон нийтийн оношилгоо юм. Үйлдвэрлэлийн хэрэглэгчид `reconcile()` -ийг тогтвортой ашиглалтын эх үүсвэрийнхээ асуултууд болон хяналтын цэгтээ хангалттай их хэмжээний нөхөн сэргээлтээр орлуулах эсвэл өргөжүүлэх ёстой. Хяналт шалгаруулалтын цорын ганц үзэл баримт нь ямар ч үйл явдлыг орхиогүй гэдгийг батлах боломжгүй.

Тэмцээгдсэн байлдаанд, `ToriiClient.streamEvents()` зөвхөн илгээдэг `Accept: text/event-stream`; Амьдрал Taira Энэ товч хуудас нь `406`. Үүнээс өмнө "Fetch" хэлбэрээр SDK хэвлэл мэдээллийн хэрэгслийн ижил төрлийн үйл ажиллагаа явуулдаг.

## Бүртгэнэ {#verify}

Нэг терминал дээр JavaScript хэрэглэгчийг ажиллуулж, нөгөөг нь олон нийтийн гүйлгээний хяналтын зураг уншина уу:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Та сонирхож буй аливаа гүйлгээний үйл явдлын хувьд, түүний хэшийг хяналт татах эсвэл шууд асуух болно. Чингэлтэй хуудас хуучин гүйлгээг орхиж чадна. Дараа нь зогсоо хэрэглэгчийг дахин эхлүүлэх: энэ нь үйл явдлыг ID хангахгүйгээр дахин холбож, нөхөн сэргээх урсгал нээгдсэн дараа шинэхэн оношилгоо хэвлэх ёстой.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- Хөгдөлмөр хөдөлгөөнтэй холбоотой, гэхдээ мэдээллийн үйл явдлууд байхгүй бол эрүүл; сонгогдсон урсгалын байдал зүгээр л чимээгүй байж болно.
- `406 Not Acceptable` Амьдрал Taira ерөнхийдөө зөвхөн сурталчилсан хүсэлтийг хэлнэ `text/event-stream`. Элчүүлээрэй `text/event-stream, application/json` яг дээр нь харагдаж байна.
- `stream_error` үйл явц нь сервер хяналт тавих хугацааг эсвэл бусад эцсийн урсгалын нөхцөл байдлыг тогтоосон гэдгийг харуулж байна. Torii тухайн үйл явдлыг нэг удаа илгээж, урсгалыг хааж, дахин холбох өмнө тохируулна.
- Прокси нь SSE-ийг буферж болно, тэр ч байтугай Torii -ийнгүй үед. Проксид хариуын буфержүүлэл болон товчлуулгыг зогсоож, диагностицаар `curl -N`г хадгалах боломжтой.
- Дараагийн үйл явдлыг өмнөх үйл явдлын дараа нь явуулдаг гэж үзвэл хэзээ ч холбоог буулгах нүктейг бүрдүүлээрэй. Хөгжлийн цэгт дахин тоглох курсор байхгүй; мөрдөн байлдааны томоохон жагсаалтын оршин тогтнолоо шалгана.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [JavaScript урсгалын уран сайхны хувилбар](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE нэгтгэл шинжилгээний үзэл баримтлал](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr шалгаруулагчаар байнгын үүрэг гүйцэтгэгч](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii үйл явдлын чиглэлийг тавигдсан commit-т](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [үйл явц](/mn/blockchain/events.md)
- [Torii эцсийн цэгүүд](/mn/reference/torii-endpoints.md)
- [Судалгааны номын жагсаалтын байдал](./query-ledger-state.md)
