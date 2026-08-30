---
translation_locale: ba
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Тамашалар {#stream-events}

## Һөҙөмтә {#outcome}

Тере Taira торбаһы ваҡиғаларын сервер ебәргән ваҡиғалар аша ҡулланыу (SSE), сикләнгән backkoff менән яңынан тоташтырыу, һәм алмаштырыу ағымы асылғандан һуң оҙайлы торошонда яңыртыу. Һуңғы нөктәлә ҡабатлау курсоры булмағанға күрә, ваҡиғаларҙы тулы тарих түгел, ә хәбәрҙәр итеп ҡарағыҙ.

## Шарттар {#prerequisites}

- `curl` асыҡ тәмәке һынау өсөн.
- Node.js 24 JavaScript ҡулланыусы өсөн.
- Ҡул ҡуйыусы талап ителмәй. `https://taira.sora.org/v1/events/sse` - асыҡ, уҡырға ғына тапшырылған ағым; был рецепт бер ниндәй ҙә Minamoto йәки Taira яҙмаһын үтәй.

## Аҙымдар {#steps}

### 1. SSE реакцияһын раҫлау {#_1-confirm-the-sse-response}

Taira әлеге ваҡытта был маршрут тураһында һөйләшеүҙәр бары тик `Accept` башлыҡ өҫтөнлөклө ваҡиғалар ағымы һәм JSON fallback үҙ эсенә ала. curl буферын һүндерергә. 15 секундтан һуң бойороҡ тамамлана; тыныс ваҡытта йөрәк тибештәре менән генә һөйләшеүҙәр ҡабул ителә.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

ебәрмәгеҙ `Last-Event-ID`. Torii Ул - SSE Endpoint - тере көйәрмән-аут ағымы, реплей журналы түгел, һәм реплей буйынса һорауҙарҙы кире ҡаға.

### 2. фильтрланған JavaScript ҡулланыусыны өҫтәгеҙ. {#_2-add-a-filtered-javascript-consumer}

Түбәндәгеләрҙе һаҡлағыҙ `stream-taira.mjs`. Ул туранан-тура Fetch ҡуллана, шуға күрә үтенесе ебәрергә мөмкин Taira аралаштырыу талап ителә `Accept` баштан. ағым `FilterExpr` раҫланған транзакция ваҡиғаларын һайлай, һәм анализлаусы ҡулланыу SSE Ҡабатлау курсоры булмаған кадрҙар.

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

Taira буйынса бер генә транзакция ла `Approved`ҡа етмәйенсә, уны алып барығыҙ:

```bash
node ./stream-taira.mjs
```

SSE Йөрәк тибеш комментарийҙары буш бәйләнештәрҙе тере килеш һаҡлай, әммә иҫәп яҙмаһын тәртипкә һала алмай. Блок бейеклектәрен, транзакция хэштегтарын һәм иҫәп-хисап ҡағыҙҙары һорауҙарын тәртип йәки тулылыҡ мәсьәләләрен ҡулланыу.

Һуңғы 25 Explorer һорауы тик асыҡ диагностика. етештереү ҡулланыусыһы алмаштырырға йәки киңәйтергә тейеш `reconcile()` уның оҙайлы ҡушымта ресурстары өсөн һорауҙар һәм бойомға ашырыу сикләнгән үҙ контроль пункты өсөн етерлек ҙур. сикләнгән мгновеньшот ғына иҫбат итә алмай, бер ниндәй ҙә ваҡиғалар юғалтылған.

`ToriiClient.streamEvents()` тик `Accept: text/event-stream` ебәрә; тере Taira был тарраҡ башлыҡты `406` менән кире ҡаға. Үҫемле Fetch формаһын ҡулланып, SDK һәм йәмәғәт һуңғы нөктәһе шул уҡ медиа типтары менән һөйләшеүҙәр алып барғансы ҡулланығыҙ.

## Тикшереү {#verify}

Бер терминалда JavaScript ҡулланыусы эшләй, икенсеһендә - асыҡ транзакция фотоһүрәтен уҡый:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Һәр транзакция ваҡиғаһы өсөн һеҙ ҡыҙыҡһынды, уның хэшиғы эҙләү йәки шунда уҡ һорау. сикләнгән битендә иҫке транзакциялар ситтә ҡалдырырға мөмкин. Һуңынан туҡтай һәм ҡулланыусыны ҡайтанан ҡуҙғатыу: ул ID ваҡиғаһы менән тәьмин ителмәйенсә яңынан тоташтырырға тейеш, ә алмашлыҡ ағым асылғандан һуң яңы диагностика баҫтырырға тейеш.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Йөрәк тибеш комментарийҙары менән бәйләнеш, әммә бер ниндәй ҙә мәғлүмәт ваҡиғалары сәләмәт; һайлап алынған үткәргес ҡаҙанышы ябай ғына тын булыуы мөмкин.
- `406 Not Acceptable` тура эфирҙа Taira ғәҙәттә тик иғлан ителгән заявканы аңлата `text/event-stream`. Ебәрегеҙ `text/event-stream, application/json` юғарыла күрһәтелгән кеүек үк.
- `stream_error` ваҡиғаһы серверҙың артта ҡалыуын йәки башҡа терминал ағым торошон асыҡлауын күрһәтә. Torii был ваҡиғаны бер тапҡыр ебәрә һәм ағымды яба; ҡабаттан тоташтырыу алдынан көйләгеҙ.
- Прокси буферлы банка SSE хатта Torii юҡ. Проксиҙа яуапты буферлауҙы һәм ҡыҫырыҡлауҙы һүндерегеҙ һәм `curl -N` диагностикала.
- Бер ҡасан да бәйләнеште өҙөү бушлығын тултырырға тейеш түгел, тип фаразлап, киләһе ваҡиға үткәндән һуң килә. һуңғы нөктәлә ҡабатлау курсоры юҡ; уның урынына ағымдағы иҫәп яҙмаһын һорағыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [JavaScript ҡағыҙланған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs) буйынса трансляция рецепты
- [SSE интеграция һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr финированный commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs) буйынса аналитик
- [Torii ваҡиғалар маршруты ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [ваҡиғалар](/ba/blockchain/events.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Һорауҙар яҙмаһының торошо](./query-ledger-state.md)
