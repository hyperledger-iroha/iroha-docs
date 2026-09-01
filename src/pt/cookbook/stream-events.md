---
translation_locale: pt
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Eventos de Transmissão {#stream-events}

## Resultado {#outcome}

Consuma eventos do pipeline de processamento ao vivo Taira por meio de eventos enviados pelo servidor (SSE), reconecte com reconexão limitada por tempo e atualize o estado durável após a abertura do fluxo de substituição. Como o endpoint API não possui cursor de reprodução, trate os eventos como notificações em vez de um histórico completo.

## Pré-requisitos {#prerequisites}

- `curl` para um teste público de fumaça.
- Node.js 24 para o consumidor JavaScript.
- Nenhum signatário criptográfico é necessário. `https://taira.sora.org/v1/events/sse` é um fluxo público, somente leitura; esta receita não realiza gravações de Minamoto ou Taira.

## Passos {#steps}

### 1. Confirme a resposta SSE {#_1-confirm-the-sse-response}

Taira atualmente negocia esta rota apenas quando o cabeçalho `Accept` inclui tanto o fluxo de eventos preferido quanto um fallback JSON. Desative o buffer curl. O comando termina após 15 segundos; receber apenas comentários de heartbeat durante um período de inatividade é válido.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Não envie `Last-Event-ID`. O endpoint SSE do Torii é um fluxo ativo distribuído a vários consumidores, não um log de repetição, e rejeita solicitações de repetição.

### 2. Adicione um consumidor JavaScript filtrado {#_2-add-a-filtered-javascript-consumer}

Salve o seguinte como `stream-taira.mjs`. Ele usa Fetch diretamente para que a requisição possa enviar o cabeçalho misto `Accept` necessário de Taira. O `FilterExpr` atual seleciona eventos de transação aprovados, e o parser consome quadros SSE sem um cursor de reprodução.

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

Execute até que pelo menos uma transação atinja `Approved` em Taira:

```bash
node ./stream-taira.mjs
```

Os comentários de heartbeat do SSE mantêm conexões ociosas ativas, mas não estabelecem a ordem do registro distribuído. Use alturas de bloco, hashes de transação e consultas ao registro quando a ordem ou a completude forem importantes.

A solicitação do explorador latest-25 é apenas um diagnóstico público. Um consumidor de produção deve substituir ou estender `reconcile()` com consultas para seus recursos de aplicação duráveis e um limite de recuperação grande o suficiente para seu ponto de verificação. A visualização de dados em um ponto no tempo delimitado por si só não pode provar que nenhum evento foi perdido.

No commit fixado, `ToriiClient.streamEvents()` envia apenas `Accept: text/event-stream`; o live Taira rejeita esse cabeçalho mais restrito com `406`. Use o formulário Fetch cru acima até que o SDK e o endpoint público API negociem os mesmos tipos de mídia.

## Verificar {#verify}

Em um terminal, execute o consumidor JavaScript. Em outro, leia a visão de dados públicos de ponto no tempo da transação:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Para cada evento de transação que você se importa, localize seu hash criptográfico na visualização de dados em um ponto no tempo ou consulte-o diretamente. A página limitada pode omitir transações mais antigas. Então pare e reinicie o consumidor: ele deve se reconectar sem fornecer um ID de evento e deve imprimir um diagnóstico novo após a abertura do fluxo substituto.

## Solução de problemas {#troubleshooting}

- Uma conexão com comentários de batimento cardíaco, mas sem eventos de dados, é saudável; o status da linha de processamento selecionada pode simplesmente estar quieto.
- `406 Not Acceptable` ao vivo Taira geralmente significa que a solicitação anunciada apenas `text/event-stream`. Envie `text/event-stream, application/json` exatamente como mostrado acima.
- Um evento `stream_error` indica que o servidor detectou atraso ou outra condição de fluxo terminal. Torii envia esse evento uma vez e fecha o fluxo; reconcilie antes de reconectar.
- Um proxy pode armazenar em buffer SSE mesmo quando Torii não o faz. Desative o armazenamento em buffer e a compressão de respostas no proxy, e mantenha `curl -N` nos diagnósticos.
- Nunca preencha uma lacuna de desconexão assumindo que o próximo evento segue o anterior. O endpoint API não possui cursor de reprodução; consulte o estado atual do livro razão da blockchain em vez disso.

## Fonte e documentos relacionados {#source-and-related-docs}

- [JavaScript transmitindo receita no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE testes de integração no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr analisador no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii roteamento de eventos no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [Eventos](/pt/blockchain/events.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [Consultar o estado do livro-razão da blockchain](./query-ledger-state.md)
