---
translation_locale: ja
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# クエリ {#queries}

イベントの購読者とフィルターは、ブロックチェーンの状態の変化を追跡できます。現在の状態を直接確認する必要がある場合は、クエリを使用してください。

クエリは小さな指示のようなオブジェクトです。現在のワールド状態のビューから詳細を受け取るために、1つを Iroha ネットワークピアに送信してください。

ネットワークは他の情報を公開する可能性があります。問い合わせ可能なワールドステート情報だけが、すべての Iroha ネットワークで利用可能であることが保証されている種類です。

Iroha の各デプロイメントごとに、他の利用可能な情報が存在する場合があります。例えば、テレメトリデータの利用可能性はネットワーク管理者次第です。作業の追跡に処理能力を割くか、実際の作業に使うかは完全に彼らの判断に委ねられています。それに対して、いくつかの機能は常に必要です。例えば、口座残高にアクセスできることなどです。

クエリの結果は、[並べ替えられた](#sorting)、[ページ分割された](#pagination)、[フィルタリングされた](#filters) のピア側すべてで一度に取得できます。ソートはメタデータキーに基づいて辞書順で行われます。フィルタリングを行うことができますさまざまな原則に基づき、ドメイン固有（個別の IP アドレスフィルタマスク）から、論理演算を用いて組み合わせた `begins_with` のような部分文字列の手法まで。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

Taira は、一般的なリソースに対して JSON の読み取り専用クエリヘルパーを公開します。これらを使用して SDK を接続する前に、ページネーションとレスポンス処理の練習を行ってください。

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

アプリの診断のために、これらのスモークチェックは署名済みトランザクションのテストとは分けて行ってください。読み取り専用のクエリの失敗は、通常、暗号署名設定よりも前に、API エンドポイントの可用性、ネットワーク到達性、またはルートの互換性を示しています。

## クエリを作成する {#create-a-query}

SDK または CLI から型付きクエリビルダーを使用してください。例えば、現在のデータモデルはアカウントを一覧表示するために `FindAccounts` を公開しています:

```rust
let query = FindAccounts;
```

こちらは Alice の資産を見つけるクエリの例です：

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## ページネーション {#pagination}

単一のクエリや小さな反復可能なクエリの場合、`client.request` を使用してクエリを送信し、一度に結果を得ることができます。

しかし、`FindAccounts`、`FindAssets`、または`FindBlocks`のような広範な反復可能なクエリは、大きな結果セットを返す可能性があります。ネットワークピアとクライアントへの負荷を減らすために、ページネーションを使用してください。

`Pagination` を構築するには、`client.request_with_pagination(query, pagination)` を呼び出す必要があります。ここで、`pagination` は次のように構築されます:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## フィルター {#filters}

クエリを作成するとき、指定したフィルターに一致する結果のみを返すようにフィルターを使用することができます。

フィルターはクエリに特化しています。例えば、アカウントのクエリはアカウントの識別情報やメタデータで絞り込むことができ、資産のクエリは資産で絞り込むことができます定義、保有者アカウント、またはドメインの投影。SDK の型付きクエリビルダーを可能な限り使用して、フィルタータイプがクエリ出力タイプと一致するようにしてください。

## 並べ替え {#sorting}

Iroha は、クエリの構築時にソートキーを指定すれば、[メタデータ](/ja/blockchain/metadata.md) を辞書順に並べ替えることができます。典型的な使用例としては、アカウントに `registered-on` のメタデータエントリがあり、それをソートすることでアカウントの登録履歴を表示できる場合があります。

ソートは [メタデータ](/ja/blockchain/metadata.md) を持つエンティティにのみ適用されます。これは、メタデータキーがクエリ結果をソートするために使用されるためです。

ソートは、ページネーションやフィルターと組み合わせることができます。ソートはオプション機能であることに注意してください。ページネーションを使用するほとんどのクエリでは必要ありません。

## 参照 {#reference}

それらの詳細情報については、[既存のクエリの一覧](/ja/reference/queries.md)を確認してください。
