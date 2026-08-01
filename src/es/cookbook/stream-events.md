---
translation_locale: es
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Eventos de transmisión {#stream-events}

## El resultado {#outcome}

Consuma eventos en vivo de la tubería Taira sobre los eventos enviados por el servidor (SSE), vuelve a conectarse con una copia de seguridad limitada y actualiza el estado duradero después de que se abra el flujo de reemplazo. Debido a que el punto final no tiene cursor de reproducción, trate los eventos como notificaciones en lugar de un historial completo.

## Los requisitos previos {#prerequisites}

- `curl` para una prueba de humo pública.
- Node.js 24 para el consumidor de JavaScript.
- No se requiere firmar. `https://taira.sora.org/v1/events/sse` es una transmisión pública, sólo para lectura; esta receta no realiza ningún Minamoto o Taira escribe.

## Los pasos {#steps}

### 1. Confirmar la respuesta SSE {#_1-confirm-the-sse-response}

Taira negocia actualmente esta ruta solo cuando el encabezado de `Accept` incluye tanto la corriente de eventos preferida como un fallback de JSON. Deshabilitar el amortiguación de curl. El comando termina después de 15 segundos; sólo recibir comentarios de latido cardíaco durante un período tranquilo es válido.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

No envíe `Last-Event-ID`. Torii¿ Qué es ? SSE Endpoint es una transmisión en vivo de fans, no un registro de reproducción, y rechaza las solicitudes de repetición.

### 2. Añadir un consumidor JavaScript filtrado {#_2-add-a-filtered-javascript-consumer}

Guarde los siguientes como `stream-taira.mjs`. Se utiliza Fetch directamente para que la solicitud puede enviar Taira Se requiere mezcla `Accept` La corriente `FilterExpr` selecciona los eventos de transacción aprobados, y el analizador consume SSE los marcos sin un cursor de reproducción.

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

Se ejecuta hasta que al menos una transacción llegue a `Approved` en Taira:

```bash
node ./stream-taira.mjs
```

SSE Los comentarios de los latidos cardíacos mantienen las conexiones ociosas vivas pero no establecen el orden del libro mayor. Utilice las alturas de los bloques, hashes de transacciones y consultas en el libro mayor cuando sea importante el orden o la integridad.

La última solicitud de 25 exploradores es sólo un diagnóstico público. Un consumidor de producción debe reemplazar o ampliar `reconcile()` con consultas para sus recursos duraderos de aplicación y una recuperación limitada lo suficientemente grande como para su punto de control.

En el compromiso fijado, `ToriiClient.streamEvents()` envía sólo `Accept: text/event-stream`; vivo Taira rechaza ese encabezado más estrecho con `406`. Utilice el formulario Fetch crudo arriba hasta que el SDK y el punto final público negocien los mismos tipos de medios.

## Verificar {#verify}

En una terminal, ejecuta el consumidor JavaScript. en otra, lee la instantánea de transacción pública:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Para cada evento de transacción que le importe, localizar su hash en la instantánea o consultarlo directamente. La página limitada puede omitir las transacciones más antiguas. Luego detener y reiniciar al consumidor: debe volver a conectarse sin suministrar un evento ID e imprimir un nuevo diagnóstico después de que se abra el flujo de reemplazo.

## Solución de problemas {#troubleshooting}

- Una conexión con los comentarios de latidos cardíacos pero ningún evento de datos es saludable; el estado de la tubería seleccionada puede simplemente ser silencioso.
- `406 Not Acceptable` en vivo Taira significa, por lo general, la solicitud anunciada solamente `text/event-stream`. Envía `text/event-stream, application/json` exactamente como se muestra anteriormente.
- Un evento `stream_error` indica que el servidor detectó un retraso u otra condición de flujo terminal. Torii envía ese evento una vez y cierra la corriente; reconcilia antes de volver a conectarse.
- Un proxy puede amortiguar SSE incluso cuando Torii no. Deshabilitar el amortiguamiento y la compresión de respuesta en el proxy, y mantener `curl -N` en los diagnósticos.
- Nunca llene una brecha de desconexión asumiendo que el siguiente evento sigue al anterior. El punto final no tiene cursor de repetición; consulta en su lugar el estado actual del libro mayor.

## Fuente y documentos relacionados {#source-and-related-docs}

- [JavaScript receta de transmisión en el comit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [Pruebas de integración SSE en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr parser en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii Enrutamiento de eventos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [Eventos ](/es/blockchain/events.md)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
- [Estado del libro mayor de consulta](./query-ledger-state.md)
