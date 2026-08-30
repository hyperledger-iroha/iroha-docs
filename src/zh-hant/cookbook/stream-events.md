---
translation_locale: zh-hant
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 流動事件 {#stream-events}

## 結果 {#outcome}

通過服務器發送的事件 (SSE) 來消耗現場 Taira 管道事件,並在替換流開放後重新連接到限定的備份狀態.由於終點沒有重播緩衝器,所以將事件視爲通知而不是完整的歷史記錄.

## 預先條件 {#prerequisites}

- `curl`用於公共煙霧測試.
- Node.js 24 對 JavaScript 消費者.
- 沒有需要簽名. `https://taira.sora.org/v1/events/sse`是公開的,只能閱讀的流程;這個配方不執行任何 Minamoto 或 Taira 寫字.

## 步驟 {#steps}

### 1. 確認 SSE 的反應 {#_1-confirm-the-sse-response}

Taira 目前只有當`Accept`標題包含既首選事件流,也包括 JSON 倒退時纔會談判這個路線.禁用 curl 緩衝.命令在15秒後結束;只能在靜止期間收到心跳評論是有效的.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

不要發送 `Last-Event-ID`. Torii 現在, SSE 終點是一個直播風扇流,而不是重播日誌,並且拒絕重播請求.

### 添加過的 JavaScript 消費者 {#_2-add-a-filtered-javascript-consumer}

保存下列內容爲 `stream-taira.mjs`.它直接使用Fetch,以便請求可以發送 Taira 所需的混合 `Accept`標題.當前 `FilterExpr`選擇已批准的交易事件,解析器則在沒有重播緩衝器的情況下消耗 SSE 框架.

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

在 Taira 上,運行到至少一個交易達到 `Approved`:

```bash
node ./stream-taira.mjs
```

SSE 心跳評論保持惰的連接活躍,但不會建立賬本排序.當訂單或完整性重要時使用區塊高度,交易哈希和賬本查詢.

最新25名探險家的請求只是一個公開診斷.生產消費者必須用其耐用的應用資源和足夠大的檢查點回收要求來取代或延長 `reconcile()`.僅限快照不能證明沒有錯過事件.

在固定提交時, `ToriiClient.streamEvents()`只發送`Accept: text/event-stream`;直播 Taira 拒絕使用 `406` 縮小標題. 使用上面的原始Fetch表格,直到 SDK 和公共終端點談判相同的媒體類型.

## 驗證 {#verify}

在一個終端,運行 JavaScript 消費者.在另一個終端中,閱讀公共交易快照:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

對於您關心的每個交易事件,請在快照中找到其哈希或直接查詢它. 有邊界的頁面可以省略舊交易.然後停止並且重新啓動消費者:它必須在不提供事件 ID 的情況下重新連接,並在替代流開放後必須打印新的診斷.

## 解決問題 {#troubleshooting}

- 連接與心跳評論,但沒有數據事件是健康的;所選管道狀態可能只是安靜.
- `406 Not Acceptable`在直播上 Taira 通常只表示廣告的請求`text/event-stream`. 發送 `text/event-stream, application/json` 正如上面所示.
- `stream_error`事件表明服務器檢測到滯後或其他終端流狀況. Torii 發送該事件一次並關閉流;在重新連接之前調整.
- 代理可以緩衝 SSE 即使 Torii 沒有. 在代理中禁用響應緩衝和壓縮,並在診斷中保持`curl -N`.
- 永遠不要通過假設下一個事件跟上前一個事件來填補連接缺口.終點沒有重播緩衝器;反而查詢當前賬本狀態.

## 來源及相關文件 {#source-and-related-docs}

- [JavaScript 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)的流媒體配方
- [SSE 集成測試在固定的承諾](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr 解析器在固定的提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii 事件路由在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [事件](/zh-hant/blockchain/events.md)
- [Torii 終端點](/zh-hant/reference/torii-endpoints.md)
- [查詢大本狀態](./query-ledger-state.md)
