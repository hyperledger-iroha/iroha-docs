---
translation_locale: ja
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ブロックチェーン台帳の状態を照会する {#query-ledger-state}

## 結果 {#outcome}

リソース Taira JSON を読み取り、投影し、その後、フィルター、論理ページネーション、ソート、取得サイズ、および前方専用カーソルの継続を使用して型付き Iroha クエリを使用します。また、サーバーが転送された `--select` タプルを評価する前にセレクタ投影に依存することは避けます。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Node.js 24、そして現在の`iroha` CLI。
- 読み取り専用 Taira アクセス。
- 署名付き型クエリの例については、Taira のクライアント設定または生成されたローカルネットワーク用の設定です。
- 例として Rust の場合、ターゲットネットワークと同じ Iroha ソースリビジョンに固定されたプロジェクト。

## ステップ {#steps}

### 1. 公開 Taira のリソースをページングする {#_1-page-through-a-public-taira-resource}

リソースルートは、ダッシュボードやスモークチェックに便利です。JSON を要求し、すべてのページにバインドし、レスポンスを確認した後にアプリケーションが必要とするフィールドだけをプロジェクトしてください。

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
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
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

この HTTP サーフェスは `limit` と `offset` を使用します。ルートがより安価なカウントモードを使用する場合、省略されたまたは境界付きの `total` は通常のものとして扱います。

### 2. 型付き CLI クエリをフィルタリングしてバッチ処理する {#_2-filter-and-batch-a-typed-cli-query}

CLI は型付きイテラブルクエリをシリアライズし、内部的にサーバーの継続カーソルに従います。ここでは論理的な結果は1行に制限されており、一方 `--fetch-size 1` は1回の往復で取得される最大バッチを制御します。

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

フィルタリングはページネーションの前に行われます。クエリ固有の型付き述語を使用してください。アカウントや資産の述語をドメインに安全に再利用することはできません。

### 3. 安定したメタデータキーで並べ替える {#_3-sort-by-a-stable-metadata-key}

入力されたクエリのソートは、1つのメタデータキーに対して辞書式順序になります。そのキーを持たない項目は、ソフトウェア実行時に定義された順序に従うため、コレクション全体で一貫して値が設定されているキーを使用してください。

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

チェックイン済みの CLI は `--select` JSON を解析し、セレクタタプルを転送しますが、現在のライトウェイトクエリ DSL はサーバーでそのセレクタを評価しません。まだそれに基づいてプロジェクション契約を構築しないでください。ターゲットソフトウェアのランタイムがサポートするようになった後にのみ、型付きの SDK プロジェクションを使用するか、上記のように`jq`または JavaScript を使用してクライアント側で検証済みの結果をプロジェクトしてください。

### 4. Rust イテレーターを不透明なカーソルに従わせる {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` は論理結果セットを制限します。`FetchSize` は各サーバーバッチを制御します。返されるイテレータは、サーバー生成のカーソルを使用して継続要求を透過的に送信します。

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

A `ForwardCursor`は権限に縛られ、プロセスローカルで、前方のみです。決して解析したり、合成したり、認可主体間で共有したり、Torii インスタンス間でポータブルなレジュメトークンとして永続化したりしないでください。期限が切れた場合は、意図的なアプリケーションレベルのチェックポイントで元のクエリを再実行してください。

## 確認する {#verify}

正確なドメインフィルターは、`wonderland.universal` のみを返すべきです。単に成功した CLI の終了を数えるのではなく、結果を確認してください:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

ページ分割されたアプリケーションのクエリについては、IDがページ間で重複しないこと、要求された論理的上限が決して超えられないこと、そして期限切れのカーソルの後で再試行すると文書化されたチェックポイントから再開されることもテストしてください。

## トラブルシューティング {#troubleshooting}

- 単一のクエリは、反復可能なフィルター、ソート、ページネーション、フェッチパラメータを受け付けません。これらの制御が必要な場合は、対応するリストクエリを使用してください。
- `fetch_size` は非ゼロのバッチヒントであり、合計結果の制限ではありません。現在のデフォルトは `100` であり、ソフトウェアの実行時はその最大値を超える値を拒否します。
- 不明、期限切れ、または外部のカーソルは、意図的に再利用できません。クエリを再起動し、opaque値の修復を試みないでください。
- メタデータの並べ替えは一般的なフィールドの並べ替えではありません。すべての項目が選択したキーを持っていない場合は、キーが欠落している順序を記録するか、別の戦略を選択してください。
- CLI は`--select`を解析して転送しますが、現在のサーバーは軽量セレクタタプルを評価しません。展開されたソフトウェアランタイムでサーバーサイドセレクタのサポートが確認されるまで、クライアント側投影を適用してください。
- 広範で制限のないクエリは、ネットワークのピア作業、クライアントのメモリ、カーソルの寿命リスクを増加させます。論理的な制限と、利用者に適したフェッチサイズを設定してください。
- パブリック JSON リソースパラメータと署名付き型付きクエリパラメータは関連していますが、相互に置き換え可能なシリアル化形式ではありません。型付きクエリデータコンテナには SDK または CLI を使用してください。

## ソースおよび関連文書 {#source-and-related-docs}

- [ピン留めされたソースコードのリビジョンでのカーソルバック型ページネーション統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [ピン留めされたソースコードのリビジョンにおけるクエリビルダーとセレクターの動作](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [ピン留めされたソースコードのリビジョンにおけるクエリパラメータとカーソルモデル](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [クエリ](/ja/blockchain/queries.md)
- [問い合わせ参照](/ja/reference/queries.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
