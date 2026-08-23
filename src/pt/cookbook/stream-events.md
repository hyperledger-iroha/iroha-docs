---
translation_locale: pt
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Eventos de transmissão {#stream-events}

## Resultados {#outcome}

Consumir eventos de pipeline Taira ao vivo sobre eventos enviados pelo servidor (SSE), reconectar-se com um backup limitado e atualizar o estado duradouro depois que o fluxo de substituição estiver aberto.

## Pré-requisitos {#prerequisites}

- `curl` para um teste público de fumaça.
- Node.js 24 para o consumidor de JavaScript.
- Não é necessário assinar. `https://taira.sora.org/v1/events/sse` é um fluxo público, somente para leitura; esta receita não executa nenhuma Minamoto ou Taira escreve.

## Passos {#steps}

### 1. Confirmar a resposta SSE {#_1-confirm-the-sse-response}

Taira atualmente negocia essa rota somente quando o cabeçalho `Accept` inclui tanto o fluxo de eventos preferido quanto um fallback JSON. Desativar o tampão curl. O comando termina após 15 segundos; receber apenas comentários cardíacos durante um período silencioso é válido.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Não enviem `Last-Event-ID`. Torii O que é ? SSE O endpoint é um stream de fãs ao vivo, não um registro de reprodução e rejeita pedidos de reprodução.

### 2. Adicionar um consumidor filtrado JavaScript {#_2-add-a-filtered-javascript-consumer}

Salvar o seguinte como: `stream-taira.mjs`. Ele usa o Fetch directamente para que a solicitação possa enviar Taira É necessário misturar `Accept` - A corrente. `FilterExpr` seleciona eventos de transação aprovados, e o analisador consome SSE quadros sem cursor de repetição.

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

Executa-a até que pelo menos uma transação atinja `Approved` no Taira:

```bash
node ./stream-taira.mjs
```

SSE Os comentários cardíacos mantêm as conexões ociosas vivas, mas não estabelecem a ordem do livro. Use alturas de blocos, hashes de transações e consultas do livro-razão quando importa a ordem ou a integridade.

O último pedido de 25 exploradores é apenas um diagnóstico público. Um consumidor de produção deve substituir ou ampliar `reconcile()` com consultas para os seus recursos de aplicação duráveis e uma recuperação limitada suficientemente grande para o seu ponto de controlo.

No compromisso fixado, `ToriiClient.streamEvents()` envia apenas `Accept: text/event-stream`; vivo Taira rejeita esse cabeçalho mais estreito com `406`. Use o formulário Raw Fetch acima até que o SDK e o endpoint público negocie os mesmos tipos de mídia.

## Verificar {#verify}

Em um terminal, executar o consumidor JavaScript. em outro, ler a imagem de transacção pública:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Para cada evento de transação que você se importa, localizar seu hash na imagem instantânea ou consultá-lo diretamente. A página limitada pode omitir transações mais antigas. e reiniciar o consumidor: ele deve reconectar-se sem fornecer um evento ID e imprimir um novo diagnóstico após a abertura do fluxo de substituição.

## Resolução de problemas {#troubleshooting}

- Uma conexão com comentários de batimentos cardíacos, mas nenhum evento de dados é saudável; o status do pipeline selecionado pode simplesmente ser silencioso.
- `406 Not Acceptable` em directo Taira significa, geralmente, o pedido anunciado apenas `text/event-stream`. Enviar `text/event-stream, application/json` exatamente como mostrado acima.
- Um evento `stream_error` indica que o servidor detectou lag ou outra condição de fluxo terminal. Torii envia esse evento uma vez e fecha o fluxo; reconciliar antes da reconexão.
- Um proxy pode amortecer SSE mesmo quando Torii não o faz. Desativar o amortecimento e compressão de resposta no proxy, e manter `curl -N` nos diagnósticos.
- Nunca preencha uma lacuna de desconexão assumindo que o próximo evento siga o anterior. O ponto final não tem cursor de repetição; consulta o estado atual do livro maior em vez disso.

## Fonte e documentos relacionados {#source-and-related-docs}

- [JavaScript receita de transmissão no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [Ensaios de integração SSE no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Parser Torii FilterExpr no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii roteamento do evento no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [Eventos](/pt/blockchain/events.md)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
- [Estado do livro-razão de consulta](./query-ledger-state.md)
