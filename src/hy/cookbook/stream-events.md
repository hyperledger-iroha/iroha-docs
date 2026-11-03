---
translation_locale: hy
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Ծրագրային իրադարձություններ {#stream-events}

## Արդյունքը {#outcome}

Սպառեք կենդանի Taira մշակման շղթայի իրադարձությունները սերվերի կողմից ուղարկված իրադարձությունների վրա (SSE), կրկին կապվեք սահմանափակ backkoff- ի հետ եւ թարմացրեք տեւական վիճակը փոխարինման հոսքը բացելուց հետո: Քանի որ վերջային կետը չունի կրկնօրինակման կուրսոր, դիտեք իրադարձությունները որպես ծանուցումներ, այլ ոչ թե ամբողջական պատմություն:

## Նախադրյալներ {#prerequisites}

- `curl` հանրային ծխի փորձարկման համար:
- Node.js 24 համար JavaScript սպառողին:
- Ոչ մի ստորագրող չի պահանջվում: `https://taira.sora.org/v1/events/sse` հանդիսանում է հանրային, միայն ընթերցվող հոսք. այս բաղադրատոմսը չի կատարում ոչ մի Minamoto կամ Taira գրություն:

## Քայլեր {#steps}

### 1. Հաստատեք SSE արձագանքը {#_1-confirm-the-sse-response}

Պահանջեք իրադարձությունների հոսքը JSON պահուստային տարբերակով: Torii-ն հոսքը փոխանցում է `text/event-stream` ձևաչափով, իսկ մերժված հարցումը, օրինակ՝ անվավեր ֆիլտրը, հայտնում է որպես JSON սխալ։ Անջատեք curl-ի բուֆերացումը։ Հրամանն ավարտվում է 20 վայրկյանից հետո։ Torii-ն 15 վայրկյան անգործությունից հետո ուղարկում է heartbeat մեկնաբանություն, ուստի հանգիստ ժամանակահատվածում միայն heartbeat մեկնաբանություններ ստանալը նորմալ է։

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Մի ուղարկեք `Last-Event-ID`: Torii-ի SSE վերջային կետը կենդանի երկրպագուային հոսք է, այլ ոչ թե կրկնօրինակ արձանագրություն, եւ մերժում է կրկնօրինակման պահանջները:

### 2. Ավելացրեք ֆիլտրված JavaScript սպառող {#_2-add-a-filtered-javascript-consumer}

Պահպանեք հետևյալը որպես `stream-taira.mjs`։ Այն ուղղակիորեն օգտագործում է Fetch՝ փոխանցման ձևաչափը ցույց տալու համար։ `filter` հարցման պարամետրն օգտագործում է Torii-ի տեքստային ֆիլտրի քերականությունը՝ հաստատված գործարքների իրադարձություններն ընտրելու համար, իսկ վերլուծիչը մշակում է SSE կադրերը՝ առանց վերարտադրման կուրսորի։

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

Գործարկեք այն, մինչեւ առնվազն մեկ գործարքը հասնի `Approved` Taira:

```bash
node ./stream-taira.mjs
```

SSE սրտի կոտրված մեկնաբանությունները պահում են անօգնական կապերը կենդանի, բայց չեն հաստատում գլխավոր գրքի կարգավորումը: Օգտագործեք բլոկի բարձրություններ, գործարքների շիշեր եւ գլխավոր գրկի հարցումներ, երբ կարգը կամ ամբողջականությունը կարեւոր է:

Վերջին 25 հետազոտողի խնդրանքն ընդամենը հանրային ախտորոշում է: Արտադրման սպառողը պետք է փոխարինի կամ ընդլայնի `reconcile()` իր կայուն կիրառման ռեսուրսների հարցումներով եւ բավականաչափ մեծ վերականգնման սահմանով, որը բավարար է իր ստուգման կետի համար: Միայն սահմանափակ արձանագրությունը չի կարող ապացուցել, որ որեւէ իրադարձություն չի բաց թողնվել։

`@iroha/iroha-js`-ի `ToriiClient.streamEvents({ filter })`-ը կարդում է նույն հոսքը: փոխանցեք `field('tx_status').eq('Approved')` կամ վերևի տեքստային ֆիլտրը։ Հոսքի ավարտից առաջ այն տրամադրում է վերջնական `stream_error` կադրը, ուստի վերևում նկարագրված վերամիացման և համաձայնեցման կանոնները շարունակում են գործել։

## Փորձարկել {#verify}

Մեկ տերմինալում գործարկեք JavaScript սպառող, մյուսում կարդացեք հանրային գործարքի ակնթարթական նկարը.

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Ցանկացած գործարքի իրադարձության համար, որը ձեզ հետաքրքրում է, գտնեք դրա hash- ը ակնթարթային նկարում կամ ուղղակիորեն կատարեք հարցում այն: սահմանված էջը կարող է բաց թողնել ավելի հին գործարքները: Այնուհետեւ դադարեցրեք եւ վերսկսել սպառողին. այն պետք է վերապակցվի առանց իրադարձության մատակարարման ID եւ պետք է տպագրի նոր ախտորոշում, երբ բացվի փոխարինիչ հոսքը:

## Խնդիրների լուծում {#troubleshooting}

- Կապը սրտի կոտրման մեկնաբանությունների հետ, բայց ոչ մի տվյալների իրադարձություն առողջ է: Ընտրված մշակման շղթայի կարգավիճակը կարող է պարզապես լռել:
- `invalid_filter` կոդով `400`-ը նշանակում է, որ `filter`-ը չի համապատասխանում Torii-ի տեքստային քերականությանը կամ նշում է դաշտ, որը իրադարձությունների հոսքերը չեն աջակցում։ Իրադարձությունների հոսքերը ֆիլտրում են ըստ `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` և `proof_envelope_hash` դաշտերի։
- `stream_error` իրադարձությունը ցույց է տալիս, որ սերվերը հայտնաբերել է ուշացում կամ հոսքի այլ վերջնական վիճակ։ Torii-ն այդ իրադարձությունն ուղարկում է մեկ անգամ և փակում հոսքը; բացեք փոխարինող հոսք, ապա կատարեք համաձայնեցում։
- Պրոքսի կարող է բուֆեր SSE նույնիսկ, երբ Torii չի անում: Անջատեք արձագանքային բուֆերը եւ սեղմումը պրոկսիում, եւ պահեք `curl -N` ախտորոշման մեջ:
- Երբեք մի լրացրեք անջատման բացակայություն ՝ ենթադրելով, որ հաջորդ իրադարձությունը հետեւում է նախորդին: Վերջնական կետը չունի կրկնօրինակման կուրսոր. Փոխարենը կատարեք հարցում ընթացիկ գլխավոր գրքի վիճակը:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [JavaScript հոսքային բաղադրատոմս փակված commit- ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs):
- [SSE ինտեգրման փորձարկումները փակված commit-ի վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Torii-ի ֆիլտրի տեքստային քերականությունը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii իրադարձության երթեւեկությունը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Տեղեկատվություն](/hy/blockchain/events.md)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md)
- [Հարցման գլխավոր գրքի վիճակը](./query-ledger-state.md)
