---
translation_locale: am
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ክስተቶችን በዥረት ይልቁ {#stream-events}

## ውጤት {#outcome}

በአገልጋይ በተላኩ ክስተቶች (SSE) ላይ የቀጥታ Taira ሶፍትዌር የስራ ሂደት ክስተቶችን ይጠቀሙ፣ ከታሰረ ጀርባ ጋር እንደገና ይገናኙ እና ዘላቂ ሁኔታን ያድሱ ተተኪው ዥረት ከተከፈተ በኋላ. የ API የመጨረሻ ነጥብ ምንም የመልሶ ማጫወት ጠቋሚ ስለሌለው ክስተቶችን ከሙሉ ታሪክ ይልቅ እንደ ማሳወቂያ ይያዙት።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl` ለህዝብ የመጀመሪያ የስራ ሙከራ።
- Node.js 24 ለ JavaScript ሸማች።
- ምንም ምስጠራ ፈራሚ አያስፈልግም። `https://taira.sora.org/v1/events/sse` ይፋዊ፣ ተነባቢ-ብቻ ዥረት ነው; ይህ የተግባር መመሪያ ምንም Minamoto ወይም Taira አይጽፍም.

## እርምጃዎች {#steps}

### 1. የ SSE ምላሽን ያረጋግጡ {#_1-confirm-the-sse-response}

የክስተት ዥረቱን ከ JSON ተተኪ አማራጭ ጋር ይጠይቁ፦ Torii `text/event-stream`ን በዥረት ያስተላልፋል፣ እና ውድቅ የተደረገ ጥያቄን፣ ለምሳሌ ልክ ያልሆነ ማጣሪያን፣ እንደ JSON ስህተት ሪፖርት ያደርጋል። curl ቋት አጠቃቀምን አሰናክል። ትዕዛዙ ከ20 ሰከንድ በኋላ ያበቃል። Torii ከ15 የስራ-ፈት ሰከንዶች በኋላ የልብ ምት አስተያየት ይልካል፣ ስለዚህ በጸጥታ ጊዜ የልብ ምት አስተያየቶችን ብቻ መቀበል ልክ ነው።

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID` አይላኩ። Torii SSE API የመጨረሻ ነጥብ የቀጥታ ደጋፊ ዥረት እንጂ የድጋሚ አጫውት ምዝግብ ማስታወሻ አይደለም፣ እና የድጋሚ አጫውት ጥያቄዎችን ውድቅ ያደርጋል።

### 2. የተጣራ JavaScript ሸማች ያክሉ {#_2-add-a-filtered-javascript-consumer}

የሚከተለውን እንደ `stream-taira.mjs` ያስቀምጡ። በአውታረ መረብ ላይ የሚተላለፈውን የመልዕክት ቅርጸት ለማሳየት Fetch APIን በቀጥታ ይጠቀማል። የ`filter` መጠይቅ መለኪያ የጸደቁ የግብይት ክስተቶችን ለመምረጥ የ Torii የጽሑፍ ማጣሪያ ሰዋሰውን ይጠቀማል፣ እና ተንታኙ ያለ ድጋሚ አጫውት ጠቋሚ SSE ፍሬሞችን ይጠቀማል።

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

በ Taira ላይ ቢያንስ አንድ ግብይት `Approved` እስኪደርስ ድረስ ያሂዱት።

```bash
node ./stream-taira.mjs
```

SSE የልብ ምት አስተያየቶች ስራ ፈት ግንኙነቶችን በህይወት ያቆዩታል ነገር ግን የብሎክቼይን መዝገብ ማዘዣን አያቋቁሙም። ትዕዛዝ ወይም ሙሉነት አስፈላጊ በሚሆንበት ጊዜ የብሎክ ቁመቶችን፣ የግብይት ምስጠራ ሃሽዎችን እና የብሎክቼይን መዝገብ መጠይቆችን ይጠቀሙ።

የቅርብ ጊዜው-25 አሳሽ ጥያቄ የህዝብ ምርመራ ብቻ ነው። የምርት ሸማች `reconcile()`ን ለረጅም ጊዜ የሚቆይ የመተግበሪያ ሀብቶቹ እና ለፍተሻ ኬላው በቂ የሆነ የመልሶ ማግኛ መጠይቆችን መተካት ወይም ማራዘም አለበት። የታሰረው የጊዜ ነጥብ የውሂብ እይታ ብቻውን ምንም አይነት ክስተት እንዳላመለጠ ማረጋገጥ አይችልም።

ከ`@iroha/iroha-js` የሚገኘው `ToriiClient.streamEvents({ filter })` ተመሳሳዩን ዥረት ያነባል፦ `field('tx_status').eq('Approved')`ን ወይም ከላይ ያለውን የጽሑፍ ማጣሪያ ያስተላልፉ። ዥረቱ ከማብቃቱ በፊት የመጨረሻውን `stream_error` ፍሬም ያቀርባል፣ ስለዚህ ከላይ ያሉት የዳግም ግንኙነት እና የማስታረቅ ደንቦች አሁንም ተፈጻሚ ናቸው።

## አረጋግጥ {#verify}

በአንድ ተርሚናል ውስጥ JavaScript ሸማቾችን ያሂዱ። በሌላ ውስጥ፣ የህዝብ ግብይት ነጥብ-በ-ጊዜ ውሂብ እይታን ያንብቡ -

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

ለሚያስቡት ለእያንዳንዱ የግብይት ክስተት፣ ምስጠራ ሃሽ በጊዜ ውሂብ እይታ ውስጥ ያግኙት ወይም በቀጥታ ይጠይቁት። የታሰረው ገጽ የቆዩ ግብይቶችን መተው ይችላል። ከዚያ ያቁሙ እና ሸማቹን እንደገና ያስጀምሩት የክስተት መታወቂያ ሳያቀርቡ እንደገና መገናኘት አለበት እና ተተኪው ዥረት ከተከፈተ በኋላ አዲስ ምርመራ ማተም አለበት።

## መላ ፍለጋ {#troubleshooting}

- ከልብ ምት አስተያየቶች ጋር ግንኙነት ግን ምንም የውሂብ ክስተቶች ጤናማ አይደሉም; የተመረጠው የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ሁኔታ በቀላሉ ጸጥ ያለ ሊሆን ይችላል።
- `400` ከኮድ `invalid_filter` ጋር ማለት `filter` የ Torii የጽሑፍ ሰዋሰውን አይከተልም ወይም የክስተት ዥረቶች የማይደግፉትን መስክ ይሰይማል ማለት ነው። የክስተት ዥረቶች በ`tx_status`፣ `tx_hash`፣ `tx_block_height`፣ `tx_lane_id`፣ `tx_dataspace_id`፣ `block_status`፣ `block_height`፣ `proof_backend`፣ `proof_call_hash` እና `proof_envelope_hash` ላይ ያጣራሉ።
- የ`stream_error` ክስተት አገልጋዩ መዘግየት ወይም ዥረቱን የሚያበቃ ሌላ ሁኔታ ማግኘቱን ያሳያል። Torii ያንን ክስተት አንድ ጊዜ ይልካል እና ዥረቱን ይዘጋዋል፤ ተተኪ ዥረት ይክፈቱ፣ ከዚያም ያስታርቁ።
- Torii ባያደርግም ፕሮክሲ SSE ን ማቋረጥ ይችላል። በተኪው ውስጥ የምላሽ ማቋት እና መጭመቅን ያሰናክሉ እና `curl -N` በምርመራ ውስጥ ያስቀምጡ።
- የሚቀጥለው ክስተት የቀደመውን ይከተላል ብለው በማሰብ የግንኙነት ማቋረጥ ክፍተትን በጭራሽ አይሙሉ። የ API የመጨረሻ ነጥብ ምንም መልሶ ማጫወት ጠቋሚ የለውም; በምትኩ የአሁኑን የብሎክቼይን መዝገብ ሁኔታ ይጠይቁ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [JavaScript በተሰካው የምንጭ-ኮድ ክለሳ ላይ የዥረት አሰራር](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE በተሰካው የምንጭ-ኮድ ክለሳ ላይ የውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Torii የማጣሪያ ጽሑፍ ሰዋሰው በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii በተሰካው የምንጭ-ኮድ ክለሳ ላይ የክስተት ማዘዋወር](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [ክስተቶች](/am/blockchain/events.md)
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [መጠይቅ blockchain መዝገብ ሁኔታ](./query-ledger-state.md)
