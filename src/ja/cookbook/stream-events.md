---
translation_locale: ja
translation_source: /cookbook/stream-events.md
translation_source_hash: 66d22cd3b913d1c097cf74cf322cd86b3b50e1165e221a153705cb393e2b156f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ストリーム イベント {#stream-events}

## 結果 {#outcome}

サーバーが送信したイベント (SSE) でライブ Taira パイプライン イベントを消費し,制限されたバックオフで再接続し,代替ストリームが開いた後に耐久状態をリフレッシュします.エンドポイントには再生カーサーがないため,イベントは完全な履歴ではなく通知として扱います.

## 必須条件 {#prerequisites}

- `curl` 公共の煙検査のために
- Node.js 24は, JavaScript 消費者のために.
- `https://taira.sora.org/v1/events/sse`は公開で読めるのみのストリームです.このレシピでは Minamoto や Taira は書きません.

## ステップ {#steps}

### 1. SSE 応答を確認する. {#_1-confirm-the-sse-response}

Taira は現在,この経路を交渉する際は, `Accept` ヘッダーは既往イベントストリームと JSON フォールバックの両方を含む.バッファリング curl を無効にします.コマンドは15秒後に終了します.静かな期間中に心臓の拍子コメントのみを受け取ることは有効である.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

送らないで `Last-Event-ID`. Torii やってる SSE エンドポイントはリプレイログではなく ライブファンアウトストリームで リプレイ要求を拒否します.

### 2. フィルタリングされた JavaScript 消費者を追加する {#_2-add-a-filtered-javascript-consumer}

以下は `stream-taira.mjs` として保存します. 直接Fetch を使用して,リクエストが Taira の必要な混合型 `Accept` ヘッダーを送信できます. 現在の `FilterExpr` は承認されたトランザクションイベントを選択し,解析器は再現カーソラーなしで SSE フレームを消費します.

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

Taira で少なくとも1つの取引が `Approved` に到達するまで実行します.

```bash
node ./stream-taira.mjs
```

SSE ハートビート コメントは,無効な接続を保持しますが,レジャーの順序を確立しません. 注文や完全性が重要であればブロックの高さ,トランザクションハッシュ,およびレジャークエリを使用します.

最新25人の探検家要請は,公衆診断のみである.生産消費者は `reconcile()` を持続可能なアプリケーションリソースに関する問い合わせやチェックポイントに十分な大きさの復元制限で置き換えるか延長する必要があります. 限定されたスナップショットは単独では,イベントが逃れていないことを証明することはできません.

堅固な誓いにおいて, `ToriiClient.streamEvents()` 送信するのみ `Accept: text/event-stream`; 生きている Taira 狭いヘッダを否定する `406`. 上記の原始のFETCHフォームを使用して, SDK 公共のエンドポイントは同じメディアタイプを交渉します

## 確認する {#verify}

ある端末では JavaScript 消費者を実行する.別の端末では,公開取引のスナップショットを読み取る:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

各トランザクションイベントに関心がある場合は,スナップショットでそのハッシュを特定するか直接查询してください. 制限されたページは古いトランザクションを省略することができます. その後停止 消費者はイベント ID を供給せずに再接続し,交換ストリームが開いた後,新しい診断を印刷しなければならない.

## 問題を解く {#troubleshooting}

- 心拍子コメントとの関連性が健康的なものですが データイベントはありません. 選択されたパイプラインの状態は単に静かかもしれません.
- `406 Not Acceptable` ライブで Taira 通常は,広告された要求のみを意味する `text/event-stream`. 送信する `text/event-stream, application/json` 上記のように.
- `stream_error` イベントは,サーバーが遅延または別の端末ストリーム状態を検出したことを示します. Torii はそのイベントを一度送信し,ストリームを閉じます.再接続する前に調和する.
- 代理は, Torii が行かない場合でも SSE をバッファリングできる.プロキシで応答バッファリングと圧縮を無効にし,診断において `curl -N` を保持する.
- 次回のイベントが前のイベントに続くと仮定して,決して接続を切断の空白を埋めてはいけません.エンドポイントには再プレイカーソーはありません;代わりに現在のレジャー状態をクエリします.

## ソースおよび関連文書 {#source-and-related-docs}

- [JavaScript 固定された commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs) で配信レシピ
- [SSE 固定されたコミットで統合試験](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr パンセラー ピンされたコンビート](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii 固定 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs) でイベントルーティング
- [事件](/ja/blockchain/events.md)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [查询本簿状態](./query-ledger-state.md)
