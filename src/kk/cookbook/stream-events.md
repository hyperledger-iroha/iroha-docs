---
translation_locale: kk
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жиналыстар ағыны {#stream-events}

## Нәтижесі {#outcome}

Тікелей Taira құбыр оқиғаларын сервер жіберген оқиғалар (SSE) арқылы тұтыну, шектелген кері қосылу және ауыстыру ағыны ашылғаннан кейін ұзаққа созылған күйді жаңарту. Аяқтық нүктеде қайталау курсоры жоқ болғандықтан, оқиғаларды толық тарихта емес хабарлама ретінде қараңыз.

## Алдын ала талаптар {#prerequisites}

- `curl` қоғамдық темекі сынағы үшін.
- Node.js 24 JavaScript тұтынушы үшін.
- Қолтаңбалаушы қажет емес. `https://taira.sora.org/v1/events/sse` ашық, тек оқуға арналған арна; бұл рецепт Minamoto немесе Taira жазбаларын орындамайды.

## Қадамдар {#steps}

### 1. SSE жауапын растаңыз {#_1-confirm-the-sse-response}

Taira қазіргі уақытта бұл бағытты тек `Accept` тақырыбында артықшылықты оқиғалар ағыны мен JSON керісінше қосылған кезде ғана келіседі. curl буферін өшіріңіз. Бұйрық 15 секундтан кейін аяқталады; тыныш кезең ішінде тек жүрек соғысы ескертулерін қабылдау жарамды.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Жібермеңіз `Last-Event-ID`. Torii Ол ... SSE Endpoint - қайта ойнау журналы емес, тікелей күйеуші ағыны және қайта ойнату сұрақтарын қабылдамайды.

### 2. Фильтрленген JavaScript тұтынушы қосылсын {#_2-add-a-filtered-javascript-consumer}

Келесі `stream-taira.mjs` ретінде сақтаңыз. Ол Fetch-ті тікелей пайдаланады, сондықтан сұрау салу Taira-тің қажетті аралас `Accept` тақырыбын жібере алады. Ағымдағы `FilterExpr` бекітілген транзакция оқиғаларын таңдайды, ал талдаушы қайта ойнау курсорысыз SSE кадрларды жетеді.

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

Оны Taira бойынша кем дегенде бір транзакция `Approved` жеткенше орындаңыз:

```bash
node ./stream-taira.mjs
```

SSE жүрек соққысы ескертулері бос байланыстарды тірі сақтайды, бірақ бухгалтерлік есептің ретін белгілемейді. Блок биіктіктерін, транзакция хэштегін және кітапша сұрақтарын тапсырыс немесе толықтықтың маңызы бар кезде қолданыңыз.

Соңғы 25 зерттеуші сұранысы тек қоғамдық диагностика болып табылады. Өндірістік тұтынушы `reconcile()` -ның орнықты қолдану ресурстары мен бақылау пункті үшін жеткілікті үлкен қалпына келтіру байлығы бойынша сұрау салуларды ауыстыру немесе кеңейтуі керек.

Қайырымдылық жасағанда, `ToriiClient.streamEvents()` тек жіберіледі `Accept: text/event-stream`; тіршілік ету Taira кішігірім бағанды қабылдамайды `406`. Жоғарыда келтірілген шикі " Fetch " нысанын SDK және қоғамдық соңғы нүктелер бірдей медиа түрлерімен келіссөз жүргізеді.

## Тексеру {#verify}

Бір терминалда JavaScript тұтынушысын орындаңыз. Екіншісінде қоғамдық транзакция кескінін оқыңыз:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Сізге маңызды әрбір транзакция оқиғасы үшін, оның хэшін кескінде іздеңіз немесе оны тікелей сұраңыз. шектелген бетте ескі транзакциялар қалдырылуы мүмкін. Содан кейін тоқтатыңыз және тұтынушыны қайта іске қосу: ол ID оқиғасын ұсынбастан қайта қосылуы тиіс және ауыстыру ағыны ашылғаннан кейін жаңа диагностикалық басып шығаруы керек.

## Қиындықтарды шешу {#troubleshooting}

- Жүрек соққысы комментарийлерімен байланыс, бірақ деректер оқиғалары дұрыс емес; таңдалған құбырлық жай ғана тыныш болуы мүмкін.
- `406 Not Acceptable` тікелей эфирде Taira әдетте жарнамаланған сұрау салуды ғана білдіреді `text/event-stream`. Жоғарыда көрсетілгендей `text/event-stream, application/json` жіберіңіз.
- `stream_error` оқиғасы сервер артта қалыпты немесе басқа да терминалдық ағын жағдайын анықтағанын көрсетеді. Torii бұл оқиғаны бір рет жібереді және ағынды жабу; қайта қосылғанға дейін келісім жасаңыз.
- Прокси буфері SSE тіпті Torii емес. Проксиде жауаптарды буферлеу мен қысуды өшіріп, `curl -N` диагностикасында.
- Келесі оқиға алдыңғысынан кейін болады деп болжау арқылы ешқашан қосылымды ажыратуды толтырмаңыз. Қорытынды нүктеде қайта ойнау курсоры жоқ; оның орнына ағымдағы кітапша күйін сұраңыз.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [JavaScript тігілген commit-те ағызу рецепті](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE түйірілген жүктемеде интеграциялық сынақтар](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr түйірілген commit-де талдаушы ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii тіркелген commit-де іс-шараларды бағыттау](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [оқиғалар](/kk/blockchain/events.md)
- [Torii аяқтық нүктелері](/kk/reference/torii-endpoints.md)
- [Сұраныс кітапшасының күйі](./query-ledger-state.md)
