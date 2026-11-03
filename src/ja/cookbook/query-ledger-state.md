---
translation_locale: ja
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ブロックチェーン台帳の状態を照会する {#query-ledger-state}

## 結果 {#outcome}

Taira の JSON リソースを読み取って投影し、その後、CLI と Rust SDK から、フィルター、ソート、サーバー側の投影、ページ上限、および不透明な `next_cursor` による継続を使用して Torii のコレクションクエリを実行します。また、一覧の取得には署名付き型付きクエリを使用しません。署名付き型付きクエリは一覧のフィルタリング、ソート、投影を行わないためです。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Node.js 24、そして現在の`iroha` CLI。
- 読み取り専用 Taira アクセス。
- CLI の例については、Taira のクライアント設定または生成されたローカルネットワーク用の設定です。
- 例として Rust の場合、ターゲットネットワークと同じ Iroha ソースリビジョンに固定されたプロジェクト。

## ステップ {#steps}

### 1. 公開 Taira のリソースをページングする {#_1-page-through-a-public-taira-resource}

リソースルートは、ダッシュボードやスモークチェックに便利です。JSON を要求し、すべてのページにバインドし、レスポンスを確認した後にアプリケーションが必要とするフィールドだけをプロジェクトしてください。

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  cursor = page.next_cursor
} while (cursor)
```

:::

この HTTP サーフェスは `limit` と不透明な `next_cursor` でページングします。`next_cursor` が `null` になるまで、それを変更せずに `cursor` として送り返してください。`total` は `include_total=true` を要求した場合にのみ表示され、その場合はフルスキャンのコストがかかります。

### 2. CLI でコレクションをフィルタリングする {#_2-filter-a-collection-with-the-cli}

CLI はフィルター、投影、ページサイズをコレクションエンドポイントに送信し、1 ページ分の `{items, next_cursor}` を出力します。`next_cursor` が `null` になるまでたどるには `--all` を追加してください。

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

フィルタリングはページングの前に行われます。各コレクションは自身のフィールドのみを受け付けます。不明なフィールドは、何も一致しない結果ではなく `invalid_filter` を返します。

### 3. 安定したメタデータキーで並べ替える {#_3-sort-by-a-stable-metadata-key}

コレクションのソートキーには、宣言されたフィールドと `metadata.<key>` を指定できます。降順にするにはキーの前に `-` を付けてください。そのキーを持たない行は昇順では先頭に並び、同順位は行の識別子に従うため、コレクション全体で一貫して値が設定されているキーを使用してください。

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` はサーバー側の投影です。`--select id,metadata` はそれらのフィールドだけを返し、不明なフィールドは `invalid_select` を返します。署名付き型付きクエリは常にアイテム全体を返すため、その結果は上記のように `jq` または JavaScript を使用してクライアント側で投影してください。

### 4. Rust イテレーターを不透明なカーソルに従わせる {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` はページサイズを設定します。`list` が返すイテレータは、現在のページを消費した後にのみ、サーバーの `next_cursor` を使用して次のページを要求します。`take` は論理的な結果を制限します。ここで `client` は `iroha::blocking::Client` です。

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` は、そのコレクション、パス、フィルター、ソートに結び付けられた不透明なキーセット位置です。決して解析したり合成したりせず、異なるフィルターやソートで再利用しないでください。Torii はそれを `invalid_cursor` で拒否します。ページ間で行が挿入または削除されても、後続のページで無関係な行が重複したりスキップされたりすることはありません。

## 確認する {#verify}

正確なドメインフィルターは、`universal.universal` のみを返すべきです。単に成功した CLI の終了を数えるのではなく、結果を確認してください:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

ページ分割されたアプリケーションのクエリについては、IDがページ間で重複しないこと、要求された論理的上限が決して超えられないこと、そして拒否されたカーソルの場合は文書化されたチェックポイントから再開されることもテストしてください。

## トラブルシューティング {#troubleshooting}

- 単一のクエリは、反復可能なフィルター、ソート、ページネーション、フェッチパラメータを受け付けません。これらの制御が必要な場合は、対応するリストクエリを使用してください。
- `limit` はページサイズであり、合計結果ではありません。値は 1 以上、ノードの `torii.app_api_max_list_limit`（デフォルト 500）以下です。Torii のデフォルトは 100 です。さらに読み取るには、`next_cursor`、`--all`、または SDK イテレータに従ってください。
- `invalid_cursor` は、カーソルの形式が不正であるか、別のコレクション、パス、フィルター、またはソートに属していることを意味します。クエリを再起動し、不透明な値の修復を試みないでください。
- 選択的なフィルターは、`null` ではない `next_cursor` とともに、短いページや空のページを返すことがあります。`null` になるまでそれをたどり続けてください。
- `--filter` と HTTP の `filter` パラメーターは、`id = "universal.universal"` や `exists(metadata.tier)` のような Torii のテキスト文法を受け付けます。JSON の述語オブジェクトはフィルターテキストではなく、無効な `filter` として失敗します。
- 広範で制限のないクエリは、ネットワークのピア作業とクライアントのメモリを増加させます。論理的な制限と、利用者に適したページサイズを設定してください。
- 署名付きの `/v1/query` は一覧取得用の API ではありません。単一のクエリと、フィルターなしの一部のイテラブルクエリの開始のみを受け付け、`FindDomains` や `FindAssetDefinitions` などのその他のクエリは `signed_query_shape_not_admitted` で拒否します。コレクションエンドポイント、CLI の `list` コマンド、および SDK のコレクションリーダーは、1 つのフィルター、ソート、カーソルの文法を共有します。

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたソースコードのリビジョンでの Torii コレクションクエリの仕様](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [ピン留めされたソースコードのリビジョンにおける Rust のコレクション読み取りとカーソルイテレータ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [ピン留めされたソースコードのリビジョンにおける署名付きクエリの受け入れ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [クエリ](/ja/blockchain/queries.md)
- [問い合わせ参照](/ja/reference/queries.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
