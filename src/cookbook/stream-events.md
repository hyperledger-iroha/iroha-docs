# Stream Events

## Outcome

Consume live Taira pipeline events over server-sent events (SSE), reconnect
with bounded backoff, and refresh durable state after the replacement stream
is open. Because the endpoint has no replay cursor, treat events as
notifications rather than a complete history.

## Prerequisites

- `curl` for a public smoke test.
- Node.js 24 for the JavaScript consumer.
- No signer is required. `https://taira.sora.org/v1/events/sse` is a
  public, read-only stream; this recipe performs no Minamoto or Taira
  writes.

## Steps

### 1. Confirm the SSE response

Taira currently negotiates this route only when the `Accept` header
includes both the preferred event stream and a JSON fallback. Disable curl
buffering. The command ends after 15 seconds; receiving only heartbeat
comments during a quiet period is valid.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Do not send `Last-Event-ID`. Torii's SSE endpoint is a live fan-out stream,
not a replay log, and rejects replay requests.

### 2. Add a filtered JavaScript consumer

Save the following as `stream-taira.mjs`. It uses Fetch directly so the
request can send Taira's required mixed `Accept` header. The current
`FilterExpr` selects approved transaction events, and the parser consumes SSE
frames without a replay cursor.

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

Run it until at least one transaction reaches `Approved` on Taira:

```bash
node ./stream-taira.mjs
```

SSE heartbeat comments keep idle connections alive but do not establish
ledger ordering. Use block heights, transaction hashes, and ledger queries
when order or completeness matters.

The latest-25 explorer request is only a public diagnostic. A production
consumer must replace or extend `reconcile()` with queries for its durable
application resources and a recovery bound large enough for its checkpoint.
The bounded snapshot alone cannot prove that no events were missed.

At the pinned commit, `ToriiClient.streamEvents()` sends only
`Accept: text/event-stream`; live Taira rejects that narrower header with
`406`. Use the raw Fetch form above until the SDK and public endpoint
negotiate the same media types.

## Verify

In one terminal, run the JavaScript consumer. In another, read the public
transaction snapshot:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

For each transaction event you care about, locate its hash in the snapshot
or query it directly. The bounded page can omit older transactions. Then stop
and restart the consumer: it must reconnect without supplying an event ID and
must print a fresh diagnostic after the replacement stream opens.

## Troubleshooting

- A connection with heartbeat comments but no data events is healthy; the
  selected pipeline status may simply be quiet.
- `406 Not Acceptable` on live Taira usually means the request advertised
  only `text/event-stream`. Send `text/event-stream, application/json`
  exactly as shown above.
- A `stream_error` event indicates that the server detected lag or another
  terminal stream condition. Torii sends that event once and closes the
  stream; reconcile before reconnecting.
- A proxy can buffer SSE even when Torii does not. Disable response
  buffering and compression in the proxy, and keep `curl -N` in
  diagnostics.
- Never fill a disconnect gap by assuming the next event follows the
  previous one. The endpoint has no replay cursor; query current ledger
  state instead.

## Source and related docs

- [JavaScript streaming recipe at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr parser at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii event routing at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [Events](/blockchain/events.md)
- [Torii endpoints](/reference/torii-endpoints.md)
- [Query ledger state](./query-ledger-state.md)
