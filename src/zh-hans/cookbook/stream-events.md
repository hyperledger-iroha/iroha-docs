---
translation_locale: zh-hans
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 流动事件 {#stream-events}

## 结果 {#outcome}

通过服务器发送的事件 (SSE) 来消耗现场 Taira 管道事件,并在替换流开放后重新连接到限定的备份状态.由于终点没有重播缓冲器,所以将事件视为通知而不是完整的历史记录.

## 预先条件 {#prerequisites}

- `curl`用于公共烟雾测试.
- Node.js 24 对 JavaScript 消费者.
- 没有需要签名. `https://taira.sora.org/v1/events/sse`是公开的,只能阅读的流程;这个配方不执行任何 Minamoto 或 Taira 写字.

## 步骤 {#steps}

### 1. 确认 SSE 的反应 {#_1-confirm-the-sse-response}

Taira 目前只有当`Accept`标题包含既首选事件流,也包括 JSON 倒退时才会谈判这个路线.禁用 curl 缓冲.命令在15秒后结束;只能在静止期间收到心跳评论是有效的.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

不要发送 `Last-Event-ID`. Torii 现在, SSE 终点是一个直播风扇流,而不是重播日志,并且拒绝重播请求.

### 添加过的 JavaScript 消费者 {#_2-add-a-filtered-javascript-consumer}

保存下列内容为 `stream-taira.mjs`.它直接使用Fetch,以便请求可以发送 Taira 所需的混合 `Accept`标题.当前 `FilterExpr`选择已批准的交易事件,解析器则在没有重播缓冲器的情况下消耗 SSE 框架.

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

在 Taira 上,运行到至少一个交易达到 `Approved`:

```bash
node ./stream-taira.mjs
```

SSE 心跳评论保持惰的连接活跃,但不会建立账本排序.当订单或完整性重要时使用区块高度,交易哈希和账本查询.

最新25名探险家的请求只是一个公开诊断.生产消费者必须用其耐用的应用资源和足够大的检查点回收要求来取代或延长 `reconcile()`.仅限快照不能证明没有错过事件.

在固定提交时, `ToriiClient.streamEvents()`只发送`Accept: text/event-stream`;直播 Taira 拒绝使用 `406` 缩小标题. 使用上面的原始Fetch表格,直到 SDK 和公共终端点谈判相同的媒体类型.

## 验证 {#verify}

在一个终端,运行 JavaScript 消费者.在另一个终端中,阅读公共交易快照:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

对于您关心的每个交易事件,请在快照中找到其哈希或直接查询它. 有边界的页面可以省略旧交易.然后停止并且重新启动消费者:它必须在不提供事件 ID 的情况下重新连接,并在替代流开放后必须打印新的诊断.

## 解决问题 {#troubleshooting}

- 连接与心跳评论,但没有数据事件是健康的;所选管道状态可能只是安静.
- `406 Not Acceptable`在直播上 Taira 通常只表示广告的请求`text/event-stream`. 发送 `text/event-stream, application/json` 正如上面所示.
- `stream_error`事件表明服务器检测到滞后或其他终端流状况. Torii 发送该事件一次并关闭流;在重新连接之前调整.
- 代理可以缓冲 SSE 即使 Torii 没有. 在代理中禁用响应缓冲和压缩,并在诊断中保持`curl -N`.
- 永远不要通过假设下一个事件跟上前一个事件来填补连接缺口.终点没有重播缓冲器;反而查询当前账本状态.

## 来源及相关文件 {#source-and-related-docs}

- [JavaScript 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)的流媒体配方
- [SSE 集成测试在固定的承诺](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr 解析器在固定的提交上](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii 事件路由在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [事件](/zh-hans/blockchain/events.md)
- [Torii 终端点](/zh-hans/reference/torii-endpoints.md)
- [查询大本状态](./query-ledger-state.md)
