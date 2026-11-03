---
translation_locale: ba
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Тамашалар {#stream-events}

## Һөҙөмтә {#outcome}

Тере Taira pipeline ваҡиғаларын сервер ебәргән ваҡиғалар аша ҡулланыу (SSE), сикләнгән backkoff менән яңынан тоташтырыу, һәм алмаштырыу ағымы асылғандан һуң оҙайлы торошонда яңыртыу. Һуңғы нөктәлә ҡабатлау курсоры булмағанға күрә, ваҡиғаларҙы тулы тарих түгел, ә хәбәрҙәр итеп ҡарағыҙ.

## Шарттар {#prerequisites}

- `curl` асыҡ smoke test өсөн.
- Node.js 24 JavaScript ҡулланыусы өсөн.
- Ҡул ҡуйыусы талап ителмәй. `https://taira.sora.org/v1/events/sse` - асыҡ, уҡырға ғына тапшырылған ағым; был рецепт бер ниндәй ҙә Minamoto йәки Taira яҙмаһын үтәй.

## Аҙымдар {#steps}

### 1. SSE реакцияһын раҫлау {#_1-confirm-the-sse-response}

Ваҡиғалар ағымын JSON запас варианты менән һорағыҙ: Torii `text/event-stream` ағымын ебәрә, ә кире ҡағылған һорауҙы, мәҫәлән, дөрөҫ булмаған фильтрҙы, JSON хатаһы итеп хәбәр итә. curl буферлауын һүндерегеҙ. Команда 20 секундтан һуң тамамлана. Torii 15 секунд эшһеҙ торғандан һуң йөрәк тибеше комментарийын ебәрә, шуға күрә тын осорҙа тик йөрәк тибеше комментарийҙарын ғына алыу — дөрөҫ һөҙөмтә.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

ебәрмәгеҙ `Last-Event-ID`. Torii Ул - SSE Endpoint - тере көйәрмән-аут ағымы, реплей журналы түгел, һәм реплей буйынса һорауҙарҙы кире ҡаға.

### 2. фильтрланған JavaScript ҡулланыусыны өҫтәгеҙ. {#_2-add-a-filtered-javascript-consumer}

Түбәндәгене `stream-taira.mjs` итеп һаҡлағыҙ. Ул селтәр аша тапшырыу форматын күрһәтер өсөн Fetch-ты туранан-тура ҡуллана. `filter` һорау параметры раҫланған транзакция ваҡиғаларын һайлау өсөн Torii-ҙың текст фильтр грамматикаһын ҡуллана, ә анализатор SSE кадрҙарын ҡабатлау курсорһыҙ эшкәртә.

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

Taira буйынса бер генә транзакция ла `Approved`ҡа етмәйенсә, уны алып барығыҙ:

```bash
node ./stream-taira.mjs
```

SSE Йөрәк тибеш комментарийҙары буш бәйләнештәрҙе тере килеш һаҡлай, әммә иҫәп яҙмаһын тәртипкә һала алмай. Блок бейеклектәрен, транзакция хештарын һәм иҫәп-хисап ҡағыҙҙары һорауҙарын тәртип йәки тулылыҡ мәсьәләләрен ҡулланыу.

Һуңғы 25 Explorer һорауы тик асыҡ диагностика. етештереү ҡулланыусыһы алмаштырырға йәки киңәйтергә тейеш `reconcile()` уның оҙайлы ҡушымта ресурстары өсөн һорауҙар һәм бойомға ашырыу сикләнгән үҙ контроль пункты өсөн етерлек ҙур. сикләнгән мгновеньшот ғына иҫбат итә алмай, бер ниндәй ҙә ваҡиғалар юғалтылған.

`@iroha/iroha-js` пакетындағы `ToriiClient.streamEvents({ filter })` шул уҡ ағымды уҡый: уға `field('tx_status').eq('Approved')` йәки өҫтәге текст фильтрын бирегеҙ. Ул ағым тамамланғансы аҙаҡҡы `stream_error` кадрын бирә, шуға күрә өҫтәге ҡабат тоташыу һәм тикшереп килештереү ҡағиҙәләре һаман да ғәмәлдә.

## Тикшереү {#verify}

Бер терминалда JavaScript ҡулланыусы эшләй, икенсеһендә - асыҡ транзакция снапшотын уҡый:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Һәр транзакция ваҡиғаһы өсөн һеҙ ҡыҙыҡһынды, уның хэшиғы эҙләү йәки шунда уҡ һорау. сикләнгән битендә иҫке транзакциялар ситтә ҡалдырырға мөмкин. Һуңынан туҡтай һәм ҡулланыусыны ҡайтанан ҡуҙғатыу: ул ID ваҡиғаһы менән тәьмин ителмәйенсә яңынан тоташтырырға тейеш, ә алмашлыҡ ағым асылғандан һуң яңы диагностика баҫтырырға тейеш.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Йөрәк тибеш комментарийҙары менән бәйләнеш, әммә бер ниндәй ҙә мәғлүмәт ваҡиғалары сәләмәт; һайлап алынған үткәргес ҡаҙанышы ябай ғына тын булыуы мөмкин.
- `invalid_filter` коды менән `400` яуабы `filter` Torii-ҙың текст грамматикаһына тап килмәүен йәки ваҡиғалар ағымдары танымаған яланды атауын аңлата. Ваҡиғалар ағымдары `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` һәм `proof_envelope_hash` буйынса фильтрлай.
- `stream_error` ваҡиғаһы серверҙың артта ҡалыуҙы йәки ағымдың башҡа аҙаҡҡы торошон асыҡлағанын күрһәтә. Torii был ваҡиғаны бер тапҡыр ебәрә һәм ағымды яба; алмашҡа яңы ағым асығыҙ, һуңынан тикшереп килештерегеҙ.
- Прокси буферлы банка SSE хатта Torii юҡ. Проксиҙа яуапты буферлауҙы һәм ҡыҫырыҡлауҙы һүндерегеҙ һәм `curl -N` диагностикала.
- Бер ҡасан да бәйләнеште өҙөү бушлығын тултырырға тейеш түгел, тип фаразлап, киләһе ваҡиға үткәндән һуң килә. һуңғы нөктәлә ҡабатлау курсоры юҡ; уның урынына ағымдағы иҫәп яҙмаһын һорағыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [JavaScript ҡағыҙланған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs) буйынса трансляция рецепты
- [SSE интеграция һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Ҡуйылған commit-тағы Torii фильтрының текст грамматикаһы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii ваҡиғалар маршруты ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [ваҡиғалар](/ba/blockchain/events.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Һорауҙар яҙмаһының торошо](./query-ledger-state.md)
