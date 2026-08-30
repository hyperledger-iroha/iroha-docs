---
translation_locale: ja
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 設定パラメータ {#configuration-parameters}

汚染物質

## 根本レベル {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

各トランザクションに含まれなければならないチェーン ID リプレイ攻撃を防ぐために使用される.

リプレイ攻撃は,その目的とは異なるネットワークに有効なトランザクションを送信する試みである. `chain`が署名されたトランザクションの役に立たない負荷の一部であるため,一つのチェーンで署名したトランザクションは,別のチェーン ID を使用するピアによって拒否される.

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

同級の公開鍵.コンセンサス検証者同級者は BLS-Normalキーを使用しなければならない.

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

ピアのプライベートキー. `public_key` に一致しなければならない;コンセンサス検証するピアは BLS-Normal キーを使用しなければならない.

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

既定の信頼性のある同級者のリスト

コンセンサス検証者は BLS-Normal peer keysを使用しなければならない.各認証者に対して,一致する[`trusted_peers_pop`](#param-trusted-peers-pop)入力も提供してください.

<param-table env="TRUSTED_PEERS">
<template #type>

P2P アドレスが知られている場合, `PUBLIC_KEY@ADDRESS` を使用し,裸の `PUBLIC_KEY` も受け入れられ,同級者のアドレスを八から発見することができます.

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

BLS 検証者の信頼性のある同類の所有権証明書エントリー

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` と `pop_hex` のフィールドを持つオブジェクトの配列

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

## 創世記 {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign`によって生成される署名されたゲネスブロックの有用な負荷へのファイル経路.生成されたプロフィールでは,一般的に Norito `.nrt`ファイルとしてこれを記述する.

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

ジェネスキーパーの公钥.

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

合意 (sumeragi) とブロック同期 (block_sync) の目的のために p2p通信のアドレス.

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

ピアツーピー アドレス (他のピアツーパーが見るように外部).

他の同級生に噂を伝えられるように

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

単一の同期メッセージで送信できるブロックの数.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新ブロックのピアへの要求間の時間間隔.

より頻繁な雑言は シンクロレーションの時間を短縮しますが ネットワークを過積もることができます

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

噂のバッチメッセージで最大取引数

サイズが小さければ,同期時間が長くなりますが,パケットの損失が高い場合,有用です.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

同級者の間の取引を待機する噂の時期

より頻繁な雑言は シンクロレーションの時間を短縮しますが ネットワークを過積もることができます

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

同級者との接続が休止される期間.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii サーバーが聴いて,クライアントが要求するアドレス.

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

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

商店にアクセスできない場合,問い合わせが保持できる時間です.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

ライブリクエストの最大限度

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

単一のユーザーに対するライブ查询数の上限.

<param-table type=number default-value=128 />

::: code-group

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

::: code-group

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

文字列 (String) は,コマによって分離された1つまたは複数の指令で構成される.各指令には,相応しい最大動詞性レベルがあり,それに対応する範囲とイベントを可能とする (例えば選択する)Iroha は,より少ない排他的なレベル (例えば `trace`または`info`) を,より多くの排他的な水準 (例えば `error`または `warn`) に比べて,より言語的に表現すると考えます.

高いレベルでは,指令の構文はいくつかの部分で構成されている.

```
target[span{field=value}]=level
```

詳細については, [`tracing-subscriber`ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html)を参照してください.

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

::: info [`logger.level`](#param-logger-level) との組み合わせ

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

- `full`: デフォルトフォーマッター. これは,発生するすべてのイベントに対して人間に読める単行列ログを発信し,現在のスペンコンテキストがイベントのフォーマットされた表示前に表示されます.
- `compact`:短行の長さのために最適化されたデフォルトフォーマッターの変形.現在のスペンコンテキストからのフィールドは,フォーマットされたイベントのフィールドに添付され,スペン名は表示されません.動詞性レベルが単一文字に縮小されます.
- `pretty`: あまりにも美しい,多行的なログを排出し,人間の読めるために最適化されています. これは主に地域開発に使用されるためログの自動分析とコンパクトストレージが可読性や視覚的な魅力を上回る優先事項である場合,デバッグまたはコマンドラインアプリケーション.
- `json`:ニューラインデリミテッド JSON ログの出力.これは,構造化されたログが分析および閲覧ツールによって JSON として消費されるシステムでの生産使用のために設計されています. JSON 輸出は人間の読みやすさに最適化されていません.

詳細とサンプル出力については, [`tracing-subscriber`ドキュメント](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html)を参照してください.

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

Kura は, Iroha (倉庫のための日本語) の持続的な貯蔵エンジンです.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最長はN最後のブロックがメモリに保存されます.

古いブロックはメモリから削除され,必要に応じてディスクから読み込みされます.

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

Kura 初期化モード. `strict`は通常のおよびデフォルトモードである:ノードがアクティブになる前に,正規史,復元アーテファクト,補助インデックス,およびストレージ会計を検証する.

`fast`は,完全なスタートアップ監査が停電を脅かす場合,運用可視性を回復するための緊急劣化サービスモードである. `strict` で以前に初期化されたストレージと,正確に5つのアーテファクトを含む現在のスナップショット生成を必要とする.`snapshot.data`,`snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`,および `snapshot.merkle.json`.ドメイン別々のオペレーター署名は,広告されたペイロードダイジェストと制限されたマニフェストを結びつける.マニフェスは,ペイロードの長さ,チェーン/ネットワークアイデンティティ,端末高度/ハッシュ, SCCP ポリシーハッシュ,ブットストラップラインージの存在を結び付ける.Fastはブートストラップ系を拒絶し,耐久性 Kura から同じマーク/カウント/チップ境界を必要とします.最初のリリースノードはちょうどそれらの5つのアーテファクトを受け入れ,他のすべてのアーテファルト数またはファイル名セットを拒否します.

これらの5つの名前とメタデータを迅速に収集し,ペイロードとメルクルファイルを結合しますが,その内容を読み取ったり,ハッシュしたり,解析したり,解読したりしません.署名したマニフェストから最小の世界/Nexus を構築し,正確な Kura ハッシュプレフィキスを読み取りのみで地図化し,スナップショットワールド,ブロック-ハッシュアレイを残します.取引履歴,衍生指数,耐久性回復日記未開封. メークル,カノニック・セマンティックスナップショット監査,歴史的ブロック/最終性/SCCP 和解, Sumeragi アクティブ高度復元,合併およびクエリ日記,レーンマニスト/コンプライアンスソース,Kura が支援する SoraFS アーカイブ,リクティブストレージ会計,オプションサービスコンシリエーターは延期され続けています.地方の取引受付,提案,投票,正規文書,補助生産者は無効です.Kura 自体はライター起動と耐久性変異を拒絶し,パイプラインおよび FASTPQ 持続性キューは作業を保持またはコーディングするのではなくすぐに拒否します.Kura は APIs を読み取り,修理と耐久性同期の行動を無効化します:一時的なサイドカーが宣伝されず,行列遺跡が公表されず,進捗障壁が同期されない. Sumeragi とトランザクションゴシップは開始されません.Torii は健康,活力,準備性,同級型および構成操作のみを暴露する. API - バージョン,状態,メトリック,およびすべての通常の状態/歴史経路は利用できないままである. 準備性は厳重を再起動するまで使用できません.

`fast` をインシデントでのみ使用します.サービスが安定すると,ノードを停止し, `strict` を復元して再起動します.急速モードは,延期された合併ログを必要とせず,カノニカルストレージを作成したり,修理したり,切断したり,輸入したりしません. 未公開したサフイックスおよび待機中の補助復元段階は読み取らずにまたは変異せずに無視され,その後厳格復旧のために残されます.輸入されたハッシュのみのスナップショット配列は利用できないままです.欠落または無効な現在のスナップшотがすぐに失敗します.Fastは空の世界や歴史的な再生再構築に再び落ちません.

<param-table default-value=strict>
<template #type>

文字列,可能な値:

- `strict`:完全な検証と通常の生産
- `fast`: 生産が厳格な再起動まで隔離された緊急開始制限

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

ブロックが保管されているディレクトリ[^paths]を指定します.

[`snapshot.store_dir`](#param-snapshot-store-dir)を参照してください.

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

コンソールで新しいブロックを印刷できるようにするフラグ.

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

## 排隊 {#queue}

### `queue.capacity` {#param-queue-capacity}

順番待ちの取引数の上限.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

単一のユーザの行列に待っている取引数の上限.

このオプションを使用して窒息を施す.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

取引は,この時間以降,まだ排列中にいる場合,中止されます.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi ソフトフォーク処理経路を行使するためのデバッグのみスイッチ.制御されたテストの外にこれを無効にしておく.実行中の生産ネットワークで変更すると,共感行動について同僚が異議を唱える可能性があります.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus 原子力民間決済 {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` は別々の `AtomicPrivateSettlementV1` 経路を管理します.これはデフォルトで無効化されます. `enabled = true` の設定には, `activation_height` が必要です.オンチェーン機能,通知期間,固定証明プロフィール,プール/監査ガバナンスが有効でない限り,入場はまだ閉じるわけではありません.

主な境界線は `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, そして `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` 厳格に増加するサブセットである必要があります V1 パッシング教室 `permitted_policy_versions` 受け取るだけ V1.

`max_capsule_bytes`は, AAD, nonce, ciphertext, vector framing,および DEK 行に包まれたすべての監査者を含む完全な `PrivateSettlementAuditCapsuleV1` のカノニカル Norito バイトを測定する.すべての有効なパッディングクラスは,少なくとも `default_min_auditor_approvals` 監査者にとって保守的な全カプセル封筒に適合しなければならない.この承認設定はまた管理される階層である: Torii は`min_approvals` の値を下げる新たに認められたポリシーを拒絶し,正規バイト制限を超えた実際のカプセルを拒否する.

これらの設定には,生産環境変数アクティベーションバイパスがない.完全な構成例と運用要件については[Run Atomic Private Cross-Dataspace Settlement ](/ja/get-started/atomic-private-settlement) を参照してください.文書化された外部リリースゲートが通過するまではパスは生産資格を有しません.

## スナップショット {#snapshot}

このモジュールは, [World State View](/ja/blockchain/world#world-state-view-wsv)の瞬間の読み書きを担当します.

スナップショットは World State View の連続化チェックポイントを保存し,ピアが Kura からすべてのブロックを再再生することなく再起動することができます. Kura は持続的なブロックの歴史であり,再プレイのための真実の源であり,スナップショットは加速経路である.起動時に, Iroha はスナップショットメタデータを設定されたチェーンと保存されたブロックに対して確認し,スナップシュートをロードするか再再生するかどうかを決定します.

::: tip スナップショットを消す

[`snapshot.store_dir`](#param-snapshot-store-dir)で指定されているディレクトリを削除できます.

:::

### `snapshot.mode` {#param-snapshot-mode}

スナップショットシステムが動作するモード.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

文字列,可能な値:

- `read_write`: Iroha は, [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)で指定された期間でのスナップショットを作成します.起動時に, Iroha は既存のスナップシュートを読み取り (存在する場合は) ブロックのストレージと最新であることを確認します.
- `readonly`: `read_write` に似ていますが, Iroha はスナップショットを作成しません.
- `disabled`: Iroha は起動時に新しいスナップショットを作成したり,既存の写真を読み取ったりしません.

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

速拍の頻度

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

スナップショットを保存する目録

参照: [`kura.store_dir`](#param-kura-store-dir)

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

## テレメトリ {#telemetry}

テレメトリは,ペア診断を外部テレメトリコレクターに輸出する. ピアが収集者に報告すべきときに `telemetry.name` と `telemetry.url`の両方を設定し,テレメトリックを使用しない場合はセクションを省略します.

`name`と `url`はペアする必要があります.

すべての `telemetry`セクションはオプションです.

### `telemetry.name` {#param-telemetry-name}

テレメトリに表示されるノードの名前.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

遠隔測定器の WebSocket URL

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

再び接続するまでの最小の待機期間

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

再接続間の遅延を増やすために使用される最大指数2である.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Dev-テレメトリを書き出すファイルパス

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
