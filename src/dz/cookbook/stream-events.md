---
translation_locale: dz
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# འགྱུར་བ་ཚུ་ རྒྱུན་འགྲུལ་འཐབ་ནི་ {#stream-events}

## གྲུབ་འབྲས་ {#outcome}

ཁྱོད་ཀྱིས་ Taira གློག་ཐག་ར་བ་གི་བྱུང་རྐྱེན་ཚུ་ Server-བཏང་བའི་ནང་ལུ་ལག་ལེན་འཐབ་ནི་ (SSE), མཐའ་ཟུར་ backkoff དང་གཅིག་ཁར་སླར་ལོག་འབད་ནི་དང་ བསྒྱུར་བཅོས་ཆུ་རྒྱུན་སྒོ་ཕྱེ་ཚར་ཞིནམ་ལས་དུས་ཡུན་རིང་པོའི་གནས་སྟངས་ལུ་བསྐྱར་གསོ་འབད་.མཇུག་མཐའན་མཇུག་ལུ་ སླར་འཁྱོལ་སའི་ ཀུར་སོར་མེད་ནི་འདི་གིས་བྱུང་རྐྱེན་ཚུ་ བརྡ་དོན་གྱི་ཚབ་ལུ་ ཡོངས་འབྲེལ་འབྱུང་རབས་ཅིག་སྦེ་རྩིས་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- མི་མང་གི་དུ་པ་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ `curl`
- Node.js 24 གིས་ JavaScript ཟ་མི་གི་དོན་ལུ་ཨིན།
- ཐོ་བཀོད་མི་ཅིག་ཡང་ དགོཔ་མེདཔ། `https://taira.sora.org/v1/events/sse`འདི་ མི་མང་གི་ལྷག་ཐངས་རྐྱངམ་གཅིག་ཨིན། འ་ནི་བཀོད་རྒྱ་འདི་གིས་ Minamoto ཡང་ན་ Taira ཡིག་ཆ་ཚུ་མ་འབྲི་ཚུགས།

## རིམ་པ་ཚུ་ {#steps}

### ༡. SSE གི་ལན་འདི་ངོས་ལེན་འབད། {#_1-confirm-the-sse-response}

Taira གིས་ད་ལྟོའི་བར་ན་ཡང་ ལམ་འདི་སེལ་འཐུ་འབད་དོ་ཡོདཔ་ད་ `Accept` གྱི་ཨེབ་རྟ་ནང་ གདམ་ཁ་ཅན་གྱི་འབྱུང་རིམ་དང་ JSON གི་རྒྱབ་སྐྱོར་ཆ་མཉམ་ཚུད་ཡོདཔ་ཨིན། curl བཕ་ར་བཟོ་བཞག་མ་གཏང་། བཀའ་རྒྱ་དེ་ དུས་ཡུན་སྐར་མ་༡༥ གི་ཤུལ་ལས་མཇུག་བསྡུ་ནི་ཨིན། ཞི་བདེ་གི་དུས་ལུ་ སེམས་ཀྱི་ལྡིར་བའི་བརྡ་དོན་རྐྱངམ་གཅིག་ཐོབ་ནི་དེ་ ཆ་གནས་ཡོདཔ་ཨིན།

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

བཏང་མ་གཏང་ `Last-Event-ID`. Torii འདི་ SSE མཐའ་མཇུག་གི་སྒོ་དེ་ fan-out རྒྱུན་འགྲུལ་འཐབ་ནི་ཨིནམ་ལས་ replay log འདི་མེན་ དེ་ལས་ replay request འདི་མ་བཏུབ་ཨིན།

### 2. ཕི་ལཊར་འབད་མི་ JavaScript མཁོ་ཆས་བཙུགས་ནི། {#_2-add-a-filtered-javascript-consumer}

འོག་གི་བཀོད་འདི་ `stream-taira.mjs`སྦེ་སྤོ་བཤུད་འབད། འདི་གིས་ Fetch ཐད་ཀར་དུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ལས་ ཞུ་བ་འདི་གིས་ Taira གི་ དགོས་མཁོ་ཅན་གྱི་རྫོགསཔ་ `Accept` མགོ་ཡིག་བཏང་ཚུགས། ད་ལྟོའི་ `FilterExpr` གིས་ ངོས་འཛིན་འབད་ཡོད་པའི་ བྱ་བའི་གནད་དོན་ཚུ་ གདམ་ཁ་རྐྱབས། དེ་ལས་ བརྟག་ཞིབ་འཕྲུལ་ཆས་འདི་གིས་ ལོག་སྤྱོད་འབད་ནིའི་ ཀུར་སོར་མེད་པར་ SSE སྒྲོམ་ལག་ལེན་འཐབ་ཨིན།

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

Taira ལུ་ འབྲེལ་གཏད་ཉུང་ཤོས་ཅིག་གིས་ `Approved` ལུ་མ་ལྷོད་ཚུན་ཚོད་ བཏོན་གཏང་།

```bash
node ./stream-taira.mjs
```

SSE heartbeat comments གིས་ འབྲེལ་མཐུད་འབད་མ་ཚུགསཔ་ཅིག་བཟོཝ་ཨིན་ དེ་འབདཝ་ད་ ལེ་ཌཇར་གྱི་རིམ་སྒྲིག་ཚུ་ གཞི་བཙུགས་མི་འབདཝ་ཨིན། རིམ་སྒྲིག་འབད་ནི་དང་ ཡོངས་རྫོགས་འབད་ནི་ལུ་ གནད་དོན་ཁག་ཆེ་བའི་སྐབས་ལུ་ བཀྲིས་སྒང་མཐོ་ཚད་དང་ བྱ་སྟབས་མ་བདེཝ་དང་ ལེ་ཌཇི་གི་དྲི་བ་ཚུ་ ལག་ལེན་འཐབ་ཨིན།

བརྟག་ཞིབ་འབད་མི་ཚུ་གི་ ཞུ་བ་འདི་ མི་མང་གི་བརྟག་དཔྱད་རྐྱངམ་གཅིག་ཨིན། བཟོ་སྐྲུན་གྱི་ལག་ལེན་པ་གིས་ `reconcile()` ཕྱིར་འབུད་འབད་ནི་དང་ གནས་ཡུན་རིངམོ་སྦེ་ ལག་ལེན་འཐབ་ནིའི་ ཐོན་ཁུངས་དང་ བསྐྱར་གསོ་འབད་ནི་གི་ ཐབས་ལམ་ཚུ་ བསྒྱུར་བཅོས་འབད་དགོཔ་ཨིན། བསྐྱར་ཞིབ་འབད་མི་ཚུ་རྐྱངམ་གཅིག་གིས་ བྱ་སྟབས་མ་བདེཝ་ག་ནི་ཡང་ མིན་འདུག་ཟེར་ རྩ་འགེངས་མི་ཚུགས་ཡོདཔ་ཨིན།

ཐོ་བཀོད་ཐོ་བཀོད་ནང་ལུ་ `ToriiClient.streamEvents()` གིས་རྐྱངམ་ཅིག་ `Accept: text/event-stream` བཏང་ཨིན། ཕྲ་རིང་གི་ Taira གིས་ `406`དང་གཅིག་ཁར་ དུམ་གྲ་ཅིག་གི་ཨེབ་རྟ་འདི་མ་བཏུབ། ཁྱོད་ཀྱིས་ཁ་གོང་ལུ་ཡོད་པའི་ raw Fetch form ལག་ལེན་འཐབ་སྟེ་ SDK དང་ public endpointགིས་ བརྡ་བརྒྱུད་དབྱེ་བ་དེ་འདྲ་མཉམ་སྦེ་ གྲོས་བསྟུན་མ་འབད་བར་སྡོད་ပါ။

## བརྟག་དཔྱད་འབད་ {#verify}

ཊེ་མན་གཅིག་ནང་ལུ་ JavaScript མཁོ་འདོད་ཅན་འདི་ལག་ལེན་འཐབ་། གཞན་གཅིག་ནང་ལུ་ མི་མང་གི་ཚོང་འབྲེལ་གྱི་གློག་བརྙན་འདི་བལྟ་:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

འབྲེལ་གཏད་ཀྱི་བྱུང་རྐྱེན་རེ་གི་དོན་ལུ་ ཁྱོད་ཀྱིས་ཚ་གྱང་ལང་དགོ་པ་ཅིན་ ཨེབ་ལྡེ་འདི་ snapshot ནང་འཚོལ་ ཡང་ན་ ཐད་ཀར་དུ་དྲི་བ་དྲིས་ལན། ཡོངས་བསྡོམས་འབད་ཡོད་པའི་ཤོག་ལེབ་འདི་གིས་ ཧེ་མ་གི་ཚོང་འབྲེལ་ཚུ་སེལ་འཐུ་འབད་ཚུགས། དེ་ལས་མཚམས་བཞག་ དེ་ལས་ ཚོང་མགྲོན་པ་ལུ་ སླར་ལོག་འགོ་བཙུགསཔ་ད་ བྱུང་རྐྱེན་ ID མ་བྱིན་པར་ ལོག་མཐུད་སྦྲེལ་འབད་དགོཔ་མ་ཚད་ བསྒྱུར་བཅོས་ལམ་སྒོ་ཕྱེ་བའི་ཤུལ་ལས་ གསལ་སྟོན་གསར་པ་ཅིག་ གསར་བཏོན་འབད་དགོཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- སྙིང་སྟོབས་ཀྱི་དཔྱད་ཡིག་ཚུ་དང་འབྲེལ་བའི་ མཐུད་སྦྲེལ་འབད་ནི་དེ་མ་གཏོགས་ གནད་དོན་ག་ཅི་ཡང་འབྱུང་ནི་མེད་ཟེར་ གསལ་ཏོག་ཏོ་སྦེ་སྟོན་དོ་ཡོདཔ་ལས་ སེལ་འཐུ་འབད་ཡོད་མི་ གློག་ཐག་ར་བ་གི་གནས་སྟངས་འདི་ ཁུ་སིམ་སི་སྦེ་ར་ བཞག་ཚུགས་འོང་།
- `406 Not Acceptable` ཕྲང་ལམ་ནང་ Taira གིས་ སྤྱིར་བཏང་ལུ་ གསལ་བསྒྲགས་འབད་ཡོད་པའི་ཞུ་ཡིག་འདི་རྐྱངམ་ཅིག་ `text/event-stream` ཟེར་སླབ་ཨིན། ཡར་བཀོད་ནང་སྟོན་དོ་བཟུམ་སྦེ་ `text/event-stream, application/json` བཏང་གཏང་།
- `stream_error` བྱུང་རྐྱེན་གྱིས་ ཞབས་ཏོག་གིས་དུས་ཡུན་ཐུང་ཀུ་ ཡང་ན་ མཐའ་མཇུག་གི་རྒྱུགས་ཀྱི་གནས་སྟངས་གཞན་ཅིག་མཐོང་མི་འདི་སྟོན་འབདཝ་ཨིན། Torii འདི་ཚར་གཅིག་བཏང་ཞིནམ་ལས་རྒྱུགས་དེ་བཏོག་གཏང་ཨིན། སླར་ལོག་མཐུད་མ་འབད་པའི་ཧེ་མར་ མཐུན་ལམ་བཟོ་དགོ།
- Proxy གིས་ SSE བཀྲམ་སྤེལ་འབད་ཚུགས་ནི་ཨིནམ་ད་ Torii འབད་མ་ཚུགསཔ་ཨིན། བཀྲ་སྤེལ་དང་ལྡནམ་སྦེ་ བཀྲམ་བཟོཝ་ད་ proxy ནང་ལུ་ བཀྲམ་སྟོན་འབད་ནི་དང་ བཀྲམ་རྐྱབས་ཚུགས། དེ་ལས་ diagnostics ལུ་ `curl -N` བཞག་འོང་།
- ཤུལ་མའི་བྱུང་རྐྱེན་འདི་ སྔོན་བྱོན་གི་ཤུལ་ལས་འབྱུང་འོང་ཟེར་ མནོ་བསམ་བཏང་སྟེ་ རྟག་བུ་རང་ བསྡུ་མ་བཞག་པར་སྡོད་དགོ། མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ནང་ལུ་ སླར་ལོག་འབད་ནིའི་ ཀུར་སོར་མེདཔ་ཨིན། འདི་ཚབ་ལུ་ ད་ལྟོའི་ལག་དེབ་ཀྱི་ གནས་སྟངས་འདི་དྲིས་འོང་།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [JavaScript སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 1 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 5 སྔོན་ལ་གསར་བཅོས་བྱས།](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs) ལུ་འབདཝ་ཨིན།
- [Torii FilterExpr བརྟག་ཞིབ་འབད་ཐངས་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii རྒྱུན་བསྡུར་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs) ལུ་བྱུང་རྐྱེན་ལམ་སྟོན་འབདཝ་ཨིན།
- [གནད་དོན་ཚུ་](/dz/blockchain/events.md)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
- [འབྲི་ཤོག་གི་གནས་གོང་](./query-ledger-state.md)
