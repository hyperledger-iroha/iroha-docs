---
translation_locale: ru
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Потоковые события {#stream-events}

## Результат {#outcome}

Потребляйте события рабочего процесса обработки программного обеспечения live Taira через события, отправляемые сервером (SSE), переподключайтесь с ограниченной стратегией повторных попыток и обновляйте долговременное состояние после открытия потока замены. Так как у конечной точки API нет курсора воспроизведения, рассматривайте события как уведомления, а не как полную историю.

## Предварительные требования {#prerequisites}

- `curl` для публичного теста на курение.
- Node.js 24 для JavaScript потребителя.
- Криптографическая подпись не требуется. `https://taira.sora.org/v1/events/sse` является общедоступным потоком только для чтения; этот рецепт не выполняет никаких записей Minamoto или Taira.

## Шаги {#steps}

### 1. Подтвердите ответ SSE {#_1-confirm-the-sse-response}

Taira в настоящее время использует этот маршрут только тогда, когда заголовок `Accept` включает как поток событий по умолчанию, так и резервный JSON. Отключите буферизацию curl. Команда завершается через 15 секунд; получение только комментариев heartbeat в период отсутствия активности допустимо.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Не отправляйте `Last-Event-ID`. Конечная точка SSE Torii — это активный поток с рассылкой, а не журнал воспроизведения, поэтому она отклоняет запросы на воспроизведение.

### 2. Добавьте фильтрованного потребителя JavaScript {#_2-add-a-filtered-javascript-consumer}

Сохраните следующее как `stream-taira.mjs`. Оно использует Fetch напрямую, так что запрос может отправлять требуемый смешанный заголовок `Accept` от Taira. Текущий `FilterExpr` выбирает одобренные события транзакций, а парсер обрабатывает кадры SSE без курсора повторного воспроизведения.

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

Запускайте это до тех пор, пока хотя бы одна транзакция не достигнет `Approved` на Taira:

```bash
node ./stream-taira.mjs
```

SSE комментарии heartbeat поддерживают простые соединения активными, но не устанавливают порядок распределённого реестра блокчейна. Используйте высоты блоков, криптографические хэши транзакций и запросы к распределённому реестру блокчейна, когда имеет значение порядок или полнота.

Последний запрос explorer-25 является лишь публичной диагностикой. Продуктивный потребитель должен заменить или расширить `reconcile()` запросами к его долговременным ресурсам приложения и ограничением восстановления, достаточным для его контрольной точки. Только ограниченный снимок данных не может доказать, что никакие события не были пропущены.

На закреплённой ревизии исходного кода, `ToriiClient.streamEvents()` отправляет только `Accept: text/event-stream`; текущий Taira отклоняет этот более узкий заголовок с `406`. Используйте форму Fetch в сыром виде выше, пока SDK и публичная конечная точка API не согласуют одинаковые типы медиа.

## Проверить {#verify}

В одном терминале запустите потребителя JavaScript. В другом прочитайте снимок публичных данных транзакций:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Для каждого события транзакции, которое вас интересует, найдите его криптографический хеш в снимке данных или запросите его напрямую. Ограниченная страница может опустить более старые транзакции. Затем остановите и перезапустите потребителя: он должен переподключиться без указания идентификатора события и вывести новые диагностические данные после открытия заменяющего потока.

## Устранение неполадок {#troubleshooting}

- Соединение с комментариями о состоянии сердцебиения, но без событий данных, считается здоровым; статус выбранного программного процесса обработки может просто быть тихим.
- `406 Not Acceptable` в прямом эфире Taira обычно означает, что запрашиваемое объявление предназначено только для `text/event-stream`. Отправьте `text/event-stream, application/json` точно так, как показано выше.
- Событие `stream_error` указывает на то, что сервер обнаружил задержку или другое состояние потока на терминале. Torii отправляет это событие один раз и закрывает поток; выполните согласование перед повторным подключением.
- Прокси может буферизовать SSE, даже если Torii этого не делает. Отключите буферизацию и сжатие ответов в прокси и оставьте `curl -N` в диагностике.
- Никогда не заполняйте разрыв в последовательности, предполагая, что следующее событие следует за предыдущим. У конечной точки API нет курсора воспроизведения; вместо этого запросите текущее состояние распределенного реестра блокчейна.

## Источник и связанные документы {#source-and-related-docs}

- [JavaScript потоковая передача рецепта на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE интеграционные тесты на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr парсер на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii маршрутизация событий на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [События](/ru/blockchain/events.md)
- [Torii API конечные точки](/ru/reference/torii-endpoints.md)
- [Запросить состояние распределённого реестра блокчейн](./query-ledger-state.md)
