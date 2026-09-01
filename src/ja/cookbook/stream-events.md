---
translation_locale: ja
translation_source: /cookbook/stream-events.md
translation_source_hash: 96f0a26000530fee15d121f815f9f5717a535dc3836cff9a2a447b1e5b70c41c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ストリームイベント {#stream-events}

## 結果 {#outcome}

サーバー送信イベント（SSE）を介してライブの Taira ソフトウェア処理ワークフローイベントを消費し、制限されたバックオフで再接続し、耐久性のある状態を更新する置換ストリームが開いた後。API エンドポイントにはリプレイカーソルがないため、イベントを完全な履歴ではなく通知として扱います。

## 前提条件 {#prerequisites}

- `curl` 公開スモークテスト用。
- Node.js は JavaScript 消費者向けに 24 です。
- 暗号署名者は必要ありません。`https://taira.sora.org/v1/events/sse` は公開の読み取り専用ストリームです。このレシピは Minamoto や Taira の書き込みを行いません。

## ステップ {#steps}

### 1. SSE の応答を確認する {#_1-confirm-the-sse-response}

Taira は現在、`Accept` ヘッダーに優先されるイベントストリームと JSON フォールバックの両方が含まれている場合にのみ、このルートを交渉します。curl のバッファリングを無効にします。コマンドは15秒後に終了します。静かな期間中にハートビートコメントのみを受信することも有効です。

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID`を送信しないでください。Torii の SSE API エンドポイントはライブファンアウトストリームであり、リプレイログではないため、リプレイリクエストを拒否します。

### 2. フィルタリングされた JavaScript コンシューマーを追加する {#_2-add-a-filtered-javascript-consumer}

以下を `stream-taira.mjs` として保存してください。これは Fetch を直接使用するため、リクエストは Taira の必要な混合 `Accept` ヘッダーを送信できます。現在の `FilterExpr` は承認されたトランザクションイベントを選択し、パーサーはリプレイカーソルなしで SSE フレームを消費します。

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

Taira で少なくとも1つの取引が`Approved`に達するまで実行してください:

```bash
node ./stream-taira.mjs
```

SSE ハートビートコメントはアイドル状態の接続を維持しますが、ブロックチェーン台帳の順序を確立することはありません。順序や完全性が重要な場合は、ブロックの高さ、トランザクションの暗号化ハッシュ、およびブロックチェーン台帳のクエリを使用してください。

最新の25件のエクスプローラー要求は、あくまで公開された診断にすぎません。実際の運用環境の利用者は、`reconcile()`を耐久性のあるアプリケーションリソース用のクエリに置き換えるか拡張し、チェックポイントに十分な回復境界を設定する必要があります。境界付きデータスナップショットだけでは、イベントが見逃されなかったことを証明することはできません。

固定されたソースコードのリビジョンでは、`ToriiClient.streamEvents()` は `Accept: text/event-stream` のみを送信します；最新の Taira はその狭いヘッダーを `406` で拒否します。上記の生の Fetch 形式を、SDK とパブリック API エンドポイントが同じメディアタイプで交渉するまで使用してください。

## 確認する {#verify}

1つのターミナルで、JavaScript コンシューマーを実行します。別のターミナルで、公開トランザクションデータのスナップショットを読み取ります:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

関心のある各取引イベントについて、その暗号ハッシュをデータスナップショットで見つけるか、直接クエリしてください。制限付きページでは古い取引を省略できます。それからコンシューマを停止して再起動してください：イベントIDを提供せずに再接続する必要があり、置き換えストリームが開いた後に新しい診断を出力しなければなりません。

## トラブルシューティング {#troubleshooting}

- データイベントはないがハートビートコメントがある接続は正常です。選択されたソフトウェア処理ワークフローのステータスが単に静かなだけかもしれません。
- `406 Not Acceptable` がライブ Taira 上にある場合、通常はリクエストが `text/event-stream` のみを宣伝していることを意味します。`text/event-stream, application/json` を上記の通り正確に送信してください。
- A `stream_error` イベントは、サーバーがラグまたは他の端末ストリームの状態を検出したことを示します。Torii はそのイベントを一度送信してストリームを閉じます；再接続する前に調整してください。
- プロキシは、Torii がしない場合でも SSE をバッファリングすることがあります。プロキシでのレスポンスのバッファリングと圧縮を無効にし、`curl -N` を診断に保持してください。
- 次のイベントが前のイベントに続くと仮定して切断ギャップを埋めないでください。API エンドポイントにはリプレイカーソルがありません。代わりに現在のブロックチェーン台帳の状態を照会してください。

## ソースおよび関連文書 {#source-and-related-docs}

- [JavaScript ピン留めされたソースコードのリビジョンでのストリーミングレシピ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE ピン留めされたソースコードのリビジョンでの統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr ピン留めされたソースコードのリビジョンでのパーサー](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/filter.rs)
- [Torii ピン留めされたソースコードのリビジョンでのイベントルーティング](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/routing.rs)
- [イベント](/ja/blockchain/events.md)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md)
- [ブロックチェーン台帳の状態を照会する](./query-ledger-state.md)
