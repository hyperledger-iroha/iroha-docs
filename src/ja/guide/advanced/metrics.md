---
translation_locale: ja
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# パフォーマンスと指標 {#performance-and-metrics}

Iroha のパフォーマンスは、ワークロード、バリデータのトポロジー、ネットワーク条件、コンセンサス設定に依存します。したがって、単一の TPS の数値は、固定された構成でのベンチマーク実行に関連付けられている場合にのみ有用です。

キャパシティ計画のために、パフォーマンスを運用データのコンテナとして扱います:

- ネットワークは要求されたトランザクションレートを受け入れます
- プロトコルの最終化のレイテンシは目標の予算内に収まる
- トランザクションキューは制限されたままです
- コンセンサスは、繰り返されるビューの変更や回復経路に依存しない

このページを使用して、指定されたノード数、ネットワーク遅延の閾値、および目標 TPS に対して、デプロイメントが高、中、または低のパフォーマンス状態にあるかを推定します。

## 何を測るか {#what-to-measure}

まず、パブリックノードのデータスナップショットとPrometheusのスクレイプから始め、次にオペレーター認証済みのコンセンサス状態には CLI を使用します。オペレーターキーはターゲットノードで許可されている必要があり、ソフトウェアの実行時にのみ読み込まれます:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Public Taira は、匿名ノードスナップショットの形状を学習するのに便利です。そのオペレーター診断は、Taira オペレーターキーなしでは意図的に利用できません:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

自分の展開のための生産能力の数値として、パブリックテストネットの観察結果を使用しないでください。

テレメトリの可視性は、設定されたプロファイルに依存します。`operator` はステータスと診断スナップショットを有効にします。`extended` は `/metrics` と高コストのタイミングを追加します。一方で `developer` は、`/metrics` を有効にせずに、リーダー、QC、パラメータ、証拠などの開発者データスナップショットを追加します。1回の実行で両方のセットが必要な場合は `full` を使用してください。`telemetry_profile` は唯一の初回リリーステレメトリスイッチです。

```toml
telemetry_profile = "full"
```

## パフォーマンスバンド {#performance-bands}

これらのバンドを使用して、目標スループット `Y` TPS および遅延予算 `L` ミリ秒で観測された実行を行います。ワークロードを、ウォームアップ、定常状態、そして予想されるピーク負荷の少なくとも1期間を含むのに十分な長さで実行してください。

|バンド|条件|意味|
| --- | --- | --- |
|高い|受け入れスループットは `Y` 以上であり、p95 プロトコル最終化レイテンシは `0.8 * L` 未満で、キューは容量の 10% 未満のままであり、ビュー変更／リカバリカウンタは横ばいです|そのデプロイメントには、要求されたワークロードの余裕があります|
|中|受け入れられるスループットは`Y`に近く、p95プロトコル最終処理レイテンシは`L`以下であり、キューは容量の50％以下で安定しており、ビューの変更はまれです|デプロイは機能しますが、バースト耐性は限られています|
|低い|受け入れられたスループットが`Y`未満であり、p95プロトコルの最終処理レイテンシが`L`を超え、実行中にキューが増加する、またはビュー変更／バックプレッシャーカウンターが継続的に上昇する|要求された作業負荷は少なくとも1つのボトルネックを超えています|

重要なルールはキューの方向です。提出された TPS が確定済みの TPS より大きく、キューが増え続けている場合、短いサンプルが正常に見えてもデプロイメントは過負荷です。

## ノード数とクォーラム {#node-count-and-quorum}

バリデーターを増やすとフォールトトレランスは向上しますが、調整、署名、ネットワークファンアウトのコストが増加します。初回リリースの Sumeragi プロトコルでは次のことが必要です：

- 正確な`n = 3f + 1`投票委員会
- `4 <= n <= 31`、したがって有効なサイズは4、7、10などです
- 最終合意に必要な定足数 `2f + 1`
- オブザーバーネットワークのピアはブロックを同期するが、投票、提案、または収集は行わない

|バリデーター|フォールト予算|コンセンサスの最終化定足数|容量メモ|
| --- | --- | --- | --- |
| 4 | 1 | 3 |単一障害耐性のための共通の最小値|
| 7 | 2 | 5 |より回復力があり、より多くの投票と伝播トラフィックを持つ|
| 10 | 3 | 7 |より高い調整コスト；ネットワークと入口のチューニングがより重要になる|
| 31 | 10 | 21 |最大初回リリース委員会；ベンチマークの調整と署名コストを慎重に|

ブロックチェーンのジェネシス生成とスタートアップ検証は、適合しない委員会サイズを拒否します；リリースが受け入れられないトポロジーをベンチマークしないでください。

「Xノード」を評価する際には、投票バリデータとオブザーバーを分けて考えてください。オブザーバーを追加する方が通常、バリデータを追加するよりコストは低いですが、オブザーバーもブロックのゴシップ、ブロックの同期、ディスク、ネットワーク帯域を消費します。

## パフォーマンスに影響を与える要因 {#factors-that-influence-performance}

### ワークロードの形状 {#workload-shape}

同じ TPS でも、取引ごとに何をするかによって安くなることも高くなることもあります。記録:

- トランザクションあたりの命令数
- 署名数と署名アルゴリズム
- トランザクションのバイトサイズと解凍後のペイロードサイズ
- 読み書き比率
- メタデータのサイズとアセット操作
- スマートコントラクト、トリガー、そして IVM 実行コスト
- 同じネットワークピアに対して実行されているクエリ負荷

小規模な送金取引は、契約が多いワークロードやメタデータが多いワークロードの代理にはなりません。

### コンセンサスケイデンス {#consensus-cadence}

有効な Sumeragi パラメータデータスナップショットには、署名された不変ブロックのケイデンスとクロックドリフトの上限が含まれています:

- `block_cadence_ms`
- `max_clock_drift_ms`

それらを次で点検する:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` は署名付きブロックチェーンのジェネシスによって固定され、起動時にフリーズされます。これはライブの調整ノブではありません。異なる署名付きブロックチェーンのジェネシス入力を持つネットワークは、別々のベンチマークシナリオとしてのみ比較してください。ビューの変更、ペイロードの欠落による取得、またはバックプレッシャーが発生すると、短い周期のほうが持続可能なスループットを増やすよりも過負荷を目立たせることが多いです。

### 候補およびイングレス境界 {#candidate-and-ingress-bounds}

ノードローカル Sumeragi の境界は、バリデーターが保持できる候補およびリカバリ作業の量を決定します:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` と `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`、`sumeragi.queues.chunks`、および`sumeragi.queues.ready_bodies`

小さすぎる境界はキューやペイロード回復の負荷を生じさせ、過大な境界は保持されるメモリと、悪用するネットワークピアに利用可能な作業量を増加させます。1つの制限を変更する前に、プロセスメモリ、メッセージ処理、欠落ボディのメトリクスと診断データのスナップショットを比較してください。

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### ネットワーク環境 {#network-conditions}

コンセンサスのパフォーマンスは以下に敏感です:

- RTT バリデーター間
- ジッターとパケット損失
- ブロックペイロードおよび署名済み RS16 チャンクの帯域幅
- 地域間の非対称リンク
- NAT、ファイアウォール、またはネットワークピア接続を遅延させるリレーの挙動

計画ルールとして、レイテンシ予算を、複数回のバリデータラウンドトリップと実行およびディスク永続化時間をカバーできるだけ十分に高く設定してください。もし p95 ネットワーク RTT がすでに望ましい p95 プロトコル確定レイテンシに近い場合、目標は現実的ではありません。

### 待ち行列と入場制限 {#queues-and-admission-limits}

アドミッションおよびキュー設定は、ネットワークピアが吸収できるバースト圧力の量を定義します。

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- ブロックチェーンのジェネシストランザクションの制限（最大署名数、命令数、バイト数、解凍後のバイト数など）
- P2Pキューの上限とコンセンサスの入力制限

高いキュー容量はしばらくの間オーバーロードを隠すことができますが、持続可能なスループットを増加させることはできません。安定したキューは健全であり、増加するキューはバックログです。

### ハードウェアとストレージ {#hardware-and-storage}

リーダーだけでなく、すべてのバリデーターを測定する:

- CPU 検証、署名検証、および実行中の飽和
- キュー、データスナップショット、およびペイロード回復バッファによるメモリ圧迫
- ブロックストレージおよびデータスナップショットのディスク書き込みレイテンシ
- ネットワーク送受信飽和
- ワークロードで使用する場合のオプションのハードウェアアクセラレーション設定

最も遅い投票バリデーターがネットワークの末尾遅延を決定することができる。

## プロメテウスの信号 {#prometheus-signals}

メトリック名は、チェックインされたテレメトリカタログから取得されます。シリーズの利用可能性やサンプリングは、ビルド機能と`telemetry_profile`に依存するため、ダッシュボードを作成する前に対象ノードで`/metrics`を確認してください。

一般的な信号には以下が含まれます:

|信号|Prometheusの例|何を見るか|
| --- | --- | --- |
|受理スループット| `sum(rate(txs{type="accepted"}[5m]))` |定常状態において、目標 TPS を達成するか、それを上回るべきです|
|拒否| `sum(rate(txs{type="rejected"}[5m]))` |テスト計画で説明できるべきです|
|プロトコルの確定遅延| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |p95/p99 をレイテンシー予算と比較する|
|キューの深さ| `queue_size`、`sumeragi_tx_queue_depth` |ピーク時の負荷中は制限されたままであるべきです|
|キュー飽和| `sumeragi_tx_queue_saturated` |持続的なゼロでない値は過負荷を意味します|
|変更を表示| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |値の上昇は、タイミング、トポロジー、ペイロード、またはネットワークの問題を示します|
|ドロップされたメッセージ| `dropped_messages`、`sumeragi_consensus_message_handling_total` |負荷中のドロップは通常、レイテンシのスパイクを説明します|
|ペイロードと DA の回収| `sumeragi_missing_block_requests`、`sumeragi_missing_block_oldest_ms`、`sumeragi_missing_block_fetch_total`、`sumeragi_da_gate_block_total`、`sumeragi_da_gate_satisfied_total` |しつこい要求、増加する年齢、または繰り返される DA ゲートは、体やチャンクの取得の問題を示しています|
|コンセンサスの最終化定足数| `sumeragi_commit_signatures_counted`、`sumeragi_commit_signatures_required` |集計された署名は必要な定足数にすぐに達するはずです|

メトリックが `/v1/sumeragi/status` にのみ存在する場合は、Prometheus スクレイプと同じ実行成果物に JSON のデータスナップショットを取得してください。

## 見積もりワークフロー {#estimation-workflow}

1. シナリオを定義する:
   - バリデーター数とオブザーバー数
   - コンセンサスモード
   - ターゲット TPS
   - p95およびp99プロトコル確定のレイテンシ予算
   - 取引の種類
   - 予想されるネットワーク RTT、ジッター、および帯域幅
2. 有効な設定を記録してください：

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. ターゲット TPS でワークロードを実行してください。
4. 実行の開始、中間、終了時にステータスと指標を記録する。
5. パフォーマンスバンド表でランを分類してください。
6. もしバンドが中程度または低い場合は、1つの要素を一度に変更して繰り返してください。

## ベンチマークレポートテンプレート {#benchmark-report-template}

再現できる十分な文脈と共にのみ、パフォーマンスの数値を公開してください:

- Iroha プロトコルの確定、リリース、および機能フラグ
- バリデータおよびオブザーバーの数
- コンセンサスモード、署名付きブロックのケイデンス、そして DA レイアウト
- 正確な`3f + 1`委員会、定足数、およびオブザーバー名簿
- `sumeragi.block`、`sumeragi.queues`、`sumeragi.limits`、network-ingress、およびtransaction-queueの境界
- テレメトリープロファイル
- ハードウェア、ストレージ、そして OS の詳細
- ネットワーク RTT、ジッター、損失、帯域幅の前提
- トランザクションの種類とペイロードサイズ
- 提供された TPS と実行時間
- 受理/拒否 TPS
- p50/p95/p99 プロトコル最終化レイテンシ
- キュー深度と飽和
- ビューの変更、失われたメッセージ、欠落したブロックの取得、および DA-ゲートカウンター
- CPU、各バリデーターごとのメモリ、ディスク、およびネットワーク使用率

これらの詳細がなければ、TPS 番号は逸話的なものとして扱うべきです。

## 関連ページ {#related-pages}

- [イザナミによるカオステスト](./chaos-testing.md)
- [Torii API エンドポイント](../../reference/torii-endpoints.md)
- [CLI を介して Iroha 3 を操作する](../../get-started/operate-iroha-via-cli.md)
- [ネットワークピア設定リファレンス](../../reference/peer-config/params.md)
