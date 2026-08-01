---
translation_locale: ja
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# 質問 {#queries}

イベントサブスクリプションとフィルターはブロックチェーン状態の変更をフォローすることができます. 現在の状態の直接表示が必要な場合,クエリを使用します.

指示のような小さなオブジェクトです Iroha 同僚に1人を送って その現在の世界状況についての詳細を受け取る.

ネットワークは他の情報を暴露する可能性があります. Iroha ネットワークで利用可能な保証された唯一の世界国家に関する情報です.

Iroha の部署ごとに,他の情報も利用可能である. 例えば,テレメトリデータの利用性はネットワーク管理者にかかっている. 配分するかどうかは 自分たちの決定です実際の作業を行うために使用する代わりに,作業を追跡するための処理能力です. 一方,一部の機能は常に必要である. 例えば口座の余分にアクセスすること.

問い合わせの結果は [排列](#sorting), [ページを並べた](#pagination) そして [フィルタリング](#filters) メタデータキーでレクシコグラフィカルに排列されます.フィルタリングは多種原則に基づいて行われます. IP アドレスのフィルターマスク) をサブ文字列の方法に `begins_with` 論理操作を用いて組み合わせる.

## Taira で試してみてください {#try-it-on-taira}

Taira は,共通のリソースのために,読みのみのクエリヘルパーを JSON に曝します. SDK をワイヤリングする前にページ化と応答処理を実践するためにそれらを使用します:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

アプリの診断のために,これらの喫煙チェックを署名されたトランザクションテストから切り離してください. 読み込みのみのクエリ失敗は通常,サインナーセットアップを指す前にエンドポイントの利用可能性,ネットワークアクセシビリティ,またはルート互換性を指します.

## 查询を作成する {#create-a-query}

SDK または CLI から入力されたクエリビルダーを使用します.例えば,現在のデータモデルでは `FindAccounts`をリストアップアカウントに示しています:

```rust
let query = FindAccounts;
```

アリスの資産を見つけ出す質問の一例です

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## ページを表示する {#pagination}

単一の問い合わせや小回帰可能な問い合わせでは, `client.request` を使用して質問を送信し,結果を一度に取得できます.

しかし, `FindAccounts`, `FindAssets`,または `FindBlocks` のような広範なリターン可能なクエリは,大きな結果セットを返却することができます.ペアとクライアントの負荷を減らすためにページ化を使用します.

`Pagination` を作成するには, `client.request_with_pagination(query, pagination)` に電話する必要があり,その場合`pagination` は次のように構成されています.

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## フィルター {#filters}

クエリを作成すると,指定されたフィルターに一致する結果のみを返却するためにフィルタを使用することができます

フィルターはクエリ特定です.例えば,アカウントクエリはアカウントのアイデンティティまたはメタデータによって絞り込むことができるが,資産クエリは資産によって絞ることができます SDK の入力されたクエリビルダーを使用して,フィルタータイプがクエリアウトプットタイプに一致できるようにします.

## 排序 {#sorting}

Iroha 商品を並べることができる [メタデータ](/ja/blockchain/metadata.md) クエリの構築中にソートする鍵を提供した場合典型的な使用例は,口座には `registered-on` メタデータ入力で,整理された場合,アカウント登録履歴を表示できます.

排序は, [メタデータ](/ja/blockchain/metadata.md)を持つエンティティにのみ適用される.

ページ整理とフィルタを組み合わせることができます.排序はオプションの機能であり,ページ化に関するほとんどのクエリには必要ありません.

## 参照 {#reference}

[既存の問い合わせのリスト](/ja/reference/queries.md)をチェックして,その詳細な情報を得る.
