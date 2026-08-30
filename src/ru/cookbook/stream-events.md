---
translation_locale: ru
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Поток событий {#stream-events}

## Результат {#outcome}

Используйте живые Taira трубопроводные события над передаваемыми сервером событиями (SSE), воссоединяйтесь с ограниченной обратной связью и обновляйте длительное состояние после открытия заменного потока. Поскольку конечный пункт не имеет курсора повторения, относитесь к событиям как к уведомлениям, а не к полной истории.

## Предварительные условия {#prerequisites}

- `curl` для общественного испытания дыма.
- Node.js 24 для потребителя JavaScript.
- Никакой подписи не требуется. `https://taira.sora.org/v1/events/sse` является публичным, читаемым только потоком; этот рецепт не выполняет никаких записей Minamoto или Taira.

## Шаги {#steps}

### 1. Подтвердить ответ SSE {#_1-confirm-the-sse-response}

В настоящее время Taira ведет переговоры по этому маршруту только тогда, когда заголовок `Accept` включает в себя как предпочтительный поток событий, так и обратный сигнал JSON. Отключить буферную систему curl. Команда заканчивается через 15 секунд; принимать только комментарии на сердцебиение в тихий период действует.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Не отправляйте `Last-Event-ID`. Torii Я ... SSE Endpoint - это прямая передача, а не журнал воспроизведения, и отклоняет запросы на воспроизведение.

### 2. Добавьте фильтрованный потребитель JavaScript {#_2-add-a-filtered-javascript-consumer}

Сохранить следующее как: `stream-taira.mjs`. Он использует Fetch напрямую, так что запрос может отправить Taira требуется смешанная `Accept` Заголовок. `FilterExpr` выбирает одобренные транзакционные события, и анализатор потребляет SSE кадры без курсора повторного воспроизведения.

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

Запустить его до тех пор, пока не достигнет `Approved` по крайней мере одна транзакция на Taira:

```bash
node ./stream-taira.mjs
```

SSE сердцебиение комментариев сохраняют безработные связи живыми, но не устанавливают реестр заказов. Используйте высоты блоков, хэши транзакций и запросы в реестре, когда вопрос порядка или полноты.

Последние 25 запросов исследователей - это только общедоступная диагностика. Производственный потребитель должен заменить или продлить `reconcile()` с запросами на его прочные ресурсы приложения и объем восстановления, достаточный для своего контрольно-пропускного пункта.

На закрепленном сообщении `ToriiClient.streamEvents()` отправляет только `Accept: text/event-stream`; живая Taira отклоняет эту более узкую заголовок с `406`. Используйте форму Raw Fetch выше, пока SDK и общественный конечный пункт не будут вести переговоры о тех же типах медиа.

## Проверка {#verify}

В одном терминале запустите потребителя JavaScript, а в другом прочитайте снимок транзакции:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Для каждого транзакционного события, о котором вы заботитесь, найдите его хэш в снимке или запросите его напрямую. Ограниченная страница может исключить старые транзакции. и перезагрузить потребителя: он должен подключиться снова без предъявления события ID и должен напечатать новую диагностику после того, как будет открыт заменный поток.

## Устранение неполадок {#troubleshooting}

- Связь с комментариями сердечного ритма, но никаких событий данных не является здоровым; состояние выбранного трубопровода может просто быть тихим.
- `406 Not Acceptable` В прямом эфире Taira обычно означает заявку, объявленную только `text/event-stream`. Пошлите . `text/event-stream, application/json` точно, как показано выше.
- Событие `stream_error` указывает на то, что сервер обнаружил задержку или другое состояние терминального потока. Torii отправляет это событие один раз и закрывает поток; согласуйте до восстановления связи.
- Прокси может буферировать SSE даже тогда, когда Torii не делает этого. Отключить буферирование ответа и сжатие в прокси и сохранить `curl -N` в диагностике.
- Никогда не заполняйте разрыв, предполагая, что следующее событие последует за предыдущим. В конечной точке нет курсора воспроизведения; вместо этого запрашивайте текущее состояние реестра.

## Источник и связанные с ним документы {#source-and-related-docs}

- [JavaScript рецепт потоковой передачи на финированном сообщении](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [Тесты интеграции SSE на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr анализирующий на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii маршрутизация событий на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [События](/ru/blockchain/events.md)
- [конечные точки Torii](/ru/reference/torii-endpoints.md)
- [Состояние допроса в регистре ](./query-ledger-state.md)
