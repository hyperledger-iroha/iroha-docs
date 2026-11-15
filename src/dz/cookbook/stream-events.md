---
translation_locale: dz
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# འགྱུར་བ་ཚུ་ རྒྱུན་འགྲུལ་འཐབ་ནི་ {#stream-events}

## གྲུབ་འབྲས་ {#outcome}

ཁྱོད་ཀྱིས་ Taira གློག་ཐག་ར་བ་གི་བྱུང་རྐྱེན་ཚུ་ ཞབས་ཏོག་སྤྲོད་མི-བཏང་བའི་ནང་ལུ་ལག་ལེན་འཐབ་ནི་ (SSE), མཐའ་ཟུར་ ཕྱིར་འགྱངས དང་གཅིག་ཁར་སླར་ལོག་འབད་ནི་དང་ བསྒྱུར་བཅོས་རྒྱུན་སྒོ་ཕྱེ་ཚར་ཞིནམ་ལས་དུས་ཡུན་རིང་པོའི་གནས་སྟངས་ལུ་བསྐྱར་གསོ་འབད་.མཇུག་མཐའན་མཇུག་ལུ་ སླར་འཁྱོལ་སའི་ ཀུར་སོར་མེད་ནི་འདི་གིས་བྱུང་རྐྱེན་ཚུ་ བརྡ་དོན་གྱི་ཚབ་ལུ་ ཡོངས་འབྲེལ་འབྱུང་རབས་ཅིག་སྦེ་རྩིས་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- མི་མང་ཐ་མག་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ `curl` ཨིན།
- JavaScript སྤྱོད་མི གི་དོན་ལུ་ Node.js 24།
- ཐོ་བཀོད་མི་ཅིག་ཡང་ དགོཔ་མེདཔ། `https://taira.sora.org/v1/events/sse`འདི་ མི་མང་གི་ལྷག་ཐངས་རྐྱངམ་གཅིག་ཨིན། འ་ནི་བཀོད་རྒྱ་འདི་གིས་ Minamoto ཡང་ན་ Taira ཡིག་ཆ་ཚུ་མ་འབྲི་ཚུགས།

## རིམ་པ་ཚུ་ {#steps}

### ༡. SSE གི་ལན་འདི་ངོས་ལེན་འབད། {#_1-confirm-the-sse-response}

བྱུང་ལས་རྒྱུན་ལམ་འདི་ JSON ཚབ་ལམ་དང་གཅིག་ཁར་ ཞུ། Torii གིས་ `text/event-stream` རྒྱུན་ལམ་སྦེ་ གཏངམ་ཨིནམ་དང་ ནུས་མེད་ཚགས་མ་ཅིག་བཟུམ་གྱི་ བཀག་ཆ་འབད་ཡོད་པའི་ ཞུ་བ་ཅིག་ JSON འཛོལ་བ་སྦེ་ སྙན་ཞུ་འབདཝ་ཨིན། curl གི་ གནས་སྐབས་གསོག་འཇོག་ ལྕོགས་མིན་བཟོ། བཀའ་རྒྱ་འདི་ སྐར་ཆ་ 20 གི་ཤུལ་ལས་ མཇུག་བསྡུཝ་ཨིན། Torii གིས་ ལཱ་མེད་པའི་ སྐར་ཆ་ 15 གི་ཤུལ་ལས་ སྙིང་འཕར་མཆན་ཅིག་ གཏངམ་ཨིན། དེ་འབདཝ་ལས་ ཁུ་སིམ་སིམ་གི་ དུས་ཡུན་ནང་ སྙིང་འཕར་མཆན་རྐྱངམ་ཅིག་ ཐོབ་མི་འདི་ ཆ་གནས་ཅན་ཨིན།

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

བཏང་མ་གཏང་ `Last-Event-ID`. Torii འདི་ SSE མཐའ་མཇུག་གི་སྒོ་དེ་ ཡན་ལག་ཁ་གྲམ རྒྱུན་འགྲུལ་འཐབ་ནི་ཨིནམ་ལས་ བསྐྱར་གཏང དྲན་ཐོ འདི་མེན་ དེ་ལས་ བསྐྱར་གཏང ཞུ་བ འདི་མ་བཏུབ་ཨིན།

### 2. ཕི་ལཊར་འབད་མི་ JavaScript མཁོ་ཆས་བཙུགས་ནི། {#_2-add-a-filtered-javascript-consumer}

འོག་གི་ཡིག་ཆ་འདི་ `stream-taira.mjs` སྦེ་ སྲུང་བཞག་འབད། དེ་གིས་ དྲ་རྒྱ་བརྒྱུད་འཕྲིན་གྱི་ རྣམ་གཞག་ སྟོན་ནིའི་དོན་ལུ་ Fetch ཐད་ཀར་དུ་ ལག་ལེན་འཐབ་ཨིན། `filter` དྲི་དཔྱད་ཚད་བཟུང་འདི་གིས་ ཆ་འཇོག་འབད་ཡོད་པའི་ ཚོང་འབྲེལ་བྱུང་ལས་ཚུ་ སེལ་འཐུ་འབད་ནི་ལུ་ Torii གི་ ཡིག་ཐོག་ཚགས་མའི་བརྡ་སྤྲོད་ ལག་ལེན་འཐབ་ཨིན། དབྱེ་དཔྱད་འབད་མི་གིས་ SSE གཞི་ཁྲམ་ཚུ་ བསྐྱར་གཏང་འོད་རྟགས་ མེད་པར་ ལེན་ཏེ་ ལག་ལེན་འཐབ་ཨིན།

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

Taira ལུ་ འབྲེལ་གཏད་ཉུང་ཤོས་ཅིག་གིས་ `Approved` ལུ་མ་ལྷོད་ཚུན་ཚོད་ བཏོན་གཏང་།

```bash
node ./stream-taira.mjs
```

SSE སེམས་ཀྱི་འཕར་རྩའི་བསམ་འཆར་གྱིས་ ལཱ་མེད་པའི་མཐུད་ལམ་ཚུ་ གསོན་པོ་སྦེ་བཞགཔ་ཨིན་རུང་ བཀག་ཆ་ཅན་གྱི་རྩིས་ཐོ་བཀོད་སྒྲིག་གཞི་བཙུགས་མི་འབད། གོ་རིམ་ཡང་ན་ མཇུག་བསྡུའི་གནད་དོན་སྐབས་ སྡེབ་ཚན་མཐོ་ཚད་དང་ བརྗེ་སོར་ཀིརིཔ་ཊོ་གཱ་ར་ཕིག་ཧ་ཤི་ཚུ་ དེ་ལས་ སྡེབ་ཚན་ལེ་ཇར་འདྲི་དཔྱད་ཚུ་ལག་ལེན་འཐབ།

མཐའ་མའི་-༢༥ འཚོལ་ཞིབ་ཀྱི་ཞུ་བ་འདི་ མི་མང་བརྟག་དཔྱད་རྐྱངམ་ཅིག་ཨིན། བཟོ་བསྐྲུན་ཉོ་སྤྱོད་པ་ཅིག་གིས་ `reconcile()` འདི་ དེ་གི་ཐུབ་ཚད་ཅན་གྱི་འཇུག་སྤྱོད་ཐོན་ཁུངས་ཚུ་གི་དོན་ལུ་ འདྲི་དཔྱད་ཚུ་དང་ དེ་གི་ཞིབ་དཔྱད་ས་ཚིགས་ཀྱི་དོན་ལུ་ ལངམ་སྦེ་ཡོད་པའི་ སླར་གསོའི་མཐུད་མཚམས་ཅིག་དང་གཅིག་ཁར་ ཚབ་བཙུགས་དགོཔ་ཡང་ན་ རྒྱ་བསྐྱེད་འབད་དགོ། ཚད་འཛིན་འབད་ཡོད་པའི་པར་འདི་རྐྱངམ་ཅིག་གིས་ བྱུང་ལས་ག་ནི་ཡང་མ་བརླག་སྟོར་ཞུགས་ཡོདཔ་སྦེ་ བདེན་ཁུངས་བཀལ་མི་ཚུགས།

`@iroha/iroha-js` ལས་ཡོད་པའི་ `ToriiClient.streamEvents({ filter })` གིས་ རྒྱུན་ལམ་གཅིག་པ་དེ་ ལྷགཔ་ཨིན། `field('tx_status').eq('Approved')` ཡང་ན་ གོང་གི་ ཡིག་ཐོག་ཚགས་མ་ བྱིན། དེ་གིས་ རྒྱུན་ལམ་ མ་རྫོགས་པའི་ཧེ་མ་ མཐའ་མཇུག་གི་ `stream_error` གཞི་ཁྲམ་འདི་ བྱིནམ་ཨིན། དེ་འབདཝ་ལས་ གོང་གི་ ལོག་མཐུད་དང་ མཐུན་སྒྲིག་གི་ ལམ་ལུགས་ཚུ་ ད་ལྟོ་ཡང་ འཇུག་སྤྱོད་འབདཝ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

ཊེ་མན་གཅིག་ནང་ལུ་ JavaScript མཁོ་འདོད་ཅན་འདི་ལག་ལེན་འཐབ་། གཞན་གཅིག་ནང་ལུ་ མི་མང་གི་ཚོང་འབྲེལ་གྱི་གནས་སྟངས་འདྲ་བཤུས་འདི་བལྟ་:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

ཁྱོད་ཀྱིས་བརྩི་མཐོང་ཡོད་པའི་ཚོང་འབྲེལ་བྱུང་ལས་རེ་རེ་གི་དོན་ལུ་ པར་རིས་ནང་ལུ་ དེ་གི་ཧ་ཤི་འདི་འཚོལ་ཞིབ་འབད་ནི་ཡང་ན་ ཐད་ཀར་དུ་འདྲི་དཔྱད་འབད། ཚད་འཛིན་འབད་ཡོད་པའི་ཤོག་ལེབ་འདི་གིས་ ཚོང་འབྲེལ་རྙིངམ་ཚུ་བཏོན་བཏང་ཚུགས། དེ་ལས་ ཉོ་སྤྱོད་པ་འདི་བཀག་ཞིནམ་ལས་ ལོག་འགོ་བཙུགསཔ་ཨིན་: དེ་གིས་ བྱུང་ལས་ཨའི་ཌི་བཀྲམ་སྤེལ་མ་འབད་བར་ ལོག་སྟེ་མཐུད་དགོཔ་དང་ ཚབ་བཙུགས་རྒྱུན་ལམ་ཁ་ཕྱེ་བའི་ཤུལ་ལས་ བརྟག་དཔྱད་གསརཔ་ཅིག་དཔར་བསྐྲུན་འབད་དགོ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- སེམས་ཀྱི་འཕར་རྩའི་བསམ་འཆར་ཚུ་དང་འབྲེལ་བ་ཡོད་རུང་ གནད་སྡུད་བྱུང་རིམ་ཚུ་ གསོ་བའི་དོན་ལུ་ཨིན། སེལ་འཐུ་འབད་ཡོད་པའི་ མདོང་ལམ་གནས་ཚད་འདི་ འཇམ་ཏོང་ཏོ་སྦེ་ ཁུ་སིམ་སིམ་འོང་།
- `invalid_filter` ཨང་རྟགས་དང་གཅིག་ཁར་ `400` འབྱུང་པ་ཅིན་ `filter` འདི་ Torii གི་ ཡིག་ཐོག་བརྡ་སྤྲོད་དང་ མ་མཐུནམ་ ཡང་ན་ བྱུང་ལས་རྒྱུན་ལམ་ཚུ་གིས་ རྒྱབ་སྐྱོར་མི་འབད་མི་ ས་སྒོ་ཅིག་གི་མིང་ བཏགས་ཡོདཔ་སྦེ་ སྟོནམ་ཨིན། བྱུང་ལས་རྒྱུན་ལམ་ཚུ་གིས་ `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash`, དང་ `proof_envelope_hash` གུ་ ཚགས་མ་བཙུགསཔ་ཨིན།
- `stream_error` བྱུང་ལས་ཅིག་གིས་ ཞབས་ཏོག་སྤྲོད་མི་གིས་ འགྱངས་ཆགས་ ཡང་ན་ རྒྱུན་ལམ་མཇུག་བསྡུ་དགོ་པའི་ གནས་སྟངས་གཞན་ཅིག་ ཤེས་རྟོགས་བྱུང་ཡོདཔ་སྦེ་ སྟོནམ་ཨིན། Torii གིས་ བྱུང་ལས་དེ་ ཚར་གཅིག་ གཏང་ཞིནམ་ལས་ རྒྱུན་ལམ་འདི་ ཁ་བསྡམསཔ་ཨིན། ཚབ་ཀྱི་རྒྱུན་ལམ་ཅིག་ ཁ་ཕྱེ་ཞིནམ་ལས་ མཐུན་སྒྲིག་འབད།
- Torii གིས་ SSE མ་བཀག་རུང་ ངོ་ཚབ གིས་ SSE གནས་སྐབས་གསོག་ཆས འབད་ཚུགས། ངོ་ཚབ ནང་ ལན་གསལ་ གནས་སྐབས་གསོག དང་ བསྡུ་གནོན སྒོ་བསྡམས་ཏེ་ བརྟག་དཔྱད ནང་ `curl -N` བཞག་དགོ།
- ཤུལ་མམ་གྱི་བྱུང་ལས་འདི་ ཧེ་མམ་གྱི་བྱུང་ལས་གི་ཤུལ་ལས་ཨིནམ་སྦེ་ མནོ་བསམ་གཏང་སྟེ་ མཐུད་མཚམས་འཇོག་པའི་བར་སྟོང་འདི་ ནམ་ཡང་མ་བཀང་། མཇུག་སྣོད་ལུ་ བསྐྱར་གཏང་འོད་རྟགས་མེདཔ་ཨིན། དེ་གི་ཚབ་ལུ་ ད་ལྟོའི་རྩིས་ཐོའི་གནས་སྟངས་འདྲི་དཔྱད་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [JavaScript རྒྱུན་ལམ་ལག་ལེན་དཔེ་མཚོན་ གཏན་སྦྱར་ཡོད་པའི Git commit ལུ།](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs) ལུ་འབདཝ་ཨིན།
- [གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་གི་ Torii ཚགས་མའི་ ཡིག་ཐོག་བརྡ་སྤྲོད་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii རྒྱུན་བསྡུར་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs) ལུ་བྱུང་རྐྱེན་ལམ་སྟོན་འབདཝ་ཨིན།
- [གནད་དོན་ཚུ་](/dz/blockchain/events.md)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
- [འབྲི་ཤོག་གི་གནས་གོང་](./query-ledger-state.md)
