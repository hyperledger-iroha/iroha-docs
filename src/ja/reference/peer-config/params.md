---
translation_locale: ja
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 設定パラメータ {#configuration-parameters}

汚染物質

## ルーツレベル {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

各トランザクションに含まれなければならないチェーン ID リプレイ攻撃を防ぐために使用される.

リプレイ攻撃は,その目的とは異なるネットワークに有効なトランザクションを提出する試みである. `chain`が署名されたトランザクションの有用荷の一部であるため,一つのチェーンに署名したトランザクションは,別のチェーン ID を使用するピアによって拒否される.

<param-table type=string env=CHAIN />

::: コードグループ

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

同級の公開鍵.コンセンサス検証者同級者は BLS-Normalキーを使用しなければならない.

<param-table type="public-key" env="PUBLIC_KEY" />

::: コードグループ

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

ピアのプライベートキー. `public_key` に一致しなければならない;コンセンサス検証するピアは BLS-Normal キーを使用しなければならない.

<param-table type="private-key" env="PRIVATE_KEY" />

::: コードグループ

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

既定の信頼性のある同級者のリスト

コンセンサス検証者は BLS-Normal peer keysを使用しなければならない.各認証者に対して,一致する[`trusted_peers_pop`](#param-trusted-peers-pop)入力も提供してください.

<param-table env="TRUSTED_PEERS">
<template #type>

P2P アドレスが知られている場合, `PUBLIC_KEY@ADDRESS` を使用し,裸の `PUBLIC_KEY` も受け入れられ,同級者のアドレスを八から発見することができます.

</template>
</param-table>

::: コードグループ

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

BLS 検証者の信頼性のある同類の所有権証明書エントリー

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` と `pop_hex` のフィールドを持つオブジェクトの配列

</template>
</param-table>

::: コードグループ

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

## 創世記 {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign`によって生成される署名されたゲネスブロックの有用な負荷へのファイル経路.生成されたプロフィールでは,一般的に Norito `.nrt`ファイルとしてこれを記述する.

<param-table type="file-path" env="GENESIS" />

::: コードグループ

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

ゲネスキーパーの公钥

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: コードグループ

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

合意 (sumeragi) とブロック同期 (block_sync) の目的のために p2p通信のアドレス.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: コードグループ

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

ピアツーピー アドレス (他のピアツーパーが見るように外部).

他の同級生に噂を伝えられるように

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: コードグループ

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

単一の同期メッセージで送信できるブロックの数.

<param-table type=number default-value=4 />

::: コードグループ

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新ブロックのピアへの要求間の時間間隔.

より頻繁な雑言は シンクロレーションの時間を短縮しますが ネットワークを過積もることができます

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: コードグループ

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

噂のバッチメッセージで最大取引数

サイズが小さければ,同期時間が長くなりますが,パケットの損失が高い場合,有用です.

<param-table type=number default-value=500 />

::: コードグループ

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

同級者の間の取引を待機する噂の時期

より頻繁な雑言は シンクロレーションの時間を短縮しますが ネットワークを過積もることができます

<param-table type=millis default-value=1_000 default-note="1 second" />

::: コードグループ

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

同級者との接続が休止される期間.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: コードグループ

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii サーバーが聴いて,クライアントが要求するアドレス.

<param-table type=socket-addr env=API_ADDRESS />

::: コードグループ

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii エンドポイント](/ja/reference/torii-endpoints.md)によって受け入れられた原料要求体内の最大バイト数.

この制限は, DOS 攻撃を防ぐために使用されます.

<param-table>
<template #type>

バイト数

</template>
<template #default-value>

`64_000_000` (64百万バイト)

</template>
</param-table>

::: コードグループ

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

商店にアクセスできない場合,問い合わせが保持できる時間です.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: コードグループ

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

ライブリクエストの最大限度

<param-table type=number default-value=128 />

::: コードグループ

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

単一のユーザーに対するライブ查询数の上限.

<param-table type=number default-value=128 />

::: コードグループ

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## 伐採家 {#logger}

### `logger.level` {#param-logger-level}

一般的なログ付け動詞性 (精製された構成については [`logger.filter`](#param-logger-filter)を参照してください).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

文字列,可能な値:

- `TRACE`: 低レベル作戦を含むすべてのイベント
- `DEBUG`:デバッグレベルのメッセージ,診断に使える.
- `INFO`: 一般的な情報メッセージ
- `WARN`: 潜在的な問題を示す警告
- `ERROR`:正常な動作を妨げるが,継続的な操作が可能とするエラー.

使用事例に最も適したレベルを選択してください.異なるログレベルの使用方法についての詳細については [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)を参照してください.

</template>
</param-table>

::: コードグループ

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip 実行時間更新

このパラメータは, Torii オペレーターのエンドポイントを通じて実行時間の設定更新の対象となります.

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level)に加えて精製されたログフィルター. 目標ごとにログの動詞をカスタマイズすることができます.

<param-table type=string env=LOG_FILTER>
<template #type>

文字列 (String) は,コマで分離された1つまたは複数の指令で構成される.各指令には,対応する最大動詞性レベルが可能であるため (例えば,選択する) 範囲と一致するイベントがあります.Iroha は,より少ない排他的なレベル (例えば `trace`または`info`) を,より多くの排他的な水準 (例えば `error`または `warn`) に比べて,より言語的に表現すると考えます.

高いレベルでは,指令の構文はいくつかの部分で構成されている.

```
target[span{field=value}]=level
```

詳細については, [`tracing-subscriber`ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html)を参照してください.

</template>

</param-table>

::: コードグループ

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level)との互換性

`logger.filter`は, [`logger.level`](#param-logger-level)と協働し,いずれも他のいずれかを重複しない.

例えば, `logger.level` 設定されている `INFO` そして `logger.filter` 設定されている `iroha_core=debug`, 発生したフィルターセットは `info,iroha_core=debug` (つまり, `info` すべてのモジュールについては, `debug` に関する `iroha_core`).

:::

::: tip 実行時間更新

このパラメータは, Torii オペレーターのエンドポイントを通じて実行時間の設定更新の対象となります.

:::

### `logger.format` {#param-logger-format}

記録格式

<param-table default-value=full env=LOG_FORMAT>
<template #type>

文字列,可能な値:

- `full`: デフォルトフォーマッター. これは,発生するすべてのイベントに対して人間に読み取れる単行列ログを発信し,現在のスペンコンテキストがイベントのフォーマットされた表現の前に表示されます.
- `compact`:短行の長さのために最適化されたデフォルトフォーマターの変形.現在のスペンコンテキストからのフィールドは,フォーマットされたイベントのフィールドに添付され,スペンの名前が表示されません. 動詞性レベルは単一の文字に縮小されます.
- `pretty`: 人間が読めるように最適化された,過度に美しい多行ログを発行する. これは主にローカル開発やデバッグ,またはコマンドラインアプリケーションで使用するために意図されています.ログの自動化分析とコンパクトな保管が読みやすさと視覚的な魅力よりも優先事項ではない場合.
- `json`: ニューラインデレミテッド JSON ログの出力. これは,構造化されたログが分析および閲覧ツールによって JSON として消費されるシステムでの生産使用のために意図されています. JSON 出力は人間の読みやすさのために最適化されていません.

詳細とサンプル出力については, [`tracing-subscriber`ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html)を参照してください.

</template>
</param-table>

::: コードグループ

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura は, Iroha (倉庫のための日本語) の持続的な貯蔵エンジンです.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最長はN最後のブロックがメモリに保存されます.

古いブロックはメモリから削除され,必要に応じてディスクから読み込みされます.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: コードグループ

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura 初期化モード

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

文字列,可能な値:

- `strict`:すべてのブロックの厳格な検証
- `fast`: 基本的なチェックのみによる迅速な初期化

</template>
</param-table>

::: コードグループ

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ブロックが保管されているディレクトリ[^paths]を指定します.

[`snapshot.store_dir`](#param-snapshot-store-dir)を参照してください.

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: コードグループ

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

コンソールで新しいブロックを印刷できるようにするフラグ.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: コードグループ

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## 排列 {#queue}

### `queue.capacity` {#param-queue-capacity}

順番待ちの取引数の上限.

<param-table type=number default-value=65_536 />

::: コードグループ

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

単一のユーザの行列に待っている取引数の上限.

このオプションを使用して窒息を施す.

<param-table type=number default-value=65_536 />

::: コードグループ

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

取引は,この時間以降,まだ排列中にいる場合,中止されます.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: コードグループ

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi ソフトフォーク処理経路を実行するためのデバッグのみスイッチ.制御されたテストの外にこれを無効にしておく;実行中の生産ネットワークで変更すると,共感行動について同僚の意見が異なってしまう可能性があります.

<param-table type=bool default-value=false />

::: コードグループ

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## スナップショット {#snapshot}

このモジュールは, [World State View](/ja/blockchain/world#world-state-view-wsv)の瞬間の読み書きを担当します.

スナップショットは World State View の連続化チェックポイントを保存し,ピアが Kura からすべてのブロックを再再生することなく再起動することができます. Kura は持続的なブロックの歴史であり,再プレイの真実源であり,スナップショットは加速経路です.起動時に, Iroha はスナップショットメタデータを設定されたチェーンと保存されたブロックに対して確認し,スナップシュートをロードするか再再生するかどうかを決定します.

::: tip スナップショットを消す

[`snapshot.store_dir`](#param-snapshot-store-dir)で指定したディレクトリを削除できます.

:::

### `snapshot.mode` {#param-snapshot-mode}

スナップショットシステムが動作するモード.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

文字列,可能な値:

- `read_write`: Iroha は, [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)で指定された期間でのスナップショットを作成します.起動時に, Iroha は既存のスナップシュートを読み取って (存在する場合は) ブロックのストレージに最新であることを確認します.
- `readonly`: `read_write` に似ていますが, Iroha はスナップショットを作成しません.
- `disabled`: Iroha は起動時に新しいスナップショットを作成したり,既存の写真を読み取ったりしません.

</template>
</param-table>

::: コードグループ

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

速拍の頻度

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: コードグループ

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

スナップショットを保存する目録.

参照: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: コードグループ

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## テレメトリ {#telemetry}

テレメトリは,ペア診断を外部のテレメトリ・コレクターに輸出する. ピアが収集者に報告すべきときに `telemetry.name` と `telemetry.url`の両方を設定し,テレメトリックを使用しない場合はセクションを省略します.

`name`と `url`はペアする必要があります.

すべての `telemetry`セクションはオプションです.

### `telemetry.name` {#param-telemetry-name}

テレメトリに表示されるノードの名前.

<param-table type=string />

::: コードグループ

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

遠隔測定器の WebSocket URL

<param-table type=string />

::: コードグループ

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

再び接続するまでの最小の待機期間

<param-table type=millis default-value=1_000  default-note="1 second" />

::: コードグループ

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

再接続間の遅延を増やすために使用される最大指数2である.

<param-table type=number default-value=4 />

::: コードグループ

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Dev-テレメトリを書き出すファイルパス

<param-table type=file-path />

::: コードグループ

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
