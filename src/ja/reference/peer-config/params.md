---
translation_locale: ja
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 構成パラメータ {#configuration-parameters}

[[目次]]

## ルートレベル {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

各トランザクションに含める必要があるチェーンID。リプレイ攻撃を防ぐために使用される。

リプレイ攻撃とは、有効な取引を意図されたネットワークとは異なるネットワークに送信しようとする試みです。`chain`が署名済み取引のペイロードの一部であるため、あるチェーン用に署名された取引は、別のチェーンIDを使用するネットワークのピアによって拒否されます。

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

ネットワークピアの公開鍵。コンセンサスのバリデーターピアは BLS-Normal 鍵を使用する必要があります。

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

ネットワークピアの秘密鍵。`public_key` と一致する必要があります。コンセンサスのバリデーターピアは BLS-Normal 鍵を使用する必要があります。

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

事前に定義された信頼できるネットワークピアのリスト。

コンセンサスのバリデーターは BLS-Normal のピア鍵を使用する必要があります。各バリデーターについて、対応する [`trusted_peers_pop`](#param-trusted-peers-pop) エントリーも指定してください。

<param-table env="TRUSTED_PEERS">
<template #type>

ネットワークピアの文字列の配列。P2P アドレスが分かっている場合は `PUBLIC_KEY@ADDRESS` を使用してください。裸の `PUBLIC_KEY` も受け入れられ、ゴシップからネットワークピアのアドレスを発見することができます。

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS バリデータ信頼ネットワークピアの証拠保有エントリ。

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key`および`pop_hex`フィールドを持つオブジェクトの配列

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## ブロックチェーンのジェネシス {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` によって生成された署名済みブロックチェーンジェネシスブロックペイロードのファイルパス。生成されたプロファイルは、通常これを Norito `.nrt` ファイルとして書き込みます。

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

ブロックチェーンのジェネシス鍵ペアの公開鍵。

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## ネットワーク {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

コンセンサス（sumeragi）およびブロック同期（block_sync）の目的でのピアツーピア通信のためのアドレス。

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

ピアツーピアアドレス（外部、他のネットワークピアから見たもの）。

接続されたネットワークのピアにゴシップされ、それによって他のネットワークピアにゴシップされるようになります。

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

1つの同期メッセージで送信できるブロックの数。

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

ネットワークピアに最新のブロックを要求する間の時間間隔。

より頻繁な噂のやり取りは同期までの時間を短縮しますが、ネットワークに負荷をかける可能性があります。

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

ゴシップバッチメッセージ内の最大取引数。

サイズが小さいと同期にかかる時間は長くなりますが、パケット損失が多い場合には役立ちます。

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

ネットワークピア間の取引保留中のゴシップ期間。

より頻繁な噂のやり取りは同期までの時間を短縮するが、ネットワークに負荷をかける可能性がある。

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

ネットワークピアがアイドル状態の場合に、ネットワークピアとの接続が終了するまでの期間。

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii サーバーが待機し、クライアントがリクエストを行うアドレス。

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii API エンドポイント](/ja/reference/torii-endpoints.md) が受け入れる生リクエストボディの最大バイト数。

この制限は、DOS 攻撃を防ぐために使用されます。

<param-table>
<template #type>

数（バイト数）

</template>
<template #default-value>

`64_000_000`（6400万バイト）

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

クエリがアクセスされない場合にストア内に保持される時間。

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

ライブクエリの数の上限。

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

単一ユーザーのライブクエリの数の上限。

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ロガー {#logger}

### `logger.level` {#param-logger-level}

一般的なログ出力の詳細度（参照 [`logger.filter`](#param-logger-filter) 洗練された設定用に)。

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

文字列、可能な値:

- `TRACE`: 低レベルの操作を含むすべてのイベント。
- `DEBUG`: 診断に役立つデバッグレベルのメッセージ。
- `INFO`：一般的な情報メッセージ。
- `WARN`：潜在的な問題を示す警告。
- `ERROR`: 通常の機能を妨げるが、操作の継続を可能にするエラー。

用途に最も適したレベルを選択してください。異なるログレベルの使い方についての詳細は、[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) を参照してください。

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip ソフトウェアランタイムの更新

このパラメータは、Torii オペレーターの API エンドポイントを通じて、ソフトウェアの実行時構成の更新の対象となります。

:::

### `logger.filter` {#param-logger-filter}

に加えて洗練されたログフィルター [`logger.level`](#param-logger-level). ターゲットごとにログの詳細度をカスタマイズできるようにします。

<param-table type=string env=LOG_FILTER>
<template #type>

文字列で、1つ以上のカンマ区切りのディレクティブで構成されます。各ディレクティブには対応する最大冗長レベルがあり、これにより一致するスパンやイベントが有効になります（例：選択されます）。Iroha は、より排他的でないレベル（`trace`や`info`のような）を、より排他的なレベル（`error`や`warn`のような）よりも冗長であると考えています。

大まかに言えば、ディレクティブの構文は複数の部分で構成されています：

```
target[span{field=value}]=level
```

詳細については、こちらを参照してください [`tracing-subscriber` ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info ～との構成 [`logger.level`](#param-logger-level)

`logger.filter` 一緒に働く [`logger.level`](#param-logger-level) そして、どちらももう一方を上書きしません。

例えば、`logger.level` が `INFO` に設定され、`logger.filter` が `iroha_core=debug` に設定されている場合、結果として得られるフィルターセットは `info,iroha_core=debug` になります（すなわち、すべてのモジュールに対して `info`、`iroha_core` に対して `debug`）。

:::

::: tip ソフトウェアランタイムの更新

このパラメータは、Torii オペレーター API エンドポイントを通じてソフトウェアの実行時設定更新の対象となります。

:::

### `logger.format` {#param-logger-format}

ログの形式。

<param-table default-value=full env=LOG_FORMAT>
<template #type>

文字列、可能な値:

- `full`：デフォルトのフォーマッター。これは、発生する各イベントに対して人間が読みやすい単一行のログを出力し、イベントのフォーマットされた表現の前に現在のスパンコンテキストを表示します。
- `compact`：デフォルトのフォーマッターのバリエーションで、短い行長に最適化されています。現在のスパンコンテキストのフィールドは、フォーマットされたイベントのフィールドに追加され、スパン名は表示されません；冗長度レベルは1文字で省略されます。
- `pretty`: 過剰に美しい複数行のログを出力し、人間の可読性向けに最適化されています。これは主にローカル開発で使用することを意図しています。デバッグや、コマンドラインアプリケーション向けでは、ログの自動分析やコンパクトな保存よりも、可読性や視覚的な魅力が優先される場合があります。
- `json`：改行区切りの JSON ログを出力します。これは、構造化されたログが分析および表示ツールによって JSON として処理されるシステムでの本番使用を意図しています。JSON の出力は人間の可読性には最適化されていません。

詳細およびサンプル出力については、こちらを参照してください [`tracing-subscriber` ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura は、Iroha（倉庫を意味する日本語）の永続的なストレージエンジンです。

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最大でN個の最後のブロックがメモリに保存されます。

古いブロックは、必要に応じてメモリから削除され、ディスクから読み込まれます。

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura 初期化モード。`strict` は通常かつデフォルトのモードであり、ノードがアクティブになる前に、標準的な履歴、リカバリーアーティファクト、補助インデックス、およびストレージ会計を検証します。

`fast` は、完全な起動監査を行うと停止のリスクがある場合に、運用の可視性を回復するための緊急のサービス低下モードです。これは、以前に `strict` によって初期化されたストレージと、正確に5つのアーティファクトを含む現在のデータスナップショット生成を必要とします。 `snapshot.data`、`snapshot.sha256`、`snapshot.sig`、`snapshot.fast.norito`、および`snapshot.merkle.json`。ドメイン分離されたオペレーター署名は、広告されたペイロードの暗号ダイジェスト値と制約された技術マニフェストを結びつけます。技術的マニフェストは、ペイロードの長さ、チェーン/ネットワークの識別、端末の高さ/ハッシュ、SCCP ポリシー暗号ハッシュ、およびブートストラップ系統の存在を結びつけます。Fastはブートストラップ系統を拒否し、durable Kura からのまったく同じマーカー/カウント/チップ境界を必要とします。初回リリースノードは、まさにこれらの5つのアーティファクトのみを受け入れ、他のすべてのアーティファクトのカウントやファイル名セットを拒否します。

Fastはその五つの名前とメタデータをペイロードおよびMerkleファイルに結び付けますが、それらの内容を読み取ったり、暗号学的ハッシュを計算したり、解析したり、デコードしたりはしません。署名された技術マニフェストから最小限の World/Nexus を構築し、正確な Kura 暗号ハッシュの接頭辞を読み取り専用でマッピングし、データスナップショットの World、ブロックハッシュ配列、トランザクション履歴、派生インデックス、および耐久リカバリジャーナルは開かないままにします。メルクル、正準およびセマンティックデータスナップショット監査、履歴ブロック／最終確定／SCCP 照合、Sumeragi アクティブ高さ回復、マージおよびクエリジャーナル、実行レーンマニフェスト／コンプライアンスソース、Kura 支援 SoraFS アーカイブ、再帰的ストレージ会計、そしてオプションのサービス和解者は引き続き延期されています。ローカルトランザクションの承認、提案、投票、標準的な書き込み、および補助的なプロデューサーは引き続き無効のままです。Kura 自体はライターの起動や永続的な変更を拒否します。ソフトウェア処理のワークフローおよび FASTPQ 永続キューは、作業を保持またはエンコードするのではなく、直ちに処理を拒否します。 Kura は APIs を読み取り、修復および耐久性同期の動作も無効にします: 一時的な補助レコードは昇格されず、欠落している実行レーンのアーティファクトは公開されず、進行のバリアは fsync されません。 Sumeragi およびトランザクションのゴシップも起動されません。Torii はヘルス、ライブネス、レディネス、ネットワークピア、および構成の操作のみを公開します。API のバージョン、ステータス、メトリクス、およびすべての通常の状態/履歴ルートは利用できません。レディネスは厳格な再起動まで利用できません。

`fast`はインシデントのみに使用してください。サービスが安定したら、ノードを停止し、`strict`を復元して再起動し、すべての延期されたチェックとインデックスの再構築が本番再開前に実行されるようにしてください。高速モードでは、遅延マージログは不要であり、標準ストレージの作成、修復、切り捨て、インポートは行われません。未公開のサフィックスや保留中の補助回復ステージは、読み取ったり変更したりせずに無視され、その後Strict回復のために残されます。インポートされたハッシュのみのデータスナップショット系統は利用できません。現在のデータスナップショットが存在しないか無効な場合、即座に失敗します。Fastは決して空のワールドや過去のリプレイ再構築にフォールバックしません。

<param-table default-value=strict>
<template #type>

文字列、可能な値:

- `strict`：完全な検証と通常の生産
- `fast`：生産を隔離したままでの制限付き緊急起動、厳格な再起動まで

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ブロックが保存されるディレクトリ[^paths]を指定します。

参照： [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

新しいブロックをコンソールに出力するためのフラグ。

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## 列 {#queue}

### `queue.capacity` {#param-queue-capacity}

キューで待機している取引の件数の上限。

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

単一ユーザーの待機中の取引数の上限。

このオプションを使用してスロットリングを適用してください。

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

この時間を過ぎても取引がまだキューにある場合、取引は取り消されます。

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

デバッグ専用のスイッチで、Sumeragi ソフトフォークの処理パスを実行できます。制御されたテスト以外では無効のままにしてください。稼働中の本番ネットワークでこれを変更すると、ネットワークのピアがコンセンサスの挙動について意見が合わなくなる可能性があります。

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus アトミックな個人金融取引決済 {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]`は、個別の`AtomicPrivateSettlementV1`パスを管理します。デフォルトでは無効になっています。`enabled = true`を設定するには`activation_height`も必要です；オンチェーン機能、通知期間、固定証明プロファイル、およびプール/監査ガバナンスが有効でない限り、入場は依然として閉じた状態で失敗します。

主な境界は`max_participants`、`max_expiry_blocks`、`audit_timeout_blocks`、`prepare_timeout_blocks`、`commit_timeout_blocks`、`max_proof_bytes`、`max_capsule_bytes`、`max_carrier_bytes`、`sidecar_retention_blocks`、`sidecar_max_records`、および`sidecar_max_total_bytes`です。`capsule_padding_classes_bytes`は V1 パディングクラスの厳密に増加する部分集合でなければなりません。`permitted_policy_versions`は V1 のみを受け入れます。

`max_capsule_bytes` は、暗号化テキストのみの制限ではなく、`PrivateSettlementAuditCapsuleV1` の完全な Norito バイト、AAD、暗号用ノンス値、暗号文、ベクターフレーミング、そしてすべての監査人がラップした DEK 行を含めて測定します。すべての有効なパディングクラスは、少なくとも`default_min_auditor_approvals`人の監査人向けに、保守的な全カプセルデータコンテナに適合しなければなりません。その承認設定はまた規制された下限でもあります：Torii は、より低い`min_approvals`値を持つ新規承認ポリシーを拒否し、標準バイト制限を超える実際のカプセルも拒否します。

これらの設定には、本番環境の環境変数アクティベーションのバイパスはありません。完全な構成例と運用要件については[アトミックなプライベートクロスデータスペースの金融取引決済を実行する](/ja/get-started/atomic-private-settlement)を参照してください。文書化された外部リリースゲートが通過するまでは、パスは本番適格ではありません。

## データスナップショット {#snapshot}

このモジュールは、[ワールド・ステート・ビュー](/ja/blockchain/world#world-state-view-wsv) のデータスナップショットの読み取りと書き込みを担当します。

データスナップショットは、ネットワークピアがすべてのブロックを Kura から再生することなく再起動できるように、World State Viewのシリアライズされたチェックポイントを保存します。Kura は引き続き耐久性のあるブロック履歴であり、再生のための真実のソースです。データスナップショットは加速パスとして機能します。起動時、Iroha はデータスナップショットのメタデータを設定されたチェーンおよび保存されているブロックと照合し、データスナップショットをロードするか、リプレイに切り替えるかを決定します。

::: tip データスナップショットを消去する

データスナップショットシステムに何か問題があり、そこから再開したい場合は 空白のページ（データスナップショットの観点から）、指定されたディレクトリを削除することができます [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

データスナップショットシステムが動作するモード。

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

文字列、可能な値:

- `read_write`: Iroha 指定された期間でデータスナップショットを作成する [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). 起動時に、 Iroha 既存のデータスナップショット（存在する場合）を読み取り、それがブロックストレージと最新であることを確認します。
- `readonly`： `read_write`に似ていますが、Iroha はスナップショットを作成しません。
- `disabled`：Iroha は、起動時に新しいデータスナップショットを作成したり、既存のものを読み取ったりしません。

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

スナップショットの頻度。

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

スナップショットを保存するディレクトリ。

参照： [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## テレメトリー {#telemetry}

テレメトリはネットワークピアの診断情報を外部テレメトリコレクターにエクスポートします。ネットワークピアがコレクターにレポートする必要がある場合は、`telemetry.name` と `telemetry.url` の両方を設定してください。テレメトリを使用しない場合は、このセクションを省略してください。

`name` と `url` はペアにする必要があります。

すべての`telemetry`セクションは任意です。

### `telemetry.name` {#param-telemetry-name}

テレメトリに表示されるノードの名前。

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

テレメトリーコレクターの WebSocket URL。

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

再接続する前に待つ最小の期間。

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

再接続間の遅延を増加させるために使用される2の最大指数。

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

dev-telemetryを書き込むファイルパス

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
