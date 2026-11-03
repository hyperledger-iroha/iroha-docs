---
translation_locale: es
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Eventos de transmisión {#stream-events}

## Resultado {#outcome}

Consume eventos del pipeline de procesamiento en vivo Taira a través de eventos enviados por el servidor (SSE), reconéctese con reintentos limitados y actualice el estado duradero después de que se abra el flujo de reemplazo. Dado que el endpoint API no tiene cursor de repetición, trate los eventos como notificaciones en lugar de un historial completo.

## Requisitos previos {#prerequisites}

- `curl` para una prueba pública de humo.
- Node.js 24 para el consumidor JavaScript.
- No se requiere un firmante criptográfico. `https://taira.sora.org/v1/events/sse` es un flujo público de solo lectura; esta receta no realiza escrituras de Minamoto ni de Taira.

## Pasos {#steps}

### 1. Confirme la respuesta SSE {#_1-confirm-the-sse-response}

Solicite el flujo de eventos con un respaldo JSON: Torii transmite `text/event-stream` y comunica una solicitud rechazada, como un filtro no válido, en forma de error JSON. Desactive el almacenamiento en búfer curl. El comando termina después de 20 segundos. Torii envía un comentario de latido tras 15 segundos de inactividad, por lo que recibir solo comentarios de latido durante un período de inactividad es válido.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

No envíe `Last-Event-ID`. El endpoint SSE API de Torii es un flujo de fan-out en vivo, no un registro de repetición, y rechaza las solicitudes de repetición.

### 2. Agregar un consumidor filtrado JavaScript {#_2-add-a-filtered-javascript-consumer}

Guarde lo siguiente como `stream-taira.mjs`. Utiliza Fetch directamente para mostrar el formato de transmisión. El parámetro de consulta `filter` usa la gramática de filtros de texto de Torii para seleccionar eventos de transacción aprobados, y el analizador consume tramas SSE sin un cursor de reproducción.

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

Ejecútalo hasta que al menos una transacción alcance `Approved` en Taira:

```bash
node ./stream-taira.mjs
```

SSE los comentarios de latido mantienen las conexiones inactivas vivas pero no establecen el orden en el libro mayor de la blockchain. Use alturas de bloque, hashes criptográficos de transacciones y consultas al libro mayor de la blockchain cuando el orden o la integridad sean importantes.

La solicitud del explorador más reciente-25 es solo un diagnóstico público. Un consumidor en producción debe reemplazar o extender `reconcile()` con consultas para sus recursos de aplicación duraderos y un límite de recuperación suficientemente grande para su punto de control. La vista de datos en un punto del tiempo acotado por sí sola no puede demostrar que no se hayan perdido eventos.

`ToriiClient.streamEvents({ filter })` de `@iroha/iroha-js` lee el mismo flujo: pase `field('tx_status').eq('Approved')` o el filtro de texto anterior. Entrega la trama terminal `stream_error` antes de que termine el flujo, por lo que las reglas de reconexión y conciliación anteriores siguen aplicándose.

## Verificar {#verify}

En un terminal, ejecute el consumidor JavaScript. En otro, lea la vista de datos de punto en el tiempo de transacciones públicas:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Para cada evento de transacción que te interese, localiza su hash criptográfico en la vista de datos en un punto en el tiempo o consúltalo directamente. La página limitada puede omitir transacciones más antiguas. Luego detenga y reinicie el consumidor: debe reconectarse sin proporcionar un ID de evento y debe imprimir un diagnóstico nuevo después de que se abra la transmisión de reemplazo.

## Solución de problemas {#troubleshooting}

- Una conexión con comentarios de latido cardíaco pero sin eventos de datos está saludable; el estado de la canalización de procesamiento seleccionada simplemente puede estar en silencio.
- `400` con el código `invalid_filter` significa que el `filter` no sigue la gramática de texto de Torii o nombra un campo que los flujos de eventos no admiten. Los flujos de eventos filtran por `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` y `proof_envelope_hash`.
- Un evento `stream_error` indica que el servidor detectó retraso u otra condición de flujo terminal. Torii envía ese evento una vez y cierra el flujo; abra un flujo de reemplazo y luego concilie.
- Un proxy puede almacenar en búfer SSE incluso cuando Torii no lo hace. Desactive el almacenamiento en búfer de respuestas y la compresión en el proxy, y mantenga `curl -N` en diagnósticos.
- Nunca rellene un hueco de desconexión suponiendo que el siguiente evento sigue al anterior. El punto final API no tiene cursor de repetición; en su lugar, consulte el estado actual del libro mayor de la blockchain.

## Fuente y documentos relacionados {#source-and-related-docs}

- [JavaScript receta de transmisión en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [Pruebas de integración SSE en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Gramática de texto de los filtros de Torii en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii enrutamiento de eventos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Eventos](/es/blockchain/events.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
- [Consultar el estado del libro mayor de blockchain](./query-ledger-state.md)
