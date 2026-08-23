---
translation_locale: am
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክስተቶች ዥረት {#stream-events}

## ውጤቱ {#outcome}

በአገልጋይ የተላኩ ክስተቶች (SSE) ላይ የቀጥታ Taira ቧንቧ ክስተቶችን ይጠቀሙ ፣ በተገደበ ምትኬ ጋር እንደገና ያገናኙ እና የመተኪያ ዥረት ከተከፈተ በኋላ ዘላቂ ሁኔታውን ያድሱ ። የመጨረሻው ነጥብ ዳግም ማጫወቻ ካርሰር ስለሌለው ፣ ክስተቶችን እንደ ሙሉ ታሪክ ሳይሆን ማሳወቂያዎች አድርገው ይመለከቱ ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl` ለሕዝብ ጭስ ሙከራ.
- Node.js 24 ለ JavaScript ሸማች።
- ምንም ፊርማ አያስፈልግም. `https://taira.sora.org/v1/events/sse` የህዝብ, ለማንበብ ብቻ ዥረት ነው; ይህ የምግብ አዘገጃጀት ምንም አያደርግም Minamoto ወይም Taira ይጽፋል.

## እርምጃዎች {#steps}

### የ SSE ምላሽ አረጋግጥ {#_1-confirm-the-sse-response}

Taira በአሁኑ ጊዜ ይህንን መንገድ የሚደራደርው የ `Accept` ራስጌ የተመረጠውን ክስተት ዥረት እና የ JSON ውድቀትን በሚያካትት ጊዜ ብቻ ነው ። curl ቡፈርን ያሰናክል። ትዕዛዙ ከ 15 ሰከንዶች በኋላ ይጠናቀቃል; በዝምታ ወቅት የልብ ምት አስተያየቶችን ብቻ መቀበል ዋጋ አለው.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

አትላክ `Last-Event-ID`. Torii እሱ ነው SSE Endpoint የቀጥታ አድናቂ ውጪ ዥረት እንጂ የመልሶ ማጫዎቻ መዝገብ አይደለም፣ እና የመልሶ የማጫዎቻ ጥያቄዎችን ውድቅ ያደርጋል።

### 2. የተጣራ JavaScript ሸማች አክል። {#_2-add-a-filtered-javascript-consumer}

የሚከተሉትን እንደ `stream-taira.mjs`. ጥያቄው መላክ እንዲችል በቀጥታ Fetch ይጠቀማል Taira የተደባለቀ መሆን አለበት `Accept` ራስጌ. የአሁኑ `FilterExpr` ተቀባይነት ያላቸውን የግብይት ክስተቶች ይመርጣል ፣ እና አጣራው የሚጠቀምበት SSE ያለ ዳግም ማጫወቻ ካርሰር ያሉ ክፈፎች።

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

በ Taira ላይ ቢያንስ አንድ ግብይት `Approved` እስኪደርስ ድረስ ይሮጥ:

```bash
node ./stream-taira.mjs
```

SSE የልብ ምት አስተያየቶች አሰልቺ ግንኙነቶችን በሕይወት ይይዛሉ ነገር ግን መቁጠሪያ ትዕዛዝ አያቋቁሙም ። ትዕዛዝ ወይም የተሟላነት አስፈላጊ በሚሆንበት ጊዜ የብሎክ ቁመት ፣ የትራንስክሽን ሃሽስ እና የመቁጠሪያ ጥያቄዎችን ይጠቀሙ ።

የቅርብ ጊዜው 25 አሰሳ ፈላጊ ጥያቄ የህዝብ ምርመራ ብቻ ነው ። አንድ የምርት ሸማች `reconcile()` ን ለዘላቂነት ያለው የመተግበሪያ ሀብቱ መጠይቆች እና ለመቆጣጠሪያ ቦታው በቂ የሆነ የማገገም ገደብ ጋር መተካት ወይም ማራዘም አለበት ። የተወሰነ ቅጽበታዊ ገጽ እይታ ብቻ ምንም ክስተቶች እንዳልተመለሱ ሊያረጋግጥ አይችልም ።

በተጣራው ኮሚቴ ላይ `ToriiClient.streamEvents()` ብቻ `Accept: text/event-stream` ይልካል; በቀጥታ Taira ያንን ጠባብ ራስጌ በ `406` ይጥላል። የ SDK እና የህዝብ መጨረሻ ነጥብ ተመሳሳይ የመገናኛ ዓይነቶችን እስኪደራደሩ ድረስ ከላይ ያለውን ጥሬ የ Fetch ቅጽ ይጠቀሙ.

## ያረጋግጡ {#verify}

በአንድ ተርሚናል ላይ JavaScript ሸማች ይሂዱ. በሌላ ውስጥ የህዝብ ግብይት ቅጽበታዊ ገጽ እይታን ያንብቡ:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

ለእያንዳንዱ የግብይት ክስተት እርስዎ ያስባሉ, ቅጽበታዊ ገጽ እይታ ውስጥ ያለውን ሃሽ ያግኙ ወይም በቀጥታ መጠየቅ. እና ተጠቃሚውን ዳግም ማስጀመር: አንድ ክስተት ID ሳያቀርብ እንደገና መገናኘት አለበት እንዲሁም የመተኪያ ዥረት ከተከፈተ በኋላ አዲስ የምርመራ ጽሑፍ ማተም አለበት.

## ችግሮችን መፍታት {#troubleshooting}

- የልብ ምት አስተያየቶች ጋር ግንኙነት ግን ምንም ውሂብ ክስተቶች ጤናማ ነው; የተመረጠው ቧንቧ ሁኔታ በቀላሉ ዝም ሊሆን ይችላል.
- `406 Not Acceptable` በቀጥታ Taira አብዛኛውን ጊዜ የሚያመለክተው ማስታወቂያ የተሰጠው ጥያቄ ብቻ ነው `text/event-stream`. ላክ `text/event-stream, application/json` ከላይ እንደሚታየው በትክክል።
- አንድ `stream_error` ክስተት አገልጋዩ መዘግየትን ወይም ሌላ ተርሚናል ዥረት ሁኔታ እንዳስተዋለ ይጠቁማል. Torii ያንን ክስተት አንድ ጊዜ ይልካል እና ዥረቱን ያዘጋል; ከመገናኘቱ በፊት ማስታረቅ.
- አንድ ወኪል SSE አይደለም እንኳ ጊዜ buffer ይችላሉ Torii. ምላሽ buffering እና በወኪሉ ውስጥ መጭመቂያ ማሰናከል, እና የምርመራ ውስጥ `curl -N` ጠብቁ.
- ቀጣዩ ክስተት የቀደመውን ይከተላል ብሎ በማሰብ በፍፁም የማያገናኝ ክፍተት መሙላት የለበትም ። የመጨረሻው ነጥብ የመልሶ ማጫወት መርማሪ የለውም ፣ በምትኩ የአሁኑን መቁጠሪያ ሁኔታ መጠየቅ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [JavaScript የዥረት የምግብ አዘገጃጀት መመሪያ በፒን የተቀመጠ ኮሚቴ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ተጣብቆ በተቀመጠበት ኮምፕርት ላይ የተዋሃዱ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr በፒን የተሰቀለ ኮሚቴ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs) ላይ ፓነር።
- [Torii የዝግጅት አቅጣጫ በፒን commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs) ላይ።
- [ክስተቶች](/am/blockchain/events.md)
- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የጥያቄ መለያ ሁኔታ ](./query-ledger-state.md)
