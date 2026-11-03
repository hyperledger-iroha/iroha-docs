---
translation_locale: zh-hans
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 流动事件 {#stream-events}

## 结果 {#outcome}

通过服务器发送的事件 (SSE) 来消耗现场 Taira 管道事件,并在替换流开放后重新连接到限定的备份状态.由于端点没有重播缓冲器,所以将事件视为通知而不是完整的历史记录.

## 预先条件 {#prerequisites}

- `curl`用于公共冒烟测试.
- Node.js 24 对 JavaScript 消费者.
- 没有需要签名. `https://taira.sora.org/v1/events/sse`是公开的,只能阅读的流程;这个操作指南不执行任何 Minamoto 或 Taira 写入.

## 步骤 {#steps}

### 1. 确认 SSE 的反应 {#_1-confirm-the-sse-response}

请求事件流时附带 JSON 回退：Torii 会以 `text/event-stream` 流式传输，并将被拒绝的请求（例如无效的过滤器）以 JSON 错误报告。禁用 curl 缓冲。命令会在 20 秒后结束。Torii 在空闲 15 秒后会发送心跳注释，因此在安静期间只收到心跳注释也是有效的。

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

不要发送 `Last-Event-ID`. Torii 现在, SSE 端点是一个直播风扇流,而不是重播日志,并且拒绝重播请求.

### 添加过的 JavaScript 消费者 {#_2-add-a-filtered-javascript-consumer}

将以下内容保存为 `stream-taira.mjs`。它直接使用 Fetch，以展示传输格式。`filter` 查询参数使用 Torii 的文本过滤语法来选择已批准的交易事件，而解析器会在没有重放游标的情况下读取 SSE 帧。

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

在 Taira 上,运行到至少一个交易达到 `Approved`:

```bash
node ./stream-taira.mjs
```

SSE 心跳评论保持惰的连接活跃,但不会建立账本排序.当订单或完整性重要时使用区块高度,交易哈希和账本查询.

最新25名探险家的请求只是一个公开诊断.生产消费者必须用其耐用的应用资源和足够大的检查点回收要求来取代或延长 `reconcile()`.仅限快照不能证明没有错过事件.

`@iroha/iroha-js` 中的 `ToriiClient.streamEvents({ filter })` 读取相同的流：传入 `field('tx_status').eq('Approved')` 或上面的文本过滤器。它会在流结束前产出终止的 `stream_error` 帧，因此上述的重新连接与核对规则仍然适用。

## 验证 {#verify}

在一个终端,运行 JavaScript 消费者.在另一个终端中,阅读公共交易快照:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

对于您关心的每个交易事件,请在快照中找到其哈希或直接查询它. 有边界的页面可以省略旧交易.然后停止并且重新启动消费者:它必须在不提供事件 ID 的情况下重新连接,并在替代流开放后必须打印新的诊断.

## 解决问题 {#troubleshooting}

- 连接与心跳评论,但没有数据事件是健康的;所选管道状态可能只是安静.
- 带有代码 `invalid_filter` 的 `400` 表示 `filter` 不符合 Torii 的文本语法，或指定了事件流不支持的字段。事件流可按 `tx_status`、`tx_hash`、`tx_block_height`、`tx_lane_id`、`tx_dataspace_id`、`block_status`、`block_height`、`proof_backend`、`proof_call_hash` 和 `proof_envelope_hash` 过滤。
- `stream_error` 事件表示服务器检测到延迟或其他终止流的状况。Torii 只会发送该事件一次并关闭流；请打开替代流，然后再进行核对。
- 代理可以缓冲 SSE 即使 Torii 没有. 在代理中禁用响应缓冲和压缩,并在诊断中保持`curl -N`.
- 永远不要通过假设下一个事件跟上前一个事件来填补连接缺口.端点没有重播缓冲器;反而查询当前账本状态.

## 来源及相关文件 {#source-and-related-docs}

- [JavaScript 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)的流媒体操作指南
- [SSE 集成测试在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [固定提交中的 Torii 过滤文本语法](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii 事件路由在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [事件](/zh-hans/blockchain/events.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
- [查询大本状态](./query-ledger-state.md)
