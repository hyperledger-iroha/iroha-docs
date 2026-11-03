---
translation_locale: kk
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Оқиғаларды жіберу {#stream-events}

## Нәтиже {#outcome}

Сервер арқылы жіберілген оқиғалар (SSE) бойынша тікелей Taira бағдарламалық жасақтама өңдеу жұмыс ағындарының оқиғаларын тұтыну, шектеулі кері байланыспен қайта қосылу және тұрақты күйді жаңарту ауыстыру ағыны ашылғаннан кейін. Себебі API ұшыру нүктесінде қайта ойнату курсоры жоқ, оқиғаларды толық тарих ретінде емес, хабарламалар ретінде қарастырыңыз.

## Алдын ала шарттар {#prerequisites}

- `curl` қоғамдық сынақ үшін.
- Node.js JavaScript тұтынушысына 24.
- Криптографиялық қолтаңба қажет емес. `https://taira.sora.org/v1/events/sse` — бұл жалпы, тек оқуға арналған ағын; бұл рецепт ешқандай Minamoto немесе Taira жазбаларды орындамайды.

## Қадамдар {#steps}

### 1. SSE жауабын растаңыз {#_1-confirm-the-sse-response}

Оқиғалар ағынын JSON резервтік нұсқасымен сұраңыз: Torii ағынды `text/event-stream` пішімінде жібереді, ал қабылданбаған сұрауды, мысалы, жарамсыз сүзгіні, JSON қатесі ретінде хабарлайды. curl буферлеуін өшіріңіз. Команда 20 секундтан кейін аяқталады. Torii 15 секунд әрекетсіздіктен кейін heartbeat түсініктемесін жібереді, сондықтан тыныш кезеңде тек heartbeat түсініктемелерін алу қалыпты жағдай.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID` жібермеңіз. Torii SSE API нүктесі тірі тарату ағыны болып табылады, қайта ойнату журналы емес және қайта ойнату сұрауларын қабылдамайды.

### 2. Сүзгіден өткізілген JavaScript тұтынушыны қосу {#_2-add-a-filtered-javascript-consumer}

Келесіні `stream-taira.mjs` ретінде сақтаңыз. Ол тасымалдау пішімін көрсету үшін Fetch-ті тікелей пайдаланады. `filter` сұрау параметрі мақұлданған транзакция оқиғаларын таңдау үшін Torii мәтіндік сүзгі грамматикасын пайдаланады, ал талдағыш SSE кадрларын қайта ойнату курсорынсыз өңдейді.

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

Оны кем дегенде бір транзакция `Approved` жеткенше Taira орында іске қосыңыз:

```bash
node ./stream-taira.mjs
```

SSE жүрек қағысы пікірлері бос тұрған қосылымдарды тірі ұстайды, бірақ блокчейн есептерінің тәртібін орнатпайды. Тәртіп немесе толықтық маңызды болғанда блок биіктіктерін, транзакция криптографиялық хэштерін және блокчейн есеп сұрауларын пайдаланыңыз.

Соңғы-25 шолушы сұрауы тек қоғамдық диагностикалық болып табылады. Өндірістік тұтынушы `reconcile()` мәнін оның тұрақты қолданба ресурстарына арналған сұраулармен және оның тексеру нүктесі үшін жеткілікті үлкен қалпына келтіру шегімен алмастыруы немесе кеңейтулері қажет. Шектелген нүкте-мезгіл деректер көрінісі тек оқиғалар жіберілмегенін дәлелдей алмайды.

`@iroha/iroha-js` пакетіндегі `ToriiClient.streamEvents({ filter })` сол ағынды оқиды: `field('tx_status').eq('Approved')` немесе жоғарыдағы мәтіндік сүзгіні беріңіз. Ағын аяқталмас бұрын ол соңғы `stream_error` кадрын береді, сондықтан жоғарыдағы қайта қосылу және салыстырып тексеру ережелері әлі де қолданылады.

## Растау {#verify}

Бір терминалда JavaScript тұтынушысын іске қосыңыз. Басқасында, жалпы транзакцияның уақыт бойынша мәліметтер көрінісін оқыңыз:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Сізге маңызды әрбір транзакция оқиғасы үшін оның криптографиялық хэшін уақыт бойынша деректер көрінісінен табыңыз немесе оны тікелей сұраңыз. Шектеулі бет ескі транзакцияларды өткізіп жіберуі мүмкін. Содан кейін тұтынушыны тоқтатып, қайта іске қосыңыз: ол оқиға идентификаторын бермей қайта қосылуы керек және ауыстырылған ағын ашылғаннан кейін жаңа диагностикалық ақпаратты көрсетуі керек.

## Ақауларды жою {#troubleshooting}

- Жүрек соғу тәрізді пікірлермен байланыс бар, бірақ деректер оқиғалары жоқ байланыс сау болып табылады; таңдалған бағдарламалық жасақтама өңдеу жұмыс ағысының күйі жай ғана тыныш болуы мүмкін.
- `invalid_filter` кодымен келген `400` `filter` Torii мәтіндік грамматикасына сәйкес келмейтінін немесе оқиғалар ағындары қолдамайтын өрісті атайтынын білдіреді. Оқиғалар ағындары `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` және `proof_envelope_hash` өрістері бойынша сүзгіленеді.
- `stream_error` оқиғасы сервер кешігуді немесе ағынның басқа соңғы күйін анықтағанын көрсетеді. Torii бұл оқиғаны бір рет жіберіп, ағынды жабады; алмастырушы ағынды ашыңыз, содан кейін салыстырып тексеріңіз.
- Прокси Torii істемегенде де SSE-ті буферлей алады. Проксидегі жауап буферлеу және қысуды өшіріп, диагностикада `curl -N`-ты сақтаңыз.
- Келесі оқиға алдыңғысынан кейін болады деп ойлап, ажырату саңылауын ешқашан толтырмаңыз. API соңғы нүктеде қайта ойнату курсоры жоқ; оның орнына ағымдағы блокчейн тізілімінің жағдайын сұраңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [JavaScript бекітілген бастапқы код нұсқасында ағындық рецепт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE интеграциялық тесттер бекітілген код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Бекітілген бастапқы код нұсқасындағы Torii сүзгісінің мәтіндік грамматикасы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii бекітілген бастапқы код нұсқасында оқиға бағыттау](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Оқиғалар](/kk/blockchain/events.md)
- [Torii API соңғы нүктелері](/kk/reference/torii-endpoints.md)
- [Блокчейн регистрінің күйін сұрау](./query-ledger-state.md)
