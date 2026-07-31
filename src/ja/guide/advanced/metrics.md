---
translation_locale: ja
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 業績と指標 {#performance-and-metrics}

Iroha の性能は,ワークロード,検証器トポロジー,ネットワーク条件,コンセンサス設定に依存する.したがって,単一の TPS 番号は,固定配置のあるベンチマーク実行に結びついている場合にのみ有用である.

容量計画については,パフォーマンスを運用対象として扱う.

- ネットワークは,要求されたトランザクションレートを受け入れます
- 目標予算内での遅延維持を約束する
- トランザクションのキューは制限されます
- コンセンサスは繰り返しビュー変更や回復経路に依存しない.

このページを使用して,あるノード数値,ネットワーク遅延しきい値およびターゲット TPS に対して,デプロイメントが高,中,低性能状態にあるかどうかを推定します.

## 計測すべきもの {#what-to-measure}

Torii で暴露された操作者の表面から始めます.

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Taira に対して同じ読み込み式を試すことができます.

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

公共の Taira メトリックは信号名を学ぶのに役立ちます. 生産能力番号として使わないで

CLI で同じ合意の瞬間の写真が利用できます.

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

テレメトリの可視性は設定されたプロフィールに依存します. `/metrics`が必要なときに `extended` を使用し,また詳細な Sumeragi オペレーター経路が必要である場合,テスト実行中に `full` を使用してください.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## 性能帯 {#performance-bands}

これらの帯域を使用して,ターゲットループット `Y` TPS と遅延予算 `L`ミリ秒で観測された実行を行います.加熱状態,安定状態,および予想されるピークロードの少なくとも1つの期間を含む十分な作業量を実行します.

|バンド|条件|意味|
| --- | --- | --- |
|高い|受け入れられた吞吐量は `Y` 以上で, p95 コミット遅延度は `0.8 * L` 以下であり,キューは容量の10%未満であり,ビュー変更/回復カウンターは平らである.|部署は要求された作業量に十分なスペースを備えています|
|中間 |受け入れられた吞吐量は `Y`に近い, p95 コミット遅延は `L` 以下の,並列は 50% の容量の以下で安定し,表示変更は稀である.|部署は有効だが 爆破容量は限られている|
|低い|受け入れられた吞吐力は `Y` 以下のもので, p95 コミット遅延は `L` を超え,行走中に排列が増加するか,ビュー変化/バックプレッシャーカウンターは継続的に上昇する.|要求された作業量は,少なくとも1つのボトルネックスを上回る.|

キールールはキュー方向である.提出された TPS が約束された TPS より大きい場合,並びは増加し続けると,短いサンプルが健康に見えても,部署は過重になります.

## ノードカウントとクォーラム {#node-count-and-quorum}

より多くの検証装置は,故障耐性を向上させるが,調整,署名,およびネットワークアウトコストを増加させる. 現在の Sumeragi 実装では:

- 検証者のカウント `n`は,故障予算 `f = floor((n - 1) / 3)` を導き出します.
- `n >= 4` に対して,コミットクォーラムは `2f + 1`
- `n <= 3` に対して,すべての検証者はコミットするために必要である.
- 観測者は同期ブロックを編成するが,投票したり,提案したり,収集したりしない

|検証者|欠陥予算|議決を決定する|容量に関する注意事項|
| --- | --- | --- | --- |
|1〜3 |0 実践的なオフラインスラック|すべての検証者|開発や小テストに役立つ.欠けている検証器は,コミットメントを遅らせる可能性があります |
| 4 | 1 | 3 |単欠許容の共通最小値 |
| 7 | 2 | 5 |より柔軟で 投票と広報のトラフィックが増加する|
| 10 | 3 | 7 |高度な調整コスト ネットワークとコレクターの調節が重要だ |

"Xノード"を評価する際には,投票認証器を観察者から分離します.観測者を追加することは通常,検証器を加えるよりも費用が少なくなりますが,観測者は依然としてブロックゴシップ,ブロック同期,ディスク,およびネットワーク帯域幅を消費しています.

## 業績 に 影響 する 事柄 {#factors-that-influence-performance}

### 作業負荷の形 {#workload-shape}

同じ TPS は,それぞれの取引によって安価または高価である.記録:

- 取引ごとに指示の数
- 署名数とサインアルゴリズム
- トランザクションバイトサイズとデコンプレスされたユーティフルロードサイズ
- 読み書き比
- メタデータサイズと資産運用
- スマート契約,トリガー,および IVM 実行コスト
- 同じ同級者に対して実行するクエリロード

小規模な転送取引は,契約重荷やメタデータ重荷の代弁ではありません.

### 合意のタイミング {#consensus-timing}

Sumeragi のタイミングは,有効な Sumeragi パラメータによって制御される.

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS モードが有効である場合,NPoS 段階のタイムアウト

検査は:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

ネットワーク,ストレージ,および実行層が対応している間のみ遅延を向上させることができる.変更や欠落のペイロード・フィッチ,またはバックプレッシャーが現れると,タイマーの低下は通常パフォーマンスを悪化させます.

### コレクター・ファノート {#collector-fanout}

コレクター設定は,コミット投票がどの程度迅速に収束するかを影響します:

- `sumeragi.collectors.k` どのくらいの高さで投票を集めるか制御する
- `sumeragi.collectors.redundant_send_r`は,地方のタイムアウト後に追加投票を制御します
- `sumeragi.collectors.parallel_topology_fanout`は,コレクターと共にトポロジーを追加する.

フォントアウトの増加は,より大きなまたは信頼性の低いネットワークにおける尾間遅延を減らすことができますが,トラフィックも増加します.これらの値を変更する前に,累積可用性とコレクターテレメトリーを遅延とバックプレッシャーメトリックと比較してください.

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### ネットワーク条件 {#network-conditions}

合意の業績は以下に敏感である:

- RTT 検証者間の
- 緊張感とパケット損失
- ブロック用荷物および RBC パーツの帯域幅
- 地域間の不対称なつながり
- NAT,ピア接続を遅らせるファイアウォール,またはリレー行動

計画規則として,複数の検証者回帰旅行と実行およびディスクコミット時間をカバーするのに十分な遅延予算を設定します. p95ネットワーク RTT が既に望ましい p95コミット遅延に近づいている場合,ターゲットは現実的ではありません.

### 排列と入場制限 {#queues-and-admission-limits}

アドミットとキュー設定は,ペアがどれだけの爆発圧力を吸収できるかを定義します:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- ゲネススのトランザクション制限は,最大署名,指示,バイト,および解圧されたバイト
- p2p 列の上限及び合意入場制限

高い排列容量はしばらくの間過剰な負荷を隠すことができますが,持続的な生産量を増やすことはできません.安定した排列は健康的です.増加する排列は滞り物です.

### ハードウェアと収納 {#hardware-and-storage}

リーダーだけでなく すべての検証者を測る

- CPU 認証,署名検証および実行中の飽和性
- 列,スナップショット,およびアクティブ RBC セッションからのメモリ圧力
- ブロックストレージとスナップショットのディスク書き込み遅延
- ネットワークの送信/受信飽和性
- 作業負荷によって使用された場合,オプションのハードウェア加速設定

最も遅い投票認証器が ネットワークの尾間延期を決定できます

## プロメテウスの信号 {#prometheus-signals}

メトリック名は,ビルドプロフィールと機能セットによって異なります.まずノードで `/metrics` を検査し,その後利用可能なシリーズを囲むダッシュボードを作成します.

一般的な信号は:

|信号|プロメテウスの例 |観るべきもの|
| --- | --- | --- |
|受け入れられた輸出量|`sum(rate(txs{type="accepted"}[5m]))`|安定状態で目標 TPS を満たすか超えなければならない|
|拒否する|`sum(rate(txs{type="rejected"}[5m]))`|試験計画で説明できるはずです|
|遅延を約束する|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))`|遅延予算と p95/p99を比較する|
|列の深さ|`queue_size`, `sumeragi_tx_queue_depth` |負荷のピーク中に制限を保持すべきです|
|列の飽和度|`sumeragi_tx_queue_saturated`|維持された非ゼロ値の平均負荷 |
|変更を表示する|`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |増加する値はタイミング,トポロジー,有用な負荷,またはネットワーク障害を示します |
|メッセージが落下した|`dropped_messages`, `sumeragi_consensus_message_handling_total` |負荷中の減少は通常遅延のピークを説明します|
|RBC 圧力|`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |役に立たない負荷回収や貯蔵のボトルネックスの非ゼロ圧力ポイント |
|議決を決定する|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |登録された署名は迅速に要求される数値に達すべきだ|

メトリックが `/v1/sumeragi/status` にのみ存在する場合,プロメテウススクラップと同じランのアーテファクトで JSON スナップショットを捕まえます.

## 推定ワークフロー {#estimation-workflow}

1. シナリオを定義する
   - 検証者数と観察者の数
   - 合意モード
   - ターゲット TPS
   - p95と p99のコミットメント遅延予算
   - 取引ミックス
   - 予想されるネットワーク RTT, jitter,および帯域幅
2. 効果的な設定を記録する:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. 作業負荷をターゲット TPS に実行する.
4. 走行開始,中期,終了時の状態とメトリックを記録します.
5. 実行を性能帯表で分類する.
6. 帯が中低であれば 1つの要素を1つずつ変更して繰り返す

## 基準報告テンプレート {#benchmark-report-template}

性能番号を再現するのに十分な文脈のみで公開する.

- Iroha コミット,リリース,および特徴の旗
- 検証者と観測者の数
- 合意モードと Sumeragi パラメータ
- コレクター `k`,冗長な送信 `r`,そしてトポロジー・ファヌート
- テレメトリプロフィール
- ハードウェア,ストレージ,および OS の詳細
- ネットワーク RTT,ジッター,損失,および帯域幅の仮定
- 取引ミックスと有用な負荷のサイズ
- 提供された TPS および走行期間
- 受け入れられた/拒否された TPS
- p50/p95/p99 コミット遅延
- 列の深さと飽和度
- RBC 圧力,欠損のペイロードカウンタ
- CPU,メモリ,ディスク,および認証器ごとにネットワーク利用

これらの詳細がなければ, TPS 番号は逸話であると考えられる.

## 関連ページ {#related-pages}

- [](./chaos-testing.md) Izanami で 混沌 テスト
- [Torii エンドポイント](../../reference/torii-endpoints.md)
- [動作する Iroha 3 経由 CLI](../../get-started/operate-iroha-via-cli.md)
- [ピア・コンフィギュレーション参照](../../reference/peer-config/params.md)
