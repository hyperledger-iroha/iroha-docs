---
translation_locale: ja
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 問い合わせ レジャー州 {#query-ledger-state}

## 成果 {#outcome}

Taira JSON リソースを読み,プロジェクต์して,フィルター,論理的なページ化,ソートリング,フリッチサイズ,前向きのみカーサーの継続を含む Iroha クエリを使用します.また,サーバーが転送された `--select` タプルを評価する前にセレクター投影に頼るのを避けます.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Node.js 24,および電流 `iroha` CLI.
- Taira 読み込みのみアクセス
- Taira または生成されたローカルネットワークのためのクライアント設定.
- Rust 例では,目標ネットワークと同じ Iroha ソース修正に固定されたプロジェクトです.

## ステップ {#steps}

### 1. Taira 公共資源のページを閲覧 {#_1-page-through-a-public-taira-resource}

リソース経路はダッシュボードや煙のチェックに役立ちます. JSON を要求し,すべてのページをリンクして,応答を確認した後,アプリケーションが必要なフィールドのみをプロジェクタします.

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

この HTTP 表面は `limit` と `offset` を使用する.経路でより安いカウントモードを使用する場合,省略されたまたは制限された `total` を通常のように処理します.

### 2. タイプされた CLI クエリをフィルタリングしてパッチします {#_2-filter-and-batch-a-typed-cli-query}

CLI は,入力されたリターン可能なクエリをシリアライズし,サーバー継続カーソルを内部にフォローします.ここで論理的な結果は1行に限定され,`--fetch-size 1`は往復ごとに最大のパッチを制御する.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

ページ化前にフィルタリングが行われます.クエリの特定型プレディケートを使用します.アカウントまたは資産のためのプレディケートはドメインのために安全に再利用できません.

### 3. 安定したメタデータキーによって排列する {#_3-sort-by-a-stable-metadata-key}

タイプされたクエリの排序は,メタデータキー上の語法式です.その鍵のないアイテムはランタイムで定義されている順序に従っており,コレクション全体に一貫して入ったキーを使用します.

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

チェックインされた CLI は, `--select` JSON を解析し,セレクターツープルを転送するが,現在の軽量クエリ DSL はサーバー上のセレクターを評価していない.それを取り巻くプロジェクション契約はまだ構築されていない.タイプされた SDK プロジェクションは,ターゲット実行時間がそれをサポートした後にのみ使用するか,または上記の通り,検証された結果クライアント側を `jq` または JavaScript でプロジェクタする.

### 4. Rust イテレーターが不透明なカーソルをフォローできるようにする {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` は論理的な結果セットを制限します. `FetchSize` は各サーババッチを制御します.返回したイテレーターはサーバー生成するカーソルを利用して,透明な継続要求を送信します.

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

`ForwardCursor` は権限を拘束し,プロセスローカルであり,前向きのみです.それを分析したり,合成したり,当局間で共有したり,または Torii ケースでポータブルのリニューアルトークンとして維持することは決してありません.終了した場合,意図的なアプリケーションレベルのチェックポイントを使用して元のクエリを再起動します.

## 確認する {#verify}

正確なドメインフィルタは `wonderland.universal` にのみ返します.成功した CLI 出口を単独でカウントするのではなく,結果を確認してください.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

ページ化されたアプリケーションクエリでは,また IDs がページ間で繰り返されないことをテストし,要求された論理的な制限が決して超えられず,期限切れのカーソルが文書化されたチェックポイントから再起動すると確認します.

## 問題を解く {#troubleshooting}

- シングルクエリは,リターナブルフィルタ,ソート,ペイジネーション,またはフィッチパラメータを受け入れません.これらの制御が必要であるときに対応するリストクエリを使用します.
- `fetch_size`は,全結果制限ではなく,ゼロ以外のパッチヒントである.現在のデフォルト値は `100`であり,実行時間は最大値を超えた値を拒否する.
- 未知,期限切れ,または外国のカーソルは故意に再利用できない.クエリを再起動し,不透明な値を修復しようとしないでください.
- メタデータ分類は一般的なフィールド分類ではありません.各項目は選択されたキーを持っていない場合,欠落したキー順序を文書化するか,別の戦略を選択してください.
- CLI は`--select`を解析し,転送するが,現在のサーバーは軽量選択タプルを評価しない.サーバ側選択タールのサポートが展開実行時間について確認されない限りクライアントサイドプロジェクションを実行します.
- パートワーク,クライアントメモリ,カーソルの寿命リスクを増加させる. 論理的な制限と消費者に適した取材サイズを設定します.
- 公的な JSON 資源パラメータと署名された入力リクエストパラメータは関連性があるが,交換可能なワイヤフォーマットではない.入力リクエンス封筒では SDK または CLI を好む.

## ソースおよび関連文書 {#source-and-related-docs}

- [カーソール支持のページ化統合テストは,ピンされた commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs) で
- [クエリビルダーとセレクター行動がピンされた commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs)のクエリパラメータとカーソルモデル
- [問い合わせ](/ja/blockchain/queries.md)
- [問い合わせの参照](/ja/reference/queries.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
